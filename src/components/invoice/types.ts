export interface InvoiceItem {
  id: string;
  name: string;
  sku?: string;
  quantity: number;
  unitPrice: number;
  discount?: number;
  total: number;
  serialNumber?: string;
  warranty?: {
    type: string;
    duration: number;
    unit: string;
  };
}

export interface InvoiceData {
  id: string;
  invoiceNumber: string;
  invoiceDate: string;
  dueDate?: string;
  store: {
    name: string;
    phone?: string;
    email?: string;
    address?: string;
    logoUrl?: string;
  };
  customer?: {
    name: string;
    phone?: string;
    email?: string;
    address?: string;
  };
  items: InvoiceItem[];
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  paidAmount: number;
  dueAmount: number;
  paymentMethod: string;
  paymentStatus: string;
  notes?: string;
  headerNote?: string;
  footerNote?: string;
}

export type InvoiceTemplate = 'classic' | 'modern' | 'minimal' | 'professional' | 'elegant';

export interface InvoiceTemplateInfo {
  id: InvoiceTemplate;
  name: string;
  nameBn: string;
  description: string;
}

export const invoiceTemplates: InvoiceTemplateInfo[] = [
  {
    id: 'classic',
    name: 'Classic',
    nameBn: 'ক্লাসিক',
    description: 'সাধারণ ও পরিচ্ছন্ন ডিজাইন',
  },
  {
    id: 'modern',
    name: 'Modern',
    nameBn: 'আধুনিক',
    description: 'রঙিন ও আকর্ষণীয় ডিজাইন',
  },
  {
    id: 'minimal',
    name: 'Minimal',
    nameBn: 'মিনিমাল',
    description: 'সংক্ষিপ্ত ও সহজ',
  },
  {
    id: 'professional',
    name: 'Professional',
    nameBn: 'প্রফেশনাল',
    description: 'ব্যবসায়িক ও গম্ভীর',
  },
  {
    id: 'elegant',
    name: 'Elegant',
    nameBn: 'এলিগ্যান্ট',
    description: 'মার্জিত ও সুন্দর',
  },
];
