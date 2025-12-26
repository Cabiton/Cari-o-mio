'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Heart, Sparkles } from 'lucide-react';

export default function MedidorAmorPage() {
  const [loboLove, setLoboLove] = useState(0);
  const [lobaLove, setLobaLove] = useState(0);

  useEffect(() => {
    // Cargar valores guardados
    const savedLobo = localStorage.getItem('loboLove');
    const savedLoba = localStorage.getItem('lobaLove');
    
    if (savedLobo) setLoboLove(parseInt(savedLobo));
    if (savedLoba) setLobaLove(parseInt(savedLoba));
  }, []);

  const addLoboLove = () => {
    const newValue = loboLove + 1;
    setLoboLove(newValue);
    localStorage.setItem('loboLove', newValue.toString());
    createHeart('lobo');
  };

  const addLobaLove = () => {
    const newValue = lobaLove + 1;
    setLobaLove(newValue);
    localStorage.setItem('lobaLove', newValue.toString());
    createHeart('loba');
  };

  const createHeart = (type: 'lobo' | 'loba') => {
    const container = document.getElementById(`${type}-container`);
    if (!container) return;

    const heart = document.createElement('div');
    heart.className = 'absolute text-4xl pointer-events-none';
    heart.innerHTML = type === 'lobo' ? '💙' : '💗';
    heart.style.left = `${Math.random() * 80 + 10}%`;
    heart.style.bottom = '50%';
    heart.style.animation = 'floatUp 2s ease-out forwards';
    
    container.appendChild(heart);
    
    setTimeout(() => heart.remove(), 2000);
  };

  const getLoveLevel = (love: number) => {
    if (love < 50) return { text: 'Empezando 💕', color: 'from-pink-400 to-pink-600' };
    if (love < 100) return { text: 'Creciendo 💖', color: 'from-pink-500 to-rose-600' };
    if (love < 200) return { text: 'Fuerte 💗', color: 'from-rose-500 to-red-600' };
    if (love < 500) return { text: 'Intenso 💝', color: 'from-red-500 to-pink-700' };
    if (love < 1000) return { text: 'Infinito 💞', color: 'from-purple-500 to-pink-600' };
    if (love < 5000) return { text: 'Eterno 💕✨', color: 'from-pink-600 via-purple-600 to-blue-600' };
    if (love < 10000) return { text: 'Legendario 🌟💖', color: 'from-yellow-400 via-pink-500 to-purple-600' };
    return { text: 'Trascendental 🌌💫', color: 'from-indigo-600 via-purple-600 to-pink-600 animate-shimmer' };
  };

  const loboLevel = getLoveLevel(loboLove);
  const lobaLevel = getLoveLevel(lobaLove);
  const totalLove = loboLove + lobaLove;

  return (
    <main className="min-h-screen p-4 md:p-8 bg-gradient-to-br from-pink-100 via-purple-100 to-rose-100 relative overflow-hidden">
      {/* Fondo animado */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute text-2xl animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              opacity: 0.1,
            }}
          >
            💕
          </div>
        ))}
      </div>

      {/* Botón de regreso */}
      <Link
        href="/main"
        className="fixed top-6 left-6 z-50 bg-white/80 backdrop-blur-sm p-3 rounded-full hover:bg-white transition-all shadow-lg group"
      >
        <ArrowLeft className="text-gray-700 group-hover:text-pink-600" size={24} />
      </Link>

      <div className="relative z-10 max-w-6xl mx-auto pt-20">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="text-7xl mb-4 animate-bounce-gentle">💕</div>
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
            Medidor de Amor
          </h1>
          <p className="text-xl text-gray-600 mb-2">
            ¡Dale click para demostrar tu amor! 💗
          </p>
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg">
            <Sparkles className="text-yellow-500" size={24} />
            <span className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              Amor Total: {totalLove}
            </span>
            <Sparkles className="text-yellow-500" size={24} />
          </div>
        </div>

        {/* Cards de amor */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Mi Lobo */}
          <div
            id="lobo-container"
            className="relative bg-gradient-to-br from-blue-100 to-indigo-100 rounded-3xl p-8 shadow-2xl border-4 border-blue-300 hover:scale-105 transition-all duration-300"
          >
            {/* Indicador de quién toca */}
            <div className="absolute top-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
              🐺 Solo para Mi Lobo
            </div>
            
            <div className="text-center mb-6">
              <div className="text-7xl mb-4 animate-bounce-gentle">🐺</div>
              <h2 className="text-3xl font-bold text-blue-900 mb-2">Mi Lobo</h2>
              <div className={`inline-block px-6 py-2 rounded-full bg-gradient-to-r ${loboLevel.color} text-white font-bold shadow-lg`}>
                {loboLevel.text}
              </div>
            </div>

            <div className="text-center mb-6">
              <div className="text-6xl font-bold text-blue-900 mb-2 animate-pulse">
                {loboLove}
              </div>
              <div className="text-sm text-blue-700 font-medium">Clicks de amor</div>
            </div>

            <button
              onClick={addLoboLove}
              className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white py-6 rounded-2xl font-bold text-xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all flex items-center justify-center gap-3 active:scale-95"
            >
              <Heart className="fill-current" size={32} />
              ¡Dale amor a Mi Lobo!
              <Heart className="fill-current" size={32} />
            </button>

            {/* Barra de progreso infinita */}
            <div className="mt-6">
              <div className="bg-white/50 rounded-full h-4 overflow-hidden mb-2">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-500 rounded-full animate-pulse-slow"
                  style={{ width: '100%' }}
                />
              </div>
              <p className="text-center text-sm text-blue-700 font-semibold">
                💙 Sin límites, amor infinito 💙
              </p>
            </div>
          </div>

          {/* Mi Loba */}
          <div
            id="loba-container"
            className="relative bg-gradient-to-br from-pink-100 to-rose-100 rounded-3xl p-8 shadow-2xl border-4 border-pink-300 hover:scale-105 transition-all duration-300"
          >
            {/* Indicador de quién toca */}
            <div className="absolute top-4 right-4 bg-pink-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
              💕 Solo para Mi Loba
            </div>
            
            <div className="text-center mb-6">
              <div className="text-7xl mb-4 animate-bounce-gentle" style={{ animationDelay: '0.3s' }}>🐺</div>
              <h2 className="text-3xl font-bold text-pink-900 mb-2">Mi Loba</h2>
              <div className={`inline-block px-6 py-2 rounded-full bg-gradient-to-r ${lobaLevel.color} text-white font-bold shadow-lg`}>
                {lobaLevel.text}
              </div>
            </div>

            <div className="text-center mb-6">
              <div className="text-6xl font-bold text-pink-900 mb-2 animate-pulse">
                {lobaLove}
              </div>
              <div className="text-sm text-pink-700 font-medium">Clicks de amor</div>
            </div>

            <button
              onClick={addLobaLove}
              className="w-full bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white py-6 rounded-2xl font-bold text-xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all flex items-center justify-center gap-3 active:scale-95"
            >
              <Heart className="fill-current" size={32} />
              ¡Dale amor a Mi Loba!
              <Heart className="fill-current" size={32} />
            </button>

            {/* Barra de progreso infinita */}
            <div className="mt-6">
              <div className="bg-white/50 rounded-full h-4 overflow-hidden mb-2">
                <div
                  className="h-full bg-gradient-to-r from-pink-500 to-rose-600 transition-all duration-500 rounded-full animate-pulse-slow"
                  style={{ width: '100%' }}
                />
              </div>
              <p className="text-center text-sm text-pink-700 font-semibold">
                💗 Sin límites, amor infinito 💗
              </p>
            </div>
          </div>
        </div>

        {/* Estadísticas */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl animate-fade-in">
          <h3 className="text-2xl font-bold text-center text-gray-800 mb-6 flex items-center justify-center gap-2">
            <Sparkles className="text-yellow-500" />
            Estadísticas de Amor
            <Sparkles className="text-yellow-500" />
          </h3>
          
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6">
              <div className="text-4xl mb-2">🐺</div>
              <div className="text-3xl font-bold text-blue-900">{loboLove}</div>
              <div className="text-sm text-blue-700 mt-1">Amor de Mi Lobo</div>
            </div>
            
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6">
              <div className="text-4xl mb-2">💕</div>
              <div className="text-3xl font-bold text-purple-900">{totalLove}</div>
              <div className="text-sm text-purple-700 mt-1">Amor Total</div>
            </div>
            
            <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-2xl p-6">
              <div className="text-4xl mb-2">🐺</div>
              <div className="text-3xl font-bold text-pink-900">{lobaLove}</div>
              <div className="text-sm text-pink-700 mt-1">Amor de Mi Loba</div>
            </div>
          </div>

          {totalLove >= 100 && (
            <div className="mt-6 text-center">
              <div className="inline-block bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-8 py-3 rounded-full font-bold shadow-lg animate-bounce-gentle">
                🎉 ¡{totalLove} clicks de amor puro! 🎉
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes floatUp {
          0% {
            transform: translateY(0) scale(1);
            opacity: 1;
          }
          100% {
            transform: translateY(-200px) scale(1.5);
            opacity: 0;
          }
        }
      `}</style>
    </main>
  );
}
