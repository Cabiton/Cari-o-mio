'use client';

import Link from 'next/link';
import { ArrowLeft, Music, ExternalLink } from 'lucide-react';
import { FloatingPetals } from '../components/FloatingPetals';

export default function PlaylistPage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <FloatingPetals count={30} />
      
      {/* Background ambient effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[100px] animate-pulse-slow" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-600/20 rounded-full blur-[100px] animate-pulse-slow" style={{ animationDelay: '2s' }} />
      </div>

      <Link
        href="/main"
        className="fixed top-6 left-6 z-50 bg-white/10 backdrop-blur-md p-3 rounded-full hover:bg-white/20 transition-all group border border-white/10"
      >
        <ArrowLeft className="text-white group-hover:text-pink-300" size={24} />
      </Link>

      <div className="relative z-10 max-w-2xl w-full text-center animate-fade-in">
        <div className="glass-effect p-12 rounded-3xl border border-white/10 shadow-2xl bg-black/20 backdrop-blur-xl">
          <div className="inline-flex items-center justify-center p-6 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full mb-8 shadow-lg shadow-green-500/30 animate-bounce-gentle">
            <Music className="text-white" size={48} />
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Nuestra Playlist
          </h1>
          
          <p className="text-xl text-gray-200 mb-10 leading-relaxed font-light">
            hice una playlist de las canciones que amo cuando pienso en ti.
          </p>

          <a 
            href="https://open.spotify.com/playlist/6l4n0D9FkSCHIHZctxoehU?si=a6bb3c71ea304fca" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-[#1DB954] hover:bg-[#1ed760] text-white font-bold py-4 px-8 rounded-full transition-all transform hover:scale-105 hover:shadow-xl shadow-lg shadow-green-900/20"
          >
            <span className="text-lg">Escuchar en Spotify</span>
            <ExternalLink size={20} />
          </a>
        </div>
      </div>
    </main>
  );
}
