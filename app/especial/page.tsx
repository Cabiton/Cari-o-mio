'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Heart } from 'lucide-react';
import { SPECIAL_DATE } from '../utils/constants';
import { FloatingPetals } from '../components/FloatingPetals';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export default function EspecialPage() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [petalCount, setPetalCount] = useState(30);
  const [currentPhrase, setCurrentPhrase] = useState(0);

  const phrases = [
    "Cada segundo es una promesa.",
    "Estoy contando cada segundo para saber que hay aquí.",
    "Tú haces que la espera valga la pena.",
    "No falta mucho para saber...",
    "Cada día es un paso más para los dos."
  ];

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const distance = SPECIAL_DATE.getTime() - now;

      if (distance <= 0) {
        return {
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
        };
      }

      return {
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      };
    };

    const timer = setInterval(() => {
      const newTimeLeft = calculateTimeLeft();
      setTimeLeft(newTimeLeft);

      // Aumentar pétalos según se acerque la fecha
      if (newTimeLeft.days <= 1) {
        setPetalCount(100);
      } else if (newTimeLeft.days <= 5) {
        setPetalCount(70);
      } else if (newTimeLeft.days <= 10) {
        setPetalCount(50);
      }
    }, 1000);

    setTimeLeft(calculateTimeLeft());

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const phraseTimer = setInterval(() => {
      setCurrentPhrase((prev) => (prev + 1) % phrases.length);
    }, 10000);

    return () => clearInterval(phraseTimer);
  }, [phrases.length]);

  const isCountdownFinished = timeLeft.days === 0 && timeLeft.hours === 0 && 
                              timeLeft.minutes === 0 && timeLeft.seconds === 0;

  return (
    <main className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Gradiente de fondo */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-pink-900 to-purple-900" />
      
      <FloatingPetals count={petalCount} />

      {/* Botón de regreso */}
      <Link
        href="/main"
        className="fixed top-6 left-6 z-20 glass-effect p-3 rounded-full hover:bg-white/40 transition-all group"
      >
        <ArrowLeft className="text-pink-200 group-hover:text-pink-400" size={24} />
      </Link>

      <div className="relative z-10 text-center max-w-4xl">
        <h1 className="text-4xl md:text-5xl font-bold text-pink-100 mb-4 animate-fade-in drop-shadow-lg">
          Esto no es solo un regalo cariño...
        </h1>

        {isCountdownFinished ? (
          <div className="glass-effect rounded-3xl p-12 animate-fade-in">
            <div className="text-6xl mb-6">🎶✨💕</div>
            <h2 className="text-4xl font-bold text-pink-600 mb-4">
              ¡Ya llegó el momento cariño! 🎶
            </h2>
            <p className="text-xl text-pink-500">
              Este es un momento especial solo para nosotros dos 💝
            </p>
          </div>
        ) : (
          <>
            {/* Contador */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8">
              {[
                { value: timeLeft.days, label: 'Días' },
                { value: timeLeft.hours, label: 'Horas' },
                { value: timeLeft.minutes, label: 'Minutos' },
                { value: timeLeft.seconds, label: 'Segundos' },
              ].map((item, index) => (
                <div
                  key={item.label}
                  className="relative glass-effect rounded-2xl p-6 md:p-8 animate-pulse-slow group hover:scale-105 transition-transform"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {/* Círculo decorativo giratorio */}
                  <div className="absolute -top-2 -left-2 w-full h-full border-2 border-dashed border-pink-300/30 rounded-2xl animate-spin-slow" />
                  
                  <div className="text-5xl md:text-6xl font-bold text-pink-100 mb-2 drop-shadow-lg">
                    {item.value.toString().padStart(2, '0')}
                  </div>
                  <div className="text-sm md:text-base text-pink-300 font-medium">
                    {item.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Frase que cambia */}
            <p
              className="text-lg md:text-xl text-pink-200 italic mb-8 transition-opacity duration-1000 animate-fade-in"
              key={currentPhrase}
            >
              {phrases[currentPhrase]}
            </p>

            {/* Mensaje secreto */}
            <div className="glass-effect rounded-2xl p-6 opacity-0 hover:opacity-100 transition-opacity duration-800">
              <p className="text-pink-200 text-sm md:text-base">
                Cada segundo que pasa, es uno menos para volver a abrazarte.
              </p>
            </div>
          </>
        )}

        {/* Corazones decorativos */}
        <div className="mt-12 flex justify-center gap-3">
          {[...Array(7)].map((_, i) => (
            <Heart
              key={i}
              className="text-pink-300 fill-pink-300 animate-pulse floating-hearts"
              size={20}
              style={{ animationDelay: `${i * 0.3}s` }}
            />
          ))}
        </div>
      </div>

      <style jsx global>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 10s linear infinite;
        }
      `}</style>
    </main>
  );
}
