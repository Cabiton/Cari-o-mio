'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Mail, ExternalLink, Heart, Sparkles } from 'lucide-react';
import { FloatingPetals } from '../components/FloatingPetals';

export default function CartaVoladoraPage() {
  const [showLetter, setShowLetter] = useState(false);
  const [isOpening, setIsOpening] = useState(false);
  const [showHearts, setShowHearts] = useState(false);
  const [displayedText, setDisplayedText] = useState('');

  const fullText = "Sé que puedes acceder rápidamente a las cartitas, pero quería hacer esta sección más bonita para ti 💕";

  useEffect(() => {
    if (showLetter) {
      const audio = new Audio('/Music/feel it.mp3');
      audio.loop = true;
      audio.play().catch(() => {
        // El usuario necesita interactuar primero
      });

      return () => {
        audio.pause();
      };
    }
  }, [showLetter]);

  // Efecto de escritura
  useEffect(() => {
    if (showLetter && !isOpening) {
      let index = 0;
      const interval = setInterval(() => {
        setDisplayedText(fullText.substring(0, index));
        index++;
        if (index > fullText.length) {
          clearInterval(interval);
        }
      }, 40);
      return () => clearInterval(interval);
    }
  }, [showLetter, isOpening]);

  const handleOpenLetter = () => {
    setIsOpening(true);
    setTimeout(() => {
      setShowLetter(true);
      setShowHearts(true);
      setIsOpening(false);
      // Ocultar corazones después de 3 segundos
      setTimeout(() => setShowHearts(false), 3000);
    }, 1000);
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-gradient-to-b from-pink-50 via-purple-50 to-pink-50">
      <FloatingPetals count={60} />

      {/* Botón de regreso */}
      <Link
        href="/main"
        className="fixed top-6 left-6 z-20 glass-effect p-3 rounded-full hover:bg-white/60 transition-all group"
      >
        <ArrowLeft className="text-pink-600 group-hover:text-pink-700" size={24} />
      </Link>

      {/* Corazones flotantes cuando se abre */}
      {showHearts && (
        <div className="fixed inset-0 z-30 pointer-events-none">
          {[...Array(20)].map((_, i) => (
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

      <div className="relative z-10 max-w-2xl w-full">
        {!showLetter ? (
          <div
            onClick={handleOpenLetter}
            className="cursor-pointer"
          >
            {/* Sobre con animación */}
            <div className={`relative w-64 h-48 mx-auto transition-all duration-1000 ${isOpening ? 'scale-110' : 'animate-float'}`}>
              {/* Parte trasera del sobre */}
              <div className="absolute inset-0 bg-gradient-to-br from-pink-200 via-pink-300 to-purple-300 rounded-lg shadow-2xl">
                {/* Sello postal */}
                <div className="absolute top-4 right-4 w-12 h-12 border-4 border-pink-400 rounded flex items-center justify-center bg-white">
                  <Heart className="text-pink-500 fill-pink-500" size={20} />
                </div>
                
                {/* Líneas decorativas */}
                <div className="absolute bottom-12 left-8 right-8 space-y-2">
                  <div className="h-1 bg-pink-400/30 rounded"></div>
                  <div className="h-1 bg-pink-400/30 rounded w-3/4"></div>
                </div>
              </div>

              {/* Tapa del sobre (se abre) */}
              <div 
                className={`absolute top-0 left-0 right-0 h-32 bg-gradient-to-br from-pink-300 to-purple-400 transition-all duration-1000 origin-top shadow-lg ${
                  isOpening ? 'rotate-x-180 -translate-y-2' : ''
                }`}
                style={{
                  clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
                  transformStyle: 'preserve-3d'
                }}
              >
                <Sparkles className="absolute top-4 left-1/2 -translate-x-1/2 text-white" size={24} />
              </div>

              {/* Ícono de mail flotante */}
              <div className="absolute inset-0 flex items-center justify-center">
                <Mail className={`text-white transition-all duration-500 ${isOpening ? 'scale-125 opacity-50' : ''}`} size={60} />
              </div>
            </div>

            <p className="text-center mt-8 text-2xl font-medium text-pink-600 animate-pulse">
              Haz clic para abrir 💌
            </p>
          </div>
        ) : (
          <div className="glass-effect rounded-3xl p-8 md:p-12 animate-fade-in">
            <div className="text-center mb-8">
              <div className="inline-block p-4 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full mb-4">
                <Mail className="text-white" size={48} />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-4">
                Mi niña 💗
              </h2>
            </div>

            <div className="mb-8 text-center">
              <p className="text-lg text-gray-700 mb-6 leading-relaxed min-h-[4rem]">
                {displayedText}
                <span className="animate-pulse">|</span>
              </p>

              <a
                href="https://www.notion.so/Cartitas-para-ti-cari-o-2077d126989a80bbb3e5ffafdb719c83?source=copy_link"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white px-8 py-4 rounded-full font-medium text-lg hover:from-pink-600 hover:to-purple-600 transform hover:scale-105 transition-all shadow-lg hover:shadow-xl"
              >
                <ExternalLink size={24} />
                Cartitas 💌
              </a>
            </div>

            <div className="text-center pt-6 border-t border-pink-200">
              <p className="text-pink-600 font-medium">
                💗 Con amor infinito.
              </p>
            </div>

            {/* Corazones flotantes */}
            <div className="flex justify-center gap-2 mt-6">
              {[...Array(9)].map((_, i) => (
                <Heart
                  key={i}
                  className="text-pink-300 fill-pink-300 animate-pulse"
                  size={16}
                  style={{ animationDelay: `${i * 0.2}s` }}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
