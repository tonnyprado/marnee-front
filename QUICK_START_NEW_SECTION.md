# 🚀 Quick Start - Crear Nueva Sección del Dashboard

## Template Rápido para Nuevas Secciones

Copia y pega este template para crear una nueva sección en 5 minutos:

```jsx
/**
 * [TU SECCIÓN] Component
 * Descripción de tu sección
 */
import { useState, useEffect } from 'react';
import {
  PageHeader,
  DashboardButton,
  DashboardCard,
  DataGuard,
  ConnectState,
  LockedMetricCard,
  PreviewLabel
} from '../../../Component/Dashboard';
import { useInstagramData } from '../../../hooks/useInstagramData';
// import { getTuEndpoint } from '../../../services/tuApi';

// Icons
const YourIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
    {/* Tu SVG aquí */}
  </svg>
);

const LinkIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
  </svg>
);

export default function TuSeccionSection() {
  // 1. USAR EL HOOK DE DETECCIÓN
  const { isLoading, hasData, isConnected } = useInstagramData();

  // 2. ESTADO LOCAL PARA TUS DATOS
  const [data, setData] = useState(null);
  const [loadingData, setLoadingData] = useState(false);

  // 3. FETCH DATA CUANDO ESTÉ CONECTADO
  useEffect(() => {
    if (hasData && !data) {
      fetchData();
    }
  }, [hasData]);

  const fetchData = async () => {
    try {
      setLoadingData(true);
      // const result = await getTuEndpoint();
      // setData(result);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoadingData(false);
    }
  };

  const handleConnect = () => {
    // connectTuServicio();
  };

  return (
    <div className="space-y-6">
      {/* 4. PAGE HEADER */}
      <PageHeader
        title="Tu Título"
        subtitle="Subtítulo descriptivo"
        actions={
          <>
            {!isConnected && (
              <DashboardButton
                variant="primary"
                icon={<LinkIcon />}
                onClick={handleConnect}
              >
                Connect Account
              </DashboardButton>
            )}
          </>
        }
      />

      {/* 5. DATAGUARD WRAPPER */}
      <DataGuard
        isLoading={isLoading}
        hasData={hasData}
        connectState={{
          icon: <YourIcon />,
          title: "Conecta tu cuenta",
          description: "Descripción de por qué conectar...",
          features: ["Feature 1", "Feature 2", "Feature 3"],
          buttonText: "Connect Account",
          buttonIcon: <LinkIcon />,
          onConnect: handleConnect,
          note: "Nota adicional si es necesario"
        }}
      >
        {/* 6. CONTENIDO CUANDO HAY DATOS */}
        <div className="space-y-5">
          {/* Métricas */}
          <div className="grid grid-cols-4 gap-3.5">
            <LockedMetricCard
              label="Métrica 1"
              value={loadingData ? "..." : "1,234"}
              locked={!data}
            />
            <LockedMetricCard
              label="Métrica 2"
              value={loadingData ? "..." : "56%"}
              locked={!data}
            />
            {/* Más métricas... */}
          </div>

          {/* Preview Label si no hay datos reales */}
          {!data && <PreviewLabel />}

          {/* Tus cards y visualizaciones */}
          {data ? (
            <DashboardCard title="Datos Reales">
              {/* Mostrar tus datos reales aquí */}
            </DashboardCard>
          ) : (
            <div className="opacity-40 pointer-events-none">
              <DashboardCard title="Preview">
                {/* Datos de preview/demo */}
              </DashboardCard>
            </div>
          )}
        </div>
      </DataGuard>
    </div>
  );
}
```

---

## 🎯 Checklist Rápido

Cuando crees una nueva sección, sigue estos pasos:

### **1. Crear el Component**
```
src/Pages/Tools/MyDashboardSections/
└── TuSeccionSection.jsx  ← Tu nueva sección
```

### **2. Hook de Detección**
```jsx
// Para Instagram:
import { useInstagramData } from '../../../hooks/useInstagramData';

// Para Meta Ads:
import { useMetaAdsData } from '../../../hooks/useMetaAdsData';

// O crear uno nuevo si es otro servicio
```

### **3. Estructura Base:**
```
PageHeader
  └─ Título, subtítulo, botones

DataGuard
  ├─ isLoading → Muestra spinner
  ├─ !hasData → Muestra ConnectState
  └─ hasData → Muestra tu contenido
      ├─ LockedMetricCard (si !data)
      ├─ PreviewLabel (si !data)
      └─ Contenido real (si data)
```

### **4. Agregar al Dashboard Principal:**

