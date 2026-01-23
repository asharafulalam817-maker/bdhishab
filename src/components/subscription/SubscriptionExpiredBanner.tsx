import { useState } from 'react';
import { AlertTriangle, CreditCard, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { SubscriptionDialog } from './SubscriptionDialog';
import { cn } from '@/lib/utils';

interface SubscriptionExpiredBannerProps {
  daysExpired?: number;
  className?: string;
}

export function SubscriptionExpiredBanner({ daysExpired = 0, className }: SubscriptionExpiredBannerProps) {
  const { t, language } = useLanguage();
  const [showDialog, setShowDialog] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  const getMessage = () => {
    if (language === 'bn') {
      return {
        title: '⚠️ আপনার সাবস্ক্রিপশন শেষ হয়ে গেছে',
        description: 'আপনি শুধু পুরানো ডেটা দেখতে পারবেন। নতুন বিক্রয়, ক্রয় বা এন্ট্রি করতে সাবস্ক্রিপশন নবায়ন করুন।',
        button: 'এখনই নবায়ন করুন',
        readOnly: 'Read-Only মোডে আছেন'
      };
    }
    return {
      title: '⚠️ Your subscription has expired',
      description: 'You can only view existing data. Renew your subscription to create new sales, purchases, or entries.',
      button: 'Renew Now',
      readOnly: 'Read-Only Mode'
    };
  };

  const msg = getMessage();

  return (
    <>
      <div className={cn(
        'relative bg-gradient-to-r from-destructive/90 to-destructive text-destructive-foreground px-4 py-3 rounded-lg shadow-lg',
        className
      )}>
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="p-2 bg-white/20 rounded-lg shrink-0">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="font-bold text-base lg:text-lg">{msg.title}</p>
                <span className="px-2 py-0.5 bg-white/20 rounded-full text-xs font-semibold">
                  {msg.readOnly}
                </span>
              </div>
              <p className="text-sm opacity-90 truncate lg:whitespace-normal">{msg.description}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Button 
              size="sm" 
              variant="secondary"
              className="font-bold gap-1.5 bg-white text-destructive hover:bg-white/90"
              onClick={() => setShowDialog(true)}
            >
              <CreditCard className="h-4 w-4" />
              <span className="hidden sm:inline">{msg.button}</span>
              <span className="sm:hidden">নবায়ন</span>
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 text-destructive-foreground/70 hover:text-destructive-foreground hover:bg-white/10"
              onClick={() => setDismissed(true)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <SubscriptionDialog open={showDialog} onOpenChange={setShowDialog} />
    </>
  );
}
