-- =============================================
-- DIGITAL BONDU INVENTORY - Complete Database Schema
-- Multi-tenant SaaS for 5000+ businesses
-- =============================================

-- 1. ENUMS
-- =============================================
CREATE TYPE public.app_role AS ENUM ('owner', 'manager', 'staff');
CREATE TYPE public.warranty_type AS ENUM ('none', 'warranty', 'guarantee');
CREATE TYPE public.duration_unit AS ENUM ('days', 'months', 'years');
CREATE TYPE public.stock_transaction_type AS ENUM ('purchase', 'sale', 'return_in', 'return_out', 'adjustment_in', 'adjustment_out', 'damage', 'loss');
CREATE TYPE public.payment_method AS ENUM ('cash', 'bkash', 'nagad', 'bank', 'due', 'mixed');
CREATE TYPE public.payment_status AS ENUM ('paid', 'partial', 'due');
CREATE TYPE public.warranty_status AS ENUM ('active', 'expiring_soon', 'expired', 'claimed');

-- 2. PROFILES TABLE (linked to auth.users)
-- =============================================
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. STORES TABLE (Tenants)
-- =============================================
CREATE TABLE public.stores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE,
  logo_url TEXT,
  phone TEXT,
  email TEXT,
  address TEXT,
  invoice_header_note TEXT,
  invoice_footer_note TEXT,
  invoice_prefix TEXT DEFAULT 'INV',
  default_warranty_type public.warranty_type DEFAULT 'none',
  default_warranty_duration INTEGER DEFAULT 0,
  default_warranty_unit public.duration_unit DEFAULT 'months',
  default_low_stock_threshold INTEGER DEFAULT 10,
  tax_enabled BOOLEAN DEFAULT false,
  tax_rate NUMERIC(5,2) DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. STORE MEMBERSHIPS (User-Store-Role mapping)
-- =============================================
CREATE TABLE public.store_memberships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id UUID NOT NULL REFERENCES public.stores(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL DEFAULT 'staff',
  invited_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(store_id, user_id)
);

