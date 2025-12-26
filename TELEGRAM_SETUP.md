# Configuración del Bot de Telegram

## Paso 1: Crear tu Bot de Telegram

1. Abre Telegram y busca [@BotFather](https://t.me/botfather)
2. Envía el comando `/newbot`
3. Elige un nombre para tu bot (ej: "Mi Novia Bot")
4. Elige un username (debe terminar en "bot", ej: "minovia_notif_bot")
5. BotFather te dará un **TOKEN** - guárdalo, lo necesitarás

## Paso 2: Obtener tu Chat ID

1. Busca [@userinfobot](https://t.me/userinfobot) en Telegram
2. Inicia una conversación con él
3. Te enviará tu **Chat ID** - guárdalo

## Paso 3: Configurar las variables de entorno

1. Crea un archivo `.env.local` en la raíz del proyecto (donde está `package.json`)

2. Agrega estas líneas al archivo (reemplaza con tus datos):

```env
TELEGRAM_BOT_TOKEN=123456789:ABCdefGHIjklMNOpqrsTUVwxyz
TELEGRAM_CHAT_ID=123456789
```

3. Guarda el archivo

## Paso 4: Probar la conexión

1. Asegúrate de que el servidor esté corriendo: `npm run dev`
2. Ve a la sección "¿Cómo estás hoy?"
3. Selecciona una emoción y/o escribe un mensaje
4. Haz clic en "Enviar mensaje 💌"
5. Deberías recibir una notificación en tu Telegram

## Estructura del mensaje que recibirás:

```
🎀 Nueva actualización de tu novia 🎀

💭 Estado de ánimo: [Emoción seleccionada]

📝 Mensaje:
[Su mensaje aquí]

⏰ Hora: [Fecha y hora]
```

## Notas importantes:

- **Seguridad**: Nunca compartas tu TOKEN o Chat ID públicamente
- **Privacidad**: El archivo `.env.local` está en `.gitignore`, así que no se subirá a GitHub
- **Mensajes**: Solo tú recibirás las notificaciones en tu Telegram personal
- **Funcionamiento**: Funciona 24/7 mientras el sitio esté en línea

## Si quieres desplegar en producción (Vercel):

1. Ve a tu proyecto en Vercel
2. Settings → Environment Variables
3. Agrega:
   - `TELEGRAM_BOT_TOKEN` = tu token
   - `TELEGRAM_CHAT_ID` = tu chat id
4. Redeploy el proyecto

¡Listo! Ahora recibirás notificaciones cada vez que ella te envíe cómo se siente 💗
