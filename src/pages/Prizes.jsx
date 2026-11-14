import React from 'react';
import { Trophy, Sparkles, Shield } from 'lucide-react';

export default function Prizes() {
  return (
    <div className="min-h-screen bg-[#090909] text-white pt-24 pb-20 cyber-grid-bg relative flex items-center justify-center">
      
      {/* Background Red Ambient Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#E50914]/20 rounded-full blur-[160px] pointer-events-none"></div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        
        {/* Main Majestic Cyberpunk Card displaying strictly the required announcement */}
        <div className="relative bg-[#0e0e0e]/95 border-2 border-[#E50914] rounded-2xl p-8 sm:p-16 text-center shadow-neon-red-lg overflow-hidden group">
          
          {/* Cyber Corner Decals */}
          <span className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-[#FF3030]"></span>
          <span className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-[#FF3030]"></span>
          <span className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-[#FF3030]"></span>
          <span className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-[#FF3030]"></span>

          {/* Trophy Motif */}
          <div className="relative w-24 h-24 mx-auto mb-8 flex items-center justify-center">
            <div className="absolute inset-0 bg-[#E50914]/20 rounded-full filter blur-xl animate-pulse"></div>
            <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-tr from-[#180003] to-[#2c0006] border border-[#E50914] flex items-center justify-center shadow-neon-red">
              <Trophy className="w-10 h-10 text-[#FF3030] animate-bounce" />
            </div>
          </div>

          {/* REQUIRED EXACT TEXT ONLY: PRIZES & AWARDS */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-orbitron font-black text-white tracking-wider mb-6">
            PRIZES & AWARDS
          </h1>

          {/* REQUIRED EXACT TEXT ONLY: TO BE ANNOUNCED */}
          <div className="inline-block relative">
            <div className="text-2xl sm:text-4xl md:text-5xl font-orbitron font-extrabold text-[#FF3030] tracking-[0.25em] cyber-glow-red uppercase px-6 py-3 border border-[#E50914]/60 bg-black/80 rounded-xl shadow-[0_0_25px_rgba(229,9,20,0.5)]">
              TO BE ANNOUNCED
            </div>
          </div>

          {/* Subtle Cyber Status Tag */}
          <div className="mt-8 text-xs font-mono text-gray-400 tracking-widest flex items-center justify-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-[#FF3030] animate-ping"></span>
            <span>NERONOVA 2026 // GRAND AWARDS PROTOCOL PENDING REVEAL</span>
          </div>

        </div>

      </div>
    </div>
  );
}
