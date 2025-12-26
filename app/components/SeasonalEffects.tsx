'use client';

import { useEffect, useState } from 'react';

export function SeasonalEffects() {
  const [isChristmas, setIsChristmas] = useState(false);

  useEffect(() => {
    const now = new Date();
    const month = now.getMonth() + 1; // 1-12
    
    // Navidad (Diciembre)
    setIsChristmas(month === 12);
  }, []);

  if (!isChristmas) return null;

  return (
    <>
      {/* Nieve cayendo */}
      <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
        {[...Array(100)].map((_, i) => (
          <div
            key={`snow-${i}`}
            className="absolute bg-white rounded-full"
            style={{
              width: `${Math.random() * 8 + 2}px`,
              height: `${Math.random() * 8 + 2}px`,
              left: `${Math.random() * 100}%`,
              top: `-${Math.random() * 20}%`,
              animation: `snowfall ${Math.random() * 10 + 10}s linear infinite`,
              animationDelay: `${Math.random() * 5}s`,
              opacity: Math.random() * 0.6 + 0.4,
              boxShadow: '0 0 8px rgba(255, 255, 255, 0.8)',
            }}
          />
        ))}
      </div>

      {/* Árboles navideños removidos (petición del usuario) */}

      {/* Luces navideñas en la parte superior */}
      <div className="fixed top-0 left-0 right-0 pointer-events-none z-40 h-12">
        <div className="flex justify-around items-center h-full">
          {[...Array(20)].map((_, i) => (
            <div
              key={`light-${i}`}
              className={`w-3 h-3 rounded-full animate-pulse`}
              style={{
                backgroundColor: ['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#a855f7', '#ec4899'][i % 6],
                animationDelay: `${i * 0.2}s`,
                boxShadow: `0 0 10px ${['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#a855f7', '#ec4899'][i % 6]}`,
              }}
            />
          ))}
        </div>
        {/* Cable de las luces */}
        <div className="absolute top-6 left-0 right-0 h-0.5 bg-gray-700/30" />
      </div>

      <style jsx>{`
        @keyframes snowfall {
          0% {
            transform: translateY(-20px) translateX(0);
          }
          50% {
            transform: translateY(50vh) translateX(50px);
          }
          100% {
            transform: translateY(100vh) translateX(-50px);
          }
        }
      `}</style>
    </>
  );
}
