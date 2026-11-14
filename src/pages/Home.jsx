import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  ChevronRight, 
  Trophy, 
  Cpu, 
  Users, 
  Network, 
  Sparkles, 
  ShieldCheck, 
  ArrowUpRight,
  Zap,
  Activity
} from 'lucide-react';

export default function Home() {
  // Real live countdown to proposed event date (January 27, 2027 09:30:00)
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const targetDate = new Date('2027-01-27T09:30:00+05:30').getTime();

    const updateCountdown = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#090909] text-white pt-20 relative overflow-hidden cyber-grid-bg">
      
      {/* Ambient Red Glow Spheres */}
      <div className="absolute top-1/4 -left-48 w-96 h-96 bg-[#E50914]/15 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute top-1/3 -right-48 w-96 h-96 bg-[#FF3030]/15 rounded-full blur-[140px] pointer-events-none"></div>

      {/* Main Hero Container matching approved reference image layout */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column (Hero Content & Controls) - 7 cols */}
          <div className="lg:col-span-7 space-y-6 z-10">
            
            {/* Giant Glowing Title: NERONOVA 2026 */}
            <div className="space-y-1">
              <h1 className="text-5xl sm:text-6xl md:text-7xl font-orbitron font-black tracking-tight text-white leading-none">
                NERONOVA{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF3030] via-[#E50914] to-[#ff4d4d] cyber-glow-red">
                  2026
                </span>
              </h1>
              {/* Secondary Tagline */}
              <p className="font-orbitron font-bold text-lg sm:text-xl md:text-2xl tracking-[0.22em] text-[#FF3030] uppercase">
                INNOVATE. CODE. TRANSFORM.
              </p>
            </div>

            {/* Event Key Coordinates Row (Date, Time, Location) */}
            <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-gray-300 font-mono pt-1">
              <div className="flex items-center space-x-2 bg-black/60 border border-white/10 px-3 py-2 rounded">
                <Calendar className="w-4 h-4 text-[#FF3030]" />
                <span>27–28 January 2027 (Tentative)</span>
              </div>
              <div className="flex items-center space-x-2 bg-black/60 border border-white/10 px-3 py-2 rounded">
                <Clock className="w-4 h-4 text-[#FF3030]" />
                <span>9:30 AM – 4:30 PM (Offline Mode)</span>
              </div>
              <div className="flex items-center space-x-2 bg-black/60 border border-white/10 px-3 py-2 rounded">
                <MapPin className="w-4 h-4 text-[#FF3030]" />
                <span>HICET, Coimbatore, Tamil Nadu</span>
              </div>
            </div>

            {/* Countdown Timer Boxes matching approved reference HUD style */}
            <div className="pt-2">
              <div className="grid grid-cols-4 gap-3 max-w-lg">
                {[
                  { label: 'Days', val: timeLeft.days },
                  { label: 'Hours', val: timeLeft.hours },
                  { label: 'Minutes', val: timeLeft.minutes },
                  { label: 'Seconds', val: timeLeft.seconds }
                ].map((item, idx) => (
                  <div 
                    key={idx}
                    className="relative bg-gradient-to-b from-[#180507] to-[#0a0203] border border-[#E50914]/50 rounded-lg p-3 text-center shadow-[0_0_15px_rgba(229,9,20,0.25)] hover:border-[#FF3030] transition-colors"
                  >
                    {/* Corner accent tick marks */}
                    <span className="absolute top-1 left-1 w-1.5 h-1.5 border-t border-l border-[#FF3030]"></span>
                    <span className="absolute bottom-1 right-1 w-1.5 h-1.5 border-b border-r border-[#FF3030]"></span>
                    
                    <div className="font-orbitron font-extrabold text-2xl sm:text-3xl md:text-4xl text-white tracking-wider">
                      {String(item.val).padStart(2, '0')}
                    </div>
                    <div className="text-[10px] sm:text-xs font-mono uppercase text-gray-400 tracking-wider mt-0.5">
                      {item.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Big Cyberpunk Register Button & Event Metrics */}
            <div className="space-y-4 pt-3">
              <div className="flex flex-wrap items-center gap-4">
                <Link
                  to="/register"
                  className="relative group inline-flex items-center justify-center px-10 py-4 font-orbitron font-bold text-base md:text-lg uppercase tracking-wider text-white bg-gradient-to-r from-[#E50914] via-[#FF3030] to-[#E50914] cyber-chamfer-btn shadow-neon-red-lg hover:shadow-[0_0_40px_rgba(255,48,48,0.9)] transform hover:-translate-y-1 active:translate-y-0 transition-all duration-300"
                >
                  <Zap className="w-5 h-5 mr-2 text-white fill-white animate-pulse" />
                  <span>REGISTER NOW</span>
                  <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1.5 transition-transform" />
                </Link>

                <Link
                  to="/domains"
                  className="inline-flex items-center px-6 py-4 border border-white/20 hover:border-[#E50914] bg-black/60 rounded text-sm font-orbitron font-semibold uppercase tracking-wider text-gray-300 hover:text-white transition-all"
                >
                  Explore 9 Domains <ArrowUpRight className="w-4 h-4 ml-1.5 text-[#FF3030]" />
                </Link>
              </div>

              {/* Event Highlights: 250+ Participants | 2–4 Members / Team */}
              <div className="flex items-center space-x-6 text-xs sm:text-sm text-gray-400 font-mono pt-1">
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-[#FF3030]" />
                  <span className="text-white font-medium">250+ Participants</span>
                </div>
                <span className="text-gray-700">|</span>
                <div className="flex items-center space-x-2">
                  <ShieldCheck className="w-4 h-4 text-[#FF3030]" />
                  <span className="text-white font-medium">2–4 Members / Team</span>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Approved Futuristic Robot & Cyber City Visual */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            {/* Visual Frame Container */}
            <div className="relative w-full max-w-lg lg:max-w-none">
              
              {/* Backlight circular glow */}
              <div className="absolute inset-0 bg-gradient-to-tr from-[#E50914]/30 via-[#FF3030]/20 to-transparent rounded-2xl filter blur-3xl transform -rotate-3 scale-95 pointer-events-none"></div>

              {/* Robot & City High-Resolution Rendered Asset */}
              <div className="relative rounded-2xl overflow-hidden border border-[#E50914]/40 bg-gradient-to-b from-[#120002] to-[#090909] shadow-[0_0_35px_rgba(229,9,20,0.35)] group">
                <img 
                  src="/robot-cyber-clean.png" 
                  alt="NERONOVA 2026 Cyberpunk Robot Sentinel & Futuristic City"
                  className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-700" 
                />

                {/* Cyberpunk HUD Overlay graphics */}
                <div className="absolute top-3 left-3 flex items-center space-x-2 bg-black/75 border border-[#E50914]/60 px-2.5 py-1 rounded text-[10px] font-mono text-[#FF3030] backdrop-blur-md">
                  <span className="w-2 h-2 rounded-full bg-[#FF3030] animate-ping"></span>
                  <span>AI CORE ONLINE</span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3 BOTTOM FEATURE CARDS DIRECTLY FROM APPROVED REFERENCE DASHBOARD LAYOUT */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 border-t border-[#E50914]/20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* CARD 1: EVENT HIGHLIGHTS */}
          <div className="bg-[#0e0e0e]/90 border border-[#E50914]/40 rounded-xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.7)] hover:border-[#FF3030] transition-all duration-300">
            <div className="flex items-center space-x-2 text-[#FF3030] font-orbitron font-bold text-sm tracking-wider uppercase mb-4 border-l-4 border-[#E50914] pl-2.5">
              <span>// EVENT HIGHLIGHTS</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-[#141414] border border-white/5 rounded-lg p-3 text-center hover:border-[#E50914]/50 transition-colors">
                <Trophy className="w-6 h-6 text-[#FF3030] mx-auto mb-1.5" />
                <span className="text-xs font-semibold text-gray-200 block">Exciting Prizes</span>
                <span className="text-[10px] text-gray-500 font-mono">TBA & Certificates</span>
              </div>

              <div className="bg-[#141414] border border-white/5 rounded-lg p-3 text-center hover:border-[#E50914]/50 transition-colors">
                <Cpu className="w-6 h-6 text-[#FF3030] mx-auto mb-1.5" />
                <span className="text-xs font-semibold text-gray-200 block">Innovative Problems</span>
                <span className="text-[10px] text-gray-500 font-mono">9 AI Domains</span>
              </div>

              <div className="bg-[#141414] border border-white/5 rounded-lg p-3 text-center hover:border-[#E50914]/50 transition-colors">
                <Users className="w-6 h-6 text-[#FF3030] mx-auto mb-1.5" />
                <span className="text-xs font-semibold text-gray-200 block">Expert Mentorship</span>
                <span className="text-[10px] text-gray-500 font-mono">Industry Leaders</span>
              </div>

              <div className="bg-[#141414] border border-white/5 rounded-lg p-3 text-center hover:border-[#E50914]/50 transition-colors">
                <Network className="w-6 h-6 text-[#FF3030] mx-auto mb-1.5" />
                <span className="text-xs font-semibold text-gray-200 block">Networking</span>
                <span className="text-[10px] text-gray-500 font-mono">Top Tech Peers</span>
              </div>
            </div>
          </div>

          {/* CARD 2: ABOUT THE HACKATHON */}
          <div className="bg-[#0e0e0e]/90 border border-[#E50914]/40 rounded-xl p-5 flex flex-col justify-between shadow-[0_4px_20px_rgba(0,0,0,0.7)] hover:border-[#FF3030] transition-all duration-300">
            <div>
              <div className="flex items-center space-x-2 text-[#FF3030] font-orbitron font-bold text-sm tracking-wider uppercase mb-3 border-l-4 border-[#E50914] pl-2.5">
                <span>// ABOUT THE HACKATHON</span>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed mb-4">
                NERONOVA 2026 is a platform for brilliant minds to innovate, collaborate, and build real-world solutions using AI, Machine Learning, and emerging technologies.
              </p>
            </div>

            <Link
              to="/about"
              className="inline-flex items-center justify-between px-4 py-2 bg-gradient-to-r from-[#E50914]/20 to-[#FF3030]/10 border border-[#E50914] rounded text-xs font-orbitron font-bold text-white hover:bg-[#E50914] hover:shadow-neon-red transition-all group"
            >
              <span>Know More</span>
              <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* CARD 3: EVENT SCHEDULE */}
          <div className="bg-[#0e0e0e]/90 border border-[#E50914]/40 rounded-xl p-5 flex flex-col justify-between shadow-[0_4px_20px_rgba(0,0,0,0.7)] hover:border-[#FF3030] transition-all duration-300">
            <div>
              <div className="flex items-center space-x-2 text-[#FF3030] font-orbitron font-bold text-sm tracking-wider uppercase mb-4 border-l-4 border-[#E50914] pl-2.5">
                <span>// EVENT SCHEDULE</span>
              </div>

              {/* Timeline dots matching reference */}
              <div className="space-y-3 font-mono text-xs">
                <div className="flex items-start space-x-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#FF3030] mt-1 shrink-0 shadow-[0_0_8px_#FF3030]"></div>
                  <div>
                    <div className="text-white font-bold font-orbitron text-xs">Day 1 – 27 Jan 2027</div>
                    <div className="text-gray-400">Hackathon Begins & Ideation Decrypt</div>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#00d2ff] mt-1 shrink-0 shadow-evileye"></div>
                  <div>
                    <div className="text-white font-bold font-orbitron text-xs">Day 2 – 28 Jan 2027</div>
                    <div className="text-gray-400">Final Submissions, Pitches & Showcase</div>
                  </div>
                </div>
              </div>
            </div>

            <Link
              to="/schedule"
              className="mt-4 inline-flex items-center justify-between px-4 py-2 bg-[#141414] hover:bg-white/5 border border-white/10 rounded text-xs font-orbitron font-semibold text-gray-300 hover:text-white transition-all group"
            >
              <span>View Full Timeline</span>
              <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

        </div>
      </section>

    </div>
  );
}

