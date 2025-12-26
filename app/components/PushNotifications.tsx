'use client';

import { useEffect, useState } from 'react';
import { Bell, BellOff, X } from 'lucide-react';

const SWEET_MESSAGES = [
  "💕 Recuerda que eres increíble y te amo mucho",
  "✨ Cada momento contigo es especial",
  "💗 Eres la razón de mi sonrisa",
  "🌸 Gracias por estar en mi vida",
  "💖 Estoy pensando en ti en este momento",
  "🌟 Eres mi persona favorita en todo el mundo",
  "💝 Tu risa es mi sonido favorito",
  "🎀 Eres más hermosa que cualquier estrella",
  "💫 Cada día contigo es una aventura maravillosa",
  "🌹 No hay nadie como tú, eres única y perfecta",
];

export function PushNotifications() {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    if ('Notification' in window) {
      setPermission(Notification.permission);
      
      const hasSeenBanner = localStorage.getItem('notificationBannerSeen');
      if (Notification.permission === 'default' && !hasSeenBanner) {
        setShowBanner(true);
      }

      // Si tiene permiso, programar notificaciones aleatorias
      if (Notification.permission === 'granted') {
        scheduleRandomNotifications();
      }
    }
  }, []);

  const scheduleRandomNotifications = () => {
    // Enviar notificación aleatoria cada 2-4 horas
    const scheduleNext = () => {
      const minHours = 2;
      const maxHours = 4;
      const randomHours = Math.random() * (maxHours - minHours) + minHours;
      const milliseconds = randomHours * 60 * 60 * 1000;

      setTimeout(() => {
        const randomMessage = SWEET_MESSAGES[Math.floor(Math.random() * SWEET_MESSAGES.length)];
        
        new Notification('Mensaje de amor 💕', {
          body: randomMessage,
          icon: '/favicon.ico',
          badge: '/favicon.ico',
          tag: 'love-notification',
          requireInteraction: false,
        });

        scheduleNext(); // Programar la siguiente
      }, milliseconds);
    };

    scheduleNext();
  };

  const requestPermission = async () => {
    if ('Notification' in window) {
      const result = await Notification.requestPermission();
      setPermission(result);
      
      if (result === 'granted') {
        // Enviar notificación de bienvenida
        new Notification('¡Notificaciones activadas! 💕', {
          body: 'Ahora recibirás mensajes dulces de vez en cuando',
          icon: '/favicon.ico',
        });
        
        scheduleRandomNotifications();
      }
      
      setShowBanner(false);
      localStorage.setItem('notificationBannerSeen', 'true');
    }
  };

  const dismissBanner = () => {
    setShowBanner(false);
    localStorage.setItem('notificationBannerSeen', 'true');
  };

  if (!('Notification' in window)) {
    return null; // El navegador no soporta notificaciones
  }

  return (
    <>
      {/* Banner de solicitud */}
      {showBanner && (
        <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg shadow-2xl p-4 z-50 animate-bounce-gentle">
          <button
            onClick={dismissBanner}
            className="absolute top-2 right-2 text-white/80 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-start space-x-3">
            <Bell className="w-6 h-6 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-bold text-lg mb-1">¿Recibir mensajes dulces?</h3>
              <p className="text-sm text-white/90 mb-3">
                Activa las notificaciones para recibir sorpresas de amor durante el día 💕
              </p>
              <button
                onClick={requestPermission}
                className="bg-white text-pink-600 px-4 py-2 rounded-lg font-semibold hover:bg-pink-50 transition-colors"
              >
                Activar notificaciones
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Botón flotante de estado */}
      <button
        onClick={requestPermission}
        disabled={permission === 'granted'}
        className={`fixed bottom-24 right-4 p-4 rounded-full shadow-lg transition-all ${
          permission === 'granted'
            ? 'bg-green-500 text-white cursor-default'
            : 'bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:scale-110 animate-pulse-slow'
        }`}
        title={permission === 'granted' ? 'Notificaciones activas' : 'Activar notificaciones'}
      >
        {permission === 'granted' ? (
          <Bell className="w-6 h-6" />
        ) : (
          <BellOff className="w-6 h-6" />
        )}
      </button>
    </>
  );
}
