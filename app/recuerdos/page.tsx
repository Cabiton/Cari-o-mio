'use client';

import Link from 'next/link';
import { ArrowLeft, Clock, Sparkles } from 'lucide-react';
import { FloatingPetals } from '../components/FloatingPetals';

export default function RecuerdosPage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-gradient-to-br from-pink-50 via-purple-50 to-pink-50">
      <FloatingPetals count={30} />
      
      {/* Background ambient effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-pink-200/30 rounded-full blur-[100px] animate-pulse-slow" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-200/30 rounded-full blur-[100px] animate-pulse-slow" style={{ animationDelay: '2s' }} />
      </div>

      <Link
        href="/main"
        className="fixed top-6 left-6 z-50 bg-white/60 backdrop-blur-md p-3 rounded-full hover:bg-white/80 transition-all group shadow-sm"
      >
        <ArrowLeft className="text-pink-600 group-hover:text-pink-700" size={24} />
      </Link>

      <div className="relative z-10 max-w-2xl w-full text-center animate-fade-in">
        <div className="glass-effect p-12 rounded-3xl border border-white/40 shadow-2xl bg-white/30 backdrop-blur-xl">
          <div className="inline-flex items-center justify-center p-6 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full mb-8 shadow-lg shadow-pink-500/30 animate-bounce-gentle relative">
            <Clock className="text-white" size={48} />
            <Sparkles className="absolute -top-2 -right-2 text-yellow-300 animate-pulse" size={24} />
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-6">
            Recuerdos
          </h1>
          
          <div className="space-y-4">
            <p className="text-2xl font-medium text-gray-700 animate-pulse">
              muy pronto, me refiero disponible pronto
            </p>
            <p className="text-gray-500">
              Estamos preparando algo muy especial para ti 💕
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
