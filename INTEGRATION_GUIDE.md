# Guía de Integración - Chat Modules

Esta guía te ayudará a integrar los nuevos módulos de Chat en el `ChatPage.jsx` existente.

## 🎯 Objetivo

Reemplazar el monolítico `ChatPage.jsx` (1,148 líneas) con una versión modular que usa los nuevos hooks y componentes.

## 📋 Pasos de Integración

### Paso 1: Backup del archivo original

```bash
cd src/Pages/Tools
cp ChatPage.jsx ChatPage.jsx.backup
```

### Paso 2: Estructura del nuevo ChatPage.jsx

Aquí está el esqueleto completo del nuevo archivo:

```javascript
import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import PageTransition from '../../Component/PageTransition';
import ConversationSidebar from '../../Component/ConversationSidebar';
import QuickActionsBar from '../../Component/QuickActionsBar';
import ExportModal from '../../Component/ExportModal';
import FavoritesModal from '../../Component/FavoritesModal';
import { ChatThemeProvider, useChatTheme } from '../../context/ChatThemeContext';
import { Loader2 } from 'lucide-react';

// Import new modular hooks and components
import {
  useChat,
  useConversations,
  useVoiceRecognition,
  useMessageSearch,
  ChatHeader,
  ChatMessages,
  ChatInput,
} from './Chat';

/**
 * ChatPage - Refactored with modular architecture
 */
function ChatPageContent() {
  const { theme, playSound } = useChatTheme();

  // Core state
  const [founderId, setFounderId] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [input, setInput] = useState('');

  // UI state
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    const saved = localStorage.getItem('sidebar_collapsed');
    return saved === 'true';
  });
  const [isActionsBarCollapsed, setIsActionsBarCollapsed] = useState(() => {
    const saved = localStorage.getItem('actions_bar_collapsed');
    return saved === 'true';
  });
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isFavoritesModalOpen, setIsFavoritesModalOpen] = useState(false);
  const [favoriteMessageIds, setFavoriteMessageIds] = useState(new Set());

  // Save sidebar state
  useEffect(() => {
    localStorage.setItem('sidebar_collapsed', isSidebarCollapsed);
  }, [isSidebarCollapsed]);

  useEffect(() => {
    localStorage.setItem('actions_bar_collapsed', isActionsBarCollapsed);
  }, [isActionsBarCollapsed]);

  // Use conversations hook
  const {
    conversations,
    activeConversationId,
    loadConversations,
    selectConversation,
    createNewConversation,
    deleteConversation,
    updateConversationAfterMessage,
    setActiveConversationId,
  } = useConversations();

  // Use chat hook
  const {
    messages,
    isLoading,
    sendMessage,
    loadMessages,
    clearMessages,
  } = useChat({
    founderId,
    sessionId,
    conversationId: activeConversationId,
    setConversationId: setActiveConversationId,
    playSound,
  });

  // Use voice recognition hook
  const {
    isVoiceMode,
    toggleVoiceMode,
  } = useVoiceRecognition({
    onTranscriptChange: setInput,
    playSound,
  });

  // Use message search hook
  const {
    searchTerm,
    setSearchTerm,
    searchResults,
    currentResultIndex,
    searchResultRefs,
    goToNextResult,
    goToPrevResult,
    clearSearch,
    highlightText,
    isSearchResult,
    isCurrentResult,
  } = useMessageSearch(messages);

  // Initialize on mount
  useEffect(() => {
    const initialize = async () => {
      try {
        console.log('[Chat] Initializing...');

        // 1. Get founder
        const founder = await api.getMeFounder();
        setFounderId(founder.id);
        console.log('[Chat] Founder loaded:', founder.id);

        // 2. Get or create session
        const sessions = await api.getMeSessions();
        const latestSession = sessions && sessions.sessions && sessions.sessions.length > 0
          ? sessions.sessions[0]
          : null;

        if (latestSession) {
          setSessionId(latestSession.id);
          console.log('[Chat] Session loaded:', latestSession.id);
        }

        // 3. Load all conversations
        const convs = await loadConversations();

        // 4. Auto-select most recent conversation
        if (convs.length > 0) {
          const mostRecent = convs[0];
          const conversation = selectConversation(mostRecent.id);

          if (conversation && conversation.messages && conversation.messages.length > 0) {
            loadMessages(conversation.messages);
            console.log('[Chat] Loaded', conversation.messages.length, 'messages from most recent conversation');
          }
        }
      } catch (error) {
        console.error('[Chat] Initialization error:', error);
      } finally {
        setIsInitializing(false);
      }
    };

    initialize();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Handle conversation selection
  const handleSelectConversation = (convId) => {
    const conversation = selectConversation(convId);

    if (conversation) {
      loadMessages(conversation.messages || []);
      setIsSidebarOpen(false);
    }
  };

  // Handle new conversation
  const handleNewConversation = () => {
    createNewConversation();
    clearMessages();
    setIsSidebarOpen(false);
  };

  // Handle delete conversation
  const handleDeleteConversation = async (convId) => {
    try {
      await deleteConversation(convId);

      // If deleted conversation was active, clear messages
      if (convId === activeConversationId) {
        clearMessages();
      }
    } catch (error) {
      console.error('[Chat] Error deleting conversation:', error);
      alert('Failed to delete conversation. Please try again.');
    }
  };

  // Handle quick actions from sidebar
  const handleQuickAction = (actionId) => {
    console.log('[Chat] Quick action triggered:', actionId);

    switch (actionId) {
      case 'ideas':
        setInput('Generate 5 fresh content ideas for this week');
        break;
      case 'calendar':
        setInput('Create a 7-day content calendar');
        break;
      case 'script':
        setInput('Write a script for my next video');
        break;
      case 'analyze':
        setInput('Analyze my current content strategy');
        break;
      case 'resume':
        setInput('Summarize our conversation so far');
        break;
      case 'favorites':
        setIsFavoritesModalOpen(true);
        break;
      case 'export':
        if (messages.length === 0) {
          alert('No messages to export yet!');
          return;
        }
        setIsExportModalOpen(true);
        break;
      default:
        break;
    }
  };

  // Handle copy message
  const handleCopyMessage = (messageId, content) => {
    navigator.clipboard.writeText(content).then(() => {
      // Could show a toast notification here
    }).catch(err => {
      console.error('[Chat] Failed to copy:', err);
      alert('Failed to copy message');
    });
  };

  // Handle toggle favorite
  const handleToggleFavorite = async (messageId) => {
    try {
      const response = await api.toggleMessageFavorite(messageId);

      setFavoriteMessageIds(prev => {
        const newSet = new Set(prev);
        if (response.isFavorite) {
          newSet.add(messageId);
        } else {
          newSet.delete(messageId);
        }
        return newSet;
      });
    } catch (error) {
      console.error('[Chat] Failed to toggle favorite:', error);
      alert('Failed to save favorite');
    }
  };

  // Handle send message
  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const message = input.trim();
    setInput('');

    try {
      await sendMessage(message, updateConversationAfterMessage);
    } catch (error) {
      console.error('[Chat] Send error:', error);
      alert('Failed to send message. Please try again.');
    }
  };

  // Loading state
  if (isInitializing) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#f6f6f6]">
        <div className="text-center">
          <Loader2 className="w-16 h-16 text-[#40086d] animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Initializing Chat...</p>
        </div>
      </div>
    );
  }

  return (
    <PageTransition className={`h-dvh ${theme.background}`}>
      <div className="flex h-full relative">
        {/* Sidebar */}
        <ConversationSidebar
          conversations={conversations}
          activeConversationId={activeConversationId}
          onSelectConversation={handleSelectConversation}
          onNewConversation={handleNewConversation}
          onDeleteConversation={handleDeleteConversation}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />

        {/* Main chat area */}
        <div className="flex-1 flex flex-col h-full backdrop-blur-sm">
          {/* Header */}
          <ChatHeader
            onSidebarToggle={() => setIsSidebarOpen(true)}
            onActionsBarToggle={() => setIsActionsBarCollapsed(!isActionsBarCollapsed)}
            isActionsBarCollapsed={isActionsBarCollapsed}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            onSearchClear={clearSearch}
            searchResults={searchResults}
            currentResultIndex={currentResultIndex}
            onNextResult={goToNextResult}
            onPrevResult={goToPrevResult}
          />

          {/* Messages */}
          <ChatMessages
            messages={messages}
            isLoading={isLoading}
            favoriteMessageIds={favoriteMessageIds}
            searchResultRefs={searchResultRefs}
            isSearchResult={isSearchResult}
            isCurrentResult={isCurrentResult}
            highlightText={highlightText}
            onCopyMessage={handleCopyMessage}
            onToggleFavorite={handleToggleFavorite}
            onSelectPrompt={(prompt) => setInput(prompt)}
          />

          {/* Input */}
          <ChatInput
            input={input}
            onInputChange={setInput}
            onSend={handleSend}
            isLoading={isLoading}
            isVoiceMode={isVoiceMode}
            onVoiceToggle={toggleVoiceMode}
            placeholder="Type your message..."
          />
        </div>

        {/* Quick Actions Bar */}
        <QuickActionsBar
          onAction={handleQuickAction}
          isCollapsed={isActionsBarCollapsed}
          onToggleCollapse={() => setIsActionsBarCollapsed(!isActionsBarCollapsed)}
        />
      </div>

      {/* Modals */}
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        messages={messages}
      />

      <FavoritesModal
        isOpen={isFavoritesModalOpen}
        onClose={() => setIsFavoritesModalOpen(false)}
      />
    </PageTransition>
  );
}

export default function ChatPage() {
  return (
    <ChatThemeProvider>
      <ChatPageContent />
    </ChatThemeProvider>
  );
}
```

