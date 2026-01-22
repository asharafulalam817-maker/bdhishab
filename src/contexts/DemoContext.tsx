import { createContext, useContext, ReactNode } from 'react';

// Demo store data for development without authentication
const DEMO_STORE = {
  id: 'demo-store-id',
  store_id: 'demo-store-id',
  name: 'ডেমো স্টোর',
  logo_url: null,
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
};

const DEMO_PROFILE = {
  id: 'demo-user-id',
  full_name: 'ডেমো ইউজার',
  phone: '01712345678',
  avatar_url: null,
};

interface DemoContextType {
  isDemoMode: boolean;
  demoStore: typeof DEMO_STORE;
  demoProfile: typeof DEMO_PROFILE;
  currentStoreId: string;
}

const DemoContext = createContext<DemoContextType | undefined>(undefined);

export function DemoProvider({ children }: { children: ReactNode }) {
  const value: DemoContextType = {
    isDemoMode: true,
    demoStore: DEMO_STORE,
    demoProfile: DEMO_PROFILE,
    currentStoreId: DEMO_STORE.id,
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
export { DEMO_STORE, DEMO_PROFILE };
