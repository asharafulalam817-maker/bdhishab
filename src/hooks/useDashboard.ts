import { useQuery } from '@tanstack/react-query';
import { startOfDay, endOfDay, startOfMonth, endOfMonth, addDays } from 'date-fns';

export interface DashboardStats {
  todaySales: number;
  todayInvoices: number;
  todayPurchases: number;
  todayPurchaseCount: number;
  todayDueSales: number;
  todayExpenses: number;
  todayProfit: number;
  monthSales: number;
  monthInvoices: number;
  customerDue: number;
  supplierDue: number;
  lowStockCount: number;
  warrantyExpiring7: number;
  warrantyExpiring30: number;
  totalProducts: number;
  totalCustomers: number;
}

export interface RecentSale {
  id: string;
  invoice_number: string;
  customer_name: string;
  total: number;
  created_at: string;
}

export interface LowStockItem {
  id: string;
  name: string;
  sku: string;
  current_stock: number;
  low_stock_threshold: number;
}

export interface ExpiringWarranty {
  id: string;
  product_name: string;
  customer_name: string;
  customer_phone: string;
  warranty_expiry: string;
  status: string;
}

// Demo data for development
const DEMO_STATS: DashboardStats = {
  todaySales: 25600,
  todayInvoices: 8,
  todayPurchases: 18500,
  todayPurchaseCount: 3,
  todayDueSales: 4200,
  todayExpenses: 2500,
  todayProfit: 4600,
  monthSales: 356400,
  monthInvoices: 124,
  customerDue: 45200,
  supplierDue: 28500,
  lowStockCount: 5,
  warrantyExpiring7: 3,
  warrantyExpiring30: 12,
  totalProducts: 156,
  totalCustomers: 89,
};

const DEMO_RECENT_SALES: RecentSale[] = [
  { id: '1', invoice_number: 'INV-202601-0001', customer_name: 'রহিম উদ্দিন', total: 4500, created_at: new Date().toISOString() },
  { id: '2', invoice_number: 'INV-202601-0002', customer_name: 'করিম সাহেব', total: 8200, created_at: new Date().toISOString() },
  { id: '3', invoice_number: 'INV-202601-0003', customer_name: 'জামাল হোসেন', total: 3200, created_at: new Date().toISOString() },
  { id: '4', invoice_number: 'INV-202601-0004', customer_name: 'সালমা বেগম', total: 5600, created_at: new Date().toISOString() },
  { id: '5', invoice_number: 'INV-202601-0005', customer_name: 'আব্দুল করিম', total: 4100, created_at: new Date().toISOString() },
];

const DEMO_LOW_STOCK: LowStockItem[] = [
  { id: '1', name: 'Samsung Galaxy A54', sku: 'SAM-A54-BLK', current_stock: 2, low_stock_threshold: 5 },
  { id: '2', name: 'iPhone 15 Pro Case', sku: 'IP15P-CASE', current_stock: 3, low_stock_threshold: 10 },
  { id: '3', name: 'USB-C Cable 1m', sku: 'USB-C-1M', current_stock: 5, low_stock_threshold: 20 },
  { id: '4', name: 'AirPods Pro 2', sku: 'APP-2-WHT', current_stock: 1, low_stock_threshold: 3 },
  { id: '5', name: 'Samsung Charger 25W', sku: 'SAM-CHG-25', current_stock: 4, low_stock_threshold: 10 },
];

const DEMO_EXPIRING_WARRANTIES: ExpiringWarranty[] = [
  { id: '1', product_name: 'Samsung Galaxy S23', customer_name: 'মোঃ রফিক', customer_phone: '01712345678', warranty_expiry: addDays(new Date(), 5).toISOString(), status: 'active' },
  { id: '2', product_name: 'iPhone 14 Pro', customer_name: 'করিম সাহেব', customer_phone: '01812345678', warranty_expiry: addDays(new Date(), 12).toISOString(), status: 'active' },
  { id: '3', product_name: 'OnePlus 12', customer_name: 'জাহিদ হাসান', customer_phone: '01912345678', warranty_expiry: addDays(new Date(), 25).toISOString(), status: 'active' },
];

export function useDashboardStats() {
  return useQuery({
    queryKey: ['dashboard-stats', 'demo'],
    queryFn: async (): Promise<DashboardStats> => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      return DEMO_STATS;
    },
  });
}

export function useRecentSales(limit = 5) {
  return useQuery({
    queryKey: ['recent-sales', 'demo', limit],
    queryFn: async (): Promise<RecentSale[]> => {
      await new Promise(resolve => setTimeout(resolve, 300));
      return DEMO_RECENT_SALES.slice(0, limit);
    },
  });
}

export function useLowStockItems(limit = 5) {
  return useQuery({
    queryKey: ['low-stock-items', 'demo', limit],
    queryFn: async (): Promise<LowStockItem[]> => {
      await new Promise(resolve => setTimeout(resolve, 300));
      return DEMO_LOW_STOCK.slice(0, limit);
    },
  });
}

export function useExpiringWarranties(days = 30, limit = 10) {
  return useQuery({
    queryKey: ['expiring-warranties', 'demo', days, limit],
    queryFn: async (): Promise<ExpiringWarranty[]> => {
      await new Promise(resolve => setTimeout(resolve, 300));
      return DEMO_EXPIRING_WARRANTIES.slice(0, limit);
    },
  });
}
