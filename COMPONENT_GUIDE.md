# 📦 Guía de Componentes Reutilizables

## 🎯 Componentes de Dashboard

### TopTabs
Tabs horizontales premium para navegación del dashboard.

```jsx
import { TopTabs } from '../../Component/Dashboard';

<TopTabs
  tabs={["Overview", "Analytics", "Settings"]}
  activeTab={activeTab}
  onTabChange={(key) => setActiveTab(key)}
/>
```

**Props:**
- `tabs` (array) - Lista de nombres de tabs
- `activeTab` (string) - Tab actualmente activo (kebab-case)
- `onTabChange` (function) - Callback cuando cambia el tab

---

### PageHeader
Encabezado de página con título y acciones.

```jsx
import { PageHeader, DashboardButton } from '../../Component/Dashboard';

<PageHeader
  title="Content Marketing"
  subtitle="Instagram Graph API — organic performance"
  actions={
    <>
      <DashboardButton variant="secondary" icon={<CalendarIcon />}>
        Last 30 days
      </DashboardButton>
      <DashboardButton variant="primary" icon={<LinkIcon />}>
        Connect Instagram
      </DashboardButton>
    </>
  }
/>
```

**Props:**
- `title` (string) - Título principal (usa Noto Serif)
- `subtitle` (string) - Subtítulo opcional
- `actions` (ReactNode) - Botones de acción

---

### DashboardCard
Card contenedor con estilo premium.

```jsx
import { DashboardCard } from '../../Component/Dashboard';

<DashboardCard title="TOP PERFORMING POSTS">
  <div>Your content here</div>
</DashboardCard>

// Sin título
<DashboardCard>
  <div>Your content here</div>
</DashboardCard>

// Sin padding interno
<DashboardCard noPadding>
  <table>...</table>
</DashboardCard>
```

**Props:**
- `title` (string) - Título de la card (uppercase automático)
- `children` (ReactNode) - Contenido de la card
- `className` (string) - Clases adicionales
- `noPadding` (boolean) - Remueve padding interno

---

### DashboardButton
Botones con estilo premium.

```jsx
import { DashboardButton } from '../../Component/Dashboard';

// Primary button (morado)
<DashboardButton
  variant="primary"
  icon={<LinkIcon />}
  onClick={handleClick}
>
  Connect Account
</DashboardButton>

// Secondary button (borde lilac)
<DashboardButton
  variant="secondary"
  icon={<CalendarIcon />}
  onClick={handleClick}
>
  Last 30 days
</DashboardButton>
```

**Props:**
- `variant` (string) - "primary" | "secondary"
- `icon` (ReactNode) - Ícono SVG (13x13)
- `onClick` (function) - Handler del click
- `children` (ReactNode) - Texto del botón
- `className` (string) - Clases adicionales

---

## 🧭 Componentes de Navegación

### NavItem
Item de navegación para el sidebar.

```jsx
import { NavItem } from '../../Component/Navbar';

<NavItem
  id="dashboard"
  label="My Dashboard"
  icon={<DashboardIcon />}
  isActive={active === "dashboard"}
  collapsed={collapsed}
  onClick={() => navigate("/app/dashboard")}
/>
```

**Props:**
- `id` (string) - Identificador único
- `label` (string) - Texto del item
- `icon` (ReactNode) - Ícono SVG (16x16)
- `isActive` (boolean) - Si está activo
- `collapsed` (boolean) - Si el sidebar está colapsado
- `onClick` (function) - Handler del click

---

### UserMenu
Menú de usuario en el sidebar.

```jsx
import { UserMenu } from '../../Component/Navbar';

<UserMenu
  displayName="Diana Nonea"
  email="diana@example.com"
  initials="DN"
  collapsed={collapsed}
  onNavigate={(path) => navigate(path)}
  onLogout={() => setShowLogout(true)}
  t={t}
/>
```

**Props:**
- `displayName` (string) - Nombre del usuario
- `email` (string) - Email del usuario
- `initials` (string) - Iniciales (2 letras)
- `collapsed` (boolean) - Si el sidebar está colapsado
- `onNavigate` (function) - Handler para navegación
- `onLogout` (function) - Handler para logout
- `t` (function) - Función de traducción

---

### SidebarLogo
Logo del sidebar con toggle.

```jsx
import { SidebarLogo } from '../../Component/Navbar';

<SidebarLogo
  collapsed={collapsed}
  onToggleCollapse={() => setCollapsed(!collapsed)}
/>
```

**Props:**
- `collapsed` (boolean) - Si el sidebar está colapsado
- `onToggleCollapse` (function) - Handler para toggle

---

## 🎨 Ejemplos de Uso Completo

### Dashboard Section

