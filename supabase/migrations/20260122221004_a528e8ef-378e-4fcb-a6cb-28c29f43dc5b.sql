-- Drop and recreate the INSERT policy for stores
DROP POLICY IF EXISTS "Anyone can create store" ON public.stores;

-- Create a simpler INSERT policy that allows authenticated users to create stores
CREATE POLICY "Authenticated users can create stores"
ON public.stores
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Also need to make sure store_memberships INSERT is allowed
DROP POLICY IF EXISTS "Users can create membership when creating store" ON public.store_memberships;

CREATE POLICY "Users can create their own membership"
ON public.store_memberships
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);