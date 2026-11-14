import React, { useState } from 'react';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Send, 
  CheckCircle, 
  Building2, 
  Users, 
  GraduationCap 
} from 'lucide-react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#090909] text-white pt-24 pb-20 cyber-grid-bg relative">
      
      {/* Background Red Glow */}
      <div className="absolute top-28 right-10 w-96 h-96 bg-[#E50914]/15 rounded-full blur-[160px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-4">
          <div className="inline-flex items-center space-x-2 border border-[#E50914]/40 bg-[#090909]/80 px-4 py-1.5 rounded-full text-xs font-mono tracking-widest text-[#FF3030]">
            <span>// LIAISON & HELPDESK</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-orbitron font-extrabold tracking-tight">
            CONTACT <span className="text-[#FF3030] cyber-glow-red">NERONOVA</span>
          </h1>
          <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
            Have questions regarding offline hackathon participation, accommodation, domain guidelines, or partnership opportunities? Reach our team directly.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
          
          {/* Left Column: Official Contact Points (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Host Venue Card */}
            <div className="bg-[#0e0e0e] border border-[#E50914]/40 rounded-xl p-6 shadow-cyber-card">
              <div className="flex items-center space-x-3 text-[#FF3030] font-orbitron text-sm font-bold uppercase mb-4 border-l-4 border-[#E50914] pl-2.5">
                <Building2 className="w-5 h-5" />
                <span>Host Institution & Venue</span>
              </div>
              <h3 className="font-orbitron font-bold text-white text-base mb-2">
                Hindusthan College of Engineering and Technology
              </h3>
              <p className="text-gray-400 text-xs sm:text-sm leading-relaxed mb-4">
                HICET, Coimbatore, Tamil Nadu – 641032
              </p>
              <div className="text-xs font-mono text-gray-500 flex items-center space-x-1">
                <MapPin className="w-3.5 h-3.5 text-[#FF3030]" />
                <span>GPS: 10.8841° N, 76.9926° E</span>
              </div>
            </div>

            {/* Organizing Coordinators */}
            <div className="bg-[#0e0e0e] border border-[#E50914]/40 rounded-xl p-6 shadow-cyber-card space-y-4">
              <div className="flex items-center space-x-3 text-[#FF3030] font-orbitron text-sm font-bold uppercase mb-2 border-l-4 border-[#E50914] pl-2.5">
                <GraduationCap className="w-5 h-5" />
                <span>Organizing Coordinators</span>
              </div>

              <div className="space-y-2.5">
                <div className="bg-[#141414] p-3.5 rounded-lg border border-white/5 hover:border-[#E50914]/40 transition-colors">
                  <div className="font-orbitron font-bold text-white text-sm">Dr. Vidhya</div>
                  <div className="text-xs text-[#FF3030] font-mono tracking-wide mt-0.5">AIML Department</div>
                </div>

                <div className="bg-[#141414] p-3.5 rounded-lg border border-white/5 hover:border-[#E50914]/40 transition-colors">
                  <div className="font-orbitron font-bold text-white text-sm">Dr. Satheesh Kumar</div>
                  <div className="text-xs text-[#FF3030] font-mono tracking-wide mt-0.5">AIML Department</div>
                </div>
              </div>
            </div>

            {/* Student Coordinators */}
            <div className="bg-[#0e0e0e] border border-[#E50914]/40 rounded-xl p-6 shadow-cyber-card space-y-4">
              <div className="flex items-center space-x-3 text-[#FF3030] font-orbitron text-sm font-bold uppercase mb-2 border-l-4 border-[#E50914] pl-2.5">
                <Users className="w-5 h-5" />
                <span>Student Coordinators</span>
              </div>

              <div className="space-y-2.5">
                <div className="bg-[#141414] p-3.5 rounded-lg border border-white/5 hover:border-[#E50914]/40 transition-colors">
                  <div className="font-orbitron font-bold text-white text-sm">Swathi M</div>
                  <div className="text-xs text-gray-400 font-mono tracking-wide mt-0.5">AIML Student</div>
                </div>

                <div className="bg-[#141414] p-3.5 rounded-lg border border-white/5 hover:border-[#E50914]/40 transition-colors">
                  <div className="font-orbitron font-bold text-white text-sm">Sai Venkatesh J</div>
                  <div className="text-xs text-gray-400 font-mono tracking-wide mt-0.5">AIML Student</div>
                </div>
              </div>
            </div>

            {/* Helpline Hours */}
            <div className="bg-[#140204] border border-[#E50914]/30 rounded-xl p-4 flex items-center space-x-3 text-xs font-mono text-gray-300">
              <Clock className="w-5 h-5 text-[#FF3030] shrink-0" />
              <span>Desk Response Hours: 9:00 AM – 6:00 PM IST (Mon–Sat)</span>
            </div>

          </div>

          {/* Right Column: Interactive Contact Form (7 cols) */}
          <div className="lg:col-span-7 flex flex-col justify-between">
            <div className="bg-[#0e0e0e] border border-[#E50914]/40 rounded-2xl p-6 sm:p-8 shadow-cyber-card">
              <h3 className="text-xl sm:text-2xl font-orbitron font-bold text-white mb-2">
                Send an Official Enquiry
              </h3>
              <p className="text-gray-400 text-xs sm:text-sm mb-6">
                Fill in your details and message. Our event liaison officers will respond to your registered email promptly.
              </p>

              {submitted ? (
                <div className="p-8 text-center bg-[#140204] border border-[#E50914] rounded-xl space-y-4 animate-fadeIn">
                  <CheckCircle className="w-12 h-12 text-[#FF3030] mx-auto animate-bounce" />
                  <h4 className="font-orbitron font-bold text-xl text-white">Transmission Received</h4>
                  <p className="text-gray-300 text-sm max-w-md mx-auto">
                    Thank you, <span className="text-[#FF3030] font-semibold">{formData.name}</span>. Your enquiry has been routed to the NERONOVA 2026 organizing desk.
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
                    }}
                    className="px-6 py-2 bg-[#E50914] text-white rounded text-xs font-orbitron font-bold uppercase hover:bg-[#FF3030] transition-colors"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-orbitron font-semibold text-gray-300 uppercase mb-1.5">
                        Your Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full bg-[#141414] border border-white/10 focus:border-[#E50914] rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#E50914]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-orbitron font-semibold text-gray-300 uppercase mb-1.5">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full bg-[#141414] border border-white/10 focus:border-[#E50914] rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#E50914]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-orbitron font-semibold text-gray-300 uppercase mb-1.5">
                        Enquiry Subject *
                      </label>
                      <select
                        required
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        className="w-full bg-[#141414] border border-white/10 focus:border-[#E50914] rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#E50914]"
                      >
                        <option value="">Select Topic</option>
                        <option value="Registration & Verification">Registration & Verification</option>
                        <option value="Domain & Project Scope">Domain & Project Scope</option>
                        <option value="Accommodation & Travel Assistance">Accommodation & Travel Assistance</option>
                        <option value="Sponsorship & Partnership">Sponsorship & Partnership</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-orbitron font-semibold text-gray-300 uppercase mb-1.5">
                      Your Message / Query *
                    </label>
                    <textarea
                      rows={4}
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full bg-[#141414] border border-white/10 focus:border-[#E50914] rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#E50914]"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 bg-gradient-to-r from-[#E50914] to-[#FF3030] text-white font-orbitron font-bold text-sm uppercase rounded cyber-chamfer-btn shadow-neon-red hover:shadow-neon-red-lg transition-all flex items-center justify-center space-x-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>Transmit Enquiry</span>
                  </button>
                </form>
              )}
            </div>

            {/* Approved NERONOVA 2026 Event Logo Below the Form */}
            <div className="mt-8 flex items-center justify-center">
              <img 
                src="/neronova-logo.png" 
                alt="NERONOVA 2026 Official Logo" 
                className="w-64 sm:w-80 md:w-96 max-w-full h-auto object-contain filter drop-shadow-[0_0_20px_rgba(229,9,20,0.6)] hover:drop-shadow-[0_0_30px_rgba(255,48,48,0.9)] transition-all duration-300"
              />
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
