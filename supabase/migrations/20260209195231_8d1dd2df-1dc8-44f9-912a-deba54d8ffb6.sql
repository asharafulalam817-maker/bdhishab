
-- Add installment_enabled to stores
ALTER TABLE public.stores ADD COLUMN installment_enabled boolean NOT NULL DEFAULT false;

-- Create installment_sales table to track installment plans
CREATE TABLE public.installment_sales (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  store_id uuid NOT NULL REFERENCES public.stores(id) ON DELETE CASCADE,
  sale_id uuid REFERENCES public.sales(id) ON DELETE SET NULL,
  customer_id uuid NOT NULL REFERENCES public.customers(id) ON DELETE RESTRICT,
  total_amount numeric NOT NULL DEFAULT 0,
  down_payment numeric NOT NULL DEFAULT 0,
  remaining_amount numeric NOT NULL DEFAULT 0,
  total_installments integer NOT NULL DEFAULT 1,
  installment_amount numeric NOT NULL DEFAULT 0,
  paid_installments integer NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'active', -- active, completed, defaulted
  notes text,
  created_by uuid,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create installment_payments table to track each payment
CREATE TABLE public.installment_payments (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  installment_sale_id uuid NOT NULL REFERENCES public.installment_sales(id) ON DELETE CASCADE,
  store_id uuid NOT NULL REFERENCES public.stores(id) ON DELETE CASCADE,
  installment_number integer NOT NULL,
  amount numeric NOT NULL DEFAULT 0,
  due_date date NOT NULL,
  paid_date date,
  paid_amount numeric DEFAULT 0,
  status text NOT NULL DEFAULT 'pending', -- pending, paid, overdue, partial
  payment_method text,
  notes text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.installment_sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.installment_payments ENABLE ROW LEVEL SECURITY;

-- RLS policies for installment_sales
CREATE POLICY "Members can view installment sales"
  ON public.installment_sales FOR SELECT
  USING (is_store_member(store_id));

CREATE POLICY "Staff+ can insert installment sales"
  ON public.installment_sales FOR INSERT
  WITH CHECK (is_staff_or_higher(store_id));

CREATE POLICY "Staff+ can update installment sales"
  ON public.installment_sales FOR UPDATE
  USING (is_staff_or_higher(store_id));

CREATE POLICY "Owner can delete installment sales"
  ON public.installment_sales FOR DELETE
  USING (is_owner(store_id));

-- RLS policies for installment_payments
CREATE POLICY "Members can view installment payments"
  ON public.installment_payments FOR SELECT
  USING (is_store_member(store_id));

CREATE POLICY "Staff+ can insert installment payments"
  ON public.installment_payments FOR INSERT
  WITH CHECK (is_staff_or_higher(store_id));

CREATE POLICY "Staff+ can update installment payments"
  ON public.installment_payments FOR UPDATE
  USING (is_staff_or_higher(store_id));

CREATE POLICY "Owner can delete installment payments"
  ON public.installment_payments FOR DELETE
  USING (is_owner(store_id));
