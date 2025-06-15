
import { useState, useEffect, createContext, useContext } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { checkUserRole } from '@/utils/middleware';
import { cleanupAuthState } from '@/utils/authUtils';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  signUp: (email: string, password: string, metadata?: any) => Promise<any>;
  signIn: (email: string, password: string) => Promise<any>;
  signOut: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasRedirectedOnSignIn, setHasRedirectedOnSignIn] = useState(false);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session);
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);

        // Only redirect on SIGNED_IN event and only once per session
        if (event === 'SIGNED_IN' && session?.user?.email && !hasRedirectedOnSignIn) {
          setHasRedirectedOnSignIn(true);
          
          // Use setTimeout to defer the redirect check to avoid conflicts
          setTimeout(async () => {
            try {
              const roleInfo = await checkUserRole(session.user.email!);
              
              // Only redirect if we're currently on the auth page
              if (window.location.pathname === '/auth') {
                window.location.href = roleInfo.redirectPath;
              }
            } catch (error) {
              console.error('Error during post-signin redirect:', error);
            }
          }, 100);
        }

        // Reset redirect flag on sign out
        if (event === 'SIGNED_OUT') {
          setHasRedirectedOnSignIn(false);
        }
      }
    );

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [hasRedirectedOnSignIn]);

  const signUp = async (email: string, password: string, metadata?: any) => {
    try {
      // Clean up any existing auth state first
      cleanupAuthState();
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata,
          emailRedirectTo: `${window.location.origin}/`
        }
      });

      return { data, error };
    } catch (error) {
      console.error('Signup error:', error);
      return { data: null, error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      // Clean up existing state first
      cleanupAuthState();
      
      // Attempt global sign out to clear any existing sessions
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (err) {
        // Continue even if this fails
        console.log('Global signout failed, continuing...');
      }

      // Reset redirect flag before signing in
      setHasRedirectedOnSignIn(false);

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      return { data, error };
    } catch (error) {
      console.error('Signin error:', error);
      return { data: null, error };
    }
  };

  const signOut = async () => {
    try {
      cleanupAuthState();
      setHasRedirectedOnSignIn(false);
      await supabase.auth.signOut({ scope: 'global' });
      window.location.href = '/auth';
    } catch (error) {
      console.error('Signout error:', error);
      // Force redirect even if signout fails
      window.location.href = '/auth';
    }
  };

  const value = {
    user,
    session,
    signUp,
    signIn,
    signOut,
    loading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
