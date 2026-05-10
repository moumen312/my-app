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

        // Helper to fetch profile with timeout to prevent hanging
        const fetchProfile = async (userId: string, client: any) => {
          try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => {
              console.warn(`[AuthContext]  fetchProfile timed out after 10s for user: ${userId}`);
              controller.abort();
            }, 10000); // 10s timeout

            try {
              const { data, error } = await client
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single()
                .abortSignal(controller.signal);

              if (error) {
                console.error(`[AuthContext]  fetchProfile DB error:`, error);
                throw error;
              }
              setProfile(data || null);
            } finally {
              clearTimeout(timeoutId);
            }
          } catch (err: any) {
            console.error('[AuthContext]  Error fetching profile:', err.message || err);
            // If it's just a network timeout on a background tab, do not wipe the existing profile
            if (err.name !== 'AbortError') {
              setProfile(null);
            }
          }
        };

        // Check active sessions and sets the user
        try {
          const { data: { session }, error: sessionError } = await supabase.auth.getSession();
          if (sessionError) {
            console.error('[AuthContext]  Initial getSession error:', sessionError);
            throw sessionError;
          }
          setSession(session);
          setUser(session?.user ?? null);
          if (session?.user) {
            await fetchProfile(session.user.id, supabase);
          } else {
            setProfile(null);
          }
        } catch (e) {
          console.error('[AuthContext]  Initial session check failed:', e);
        } finally {
          setLoading(false);
        }

        // Listen for changes on auth state (logged in, signed out, etc.)
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, newSession) => {
          if (event === 'SIGNED_OUT') {
            setSession(null);
            setUser(null);
            setProfile(null);
            setLoading(false);
            return;
          }

          if (event === 'TOKEN_REFRESHED' || event === 'USER_UPDATED') {
            // Background update - just update session/user without blocking the UI
            // and without unnecessarily re-fetching the profile.
            setSession(newSession);
            setUser(prev => prev?.id === newSession?.user?.id ? prev : (newSession?.user ?? null));
            return;
          }

          // For SIGNED_IN or INITIAL_SESSION
          setLoading(true);

          try {
            setSession(newSession);
            setUser(prev => prev?.id === newSession?.user?.id ? prev : (newSession?.user ?? null));

            if (newSession?.user) {
              // DEFER execution to break the Supabase GoTrueClient internal lock deadlock!
              setTimeout(async () => {
                try {
                  await fetchProfile(newSession.user.id, supabase);
                } catch (e) {
                  console.error(`[AuthContext]  Error in deferred fetchProfile for event ${event}:`, e);
                } finally {
                  setLoading(false);
                }
              }, 0);
            } else {
              setProfile(null);
              setLoading(false);
            }
          } catch (e) {
            console.error(`[AuthContext]  Error handling auth event ${event}:`, e);
            setLoading(false);
          }
        });

        return () => {
          subscription?.unsubscribe();
        };
      } catch (err) {
        console.error('[AuthContext]  Auth initialization fatal error:', err);
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
