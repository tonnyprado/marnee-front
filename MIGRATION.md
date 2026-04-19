# Migration Guide - Diana Branch to Main

Este documento describe todos los cambios realizados en la branch `diana-ajustes` para permitir el desarrollo y testing de UI sin dependencia del backend, y cómo integrarlos de vuelta a `main`.

## Resumen de Cambios

La branch `diana-ajustes` incluye datos hardcodeados (mock data) para permitir que Diana trabaje en la UI sin necesitar conexión al backend. Todos los cambios están marcados con comentarios claros y pueden revertirse fácilmente cambiando flags booleanos.

---

## Archivos Nuevos Creados

### 1. Datos Mock (Mock Data)

Estos archivos contienen todos los datos hardcodeados necesarios para el funcionamiento de la aplicación:

#### `/src/mocks/brandProfileMock.js`
- **Propósito**: Datos de perfil de marca (Brand Profile)
- **Contiene**: Assessment, purpose, voice, story, pillars, guidelines recommendations
- **Acción al mergear**: MANTENER - Útil para testing y desarrollo futuro

#### `/src/mocks/campaignsMock.js`
- **Propósito**: Datos de campañas de marketing
- **Contiene**: 4 campañas de ejemplo con tareas, sugerencias AI, y diferentes estados
- **Acción al mergear**: MANTENER - Útil para testing y desarrollo futuro

#### `/src/mocks/trendsMock.js`
- **Propósito**: Datos de tendencias y análisis de mercado
- **Contiene**: Keywords SEO, trending topics, market insights, stats
- **Acción al mergear**: MANTENER - Útil para testing y desarrollo futuro

#### `/src/mocks/strategyMock.js`
- **Propósito**: Datos de estrategia de contenido
- **Contiene**: Smart goals, content pillars, video ideas, publishing calendar, KPIs
- **Acción al mergear**: MANTENER - Útil para testing y desarrollo futuro

---

## Archivos Modificados

### 1. Servicios API

Todos los servicios API fueron modificados para soportar un modo "mock" mediante un flag booleano.

#### `/src/services/brandProfileApi.js`

**Cambios realizados:**
```javascript
// Líneas añadidas al inicio del archivo:
import { mockBrandProfile } from '../mocks/brandProfileMock';
const USE_MOCK_DATA = true; // Set to false to use real API

// Funciones modificadas:
- getBrandProfileByFounder()
- generateBrandProfile()
- regenerateBrandProfileSection()
```

**Patrón implementado:**
```javascript
export const getBrandProfileByFounder = (founderId) => {
  if (USE_MOCK_DATA) {
    return Promise.resolve({ brandProfile: mockBrandProfile });
  }
  return request(`/founder/${founderId}/brand-profile`);
};
```

**Para revertir a backend real:**
```javascript
const USE_MOCK_DATA = false; // Cambiar a false
```

#### `/src/services/campaignsApi.js`

**Cambios realizados:**
```javascript
// Líneas añadidas al inicio del archivo:
import { mockCampaigns } from '../mocks/campaignsMock';
const USE_MOCK_DATA = true; // Set to false to use real API

// Funciones modificadas:
- generateCampaigns()
- getCampaignsByCalendar()
- updateCampaignTask()
- updateCampaign()
```

**Para revertir a backend real:**
```javascript
const USE_MOCK_DATA = false; // Cambiar a false
```

#### `/src/services/trendsApi.js`

**Cambios realizados:**
```javascript
// Líneas añadidas al inicio del archivo:
import { mockTrends } from '../mocks/trendsMock';
const USE_MOCK_DATA = true; // Set to false to use real API

// Funciones modificadas:
- getTrendsByFounder()
- generateTrends()
- regenerateTrendsSection()
```

**Para revertir a backend real:**
```javascript
const USE_MOCK_DATA = false; // Cambiar a false
```

#### `/src/services/strategyApi.js`

**Cambios realizados:**
```javascript
// Líneas añadidas al inicio del archivo:
import { mockStrategy } from '../mocks/strategyMock';
const USE_MOCK_DATA = true; // Set to false to use real API

// Funciones modificadas:
- getStrategyByFounder()
- generateStrategy()
- regenerateStrategySection()
```

**Para revertir a backend real:**
```javascript
const USE_MOCK_DATA = false; // Cambiar a false
```

### 2. Context

#### `/src/context/MarneeContext.jsx`

**Cambios realizados:**
```javascript
// Líneas añadidas después de STORAGE_KEYS:
const USE_MOCK_DATA = true;
const MOCK_FOUNDER_ID = 'diana-test-founder-id';
const MOCK_SESSION_ID = 'diana-test-session-id';
const MOCK_CALENDAR_ID = 'diana-test-calendar-id';

// Estados iniciales modificados para usar valores mock:
const [founderId, setFounderId] = useState(() => {
  if (USE_MOCK_DATA) return MOCK_FOUNDER_ID;
  return localStorage.getItem(STORAGE_KEYS.FOUNDER_ID);
});

const [sessionId, setSessionId] = useState(() => {
  if (USE_MOCK_DATA) return MOCK_SESSION_ID;
  return localStorage.getItem(STORAGE_KEYS.SESSION_ID);
});

const [calendarId, setCalendarId] = useState(() => {
  if (USE_MOCK_DATA) {
    console.log('[MarneeContext] Using mock calendarId:', MOCK_CALENDAR_ID);
    return MOCK_CALENDAR_ID;
  }
  const storedId = localStorage.getItem(STORAGE_KEYS.CALENDAR_ID);
  console.log('[MarneeContext] Initial calendarId from localStorage:', storedId);
  return storedId;
});
```

