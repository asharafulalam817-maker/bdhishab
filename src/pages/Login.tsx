import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Phone, Lock, Loader2, Store, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { bn } from '@/lib/constants';
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
  return /^01[3-9]\d{8}$/.test(cleanPhone);
};

export default function Login() {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!phone.trim()) {
      toast.error('অনুগ্রহ করে মোবাইল নম্বর দিন');
      return;
    }

    if (!validateBDPhone(phone)) {
      toast.error('সঠিক মোবাইল নম্বর দিন (যেমন: 01712345678)');
      return;
    }

    if (!password) {
      toast.error('অনুগ্রহ করে পাসওয়ার্ড দিন');
      return;
    }

    setIsLoading(true);
    
    const email = phoneToEmail(phone);
    const { error } = await signIn(email, password);
    
    if (error) {
      toast.error('লগইন ব্যর্থ হয়েছে। মোবাইল নম্বর বা পাসওয়ার্ড সঠিক নয়।');
      setIsLoading(false);
      return;
    }

    toast.success('সফলভাবে লগইন হয়েছে!');
    navigate(from, { replace: true });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Logo & Branding */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary text-primary-foreground mb-4"
          >
            <Store className="h-8 w-8" />
          </motion.div>
          <h1 className="text-2xl font-bold text-foreground">{bn.appName}</h1>
          <p className="text-muted-foreground mt-1">{bn.appTagline}</p>
        </div>

        <Card className="border-border/50 shadow-xl">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-xl">{bn.auth.login}</CardTitle>
            <CardDescription>আপনার একাউন্টে প্রবেশ করুন</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Features List */}
            <div className="grid grid-cols-2 gap-2 mb-6">
              {[
                'ইনভেন্টরি ম্যানেজমেন্ট',
                'ক্রয়-বিক্রয় হিসাব',
                'ওয়ারেন্টি ট্র্যাকিং',
                'চালান ও রিপোর্ট',
              ].map((feature, index) => (
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
                    autoComplete="tel"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">{bn.auth.password}</Label>
                  <Link
                    to="/forgot-password"
                    className="text-xs text-primary hover:underline"
                  >
                    {bn.auth.forgotPassword}
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    disabled={isLoading}
                    maxLength={50}
                    autoComplete="current-password"
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
                    লগইন হচ্ছে...
                  </>
                ) : (
                  bn.auth.login
                )}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm">
              <span className="text-muted-foreground">{bn.auth.dontHaveAccount} </span>
              <Link to="/signup" className="text-primary font-medium hover:underline">
                {bn.auth.signup}
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
