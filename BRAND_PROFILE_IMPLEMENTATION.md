# Brand Profile - Implementación Frontend

## Resumen

Implementación completa de la sección de Brand Profile en el Dashboard de Marnee. Esta sección utiliza datos dinámicos generados por IA basados en:
- Tests completados por el usuario
- Conversaciones con Marnee en el chat
- Datos del calendario de contenido
- Perfil del founder
- Otros datos disponibles en la BDD

## Arquitectura

La implementación sigue el mismo patrón usado en **Campaigns** para mantener consistencia y separación de responsabilidades:

```
Frontend Structure:
├── services/brandProfileApi.js          # API service layer
├── hooks/useBrandProfile.js             # Custom hook for state management
├── Pages/Tools/MyDashboardSections/
│   ├── BrandProfileSection.jsx          # Main section component
│   └── BrandProfile/                    # Modular components
│       ├── BrandAssessmentCard.jsx
│       ├── BrandPurposeCard.jsx
│       ├── BrandVoiceCard.jsx
│       ├── BrandStoryCard.jsx
│       ├── ContentPillarsCard.jsx
│       ├── UploadGuidelinesCard.jsx
│       ├── BrandRecommendationsCard.jsx
│       ├── ProgressBar.jsx
│       └── PillarCard.jsx
```

## Componentes Creados

### 1. Servicio API (`brandProfileApi.js`)

**Endpoints implementados:**

```javascript
// GET brand profile by founder ID
getBrandProfileByFounder(founderId)

// Generate/Regenerate full brand profile
generateBrandProfile({ founderId, sessionId })

// Regenerate specific section
regenerateBrandProfileSection({ founderId, section })

// Update brand profile
updateBrandProfile(founderId, data)

// Upload brand guidelines (Coming soon)
uploadBrandGuidelines(founderId, file)

// Get uploaded guidelines
getBrandGuidelines(founderId)

// Delete guidelines
deleteBrandGuidelines(guidelineId)
```

### 2. Hook Personalizado (`useBrandProfile.js`)

**Estados manejados:**
- `brandProfile`: Datos del perfil de marca
- `loading`: Estado de carga inicial
- `error`: Errores de API
- `generating`: Estado de generación completa
- `regeneratingSection`: Sección siendo regenerada

**Funciones exportadas:**
- `fetchBrandProfile()`: Obtener perfil existente
- `generateBrandProfile()`: Generar perfil completo con IA
- `updateBrandProfile(data)`: Actualizar perfil
- `regenerateSection(section)`: Regenerar sección específica
- `uploadGuidelines(file)`: Subir archivo de guidelines
- `fetchGuidelines()`: Obtener guidelines subidas
- `deleteGuidelines(id)`: Eliminar guidelines

### 3. Componentes Modulares

Todos los componentes están separados en archivos individuales para facilitar mantenimiento:

#### `BrandAssessmentCard.jsx`
- Score circular con gradiente
- Métricas de progreso (Purpose Clarity, Voice Consistency, Visual Identity)
- Mensaje de feedback personalizado

**Props:**
```javascript
{
  score: number,           // Default: 87
  metrics: Array,          // [{ label, value }]
  message: string          // Mensaje de feedback
}
```

#### `BrandPurposeCard.jsx`
- Purpose statement
- Market positioning tags
- Botón de regeneración

**Props:**
```javascript
{
  purposeStatement: string,
  marketPosition: Array,    // ["Tag 1", "Tag 2", ...]
  onRegenerate: function
}
```

#### `BrandVoiceCard.jsx`
- Visualización hexagonal
- Tone, Style, Personality
- Botón de regeneración

**Props:**
```javascript
{
  tone: string,
  style: string,
  personality: string,
  onRegenerate: function
}
```

#### `BrandStoryCard.jsx`
- Timeline visual con 3 etapas
- Beginning, Mission, Future
- Botón de regeneración

**Props:**
```javascript
{
  story: {
    beginning: { title, content },
    mission: { title, content },
    future: { title, content }
  },
  onRegenerate: function
}
```

#### `ContentPillarsCard.jsx`
- Grid de 4 pilares de contenido
- Cada pilar con título, descripción, porcentaje
- Botón de regeneración

**Props:**
```javascript
{
  pillars: [
    { title, description, percent }
  ],
  onRegenerate: function
}
```

#### `UploadGuidelinesCard.jsx`
- Drag & drop area (actualmente deshabilitado)
- Vista previa de archivo subido
- Marcado como "Coming Soon"

**Props:**
```javascript
{
  uploadedFile: object,
  onUpload: function,
  onDelete: function,
  disabled: boolean        // true por defecto
}
```

