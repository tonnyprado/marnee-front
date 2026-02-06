# Endpoints Pendientes - Dashboard DNHub

## Resumen
Este documento lista los endpoints necesarios para habilitar todas las funcionalidades del Dashboard con datos reales.

---

## 1. CAMPAIGNS (Gestión de Campañas)

### 1.1 Listar Campañas
```
GET /api/v1/campaigns
Query params: ?founderId={id}&status={active|completed|pending}&aiOnly={boolean}
```
**Response:**
```json
{
  "campaigns": [
    {
      "id": "string",
      "name": "string",
      "platform": "Instagram | LinkedIn | TikTok | Twitter | YouTube",
      "status": "In Progress | Active | Pending | Completed",
      "assignedTo": "string",
      "scriptsCount": "number",
      "clipsCount": "number",
      "aiGenerated": "boolean",
      "inspirationUrl": "string | null",
      "createdAt": "ISO date",
      "updatedAt": "ISO date"
    }
  ],
  "total": "number"
}
```

### 1.2 Obtener Campaña por ID
```
GET /api/v1/campaigns/{campaignId}
```
**Response:** Objeto de campaña completo con posts asociados

### 1.3 Crear Campaña
```
POST /api/v1/campaigns
```
**Body:**
```json
{
  "founderId": "string",
  "name": "string",
  "platform": "string",
  "inspirationUrl": "string | null"
}
```

### 1.4 Actualizar Campaña
```
PUT /api/v1/campaigns/{campaignId}
```
**Body:** Campos a actualizar (name, status, assignedTo, etc.)

### 1.5 Eliminar Campaña
```
DELETE /api/v1/campaigns/{campaignId}
```

---

## 2. PENDING TASKS (Tareas Pendientes)

### 2.1 Listar Tareas del Founder
```
GET /api/v1/tasks
Query params: ?founderId={id}&status={pending|completed|all}&campaignId={id}
```
**Response:**
```json
{
  "tasks": [
    {
      "id": "string",
      "title": "string",
      "description": "string | null",
      "status": "pending | in_progress | completed",
      "priority": "low | medium | high",
      "campaignId": "string | null",
      "dueDate": "ISO date | null",
      "completedAt": "ISO date | null",
      "createdAt": "ISO date"
    }
  ],
  "stats": {
    "total": "number",
    "completed": "number",
    "pending": "number",
    "completionPercentage": "number"
  }
}
```

### 2.2 Actualizar Estado de Tarea
```
PUT /api/v1/tasks/{taskId}
```
**Body:**
```json
{
  "status": "pending | in_progress | completed"
}
```

### 2.3 Crear Tarea Manual
```
POST /api/v1/tasks
```
**Body:**
```json
{
  "founderId": "string",
  "title": "string",
  "description": "string | null",
  "priority": "low | medium | high",
  "campaignId": "string | null",
  "dueDate": "ISO date | null"
}
```

### 2.4 Eliminar Tarea
```
DELETE /api/v1/tasks/{taskId}
```

---

## 3. AI SUGGESTIONS (Sugerencias de IA)

### 3.1 Obtener Sugerencias Activas
```
GET /api/v1/suggestions
Query params: ?founderId={id}&type={hook|format|timing|all}&limit={number}
```
**Response:**
```json
{
  "suggestions": [
    {
      "id": "string",
      "type": "hook | format | timing | trend | strategy",
      "title": "string",
      "content": "string",
      "confidence": "number (0-100)",
      "source": "trend_analysis | brand_context | performance_data",
      "createdAt": "ISO date",
      "expiresAt": "ISO date | null"
    }
  ]
}
```

### 3.2 Generar Nuevas Sugerencias
```
POST /api/v1/suggestions/generate
```
**Body:**
```json
{
  "founderId": "string",
  "sessionId": "string",
  "context": "campaign | general | specific_pillar",
  "pillar": "string | null"
}
```

### 3.3 Marcar Sugerencia como Usada/Descartada
```
PUT /api/v1/suggestions/{suggestionId}
```
**Body:**
```json
{
  "action": "used | dismissed | saved"
}
```

---

## 4. BRAND PROFILE (Perfil de Marca)

### 4.1 Obtener Perfil de Marca
```
GET /api/v1/founder/{founderId}/brand-profile
```
**Response:**
```json
{
  "brandProfile": {
    "businessName": "string",
    "industry": "string",
    "niche": "string",
    "positioning": "string",
    "targetAudience": {
      "demographics": "string",
      "psychographics": "string",
      "painPoints": ["string"]
    },
    "brandVoice": {
      "tone": "string",
      "personality": ["string"],
      "keywords": ["string"]
    },
    "contentStrategy": {
      "pillars": ["string"],
      "angles": ["string"],
      "postsPerWeek": "number",
      "bestDays": ["string"],
      "involvementLevel": "string"
    },
    "competitors": ["string"],
    "goals": ["string"],
    "completedAt": "ISO date"
  }
}
```

