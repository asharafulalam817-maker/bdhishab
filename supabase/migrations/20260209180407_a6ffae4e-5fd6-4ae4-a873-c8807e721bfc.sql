
-- Create platform_settings table for admin configurations
CREATE TABLE public.platform_settings (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  key text NOT NULL UNIQUE,
  value text,
  description text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.platform_settings ENABLE ROW LEVEL SECURITY;

-- Only platform admins can manage settings
CREATE POLICY "Platform admins can manage settings"
ON public.platform_settings
FOR ALL
USING (is_platform_admin());

-- Anyone authenticated can read settings (for WhatsApp number display etc.)
CREATE POLICY "Authenticated users can read settings"
ON public.platform_settings
FOR SELECT
USING (auth.uid() IS NOT NULL);

-- Add trigger for updated_at
CREATE TRIGGER update_platform_settings_updated_at
BEFORE UPDATE ON public.platform_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at();

-- Insert default settings
INSERT INTO public.platform_settings (key, value, description)
VALUES 
  ('support_whatsapp', '01711740643', 'সাপোর্ট হোয়াটসঅ্যাপ নম্বর'),
  ('app_name', 'ডিজিটাল বন্ধু', 'অ্যাপের নাম');
