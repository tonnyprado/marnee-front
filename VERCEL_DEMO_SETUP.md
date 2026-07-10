# Configuración del Modo Demo en Vercel (Producción)

Esta guía te explica cómo activar el modo demo de Instagram y TikTok en tu deployment de Vercel para el proceso de review de Meta y TikTok.

## 🚀 Pasos para configurar en Vercel

### Opción 1: Desde el Dashboard de Vercel (Recomendado)

1. **Ir al Dashboard de Vercel**
   - Abre https://vercel.com/dashboard
   - Selecciona tu proyecto (marnee-front)

2. **Ir a Settings**
   - Click en la pestaña "Settings" en el menú superior

3. **Ir a Environment Variables**
   - En el menú lateral izquierdo, click en "Environment Variables"

4. **Agregar las variables de modo demo**
   - Click en "Add New"
   - Agrega cada variable:

   **Variable 1:**
   ```
   Key: REACT_APP_INSTAGRAM_DEMO_MODE
   Value: true
   Environment: Production (selecciona solo Production)
   ```

   **Variable 2:**
   ```
   Key: REACT_APP_TIKTOK_DEMO_MODE
   Value: true
   Environment: Production (selecciona solo Production)
   ```

5. **Guardar las variables**
   - Click en "Save" para cada variable

6. **Hacer Redeploy**
   - Ve a la pestaña "Deployments"
   - Encuentra el último deployment exitoso
   - Click en los 3 puntos "..." a la derecha
   - Click en "Redeploy"
   - Confirma el redeploy

7. **Verificar**
   - Una vez que termine el deployment (1-2 minutos)
   - Abre tu sitio en producción
   - Ve al Dashboard → pestaña Instagram → deberías ver datos automáticamente
   - Ve al Dashboard → pestaña TikTok → deberías ver la nueva sección con datos

---

### Opción 2: Desde la CLI de Vercel

Si prefieres usar la terminal:

```bash
# Instalar Vercel CLI si no la tienes
npm i -g vercel

# Login a Vercel
vercel login

# Agregar variables de entorno
vercel env add REACT_APP_INSTAGRAM_DEMO_MODE production
# Cuando te pregunte el valor, escribe: true

vercel env add REACT_APP_TIKTOK_DEMO_MODE production
# Cuando te pregunte el valor, escribe: true

# Hacer redeploy
vercel --prod
```

---

## 📱 Verificación en Producción

Una vez completado el deployment, verifica que el modo demo esté funcionando:

### Instagram
1. Ve a https://tu-dominio.vercel.app/dashboard
2. Click en la pestaña "Instagram"
3. **Deberías ver:**
   - Métricas: Total Reach: 128,400 | Engagement: 4.2% | Reel Plays: 89,100
   - Gráficas de reach, posting hours, content type
   - 6 posts de ejemplo con imágenes
   - NO deberías ver el botón "Connect Instagram"

### TikTok
1. En el mismo dashboard, click en la pestaña "TikTok"
2. **Deberías ver:**
   - Métricas: Total Views: 2,840,000 | Engagement: 6.3% | Shares: 12,400
   - Gráficas de views, posting hours, content type
   - 6 videos de ejemplo con thumbnails
   - NO deberías ver el botón "Connect TikTok"

---

## 🔍 Troubleshooting

### No veo los datos mock
1. **Verificar que las variables se guardaron:**
   - Ve a Vercel Dashboard → Settings → Environment Variables
   - Confirma que las variables existen con valor `true`

2. **Verificar que seleccionaste "Production":**
   - Las variables deben estar en el environment "Production"
   - Si están en "Preview" o "Development", no funcionarán en prod

3. **Verificar que hiciste redeploy:**
   - Cambiar variables de entorno NO redeploya automáticamente
   - Debes hacer un redeploy manual después de agregar/cambiar variables

4. **Verificar en la consola del navegador:**
   - Abre DevTools (F12)
   - Ve a Console
   - Busca errores relacionados con Instagram o TikTok
   - Si ves errores de API, el modo demo está funcionando (está usando mock data en lugar de API)

5. **Verificar el build:**
   - En Vercel Dashboard → Deployments → click en el último deployment
   - Ve a "Build Logs"
   - Busca las variables: deberías ver algo como:
     ```
     REACT_APP_INSTAGRAM_DEMO_MODE=true
     REACT_APP_TIKTOK_DEMO_MODE=true
     ```

---

## 🔄 Para desactivar el modo demo en producción

Cuando ya tengas aprobación de las APIs y quieras usar datos reales:

### Opción 1: Eliminar las variables
1. Ve a Vercel Dashboard → Settings → Environment Variables
2. Click en los 3 puntos "..." junto a cada variable
3. Click en "Delete"
4. Haz redeploy

### Opción 2: Cambiar los valores a false
1. Ve a Vercel Dashboard → Settings → Environment Variables
2. Click en "Edit" en cada variable
3. Cambia el valor de `true` a `false`
4. Guarda y haz redeploy

---

## 🎯 Ambientes diferentes (opcional)

Si quieres tener el modo demo solo en production pero no en preview/development:

1. Al agregar las variables, **solo selecciona "Production"**
2. Para preview/development, agrega las mismas variables pero con valor `false`
3. Así puedes probar con datos reales en preview y demos en producción

---

## 📋 Checklist antes del review de Meta/TikTok

- [ ] Variables de entorno configuradas en Vercel Production
- [ ] Redeploy realizado exitosamente
- [ ] Instagram tab muestra datos mock automáticamente
- [ ] TikTok tab muestra datos mock automáticamente
- [ ] NO aparecen botones de "Connect" en las pestañas
- [ ] Todas las gráficas muestran datos
- [ ] Los posts/videos de ejemplo se ven correctamente
- [ ] Documentación de la app lista para enviar a review

---

## 🆘 Soporte

Si tienes problemas:

1. Verifica que el proyecto se buildeó correctamente en Vercel
2. Revisa los logs de build en Vercel Dashboard
3. Verifica que no haya errores de JavaScript en la consola del navegador
4. Asegúrate de que las variables tienen exactamente el nombre correcto (case-sensitive)

**Variables correctas:**
```
REACT_APP_INSTAGRAM_DEMO_MODE=true
REACT_APP_TIKTOK_DEMO_MODE=true
```

**NO uses:**
```
INSTAGRAM_DEMO_MODE=true  ❌ (falta REACT_APP_)
React_App_Instagram_Demo_Mode=true  ❌ (case incorrecto)
```
