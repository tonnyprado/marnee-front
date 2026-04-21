# Implementación de Funcionalidades Avanzadas - Guía Completa

## 📊 Estado de Implementación

### ✅ **COMPLETADO:**
1. **QuickActionsBar.jsx** - Sidebar con botones de acciones rápidas
2. **ExportModal.jsx** - Exportar conversación (PDF, Markdown, TXT)
3. **ShareModal.jsx** - Compartir conversación con link
4. **PromptSuggestions.jsx** - Sugerencias de prompts
5. jsPDF instalado para exportar PDF

### 🚧 **PENDIENTE DE INTEGRAR:**
1. Copiar mensaje (función simple)
2. Marcar favoritos (requiere backend)
3. Modo voice (Web Speech API)
4. Búsqueda avanzada con filtros
5. Detección de calendario + botón
6. Integrar todo en ChatPage

---

## 🔧 PASO 1: Backend - Endpoints Necesarios

### **A. Endpoint para Favoritos**

Archivo: `/Users/tonyprado/Documents/Proyectos/DNHub/dnhubAI/app/routers/marnee.py`

```python
@router.post("/api/v1/marnee/message/{message_id}/favorite")
def toggle_favorite_message(
    message_id: str,
    current_user: AuthenticatedUser = Depends(get_current_user)
):
    """Toggle favorite status on a message"""
    if not DB_AVAILABLE:
        raise HTTPException(500, "Database not available")

    # Verify message ownership via conversation
    conversation = db.get_conversation_by_message(message_id)
    if not conversation or not db.verify_conversation_ownership(conversation["id"], current_user.user_id):
        raise HTTPException(403, "Access denied")

    # Toggle favorite
    is_favorite = db.toggle_message_favorite(message_id)

    return {"success": True, "is_favorite": is_favorite}

@router.get("/api/v1/marnee/favorites")
def get_favorite_messages(
    current_user: AuthenticatedUser = Depends(get_current_user)
):
    """Get all favorite messages for user"""
    if not DB_AVAILABLE:
        raise HTTPException(500, "Database not available")

    favorites = db.get_user_favorite_messages(current_user.user_id)
    return {"favorites": favorites}
```

### **B. Endpoint para Compartir Conversación**

```python
@router.post("/api/v1/marnee/conversation/{conversation_id}/share")
def create_share_link(
    conversation_id: str,
    access: str = Body("view", embed=True),  # 'view' or 'private'
    current_user: AuthenticatedUser = Depends(get_current_user)
):
    """Generate shareable link for conversation"""
    if not DB_AVAILABLE:
        raise HTTPException(500, "Database not available")

    if not db.verify_conversation_ownership(conversation_id, current_user.user_id):
        raise HTTPException(403, "Access denied")

    # Generate unique token
    import secrets
    token = secrets.token_urlsafe(32)

    # Store share token with expiration (7 days)
    from datetime import datetime, timedelta
    expires_at = datetime.utcnow() + timedelta(days=7)

    db.create_share_token(
        conversation_id=conversation_id,
        token=token,
        access_type=access,
        expires_at=expires_at,
        created_by=current_user.user_id
    )

    return {"token": token, "expires_at": expires_at.isoformat()}

@router.get("/api/v1/shared/{token}")
def get_shared_conversation(token: str):
    """Access shared conversation via token"""
    if not DB_AVAILABLE:
        raise HTTPException(500, "Database not available")

    share = db.get_share_by_token(token)
    if not share:
        raise HTTPException(404, "Share link not found or expired")

    conversation = db.get_conversation(share["conversation_id"])
    if not conversation:
        raise HTTPException(404, "Conversation not found")

    return {
        "conversation": conversation,
        "access_type": share["access_type"],
        "read_only": True
    }
```

### **C. Funciones de Base de Datos**

Archivo: `/Users/tonyprado/Documents/Proyectos/DNHub/dnhubAI/app/database/repositories.py`

