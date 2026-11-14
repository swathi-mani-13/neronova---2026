import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { 
  Users, 
  UserPlus, 
  Trash2, 
  CheckCircle, 
  AlertCircle, 
  Zap, 
  ShieldCheck, 
  Copy, 
  Printer, 
  Sparkles,
  ArrowRight,
  Info
} from 'lucide-react';
import { DOMAIN_LIST } from './Domains';
import { registerTeam, checkDuplicates } from '../lib/supabase';

const EMPTY_MEMBER = {
  name: '',
  email: '',
  phone: '',
  college: '',
  department: '',
  year_of_study: '3rd Year'
};

const YEAR_OPTIONS = [
  '1st Year',
  '2nd Year',
  '3rd Year',
  'Final Year',
  'Postgraduate (1st Year)',
  'Postgraduate (2nd Year)'
];

export default function Register() {
  const [searchParams] = useSearchParams();

  // Form State
  const [teamName, setTeamName] = useState('');
  const [collegeType, setCollegeType] = useState('Inter College');
  const [selectedDomain, setSelectedDomain] = useState(
    searchParams.get('domain') || DOMAIN_LIST[0].name
  );
  const [projectTitle, setProjectTitle] = useState('');
  const [projectDescription, setProjectDescription] = useState('');

  // Team Leader State (Member 1)
  const [leader, setLeader] = useState({ ...EMPTY_MEMBER });

  // Additional Team Members (1 to 3 additional members, making 2 to 4 members total)
  const [members, setMembers] = useState([
    { ...EMPTY_MEMBER } // Member 2
  ]);

  // UI / Status State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [confirmedTeam, setConfirmedTeam] = useState(null);
  const [copied, setCopied] = useState(false);

  // Update domain if query parameter changes
  useEffect(() => {
    const qDomain = searchParams.get('domain');
    if (qDomain) {
      const match = DOMAIN_LIST.find(d => d.name.toLowerCase() === qDomain.toLowerCase());
      if (match) setSelectedDomain(match.name);
    }
  }, [searchParams]);

  // Add Member (Max 4 total = 1 leader + 3 members)
  const handleAddMember = () => {
    if (members.length < 3) {
      setMembers([...members, { ...EMPTY_MEMBER }]);
    }
  };

  // Remove Member (Min 2 total = 1 leader + 1 member)
  const handleRemoveMember = (index) => {
    if (members.length > 1) {
      const updated = members.filter((_, idx) => idx !== index);
      setMembers(updated);
    }
  };

  // Update Member field
  const handleMemberChange = (index, field, value) => {
    const updated = [...members];
    updated[index][field] = value;
    setMembers(updated);
  };

  // Handle Form Submission with full validation and duplicate checks
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);

    try {
      // 1. Basic validation
      if (!teamName.trim()) {
        throw new Error('Please enter a valid Team Name.');
      }
      if (!selectedDomain) {
        throw new Error('Please select a competition Domain.');
      }

      // Check Leader Details
      if (!leader.name.trim() || !leader.email.trim() || !leader.phone.trim() || !leader.college.trim() || !leader.department.trim()) {
        throw new Error('Please fill in all required fields for Team Leader.');
      }

      // Check Member Details
      for (let i = 0; i < members.length; i++) {
        const m = members[i];
        if (!m.name.trim() || !m.email.trim() || !m.phone.trim() || !m.college.trim() || !m.department.trim()) {
          throw new Error(`Please fill in all required fields for Member ${i + 2}.`);
        }
      }

      // 2. Validate email and phone formats
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const phoneRegex = /^[0-9]{10}$/;

      const allParticipants = [
        { ...leader, role: 'Leader' },
        ...members.map((m, idx) => ({ ...m, role: `Member ${idx + 2}` }))
      ];

      for (const p of allParticipants) {
        if (!emailRegex.test(p.email.trim())) {
          throw new Error(`Invalid email format for ${p.role}: ${p.email}`);
        }
        const cleanPhone = p.phone.replace(/[^0-9]/g, '');
        if (!phoneRegex.test(cleanPhone)) {
          throw new Error(`Please enter a valid 10-digit mobile phone number for ${p.role} (${p.name || 'Participant'}).`);
        }
      }

      // 3. Internal duplicate check within the form
      const emailsList = allParticipants.map(p => p.email.trim().toLowerCase());
      const phonesList = allParticipants.map(p => p.phone.replace(/[^0-9]/g, ''));

      if (new Set(emailsList).size !== emailsList.length) {
        throw new Error('Duplicate email addresses detected within the team members.');
      }
      if (new Set(phonesList).size !== phonesList.length) {
        throw new Error('Duplicate phone numbers detected within the team members.');
      }

      // 4. Database duplicate prevention check (checks database teams & members)
      for (const p of allParticipants) {
        const dupCheck = await checkDuplicates({
          email: p.email,
          phone: p.phone,
          teamName: teamName.trim()
        });
        if (dupCheck.duplicate) {
          throw new Error(dupCheck.message);
        }
      }

      // 5. Save to database / Supabase
      const teamPayload = {
        team_name: teamName.trim(),
        college_type: collegeType,
        selected_domain: selectedDomain,
        project_title: projectTitle.trim(),
        project_description: projectDescription.trim()
      };

      const membersPayload = [
        { ...leader, phone: leader.phone.trim() },
        ...members.map(m => ({ ...m, phone: m.phone.trim() }))
      ];

      const result = await registerTeam(teamPayload, membersPayload);

      if (result.success) {
        // Trigger celebratory confetti
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#E50914', '#FF3030', '#ffffff', '#00d2ff']
        });

        setConfirmedTeam({
          registration_id: result.registration_id,
          team_name: teamName.trim(),
          college_type: collegeType,
          selected_domain: selectedDomain,
          project_title: projectTitle.trim(),
          all_members: membersPayload
        });
      } else {
        throw new Error(result.error || 'Registration failed. Please try again.');
      }

    } catch (err) {
      setErrorMessage(err.message || 'An unexpected error occurred during registration.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyRegId = () => {
    if (confirmedTeam) {
      navigator.clipboard.writeText(confirmedTeam.registration_id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-[#090909] text-white pt-24 pb-20 cyber-grid-bg relative">
      
      {/* Background Red Glow */}
      <div className="absolute top-24 left-1/2 -translate-x-1/2 w-3/4 h-96 bg-[#E50914]/12 rounded-full blur-[160px] pointer-events-none"></div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ========================================================================= */}
        {/* CONFIRMATION CARD VIEW (Rendered on successful registration) */}
        {/* ========================================================================= */}
        {confirmedTeam ? (
          <div className="bg-[#0e0e0e] border-2 border-[#E50914] rounded-2xl p-6 sm:p-10 shadow-neon-red-lg animate-fadeIn">
            
            {/* Header Success Ribbon */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-[#E50914]/20 border border-[#E50914] rounded-2xl flex items-center justify-center mx-auto mb-4 text-[#FF3030] shadow-neon-red">
                <CheckCircle className="w-8 h-8 text-[#FF3030]" />
              </div>
              <span className="text-xs font-mono text-[#00d2ff] tracking-widest uppercase">
                REGISTRATION PROTOCOL VERIFIED
              </span>
              <h1 className="text-3xl sm:text-4xl font-orbitron font-extrabold text-white mt-1">
                REGISTRATION CONFIRMED!
              </h1>
              <p className="text-gray-300 text-sm max-w-md mx-auto mt-2">
                Your team has been successfully registered for NERONOVA 2026. Please save your official Registration ID.
              </p>
            </div>

            {/* Official Registration Pass Box */}
            <div className="bg-gradient-to-br from-[#180003] via-[#090909] to-[#140002] border border-[#E50914]/60 rounded-xl p-6 mb-8 relative">
              <span className="absolute top-2 right-2 text-[10px] font-mono text-gray-500">OFFICIAL PASS</span>
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
                <div>
                  <div className="text-xs text-gray-400 font-mono">REGISTRATION ID</div>
                  <div className="text-2xl sm:text-3xl font-orbitron font-black text-[#FF3030] cyber-glow-red tracking-wider">
                    {confirmedTeam.registration_id}
                  </div>
                </div>

                <button
                  onClick={copyRegId}
                  className="px-4 py-2 bg-black/60 hover:bg-white/10 border border-[#E50914]/40 rounded text-xs font-orbitron font-semibold text-white flex items-center space-x-2 transition-colors"
                >
                  <Copy className="w-4 h-4 text-[#FF3030]" />
                  <span>{copied ? 'Copied to Clipboard!' : 'Copy ID'}</span>
                </button>
              </div>

              {/* Team Summary */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 text-xs font-mono">
                <div>
                  <span className="text-gray-500 block">TEAM NAME</span>
                  <span className="text-white font-bold text-sm">{confirmedTeam.team_name}</span>
                </div>
                <div>
                  <span className="text-gray-500 block">CATEGORY</span>
                  <span className="text-white font-bold text-sm">{confirmedTeam.college_type}</span>
                </div>
                <div>
                  <span className="text-gray-500 block">SELECTED DOMAIN</span>
                  <span className="text-[#FF3030] font-bold text-sm">{confirmedTeam.selected_domain}</span>
                </div>
              </div>

              {confirmedTeam.project_title && (
                <div className="mt-4 pt-4 border-t border-white/5 text-xs font-mono">
                  <span className="text-gray-500 block">PROPOSED PROJECT</span>
                  <span className="text-gray-200">{confirmedTeam.project_title}</span>
                </div>
              )}
            </div>

            {/* Registered Team Members Roster */}
            <div className="mb-8">
              <h3 className="font-orbitron font-bold text-sm uppercase tracking-wider text-white mb-3">
                Team Roster ({confirmedTeam.all_members.length} Members)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {confirmedTeam.all_members.map((m, idx) => (
                  <div key={idx} className="bg-[#141414] border border-white/10 rounded-lg p-3 text-xs">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-white text-sm">{m.name}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                        idx === 0 ? 'bg-[#E50914]/30 text-[#FF3030] border border-[#E50914]' : 'bg-white/5 text-gray-400'
                      }`}>
                        {idx === 0 ? 'TEAM LEADER' : `MEMBER ${idx + 1}`}
                      </span>
                    </div>
                    <div className="text-gray-400 font-mono">{m.college}</div>
                    <div className="text-gray-500 text-[11px] font-mono">{m.department} • {m.year_of_study}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-white/10">
              <button
                onClick={() => window.print()}
                className="px-6 py-2.5 bg-black/60 border border-white/20 hover:border-white/40 rounded text-xs font-orbitron font-semibold text-white flex items-center space-x-2 transition-colors"
              >
                <Printer className="w-4 h-4 text-[#FF3030]" />
                <span>Print / Save Pass</span>
              </button>

              <div className="flex items-center space-x-3">
                <Link
                  to="/"
                  className="px-6 py-2.5 bg-gradient-to-r from-[#E50914] to-[#FF3030] rounded text-xs font-orbitron font-bold uppercase text-white shadow-neon-red flex items-center space-x-1"
                >
                  <span>Return to Homepage</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
            </div>

          </div>
        ) : (
          /* ========================================================================= */
          /* REGISTRATION FORM VIEW */
          /* ========================================================================= */
          <div>
            
            {/* Header */}
            <div className="text-center max-w-2xl mx-auto mb-12 space-y-4">
              <div className="inline-flex items-center space-x-2 border border-[#E50914]/40 bg-[#090909]/80 px-4 py-1.5 rounded-full text-xs font-mono tracking-widest text-[#FF3030]">
                <span>// TEAM ONBOARDING PROTOCOL</span>
              </div>
              <h1 className="text-4xl sm:text-5xl font-orbitron font-extrabold tracking-tight">
                TEAM <span className="text-[#FF3030] cyber-glow-red">REGISTRATION</span>
              </h1>
              <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                Register your 2 to 4 member team for NERONOVA 2026. Please ensure all contact information is accurate for credential dispatch.
              </p>
            </div>

            {/* Error Alert Display */}
            {errorMessage && (
              <div className="mb-6 bg-[#2a0004] border border-[#FF3030] text-red-200 px-4 py-3 rounded-xl flex items-start space-x-3 text-sm animate-shake">
                <AlertCircle className="w-5 h-5 text-[#FF3030] shrink-0 mt-0.5" />
                <div>
                  <strong className="font-semibold block">Validation Alert:</strong>
                  <span>{errorMessage}</span>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              
              {/* =================================================================== */}
              {/* SECTION 1: TEAM & COMPETITION TRACK */}
              {/* =================================================================== */}
              <div className="bg-[#0e0e0e] border border-[#E50914]/40 rounded-2xl p-6 sm:p-8 shadow-cyber-card space-y-6">
                <div className="flex items-center space-x-2 text-[#FF3030] font-orbitron font-bold text-sm tracking-wider uppercase border-l-4 border-[#E50914] pl-2.5">
                  <span>1. Team Identity & Domain</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-orbitron font-semibold text-gray-300 uppercase mb-2">
                      Team Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={teamName}
                      onChange={(e) => setTeamName(e.target.value)}
                      placeholder="e.g. CyberSentinels"
                      className="w-full bg-[#141414] border border-white/10 focus:border-[#E50914] rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#E50914]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-orbitron font-semibold text-gray-300 uppercase mb-2">
                      Participation Category *
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {['Inter College', 'Intra College'].map((type) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => setCollegeType(type)}
                          className={`py-3 px-3 text-xs font-orbitron font-bold rounded-lg border transition-all ${
                            collegeType === type
                              ? 'bg-[#E50914] text-white border-[#FF3030] shadow-neon-red'
                              : 'bg-[#141414] text-gray-400 border-white/10 hover:border-white/20'
                          }`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Domain Selector */}
                <div>
                  <label className="block text-xs font-orbitron font-semibold text-gray-300 uppercase mb-2">
                    Selected Competition Domain *
                  </label>
                  <select
                    value={selectedDomain}
                    onChange={(e) => setSelectedDomain(e.target.value)}
                    className="w-full bg-[#141414] border border-white/10 focus:border-[#E50914] rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#E50914]"
                  >
                    {DOMAIN_LIST.map((d) => (
                      <option key={d.id} value={d.name} className="bg-[#090909]">
                        {d.number}. {d.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Optional Project Details */}
                <div className="grid grid-cols-1 gap-4 pt-2 border-t border-white/5">
                  <div>
                    <label className="block text-xs font-orbitron font-semibold text-gray-300 uppercase mb-2">
                      Proposed Project Title (Optional)
                    </label>
                    <input
                      type="text"
                      value={projectTitle}
                      onChange={(e) => setProjectTitle(e.target.value)}
                      placeholder="e.g. Autonomous Edge Drone for Precision Blight Mitigation"
                      className="w-full bg-[#141414] border border-white/10 focus:border-[#E50914] rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#E50914]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-orbitron font-semibold text-gray-300 uppercase mb-2">
                      Brief Project Description (Optional)
                    </label>
                    <textarea
                      rows={2}
                      value={projectDescription}
                      onChange={(e) => setProjectDescription(e.target.value)}
                      placeholder="Summarize the core problem statement, proposed methodology and target impact..."
                      className="w-full bg-[#141414] border border-white/10 focus:border-[#E50914] rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#E50914]"
                    ></textarea>
                  </div>
                </div>

              </div>

              {/* =================================================================== */}
              {/* SECTION 2: TEAM LEADER DETAILS (Member 1) */}
              {/* =================================================================== */}
              <div className="bg-[#0e0e0e] border border-[#E50914]/40 rounded-2xl p-6 sm:p-8 shadow-cyber-card space-y-6">
                <div className="flex items-center justify-between border-l-4 border-[#E50914] pl-2.5">
                  <span className="text-[#FF3030] font-orbitron font-bold text-sm tracking-wider uppercase">
                    2. Team Leader Details (Primary Contact)
                  </span>
                  <span className="bg-[#E50914]/20 border border-[#E50914] text-[#FF3030] font-orbitron text-[10px] px-2.5 py-0.5 rounded uppercase font-bold">
                    LEAD #1
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-orbitron font-semibold text-gray-300 uppercase mb-1.5">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={leader.name}
                      onChange={(e) => setLeader({ ...leader, name: e.target.value })}
                      placeholder="e.g. Aravind Subramanian"
                      className="w-full bg-[#141414] border border-white/10 focus:border-[#E50914] rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#E50914]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-orbitron font-semibold text-gray-300 uppercase mb-1.5">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={leader.email}
                      onChange={(e) => setLeader({ ...leader, email: e.target.value })}
                      placeholder="e.g. aravind@college.edu"
                      className="w-full bg-[#141414] border border-white/10 focus:border-[#E50914] rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#E50914]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-orbitron font-semibold text-gray-300 uppercase mb-1.5">
                      10-Digit Mobile Phone *
                    </label>
                    <input
                      type="tel"
                      required
                      value={leader.phone}
                      onChange={(e) => setLeader({ ...leader, phone: e.target.value })}
                      placeholder="e.g. 9840123456"
                      className="w-full bg-[#141414] border border-white/10 focus:border-[#E50914] rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#E50914]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-orbitron font-semibold text-gray-300 uppercase mb-1.5">
                      College / University Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={leader.college}
                      onChange={(e) => setLeader({ ...leader, college: e.target.value })}
                      placeholder="e.g. PSG College of Technology"
                      className="w-full bg-[#141414] border border-white/10 focus:border-[#E50914] rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#E50914]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-orbitron font-semibold text-gray-300 uppercase mb-1.5">
                      Department / Specialization *
                    </label>
                    <input
                      type="text"
                      required
                      value={leader.department}
                      onChange={(e) => setLeader({ ...leader, department: e.target.value })}
                      placeholder="e.g. Computer Science & Engineering"
                      className="w-full bg-[#141414] border border-white/10 focus:border-[#E50914] rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#E50914]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-orbitron font-semibold text-gray-300 uppercase mb-1.5">
                      Year of Study *
                    </label>
                    <select
                      value={leader.year_of_study}
                      onChange={(e) => setLeader({ ...leader, year_of_study: e.target.value })}
                      className="w-full bg-[#141414] border border-white/10 focus:border-[#E50914] rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#E50914]"
                    >
                      {YEAR_OPTIONS.map((y) => (
                        <option key={y} value={y} className="bg-[#090909]">{y}</option>
                      ))}
                    </select>
                  </div>
                </div>

              </div>

              {/* =================================================================== */}
              {/* SECTION 3: TEAM MEMBERS (Total team size 2 to 4 members) */}
              {/* =================================================================== */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-[#FF3030] font-orbitron font-bold text-sm tracking-wider uppercase border-l-4 border-[#E50914] pl-2.5">
                    <span>3. Team Members ({members.length + 1} / 4 Members Total)</span>
                  </div>

                  {members.length < 3 && (
                    <button
                      type="button"
                      onClick={handleAddMember}
                      className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-[#E50914]/20 hover:bg-[#E50914] text-white border border-[#E50914] rounded text-xs font-orbitron font-semibold transition-colors"
                    >
                      <UserPlus className="w-3.5 h-3.5" />
                      <span>Add Member {members.length + 2}</span>
                    </button>
                  )}
                </div>

                {/* Additional Members List */}
                {members.map((member, idx) => (
                  <div 
                    key={idx}
                    className="bg-[#0e0e0e] border border-white/10 hover:border-[#E50914]/50 rounded-2xl p-6 sm:p-8 space-y-4 relative transition-colors"
                  >
                    <div className="flex items-center justify-between border-b border-white/10 pb-3">
                      <span className="font-orbitron font-bold text-sm text-gray-200">
                        Team Member #{idx + 2} Details
                      </span>

                      {members.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveMember(idx)}
                          className="text-gray-500 hover:text-[#FF3030] text-xs font-mono flex items-center space-x-1 transition-colors"
                          title="Remove Member"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Remove</span>
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-orbitron font-semibold text-gray-300 uppercase mb-1.5">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={member.name}
                          onChange={(e) => handleMemberChange(idx, 'name', e.target.value)}
                          placeholder="e.g. Keerthana Ramesh"
                          className="w-full bg-[#141414] border border-white/10 focus:border-[#E50914] rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#E50914]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-orbitron font-semibold text-gray-300 uppercase mb-1.5">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          required
                          value={member.email}
                          onChange={(e) => handleMemberChange(idx, 'email', e.target.value)}
                          placeholder="e.g. keerthana@college.edu"
                          className="w-full bg-[#141414] border border-white/10 focus:border-[#E50914] rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#E50914]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-orbitron font-semibold text-gray-300 uppercase mb-1.5">
                          10-Digit Mobile Phone *
                        </label>
                        <input
                          type="tel"
                          required
                          value={member.phone}
                          onChange={(e) => handleMemberChange(idx, 'phone', e.target.value)}
                          placeholder="e.g. 9840123457"
                          className="w-full bg-[#141414] border border-white/10 focus:border-[#E50914] rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#E50914]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-orbitron font-semibold text-gray-300 uppercase mb-1.5">
                          College / University *
                        </label>
                        <input
                          type="text"
                          required
                          value={member.college}
                          onChange={(e) => handleMemberChange(idx, 'college', e.target.value)}
                          placeholder="e.g. PSG College of Technology"
                          className="w-full bg-[#141414] border border-white/10 focus:border-[#E50914] rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#E50914]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-orbitron font-semibold text-gray-300 uppercase mb-1.5">
                          Department / Specialization *
                        </label>
                        <input
                          type="text"
                          required
                          value={member.department}
                          onChange={(e) => handleMemberChange(idx, 'department', e.target.value)}
                          placeholder="e.g. Biomedical Engineering"
                          className="w-full bg-[#141414] border border-white/10 focus:border-[#E50914] rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#E50914]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-orbitron font-semibold text-gray-300 uppercase mb-1.5">
                          Year of Study *
                        </label>
                        <select
                          value={member.year_of_study}
                          onChange={(e) => handleMemberChange(idx, 'year_of_study', e.target.value)}
                          className="w-full bg-[#141414] border border-white/10 focus:border-[#E50914] rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#E50914]"
                        >
                          {YEAR_OPTIONS.map((y) => (
                            <option key={y} value={y} className="bg-[#090909]">{y}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                  </div>
                ))}
              </div>

              {/* Submit Action Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-gradient-to-r from-[#E50914] via-[#FF3030] to-[#E50914] text-white font-orbitron font-bold text-base uppercase rounded cyber-chamfer-btn shadow-neon-red hover:shadow-neon-red-lg transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  <Zap className="w-5 h-5 animate-pulse" />
                  <span>{isSubmitting ? 'Verifying & Registering...' : 'Submit Official Team Registration'}</span>
                </button>
                <p className="text-center text-xs text-gray-500 font-mono mt-3">
                  A unique Registration ID will be assigned and saved to the database upon submission.
                </p>
              </div>

            </form>
          </div>
        )}

      </div>
    </div>
  );
}
