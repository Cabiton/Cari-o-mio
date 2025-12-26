'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Ticket, Heart, Sparkles, Gift, Check, X } from 'lucide-react';
import { FloatingPetals } from '../components/FloatingPetals';

interface Coupon {
  id: number;
  title: string;
  description: string;
  icon: string;
  color: string;
  used: number;
  maxUses: number;
}

export default function CuponesPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([
    { id: 1, title: 'Vale por dejo que me compres lo que quieras', description: 'Puedes comprar lo que quieras y yo lo acepto con amor 🛍️', icon: '🛍️', color: 'from-pink-400 to-rose-400', used: 0, maxUses: 1 },
    { id: 2, title: 'Vale por elegir la película o serie que quieras', description: 'Tú eliges qué ver cuando quieras🎬', icon: '🎬', color: 'from-purple-400 to-pink-400', used: 0, maxUses: 1 },
    { id: 3, title: 'Vale por tu postre favorito', description: 'Te compro tu postre favorito 🍰', icon: '🍰', color: 'from-rose-400 to-pink-400', used: 0, maxUses: 1 },
    { id: 4, title: 'Vale por una sorpresa', description: 'Planeo una sorpresa especial sin que sepas nada sobre ello 🎉', icon: '🎉', color: 'from-pink-400 to-purple-400', used: 0, maxUses: 1 },
    { id: 5, title: 'Vale de te compro lo que quieras', description: 'Te compro lo que gustes (no te pases por favor) 🎀🎁', icon: '💗', color: 'from-purple-400 to-rose-400', used: 0, maxUses: 1 },
    { id: 6, title: 'Vale por hacer videollamada', description: 'Hacemos videollamada TU cuando quieras 📞', icon: '📞', color: 'from-rose-400 to-purple-400', used: 0, maxUses: 1 },
    { id: 7, title: 'Vale por una sesión de fotos', description: 'Te tomo todas las fotos que quieras 📸', icon: '📸', color: 'from-pink-400 to-rose-400', used: 0, maxUses: 10 },
    { id: 8, title: 'Vale que te digo cualquier cosa con la verdad', description: 'Te digo lo que quieras saber 👂', icon: '👂', color: 'from-purple-400 to-pink-400', used: 0, maxUses: 1 },
    { id: 9, title: 'Vale para mostrarte un regalo que te tengo en la sección de regalos', description: 'Este será canjeable solo después del 15 de enero 🎁', icon: '🎁', color: 'from-red-400 to-pink-500', used: 0, maxUses: 1 },
  ]);

  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);

  // Cargar cupones usados desde localStorage
  useEffect(() => {
    const saved = localStorage.getItem('couponsUsage');
    if (saved) {
      const usageData: Record<string, number> = JSON.parse(saved);
      setCoupons(prev => prev.map(c => ({
        ...c,
        used: usageData[c.id.toString()] ?? 0,
      })));
    }
  }, []);

  const handleUseCoupon = (coupon: Coupon) => {
    if (coupon.used >= coupon.maxUses) {
      setSelectedCoupon(coupon);
      return;
    }
    setSelectedCoupon(coupon);
  };

  const confirmUseCoupon = () => {
    if (!selectedCoupon) return;

    const newCoupons = coupons.map(c =>
      c.id === selectedCoupon.id ? { ...c, used: c.used + 1 } : c
    );
    setCoupons(newCoupons);

    // Guardar en localStorage
    const usageData: Record<number, number> = {};
    newCoupons.forEach(c => {
      usageData[c.id] = c.used;
    });
    localStorage.setItem('couponsUsage', JSON.stringify(usageData));

    setShowConfetti(true);
    setTimeout(() => {
      setShowConfetti(false);
      setSelectedCoupon(null);
    }, 3000);
  };

    const totalUsed = coupons.reduce((sum, c) => sum + (c.used || 0), 0);
    const totalAvailable = coupons.reduce((sum, c) => sum + (c.maxUses || 0), 0);

  return (
    <main className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-gradient-to-b from-pink-50 via-purple-50 to-pink-50">
      <FloatingPetals count={50} />

      {/* Confetti cuando canjea */}
      {showConfetti && (
        <div className="fixed inset-0 z-30 pointer-events-none">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-float-up"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 0.5}s`,
                animationDuration: `${Math.random() * 2 + 2}s`,
                fontSize: `${Math.random() * 20 + 20}px`,
              }}
            >
              {['🎉', '✨', '💖', '🎊', '⭐'][Math.floor(Math.random() * 5)]}
            </div>
          ))}
        </div>
      )}

      {/* Botón de regreso */}
      <Link
        href="/main"
        className="fixed top-6 left-6 z-20 glass-effect p-3 rounded-full hover:bg-white/60 transition-all group"
      >
        <ArrowLeft className="text-pink-600 group-hover:text-pink-700" size={24} />
      </Link>

      <div className="relative z-10 max-w-6xl w-full">
        {selectedCoupon === null ? (
          <div className="glass-effect rounded-3xl p-8 md:p-12 animate-fade-in">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-block p-4 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full mb-4 animate-bounce-gentle relative">
                <Ticket className="text-white" size={48} />
                <Sparkles className="absolute -top-2 -right-2 text-yellow-400 animate-pulse" size={20} />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-4 animate-glow">
                Banco de Cupones 🎫
              </h1>
              <p className="text-lg text-gray-700 mb-2">
                Cupones especiales que puedes canjear cuando quieras
              </p>
              <p className="text-sm text-pink-600">
                Cada uno es una promesa que cumpliré con amor 💗
              </p>
            </div>

            {/* Grid de cupones */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {coupons.map((coupon, index) => {
                const isFullyUsed = coupon.used >= coupon.maxUses;
                return (
                  <button
                    key={coupon.id}
                    onClick={() => handleUseCoupon(coupon)}
                    disabled={isFullyUsed}
                    className={`relative p-6 rounded-2xl transition-all transform hover:scale-105 animate-slide-up ${
                      isFullyUsed
                        ? 'bg-gray-200 opacity-60 cursor-default'
                        : `bg-gradient-to-br ${coupon.color} hover:shadow-2xl cursor-pointer`
                    }`}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    {/* Marca de completamente usado */}
                    {isFullyUsed && (
                      <div className="absolute top-2 right-2 bg-green-500 text-white p-1 rounded-full">
                        <Check size={16} />
                      </div>
                    )}

                    {/* Contador de usos */}
                    {coupon.maxUses > 1 && (
                      <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm text-gray-700 px-2 py-1 rounded-full text-xs font-bold">
                        {coupon.used}/{coupon.maxUses}
                      </div>
                    )}

                    <div className="text-center">
                      <div className="text-6xl mb-4 filter drop-shadow-lg">
                        {coupon.icon}
                      </div>
                      <h3 className="text-lg font-bold text-white mb-2">
                        {coupon.title}
                      </h3>
                      <p className="text-sm text-white/90">
                        {coupon.description}
                      </p>

                      {isFullyUsed && (
                        <div className="mt-4 text-xs text-gray-600 font-semibold">
                          ✓ Completado
                        </div>
                      )}
                    </div>

                    {/* Brillo decorativo */}
                    {!isFullyUsed && (
                      <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity">
                        <div className="animate-shimmer absolute inset-0 rounded-2xl"></div>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Contador */}
            <div className="text-center">
              <div className="inline-flex items-center gap-2 glass-effect rounded-full px-6 py-3">
                <Gift className="text-pink-500" size={20} />
                <span className="text-pink-600 font-medium">
                  Has canjeado {totalUsed} de {totalAvailable} cupones disponibles
                </span>
              </div>
            </div>
          </div>
        ) : (
          /* Modal de confirmación */
          <div className="glass-effect rounded-3xl p-8 md:p-12 animate-fade-in relative">
            <button
              onClick={() => setSelectedCoupon(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-pink-200 hover:bg-pink-300 transition-all"
            >
              <X className="text-pink-700" size={24} />
            </button>

            <div className="text-center max-w-md mx-auto">
              {selectedCoupon.used >= selectedCoupon.maxUses ? (
                <>
                  <div className="text-8xl mb-6">✓</div>
                  <h2 className="text-3xl font-bold text-gray-600 mb-4">
                    Ya completado
                  </h2>
                  <p className="text-gray-500 mb-6">
                    {selectedCoupon.maxUses > 1 
                      ? `Este cupón ha sido usado todas sus veces (${selectedCoupon.maxUses}). ¡Espero que lo hayas disfrutado! 💕`
                      : 'Este cupón ya fue usado. ¡Espero que lo hayas disfrutado! 💕'}
                  </p>
                </>
              ) : (
                <>
                  <div className="text-8xl mb-6 animate-bounce-gentle">{selectedCoupon.icon}</div>
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-4">
                    {selectedCoupon.title}
                  </h2>
                  <p className="text-lg text-gray-700 mb-4">
                    {selectedCoupon.description}
                  </p>

                  {/* Mostrar contador si tiene múltiples usos */}
                  {selectedCoupon.maxUses > 1 && (
                    <div className="mb-6 p-4 bg-pink-50 rounded-lg">
                      <p className="text-sm text-pink-600 font-medium">
                        Uso {selectedCoupon.used + 1} de {selectedCoupon.maxUses}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Te quedan {selectedCoupon.maxUses - selectedCoupon.used} usos disponibles
                      </p>
                    </div>
                  )}

                  <div className="flex flex-col gap-3">
                    {selectedCoupon.id === 9 && new Date() < new Date('2026-01-15T00:00:00') ? (
                      <button
                        disabled
                        className="w-full bg-gray-400 text-white px-8 py-4 rounded-2xl font-bold cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        <span>🔒</span> Disponible el 15 de Enero
                      </button>
                    ) : (
                      <button
                        onClick={confirmUseCoupon}
                        className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white px-8 py-4 rounded-2xl font-bold hover:from-pink-600 hover:to-purple-600 transform hover:scale-105 transition-all shadow-lg"
                      >
                        ¡Canjear ahora! 🎉
                      </button>
                    )}
                    <button
                      onClick={() => setSelectedCoupon(null)}
                      className="w-full bg-gray-200 text-gray-700 px-8 py-3 rounded-2xl font-medium hover:bg-gray-300 transition-all"
                    >
                      Guardar para después
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Corazones decorativos */}
            <div className="flex justify-center gap-2 mt-8">
              {[...Array(5)].map((_, i) => (
                <Heart
                  key={i}
                  className="text-pink-400 fill-pink-400 animate-pulse"
                  size={20}
                  style={{ animationDelay: `${i * 0.1}s` }}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
