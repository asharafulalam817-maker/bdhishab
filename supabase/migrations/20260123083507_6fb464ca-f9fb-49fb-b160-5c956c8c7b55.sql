-- Add is_blocked column to stores table for admin control
ALTER TABLE public.stores 
ADD COLUMN IF NOT EXISTS is_blocked BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN IF NOT EXISTS blocked_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS blocked_reason TEXT;

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_stores_is_blocked ON public.stores(is_blocked);

-- Allow platform admins to view all stores
CREATE POLICY "Platform admins can view all stores"
ON public.stores FOR SELECT
USING (is_platform_admin());

-- Allow platform admins to update store status (block/unblock)
CREATE POLICY "Platform admins can update stores"
ON public.stores FOR UPDATE
USING (is_platform_admin());