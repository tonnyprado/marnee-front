# Core Module Documentation

Este módulo contiene las abstracciones fundamentales de la aplicación que facilitan la migración a React Native y mejoran la mantenibilidad del código.

## 📁 Estructura

```
core/
├── services/
│   ├── StorageService.js    # Abstracción de almacenamiento
│   ├── ApiClient.js          # Cliente HTTP unificado
│   └── ErrorHandler.js       # Manejo centralizado de errores
├── utils/
│   ├── logger.js             # Sistema de logging
│   ├── auth.js               # Utilidades de autenticación
│   └── transformers.js       # Transformación de datos
└── index.js                  # Exportaciones centralizadas
```

## 🔧 Servicios

### StorageService

Abstracción de `localStorage` que facilita la migración a React Native (AsyncStorage).

**Características:**
- Type-safe get/set operations
- Serialización/deserialización automática JSON
- Manejo de errores con valores por defecto
- Validación de límite de tamaño
- Soporte para operaciones múltiples

**Uso:**

```javascript
import { storage } from '@/core';

// Guardar datos
storage.setItem('user_preferences', { theme: 'dark', language: 'es' });

// Obtener datos con valor por defecto
const prefs = storage.getItem('user_preferences', { theme: 'light' });

// Verificar existencia
if (storage.hasItem('auth_token')) {
  // ...
}

// Operaciones múltiples
storage.setMultiple({
  'key1': 'value1',
  'key2': 'value2'
});

// Limpiar
storage.removeItem('key');
storage.clear(); // Limpia todo
```

### ApiClient

Cliente HTTP unificado que reemplaza todas las implementaciones duplicadas de `request()`.

**Características:**
- Inyección automática de headers de autenticación
- Manejo centralizado de errores
- Logging de requests/responses
- Timeout configurable
- Soporte para múltiples base URLs
- Métodos convenientes (get, post, put, delete)

**Uso:**

```javascript
import { apiClient } from '@/core';
import API from '@/config';

// GET request
const user = await apiClient.get('/users/me', {
  baseUrl: API.AUTH
});

// POST request
const result = await apiClient.post('/campaigns', {
  name: 'Campaign 1',
  description: 'Test'
}, {
  baseUrl: API.MARNEE,
  debug: true
});

// Request sin autenticación
const data = await apiClient.get('/public/data', {
  auth: false
});

// Upload de archivo
const formData = new FormData();
formData.append('file', file);
await apiClient.upload('/upload', formData, {
  baseUrl: API.MARNEE
});

// Método request genérico
await apiClient.request('/endpoint', {
  method: 'PUT',
  body: { data: 'value' },
  baseUrl: API.MARNEE,
  headers: { 'X-Custom': 'header' },
  debug: true,
  timeout: 10000
});
```

### ErrorHandler

Manejo centralizado de errores con categorización y eventos globales.

**Características:**
- Categorización de errores (NETWORK, AUTH, VALIDATION, etc.)
- Eventos globales de error
- Manejo automático de errores de autenticación
- Mensajes amigables al usuario
- Integración con sistema de logging

**Uso:**

```javascript
import { errorHandler, ErrorTypes, AppError } from '@/core';

// Configurar callback para errores de auth
errorHandler.setAuthErrorCallback(() => {
  // Limpiar datos locales, redirigir, etc.
});

// El ApiClient usa ErrorHandler automáticamente,
// pero puedes usarlo manualmente:

try {
  // ... operación
} catch (error) {
  const appError = errorHandler.handleGenericError(error, 'MyComponent');
  throw appError;
}

// Emitir error global
errorHandler.emitGlobalError('Algo salió mal');

// Escuchar errores
errorHandler.addErrorListener((error) => {
  console.log('Error occurred:', error);
});
```

## 🛠️ Utilidades

### Logger

Sistema de logging con niveles y contextos.

**Características:**
- Múltiples niveles (debug, info, warn, error)
- Contextos/namespaces
- Configuración por ambiente
- Timestamps automáticos
- Logging contextual

**Uso:**

```javascript
import { logger } from '@/core';

// Logging directo
logger.debug('ApiClient', 'Making request', { url: '/api/users' });
logger.info('Auth', 'User logged in', { userId: '123' });
logger.warn('Storage', 'Quota almost exceeded');
logger.error('Network', 'Connection failed', error);

// Logger contextual (recomendado para clases/módulos)
const log = logger.createContextLogger('MyComponent');
log.debug('Component mounted');
log.error('Failed to load data', error);

// Configurar nivel
logger.setLevel('warn'); // solo warnings y errors en producción

// Agrupar logs
logger.group('Complex Operation');
logger.debug('Step 1');
logger.debug('Step 2');
logger.groupEnd();

// Tablas (útil para arrays de objetos)
logger.table([
  { id: 1, name: 'Item 1' },
  { id: 2, name: 'Item 2' }
]);
```

### Auth Utilities

Utilidades de autenticación que reemplazan código duplicado.

**Características:**
- Gestión de sesiones
- Decodificación segura de JWT
- Verificación de roles
- Validación de expiración
- Generación de headers

**Uso:**

