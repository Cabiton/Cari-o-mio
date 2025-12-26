# 🤖 CONFIGURACIÓN RÁPIDA - TELEGRAM BOT

## ⚡ SOLO 3 PASOS:

### Paso 1️⃣: Crear el Bot (2 minutos)

1. Abre Telegram en tu teléfono
2. Busca: **@BotFather**
3. Escribe: `/newbot`
4. Ponle nombre: **"Mi Novia Bot"** (o el que quieras)
5. Ponle username: **"minovia_123_bot"** (debe terminar en bot y ser único)
6. **COPIA EL TOKEN** que te da (es una línea larga como: `123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11`)

### Paso 2️⃣: Obtener tu Chat ID (30 segundos)

1. En Telegram busca: **@userinfobot**
2. Presiona **Start** o escribe cualquier cosa
3. Te responderá con tu **Id:** seguido de números
4. **COPIA ESOS NÚMEROS** (ejemplo: `987654321`)

### Paso 3️⃣: Configurar el archivo (1 minuto)

1. Abre el archivo: **`.env.local`** (está en la raíz del proyecto)
2. Pega tu TOKEN después de `TELEGRAM_BOT_TOKEN=`
3. Pega tu CHAT ID después de `TELEGRAM_CHAT_ID=`
4. Guarda el archivo
5. Reinicia el servidor (detén con Ctrl+C y vuelve a hacer `npm run dev`)

## 📝 Ejemplo de cómo debe quedar:

```
TELEGRAM_BOT_TOKEN=6789012345:AAFsD7r9h_YourActualTokenHereXyZ123
TELEGRAM_CHAT_ID=123456789
```

## ✅ Probar que funciona:

1. Abre el sitio en el navegador
2. Ve a "¿Cómo estás hoy?"
3. Selecciona una emoción
4. Haz clic en "Enviar mensaje 💌"
5. **¡Deberías recibir una notificación en Telegram!**

## 🚨 Si algo no funciona:

- Verifica que copiaste el TOKEN completo (es largo)
- Verifica que el Chat ID sean solo números
- Asegúrate de NO tener espacios extras
- Reinicia el servidor después de editar .env.local

---

💡 **Tip:** Inicia una conversación con tu bot escribiéndole en Telegram (búscalo por el username que le pusiste). Aunque no te responda, esto activa el bot.
