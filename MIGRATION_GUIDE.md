# Guía de Migración - Fase 1

Esta guía explica cómo migrar el código existente para usar las nuevas abstracciones del módulo `core/`.

## 📊 Estado Actual

### ✅ Completado (Fase 1)

- ✅ Estructura de carpetas `core/`
- ✅ `StorageService` - Abstracción de localStorage
- ✅ `Logger` - Sistema de logging centralizado
- ✅ `ErrorHandler` - Manejo de errores unificado
- ✅ `auth.js` - Utilidades de autenticación
- ✅ `ApiClient` - Cliente HTTP unificado
- ✅ `transformers.js` - Transformación de datos

### 🔄 Pendiente (Fase 2)

Migrar archivos existentes para usar las nuevas abstracciones.

## 📝 Archivos que requieren migración

### 1. `services/api.js` - ALTA PRIORIDAD

**Problema:** Tiene su propia implementación de request(), getAuthHeader(), etc.

**Solución:** Refactorizar para usar `ApiClient`.

**Antes (566 líneas):**
```javascript
// Funciones duplicadas
export function getAuthSession() { ... }
export function setAuthSession(session) { ... }
export function getAuthHeader() { ... }
async function request(endpoint, options = {}) { ... }

export const api = {
  register: (data) => request('/auth/register', { ... }),
  login: (data) => request('/auth/login', { ... }),
  // ... más endpoints
};
```

**Después (~150 líneas):**
```javascript
import apiClient from './core/services/ApiClient';
import API from './config';

// Re-exportar utilidades de auth desde core
export { getAuthSession, setAuthSession, clearAuthSession } from './core/utils/auth';

export const api = {
  // Auth endpoints
  register: (data) =>
    apiClient.post('/auth/register', data, {
      auth: false,
      baseUrl: API.AUTH,
    }),

  login: (data) =>
    apiClient.post('/auth/login', data, {
      auth: false,
      baseUrl: API.AUTH,
    }),

  // Founder endpoints
  getMeFounder: () =>
    apiClient.get('/me/founder', { baseUrl: API.MARNEE }),

  // ... más endpoints simplificados
};
```

**Beneficios:**
- ❌ Elimina ~200 líneas de código duplicado
- ✅ Manejo de errores consistente
- ✅ Logging automático
- ✅ Fácil de migrar a React Native

---

### 2. `services/campaignsApi.js` - ALTA PRIORIDAD

**Problema:** Duplica getAuthHeader() y request().

**Antes (200 líneas):**
```javascript
function getAuthHeader() { /* duplicado */ }
const request = async (endpoint, options = {}) => { /* duplicado */ }

export const createCampaign = (data) =>
  request('/campaigns', {
    method: 'POST',
    body: JSON.stringify(data),
  });
```

**Después (50 líneas):**
```javascript
import apiClient from '../core/services/ApiClient';
import API from '../config';

export const createCampaign = (data) =>
  apiClient.post('/campaigns', data, {
    baseUrl: API.MARNEE,
  });

export const getCampaignsByCalendar = (calendarId) =>
  apiClient.get(`/campaigns/calendar/${calendarId}`, {
    baseUrl: API.MARNEE,
  });

// ... resto de endpoints simplificados
```

**Beneficios:**
- ❌ Elimina ~150 líneas de código duplicado
- ✅ Consistencia con otros servicios
- ✅ Manejo de errores automático

---

### 3. `services/brandProfileApi.js` - ALTA PRIORIDAD

**Problema:** Duplica getAuthHeader() y request().

**Solución:** Igual que campaignsApi.js, usar `ApiClient`.

**Reducción estimada:** 200 → 50 líneas

---

### 4. `context/MarneeContext.jsx` - MEDIA PRIORIDAD

**Problema:** Usa localStorage directamente en 15+ lugares.

**Antes:**
```javascript
const [founderId, setFounderId] = useState(() =>
  localStorage.getItem(STORAGE_KEYS.FOUNDER_ID)
);

useEffect(() => {
  if (founderId) {
    localStorage.setItem(STORAGE_KEYS.FOUNDER_ID, founderId);
  }
}, [founderId]);

// ... más localStorage calls
```

