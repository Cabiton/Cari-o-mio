# 📸 Configurar Almacenamiento de Screenshots en Render con Cloudinary

## ✅ GUÍA PASO A PASO

### 1️⃣ Crear cuenta en Cloudinary (GRATIS)

1. **Ve a:** https://cloudinary.com/users/register_free
2. **Regístrate** con tu email
3. **Confirma tu email**
4. **Inicia sesión** en tu Dashboard

---

### 2️⃣ Obtener tus credenciales de Cloudinary

Una vez en el Dashboard de Cloudinary:

1. En la página principal verás un cuadro llamado **"Account Details"**
2. **Copia estos 3 valores:**
   - **Cloud Name** (ejemplo: `dh1ab2c3d`)
   - **API Key** (ejemplo: `123456789012345`)
   - **API Secret** (ejemplo: `AbCdEfGhIjKlMnOpQrStUvWxYz`)

💡 **Consejo:** Haz clic en el ícono del ojo 👁️ para revelar el API Secret

---

### 3️⃣ Configurar variables de entorno en Render

1. **Ve a tu dashboard de Render:** https://dashboard.render.com

2. **Haz clic en tu proyecto** (Cariño-mio)

3. **Ve a "Environment"** en el menú lateral izquierdo

4. **Agrega las 3 variables de entorno:**

   Haz clic en **"Add Environment Variable"** para cada una:

   **Primera variable:**
   - Key: `CLOUDINARY_CLOUD_NAME`
   - Value: `[Pega aquí tu Cloud Name]`

   **Segunda variable:**
   - Key: `CLOUDINARY_API_KEY`
   - Value: `[Pega aquí tu API Key]`

   **Tercera variable:**
   - Key: `CLOUDINARY_API_SECRET`
   - Value: `[Pega aquí tu API Secret]`

5. **Guarda los cambios** (botón "Save Changes")

6. **Render redesplegará automáticamente** tu sitio con las nuevas variables

---

### 4️⃣ Verificar que funciona

1. **Espera** a que Render termine de redesplegar (2-3 minutos)
2. **Ve a tu sitio:** https://tu-sitio.onrender.com/screenshots
3. **Prueba subir una captura**
4. **Verifica en Cloudinary:**
   - Ve a: https://cloudinary.com/console/media_library
   - Deberías ver tus imágenes en la carpeta `screenshots/`

---

## 🎉 Beneficios de usar Cloudinary

✅ **Sin límite de cantidad** de imágenes  
✅ **Sin límite de tamaño** por imagen  
✅ **25 GB de almacenamiento GRATIS**  
✅ **Las imágenes se quedan guardadas** aunque cierres el navegador  
✅ **Funcionan en cualquier dispositivo**  
✅ **Optimización automática** de imágenes  

---

## 🔧 Solución de Problemas

### Error: "Error al subir las imágenes"
- Verifica que las 3 variables de entorno estén correctamente configuradas en Render
- Asegúrate de que no haya espacios al inicio o al final de los valores

### Las imágenes no aparecen
- Ve a Cloudinary Media Library y verifica si están subiendo
- Revisa los logs en Render para ver si hay errores

### Error 500
- Revisa que el API Secret esté correcto (es sensible a mayúsculas/minúsculas)
- Verifica que tu cuenta de Cloudinary esté activa

---

## 📊 Monitoreo de uso

Para ver cuánto espacio estás usando:

1. Ve a: https://cloudinary.com/console
2. En el Dashboard verás tu uso actual
3. Plan gratuito incluye:
   - 25 GB de almacenamiento
   - 25 GB de transferencia mensual
   - Suficiente para miles de screenshots

---

## 🔐 Seguridad

- Nunca compartas tu API Secret
- Nunca lo subas a GitHub (ya está en .gitignore)
- Solo configúralo en las variables de entorno de Render
