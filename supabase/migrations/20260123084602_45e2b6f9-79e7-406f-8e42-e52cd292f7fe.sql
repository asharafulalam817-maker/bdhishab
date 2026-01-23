-- Create expense categories enum
CREATE TYPE expense_category AS ENUM (
  'rent',
  'utilities',
  'salary',
  'inventory',
  'maintenance',
  'marketing',
  'transport',
  'other'
);

-- Create expenses table
CREATE TABLE public.expenses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  store_id UUID NOT NULL REFERENCES public.stores(id) ON DELETE CASCADE,
  category expense_category NOT NULL DEFAULT 'other',
  amount NUMERIC NOT NULL DEFAULT 0,
  description TEXT,
  expense_date DATE NOT NULL DEFAULT CURRENT_DATE,
  notes TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Members can view expenses"
  ON public.expenses FOR SELECT
  USING (is_store_member(store_id));

CREATE POLICY "Manager/Owner can insert expenses"
  ON public.expenses FOR INSERT
  WITH CHECK (is_manager_or_owner(store_id));

CREATE POLICY "Manager/Owner can update expenses"
  ON public.expenses FOR UPDATE
  USING (is_manager_or_owner(store_id));

CREATE POLICY "Owner can delete expenses"
  ON public.expenses FOR DELETE
  USING (is_owner(store_id));

-- Create updated_at trigger
CREATE TRIGGER update_expenses_updated_at
  BEFORE UPDATE ON public.expenses
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

-- Create indexes for better performance
CREATE INDEX idx_expenses_store_id ON public.expenses(store_id);
CREATE INDEX idx_expenses_expense_date ON public.expenses(expense_date);
CREATE INDEX idx_expenses_category ON public.expenses(category);