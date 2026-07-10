# Modo Demo de Instagram y TikTok para Review

Este documento explica cómo activar el modo demo de Instagram y TikTok para mostrar la funcionalidad completa de la aplicación durante el proceso de revisión, sin necesitar acceso real a las APIs.

## ¿Por qué usar el modo demo?

Durante el proceso de revisión de la aplicación por Meta y otras plataformas, es necesario demostrar cómo funcionan las integraciones antes de recibir la aprobación de acceso completo. El modo demo permite:

- Mostrar todas las funcionalidades de analíticas de Instagram y TikTok
- Visualizar gráficas con datos realistas
- Demostrar el flujo completo de la aplicación
- No requiere cuentas conectadas a redes sociales

## Cómo activar el modo demo

### 1. Configurar las variables de entorno

Crea o edita el archivo `.env` en la raíz del proyecto y agrega:

```bash
# Instagram Demo Mode
REACT_APP_INSTAGRAM_DEMO_MODE=true

# TikTok Demo Mode
REACT_APP_TIKTOK_DEMO_MODE=true
```

### 2. Reiniciar la aplicación

Si la aplicación ya está corriendo, reinicia el servidor de desarrollo para que los cambios surtan efecto:

```bash
npm start
```

### 3. Verificar que está funcionando

1. Abre la aplicación en el navegador
2. Ve al Dashboard → pestañas "Instagram" y "TikTok"
3. Deberías ver datos mostrados automáticamente sin necesidad de conectar cuentas

## Qué datos se mostrarán en modo demo

### Instagram

**Métricas principales:**
- Total Reach: 128,400
- Engagement Rate: 4.2%
- Reel Plays: 89,100
- New Followers: +347

**Gráficas:**
- Reach Over Time (últimos 7 días)
- Best Posting Hours (engagement por hora)
- Content Type Distribution (Reels, Posts, Carousels, Stories)

**Posts:**
- 6 posts de ejemplo con imágenes de placeholder
- Métricas de engagement por post
- Diferentes tipos de contenido (Video, Carousel, Image)

**Análisis adicional:**
- Demografía de audiencia (edad, género, ubicaciones)
- Performance de contenido
- Análisis con IA de la cuenta

### TikTok

**Métricas principales:**
- Total Views: 2,840,000
- Engagement Rate: 6.3%
- Total Shares: 12,400
- New Followers: +2,847

**Gráficas:**
- Views Over Time (últimos 7 días)
- Best Posting Hours (engagement por hora)
- Content Type Distribution (Regular Videos, Duets, Stitches, Lives)

**Videos:**
- 6 videos de ejemplo con thumbnails
- Métricas de engagement por video (views, likes, shares, comments)
- Datos de retención y watch time

**Análisis adicional:**
- Demografía de audiencia (edad, género, ubicaciones, dispositivos)
- Performance de contenido
- Análisis con IA de la cuenta

## Desactivar el modo demo

Para volver a usar datos reales de las APIs:

### 1. Cambiar las variables de entorno

En tu archivo `.env`:

```bash
REACT_APP_INSTAGRAM_DEMO_MODE=false
REACT_APP_TIKTOK_DEMO_MODE=false
```

O simplemente comentar las líneas:

```bash
# REACT_APP_INSTAGRAM_DEMO_MODE=true
# REACT_APP_TIKTOK_DEMO_MODE=true
```

### 2. Reiniciar la aplicación

```bash
npm start
```

## Modo demo para producción

Si necesitas activar el modo demo en producción (por ejemplo, en la build que enviarás para review):

### Opción 1: Variables de entorno en el build

```bash
REACT_APP_INSTAGRAM_DEMO_MODE=true REACT_APP_TIKTOK_DEMO_MODE=true npm run build
```

### Opción 2: Configurar en tu archivo `.env.production`

Edita `.env.production` y agrega:

```bash
REACT_APP_INSTAGRAM_DEMO_MODE=true
REACT_APP_TIKTOK_DEMO_MODE=true
```

Luego haz el build normalmente:

```bash
npm run build
```

## Archivos modificados

Los siguientes archivos fueron modificados para soportar el modo demo:

### Instagram

1. **`src/services/mockData/instagramMockData.js`** (nuevo)
   - Contiene todos los datos de ejemplo de Instagram
   - Datos realistas de métricas, posts, demographics, etc.

2. **`src/services/instagramApi.js`** (modificado)
   - Verifica si el modo demo está activo
   - Retorna datos mock en lugar de hacer llamadas API reales
   - Simula un delay de 300ms para que parezca una llamada API real

3. **`src/hooks/useInstagramData.js`** (existente)
   - Hook para detectar conexión de Instagram

### TikTok

1. **`src/services/mockData/tiktokMockData.js`** (nuevo)
   - Contiene todos los datos de ejemplo de TikTok
   - Datos realistas de métricas, videos, demographics, etc.

2. **`src/services/tiktokApi.js`** (modificado)
   - Verifica si el modo demo está activo
   - Retorna datos mock en lugar de hacer llamadas API reales
   - Simula un delay de 300ms

3. **`src/hooks/useTikTokData.js`** (nuevo)
   - Hook para detectar conexión de TikTok

4. **`src/Pages/Tools/MyDashboardSections/TikTokSection.jsx`** (nuevo)
   - Componente completo de analíticas de TikTok

5. **`src/Pages/Tools/MyDashboard.jsx`** (modificado)
   - Agregado tab de TikTok

### Configuración

1. **`.env.example`** (modificado)
   - Agregadas variables `REACT_APP_INSTAGRAM_DEMO_MODE` y `REACT_APP_TIKTOK_DEMO_MODE`

2. **`.env`** (nuevo/modificado)
   - Archivo local con modos demo activados

## Notas importantes

1. Los modos demo **solo afectan los datos de Instagram y TikTok**. Otras funcionalidades siguen funcionando normalmente.

2. Los modos demo simulan conexiones exitosas, por lo que los botones de "Connect" no aparecerán.

3. Los datos mock son estáticos. No se actualizarán en tiempo real, pero son suficientes para demostración.

4. Una vez que Meta y TikTok aprueben el acceso a las APIs, asegúrate de desactivar los modos demo en producción.

5. Puedes activar/desactivar cada plataforma independientemente.

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
