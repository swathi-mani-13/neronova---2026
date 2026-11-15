import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from './supabase';

const AuthContext = createContext(null);

export const ADMIN_ROLES = {
  MAIN_ADMIN: 'Main Admin'
};

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Sync session with Supabase Auth on application initialization
  useEffect(() => {
    let mounted = true;

    async function checkCurrentSession() {
      if (!isSupabaseConfigured) {
        setLoading(false);
        return;
      }

      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;

        if (session && session.user && mounted) {
          // Fetch authorized Main Admin profile
          const { data: profile, error: profErr } = await supabase
            .from('admin_profiles')
            .select('role, full_name')
            .eq('user_id', session.user.id)
            .single();

          if (!profErr && profile && profile.role === ADMIN_ROLES.MAIN_ADMIN) {
            setCurrentUser({
              id: session.user.id,
              email: session.user.email,
              name: profile.full_name || 'Main Admin',
              role: ADMIN_ROLES.MAIN_ADMIN
            });
          } else {
            // Not a verified Main Admin
            await supabase.auth.signOut();
            setCurrentUser(null);
          }
        }
      } catch (err) {
        console.error('Session verification error:', err);
        if (mounted) setCurrentUser(null);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    checkCurrentSession();

    // Listen for auth state changes
    let authListener = null;
    if (isSupabaseConfigured) {
      const { data: sub } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (event === 'SIGNED_OUT' || !session) {
          if (mounted) setCurrentUser(null);
        }
      });
      authListener = sub?.subscription;
    }

    return () => {
      mounted = false;
      if (authListener) authListener.unsubscribe();
    };
  }, []);

  // Secure Supabase Authentication & Main Admin Verification
  const login = async (email, password) => {
    setLoading(true);

    if (!isSupabaseConfigured) {
      setLoading(false);
      return {
        success: false,
        error: 'Database is not connected. Please verify your VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.'
      };
    }

    try {
      // 1. Authenticate with Supabase Auth
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password
      });

      if (error) {
        setLoading(false);
        return {
          success: false,
          error: error.message || 'Authentication failed. Please verify your credentials.'
        };
      }

      if (!data || !data.user) {
        setLoading(false);
        return {
          success: false,
          error: 'No user data received from authentication service.'
        };
      }

      // 2. Fetch role and permissions from public.admin_profiles table
      const { data: profile, error: profileError } = await supabase
        .from('admin_profiles')
        .select('role, full_name')
        .eq('user_id', data.user.id)
        .single();

      if (profileError || !profile) {
        console.warn('Authenticated user is not in admin_profiles:', profileError);
        await supabase.auth.signOut();
        setLoading(false);
        return {
          success: false,
          error: 'Access Denied: This account is authenticated but does not possess an assigned role in the admin_profiles table.'
        };
      }

      // 3. Strictly enforce Main Admin role only
      if (profile.role !== ADMIN_ROLES.MAIN_ADMIN) {
        await supabase.auth.signOut();
        setLoading(false);
        return {
          success: false,
          error: 'Access Denied: Only Main Admin accounts are authorized to access the Admin Portal.'
        };
      }

      const userObj = {
        id: data.user.id,
        email: data.user.email,
        name: profile.full_name || 'Main Admin',
        role: ADMIN_ROLES.MAIN_ADMIN
      };

      setCurrentUser(userObj);
      setLoading(false);
      return { success: true, user: userObj };

    } catch (err) {
      console.error('Login process exception:', err);
      setLoading(false);
      return {
        success: false,
        error: err.message || 'An unexpected authentication error occurred.'
      };
    }
  };

  // Secure Logout
  const logout = async () => {
    if (isSupabaseConfigured) {
      try {
        await supabase.auth.signOut();
      } catch (e) {
        console.warn('Sign out warning:', e);
      }
    }
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, logout, loading, ADMIN_ROLES }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