### 4.2 Actualizar Perfil de Marca
```
PUT /api/v1/founder/{founderId}/brand-profile
```
**Body:** Campos específicos a actualizar

---

## 5. CURRENT TRENDS (Tendencias Actuales)

### 5.1 Obtener Tendencias del Nicho
```
GET /api/v1/trends
Query params: ?founderId={id}&niche={string}&platform={string}&limit={number}
```
**Response:**
```json
{
  "trends": [
    {
      "id": "string",
      "title": "string",
      "description": "string",
      "platform": "string",
      "category": "format | topic | hashtag | sound | style",
      "engagementScore": "number",
      "growthRate": "number (percentage)",
      "relevanceScore": "number (0-100)",
      "examples": ["string (URLs)"],
      "suggestedAction": "string",
      "detectedAt": "ISO date",
      "peakEstimate": "ISO date | null"
    }
  ],
  "lastUpdated": "ISO date"
}
```

### 5.2 Analizar Tendencia Específica
```
POST /api/v1/trends/analyze
```
**Body:**
```json
{
  "founderId": "string",
  "trendId": "string",
  "action": "deep_dive | create_content | save_for_later"
}
```

---

## 6. STRATEGY (Estrategia)

### 6.1 Obtener Estrategia Actual
```
GET /api/v1/founder/{founderId}/strategy
```
**Response:**
```json
{
  "strategy": {
    "overview": "string",
    "goals": [
      {
        "id": "string",
        "title": "string",
        "targetMetric": "string",
        "currentValue": "number",
        "targetValue": "number",
        "deadline": "ISO date"
      }
    ],
    "contentMix": {
      "pillars": [
        {
          "name": "string",
          "percentage": "number",
          "postsPerWeek": "number"
        }
      ]
    },
    "platforms": [
      {
        "name": "string",
        "priority": "primary | secondary",
        "postsPerWeek": "number"
      }
    ],
    "kpis": [
      {
        "metric": "string",
        "current": "number",
        "target": "number",
        "trend": "up | down | stable"
      }
    ],
    "nextReview": "ISO date"
  }
}
```

### 6.2 Actualizar Objetivos de Estrategia
```
PUT /api/v1/founder/{founderId}/strategy/goals
```

### 6.3 Solicitar Revisión de Estrategia a Marnee
```
POST /api/v1/marnee/strategy/review
```
**Body:**
```json
{
  "founderId": "string",
  "sessionId": "string",
  "focusArea": "content_mix | platforms | goals | full_review"
}
```

---

## 7. ANALYTICS (Métricas - Futuro)

### 7.1 Dashboard Overview
```
GET /api/v1/analytics/overview
Query params: ?founderId={id}&period={7d|30d|90d}
```
**Response:**
```json
{
  "overview": {
    "totalPosts": "number",
    "postsThisPeriod": "number",
    "avgEngagement": "number",
    "topPerformingPillar": "string",
    "completedTasks": "number",
    "activeCampaigns": "number"
  }
}
```

---

## Decisiones de Arquitectura

### Opción A: API Java directa a BDD
```
Frontend → Java API → PostgreSQL/MySQL
```
- **Pros:** Más simple, menos latencia
- **Contras:** Lógica de negocio en Java

### Opción B: API Java + Marnee para consultas inteligentes
```
Frontend → Java API → Marnee (IA) → BDD
                   ↘ BDD (consultas directas)
```
- **Pros:** Sugerencias más inteligentes, contexto de IA
- **Contras:** Mayor complejidad, latencia variable

### Recomendación:
- **Datos CRUD simples** (campaigns, tasks): Java API → BDD directamente
- **Sugerencias y análisis** (suggestions, trends, strategy review): Java API → Marnee → BDD

---

## Prioridad de Implementación

| Prioridad | Endpoint | Razón |
|-----------|----------|-------|
| 🔴 Alta | GET /campaigns | Necesario para mostrar lista |
| 🔴 Alta | GET /tasks | Necesario para pending tasks |
| 🔴 Alta | PUT /tasks/{id} | Para marcar tareas completadas |
| 🟡 Media | GET /suggestions | Para sugerencias de IA |
| 🟡 Media | GET /brand-profile | Para pestaña Brand Profile |
| 🟢 Baja | GET /trends | Para pestaña Current Trends |
| 🟢 Baja | GET /strategy | Para pestaña Strategy |
| 🟢 Baja | Analytics | Fase posterior |

---

## Notas para Backend

1. Todos los endpoints deben validar `founderId` contra el token de sesión
2. Implementar paginación para listas largas (campaigns, tasks)
3. Considerar cache para trends (actualizar cada 6-12 horas)
4. Las sugerencias de IA pueden tener TTL (time to live)
5. Brand profile se genera desde el cuestionario inicial

---

*Documento creado: Febrero 2026*
*Última actualización: Pendiente*
