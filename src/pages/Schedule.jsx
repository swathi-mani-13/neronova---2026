import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  CheckCircle, 
  Zap, 
  Coffee, 
  Code, 
  Award, 
  Users, 
  ChevronRight,
  Flag
} from 'lucide-react';

export default function Schedule() {
  const [activeDay, setActiveDay] = useState('day1');

  const day1Schedule = [
    { time: '08:30 AM – 09:30 AM', title: 'On-Campus Registration & Kit Distribution', desc: 'Badge collection, table allocation, Wi-Fi onboarding, and system environment verification.', icon: Users },
    { time: '09:30 AM – 10:30 AM', title: 'Grand Inauguration Ceremony', desc: 'Opening keynote from AI industry leaders, address by faculty coordinators, and problem statement briefing.', icon: Flag },
    { time: '10:30 AM Sharp', title: 'Hackathon Commences (Clock Starts)', desc: 'Official hacking begins across all 9 domains. Architecture planning, repository setup, and data ingestion.', icon: Zap, highlight: true },
    { time: '01:00 PM – 02:00 PM', title: 'Networking Lunch', desc: 'Catered lunch at campus dining hall. Informal peer interaction and domain exploration.', icon: Coffee },
    { time: '03:30 PM – 05:30 PM', title: 'Mentorship Checkpoint 1 (Architecture Review)', desc: 'Senior industry mentors visit every team table to evaluate system design, model feasibility, and edge constraints.', icon: Code },
    { time: '07:30 PM – 08:30 PM', title: 'Dinner & Recharge', desc: 'High-energy dinner, technical booths, and mentor lightning talks.', icon: Coffee },
    { time: '11:30 PM – 01:00 AM', title: 'Midnight Review & Code Sprint', desc: 'Midnight progress check, snack bar, and rapid overnight prototyping run.', icon: Zap }
  ];

  const day2Schedule = [
    { time: '07:30 AM – 08:30 AM', title: 'Breakfast & Morning Standup', desc: 'Fresh South Indian breakfast and morning sync to align final deployment deliverables.', icon: Coffee },
    { time: '09:30 AM – 11:30 AM', title: 'Mentorship Checkpoint 2 (Demo Readiness)', desc: 'Technical jury tests working prototypes, UI responsiveness, edge inference speed, and failure handling.', icon: Code },
    { time: '01:00 PM – 02:00 PM', title: 'Networking Lunch', desc: 'Final break before afternoon evaluation and pitching rounds.', icon: Coffee },
    { time: '02:30 PM Sharp', title: 'Code Freeze & Repository Lock', desc: 'All GitHub commits, documentation decks, and video demo submissions locked permanently.', icon: Zap, highlight: true },
    { time: '03:00 PM – 04:30 PM', title: 'Grand Pitching & Live Jury Demonstrations', desc: 'Shortlisted teams present on the main auditorium stage: 5-minute live demo + 3-minute jury Q&A.', icon: Award },
    { time: '04:30 PM – 05:30 PM', title: 'Valedictory & Awards Ceremony', desc: 'Keynote summary, jury remarks, domain winners announcement, and certificate distribution.', icon: Flag, highlight: true }
  ];

  const currentSchedule = activeDay === 'day1' ? day1Schedule : day2Schedule;

  return (
    <div className="min-h-screen bg-[#090909] text-white pt-24 pb-20 cyber-grid-bg relative">
      
      {/* Background Red Glow */}
      <div className="absolute top-20 right-10 w-96 h-96 bg-[#E50914]/15 rounded-full blur-[160px] pointer-events-none"></div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
          <div className="inline-flex items-center space-x-2 border border-[#E50914]/40 bg-[#090909]/80 px-4 py-1.5 rounded-full text-xs font-mono tracking-widest text-[#FF3030]">
            <span>// 36-HOUR TIMELINE</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-orbitron font-extrabold tracking-tight">
            EVENT <span className="text-[#FF3030] cyber-glow-red">SCHEDULE</span>
          </h1>
          <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
            Proposed dates: Last week of January 2027 (27 – 28 January 2027, exact dates to be confirmed). High-intensity offline hackathon at Kalaam Auditorium.
          </p>
        </div>

        {/* Day Switcher Tabs */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex p-1.5 bg-[#0e0e0e] border border-[#E50914]/40 rounded-xl">
            <button
              onClick={() => setActiveDay('day1')}
              className={`px-8 py-3 rounded-lg font-orbitron font-bold text-sm tracking-wider uppercase transition-all duration-300 flex items-center space-x-2 ${
                activeDay === 'day1'
                  ? 'bg-gradient-to-r from-[#E50914] to-[#FF3030] text-white shadow-neon-red'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>Day 1 – 27 Jan 2027</span>
            </button>

            <button
              onClick={() => setActiveDay('day2')}
              className={`px-8 py-3 rounded-lg font-orbitron font-bold text-sm tracking-wider uppercase transition-all duration-300 flex items-center space-x-2 ${
                activeDay === 'day2'
                  ? 'bg-gradient-to-r from-[#E50914] to-[#FF3030] text-white shadow-neon-red'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>Day 2 – 28 Jan 2027</span>
            </button>
          </div>
        </div>

        {/* Timeline Cards Container */}
        <div className="relative border-l-2 border-[#E50914]/40 ml-4 md:ml-32 space-y-8 pb-10">
          {currentSchedule.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="relative pl-6 md:pl-10 group">
                
                {/* Timeline node */}
                <div className={`absolute -left-[9px] top-1.5 w-4 h-4 rounded-full border-2 ${
                  item.highlight
                    ? 'bg-[#FF3030] border-white shadow-[0_0_12px_#FF3030]'
                    : 'bg-[#090909] border-[#E50914] group-hover:bg-[#E50914]'
                } transition-colors`}></div>

                {/* Left Floating Time Badge on Desktop */}
                <div className="md:absolute md:-left-36 md:top-1 text-xs font-mono font-bold text-[#FF3030] tracking-wider mb-1 md:mb-0 md:text-right md:w-28">
                  {item.time.split(' – ')[0]}
                </div>

                {/* Card */}
                <div className={`bg-[#0e0e0e] border ${
                  item.highlight ? 'border-[#FF3030] shadow-neon-red' : 'border-[#E50914]/30'
                } rounded-xl p-5 hover:border-[#FF3030] transition-all`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono text-gray-400 flex items-center space-x-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#FF3030]" />
                      <span>{item.time}</span>
                    </span>
                    {item.highlight && (
                      <span className="bg-[#E50914]/20 border border-[#E50914] text-[#FF3030] font-orbitron text-[10px] px-2 py-0.5 rounded tracking-widest uppercase">
                        CRITICAL MILESTONE
                      </span>
                    )}
                  </div>

                  <h3 className="font-orbitron font-bold text-base sm:text-lg text-white mb-1.5 group-hover:text-[#FF3030] transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
                    {item.desc}
                  </p>
                </div>

              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center pt-6">
          <Link
            to="/register"
            className="inline-flex items-center px-8 py-3.5 bg-gradient-to-r from-[#E50914] to-[#FF3030] text-white font-orbitron font-bold text-sm uppercase rounded cyber-chamfer-btn shadow-neon-red hover:shadow-neon-red-lg transition-all"
          >
            <span>Lock Your Team Registration</span>
            <ChevronRight className="w-4 h-4 ml-1.5" />
          </Link>
        </div>

      </div>
    </div>
  );
}
