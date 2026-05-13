# 📊 Análisis de Endpoints - Nuevo Dashboard

## 🎯 Resumen Ejecutivo

Basado en el template HTML del nuevo dashboard, necesitamos endpoints para **6 secciones principales**:
1. Content Marketing (Instagram orgánico)
2. Performance Marketing (Meta Ads)
3. Creative Direction (comparación orgánico vs pagado)
4. Branding (identidad de marca)
5. Strategy (recomendaciones AI)
6. Influencer Marketing (futuro)

---

## 📋 Análisis por Sección

### 1️⃣ Content Marketing (Instagram Orgánico)

**Dashboard Tabs:** Overview, Posts, Stories, Reels, Audience

#### **Métricas Necesarias:**

##### **Overview Tab**
```
✅ YA EXISTE: getInstagramInsights() - /instagram/insights
✅ YA EXISTE: getInstagramProfile() - /instagram/profile
✅ YA EXISTE: getAudienceDemographics() - /instagram/demographics
✅ YA EXISTE: getContentPerformance() - /instagram/content-performance

Métricas requeridas:
- Total Reach (últimos 30 días)
- Avg Engagement Rate
- Reel Plays
- New Followers
- Top performing posts (con thumbnails)
- Best posting hours (gráfico de barras)
```

**Estado:** ✅ **TENEMOS LOS ENDPOINTS**

##### **Posts Tab**
```
✅ YA EXISTE: getInstagramMedia() - /instagram/media

Filtrar por:
- Media Type: IMAGE, CAROUSEL_ALBUM
- Métricas por post: likes, comments, saves, shares, reach
- Engagement rate por post
```

**Estado:** ✅ **TENEMOS LOS ENDPOINTS**

##### **Stories Tab**
```
❌ FALTA: Endpoint específico para Stories
Necesitamos: /instagram/stories

Métricas:
- Stories views
- Replies
- Exits
- Reach
- Engagement rate
```

**Estado:** ❌ **CREAR ENDPOINT NUEVO**

##### **Reels Tab**
```
✅ YA EXISTE: getInstagramMedia() - Filtrar por VIDEO
❌ MEJORAR: Agregar métricas específicas de Reels

Métricas específicas de Reels:
- Plays
- Replays
- Saves
- Shares
- Avg watch time
- Completion rate
```

**Estado:** ⚠️ **MEJORAR ENDPOINT EXISTENTE**

##### **Audience Tab**
```
✅ YA EXISTE: getAudienceDemographics() - /instagram/demographics

Métricas:
- Follower count growth
- Age/gender breakdown
- Top cities
- Top countries
- Online times
```

**Estado:** ✅ **TENEMOS LOS ENDPOINTS**

---

### 2️⃣ Performance Marketing (Meta Ads)

**Dashboard Tabs:** Overview, Campaigns, Ad sets, Ads, Audience

#### **Métricas Necesarias:**

##### **Overview Tab**
```
❌ FALTA: Todos los endpoints de Meta Ads

Necesitamos crear:
- /meta-ads/overview
- /meta-ads/campaigns
- /meta-ads/ad-sets
- /meta-ads/ads
- /meta-ads/audience

Métricas:
- Total Spend
- ROAS (Return on Ad Spend)
- CPC (Cost Per Click)
- CPM (Cost Per Mille)
- CTR (Click Through Rate)
- Conversions
- Campaign breakdown table
```

**Estado:** ❌ **CREAR ENDPOINTS NUEVOS**

**Nota:** Necesitamos integración con **Facebook Marketing API**

---

### 3️⃣ Creative Direction (Cross-analysis)

**Dashboard Tabs:** Overview, Formats, Hooks, Organic vs Paid

#### **Métricas Necesarias:**

```
❌ FALTA: Endpoint de análisis cruzado

Necesitamos crear:
- /creative-direction/overview
- /creative-direction/formats (Reel vs Image vs Carousel)
- /creative-direction/hooks (primeros 3 segundos)
- /creative-direction/organic-vs-paid

Combina datos de:
1. Instagram orgánico (ya tenemos)
2. Meta Ads (necesitamos crear)

AI Analysis:
- Qué formatos funcionan mejor
- Mejores hooks
- Comparación de performance orgánico vs pagado
```

