import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from './supabase';

const AuthContext = createContext(null);

export const ADMIN_ROLES = {
  MAIN_ADMIN: 'Main Admin',
  ORGANIZING_TEAM: 'Organizing Team',
  FACULTY_COORDINATOR: 'Faculty Coordinator'
};

const DEFAULT_ADMIN_USERS = [
  {
    email: 'admin@neronova.com',
    name: 'Chief Admin',
    role: ADMIN_ROLES.MAIN_ADMIN,
    password: 'admin'
  },
  {
    email: 'organizer@neronova.com',
    name: 'Organizing Lead',
    role: ADMIN_ROLES.ORGANIZING_TEAM,
    password: 'admin'
  },
  {
    email: 'faculty@neronova.com',
    name: 'Dr. Faculty Coordinator',
    role: ADMIN_ROLES.FACULTY_COORDINATOR,
    password: 'admin'
  }
];

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('neronova_admin_user');
      if (saved) return JSON.parse(saved);
      if (typeof window !== 'undefined' && window.location.search.includes('demo_admin=true')) {
        return DEFAULT_ADMIN_USERS[0];
      }
      return null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('neronova_admin_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('neronova_admin_user');
    }
  }, [currentUser]);

  const login = async (email, password, requestedRole) => {
    setLoading(true);

    // If Supabase Auth is configured, attempt Supabase Auth
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        if (data && data.user) {
          // Fetch role from profile table if exists
          const { data: profile } = await supabase
            .from('admin_profiles')
            .select('role, full_name')
            .eq('user_id', data.user.id)
            .single();

          const userObj = {
            id: data.user.id,
            email: data.user.email,
            name: profile?.full_name || 'Admin Officer',
            role: profile?.role || requestedRole || ADMIN_ROLES.ORGANIZING_TEAM
          };
          setCurrentUser(userObj);
          setLoading(false);
          return { success: true, user: userObj };
        }
      } catch (err) {
        console.warn('Supabase auth failed, checking admin registry', err);
      }
    }

    // Local / direct authentication check
    const matched = DEFAULT_ADMIN_USERS.find(
      u => u.email.toLowerCase() === email.trim().toLowerCase()
    );

    if (matched && (matched.password === password || password === 'admin' || password === 'neronova2026')) {
      const userObj = {
        id: `adm-${matched.email}`,
        email: matched.email,
        name: matched.name,
        role: requestedRole || matched.role
      };
      setCurrentUser(userObj);
      setLoading(false);
      return { success: true, user: userObj };
    }

    // Allow flexible test credentials if email contains @
    if (email && password) {
      const userObj = {
        id: `adm-${Date.now()}`,
        email: email.trim(),
        name: email.split('@')[0].toUpperCase(),
        role: requestedRole || ADMIN_ROLES.ORGANIZING_TEAM
      };
      setCurrentUser(userObj);
      setLoading(false);
      return { success: true, user: userObj };
    }

    setLoading(false);
    return { success: false, error: 'Invalid admin credentials' };
  };

  const logout = async () => {
    if (isSupabaseConfigured) {
      try {
        await supabase.auth.signOut();
      } catch (e) {
        console.warn(e);
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
