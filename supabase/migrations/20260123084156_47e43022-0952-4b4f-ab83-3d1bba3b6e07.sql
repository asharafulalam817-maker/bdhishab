-- Create store_balance table to track current balance
CREATE TABLE public.store_balance (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  store_id UUID NOT NULL REFERENCES public.stores(id) ON DELETE CASCADE,
  current_balance NUMERIC NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(store_id)
);

-- Create balance_transactions table for transaction history
CREATE TABLE public.balance_transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  store_id UUID NOT NULL REFERENCES public.stores(id) ON DELETE CASCADE,
  transaction_type TEXT NOT NULL CHECK (transaction_type IN ('sale', 'manual_add', 'manual_deduct', 'expense', 'refund')),
  amount NUMERIC NOT NULL,
  balance_after NUMERIC NOT NULL,
  reference_id UUID,
  reference_type TEXT,
  notes TEXT,
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.store_balance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.balance_transactions ENABLE ROW LEVEL SECURITY;

-- RLS policies for store_balance
CREATE POLICY "Members can view store balance" 
  ON public.store_balance FOR SELECT 
  USING (is_store_member(store_id));

CREATE POLICY "Owner can insert store balance" 
  ON public.store_balance FOR INSERT 
  WITH CHECK (is_owner(store_id));

CREATE POLICY "Manager/Owner can update store balance" 
  ON public.store_balance FOR UPDATE 
  USING (is_manager_or_owner(store_id));

-- RLS policies for balance_transactions
CREATE POLICY "Members can view balance transactions" 
  ON public.balance_transactions FOR SELECT 
  USING (is_store_member(store_id));

CREATE POLICY "Manager/Owner can insert balance transactions" 
  ON public.balance_transactions FOR INSERT 
  WITH CHECK (is_manager_or_owner(store_id));

-- Create trigger for updated_at
CREATE TRIGGER update_store_balance_updated_at
  BEFORE UPDATE ON public.store_balance
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

-- Create index for faster queries
CREATE INDEX idx_balance_transactions_store_id ON public.balance_transactions(store_id);
CREATE INDEX idx_balance_transactions_created_at ON public.balance_transactions(created_at DESC);