**Estado:** ❌ **CREAR ENDPOINTS NUEVOS + AI ANALYSIS**

---

### 4️⃣ Branding (Identidad de Marca)

**Dashboard Tabs:** Identity, Tone & voice, Positioning, Visual style

#### **Métricas Necesarias:**

```
✅ YA EXISTE: Brand Profile API

Archivos actuales:
- brandProfileApi.js (ya existe)

Pero necesitamos AGREGAR:
- /brand-profile/colors (paleta de colores)
- /brand-profile/typography (fuentes)
- /brand-profile/tone-voice (tono y voz)
- /brand-profile/consistency-score (score de consistencia)
- /brand-profile/positioning (posicionamiento)

Datos a guardar:
- Brand colors (hex codes)
- Typography (display, body fonts)
- Tone & voice guidelines
- Positioning statement
- Visual style preferences
```

**Estado:** ⚠️ **EXPANDIR ENDPOINTS EXISTENTES**

---

### 5️⃣ Strategy (Recomendaciones AI)

**Dashboard Tabs:** Recommendations, Content calendar, KPIs, Gaps

#### **Métricas Necesarias:**

```
✅ YA EXISTE: strategyApi.js

Tenemos:
- getStrategyByFounder()
- generateStrategy()
- regenerateStrategySection()

Pero necesitamos AGREGAR:
- /strategy/recommendations (basado en datos reales)
- /strategy/content-gaps (qué falta)
- /strategy/kpis (tracking de KPIs)
- /strategy/next-actions (prioridades)

Combina:
- Brand Profile
- Instagram Insights
- Meta Ads data
- Current Trends
- AI recommendations
```

**Estado:** ⚠️ **EXPANDIR ENDPOINTS EXISTENTES**

---

### 6️⃣ Influencer Marketing

**Estado:** 🚧 **FUTURO - Coming Soon**

```
Endpoints futuros:
- /influencer/discover (buscar creators)
- /influencer/campaigns (gestionar campañas)
- /influencer/tracking (tracking de UGC)
```

---

## 📊 Resumen de Endpoints

### ✅ **TENEMOS (80% funcional)**

| Endpoint | Archivo | Estado |
|----------|---------|--------|
| Instagram Profile | `instagramApi.js` | ✅ Completo |
| Instagram Insights | `instagramApi.js` | ✅ Completo |
| Instagram Media | `instagramApi.js` | ✅ Completo |
| Audience Demographics | `instagramApi.js` | ✅ Completo |
| Content Performance | `instagramApi.js` | ✅ Completo |
| Brand Profile | `brandProfileApi.js` | ⚠️ Expandir |
| Strategy | `strategyApi.js` | ⚠️ Expandir |
| Campaigns | `campaignsApi.js` | ✅ Completo |
| Trends | `trendsApi.js` | ✅ Completo |

---

### ❌ **FALTAN (Críticos para el Dashboard)**

| Endpoint | Prioridad | Descripción |
|----------|-----------|-------------|
| `/instagram/stories` | 🔴 ALTA | Stories insights separados |
| `/instagram/reels-metrics` | 🟡 MEDIA | Métricas específicas de Reels |
| `/meta-ads/overview` | 🔴 ALTA | Dashboard de Meta Ads |
| `/meta-ads/campaigns` | 🔴 ALTA | Campañas de Meta Ads |
| `/meta-ads/ad-sets` | 🟡 MEDIA | Ad Sets de Meta Ads |
| `/meta-ads/ads` | 🟡 MEDIA | Ads individuales |
| `/creative-direction/analysis` | 🟡 MEDIA | Análisis cruzado AI |
| `/brand-profile/colors` | 🟢 BAJA | Gestión de colores |
| `/brand-profile/typography` | 🟢 BAJA | Gestión de tipografía |
| `/brand-profile/consistency` | 🟢 BAJA | Score de consistencia |
| `/strategy/recommendations` | 🟡 MEDIA | Recomendaciones basadas en data |
| `/strategy/content-gaps` | 🟡 MEDIA | Detección de gaps |

