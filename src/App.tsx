/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Cpu, Music, Gamepad2, Settings } from 'lucide-react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';
import { TRACKS } from './constants';

export default function App() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [globalScore, setGlobalScore] = useState(0);

  const currentTrack = TRACKS[currentTrackIndex];

  return (
    <div className="min-h-screen bg-black text-[#00ffff] font-retro selection:bg-[#ff00ff] selection:text-white overflow-hidden">
      {/* Glitch Overlays */}
      <div className="fixed inset-0 pointer-events-none z-[100] border-[20px] border-black">
        <div className="absolute inset-0 static-noise" />
        <div className="scanline" />
      </div>

      <div className="relative z-10 container mx-auto h-screen flex flex-col p-8 overflow-y-auto lg:overflow-hidden lg:max-w-6xl">
        {/* Header */}
        <header className="flex justify-between items-start border-b-4 border-[#00ffff] pb-4 mb-12">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-[#00ffff] text-black">
              <Cpu className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-2xl font-pixel glitch-text tracking-tighter">CORE_SEGMENT_01</h1>
              <p className="text-[10px] text-[#ff00ff] font-pixel mt-1">UPLINK_STATUS: STABLE</p>
            </div>
          </div>

          <div className="text-right font-pixel">
            <p className="text-[10px] text-[#ff00ff] mb-2 tracking-widest">LOG_DATA_SYST</p>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-[#00ffff]">{globalScore.toString().padStart(8, '0')}</span>
            </div>
          </div>
        </header>

        {/* Main Interface Grid */}
        <main className="flex-1 grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-12 items-start">
          
          {/* Game Section */}
          <section className="flex flex-col items-center">
            <div className="w-full flex items-center justify-between mb-4 border-l-4 border-[#ff00ff] pl-4">
              <div className="flex items-center gap-3">
                <Gamepad2 className="w-4 h-4 text-[#ff00ff]" />
                <h2 className="text-[10px] font-pixel text-white">SIMULATION_GATE</h2>
              </div>
              <span className="text-[8px] font-pixel text-[#ff00ff] animate-pulse">LIVE_FEED</span>
            </div>
            
            <SnakeGame 
              onScoreUpdate={setGlobalScore} 
              accentColor="#00ffff"
            />
          </section>

          {/* Audio Section */}
          <aside className="flex flex-col space-y-8">
            <div>
              <div className="flex items-center gap-3 mb-6 border-l-4 border-[#ff00ff] pl-4">
                <Music className="w-4 h-4 text-[#ff00ff]" />
                <h2 className="text-[10px] font-pixel text-white">AUDIO_PROCESSOR</h2>
              </div>

              <MusicPlayer 
                currentTrackIndex={currentTrackIndex}
                onTrackChange={setCurrentTrackIndex}
                isPlaying={isPlaying}
                onPlayPause={setIsPlaying}
              />
            </div>

            {/* Utility Dials */}
            <div className="grid grid-cols-1 gap-4 font-pixel text-[8px]">
              <div className="border-2 border-[#00ffff] p-4 flex justify-between items-center bg-black hover:bg-[#00ffff] hover:text-black transition-colors cursor-pointer">
                <span>RE_CALIBRATE_SYSTEM</span>
                <Settings className="w-3 h-3" />
              </div>
              <div className="border-2 border-slate-900 text-slate-800 p-4 flex justify-between items-center grayscale opacity-50">
                <span>ENCRYPTED_SIGNAL_LOST</span>
                <div className="w-2 h-2 bg-slate-800" />
              </div>
            </div>
          </aside>
        </main>

        {/* Footer */}
        <footer className="mt-12 pt-6 border-t font-pixel text-[8px] flex flex-col md:flex-row justify-between items-center gap-6 border-[#00ffff]/30">
          <div className="flex gap-12 text-[#ff00ff]">
            <span className="hover:text-white cursor-crosshair transition-colors">>> LEADERBOARD</span>
            <span className="hover:text-white cursor-crosshair transition-colors">>> DE_PATCH_v9.0</span>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-[#00ffff] screen-tear" />
              <span>TERMINAL_CONNECTED</span>
            </div>
            <span className="text-white">NODE: ASIA_NORTH_SYNC</span>
          </div>
        </footer>
      </div>
    </div>
  );
}


