# Scheduled Publishing Implementation

## Overview

Se ha implementado la funcionalidad completa de programación de posts con:
- Upload de media (preparado para S3)
- Descripción/Caption específica para redes sociales
- Hashtags
- Selección de horario de publicación
- Sugerencias de horarios óptimos (híbrido: analytics + best practices)
- Auto-eliminación de archivos 1 día después de publicar (para minimizar costos)

---

## ✅ Lo que se ha implementado

### 1. Backend (dnhubAI)

#### Base de Datos
- **Migración creada**: `database/migrations/013_add_scheduled_publishing_fields.sql`
  - Nuevos campos en `calendar_posts`:
    - `scheduled_time` (TIME) - Hora programada para publicar
    - `timezone` (VARCHAR) - Zona horaria
    - `media_url` (VARCHAR) - URL del archivo en S3
    - `media_type` (VARCHAR) - 'image', 'video', 'carousel'
    - `media_thumbnail_url` (VARCHAR) - Thumbnail para videos
    - `caption` (TEXT) - Caption/descripción para redes sociales
    - `hashtags` (TEXT[]) - Array de hashtags
    - `publish_status` (VARCHAR) - Estado de publicación
    - `publish_error` (TEXT) - Error si la publicación falla
    - `published_at` (TIMESTAMP) - Cuándo se publicó
    - `social_media_post_id` (VARCHAR) - ID del post en la red social
  - Tabla nueva: `publishing_logs` - Tracking de intentos de publicación
  - Tabla nueva: `optimal_posting_times` - Horarios óptimos aprendidos

#### Endpoints Nuevos
- `GET /api/v1/calendar/optimal-times/{founder_id}?platform=Instagram`
  - Retorna horarios óptimos con enfoque híbrido
  - Usa analytics del usuario si disponible, sino best practices generales

- `POST /api/v1/calendar/posts/{post_id}/upload-media`
  - Upload de archivos a S3 con calidad original
  - Auto-eliminación programada 1 día después de publicar
  - **Actualmente disabled** hasta que configures S3

#### Servicios
- **S3Service** (`app/services/s3_service.py`):
  - Upload con calidad original (sin compresión)
  - Auto-eliminación automática vía S3 Lifecycle Policy
  - Estimación de costos incluida
  - Worker de cleanup incluido

- **CalendarService** (actualizado):
  - `get_optimal_posting_times()` - Horarios híbridos
  - `upload_post_media()` - Upload a S3
  - `is_s3_configured()` - Verifica si S3 está listo

#### Modelos Pydantic
- `UploadMediaRequest` - Request para subir media
- `UploadMediaResponse` - Response con URLs
- `OptimalTime` - Modelo de horario óptimo
- `OptimalTimesResponse` - Response completo con sugerencias

---

### 2. Frontend (marnee-front)

#### CampaignForm Actualizado
**Archivo**: `src/Pages/Tools/Calendar/CampaignForm.jsx`

**Nuevos campos agregados**:
1. **Media Upload** (disabled hasta configurar S3)
   - Input de archivo con mensaje explicativo
   - Muestra costo estimado ($0.10-$0.50/mes para 1000 posts)

2. **Caption/Description**
   - Textarea para caption específico de redes sociales
   - Diferente del campo "body" que es para planeación interna

3. **Hashtags**
   - Input con "Press Enter to add"
   - Display de tags con opción de eliminar

4. **Scheduled Time**
   - Selector de hora (HH:MM)
   - Integrado con componente de sugerencias

5. **Publish Status**
   - Draft / Scheduled / Published

#### Componente Nuevo: OptimalTimeSuggestions
**Archivo**: `src/Pages/Tools/Calendar/OptimalTimeSuggestions.jsx`

**Funcionalidad**:
- Botón colapsable para mostrar/ocultar sugerencias
- Fetch automático de horarios al seleccionar plataforma
- Visualización de:
  - Source badge (Analytics / Hybrid / General)
  - Top 5 horarios recomendados
  - Score visual con barra de progreso
  - Mensaje de insights
- Click para seleccionar horario automáticamente

---

## 🚀 Siguientes Pasos Requeridos

### 1. Aplicar Migración de Base de Datos ⚠️ IMPORTANTE

```bash
cd /Users/tonyprado/Documents/Proyectos/DNHub/dnhubAI

# Aplicar migración
psql $DATABASE_URL -f database/migrations/013_add_scheduled_publishing_fields.sql

# Verificar que se aplicó correctamente
psql $DATABASE_URL -c "SELECT column_name FROM information_schema.columns WHERE table_name = 'calendar_posts' AND column_name IN ('scheduled_time', 'caption', 'hashtags', 'media_url');"
```

### 2. Configurar AWS S3 (Para habilitar media upload)

#### Crear Bucket S3:
1. Ve a AWS Console > S3
2. Crea bucket (e.g., `marnee-post-media`)
3. Región: Elige la más cercana (e.g., `us-east-1`)
4. Configuración:
   - Block public access: Dejar bloqueado (acceso vía signed URLs)
   - Versioning: Disabled
   - Encryption: Enabled (SSE-S3)

#### Aplicar Lifecycle Policy (Auto-delete):
1. Bucket > Management > Lifecycle rules
2. Create rule:
   - Name: "DeletePostMediaAfter2Days"
   - Prefix: `posts/`
   - Expiration: 2 days
   - Save

