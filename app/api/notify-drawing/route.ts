import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { drawingName, date } = await request.json();

    const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
      console.log('Telegram credentials not configured');
      return NextResponse.json(
        { message: 'Telegram not configured' },
        { status: 200 }
      );
    }

    const message = `🎨 *¡Nuevo dibujo guardado!*

📝 Nombre: ${drawingName}
📅 Fecha: ${date}

Tu persona especial acaba de crear un dibujo para ti 💕✨

¡Ve a verlo en la página! 🌸`;

    const telegramUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

    const response = await fetch(telegramUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: 'Markdown',
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to send Telegram notification');
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error sending drawing notification:', error);
    return NextResponse.json(
      { error: 'Failed to send notification' },
      { status: 500 }
    );
  }
}