### Paso 3: Comparación antes/después

#### Antes (ChatPage.jsx - 1,148 líneas)

```javascript
function ChatPageContent() {
  // 26 estados
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState(null);
  const [founderId, setFounderId] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [currentResultIndex, setCurrentResultIndex] = useState(0);
  const [conversations, setConversations] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => { ... });
  const [isActionsBarCollapsed, setIsActionsBarCollapsed] = useState(() => { ... });
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isFavoritesModalOpen, setIsFavoritesModalOpen] = useState(false);
  const [copiedMessageId, setCopiedMessageId] = useState(null);
  const [hoveredMessageId, setHoveredMessageId] = useState(null);
  const [favoriteMessageIds, setFavoriteMessageIds] = useState(new Set());
  // ... 6 más

  // 9 useEffects con lógica compleja
  useEffect(() => { /* Inicialización - 80 líneas */ }, []);
  useEffect(() => { /* Scroll */ }, [messages]);
  useEffect(() => { /* Búsqueda - 30 líneas */ }, [searchTerm, messages]);
  useEffect(() => { /* Guardar sidebar */ }, [isSidebarCollapsed]);
  // ... 5 más

  // Funciones con lógica compleja (50+ líneas cada una)
  const handleSend = async () => { /* 80 líneas */ };
  const handleVoiceModeToggle = () => { /* 70 líneas */ };
  const updateConversationsAfterMessage = async () => { /* 50 líneas */ };
  const handleSelectConversation = async () => { /* 30 líneas */ };
  // ... muchas más

  // 600+ líneas de JSX
  return (
    <div>
      {/* Header - 100 líneas */}
      {/* Messages - 200 líneas */}
      {/* Input - 80 líneas */}
      {/* Modals - 100 líneas */}
    </div>
  );
}
```

