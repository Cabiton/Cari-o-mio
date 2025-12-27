import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

// Configurar Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function GET(req: NextRequest) {
  try {
    console.log('📋 Obteniendo lista de screenshots...');
    
    // Verificar configuración de Cloudinary
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      console.error('❌ Variables de entorno de Cloudinary no configuradas');
      return NextResponse.json(
        { error: 'Cloudinary no está configurado' },
        { status: 500 }
      );
    }

    // Obtener todas las imágenes de la carpeta 'screenshots'
    const result = await cloudinary.api.resources({
      type: 'upload',
      prefix: 'screenshots/',
      max_results: 500,
    });

    console.log(`📸 Encontradas ${result.resources.length} imágenes`);

    const images = result.resources.map((resource: any) => ({
      id: resource.public_id,
      url: resource.secure_url,
      name: resource.public_id.split('/').pop() || 'screenshot',
      date: new Date(resource.created_at).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
    }));

    return NextResponse.json({
      success: true,
      images,
    });
  } catch (error) {
    console.error('❌ Error al obtener imágenes de Cloudinary:', error);
    return NextResponse.json(
      { error: `Error al obtener las imágenes: ${error instanceof Error ? error.message : 'Error desconocido'}` },
      { status: 500 }
    );
  }
}
