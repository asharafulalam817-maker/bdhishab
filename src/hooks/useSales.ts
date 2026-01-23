import { useState, useMemo } from 'react';
import { Product } from './useProducts';

export interface SaleItem {
  productId: string;
  productName: string;
  sku: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  total: number;
  serialNumber?: string;
}

export interface Sale {
  id: string;
  invoiceNumber: string;
  customerId?: string;
  customerName?: string;
  customerPhone?: string;
  items: SaleItem[];
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  paidAmount: number;
  dueAmount: number;
  paymentMethod: 'cash' | 'bkash' | 'nagad' | 'bank' | 'due' | 'mixed';
  paymentStatus: 'paid' | 'partial' | 'due';
  notes?: string;
  saleDate: string;
  createdAt: string;
}

// Demo sales
const DEMO_SALES: Sale[] = [
  {
    id: '1',
    invoiceNumber: 'INV-202501-001',
    customerId: '1',
    customerName: 'মোহাম্মদ করিম',
    customerPhone: '01712345678',
    items: [
      { productId: '1', productName: 'স্যামসাং গ্যালাক্সি A54', sku: 'SAM-A54', quantity: 1, unitPrice: 35000, discount: 0, total: 35000 }
    ],
    subtotal: 35000,
    discount: 0,
    tax: 0,
    total: 35000,
    paidAmount: 35000,
    dueAmount: 0,
    paymentMethod: 'cash',
    paymentStatus: 'paid',
    saleDate: '2025-01-22',
    createdAt: '2025-01-22T10:30:00',
  },
  {
    id: '2',
    invoiceNumber: 'INV-202501-002',
    customerId: '2',
    customerName: 'ফাতেমা বেগম',
    customerPhone: '01812345678',
    items: [
      { productId: '4', productName: 'JBL ব্লুটুথ স্পিকার', sku: 'JBL-BT01', quantity: 1, unitPrice: 4500, discount: 0, total: 4500 },
      { productId: '3', productName: 'শাওমি পাওয়ার ব্যাংক', sku: 'XM-PB20', quantity: 2, unitPrice: 1800, discount: 0, total: 3600 }
    ],
    subtotal: 8100,
    discount: 100,
    tax: 0,
    total: 8000,
    paidAmount: 5000,
    dueAmount: 3000,
    paymentMethod: 'mixed',
    paymentStatus: 'partial',
    saleDate: '2025-01-22',
    createdAt: '2025-01-22T14:15:00',
  },
  {
    id: '3',
    invoiceNumber: 'INV-202501-003',
    customerName: 'ওয়াক-ইন কাস্টমার',
    items: [
      { productId: '6', productName: 'স্যামসাং এয়ারবাডস', sku: 'SAM-BUDS', quantity: 1, unitPrice: 3500, discount: 0, total: 3500 }
    ],
    subtotal: 3500,
    discount: 0,
    tax: 0,
    total: 3500,
    paidAmount: 3500,
    dueAmount: 0,
    paymentMethod: 'bkash',
    paymentStatus: 'paid',
    saleDate: '2025-01-21',
    createdAt: '2025-01-21T16:45:00',
  },
  {
    id: '4',
    invoiceNumber: 'INV-202501-004',
    customerId: '3',
    customerName: 'রহিম উদ্দিন',
    customerPhone: '01912345678',
    items: [
      { productId: '2', productName: 'আইফোন ১৫ প্রো ম্যাক্স', sku: 'IP15-PRO', quantity: 1, unitPrice: 175000, discount: 5000, total: 170000 }
    ],
    subtotal: 175000,
    discount: 5000,
    tax: 0,
    total: 170000,
    paidAmount: 100000,
    dueAmount: 70000,
    paymentMethod: 'mixed',
    paymentStatus: 'partial',
    saleDate: '2025-01-20',
    createdAt: '2025-01-20T11:00:00',
  },
];

export function useSales() {
  const [sales, setSales] = useState<Sale[]>(DEMO_SALES);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'paid' | 'partial' | 'due'>('all');
  const [dateFilter, setDateFilter] = useState<{ from?: string; to?: string }>({});

  const filteredSales = useMemo(() => {
    return sales.filter((sale) => {
      const matchesSearch =
        sale.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (sale.customerName && sale.customerName.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (sale.customerPhone && sale.customerPhone.includes(searchQuery));
      
      const matchesStatus = statusFilter === 'all' || sale.paymentStatus === statusFilter;
      
      let matchesDate = true;
      if (dateFilter.from) {
        matchesDate = matchesDate && sale.saleDate >= dateFilter.from;
      }
      if (dateFilter.to) {
        matchesDate = matchesDate && sale.saleDate <= dateFilter.to;
      }
      
      return matchesSearch && matchesStatus && matchesDate;
    });
  }, [sales, searchQuery, statusFilter, dateFilter]);

  const stats = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    const todaySales = sales.filter(s => s.saleDate === today);
    const todayTotal = todaySales.reduce((sum, s) => sum + s.total, 0);
    
    const currentMonth = today.substring(0, 7);
    const monthSales = sales.filter(s => s.saleDate.startsWith(currentMonth));
    const monthTotal = monthSales.reduce((sum, s) => sum + s.total, 0);
    
    const totalDue = sales.reduce((sum, s) => sum + s.dueAmount, 0);
    const totalSales = sales.length;
    
    return { todayTotal, monthTotal, totalDue, totalSales, todaySalesCount: todaySales.length };
  }, [sales]);

  const generateInvoiceNumber = () => {
    const now = new Date();
    const yearMonth = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}`;
    const count = sales.filter(s => s.invoiceNumber.includes(yearMonth)).length + 1;
    return `INV-${yearMonth}-${String(count).padStart(3, '0')}`;
  };

  const createSale = (saleData: Omit<Sale, 'id' | 'invoiceNumber' | 'createdAt'>) => {
    const newSale: Sale = {
      ...saleData,
      id: Date.now().toString(),
      invoiceNumber: generateInvoiceNumber(),
      createdAt: new Date().toISOString(),
    };
    setSales([newSale, ...sales]);
    return newSale;
  };

  const updateSale = (id: string, saleData: Partial<Sale>) => {
    setSales(sales.map(s => s.id === id ? { ...s, ...saleData } : s));
  };

  const deleteSale = (id: string) => {
    setSales(sales.filter(s => s.id !== id));
  };

  const getSaleById = (id: string) => {
    return sales.find(s => s.id === id);
  };

  return {
    sales,
    filteredSales,
    stats,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    dateFilter,
    setDateFilter,
    createSale,
    updateSale,
    deleteSale,
    getSaleById,
    generateInvoiceNumber,
  };
}
