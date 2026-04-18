# 🐛 DEBUG: Chat Messages Debugging Guide

## Problema
Los mensajes del chat se están borrando y necesitamos identificar CUÁNDO y POR QUÉ pasa esto.

## Cómo Debuggear

### 1. Abrir DevTools Console
- Abre el navegador (Chrome/Firefox)
- Presiona `F12` o click derecho → "Inspect" → Tab "Console"
- Mantén la consola abierta TODO el tiempo

### 2. Ver los Logs
Busca estos logs en la consola:

```
[MarneeContext] ...
[IAWebPage] ...
```

### 3. Escenarios a Probar

#### Escenario A: Enviar mensaje
1. Envía un mensaje en el chat
2. ¿El mensaje aparece?
3. ¿Ves en la consola `[MarneeContext] Backed up X messages to localStorage`?
4. ¿Qué dice el log?

#### Escenario B: Navegar a Calendar y volver
1. Envía 2-3 mensajes
2. Ve a `/app/calendar`
3. Vuelve a `/app` (chat)
4. ¿Los mensajes siguen ahí?
5. ¿Qué logs ves en la consola?

#### Escenario C: Recargar página
1. Envía 2-3 mensajes
2. Recarga la página (F5)
3. ¿Los mensajes vuelven?
4. Busca en consola: `[MarneeContext] Restored X messages from localStorage backup`

#### Escenario D: Cerrar y abrir navegador
1. Envía 2-3 mensajes
2. Cierra el navegador completamente
3. Abre de nuevo y ve a `/app`
4. ¿Los mensajes siguen ahí?

### 4. Verificar Base de Datos

#### Opción A: Desde la Consola del Navegador
```javascript
// Ver conversationId actual
localStorage.getItem('marnee_conversationId')

// Ver mensajes en localStorage
JSON.parse(localStorage.getItem('marnee_messages_backup'))
```

#### Opción B: Desde PostgreSQL
```sql
-- Ver conversaciones
SELECT * FROM conversations ORDER BY updated_at DESC LIMIT 5;

-- Ver mensajes de una conversación (cambia el ID)
SELECT * FROM chat_messages
WHERE conversation_id = 'TU_CONVERSATION_ID_AQUI'
ORDER BY created_at;
```

### 5. Logs Importantes a Buscar

#### ✅ BUENOS (esto significa que funciona)
```
[MarneeContext] Backed up 3 messages to localStorage
[MarneeContext] Restored 3 messages from localStorage backup
[IAWebPage] Loading conversation with 3 messages
[MarneeContext] Messages updated successfully
```

#### ❌ MALOS (esto indica el problema)
```
[MarneeContext] WARNING: Conversation has no messages, keeping existing messages
[IAWebPage] WARNING: Conversation exists but has no messages
[IAWebPage] Failed to load conversation: ...
```

### 6. Qué Reportar

Por favor, copia y pega aquí los siguientes datos:

#### A. ¿Cuándo se borran los mensajes?
- [ ] Al enviar un mensaje nuevo
- [ ] Al navegar a Calendar y volver
- [ ] Al recargar la página (F5)
- [ ] Al cerrar y abrir navegador
- [ ] Otro: _________________

#### B. Copia todos los logs que comienzan con `[MarneeContext]` o `[IAWebPage]`

```
PEGA LOS LOGS AQUÍ:





```

#### C. ¿Qué dice localStorage?

En la consola del navegador, ejecuta:
```javascript
console.log('conversationId:', localStorage.getItem('marnee_conversationId'));
console.log('messages backup:', localStorage.getItem('marnee_messages_backup'));
```

Copia el resultado:
```
PEGA EL RESULTADO AQUÍ:




```

#### D. ¿Hay mensajes en la base de datos?

Si tienes acceso a PostgreSQL:
```sql
SELECT
    c.id as conversation_id,
    COUNT(cm.id) as message_count
FROM conversations c
LEFT JOIN chat_messages cm ON c.id = cm.conversation_id
GROUP BY c.id
ORDER BY c.updated_at DESC
LIMIT 5;
```

Copia el resultado:
```
PEGA EL RESULTADO AQUÍ:




```

---

## Siguiente Paso

Una vez que tengas esta información, compártela conmigo y podré identificar EXACTAMENTE dónde está el problema.
