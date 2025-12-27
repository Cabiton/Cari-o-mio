import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

// Configurar Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const imageId = searchParams.get('id');

    if (!imageId) {
      return NextResponse.json(
        { error: 'No se proporcionó el ID de la imagen' },
        { status: 400 }
      );
    }

    // Eliminar de Cloudinary
    await cloudinary.uploader.destroy(imageId);

    return NextResponse.json({
      success: true,
      message: 'Imagen eliminada correctamente',
    });
  } catch (error) {
    console.error('Error al eliminar de Cloudinary:', error);
    return NextResponse.json(
      { error: 'Error al eliminar la imagen' },
      { status: 500 }
    );
  }
}
