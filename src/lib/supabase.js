import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl !== 'https://your-project-id.supabase.co' &&
  supabaseAnonKey !== 'your-anon-key-here'
);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Initial seed teams for when using local storage fallback mode
const DEFAULT_TEAMS = [
  {
    id: "f8d31a5b-9a41-4509-b68a-c322b271d001",
    registration_id: "NERO-2026-1049",
    team_name: "Neural Voyagers",
    college_type: "Inter College",
    selected_domain: "AI in Healthcare",
    project_title: "CerebroScan - Realtime Glioblastoma Detection via Edge Vision",
    project_description: "An offline edge-computed CNN inference engine that assists radiologists in rapid cranial trauma and tumor detection within under 4 seconds.",
    is_paid: true,
    payment_reference: "UPI/2026/8941092841",
    status: "Confirmed",
    created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
    members: [
      {
        id: "m-101",
        name: "Aravind Subramanian",
        email: "aravind.subramanian@gmail.com",
        phone: "9840123456",
        college: "PSG College of Technology",
        department: "Computer Science & Engineering",
        year_of_study: "3rd Year",
        is_leader: true,
      },
      {
        id: "m-102",
        name: "Keerthana Ramesh",
        email: "keerthana.ramesh@gmail.com",
        phone: "9840123457",
        college: "PSG College of Technology",
        department: "Biomedical Engineering",
        year_of_study: "3rd Year",
        is_leader: false,
      },
      {
        id: "m-103",
        name: "Sanjay Kumar",
        email: "sanjay.k@gmail.com",
        phone: "9840123458",
        college: "PSG College of Technology",
        department: "Information Technology",
        year_of_study: "2nd Year",
        is_leader: false,
      }
    ]
  },
  {
    id: "f8d31a5b-9a41-4509-b68a-c322b271d002",
    registration_id: "NERO-2026-2184",
    team_name: "CyberSentinels",
    college_type: "Intra College",
    selected_domain: "Cybersecurity and Digital Safety",
    project_title: "ZeroTrust Mesh Sentinel with Adversarial LLM Defense",
    project_description: "Autonomous packet inspection node that halts prompt injection and zero-day MITM attacks in real-time edge gateways.",
    is_paid: true,
    payment_reference: "UPI/2026/7483920194",
    status: "Confirmed",
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    members: [
      {
        id: "m-201",
        name: "Pranav Venkatesh",
        email: "pranav.v@gmail.com",
        phone: "9876543210",
        college: "Hindusthan College of Engineering and Technology",
        department: "Artificial Intelligence & Data Science",
        year_of_study: "Final Year",
        is_leader: true,
      },
      {
        id: "m-202",
        name: "Divya Bharathi",
        email: "divya.b@gmail.com",
        phone: "9876543211",
        college: "Hindusthan College of Engineering and Technology",
        department: "Computer Science & Engineering",
        year_of_study: "Final Year",
        is_leader: false,
      }
    ]
  },
  {
    id: "f8d31a5b-9a41-4509-b68a-c322b271d003",
    registration_id: "NERO-2026-3401",
    team_name: "AgriVision AI",
    college_type: "Inter College",
    selected_domain: "Smart Agriculture",
    project_title: "DroneSense: Autonomous Hyperspectral Crop Blight Mitigation",
    project_description: "Multispectral drone imaging integrated with micro-controller chemical sprayers for precision fungicide application.",
    is_paid: false,
    payment_reference: "",
    status: "Registered",
    created_at: new Date(Date.now() - 86400000 * 1).toISOString(),
    members: [
      {
        id: "m-301",
        name: "Gokul Nath",
        email: "gokul.nath@gmail.com",
        phone: "9443128941",
        college: "Coimbatore Institute of Technology",
        department: "Electronics & Communication Engineering",
        year_of_study: "3rd Year",
        is_leader: true,
      },
      {
        id: "m-302",
        name: "Harini Sundaram",
        email: "harini.sundaram@gmail.com",
        phone: "9443128942",
        college: "Coimbatore Institute of Technology",
        department: "Agricultural Engineering",
        year_of_study: "3rd Year",
        is_leader: false,
      },
      {
        id: "m-303",
        name: "Vignesh Murugan",
        email: "vignesh.m@gmail.com",
        phone: "9443128943",
        college: "Coimbatore Institute of Technology",
        department: "Computer Science & Engineering",
        year_of_study: "3rd Year",
        is_leader: false,
      },
      {
        id: "m-304",
        name: "Deepa Lakshmi",
        email: "deepa.lakshmi@gmail.com",
        phone: "9443128944",
        college: "Coimbatore Institute of Technology",
        department: "Information Technology",
        year_of_study: "2nd Year",
        is_leader: false,
      }
    ]
  },
  {
    id: "f8d31a5b-9a41-4509-b68a-c322b271d004",
    registration_id: "NERO-2026-4729",
    team_name: "Quantum Ledger",
    college_type: "Inter College",
    selected_domain: "FinTech and Business Intelligence",
    project_title: "DeFi FraudShield: Graph Neural Network Transaction Anomaly Radar",
    project_description: "Graph neural network auditing protocol analyzing token transfer topology to prevent rug-pulls and flash-loan exploits.",
    is_paid: true,
    payment_reference: "UPI/2026/1948302819",
    status: "Confirmed",
    created_at: new Date(Date.now() - 43200000).toISOString(),
    members: [
      {
        id: "m-401",
        name: "Rohit Krishnan",
        email: "rohit.k@gmail.com",
        phone: "9789123450",
        college: "Kumaraguru College of Technology",
        department: "Computer Science & Engineering",
        year_of_study: "Final Year",
        is_leader: true,
      },
      {
        id: "m-402",
        name: "Nithya Sri",
        email: "nithya.sri@gmail.com",
        phone: "9789123451",
        college: "Kumaraguru College of Technology",
        department: "Information Technology",
        year_of_study: "Final Year",
        is_leader: false,
      }
    ]
  },
  {
    id: "f8d31a5b-9a41-4509-b68a-c322b271d005",
    registration_id: "NERO-2026-5912",
    team_name: "Synapse Mobility",
    college_type: "Intra College",
    selected_domain: "Smart Cities and Transportation",
    project_title: "GreenWave AI: Emergency Corridor Adaptive Traffic Grid",
    project_description: "Computer vision and V2X telemetry system that dynamically clears multi-junction green light corridors for ambulances in under 12 seconds.",
    is_paid: false,
    payment_reference: "",
    status: "Registered",
    created_at: new Date(Date.now() - 14400000).toISOString(),
    members: [
      {
        id: "m-501",
        name: "Karthik Raj",
        email: "karthik.raj@gmail.com",
        phone: "9123456780",
        college: "Hindusthan College of Engineering and Technology",
        department: "Electrical & Electronics Engineering",
        year_of_study: "3rd Year",
        is_leader: true,
      },
      {
        id: "m-502",
        name: "Sneha Priya",
        email: "sneha.priya@gmail.com",
        phone: "9123456781",
        college: "Hindusthan College of Engineering and Technology",
        department: "Computer Science & Engineering",
        year_of_study: "3rd Year",
        is_leader: false,
      },
      {
        id: "m-503",
        name: "Abhinav Mohan",
        email: "abhinav.m@gmail.com",
        phone: "9123456782",
        college: "Hindusthan College of Engineering and Technology",
        department: "Mechanical Engineering",
        year_of_study: "3rd Year",
        is_leader: false,
      }
    ]
  }
];