**Después:**
```javascript
import storage from '../core/services/StorageService';

const [founderId, setFounderId] = useState(() =>
  storage.getItem(STORAGE_KEYS.FOUNDER_ID)
);

useEffect(() => {
  if (founderId) {
    storage.setItem(STORAGE_KEYS.FOUNDER_ID, founderId);
  }
}, [founderId]);
```

**Cambios necesarios:**
1. Importar `storage` en vez de usar `localStorage`
2. Reemplazar todas las llamadas (15+ ocurrencias)
3. Usar `storage.getItem()` con valores por defecto
4. Beneficio: Manejo de errores automático + preparado para React Native

---

### 5. `guards/RequireAdmin.jsx` - ALTA PRIORIDAD (Seguridad)

**Problema:** Parsea JWT de forma insegura.

**Antes:**
```javascript
import { getAuthSession } from "../services/api";

const payload = JSON.parse(atob(session.token.split('.')[1]));
const role = payload.role || '';
```

**Después:**
```javascript
import { getAuthSession, getUserRole, isAuthenticated } from '../core';

export default function RequireAdmin({ children }) {
  if (!isAuthenticated()) {
    return <Navigate to="/auth" replace />;
  }

  const role = getUserRole();

  if (role !== 'ROLE_ADMIN' && role !== 'ADMIN') {
    console.warn('[RequireAdmin] Access denied. User role:', role);
    return <Navigate to="/app" replace />;
  }

  return children;
}
```

**Beneficios:**
- ✅ Parsing seguro de JWT
- ✅ Validación de expiración automática
- ✅ Código más limpio

---

### 6. Todos los componentes con `console.log` - BAJA PRIORIDAD

**Problema:** Logs dispersos sin contexto ni niveles.

**Ejemplos encontrados:**
- `ChatPage.jsx`: 10+ console.log
- `MarneeContext.jsx`: 15+ console.log
- `api.js`: 5+ console.log/error

**Solución:**
```javascript
import { logger } from '../core';

const log = logger.createContextLogger('ChatPage');

// En vez de:
console.log('[Chat] Loaded', messages.length, 'messages');

// Usar:
log.info('Loaded messages', { count: messages.length });

// En vez de:
console.error('[Chat] Error loading:', error);

// Usar:
log.error('Failed to load messages', error);
```

**Beneficios:**
- ✅ Logs consistentes con timestamp
- ✅ Filtrado por nivel (debug solo en dev)
- ✅ Fácil integración con servicios externos (Sentry, LogRocket)

---

## 🎯 Plan de Migración Recomendado

### Semana 1-2: Servicios API (CRÍTICO)

**Orden de migración:**

1. **`services/api.js`** (2-3 horas)
   - Refactorizar para usar `ApiClient`
   - Probar todos los endpoints
   - Verificar manejo de errores

2. **`services/campaignsApi.js`** (1 hora)
   - Reemplazar implementación custom por `ApiClient`
   - Actualizar imports en componentes que lo usan

3. **`services/brandProfileApi.js`** (1 hora)
   - Mismo proceso que campaignsApi

4. **Otros archivos en `services/`** (2 horas)
   - Verificar y migrar cualquier otro servicio

**Cómo verificar:**
```bash
# Buscar código duplicado de auth
grep -r "getAuthHeader()" src/services/

# Buscar implementaciones custom de request
grep -r "async function request" src/services/

# Debería retornar solo core/services/ApiClient.js
```

### Semana 2: Guards y Auth (CRÍTICO - Seguridad)

5. **`guards/RequireAdmin.jsx`** (30 minutos)
   - Usar utilidades de auth seguras
   - Agregar validación de expiración

6. **Buscar otros usos de JWT parsing** (1 hora)
```bash
grep -r "atob.*split" src/
grep -r "JSON.parse.*atob" src/
```

### Semana 2: Contextos y Estado (IMPORTANTE)

7. **`context/MarneeContext.jsx`** (2-3 horas)
   - Reemplazar localStorage por `storage`
   - Probar flujo completo de la app
   - Verificar que no se pierdan datos

8. **`context/ChatThemeContext.jsx`** (30 minutos)
   - Si usa localStorage, migrarlo

9. **Otros contextos** (1 hora)
   - Revisar y migrar según sea necesario

