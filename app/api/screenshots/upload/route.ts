import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

// Configurar Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: NextRequest) {
  try {
    console.log('📸 Iniciando subida de screenshots...');
    
    const formData = await req.formData();
    const files = formData.getAll('files');

    console.log(`📂 Archivos recibidos: ${files.length}`);

    if (!files || files.length === 0) {
      console.error('❌ No se proporcionaron archivos');
      return NextResponse.json(
        { error: 'No se proporcionaron archivos' },
        { status: 400 }
      );
    }

    // Verificar configuración de Cloudinary
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      console.error('❌ Variables de entorno de Cloudinary no configuradas');
      return NextResponse.json(
        { error: 'Cloudinary no está configurado. Revisa las variables de entorno.' },
        { status: 500 }
      );
    }

    console.log(`☁️ Cloudinary configurado: ${process.env.CLOUDINARY_CLOUD_NAME}`);

    const uploadedImages = [];

    for (const file of files) {
      if (!(file instanceof File)) {
        console.log('⚠️ Archivo no válido, saltando...');
        continue;
      }

      console.log(`📤 Subiendo: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`);

      // Convertir el archivo a base64
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const base64 = buffer.toString('base64');
      const dataUri = `data:${file.type};base64,${base64}`;

      // Subir a Cloudinary
      const result = await cloudinary.uploader.upload(dataUri, {
        folder: 'screenshots',
        resource_type: 'auto',
      });

      console.log(`✅ Subido exitosamente: ${result.public_id}`);

      uploadedImages.push({
        id: result.public_id,
        url: result.secure_url,
        name: file.name,
        date: new Date().toLocaleDateString('es-ES', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }),
      });
    }

    console.log(`🎉 Total de imágenes subidas: ${uploadedImages.length}`);

    return NextResponse.json({
      success: true,
      images: uploadedImages,
    });
  } catch (error) {
    console.error('❌ Error al subir a Cloudinary:', error);
    return NextResponse.json(
      { error: `Error al subir las imágenes: ${error instanceof Error ? error.message : 'Error desconocido'}` },
      { status: 500 }
    );
  }
}
