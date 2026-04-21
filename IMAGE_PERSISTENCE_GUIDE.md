# Guía de Persistencia de Imágenes Generadas

## 📋 Resumen Ejecutivo

**Solución:** Guardar imágenes en PostgreSQL (NO se necesita S3)  
**Costo:** $0 adicional (usa tu BD actual)  
**Viabilidad:** Perfecto para 1,000-10,000 posts  
**Cuándo necesitas S3:** Cuando tengas 50,000+ posts con imágenes

---

## 💰 Análisis de Costos

### Opción Elegida: Base de Datos PostgreSQL

| Aspecto | Detalle |
|---------|---------|
| **SVG** | ~20-50 KB por imagen (solo texto) |
| **PNG base64** | ~500 KB - 1 MB por imagen |
| **1,000 posts** | ~500 MB de espacio en BD |
| **10,000 posts** | ~5 GB de espacio en BD |
| **Costo** | $0 (incluido en tu plan actual) |

### S3 (para comparación - NO necesario ahora)

| Aspecto | Costo |
|---------|-------|
| **Almacenamiento** | $0.023/GB/mes |
| **1,000 imágenes** | ~$0.01/mes |
| **10,000 imágenes** | ~$0.12/mes |
| **Transferencia OUT** | $0.09/GB (primeros 10TB) |

**Conclusión:** Para un MVP o producto en crecimiento inicial, la base de datos es más que suficiente y completamente viable.

---

## 🎯 Flujo UX Propuesto

### Escenario 1: Post SIN imagen generada

```
┌─────────────────────────────────────┐
│ Post Card                           │
├─────────────────────────────────────┤
│ Hook: "The secret to..."           │
│ Body: "Most people don't know..."  │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │     🎨 Generate Image           │ │
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘

Action: Click "Generate Image"
→ Llama a /api/v1/images/generate
→ Guarda en BD vía POST /api/v1/calendar/posts/{post_id}/generated-image
→ Modal se abre con imagen generada
```

### Escenario 2: Post CON imagen ya generada

```
┌──────────────────────────────────────────────┐
│ Post Card                                    │
├──────────────────────────────────────────────┤
│ Hook: "The secret to..."                    │
│ Body: "Most people don't know..."           │
│                                              │
│ [Thumbnail de imagen generada - 100x100px]  │
│                                              │
│ ┌──────────────────┐  ┌─────────────────┐   │
│ │  📝 Edit Image   │  │ 🔄 Regenerate   │   │
│ └──────────────────┘  └─────────────────┘   │
└──────────────────────────────────────────────┘

Action 1: Click "Edit Image"
→ Trae imagen de BD vía GET /api/v1/calendar/posts/{post_id}/generated-image
→ Abre modal directamente con imagen (NO genera nueva)
→ Usuario puede ver/editar/descargar

Action 2: Click "Regenerate"
→ Llama a /api/v1/images/generate (genera NUEVA imagen)
→ Actualiza en BD vía POST /api/v1/calendar/posts/{post_id}/generated-image
→ Abre modal con nueva imagen
```

---

## 🏗️ Cambios en Backend (COMPLETADOS ✅)

### 1. Migración de Base de Datos

**Archivo:** `/database/migrations/008_add_generated_images.sql`

Campos agregados a `calendar_posts`:
- `generated_image_svg` (TEXT) - SVG como texto
- `generated_image_png_base64` (TEXT) - PNG en base64
- `generated_image_template` (VARCHAR) - Template usado
- `generated_image_dimensions` (JSONB) - {width, height}
- `generated_image_context_used` (TEXT[]) - Contextos usados
- `generated_image_created_at` (TIMESTAMP) - Cuándo se generó
- `generated_image_updated_at` (TIMESTAMP) - Última actualización

**Deployment:**
```bash
cd /Users/tonyprado/Documents/Proyectos/DNHub/dnhubAI
psql -d your_database -f database/migrations/008_add_generated_images.sql
```

### 2. Modelo Pydantic Actualizado

**Archivo:** `/app/models/founder.py`

La clase `CalendarPost` ahora incluye campos de imagen generada.

### 3. Nuevos Endpoints

**POST** `/api/v1/calendar/posts/{post_id}/generated-image`
- Guarda o actualiza la imagen generada
- Request body:
  ```json
  {
    "svg": "<svg>...</svg>",
    "pngBase64": "iVBORw0KGgo...",
    "template": "quote-bold",
    "dimensions": {"width": 1080, "height": 1080},
    "contextUsed": ["brand_profile", "strategy", "attachments"]
  }
  ```

