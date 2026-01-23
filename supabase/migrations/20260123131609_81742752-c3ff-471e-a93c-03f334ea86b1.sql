
-- Subscription packages table
CREATE TABLE public.subscription_packages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  name_bn TEXT NOT NULL,
  duration_months INTEGER NOT NULL,
  price NUMERIC NOT NULL,
  max_devices INTEGER NOT NULL DEFAULT 3,
  is_active BOOLEAN NOT NULL DEFAULT true,
  features JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Store subscriptions table
CREATE TABLE public.store_subscriptions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  store_id UUID NOT NULL REFERENCES public.stores(id) ON DELETE CASCADE,
  package_id UUID REFERENCES public.subscription_packages(id),
  subscription_type TEXT NOT NULL DEFAULT 'trial', -- 'trial', 'paid', 'expired'
  start_date DATE NOT NULL DEFAULT CURRENT_DATE,
  end_date DATE NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(store_id)
);

-- Subscription payments table
CREATE TABLE public.subscription_payments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  store_id UUID NOT NULL REFERENCES public.stores(id) ON DELETE CASCADE,
  package_id UUID NOT NULL REFERENCES public.subscription_packages(id),
  amount NUMERIC NOT NULL,
  payment_method TEXT NOT NULL, -- 'bkash', 'rocket', 'nagad'
  sender_number TEXT NOT NULL,
  transaction_id TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'verified', 'rejected'
  verified_by UUID REFERENCES auth.users(id),
  verified_at TIMESTAMP WITH TIME ZONE,
  rejection_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.subscription_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.store_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscription_payments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for subscription_packages (public read)
CREATE POLICY "Anyone can view active packages" 
ON public.subscription_packages 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Platform admins can manage packages" 
ON public.subscription_packages 
FOR ALL 
USING (is_platform_admin());

-- RLS Policies for store_subscriptions
CREATE POLICY "Store members can view their subscription" 
ON public.store_subscriptions 
FOR SELECT 
USING (is_store_member(store_id));

CREATE POLICY "Store owner can manage subscription" 
ON public.store_subscriptions 
FOR INSERT 
WITH CHECK (is_owner(store_id));

CREATE POLICY "Store owner can update subscription" 
ON public.store_subscriptions 
FOR UPDATE 
USING (is_owner(store_id));

CREATE POLICY "Platform admins can manage all subscriptions" 
ON public.store_subscriptions 
FOR ALL 
USING (is_platform_admin());

-- RLS Policies for subscription_payments
CREATE POLICY "Store members can view their payments" 
ON public.subscription_payments 
FOR SELECT 
USING (is_store_member(store_id));

CREATE POLICY "Store owner can create payment" 
ON public.subscription_payments 
FOR INSERT 
WITH CHECK (is_owner(store_id));

CREATE POLICY "Platform admins can manage payments" 
ON public.subscription_payments 
FOR ALL 
USING (is_platform_admin());

-- Insert default packages
INSERT INTO public.subscription_packages (name, name_bn, duration_months, price, max_devices, features) VALUES
('Monthly', 'মাসিক', 1, 77, 3, '["৩টি ডিভাইসে ব্যবহার", "সব ফিচার আনলক", "ওয়াটারমার্ক মুক্ত ইনভয়েস"]'),
('Quarterly', '৩ মাসের', 3, 199, 3, '["৩টি ডিভাইসে ব্যবহার", "সব ফিচার আনলক", "ওয়াটারমার্ক মুক্ত ইনভয়েস", "১৫% সাশ্রয়"]'),
('Half-Yearly', '৬ মাসের', 6, 380, 3, '["৩টি ডিভাইসে ব্যবহার", "সব ফিচার আনলক", "ওয়াটারমার্ক মুক্ত ইনভয়েস", "২০% সাশ্রয়"]'),
('Yearly', '১ বছরের', 12, 550, 3, '["৩টি ডিভাইসে ব্যবহার", "সব ফিচার আনলক", "ওয়াটারমার্ক মুক্ত ইনভয়েস", "৪০% সাশ্রয়", "অগ্রাধিকার সাপোর্ট"]');

-- Function to check if store has active subscription
CREATE OR REPLACE FUNCTION public.has_active_subscription(_store_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.store_subscriptions
    WHERE store_id = _store_id 
    AND is_active = true 
    AND end_date >= CURRENT_DATE
    AND subscription_type IN ('trial', 'paid')
  )
$$;

-- Function to check if store is on trial
CREATE OR REPLACE FUNCTION public.is_on_trial(_store_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.store_subscriptions
    WHERE store_id = _store_id 
    AND is_active = true 
    AND end_date >= CURRENT_DATE
    AND subscription_type = 'trial'
  )
$$;

-- Function to check if store has paid subscription
CREATE OR REPLACE FUNCTION public.has_paid_subscription(_store_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.store_subscriptions
    WHERE store_id = _store_id 
    AND is_active = true 
    AND end_date >= CURRENT_DATE
    AND subscription_type = 'paid'
  )
$$;

-- Trigger to update updated_at
CREATE TRIGGER update_subscription_packages_updated_at
BEFORE UPDATE ON public.subscription_packages
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_store_subscriptions_updated_at
BEFORE UPDATE ON public.store_subscriptions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_subscription_payments_updated_at
BEFORE UPDATE ON public.subscription_payments
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at();