#### `BrandRecommendationsCard.jsx`
- Color Palette (Primary + Secondary)
- Typography recommendations
- Visual Style guidelines
- Logo design suggestions
- Botón de regeneración

**Props:**
```javascript
{
  recommendations: {
    colorPalette: { primary: [], secondary: [] },
    typography: [{ font, usage }],
    visualStyle: [{ aspect, value }],
    logoDesigns: []
  },
  onRegenerate: function
}
```

## Estados de UI

La implementación maneja todos los estados necesarios:

1. **Loading**: Skeleton o mensaje de carga
2. **Error**: Banner rojo con mensaje de error
3. **Empty**: Botón para generar perfil por primera vez
4. **Success**: Muestra todos los componentes con datos
5. **Regenerating**: Overlay con spinner mientras regenera sección

## Datos Esperados del Backend

### Estructura de respuesta de `GET /api/v1/founder/{founderId}/brand-profile`

```json
{
  "brandProfile": {
    "assessment": {
      "score": 87,
      "metrics": [
        { "label": "Purpose Clarity", "value": 92 },
        { "label": "Voice Consistency", "value": 85 },
        { "label": "Visual Identity", "value": 78 }
      ],
      "message": "Your brand shows strong potential..."
    },
    "purpose": {
      "statement": "To empower creative professionals...",
      "marketPosition": ["Premium Creative Tools", "Innovation Leader"]
    },
    "voice": {
      "tone": "Confident yet approachable",
      "style": "Clear, inspiring, solution-focused",
      "personality": "Innovative mentor and creative catalyst"
    },
    "story": {
      "beginning": {
        "title": "The Beginning",
        "content": "Born from the frustration..."
      },
      "mission": {
        "title": "The Mission",
        "content": "We set out to bridge..."
      },
      "future": {
        "title": "The Future",
        "content": "Today, we are not just..."
      }
    },
    "pillars": [
      {
        "title": "Innovation Showcase",
        "description": "Latest features, creative techniques...",
        "percent": 30
      }
    ],
    "guidelinesRecommendations": {
      "colorPalette": {
        "primary": ["#9AA7FF", "#D6B4FF", "#FF4DB8"],
        "secondary": ["#FFFFFF", "#E5E7EB", "#111827"]
      },
      "typography": [
        { "font": "SORA BOLD", "usage": "Headlines & Titles" }
      ],
      "visualStyle": [
        { "aspect": "Border Radius", "value": "8px - 12px" }
      ],
      "logoDesigns": ["A", "B", "C"]
    },
    "uploadedGuidelines": null
  }
}
```

## Endpoints Requeridos en Backend

### Alta Prioridad (Para funcionalidad básica)

#### 1. GET `/api/v1/founder/{founderId}/brand-profile`
**Propósito:** Obtener el Brand Profile del founder basado en todos sus datos disponibles.

**Lógica esperada:**
1. Verificar si existe un Brand Profile generado previamente
2. Si no existe, buscar datos de:
   - Tests completados (BrandTest, BusinessTest)
   - Conversaciones con Marnee (Chat history)
   - Calendario de contenido (Posts, campañas)
   - Founder Profile (FounderProfile model)
3. Generar dinámicamente el Brand Profile usando IA
4. Cachear el resultado

**Response:** Ver estructura JSON arriba

#### 2. POST `/api/v1/brand-profile/generate`
**Propósito:** Generar/Regenerar el Brand Profile completo usando IA.

**Body:**
```json
{
  "founderId": "string",
  "sessionId": "string"
}
```

**Lógica esperada:**
1. Recopilar todos los datos del founder
2. Usar OpenAI/Claude para generar cada sección
3. Guardar en BDD
4. Retornar el Brand Profile completo

**Response:** Mismo formato que GET

#### 3. POST `/api/v1/brand-profile/regenerate-section`
**Propósito:** Regenerar solo una sección específica del Brand Profile.

**Body:**
```json
{
  "founderId": "string",
  "section": "purpose | voice | story | pillars | guidelines"
}
```

**Lógica esperada:**
1. Obtener Brand Profile actual
2. Regenerar solo la sección solicitada con IA
3. Actualizar en BDD
4. Retornar la sección actualizada

**Response:**
```json
{
  "purpose": { ... }  // O la sección que se regeneró
}
```

### Media Prioridad (Para funcionalidad completa)

#### 4. PUT `/api/v1/founder/{founderId}/brand-profile`
**Propósito:** Actualizar manualmente campos del Brand Profile.

**Body:** Campos a actualizar

#### 5. POST `/api/v1/brand-profile/guidelines/upload`
**Propósito:** Subir archivo de Brand Guidelines (PDF, DOC, imágenes).

