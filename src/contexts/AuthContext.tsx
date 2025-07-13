
import React, { createContext, useContext, useState, useEffect, useMemo } from 'react'
import type { User, Session } from '@supabase/supabase-js'
import { supabase } from '@/integrations/supabase/client'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  signUp: (email: string, password: string, name: string) => Promise<{ error: any }>
  signOut: () => Promise<void>
  resendVerification: (email: string) => Promise<{ error: any }>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  signUp: async () => ({ error: null }),
  signOut: async () => {},
  resendVerification: async () => ({ error: null }),
})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: React.ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  console.log('AuthProvider: Initializing...');
  
  // Initialize state with proper default values - add error boundary
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    console.log('AuthProvider: Setting up auth listener...')
    
    let mounted = true;

    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('AuthProvider: Error getting initial session:', error);
        }
        
        console.log('AuthProvider: Initial session:', session?.user?.email || 'no session');
        
        if (mounted) {
          setSession(session)
          setUser(session?.user ?? null)
          setLoading(false)

          if (session?.user) {
            localStorage.setItem('terex-session-active', 'true');
            localStorage.setItem('terex-last-session-update', Date.now().toString());
            localStorage.setItem('terex-user-email', session.user.email || '');
          }
        }
      } catch (error) {
        console.error('AuthProvider: Unexpected error:', error);
        if (mounted) {
          setLoading(false);
        }
      }
    };

    getInitialSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('AuthProvider: Auth state change:', event, session?.user?.email || 'no user');
        
        if (mounted) {
          setSession(session)
          setUser(session?.user ?? null)
          setLoading(false)

          if (session?.user) {
            localStorage.setItem('terex-session-active', 'true');
            localStorage.setItem('terex-last-session-update', Date.now().toString());
            localStorage.setItem('terex-user-email', session.user.email || '');
          } else {
            localStorage.removeItem('terex-session-active');
            localStorage.removeItem('terex-last-session-update');
            localStorage.removeItem('terex-user-email');
            localStorage.removeItem('terex-pwa-session-synced');
          }
        }
      }
    )

    return () => {
      mounted = false;
      subscription.unsubscribe();
    }
  }, [])

  const signUp = async (email: string, password: string, name: string) => {
    console.log('AuthProvider: Starting sign up for:', email)
    setLoading(true)
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: name,
        },
        emailRedirectTo: `${window.location.origin}/auth/callback`
      }
    })
    console.log('AuthProvider: Sign up result:', { error })
    setLoading(false)
    return { error }
  }

  const signOut = async () => {
    console.log('AuthProvider: Starting sign out...')
    setLoading(true)
    
    try {
      const { error } = await supabase.auth.signOut()
      
      if (error) {
        console.error('AuthProvider: Sign out error:', error)
      } else {
        console.log('AuthProvider: Sign out successful')
      }
      
      setUser(null)
      setSession(null)
      
      localStorage.removeItem('terex-session-active');
      localStorage.removeItem('terex-last-session-update');
      localStorage.removeItem('terex-user-email');
      localStorage.removeItem('terex-pwa-session-synced');
    } catch (error) {
      console.error('AuthProvider: Error during sign out:', error)
      setUser(null)
      setSession(null)
      localStorage.removeItem('terex-session-active');
      localStorage.removeItem('terex-last-session-update');
      localStorage.removeItem('terex-user-email');
      localStorage.removeItem('terex-pwa-session-synced');
    } finally {
      setLoading(false)
    }
  }

  const resendVerification = async (email: string) => {
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`
      }
    })
    return { error }
  }

  const value = useMemo(() => ({
    user,
    session,
    loading,
    signUp,
    signOut,
    resendVerification,
  }), [user, session, loading])

  console.log('AuthProvider: Rendering with user:', user?.email || 'no user');

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
