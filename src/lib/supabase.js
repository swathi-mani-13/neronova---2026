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

// ==============================================================================
// STORAGE & DOCUMENT CONSTANTS
// ==============================================================================
export const REGISTRATION_DOCUMENTS_BUCKET = 'registration-documents';
export const MAX_DOCUMENT_FILE_SIZE = 5 * 1024 * 1024; // 5 MB maximum limit
export const ALLOWED_DOCUMENT_MIME_TYPES = [
  'image/jpeg', 
  'image/jpg', 
  'image/png', 
  'image/webp'
];
export const ALLOWED_DOCUMENT_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp'];

// Validate Document Uploads (Size <= 5MB, format: JPG, JPEG, PNG, WEBP)
export function validateDocumentFile(file, label = 'Document') {
  if (!file) {
    return { valid: false, error: `${label} is mandatory. Please select a valid file.` };
  }
  if (file.size > MAX_DOCUMENT_FILE_SIZE) {
    const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
    return { 
      valid: false, 
      error: `${label} exceeds the maximum allowed size of 5 MB (Current size: ${sizeMB} MB). Please compress or choose a smaller image.` 
    };
  }
  const extension = file.name ? file.name.split('.').pop()?.toLowerCase() : '';
  const isMimeValid = ALLOWED_DOCUMENT_MIME_TYPES.includes(file.type?.toLowerCase());
  const isExtValid = ALLOWED_DOCUMENT_EXTENSIONS.includes(extension);

  if (!isMimeValid && !isExtValid) {
    return { 
      valid: false, 
      error: `${label} format is invalid. Allowed formats: JPG, JPEG, PNG, WEBP.` 
    };
  }

  return { valid: true };
}

// Upload a document to private Supabase Storage bucket
export async function uploadRegistrationDocument(file, folder, regId) {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase is not configured. Document upload aborted.');
  }

  const ext = (file.name ? file.name.split('.').pop()?.toLowerCase() : '') || 'jpg';
  const cleanReg = regId.replace(/[^a-zA-Z0-9_-]/g, '_');
  const uniqueName = `${cleanReg}_${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${ext}`;
  const filePath = `${folder}/${uniqueName}`;

  const { data, error } = await supabase.storage
    .from(REGISTRATION_DOCUMENTS_BUCKET)
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false
    });

  if (error) {
    console.error(`Supabase storage upload error (${folder}):`, error);
    throw new Error(`Failed to upload ${folder === 'id-cards' ? 'Team Leader College ID Card' : 'Payment Screenshot'}: ${error.message}`);
  }

  return data?.path || filePath;
}

// Get temporary signed URL for a private document (Main Admin Only)
export async function getDocumentSignedUrl(filePath, expiresIn = 300) {
  if (!isSupabaseConfigured || !filePath) {
    return { success: false, error: 'Invalid document path or Supabase unconfigured.' };
  }

  try {
    const { data, error } = await supabase.storage
      .from(REGISTRATION_DOCUMENTS_BUCKET)
      .createSignedUrl(filePath, expiresIn);

    if (error) {
      console.error('Error generating signed URL:', error);
      return { success: false, error: error.message };
    }

    return { success: true, signedUrl: data.signedUrl };
  } catch (err) {
    console.error('Exception generating signed URL:', err);
    return { success: false, error: err.message || 'Failed to generate signed document URL.' };
  }
}

// Generate unique registration ID: NERO-2026-XXXX
export function generateRegistrationId() {
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `NERO-2026-${randomNum}`;
}

// Generate client-side UUID v4 safe across all environments
function generateUUID() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// Check duplicates securely via database RPC without exposing participant records
export async function checkDuplicates({ email, phone, teamName }) {
  if (!isSupabaseConfigured) {
    return { 
      duplicate: false, 
      warning: 'Database unconfigured. Real-time duplicate verification requires active Supabase connection.' 
    };
  }

  try {
    const cleanPhone = phone.replace(/[^0-9]/g, '');

    // Call secure PostgreSQL RPC to check duplicates without reading participant tables
    const { data: rpcData, error: rpcErr } = await supabase.rpc('check_registration_duplicates', {
      p_team_name: teamName.trim(),
      p_email: email.trim(),
      p_phone: cleanPhone
    });

    if (!rpcErr && rpcData) {
      return rpcData;
    }

    // Fallback: If RPC is not available yet, return false and let database unique constraints validate
    return { duplicate: false };
  } catch (err) {
    console.warn('Duplicate check call exception:', err);
    return { duplicate: false };
  }
}

