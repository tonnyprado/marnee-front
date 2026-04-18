# 🎯 Panel de Administración Marnee - Guía Completa

## ✅ Estado: 100% COMPLETO

Panel de administración completo para gestionar usuarios, suscripciones, SEO y analíticas de la plataforma Marnee.

---

## 📋 Tabla de Contenidos

1. [Características](#características)
2. [Arquitectura](#arquitectura)
3. [Instalación y Configuración](#instalación-y-configuración)
4. [Uso del Panel](#uso-del-panel)
5. [Endpoints API](#endpoints-api)
6. [Estructura de Archivos](#estructura-de-archivos)
7. [Seguridad](#seguridad)

---

## 🎨 Características

### ✅ Gestión de Usuarios
- Listar usuarios con paginación (20 por página)
- Búsqueda por email o nombre
- Editar información (nombre, email)
- Cambiar rol (USER ↔ ADMIN)
- Cambiar contraseña (admin-initiated)
- Eliminar usuarios
- Ver badges de roles con colores

### ✅ Gestión de Suscripciones
- **Planes**: CRUD completo
  - Crear/editar planes de suscripción
  - Configurar precio, moneda, intervalo (mensual/anual)
  - Agregar características/features
  - Activar/desactivar planes
  - Integración preparada para Stripe
- **Suscripciones Activas**: Ver usuarios suscritos

### ✅ Gestión de SEO
- CRUD de configuración SEO por página
- Meta tags básicos:
  - Title (con contador de caracteres)
  - Description (con contador de caracteres)
  - Keywords
- Open Graph para redes sociales:
  - OG Title
  - OG Description
  - OG Image URL
- Configuración avanzada:
  - Canonical URL
  - Robots meta tag
- Vista previa visual de cada configuración

### ✅ Analytics Dashboard
- Overview con métricas generales:
  - Total usuarios, activos, nuevos
  - Calendarios y conversaciones generadas
  - Page views
- Gráficas visuales:
  - Usuarios activos por día (últimos 10 días)
  - Contenido generado (calendarios por día)
  - Top eventos más frecuentes
- Selector de período: 7, 30, 90 días

---

## 🏗️ Arquitectura

```
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND (React)                          │
│  /admin/* - Protegido por RequireAdmin (valida JWT role)   │
└───────────────────────┬─────────────────────────────────────┘
                        │
        ┌───────────────┴───────────────┐
        │                               │
        ▼                               ▼
┌──────────────────┐           ┌──────────────────┐
│  Auth Backend    │           │   AI Backend     │
│  (Spring Boot)   │           │   (FastAPI)      │
│  Port: 8081      │           │   Port: 8000     │
├──────────────────┤           ├──────────────────┤
│ /api/v1/admin/*  │           │ /api/v1/admin/*  │
│ - Users          │           │ - Analytics      │
│ - Subscriptions  │           │ - Content Stats  │
│ - SEO            │           │ - User Activity  │
│ - Audit Logs     │           │                  │
└──────────────────┘           └──────────────────┘
        │                               │
        └───────────────┬───────────────┘
                        ▼
                ┌──────────────┐
                │  PostgreSQL  │
                │  Port: 5432  │
                └──────────────┘
```

---

## 🚀 Instalación y Configuración

### 1. Pre-requisitos

- Node.js 16+ (para frontend)
- Java 17+ (para auth backend)
- Python 3.9+ (para AI backend)
- PostgreSQL 14+

### 2. Configurar Bases de Datos

**Crear tablas en Auth Backend (Spring Boot)**:

Las tablas se crean automáticamente con Hibernate (`ddl-auto: update`):
- `password_reset_tokens`
- `subscription_plans`
- `user_subscriptions`
- `seo_settings`
- `admin_audit_logs`

**Aplicar migración en AI Backend (FastAPI)**:

```bash
cd /Users/tonyprado/Documents/Proyectos/DNHub/dnhubAI
psql -U postgres -d marnee -f database/migrations/006_analytics_tables.sql
```

Esto crea:
- `analytics_events`
- `analytics_daily_summaries`

### 3. Crear Usuario Administrador

```sql
-- Conectarse a la base de datos
psql -U postgres -d marnee

-- Actualizar un usuario existente a ADMIN
UPDATE users SET role = 'ADMIN' WHERE email = 'tu@email.com';

-- Verificar
SELECT id, email, name, role FROM users WHERE role = 'ADMIN';
```

### 4. Iniciar los Backends

**Auth Backend**:
```bash
cd /Users/tonyprado/Documents/Proyectos/DNHub/dnhub-auth
./gradlew bootRun
# Escucha en http://localhost:8081
```

**AI Backend**:
```bash
cd /Users/tonyprado/Documents/Proyectos/DNHub/dnhubAI
python -m uvicorn app.main:app --reload
# Escucha en http://localhost:8000
```

### 5. Iniciar Frontend

```bash
cd /Users/tonyprado/IdeaProjects/marnee-front
npm install  # si es primera vez
npm start
# Abre en http://localhost:3000
```

---

## 🎯 Uso del Panel

### Acceso

1. Ve a: `http://localhost:3000/auth`
2. Inicia sesión con un usuario ADMIN
3. Accede al panel: `http://localhost:3000/admin`

Si el usuario no tiene rol ADMIN, será redirigido a `/app`.

### Navegación

El panel tiene una barra lateral con las siguientes secciones:

1. **Dashboard** (`/admin`)
   - Vista general con estadísticas

2. **Usuarios** (`/admin/users`)
   - Gestión completa de usuarios
   - Búsqueda, edición, roles, contraseñas

3. **Suscripciones** (`/admin/subscriptions`)
   - Gestión de planes
   - Ver suscripciones activas

4. **SEO** (`/admin/seo`)
   - Configuración SEO por página
   - Meta tags y Open Graph

5. **Analytics** (`/admin/analytics`)
   - Métricas y gráficas
   - Selección de período

---

## 📡 Endpoints API

### Auth Backend (Spring Boot) - `/api/v1/admin/*`

**Usuarios**:
```
GET    /admin/users?page=0&size=20        - Listar usuarios
GET    /admin/users/{id}                  - Usuario por ID
GET    /admin/users/search?query=email    - Buscar usuarios
PUT    /admin/users/{id}                  - Actualizar usuario
PUT    /admin/users/{id}/role             - Cambiar rol
PUT    /admin/users/{id}/password         - Cambiar contraseña
DELETE /admin/users/{id}                  - Eliminar usuario
```

**Suscripciones**:
```
GET    /admin/subscriptions/plans         - Listar planes
POST   /admin/subscriptions/plans         - Crear plan
PUT    /admin/subscriptions/plans/{id}    - Actualizar plan
GET    /admin/subscriptions/users         - Listar suscripciones
POST   /admin/subscriptions/users/{userId} - Asignar plan a usuario
```

**SEO**:
```
GET    /admin/seo                         - Listar configuraciones
GET    /admin/seo/page?path=/ruta         - Obtener por path
POST   /admin/seo                         - Crear configuración
PUT    /admin/seo/{id}                    - Actualizar
DELETE /admin/seo/{id}                    - Eliminar
```

**Dashboard**:
```
GET    /admin/dashboard/stats             - Estadísticas generales
GET    /admin/audit-logs?page=0&size=50   - Logs de auditoría
```

### AI Backend (FastAPI) - `/api/v1/admin/*`

**Analytics**:
```
GET    /admin/analytics/overview?days=30  - Resumen general
GET    /admin/analytics/users?days=30     - Métricas de usuarios
GET    /admin/analytics/content?days=30   - Métricas de contenido
GET    /admin/analytics/daily?days=30     - Resúmenes diarios
```

**Contenido**:
```
GET    /admin/calendars?limit=100&offset=0 - Todos los calendarios
GET    /admin/founders?limit=100&offset=0  - Todos los founders
GET    /admin/users/{id}/activity          - Actividad de usuario
```

---

## 📁 Estructura de Archivos

### Frontend

```
src/
├── admin/
│   ├── AdminLayout.jsx           # Layout principal con sidebar
│   ├── components/               # (Para componentes reutilizables)
│   └── pages/
│       ├── AdminDashboard.jsx    # Dashboard principal
│       ├── UserManagement.jsx    # Gestión de usuarios
│       ├── SubscriptionPlans.jsx # Gestión de planes
│       ├── SeoManagement.jsx     # Gestión de SEO
│       └── AnalyticsDashboard.jsx # Analytics
├── guards/
│   └── RequireAdmin.jsx          # Protección de rutas admin
└── services/
    └── adminApi.js               # Cliente API completo
```

### Auth Backend (Spring Boot)

```
src/main/java/com/dnhub/auth/
├── config/
│   └── SecurityConfig.java       # ✏️ Modificado: protección /admin/**
├── controller/
│   └── AdminController.java      # ✨ Nuevo: 20+ endpoints
├── service/
│   ├── AdminService.java         # ✨ Nuevo: lógica de negocio
│   └── JwtService.java           # ✏️ Modificado: agrega role a JWT
├── repository/
│   ├── PasswordResetTokenRepository.java  # ✨ Nuevo
│   ├── SubscriptionPlanRepository.java    # ✨ Nuevo
│   ├── UserSubscriptionRepository.java    # ✨ Nuevo
│   ├── SeoSettingsRepository.java         # ✨ Nuevo
│   └── AdminAuditLogRepository.java       # ✨ Nuevo
├── model/
│   ├── PasswordResetToken.java   # ✨ Nuevo
│   ├── SubscriptionPlan.java     # ✨ Nuevo
│   ├── UserSubscription.java     # ✨ Nuevo
│   ├── SeoSettings.java          # ✨ Nuevo
│   └── AdminAuditLog.java        # ✨ Nuevo
└── dto/admin/
    ├── AdminUserResponse.java    # ✨ Nuevo (11 DTOs en total)
    └── ...
```

### AI Backend (FastAPI)

```
app/
├── auth/
│   ├── jwt_handler.py            # ✏️ Modificado: extrae role
│   └── admin_guard.py            # ✨ Nuevo: validación ADMIN
├── routers/
│   └── admin.py                  # ✨ Nuevo: 12 endpoints
├── database/
│   └── admin_repository.py       # ✨ Nuevo: queries analytics
└── main.py                       # ✏️ Modificado: registra admin router
```

---

## 🔐 Seguridad

### 1. Autenticación por Roles

- JWT incluye claim `role` con valor `ROLE_ADMIN` o `ROLE_USER`
- Frontend: `RequireAdmin` valida el rol antes de renderizar
- Backend Auth: Spring Security requiere `hasRole("ADMIN")`
- Backend AI: FastAPI `get_admin_user` valida el rol

### 2. Auditoría

Todas las acciones de admin se registran en `admin_audit_logs`:
- Usuario que realizó la acción
- Tipo de acción (USER_UPDATED, PLAN_CREATED, etc.)
- Valores antiguos y nuevos (para updates)
- IP address y User Agent
- Timestamp

### 3. Validaciones

- Email format validation
- Password strength (mínimo 6 caracteres)
- URL format para canonical URLs
- Role enum validation
- Input sanitization

### 4. Protección de Rutas

**Frontend**:
```javascript
<RequireAuth>
  <RequireAdmin>
    <AdminLayout />
  </RequireAdmin>
</RequireAuth>
```

**Backend Auth (Spring Boot)**:
```java
.requestMatchers("/api/v1/admin/**").hasRole("ADMIN")
```

**Backend AI (FastAPI)**:
```python
admin: AuthenticatedUser = Depends(get_admin_user)
```

---

## 🧪 Testing

### Crear Datos de Prueba

**Plan de suscripción**:
```sql
INSERT INTO subscription_plans (id, name, description, price_cents, currency, interval, features, is_active)
VALUES (
  gen_random_uuid(),
  'Plan Explorer',
  'Plan básico para comenzar',
  9900,
  'USD',
  'month',
  '["Hasta 5 usuarios", "Calendarios ilimitados", "Soporte por email"]'::jsonb,
  true
);
```

**Configuración SEO**:
```sql
INSERT INTO seo_settings (id, page_path, title, description, keywords, robots)
VALUES (
  gen_random_uuid(),
  '/',
  'Marnee - Plataforma de Marketing con IA',
  'Genera contenido y estrategias de marketing con inteligencia artificial',
  'marketing, ia, contenido, redes sociales',
  'index, follow'
);
```

---

## 📊 Próximos Pasos (Opcional)

### 1. Integración con Stripe

- Configurar webhook endpoint
- Sincronizar estados de suscripción
- Implementar checkout flow
- Manejar webhooks: `customer.subscription.created`, `updated`, `deleted`

### 2. Analytics Avanzados

- Gráficas con bibliotecas como Chart.js o Recharts
- Exportación de datos (CSV, PDF)
- Filtros avanzados (rango de fechas personalizado)
- Comparación de períodos

### 3. Notificaciones

- Email notifications para admins
- Alertas en tiempo real
- Dashboard de notificaciones

### 4. Permisos Granulares

- Roles adicionales: MODERATOR, SUPPORT
- Permisos por módulo
- Registro de permisos en audit log

---

## 💡 Tips

1. **Búsqueda de Usuarios**: Usa el buscador para encontrar usuarios rápidamente por email o nombre
2. **Período de Analytics**: Cambia entre 7, 30 y 90 días para ver diferentes tendencias
3. **SEO Optimization**: Los contadores de caracteres te ayudan a optimizar title (50-60) y description (120-160)
4. **Audit Logs**: Revisa los logs regularmente para detectar actividades sospechosas

---

## 📞 Soporte

Si encuentras problemas:

1. Verifica que los 3 servidores estén corriendo
2. Revisa la consola del navegador (F12) para errores
3. Verifica los logs de los backends
4. Confirma que el usuario tiene rol ADMIN en la base de datos

---

## 🎉 ¡Listo!

El panel de administración está 100% funcional y listo para usar. Disfruta gestionando tu plataforma Marnee con todas estas herramientas poderosas.
