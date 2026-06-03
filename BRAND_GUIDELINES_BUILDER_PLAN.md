# Plan de Integración: Brand Guidelines Builder

## Resumen Ejecutivo

Crear una herramienta interactiva donde Marnee guía al usuario a través de una serie de preguntas para diseñar sus Brand Guidelines desde cero. El resultado será un documento estructurado que se guardará automáticamente y estará disponible para la generación de contenido personalizado.

---

## Arquitectura General

```
┌─────────────────────────────────────────────────────────────────┐
│                    BRAND GUIDELINES BUILDER                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────────┐  │
│  │   FRONTEND   │───▶│   BACKEND    │───▶│  MARNEE AI       │  │
│  │              │    │              │    │                  │  │
│  │ Multi-step   │    │ Session      │    │ Question gen     │  │
│  │ Wizard       │◀───│ Management   │◀───│ Content polish   │  │
│  │              │    │              │    │ Suggestions      │  │
│  └──────────────┘    └──────────────┘    └──────────────────┘  │
│          │                   │                    │              │
│          ▼                   ▼                    ▼              │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              business_tests.brand_guidelines_content      │  │
│  │                    (Mismo campo existente)                │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Secciones del Brand Guidelines Builder

### Fase 1: Identidad de Marca (Brand Identity)
**Preguntas guiadas por Marnee:**

1. **Nombre y Esencia**
   - ¿Cuál es el nombre de tu marca?
   - ¿Qué significa o representa este nombre?
   - ¿Tiene alguna historia detrás?

2. **Misión y Visión**
   - ¿Cuál es el propósito principal de tu marca? (Misión)
   - ¿Dónde quieres que esté tu marca en 5 años? (Visión)

3. **Valores de Marca**
   - ¿Cuáles son los 3-5 valores que definen a tu marca?
   - ¿Por qué son importantes estos valores para ti?

4. **Personalidad de Marca**
   - Si tu marca fuera una persona, ¿cómo la describirías?
   - Selecciona adjetivos: Profesional, Amigable, Innovadora, Tradicional, Audaz, etc.

---

### Fase 2: Audiencia Objetivo (Target Audience)

5. **Cliente Ideal**
   - ¿Quién es tu cliente ideal? (Edad, género, ubicación, ocupación)
   - ¿Cuáles son sus problemas o necesidades principales?
   - ¿Qué les motiva a comprar?

6. **Conexión Emocional**
   - ¿Qué emociones quieres que sienta tu cliente al interactuar con tu marca?
   - ¿Cómo quieres que te recuerden?

---

### Fase 3: Identidad Visual (Visual Identity)

7. **Colores de Marca**
   - ¿Tienes colores actuales? (Color picker o input HEX)
   - ¿Qué emociones/valores quieres transmitir con tus colores?
   - *Marnee sugiere paleta basada en respuestas anteriores*

8. **Tipografía**
   - ¿Qué estilo de tipografía te representa? (Moderna, Clásica, Manuscrita, etc.)
   - ¿Tienes fuentes actuales que usas?
   - *Marnee sugiere combinaciones de fuentes*

9. **Logo y Elementos Gráficos**
   - ¿Tienes un logo actual? (Opción de subir imagen)
   - ¿Qué elementos visuales te gustan? (Minimalista, Detallado, Geométrico, etc.)
   - ¿Usas iconos, patrones o ilustraciones específicos?

---

### Fase 4: Voz y Tono (Brand Voice)

10. **Estilo de Comunicación**
    - ¿Cómo habla tu marca? (Formal/Informal, Técnico/Simple)
    - ¿Tuteas o hablas de usted a tus clientes?
    - ¿Usas humor? ¿Emojis?

11. **Palabras Clave y Prohibidas**
    - ¿Qué palabras o frases definen a tu marca?
    - ¿Hay palabras que NUNCA usarías?

12. **Ejemplos de Mensajes**
    - Escribe un mensaje de bienvenida típico
    - Escribe cómo responderías a una queja
    - *Marnee analiza y da feedback*

---

### Fase 5: Aplicación y Consistencia

13. **Uso en Redes Sociales**
    - ¿Qué plataformas usas o planeas usar?
    - ¿Cómo adaptas tu mensaje a cada plataforma?

14. **Materiales de Marketing**
    - ¿Qué tipo de contenido creas? (Posts, videos, emails, etc.)
    - ¿Tienes plantillas actuales?

---

## Implementación Técnica

### Frontend (React)

#### 1. Nueva Página: `BrandGuidelinesBuilderPage.jsx`

```
src/Pages/Tools/BrandGuidelinesBuilderPage.jsx
```

**Características:**
- Wizard multi-paso similar a `InteractiveTest.jsx`
- Chat integrado con Marnee para cada sección
- Previsualización en tiempo real del documento
- Guardado automático de progreso
- Color picker integrado
- Upload de logo opcional

#### 2. Componentes Nuevos

```
src/Component/BrandBuilder/
├── BrandBuilderWizard.jsx       # Wizard principal
├── BrandSection.jsx             # Sección individual
├── ColorPaletteBuilder.jsx      # Selector de colores con sugerencias AI
├── TypographySelector.jsx       # Selector de tipografías
├── VoiceStyleSelector.jsx       # Selector de tono de voz
├── BrandPreview.jsx             # Preview del documento final
├── MarneeGuide.jsx              # Chat contextual de Marnee
└── BrandExport.jsx              # Exportar como PDF/imagen
```

#### 3. Ruta en App.js

```javascript
<Route path="brand-builder" element={<BrandGuidelinesBuilderPage />} />
```

#### 4. Navegación en Navbar.jsx

```javascript
{
  id: "brand-builder",
  label: "Brand Builder",
  icon: "palette", // o "brush"
  path: "/app/brand-builder"
}
```

---

### Backend (Python/FastAPI)

#### 1. Nuevo Router: `brand_builder.py`

```
app/routers/brand_builder.py
```

**Endpoints:**

```python
# Iniciar o continuar sesión de Brand Builder
POST /api/v1/brand-builder/session
Request: { founderId, sessionId? }
Response: { sessionId, currentPhase, progress, savedData }

