import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  Target, 
  Compass, 
  Award, 
  MapPin, 
  Users, 
  Calendar, 
  ChevronRight, 
  Cpu, 
  Building2,
  CheckCircle2
} from 'lucide-react';

export default function About() {
  return (
    <div className="min-h-screen bg-[#090909] text-white pt-24 pb-20 cyber-grid-bg relative">
      
      {/* Background Red Ambient Glow */}
      <div className="absolute top-20 right-0 w-96 h-96 bg-[#E50914]/15 rounded-full blur-[160px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Breadcrumb & Title */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center space-x-2 border border-[#E50914]/40 bg-[#090909]/80 px-4 py-1.5 rounded-full text-xs font-mono tracking-widest text-[#FF3030]">
            <span>// ARCHITECTURE & MISSION</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-orbitron font-extrabold tracking-tight">
            ABOUT <span className="text-[#FF3030] cyber-glow-red">NERONOVA 2026</span>
          </h1>
          <p className="text-gray-300 text-base sm:text-lg leading-relaxed">
            NERONOVA 2026 is a premier national-level offline hackathon engineering high-impact artificial intelligence, machine learning, and autonomous system breakthroughs for real-world industry transformation.
          </p>
        </div>

        {/* Vision & Objectives Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-[#0e0e0e] border border-[#E50914]/30 rounded-xl p-6 shadow-cyber-card hover:border-[#FF3030] transition-all">
            <div className="w-12 h-12 bg-[#E50914]/20 border border-[#E50914] rounded-lg flex items-center justify-center mb-5 text-[#FF3030]">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="font-orbitron font-bold text-lg mb-2 text-white">Our Vision</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              To cultivate an elite nexus of student technologists, engineers, and problem solvers capable of building production-ready autonomous AI systems that tackle pressing global socio-economic challenges.
            </p>
          </div>

          <div className="bg-[#0e0e0e] border border-[#E50914]/30 rounded-xl p-6 shadow-cyber-card hover:border-[#FF3030] transition-all">
            <div className="w-12 h-12 bg-[#E50914]/20 border border-[#E50914] rounded-lg flex items-center justify-center mb-5 text-[#FF3030]">
              <Compass className="w-6 h-6" />
            </div>
            <h3 className="font-orbitron font-bold text-lg mb-2 text-white">Our Mission</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Bridge the frontier between theoretical artificial intelligence and practical execution by providing participants with intensive mentorship, industry-grade challenges, and direct validation.
            </p>
          </div>

          <div className="bg-[#0e0e0e] border border-[#E50914]/30 rounded-xl p-6 shadow-cyber-card hover:border-[#FF3030] transition-all">
            <div className="w-12 h-12 bg-[#E50914]/20 border border-[#E50914] rounded-lg flex items-center justify-center mb-5 text-[#FF3030]">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="font-orbitron font-bold text-lg mb-2 text-white">Innovation Benchmarks</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Every project undergoes evaluation on four core pillars: Algorithmic Rigor, Engineering Completeness, User Usability, and Real-world Viability in offline production environments.
            </p>
          </div>
        </div>

        {/* Host Institution & Event Coordinates */}
        <div className="bg-[#0e0e0e] border border-[#E50914]/40 rounded-2xl p-8 mb-16 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#FF3030]/10 rounded-full blur-[100px] pointer-events-none"></div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-[#FF3030] font-orbitron text-xs font-bold tracking-widest uppercase">
                <Building2 className="w-4 h-4" />
                <span>Host Institution & Venue</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-orbitron font-bold text-white">
                Hindusthan College of Engineering and Technology
              </h2>
              <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                Hindusthan College of Engineering and Technology (HICET), an autonomous premier institution situated in the vibrant technological corridor of Coimbatore, Tamil Nadu, is renowned for academic excellence, cutting-edge innovation labs, and strong industry collaborations.
              </p>
              
              <div className="space-y-2 pt-2 text-sm text-gray-300 font-mono">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-[#FF3030]" />
                  <span>Kalaam Auditorium, HICET Campus, Coimbatore, Tamil Nadu – 641032</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-[#FF3030]" />
                  <span>Proposed Dates: Last week of January 2027 (Exact dates to be confirmed)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-[#FF3030]" />
                  <span>Team Size: 2 to 4 Members per team • Mode: 100% Offline</span>
                </div>
              </div>
            </div>

            <div className="bg-[#141414] border border-white/10 rounded-xl p-6 space-y-4">
              <h4 className="font-orbitron font-semibold text-white text-base border-b border-white/10 pb-3 flex items-center justify-between">
                <span>Event Operational Pillars</span>
                <span className="text-xs text-[#FF3030] font-mono">NERO-SYS</span>
              </h4>

              <div className="space-y-3">
                {[
                  { title: 'Offline 36-Hour Hackathon Format', desc: 'On-campus high-energy sprint with uninterrupted connectivity and compute zones.' },
                  { title: 'Continuous Technical Mentorship', desc: 'Domain veterans and senior AI architects available for 1-on-1 code reviews and architectural guidance.' },
                  { title: 'Equal Opportunity Tracks', desc: 'Separate recognition and fair evaluation tracks for Inter-College and Intra-College contingents.' },
                  { title: 'Strict Intellectual Property Protection', desc: 'Participating teams retain 100% ownership and copyright of their intellectual property.' }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start space-x-3 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-[#FF3030] shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white block font-medium">{item.title}</strong>
                      <span className="text-gray-400 text-xs">{item.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* CTA to Register or Explore Domains */}
        <div className="text-center bg-gradient-to-r from-[#180003] via-[#090909] to-[#180003] border border-[#E50914]/40 rounded-2xl p-10 shadow-neon-red">
          <h2 className="text-2xl sm:text-3xl font-orbitron font-bold text-white mb-4">
            READY TO REDEFINE THE FUTURE?
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto mb-8 text-sm sm:text-base">
            Gather your team of 2 to 4 innovators and register your project under any of our 9 specialized AI domains.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/register"
              className="px-8 py-3.5 bg-gradient-to-r from-[#E50914] to-[#FF3030] text-white font-orbitron font-bold text-sm uppercase rounded cyber-chamfer-btn shadow-neon-red hover:shadow-neon-red-lg transition-all"
            >
              Register Team Now
            </Link>
            <Link
              to="/domains"
              className="px-8 py-3.5 bg-[#141414] hover:bg-white/10 border border-white/20 text-white font-orbitron font-semibold text-sm uppercase rounded transition-all"
            >
              Explore 9 Domains
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
