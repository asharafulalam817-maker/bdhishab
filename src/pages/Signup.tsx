import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Phone, Lock, User, Loader2, Store, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { bn } from '@/lib/constants';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

// Convert phone to email format for Supabase auth
const phoneToEmail = (phone: string) => {
  const cleanPhone = phone.replace(/\D/g, '');
  return `${cleanPhone}@digitaldondu.store`;
};

// Validate Bangladesh phone number
const validateBDPhone = (phone: string): boolean => {
  const cleanPhone = phone.replace(/\D/g, '');
  // Bangladesh mobile: 01[3-9]XXXXXXXX (11 digits)
  return /^01[3-9]\d{8}$/.test(cleanPhone);
};

export default function Signup() {
  const [businessName, setBusinessName] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { signUp, createStore } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!businessName.trim()) {
      toast.error('অনুগ্রহ করে প্রতিষ্ঠানের নাম দিন');
      return;
    }

    if (!fullName.trim()) {
      toast.error('অনুগ্রহ করে আপনার নাম দিন');
      return;
    }

    if (!phone.trim()) {
      toast.error('অনুগ্রহ করে মোবাইল নম্বর দিন');
      return;
    }

    if (!validateBDPhone(phone)) {
      toast.error('সঠিক মোবাইল নম্বর দিন (যেমন: 01712345678)');
      return;
    }

    if (password.length < 6) {
      toast.error('পাসওয়ার্ড কমপক্ষে ৬ অক্ষর হতে হবে');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('পাসওয়ার্ড মিলছে না');
      return;
    }

    setIsLoading(true);
    
    const email = phoneToEmail(phone);
    const { error } = await signUp(email, password, fullName, phone);
    
    if (error) {
      if (error.message.includes('already registered')) {
        toast.error('এই মোবাইল নম্বর দিয়ে আগে থেকেই একাউন্ট আছে');
      } else {
        toast.error(error.message || 'সাইন আপ ব্যর্থ হয়েছে');
      }
      setIsLoading(false);
      return;
    }

    // Auto-create store with the business name
    const { error: storeError, store } = await createStore(businessName.trim(), phone);
    
    if (storeError) {
      toast.error('স্টোর তৈরিতে সমস্যা হয়েছে। পরে চেষ্টা করুন।');
      setIsLoading(false);
      navigate('/create-store');
      return;
    }

    // Create free trial subscription
    if (store) {
      const trialEndDate = new Date();
      trialEndDate.setDate(trialEndDate.getDate() + 14);
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

    // Send WhatsApp notification to owner and admin (fire-and-forget)
    supabase.functions.invoke('send-whatsapp-notification', {
      body: {
        type: 'new_store_registration',
        storeName: businessName.trim(),
        ownerName: fullName.trim(),
        ownerPhone: phone,
      },
    }).catch((err) => console.error('WhatsApp notification failed:', err));

    toast.success('সফলভাবে একাউন্ট ও স্টোর তৈরি হয়েছে!');
    navigate('/dashboard');
  };

  const features = [
    'ইনভেন্টরি ম্যানেজমেন্ট',
    'ক্রয়-বিক্রয় হিসাব',
    'ওয়ারেন্টি ট্র্যাকিং',
    'চালান ও রিপোর্ট',
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Logo & Branding */}
        <div className="text-center mb-6">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary text-primary-foreground mb-4"
          >
            <Store className="h-8 w-8" />
          </motion.div>
          <h1 className="text-2xl font-bold text-foreground">{bn.appName}</h1>
          <p className="text-muted-foreground mt-1">নতুন একাউন্ট তৈরি করুন</p>
        </div>

        <Card className="border-border/50 shadow-xl">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-xl">{bn.auth.signup}</CardTitle>
            <CardDescription>আপনার ব্যবসা ডিজিটাল করুন</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Features List */}
            <div className="grid grid-cols-2 gap-2 mb-6">
              {features.map((feature, index) => (
                <motion.div
                  key={feature}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="flex items-center gap-2 text-sm text-muted-foreground"
                >
                  <CheckCircle2 className="h-4 w-4 text-success" />
                  <span>{feature}</span>
                </motion.div>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="businessName">{bn.auth.businessName}</Label>
                <div className="relative">
                  <Store className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="businessName"
                    type="text"
                    placeholder="আপনার প্রতিষ্ঠানের নাম"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    className="pl-10"
                    disabled={isLoading}
                    maxLength={100}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="fullName">{bn.auth.ownerName}</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="আপনার নাম"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="pl-10"
                    disabled={isLoading}
                    maxLength={100}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">মোবাইল নম্বর</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="01XXXXXXXXX"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 11))}
                    className="pl-10"
                    disabled={isLoading}
                    maxLength={11}
                  />
                </div>
                <p className="text-xs text-muted-foreground">বাংলাদেশি মোবাইল নম্বর দিন</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">{bn.auth.password}</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="কমপক্ষে ৬ অক্ষর"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    disabled={isLoading}
                    maxLength={50}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">{bn.auth.confirmPassword}</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="পাসওয়ার্ড আবার দিন"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-10"
                    disabled={isLoading}
                    maxLength={50}
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
                    একাউন্ট তৈরি হচ্ছে...
                  </>
                ) : (
                  'একাউন্ট তৈরি করুন'
                )}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm">
              <span className="text-muted-foreground">{bn.auth.alreadyHaveAccount} </span>
              <Link to="/login" className="text-primary font-medium hover:underline">
                {bn.auth.login}
              </Link>
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-muted-foreground mt-6">
          © {new Date().getFullYear()} {bn.appName}। সর্বস্বত্ব সংরক্ষিত।
        </p>
      </motion.div>
    </div>
  );
}