```jsx
// En MyDashboard.jsx
import TuSeccionSection from './MyDashboardSections/TuSeccionSection';

// Agregar tab
const tabs = [
  "Brand Profile",
  "Current Trends",
  "Campaigns",
  "Strategy",
  "Tu Sección",  // ← Nuevo tab
];

// Agregar contenido
{activeTab === "tu-seccion" && (
  <motion.div ...>
    <TuSeccionSection />
  </motion.div>
)}
```

---

## 📦 Componentes Que SIEMPRE Usarás

### **1. PageHeader (Obligatorio)**
```jsx
<PageHeader
  title="Título"
  subtitle="Subtítulo"
  actions={<Botones />}
/>
```

### **2. DataGuard (Obligatorio)**
```jsx
<DataGuard
  isLoading={...}
  hasData={...}
  connectState={{...}}
>
  {children}
</DataGuard>
```

### **3. LockedMetricCard (Recomendado)**
```jsx
<LockedMetricCard
  label="Total"
  value="1,234"
  locked={!data}
/>
```

### **4. DashboardCard (Para agrupar)**
```jsx
<DashboardCard title="Mi Card">
  {/* contenido */}
</DashboardCard>
```

### **5. PreviewLabel (Cuando no hay datos)**
```jsx
<PreviewLabel />
<div className="opacity-40 pointer-events-none">
  {preview content}
</div>
```

---

## 🎨 Grid Layouts Comunes

### **4 Columnas (Métricas):**
```jsx
<div className="grid grid-cols-4 gap-3.5">
  <LockedMetricCard />
  <LockedMetricCard />
  <LockedMetricCard />
  <LockedMetricCard />
</div>
```

### **2 Columnas (Charts/Cards):**
```jsx
<div className="grid grid-cols-2 gap-3.5">
  <DashboardCard />
  <DashboardCard />
</div>
```

### **3 Columnas:**
```jsx
<div className="grid grid-cols-3 gap-3.5">
  <DashboardCard />
  <DashboardCard />
  <DashboardCard />
</div>
```

---

## 🔗 Conectar con API

### **1. Crear servicio en `services/`:**

```jsx
// src/services/tuServicioApi.js
import apiClient from '../core/services/ApiClient';

const API_BASE_URL = process.env.REACT_APP_API_MARNEE || 'http://127.0.0.1:8000/api/v1';

export const getTuDatos = async () => {
  try {
    const response = await apiClient.get(`${API_BASE_URL}/tu-endpoint`);
    return response.data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};
```

### **2. Crear hook si es un nuevo servicio:**

```jsx
// src/hooks/useTuServicio.js
import { useState, useEffect } from 'react';
import { getTuStatus } from '../services/tuServicioApi';

export function useTuServicio() {
  const [state, setState] = useState({
    isLoading: true,
    isConnected: false,
    hasData: false,
    error: null
  });

  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    try {
      const status = await getTuStatus();
      setState({
        isLoading: false,
        isConnected: status.connected,
        hasData: status.connected,
        error: null
      });
    } catch (error) {
      setState({
        isLoading: false,
        isConnected: false,
        hasData: false,
        error: error
      });
    }
  };

  return state;
}
```

---

## ⚡ Tips & Tricks

### **Loading States:**
```jsx
{loadingData ? "..." : "1,234"}
```

### **Conditional Rendering:**
```jsx
{data ? <RealData /> : <PreviewData />}
```

### **Preview Overlay:**
```jsx
<div className="opacity-40 pointer-events-none">
  {/* Deshabilitado hasta conectar */}
</div>
```

### **Skeleton Loaders:**
```jsx
<div className="space-y-2">
  <div className="h-3 bg-[#ede0f8] rounded w-3/4 animate-pulse" />
  <div className="h-2.5 bg-[#ede0f8] rounded w-1/2 animate-pulse" />
</div>
```

---

## 🎯 Ejemplos Reales

### **Ver estos archivos para referencia:**

1. **ContentMarketingSection.jsx**
   - Ejemplo completo con Instagram
   - Métricas, cards, estados

2. **BrandProfileSection.jsx**
   - Ejemplo de sección sin API externa
   - Formularios, estados locales

3. **CampaignsSection.jsx**
   - Ejemplo con datos propios de Marnee
   - CRUD operations

---

## ✅ Checklist Final

Antes de dar por terminada tu sección:

- [ ] PageHeader con título y subtítulo
- [ ] DataGuard envolviendo todo
- [ ] Hook de detección implementado
- [ ] ConnectState configurado
- [ ] LockedMetricCard para métricas
- [ ] PreviewLabel antes de datos demo
- [ ] Loading states manejados
- [ ] Error handling implementado
- [ ] Responsive (grid-cols funciona en móvil)
- [ ] Botón de "Connect" funcional
- [ ] Datos reales se muestran cuando conectado
- [ ] Preview data visible cuando desconectado

---

**¡Listo! Con este template puedes crear cualquier sección del dashboard en minutos.** 🚀

