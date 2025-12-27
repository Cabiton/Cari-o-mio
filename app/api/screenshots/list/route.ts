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
    // Obtener todas las imágenes de la carpeta 'screenshots'
    const result = await cloudinary.api.resources({
      type: 'upload',
      prefix: 'screenshots/',
      max_results: 500, // Sin límite práctico
    });

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
    console.error('Error al obtener imágenes de Cloudinary:', error);
    return NextResponse.json(
      { error: 'Error al obtener las imágenes' },
      { status: 500 }
    );
  }
}