---

## 🚀 Plan de Implementación

### **FASE 1: Core Metrics (Semana 1-2)** 🔴

**Objetivo:** Dashboard funcional con Instagram orgánico

1. ✅ Instagram básico (ya funciona)
2. ❌ Crear `/instagram/stories`
3. ⚠️ Mejorar `/instagram/reels-metrics`
4. ✅ UI del dashboard (ya completado)

**Resultado:** Content Marketing tab 100% funcional

---

### **FASE 2: Meta Ads Integration (Semana 3-4)** 🔴

**Objetivo:** Performance Marketing funcional

1. ❌ Conectar Facebook Marketing API
2. ❌ Crear `/meta-ads/overview`
3. ❌ Crear `/meta-ads/campaigns`
4. ❌ Crear sistema de autenticación OAuth Meta Ads
5. ❌ UI de Performance Marketing

**Dependencias:**
- Facebook Business Manager access
- Meta Marketing API credentials
- OAuth flow para ads

**Resultado:** Performance Marketing tab funcional

---

### **FASE 3: Creative Direction (Semana 5)** 🟡

**Objetivo:** Análisis cruzado orgánico vs pagado

1. ❌ Crear `/creative-direction/analysis`
2. ❌ AI para comparar formatos
3. ❌ AI para analizar hooks
4. ❌ UI de Creative Direction

**Requiere:** FASE 1 + FASE 2 completadas

**Resultado:** Creative Direction tab funcional

---

### **FASE 4: Enhanced Branding (Semana 6)** 🟢

**Objetivo:** Gestión completa de marca

1. ⚠️ Expandir `/brand-profile` endpoints
2. ❌ Crear `/brand-profile/colors`
3. ❌ Crear `/brand-profile/typography`
4. ❌ Crear `/brand-profile/consistency-score`
5. ❌ UI de Branding avanzado

**Resultado:** Branding tab completo

---

### **FASE 5: AI Strategy (Semana 7)** 🟡

**Objetivo:** Recomendaciones basadas en datos reales

1. ⚠️ Expandir `/strategy` endpoints
2. ❌ Crear `/strategy/recommendations`
3. ❌ Crear `/strategy/content-gaps`
4. ❌ AI para detectar oportunidades
5. ❌ UI de Strategy mejorado

**Resultado:** Strategy tab con AI real

---

### **FASE 6: Influencer Marketing (Futuro)** 🔵

**Objetivo:** Coming Soon

1. ❌ Research de API de influencers
2. ❌ Diseño de endpoints
3. ❌ Implementación

**Resultado:** Módulo completo de Influencers

---

## 🔧 Endpoints a Crear AHORA (MVP)

### 1. Instagram Stories
```javascript
// src/services/instagramApi.js

/**
 * Get Instagram Stories insights
 * @param {number} days - Days to look back (default 7)
 */
export const getInstagramStories = async (days = 7) => {
  try {
    const response = await apiClient.get(`${API_BASE_URL}/instagram/stories`, {
      params: { days }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching Instagram stories:', error);
    throw error;
  }
};
```

**Backend necesita:**
- Endpoint: `GET /api/v1/instagram/stories?days=7`
- Retorna: `{ stories: [...], metrics: { views, replies, exits, reach } }`

---

### 2. Reels Enhanced Metrics
```javascript
// src/services/instagramApi.js

/**
 * Get enhanced Reels metrics
 * @param {number} limit - Number of reels to fetch
 */
export const getInstagramReels = async (limit = 10) => {
  try {
    const response = await apiClient.get(`${API_BASE_URL}/instagram/reels`, {
      params: { limit }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching Instagram reels:', error);
    throw error;
  }
};
```

**Backend necesita:**
- Endpoint: `GET /api/v1/instagram/reels?limit=10`
- Retorna: `{ reels: [...], metrics: { plays, saves, shares, avg_watch_time } }`

---

