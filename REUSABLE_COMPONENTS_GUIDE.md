# Guía de Componentes Reutilizables

## Arquitectura de Componentes

Esta guía documenta todos los componentes reutilizables creados para el dashboard interactivo de Marnee. Todos los componentes siguen el principio de **responsabilidad única** y están diseñados para ser **altamente reutilizables**.

---

## 📊 Componentes de Datos

### 1. MetricsGrid

**Ubicación:** `/src/Component/Dashboard/MetricsGrid.jsx`

**Propósito:** Cuadrícula de métricas con animaciones y estados de carga.

**Props:**
```javascript
{
  metrics: [
    {
      key: 'unique-id',           // ID único
      label: 'Total Reach',       // Etiqueta
      value: 128400,              // Valor numérico
      format: 'number',           // 'number' | 'decimal'
      suffix: '',                 // Sufijo (ej: '%', 'K')
      prefix: '',                 // Prefijo (ej: '+', '$')
      trend: {                    // Tendencia (opcional)
        value: 12.5,
        isPositive: true
      },
      icon: <svg>...</svg>        // Icono JSX
    }
  ],
  isLoading: false,               // Muestra skeletons
  columns: 4                      // Número de columnas (2-6)
}
```

**Ejemplo de uso:**
```javascript
import { MetricsGrid } from '../../../Component/Dashboard';

const metrics = [
  {
    key: 'reach',
    label: 'Total Reach',
    value: 128400,
    format: 'number',
    trend: { value: 12.5, isPositive: true },
    icon: <svg>...</svg>
  }
];

<MetricsGrid metrics={metrics} columns={4} isLoading={false} />
```

---

### 2. ActivityStatus

**Ubicación:** `/src/Component/Dashboard/ActivityStatus.jsx`

**Propósito:** Indicador de actividad con estado live y timestamp.

**Props:**
```javascript
{
  isLive: true,                   // Muestra pulsing dot
  label: "Live tracking active",  // Texto del estado
  lastUpdated: new Date(),        // Fecha de actualización
  color: "#22c55e",               // Color del dot
  showTimestamp: true             // Muestra timestamp
}
```

**Ejemplo de uso:**
```javascript
<ActivityStatus
  isLive={true}
  label="Live tracking active"
  lastUpdated={new Date()}
/>
```

---

### 3. TopPostsList

**Ubicación:** `/src/Component/Dashboard/TopPostsList.jsx`

**Propósito:** Lista rankeada de posts con thumbnails y métricas.

**Props:**
```javascript
{
  posts: [
    {
      id: 'post-123',
      thumbnail_url: 'https://...',  // O media_url o image
      caption: 'Post caption...',    // O title
      like_count: 150,               // O likes
      comments_count: 25             // O comments
    }
  ],
  title: "Top Performing Posts",
  badge: "Last 7 days",
  maxItems: 3,                       // Máximo de posts a mostrar
  expandable: true,                  // Puede colapsarse
  defaultExpanded: true,
  onPostClick: (post) => {},         // Callback al hacer click
  emptyMessage: "No posts available"
}
```

**Ejemplo de uso:**
```javascript
<TopPostsList
  posts={topPosts}
  maxItems={3}
  onPostClick={(post) => window.open(post.permalink, '_blank')}
/>
```

---

### 4. GoalsProgress

**Ubicación:** `/src/Component/Dashboard/GoalsProgress.jsx`

**Propósito:** Visualización de progreso de objetivos con barras animadas.

**Props:**
```javascript
{
  goals: [
    {
      id: 'reach',
      label: 'Reach Goal',
      current: 128400,              // Valor actual
      target: 150000,               // Valor objetivo
      targetFormatted: '150K',      // Formato legible
      color: '#40086d'              // Color de la barra
    }
  ],
  title: "Monthly Goals",
  badge: "Progress",
  expandable: true,
  defaultExpanded: true
}
```

**Ejemplo de uso:**
```javascript
const goals = [
  {
    id: 'revenue',
    label: 'Revenue Goal',
    current: 45000,
    target: 60000,
    targetFormatted: '$60K',
    color: '#22c55e'
  }
];

<GoalsProgress goals={goals} />
```

---

## 📈 Componentes de Charts

Todos los charts están en `/src/Component/Dashboard/Charts/`

### 5. ReachOverTimeChart

**Propósito:** Chart de línea para métricas temporales.

**Props:**
```javascript
{
  data: {
    labels: ['Mon', 'Tue', 'Wed', ...],
    datasets: [{
      label: 'Reach',
      data: [15400, 18200, 21100, ...]
    }]
  },
  title: "Reach Over Time",
  badge: "7 Days",
  height: 200,
  expandable: false,
  defaultExpanded: true
}
```

**Ejemplo de uso:**
```javascript
<ReachOverTimeChart
  data={{
    labels: ['Day 1', 'Day 2', 'Day 3'],
    datasets: [{ label: 'Sales', data: [100, 150, 200] }]
  }}
/>
```

---

### 6. BestPostingHoursChart

**Propósito:** Chart de barras para análisis de horarios.

**Props:**
```javascript
{
  data: {
    labels: ['9am', '12pm', '3pm', ...],
    datasets: [{
      label: 'Engagement',
      data: [45, 72, 88, ...]
    }]
  },
  title: "Best Posting Hours",
  badge: "Peak times",
  height: 200,
  expandable: false,
  defaultExpanded: true
}
```

