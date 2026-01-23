import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useReadOnly } from '@/contexts/ReadOnlyContext';
import { AlertTriangle, CreditCard, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { SubscriptionDialog } from './SubscriptionDialog';
import { useState } from 'react';

interface ReadOnlyGuardProps {
  children: React.ReactNode;
  featureName?: string;
}

export function ReadOnlyGuard({ children, featureName }: ReadOnlyGuardProps) {
  const { isReadOnly, isLoading } = useReadOnly();
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [showDialog, setShowDialog] = useState(false);

  // Show loading or children if not read-only
  if (isLoading) {
    return <>{children}</>;
  }

  if (!isReadOnly) {
    return <>{children}</>;
  }

  // Show blocked message
  const getMessage = () => {
    if (language === 'bn') {
      return {
        title: '🔒 সাবস্ক্রিপশন প্রয়োজন',
        description: `${featureName || 'এই ফিচারটি'} ব্যবহার করতে আপনার সাবস্ক্রিপশন নবায়ন করুন।`,
        subtitle: 'আপনি শুধু পুরানো ডেটা দেখতে পারবেন।',
        renewButton: 'এখনই নবায়ন করুন',
        backButton: 'ড্যাশবোর্ডে ফিরুন',
      };
    }
    return {
      title: '🔒 Subscription Required',
      description: `Renew your subscription to use ${featureName || 'this feature'}.`,
      subtitle: 'You can only view existing data.',
      renewButton: 'Renew Now',
      backButton: 'Back to Dashboard',
    };
  };

  const msg = getMessage();

  return (
    <>
      <div className="flex items-center justify-center min-h-[60vh] p-4">
        <Card className="max-w-md w-full border-destructive/50">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
                <Lock className="h-8 w-8 text-destructive" />
              </div>
              
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-foreground">{msg.title}</h2>
                <p className="text-muted-foreground">{msg.description}</p>
                <p className="text-sm text-muted-foreground">{msg.subtitle}</p>
              </div>

              <div className="flex flex-col gap-2 pt-4">
                <Button 
                  size="lg"
                  className="w-full font-bold gap-2"
                  onClick={() => setShowDialog(true)}
                >
                  <CreditCard className="h-5 w-5" />
                  {msg.renewButton}
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full font-bold"
                  onClick={() => navigate('/dashboard')}
                >
                  {msg.backButton}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <SubscriptionDialog open={showDialog} onOpenChange={setShowDialog} />
    </>
  );
}
