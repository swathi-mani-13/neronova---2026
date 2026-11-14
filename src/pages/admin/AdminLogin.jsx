import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Shield, Lock, Mail, Key, ChevronRight, AlertCircle, ArrowLeft } from 'lucide-react';
import { useAuth, ADMIN_ROLES } from '../../lib/auth';

export default function AdminLogin() {
  const { login, currentUser } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState(ADMIN_ROLES.MAIN_ADMIN);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // If already logged in, navigate straight to /admin
  React.useEffect(() => {
    if (currentUser) {
      navigate('/admin');
    }
  }, [currentUser, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const res = await login(email, password);
    setLoading(false);

    if (res.success) {
      navigate('/admin');
    } else {
      setError(res.error || 'Authentication rejected. Verify credentials.');
    }
  };

  const handleRoleSelect = (role, demoEmail) => {
    setSelectedRole(role);
    if (!email) {
      setEmail(demoEmail);
    }
  };

  return (
    <div className="min-h-screen bg-[#070707] text-white flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative cyber-grid-bg">
      
      {/* Red ambient backlight */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#E50914]/15 rounded-full blur-[140px] pointer-events-none"></div>

      {/* Return to Public Website */}
      <div className="max-w-md w-full mx-auto px-4 mb-4">
        <Link
          to="/"
          className="inline-flex items-center text-xs font-mono text-gray-400 hover:text-[#FF3030] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Return to Public Portal
        </Link>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md px-4">
        
        {/* Terminal Header */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 bg-[#140003] border-2 border-[#E50914] rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-neon-red">
            <Shield className="w-7 h-7 text-[#FF3030]" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-orbitron font-extrabold text-white tracking-wider">
            ADMIN PORTAL
          </h2>
          <p className="text-xs font-mono text-gray-400 mt-1">
            NERONOVA 2026 // SECURE ACCESS GATEWAY
          </p>
        </div>

        {/* Login Box */}
        <div className="bg-[#0e0e0e] border border-[#E50914]/50 rounded-2xl p-6 sm:p-8 shadow-neon-red relative">
          
          {/* Quick Role Selection Badges for Reviewers */}
          <div className="mb-6 pb-5 border-b border-white/10">
            <label className="block text-[11px] font-orbitron font-semibold text-gray-400 uppercase mb-2">
              Select Admin Role Profile:
            </label>
            <div className="grid grid-cols-1 gap-2">
              {[
                { role: ADMIN_ROLES.MAIN_ADMIN, email: 'admin@neronova.com', desc: 'Full System Control & Record Purging' },
                { role: ADMIN_ROLES.ORGANIZING_TEAM, email: 'organizer@neronova.com', desc: 'Check-in, Payment Verification & Reporting' },
                { role: ADMIN_ROLES.FACULTY_COORDINATOR, email: 'faculty@neronova.com', desc: 'Academic Review & Proposal Auditing' }
              ].map((r) => (
                <button
                  key={r.role}
                  type="button"
                  onClick={() => handleRoleSelect(r.role, r.email)}
                  className={`text-left p-2.5 rounded-lg border text-xs transition-all ${
                    selectedRole === r.role
                      ? 'bg-[#E50914]/20 border-[#FF3030] text-white shadow-[0_0_10px_rgba(229,9,20,0.3)]'
                      : 'bg-[#141414] border-white/5 text-gray-400 hover:border-white/20'
                  }`}
                >
                  <div className="font-orbitron font-bold flex items-center justify-between">
                    <span>{r.role}</span>
                    {selectedRole === r.role && (
                      <span className="w-2 h-2 rounded-full bg-[#FF3030] animate-ping"></span>
                    )}
                  </div>
                  <div className="text-[10px] text-gray-500 font-mono mt-0.5">{r.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="mb-4 bg-[#2a0004] border border-[#FF3030] text-red-200 p-3 rounded-lg text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-[#FF3030] shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-orbitron font-semibold text-gray-300 uppercase mb-1">
                Admin Email ID
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-500 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#141414] border border-white/10 focus:border-[#E50914] rounded-lg pl-10 pr-3 py-2.5 text-sm text-white focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-orbitron font-semibold text-gray-300 uppercase mb-1">
                Security Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-500 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#141414] border border-white/10 focus:border-[#E50914] rounded-lg pl-10 pr-3 py-2.5 text-sm text-white focus:outline-none"
                />
              </div>
              <div className="text-[10px] text-gray-500 font-mono mt-1">
                Default evaluator password: <span className="text-[#FF3030]">admin</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 bg-gradient-to-r from-[#E50914] to-[#FF3030] text-white font-orbitron font-bold text-xs uppercase rounded cyber-chamfer-btn shadow-neon-red hover:shadow-neon-red-lg transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              <Key className="w-4 h-4" />
              <span>{loading ? 'Authenticating...' : `Login as ${selectedRole}`}</span>
            </button>
          </form>

        </div>

      </div>
    </div>
  );
}
