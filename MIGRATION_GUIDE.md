# 🎨 Guía de Migración de Iconos a AnimateIcons

## ✅ Completado

### 1. Migración de Iconos de Lucide
**Estado**: ✅ Completado (85 archivos migrados)

Todos los iconos de `lucide-react` han sido migrados a `@animateicons/react/lucide`. Los iconos ahora tienen animación automática al hacer hover.

**Cambio realizado:**
```jsx
// Antes
import { Send, Check, Star } from 'lucide-react';

// Después
import { Send, Check, Star } from '@animateicons/react/lucide';
```

**Uso**: Los iconos se usan exactamente igual, pero ahora tienen animación incorporada.

---

## 📋 Pendiente: Migración de Emojis

### Resumen
- **28 archivos** contienen emojis
- **37 emojis únicos** identificados
- Consultar `emoji-to-icon-mapping.json` para ver el mapeo completo

### Archivos que requieren migración manual:

Ejecuta `node migrate-emojis.js` para ver la lista completa de archivos y emojis a migrar.

---

## 📝 Guía de Migración Manual de Emojis

Consulta el archivo MIGRATION_GUIDE.md completo en el repositorio frontend.

---

## 🎨 Personalización de Iconos

Los iconos de AnimateIcons aceptan las siguientes props:

```jsx
import { Target } from '@animateicons/react/lucide';

// Básico
<Target />

// Con tamaño personalizado
<Target size={24} />

// Con color personalizado
<Target color="#ff0000" />

// Con duración de animación personalizada
<Target duration={1.5} />

// Con className (Tailwind)
<Target className="w-6 h-6 text-blue-500" />
```

---

## 🚀 Próximos Pasos

1. Revisar los cambios con `git diff`
2. Probar la aplicación con `npm start`
3. Migrar emojis manualmente siguiendo los ejemplos
4. Ajustar estilos si es necesario

---

Ver documentación completa en: https://animateicons.in/

