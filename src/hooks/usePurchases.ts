import { useState, useMemo } from 'react';
import type { Supplier } from './useSuppliers';

export interface PurchaseItem {
  id: string;
  product_id: string;
  product_name: string;
  quantity: number;
  unit_cost: number;
  total: number;
}

export interface Purchase {
  id: string;
  invoice_number: string | null;
  supplier_id: string | null;
  supplier_name: string | null;
  purchase_date: string;
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  paid_amount: number;
  due_amount: number;
  payment_status: 'paid' | 'partial' | 'due';
  notes: string | null;
  items: PurchaseItem[];
  created_at: string;
}

// Demo purchases data
const DEMO_PURCHASES: Purchase[] = [
  {
    id: '1',
    invoice_number: 'PUR-202501-001',
    supplier_id: '1',
    supplier_name: 'ওয়ালটন ডিস্ট্রিবিউটর',
    purchase_date: '2025-01-20',
    subtotal: 150000,
    discount: 5000,
    tax: 0,
    total: 145000,
    paid_amount: 100000,
    due_amount: 45000,
    payment_status: 'partial',
    notes: null,
    items: [
      { id: '1', product_id: 'p1', product_name: 'ওয়ালটন ফ্রিজ 12CFT', quantity: 5, unit_cost: 25000, total: 125000 },
      { id: '2', product_id: 'p2', product_name: 'ওয়ালটন এসি 1.5 টন', quantity: 1, unit_cost: 25000, total: 25000 },
    ],
    created_at: '2025-01-20T10:00:00Z',
  },
  {
    id: '2',
    invoice_number: 'PUR-202501-002',
    supplier_id: '2',
    supplier_name: 'স্যামসাং বাংলাদেশ',
    purchase_date: '2025-01-18',
    subtotal: 280000,
    discount: 0,
    tax: 0,
    total: 280000,
    paid_amount: 280000,
    due_amount: 0,
    payment_status: 'paid',
    notes: 'ক্যাশ পেমেন্ট',
    items: [
      { id: '3', product_id: 'p3', product_name: 'স্যামসাং টিভি 55"', quantity: 4, unit_cost: 70000, total: 280000 },
    ],
    created_at: '2025-01-18T10:00:00Z',
  },
  {
    id: '3',
    invoice_number: 'PUR-202501-003',
    supplier_id: '3',
    supplier_name: 'সিঙ্গার বাংলাদেশ',
    purchase_date: '2025-01-15',
    subtotal: 95000,
    discount: 0,
    tax: 0,
    total: 95000,
    paid_amount: 0,
    due_amount: 95000,
    payment_status: 'due',
    notes: null,
    items: [
      { id: '4', product_id: 'p4', product_name: 'সিঙ্গার ওয়াশিং মেশিন', quantity: 5, unit_cost: 19000, total: 95000 },
    ],
    created_at: '2025-01-15T10:00:00Z',
  },
];

// Demo products for selection
export const DEMO_PRODUCTS = [
  { id: 'p1', name: 'ওয়ালটন ফ্রিজ 12CFT', purchase_cost: 25000, current_stock: 15 },
  { id: 'p2', name: 'ওয়ালটন এসি 1.5 টন', purchase_cost: 45000, current_stock: 8 },
  { id: 'p3', name: 'স্যামসাং টিভি 55"', purchase_cost: 70000, current_stock: 12 },
  { id: 'p4', name: 'সিঙ্গার ওয়াশিং মেশিন', purchase_cost: 19000, current_stock: 20 },
  { id: 'p5', name: 'ভিশন মাইক্রোওয়েভ ওভেন', purchase_cost: 8500, current_stock: 25 },
  { id: 'p6', name: 'মার্সেল ব্লেন্ডার', purchase_cost: 3500, current_stock: 30 },
];

