'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Send, Heart } from 'lucide-react';
import { EMOTIONS } from '../utils/constants';

// Temas según la emoción
const MOOD_THEMES = {
  'Feliz 😊': { bg: 'from-yellow-200 via-amber-200 to-orange-200', accent: 'from-yellow-500 to-orange-500' },
  'Emocionada 🥰': { bg: 'from-pink-200 via-rose-200 to-red-200', accent: 'from-pink-500 to-rose-500' },
  'Relajada 😌': { bg: 'from-green-200 via-teal-200 to-cyan-200', accent: 'from-green-500 to-teal-500' },
  'Cansada 😴': { bg: 'from-indigo-200 via-purple-200 to-blue-200', accent: 'from-indigo-500 to-purple-500' },
  'Triste 😢': { bg: 'from-blue-200 via-slate-200 to-gray-200', accent: 'from-blue-500 to-slate-500' },
  'Ansiosa 😰': { bg: 'from-orange-200 via-red-200 to-pink-200', accent: 'from-orange-500 to-red-500' },
};

export default function ComoEstasPage() {
  const [selectedEmotion, setSelectedEmotion] = useState<string>('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [currentTheme, setCurrentTheme] = useState({ bg: 'from-pink-100 to-purple-100', accent: 'from-pink-500 to-purple-600' });

  // Cargar tema guardado al inicio
  useEffect(() => {
    const savedEmotion = localStorage.getItem('currentMood');
    if (savedEmotion && MOOD_THEMES[savedEmotion as keyof typeof MOOD_THEMES]) {
      setCurrentTheme(MOOD_THEMES[savedEmotion as keyof typeof MOOD_THEMES]);
    }
  }, []);

  // Actualizar tema cuando cambia la emoción
  const handleEmotionSelect = (emotion: string) => {
    setSelectedEmotion(emotion);
    const theme = MOOD_THEMES[emotion as keyof typeof MOOD_THEMES];
    if (theme) {
      setCurrentTheme(theme);
      localStorage.setItem('currentMood', emotion);
    }
  };

  const handleSubmit = async () => {
    if (selectedEmotion || message) {
      setSending(true);
      
      try {
        // Enviar notificación a Telegram
        const response = await fetch('/api/notify', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            emotion: selectedEmotion,
            message: message,
          }),
        });

        if (!response.ok) {
          console.error('Error al enviar notificación');
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setSending(false);
        setSubmitted(true);
        setTimeout(() => {
          setSubmitted(false);
          setSelectedEmotion('');
          setMessage('');
        }, 3000);
      }
    }
  };

  // Efecto de lluvia
  const raindrops = Array.from({ length: 120 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}vw`,
    delay: `${Math.random() * 2}s`,
  }));

  return (
    <main className={`min-h-screen p-4 md:p-8 relative overflow-hidden bg-gradient-to-br ${currentTheme.bg} transition-all duration-1000`}>
      {/* Efecto de lluvia */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {raindrops.map((drop) => (
          <span
            key={drop.id}
            className="absolute w-0.5 h-5 bg-gray-300/20"
            style={{
              left: drop.left,
              animation: `lluvia 0.8s linear infinite`,
              animationDelay: drop.delay,
            }}
          />
        ))}
      </div>

      {/* Botón de regreso */}
      <Link
        href="/main"
        className="fixed top-6 left-6 z-20 glass-effect p-3 rounded-full hover:bg-white/60 transition-all group"
      >
        <ArrowLeft className="text-gray-700 group-hover:text-pink-600" size={24} />
      </Link>

      <div className="relative z-10 max-w-4xl mx-auto pt-20">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold text-red-900 mb-4">
            ¿Cómo estás hoy?
          </h1>
          <p className="text-lg text-gray-600">
            Este espacio es solo para ti, para que expreses lo que llevas dentro sin miedo.
          </p>
        </div>

        {submitted ? (
          <div className="glass-effect rounded-3xl p-12 text-center animate-fade-in">
            <div className="text-7xl mb-6">💕</div>
            <h2 className="text-3xl font-bold text-pink-600 mb-4">
              Gracias por compartir conmigo 💗
            </h2>
            <p className="text-lg text-pink-500">
              Siempre estaré aquí para ti, mi amor
            </p>
          </div>
        ) : (
          <>
            {/* Grid de emociones */}
            <div className="glass-effect rounded-3xl p-6 md:p-8 mb-8 animate-fade-in relative overflow-hidden">
              {/* Efecto shimmer sutil */}
              <div className="absolute inset-0 opacity-20 pointer-events-none">
                <div className="animate-shimmer absolute inset-0"></div>
              </div>
              
              <div className="relative z-10">
                <h2 className="text-xl font-semibold text-gray-700 mb-6 text-center flex items-center justify-center gap-2">
                  <Heart className="text-pink-500 fill-pink-500 animate-pulse" size={20} />
                  Selecciona cómo te sientes:
                  <Heart className="text-pink-500 fill-pink-500 animate-pulse" size={20} />
                </h2>
                <div className="flex flex-wrap gap-3 justify-center max-h-96 overflow-y-auto px-2">
                  {EMOTIONS.map((emotion) => (
                    <button
                      key={emotion.name}
                      onClick={() => handleEmotionSelect(emotion.name)}
                      className={`${emotion.color} px-4 py-2 rounded-full text-sm font-medium transition-all transform hover:scale-105 relative ${
                        selectedEmotion === emotion.name
                          ? 'ring-4 ring-pink-400 scale-105 shadow-lg animate-glow'
                          : 'hover:shadow-md'
                      }`}
                    >
                      {emotion.name}
                      {selectedEmotion === emotion.name && (
                        <Heart className="absolute -top-1 -right-1 text-pink-500 fill-pink-500 animate-pulse" size={12} />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Área de texto */}
            <div className="glass-effect rounded-3xl p-6 md:p-8 mb-8 animate-fade-in">
              <h2 className="text-xl font-semibold text-gray-700 mb-4 text-center">
                Cuéntame más si quieres:
              </h2>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Escríbeme como te sientes hoy cariño..."
                className="w-full h-32 p-4 rounded-2xl border-2 border-pink-200 focus:border-pink-400 focus:ring-4 focus:ring-pink-200 outline-none resize-none transition-all"
              />
            </div>

            {/* Botón de enviar */}
            <div className="text-center animate-fade-in">
              <button
                onClick={handleSubmit}
                disabled={(!selectedEmotion && !message) || sending}
                className={`inline-flex items-center gap-2 bg-gradient-to-r ${currentTheme.accent} text-white px-8 py-4 rounded-full font-medium text-lg hover:shadow-xl disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transform hover:scale-105 transition-all shadow-lg`}
              >
                {sending ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Enviando...
                  </>
                ) : (
                  <>
                    <Send size={20} />
                    Enviar mensaje 💌
                  </>
                )}
              </button>
            </div>

            {selectedEmotion && (
              <div className="mt-8 text-center animate-fade-in">
                <div className="inline-flex items-center gap-2 glass-effect rounded-full px-6 py-3">
                  <Heart className="text-pink-500 fill-pink-500" size={20} />
                  <p className="text-pink-600">
                    Te sientes: <span className="font-semibold">{selectedEmotion}</span>
                  </p>
                </div>
              </div>
            )}
          </>
        )}

        {/* Mensaje de apoyo */}
        <div className="mt-12 text-center animate-fade-in">
          <p className="text-gray-600 italic">
            &quot;Recuerda que siempre estoy aquí para ti, en los buenos y malos momentos&quot; 💝
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes lluvia {
          0% {
            transform: translateY(-100px);
            opacity: 0;
          }
          100% {
            transform: translateY(100vh);
            opacity: 1;
          }
        }
      `}</style>
    </main>
  );
}