### Semana 3: Componentes (MEJORA GRADUAL)

10. **Componentes con logging** (Variable)
    - Ir reemplazando console.log gradualmente
    - Empezar por los más problemáticos (ChatPage, etc.)
    - No es urgente, se puede hacer incremental

---

## 🧪 Testing después de migración

### 1. Probar flujo de autenticación
- [ ] Login funciona
- [ ] Registro funciona
- [ ] Logout limpia sesión
- [ ] Redirect a /auth cuando expira sesión
- [ ] Admin guard funciona correctamente

### 2. Probar almacenamiento
- [ ] Datos se persisten correctamente
- [ ] Datos se cargan al refrescar página
- [ ] Clear session limpia todo
- [ ] No hay errores de quota exceeded

### 3. Probar API calls
- [ ] Todos los endpoints funcionan
- [ ] Errores se manejan correctamente
- [ ] Mensajes de error son amigables
- [ ] Logout automático en 401/403

### 4. Verificar consola
- [ ] No hay console.log en producción (opcional)
- [ ] Logs tienen formato consistente
- [ ] Errores se loggean correctamente

---

## 📊 Métricas de éxito

**Antes:**
- `services/api.js`: 566 líneas
- `services/campaignsApi.js`: 200 líneas
- `services/brandProfileApi.js`: 200 líneas
- Código duplicado: ~400 líneas
- Referencias a localStorage: 30+
- JWT parsing inseguro: 2+ lugares

**Después:**
- `services/api.js`: ~150 líneas (-73%)
- `services/campaignsApi.js`: ~50 líneas (-75%)
- `services/brandProfileApi.js`: ~50 líneas (-75%)
- Código duplicado: 0 líneas (-100%)
- Referencias a localStorage: 0 (-100%)
- JWT parsing inseguro: 0 (-100%)

**Total eliminado: ~600 líneas de código duplicado/problemático**

---

## ⚠️ Precauciones

1. **Hacer commits incrementales**
   - No migrar todo de una vez
   - Commit después de cada archivo migrado
   - Facilita rollback si algo falla

2. **Probar en desarrollo primero**
   - Verificar que todo funciona antes de mergear
   - Probar flujos completos (login, chat, calendar)

3. **Backup de localStorage**
   - El usuario podría tener datos en localStorage
   - `StorageService` mantiene compatibilidad, pero probar bien

4. **Mantener API compatible**
   - No cambiar la interfaz pública de `api.js`
   - Los componentes deben seguir funcionando igual

---

## 🚀 Después de la migración

Una vez completada la migración:

1. **Fase 2**: Descomponer componentes monolíticos
2. **Fase 3**: Reestructurar estado global
3. **React Native**: Migración será 10x más fácil
   - Solo cambiar implementación de `StorageService`
   - Todo lo demás funciona igual

---

## 📞 Preguntas Frecuentes

**P: ¿Puedo migrar gradualmente?**
R: Sí, los nuevos módulos coexisten con el código antiguo. Migra archivo por archivo.

**P: ¿Afectará a usuarios actuales?**
R: No, si se hace correctamente. `StorageService` usa las mismas keys de localStorage.

**P: ¿Qué pasa si algo falla?**
R: Haz commits pequeños y frecuentes. Cada archivo migrado es un commit separado.

**P: ¿Cuánto tiempo tomará?**
R: Migración crítica (API services + guards): 8-10 horas
   Migración completa: 15-20 horas

---

## ✅ Checklist de migración

### Alta Prioridad (Hacer YA)
- [ ] Migrar `services/api.js`
- [ ] Migrar `services/campaignsApi.js`
- [ ] Migrar `services/brandProfileApi.js`
- [ ] Migrar `guards/RequireAdmin.jsx`
- [ ] Buscar y eliminar código duplicado de auth

### Media Prioridad (Esta semana)
- [ ] Migrar `context/MarneeContext.jsx`
- [ ] Migrar otros contextos con localStorage
- [ ] Probar flujo completo de la app

### Baja Prioridad (Gradual)
- [ ] Reemplazar console.log por logger
- [ ] Migrar componentes grandes para usar transformers
- [ ] Documentar cambios

---

¿Listo para empezar? Comienza con `services/api.js` - es el más crítico. 🚀
