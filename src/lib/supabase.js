import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl !== 'https://your-project-id.supabase.co' &&
  supabaseAnonKey !== 'your-anon-key-here' &&
  supabaseAnonKey !== 'your-anon-public-key-here' &&
  typeof supabaseUrl === 'string' &&
  supabaseUrl.startsWith('https://')
);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true
      }
    })
  : null;

// Generate unique registration ID: NERO-2026-XXXX
export function generateRegistrationId() {
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `NERO-2026-${randomNum}`;
}

// Check duplicates directly against live database
export async function checkDuplicates({ email, phone, teamName }) {
  if (!isSupabaseConfigured) {
    // If database is not configured, warn the user rather than claiming success
    return { 
      duplicate: false, 
      warning: 'Database unconfigured. Real-time duplicate verification requires active Supabase connection.' 
    };
  }

  try {
    // 1. Check Team Name
    const { data: teamMatches, error: teamErr } = await supabase
      .from('teams')
      .select('id, team_name')
      .ilike('team_name', teamName.trim());

    if (teamErr) throw teamErr;

    if (teamMatches && teamMatches.length > 0) {
      return { 
        duplicate: true, 
        field: 'team_name', 
        message: `Team Name "${teamName.trim()}" is already registered. Please choose a unique team name.` 
      };
    }

    // 2. Check Member Email
    const { data: emailMatches, error: emailErr } = await supabase
      .from('team_members')
      .select('id, email')
      .ilike('email', email.trim());

    if (emailErr) throw emailErr;

    if (emailMatches && emailMatches.length > 0) {
      return { 
        duplicate: true, 
        field: 'email', 
        message: `Email address "${email.trim()}" is already registered with an existing team.` 
      };
    }

    // 3. Check Member Phone
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    const { data: phoneMatches, error: phoneErr } = await supabase
      .from('team_members')
      .select('id, phone')
      .eq('phone', cleanPhone);

    if (phoneErr) throw phoneErr;

    if (phoneMatches && phoneMatches.length > 0) {
      return { 
        duplicate: true, 
        field: 'phone', 
        message: `Phone number "${cleanPhone}" is already registered with an existing team.` 
      };
    }

    return { duplicate: false };
  } catch (err) {
    console.error('Supabase duplicate check query failed:', err);
    return {
      duplicate: false,
      error: `Database check error: ${err.message}`
    };
  }
}

// Register Team & Members in a strict transactional flow into Supabase
export async function registerTeam(teamData, membersData) {
  if (!isSupabaseConfigured) {
    return {
      success: false,
      error: 'Supabase database is not configured. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file to enable live registration.'
    };
  }

  const regId = generateRegistrationId();

  try {
    // 1. Insert Team
    const { data: insertedTeam, error: teamErr } = await supabase
      .from('teams')
      .insert([{
        registration_id: regId,
        team_name: teamData.team_name.trim(),
        college_type: teamData.college_type,
        selected_domain: teamData.selected_domain,
        project_title: teamData.project_title ? teamData.project_title.trim() : null,
        project_description: teamData.project_description ? teamData.project_description.trim() : null,
        is_paid: false,
        payment_reference: '',
        status: 'Registered'
      }])
      .select()
      .single();

    if (teamErr) {
      console.error('Supabase team insertion error:', teamErr);
      return {
        success: false,
        error: `Database error during team registration: ${teamErr.message}`
      };
    }

    // 2. Insert Team Members
    const membersToInsert = membersData.map((m, index) => ({
      team_id: insertedTeam.id,
      is_leader: index === 0,
      name: m.name.trim(),
      email: m.email.trim(),
      phone: m.phone.replace(/[^0-9]/g, ''),
      college: m.college.trim(),
      department: m.department.trim(),
      year_of_study: m.year_of_study
    }));

    const { error: membersErr } = await supabase
      .from('team_members')
      .insert(membersToInsert);

    if (membersErr) {
      console.error('Supabase members insertion error:', membersErr);
      // Clean up orphaned team record to maintain database consistency
      await supabase.from('teams').delete().eq('id', insertedTeam.id);
      return {
        success: false,
        error: `Database error during team members registration: ${membersErr.message}`
      };
    }

    return {
      success: true,
      registration_id: regId,
      team_id: insertedTeam.id
    };
  } catch (err) {
    console.error('Unexpected error during registration:', err);
    return {
      success: false,
      error: err.message || 'An unexpected error occurred while communicating with the database.'
    };
  }
}

// Submit Official Contact Enquiry to Supabase
export async function submitEnquiry(enquiryData) {
  if (!isSupabaseConfigured) {
    return {
      success: false,
      error: 'Supabase database is not configured. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file to enable enquiry transmission.'
    };
  }

  try {
    const { error } = await supabase
      .from('enquiries')
      .insert([{
        name: enquiryData.name.trim(),
        email: enquiryData.email.trim(),
        phone: enquiryData.phone.trim(),
        subject: enquiryData.subject.trim(),
        message: enquiryData.message.trim(),
        status: 'Pending'
      }]);

    if (error) {
      console.error('Supabase enquiry insertion error:', error);
      return {
        success: false,
        error: `Failed to save enquiry to database: ${error.message}`
      };
    }

    return { success: true };
  } catch (err) {
    console.error('Unexpected error submitting enquiry:', err);
    return {
      success: false,
      error: err.message || 'An unexpected error occurred while saving your enquiry.'
    };
  }
}

// Fetch all registered teams with member data directly from Supabase
export async function fetchAllTeams() {
  if (!isSupabaseConfigured) {
    return [];
  }

  try {
    const { data: teamsData, error: teamsErr } = await supabase
      .from('teams')
      .select(`
        *,
        members:team_members(*)
      `)
      .order('created_at', { ascending: false });

    if (teamsErr) {
      console.error('Failed to fetch teams from Supabase:', teamsErr);
      return [];
    }

    return teamsData || [];
  } catch (err) {
    console.error('Supabase teams fetch error:', err);
    return [];
  }
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

// Update payment status in Supabase
export async function updatePaymentStatus(teamId, isPaid, paymentRef = '') {
  if (!isSupabaseConfigured) {
    return { success: false, error: 'Database is not connected.' };
  }

  try {
    const { error } = await supabase
      .from('teams')
      .update({ 
        is_paid: isPaid,
        payment_reference: paymentRef || (isPaid ? 'ADMIN-VERIFIED' : ''),
        updated_at: new Date().toISOString()
      })
      .eq('id', teamId);

    if (error) throw error;
    return { success: true };
  } catch (err) {
    console.error('Supabase payment update failed:', err);
    return { success: false, error: err.message };
  }
}

// Update review/verification status in Supabase
export async function updateTeamStatus(teamId, newStatus) {
  if (!isSupabaseConfigured) {
    return { success: false, error: 'Database is not connected.' };
  }

  try {
    const { error } = await supabase
      .from('teams')
      .update({ 
        status: newStatus,
        updated_at: new Date().toISOString()
      })
      .eq('id', teamId);

    if (error) throw error;
    return { success: true };
  } catch (err) {
    console.error('Supabase status update failed:', err);
    return { success: false, error: err.message };
  }
}

// Delete team from Supabase (Main Admin role only)
export async function deleteTeam(teamId) {
  if (!isSupabaseConfigured) {
    return { success: false, error: 'Database is not connected.' };
  }

  try {
    const { error } = await supabase
      .from('teams')
      .delete()
      .eq('id', teamId);

    if (error) throw error;
    return { success: true };
  } catch (err) {
    console.error('Supabase delete failed:', err);
    return { success: false, error: err.message };
  }
}
