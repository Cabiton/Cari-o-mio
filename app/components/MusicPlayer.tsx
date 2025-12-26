'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Play, Pause, SkipForward, SkipBack, Heart } from 'lucide-react';
import { SONGS } from '../utils/constants';
import { Song } from '../types';

export function MusicPlayer() {
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    // Cargar última canción reproducida del localStorage
    const savedSong = localStorage.getItem('currentSong');
    if (savedSong) {
      setCurrentSong(JSON.parse(savedSong));
    }
  }, []);

  const playSong = useCallback((song: Song) => {
    setCurrentSong(song);
    localStorage.setItem('currentSong', JSON.stringify(song));
    setIsPlaying(true);
    setTimeout(() => {
      audioRef.current?.play();
    }, 100);
  }, []);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleNext = useCallback(() => {
    if (!currentSong) return;
    const currentIndex = SONGS.findIndex(s => s.id === currentSong.id);
    const nextIndex = (currentIndex + 1) % SONGS.length;
    playSong(SONGS[nextIndex]);
  }, [currentSong, playSong]);

  const handlePrevious = useCallback(() => {
    if (!currentSong) return;
    const currentIndex = SONGS.findIndex(s => s.id === currentSong.id);
    const prevIndex = currentIndex === 0 ? SONGS.length - 1 : currentIndex - 1;
    playSong(SONGS[prevIndex]);
  }, [currentSong, playSong]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleNext);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleNext);
    };
  }, [handleNext]);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  };

  return (
    <div className="glass-effect rounded-3xl p-6 max-w-2xl mx-auto my-6">
      <audio
        ref={audioRef}
        src={currentSong ? `/Music/${currentSong.file}` : ''}
        preload="auto"
      />

      {currentSong && (
        <div className="mb-6 text-center animate-fade-in">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Heart className="text-pink-500 fill-pink-500 animate-pulse" size={20} />
            <h3 className="text-lg font-semibold text-pink-600">
              {currentSong.title}
            </h3>
          </div>
          <p className="text-sm text-pink-500 italic">
            {currentSong.description}
          </p>
        </div>
      )}

      {/* Barra de progreso */}
      {currentSong && (
        <div className="mb-4">
          <input
            type="range"
            min="0"
            max={duration || 0}
            value={currentTime}
            onChange={handleSeek}
            className="w-full h-2 bg-pink-200 rounded-lg appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, #ec4899 0%, #ec4899 ${(currentTime / duration) * 100}%, #fce7f3 ${(currentTime / duration) * 100}%, #fce7f3 100%)`
            }}
          />
          <div className="flex justify-between text-xs text-pink-500 mt-1">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>
      )}

      {/* Controles */}
      <div className="flex items-center justify-center gap-4 mb-6">
        <button
          onClick={handlePrevious}
          className="p-3 rounded-full bg-pink-100 hover:bg-pink-200 transition-colors"
          disabled={!currentSong}
        >
          <SkipBack size={20} className="text-pink-600" />
        </button>

        <button
          onClick={togglePlay}
          className="p-4 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 transition-all transform hover:scale-105 disabled:opacity-50"
          disabled={!currentSong}
        >
          {isPlaying ? (
            <Pause size={24} className="text-white" />
          ) : (
            <Play size={24} className="text-white ml-1" />
          )}
        </button>

        <button
          onClick={handleNext}
          className="p-3 rounded-full bg-pink-100 hover:bg-pink-200 transition-colors"
          disabled={!currentSong}
        >
          <SkipForward size={20} className="text-pink-600" />
        </button>
      </div>

      {/* Lista de canciones */}
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {SONGS.map((song) => (
          <button
            key={song.id}
            onClick={() => playSong(song)}
            className={`w-full text-left p-3 rounded-xl transition-all ${
              currentSong?.id === song.id
                ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white'
                : 'bg-white/50 hover:bg-white/70 text-pink-700'
            }`}
          >
            <div className="font-medium">{song.title}</div>
            <div className="text-xs opacity-80">{song.description}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