const STORAGE_KEY = 'neronova_2026_teams_db';

function getStoredTeams() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_TEAMS));
      return DEFAULT_TEAMS;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.warn('LocalStorage access issue, using in-memory defaults', err);
    return DEFAULT_TEAMS;
  }
}

function saveStoredTeams(teams) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(teams));
  } catch (err) {
    console.warn('Failed to save to localStorage', err);
  }
}

// Generate unique registration ID
export function generateRegistrationId() {
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `NERO-2026-${randomNum}`;
}

// Duplicate check
export async function checkDuplicates({ email, phone, teamName }) {
  if (isSupabaseConfigured) {
    try {
      // Check team name
      const { data: teamMatches } = await supabase
        .from('teams')
        .select('id, team_name')
        .ilike('team_name', teamName.trim());

      if (teamMatches && teamMatches.length > 0) {
        return { duplicate: true, field: 'team_name', message: 'Team Name already registered' };
      }

      // Check member emails or phones
      const { data: emailMatches } = await supabase
        .from('team_members')
        .select('id, email')
        .ilike('email', email.trim());

      if (emailMatches && emailMatches.length > 0) {
        return { duplicate: true, field: 'email', message: 'Email address already registered' };
      }

      const { data: phoneMatches } = await supabase
        .from('team_members')
        .select('id, phone')
        .eq('phone', phone.trim());

      if (phoneMatches && phoneMatches.length > 0) {
        return { duplicate: true, field: 'phone', message: 'Phone number already registered' };
      }

      return { duplicate: false };
    } catch (e) {
      console.error('Supabase duplicate check failed, checking local records', e);
    }
  }

  // Local check
  const teams = getStoredTeams();
  const lowerTeamName = teamName.trim().toLowerCase();
  const teamExists = teams.some(t => t.team_name.toLowerCase() === lowerTeamName);
  if (teamExists) return { duplicate: true, field: 'team_name', message: 'Team Name is already taken' };

  for (const team of teams) {
    for (const m of (team.members || [])) {
      if (m.email.toLowerCase() === email.trim().toLowerCase()) {
        return { duplicate: true, field: 'email', message: `Email (${email}) is already registered with team ${team.team_name}` };
      }
      if (m.phone === phone.trim()) {
        return { duplicate: true, field: 'phone', message: `Phone number (${phone}) is already registered with team ${team.team_name}` };
      }
    }
  }

  return { duplicate: false };
}

