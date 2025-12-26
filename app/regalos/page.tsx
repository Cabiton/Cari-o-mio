'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Gift, Heart, X, Mail, Sparkles } from 'lucide-react';
import { FloatingPetals } from '../components/FloatingPetals';
import Image from 'next/image';

export default function RegalosPage() {
  const [openedGifts, setOpenedGifts] = useState<Set<number>>(new Set());
  const [selectedGift, setSelectedGift] = useState<number | null>(null);
  const [isOpening, setIsOpening] = useState(false);
  const [showHearts, setShowHearts] = useState(false);

  // Cargar los regalos abiertos desde localStorage al iniciar
  useEffect(() => {
    const saved = localStorage.getItem('openedGifts');
    if (saved) {
      setOpenedGifts(new Set(JSON.parse(saved)));
    }
  }, []);

  // Datos de los regalos (puedes personalizar cada uno)
  const gifts = [
    { id: 1, name: 'Regalo 1', description: 'Descripción especial del regalo 1', image: '/images/regalos/regalo-1.jpg' },
    { id: 2, name: 'Regalo 2', description: 'Descripción especial del regalo 2', image: '/images/regalos/regalo-2.jpg' },
    { id: 3, name: 'Regalo 3', description: 'Descripción especial del regalo 3', image: '/images/regalos/regalo-3.jpg' },
    { id: 4, name: 'Regalo 4', description: 'Descripción especial del regalo 4', image: '/images/regalos/regalo-4.jpg' },
    { id: 5, name: 'Regalo 5', description: 'Descripción especial del regalo 5', image: '/images/regalos/regalo-5.jpg' },
    { id: 6, name: 'Regalo 6', description: 'Descripción especial del regalo 6', image: '/images/regalos/regalo-6.jpg' },
    { id: 7, name: 'Regalo 7', description: 'Descripción especial del regalo 7', image: '/images/regalos/regalo-7.jpg' },
    { id: 8, name: 'Regalo 8', description: 'Descripción especial del regalo 8', image: '/images/regalos/regalo-8.jpg' },
    { id: 9, name: 'Regalo 9', description: 'Descripción especial del regalo 9', image: '/images/regalos/regalo-9.jpg' },
    { id: 10, name: 'Regalo 10', description: 'Descripción especial del regalo 10', image: '/images/regalos/regalo-10.jpg' },
    { id: 11, name: 'Regalo 11', description: 'Descripción especial del regalo 11', image: '/images/regalos/regalo-11.jpg' },
    { id: 12, name: 'Regalo 12', description: 'Descripción especial del regalo 12', image: '/images/regalos/regalo-12.jpg' },
    { id: 13, name: 'Regalo 13', description: 'Descripción especial del regalo 13', image: '/images/regalos/regalo-13.jpg' },
    { id: 14, name: 'Regalo 14', description: 'Descripción especial del regalo 14', image: '/images/regalos/regalo-14.jpg' },
    { id: 15, name: 'Regalo 15', description: 'Descripción especial del regalo 15', image: '/images/regalos/regalo-15.jpg' },
    { id: 16, name: 'Regalo 16', description: 'Descripción especial del regalo 16', image: '/images/regalos/regalo-16.jpg' },
    { id: 17, name: 'Regalo 17', description: 'Descripción especial del regalo 17', image: '/images/regalos/regalo-17.jpg' },
    { id: 18, name: 'Regalo 18', description: 'Descripción especial del regalo 18', image: '/images/regalos/regalo-18.jpg' },
    { id: 19, name: 'Regalo 19', description: 'Descripción especial del regalo 19', image: '/images/regalos/regalo-19.jpg' },
    { id: 20, name: 'Regalo 20', description: 'Descripción especial del regalo 20', image: '/images/regalos/regalo-20.jpg' },
  ];

  const handleOpenGift = (giftNum: number) => {
    if (openedGifts.has(giftNum)) {
      // Si ya está abierto, solo mostrarlo
      setSelectedGift(giftNum);
      return;
    }

    setIsOpening(true);
    setShowHearts(true);

    setTimeout(() => {
      const newOpenedGifts = new Set([...openedGifts, giftNum]);
      setOpenedGifts(newOpenedGifts);
      
      // Guardar en localStorage
      localStorage.setItem('openedGifts', JSON.stringify(Array.from(newOpenedGifts)));
      
      setSelectedGift(giftNum);
      setIsOpening(false);
      setTimeout(() => setShowHearts(false), 3000);
    }, 1200);
  };

  const handleClose = () => {
    setSelectedGift(null);
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-gradient-to-b from-pink-50 via-purple-50 to-pink-50">
      <FloatingPetals count={60} />
      
      {/* Estrellas brillantes de fondo */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {[...Array(40)].map((_, i) => (
          <Sparkles
            key={i}
            className="absolute text-yellow-300/40 animate-pulse"
            size={Math.random() * 15 + 10}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      {/* Botón de regreso */}
      <Link
        href="/main"
        className="fixed top-6 left-6 z-20 glass-effect p-3 rounded-full hover:bg-white/60 transition-all group"
      >
        <ArrowLeft className="text-pink-600 group-hover:text-pink-700" size={24} />
      </Link>

      {/* Corazones flotantes */}
      {showHearts && (
        <div className="fixed inset-0 z-30 pointer-events-none">
          {[...Array(25)].map((_, i) => (
            <Heart
              key={i}
              className="absolute text-pink-400 fill-pink-400 animate-float-up"
              size={Math.random() * 30 + 20}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 0.5}s`,
                animationDuration: `${Math.random() * 2 + 2}s`
              }}
            />
          ))}
        </div>
      )}

      <div className="relative z-10 max-w-6xl w-full">
        {selectedGift === null ? (
          <div className="glass-effect rounded-3xl p-8 md:p-12 animate-fade-in">
            {/* Encabezado */}
            <div className="text-center mb-8">
              <div className="inline-block p-4 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full mb-4 animate-bounce-gentle relative">
                <Gift className="text-white" size={48} />
                <Sparkles className="absolute -top-2 -right-2 text-yellow-400 animate-pulse" size={20} />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-4 animate-glow">
                20 Regalos para Ti 🎁
              </h1>
              
              {/* Línea decorativa */}
              <div className="flex justify-center gap-2 mb-4">
                {[...Array(9)].map((_, i) => (
                  <div key={i} className={`w-2 h-2 rounded-full ${i === 4 ? 'bg-purple-500' : 'bg-pink-400'} animate-pulse`} style={{ animationDelay: `${i * 0.1}s` }}></div>
                ))}
              </div>
              
              <p className="text-lg text-gray-700 mb-2">
                Haz clic en cada sobre para descubrir tu regalo
              </p>
              <p className="text-sm text-pink-600">
                Cada uno esconde algo especial para ti mi amor 💗
              </p>
            </div>

            {/* Grid de sobres */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {gifts.map((gift) => (
                <button
                  key={gift.id}
                  onClick={() => handleOpenGift(gift.id)}
                  disabled={isOpening}
                  className={`relative aspect-square rounded-2xl transition-all transform hover:scale-105 ${
                    openedGifts.has(gift.id)
                      ? 'bg-gradient-to-br from-green-200 to-emerald-300 shadow-lg'
                      : 'bg-gradient-to-br from-pink-200 via-pink-300 to-purple-300 shadow-xl hover:shadow-2xl'
                  } ${isOpening ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
                >
                  {/* Contenido del sobre */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                    {openedGifts.has(gift.id) ? (
                      <>
                        <Mail className="text-white mb-2" size={40} />
                        <span className="text-white font-bold text-lg">Abierto ✓</span>
                        <span className="text-white text-xs mt-1">Ver de nuevo</span>
                      </>
                    ) : (
                      <>
                        <Mail className="text-white mb-2" size={48} />
                        <span className="text-white font-bold text-2xl">{gift.id}</span>
                      </>
                    )}

                    {/* Sello decorativo */}
                    <div className="absolute top-2 right-2 w-8 h-8 border-2 border-white/50 rounded flex items-center justify-center bg-white/20">
                      <Heart className="text-white fill-white" size={14} />
                    </div>

                    {/* Líneas decorativas */}
                    {!openedGifts.has(gift.id) && (
                      <div className="absolute bottom-4 left-4 right-4 space-y-1">
                        <div className="h-0.5 bg-white/40 rounded"></div>
                        <div className="h-0.5 bg-white/40 rounded w-3/4"></div>
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>

            {/* Progreso */}
            <div className="mt-8 text-center">
              <div className="inline-flex items-center gap-2 glass-effect rounded-full px-6 py-3">
                <Gift className="text-pink-500" size={20} />
                <span className="text-pink-600 font-medium">
                  Has abierto {openedGifts.size} de 20 regalos
                </span>
              </div>
            </div>
          </div>
        ) : (
          /* Modal del regalo abierto */
          <div className="glass-effect rounded-3xl p-8 md:p-12 animate-fade-in relative max-h-[90vh] overflow-y-auto">
            {/* Botón cerrar */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 p-2 rounded-full bg-pink-200 hover:bg-pink-300 transition-all z-10"
            >
              <X className="text-pink-700" size={24} />
            </button>

            {/* Contenido del regalo */}
            <div className="text-center">
              <div className="inline-block p-4 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full mb-6 animate-bounce">
                <Gift className="text-white" size={48} />
              </div>
              
              <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-4">
                Regalo #{selectedGift}
              </h2>

              <div className="relative w-full max-w-md mx-auto mb-6 rounded-2xl overflow-hidden shadow-2xl border-4 border-pink-200">
                <div className="relative w-full aspect-square bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center">
                  {/* Aquí irá la imagen del regalo */}
                  <div className="text-center p-8">
                    <Gift className="mx-auto mb-4 text-pink-400" size={80} />
                    <p className="text-gray-600 text-sm">
                      Sube la imagen del regalo en:
                      <br />
                      <code className="text-xs bg-pink-100 px-2 py-1 rounded mt-2 inline-block">
                        /public/images/regalos/regalo-{selectedGift}.jpg
                      </code>
                    </p>
                  </div>
                  {/* Cuando tengas las imágenes, reemplaza esto con:
                  <Image
                    src={gifts[selectedGift - 1].image}
                    alt={gifts[selectedGift - 1].name}
                    fill
                    className="object-cover"
                  />
                  */}
                </div>
              </div>

              <h3 className="text-2xl font-bold text-pink-600 mb-3">
                {gifts[selectedGift - 1].name}
              </h3>
              
              <p className="text-gray-700 text-lg mb-6 leading-relaxed">
                {gifts[selectedGift - 1].description}
              </p>

              <div className="flex justify-center gap-2 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Heart
                    key={i}
                    className="text-pink-400 fill-pink-400 animate-pulse"
                    size={20}
                    style={{ animationDelay: `${i * 0.1}s` }}
                  />
                ))}
              </div>

              <button
                onClick={handleClose}
                className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-8 py-3 rounded-full font-bold hover:from-pink-600 hover:to-purple-600 transform hover:scale-105 transition-all shadow-lg"
              >
                Cerrar y ver otros regalos 💗
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
