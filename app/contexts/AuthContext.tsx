"use client"
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';

interface Profile {
  id: string;
  username: string;
  role: 'buyer' | 'seller';
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

import { getSupabaseClient } from '../lib/supabase';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // This only runs in the browser
    async function initAuth() {
      try {
        const supabase = getSupabaseClient();
        
        // Helper to fetch profile
        const fetchProfile = async (userId: string, client: any) => {
          try {
            const { data } = await client.from('profiles').select('*').eq('id', userId).single();
            setProfile(data || null);
          } catch (err) {
            console.error('Error fetching profile:', err);
            setProfile(null);
          }
        };

        // Check active sessions and sets the user
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) {
          await fetchProfile(session.user.id, supabase);
        } else {
          setProfile(null);
        }
        setLoading(false);

        // Listen for changes on auth state (logged in, signed out, etc.)
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
          // Immediately set loading to true while we sync new state and fetch profile
          setLoading(true);
          setSession(newSession);
          setUser(newSession?.user ?? null);
          if (newSession?.user) {
            await fetchProfile(newSession.user.id, supabase);
          } else {
            setProfile(null);
          }
          setLoading(false);
        });

        return () => subscription?.unsubscribe();
      } catch (err) {
        console.error('[v0] Auth initialization error:', err);
        setError(err instanceof Error ? err.message : 'Auth initialization failed');
        setLoading(false);
      }
    }

    const unsubscribe = initAuth();
    
    return () => {
      unsubscribe?.then(unsub => unsub?.());
    };
  }, []);

  const signOut = async () => {
    try {
      const supabase = getSupabaseClient();
      await supabase.auth.signOut();
    } catch (err) {
      console.error('[v0] Sign out error:', err);
      setError(err instanceof Error ? err.message : 'Sign out failed');
    }
  };

  return (
    <AuthContext.Provider value={{ user, session, profile, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
