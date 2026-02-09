
-- Add max_stores column to subscription_packages
ALTER TABLE public.subscription_packages ADD COLUMN IF NOT EXISTS max_stores integer NOT NULL DEFAULT 3;

-- Update all packages: set max_devices to 3, update features to "সব ফিচার"
-- 1-month package: max 1 store, 3 devices
UPDATE public.subscription_packages 
SET max_devices = 3, 
    max_stores = 1,
    features = '["সব ফিচার অ্যাক্সেস", "৩টি ডিভাইস", "১টি স্টোর"]'::jsonb
WHERE duration_months = 1;

-- 3-month package: max 3 stores, 3 devices
UPDATE public.subscription_packages 
SET max_devices = 3, 
    max_stores = 3,
    features = '["সব ফিচার অ্যাক্সেস", "৩টি ডিভাইস", "৩টি স্টোর"]'::jsonb
WHERE duration_months = 3;

-- 6-month package: max 3 stores, 3 devices
UPDATE public.subscription_packages 
SET max_devices = 3, 
    max_stores = 3,
    features = '["সব ফিচার অ্যাক্সেস", "৩টি ডিভাইস", "৩টি স্টোর"]'::jsonb
WHERE duration_months = 6;

-- 12-month package: max 3 stores, 3 devices
UPDATE public.subscription_packages 
SET max_devices = 3, 
    max_stores = 3,
    features = '["সব ফিচার অ্যাক্সেস", "৩টি ডিভাইস", "৩টি স্টোর"]'::jsonb
WHERE duration_months = 12;
