'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Upload, X, Download, Trash2, Image as ImageIcon } from 'lucide-react';

interface Screenshot {
  id: string;
  url: string; // URL de Cloudinary
  date: string;
  name: string;
}

export default function ScreenshotsPage() {
  const [screenshots, setScreenshots] = useState<Screenshot[]>([]);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<Screenshot | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Cargar imágenes al montar el componente
  useEffect(() => {
    loadScreenshots();
  }, []);

  const loadScreenshots = async () => {
    try {
      const response = await fetch('/api/screenshots/list');
      const data = await response.json();
      
      if (data.success) {
        setScreenshots(data.images);
      } else {
        console.error('Error al cargar imágenes:', data.error);
      }
    } catch (err) {
      console.error('Error al cargar screenshots:', err);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setError('');
    setLoading(true);

    try {
      const formData = new FormData();
      
      // Agregar todos los archivos al FormData
      Array.from(files).forEach((file) => {
        if (file.type.startsWith('image/')) {
          formData.append('files', file);
        }
      });

      // Subir a la API
      const response = await fetch('/api/screenshots/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        // Recargar la lista de imágenes
        await loadScreenshots();
      } else {
        setError(data.error || 'Error al subir las imágenes');
      }
    } catch (err) {
      console.error('Error al subir archivos:', err);
      setError('Error al subir las imágenes');
    } finally {
      setLoading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Eliminar captura
  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás segura de que quieres eliminar esta captura?')) return;
    
    try {
      const response = await fetch(`/api/screenshots/delete?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        // Recargar la lista
        await loadScreenshots();
        setSelectedImage(null);
      } else {
        setError(data.error || 'Error al eliminar la captura');
      }
    } catch (err) {
      console.error('Error al eliminar screenshot:', err);
      setError('Error al eliminar la captura');
    }
  };

  const downloadScreenshot = (screenshot: Screenshot) => {
    try {
      const link = document.createElement('a');
      link.href = screenshot.url;
      link.download = screenshot.name || 'screenshot.png';
      link.target = '_blank';
      link.click();
    } catch (err) {
      console.error('Error al descargar:', err);
      setError('Error al descargar la imagen');
    }
  };

  return (
    <main className="min-h-screen p-4 md:p-8 bg-gradient-to-br from-purple-100 via-pink-100 to-rose-100">
      {/* Botón de regreso */}
      <Link
        href="/main"
        className="fixed top-6 left-6 z-50 bg-white/80 backdrop-blur-sm p-3 rounded-full hover:bg-white transition-all shadow-lg group"
      >
        <ArrowLeft className="text-gray-700 group-hover:text-pink-600" size={24} />
      </Link>

      <div className="max-w-7xl mx-auto pt-20">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="text-6xl mb-4">📸</div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            Galería de Recuerdos
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Nuestras conversaciones especiales guardadas para siempre 💕
          </p>

          {/* Mensaje de error */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6 max-w-md mx-auto">
              {error}
            </div>
          )}

          {/* Botón de subir */}
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={loading}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-full font-semibold hover:shadow-xl transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Upload size={20} />
            {loading ? 'Subiendo...' : 'Subir captura'}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileUpload}
            className="hidden"
          />
        </div>

        {/* Grid de capturas */}
        {screenshots.length === 0 ? (
          <div className="text-center py-20 animate-fade-in">
            <ImageIcon className="w-24 h-24 text-gray-300 mx-auto mb-4" />
            <p className="text-xl text-gray-500">
              Aún no hay capturas subidas
            </p>
            <p className="text-gray-400 mt-2">
              Haz clic en &quot;Subir captura&quot; para comenzar
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-fade-in">
            {screenshots.map((screenshot, index) => (
              <div
                key={screenshot.id}
                className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all cursor-pointer group"
                onClick={() => setSelectedImage(screenshot)}
                style={{
                  animationDelay: `${index * 0.1}s`,
                }}
              >
                <div className="aspect-[9/16] relative overflow-hidden bg-gray-100">
                  <Image
                    src={screenshot.url}
                    alt={screenshot.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="p-4">
                  <p className="text-sm text-gray-500">{screenshot.date}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal de vista previa */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setSelectedImage(null)}
        >
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-6 right-6 bg-white/20 backdrop-blur-sm p-3 rounded-full hover:bg-white/30 transition-all z-50"
          >
            <X className="text-white" size={24} />
          </button>

          <div className="max-w-4xl w-full max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="relative w-full h-full min-h-[320px] flex-1">
              <Image
                src={selectedImage.url}
                alt={selectedImage.name}
                fill
                sizes="100vw"
                className="object-contain rounded-lg"
                unoptimized
              />
            </div>
            
            <div className="flex justify-center gap-4 mt-6">
              <button
                onClick={() => downloadScreenshot(selectedImage)}
                className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-8 py-3 rounded-full font-semibold hover:shadow-xl transition-all transform hover:scale-105"
              >
                <Download size={20} />
                Descargar
              </button>
              <button
                onClick={() => handleDelete(selectedImage.id)}
                className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-pink-600 text-white px-8 py-3 rounded-full font-semibold hover:shadow-xl transition-all transform hover:scale-105"
              >
                <Trash2 size={20} />
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
