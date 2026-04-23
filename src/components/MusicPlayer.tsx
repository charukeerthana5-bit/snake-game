import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, SkipForward, SkipBack, Volume2, Music2 } from 'lucide-react';
import { TRACKS, type Track } from '../constants';

interface MusicPlayerProps {
  currentTrackIndex: number;
  onTrackChange: (index: number) => void;
  isPlaying: boolean;
  onPlayPause: (playing: boolean) => void;
}

export default function MusicPlayer({ currentTrackIndex, onTrackChange, isPlaying, onPlayPause }: MusicPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const track = TRACKS[currentTrackIndex];
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(() => onPlayPause(false));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex, onPlayPause]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const p = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(p || 0);
    }
  };

  const handleNext = () => {
    onTrackChange((currentTrackIndex + 1) % TRACKS.length);
  };

  const handlePrev = () => {
    onTrackChange((currentTrackIndex - 1 + TRACKS.length) % TRACKS.length);
  };

  return (
    <div className="w-full max-w-sm">
      <audio
        ref={audioRef}
        src={track.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleNext}
      />

      <div className="bg-black border-4 border-[#00ffff] p-6 shadow-[8px_8px_0px_#ff00ff] relative overflow-hidden">
        {/* Static Noise Overlay */}
        <div className="absolute inset-0 static-noise pointer-events-none" />

        {/* Track Info */}
        <div className="flex flex-col items-center mb-8">
          <motion.div 
            key={track.id}
            initial={{ scale: 1, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative w-48 h-48 mb-6 screen-tear"
          >
            <img 
              src={track.cover} 
              alt={track.title}
              className="w-full h-full object-cover border-4 border-[#ff00ff] grayscale contrast-125"
            />
            <div className="absolute -bottom-2 -right-2 z-20 bg-black p-2 border-2 border-[#00ffff]">
              <Music2 className="w-4 h-4 text-[#00ffff]" />
            </div>
          </motion.div>

          <AnimatePresence mode="wait">
            <motion.div 
              key={track.id}
              initial={{ x: -10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 10, opacity: 0 }}
              className="text-center font-pixel"
            >
              <h3 className="text-sm text-[#00ffff] mb-1 glitch-text">{track.title}</h3>
              <p className="text-[#ff00ff] text-[8px]">ENCODED_BY: {track.artist}</p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Progress Bar */}
        <div className="mb-8 space-y-2">
          <div className="h-4 bg-slate-900 border-2 border-[#00ffff] overflow-hidden">
            <motion.div 
              className="h-full bg-[#ff00ff] transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between text-[8px] font-pixel text-[#00ffff]">
            <span>DATA_STREAM</span>
            <span>SYNC_OK</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between gap-4">
          <button 
            onClick={handlePrev}
            className="p-3 text-[#ff00ff] hover:text-[#00ffff] transition-colors border-2 border-transparent hover:border-[#00ffff]"
          >
            <SkipBack className="w-6 h-6 fill-current" />
          </button>

          <button 
            onClick={() => onPlayPause(!isPlaying)}
            className="w-20 h-12 bg-[#00ffff] flex items-center justify-center text-black border-4 border-[#ff00ff] hover:scale-105 active:scale-95 transition-transform"
          >
            {isPlaying ? (
              <Pause className="w-6 h-6 fill-black" />
            ) : (
              <Play className="w-6 h-6 fill-black ml-1" />
            )}
          </button>

          <button 
            onClick={handleNext}
            className="p-3 text-[#ff00ff] hover:text-[#00ffff] transition-colors border-2 border-transparent hover:border-[#00ffff]"
          >
            <SkipForward className="w-6 h-6 fill-current" />
          </button>
        </div>

        {/* Volume Indicator */}
        <div className="mt-8 flex items-center justify-center gap-4">
          <Volume2 className="w-4 h-4 text-[#ff00ff]" />
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div 
                key={i} 
                className={`w-2 h-4 ${i < 4 ? 'bg-[#00ffff]' : 'bg-slate-800'}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