// Register team
export async function registerTeam(teamData, membersData) {
  const regId = generateRegistrationId();
  const newTeam = {
    ...teamData,
    registration_id: regId,
    status: 'Registered',
    is_paid: false,
    created_at: new Date().toISOString()
  };

  if (isSupabaseConfigured) {
    try {
      const { data: insertedTeam, error: teamErr } = await supabase
        .from('teams')
        .insert([{
          registration_id: regId,
          team_name: teamData.team_name,
          college_type: teamData.college_type,
          selected_domain: teamData.selected_domain,
          project_title: teamData.project_title || null,
          project_description: teamData.project_description || null,
          is_paid: false,
          status: 'Registered'
        }])
        .select()
        .single();

      if (teamErr) throw teamErr;

      // Insert members
      const membersToInsert = membersData.map((m, index) => ({
        team_id: insertedTeam.id,
        is_leader: index === 0,
        name: m.name,
        email: m.email,
        phone: m.phone,
        college: m.college,
        department: m.department,
        year_of_study: m.year_of_study
      }));

      const { error: membersErr } = await supabase
        .from('team_members')
        .insert(membersToInsert);

      if (membersErr) throw membersErr;

      return {
        success: true,
        registration_id: regId,
        team_id: insertedTeam.id
      };
    } catch (err) {
      console.error('Supabase registration failed, saving locally:', err);
    }
  }

  // Local fallback
  const teams = getStoredTeams();
  const teamId = `team-${Date.now()}`;
  const localRecord = {
    ...newTeam,
    id: teamId,
    members: membersData.map((m, idx) => ({
      ...m,
      id: `mem-${Date.now()}-${idx}`,
      is_leader: idx === 0
    }))
  };

  teams.unshift(localRecord);
  saveStoredTeams(teams);

  return {
    success: true,
    registration_id: regId,
    team_id: teamId
  };
}