**Ejemplo de uso:**
```javascript
<BestPostingHoursChart
  data={{
    labels: ['Morning', 'Afternoon', 'Evening'],
    datasets: [{ label: 'Traffic', data: [60, 95, 75] }]
  }}
/>
```

---

### 7. ContentTypeChart

**Propósito:** Chart de dona para distribuciones porcentuales.

**Props:**
```javascript
{
  data: {
    labels: ['Reels', 'Posts', 'Carousels', 'Stories'],
    datasets: [{
      data: [45, 25, 20, 10],
      backgroundColor: ['#40086d', '#dccaf4', '#ede0f8', '#f6f6f6']
    }]
  },
  title: "Content Type Performance",
  centerText: "Total",
  centerValue: "100%",
  height: 220,
  expandable: true,
  defaultExpanded: true
}
```

**Ejemplo de uso:**
```javascript
<ContentTypeChart
  data={{
    labels: ['Category A', 'Category B', 'Category C'],
    datasets: [{
      data: [60, 30, 10],
      backgroundColor: ['#40086d', '#22c55e', '#ef4444']
    }]
  }}
  centerText="Total"
  centerValue="100%"
/>
```

---

## 🎨 Componentes Base (ya existentes)

Estos componentes base ya estaban creados y ahora son usados por los componentes compuestos:

- **AnimatedMetricCard**: Tarjeta de métrica con animación de conteo
- **InteractiveCard**: Tarjeta con efectos hover y expansión
- **PulsingDot**: Indicador de actividad pulsante
- **ProgressBar**: Barra de progreso animada
- **SkeletonLoader**: Estados de carga (SkeletonMetricCard, SkeletonCard, SkeletonChart)
- **LineChart**: Chart de línea base (Chart.js)
- **BarChart**: Chart de barras base (Chart.js)
- **DoughnutChart**: Chart de dona base (Chart.js)

---

## 🏗️ Patrón de Uso Recomendado

### Estructura de una Sección de Dashboard

```javascript
import {
  PageHeader,
  DashboardButton,
  DataGuard,
  MetricsGrid,
  ActivityStatus,
  ReachOverTimeChart,
  BestPostingHoursChart,
  ContentTypeChart,
  TopPostsList,
  GoalsProgress,
  SkeletonChart,
  SkeletonCard
} from '../../../Component/Dashboard';

export default function MyDashboardSection() {
  // 1. Hooks para data
  const { isLoading, hasData } = useMyData();
  const [data, setData] = useState(null);

  // 2. Configuración de métricas
  const metrics = [
    { key: 'metric1', label: 'Metric 1', value: 100, ... }
  ];

  // 3. Configuración de objetivos
  const goals = [
    { id: 'goal1', label: 'Goal 1', current: 50, target: 100, ... }
  ];

  // 4. Data para charts
  const chartData = {
    labels: [...],
    datasets: [...]
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader title="My Section" subtitle="Description" />

      {/* Content con DataGuard */}
      <DataGuard isLoading={isLoading} hasData={hasData}>
        <div className="space-y-5">
          {/* Métricas */}
          <MetricsGrid metrics={metrics} />

          {/* Status */}
          <ActivityStatus isLive={true} />

          {/* Charts */}
          <div className="grid grid-cols-2 gap-3.5">
            <ReachOverTimeChart data={chartData} />
            <BestPostingHoursChart data={chartData} />
          </div>

          {/* Otros componentes */}
          <div className="grid grid-cols-2 gap-3.5">
            <ContentTypeChart data={chartData} />
            <TopPostsList posts={posts} />
          </div>

          {/* Objetivos */}
          <GoalsProgress goals={goals} />
        </div>
      </DataGuard>
    </div>
  );
}
```

---

## ✅ Ventajas de esta Arquitectura

1. **Reutilización**: Cada componente puede usarse en múltiples secciones
2. **Mantenibilidad**: Cambios en un solo lugar se reflejan en todas partes
3. **Consistencia**: Todos los dashboards lucen y funcionan igual
4. **Testabilidad**: Componentes pequeños son más fáciles de testear
5. **Escalabilidad**: Agregar nuevas secciones es rápido y simple
6. **Separación de responsabilidades**: Cada componente tiene un propósito claro

---

## 🚀 Cómo Crear una Nueva Sección

1. Importa los componentes necesarios
2. Define tu configuración de métricas y objetivos
3. Prepara la data para los charts
4. Ensambla los componentes en el orden deseado
5. Todo funciona automáticamente con animaciones y loading states

**Tiempo estimado:** 15-20 minutos para una sección completa

---

## 📝 Notas Importantes

- Todos los componentes son **responsive** por defecto
- Los colores siguen el **design system** de Marnee (#40086d, #dccaf4, etc.)
- Las animaciones usan **Framer Motion** para suavidad
- Los charts usan **Chart.js** con configuración premium
- Todos los componentes soportan **loading states** con skeletons
- Los iconos son **SVG inline** para máxima flexibilidad

---

## 🎯 Ejemplo Completo

Ver `ContentMarketingSection.jsx` para un ejemplo completo de implementación que usa todos estos componentes reutilizables.
