# Event Deduplication Flow - Documentación Técnica

## 🎯 Objetivo

Evitar que los eventos se cuenten dos veces cuando se rastrean desde el **Frontend (Pixel)** y el **Backend (Conversions API)** simultáneamente.

---

## 🔄 Flujo Completo - Registro de Usuario

### 1. Usuario Completa Formulario
```
Usuario en AuthPage.jsx → Llena formulario → Click en "Sign Up"
```

### 2. Frontend Genera Event ID
```javascript
// AuthPage.jsx - handleSubmit()
const eventName = "CompleteRegistration";
const eventId = `completeregistration_${form.email}_${Date.now()}`;
// Ejemplo: "completeregistration_user@test.com_1715530800000"
```

### 3. Frontend Envía Request al Backend
```javascript
// api.js - register()
const payload = {
  name: "John Doe",
  email: "user@test.com",
  password: "SecurePass123",
  fbEventId: "completeregistration_user@test.com_1715530800000"  // ← Event ID incluido
};

const response = await apiClient.post('/auth/register', payload);
```

### 4. Backend Recibe Request
```java
// AuthController.java
@PostMapping("/register")
public ResponseEntity<AuthResponse> register(
    @Valid @RequestBody RegisterRequest request,  // ← Contiene fbEventId
    HttpServletRequest httpRequest
) {
    return ResponseEntity.ok(authService.register(request, httpRequest));
}
```

### 5. Backend Procesa Registro
```java
// AuthService.java - register()
// ... crea usuario en BD ...

// Track con Conversions API usando el Event ID del frontend
facebookConversionsAPI.trackCompleteRegistration(
    user.getEmail(),
    user.getId().toString(),
    user.getName(),
    getClientIp(httpRequest),
    httpRequest.getHeader("User-Agent"),
    request.getFbEventId()  // ← "completeregistration_user@test.com_1715530800000"
);
```

### 6. Backend Envía Evento a Facebook
```java
// FacebookConversionsAPIService.java
POST https://graph.facebook.com/v22.0/1750003469491396/events

{
  "data": [{
    "event_name": "CompleteRegistration",
    "event_time": 1715530800,
    "event_id": "completeregistration_user@test.com_1715530800000",  // ← Event ID
    "user_data": {
      "em": "hashed_email",
      "external_id": "hashed_user_id",
      "client_ip_address": "192.168.1.1",
      "client_user_agent": "Mozilla/5.0..."
    },
    "custom_data": {
      "content_name": "User Registration",
      "status": "completed"
    }
  }]
}
```

### 7. Backend Responde al Frontend
```javascript
// AuthPage.jsx recibe response
const response = {
  token: "jwt_token_here",
  userId: "123",
  email: "user@test.com",
  name: "John Doe",
  role: "USER"
};
```

### 8. Frontend Rastrea con Pixel
```javascript
// AuthPage.jsx - después de response exitoso
trackCompleteRegistration({
  email: response.email,
  name: response.name,
  userId: response.userId
}, eventId);  // ← Mismo event ID: "completeregistration_user@test.com_1715530800000"
```

### 9. Pixel Envía Evento a Facebook
```javascript
// facebookPixel.js - trackEvent()
window.fbq('track', 'CompleteRegistration', {
  content_name: 'User Registration',
  status: 'completed',
  userId: '123',
  email: 'user@test.com',
  name: 'John Doe',
  eventID: 'completeregistration_user@test.com_1715530800000'  // ← Event ID
});
```

### 10. Facebook Deduplica
```
Facebook recibe 2 eventos con el mismo event_id:

Evento 1 (Server):
- Source: Conversions API
- event_id: "completeregistration_user@test.com_1715530800000"
- event_time: 1715530800

Evento 2 (Browser):
- Source: Facebook Pixel
- event_id: "completeregistration_user@test.com_1715530800000"
- event_time: ~1715530800 (muy cercano)

Resultado: Facebook cuenta SOLO 1 evento ✅
```

---

## 🔄 Flujo Completo - Login de Usuario

Sigue el mismo patrón pero con `event_name: "Login"`:

```javascript
// 1. Frontend genera
const eventId = `login_${form.email}_${Date.now()}`;

// 2. Frontend envía al backend
await api.login({ email, password, fbEventId: eventId });

// 3. Backend usa el mismo ID
facebookConversionsAPI.trackLogin(email, userId, ip, userAgent, request.getFbEventId());

// 4. Frontend rastrea con Pixel
trackLogin(response.userId, eventId);

// 5. Facebook deduplica automáticamente
```

---

## 📋 Archivos Modificados

### Frontend

1. **src/services/facebookPixel.js**
   - `generateEventId()` - Genera IDs únicos
   - `trackEvent()` - Acepta y usa `eventId` parámetro
   - `trackCompleteRegistration()` - Retorna event ID
   - `trackLogin()` - Retorna event ID

2. **src/services/api.js**
   - `register()` - Acepta `fbEventId` en payload
   - `login()` - Acepta `fbEventId` en payload

