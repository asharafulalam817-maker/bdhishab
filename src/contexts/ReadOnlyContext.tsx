import { createContext, useContext, ReactNode } from 'react';
import { useSubscription } from '@/hooks/useSubscription';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext';

interface ReadOnlyContextType {
  isReadOnly: boolean;
  isLoading: boolean;
  showReadOnlyToast: () => void;
  checkAndProceed: (callback: () => void) => void;
}

const ReadOnlyContext = createContext<ReadOnlyContextType | undefined>(undefined);

export function ReadOnlyProvider({ children }: { children: ReactNode }) {
  const { isReadOnly, isLoading } = useSubscription();
  const { language } = useLanguage();

  const showReadOnlyToast = () => {
    if (language === 'bn') {
      toast.error('সাবস্ক্রিপশন শেষ!', {
        description: 'নতুন এন্ট্রি করতে সাবস্ক্রিপশন নবায়ন করুন।',
      });
    } else {
      toast.error('Subscription Expired!', {
        description: 'Renew your subscription to create new entries.',
      });
    }
  };

  const checkAndProceed = (callback: () => void) => {
    if (isReadOnly()) {
      showReadOnlyToast();
      return;
    }
    callback();
  };

  const value: ReadOnlyContextType = {
    isReadOnly: isReadOnly(),
    isLoading,
    showReadOnlyToast,
    checkAndProceed,
  };

  return (
    <ReadOnlyContext.Provider value={value}>
      {children}
    </ReadOnlyContext.Provider>
  );
}

export function useReadOnly() {
  const context = useContext(ReadOnlyContext);
  if (context === undefined) {
    throw new Error('useReadOnly must be used within a ReadOnlyProvider');
  }
  return context;
}
