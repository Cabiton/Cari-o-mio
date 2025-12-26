'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Lock, Unlock, Download, Heart } from 'lucide-react';
import { CONFIDENTIAL_PASSWORD } from '../utils/constants';
import { FloatingPetals } from '../components/FloatingPetals';

export default function ConfidencialPage() {
  const [password, setPassword] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password.trim().toLowerCase() === CONFIDENTIAL_PASSWORD.toLowerCase()) {
      setIsUnlocked(true);
      setError('');
    } else {
      setError('Ups... contraseña incorrecta 😳');
      setPassword('');
    }
  };

  return (
    <main className="min-h-screen p-4 md:p-8 relative overflow-hidden">
      <FloatingPetals count={40} />

      {/* Botón de regreso */}
      <Link
        href="/main"
        className="fixed top-6 left-6 z-20 glass-effect p-3 rounded-full hover:bg-white/40 transition-all group"
      >
        <ArrowLeft className="text-pink-600 group-hover:text-pink-700" size={24} />
      </Link>

      <div className="relative z-10 max-w-2xl mx-auto pt-20">
        {!isUnlocked ? (
          <div className="animate-fade-in">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-block p-6 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full mb-4">
                <Lock className="text-white" size={48} />
              </div>
              <h1 className="text-4xl font-bold text-pink-600 mb-2">
                🔐 Archivo Confidencial
              </h1>
              <p className="text-lg text-gray-600">
                ¿Qué me gusta más de ti?
              </p>
              <p className="text-sm text-gray-500 italic mt-2">
                Pista: No hay pista
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="glass-effect rounded-3xl p-8">
              <input
                type="text"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError('');
                }}
                placeholder="Nunca lo digo, pero es así..."
                className="w-full px-6 py-4 rounded-full border-2 border-pink-200 focus:border-pink-400 focus:ring-4 focus:ring-pink-200 outline-none transition-all mb-6 text-center"
                autoFocus
              />

              {error && (
                <p className="text-red-500 text-center mb-4 animate-fade-in">
                  {error}
                </p>
              )}

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white py-4 rounded-full font-medium text-lg hover:from-pink-600 hover:to-purple-600 transform hover:scale-105 transition-all shadow-lg hover:shadow-xl"
              >
                Desbloquear
              </button>
            </form>
          </div>
        ) : (
          <div className="animate-fade-in">
            {/* Contenido desbloqueado */}
            <div className="text-center mb-8">
              <div className="inline-block p-6 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full mb-4 animate-bounce">
                <Unlock className="text-white" size={48} />
              </div>
              <h1 className="text-4xl font-bold text-pink-600 mb-2">
                ✨ Archivo Desbloqueado ✨
              </h1>
            </div>

            <div className="glass-effect rounded-3xl p-8 mb-6">
              <p className="text-lg text-gray-700 text-center mb-6">
                ✨ Sabía que lo sabrías…<br />
                Lo que más me gusta de ti es algo que no cabe en una sola palabra,
                pero esta carta intenta explicarlo✨
              </p>

              <div className="flex justify-center mb-6">
                <a
                  href="/mi_niña.pdf"
                  download
                  className="inline-flex items-center gap-2 bg-pink-100 text-pink-600 px-6 py-3 rounded-full font-medium hover:bg-pink-200 transition-all shadow-md hover:shadow-lg"
                >
                  <Download size={20} />
                  📎 Descargar archivo secreto (PDF)
                </a>
              </div>

              {/* Partículas de corazones */}
              <div className="flex justify-center gap-2 mt-6">
                {[...Array(9)].map((_, i) => (
                  <Heart
                    key={i}
                    className="text-pink-300 fill-pink-300 sparkle"
                    size={16}
                    style={{ animationDelay: `${i * 0.2}s` }}
                  />
                ))}
              </div>
            </div>

            {/* Mensaje especial */}
            <div className="text-center">
              <div className="inline-flex items-center gap-2 glass-effect rounded-full px-8 py-4">
                <Heart className="text-pink-500 fill-pink-500 animate-pulse" size={24} />
                <p className="text-pink-600 font-medium">
                  &quot;Todo de ti me encanta&quot; 💕
                </p>
                <Heart className="text-pink-500 fill-pink-500 animate-pulse" size={24} />
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
