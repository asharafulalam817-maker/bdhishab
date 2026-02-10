import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Store, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

export default function CreateStore() {
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading: authLoading, createStore, refreshStores } = useAuth();
  const [storeName, setStoreName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  // Redirect if not authenticated
  if (!authLoading && !isAuthenticated) {
    navigate('/login', { replace: true });
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!storeName.trim()) {
      toast.error('স্টোরের নাম দিন');
      return;
    }

    setIsCreating(true);
    try {
      const { error, store } = await createStore(storeName.trim(), phone.trim() || undefined, address.trim() || undefined);
      
      if (error) {
        toast.error('স্টোর তৈরি করতে সমস্যা হয়েছে: ' + error.message);
        setIsCreating(false);
        return;
      }

      // Create free trial subscription for the store
      if (store) {
        const trialEndDate = new Date();
        trialEndDate.setDate(trialEndDate.getDate() + 14); // 14 days trial

        await supabase.from('store_subscriptions').insert({
          store_id: store.id,
          subscription_type: 'trial',
          start_date: new Date().toISOString().split('T')[0],
          end_date: trialEndDate.toISOString().split('T')[0],
          is_active: true,
        });

        // Create initial store balance
        await supabase.from('store_balance').insert({
          store_id: store.id,
          current_balance: 0,
        });
      }

      await refreshStores();
      toast.success('স্টোর সফলভাবে তৈরি হয়েছে! ১৪ দিনের ফ্রি ট্রায়াল শুরু হয়েছে।');
      navigate('/dashboard', { replace: true });
    } catch (err: any) {
      toast.error('কিছু একটা সমস্যা হয়েছে');
      setIsCreating(false);
    }
  };

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
            <Store className="h-7 w-7 text-primary" />
          </div>
          <CardTitle className="text-xl font-bold">আপনার স্টোর তৈরি করুন</CardTitle>
          <CardDescription>
            ১৪ দিনের ফ্রি ট্রায়াল সহ আপনার ব্যবসা শুরু করুন
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="storeName">স্টোরের নাম *</Label>
              <Input
                id="storeName"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                placeholder="যেমন: করিম মোবাইল শপ"
                required
                disabled={isCreating}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">ফোন নম্বর</Label>
              <Input
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="01XXXXXXXXX"
                disabled={isCreating}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">ঠিকানা</Label>
              <Input
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="দোকানের ঠিকানা"
                disabled={isCreating}
              />
            </div>
            <Button type="submit" className="w-full" disabled={isCreating}>
              {isCreating ? (
                <><Loader2 className="h-4 w-4 animate-spin mr-2" /> তৈরি হচ্ছে...</>
              ) : (
                <>স্টোর তৈরি করুন <ArrowRight className="h-4 w-4 ml-2" /></>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
