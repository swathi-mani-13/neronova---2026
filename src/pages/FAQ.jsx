import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, HelpCircle, ChevronRight } from 'lucide-react';

export default function FAQ() {
  const [openIdx, setOpenIdx] = useState(0);

  const faqs = [
    {
      q: 'What is the eligibility criteria to participate in NERONOVA 2026?',
      a: 'NERONOVA 2026 is open to all currently enrolled undergraduate and postgraduate students pursuing Engineering, Technology, Computer Science, and allied science degrees across India. All members must hold a valid college student ID card.'
    },
    {
      q: 'What is the permitted team size?',
      a: 'Teams must consist of 2 to 4 members. Individual participation is not permitted to encourage collaborative engineering and multidisciplinary problem-solving.'
    },
    {
      q: 'Can members from different colleges or departments form a team?',
      a: 'Yes, absolutely! Both Inter-College and Intra-College teams are welcome. You can form cross-departmental teams (e.g. AI & Data Science + Electronics + Mechanical).'
    },
    {
      q: 'Is NERONOVA 2026 an online or offline event?',
      a: 'NERONOVA 2026 is strictly an offline hackathon hosted on campus at HICET, Coimbatore, Tamil Nadu.'
    },
    {
      q: 'When will the hackathon take place?',
      a: 'NERONOVA 2026 will take place on 27–28 January 2027.'
    },
    {
      q: 'How does team registration work?',
      a: 'The team leader submits the team registration form online on this portal, entering the team name, inter/intra category, selected domain, leader contact details, and member details (2 to 4 members). Upon validation, a unique Registration ID (e.g. NERO-2026-XXXX) is generated.'
    },
    {
      q: 'Can we switch our selected domain after submitting registration?',
      a: 'You can change your selected domain during the on-campus desk verification before Hackathon Kickoff on Day 1 by notifying the organizing committee.'
    },
    {
      q: 'What facilities are provided at the venue?',
      a: 'The venue provides high-speed campus Wi-Fi, dedicated power extensions at each team workstation, cafeteria meals (lunch, dinner, midnight snacks, breakfast), and designated relaxation zones.'
    },
    {
      q: 'What should we bring with us to the hackathon?',
      a: 'Bring your laptops, chargers, extension cords (recommended), valid college ID cards, and any project-specific development hardware (e.g., ESP32, Arduino, Raspberry Pi, camera modules).'
    },
    {
      q: 'Do teams retain intellectual property rights to their projects?',
      a: 'Yes. All intellectual property developed by participants during NERONOVA 2026 remains 100% the property of the respective teams.'
    }
  ];

  return (
    <div className="min-h-screen bg-[#090909] text-white pt-24 pb-20 cyber-grid-bg relative">
      
      {/* Background Red Glow */}
      <div className="absolute top-28 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#E50914]/15 rounded-full blur-[160px] pointer-events-none"></div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-4">
          <div className="inline-flex items-center space-x-2 border border-[#E50914]/40 bg-[#090909]/80 px-4 py-1.5 rounded-full text-xs font-mono tracking-widest text-[#FF3030]">
            <span>// FREQUENTLY ASKED QUESTIONS</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-orbitron font-extrabold tracking-tight">
            QUESTIONS & <span className="text-[#FF3030] cyber-glow-red">ANSWERS</span>
          </h1>
          <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
            Everything you need to know about team participation, rules, logistics, and evaluation for NERONOVA 2026.
          </p>
        </div>

        {/* Accordion list */}
        <div className="space-y-4 mb-16">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className="bg-[#0e0e0e] border border-[#E50914]/30 rounded-xl overflow-hidden transition-all duration-200"
              >
                <button
                  onClick={() => setOpenIdx(isOpen ? -1 : idx)}
                  className="w-full text-left px-6 py-4.5 flex items-center justify-between text-white font-orbitron font-semibold text-sm sm:text-base hover:text-[#FF3030] transition-colors focus:outline-none"
                >
                  <span className="flex items-center space-x-3 pr-4">
                    <span className="text-[#FF3030] font-mono text-xs">Q{String(idx + 1).padStart(2, '0')}.</span>
                    <span>{faq.q}</span>
                  </span>
                  <ChevronDown className={`w-5 h-5 text-[#FF3030] shrink-0 transition-transform duration-300 ${
                    isOpen ? 'rotate-180' : ''
                  }`} />
                </button>

                {isOpen && (
                  <div className="px-6 pb-5 pt-1 text-xs sm:text-sm text-gray-300 leading-relaxed border-t border-white/5 animate-fadeIn">
                    <div className="bg-[#141414] p-4 rounded-lg border-l-2 border-[#E50914]">
                      {faq.a}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Still have questions banner */}
        <div className="bg-[#140003] border border-[#E50914]/50 rounded-2xl p-8 text-center shadow-neon-red">
          <h3 className="font-orbitron font-bold text-xl text-white mb-2">
            Still have questions or special requirements?
          </h3>
          <p className="text-gray-400 text-sm max-w-xl mx-auto mb-6">
            Our student organizing leads and faculty coordinators are ready to assist you anytime.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/contact"
              className="px-6 py-2.5 bg-[#E50914] hover:bg-[#FF3030] text-white font-orbitron font-bold text-xs uppercase rounded cyber-chamfer-btn shadow-neon-red transition-all"
            >
              Contact Support Desk
            </Link>
            <Link
              to="/register"
              className="px-6 py-2.5 bg-[#141414] hover:bg-white/10 border border-white/20 text-white font-orbitron font-semibold text-xs uppercase rounded transition-all"
            >
              Proceed to Registration
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
