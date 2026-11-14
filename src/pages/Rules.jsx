import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FileCheck, 
  Users, 
  AlertTriangle, 
  ShieldCheck, 
  Laptop, 
  Award, 
  CheckCircle2, 
  XCircle,
  HelpCircle,
  ChevronRight
} from 'lucide-react';

export default function Rules() {
  const ruleCategories = [
    {
      category: '1. Eligibility & Team Composition',
      icon: Users,
      items: [
        'Open to all currently enrolled undergraduate and postgraduate students from recognized colleges and universities across India.',
        'Each team must consist of strictly 2 to 4 members.',
        'Both Inter-College and Intra-College team formations are welcomed and evaluated in their respective tracks.',
        'Inter-disciplinary and cross-departmental teams (e.g. AI/DS + CSE + ECE + Mechanical) are encouraged.',
        'A participant cannot be a registered member of more than one team.'
      ]
    },
    {
      category: '2. Code Originality & Development',
      icon: Laptop,
      items: [
        'All development must take place during the official hackathon hours at the venue.',
        'Pre-existing full projects are strictly prohibited. Teams found submitting pre-built repositories will be disqualified.',
        'Use of open-source frameworks (e.g., PyTorch, TensorFlow, React), libraries, pre-trained base models, and public APIs is fully permitted with proper citation.',
        'Teams must maintain an active Git repository with regular commits during the hackathon sprint.'
      ]
    },
    {
      category: '3. Hardware & Venue Guidelines',
      icon: ShieldCheck,
      items: [
        'NERONOVA 2026 is an offline hackathon hosted at HICET, Coimbatore, Tamil Nadu.',
        'Participants must bring their own laptops, chargers, and any specialized hardware (e.g. Arduino, ESP32, Raspberry Pi, camera sensors) required for their project.',
        'High-speed network connectivity, dedicated power outlets, resting zones, and refreshments will be provided throughout the hackathon.',
        'Participants must wear their official ID badges at all times inside the campus premises.'
      ]
    },
    {
      category: '4. Evaluation & Final Submission',
      icon: Award,
      items: [
        'Teams must participate in two mandatory mentoring/checkpoint rounds with designated jury panels.',
        'Final submission deliverables include: (1) GitHub repository with documented README, (2) Live working prototype demonstration, and (3) a 5-minute presentation deck followed by Q&A.',
        'Judging parameters: Algorithmic & Architectural Innovation (30%), Practical Implementation & Working Prototype (30%), Real-world Impact & Domain Relevance (25%), and Pitch Presentation (15%).',
        'The decision of the jury panel is final and binding.'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-[#090909] text-white pt-24 pb-20 cyber-grid-bg relative">
      
      {/* Red Glow */}
      <div className="absolute top-28 left-10 w-96 h-96 bg-[#E50914]/15 rounded-full blur-[160px] pointer-events-none"></div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-4">
          <div className="inline-flex items-center space-x-2 border border-[#E50914]/40 bg-[#090909]/80 px-4 py-1.5 rounded-full text-xs font-mono tracking-widest text-[#FF3030]">
            <span>// PROTOCOLS & GOVERNANCE</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-orbitron font-extrabold tracking-tight">
            RULES & <span className="text-[#FF3030] cyber-glow-red">GUIDELINES</span>
          </h1>
          <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
            All participating teams must comply with the NERONOVA 2026 standard competition code to ensure a fair, rigorous, and collaborative environment.
          </p>
        </div>

        {/* Dos and Don'ts Quick Bar */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div className="bg-[#0e0e0e] border border-green-500/30 rounded-xl p-6 shadow-cyber-card">
            <div className="flex items-center space-x-2 text-green-400 font-orbitron font-bold text-sm uppercase mb-4">
              <CheckCircle2 className="w-5 h-5" />
              <span>Mandatory Dos</span>
            </div>
            <ul className="space-y-2.5 text-xs sm:text-sm text-gray-300">
              <li className="flex items-start space-x-2">
                <span className="text-green-400 font-bold">•</span>
                <span>Carry valid college identity cards and registration confirmation voucher.</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-green-400 font-bold">•</span>
                <span>Commit code regularly to your team's designated GitHub repository.</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-green-400 font-bold">•</span>
                <span>Attend both mandatory mentoring checkpoint sessions on Day 1 & Day 2.</span>
              </li>
            </ul>
          </div>

          <div className="bg-[#0e0e0e] border border-[#E50914]/40 rounded-xl p-6 shadow-cyber-card">
            <div className="flex items-center space-x-2 text-[#FF3030] font-orbitron font-bold text-sm uppercase mb-4">
              <XCircle className="w-5 h-5" />
              <span>Strict Don'ts</span>
            </div>
            <ul className="space-y-2.5 text-xs sm:text-sm text-gray-300">
              <li className="flex items-start space-x-2">
                <span className="text-[#FF3030] font-bold">•</span>
                <span>No pre-built codebase or plagiarism of existing open-source hackathon entries.</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-[#FF3030] font-bold">•</span>
                <span>No malicious exploitation of campus networks or peer equipment.</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-[#FF3030] font-bold">•</span>
                <span>No switching of team members after registration verification without approval.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Detailed Rule Sections */}
        <div className="space-y-8 mb-16">
          {ruleCategories.map((sec, idx) => {
            const Icon = sec.icon;
            return (
              <div 
                key={idx}
                className="bg-[#0e0e0e] border border-[#E50914]/30 rounded-xl p-6 sm:p-8 shadow-cyber-card hover:border-[#FF3030] transition-colors"
              >
                <div className="flex items-center space-x-3 mb-6 border-b border-white/10 pb-4">
                  <div className="w-10 h-10 rounded-lg bg-[#E50914]/20 border border-[#E50914] text-[#FF3030] flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-orbitron font-bold text-lg sm:text-xl text-white">
                    {sec.category}
                  </h3>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  {sec.items.map((item, itemIdx) => (
                    <div key={itemIdx} className="flex items-start space-x-3 text-xs sm:text-sm text-gray-300 bg-[#141414] p-3.5 rounded-lg border border-white/5">
                      <span className="text-[#FF3030] font-mono font-bold mt-0.5">[{idx + 1}.{itemIdx + 1}]</span>
                      <span className="leading-relaxed">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Help Banner */}
        <div className="bg-[#140003] border border-[#E50914]/40 rounded-xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <HelpCircle className="w-8 h-8 text-[#FF3030] shrink-0" />
            <div>
              <h4 className="font-orbitron font-bold text-white text-base">Have specific rule clarifications?</h4>
              <p className="text-gray-400 text-xs">Reach out to the organizing team through our contact desk or read our FAQ.</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Link to="/faq" className="px-4 py-2 bg-black/60 border border-white/20 hover:border-white/40 rounded text-xs font-orbitron font-semibold text-white">
              Read FAQs
            </Link>
            <Link to="/register" className="px-5 py-2 bg-[#E50914] hover:bg-[#FF3030] text-white rounded text-xs font-orbitron font-bold uppercase shadow-neon-red flex items-center">
              Register <ChevronRight className="w-3.5 h-3.5 ml-1" />
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
