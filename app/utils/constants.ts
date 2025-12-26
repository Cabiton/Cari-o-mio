import { Song, Emotion, SectionCard } from '../types';

export const SONGS: Song[] = [
  {
    id: '1',
    title: 'Feel it',
    description: 'Nuestra canción',
    file: 'feel it.mp3',
  },
  {
    id: '2',
    title: 'Neo roneo',
    description: 'Siempre me recuerda a ti',
    file: 'Neo roneo.mp3',
  },
  {
    id: '3',
    title: 'Blue',
    description: 'Nuestra 2da canción',
    file: 'Blue.mp3',
  },
  {
    id: '4',
    title: 'Electric love',
    description: 'Nuestro amor',
    file: 'Electric love.mp3',
  },
  {
    id: '5',
    title: 'Siento que merezco más',
    description: 'Siento que merezco más',
    file: 'Siento que merezco mas.mp3',
  },
  {
    id: '6',
    title: 'Yo siempre contesto',
    description: 'Yo siempre contesto',
    file: 'Yo siempre contesto.mp3',
  },
  {
    id: '7',
    title: 'Do you think could love me?',
    description: 'Lo crees?',
    file: 'Do you think.mp3',
  },
  {
    id: '8',
    title: 'Always love',
    description: 'Una canción de hace poco, pero significa mucho',
    file: 'Always love.mp3',
  },
  {
    id: '9',
    title: 'Love wins all',
    description: 'Cuál será?',
    file: 'Cuál será.mp3',
  },
];

export const EMOTIONS: Emotion[] = [
  { name: 'Feliz', color: 'bg-yellow-100' },
  { name: 'Triste', color: 'bg-blue-100' },
  { name: 'Ansiosa', color: 'bg-orange-100' },
  { name: 'Relajada', color: 'bg-green-100' },
  { name: 'Aburrida', color: 'bg-gray-100' },
  { name: 'Estresada', color: 'bg-red-100' },
  { name: 'Enamorada', color: 'bg-pink-100' },
  { name: 'Melancólica', color: 'bg-purple-100' },
  { name: 'Cansada', color: 'bg-amber-100' },
  { name: 'Creativa', color: 'bg-yellow-100' },
  { name: 'Motivada', color: 'bg-lime-100' },
  { name: 'Confundida', color: 'bg-gray-100' },
  { name: 'Apática', color: 'bg-slate-100' },
  { name: 'Vulnerable', color: 'bg-rose-100' },
  { name: 'Soñadora', color: 'bg-sky-100' },
  { name: 'Sensible', color: 'bg-pink-100' },
  { name: 'Esperanzada', color: 'bg-emerald-100' },
  { name: 'Sobrepensando', color: 'bg-fuchsia-100' },
  { name: 'Insegura', color: 'bg-rose-100' },
  { name: 'Sola', color: 'bg-gray-100' },
  { name: 'Rota', color: 'bg-red-100' },
  { name: 'Orgullosa', color: 'bg-amber-100' },
  { name: 'Frustrada', color: 'bg-red-100' },
  { name: 'Intensa', color: 'bg-orange-100' },
  { name: 'Tímida', color: 'bg-violet-100' },
  { name: 'Vacía', color: 'bg-gray-100' },
  { name: 'Con mariposas', color: 'bg-amber-100' },
  { name: 'En pausa', color: 'bg-stone-100' },
  { name: 'Extraña pero bien', color: 'bg-indigo-100' },
  { name: 'En modo luna', color: 'bg-sky-100' },
  { name: 'Llena de ideas', color: 'bg-lime-100' },
  { name: 'Como si flotara', color: 'bg-teal-100' },
  { name: 'Sorprendida', color: 'bg-amber-100' },
  { name: 'Reflexiva profunda', color: 'bg-indigo-100' },
  { name: 'Alegre', color: 'bg-yellow-100' },
  { name: 'Pensativa', color: 'bg-purple-100' },
  { name: 'Meditativa', color: 'bg-emerald-100' },
  { name: 'Optimista', color: 'bg-lime-100' },
  { name: 'Pesimista', color: 'bg-gray-100' },
  { name: 'Determinada', color: 'bg-orange-100' },
  { name: 'Fría', color: 'bg-cyan-100' },
  { name: 'Caliente', color: 'bg-red-100' },
  { name: 'Soñolienta', color: 'bg-indigo-100' },
  { name: 'Cautelosa', color: 'bg-amber-100' },
  { name: 'Valiente', color: 'bg-orange-100' },
];

export const SECTIONS: SectionCard[] = [
  {
    title: 'Recuerdos',
    description: 'Fotos y videos de momentos inolvidables.',
    href: '/recuerdos',
    icon: '📸',
  },
  {
    title: 'Archivo confidencial',
    description: 'Un secreto guardado solo para ti.',
    href: '/confidencial',
    icon: '🔐',
  },
  {
    title: '¿Cómo estás hoy?',
    description: 'Dime cómo te sientes, y yo sabré 💌',
    href: '/como-estas',
    icon: '💭',
  },
  {
    title: 'Regalo secreto',
    description: '🔒 Próximamente... Una sorpresa especial está en camino',
    href: '/regalo-secreto',
    icon: '🎁',
  },
  {
    title: 'Tiempo juntos',
    description: 'Un contador en tiempo real de todo lo que hemos vivido💑',
    href: '/tiempo-juntos',
    icon: '⏱️',
  },
  {
    title: 'Playlist',
    description: 'Nuestras canciones especiales que nos conectan🎵',
    href: '/playlist',
    icon: '🎶',
  },
  {
    title: 'Carta voladora',
    description: 'Te llevará al lugar donde están todas las cartas.',
    href: '/carta-voladora',
    icon: '💌',
  },
  {
    title: 'Banco de Cupones',
    description: 'Cupones especiales que puedes canjear cuando quieras.',
    href: '/cupones',
    icon: '🎫',
  },
  {
    title: 'Tu Lienzo',
    description: 'Dibuja y crea lo que quieras, cuando quieras.',
    href: '/dibujo',
    icon: '🎨',
  },
  {
    title: 'Screenshots',
    description: 'Nuestras conversaciones especiales guardadas.',
    href: '/screenshots',
    icon: '📸',
  },
  {
    title: 'Medidor de Amor',
    description: '¡Dale clicks para mostrar tu amor! Mi Lobo y Mi Loba 💕',
    href: '/medidor-amor',
    icon: '💗',
  },
];

export const PASSWORD = "Mi corazón";
export const CONFIDENTIAL_PASSWORD = "Mi secreto";
export const GIFT_PASSWORD = "bobux";

export const SPECIAL_DATE = new Date("2025-10-13T23:00:00-05:00");
export const START_DATE = new Date("2025-04-16T00:00:00");
export const FROZEN_DATE = new Date("2025-11-05T15:00:00");