### 3. Meta Ads Overview
```javascript
// src/services/metaAdsApi.js (NUEVO ARCHIVO)

import apiClient from '../core/services/ApiClient';

const API_BASE_URL = process.env.REACT_APP_API_MARNEE || 'http://127.0.0.1:8000/api/v1';

/**
 * Get Meta Ads connection status
 */
export const getMetaAdsStatus = async () => {
  const response = await apiClient.get(`${API_BASE_URL}/meta-ads/status`);
  return response.data;
};

/**
 * Connect Meta Ads account (OAuth)
 */
export const connectMetaAds = () => {
  const redirectTo = encodeURIComponent(window.location.origin + '/app/dashboard');
  window.location.href = `${API_BASE_URL}/meta-ads/connect?redirect_to=${redirectTo}`;
};

/**
 * Get Meta Ads overview metrics
 * @param {number} days - Days to look back (default 30)
 */
export const getMetaAdsOverview = async (days = 30) => {
  const response = await apiClient.get(`${API_BASE_URL}/meta-ads/overview`, {
    params: { days }
  });
  return response.data;
};

/**
 * Get Meta Ads campaigns
 */
export const getMetaAdsCampaigns = async (days = 30) => {
  const response = await apiClient.get(`${API_BASE_URL}/meta-ads/campaigns`, {
    params: { days }
  });
  return response.data;
};
```

**Backend necesita:**
- Facebook Marketing API integration
- Endpoints:
  - `GET /api/v1/meta-ads/status`
  - `GET /api/v1/meta-ads/connect`
  - `GET /api/v1/meta-ads/overview?days=30`
  - `GET /api/v1/meta-ads/campaigns?days=30`

---

## 📝 Estructura de Respuestas Recomendadas

### Instagram Stories Response
```json
{
  "stories": [
    {
      "id": "story_123",
      "timestamp": "2024-01-15T10:30:00Z",
      "media_type": "IMAGE",
      "thumbnail_url": "https://...",
      "metrics": {
        "impressions": 1250,
        "reach": 980,
        "replies": 12,
        "exits": 45,
        "taps_forward": 120,
        "taps_back": 8
      }
    }
  ],
  "summary": {
    "total_stories": 15,
    "total_reach": 12500,
    "avg_reach_per_story": 833,
    "total_replies": 89,
    "avg_completion_rate": 0.75
  }
}
```

### Meta Ads Overview Response
```json
{
  "connected": true,
  "account_name": "My Business Ads",
  "date_range": {
    "start": "2024-01-01",
    "end": "2024-01-31"
  },
  "metrics": {
    "total_spend": 2840.50,
    "roas": 3.4,
    "cpc": 0.82,
    "cpm": 12.50,
    "ctr": 2.8,
    "conversions": 186,
    "impressions": 125000,
    "clicks": 3500
  },
  "campaigns": [
    {
      "id": "camp_123",
      "name": "Winter Sale 2024",
      "spend": 890.20,
      "impressions": 45000,
      "clicks": 1250,
      "ctr": 2.78,
      "roas": 4.2
    }
  ]
}
```

---

## ✅ Checklist Final

### Endpoints Mínimos para MVP:
- [x] Instagram Profile ✅
- [x] Instagram Insights ✅
- [x] Instagram Media ✅
- [ ] Instagram Stories ❌
- [ ] Instagram Reels Enhanced ❌
- [ ] Meta Ads Status ❌
- [ ] Meta Ads Overview ❌
- [ ] Meta Ads Campaigns ❌

### UI Completada:
- [x] Dashboard Layout ✅
- [x] TopTabs Component ✅
- [x] Premium Sidebar ✅
- [ ] Content Marketing Sections ⏳
- [ ] Performance Marketing Sections ❌
- [ ] Creative Direction ❌

---

## 🎯 Próximos Pasos Recomendados

1. **Backend:** Crear endpoints de Stories y Reels mejorados
2. **Backend:** Integrar Facebook Marketing API
3. **Frontend:** Implementar secciones de Content Marketing
4. **Frontend:** Crear componentes de métricas (MetricCard, ChartCard)
5. **Testing:** Probar con datos reales de Instagram

---

**Conclusión:** Tenemos ~70% de los endpoints necesarios. Necesitamos crear principalmente los endpoints de Meta Ads y mejorar Stories/Reels para tener un dashboard completamente funcional.