**GET** `/api/v1/calendar/posts/{post_id}/generated-image`
- Obtiene la imagen guardada
- Response:
  ```json
  {
    "svg": "<svg>...</svg>",
    "pngBase64": "iVBORw0KGgo...",
    "template": "quote-bold",
    "dimensions": {"width": 1080, "height": 1080},
    "contextUsed": ["brand_profile", "strategy"],
    "createdAt": "2025-01-28T10:30:00Z",
    "updatedAt": "2025-01-28T15:45:00Z"
  }
  ```

### 4. Repository Functions

**Archivo:** `/app/database/calendar_repository.py`

Nuevas funciones:
- `save_post_generated_image(post_id, image_data)` - Guarda/actualiza imagen
- `get_post_generated_image(post_id)` - Obtiene imagen guardada

### 5. Service Methods

**Archivo:** `/app/services/calendar_service.py`

Nuevos métodos:
- `save_generated_image(post_id, image_data, user_id)` - Con autorización
- `get_generated_image(post_id, user_id)` - Con autorización

---

## 🎨 Cambios Necesarios en Frontend

### 1. Actualizar el componente del Post Card

**Archivo a modificar:** El componente que muestra los posts individuales (probablemente en `/src/Component/Calendar/` o similar)

#### Lógica necesaria:

```javascript
// Detectar si el post ya tiene imagen generada
const hasGeneratedImage = post.generatedImageSvg != null;

// Estado para manejar la imagen
const [generatedImage, setGeneratedImage] = useState(null);

// Cargar imagen si existe
useEffect(() => {
  if (hasGeneratedImage && !generatedImage) {
    fetchGeneratedImage(post.id);
  }
}, [post.id, hasGeneratedImage]);

const fetchGeneratedImage = async (postId) => {
  try {
    const response = await fetch(
      `${API.MARNEE}/calendar/posts/${postId}/generated-image`,
      {
        headers: getAuthHeader(),
      }
    );
    if (response.ok) {
      const imageData = await response.json();
      setGeneratedImage(imageData);
    }
  } catch (err) {
    console.error('Failed to fetch generated image:', err);
  }
};

// Renderizado condicional
return (
  <div className="post-card">
    {/* ... contenido del post ... */}
    
    {hasGeneratedImage && generatedImage && (
      <div className="generated-image-thumbnail">
        <img 
          src={`data:image/svg+xml;base64,${btoa(generatedImage.svg)}`}
          alt="Generated"
          className="w-full h-24 object-cover rounded"
        />
      </div>
    )}
    
    <div className="actions">
      {hasGeneratedImage ? (
        <>
          <button onClick={() => handleEditImage(generatedImage)}>
            📝 Edit Image
          </button>
          <button onClick={() => handleRegenerateImage()}>
            🔄 Regenerate
          </button>
        </>
      ) : (
        <button onClick={() => handleGenerateImage()}>
          🎨 Generate Image
        </button>
      )}
    </div>
  </div>
);
```

### 2. Actualizar el hook useImageGenerator

**Archivo:** `/src/hooks/useImageGenerator.js`

Agregar función para guardar la imagen generada:

```javascript
import imageApi from '../services/imageApi';

export function useImageGenerator() {
  // ... código existente ...

  /**
   * Save generated image to the database
   * @param {string} postId - Calendar post ID
   * @param {Object} imageData - Generated image data
   */
  const saveGeneratedImage = useCallback(async (postId, imageData) => {
    try {
      const response = await fetch(
        `${API.MARNEE}/calendar/posts/${postId}/generated-image`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...getAuthHeader(),
          },
          body: JSON.stringify({
            svg: imageData.svg,
            pngBase64: imageData.pngBase64,
            template: imageData.templateUsed,
            dimensions: imageData.dimensions,
            contextUsed: imageData.contextUsed || [],
          }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to save generated image');
      }

      return await response.json();
    } catch (err) {
      console.error('Error saving generated image:', err);
      throw err;
    }
  }, []);

  /**
   * Fetch saved generated image
   * @param {string} postId - Calendar post ID
   */
  const fetchGeneratedImage = useCallback(async (postId) => {
    try {
      const response = await fetch(
        `${API.MARNEE}/calendar/posts/${postId}/generated-image`,
        {
          headers: getAuthHeader(),
        }
      );

      if (!response.ok) {
        if (response.status === 404) {
          return null; // No image exists
        }
        throw new Error('Failed to fetch generated image');
      }

      return await response.json();
    } catch (err) {
      console.error('Error fetching generated image:', err);
      throw err;
    }
  }, []);

  return {
    generateImage,
    regenerateWithTemplate,
    saveGeneratedImage,     // ← Nueva función
    fetchGeneratedImage,    // ← Nueva función
    isGenerating,
    generatedImage,
    error,
    clearError,
    clearImage,
  };
}
```