```python
def toggle_message_favorite(message_id: str) -> bool:
    """Toggle favorite status on message. Returns new favorite status."""
    with get_db() as conn:
        with conn.cursor() as cur:
            # Check current status
            cur.execute("""
                SELECT is_favorite FROM chat_messages
                WHERE id = %s
            """, (message_id,))
            result = cur.fetchone()

            if not result:
                return False

            # Toggle
            new_status = not (result.get("is_favorite", False))

            cur.execute("""
                UPDATE chat_messages
                SET is_favorite = %s
                WHERE id = %s
            """, (new_status, message_id))

            conn.commit()
            return new_status

def get_user_favorite_messages(user_id: str) -> List[Dict]:
    """Get all favorite messages for a user"""
    with get_db() as conn:
        with conn.cursor() as cur:
            cur.execute("""
                SELECT cm.*, c.id as conversation_id
                FROM chat_messages cm
                JOIN conversations c ON cm.conversation_id = c.id
                JOIN founders f ON c.founder_id = f.id
                WHERE f.user_id = %s AND cm.is_favorite = TRUE
                ORDER BY cm.created_at DESC
            """, (user_id,))

            favorites = []
            for row in cur.fetchall():
                favorites.append({
                    "id": row["id"],
                    "conversation_id": row["conversation_id"],
                    "role": row["role"],
                    "content": row["content"],
                    "created_at": row["created_at"].isoformat(),
                })
            return favorites

def create_share_token(conversation_id, token, access_type, expires_at, created_by):
    """Create a shareable token for a conversation"""
    with get_db() as conn:
        with conn.cursor() as cur:
            cur.execute("""
                INSERT INTO conversation_shares
                (conversation_id, token, access_type, expires_at, created_by)
                VALUES (%s, %s, %s, %s, %s)
                RETURNING id
            """, (conversation_id, token, access_type, expires_at, created_by))

            conn.commit()
            return cur.fetchone()["id"]

def get_share_by_token(token: str) -> Optional[Dict]:
    """Get share info by token"""
    with get_db() as conn:
        with conn.cursor() as cur:
            cur.execute("""
                SELECT * FROM conversation_shares
                WHERE token = %s AND expires_at > NOW()
            """, (token,))

            row = cur.fetchone()
            if not row:
                return None

            return {
                "id": row["id"],
                "conversation_id": row["conversation_id"],
                "access_type": row["access_type"],
                "expires_at": row["expires_at"].isoformat(),
            }
```

### **D. Migration SQL**

```sql
-- Add is_favorite column to chat_messages
ALTER TABLE chat_messages ADD COLUMN IF NOT EXISTS is_favorite BOOLEAN DEFAULT FALSE;

CREATE INDEX IF NOT EXISTS idx_messages_favorite ON chat_messages(is_favorite) WHERE is_favorite = TRUE;

-- Create conversation_shares table
CREATE TABLE IF NOT EXISTS conversation_shares (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
    token VARCHAR(64) UNIQUE NOT NULL,
    access_type VARCHAR(20) NOT NULL CHECK (access_type IN ('view', 'private')),
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_by UUID REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_shares_token ON conversation_shares(token);
CREATE INDEX idx_shares_conversation ON conversation_shares(conversation_id);
CREATE INDEX idx_shares_expires ON conversation_shares(expires_at);
```

---

## 💻 PASO 2: Frontend - Integración en ChatPage

### **Agregar al api.js:**

```javascript
// src/services/api.js

// Favoritos
toggleMessageFavorite: (messageId) =>
  request(`/marnee/message/${messageId}/favorite`, {
    method: 'POST',
  }),

getFavoriteMessages: () =>
  request('/marnee/favorites'),

// Compartir
createShareLink: (conversationId, accessType = 'view') =>
  request(`/marnee/conversation/${conversationId}/share`, {
    method: 'POST',
    body: JSON.stringify({ access: accessType }),
  }),

getSharedConversation: (token) =>
  request(`/shared/${token}`, {
    auth: false,
  }),
```

### **Integración en ChatPage.jsx:**