// Demo suppliers for selection
export const DEMO_SUPPLIERS: Supplier[] = [
  { id: '1', name: 'ওয়ালটন ডিস্ট্রিবিউটর', phone: '01711223344', email: 'walton@dist.com', address: 'গাজীপুর', due_amount: 125000, created_at: '', updated_at: '' },
  { id: '2', name: 'স্যামসাং বাংলাদেশ', phone: '01899887766', email: 'samsung@bd.com', address: 'উত্তরা', due_amount: 0, created_at: '', updated_at: '' },
  { id: '3', name: 'সিঙ্গার বাংলাদেশ', phone: '01555667788', email: null, address: 'মতিঝিল', due_amount: 85000, created_at: '', updated_at: '' },
  { id: '4', name: 'ভিশন ইলেকট্রনিক্স', phone: '01622334455', email: 'vision@electronics.com', address: 'টঙ্গী', due_amount: 45000, created_at: '', updated_at: '' },
  { id: '5', name: 'মার্সেল ইন্ডাস্ট্রিজ', phone: '01933445566', email: null, address: 'আশুলিয়া', due_amount: 0, created_at: '', updated_at: '' },
];

export interface PurchaseFormData {
  supplier_id: string;
  invoice_number: string;
  purchase_date: string;
  items: {
    product_id: string;
    product_name: string;
    quantity: number;
    unit_cost: number;
  }[];
  discount: number;
  paid_amount: number;
  notes: string;
}

export function usePurchases() {
  const [purchases, setPurchases] = useState<Purchase[]>(DEMO_PURCHASES);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'paid' | 'partial' | 'due'>('all');

  const filteredPurchases = useMemo(() => {
    return purchases.filter((purchase) => {
      const matchesSearch =
        purchase.invoice_number?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        purchase.supplier_name?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        filterStatus === 'all' || purchase.payment_status === filterStatus;

      return matchesSearch && matchesStatus;
    });
  }, [purchases, searchQuery, filterStatus]);

  const addPurchase = (data: PurchaseFormData) => {
    const subtotal = data.items.reduce((sum, item) => sum + item.quantity * item.unit_cost, 0);
    const total = subtotal - data.discount;
    const due_amount = total - data.paid_amount;
    const payment_status: 'paid' | 'partial' | 'due' = 
      data.paid_amount >= total ? 'paid' : data.paid_amount > 0 ? 'partial' : 'due';

    const supplier = DEMO_SUPPLIERS.find(s => s.id === data.supplier_id);

    const newPurchase: Purchase = {
      id: Date.now().toString(),
      invoice_number: data.invoice_number || `PUR-${new Date().toISOString().slice(0, 7).replace('-', '')}-${String(purchases.length + 1).padStart(3, '0')}`,
      supplier_id: data.supplier_id || null,
      supplier_name: supplier?.name || null,
      purchase_date: data.purchase_date,
      subtotal,
      discount: data.discount,
      tax: 0,
      total,
      paid_amount: data.paid_amount,
      due_amount,
      payment_status,
      notes: data.notes || null,
      items: data.items.map((item, index) => ({
        id: `${Date.now()}-${index}`,
        product_id: item.product_id,
        product_name: item.product_name,
        quantity: item.quantity,
        unit_cost: item.unit_cost,
        total: item.quantity * item.unit_cost,
      })),
      created_at: new Date().toISOString(),
    };

    setPurchases((prev) => [newPurchase, ...prev]);
    return newPurchase;
  };

  const deletePurchase = (id: string) => {
    setPurchases((prev) => prev.filter((p) => p.id !== id));
  };

  const totalPurchases = useMemo(() => {
    return purchases.reduce((sum, p) => sum + p.total, 0);
  }, [purchases]);

  const totalDue = useMemo(() => {
    return purchases.reduce((sum, p) => sum + p.due_amount, 0);
  }, [purchases]);

  return {
    purchases: filteredPurchases,
    allPurchases: purchases,
    searchQuery,
    setSearchQuery,
    filterStatus,
    setFilterStatus,
    addPurchase,
    deletePurchase,
    totalPurchases,
    totalDue,
    suppliers: DEMO_SUPPLIERS,
    products: DEMO_PRODUCTS,
  };
}
