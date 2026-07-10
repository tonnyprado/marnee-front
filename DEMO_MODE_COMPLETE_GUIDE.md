# Guía Completa del Modo Demo - Todas las Plataformas

Esta guía explica cómo activar el modo demo para **todas las plataformas** disponibles en Marnee: Instagram, TikTok, YouTube y Google Analytics.

## 📋 Resumen de Plataformas Disponibles

| Plataforma | Variable de Entorno | Estado | Ubicación en Dashboard |
|------------|-------------------|---------|----------------------|
| Instagram | `REACT_APP_INSTAGRAM_DEMO_MODE` | ✅ Completo | Dashboard → Instagram |
| TikTok | `REACT_APP_TIKTOK_DEMO_MODE` | ✅ Completo | Dashboard → TikTok |
| YouTube | `REACT_APP_YOUTUBE_DEMO_MODE` | ✅ Completo | Dashboard → YouTube |
| Google Analytics | `REACT_APP_ANALYTICS_DEMO_MODE` | ✅ Completo | Dashboard → Analytics |

---

## 🚀 Activación Rápida

### Para Desarrollo Local

1. **Edita el archivo `.env`** en la raíz del proyecto:

```bash
# Social Media Platforms
REACT_APP_INSTAGRAM_DEMO_MODE=true
REACT_APP_TIKTOK_DEMO_MODE=true
REACT_APP_YOUTUBE_DEMO_MODE=true
REACT_APP_ANALYTICS_DEMO_MODE=true
```

2. **Reinicia el servidor**:
```bash
npm start
```

3. **Abre el dashboard** y verás datos en todas las pestañas

---

### Para Producción (Vercel)

1. **Ve a Vercel Dashboard** → Tu Proyecto → Settings → Environment Variables

2. **Agrega estas 4 variables** (una por una):

```
REACT_APP_INSTAGRAM_DEMO_MODE = true (Environment: Production)
REACT_APP_TIKTOK_DEMO_MODE = true (Environment: Production)
REACT_APP_YOUTUBE_DEMO_MODE = true (Environment: Production)
REACT_APP_ANALYTICS_DEMO_MODE = true (Environment: Production)
```

3. **Redeploy el proyecto**:
   - Ve a Deployments → Último deployment → ... → Redeploy

4. **Espera 1-2 minutos** y abre tu sitio

---

## 📊 Datos Disponibles por Plataforma

### Instagram
**Métricas:**
- Total Reach: 128,400 (+12.5%)
- Engagement Rate: 4.2% (+8.3%)
- Reel Plays: 89,100 (+23.1%)
- New Followers: +347 (+15.7%)

**Contenido:**
- 6 posts de ejemplo con imágenes
- Gráficas de reach por día (7 días)
- Best posting hours (engagement por hora)
- Content type distribution (Reels, Posts, Carousels, Stories)
- Goals tracking (Reach, Engagement, Followers)
- Demografía de audiencia

---

### TikTok
**Métricas:**
- Total Views: 2,840,000 (+18.5%)
- Engagement Rate: 6.3% (+12.7%)
- Total Shares: 12,400 (+25.4%)
- New Followers: +2,847 (+22.1%)

**Contenido:**
- 6 videos de ejemplo con thumbnails
- Gráficas de views por día (7 días)
- Best posting hours
- Content type distribution (Videos, Duets, Stitches, Lives)
- Goals tracking (Views, Engagement, Followers)
- Demografía de audiencia

---

### YouTube
**Métricas:**
- Total Views: 3,450,000
- Avg View Duration: 4.2 minutos
- Subscriber Growth: +1,240
- Total Likes: 89,400
- Engagement Rate: 5.8%

**Contenido:**
- 6 videos con métricas completas
- Watch time y retención
- CTR (Click-Through Rate)
- Gráficas de views por día
- Traffic sources (Search, Suggested, Browse, External)
- Demografía de audiencia
- Device distribution (Mobile, Desktop, TV)

---

### Google Analytics
**Métricas:**
- Total Users: 45,680
- Total Sessions: 67,890
- Total Pageviews: 234,560
- Bounce Rate: 42.3%
- Avg Session Duration: 3.8 minutos
- Pages per Session: 3.45

**Contenido:**
- Users por día (7 días)
- Traffic sources (Organic, Direct, Social, Referral, Email)
- Top 5 páginas con métricas
- Device distribution
- Conversiones por objetivo
- Demografía (edad, género, países, idiomas)

---

## 🎯 Casos de Uso

### 1. Demo para Clientes/Inversionistas
```bash
# Activa todas las plataformas
REACT_APP_INSTAGRAM_DEMO_MODE=true
REACT_APP_TIKTOK_DEMO_MODE=true
REACT_APP_YOUTUBE_DEMO_MODE=true
REACT_APP_ANALYTICS_DEMO_MODE=true
```

### 2. Review de Meta (solo Instagram)
```bash
# Solo Instagram
REACT_APP_INSTAGRAM_DEMO_MODE=true
REACT_APP_TIKTOK_DEMO_MODE=false
REACT_APP_YOUTUBE_DEMO_MODE=false
REACT_APP_ANALYTICS_DEMO_MODE=false
```

