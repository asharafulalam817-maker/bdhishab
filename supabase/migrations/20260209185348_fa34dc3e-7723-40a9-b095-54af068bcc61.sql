
-- Fix stores RLS: Make SELECT policies PERMISSIVE (default) instead of RESTRICTIVE
DROP POLICY IF EXISTS "Members can view their stores" ON public.stores;
DROP POLICY IF EXISTS "Platform admins can view all stores" ON public.stores;

CREATE POLICY "Members can view their stores" 
ON public.stores FOR SELECT 
USING (is_store_member(id));

CREATE POLICY "Platform admins can view all stores" 
ON public.stores FOR SELECT 
USING (is_platform_admin());

-- Fix store_subscriptions SELECT policies
DROP POLICY IF EXISTS "Store members can view their subscription" ON public.store_subscriptions;
DROP POLICY IF EXISTS "Platform admins can manage all subscriptions" ON public.store_subscriptions;

CREATE POLICY "Store members can view their subscription" 
ON public.store_subscriptions FOR SELECT 
USING (is_store_member(store_id));

CREATE POLICY "Platform admins can view all subscriptions" 
ON public.store_subscriptions FOR SELECT 
USING (is_platform_admin());

CREATE POLICY "Platform admins can insert subscriptions" 
ON public.store_subscriptions FOR INSERT 
WITH CHECK (is_platform_admin());

CREATE POLICY "Platform admins can update subscriptions" 
ON public.store_subscriptions FOR UPDATE 
USING (is_platform_admin());

CREATE POLICY "Platform admins can delete subscriptions" 
ON public.store_subscriptions FOR DELETE 
USING (is_platform_admin());

-- Fix sales SELECT for admin
DROP POLICY IF EXISTS "Members can view sales" ON public.sales;

CREATE POLICY "Members can view sales" 
ON public.sales FOR SELECT 
USING (is_store_member(store_id));

CREATE POLICY "Platform admins can view all sales" 
ON public.sales FOR SELECT 
USING (is_platform_admin());

-- Fix customers SELECT for admin
DROP POLICY IF EXISTS "Members can view customers" ON public.customers;

CREATE POLICY "Members can view customers" 
ON public.customers FOR SELECT 
USING (is_store_member(store_id));

CREATE POLICY "Platform admins can view all customers" 
ON public.customers FOR SELECT 
USING (is_platform_admin());

-- Fix platform_settings: make permissive
DROP POLICY IF EXISTS "Authenticated users can read settings" ON public.platform_settings;
DROP POLICY IF EXISTS "Platform admins can manage settings" ON public.platform_settings;

CREATE POLICY "Authenticated users can read settings" 
ON public.platform_settings FOR SELECT 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Platform admins can manage settings" 
ON public.platform_settings FOR ALL 
USING (is_platform_admin());

-- Fix support_conversations for admin
DROP POLICY IF EXISTS "Store owners can view their conversations" ON public.support_conversations;

CREATE POLICY "Store owners can view their conversations" 
ON public.support_conversations FOR SELECT 
USING (is_store_member(store_id) OR is_platform_admin());

-- Fix stores UPDATE for admin
DROP POLICY IF EXISTS "Owner/Manager can update store" ON public.stores;
DROP POLICY IF EXISTS "Platform admins can update stores" ON public.stores;

CREATE POLICY "Owner/Manager can update store" 
ON public.stores FOR UPDATE 
USING (is_manager_or_owner(id));

CREATE POLICY "Platform admins can update stores" 
ON public.stores FOR UPDATE 
USING (is_platform_admin());

-- Fix subscription_packages
DROP POLICY IF EXISTS "Anyone can view active packages" ON public.subscription_packages;
DROP POLICY IF EXISTS "Platform admins can manage packages" ON public.subscription_packages;

CREATE POLICY "Anyone can view active packages" 
ON public.subscription_packages FOR SELECT 
USING (is_active = true);

CREATE POLICY "Platform admins can manage packages" 
ON public.subscription_packages FOR ALL 
USING (is_platform_admin());

-- Fix subscription_payments for admin
DROP POLICY IF EXISTS "Platform admins can manage payments" ON public.subscription_payments;
DROP POLICY IF EXISTS "Store members can view their payments" ON public.subscription_payments;

CREATE POLICY "Store members can view their payments" 
ON public.subscription_payments FOR SELECT 
USING (is_store_member(store_id));

CREATE POLICY "Platform admins can manage payments" 
ON public.subscription_payments FOR ALL 
USING (is_platform_admin());
