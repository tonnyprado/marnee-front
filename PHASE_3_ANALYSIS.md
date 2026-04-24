# Fase 3: Análisis de Estado Actual

## 📊 Contextos Existentes

### 1. MarneeContext.jsx (259 líneas)

**Responsabilidades actuales:**
```javascript
{
  // Session
  founderId, sessionId, conversationId,

  // Calendar
  calendarId, calendar,

  // Messages
  messages, welcomeMessage,

  // Steps
  currentStep, stepName,

  // Methods
  initSession, addMessage, loadConversation, clearSession, ...
}
```

**Problemas:**
- ❌ Demasiadas responsabilidades (session + messages + calendar + steps)
- ❌ Mezcla estado de diferentes features
- ⚠️ Ya usa StorageService ✅ pero arquitectura necesita mejora
- ⚠️ Algunos datos ya están en hooks (useChat, useConversations)

---

### 2. ChatThemeContext.jsx (153 líneas)

**Responsabilidades:**
```javascript
{
  theme,           // Current theme object
  currentTheme,    // Theme ID
  changeTheme,     // Change theme function
  soundEnabled,    // Sound on/off
  toggleSound,     // Toggle sound
  playSound,       // Play sound function
}
```

**Problemas:**
- ❌ Usa `localStorage` directo (líneas 57, 62, 67, 71)
- ✅ Responsabilidad clara (solo tema + sonidos)
- ✅ Bien estructurado
- 🔧 Necesita: Migrar a StorageService

---

### 3. LanguageContext.jsx (70 líneas)

**Responsabilidades:**
```javascript
{
  language,        // Current language code
  setLanguage,     // Change language
  languages,       // Available languages
  t,               // Translation function
}
```

**Problemas:**
- ❌ Usa `localStorage` directo (líneas 9, 34)
- ✅ Responsabilidad clara (solo i18n)
- ✅ Bien estructurado
- 🔧 Necesita: Migrar a StorageService

---

## 🎯 Problemas Identificados

### 1. MarneeContext: Demasiado Acoplado

**Estado actual:**
```
MarneeContext
├── Session (founderId, sessionId)
├── Conversation (conversationId, messages)
├── Calendar (calendarId, calendar)
└── Steps (currentStep, stepName)
```

**Problema:** Todo en un solo contexto

**Solución:** Separar responsabilidades

---

### 2. localStorage Directo en 2 Contextos

**ChatThemeContext:**
```javascript
// ❌ Líneas 57-58, 62-63, 67-68, 71-72
const saved = localStorage.getItem('chat_theme');
localStorage.setItem('chat_theme', currentTheme);
```

**LanguageContext:**
```javascript
// ❌ Líneas 9, 34
const stored = localStorage.getItem(STORAGE_KEY);
localStorage.setItem(STORAGE_KEY, language);
```

**Solución:** Usar `StorageService` de core

---

### 3. Duplicación con Hooks

**MarneeContext maneja:**
- Messages → Ya hay `useChat` hook
- Conversations → Ya hay `useConversations` hook

**Problema:** Duplicación de responsabilidad

**Solución:** Decidir dónde vive cada dato

---

## 💡 Propuesta de Nueva Arquitectura

### Opción A: Contextos Especializados (Recomendada)

```
├── AuthContext                  ← NUEVO
│   ├── user                     (User object from backend)
│   ├── founderId
│   ├── sessionId
│   ├── isAuthenticated
│   └── logout()
│
├── AppStateContext              ← SIMPLIFICADO (rename MarneeContext)
│   ├── currentStep
│   ├── stepName
│   └── updateStep()
│
├── ChatThemeContext             ← MIGRADO
│   └── (usa StorageService)
│
└── LanguageContext              ← MIGRADO
    └── (usa StorageService)
```

**Hooks independientes (ya existen):**
- `useChat` - Maneja messages y chat logic
- `useConversations` - Maneja conversations CRUD
- `useVoiceRecognition` - Maneja voz
- `useMessageSearch` - Maneja búsqueda

**Ventajas:**
- ✅ Separación clara de responsabilidades
- ✅ Contextos pequeños y enfocados
- ✅ Hooks manejan lógica compleja
- ✅ Fácil de testear
- ✅ No hay duplicación

**Desventajas:**
- Más contextos (4 en vez de 3)
- Más providers en App.jsx

---

### Opción B: Contexto Global Único (No recomendada)

