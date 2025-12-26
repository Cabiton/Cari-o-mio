'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Heart, Sparkles } from 'lucide-react';
import { SECTIONS } from '../utils/constants';
import { MusicPlayer } from '../components/MusicPlayer';
import { FloatingPetals } from '../components/FloatingPetals';
import { SeasonalEffects } from '../components/SeasonalEffects';
import { PushNotifications } from '../components/PushNotifications';
import { PWAInstallPrompt } from '../components/PWAInstallPrompt';

export default function MainPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const authenticated = localStorage.getItem('authenticated');
    if (!authenticated) {
      router.push('/');
    }
  }, [router]);

  if (!mounted) return null;

  return (
    <main className="min-h-screen relative overflow-hidden pb-20">
      <FloatingPetals count={50} />
      <SeasonalEffects />
      <PushNotifications />
      <PWAInstallPrompt />

      {/* Estrellas decorativas de fondo */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-pink-300 rounded-full animate-pulse-slow"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      {/* Círculos decorativos flotantes */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-10 w-64 h-64 bg-pink-200/20 rounded-full blur-3xl animate-bounce-gentle"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl animate-bounce-gentle" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-rose-200/20 rounded-full blur-3xl animate-bounce-gentle" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <header className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center justify-center gap-3 mb-4">
            <Sparkles className="text-pink-500 animate-pulse" size={32} />
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-pink-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-glow">
              Bienvenida cariño
            </h1>
            <Sparkles className="text-purple-500 animate-pulse" size={32} />
          </div>
          
          {/* Emojis en su propia línea */}
          <div className="flex justify-center gap-3 mb-6">
            <span className="text-4xl animate-bounce-gentle">💌</span>
            <span className="text-4xl animate-bounce-gentle" style={{ animationDelay: '0.2s' }}>💗</span>
          </div>
          
          {/* Decoración de corazones */}
          <div className="flex justify-center gap-2 mb-4">
            {[...Array(7)].map((_, i) => (
              <Heart
                key={i}
                className="text-pink-400 fill-pink-400 animate-pulse"
                size={12}
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            ))}
          </div>
          
          <p className="text-lg text-pink-600 font-medium max-w-2xl mx-auto">
            Estas son nuestras secciones especiales. Todas hechas solo para ti mi niña.
          </p>
        </header>

        {/* Music Player */}
        <MusicPlayer />

        {/* Sections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
          {SECTIONS.map((section, index) => (
            <Link
              key={section.href}
              href={section.href}
              className="group glass-effect rounded-2xl p-6 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 animate-slide-up relative overflow-hidden"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Efecto shimmer al hover */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="animate-shimmer absolute inset-0"></div>
              </div>
              
              <div className="text-center relative z-10">
                <div className="text-6xl mb-4 group-hover:scale-110 transition-transform filter group-hover:drop-shadow-lg">
                  {section.icon}
                </div>
                <h2 className="text-xl font-bold text-pink-600 mb-2 group-hover:text-purple-600 transition-colors">
                  {section.title}
                </h2>
                <p className="text-sm text-pink-500">
                  {section.description}
                </p>
              </div>

              {/* Decorative corner hearts */}
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Heart size={16} className="text-pink-400 fill-pink-400 animate-pulse" />
              </div>
              
              {/* Decorative bottom left sparkle */}
              <div className="absolute bottom-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Sparkles size={16} className="text-purple-400 animate-pulse" />
              </div>
            </Link>
          ))}
        </div>

        {/* Footer message */}
        <div className="text-center mt-16 animate-fade-in">
          <div className="inline-flex items-center gap-2 glass-effect rounded-full px-8 py-4 animate-glow">
            <Heart className="text-pink-500 fill-pink-500 animate-pulse" size={24} />
            <p className="text-pink-600 font-medium text-lg">
              &quot;Cada segundo contigo es un regalo&quot; 💝
            </p>
            <Heart className="text-pink-500 fill-pink-500 animate-pulse" size={24} />
          </div>
          
          {/* Corazones decorativos alrededor */}
          <div className="mt-6 flex justify-center gap-4">
            {[...Array(5)].map((_, i) => (
              <Heart
                key={i}
                className="text-pink-300 fill-pink-300 animate-bounce-gentle"
                size={20}
                style={{ animationDelay: `${i * 0.3}s` }}
              />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