# Guardar respuestas de una fase
POST /api/v1/brand-builder/phase/{phase_number}
Request: { sessionId, answers: {...} }
Response: { success, nextPhase, marneeResponse }

# Obtener sugerencias de Marnee para una sección
POST /api/v1/brand-builder/suggest
Request: { sessionId, section: "colors"|"typography"|"voice", context }
Response: { suggestions: [...], explanation }

# Generar documento final
POST /api/v1/brand-builder/generate
Request: { sessionId }
Response: { brandGuidelinesContent, preview }

# Obtener estado actual
GET /api/v1/brand-builder/session/{session_id}
Response: { phase, progress, savedData, generatedContent }
```

#### 2. Nueva Tabla: `brand_builder_sessions`

```sql
CREATE TABLE brand_builder_sessions (
    id UUID PRIMARY KEY,
    founder_id UUID REFERENCES founders(id),

    -- Progress tracking
    current_phase INTEGER DEFAULT 1,
    completed_phases INTEGER[] DEFAULT '{}',

    -- Phase 1: Identity
    brand_name VARCHAR(255),
    brand_meaning TEXT,
    brand_story TEXT,
    mission TEXT,
    vision TEXT,
    values TEXT[],
    values_explanation TEXT,
    personality_traits TEXT[],
    personality_description TEXT,

    -- Phase 2: Audience
    target_demographics JSONB,
    target_problems TEXT,
    target_motivations TEXT,
    desired_emotions TEXT[],
    brand_memory TEXT,

    -- Phase 3: Visual
    primary_color VARCHAR(7),      -- HEX
    secondary_colors VARCHAR(7)[],
    color_emotions TEXT,
    typography_style VARCHAR(50),
    primary_font VARCHAR(100),
    secondary_font VARCHAR(100),
    logo_url VARCHAR(500),
    visual_style TEXT[],
    graphic_elements TEXT,

    -- Phase 4: Voice
    communication_style VARCHAR(50),
    formality_level VARCHAR(20),
    uses_humor BOOLEAN,
    uses_emojis BOOLEAN,
    key_phrases TEXT[],
    forbidden_words TEXT[],
    welcome_message_example TEXT,
    complaint_response_example TEXT,

    -- Phase 5: Application
    social_platforms TEXT[],
    platform_adaptations JSONB,
    content_types TEXT[],

    -- Generated content
    generated_guidelines TEXT,     -- El documento final
    ai_suggestions JSONB,          -- Sugerencias guardadas

    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

#### 3. Nuevo Prompt Module: `brand_builder_prompts.py`

```
app/engines/brand_builder_prompts.py
```

**Prompts especializados para:**
- Guiar al usuario en cada sección
- Generar sugerencias de colores basadas en valores/personalidad
- Sugerir combinaciones tipográficas
- Analizar y mejorar ejemplos de voz de marca
- Compilar el documento final

---

### Integración con Sistema Existente

#### 1. Sincronización con `business_tests.brand_guidelines_content`

Cuando el usuario complete el Brand Builder:

```python
# En brand_builder.py
@router.post("/api/v1/brand-builder/generate")
async def generate_brand_guidelines(session_id: str):
    # 1. Obtener datos de la sesión
    session = get_brand_builder_session(session_id)

    # 2. Generar documento con Marnee
    guidelines_content = await marnee_generate_brand_guidelines(session)

    # 3. Guardar en brand_builder_sessions
    save_generated_guidelines(session_id, guidelines_content)

    # 4. SINCRONIZAR con business_tests
    update_business_test_brand_guidelines(
        session.founder_id,
        guidelines_content
    )

    return {"brandGuidelinesContent": guidelines_content}
```

#### 2. Integración con Marnee Chat

El contenido generado se inyecta automáticamente en el prompt de Marnee (ya existe en `_build_business_test_context()`), por lo que una vez generado, Marnee usará las Brand Guidelines para todas las recomendaciones de contenido.

---

## Flujo de Usuario

```
┌─────────────────────────────────────────────────────────────────┐
│                         FLUJO DE USUARIO                        │
└─────────────────────────────────────────────────────────────────┘

1. Usuario accede a "Brand Builder" desde el menú lateral
                          │
                          ▼
2. Marnee da la bienvenida y explica el proceso
   "¡Hola! Vamos a crear tus Brand Guidelines juntos..."
                          │
                          ▼
3. FASE 1: Identidad ───▶ Marnee hace preguntas
   │                      Usuario responde
   │                      Marnee da feedback y sugiere
   │
   ├──▶ Preview actualizado en tiempo real
   │
   ▼
4. FASE 2: Audiencia ───▶ Mismo flujo
   │
   ▼
5. FASE 3: Visual ──────▶ Marnee sugiere colores/tipografías
   │                      basados en personalidad y valores
   │
   ▼
6. FASE 4: Voz ─────────▶ Marnee analiza ejemplos de mensajes
   │                      y da recomendaciones
   │
   ▼
7. FASE 5: Aplicación ──▶ Define uso práctico
   │
   ▼
8. GENERACIÓN FINAL
   │
   ├──▶ Marnee compila todo en un documento estructurado
   ├──▶ Usuario puede editar/ajustar
   ├──▶ Se guarda en el sistema
   └──▶ Disponible para exportar y para uso en Marnee Chat
```

---

## Estructura del Documento Final

El documento generado tendrá esta estructura:

```markdown
# Brand Guidelines: [Nombre de Marca]

## 1. Identidad de Marca
- **Nombre**: [nombre]
- **Historia/Significado**: [texto]
- **Misión**: [texto]
- **Visión**: [texto]
- **Valores**:
  - [valor 1]: [explicación]
  - [valor 2]: [explicación]
- **Personalidad**: [descripción]

## 2. Audiencia Objetivo
- **Cliente Ideal**: [descripción demográfica]
- **Necesidades/Problemas**: [texto]
- **Motivaciones**: [texto]
- **Conexión Emocional**: [emociones deseadas]

## 3. Identidad Visual
- **Colores**:
  - Primario: #XXXXXX (significado)
  - Secundarios: #XXXXXX, #XXXXXX
- **Tipografía**:
  - Títulos: [fuente]
  - Cuerpo: [fuente]
- **Estilo Visual**: [descripción]
- **Elementos Gráficos**: [descripción]

## 4. Voz de Marca
- **Estilo**: [formal/informal]
- **Tono**: [descripción]
- **Palabras Clave**: [lista]
- **Palabras a Evitar**: [lista]
- **Ejemplos de Mensajes**:
  - Bienvenida: [ejemplo]
  - Respuesta a queja: [ejemplo]

## 5. Aplicación
- **Redes Sociales**: [plataformas y adaptaciones]
- **Tipos de Contenido**: [lista]
```

---

## Fases de Desarrollo

### Fase 1: MVP (Funcionalidad Core)
**Tiempo estimado: Primera iteración**

1. **Backend:**
   - Crear tabla `brand_builder_sessions`
   - Endpoints básicos (crear sesión, guardar fase, generar)
   - Prompts básicos de Marnee

2. **Frontend:**
   - Página `BrandGuidelinesBuilderPage.jsx`
   - Wizard básico con 5 fases
   - Formularios de cada fase
   - Integración con API

3. **Integración:**
   - Sincronización con `business_tests.brand_guidelines_content`
   - Verificar que Marnee Chat use las nuevas guidelines

### Fase 2: Mejoras de UX
**Después del MVP**

1. **Color Palette Builder:**
   - Selector de colores visual
   - Sugerencias AI basadas en industria/personalidad
   - Preview de paleta

2. **Typography Selector:**
   - Biblioteca de Google Fonts
   - Sugerencias de combinaciones
   - Preview en tiempo real

3. **Preview en Tiempo Real:**
   - Ver documento mientras se construye
   - Edición inline

### Fase 3: Funcionalidades Avanzadas
**Mejoras continuas**

1. **Exportación:**
   - Exportar como PDF
   - Exportar como imagen/infografía
   - Compartir enlace público

2. **Importación:**
   - Importar de documento existente
   - Marnee analiza y llena campos

3. **Templates:**
   - Plantillas por industria
   - Ejemplos de marcas conocidas (para inspiración)

4. **Colaboración:**
   - Compartir con equipo
   - Comentarios y feedback

---

## API Detallada

### POST /api/v1/brand-builder/session

**Crear o continuar sesión:**

```javascript
// Request
{
  "founderId": "uuid",
  "sessionId": "uuid" // opcional, para continuar
}

// Response
{
  "sessionId": "uuid",
  "currentPhase": 1,
  "progress": {
    "phase1": "incomplete", // incomplete | in_progress | complete
    "phase2": "locked",
    "phase3": "locked",
    "phase4": "locked",
    "phase5": "locked"
  },
  "savedData": {
    "brandName": "Mi Marca",
    // ... datos guardados
  },
  "marneeWelcome": "¡Hola! Estoy emocionada de ayudarte..."
}
```

### POST /api/v1/brand-builder/phase/{phase}

**Guardar respuestas de una fase:**

```javascript
// Request
{
  "sessionId": "uuid",
  "answers": {
    "brandName": "Mi Marca",
    "mission": "Ayudar a emprendedores...",
    "values": ["Innovación", "Transparencia", "Calidad"]
  }
}

// Response
{
  "success": true,
  "phaseComplete": true,
  "nextPhase": 2,
  "marneeResponse": "Excelente trabajo! Tu marca tiene una identidad muy clara...",
  "suggestions": [
    "Considera agregar un valor relacionado con la comunidad",
    "Tu misión podría ser más específica sobre el beneficio"
  ]
}
```

### POST /api/v1/brand-builder/suggest

**Obtener sugerencias de Marnee:**

```javascript
// Request
{
  "sessionId": "uuid",
  "section": "colors",
  "context": {
    "values": ["Innovación", "Confianza"],
    "personality": ["Profesional", "Moderna"],
    "industry": "Tecnología"
  }
}

// Response
{
  "suggestions": [
    {
      "name": "Azul Confianza",
      "hex": "#2563EB",
      "meaning": "Transmite profesionalismo y confianza"
    },
    {
      "name": "Verde Innovación",
      "hex": "#10B981",
      "meaning": "Representa crecimiento e innovación"
    }
  ],
  "explanation": "Basándome en tus valores de Innovación y Confianza, sugiero una paleta con azules profesionales combinados con verde que transmite crecimiento..."
}
```

### POST /api/v1/brand-builder/generate

**Generar documento final:**

```javascript
// Request
{
  "sessionId": "uuid"
}

// Response
{
  "brandGuidelinesContent": "# Brand Guidelines: Mi Marca\n\n## 1. Identidad...",
  "preview": {
    "brandName": "Mi Marca",
    "colors": ["#2563EB", "#10B981"],
    "fonts": ["Poppins", "Inter"],
    "voiceStyle": "Profesional pero cercano"
  },
  "syncedToBusinessTest": true
}
```

---

## Consideraciones de UX

1. **Guardado Automático:**
   - Guardar cada respuesta automáticamente
   - Mostrar indicador "Guardado"

2. **Navegación Flexible:**
   - Permitir ir a fases anteriores para editar
   - Mostrar progreso visual (barra o steps)

3. **Feedback de Marnee:**
   - Respuestas cortas y útiles
   - No abrumar con texto
   - Sugerencias accionables

4. **Preview:**
   - Actualización en tiempo real
   - Fácil de entender visualmente

5. **Mobile-First:**
   - Diseño responsivo
   - Funcional en dispositivos móviles

---

## Archivos a Crear/Modificar

### Frontend (marnee-front)

**Crear:**
- `src/Pages/Tools/BrandGuidelinesBuilderPage.jsx`
- `src/Component/BrandBuilder/BrandBuilderWizard.jsx`
- `src/Component/BrandBuilder/PhaseNavigation.jsx`
- `src/Component/BrandBuilder/BrandPreview.jsx`
- `src/Component/BrandBuilder/ColorPaletteBuilder.jsx`
- `src/Component/BrandBuilder/MarneeGuide.jsx`

**Modificar:**
- `src/App.js` - Agregar ruta
- `src/Component/Navbar/Navbar.jsx` - Agregar navegación
- `src/services/api.js` - Agregar endpoints

### Backend (dnhubAI)

**Crear:**
- `app/routers/brand_builder.py`
- `app/models/brand_builder.py`
- `app/engines/brand_builder_prompts.py`
- `database/migrations/add_brand_builder_sessions.sql`

**Modificar:**
- `app/main.py` - Registrar router
- `app/engines/marnee_prompts.py` - Integrar nuevo contenido si es necesario

---

## Métricas de Éxito

1. **Completitud:** % de usuarios que completan todas las fases
2. **Tiempo:** Tiempo promedio para completar el proceso
3. **Satisfacción:** Rating del documento generado
4. **Uso:** % de usuarios que usan las guidelines generadas en Marnee Chat
5. **Retención:** Impacto en retención de usuarios

---

## Notas Finales

Este Brand Guidelines Builder no pretende competir con herramientas especializadas de branding, sino ofrecer una solución práctica y accesible para emprendedores que:

1. No tienen Brand Guidelines
2. No pueden pagar un diseñador/agencia
3. Necesitan algo básico para empezar

Marnee actuará como guía, educando al usuario sobre la importancia de cada elemento mientras los ayuda a construir su identidad de marca paso a paso.

El documento resultante será útil para:
- Mantener consistencia en el contenido
- Dar contexto a Marnee para mejores recomendaciones
- Servir como punto de partida para profesionales de branding en el futuro

---

## Arquitectura de AI/ML Recomendada

### Estrategia de Implementación por Capas

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                     ARQUITECTURA AI PARA BRAND BUILDER                       │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  CAPA 1: PROMPT ENGINEERING (MVP - Ya tienes OpenAI)                        │
│  ├── Sistema de prompts especializados por sección                          │
│  ├── Few-shot examples de brand guidelines exitosos                         │
│  └── Context injection con datos del usuario                                │
│                                                                              │
│  CAPA 2: RAG (Retrieval Augmented Generation)                               │
│  ├── Knowledge base de brand guidelines ejemplares                          │
│  ├── Embeddings de psicología del color/tipografía                         │
│  └── Retrieval de ejemplos por industria/personalidad                       │
│                                                                              │
│  CAPA 3: HERRAMIENTAS ESPECIALIZADAS (APIs Externas)                        │
│  ├── Color AI (Khroma, ColorMind)                                           │
│  ├── Typography AI (Monotype, Fontjoy)                                      │
│  └── Image Generation (GPT-4o Vision, DALL-E 3)                             │
│                                                                              │
│  CAPA 4: FINE-TUNING (Futuro - Opcional)                                    │
│  └── Modelo fine-tuned para voz de marca consistente                        │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

### CAPA 1: Prompt Engineering Avanzado (MVP)

#### Componentes del Sistema de Prompts

```python
# brand_builder_prompts.py

BRAND_BUILDER_SYSTEM_PROMPT = """
Eres Marnee, una experta en branding y estrategia de marca con más de 15 años
de experiencia ayudando a emprendedores a construir identidades de marca memorables.

Tu rol es guiar al usuario paso a paso para crear sus Brand Guidelines,
haciendo preguntas estratégicas y ofreciendo sugerencias basadas en sus respuestas.

## Tu Enfoque:
1. Haces UNA pregunta a la vez (máximo 2 relacionadas)
2. Explicas brevemente POR QUÉ cada elemento es importante
3. Das ejemplos concretos cuando es útil
4. Ofreces sugerencias basadas en lo que el usuario ya compartió
5. Validas y refuerzas las buenas decisiones del usuario

## Conocimiento Especializado:
- Psicología del color y su impacto en percepción de marca
- Principios de tipografía y legibilidad
- Arquetipos de marca (Hero, Sage, Explorer, etc.)
- Tono de voz y comunicación de marca
- Mejores prácticas de branding digital
"""

# Few-shot examples para cada sección
COLOR_PSYCHOLOGY_EXAMPLES = """
## Ejemplos de Paletas por Industria/Personalidad:

### Tecnología + Innovación:
- Primario: #2563EB (Azul eléctrico) - Confianza, tecnología
- Secundario: #10B981 (Verde esmeralda) - Crecimiento, innovación
- Acento: #F59E0B (Ámbar) - Energía, optimismo

### Salud + Bienestar:
- Primario: #059669 (Verde bosque) - Naturaleza, salud
- Secundario: #0EA5E9 (Azul cielo) - Calma, confianza
- Acento: #F97316 (Naranja cálido) - Vitalidad, energía

### Lujo + Premium:
- Primario: #1F2937 (Negro suave) - Elegancia, sofisticación
- Secundario: #D4AF37 (Dorado) - Prestigio, calidad
- Acento: #F5F5F4 (Blanco perla) - Pureza, minimalismo

### Creatividad + Arte:
- Primario: #7C3AED (Violeta) - Creatividad, imaginación
- Secundario: #EC4899 (Rosa vibrante) - Pasión, expresión
- Acento: #14B8A6 (Turquesa) - Originalidad, frescura
"""

TYPOGRAPHY_PAIRING_EXAMPLES = """
## Combinaciones Tipográficas Recomendadas:

### Moderno + Profesional:
- Títulos: Poppins (Bold)
- Cuerpo: Inter (Regular)
- Por qué: Combina geometría moderna con excelente legibilidad

### Elegante + Clásico:
- Títulos: Playfair Display (Bold)
- Cuerpo: Lato (Regular)
- Por qué: Serif con personalidad + sans-serif limpia

### Amigable + Accesible:
- Títulos: Nunito (Bold)
- Cuerpo: Open Sans (Regular)
- Por qué: Formas redondeadas que transmiten calidez

### Minimalista + Tech:
- Títulos: Space Grotesk (Medium)
- Cuerpo: IBM Plex Sans (Regular)
- Por qué: Inspiración técnica con claridad absoluta
"""
```

#### Técnicas de Prompt Engineering

1. **Chain-of-Thought (CoT)**: Marnee "piensa en voz alta" antes de dar sugerencias
2. **Few-Shot Learning**: Incluir 3-5 ejemplos de brand guidelines exitosos
3. **Constitutional AI**: Reglas claras sobre qué sugerir y qué evitar
4. **Dynamic Context**: Inyectar respuestas anteriores del usuario

```python
def build_color_suggestion_prompt(user_context: dict) -> str:
    return f"""
    Basándome en la información del usuario:

    - Valores de marca: {user_context['values']}
    - Personalidad: {user_context['personality']}
    - Industria: {user_context['industry']}
    - Audiencia: {user_context['target_audience']}
    - Emociones deseadas: {user_context['desired_emotions']}

    Voy a sugerir una paleta de colores siguiendo este proceso:

    1. Analizar qué emociones necesitan transmitir los colores
    2. Considerar las convenciones de la industria (sin ser genérico)
    3. Asegurar suficiente contraste para accesibilidad
    4. Crear armonía entre los colores elegidos

    Mi sugerencia de paleta:
    """
```

---

### CAPA 2: RAG (Retrieval Augmented Generation)

#### Arquitectura RAG para Brand Guidelines

```
┌─────────────────────────────────────────────────────────────────┐
│                    RAG PIPELINE                                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────┐     ┌──────────────┐     ┌──────────────┐    │
│  │  KNOWLEDGE   │────▶│  EMBEDDINGS  │────▶│   VECTOR     │    │
│  │    BASE      │     │   (OpenAI)   │     │    STORE     │    │
│  └──────────────┘     └──────────────┘     └──────────────┘    │
│         │                                          │            │
│         ▼                                          ▼            │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ 1. Brand Guidelines ejemplares (50-100 documentos)       │  │
│  │ 2. Psicología del color (artículos, estudios)            │  │
│  │ 3. Teoría tipográfica (guías, best practices)            │  │
│  │ 4. Arquetipos de marca (12 arquetipos + ejemplos)        │  │
│  │ 5. Case studies por industria                            │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
│                           │                                      │
│                           ▼                                      │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              RETRIEVAL + GENERATION                       │  │
│  │                                                           │  │
│  │  Query: "Colores para marca de tecnología innovadora"    │  │
│  │                           │                               │  │
│  │                           ▼                               │  │
│  │  Retrieved: [3-5 documentos relevantes]                  │  │
│  │                           │                               │  │
│  │                           ▼                               │  │
│  │  GPT-4 + Context → Sugerencia personalizada              │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

#### Implementación con tu Stack Actual

```python
# services/brand_rag_service.py

from openai import OpenAI
import numpy as np

class BrandRAGService:
    """
    Servicio RAG para sugerencias de branding.
    Usa el mismo patrón que MarneeRAGService existente.
    """

    def __init__(self):
        self.client = OpenAI()
        self.embedding_model = "text-embedding-3-small"  # Más económico
        # self.embedding_model = "text-embedding-3-large"  # Más preciso

    async def get_color_suggestions(self, user_context: dict) -> dict:
        """
        Obtiene sugerencias de colores usando RAG.
        """
        # 1. Crear query basada en contexto del usuario
        query = self._build_color_query(user_context)

        # 2. Recuperar documentos relevantes
        relevant_docs = await self._retrieve_documents(
            query=query,
            collection="color_psychology",
            top_k=5
        )

        # 3. Generar sugerencia con contexto enriquecido
        suggestion = await self._generate_with_context(
            user_context=user_context,
            retrieved_docs=relevant_docs,
            task="color_palette"
        )

        return suggestion

    async def get_typography_suggestions(self, user_context: dict) -> dict:
        """Similar para tipografía."""
        pass

    async def get_voice_suggestions(self, user_context: dict) -> dict:
        """Similar para tono de voz."""
        pass
```

#### Knowledge Base a Construir

| Colección | Contenido | Fuentes |
|-----------|-----------|---------|
| `color_psychology` | Teoría del color, significados culturales, casos de uso | Artículos académicos, Bynder, Canva |
| `typography_theory` | Categorías de fuentes, legibilidad, pairings | Google Fonts, Typewolf, Fonts in Use |
| `brand_archetypes` | 12 arquetipos de Jung aplicados a branding | "The Hero and the Outlaw" |
| `industry_examples` | Brand guidelines por industria | Ejemplos públicos de marcas |
| `voice_guidelines` | Guías de tono de voz y comunicación | Mailchimp, Shopify style guides |

---

### CAPA 3: APIs y Herramientas Especializadas

#### 3.1 Generación de Paletas de Color

**Opción A: Khroma API (Recomendado)**
```python
# Khroma usa ML para aprender preferencias de color
# https://www.khroma.co/

class KhromaColorService:
    """
    Servicio para generar paletas usando algoritmos de ML
    entrenados en paletas humanas exitosas.
    """

    async def generate_palette(
        self,
        seed_colors: list[str] = None,
        emotions: list[str] = None,
        industry: str = None
    ) -> dict:
        # Genera paleta basada en inputs
        pass
```

**Opción B: ColorMind AI**
```python
# ColorMind usa deep learning para paletas armoniosas
# http://colormind.io/api/

import requests

def get_colormind_palette(model: str = "default") -> list:
    """
    Genera paleta usando el modelo de ColorMind.
    Modelos disponibles: default, ui, metroid, zelda, etc.
    """
    response = requests.post(
        "http://colormind.io/api/",
        json={"model": model}
    )
    return response.json()["result"]
```

**Opción C: Implementación Propia con OpenAI**
```python
async def generate_color_palette_with_gpt(context: dict) -> dict:
    """
    Usa GPT-4 con conocimiento de teoría del color.
    Más flexible pero menos especializado.
    """
    prompt = f"""
    Genera una paleta de 5 colores para una marca con estas características:

    Industria: {context['industry']}
    Valores: {context['values']}
    Personalidad: {context['personality']}
    Audiencia: {context['target_audience']}

    Responde en JSON con este formato:
    {{
        "palette": [
            {{"name": "Nombre descriptivo", "hex": "#XXXXXX", "role": "primary|secondary|accent", "meaning": "Por qué este color"}}
        ],
        "rationale": "Explicación de la armonía general"
    }}
    """

    response = await openai_client.chat.completions.create(
        model="gpt-4o",
        messages=[{"role": "user", "content": prompt}],
        response_format={"type": "json_object"}
    )

    return json.loads(response.choices[0].message.content)
```

#### 3.2 Sugerencias de Tipografía

**Opción A: Fontjoy (ML para Pairings)**
```python
# Fontjoy usa deep learning para combinaciones tipográficas
# https://fontjoy.com/

# No tiene API pública, pero podemos replicar la lógica:
FONT_PAIRINGS_DATABASE = {
    "modern_professional": {
        "heading": ["Poppins", "Montserrat", "Raleway"],
        "body": ["Inter", "Open Sans", "Roboto"]
    },
    "elegant_classic": {
        "heading": ["Playfair Display", "Cormorant", "Libre Baskerville"],
        "body": ["Lato", "Source Sans Pro", "Nunito"]
    },
    # ... más categorías
}
```

**Opción B: Google Fonts API + ML**
```python
from google.fonts import get_font_metadata

async def suggest_typography(personality: list, industry: str) -> dict:
    """
    Sugiere tipografías basadas en personalidad e industria.
    """
    # Mapeo de personalidad a características tipográficas
    type_features = {
        "profesional": {"category": "sans-serif", "weight": "regular"},
        "creativo": {"category": "display", "weight": "bold"},
        "elegante": {"category": "serif", "weight": "light"},
        "amigable": {"category": "sans-serif", "roundness": "high"},
    }

    # Buscar fuentes que coincidan
    matched_fonts = await search_google_fonts(type_features[personality[0]])

    return {
        "heading": matched_fonts["display"][:3],
        "body": matched_fonts["text"][:3],
        "accent": matched_fonts["handwriting"][:2]
    }
```

#### 3.3 Generación Visual (Mood Boards, Logos)

**GPT-4o Vision + DALL-E 3**
```python
async def generate_mood_board(brand_context: dict) -> str:
    """
    Genera un mood board visual basado en el contexto de marca.
    """
    prompt = f"""
    Crea un mood board minimalista para una marca con estas características:

    Nombre: {brand_context['name']}
    Industria: {brand_context['industry']}
    Valores: {', '.join(brand_context['values'])}
    Colores: {', '.join(brand_context['colors'])}
    Personalidad: {brand_context['personality']}

    El mood board debe incluir:
    - Texturas y patrones sutiles
    - Ejemplos de fotografía de marca
    - Elementos gráficos abstractos
    - Composición equilibrada y profesional

    Estilo: Collage editorial moderno, fondo limpio
    """

    response = await openai_client.images.generate(
        model="dall-e-3",
        prompt=prompt,
        size="1024x1024",
        quality="hd"
    )

    return response.data[0].url
```

---

### CAPA 4: Fine-Tuning (Futuro)

#### Cuándo Considerar Fine-Tuning

| Escenario | Usar Prompting/RAG | Usar Fine-Tuning |
|-----------|-------------------|------------------|
| MVP inicial | ✅ | ❌ |
| Menos de 1000 usuarios | ✅ | ❌ |
| Consistencia de voz crítica | ⚠️ | ✅ |
| Presupuesto limitado | ✅ | ❌ |
| Necesidad de personalización extrema | ❌ | ✅ |

#### Proceso de Fine-Tuning

```python
# 1. Recopilar datos de entrenamiento
training_data = [
    {
        "messages": [
            {"role": "system", "content": "Eres Marnee, experta en branding..."},
            {"role": "user", "content": "Necesito colores para mi marca de yoga"},
            {"role": "assistant", "content": "Para una marca de yoga, recomiendo..."}
        ]
    },
    # ... 50-100 ejemplos de alta calidad
]

# 2. Subir dataset a OpenAI
file = client.files.create(
    file=open("brand_training_data.jsonl", "rb"),
    purpose="fine-tune"
)

# 3. Crear fine-tuning job
job = client.fine_tuning.jobs.create(
    training_file=file.id,
    model="gpt-4o-mini-2024-07-18"  # Modelo base
)

# 4. Usar modelo fine-tuned
response = client.chat.completions.create(
    model="ft:gpt-4o-mini-2024-07-18:your-org::job-id",
    messages=[...]
)
```

---

### Herramientas Externas Recomendadas

#### Para Integrar Ahora (MVP)

| Herramienta | Uso | Costo | Integración |
|-------------|-----|-------|-------------|
| **OpenAI GPT-4o** | Generación de texto, sugerencias | ~$0.01/1K tokens | Ya tienes ✅ |
| **OpenAI Embeddings** | RAG para knowledge base | ~$0.0001/1K tokens | API directa |
| **DALL-E 3** | Mood boards, elementos visuales | ~$0.04/imagen | API directa |

#### Para Fase 2 (Mejoras)

| Herramienta | Uso | Costo | Integración |
|-------------|-----|-------|-------------|
| **Khroma** | Paletas de color ML | Gratis (web) | Scraping o replicar |
| **Fontjoy** | Pairings tipográficos | Gratis | Replicar lógica |
| **Coolors API** | Generador de paletas | Freemium | REST API |

#### Para Fase 3 (Avanzado)

| Herramienta | Uso | Costo | Integración |
|-------------|-----|-------|-------------|
| **KREA AI** | Brand guidelines visuales | $24/mes | API |
| **Midjourney** | Mood boards premium | $10/mes | Discord bot |
| **Typeface.ai** | Brand kits enterprise | Enterprise | API |

---

### Arquitectura Técnica Final Recomendada

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        BRAND BUILDER - ARQUITECTURA AI                       │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  FRONTEND                          BACKEND                                   │
│  ┌─────────────────┐              ┌─────────────────────────────────────┐   │
│  │                 │              │                                     │   │
│  │  Brand Builder  │─────────────▶│  FastAPI                           │   │
│  │  Wizard (React) │              │  ├── /brand-builder/*              │   │
│  │                 │              │  │                                 │   │
│  │  - Phases UI    │              │  └── Services:                     │   │
│  │  - Color Picker │◀─────────────│      ├── BrandBuilderService      │   │
│  │  - Font Preview │              │      ├── BrandRAGService          │   │
│  │  - Chat w/Marnee│              │      ├── ColorSuggestionService   │   │
│  │  - Live Preview │              │      └── TypographySuggestionSvc  │   │
│  │                 │              │                                     │   │
│  └─────────────────┘              └──────────────┬──────────────────────┘   │
│                                                  │                          │
│                                                  ▼                          │
│  ┌───────────────────────────────────────────────────────────────────────┐ │
│  │                           AI LAYER                                     │ │
│  │                                                                        │ │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐                │ │
│  │  │   OpenAI     │  │  Vector DB   │  │   External   │                │ │
│  │  │   GPT-4o     │  │  (Pinecone/  │  │    APIs      │                │ │
│  │  │              │  │   Supabase)  │  │              │                │ │
│  │  │ - Chat       │  │              │  │ - Coolors    │                │ │
│  │  │ - Suggestions│  │ - Color KB   │  │ - Google     │                │ │
│  │  │ - Generation │  │ - Type KB    │  │   Fonts      │                │ │
│  │  │              │  │ - Voice KB   │  │ - DALL-E 3   │                │ │
│  │  └──────────────┘  └──────────────┘  └──────────────┘                │ │
│  │                                                                        │ │
│  └───────────────────────────────────────────────────────────────────────┘ │
│                                                  │                          │
│                                                  ▼                          │
│  ┌───────────────────────────────────────────────────────────────────────┐ │
│  │                         DATABASE                                       │ │
│  │                                                                        │ │
│  │  brand_builder_sessions    →    business_tests.brand_guidelines       │ │
│  │  (progreso + datos)              (documento final sincronizado)       │ │
│  │                                                                        │ │
│  └───────────────────────────────────────────────────────────────────────┘ │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

### Componentes Según Bynder y Best Practices

Basándome en la investigación de Bynder y otras fuentes, los Brand Guidelines deben incluir:

#### Elementos Esenciales (MVP)

1. **Información de la Empresa**
   - Misión, visión, valores
   - Historia de la marca

2. **Estándares de Logo**
   - Reglas de uso, variaciones de color
   - Tamaño mínimo, espaciado, restricciones

3. **Paleta de Colores**
   - Códigos RGB, HEX y CMYK
   - Restricciones de uso

4. **Tipografía**
   - Familias de fuentes, pesos, tamaños
   - Jerarquía visual

5. **Tono y Voz**
   - Estilo de lenguaje, vocabulario
   - Palabras a usar/evitar

#### Elementos Avanzados (Fases Posteriores)

6. **Parámetros de Imágenes**
   - Fotografía, ilustración, iconografía

7. **Contextos de Uso**
   - Print, digital, social media, publicidad

8. **Do's and Don'ts**
   - Ejemplos correctos e incorrectos

---

### Métricas de AI a Trackear

```python
# Métricas para evaluar calidad de sugerencias AI

class BrandBuilderMetrics:
    """
    Métricas para optimizar el sistema de AI.
    """

    # Tasa de aceptación de sugerencias
    suggestion_acceptance_rate: float

    # Tiempo promedio por fase
    average_phase_duration: float

    # Número de regeneraciones solicitadas
    regeneration_requests: int

    # Satisfacción con documento final (1-5)
    final_document_rating: float

    # Uso posterior en Marnee Chat
    guidelines_usage_in_chat: int
```

---

### Fuentes y Referencias

- [Bynder - Brand Guidelines Definition](https://www.bynder.com/en/glossary/brand-guidelines-definition/)
- [KREA AI - Brand Guidelines Generator](https://www.krea.ai/apps/ai-brand-guidelines-generator)
- [Khroma - AI Color Tool](https://www.khroma.co/)
- [IBM - RAG Architecture](https://www.ibm.com/think/topics/retrieval-augmented-generation)
- [Hillock - Fine-tuning for Brand Voice](https://hillock.studio/blog/brand-voice)
- [Frontify - AI Tools for Brand Management](https://www.frontify.com/en/guide/ai-tools-for-brand-management)
- [MindStudio - AI Image Generation for Brand Guidelines](https://www.mindstudio.ai/blog/ai-image-generation-brand-guidelines-design-systems)