3. **src/Pages/AuthPage.jsx**
   - Genera `eventId` ANTES de request
   - Envía `fbEventId` al backend
   - Usa mismo `eventId` para Pixel tracking

### Backend Java (dnhub-auth)

1. **dto/RegisterRequest.java**
   - Añadido campo: `private String fbEventId;`

2. **dto/LoginRequest.java**
   - Añadido campo: `private String fbEventId;`

3. **service/AuthService.java**
   - Pasa `request.getFbEventId()` a FacebookConversionsAPI

4. **service/FacebookConversionsAPIService.java**
   - `trackCompleteRegistration()` - Acepta y usa `fbEventId`
   - `trackLogin()` - Acepta y usa `fbEventId`

### Backend Python (dnhubAI)

1. **app/services/facebook_conversions_api.py**
   - `track_complete_registration()` - Acepta `event_id` parámetro
   - `track_login()` - Acepta `event_id` parámetro
   - Ya estaba implementado ✅

---

## 🔍 Debugging - Cómo Verificar

### 1. Consola del Navegador
```javascript
// Busca en console.log:
[FB Pixel] Event tracked: CompleteRegistration {
  content_name: "User Registration",
  eventID: "completeregistration_user@test.com_1715530800000"
}
```

### 2. Logs del Backend Java
```
[Facebook Conversions API] Event sent successfully: CompleteRegistration | Response: {...}
```

### 3. Facebook Pixel Helper (Chrome Extension)
- Instala: https://chrome.google.com/webstore/detail/facebook-pixel-helper/
- Verás el evento con su `event_id`
- Aparece icono verde si todo está correcto

### 4. Facebook Events Manager
```
1. Ve a: https://business.facebook.com/events_manager2/
2. Selecciona Pixel: 1750003469491396
3. Click en "Test Events"
4. Haz login/registro en tu app
5. Verás 2 eventos con el MISMO event_id:
   - browser (Pixel)
   - server (Conversions API)
6. En "Overview" solo se contará 1 evento total
```

---

## ⚙️ Configuración Requerida

### Frontend
```bash
# No requiere configuración adicional
# El Pixel ID ya está hardcoded: 1750003469491396
```

### Backend Java
```bash
# .env o application.yml
META_PIXEL_ID=1750003469491396
META_APP_ID=3636329549838537
META_APP_SECRET=836d66edaaadb5ffa62a245824e74f07
FACEBOOK_CONVERSIONS_ENABLED=true
```

### Backend Python
```bash
# .env
META_PIXEL_ID=1750003469491396
META_APP_ID=3636329549838537
META_APP_SECRET=836d66edaaadb5ffa62a245824e74f07
```

---

## 🎯 Resultados Esperados

### Sin Deduplicación (antes)
```
Usuario se registra
→ Pixel rastrea: 1 evento
→ Server rastrea: 1 evento
→ Facebook cuenta: 2 eventos ❌ (DUPLICADO)
```

### Con Deduplicación (ahora)
```
Usuario se registra
→ Pixel rastrea: 1 evento (event_id: "reg_user_123")
→ Server rastrea: 1 evento (event_id: "reg_user_123")
→ Facebook deduplica y cuenta: 1 evento ✅ (CORRECTO)
```

---

## 📊 Ventajas

1. **Precisión**: Datos exactos sin duplicados
2. **Resiliencia**: Si el Pixel falla (ad blocker), el servidor captura el evento
3. **Match Quality**: Más datos de usuario desde el servidor mejora la atribución
4. **Compliance**: Datos sensibles hasheados en el servidor
5. **iOS 14+**: Evita limitaciones de tracking del navegador

---

## 🚨 Troubleshooting

### Problema: Eventos aún se duplican

**Solución**:
1. Verifica que el `event_id` sea EXACTAMENTE el mismo en ambos lados
2. Revisa logs de consola y backend
3. Usa Facebook Pixel Helper para ver el `eventID` enviado
4. Espera 24 horas - la deduplicación puede tener delay

### Problema: Backend no recibe fbEventId

**Solución**:
1. Verifica que RegisterRequest/LoginRequest tengan el campo `fbEventId`
2. Confirma que el frontend lo envía en el payload
3. Revisa logs del backend Java para ver el request completo

### Problema: Event ID es null en backend

**Solución**:
```java
// El backend genera uno automáticamente si es null
String eventId = (fbEventId != null && !fbEventId.isBlank())
    ? fbEventId
    : generateEventId("Login", userId);
```

---

## 📚 Referencias

- Facebook Event Deduplication: https://developers.facebook.com/docs/marketing-api/conversions-api/deduplicate-pixel-and-server-events
- Facebook Pixel Reference: https://developers.facebook.com/docs/meta-pixel/reference
- Conversions API Parameters: https://developers.facebook.com/docs/marketing-api/conversions-api/parameters

---

**Implementado**: 12 de mayo de 2026
**Estado**: ✅ Producción Ready
