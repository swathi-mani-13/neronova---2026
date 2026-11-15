import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import * as XLSX from 'xlsx';
import { 
  Users, 
  Shield, 
  FileSpreadsheet, 
  Search, 
  Filter, 
  CheckCircle, 
  Clock, 
  CreditCard, 
  Trash2, 
  Eye, 
  LogOut, 
  Building2, 
  Check, 
  X, 
  RefreshCw, 
  ExternalLink,
  ChevronRight,
  Sparkles,
  BarChart3,
  Award,
  Layers,
  AlertTriangle
} from 'lucide-react';
import { useAuth, ADMIN_ROLES } from '../../lib/auth';
import { 
  getRealDatabaseStatistics, 
  updatePaymentStatus, 
  updateTeamStatus, 
  deleteTeam, 
  isSupabaseConfigured 
} from '../../lib/supabase';
import { DOMAIN_LIST } from '../Domains';

export default function AdminDashboard() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  // State
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [domainFilter, setDomainFilter] = useState('ALL');
  const [collegeTypeFilter, setCollegeTypeFilter] = useState('ALL');
  const [paymentFilter, setPaymentFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [activeTab, setActiveTab] = useState('teams'); // 'teams' | 'analytics'
  const [actionSuccess, setActionSuccess] = useState('');

  // Authentication check
  useEffect(() => {
    if (!currentUser) {
      navigate('/admin/login');
    }
  }, [currentUser, navigate]);

  // Load Real Database Statistics
  const loadData = async () => {
    setLoading(true);
    try {
      const data = await getRealDatabaseStatistics();
      setStats(data);
    } catch (err) {
      console.error('Failed to load database stats', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (!currentUser) return null;

  // Main Admin role permissions (Full privileges)
  const isMainAdmin = true;

  // Filtered Teams List
  const filteredTeams = (stats?.teams || []).filter((team) => {
    // Search query
    const leader = team.members?.find(m => m.is_leader) || team.members?.[0] || {};
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q || 
      team.team_name.toLowerCase().includes(q) ||
      team.registration_id.toLowerCase().includes(q) ||
      (team.project_title && team.project_title.toLowerCase().includes(q)) ||
      (leader.name && leader.name.toLowerCase().includes(q)) ||
      (leader.college && leader.college.toLowerCase().includes(q)) ||
      (leader.email && leader.email.toLowerCase().includes(q));

    // Domain filter
    const matchesDomain = domainFilter === 'ALL' || team.selected_domain === domainFilter;

    // College type filter
    const matchesCollegeType = collegeTypeFilter === 'ALL' || team.college_type === collegeTypeFilter;

    // Payment filter
    const matchesPayment = paymentFilter === 'ALL' || 
      (paymentFilter === 'PAID' && team.is_paid) ||
      (paymentFilter === 'UNPAID' && !team.is_paid);

    // Status filter
    const matchesStatus = statusFilter === 'ALL' || team.status === statusFilter;

    return matchesSearch && matchesDomain && matchesCollegeType && matchesPayment && matchesStatus;
  });

  // Action: Toggle Payment Status
  const handleTogglePayment = async (teamId, currentIsPaid) => {
    const nextStatus = !currentIsPaid;
    const res = await updatePaymentStatus(teamId, nextStatus);
    if (res.success) {
      setActionSuccess(`Payment status successfully updated to ${nextStatus ? 'PAID' : 'UNPAID'}.`);
      setTimeout(() => setActionSuccess(''), 3000);
      loadData();
      if (selectedTeam && selectedTeam.id === teamId) {
        setSelectedTeam({ ...selectedTeam, is_paid: nextStatus });
      }
    }
  };

  // Action: Update Review Status
  const handleUpdateStatus = async (teamId, newStatus) => {
    const res = await updateTeamStatus(teamId, newStatus);
    if (res.success) {
      setActionSuccess(`Team verification status updated to '${newStatus}'.`);
      setTimeout(() => setActionSuccess(''), 3000);
      loadData();
      if (selectedTeam && selectedTeam.id === teamId) {
        setSelectedTeam({ ...selectedTeam, status: newStatus });
      }
    }
  };

  // Action: Delete Team (Main Admin only)
  const handleDeleteTeam = async (teamId, teamName) => {
    if (!isMainAdmin) {
      alert('Only Main Admin has permission to delete registration records.');
      return;
    }
    if (window.confirm(`Are you sure you want to permanently delete team "${teamName}"? This action cannot be undone.`)) {
      const res = await deleteTeam(teamId);
      if (res.success) {
        setActionSuccess(`Team "${teamName}" permanently deleted from database.`);
        setTimeout(() => setActionSuccess(''), 3000);
        setSelectedTeam(null);
        loadData();
      }
    }
  };

  // Action: Excel Export (xlsx)
  const handleExportExcel = () => {
    if (!stats || !stats.teams) return;

    // 1. Teams Sheet Data
    const teamsData = stats.teams.map((t, idx) => {
      const leader = t.members?.find(m => m.is_leader) || t.members?.[0] || {};
      return {
        'S.No': idx + 1,
        'Registration ID': t.registration_id,
        'Team Name': t.team_name,
        'Category': t.college_type,
        'Domain': t.selected_domain,
        'Project Title': t.project_title || 'N/A',
        'Total Members': t.members?.length || 0,
        'Leader Name': leader.name || 'N/A',
        'Leader Email': leader.email || 'N/A',
        'Leader Phone': leader.phone || 'N/A',
        'Leader College': leader.college || 'N/A',
        'Leader Dept': leader.department || 'N/A',
        'Leader Year': leader.year_of_study || 'N/A',
        'Payment Status': t.is_paid ? 'PAID' : 'UNPAID',
        'Payment Ref': t.payment_reference || 'N/A',
        'Review Status': t.status || 'Registered',
        'Registration Date': new Date(t.created_at).toLocaleString('en-IN')
      };
    });

    // 2. Members Sheet Data
    const membersData = [];
    stats.teams.forEach(t => {
      (t.members || []).forEach(m => {
        membersData.push({
          'Registration ID': t.registration_id,
          'Team Name': t.team_name,
          'Member Role': m.is_leader ? 'LEADER' : 'MEMBER',
          'Member Name': m.name,
          'Email': m.email,
          'Phone': m.phone,
          'College': m.college,
          'Department': m.department,
          'Year of Study': m.year_of_study
        });
      });
    });

    // 3. College Statistics Sheet Data
    const collegeData = Object.entries(stats.collegeMap || {}).map(([college, count]) => ({
      'College Name': college,
      'Registered Students': count
    }));

    // 4. Domain Statistics Sheet Data
    const domainData = Object.entries(stats.domainMap || {}).map(([domain, count]) => ({
      'Domain Name': domain,
      'Registered Teams': count
    }));

    // Create Workbook
    const wb = XLSX.utils.book_new();
    const wsTeams = XLSX.utils.json_to_sheet(teamsData);
    const wsMembers = XLSX.utils.json_to_sheet(membersData);
    const wsColleges = XLSX.utils.json_to_sheet(collegeData);
    const wsDomains = XLSX.utils.json_to_sheet(domainData);

    XLSX.utils.book_append_sheet(wb, wsTeams, 'Registered Teams');
    XLSX.utils.book_append_sheet(wb, wsMembers, 'All Members Roster');
    XLSX.utils.book_append_sheet(wb, wsColleges, 'College Breakdown');
    XLSX.utils.book_append_sheet(wb, wsDomains, 'Domain Breakdown');

    // Download file
    const timestamp = new Date().toISOString().split('T')[0];
    XLSX.writeFile(wb, `NERONOVA_2026_Official_Registrations_${timestamp}.xlsx`);
  };

  return (
    <div className="min-h-screen bg-[#070707] text-white">
      
      {/* Admin Top Header */}
      <header className="bg-[#0b0b0b] border-b border-[#E50914]/30 px-4 sm:px-6 py-3.5 sticky top-0 z-30 flex items-center justify-between">
        
        {/* Left Branding */}
        <div className="flex items-center space-x-3">
          <Link to="/" className="flex items-center space-x-2">
            <img src="/logo.svg" alt="NERONOVA" className="w-7 h-7" />
            <span className="font-orbitron font-extrabold text-base text-white">
              NERONOVA <span className="text-[#FF3030]">ADMIN</span>
            </span>
          </Link>
          <span className="hidden sm:inline-block px-2.5 py-0.5 rounded bg-black/60 border border-white/10 text-[10px] font-mono text-gray-400">
            {isSupabaseConfigured ? '🟢 Supabase PostgreSQL Active' : '🟡 Local Persistence Active'}
          </span>
        </div>

        {/* Right Admin Profile & Role Badge & Logout */}
        <div className="flex items-center space-x-3">
          <div className="hidden md:flex flex-col text-right">
            <span className="text-xs font-bold text-white font-orbitron">{currentUser.name}</span>
            <span className="text-[10px] font-mono text-[#FF3030]">{currentUser.role}</span>
          </div>

          <span className="px-2.5 py-1 rounded-full text-[10px] font-orbitron font-bold uppercase border bg-[#E50914]/20 border-[#FF3030] text-[#FF3030]">
            {currentUser.role || 'Main Admin'}
          </span>

          <button
            onClick={logout}
            className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors flex items-center space-x-1 text-xs"
            title="Logout"
          >
            <LogOut className="w-4 h-4 text-[#FF3030]" />
            <span className="hidden sm:inline font-mono">Exit</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Banner Alert for Action Feedback */}
        {actionSuccess && (
          <div className="bg-[#180003] border border-[#FF3030] text-red-200 px-4 py-3 rounded-xl flex items-center space-x-2 text-xs font-mono shadow-neon-red animate-fadeIn">
            <CheckCircle className="w-4 h-4 text-[#FF3030]" />
            <span>{actionSuccess}</span>
          </div>
        )}

        {/* ========================================================================= */}
        {/* REAL DATABASE STATS CARDS (Exact values calculated from actual records) */}
        {/* ========================================================================= */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2 text-[#FF3030] font-orbitron font-bold text-xs tracking-wider uppercase border-l-4 border-[#E50914] pl-2.5">
              <span>Live Database Statistics (Zero Fake Data)</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={loadData}
                disabled={loading}
                className="px-3 py-1.5 bg-[#141414] hover:bg-white/10 border border-white/10 rounded text-xs font-mono text-gray-300 flex items-center space-x-1.5 transition-colors"
              >
                <RefreshCw className={`w-3.5 h-3.5 text-[#FF3030] ${loading ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </button>

              <button
                onClick={handleExportExcel}
                className="px-4 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 rounded text-xs font-orbitron font-bold text-white flex items-center space-x-1.5 shadow-md transition-all"
              >
                <FileSpreadsheet className="w-4 h-4" />
                <span>Export to Excel (.xlsx)</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            
            {/* 1. Total Registered Teams */}
            <div className="bg-[#0e0e0e] border border-[#E50914]/40 rounded-xl p-4 shadow-cyber-card">
              <span className="text-[10px] font-mono text-gray-400 uppercase block mb-1">Total Teams</span>
              <div className="text-2xl sm:text-3xl font-orbitron font-black text-white">
                {stats ? stats.totalTeams : '—'}
              </div>
              <div className="text-[10px] text-gray-500 font-mono mt-1">Confirmed Database Records</div>
            </div>

            {/* 2. Total Registered Members */}
            <div className="bg-[#0e0e0e] border border-[#E50914]/40 rounded-xl p-4 shadow-cyber-card">
              <span className="text-[10px] font-mono text-gray-400 uppercase block mb-1">Total Members</span>
              <div className="text-2xl sm:text-3xl font-orbitron font-black text-white">
                {stats ? stats.totalMembers : '—'}
              </div>
              <div className="text-[10px] text-gray-500 font-mono mt-1">Individual Students</div>
            </div>

            {/* 3. Inter College Teams */}
            <div className="bg-[#0e0e0e] border border-[#E50914]/40 rounded-xl p-4 shadow-cyber-card">
              <span className="text-[10px] font-mono text-gray-400 uppercase block mb-1">Inter College</span>
              <div className="text-2xl sm:text-3xl font-orbitron font-black text-[#00d2ff]">
                {stats ? stats.interCollege : '—'}
              </div>
              <div className="text-[10px] text-gray-500 font-mono mt-1">External Institutions</div>
            </div>

            {/* 4. Intra College Teams */}
            <div className="bg-[#0e0e0e] border border-[#E50914]/40 rounded-xl p-4 shadow-cyber-card">
              <span className="text-[10px] font-mono text-gray-400 uppercase block mb-1">Intra College</span>
              <div className="text-2xl sm:text-3xl font-orbitron font-black text-[#FF3030]">
                {stats ? stats.intraCollege : '—'}
              </div>
              <div className="text-[10px] text-gray-500 font-mono mt-1">HICET Campus Teams</div>
            </div>

            {/* 5. Paid Teams */}
            <div className="bg-[#0e0e0e] border border-green-500/40 rounded-xl p-4 shadow-cyber-card">
              <span className="text-[10px] font-mono text-gray-400 uppercase block mb-1">Paid Teams</span>
              <div className="text-2xl sm:text-3xl font-orbitron font-black text-green-400">
                {stats ? stats.paidTeams : '—'}
              </div>
              <div className="text-[10px] text-green-500/70 font-mono mt-1">Fee Verified</div>
            </div>

            {/* 6. Unpaid Teams */}
            <div className="bg-[#0e0e0e] border border-amber-500/40 rounded-xl p-4 shadow-cyber-card">
              <span className="text-[10px] font-mono text-gray-400 uppercase block mb-1">Unpaid Teams</span>
              <div className="text-2xl sm:text-3xl font-orbitron font-black text-amber-400">
                {stats ? stats.unpaidTeams : '—'}
              </div>
              <div className="text-[10px] text-amber-500/70 font-mono mt-1">Pending Payment</div>
            </div>

          </div>
        </section>

        {/* View Switcher: Teams Table vs Analytics Breakdown */}
        <div className="flex items-center space-x-3 border-b border-white/10 pb-3">
          <button
            onClick={() => setActiveTab('teams')}
            className={`px-4 py-2 font-orbitron font-bold text-xs uppercase rounded transition-colors ${
              activeTab === 'teams'
                ? 'bg-[#E50914] text-white shadow-neon-red'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Registered Teams ({filteredTeams.length})
          </button>
          
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-4 py-2 font-orbitron font-bold text-xs uppercase rounded transition-colors ${
              activeTab === 'analytics'
                ? 'bg-[#E50914] text-white shadow-neon-red'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            College & Domain Breakdown
          </button>
        </div>

        {/* ========================================================================= */}
        {/* TAB 1: TEAMS TABLE WITH SEARCH & FILTERS */}
        {/* ========================================================================= */}
        {activeTab === 'teams' && (
          <section className="space-y-4">
            
            {/* Filters Bar */}
            <div className="bg-[#0e0e0e] border border-white/10 rounded-xl p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              
              {/* Search input */}
              <div className="relative lg:col-span-2">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search team, leader, reg ID, college..."
                  className="w-full bg-[#141414] border border-white/10 focus:border-[#E50914] rounded-lg pl-9 pr-3 py-2 text-xs text-white focus:outline-none"
                />
              </div>

              {/* Domain Filter */}
              <div>
                <select
                  value={domainFilter}
                  onChange={(e) => setDomainFilter(e.target.value)}
                  className="w-full bg-[#141414] border border-white/10 focus:border-[#E50914] rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
                >
                  <option value="ALL">All 9 Domains</option>
                  {DOMAIN_LIST.map(d => (
                    <option key={d.id} value={d.name}>{d.name}</option>
                  ))}
                </select>
              </div>

              {/* Category Filter */}
              <div>
                <select
                  value={collegeTypeFilter}
                  onChange={(e) => setCollegeTypeFilter(e.target.value)}
                  className="w-full bg-[#141414] border border-white/10 focus:border-[#E50914] rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
                >
                  <option value="ALL">All Categories</option>
                  <option value="Inter College">Inter College</option>
                  <option value="Intra College">Intra College</option>
                </select>
              </div>

              {/* Payment Filter */}
              <div>
                <select
                  value={paymentFilter}
                  onChange={(e) => setPaymentFilter(e.target.value)}
                  className="w-full bg-[#141414] border border-white/10 focus:border-[#E50914] rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
                >
                  <option value="ALL">All Payment Statuses</option>
                  <option value="PAID">Paid Only</option>
                  <option value="UNPAID">Unpaid Only</option>
                </select>
              </div>

            </div>

            {/* Teams Data Table */}
            <div className="bg-[#0e0e0e] border border-white/10 rounded-xl overflow-hidden shadow-cyber-card">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-[#141414] text-gray-400 uppercase border-b border-white/10 font-orbitron text-[10px]">
                    <tr>
                      <th className="px-4 py-3">Reg ID</th>
                      <th className="px-4 py-3">Team Name</th>
                      <th className="px-4 py-3">Category</th>
                      <th className="px-4 py-3">Selected Domain</th>
                      <th className="px-4 py-3">Leader & Contact</th>
                      <th className="px-4 py-3">Members</th>
                      <th className="px-4 py-3">Payment</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredTeams.length === 0 ? (
                      <tr>
                        <td colSpan={9} className="px-4 py-8 text-center text-gray-500 font-mono">
                          No teams match the current query criteria.
                        </td>
                      </tr>
                    ) : (
                      filteredTeams.map((team) => {
                        const leader = team.members?.find(m => m.is_leader) || team.members?.[0] || {};
                        return (
                          <tr key={team.id} className="hover:bg-white/5 transition-colors">
                            {/* Reg ID */}
                            <td className="px-4 py-3 font-orbitron font-bold text-[#FF3030]">
                              {team.registration_id}
                            </td>

                            {/* Team Name */}
                            <td className="px-4 py-3 font-semibold text-white">
                              {team.team_name}
                            </td>

                            {/* Category */}
                            <td className="px-4 py-3">
                              <span className={`px-2 py-0.5 rounded text-[10px] ${
                                team.college_type === 'Inter College'
                                  ? 'bg-blue-500/10 text-[#00d2ff] border border-blue-500/30'
                                  : 'bg-red-500/10 text-[#FF3030] border border-red-500/30'
                              }`}>
                                {team.college_type}
                              </span>
                            </td>

                            {/* Selected Domain */}
                            <td className="px-4 py-3 text-gray-300 max-w-xs truncate" title={team.selected_domain}>
                              {team.selected_domain}
                            </td>

                            {/* Leader */}
                            <td className="px-4 py-3">
                              <div className="font-semibold text-gray-200">{leader.name || 'N/A'}</div>
                              <div className="text-[10px] text-gray-500">{leader.phone}</div>
                              <div className="text-[10px] text-gray-500 truncate max-w-[150px]">{leader.college}</div>
                            </td>

                            {/* Members Count */}
                            <td className="px-4 py-3 text-center">
                              <span className="bg-white/10 px-2 py-1 rounded font-bold">
                                {team.members?.length || 0}
                              </span>
                            </td>

                            {/* Payment Toggle */}
                            <td className="px-4 py-3">
                              {(isMainAdmin || isOrganizing) ? (
                                <button
                                  onClick={() => handleTogglePayment(team.id, team.is_paid)}
                                  className={`px-2.5 py-1 rounded text-[10px] font-orbitron font-bold uppercase transition-all ${
                                    team.is_paid
                                      ? 'bg-green-500/20 text-green-400 border border-green-500 hover:bg-red-500/20 hover:text-red-400 hover:border-red-500'
                                      : 'bg-amber-500/20 text-amber-400 border border-amber-500 hover:bg-green-500/20 hover:text-green-400 hover:border-green-500'
                                  }`}
                                  title="Click to toggle payment status"
                                >
                                  {team.is_paid ? '✓ PAID' : '⏳ UNPAID'}
                                </button>
                              ) : (
                                <span className={`px-2.5 py-1 rounded text-[10px] font-orbitron font-bold uppercase ${
                                  team.is_paid ? 'text-green-400' : 'text-amber-400'
                                }`}>
                                  {team.is_paid ? 'PAID' : 'UNPAID'}
                                </span>
                              )}
                            </td>

                            {/* Status */}
                            <td className="px-4 py-3">
                              <span className="text-gray-300 bg-black/40 px-2 py-0.5 rounded border border-white/10 text-[10px]">
                                {team.status || 'Registered'}
                              </span>
                            </td>

                            {/* Actions */}
                            <td className="px-4 py-3 text-right space-x-2">
                              <button
                                onClick={() => setSelectedTeam(team)}
                                className="p-1.5 bg-[#141414] hover:bg-white/10 text-gray-300 hover:text-white rounded border border-white/10 transition-colors inline-block"
                                title="View Team Details"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </button>

                              {isMainAdmin && (
                                <button
                                  onClick={() => handleDeleteTeam(team.id, team.team_name)}
                                  className="p-1.5 bg-red-950/40 hover:bg-red-900 text-red-400 rounded border border-red-500/30 transition-colors inline-block"
                                  title="Delete Team (Admin Only)"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: COLLEGE & DOMAIN ANALYTICS BREAKDOWN */}
        {/* ========================================================================= */}
        {activeTab === 'analytics' && stats && (
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* College-wise Statistics */}
            <div className="bg-[#0e0e0e] border border-white/10 rounded-xl p-6 shadow-cyber-card">
              <h3 className="font-orbitron font-bold text-sm uppercase tracking-wider text-white mb-4 border-l-4 border-[#E50914] pl-2.5">
                College-Wise Participation Statistics
              </h3>
              
              <div className="space-y-3 font-mono text-xs">
                {Object.entries(stats.collegeMap || {}).length === 0 ? (
                  <div className="text-gray-500">No college data recorded yet.</div>
                ) : (
                  Object.entries(stats.collegeMap).map(([college, count], idx) => (
                    <div key={idx} className="flex items-center justify-between p-2.5 bg-[#141414] rounded border border-white/5">
                      <span className="text-gray-300 font-medium truncate max-w-xs">{college}</span>
                      <span className="bg-[#E50914]/20 border border-[#E50914] text-[#FF3030] font-bold px-2 py-0.5 rounded text-[11px]">
                        {count} Students
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Domain-wise Distribution */}
            <div className="bg-[#0e0e0e] border border-white/10 rounded-xl p-6 shadow-cyber-card">
              <h3 className="font-orbitron font-bold text-sm uppercase tracking-wider text-white mb-4 border-l-4 border-[#E50914] pl-2.5">
                Domain Distribution (Registered Teams)
              </h3>
              
              <div className="space-y-3 font-mono text-xs">
                {Object.entries(stats.domainMap || {}).length === 0 ? (
                  <div className="text-gray-500">No domain teams registered yet.</div>
                ) : (
                  Object.entries(stats.domainMap).map(([domain, count], idx) => (
                    <div key={idx} className="flex items-center justify-between p-2.5 bg-[#141414] rounded border border-white/5">
                      <span className="text-gray-300 font-medium truncate max-w-xs">{domain}</span>
                      <span className="bg-blue-500/20 border border-blue-500 text-[#00d2ff] font-bold px-2 py-0.5 rounded text-[11px]">
                        {count} Teams
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

          </section>
        )}

        {/* ========================================================================= */}
        {/* INDIVIDUAL TEAM DETAILS MODAL */}
        {/* ========================================================================= */}
        {selectedTeam && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md animate-fadeIn">
            <div className="relative w-full max-w-3xl bg-[#0e0e0e] border-2 border-[#E50914] rounded-2xl shadow-neon-red-lg overflow-hidden max-h-[90vh] flex flex-col">
              
              {/* Modal Header */}
              <div className="flex items-center justify-between px-6 py-4 bg-[#140204] border-b border-[#E50914]/50">
                <div>
                  <span className="text-[10px] font-mono text-[#FF3030] uppercase">
                    REGISTRATION RECORD #{selectedTeam.registration_id}
                  </span>
                  <h2 className="text-xl font-orbitron font-extrabold text-white">
                    {selectedTeam.team_name}
                  </h2>
                </div>
                <button
                  onClick={() => setSelectedTeam(null)}
                  className="p-1.5 text-gray-400 hover:text-white rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Scroll Content */}
              <div className="p-6 overflow-y-auto space-y-6 text-xs text-gray-300">
                
                {/* Meta details */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#141414] p-4 rounded-xl border border-white/10 font-mono">
                  <div>
                    <span className="text-gray-500 block text-[10px]">CATEGORY</span>
                    <span className="text-white font-bold">{selectedTeam.college_type}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block text-[10px]">DOMAIN</span>
                    <span className="text-[#FF3030] font-bold truncate block">{selectedTeam.selected_domain}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block text-[10px]">PAYMENT</span>
                    <span className={selectedTeam.is_paid ? 'text-green-400 font-bold' : 'text-amber-400 font-bold'}>
                      {selectedTeam.is_paid ? 'PAID' : 'UNPAID'}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500 block text-[10px]">REGISTERED ON</span>
                    <span className="text-gray-300">{new Date(selectedTeam.created_at).toLocaleDateString('en-IN')}</span>
                  </div>
                </div>

                {/* Project proposal */}
                {(selectedTeam.project_title || selectedTeam.project_description) && (
                  <div className="bg-[#141414] p-4 rounded-xl border border-white/10 space-y-2">
                    <span className="font-orbitron font-bold text-white text-[11px] block uppercase text-[#FF3030]">
                      Proposed Project
                    </span>
                    {selectedTeam.project_title && (
                      <div className="text-sm font-semibold text-white">{selectedTeam.project_title}</div>
                    )}
                    {selectedTeam.project_description && (
                      <p className="text-gray-400 leading-relaxed text-xs">{selectedTeam.project_description}</p>
                    )}
                  </div>
                )}

                {/* Team Roster */}
                <div>
                  <h4 className="font-orbitron font-bold text-white text-xs uppercase mb-3">
                    Team Members ({selectedTeam.members?.length || 0})
                  </h4>
                  <div className="space-y-2">
                    {(selectedTeam.members || []).map((m, idx) => (
                      <div key={idx} className="bg-[#141414] border border-white/5 rounded-lg p-3 font-mono flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <div className="font-bold text-white text-sm flex items-center space-x-2">
                            <span>{m.name}</span>
                            <span className={`text-[9px] px-2 py-0.5 rounded ${
                              m.is_leader ? 'bg-[#E50914]/30 text-[#FF3030] border border-[#E50914]' : 'bg-white/5 text-gray-400'
                            }`}>
                              {m.is_leader ? 'LEADER' : `MEMBER ${idx + 1}`}
                            </span>
                          </div>
                          <div className="text-gray-400 text-xs mt-0.5">{m.college}</div>
                          <div className="text-gray-500 text-[10px]">{m.department} • {m.year_of_study}</div>
                        </div>

                        <div className="text-left sm:text-right text-gray-400 text-xs">
                          <div>{m.email}</div>
                          <div className="text-[#FF3030]">{m.phone}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Status Update Controls */}
                <div className="bg-[#140003] border border-[#E50914]/30 p-4 rounded-xl flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <span className="text-[10px] font-mono text-gray-400 uppercase block mb-1">
                      Update Verification Status:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {['Registered', 'Confirmed', 'Under Review', 'Selected', 'Rejected'].map(s => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => handleUpdateStatus(selectedTeam.id, s)}
                          className={`px-2.5 py-1 rounded text-[10px] font-orbitron transition-colors ${
                            selectedTeam.status === s
                              ? 'bg-[#E50914] text-white font-bold'
                              : 'bg-black/50 text-gray-400 hover:text-white border border-white/10'
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <button
                      type="button"
                      onClick={() => handleTogglePayment(selectedTeam.id, selectedTeam.is_paid)}
                      className={`px-4 py-2 rounded text-xs font-orbitron font-bold uppercase transition-all ${
                        selectedTeam.is_paid
                          ? 'bg-amber-600/30 text-amber-300 border border-amber-500 hover:bg-amber-600'
                          : 'bg-green-600/30 text-green-300 border border-green-500 hover:bg-green-600'
                      }`}
                    >
                      Toggle to {selectedTeam.is_paid ? 'UNPAID' : 'PAID'}
                    </button>
                  </div>
                </div>

              </div>

              {/* Modal Footer */}
              <div className="px-6 py-3 bg-[#140204] border-t border-[#E50914]/40 flex items-center justify-between">
                <button
                  onClick={() => setSelectedTeam(null)}
                  className="px-4 py-1.5 border border-white/20 text-gray-300 hover:text-white rounded text-xs font-orbitron"
                >
                  Close Record
                </button>

                {isMainAdmin && (
                  <button
                    onClick={() => handleDeleteTeam(selectedTeam.id, selectedTeam.team_name)}
                    className="px-4 py-1.5 bg-red-900/60 hover:bg-red-800 text-white rounded text-xs font-orbitron font-bold flex items-center space-x-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete Record</span>
                  </button>
                )}
              </div>

            </div>
          </div>
        )}

      </main>
    </div>
  );
}