```jsx
import QuickActionsBar from '../../Component/QuickActionsBar';
import ExportModal from '../../Component/ExportModal';
import ShareModal from '../../Component/ShareModal';
import PromptSuggestions from '../../Component/PromptSuggestions';

function ChatPageContent() {
  // ... existing state ...

  // New state
  const [favorites, setFavorites] = useState(new Set());
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [isActionsBarCollapsed, setIsActionsBarCollapsed] = useState(false);
  const [recognition, setRecognition] = useState(null);

  // Initialize Speech Recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recog = new SpeechRecognition();
      recog.continuous = false;
      recog.interimResults = false;
      recog.lang = 'en-US';

      recog.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
      };

      recog.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsVoiceActive(false);
      };

      recog.onend = () => {
        setIsVoiceActive(false);
      };

      setRecognition(recog);
    }
  }, []);

  // Handle Quick Actions
  const handleQuickAction = async (actionId) => {
    switch (actionId) {
      case 'ideas':
        setInput('Generate 5 fresh content ideas for this week');
        break;
      case 'calendar':
        setInput('Create a 7-day content calendar for me');
        break;
      case 'script':
        setInput('Write a script for my next video');
        break;
      case 'analyze':
        setInput('Analyze my current content strategy and give me recommendations');
        break;
      case 'resume':
        setInput('Summarize our conversation so far');
        break;
      case 'export':
        setShowExportModal(true);
        break;
      case 'share':
        setShowShareModal(true);
        break;
      case 'voice':
        toggleVoiceMode();
        break;
      default:
        break;
    }
  };

  // Toggle Voice Mode
  const toggleVoiceMode = () => {
    if (!recognition) {
      alert('Speech recognition not supported in your browser');
      return;
    }

    if (isVoiceActive) {
      recognition.stop();
      setIsVoiceActive(false);
    } else {
      recognition.start();
      setIsVoiceActive(true);
    }
  };

  // Copy Message
  const handleCopyMessage = (content) => {
    navigator.clipboard.writeText(content);
    playSound('send'); // Feedback sound
  };

  // Toggle Favorite
  const handleToggleFavorite = async (messageId) => {
    try {
      const response = await api.toggleMessageFavorite(messageId);

      setFavorites(prev => {
        const newFavorites = new Set(prev);
        if (response.is_favorite) {
          newFavorites.add(messageId);
        } else {
          newFavorites.delete(messageId);
        }
        return newFavorites;
      });
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
    }
  };

  // Generate Share Link
  const handleGenerateShareLink = async (conversationId, accessType) => {
    try {
      const response = await api.createShareLink(conversationId, accessType);
      return response;
    } catch (error) {
      console.error('Failed to generate share link:', error);
      throw error;
    }
  };

  // Prompt Suggestion Selected
  const handlePromptSelected = (prompt) => {
    setInput(prompt);
    // Auto-send or let user review
  };

  return (
    <PageTransition className={`h-screen ${theme.background}`}>
      <div className="flex h-full relative">
        {/* Sidebar */}
        {!isSidebarCollapsed && <ConversationSidebar {...} />}

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto">
            {messages.length === 0 ? (
              <PromptSuggestions onSelectPrompt={handlePromptSelected} />
            ) : (
              // Render messages with copy and favorite buttons
              messages.map((msg) => (
                <div key={msg.id} className="message-container">
                  {/* Message content */}

                  {/* Action buttons on hover */}
                  <div className="message-actions">
                    <button onClick={() => handleCopyMessage(msg.content)}>
                      Copy
                    </button>
                    {msg.role === 'assistant' && (
                      <button onClick={() => handleToggleFavorite(msg.id)}>
                        {favorites.has(msg.id) ? 'Unfavorite' : 'Favorite'}
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Input Area */}
          <div className="input-area">
            {/* Voice indicator */}
            {isVoiceActive && (
              <div className="voice-indicator">
                🎤 Listening...
              </div>
            )}

            {/* Input and send button */}
          </div>
        </div>

        {/* Quick Actions Bar */}
        <QuickActionsBar
          onAction={handleQuickAction}
          isVoiceActive={isVoiceActive}
          isCollapsed={isActionsBarCollapsed}
          onToggleCollapse={() => setIsActionsBarCollapsed(!isActionsBarCollapsed)}
        />

        {/* Modals */}
        <ExportModal
          isOpen={showExportModal}
          onClose={() => setShowExportModal(false)}
          conversation={conversationId}
          messages={messages}
        />

        <ShareModal
          isOpen={showShareModal}
          onClose={() => setShowShareModal(false)}
          conversationId={conversationId}
          onGenerateLink={handleGenerateShareLink}
        />
      </div>
    </PageTransition>
  );
}
```

---

## 🗓️ PASO 3: Integración con Calendario

### **Detección de Calendario en Respuesta de Marnee:**

