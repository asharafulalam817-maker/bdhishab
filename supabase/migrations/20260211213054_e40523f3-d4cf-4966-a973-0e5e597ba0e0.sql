
-- SMS add-on subscription tracking
CREATE TABLE public.sms_subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id uuid NOT NULL REFERENCES public.stores(id) ON DELETE CASCADE,
  is_active boolean NOT NULL DEFAULT false,
  activated_by uuid REFERENCES auth.users(id),
  activated_at timestamp with time zone,
  deactivated_at timestamp with time zone,
  monthly_fee numeric NOT NULL DEFAULT 70,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(store_id)
);

ALTER TABLE public.sms_subscriptions ENABLE ROW LEVEL SECURITY;

-- Store owners can view their SMS subscription
CREATE POLICY "Store members can view sms subscription"
ON public.sms_subscriptions FOR SELECT
USING (is_store_member(store_id));

-- Platform admins can manage all SMS subscriptions
CREATE POLICY "Platform admins can manage sms subscriptions"
ON public.sms_subscriptions FOR ALL
USING (is_platform_admin());

-- Store owners can request SMS subscription (insert)
CREATE POLICY "Store owner can request sms subscription"
ON public.sms_subscriptions FOR INSERT
WITH CHECK (is_owner(store_id));

-- SMS notification log
CREATE TABLE public.sms_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id uuid NOT NULL REFERENCES public.stores(id) ON DELETE CASCADE,
  customer_id uuid REFERENCES public.customers(id),
  phone text NOT NULL,
  message text NOT NULL,
  notification_type text NOT NULL, -- 'sale_receipt', 'installment_due', 'due_reminder'
  reference_id uuid, -- sale_id or installment_payment_id
  status text NOT NULL DEFAULT 'pending', -- 'pending', 'sent', 'failed'
  error_message text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.sms_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Store members can view sms logs"
ON public.sms_logs FOR SELECT
USING (is_store_member(store_id));

CREATE POLICY "Staff+ can insert sms logs"
ON public.sms_logs FOR INSERT
WITH CHECK (is_staff_or_higher(store_id));

CREATE POLICY "Platform admins can view all sms logs"
ON public.sms_logs FOR ALL
USING (is_platform_admin());

-- Store notification preferences
CREATE TABLE public.store_notification_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id uuid NOT NULL REFERENCES public.stores(id) ON DELETE CASCADE,
  sale_notification boolean NOT NULL DEFAULT true,
  installment_reminder boolean NOT NULL DEFAULT true,
  due_reminder boolean NOT NULL DEFAULT true,
  reminder_days_before integer NOT NULL DEFAULT 1,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(store_id)
);

ALTER TABLE public.store_notification_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Store members can view notification settings"
ON public.store_notification_settings FOR SELECT
USING (is_store_member(store_id));

CREATE POLICY "Owner can manage notification settings"
ON public.store_notification_settings FOR INSERT
WITH CHECK (is_owner(store_id));

CREATE POLICY "Owner can update notification settings"
ON public.store_notification_settings FOR UPDATE
USING (is_owner(store_id));

CREATE POLICY "Platform admins can manage all notification settings"
ON public.store_notification_settings FOR ALL
USING (is_platform_admin());

-- Trigger for updated_at
CREATE TRIGGER update_sms_subscriptions_updated_at
BEFORE UPDATE ON public.sms_subscriptions
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_store_notification_settings_updated_at
BEFORE UPDATE ON public.store_notification_settings
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- Grant permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON public.sms_subscriptions TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.sms_logs TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.store_notification_settings TO authenticated;
GRANT SELECT ON public.sms_subscriptions TO anon;