// Fetch all registered teams with member data
export async function fetchAllTeams() {
  if (isSupabaseConfigured) {
    try {
      const { data: teamsData, error: teamsErr } = await supabase
        .from('teams')
        .select(`
          *,
          members:team_members(*)
        `)
        .order('created_at', { ascending: false });

      if (!teamsErr && teamsData) {
        return teamsData;
      }
    } catch (err) {
      console.error('Supabase fetch failed, falling back to local records', err);
    }
  }

  return getStoredTeams();
}

// Compute live real statistics directly from database records
export async function getRealDatabaseStatistics() {
  const teams = await fetchAllTeams();
  
  let totalMembers = 0;
  let interCollege = 0;
  let intraCollege = 0;
  let paidTeams = 0;
  let unpaidTeams = 0;
  const collegeMap = {};
  const domainMap = {};

  teams.forEach(team => {
    const memberCount = (team.members && team.members.length) || 0;
    totalMembers += memberCount;

    if (team.college_type === 'Inter College') {
      interCollege += 1;
    } else {
      intraCollege += 1;
    }

    if (team.is_paid) {
      paidTeams += 1;
    } else {
      unpaidTeams += 1;
    }

    // Domain distribution
    const domain = team.selected_domain || 'Unspecified';
    domainMap[domain] = (domainMap[domain] || 0) + 1;

    // College distribution (track all unique colleges from members)
    if (team.members && team.members.length > 0) {
      team.members.forEach(m => {
        const college = m.college?.trim() || 'Unknown College';
        collegeMap[college] = (collegeMap[college] || 0) + 1;
      });
    }
  });

  return {
    totalTeams: teams.length,
    totalMembers,
    interCollege,
    intraCollege,
    paidTeams,
    unpaidTeams,
    collegeMap,
    domainMap,
    teams
  };
}

// Update payment status
export async function updatePaymentStatus(teamId, isPaid, paymentRef = '') {
  if (isSupabaseConfigured) {
    try {
      const { error } = await supabase
        .from('teams')
        .update({ 
          is_paid: isPaid,
          payment_reference: paymentRef || (isPaid ? 'ADMIN-VERIFIED' : '')
        })
        .eq('id', teamId);
      if (!error) return { success: true };
    } catch (err) {
      console.error('Supabase payment update failed', err);
    }
  }

  const teams = getStoredTeams();
  const idx = teams.findIndex(t => t.id === teamId);
  if (idx !== -1) {
    teams[idx].is_paid = isPaid;
    teams[idx].payment_reference = paymentRef || (isPaid ? 'ADMIN-VERIFIED' : '');
    saveStoredTeams(teams);
    return { success: true };
  }
  return { success: false, error: 'Team not found' };
}

// Update review/verification status
export async function updateTeamStatus(teamId, newStatus) {
  if (isSupabaseConfigured) {
    try {
      const { error } = await supabase
        .from('teams')
        .update({ status: newStatus })
        .eq('id', teamId);
      if (!error) return { success: true };
    } catch (err) {
      console.error('Supabase status update failed', err);
    }
  }

  const teams = getStoredTeams();
  const idx = teams.findIndex(t => t.id === teamId);
  if (idx !== -1) {
    teams[idx].status = newStatus;
    saveStoredTeams(teams);
    return { success: true };
  }
  return { success: false, error: 'Team not found' };
}

// Delete team (Main Admin only)
export async function deleteTeam(teamId) {
  if (isSupabaseConfigured) {
    try {
      const { error } = await supabase
        .from('teams')
        .delete()
        .eq('id', teamId);
      if (!error) return { success: true };
    } catch (err) {
      console.error('Supabase delete failed', err);
    }
  }

  const teams = getStoredTeams();
  const filtered = teams.filter(t => t.id !== teamId);
  saveStoredTeams(filtered);
  return { success: true };
}
