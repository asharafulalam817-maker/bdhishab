-- Grant proper permissions on stores table
GRANT SELECT, INSERT, UPDATE, DELETE ON public.stores TO authenticated;
GRANT SELECT ON public.stores TO anon;

-- Grant proper permissions on store_memberships table
GRANT SELECT, INSERT, UPDATE, DELETE ON public.store_memberships TO authenticated;

-- Grant proper permissions on store_subscriptions table  
GRANT SELECT, INSERT, UPDATE, DELETE ON public.store_subscriptions TO authenticated;

-- Grant proper permissions on store_balance table
GRANT SELECT, INSERT, UPDATE, DELETE ON public.store_balance TO authenticated;

-- Grant proper permissions on profiles table
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;

-- Grant proper permissions on all other tables that need authenticated access
GRANT SELECT, INSERT, UPDATE, DELETE ON public.products TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.categories TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.brands TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.customers TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.suppliers TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.sales TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.sale_items TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.purchases TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.purchase_items TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.invoices TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.expenses TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.stock_ledger TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.stock_adjustments TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.balance_transactions TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.warranty_records TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.warranty_claims TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.activity_logs TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.installment_sales TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.installment_payments TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.support_conversations TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.support_messages TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.subscription_payments TO authenticated;
GRANT SELECT ON public.subscription_packages TO authenticated;
GRANT SELECT ON public.subscription_packages TO anon;
GRANT SELECT, INSERT, UPDATE ON public.platform_admins TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.platform_settings TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.otp_verifications TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.otp_verifications TO anon;