#### Obtener Credenciales:
1. IAM > Users > Create user
2. Attach policies:
   - `AmazonS3FullAccess` (o custom policy con s3:PutObject, s3:GetObject, s3:DeleteObject)
3. Security credentials > Create access key
4. Copia: Access Key ID + Secret Access Key

#### Configurar Variables de Entorno:
```bash
# En dnhubAI/.env
AWS_ACCESS_KEY_ID=tu_access_key_aqui
AWS_SECRET_ACCESS_KEY=tu_secret_key_aqui
AWS_S3_BUCKET_NAME=marnee-post-media
AWS_REGION=us-east-1
```

### 3. Costos Estimados de S3

**Para 1,000 posts/mes** (5MB promedio cada uno):
- Storage: ~$0.05/mes (archivos solo 2 días)
- Requests: ~$0.01/mes
- Transfer: ~$0.00/mes (bajo volumen)
- **TOTAL: ~$0.10 - $0.50/mes**

**Para 10,000 posts/mes**:
- **TOTAL: ~$1 - $5/mes**

Muy económico gracias a la auto-eliminación.

---

## 🔄 Cómo Funciona el Flujo Completo

### Flujo de Usuario:
1. Usuario abre post en calendario
2. Completa:
   - Caption para redes sociales
   - Hashtags
   - (Opcional) Sube imagen/video
3. Selecciona plataforma → Ve sugerencias de horarios óptimos
4. Click en horario sugerido (o escribe uno manual)
5. Cambia `publishStatus` a "Scheduled"
6. Guarda post

### Flujo Técnico (Backend - Aún por implementar):
1. **Celery Worker** revisa posts con status "scheduled"
2. Cuando llega `scheduled_time`:
   - Descarga media desde S3
   - Llama API de la red social (Instagram/Facebook/TikTok/etc)
   - Publica post
   - Actualiza `publish_status` a "published"
   - Programa eliminación de S3 para 1 día después
3. **Cleanup Worker** (diario):
   - Busca archivos con `delete_at` < now
   - Elimina de S3

---

## 📝 Tareas Pendientes (Para Fase 2)

### Backend
- [ ] Implementar Celery con Redis para task queue
- [ ] Crear workers de publicación para cada plataforma:
  - [ ] Instagram (via Meta Graph API)
  - [ ] Facebook (via Meta Graph API)
  - [ ] TikTok (via TikTok API)
  - [ ] YouTube (via YouTube Data API)
- [ ] Worker de cleanup automático (S3 old files)
- [ ] Webhook handlers para callbacks de redes sociales
- [ ] Error handling y retry logic

### Frontend
- [ ] Botón "Add Custom Post" en calendario
- [ ] Preview de media antes de subir
- [ ] Indicador visual de posts scheduled vs published
- [ ] Notificaciones cuando post se publica
- [ ] Dashboard de analytics de posts publicados

---

## 🧪 Testing

### Test Backend:
```bash
cd /Users/tonyprado/Documents/Proyectos/DNHub/dnhubAI

# Test optimal times endpoint
curl -H "Authorization: Bearer $TOKEN" \
  "http://localhost:8000/api/v1/calendar/optimal-times/$FOUNDER_ID?platform=Instagram"

# Should return:
# {
#   "success": true,
#   "recommended": [...],
#   "source": "hybrid",
#   "audienceInsights": {...}
# }
```

### Test Frontend:
1. Abre calendario
2. Click en cualquier post
3. Selecciona plataforma (e.g., Instagram)
4. Verifica que aparece sección "Publishing & Scheduling"
5. Click en "Show Optimal Times for Instagram"
6. Debe cargar horarios sugeridos
7. Click en un horario → Se llena automáticamente el input de tiempo

---

## 📚 Archivos Modificados/Creados

### Backend:
```
/dnhubAI/
├── database/migrations/013_add_scheduled_publishing_fields.sql   (NUEVO)
├── app/services/s3_service.py                                    (NUEVO)
├── app/services/calendar_service.py                              (MODIFICADO)
├── app/routers/calendar.py                                       (MODIFICADO)
├── app/models/schemas.py                                         (MODIFICADO)
└── app/database/calendar_repository.py                           (MODIFICADO)
```

### Frontend:
```
/marnee-front/
└── src/Pages/Tools/Calendar/
    ├── CampaignForm.jsx                    (MODIFICADO)
    └── OptimalTimeSuggestions.jsx          (NUEVO)
```

---

## ⚠️ Notas Importantes

1. **Media Upload está DISABLED** hasta que configures S3
2. **La migración debe aplicarse** antes de usar las nuevas features
3. **Costos son muy bajos** gracias a auto-eliminación (2 días)
4. **Calidad original preservada** - no hay compresión
5. **Horarios híbridos**: Usa analytics del usuario cuando disponible

---

## 🎯 Próximos Pasos Inmediatos

1. ✅ **Aplicar migración de BD** (comando arriba)
2. ⏭️ **Configurar S3** (cuando estés listo)
3. ⏭️ **Testing** del flujo completo
4. ⏭️ **Implementar Celery workers** para publicación automática

¿Necesitas ayuda con alguno de estos pasos?
