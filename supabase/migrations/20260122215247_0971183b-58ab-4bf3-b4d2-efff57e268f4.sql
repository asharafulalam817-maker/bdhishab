-- Add invoice template selection to stores
ALTER TABLE public.stores 
ADD COLUMN invoice_template text NOT NULL DEFAULT 'classic';

-- Add constraint for valid templates
ALTER TABLE public.stores
ADD CONSTRAINT valid_invoice_template 
CHECK (invoice_template IN ('classic', 'modern', 'minimal', 'professional', 'elegant'));