**Body:** FormData con archivo

### Baja Prioridad (Coming Soon)

#### 6. GET `/api/v1/brand-profile/guidelines/{founderId}`
**Propósito:** Obtener archivos de guidelines subidos.

#### 7. DELETE `/api/v1/brand-profile/guidelines/{guidelineId}`
**Propósito:** Eliminar archivo de guidelines.

## Integración de Datos de Marnee

El Brand Profile debe **reciclar** información existente:

### 1. Desde Tests
- BrandTest → `voice`, `purpose`, `story`
- BusinessTest → `purpose`, `marketPosition`

### 2. Desde Chat
- Extraer insights de conversaciones
- Identificar pain points mencionados
- Detectar objetivos del negocio

### 3. Desde Calendar
- Analizar content pillars usados
- Identificar temas recurrentes
- Extraer el `angle` de posts exitosos

### 4. Desde FounderProfile
- Usar personalidad del founder para `voice`
- Usar valores personales para `purpose`
- Usar historia personal para `story`

## Prompt de IA Sugerido

Para generar cada sección, usar un prompt estructurado:

```python
def generate_brand_profile_section(founder_data, section):
    """
    founder_data incluye:
    - brand_test_results
    - business_test_results
    - chat_history
    - calendar_posts
    - founder_profile
    """

    system_prompt = f"""
    You are a senior brand strategist creating a comprehensive Brand Profile.

    Analyze ALL available data about the founder and their business:
    - Brand personality test results
    - Business positioning test results
    - Previous conversations with Marnee
    - Content calendar and past posts
    - Founder's personal profile and values

    Based on this data, generate the {section} section of their Brand Profile.

    Guidelines:
    - Be specific and actionable
    - Reference actual data points when possible
    - Maintain consistency across all sections
    - Write in a professional yet approachable tone
    """

    # Usar OpenAI/Claude para generar
    return ai_generated_section
```

## Configuración del Proyecto

### Variables de Entorno

```bash
REACT_APP_API_MARNEE=http://127.0.0.1:8000
```

### Dependencias

No se requieren nuevas dependencias. Todo usa:
- React hooks estándar
- Framer Motion (ya instalado)
- Fetch API nativo

## Testing

### Testing Manual

1. **Empty State**
   - Ir a My Dashboard → Brand Profile
   - Verificar que aparece "No Brand Profile Yet"
   - Click en "Generate Brand Profile with AI"

2. **Loading State**
   - Verificar spinner durante generación

3. **Success State**
   - Verificar que todas las tarjetas se muestran con datos
   - Verificar que "Upload Guidelines" está deshabilitado

4. **Regenerate Section**
   - Click en botón "Regenerate" de cualquier tarjeta
   - Verificar overlay de carga
   - Verificar que solo esa sección se actualiza

5. **Error Handling**
   - Simular error de API
   - Verificar banner rojo con mensaje

## Próximos Pasos

### Backend
1. [ ] Implementar endpoint `GET /api/v1/founder/{founderId}/brand-profile`
2. [ ] Implementar endpoint `POST /api/v1/brand-profile/generate`
3. [ ] Implementar endpoint `POST /api/v1/brand-profile/regenerate-section`
4. [ ] Crear función de IA para generar cada sección
5. [ ] Implementar lógica de reciclaje de datos existentes
6. [ ] Cachear Brand Profile generado

### Frontend
1. [x] Crear servicio API
2. [x] Crear hook personalizado
3. [x] Crear componentes modulares
4. [x] Integrar con MyDashboard
5. [ ] Testing con datos reales del backend
6. [ ] Ajustes de UX según feedback

### Futuro (Coming Soon)
- [ ] Implementar upload de Brand Guidelines
- [ ] Permitir edición manual de secciones
- [ ] Exportar Brand Profile como PDF
- [ ] Historial de versiones del Brand Profile

## Notas Importantes

1. **Separación de Responsabilidades**: Cada componente es independiente y reutilizable
2. **Fallback a Datos Dummy**: Si no hay datos del backend, se muestran datos de ejemplo
3. **Performance**: Hook usa `useCallback` y `useEffect` para optimizar re-renders
4. **Accesibilidad**: Todos los estados (loading, error, empty) tienen mensajes claros
5. **Consistencia**: Sigue el mismo patrón que Campaigns para mantener código predecible

## Contacto

Para dudas sobre la implementación, revisar:
- `PENDING_ENDPOINTS.md` - Documentación de endpoints
- `src/hooks/useCampaigns.js` - Patrón de referencia
- `src/services/campaignsApi.js` - Patrón de API service

---

*Documento creado: Abril 2026*
*Última actualización: Abril 2026*