```jsx
// En el mensaje de Marnee, detectar si contiene contenido de calendario
const detectCalendarContent = (content) => {
  // Buscar patrones que indiquen un calendario
  const calendarKeywords = [
    'content calendar',
    'schedule',
    'day 1',
    'week 1',
    'monday',
    'tuesday',
  ];

  return calendarKeywords.some(keyword =>
    content.toLowerCase().includes(keyword)
  );
};

// Componente de botón de calendario
const CalendarButton = ({ onCreateCalendar, content }) => {
  const [isCreating, setIsCreating] = useState(false);

  const handleCreate = async () => {
    setIsCreating(true);
    try {
      // Parsear el contenido y crear calendario
      const calendarData = parseCalendarFromText(content);

      // Llamar API para guardar calendario
      await api.generateCalendar({
        founderId,
        sessionId,
        ...calendarData,
      });

      // Redirigir a página de calendario
      window.location.href = '/app/calendar';
    } catch (error) {
      console.error('Failed to create calendar:', error);
      alert('Failed to create calendar. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={handleCreate}
      disabled={isCreating}
      className="mt-3 px-4 py-2 bg-gradient-to-r from-[#40086d] to-[#2d0550] text-white rounded-xl font-medium shadow-md hover:shadow-lg transition flex items-center gap-2"
    >
      <Calendar className="w-4 h-4" />
      {isCreating ? 'Creating Calendar...' : 'View in Calendar'}
    </motion.button>
  );
};

// En el render del mensaje de Marnee:
{msg.role === 'assistant' && detectCalendarContent(msg.content) && (
  <CalendarButton
    content={msg.content}
    onCreateCalendar={handleCreateCalendar}
  />
)}
```

---

## 🔍 PASO 4: Búsqueda Avanzada

### **Componente de Búsqueda Avanzada:**

```jsx
// src/Component/AdvancedSearch.jsx
import React, { useState } from 'react';

export default function AdvancedSearch({ conversations, onResults }) {
  const [query, setQuery] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [contentType, setContentType] = useState('all'); // all, ideas, scripts, analysis

  const handleSearch = () => {
    let results = conversations.flatMap(conv =>
      conv.messages.map(msg => ({ ...msg, conversationId: conv.id }))
    );

    // Filter by query
    if (query) {
      results = results.filter(msg =>
        msg.content.toLowerCase().includes(query.toLowerCase())
      );
    }

    // Filter by date
    if (dateFrom) {
      results = results.filter(msg =>
        new Date(msg.timestamp) >= new Date(dateFrom)
      );
    }
    if (dateTo) {
      results = results.filter(msg =>
        new Date(msg.timestamp) <= new Date(dateTo)
      );
    }

    // Filter by content type
    if (contentType !== 'all') {
      results = results.filter(msg => {
        const content = msg.content.toLowerCase();
        switch (contentType) {
          case 'ideas':
            return content.includes('idea') || content.includes('content');
          case 'scripts':
            return content.includes('script') || content.includes('video');
          case 'analysis':
            return content.includes('analyz') || content.includes('strategy');
          default:
            return true;
        }
      });
    }

    onResults(results);
  };

  return (
    <div className="p-4 bg-white border-b border-gray-200">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search messages..."
        className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-3"
      />

      <div className="grid grid-cols-3 gap-2">
        <input
          type="date"
          value={dateFrom}
          onChange={(e) => setDateFrom(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
        />
        <input
          type="date"
          value={dateTo}
          onChange={(e) => setDateTo(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
        />
        <select
          value={contentType}
          onChange={(e) => setContentType(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
        >
          <option value="all">All Types</option>
          <option value="ideas">Ideas</option>
          <option value="scripts">Scripts</option>
          <option value="analysis">Analysis</option>
        </select>
      </div>

      <button
        onClick={handleSearch}
        className="mt-3 w-full px-4 py-2 bg-[#40086d] text-white rounded-lg hover:bg-[#2d0550] transition"
      >
        Search
      </button>
    </div>
  );
}
```

---

## 📋 Checklist de Implementación

### **Backend:**
- [ ] Correr migration SQL para agregar columnas
- [ ] Agregar endpoints de favoritos
- [ ] Agregar endpoints de compartir
- [ ] Agregar función de guardar calendario desde chat

### **Frontend:**
- [ ] Integrar QuickActionsBar en ChatPage
- [ ] Agregar funcionalidad de copiar mensaje
- [ ] Agregar funcionalidad de favoritos
- [ ] Implementar modo voice
- [ ] Agregar detección de calendario + botón
- [ ] Integrar búsqueda avanzada
- [ ] Probar todas las funcionalidades

---

## 🚀 Orden de Implementación Recomendado:

1. **Backend Migration** (5 min)
2. **Backend Endpoints** (30 min)
3. **Integrar QuickActionsBar** (15 min)
4. **Copiar mensaje** (10 min)
5. **Favoritos** (20 min)
6. **Export Modal** (ya está)
7. **Share Modal** (ya está)
8. **Modo Voice** (15 min)
9. **Detección de calendario** (20 min)
10. **Búsqueda avanzada** (30 min)

**Tiempo Total Estimado:** 2-3 horas

---

¿Quieres que continúe con la integración completa en ChatPage o prefieres que implemente algo específico primero?
