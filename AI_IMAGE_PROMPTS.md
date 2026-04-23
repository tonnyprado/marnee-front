# PROMPTS PARA GENERACIÓN DE IMÁGENES CON IA
## Marnee 2.0 - Mascota Corporativa

**Última actualización:** Abril 2026
**Para usar con:** Midjourney, DALL-E 3, Leonardo.ai, Stable Diffusion

---

## ÍNDICE DE PROMPTS

1. [Diseño Base - Logo Principal](#1-diseño-base---logo-principal)
2. [Expresiones Múltiples](#2-expresiones-múltiples)
3. [Versiones con Props](#3-versiones-con-props)
4. [Hero Illustrations](#4-hero-illustrations)
5. [Estados de UI](#5-estados-de-ui)
6. [Favicon/Icon Simplificado](#6-faviconicon-simplificado)

---

## CONFIGURACIÓN PREVIA

### Para TODOS los prompts, añade estos parámetros:

**Estilo consistente:**
```
Style: flat design 2D illustration, corporate minimal, geometric shapes, no black outlines, smooth gradients, clean vector art

Color palette: primary purple #5B21B6, violet #7C3AED, teal #0891B2, emerald #059669, dark slate #1E293B, white #FFFFFF

Background: transparent or solid white #F8FAFC

Art style references: IBM illustrations, Stripe brand illustrations, Figma mascot style, modern tech company branding
```

---

## 1. DISEÑO BASE - LOGO PRINCIPAL

### 🎯 Objetivo
Crear la versión principal de Marnee: neutral, profesional, corporativa.

---

### MIDJOURNEY

```
/imagine prompt: Corporate AI mascot character, cute purple oval-shaped creature with rounded edges, wearing professional headset with microphone boom, minimalist 2D flat design, geometric shapes only, no black outlines, smooth gradient from #5B21B6 to #7C3AED, simple circular white eyes with dark pupils, subtle friendly expression, two antenna-like ears on top, headset in dark slate gray #1E293B with small teal indicator light, professional tech company style, clean vector illustration, IBM design language inspired, transparent background --style raw --s 150 --ar 1:1.2 --v 6
```

**Parámetros explicados:**
- `--style raw` = Menos interpretación artística, más fiel al prompt
- `--s 150` = Stylization media (50-200 recomendado para corporativo)
- `--ar 1:1.2` = Aspect ratio (ligeramente más alto que ancho)
- `--v 6` = Versión 6 de Midjourney

**Variaciones:**
```
# Más minimalista
... --s 100 --ar 1:1.2 --v 6

# Más detallado (versión Classic)
... --s 200 --ar 1:1.2 --v 6

# Versión cuadrada (para logo)
... --s 150 --ar 1:1 --v 6
```

---

### DALL-E 3 (ChatGPT/API)

```
Create a corporate mascot character illustration in flat 2D design style. The character is a cute purple oval-shaped creature with these specific features:

BODY: Smooth oval/capsule shape, vertical orientation, gradient from deep purple (#5B21B6) at top to vibrant violet (#7C3AED) at bottom, no black outlines, clean geometric form

HEAD/FACE: Two simple circular white eyes (20% of body width) with dark slate pupils (#1E293B), subtle friendly smile (slight curve), positioned in upper-middle section, minimalist expression

EARS: Two rounded rectangular antenna-like shapes on top of the head, 30% of body height, angled 15 degrees outward, colored in violet (#7C3AED)

HEADSET (KEY FEATURE): Professional headset with semi-circular arc connecting both ears, dark slate gray color (#1E293B), circular endpoints over each ear, microphone boom extending from left side curving toward mouth, small teal indicator light (#0891B2) on microphone capsule

STYLE: Flat design 2D, no textures, no shadows except subtle drop shadow, geometric shapes only, corporate modern tech aesthetic, inspired by IBM illustrations and Stripe branding, clean vector art appearance

BACKGROUND: Solid white or transparent

OUTPUT: High resolution, suitable for logo use, professional and friendly but not childish
```

**Tips para DALL-E:**
- Sé muy descriptivo con medidas relativas (%)
- Especifica "no black outlines" claramente
- Menciona referencias de estilo corporativas
- Si el resultado es muy "artístico", añade: "vector illustration, no artistic interpretation"

---

### LEONARDO.AI

**Modelo recomendado:** Leonardo Diffusion XL o Phoenix

```
Prompt:
Corporate tech mascot, flat 2D illustration, purple oval creature, professional headset with mic boom, minimalist geometric design, gradient purple #5B21B6 to #7C3AED, white circular eyes, dark slate headset #1E293B, two antenna ears, teal accent light, no outlines, clean vector style, IBM design inspired, professional friendly character, transparent background

Negative Prompt:
3d render, realistic, shadows, black outlines, strokes, complex details, anime, cartoon, childish, gradients with multiple colors, textures, photography, sketchy, rough edges, too many colors, busy design

Settings:
- Dimensions: 832x1024 (para aspect ratio 1:1.2)
- Guidance Scale: 7-9 (para seguir más fielmente el prompt)
- Steps: 30-50
- Photo Real: OFF
- Alchemy: ON (si está disponible)
```

---

### STABLE DIFFUSION (Automatic1111/ComfyUI)

**Modelo recomendado:** SDXL 1.0 Base o Juggernaut XL

```
Prompt:
(masterpiece:1.2), (best quality:1.2), corporate mascot character, flat 2D vector illustration, purple oval shaped creature, professional headset with microphone, minimalist geometric design, smooth gradient purple #5B21B6 to #7C3AED, simple white circular eyes with dark pupils, two rounded antenna ears, dark gray headset #1E293B, small teal indicator light, no black outlines, clean shapes, IBM style illustration, Stripe branding style, modern tech company mascot, friendly professional expression, transparent background, vector art, (flat design:1.3), (geometric shapes:1.2)

Negative Prompt:
(worst quality:1.2), (low quality:1.2), 3d, realistic, photo, photograph, shadows, complex shading, black outlines, stroke, border, anime, manga, cartoon, childish, sketchy, rough, texture, gradient noise, multiple colors, busy, cluttered, detailed background, watermark, signature, text

Settings:
- Sampling method: DPM++ 2M Karras o Euler a
- Sampling steps: 25-35
- CFG Scale: 7-8
- Size: 512x640 o 768x960 (AR 1:1.2)
- Denoising strength: 0.7 (si usas img2img)
```

**Extensiones recomendadas:**
- ControlNet (con edge detection) para más control
- Ultimate SD Upscale (para ampliar sin perder calidad)

---

## 2. EXPRESIONES MÚLTIPLES

### A. EXPRESIÓN FELIZ/AMIGABLE

#### MIDJOURNEY
```
/imagine prompt: [MISMO PROMPT BASE] with happy friendly expression, curved smile (25 degrees), eyes slightly raised forming happy arcs, cheerful demeanor, welcoming pose, professional yet warm, corporate friendly style --style raw --s 150 --ar 1:1.2 --v 6
```

#### DALL-E 3
```
[USAR PROMPT BASE y modificar la sección FACE:]

HEAD/FACE: Two simple circular white eyes forming happy upward arcs (^_^), dark slate pupils, wide friendly smile with 25-degree curve upward, eyebrows (optional) slightly raised and curved, expressing joy and friendliness, welcoming expression
```

#### LEONARDO.AI
```
[PROMPT BASE] + happy smiling expression, curved smile upward, joyful friendly face, welcoming demeanor, cheerful eyes

[NEGATIVE PROMPT] + sad, angry, neutral face, straight mouth
```

---

### B. EXPRESIÓN PENSATIVA/PROCESANDO

#### MIDJOURNEY
```
/imagine prompt: [MISMO PROMPT BASE] with thinking contemplative expression, eyes looking up and to the side, small "o" shaped mouth or slight thinking curve, one eyebrow raised higher than other, light bulb icon floating above head (optional), pondering pose, processing information, gentle concentration --style raw --s 150 --ar 1:1.2 --v 6
```

#### DALL-E 3
```
[USAR PROMPT BASE y modificar:]

HEAD/FACE: Eyes looking upward and slightly to the right, contemplative expression, mouth forming small "o" shape or subtle thinking curve, one eyebrow raised, thoughtful demeanor

ADDITIONAL PROP (optional): Small light bulb icon in amber yellow (#F59E0B) floating 10% above the head, simple geometric bulb with 3-4 ray lines
```

---

### C. EXPRESIÓN TRABAJANDO/CONCENTRADO

#### MIDJOURNEY
```
/imagine prompt: [MISMO PROMPT BASE] with focused concentrated expression, eyes looking down at 45-degree angle, small neutral mouth (horizontal line or slight determined curve), attentive focused demeanor, working intently, professional concentration, one arm/appendage extended forward as if typing --style raw --s 150 --ar 1:1.2 --v 6
```

#### LEONARDO.AI
```
[PROMPT BASE] + concentrated focused expression, eyes looking down, determined small mouth, working posture, professional attentive demeanor

[NEGATIVE] + distracted, sleeping, bored, eyes looking up
```

---

### D. EXPRESIÓN PRESENTANDO/EXPLICANDO

#### MIDJOURNEY
```
/imagine prompt: [MISMO PROMPT BASE] with presenting explaining expression, eyes looking forward engaging the viewer, friendly professional smile, one rounded arm/appendage extended to the side holding a simple pointer (stick), welcoming teaching pose, confident friendly educator demeanor --style raw --s 150 --ar 1:1.2 --v 6
```

#### DALL-E 3
```
[USAR PROMPT BASE y añadir:]

EXPRESSION: Forward-facing eyes engaging viewer, friendly professional smile, confident yet approachable

ARMS: Simple rounded tubular shape extending from mid-body to the right side (same purple gradient #5B21B6 to #7C3AED), terminating in rounded mitten-like hand (#7C3AED lighter shade)

PROP: Thin pointer stick held in extended hand, dark slate color (#1E293B), simple geometric line with rounded tip
```

---

### E. EXPRESIÓN CONFUNDIDA/ERROR

#### MIDJOURNEY
```
/imagine prompt: [MISMO PROMPT BASE] with confused uncertain expression, eyes slightly crossed or one smaller than other, wavy mouth line or slight downward curve showing confusion, one eyebrow raised much higher creating asymmetric puzzled look, question mark floating near head (optional), perplexed demeanor --style raw --s 150 --ar 1:1.2 --v 6
```

#### LEONARDO.AI
```
[PROMPT BASE] + confused puzzled expression, asymmetric eyes, wavy uncertain mouth, one eyebrow raised, perplexed look, small question mark icon nearby

[NEGATIVE] + confident, happy, clear expression, symmetric face
```

---

## 3. VERSIONES CON PROPS

### A. MARNEE CON LAPTOP

#### MIDJOURNEY
```
/imagine prompt: Corporate purple AI mascot character (same as before) sitting behind or next to minimalist laptop, laptop design: simple rectangular shape in light gray #E2E8F0 with screen showing teal gradient #0891B2, character's eyes looking down at screen with focused expression, one arm extended toward keyboard area, professional working scene, flat 2D geometric illustration, corporate tech style, clean vector art, transparent background --style raw --s 150 --ar 4:3 --v 6
```

#### DALL-E 3
```
Create the same purple corporate mascot character (oval purple body #5B21B6 to #7C3AED, headset with mic #1E293B, white eyes) in a working scenario:

CHARACTER POSITION: Positioned behind a minimalist laptop computer, eyes looking down at 45-degree angle toward screen, focused working expression

LAPTOP DESIGN:
- Simple rectangular shape, light gray color (#E2E8F0)
- Screen: Rectangular display showing teal gradient (#0891B2)
- Keyboard area: Suggested by lighter gray rectangle
- Ultra minimalist, only basic geometric shapes

CHARACTER ARMS: One simple rounded arm extending from body toward keyboard, same purple gradient, rounded mitten-like hand touching keyboard area

SCENE COMPOSITION: Character fills 60% of image, laptop 40%, character slightly overlapping laptop from behind

STYLE: Flat 2D design, geometric shapes, corporate illustration, no outlines, clean vector appearance

BACKGROUND: Solid white #F8FAFC
```

---

### B. MARNEE PRESENTANDO GRÁFICOS

#### MIDJOURNEY
```
/imagine prompt: Corporate purple AI mascot (oval purple body, professional headset) standing beside or presenting minimalist bar chart, character's arm extended pointing at chart with simple pointer stick, friendly explaining expression, chart design: 3-4 simple bars in teal #0891B2 and emerald #059669 on light background, ultra minimal geometric style, professional business presentation scene, flat 2D vector illustration, IBM corporate design inspired, clean composition, white background --style raw --s 150 --ar 16:9 --v 6
```

#### LEONARDO.AI
```
Purple corporate mascot character presenting bar chart, one arm pointing at simple geometric chart, 3 minimalist bars in teal and green, friendly professional expression, clean flat design, corporate presentation scene, white background

Negative: complex charts, realistic graphs, 3d charts, multiple colors, busy design, detailed background
```

---

### C. MARNEE CON DOCUMENTOS/ARCHIVOS

#### DALL-E 3
```
Create a flat 2D corporate illustration of the purple AI mascot character (same design: oval purple gradient body, headset with mic, white eyes) interacting with floating document icons:

CHARACTER: Standing upright with happy friendly expression, both arms slightly extended outward

DOCUMENTS: 3-4 simple rectangular shapes floating around the character at different heights:
- Color: Light gray #E2E8F0 with 2-3 horizontal lines in darker gray (#64748B) suggesting text
- Size: Each document 15-20% of character height
- Style: Ultra minimalist, just rectangles with rounded corners
- Arrangement: Scattered casually around character

OPTIONAL ELEMENTS:
- Small checkmark icon in emerald green (#059669) on one document
- Small magnifying glass icon near character's hand

STYLE: Flat design 2D, geometric shapes, no outlines, corporate modern illustration, clean vector art appearance

BACKGROUND: Solid white or very subtle light gray gradient

COMPOSITION: Character centered, documents create visual interest around edges
```

---

## 4. HERO ILLUSTRATIONS

### MARNEE - ESCENA CORPORATIVA COMPLETA

#### MIDJOURNEY
```
/imagine prompt: Corporate hero illustration featuring purple AI mascot character (oval purple gradient body #5B21B6 to #7C3AED, professional headset, friendly expression) as central focus, surrounded by minimal abstract tech elements: floating geometric UI windows in light gray, simple line charts in teal and green, document icons, small checkmark badges, all elements arranged in organized composition, character occupying 50% center space, background with subtle geometric shapes (circles, rounded rectangles) in very light gray and light purple tones, professional modern tech company landing page style, flat 2D design, clean vector illustration, IBM and Stripe visual style inspired, balanced composition --style raw --s 175 --ar 16:9 --v 6
```

#### DALL-E 3
```
Create a comprehensive corporate hero illustration for a tech platform landing page, featuring the purple AI mascot character as the centerpiece:

MAIN CHARACTER (40-50% of composition, center):
- Purple oval mascot with gradient (#5B21B6 to #7C3AED)
- Professional headset with microphone boom (#1E293B)
- Friendly professional expression, eyes forward
- One arm extended presenting/welcoming gesture

SURROUNDING ELEMENTS (distributed around character):

LEFT SIDE:
- Minimalist laptop showing simple interface (light gray #E2E8F0)
- 2-3 floating document icons (rectangles with lines)
- Small chart/graph icon (simple bars in teal #0891B2)

RIGHT SIDE:
- Floating UI window mockup (rectangle with header bar)
- Checkmark badges in emerald green (#059669)
- Small chat bubble icons

BACKGROUND:
- Very subtle geometric shapes (large circles, rounded rectangles) in light purple (#F1F5F9) and lighter gray (#F8FAFC)
- Minimal, not distracting from main character
- Optional: very subtle grid pattern

OVERALL STYLE:
- Flat 2D design, no shadows except very subtle drop shadows
- Corporate modern tech aesthetic
- Clean, organized, balanced composition
- Color palette limited to: purples, teals, emerald, grays, white
- No black outlines, geometric shapes only
- Inspired by IBM illustrations and Stripe brand visuals

DIMENSIONS: Wide landscape format (16:9 ratio) suitable for website hero section

MOOD: Professional yet approachable, modern tech platform, trustworthy and innovative
```

---

## 5. ESTADOS DE UI

### A. LOADING/PROCESANDO

#### MIDJOURNEY
```
/imagine prompt: Simple loading state illustration, purple AI mascot character (minimalist version) with thinking/processing expression, eyes looking upward, small animated dots or spinner near head, ultra minimal geometric design, suitable for loading spinner, flat 2D style, corporate clean aesthetic, transparent background, small size optimized (80x80px to 160x160px) --style raw --s 100 --ar 1:1 --v 6
```

#### LEONARDO.AI
```
Minimal purple mascot with thinking expression, simple loading dots animation, ultra clean geometric design, small size, corporate loading spinner style, transparent background

Negative: complex details, large size, background elements, multiple props
```

---

### B. ERROR STATE

#### DALL-E 3
```
Create a simple error state illustration:

CHARACTER: The purple AI mascot (simplified version) with confused expression:
- Asymmetric eyes (one slightly higher/smaller)
- Wavy uncertain mouth line
- One eyebrow raised

ERROR INDICATOR: Simple "X" mark icon floating near the character:
- Color: Rose red (#E11D48)
- Style: Circle with X inside, geometric and minimal
- Size: 20-25% of character size
- Position: Top right of character

STYLE: Ultra minimal flat 2D, suitable for error message cards, small to medium size (200x200px to 300x300px)

BACKGROUND: Transparent or solid white
```

---

### C. SUCCESS STATE

#### MIDJOURNEY
```
/imagine prompt: Success state illustration, purple AI mascot with happy celebrating expression, checkmark icon in emerald green #059669 floating beside character, minimal confetti geometric shapes (small triangles and circles in teal and violet), clean flat 2D design, corporate friendly celebration, suitable for success messages, transparent background --style raw --s 125 --ar 1:1 --v 6
```

---

### D. EMPTY STATE

#### DALL-E 3
```
Create an empty state illustration for when no content is available:

CHARACTER: Purple AI mascot with gentle neutral or slightly curious expression

PROP: Magnifying glass icon held by the character:
- Simple circular lens in light gray outline
- Handle in dark slate (#1E293B)
- Character looking through the magnifying glass

OPTIONAL ELEMENTS: Very subtle floating question mark or document icon with empty/transparent center

MESSAGE: The illustration should convey "looking for content" or "nothing here yet" in a friendly, non-alarming way

STYLE: Minimal flat 2D, geometric shapes, corporate friendly design

SIZE: Medium (200x200px to 300x300px suitable)

BACKGROUND: White or transparent
```

---

## 6. FAVICON/ICON SIMPLIFICADO

### VERSIÓN ULTRA MINIMALISTA (16x16 a 64x64px)

#### MIDJOURNEY
```
/imagine prompt: Ultra simplified app icon version of purple AI mascot, extreme minimalism, only essential elements: purple oval shape #5B21B6, two white circular eyes, simple dark gray headset arc suggestion, suitable for favicon and small icons (16px to 64px), high contrast, instantly recognizable at tiny sizes, flat 2D geometric icon design, no details, bold simple shapes --style raw --s 50 --ar 1:1 --v 6
```

#### DALL-E 3
```
Create an extremely simplified icon version of the purple AI mascot, suitable for favicon and small app icons (16x16px to 64x64px):

DESIGN APPROACH: Maximum simplification while maintaining recognizability

ELEMENTS (only the essentials):
1. Purple rounded shape (simplified oval/circle) - solid color #5B21B6
2. Two white dots for eyes (no pupils needed at this size)
3. Simple dark gray arc suggesting headset - just a curved line on top

STYLE:
- Flat color (no gradients at this size)
- High contrast between elements
- Bold simple shapes
- No fine details
- Instantly recognizable even at 16x16 pixels

OUTPUT: Square format (1:1), clean edges, suitable for PNG export and favicon use

COLORS ONLY: Purple #5B21B6, white #FFFFFF, dark gray #1E293B (maximum 3 colors)
```

#### LEONARDO.AI
```
Ultra minimal app icon, purple circle mascot, two white eye dots, simple dark headset line, extreme simplification, flat solid colors, high contrast, favicon suitable, square format

Negative: details, gradients, complexity, fine lines, small elements, realistic, 3d
```

---

## 7. PROMPTS GENÉRICOS REUTILIZABLES

### PLANTILLA BASE PARA CUALQUIER VARIACIÓN

```
[PLATAFORMA: Midjourney/DALL-E/Leonardo/etc.]

ESTRUCTURA DEL PROMPT:

1. DESCRIPCIÓN DEL CHARACTER BASE:
"Corporate AI mascot character, purple oval-shaped body with gradient from #5B21B6 to #7C3AED, professional headset with microphone boom in dark slate #1E293B, [EXPRESIÓN ESPECÍFICA], [POSE/ACCIÓN ESPECÍFICA]"

2. ELEMENTOS ADICIONALES (si aplica):
"[PROPS: laptop/charts/documents/etc.], [POSICIÓN Y RELACIÓN CON CHARACTER]"

3. ESTILO ARTÍSTICO:
"flat 2D illustration, geometric shapes, no black outlines, corporate modern design, clean vector art style, IBM and Stripe visual language inspired"

4. CONFIGURACIÓN TÉCNICA:
"[BACKGROUND: transparent/white/subtle], [SIZE OPTIMIZATION: favicon/icon/hero/etc.]"

5. PARÁMETROS (Midjourney):
"--style raw --s [100-200] --ar [ratio] --v 6"

6. NEGATIVE PROMPT (Leonardo/SD):
"3d render, realistic, black outlines, complex details, anime, cartoon, textures, shadows, multiple colors, busy design"
```

---

## 8. CONSEJOS PRO POR PLATAFORMA

### MIDJOURNEY
✅ **Best Practices:**
- Usa `--style raw` para diseños corporativos (menos interpretación artística)
- Stylization entre 100-175 para look profesional
- `--ar 1:1.2` funciona mejor para mascota vertical
- Genera múltiples variaciones con `/imagine` y selecciona la mejor
- Usa `--seed` para consistencia entre imágenes: `/imagine [prompt] --seed 12345`

❌ **Evita:**
- Stylization muy alto (>250) = demasiado artístico
- `--style cute` o similares = infantiliza el diseño
- Prompts muy largos (>400 palabras) = confusión del modelo

---

### DALL-E 3
✅ **Best Practices:**
- Sé MUY descriptivo con proporciones y colores exactos
- Menciona "vector illustration" y "no artistic interpretation" para diseños limpios
- Especifica "transparent background" si lo necesitas
- Usa referencias de marcas reales: "IBM style", "Stripe illustrations"
- Puedes editar iterativamente: genera, critica, regenera con ajustes

❌ **Evita:**
- Prompts muy cortos = interpretación muy artística
- No especificar "no black outlines" = líneas negras gruesas
- Pedir "logo" directamente = añade texto no deseado

---

### LEONARDO.AI
✅ **Best Practices:**
- Usa modelos XL (Leonardo Diffusion XL, Phoenix)
- Negative prompts son MUY importantes aquí
- Guidance Scale 7-9 para seguir fielmente el prompt
- Alchemy mejora calidad notablemente (si disponible)
- Prueba diferentes seeds para variaciones

❌ **Evita:**
- PhotoReal activado = añade realismo no deseado
- Guidance muy bajo (<5) = mucha interpretación
- Prompts sin negative = resultados impredecibles

---

### STABLE DIFFUSION
✅ **Best Practices:**
- Usa modelos SDXL para mejor calidad
- Emphasis syntax: `(flat design:1.3)` = énfasis fuerte
- DPM++ 2M Karras = buen balance calidad/velocidad
- CFG Scale 7-8 para corporativo (no muy alto)
- Usa ControlNet con edge detection para control exacto

❌ **Evita:**
- CFG muy alto (>12) = colores saturados, artificial
- Demasiados steps (>50) = poco beneficio, más lento
- Prompts sin pesos/emphasis = elementos se pierden

---

## 9. FLUJO DE TRABAJO RECOMENDADO

### PASO 1: Generar Concepto Base
1. Usa **Midjourney** o **DALL-E 3** para el concepto inicial
2. Genera 5-10 variaciones del diseño base
3. Selecciona la mejor versión (equilibrio corporativo/amigable)

### PASO 2: Refinar Detalles
1. Toma la versión ganadora y genera variaciones sutiles
2. Ajusta expresión, proporciones, colores
3. Prueba con/sin elementos (con/sin brazos, etc.)

### PASO 3: Crear Expresiones
1. Usa el diseño base aprobado
2. Genera las 6 expresiones principales una por una
3. Asegura consistencia visual entre todas

### PASO 4: Versiones con Props
1. Añade elementos gradualmente (laptop, gráficos, etc.)
2. Mantén consistencia del character
3. Cuida que los props no dominen la composición

### PASO 5: Optimización Técnica
1. Exporta en alta resolución
2. Convierte a SVG usando herramientas como:
   - Adobe Illustrator (Image Trace)
   - Vectorizer.AI
   - Manual redraw en Figma/Illustrator
3. Limpia y optimiza el SVG

---

## 10. CHECKLIST PRE-GENERACIÓN

Antes de generar, verifica:

- [ ] ¿Especificaste "flat 2D design" y "no black outlines"?
- [ ] ¿Incluiste los colores exactos en formato hex?
- [ ] ¿Mencionaste "corporate" o "professional" para evitar estilo infantil?
- [ ] ¿Definiste el aspect ratio correcto para el uso?
- [ ] ¿Añadiste referencias de estilo (IBM, Stripe, etc.)?
- [ ] ¿Especificaste "transparent background" si lo necesitas?
- [ ] ¿Incluiste negative prompts (para Leonardo/SD)?
- [ ] ¿El prompt describe claramente la expresión/pose deseada?

---

## 11. TROUBLESHOOTING COMÚN

### Problema: "Sale con outlines negros"
**Solución:**
- Añade explícitamente: "no black outlines, no strokes, no borders"
- Menciona: "flat design, clean shapes"
- En Midjourney: aumenta `--s` a 150-200

### Problema: "Demasiado infantil/cartoon"
**Solución:**
- Añade: "corporate, professional, modern tech company style"
- Menciona: "IBM design language, Stripe illustrations"
- Evita palabras: "cute", "kawaii", "adorable"
- En Midjourney: usa `--style raw`

### Problema: "Colores incorrectos"
**Solución:**
- Especifica hex codes exactos: "#5B21B6"
- Añade: "limited color palette, only purple and teal"
- En negative: "rainbow, multiple colors, colorful"

### Problema: "Demasiado realista/3D"
**Solución:**
- Enfatiza: "flat 2D illustration, vector art, geometric shapes"
- Negative (SD/Leonardo): "3d render, realistic, photography, shadows, depth"
- En DALL-E: "vector illustration, not photorealistic"

### Problema: "Inconsistencia entre generaciones"
**Solución:**
- En Midjourney: usa el mismo `--seed`
- Genera todas las variaciones en la misma sesión
- Guarda y reutiliza el prompt exacto base
- Considera usar image prompting con la primera imagen como referencia

---

## 12. RECURSOS ADICIONALES

### Herramientas para Vectorizar PNG → SVG
1. **Vectorizer.AI** (https://vectorizer.ai/) - Automático, resultados decentes
2. **Adobe Illustrator** - Image Trace (control manual superior)
3. **Inkscape** (gratis) - Trace Bitmap
4. **Figma** - Trace + manual refinement

### Optimizadores de SVG
1. **SVGOMG** (https://jakearchibald.github.io/svgomg/) - Web, visual
2. **SVGO** - CLI, automatizable
3. **SVG Optimizer** - Plugin de Figma

### Paletas y Referencias
- **Coolors.co** - Para refinar paleta de colores
- **IBM Design Language** - https://www.ibm.com/design/language/
- **Stripe Brand** - Estudiar sus ilustraciones
- **Figma Community** - Buscar "corporate illustrations"

---

## EJEMPLO COMPLETO: DE PROMPT A IMPLEMENTACIÓN

### 1. Generas con Midjourney:
```
/imagine prompt: Corporate AI mascot character, cute purple oval-shaped creature, professional headset with microphone, minimalist 2D flat design, gradient #5B21B6 to #7C3AED, simple white eyes, friendly neutral expression, geometric shapes only, no black outlines, IBM style, clean vector art, transparent background --style raw --s 150 --ar 1:1.2 --v 6 --seed 777
```

### 2. Obtienes PNG de alta resolución (1024x1229px)

### 3. Vectorizas en Illustrator:
- Object → Image Trace → Make
- Ajustas configuración para formas geométricas limpias
- Object → Expand

### 4. Limpias en Figma/Illustrator:
- Eliminas elementos innecesarios
- Ajustas colores exactos (#5B21B6, #7C3AED, etc.)
- Simplificas paths

### 5. Exportas SVG optimizado:
- File → Export → SVG
- Configuración: Inline styles, Minimal viewBox

### 6. Optimizas con SVGOMG:
- Removes unused groups
- Merges paths
- Reduces precision
- Output: < 50KB

### 7. Implementas en código:
```jsx
import MarneeLogo from './assets/marnee-lightweight-neutral-md.svg';

<img src={MarneeLogo} alt="Marnee AI Assistant" className="w-20 h-24" />
```

---

**NEXT STEPS:**
1. Selecciona tu plataforma favorita (Midjourney/DALL-E/Leonardo)
2. Empieza con el Prompt Base para Logo Principal
3. Genera 5-10 variaciones
4. Comparte resultados y refina
5. Continúa con expresiones una vez tengas el base aprobado

**¡Buena suerte generando tu nueva mascota Marnee 2.0!** 🚀