```jsx
import { PageHeader, DashboardCard, DashboardButton } from '../../Component/Dashboard';

export default function ContentMarketingSection() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Content Marketing"
        subtitle="Instagram Graph API — organic performance"
        actions={
          <>
            <DashboardButton variant="secondary">
              Last 30 days
            </DashboardButton>
            <DashboardButton variant="primary">
              Connect Instagram
            </DashboardButton>
          </>
        }
      />

      <div className="grid grid-cols-4 gap-3.5">
        <DashboardCard title="TOTAL REACH">
          <div className="text-[26px] font-['Noto_Serif'] font-bold text-[#40086d]">
            128.4K
          </div>
        </DashboardCard>
        {/* More cards... */}
      </div>
    </div>
  );
}
```

---

### Custom Dashboard Page

```jsx
import { useState } from 'react';
import { TopTabs, PageHeader, DashboardCard } from '../../Component/Dashboard';

export default function MyCustomDashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="flex-1 flex flex-col">
      <TopTabs
        tabs={["Overview", "Analytics", "Reports"]}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      <div className="p-8">
        {activeTab === "overview" && (
          <div className="space-y-6">
            <PageHeader title="Overview Dashboard" />
            <DashboardCard title="METRICS">
              <p>Your metrics here</p>
            </DashboardCard>
          </div>
        )}
      </div>
    </div>
  );
}
```

---

## 🎨 Estilos CSS Recomendados

### Métricas con Blur

```jsx
<div className="text-[26px] font-['Noto_Serif'] font-bold text-[#40086d] blur-[6px] select-none">
  128.4K
</div>
<div className="text-[11px] text-[rgba(30,30,30,0.38)] flex items-center gap-1">
  <LockIcon className="w-3 h-3" />
  Connect to unlock
</div>
```

### Grid de Cards

```jsx
// 4 columnas
<div className="grid grid-cols-4 gap-3.5">
  <DashboardCard>...</DashboardCard>
  <DashboardCard>...</DashboardCard>
  <DashboardCard>...</DashboardCard>
  <DashboardCard>...</DashboardCard>
</div>

// 2 columnas
<div className="grid grid-cols-2 gap-3.5">
  <DashboardCard>...</DashboardCard>
  <DashboardCard>...</DashboardCard>
</div>
```

### Divisor Decorativo

```jsx
<div className="h-px bg-[#dccaf4] my-4 opacity-60" />
```

### Connect State (Empty State)

```jsx
<div className="bg-[#f6f6f6] border border-dashed border-[#dccaf4] rounded-[10px] p-12 flex flex-col items-center text-center gap-3.5">
  <div className="w-[52px] h-[52px] bg-[#ede0f8] rounded-xl flex items-center justify-center">
    <InstagramIcon className="w-6 h-6 text-[#40086d]" />
  </div>
  <h3 className="font-['Noto_Serif'] text-base font-bold text-[#1e1e1e]">
    Connect your Instagram account
  </h3>
  <p className="text-[12.5px] text-[rgba(30,30,30,0.55)] max-w-md leading-relaxed">
    Link your Instagram Business account to start seeing reach, engagement, and more.
  </p>
  <DashboardButton variant="primary">
    Connect Instagram Business account
  </DashboardButton>
</div>
```

---

## 🎯 Variables CSS para Usar

```css
/* Colores */
bg-[#1a0530]    /* Sidebar oscuro */
bg-[#f6f6f6]    /* Fondo principal */
bg-[#40086d]    /* Botones primarios */
bg-[#dccaf4]    /* Bordes */
bg-[#ede0f8]    /* Hover suave */

text-[#1e1e1e]  /* Texto principal */
text-[rgba(30,30,30,0.55)]  /* Texto secundario */
text-[rgba(30,30,30,0.38)]  /* Texto muted */
text-[#40086d]  /* Texto accent */

border-[#dccaf4]  /* Bordes cards */

/* Fuentes */
font-['Noto_Serif']  /* Títulos */
font-['DM_Sans']     /* UI/Body */

/* Tamaños comunes */
text-[22px]   /* Page titles */
text-[13px]   /* Body text */
text-[12.5px] /* Small text */
text-[11px]   /* Tiny labels */
text-[10px]   /* Card titles (uppercase) */

/* Espaciado */
p-8      /* Page padding */
px-5     /* Card horizontal padding */
py-[18px] /* Card vertical padding */
gap-3.5  /* Grid gaps */

/* Bordes */
rounded-[10px]  /* Cards */
rounded-[7px]   /* Buttons */
rounded-lg      /* Nav items */
```

---

## 📱 Responsive

Los componentes son automáticamente responsive:

- **Desktop (>1024px):** Sidebar expandible
- **Tablet/Mobile (<1024px):** Sidebar colapsado (80px)
- Usa `max-lg:hidden` para ocultar texto en móvil
- Usa `max-lg:justify-center` para centrar en móvil

---

**¡Listo para usar! 🚀**
