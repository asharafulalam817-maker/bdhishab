import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type AppRole = 'owner' | 'manager' | 'staff';

interface StoreMembership {
  id: string;
  store_id: string;
  role: AppRole;
  store: {
    id: string;
    name: string;
    logo_url: string | null;
  };
}

interface Profile {
  id: string;
  full_name: string | null;
  phone: string | null;
  avatar_url: string | null;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  currentStore: StoreMembership | null;
  stores: StoreMembership[];
  isLoading: boolean;
  isAuthenticated: boolean;
  hasStore: boolean;
  role: AppRole | null;
  signUp: (email: string, password: string, fullName: string, phone?: string) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  createStore: (storeName: string, phone?: string, address?: string) => Promise<{ error: Error | null; store?: any }>;
  switchStore: (storeId: string) => void;
  refreshStores: () => Promise<void>;
  isOwner: boolean;
  isManager: boolean;
  isStaff: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [stores, setStores] = useState<StoreMembership[]>([]);
  const [currentStore, setCurrentStore] = useState<StoreMembership | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch user profile
  const fetchProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (!error && data) {
      setProfile(data as Profile);
    }
  };

  // Fetch user's stores
  const fetchStores = async (userId: string) => {
    const { data, error } = await supabase
      .from('store_memberships')
      .select(`
        id,
        store_id,
        role,
        store:stores (
          id,
          name,
          logo_url
        )
      `)
      .eq('user_id', userId);
    
    if (!error && data) {
      const memberships = data.map((m: any) => ({
        id: m.id,
        store_id: m.store_id,
        role: m.role as AppRole,
        store: m.store,
      }));
      setStores(memberships);
      
      // Set current store from localStorage or first store
      const savedStoreId = localStorage.getItem('currentStoreId');
      const savedStore = memberships.find(m => m.store_id === savedStoreId);
      
      if (savedStore) {
        setCurrentStore(savedStore);
      } else if (memberships.length > 0) {
        setCurrentStore(memberships[0]);
        localStorage.setItem('currentStoreId', memberships[0].store_id);
      }
    }
  };

  // Initialize auth state
  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Use setTimeout to avoid Supabase deadlock
          setTimeout(() => {
            fetchProfile(session.user.id);
            fetchStores(session.user.id);
          }, 0);
        } else {
          setProfile(null);
          setStores([]);
          setCurrentStore(null);
        }
        
        setIsLoading(false);
      }
    );

    // Then check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        fetchProfile(session.user.id);
        fetchStores(session.user.id);
      }
      
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, fullName: string, phone?: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: window.location.origin,
        data: { full_name: fullName, phone },
      },
    });
    
    return { error: error as Error | null };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    return { error: error as Error | null };
  };

  const signOut = async () => {
    localStorage.removeItem('currentStoreId');
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setProfile(null);
    setStores([]);
    setCurrentStore(null);
  };

  const createStore = async (storeName: string, phone?: string, address?: string) => {
    // Get the current session to ensure we have the latest user
    const { data: { session: currentSession } } = await supabase.auth.getSession();
    const currentUser = currentSession?.user;
    
    if (!currentUser) return { error: new Error('Not authenticated') };

    // Create the store
    const { data: store, error: storeError } = await supabase
      .from('stores')
      .insert({
        name: storeName,
        phone,
        address,
        slug: storeName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
      })
      .select()
      .single();

    if (storeError) return { error: storeError as Error };

    // Create membership as owner
    const { error: memberError } = await supabase
      .from('store_memberships')
      .insert({
        store_id: store.id,
        user_id: currentUser.id,
        role: 'owner',
      });

    if (memberError) return { error: memberError as Error };

    // Refresh stores
    await fetchStores(currentUser.id);
    localStorage.setItem('currentStoreId', store.id);

    return { error: null, store };
  };

  const switchStore = (storeId: string) => {
    const store = stores.find(s => s.store_id === storeId);
    if (store) {
      setCurrentStore(store);
      localStorage.setItem('currentStoreId', storeId);
    }
  };

  const refreshStores = async () => {
    if (user) {
      await fetchStores(user.id);
    }
  };

  const role = currentStore?.role ?? null;
  const isOwner = role === 'owner';
  const isManager = role === 'manager' || role === 'owner';
  const isStaff = role === 'staff' || role === 'manager' || role === 'owner';

  const value: AuthContextType = {
    user,
    session,
    profile,
    currentStore,
    stores,
    isLoading,
    isAuthenticated: !!user,
    hasStore: stores.length > 0,
    role,
    signUp,
    signIn,
    signOut,
    createStore,
    switchStore,
    refreshStores,
    isOwner,
    isManager,
    isStaff,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