-- 5. CATEGORIES TABLE
-- =============================================
CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id UUID NOT NULL REFERENCES public.stores(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  parent_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 6. BRANDS TABLE
-- =============================================
CREATE TABLE public.brands (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id UUID NOT NULL REFERENCES public.stores(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 7. PRODUCTS TABLE
-- =============================================
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id UUID NOT NULL REFERENCES public.stores(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  sku TEXT,
  barcode TEXT,
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  brand_id UUID REFERENCES public.brands(id) ON DELETE SET NULL,
  unit TEXT DEFAULT 'pcs',
  purchase_cost NUMERIC(12,2) DEFAULT 0,
  sale_price NUMERIC(12,2) DEFAULT 0,
  current_stock INTEGER DEFAULT 0,
  low_stock_threshold INTEGER DEFAULT 10,
  image_url TEXT,
  warranty_type public.warranty_type DEFAULT 'none',
  warranty_duration INTEGER DEFAULT 0,
  warranty_unit public.duration_unit DEFAULT 'months',
  warranty_start_from TEXT DEFAULT 'invoice_date',
  warranty_terms TEXT,
  serial_number_required BOOLEAN DEFAULT false,
  batch_tracking BOOLEAN DEFAULT false,
  has_expiry BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(store_id, sku)
);

-- 8. SUPPLIERS TABLE
-- =============================================
CREATE TABLE public.suppliers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id UUID NOT NULL REFERENCES public.stores(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  address TEXT,
  due_amount NUMERIC(12,2) DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 9. CUSTOMERS TABLE
-- =============================================
CREATE TABLE public.customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id UUID NOT NULL REFERENCES public.stores(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  address TEXT,
  due_amount NUMERIC(12,2) DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 10. PURCHASES TABLE
-- =============================================
CREATE TABLE public.purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id UUID NOT NULL REFERENCES public.stores(id) ON DELETE CASCADE,
  supplier_id UUID REFERENCES public.suppliers(id) ON DELETE SET NULL,
  invoice_number TEXT,
  purchase_date DATE NOT NULL DEFAULT CURRENT_DATE,
  subtotal NUMERIC(12,2) DEFAULT 0,
  discount NUMERIC(12,2) DEFAULT 0,
  tax NUMERIC(12,2) DEFAULT 0,
  total NUMERIC(12,2) DEFAULT 0,
  paid_amount NUMERIC(12,2) DEFAULT 0,
  due_amount NUMERIC(12,2) DEFAULT 0,
  payment_status public.payment_status DEFAULT 'due',
  notes TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 11. PURCHASE ITEMS TABLE
-- =============================================
CREATE TABLE public.purchase_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  purchase_id UUID NOT NULL REFERENCES public.purchases(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_cost NUMERIC(12,2) NOT NULL DEFAULT 0,
  total NUMERIC(12,2) NOT NULL DEFAULT 0,
  batch_number TEXT,
  expiry_date DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 12. SALES TABLE
-- =============================================
CREATE TABLE public.sales (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id UUID NOT NULL REFERENCES public.stores(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES public.customers(id) ON DELETE SET NULL,
  sale_date DATE NOT NULL DEFAULT CURRENT_DATE,
  subtotal NUMERIC(12,2) DEFAULT 0,
  discount NUMERIC(12,2) DEFAULT 0,
  tax NUMERIC(12,2) DEFAULT 0,
  total NUMERIC(12,2) DEFAULT 0,
  paid_amount NUMERIC(12,2) DEFAULT 0,
  due_amount NUMERIC(12,2) DEFAULT 0,
  payment_method public.payment_method DEFAULT 'cash',
  payment_status public.payment_status DEFAULT 'paid',
  notes TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 13. SALE ITEMS TABLE
-- =============================================
CREATE TABLE public.sale_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sale_id UUID NOT NULL REFERENCES public.sales(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price NUMERIC(12,2) NOT NULL DEFAULT 0,
  discount NUMERIC(12,2) DEFAULT 0,
  total NUMERIC(12,2) NOT NULL DEFAULT 0,
  serial_number TEXT,
  batch_number TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 14. INVOICES TABLE
-- =============================================
CREATE TABLE public.invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id UUID NOT NULL REFERENCES public.stores(id) ON DELETE CASCADE,
  sale_id UUID REFERENCES public.sales(id) ON DELETE SET NULL,
  customer_id UUID REFERENCES public.customers(id) ON DELETE SET NULL,
  invoice_number TEXT NOT NULL,
  invoice_date DATE NOT NULL DEFAULT CURRENT_DATE,
  due_date DATE,
  subtotal NUMERIC(12,2) DEFAULT 0,
  discount NUMERIC(12,2) DEFAULT 0,
  tax NUMERIC(12,2) DEFAULT 0,
  total NUMERIC(12,2) DEFAULT 0,
  paid_amount NUMERIC(12,2) DEFAULT 0,
  due_amount NUMERIC(12,2) DEFAULT 0,
  payment_status public.payment_status DEFAULT 'paid',
  notes TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(store_id, invoice_number)
);

-- 15. STOCK LEDGER TABLE
-- =============================================
CREATE TABLE public.stock_ledger (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id UUID NOT NULL REFERENCES public.stores(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  transaction_type public.stock_transaction_type NOT NULL,
  quantity INTEGER NOT NULL,
  balance_after INTEGER NOT NULL DEFAULT 0,
  reference_type TEXT,
  reference_id UUID,
  notes TEXT,
  batch_number TEXT,
  serial_number TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 16. STOCK ADJUSTMENTS TABLE
-- =============================================
CREATE TABLE public.stock_adjustments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id UUID NOT NULL REFERENCES public.stores(id) ON DELETE CASCADE,
  adjustment_date DATE NOT NULL DEFAULT CURRENT_DATE,
  reason TEXT NOT NULL,
  notes TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 17. WARRANTY RECORDS TABLE
-- =============================================
CREATE TABLE public.warranty_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id UUID NOT NULL REFERENCES public.stores(id) ON DELETE CASCADE,
  sale_id UUID REFERENCES public.sales(id) ON DELETE SET NULL,
  invoice_id UUID REFERENCES public.invoices(id) ON DELETE SET NULL,
  customer_id UUID REFERENCES public.customers(id) ON DELETE SET NULL,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  customer_phone TEXT,
  serial_number TEXT,
  batch_number TEXT,
  sale_date DATE NOT NULL,
  warranty_start DATE NOT NULL,
  warranty_expiry DATE NOT NULL,
  warranty_type public.warranty_type NOT NULL,
  warranty_duration INTEGER NOT NULL,
  warranty_unit public.duration_unit NOT NULL,
  status public.warranty_status DEFAULT 'active',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 18. WARRANTY CLAIMS TABLE
-- =============================================
CREATE TABLE public.warranty_claims (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  warranty_id UUID NOT NULL REFERENCES public.warranty_records(id) ON DELETE CASCADE,
  store_id UUID NOT NULL REFERENCES public.stores(id) ON DELETE CASCADE,
  claim_date DATE NOT NULL DEFAULT CURRENT_DATE,
  issue_description TEXT NOT NULL,
  action_taken TEXT,
  resolution TEXT,
  status TEXT DEFAULT 'pending',
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 19. ACTIVITY LOGS TABLE
-- =============================================
CREATE TABLE public.activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id UUID NOT NULL REFERENCES public.stores(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  entity_type TEXT,
  entity_id UUID,
  details JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =============================================
-- INDEXES FOR PERFORMANCE (5000+ stores)
-- =============================================

-- Store memberships indexes
CREATE INDEX idx_store_memberships_user ON public.store_memberships(user_id);
CREATE INDEX idx_store_memberships_store ON public.store_memberships(store_id);
CREATE INDEX idx_store_memberships_role ON public.store_memberships(store_id, role);

-- Products indexes
CREATE INDEX idx_products_store ON public.products(store_id);
CREATE INDEX idx_products_category ON public.products(category_id);
CREATE INDEX idx_products_brand ON public.products(brand_id);
CREATE INDEX idx_products_sku ON public.products(store_id, sku);
CREATE INDEX idx_products_barcode ON public.products(store_id, barcode);
CREATE INDEX idx_products_low_stock ON public.products(store_id, current_stock, low_stock_threshold);

-- Categories & Brands indexes
CREATE INDEX idx_categories_store ON public.categories(store_id);
CREATE INDEX idx_brands_store ON public.brands(store_id);

-- Suppliers & Customers indexes
CREATE INDEX idx_suppliers_store ON public.suppliers(store_id);
CREATE INDEX idx_customers_store ON public.customers(store_id);
CREATE INDEX idx_customers_phone ON public.customers(store_id, phone);

-- Purchases indexes
CREATE INDEX idx_purchases_store ON public.purchases(store_id);
CREATE INDEX idx_purchases_supplier ON public.purchases(supplier_id);
CREATE INDEX idx_purchases_date ON public.purchases(store_id, purchase_date);
CREATE INDEX idx_purchase_items_purchase ON public.purchase_items(purchase_id);

-- Sales indexes
CREATE INDEX idx_sales_store ON public.sales(store_id);
CREATE INDEX idx_sales_customer ON public.sales(customer_id);
CREATE INDEX idx_sales_date ON public.sales(store_id, sale_date);
CREATE INDEX idx_sale_items_sale ON public.sale_items(sale_id);

-- Invoices indexes
CREATE INDEX idx_invoices_store ON public.invoices(store_id);
CREATE INDEX idx_invoices_customer ON public.invoices(customer_id);
CREATE INDEX idx_invoices_number ON public.invoices(store_id, invoice_number);
CREATE INDEX idx_invoices_date ON public.invoices(store_id, invoice_date);

-- Stock ledger indexes
CREATE INDEX idx_stock_ledger_store ON public.stock_ledger(store_id);
CREATE INDEX idx_stock_ledger_product ON public.stock_ledger(product_id);
CREATE INDEX idx_stock_ledger_date ON public.stock_ledger(store_id, created_at);
CREATE INDEX idx_stock_ledger_reference ON public.stock_ledger(reference_type, reference_id);

-- Warranty indexes
CREATE INDEX idx_warranty_store ON public.warranty_records(store_id);
CREATE INDEX idx_warranty_customer ON public.warranty_records(customer_id);
CREATE INDEX idx_warranty_product ON public.warranty_records(product_id);
CREATE INDEX idx_warranty_phone ON public.warranty_records(store_id, customer_phone);
CREATE INDEX idx_warranty_serial ON public.warranty_records(store_id, serial_number);
CREATE INDEX idx_warranty_expiry ON public.warranty_records(store_id, warranty_expiry);
CREATE INDEX idx_warranty_status ON public.warranty_records(store_id, status);
CREATE INDEX idx_warranty_claims_warranty ON public.warranty_claims(warranty_id);

-- Activity logs indexes
CREATE INDEX idx_activity_logs_store ON public.activity_logs(store_id);
CREATE INDEX idx_activity_logs_user ON public.activity_logs(user_id);
CREATE INDEX idx_activity_logs_date ON public.activity_logs(store_id, created_at);

-- =============================================
-- SECURITY DEFINER HELPER FUNCTIONS
-- =============================================

-- Check if user is member of a store
CREATE OR REPLACE FUNCTION public.is_store_member(_store_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.store_memberships
    WHERE store_id = _store_id AND user_id = auth.uid()
  )
$$;

-- Get user's role in a store
CREATE OR REPLACE FUNCTION public.get_user_role(_store_id UUID)
RETURNS public.app_role
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role FROM public.store_memberships
  WHERE store_id = _store_id AND user_id = auth.uid()
  LIMIT 1
$$;

-- Check if user is owner
CREATE OR REPLACE FUNCTION public.is_owner(_store_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.store_memberships
    WHERE store_id = _store_id AND user_id = auth.uid() AND role = 'owner'
  )
$$;

-- Check if user is manager or owner
CREATE OR REPLACE FUNCTION public.is_manager_or_owner(_store_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.store_memberships
    WHERE store_id = _store_id AND user_id = auth.uid() AND role IN ('owner', 'manager')
  )
$$;

-- Check if user is staff or higher (any role)
CREATE OR REPLACE FUNCTION public.is_staff_or_higher(_store_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.store_memberships
    WHERE store_id = _store_id AND user_id = auth.uid()
  )
$$;

-- Get store_id from purchase_id
CREATE OR REPLACE FUNCTION public.get_store_from_purchase(_purchase_id UUID)
RETURNS UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT store_id FROM public.purchases WHERE id = _purchase_id
$$;

-- Get store_id from sale_id
CREATE OR REPLACE FUNCTION public.get_store_from_sale(_sale_id UUID)
RETURNS UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT store_id FROM public.sales WHERE id = _sale_id
$$;

-- Get store_id from invoice_id
CREATE OR REPLACE FUNCTION public.get_store_from_invoice(_invoice_id UUID)
RETURNS UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT store_id FROM public.invoices WHERE id = _invoice_id
$$;

-- Get store_id from warranty_id
CREATE OR REPLACE FUNCTION public.get_store_from_warranty(_warranty_id UUID)
RETURNS UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT store_id FROM public.warranty_records WHERE id = _warranty_id
$$;

-- =============================================
-- ENABLE RLS ON ALL TABLES
-- =============================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.store_memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.purchase_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sale_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stock_ledger ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stock_adjustments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.warranty_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.warranty_claims ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- =============================================
-- RLS POLICIES
-- =============================================

-- PROFILES POLICIES
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (id = auth.uid());
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (id = auth.uid());
CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (id = auth.uid());

-- STORES POLICIES
CREATE POLICY "Members can view their stores" ON public.stores
  FOR SELECT USING (public.is_store_member(id));
CREATE POLICY "Anyone can create store" ON public.stores
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Owner/Manager can update store" ON public.stores
  FOR UPDATE USING (public.is_manager_or_owner(id));
CREATE POLICY "Only owner can delete store" ON public.stores
  FOR DELETE USING (public.is_owner(id));

-- STORE MEMBERSHIPS POLICIES
CREATE POLICY "Members can view store memberships" ON public.store_memberships
  FOR SELECT USING (public.is_store_member(store_id));
CREATE POLICY "Owner can insert memberships" ON public.store_memberships
  FOR INSERT WITH CHECK (
    public.is_owner(store_id) 
    OR (user_id = auth.uid() AND role = 'owner')
  );
CREATE POLICY "Owner can update memberships" ON public.store_memberships
  FOR UPDATE USING (public.is_owner(store_id));
CREATE POLICY "Owner can delete memberships" ON public.store_memberships
  FOR DELETE USING (public.is_owner(store_id) AND user_id != auth.uid());

-- CATEGORIES POLICIES
CREATE POLICY "Members can view categories" ON public.categories
  FOR SELECT USING (public.is_store_member(store_id));
CREATE POLICY "Manager/Owner can insert categories" ON public.categories
  FOR INSERT WITH CHECK (public.is_manager_or_owner(store_id));
CREATE POLICY "Manager/Owner can update categories" ON public.categories
  FOR UPDATE USING (public.is_manager_or_owner(store_id));
CREATE POLICY "Owner can delete categories" ON public.categories
  FOR DELETE USING (public.is_owner(store_id));

-- BRANDS POLICIES
CREATE POLICY "Members can view brands" ON public.brands
  FOR SELECT USING (public.is_store_member(store_id));
CREATE POLICY "Manager/Owner can insert brands" ON public.brands
  FOR INSERT WITH CHECK (public.is_manager_or_owner(store_id));
CREATE POLICY "Manager/Owner can update brands" ON public.brands
  FOR UPDATE USING (public.is_manager_or_owner(store_id));
CREATE POLICY "Owner can delete brands" ON public.brands
  FOR DELETE USING (public.is_owner(store_id));

-- PRODUCTS POLICIES
CREATE POLICY "Members can view products" ON public.products
  FOR SELECT USING (public.is_store_member(store_id));
CREATE POLICY "Manager/Owner can insert products" ON public.products
  FOR INSERT WITH CHECK (public.is_manager_or_owner(store_id));
CREATE POLICY "Manager/Owner can update products" ON public.products
  FOR UPDATE USING (public.is_manager_or_owner(store_id));
CREATE POLICY "Owner can delete products" ON public.products
  FOR DELETE USING (public.is_owner(store_id));

-- SUPPLIERS POLICIES
CREATE POLICY "Members can view suppliers" ON public.suppliers
  FOR SELECT USING (public.is_store_member(store_id));
CREATE POLICY "Manager/Owner can insert suppliers" ON public.suppliers
  FOR INSERT WITH CHECK (public.is_manager_or_owner(store_id));
CREATE POLICY "Manager/Owner can update suppliers" ON public.suppliers
  FOR UPDATE USING (public.is_manager_or_owner(store_id));
CREATE POLICY "Owner can delete suppliers" ON public.suppliers
  FOR DELETE USING (public.is_owner(store_id));

-- CUSTOMERS POLICIES
CREATE POLICY "Members can view customers" ON public.customers
  FOR SELECT USING (public.is_store_member(store_id));
CREATE POLICY "Staff+ can insert customers" ON public.customers
  FOR INSERT WITH CHECK (public.is_staff_or_higher(store_id));
CREATE POLICY "Staff+ can update customers" ON public.customers
  FOR UPDATE USING (public.is_staff_or_higher(store_id));
CREATE POLICY "Owner can delete customers" ON public.customers
  FOR DELETE USING (public.is_owner(store_id));

-- PURCHASES POLICIES
CREATE POLICY "Members can view purchases" ON public.purchases
  FOR SELECT USING (public.is_store_member(store_id));
CREATE POLICY "Manager/Owner can insert purchases" ON public.purchases
  FOR INSERT WITH CHECK (public.is_manager_or_owner(store_id));
CREATE POLICY "Manager/Owner can update purchases" ON public.purchases
  FOR UPDATE USING (public.is_manager_or_owner(store_id));
CREATE POLICY "Owner can delete purchases" ON public.purchases
  FOR DELETE USING (public.is_owner(store_id));

-- PURCHASE ITEMS POLICIES
CREATE POLICY "Members can view purchase items" ON public.purchase_items
  FOR SELECT USING (public.is_store_member(public.get_store_from_purchase(purchase_id)));
CREATE POLICY "Manager/Owner can insert purchase items" ON public.purchase_items
  FOR INSERT WITH CHECK (public.is_manager_or_owner(public.get_store_from_purchase(purchase_id)));
CREATE POLICY "Manager/Owner can update purchase items" ON public.purchase_items
  FOR UPDATE USING (public.is_manager_or_owner(public.get_store_from_purchase(purchase_id)));
CREATE POLICY "Owner can delete purchase items" ON public.purchase_items
  FOR DELETE USING (public.is_owner(public.get_store_from_purchase(purchase_id)));

-- SALES POLICIES
CREATE POLICY "Members can view sales" ON public.sales
  FOR SELECT USING (public.is_store_member(store_id));
CREATE POLICY "Staff+ can insert sales" ON public.sales
  FOR INSERT WITH CHECK (public.is_staff_or_higher(store_id));
CREATE POLICY "Staff+ can update sales" ON public.sales
  FOR UPDATE USING (public.is_staff_or_higher(store_id));
CREATE POLICY "Owner can delete sales" ON public.sales
  FOR DELETE USING (public.is_owner(store_id));

-- SALE ITEMS POLICIES
CREATE POLICY "Members can view sale items" ON public.sale_items
  FOR SELECT USING (public.is_store_member(public.get_store_from_sale(sale_id)));
CREATE POLICY "Staff+ can insert sale items" ON public.sale_items
  FOR INSERT WITH CHECK (public.is_staff_or_higher(public.get_store_from_sale(sale_id)));
CREATE POLICY "Staff+ can update sale items" ON public.sale_items
  FOR UPDATE USING (public.is_staff_or_higher(public.get_store_from_sale(sale_id)));
CREATE POLICY "Owner can delete sale items" ON public.sale_items
  FOR DELETE USING (public.is_owner(public.get_store_from_sale(sale_id)));

-- INVOICES POLICIES
CREATE POLICY "Members can view invoices" ON public.invoices
  FOR SELECT USING (public.is_store_member(store_id));
CREATE POLICY "Staff+ can insert invoices" ON public.invoices
  FOR INSERT WITH CHECK (public.is_staff_or_higher(store_id));
CREATE POLICY "Staff+ can update invoices" ON public.invoices
  FOR UPDATE USING (public.is_staff_or_higher(store_id));
CREATE POLICY "Owner can delete invoices" ON public.invoices
  FOR DELETE USING (public.is_owner(store_id));

-- STOCK LEDGER POLICIES
CREATE POLICY "Members can view stock ledger" ON public.stock_ledger
  FOR SELECT USING (public.is_store_member(store_id));
CREATE POLICY "Manager/Owner can insert stock ledger" ON public.stock_ledger
  FOR INSERT WITH CHECK (public.is_manager_or_owner(store_id));
CREATE POLICY "Manager/Owner can update stock ledger" ON public.stock_ledger
  FOR UPDATE USING (public.is_manager_or_owner(store_id));
CREATE POLICY "Owner can delete stock ledger" ON public.stock_ledger
  FOR DELETE USING (public.is_owner(store_id));

-- STOCK ADJUSTMENTS POLICIES
CREATE POLICY "Members can view adjustments" ON public.stock_adjustments
  FOR SELECT USING (public.is_store_member(store_id));
CREATE POLICY "Manager/Owner can insert adjustments" ON public.stock_adjustments
  FOR INSERT WITH CHECK (public.is_manager_or_owner(store_id));
CREATE POLICY "Manager/Owner can update adjustments" ON public.stock_adjustments
  FOR UPDATE USING (public.is_manager_or_owner(store_id));
CREATE POLICY "Owner can delete adjustments" ON public.stock_adjustments
  FOR DELETE USING (public.is_owner(store_id));

-- WARRANTY RECORDS POLICIES
CREATE POLICY "Members can view warranties" ON public.warranty_records
  FOR SELECT USING (public.is_store_member(store_id));
CREATE POLICY "Manager/Owner can insert warranties" ON public.warranty_records
  FOR INSERT WITH CHECK (public.is_manager_or_owner(store_id));
CREATE POLICY "Manager/Owner can update warranties" ON public.warranty_records
  FOR UPDATE USING (public.is_manager_or_owner(store_id));
CREATE POLICY "Owner can delete warranties" ON public.warranty_records
  FOR DELETE USING (public.is_owner(store_id));

-- WARRANTY CLAIMS POLICIES
CREATE POLICY "Members can view claims" ON public.warranty_claims
  FOR SELECT USING (public.is_store_member(store_id));
CREATE POLICY "Staff+ can insert claims" ON public.warranty_claims
  FOR INSERT WITH CHECK (public.is_staff_or_higher(store_id));
CREATE POLICY "Manager/Owner can update claims" ON public.warranty_claims
  FOR UPDATE USING (public.is_manager_or_owner(store_id));
CREATE POLICY "Owner can delete claims" ON public.warranty_claims
  FOR DELETE USING (public.is_owner(store_id));

-- ACTIVITY LOGS POLICIES
CREATE POLICY "Members can view logs" ON public.activity_logs
  FOR SELECT USING (public.is_store_member(store_id));
CREATE POLICY "Members can insert logs" ON public.activity_logs
  FOR INSERT WITH CHECK (public.is_store_member(store_id));
CREATE POLICY "Owner can delete logs" ON public.activity_logs
  FOR DELETE USING (public.is_owner(store_id));

-- =============================================
-- TRIGGERS FOR AUTO-UPDATES
-- =============================================

-- Update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to all tables with updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_stores_updated_at BEFORE UPDATE ON public.stores
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON public.categories
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_brands_updated_at BEFORE UPDATE ON public.brands
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_suppliers_updated_at BEFORE UPDATE ON public.suppliers
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON public.customers
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_purchases_updated_at BEFORE UPDATE ON public.purchases
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_sales_updated_at BEFORE UPDATE ON public.sales
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_invoices_updated_at BEFORE UPDATE ON public.invoices
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_warranty_records_updated_at BEFORE UPDATE ON public.warranty_records
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_warranty_claims_updated_at BEFORE UPDATE ON public.warranty_claims
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Generate invoice number
CREATE OR REPLACE FUNCTION public.generate_invoice_number(_store_id UUID)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  prefix TEXT;
  seq INTEGER;
  year_month TEXT;
BEGIN
  SELECT COALESCE(invoice_prefix, 'INV') INTO prefix FROM public.stores WHERE id = _store_id;
  year_month := to_char(CURRENT_DATE, 'YYYYMM');
  
  SELECT COALESCE(MAX(
    CAST(NULLIF(regexp_replace(invoice_number, '[^0-9]', '', 'g'), '') AS INTEGER)
  ), 0) + 1 INTO seq
  FROM public.invoices 
  WHERE store_id = _store_id 
  AND invoice_number LIKE prefix || '-' || year_month || '-%';
  
  RETURN prefix || '-' || year_month || '-' || LPAD(seq::TEXT, 4, '0');
END;
$$;