**Para revertir a backend real:**
```javascript
const USE_MOCK_DATA = false; // Cambiar a false
```

---

## Estrategia de Merge

### Opción 1: Merge Completo con Feature Flag (RECOMENDADO)

Esta opción mantiene todo el código y permite alternar entre modo mock y modo real.

**Pasos:**
1. Hacer merge de `diana-ajustes` a `main`
2. Los archivos mock se mantienen en `/src/mocks/`
3. Cambiar todos los `USE_MOCK_DATA` a `false` en producción
4. Mantener `USE_MOCK_DATA = true` para desarrollo y testing

**Ventajas:**
- Facilita el desarrollo futuro sin backend
- Útil para demos y presentaciones
- Testing de UI más rápido
- No se pierde ningún código

**Desventajas:**
- Código extra en producción (aunque mínimo)

### Opción 2: Merge Selectivo

Esta opción solo integra los cambios de UI y descarta el código mock.

**Pasos:**
1. Crear una nueva branch desde `main`
2. Cherry-pick solo los commits de cambios de UI (NO los de mock)
3. Eliminar la carpeta `/src/mocks/`
4. Revertir los cambios en los servicios API
5. Revertir los cambios en MarneeContext

**Ventajas:**
- Código de producción más limpio
- No hay referencias a datos mock

**Desventajas:**
- Se pierde la funcionalidad de testing sin backend
- Más trabajo manual de merge

### Opción 3: Feature Flag Global (IDEAL PARA EQUIPOS)

Crear un archivo de configuración centralizado para controlar el modo mock.

**Pasos:**
1. Crear `/src/config/featureFlags.js`:
```javascript
export const FEATURE_FLAGS = {
  USE_MOCK_DATA: process.env.REACT_APP_USE_MOCK_DATA === 'true' || false,
};
```

2. Actualizar todos los archivos para usar:
```javascript
import { FEATURE_FLAGS } from '../config/featureFlags';
const USE_MOCK_DATA = FEATURE_FLAGS.USE_MOCK_DATA;
```

3. En producción, asegurar que `REACT_APP_USE_MOCK_DATA` no está definido

**Ventajas:**
- Control centralizado
- Fácil alternar entre modos
- Soporta diferentes entornos (dev, staging, prod)

---

## Checklist para Merge a Producción

- [ ] Revisar todos los cambios en `diana-ajustes`
- [ ] Decidir estrategia de merge (Opción 1, 2, o 3)
- [ ] Si se mantiene mock data:
  - [ ] Cambiar `USE_MOCK_DATA = false` en todos los servicios API
  - [ ] Cambiar `USE_MOCK_DATA = false` en MarneeContext
  - [ ] Verificar que no hay referencias hardcoded a IDs mock
- [ ] Si se elimina mock data:
  - [ ] Eliminar carpeta `/src/mocks/`
  - [ ] Revertir cambios en servicios API
  - [ ] Revertir cambios en MarneeContext
- [ ] Testing completo con backend real
- [ ] Verificar que todas las features funcionan correctamente
- [ ] Actualizar documentación si es necesario

---

## Testing Post-Merge

### Con Backend Real (USE_MOCK_DATA = false)

1. **Brand Profile Section:**
   - [ ] Cargar perfil existente
   - [ ] Generar nuevo perfil
   - [ ] Regenerar secciones individuales
   - [ ] Verificar que los datos se guardan correctamente

2. **Campaigns Section:**
   - [ ] Listar campañas
   - [ ] Generar campañas con AI
   - [ ] Actualizar estado de tareas
   - [ ] Guardar notas
   - [ ] Verificar filtros

3. **Trends Section:**
   - [ ] Cargar tendencias
   - [ ] Generar tendencias con AI
   - [ ] Regenerar secciones
   - [ ] Verificar datos actualizados

4. **Strategy Section:**
   - [ ] Cargar estrategia
   - [ ] Generar estrategia con AI
   - [ ] Regenerar secciones individuales
   - [ ] Verificar KPIs y calendarios

### Con Mock Data (USE_MOCK_DATA = true)

1. **Verificar que todas las secciones muestran datos**
2. **Verificar que los botones "Generate with AI" funcionan**
3. **Verificar que los botones "Regenerate" funcionan**
4. **Verificar que la navegación entre tabs funciona**

---

## Contacto y Soporte

Si tienes dudas sobre el merge o necesitas ayuda:
1. Revisa este documento completo
2. Revisa los comentarios en el código (buscar "HARDCODED MODE")
3. Consulta con el equipo de desarrollo

---

## Notas Importantes

1. **IDs Mock**: Los IDs mock son:
   - Founder ID: `diana-test-founder-id`
   - Session ID: `diana-test-session-id`
   - Calendar ID: `diana-test-calendar-id`

2. **Delays Simulados**: Las funciones mock tienen delays (500ms-2000ms) para simular llamadas a API reales

3. **Persistencia**: Los datos mock NO persisten entre recargas. Cada vez que se recarga la página, se vuelven a cargar los datos mock originales

4. **Actualizaciones**: Los cambios en campañas y tareas se simulan localmente pero NO se persisten

---

## Historial de Cambios

- **2026-04-18**: Creación inicial de branch `diana-ajustes`
  - Implementación de mock data para todos los servicios
  - Modificación de contextos para usar valores por defecto
  - Creación de este documento de migración

---

## Conclusión

Esta branch permite desarrollo rápido de UI sin dependencias del backend. El diseño modular con flags permite fácil integración a `main` eligiendo mantener o eliminar la funcionalidad mock según las necesidades del proyecto.

**Recomendación Final**: Usar **Opción 1** (Merge Completo con Feature Flag) para mantener flexibilidad y facilitar desarrollo futuro.
