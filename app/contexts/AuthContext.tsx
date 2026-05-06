"use client"
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // This only runs in the browser
    async function initAuth() {
      try {
        const { getSupabaseClient } = await import('../lib/supabase');
        const supabase = getSupabaseClient();
        
        // Check active sessions and sets the user
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);

        // Listen for changes on auth state (logged in, signed out, etc.)
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
          setSession(session);
          setUser(session?.user ?? null);
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
      const { getSupabaseClient } = await import('../lib/supabase');
      const supabase = getSupabaseClient();
      await supabase.auth.signOut();
    } catch (err) {
      console.error('[v0] Sign out error:', err);
      setError(err instanceof Error ? err.message : 'Sign out failed');
    }
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signOut }}>
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
