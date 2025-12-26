'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Heart, Lock } from 'lucide-react';
import { PASSWORD } from './utils/constants';
import { FloatingPetals } from './components/FloatingPetals';

export default function Home() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isShaking, setIsShaking] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password === PASSWORD) {
      localStorage.setItem('authenticated', 'true');
      router.push('/main');
    } else {
      setError('Contraseña incorrecta 💔');
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-gradient-to-br from-pink-50 via-purple-50 to-rose-50">
      <FloatingPetals count={60} />
      
      {/* Círculos decorativos de fondo */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-20 -left-20 w-96 h-96 bg-pink-300/30 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-purple-300/30 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-rose-300/20 rounded-full blur-3xl animate-bounce-gentle"></div>
      </div>
      
      {/* Corazones flotantes adicionales */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <Heart
            key={i}
            className="absolute text-pink-200/40 fill-pink-200/40 animate-float-up"
            size={Math.random() * 30 + 10}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${Math.random() * 10 + 15}s`,
            }}
          />
        ))}
      </div>
      
      <div className="relative z-10 w-full max-w-md">
        <div className="glass-effect rounded-3xl p-8 shadow-2xl animate-fade-in relative overflow-hidden">
          {/* Efecto shimmer de fondo */}
          <div className="absolute inset-0 opacity-30">
            <div className="animate-shimmer absolute inset-0"></div>
          </div>
          
          {/* Logo/Header */}
          <div className="text-center mb-8 relative z-10">
            <div className="inline-block p-4 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full mb-4 animate-bounce-gentle relative">
              <Heart className="text-white fill-white animate-pulse" size={48} />
              {/* Anillo de brillo alrededor */}
              <div className="absolute inset-0 rounded-full animate-ping bg-pink-400/30"></div>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-2 animate-glow">
              Solo para nosotros 💖
            </h1>
            
            {/* Línea decorativa */}
            <div className="flex justify-center gap-2 my-3">
              {[...Array(7)].map((_, i) => (
                <div key={i} className={`w-2 h-2 rounded-full ${i === 3 ? 'bg-purple-500 w-3 h-3' : 'bg-pink-400'} animate-pulse`} style={{ animationDelay: `${i * 0.15}s` }}></div>
              ))}
            </div>
            
            <p className="text-pink-500 text-sm">
              Un espacio especial lleno de amor
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label 
                htmlFor="password" 
                className="block text-sm font-medium text-pink-700 mb-2"
              >
                Responde la adivinanza: ¿Qué late por ti?
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-pink-400" size={20} />
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError('');
                  }}
                  className={`w-full pl-10 pr-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-pink-400 transition-all ${
                    isShaking ? 'animate-shake border-red-400' : 'border-pink-200'
                  }`}
                  placeholder="Ingresa la contraseña..."
                  autoFocus
                />
              </div>
              {error && (
                <p className="mt-2 text-sm text-red-500 animate-fade-in">
                  {error}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white py-3 rounded-xl font-medium hover:from-pink-600 hover:to-purple-600 transform hover:scale-105 transition-all shadow-lg hover:shadow-xl"
            >
              Entrar ✨
            </button>
          </form>

          {/* Decorative elements */}
          <div className="mt-8 flex justify-center gap-2">
            {[...Array(5)].map((_, i) => (
              <Heart
                key={i}
                size={16}
                className="text-pink-300 fill-pink-300 animate-pulse"
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            ))}
          </div>
        </div>

        {/* Footer message */}
        <p className="text-center mt-6 text-pink-600 text-sm italic animate-fade-in">
          &quot;Cada momento contigo es un regalo&quot; 💝
        </p>
      </div>

      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          75% { transform: translateX(10px); }
        }
        .animate-shake {
          animation: shake 0.3s ease-in-out;
        }
      `}</style>
    </main>
  );
}
