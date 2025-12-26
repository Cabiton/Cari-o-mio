'use client';

import { useEffect, useState } from 'react';
import { Download, X } from 'lucide-react';

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      
      // Mostrar prompt después de 30 segundos si no se ha instalado
      setTimeout(() => {
        const hasSeenPrompt = localStorage.getItem('pwaPromptSeen');
        if (!hasSeenPrompt) {
          setShowPrompt(true);
        }
      }, 30000);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      console.log('PWA instalada');
    }

    setDeferredPrompt(null);
    setShowPrompt(false);
    localStorage.setItem('pwaPromptSeen', 'true');
  };

  const dismissPrompt = () => {
    setShowPrompt(false);
    localStorage.setItem('pwaPromptSeen', 'true');
  };

  if (!showPrompt || !deferredPrompt) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-white rounded-2xl shadow-2xl p-6 z-50 animate-bounce-gentle">
      <button
        onClick={dismissPrompt}
        className="absolute top-3 right-3 text-white/80 hover:text-white"
      >
        <X className="w-5 h-5" />
      </button>

      <div className="flex items-start space-x-4">
        <div className="text-5xl">💕</div>
        <div className="flex-1">
          <h3 className="font-bold text-xl mb-2">¡Instala esta app!</h3>
          <p className="text-sm text-white/90 mb-4">
            Agrega este espacio especial a tu pantalla de inicio para acceder más rápido y sin distracciones
          </p>
          <button
            onClick={handleInstall}
            className="w-full bg-white text-purple-600 px-6 py-3 rounded-xl font-bold hover:bg-pink-50 transition-colors flex items-center justify-center gap-2 shadow-lg"
          >
            <Download size={20} />
            Instalar aplicación
          </button>
        </div>
      </div>
    </div>
  );
}
