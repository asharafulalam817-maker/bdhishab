import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Store, Phone, MapPin, Loader2, Rocket, Building2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { bn } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

export default function CreateStore() {
  const [storeName, setStoreName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { createStore, profile, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!storeName.trim()) {
      toast.error('অনুগ্রহ করে স্টোরের নাম দিন');
      return;
    }

    setIsLoading(true);
    
    const { error, store } = await createStore(storeName, phone, address);
    
    if (error) {
      toast.error(error.message || 'স্টোর তৈরি ব্যর্থ হয়েছে');
      setIsLoading(false);
      return;
    }

    toast.success('স্টোর সফলভাবে তৈরি হয়েছে!');
    navigate('/dashboard');
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg"
      >
        {/* Header */}
        <div className="text-center mb-6">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground mb-4 shadow-lg"
          >
            <Building2 className="h-10 w-10" />
          </motion.div>
          <h1 className="text-2xl font-bold text-foreground">
            স্বাগতম{profile?.full_name ? `, ${profile.full_name}` : ''}! 🎉
          </h1>
          <p className="text-muted-foreground mt-1">
            এখন আপনার ব্যবসার স্টোর তৈরি করুন
          </p>
        </div>

        <Card className="border-border/50 shadow-xl">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-xl flex items-center justify-center gap-2">
              <Store className="h-5 w-5" />
              {bn.auth.createStore}
            </CardTitle>
            <CardDescription>
              আপনার ব্যবসার তথ্য দিন
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="storeName">{bn.auth.storeName} *</Label>
                <div className="relative">
                  <Store className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="storeName"
                    type="text"
                    placeholder="যেমন: করিম ইলেকট্রনিক্স"
                    value={storeName}
                    onChange={(e) => setStoreName(e.target.value)}
                    className="pl-10"
                    disabled={isLoading}
                    autoFocus
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">{bn.settings.phone}</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="01XXXXXXXXX"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="pl-10"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">{bn.settings.address}</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Textarea
                    id="address"
                    placeholder="আপনার দোকানের ঠিকানা"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="pl-10 min-h-[80px]"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full"
                size="lg"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    স্টোর তৈরি হচ্ছে...
                  </>
                ) : (
                  <>
                    <Rocket className="mr-2 h-4 w-4" />
                    স্টোর তৈরি করুন
                  </>
                )}
              </Button>
            </form>

            <div className="mt-4 pt-4 border-t border-border">
              <Button
                variant="ghost"
                className="w-full text-muted-foreground"
                onClick={handleLogout}
              >
                অন্য একাউন্টে লগইন করুন
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            পরে আপনি সেটিংস থেকে লোগো, ইনভয়েস হেডার ও অন্যান্য তথ্য যোগ করতে পারবেন।
          </p>
        </div>
      </motion.div>
    </div>
  );
}