// Register Team & Members in Supabase
// Uses client-generated teamId to avoid needing public SELECT permissions on teams/members
export async function registerTeam(teamData, membersData, documents = {}) {
  if (!isSupabaseConfigured) {
    return {
      success: false,
      error: 'Supabase database is not configured. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file to enable live registration.'
    };
  }

  const regId = generateRegistrationId();
  const teamId = generateUUID();

  try {
    // 0. Validate Mandatory Document Uploads
    const idCardValidation = validateDocumentFile(documents?.idCardFile, 'Team Leader College ID Card');
    if (!idCardValidation.valid) {
      return { success: false, error: idCardValidation.error };
    }

    const paymentValidation = validateDocumentFile(documents?.paymentFile, 'Payment Screenshot');
    if (!paymentValidation.valid) {
      return { success: false, error: paymentValidation.error };
    }

    // 1. Upload Mandatory Documents to Private Supabase Storage FIRST
    let idCardPath = null;
    let paymentScreenshotPath = null;
    try {
      idCardPath = await uploadRegistrationDocument(documents.idCardFile, 'id-cards', regId);
      paymentScreenshotPath = await uploadRegistrationDocument(documents.paymentFile, 'payments', regId);
    } catch (uploadErr) {
      console.error('Document upload failure:', uploadErr);
      return {
        success: false,
        error: `Mandatory Document Upload Failed: ${uploadErr.message}. Registration was stopped to protect submission integrity.`
      };
    }

    // 2. Insert Team (No select needed, client knows teamId upfront)
    const { error: teamErr } = await supabase
      .from('teams')
      .insert([{
        id: teamId,
        registration_id: regId,
        team_name: teamData.team_name.trim(),
        college_type: teamData.college_type,
        selected_domain: teamData.selected_domain,
        project_title: teamData.project_title ? teamData.project_title.trim() : null,
        project_description: teamData.project_description ? teamData.project_description.trim() : null,
        id_card_path: idCardPath,
        payment_screenshot_path: paymentScreenshotPath,
        is_paid: false,
        payment_reference: '',
        status: 'Registered'
      }]);

    if (teamErr) {
      console.error('Supabase team insertion error:', teamErr);
      // Clean up uploaded files in case of database error
      try {
        await supabase.storage.from(REGISTRATION_DOCUMENTS_BUCKET).remove([idCardPath, paymentScreenshotPath]);
      } catch (cleanupErr) {
        console.warn('Storage cleanup warning:', cleanupErr);
      }

      if (teamErr.code === '23505' || teamErr.message?.includes('unique')) {
        return {
          success: false,
          error: `Registration conflict: Team name "${teamData.team_name.trim()}" is already registered. Please choose another name.`
        };
      }
      return {
        success: false,
        error: `Database error during team registration: ${teamErr.message}`
      };
    }

    // 3. Insert Team Members
    const membersToInsert = membersData.map((m, index) => ({
      id: generateUUID(),
      team_id: teamId,
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
      // Clean up uploaded files in case of members error
      try {
        await supabase.storage.from(REGISTRATION_DOCUMENTS_BUCKET).remove([idCardPath, paymentScreenshotPath]);
      } catch (cleanupErr) {
        console.warn('Storage cleanup warning:', cleanupErr);
      }

      if (membersErr.code === '23505' || membersErr.message?.includes('unique')) {
        return {
          success: false,
          error: 'Registration conflict: One of the participant emails or phone numbers is already registered with another team.'
        };
      }
      return {
        success: false,
        error: `Database error during team members registration: ${membersErr.message}`
      };
    }

    return {
      success: true,
      registration_id: regId,
      team_id: teamId,
      id_card_path: idCardPath,
      payment_screenshot_path: paymentScreenshotPath
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
        id: generateUUID(),
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

// Fetch all registered teams with member data (Authenticated Admin Only)
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

// Compute live real statistics directly from database records (Admin Only)
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

// Update payment status in Supabase (Admin Only)
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

// Update review/verification status in Supabase (Admin Only)
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
export async function deleteTeam(teamId, documentPaths = []) {
  if (!isSupabaseConfigured) {
    return { success: false, error: 'Database is not connected.' };
  }

  try {
    // If document paths are provided, clean up files from private storage
    if (Array.isArray(documentPaths) && documentPaths.length > 0) {
      const validPaths = documentPaths.filter(p => typeof p === 'string' && p.trim().length > 0);
      if (validPaths.length > 0) {
        try {
          await supabase.storage.from(REGISTRATION_DOCUMENTS_BUCKET).remove(validPaths);
        } catch (storageErr) {
          console.warn('Storage cleanup notice during team deletion:', storageErr);
        }
      }
    }

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