#### Después (ChatPage.jsx - ~300 líneas)

```javascript
function ChatPageContent() {
  // 6 estados principales (UI only)
  const [founderId, setFounderId] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [input, setInput] = useState('');
  const [favoriteMessageIds, setFavoriteMessageIds] = useState(new Set());
  // ... UI states

  // Hooks encapsulan toda la lógica
  const chat = useChat({ founderId, sessionId, ... });
  const convs = useConversations();
  const voice = useVoiceRecognition({ ... });
  const search = useMessageSearch(messages);

  // 1 useEffect simple
  useEffect(() => { initialize(); }, []);

  // Funciones simples (5-15 líneas cada una)
  const handleSend = () => { ... };  // 5 líneas
  const handleQuickAction = (id) => { ... };  // 20 líneas
  const handleCopyMessage = (id, content) => { ... };  // 5 líneas

  // 100 líneas de JSX (componentes modulares)
  return (
    <div>
      <ChatHeader {...search} />
      <ChatMessages {...chat} {...search} />
      <ChatInput {...chat} {...voice} />
    </div>
  );
}
```

**Reducción: 1,148 → ~300 líneas (↓ 74%)**

---

## ✅ Checklist de Integración

### Pre-integración
- [ ] Backup del ChatPage.jsx original
- [ ] Verificar que todos los módulos de Chat/ están creados
- [ ] Revisar imports necesarios