### 3. Testing de UI/UX
```bash
# Activa plataformas específicas que estés diseñando
REACT_APP_INSTAGRAM_DEMO_MODE=true
REACT_APP_TIKTOK_DEMO_MODE=true
```

---

## 🔧 Troubleshooting

### Problema: No veo datos después de activar

**Solución 1:** Verifica que la variable esté exactamente así:
```bash
REACT_APP_INSTAGRAM_DEMO_MODE=true
```
✅ Correcto: `true` (minúsculas)
❌ Incorrecto: `True`, `TRUE`, `"true"`

**Solución 2:** Reinicia el servidor después de cambiar `.env`
```bash
# Ctrl+C para detener
npm start
```

**Solución 3 (Vercel):** Asegúrate de hacer **Redeploy** después de agregar variables

---

### Problema: Error "Oops! Something went wrong"

**Causa:** Error React #130 - algún componente está recibiendo un objeto en lugar de un string.

**Solución Temporal:** Desactiva los modos demo mientras se arregla:
```bash
REACT_APP_INSTAGRAM_DEMO_MODE=false
REACT_APP_TIKTOK_DEMO_MODE=false
```

**Solución Permanente:** Ya está arreglado en el último commit. Haz `git pull` y redeploy.

---

### Problema: Solo algunas pestañas muestran datos

Esto es normal si:
- Solo activaste algunas variables (revisar `.env`)
- La pestaña no tiene componente implementado aún

---

## 📁 Estructura de Archivos

```
src/
├── services/
│   ├── mockData/
│   │   ├── instagramMockData.js  ✅ Instagram
│   │   ├── tiktokMockData.js     ✅ TikTok
│   │   ├── youtubeMockData.js    ✅ YouTube
│   │   └── analyticsMockData.js  ✅ Google Analytics
│   │
│   ├── instagramApi.js  (con modo demo)
│   ├── tiktokApi.js     (con modo demo)
│   └── googleApi.js     (con modo demo - YouTube & Analytics)
│
├── hooks/
│   ├── useInstagramData.js
│   └── useTikTokData.js
│
└── Pages/Tools/MyDashboardSections/
    ├── ContentMarketingSection.jsx  (Instagram)
    └── TikTokSection.jsx            (TikTok)
```

---

## 🎨 Personalización de Datos Mock

Si necesitas cambiar los números o datos de ejemplo:

### Instagram
Edita: `src/services/mockData/instagramMockData.js`
```javascript
export const MOCK_INSTAGRAM_INSIGHTS = {
  reach: 128400,           // ← Cambiar aquí
  engagement_rate: 4.2,    // ← Cambiar aquí
  // ...
};
```

### TikTok
Edita: `src/services/mockData/tiktokMockData.js`

### YouTube
Edita: `src/services/mockData/youtubeMockData.js`

### Google Analytics
Edita: `src/services/mockData/analyticsMockData.js`

**Importante:** Después de editar, haz commit y redeploy.

---

## 🚦 Para Desactivar el Modo Demo

### En Desarrollo Local
Cambia las variables a `false` en `.env`:
```bash
REACT_APP_INSTAGRAM_DEMO_MODE=false
REACT_APP_TIKTOK_DEMO_MODE=false
REACT_APP_YOUTUBE_DEMO_MODE=false
REACT_APP_ANALYTICS_DEMO_MODE=false
```

### En Vercel
Opción 1: Elimina las variables en Environment Variables
Opción 2: Cambia los valores a `false` y redeploy

---

## ✅ Checklist para Review

Antes de enviar tu app para review (Meta, TikTok, etc.):

- [ ] Modos demo activados en Vercel
- [ ] Redeploy completado exitosamente
- [ ] Instagram tab muestra datos automáticamente
- [ ] TikTok tab muestra datos automáticamente
- [ ] YouTube tab muestra datos automáticamente (opcional)
- [ ] Analytics tab muestra datos automáticamente (opcional)
- [ ] No aparecen botones de "Connect" en las pestañas con demo activo
- [ ] Todas las gráficas se visualizan correctamente
- [ ] Landing page se ve correctamente
- [ ] No hay errores en la consola del navegador

---

## 📞 Soporte

Si tienes problemas:

1. Revisa que las variables estén escritas exactamente como se muestra
2. Verifica que hiciste redeploy en Vercel después de agregar variables
3. Limpia el cache del navegador (Cmd+Shift+R o Ctrl+Shift+R)
4. Revisa la consola del navegador (F12) para ver errores específicos

---

## 🎯 Próximos Pasos

Una vez que recibas la aprobación de las APIs:

1. **Desactiva los modos demo** en producción
2. **Configura las credenciales reales** de cada API
3. **Prueba las conexiones** con cuentas reales
4. **Monitorea** que todo funcione correctamente

El código está preparado para cambiar automáticamente entre modo demo y modo real según las variables de entorno.