```javascript
import {
  getAuthSession,
  setAuthSession,
  clearAuthSession,
  isAuthenticated,
  getAuthHeader,
  getUserRole,
  hasRole,
  isAdmin,
  isTokenExpired,
  decodeJWT
} from '@/core';

// Gestión de sesión
const session = getAuthSession(); // { token: '...', type: 'Bearer' }
setAuthSession({ token: 'xyz', type: 'Bearer' });
clearAuthSession();

// Verificación
if (isAuthenticated()) {
  // Usuario autenticado
}

if (isAdmin()) {
  // Usuario es admin
}

if (hasRole('EDITOR')) {
  // Usuario tiene rol específico
}

// Headers
const headers = getAuthHeader(); // { Authorization: 'Bearer token' }

// JWT
const payload = decodeJWT(token);
const role = getUserRole();
const expired = isTokenExpired();
```

### Transformers

Transformación de datos entre formatos API y UI.

**Características:**
- Conversión de mensajes API ↔ UI
- Formateo de fechas
- Sanitización de input
- Utilidades de texto
- Query strings
- Debounce/throttle

**Uso:**

```javascript
import {
  transformMessageToUI,
  transformMessageToAPI,
  transformMessagesToUI,
  formatDate,
  formatTime,
  formatDateTime,
  getRelativeTime,
  sanitizeInput,
  truncateText,
  parseQueryString,
  buildQueryString,
  deepClone,
  debounce,
  throttle,
  generateUniqueId
} from '@/core';

// Transformación de mensajes
const uiMessage = transformMessageToUI({
  id: '1',
  role: 'assistant',
  content: 'Hola',
  createdAt: '2024-01-01T10:00:00Z'
});
// => { id: '1', from: 'ai', text: 'Hola', timestamp: '...' }

const apiMessage = transformMessageToAPI({
  from: 'user',
  text: 'Hola'
});
// => { role: 'user', content: 'Hola' }

// Fechas
formatDate(new Date()); // "1 ene 2024"
formatTime(new Date()); // "10:30"
formatDateTime(new Date()); // "1 ene 2024, 10:30"
getRelativeTime(new Date(Date.now() - 3600000)); // "Hace 1 hora"

// Texto
sanitizeInput('<script>alert("xss")</script>'); // Previene XSS
truncateText('Very long text...', 20); // "Very long text..."

// Query strings
const params = parseQueryString('?foo=bar&baz=qux');
const query = buildQueryString({ foo: 'bar', baz: 'qux' });

// Utilidades
const id = generateUniqueId();
const cloned = deepClone(originalObject);

// Performance
const debouncedFn = debounce(() => { /* ... */ }, 500);
const throttledFn = throttle(() => { /* ... */ }, 1000);
```

## 🔄 Migración desde código antiguo

### Reemplazar localStorage directo

**Antes:**
```javascript
localStorage.setItem('key', JSON.stringify(value));
const value = JSON.parse(localStorage.getItem('key'));
```

**Después:**
```javascript
import { storage } from '@/core';

storage.setItem('key', value);
const value = storage.getItem('key');
```

### Reemplazar request() duplicado

**Antes (en cada archivo de servicio):**
```javascript
function getAuthHeader() { /* ... código duplicado ... */ }
async function request(endpoint, options) { /* ... código duplicado ... */ }
```

**Después:**
```javascript
import { apiClient } from '@/core';
import API from '@/config';

// Usar directamente
const data = await apiClient.get('/endpoint', { baseUrl: API.MARNEE });
```

### Reemplazar JWT parsing inseguro

**Antes:**
```javascript
const payload = JSON.parse(atob(token.split('.')[1]));
const role = payload.role;
```

**Después:**
```javascript
import { getUserRole, decodeJWT } from '@/core';

const role = getUserRole();
// o
const payload = decodeJWT(token);
```

### Reemplazar console.log

**Antes:**
```javascript
console.log('[MyComponent] User loaded:', user);
console.error('[MyComponent] Error:', error);
```

**Después:**
```javascript
import { logger } from '@/core';

const log = logger.createContextLogger('MyComponent');
log.info('User loaded', user);
log.error('Error occurred', error);
```

## 📱 Preparación para React Native

Todos estos módulos están diseñados para facilitar la migración:

1. **StorageService**: Solo necesitas cambiar la implementación interna a AsyncStorage
2. **ApiClient**: Funciona igual en React Native
3. **Auth**: Compatible con AsyncStorage
4. **Logger**: Compatible con React Native
5. **Transformers**: Funciones puras, 100% compatibles

## ✅ Próximos pasos

1. Migrar archivos existentes para usar estas abstracciones
2. Actualizar `services/api.js` para usar `ApiClient`
3. Actualizar `context/MarneeContext.jsx` para usar `storage`
4. Actualizar componentes para usar `logger` en vez de `console.log`
5. Remover código duplicado en servicios

## 🤝 Contribuyendo

Al agregar nuevas funcionalidades:

1. **NO** uses `localStorage` directamente - usa `storage`
2. **NO** uses `console.log` - usa `logger`
3. **NO** dupliques lógica de request - usa `apiClient`
4. **NO** parsees JWT manualmente - usa utilidades de `auth`
5. **SÍ** agrega nuevas utilidades aquí si son reutilizables