```
AppContext (un solo contexto)
├── auth: { user, founderId, sessionId }
├── app: { currentStep, stepName }
├── theme: { ... }
└── language: { ... }
```

**Ventajas:**
- Solo un provider

**Desventajas:**
- ❌ Re-renders innecesarios
- ❌ Difícil de mantener
- ❌ No escalable

---

## 📋 Plan de Implementación (Opción A)

### Paso 1: Crear AuthContext
```javascript
// src/context/AuthContext.jsx
{
  user: null | User,
  founderId: string | null,
  sessionId: string | null,
  isAuthenticated: boolean,
  login: (session) => void,
  logout: () => void,
}
```

**Responsabilidad:** Solo autenticación y sesión del usuario

---

### Paso 2: Simplificar MarneeContext → AppStateContext
```javascript
// src/context/AppStateContext.jsx (rename)
{
  currentStep: number,
  stepName: string,
  updateStep: (step) => void,
}
```

**Responsabilidad:** Solo estado global de la app (no session, no messages, no calendar)

**Qué eliminar:**
- ❌ founderId, sessionId → Mover a AuthContext
- ❌ messages, conversationId → Ya está en useChat hook
- ❌ calendar, calendarId → Ya está en useCalendar hook (o crear uno)

---

### Paso 3: Migrar ChatThemeContext
```javascript
// src/context/ChatThemeContext.jsx
import storage from '../core/services/StorageService';

const [currentTheme, setCurrentTheme] = useState(() =>
  storage.getItem('chat_theme', 'classic')
);

useEffect(() => {
  storage.setItem('chat_theme', currentTheme);
}, [currentTheme]);
```

**Cambios:** Solo reemplazar localStorage → storage

---

### Paso 4: Migrar LanguageContext
```javascript
// src/context/LanguageContext.jsx
import storage from '../core/services/StorageService';

function getStoredLanguage() {
  const stored = storage.getItem(STORAGE_KEY);
  // ...
}

useEffect(() => {
  storage.setItem(STORAGE_KEY, language);
}, [language]);
```

**Cambios:** Solo reemplazar localStorage → storage

---

## 🔄 Migración de Componentes

### Antes (ChatPage example)
```javascript
import { useMarnee } from '../context/MarneeContext';

const { founderId, sessionId, messages, setMessages } = useMarnee();
```

### Después
```javascript
import { useAuth } from '../context/AuthContext';
import { useChat } from './Chat';

const { founderId, sessionId } = useAuth();
const { messages, sendMessage } = useChat({ founderId, sessionId });
```

**Ventajas:**
- Separación clara de responsabilidades
- Hooks manejan lógica, contextos solo estado global

---

## 📊 Comparación Before/After

### Before

```
MarneeContext (259 líneas)
├── founderId
├── sessionId
├── conversationId
├── messages (array)
├── calendar (object)
├── calendarId
├── currentStep
└── 15+ methods

ChatThemeContext (153 líneas)
└── localStorage directo

LanguageContext (70 líneas)
└── localStorage directo
```

**Problemas:**
- MarneeContext demasiado grande
- localStorage directo en 2 lugares
- Duplicación con hooks

---

### After (Propuesta)

```
AuthContext (~80 líneas)
├── user
├── founderId
├── sessionId
└── login/logout methods

AppStateContext (~50 líneas)
├── currentStep
├── stepName
└── updateStep

ChatThemeContext (~150 líneas)
└── usa StorageService ✅

LanguageContext (~70 líneas)
└── usa StorageService ✅
```

**Hooks (ya existen):**
- useChat - messages
- useConversations - conversations
- useCalendar - calendar (crear si no existe)

**Ventajas:**
- ✅ Responsabilidades claras
- ✅ Sin duplicación
- ✅ StorageService everywhere
- ✅ React Native ready

---

## ⚡ Decisión Recomendada

**Ir con Opción A**: Contextos especializados + Hooks

**Razones:**
1. Separación clara de responsabilidades
2. Fácil de testear
3. Escalable
4. Sigue principio de Single Responsibility
5. Aprovecha hooks ya creados

**Orden de implementación:**
1. ✅ Migrar ChatThemeContext (15 min)
2. ✅ Migrar LanguageContext (10 min)
3. ✅ Crear AuthContext (30 min)
4. ✅ Simplificar MarneeContext → AppStateContext (45 min)
5. ✅ Actualizar componentes que usan estos contextos (30 min)

**Total estimado: 2 horas**

---

¿Procedemos con esta arquitectura?