### 3. Actualizar ImageGenerator Component

**Archivo a modificar:** El componente que orquesta la generación de imágenes

```javascript
import { useImageGenerator } from '../hooks/useImageGenerator';

function ImageGenerator({ post, onClose }) {
  const {
    generateImage,
    saveGeneratedImage,
    fetchGeneratedImage,
    isGenerating,
  } = useImageGenerator();

  const [mode, setMode] = useState('generate'); // 'generate' | 'edit'

  // Al montar, verificar si ya existe imagen
  useEffect(() => {
    if (post.generatedImageSvg) {
      // Ya tiene imagen, cargar datos guardados
      fetchGeneratedImage(post.id).then((imageData) => {
        if (imageData) {
          setGeneratedImage(imageData);
          setMode('edit');
        }
      });
    }
  }, [post.id]);

  const handleGenerateNew = async () => {
    try {
      // Generar imagen
      const newImage = await generateImage({
        founderId: post.founderId,
        postData: {
          hook: post.hook,
          body: post.body,
          cta: post.cta,
          pillar: post.pillar,
          platform: post.platform,
          contentType: post.contentType,
        },
        outputFormat: 'both',
      });

      // IMPORTANTE: Guardar en BD después de generar
      await saveGeneratedImage(post.id, newImage);

      setGeneratedImage(newImage);
      setMode('edit');

      // Opcionalmente, actualizar el post en el estado global
      // para marcar que ahora tiene imagen
    } catch (err) {
      console.error('Failed to generate and save image:', err);
    }
  };

  const handleEditExisting = async () => {
    // Cargar imagen guardada
    const imageData = await fetchGeneratedImage(post.id);
    setGeneratedImage(imageData);
    setMode('edit');
    // Abrir modal...
  };

  // ... resto del componente
}
```

### 4. Crear API Helper (Opcional pero Recomendado)

**Nuevo archivo:** `/src/services/calendarPostApi.js`

```javascript
import API from '../config';
import { getAuthHeader } from './api';

const calendarPostApi = {
  /**
   * Save generated image for a calendar post
   */
  saveGeneratedImage: async (postId, imageData) => {
    const response = await fetch(
      `${API.MARNEE}/calendar/posts/${postId}/generated-image`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader(),
        },
        body: JSON.stringify({
          svg: imageData.svg,
          pngBase64: imageData.pngBase64,
          template: imageData.templateUsed || imageData.template,
          dimensions: imageData.dimensions,
          contextUsed: imageData.contextUsed || [],
        }),
      }
    );

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || `HTTP ${response.status}`);
    }

    return response.json();
  },

  /**
   * Get generated image for a calendar post
   */
  getGeneratedImage: async (postId) => {
    const response = await fetch(
      `${API.MARNEE}/calendar/posts/${postId}/generated-image`,
      {
        headers: getAuthHeader(),
      }
    );

    if (response.status === 404) {
      return null; // No image exists
    }

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || `HTTP ${response.status}`);
    }

    return response.json();
  },
};

export default calendarPostApi;
```

---

## 🚀 Deployment Steps

### Backend

1. **Run migration:**
   ```bash
   cd /Users/tonyprado/Documents/Proyectos/DNHub/dnhubAI
   psql -d your_database_name -f database/migrations/008_add_generated_images.sql
   ```

2. **Restart backend:**
   ```bash
   # Si usas uvicorn:
   uvicorn app.main:app --reload
   
   # O tu comando de inicio habitual
   ```

### Frontend

1. **Modificar componentes** según las guías anteriores
2. **Build:**
   ```bash
   cd /Users/tonyprado/IdeaProjects/marnee-front
   npm run build
   ```
3. **Deploy**

---

## 🧪 Testing Checklist

### Test 1: Post sin imagen
- [ ] Verificar que solo aparece botón "Generate Image"
- [ ] Click en "Generate Image"
- [ ] Verificar que se genera la imagen
- [ ] Verificar que se guarda en BD (hacer refresh de la página)
- [ ] Después del refresh, verificar que ahora aparecen los botones "Edit Image" y "Regenerate"

### Test 2: Post con imagen
- [ ] Verificar que aparece thumbnail de la imagen
- [ ] Click en "Edit Image"
- [ ] Verificar que abre modal CON la imagen guardada (NO genera nueva)
- [ ] Hacer ediciones y guardar
- [ ] Cerrar modal
- [ ] Verificar que cambios persisten