### Durante integración
- [ ] Copiar el nuevo código
- [ ] Verificar que todos los imports existen
- [ ] Ajustar rutas si es necesario
- [ ] Mantener lógica de inicialización original

### Post-integración
- [ ] Comparar funcionalmente con backup
- [ ] Probar todas las features:
  - [ ] Enviar mensajes
  - [ ] Crear nueva conversación
  - [ ] Seleccionar conversación
  - [ ] Eliminar conversación
  - [ ] Búsqueda de mensajes
  - [ ] Navegación de búsqueda
  - [ ] Voz (si disponible)
  - [ ] Copiar mensaje
  - [ ] Favoritos
  - [ ] Exportar
  - [ ] Quick actions
  - [ ] Sidebar collapse
- [ ] Verificar que no hay errores en consola
- [ ] Verificar que estado se persiste correctamente

### Si algo falla
- [ ] Revisar error en consola
- [ ] Comparar con backup
- [ ] Revisar imports
- [ ] Verificar que hooks reciben props correctas

---

## 🐛 Troubleshooting

### Error: "Cannot find module './Chat'"

**Solución:** Verificar que la carpeta `Chat/` está en `src/Pages/Tools/Chat/`

### Error: "playSound is not a function"

**Solución:** Verificar que `ChatThemeProvider` envuelve el componente

### Los mensajes no se envían

**Solución:** Verificar que `founderId` y `sessionId` se cargan correctamente en useEffect

### La búsqueda no funciona

**Solución:** Verificar que `searchResultRefs` se pasa correctamente a ChatMessages

### La voz no funciona

**Solución:**
1. Verificar que el browser soporta Web Speech API
2. Verificar que se otorgaron permisos de micrófono

---

## 📝 Notas Importantes

1. **No eliminar el archivo original todavía**
   - Mantener `ChatPage.jsx.backup` hasta estar 100% seguro

2. **Probar exhaustivamente**
   - Todas las funcionalidades deben seguir funcionando igual

3. **Props correctas**
   - Cada componente necesita sus props específicas
   - Revisar tipos en los archivos individuales

4. **Refs de búsqueda**
   - `searchResultRefs` debe ser un useRef([])
   - Se pasa a ChatMessages para scroll automático

---

## ✨ Siguientes Pasos

Después de integrar exitosamente:

1. **Eliminar código antiguo**
   - Borrar `ChatPage.jsx.backup` (guardar en git primero)

2. **Agregar tests**
   - Testear hooks individualmente
   - Testear componentes con React Testing Library

3. **Optimizar performance**
   - Memoizar componentes si es necesario
   - Usar React.memo en MessageItem si hay lag

4. **Aplicar a otros componentes**
   - CampaignForm.jsx
   - StrategySection.jsx
   - BusinessTestPage.jsx

---

¿Listo para integrar? ¡Empecemos! 🚀
