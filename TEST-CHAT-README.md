# 🧪 Test Chat - Clean Architecture Prototype

## ¿Qué es esto?

Un chat **completamente nuevo** construido desde cero con arquitectura limpia. Si este funciona correctamente, migraremos esta arquitectura al chat principal.

## 🎯 Objetivo

Probar que los mensajes:
- ✅ Se guardan en la base de datos
- ✅ Persisten entre recargas de página
- ✅ Persisten entre sesiones (cerrar/abrir navegador)
- ✅ Se muestran correctamente en tiempo real

## 🚀 Cómo Acceder

### Desarrollo Local:
```
http://localhost:3000/test-chat
```

### Producción:
```
https://tu-app.vercel.app/test-chat
```

## 🧪 Cómo Probar

### Test 1: Envío Básico
1. Ve a `/test-chat`
2. Envía 3-4 mensajes
3. ✅ Los mensajes deben aparecer inmediatamente
4. ✅ El sidebar debe mostrar el contador de mensajes

### Test 2: Persistencia en BD
1. Envía varios mensajes
2. Click en "🔄 Reload from DB" en el sidebar
3. ✅ Los mensajes deben reaparecer (vienen de la BD)

### Test 3: Reload de Página
1. Envía varios mensajes
2. Recarga la página (F5)
3. ✅ Los mensajes deben volver a aparecer automáticamente

### Test 4: Cerrar y Abrir Navegador
1. Envía varios mensajes
2. Cierra el navegador completamente
3. Abre el navegador de nuevo
4. Ve a `/test-chat`
5. ✅ Los mensajes deben seguir ahí

## 📊 Panel de Debug (Sidebar)

El sidebar izquierdo muestra información en tiempo real:

### Status
- **Messages in State:** Cantidad de mensajes en el estado local
- **Conversation ID:** ID de la conversación actual
- **Founder ID:** ID del usuario
- **Session ID:** ID de la sesión

### Acciones
- **🔄 Reload from DB:** Recarga los mensajes directamente de la base de datos
- **📋 Log to Console:** Imprime toda la info de debug en la consola del navegador (F12)

## 🎨 Características Especiales

### Arquitectura Simple
- ❌ NO usa Context API complejo
- ❌ NO usa Redux o state management externo
- ✅ Estado local simple con `useState`
- ✅ Llamadas directas a la API
- ✅ Sin dependencias innecesarias

### Persistencia Dual
- ✅ Primaria: Base de datos PostgreSQL
- ✅ Todos los mensajes se guardan en BD inmediatamente
- ✅ Al cargar, siempre trae mensajes de BD

### Logging Completo
Abre la consola del navegador (F12) y verás logs detallados:
```
[TestChat] Initializing...
[TestChat] Founder loaded: xxx-xxx-xxx
[TestChat] Loaded 5 messages from DB
[TestChat] Sending message...
[TestChat] Response received: {...}
```

## 🔍 Cómo Funciona (Arquitectura)

### 1. Inicialización
```javascript
useEffect(() => {
  // 1. Obtener founder
  const founder = await api.getMeFounder();

  // 2. Obtener sesiones
  const sessions = await api.getMeSessions();

  // 3. Obtener conversaciones
  const conversations = await api.getConversations();

  // 4. Si existe conversación, cargar mensajes
  if (conversations.length > 0) {
    const messages = await api.getConversation(conversationId);
    setMessages(messages);
  }
}, []);
```

### 2. Envío de Mensaje
```javascript
const handleSend = async () => {
  // 1. Agregar mensaje al estado (optimistic update)
  setMessages(prev => [...prev, userMessage]);

  // 2. Enviar a API (se guarda en BD automáticamente)
  const response = await api.sendMessage({...});

  // 3. Agregar respuesta de AI
  setMessages(prev => [...prev, aiMessage]);
};
```

### 3. Recarga de Mensajes
```javascript
const handleReload = async () => {
  // Cargar directamente de BD
  const conversation = await api.getConversation(conversationId);
  setMessages(conversation.messages);
};
```

## ✅ Qué Debe Funcionar

Si el test es exitoso, deberías poder:

1. ✅ Enviar mensajes y verlos aparecer
2. ✅ Recibir respuestas de Marnee
3. ✅ Recargar desde BD y ver los mismos mensajes
4. ✅ Recargar la página y ver los mensajes
5. ✅ Cerrar el navegador, volver y ver los mensajes
6. ✅ Ver logs claros en la consola
7. ✅ Ver el estado en tiempo real en el sidebar

## 🐛 Qué Hacer si Falla

### Si los mensajes no se guardan:
1. Abre la consola (F12)
2. Busca errores rojos
3. Busca logs `[TestChat]` para ver dónde falla
4. Click en "📋 Log to Console" en el sidebar
5. Comparte los logs

### Si los mensajes desaparecen:
1. Click en "🔄 Reload from DB"
2. ¿Vuelven los mensajes? → Están en BD pero no se cargan correctamente
3. ¿No vuelven? → No se guardaron en BD

### Si hay un error:
El sidebar mostrará el error en la sección "Error" en rojo.

## 📝 Reportar Resultados

Después de probar, reporta:

**✅ Lo que funcionó:**
- [ ] Test 1: Envío Básico
- [ ] Test 2: Persistencia en BD
- [ ] Test 3: Reload de Página
- [ ] Test 4: Cerrar y Abrir Navegador

**❌ Lo que falló:**
- Descripción del problema:
- Logs de la consola:
- Screenshot del sidebar:

## 🎯 Próximo Paso

Si TODOS los tests pasan:
→ Migramos esta arquitectura al chat principal `/app`

Si algún test falla:
→ Debuggeamos y arreglamos AQUÍ primero, antes de tocar el chat principal

---

## 🔗 Enlaces Útiles

- Backend API: `POST /api/v1/marnee/chat`
- Get Conversations: `GET /api/v1/marnee/conversations`
- Get Conversation: `GET /api/v1/marnee/conversation/{id}`

## ⚡ Comandos Rápidos

### Desarrollo Local
```bash
cd /Users/tonyprado/IdeaProjects/marnee-front
npm start
# Ir a http://localhost:3000/test-chat
```

### Build
```bash
npm run build
```

### Deploy
```bash
git add .
git commit -m "test: new chat architecture"
git push origin main
# Vercel auto-deploy
```
