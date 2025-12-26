# 🤖 Configurar Bot de Telegram en Render

## ✅ GUÍA PASO A PASO

### 1️⃣ Obtén tus credenciales de Telegram

#### A) Token del Bot:
1. Abre Telegram
2. Busca: **@BotFather**
3. Envía: `/newbot`
4. Sigue las instrucciones
5. **COPIA EL TOKEN** (línea larga como: `6789012345:AAFsD7r9h_YourTokenHere`)

#### B) Tu Chat ID:
1. Busca: **@userinfobot**
2. Envíale cualquier mensaje
3. **COPIA EL NÚMERO** que te responda (ejemplo: `123456789`)

---

### 2️⃣ Configurar en Render

1. **Ve a tu dashboard de Render:** https://dashboard.render.com

2. **Haz clic en tu proyecto** (el que desplegaste)

3. **Ve a "Environment"** en el menú lateral izquierdo

4. **Agrega las variables de entorno:**

   Haz clic en **"Add Environment Variable"** y agrega:

   **Primera variable:**
   - Key: `TELEGRAM_BOT_TOKEN`
   - Value: `[Pega aquí tu TOKEN completo]`

   **Segunda variable:**
   - Key: `TELEGRAM_CHAT_ID`
   - Value: `[Pega aquí tu Chat ID]`

5. **Guarda los cambios** (botón "Save Changes")

6. **Render redesplegará automáticamente** tu sitio con las nuevas variables

---

### 3️⃣ Activar el Bot

**IMPORTANTE:** Antes de probar, debes iniciar conversación con tu bot:

1. En Telegram, busca tu bot (por el @username que le pusiste)
2. Presiona **"Start"** o envíale `/start`
3. Aunque no te responda, esto activa el bot

---

### 4️⃣ Probar que funciona

1. Espera a que Render termine el redespliegue (1-2 minutos)
2. Abre tu sitio en Render (la URL que te dió)
3. Ve a la sección **"¿Cómo estás hoy?"**
4. Selecciona una emoción
5. Haz clic en **"Enviar mensaje 💌"**
6. **¡Deberías recibir la notificación en Telegram!** 🎉

---

### 🔍 Verificar en Render si está bien configurado:

1. Ve a tu proyecto en Render
2. Click en "Environment"
3. Deberías ver:
   ```
   TELEGRAM_BOT_TOKEN    [valor oculto]
   TELEGRAM_CHAT_ID      [valor oculto]
   ```

---

### 🚨 Solución de problemas:

**Si no recibes notificaciones:**

1. ✅ Verifica que iniciaste conversación con el bot en Telegram
2. ✅ Verifica que las variables estén en Render (sin espacios extra)
3. ✅ Verifica que el TOKEN sea completo (es MUY largo)
4. ✅ Espera 2 minutos después de guardar las variables en Render
5. ✅ Revisa los logs en Render (pestaña "Logs") para ver errores

**Ver los logs en Render:**
1. Ve a tu proyecto en Render
2. Click en "Logs" en el menú
3. Busca mensajes de error o avisos

---

### 📱 Ejemplo de mensaje que recibirás:

```
🎀 Nueva actualización de tu novia 🎀

💭 Estado de ánimo: Feliz 😊

📝 Mensaje:
¡Hoy tuve un día increíble!

⏰ Hora: jueves, 26 de diciembre de 2025, 15:30
```

---

### 🔐 Seguridad:

- ✅ Las variables de entorno en Render están **encriptadas**
- ✅ NO las compartas con nadie
- ✅ Si sospechas que fueron comprometidas, regenera el token con @BotFather

---

### 💡 Tips adicionales:

- Puedes recibir notificaciones desde cualquier parte del mundo
- El bot funciona 24/7 mientras tu sitio esté en Render
- Si cambias el TOKEN, actualízalo también en Render
- Puedes ver todas las notificaciones antiguas en tu chat de Telegram

---

**¿Todo listo?** ¡Ahora tu novia puede enviarte mensajes directamente a tu Telegram! 💌
