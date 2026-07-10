# Modo Demo de Instagram para Review de Meta

Este documento explica cómo activar el modo demo de Instagram para mostrar la funcionalidad completa de la aplicación durante el proceso de revisión de Meta, sin necesitar acceso real a la API de Instagram.

## ¿Por qué usar el modo demo?

Durante el proceso de revisión de la aplicación por Meta, es necesario demostrar cómo funciona la integración de Instagram Graph API antes de recibir la aprobación de acceso completo. El modo demo permite:

- Mostrar todas las funcionalidades de analíticas de Instagram
- Visualizar gráficas con datos realistas
- Demostrar el flujo completo de la aplicación
- No requiere una cuenta de Instagram conectada

## Cómo activar el modo demo

### 1. Configurar la variable de entorno

Crea o edita el archivo `.env` en la raíz del proyecto y agrega:

```bash
REACT_APP_INSTAGRAM_DEMO_MODE=true
```

### 2. Reiniciar la aplicación

Si la aplicación ya está corriendo, reinicia el servidor de desarrollo para que los cambios surtan efecto:

```bash
npm start
```

### 3. Verificar que está funcionando

1. Abre la aplicación en el navegador
2. Ve al Dashboard → pestaña "Instagram"
3. Deberías ver datos de Instagram mostrados automáticamente sin necesidad de conectar una cuenta

## Qué datos se mostrarán en modo demo

El modo demo incluye datos realistas para:

### Métricas principales
- Total Reach: 128,400
- Engagement Rate: 4.2%
- Reel Plays: 89,100
- New Followers: +347

### Gráficas
- Reach Over Time (últimos 7 días)
- Best Posting Hours (engagement por hora)
- Content Type Distribution (Reels, Posts, Carousels, Stories)

### Posts
- 6 posts de ejemplo con imágenes de placeholder
- Métricas de engagement por post
- Diferentes tipos de contenido (Video, Carousel, Image)

### Análisis adicional
- Demografía de audiencia (edad, género, ubicaciones)
- Performance de contenido
- Análisis con IA de la cuenta

## Desactivar el modo demo

Para volver a usar datos reales de la API de Instagram:

### 1. Cambiar la variable de entorno

En tu archivo `.env`:

```bash
REACT_APP_INSTAGRAM_DEMO_MODE=false
```

O simplemente comentar la línea:

```bash
# REACT_APP_INSTAGRAM_DEMO_MODE=true
```

### 2. Reiniciar la aplicación

```bash
npm start
```

## Modo demo para producción

Si necesitas activar el modo demo en producción (por ejemplo, en la build que enviarás para review):

### Opción 1: Variable de entorno en el build

```bash
REACT_APP_INSTAGRAM_DEMO_MODE=true npm run build
```

### Opción 2: Configurar en tu archivo `.env.production`

Edita `.env.production` y agrega:

```bash
REACT_APP_INSTAGRAM_DEMO_MODE=true
```

Luego haz el build normalmente:

```bash
npm run build
```

## Archivos modificados

Los siguientes archivos fueron modificados para soportar el modo demo:

1. **`src/services/mockData/instagramMockData.js`** (nuevo)
   - Contiene todos los datos de ejemplo
   - Datos realistas de métricas, posts, demographics, etc.

2. **`src/services/instagramApi.js`** (modificado)
   - Verifica si el modo demo está activo
   - Retorna datos mock en lugar de hacer llamadas API reales
   - Simula un delay de 300ms para que parezca una llamada API real

3. **`.env.example`** (modificado)
   - Agregada la variable `REACT_APP_INSTAGRAM_DEMO_MODE`

## Notas importantes

1. El modo demo **solo afecta los datos de Instagram**. Otras funcionalidades siguen funcionando normalmente.

2. El modo demo simula una conexión exitosa de Instagram, por lo que el botón "Connect Instagram" no aparecerá.

3. Los datos mock son estáticos. No se actualizarán en tiempo real, pero son suficientes para demostración.

4. Una vez que Meta apruebe el acceso a la API, asegúrate de desactivar el modo demo en producción.

## Soporte

Si tienes problemas con el modo demo, verifica:

1. Que la variable de entorno esté correctamente configurada
2. Que hayas reiniciado la aplicación después de cambiar el `.env`
3. Que no haya errores en la consola del navegador

La verificación del modo se hace con:
```javascript
process.env.REACT_APP_INSTAGRAM_DEMO_MODE === 'true'
```

Por lo tanto, el valor debe ser exactamente el string `"true"` (en minúsculas).
