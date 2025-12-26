import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { emotion, message } = body;

    // Obtener credenciales de Telegram
    const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

    // Si no hay configuración, registrar en consola pero no fallar
    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
      console.log('⚠️  Telegram no configurado. Mensaje recibido:');
      console.log(`💭 Emoción: ${emotion}`);
      console.log(`📝 Mensaje: ${message || 'Sin mensaje'}`);
      return NextResponse.json({ 
        success: true, 
        warning: 'Telegram no configurado. Edita .env.local' 
      });
    }

    // Crear el mensaje formateado
    const telegramMessage = `
🎀 *Nueva actualización de tu novia* 🎀

💭 *Estado de ánimo:* ${emotion}

${message ? `📝 *Mensaje:*\n${message}` : ''}

⏰ *Hora:* ${new Date().toLocaleString('es-ES', { 
  timeZone: 'America/Mexico_City',
  dateStyle: 'full',
  timeStyle: 'short'
})}
    `.trim();

    // Enviar mensaje a Telegram
    const response = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: telegramMessage,
          parse_mode: 'Markdown',
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error('Error de Telegram:', data);
      return NextResponse.json(
        { error: 'Error al enviar a Telegram', details: data },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error en la API:', error);
    return NextResponse.json(
      { error: 'Error al procesar la solicitud' },
      { status: 500 }
    );
  }
}
