'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Heart, Calendar } from 'lucide-react';
import { START_DATE, FROZEN_DATE } from '../utils/constants';
import { FloatingPetals } from '../components/FloatingPetals';

interface TimeCount {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export default function TiempoJuntosPage() {
  const [timeCount, setTimeCount] = useState<TimeCount>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    // Función para calcular el tiempo transcurrido desde START_DATE hasta ahora
    const calculateTime = () => {
      const now = new Date();
      const diff = now.getTime() - START_DATE.getTime();
      
      const totalSeconds = Math.floor(diff / 1000);
      const days = Math.floor(totalSeconds / (3600 * 24));
      const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;

      setTimeCount({ days, hours, minutes, seconds });
    };

    // Calcular inmediatamente
    calculateTime();

    // Actualizar cada segundo
    const interval = setInterval(calculateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  const stats = [
    {
      value: timeCount.days,
      label: 'Días',
      icon: '📅',
      color: 'from-pink-500 to-rose-500',
    },
    {
      value: timeCount.hours,
      label: 'Horas',
      icon: '⏰',
      color: 'from-purple-500 to-pink-500',
    },
    {
      value: timeCount.minutes,
      label: 'Minutos',
      icon: '⏱️',
      color: 'from-rose-500 to-purple-500',
    },
    {
      value: timeCount.seconds,
      label: 'Segundos',
      icon: '⚡',
      color: 'from-pink-500 to-purple-500',
    },
  ];

  return (
    <main className="min-h-screen p-4 md:p-8 relative overflow-hidden">
      <FloatingPetals count={40} />
      
      {/* Efecto de brillo en el fondo */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-10 right-20 w-96 h-96 bg-pink-300/20 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-purple-300/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/3 left-1/3 w-64 h-64 bg-rose-300/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
      </div>
      
      {/* Relojes decorativos removidos a petición del usuario */}

      {/* Botón de regreso */}
      <Link
        href="/main"
        className="fixed top-6 left-6 z-20 glass-effect p-3 rounded-full hover:bg-white/40 transition-all group"
      >
        <ArrowLeft className="text-pink-600 group-hover:text-pink-700" size={24} />
      </Link>

      <div className="relative z-10 max-w-6xl mx-auto pt-20">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center gap-3 mb-4">
            <Calendar className="text-pink-500" size={40} />
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              Nuestro tiempo juntos
            </h1>
            <Heart className="text-pink-500 fill-pink-500 animate-pulse" size={40} />
          </div>
          <p className="text-lg text-pink-600 max-w-2xl mx-auto">
            Este contador dice los días, las horas, los minutos y los segundos que llevamos juntos.
            <br />
            <span className="font-semibold">Y todo lo que aumentará 💗</span>
          </p>
        </div>

        {/* Contador principal */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className="glass-effect rounded-3xl p-6 md:p-8 text-center group hover:scale-105 transition-all duration-300 animate-slide-up relative overflow-hidden"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Shimmer effect al hover */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="animate-shimmer absolute inset-0"></div>
              </div>
              
              <div className="relative z-10">
                <div className="text-5xl mb-3 group-hover:scale-110 transition-transform filter group-hover:drop-shadow-lg">
                  {stat.icon}
                </div>
                <div className={`text-4xl md:text-5xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-2 animate-glow`}>
                  {stat.value.toString().padStart(2, '0')}
                </div>
                <div className="text-sm md:text-base text-pink-600 font-medium">
                  {stat.label}
                </div>

                {/* Efecto de brillo */}
                <div className="mt-4 h-1 bg-gradient-to-r from-transparent via-pink-300 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                
                {/* Corazones en las esquinas */}
                <Heart className="absolute top-2 right-2 text-pink-300 fill-pink-300 opacity-0 group-hover:opacity-100 transition-opacity" size={16} />
              </div>
            </div>
          ))}
        </div>

        {/* Tarjeta de fecha de inicio */}
        <div className="glass-effect rounded-3xl p-8 text-center max-w-2xl mx-auto mb-12 animate-fade-in">
          <div className="text-6xl mb-4">💕</div>
          <h2 className="text-2xl font-bold text-pink-600 mb-2">
            Comenzamos nuestra historia
          </h2>
          <p className="text-lg text-pink-500">
            {START_DATE.toLocaleDateString('es-ES', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
          <div className="mt-6 pt-6 border-t border-pink-200">
            <p className="text-pink-600 italic">
              &quot;Cada momento contigo es un tesoro que guardo en mi corazón&quot; 💝
            </p>
          </div>
        </div>

        {/* Estadísticas adicionales */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
          <div className="glass-effect rounded-2xl p-6 text-center">
            <div className="text-4xl mb-2">🌙</div>
            <div className="text-2xl font-bold text-purple-600">
              {Math.floor(timeCount.days / 30)}
            </div>
            <div className="text-sm text-pink-600">Meses aproximados</div>
          </div>

          <div className="glass-effect rounded-2xl p-6 text-center">
            <div className="text-4xl mb-2">🌟</div>
            <div className="text-2xl font-bold text-purple-600">
              {Math.floor(timeCount.days / 7)}
            </div>
            <div className="text-sm text-pink-600">Semanas juntos</div>
          </div>

          <div className="glass-effect rounded-2xl p-6 text-center">
            <div className="text-4xl mb-2">💫</div>
            <div className="text-2xl font-bold text-purple-600">
              {(timeCount.days * 24 * 60).toLocaleString()}
            </div>
            <div className="text-sm text-pink-600">Minutos de amor</div>
          </div>
        </div>

        {/* Mensaje final */}
        <div className="text-center mt-12 animate-fade-in">
          <div className="inline-flex items-center gap-2 glass-effect rounded-full px-8 py-4">
            <Heart className="text-pink-500 fill-pink-500 animate-pulse" size={24} />
            <p className="text-lg text-pink-600 font-medium">
              Y contando cada segundo más... 💗
            </p>
            <Heart className="text-pink-500 fill-pink-500 animate-pulse" size={24} />
          </div>
        </div>
      </div>
    </main>
  );
}
