'use client';

import Link from 'next/link';
import { ArrowLeft, Lock, Clock, Sparkles } from 'lucide-react';

export default function RegaloSecretoPage() {
  return (
    <main className="min-h-screen p-4 md:p-8 bg-gradient-to-br from-purple-100 via-pink-100 to-rose-100 relative overflow-hidden">
      {/* Fondo animado */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              opacity: 0.15,
              fontSize: `${Math.random() * 30 + 20}px`,
            }}
          >
            {['🎁', '✨', '💝', '🔒', '⏰'][Math.floor(Math.random() * 5)]}
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

      <div className="relative z-10 max-w-4xl mx-auto pt-20 flex items-center justify-center min-h-[80vh]">
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-12 shadow-2xl text-center animate-fade-in">
          {/* Icono principal */}
          <div className="mb-8 relative inline-block">
            <div className="text-9xl mb-4 animate-bounce-gentle">🎁</div>
            <div className="absolute top-0 right-0 text-5xl animate-pulse">
              <Lock className="text-purple-600" size={48} />
            </div>
          </div>

          {/* Título */}
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 bg-clip-text text-transparent mb-6">
            Regalo Secreto
          </h1>

          {/* Mensaje principal */}
          <div className="mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Clock className="text-pink-500 animate-pulse" size={32} />
              <span className="text-3xl font-bold text-gray-800">Próximamente...</span>
              <Clock className="text-pink-500 animate-pulse" size={32} />
            </div>
            
            <p className="text-xl text-gray-700 mb-6 leading-relaxed">
              Algo especial está en camino para ti 💕
            </p>
            
            <div className="inline-block bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl p-6 border-2 border-purple-300">
              <p className="text-lg text-gray-600 mb-2">
                Este regalo está siendo preparado con mucho amor
              </p>
              <div className="flex items-center justify-center gap-2 mt-4">
                <Sparkles className="text-yellow-500 animate-pulse" />
                <span className="text-purple-600 font-semibold">Mantente atenta</span>
                <Sparkles className="text-yellow-500 animate-pulse" />
              </div>
            </div>
          </div>

          {/* Decoración */}
          <div className="flex justify-center gap-4 text-4xl mt-8">
            <span className="animate-bounce-gentle">✨</span>
            <span className="animate-bounce-gentle" style={{ animationDelay: '0.2s' }}>💝</span>
            <span className="animate-bounce-gentle" style={{ animationDelay: '0.4s' }}>🎀</span>
            <span className="animate-bounce-gentle" style={{ animationDelay: '0.6s' }}>💕</span>
            <span className="animate-bounce-gentle" style={{ animationDelay: '0.8s' }}>✨</span>
          </div>
        </div>
      </div>
    </main>
  );
}