### Test 3: Regenerar imagen
- [ ] Click en "Regenerate"
- [ ] Verificar que genera NUEVA imagen
- [ ] Verificar que actualiza la guardada en BD
- [ ] Verificar que `updatedAt` cambia pero `createdAt` no

### Test 4: Database
- [ ] Conectar a PostgreSQL
- [ ] Query: `SELECT id, generated_image_svg IS NOT NULL as has_image FROM calendar_posts;`
- [ ] Verificar que posts con imagen tienen `has_image = true`
- [ ] Query: `SELECT generated_image_created_at, generated_image_updated_at FROM calendar_posts WHERE id = 'post_id';`
- [ ] Verificar timestamps

---

## 📊 Tamaño de Datos (Ejemplo Real)

### Ejemplo de un post generado:

| Campo | Tamaño |
|-------|--------|
| SVG | ~35 KB (texto) |
| PNG base64 | ~750 KB |
| Template | ~20 bytes |
| Dimensions | ~50 bytes |
| Context Used | ~100 bytes |
| **Total por post** | **~785 KB** |

### Proyección:

| Posts con imagen | Espacio en BD |
|------------------|---------------|
| 100 posts | ~78 MB |
| 1,000 posts | ~785 MB (~0.77 GB) |
| 10,000 posts | ~7.85 GB |
| 50,000 posts | ~39 GB ⚠️ (considerar S3) |

---

## 🔄 Migración Futura a S3 (Cuando sea necesario)

Si eventualmente necesitas migrar a S3 (por ejemplo, con 50,000+ posts), el proceso sería:

1. **Crear bucket S3**
2. **Script de migración:**
   ```python
   # Migrar imágenes existentes de BD a S3
   - Leer generated_image_svg y generated_image_png_base64
   - Subir a S3
   - Guardar URLs en nuevos campos: generated_image_svg_url, generated_image_png_url
   - Opcionalmente, limpiar campos de base64
   ```
3. **Actualizar endpoints** para usar URLs de S3
4. **No breaking changes** para el frontend (misma estructura de respuesta)

---

## ❓ FAQs

### ¿Por qué no usar S3 desde el inicio?

- Agrega complejidad innecesaria
- Costo mínimo pero innecesario ($0.12/mes vs $0 en BD)
- Más puntos de fallo (S3 downtime, configuración de IAM, etc.)
- Para 1,000-10,000 posts, la BD funciona perfectamente

### ¿Qué pasa si la imagen es muy grande?

- SVG es siempre texto (max ~100KB realísticamente)
- PNG base64 puede ser grande (~1-2MB)
- PostgreSQL soporta campos TEXT de hasta 1GB
- Si necesitas imágenes MUY grandes (raro), considera S3

### ¿Puedo comprimir las imágenes?

Sí, opciones:
1. **PNG:** Ya se genera con compresión (Pillow hace esto automáticamente)
2. **SVG:** Puedes minificar el SVG antes de guardar (quitar espacios, comentarios)
3. **GZIP en BD:** PostgreSQL puede comprimir automáticamente con TOAST

### ¿Afecta el performance?

Para consultas normales: NO
- Los campos de imagen solo se cargan cuando los pides explícitamente
- Usa SELECT específico: `SELECT id, hook, pillar FROM calendar_posts` (NO carga imagen)
- Solo carga imagen cuando: `SELECT generated_image_svg FROM calendar_posts WHERE id = ...`

---

## 📝 Resumen de Archivos Modificados

### Backend (COMPLETADOS ✅)
- `/database/migrations/008_add_generated_images.sql` - Nueva migración
- `/app/models/founder.py` - Campos agregados a CalendarPost
- `/app/routers/calendar.py` - 2 endpoints nuevos
- `/app/database/calendar_repository.py` - 2 funciones nuevas
- `/app/services/calendar_service.py` - 2 métodos nuevos

### Frontend (TO DO ⏳)
- Componente de Post Card - Agregar lógica condicional
- `/src/hooks/useImageGenerator.js` - Agregar save/fetch functions
- `/src/services/calendarPostApi.js` - Crear nuevo helper (opcional)
- Componente ImageGenerator - Integrar save después de generate

---

## 🎯 Próximos Pasos

1. **Deploy backend:**
   - Run migration
   - Restart server

2. **Implementar frontend:**
   - Modificar componente de Post Card
   - Actualizar useImageGenerator
   - Testear flujo completo

3. **Testing:**
   - Generar imagen
   - Verificar persistencia
   - Probar Edit/Regenerate

**Tiempo estimado:** 2-4 horas de desarrollo frontend

¿Necesitas ayuda con alguna parte específica del frontend? 🚀
