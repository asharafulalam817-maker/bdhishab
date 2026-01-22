import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { startOfDay, endOfDay, startOfMonth, endOfMonth, addDays } from 'date-fns';

export interface DashboardStats {
  todaySales: number;
  todayInvoices: number;
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

export function useDashboardStats() {
  const { currentStore } = useAuth();
  const storeId = currentStore?.store_id;

  return useQuery({
    queryKey: ['dashboard-stats', storeId],
    queryFn: async (): Promise<DashboardStats> => {
      if (!storeId) throw new Error('No store selected');

      const today = new Date();
      const todayStart = startOfDay(today).toISOString();
      const todayEnd = endOfDay(today).toISOString();
      const monthStart = startOfMonth(today).toISOString();
      const monthEnd = endOfMonth(today).toISOString();
      const next7Days = addDays(today, 7).toISOString();
      const next30Days = addDays(today, 30).toISOString();

      // Fetch all stats in parallel
      const [
        todaySalesResult,
        monthSalesResult,
        customerDueResult,
        supplierDueResult,
        lowStockResult,
        warranty7Result,
        warranty30Result,
        totalProductsResult,
        totalCustomersResult,
      ] = await Promise.all([
        // Today's sales
        supabase
          .from('sales')
          .select('total')
          .eq('store_id', storeId)
          .gte('created_at', todayStart)
          .lte('created_at', todayEnd),
        
        // Month's sales
        supabase
          .from('sales')
          .select('total')
          .eq('store_id', storeId)
          .gte('created_at', monthStart)
          .lte('created_at', monthEnd),
        
        // Customer due
        supabase
          .from('customers')
          .select('due_amount')
          .eq('store_id', storeId)
          .gt('due_amount', 0),
        
        // Supplier due
        supabase
          .from('suppliers')
          .select('due_amount')
          .eq('store_id', storeId)
          .gt('due_amount', 0),
        
        // Low stock products - will be calculated manually
        Promise.resolve({ count: 0 }),
        
        // Warranty expiring in 7 days
        supabase
          .from('warranty_records')
          .select('id', { count: 'exact' })
          .eq('store_id', storeId)
          .eq('status', 'active')
          .lte('warranty_expiry', next7Days)
          .gte('warranty_expiry', today.toISOString()),
        
        // Warranty expiring in 30 days
        supabase
          .from('warranty_records')
          .select('id', { count: 'exact' })
          .eq('store_id', storeId)
          .eq('status', 'active')
          .lte('warranty_expiry', next30Days)
          .gte('warranty_expiry', today.toISOString()),
        
        // Total products
        supabase
          .from('products')
          .select('id', { count: 'exact' })
          .eq('store_id', storeId),
        
        // Total customers
        supabase
          .from('customers')
          .select('id', { count: 'exact' })
          .eq('store_id', storeId),
      ]);

      // Calculate totals
      const todaySales = todaySalesResult.data?.reduce((sum, s) => sum + (Number(s.total) || 0), 0) || 0;
      const todayInvoices = todaySalesResult.data?.length || 0;
      const monthSales = monthSalesResult.data?.reduce((sum, s) => sum + (Number(s.total) || 0), 0) || 0;
      const monthInvoices = monthSalesResult.data?.length || 0;
      const customerDue = customerDueResult.data?.reduce((sum, c) => sum + (Number(c.due_amount) || 0), 0) || 0;
      const supplierDue = supplierDueResult.data?.reduce((sum, s) => sum + (Number(s.due_amount) || 0), 0) || 0;

      // Count low stock items manually
      const { data: products } = await supabase
        .from('products')
        .select('current_stock, low_stock_threshold')
        .eq('store_id', storeId);
      
      const lowStockCount = products?.filter(p => 
        (p.current_stock || 0) <= (p.low_stock_threshold || 10)
      ).length || 0;

      return {
        todaySales,
        todayInvoices,
        monthSales,
        monthInvoices,
        customerDue,
        supplierDue,
        lowStockCount,
        warrantyExpiring7: warranty7Result.count || 0,
        warrantyExpiring30: warranty30Result.count || 0,
        totalProducts: totalProductsResult.count || 0,
        totalCustomers: totalCustomersResult.count || 0,
      };
    },
    enabled: !!storeId,
    refetchInterval: 30000, // Refresh every 30 seconds
  });
}

export function useRecentSales(limit = 5) {
  const { currentStore } = useAuth();
  const storeId = currentStore?.store_id;

  return useQuery({
    queryKey: ['recent-sales', storeId, limit],
    queryFn: async (): Promise<RecentSale[]> => {
      if (!storeId) throw new Error('No store selected');

      const { data: sales, error } = await supabase
        .from('sales')
        .select(`
          id,
          total,
          created_at,
          customer:customers (name)
        `)
        .eq('store_id', storeId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;

      // Get invoice numbers
      const salesWithInvoices = await Promise.all(
        (sales || []).map(async (sale) => {
          const { data: invoice } = await supabase
            .from('invoices')
            .select('invoice_number')
            .eq('sale_id', sale.id)
            .single();
          
          return {
            id: sale.id,
            invoice_number: invoice?.invoice_number || `SALE-${sale.id.slice(0, 8)}`,
            customer_name: (sale.customer as any)?.name || 'অজানা গ্রাহক',
            total: Number(sale.total) || 0,
            created_at: sale.created_at,
          };
        })
      );

      return salesWithInvoices;
    },
    enabled: !!storeId,
  });
}

export function useLowStockItems(limit = 5) {
  const { currentStore } = useAuth();
  const storeId = currentStore?.store_id;

  return useQuery({
    queryKey: ['low-stock-items', storeId, limit],
    queryFn: async (): Promise<LowStockItem[]> => {
      if (!storeId) throw new Error('No store selected');

      const { data, error } = await supabase
        .from('products')
        .select('id, name, sku, current_stock, low_stock_threshold')
        .eq('store_id', storeId)
        .order('current_stock', { ascending: true })
        .limit(50); // Get more to filter

      if (error) throw error;

      // Filter low stock items
      const lowStock = (data || [])
        .filter(p => (p.current_stock || 0) <= (p.low_stock_threshold || 10))
        .slice(0, limit);

      return lowStock.map(p => ({
        id: p.id,
        name: p.name,
        sku: p.sku || '',
        current_stock: p.current_stock || 0,
        low_stock_threshold: p.low_stock_threshold || 10,
      }));
    },
    enabled: !!storeId,
  });
}

export function useExpiringWarranties(days = 30, limit = 10) {
  const { currentStore } = useAuth();
  const storeId = currentStore?.store_id;

  return useQuery({
    queryKey: ['expiring-warranties', storeId, days, limit],
    queryFn: async (): Promise<ExpiringWarranty[]> => {
      if (!storeId) throw new Error('No store selected');

      const today = new Date();
      const futureDate = addDays(today, days).toISOString();

      const { data, error } = await supabase
        .from('warranty_records')
        .select(`
          id,
          warranty_expiry,
          status,
          customer_phone,
          product:products (name),
          customer:customers (name)
        `)
        .eq('store_id', storeId)
        .eq('status', 'active')
        .gte('warranty_expiry', today.toISOString())
        .lte('warranty_expiry', futureDate)
        .order('warranty_expiry', { ascending: true })
        .limit(limit);

      if (error) throw error;

      return (data || []).map(w => ({
        id: w.id,
        product_name: (w.product as any)?.name || 'অজানা পণ্য',
        customer_name: (w.customer as any)?.name || 'অজানা গ্রাহক',
        customer_phone: w.customer_phone || '',
        warranty_expiry: w.warranty_expiry,
        status: w.status || 'active',
      }));
    },
    enabled: !!storeId,
  });
}
