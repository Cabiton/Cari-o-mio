'use client';

import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';

export function LoveMeter() {
  const [loveLevel, setLoveLevel] = useState(0);
  const [maxLove] = useState(100);

  useEffect(() => {
    // Cargar nivel de amor guardado
    const saved = localStorage.getItem('loveLevel');
    if (saved) {
      setLoveLevel(parseInt(saved));
    } else {
      setLoveLevel(10); // Empezar en 10%
    }

    // Incrementar amor por cada visita/interacción
    const increment = () => {
      const current = parseInt(localStorage.getItem('loveLevel') || '10');
      if (current < maxLove) {
        const newLevel = Math.min(current + 1, maxLove);
        localStorage.setItem('loveLevel', newLevel.toString());
        setLoveLevel(newLevel);
      }
    };

    increment();
  }, [maxLove]);

  const percentage = (loveLevel / maxLove) * 100;

  return (
    <div className="fixed bottom-6 right-6 z-50 glass-effect rounded-2xl p-4 shadow-2xl animate-fade-in">
      <div className="flex items-center gap-3">
        <Heart className="text-pink-500 fill-pink-500 animate-pulse" size={24} />
        <div className="w-32">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs font-semibold text-pink-600">Amor</span>
            <span className="text-xs font-bold text-pink-700">{loveLevel}%</span>
          </div>
          <div className="h-3 bg-pink-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-pink-400 via-rose-500 to-pink-600 rounded-full transition-all duration-500 ease-out relative overflow-hidden"
              style={{ width: `${percentage}%` }}
            >
              {/* Efecto de brillo */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer"></div>
            </div>
          </div>
        </div>
      </div>
      {loveLevel === maxLove && (
        <div className="text-center mt-2">
          <span className="text-xs text-pink-600 font-semibold">¡Amor Máximo! 💖</span>
        </div>
      )}
    </div>
  );
}
