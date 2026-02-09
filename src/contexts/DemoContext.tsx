import { createContext, useContext, useState, ReactNode, useCallback } from 'react';

// Demo store data for development without authentication
const INITIAL_DEMO_STORE = {
  id: 'demo-store-id',
  store_id: 'demo-store-id',
  name: 'ডেমো স্টোর',
  logo_url: null as string | null,
  phone: '01712345678',
  email: 'demo@store.com',
  address: 'ঢাকা, বাংলাদেশ',
  invoice_template: 'classic' as const,
  invoice_prefix: 'INV',
  invoice_header_note: 'ধন্যবাদ আমাদের সাথে কেনাকাটা করার জন্য',
  invoice_footer_note: 'পণ্যটি বিক্রির পর ফেরত নেওয়া হবে না',
  tax_enabled: false,
  tax_rate: 0,
  default_warranty_type: 'warranty' as const,
  default_warranty_duration: 12,
  default_warranty_unit: 'months' as const,
  default_low_stock_threshold: 10,
  installment_enabled: false,
};

type DemoStore = typeof INITIAL_DEMO_STORE;

const DEMO_PROFILE = {
  id: 'demo-user-id',
  full_name: 'ডেমো ইউজার',
  phone: '01712345678',
  avatar_url: null,
};

interface DemoContextType {
  isDemoMode: boolean;
  demoStore: DemoStore;
  demoProfile: typeof DEMO_PROFILE;
  currentStoreId: string;
  updateStore: (updates: Partial<DemoStore>) => void;
}

const DemoContext = createContext<DemoContextType | undefined>(undefined);

export function DemoProvider({ children }: { children: ReactNode }) {
  const [store, setStore] = useState<DemoStore>(INITIAL_DEMO_STORE);

  const updateStore = useCallback((updates: Partial<DemoStore>) => {
    setStore((prev) => ({ ...prev, ...updates }));
  }, []);

  const value: DemoContextType = {
    isDemoMode: true,
    demoStore: store,
    demoProfile: DEMO_PROFILE,
    currentStoreId: store.id,
    updateStore,
  };

  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>;
}

export function useDemo() {
  const context = useContext(DemoContext);
  if (context === undefined) {
    throw new Error('useDemo must be used within a DemoProvider');
  }
  return context;
}

// Export demo data for direct use
export const DEMO_STORE = INITIAL_DEMO_STORE;
export { DEMO_PROFILE };
