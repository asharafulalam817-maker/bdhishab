import { useMemo } from 'react';

interface DailySalesData {
  date: string;
  sales: number;
  profit: number;
  transactions: number;
}

interface TopProduct {
  id: string;
  name: string;
  sku: string;
  quantitySold: number;
  revenue: number;
}

interface CustomerDue {
  customerId: string;
  customerName: string;
  phone: string;
  totalDue: number;
  lastSaleDate: string;
}

// Demo data for reports
const DEMO_DAILY_SALES: DailySalesData[] = [
  { date: '2025-01-22', sales: 43000, profit: 8500, transactions: 2 },
  { date: '2025-01-21', sales: 3500, profit: 1000, transactions: 1 },
  { date: '2025-01-20', sales: 170000, profit: 25000, transactions: 1 },
  { date: '2025-01-19', sales: 55000, profit: 9500, transactions: 3 },
  { date: '2025-01-18', sales: 28000, profit: 5500, transactions: 2 },
  { date: '2025-01-17', sales: 72000, profit: 12000, transactions: 4 },
  { date: '2025-01-16', sales: 15000, profit: 3000, transactions: 2 },
];

const DEMO_TOP_PRODUCTS: TopProduct[] = [
  { id: '1', name: 'স্যামসাং গ্যালাক্সি A54', sku: 'SAM-A54', quantitySold: 25, revenue: 875000 },
  { id: '2', name: 'আইফোন ১৫ প্রো ম্যাক্স', sku: 'IP15-PRO', quantitySold: 8, revenue: 1400000 },
  { id: '3', name: 'শাওমি পাওয়ার ব্যাংক', sku: 'XM-PB20', quantitySold: 120, revenue: 216000 },
  { id: '4', name: 'JBL ব্লুটুথ স্পিকার', sku: 'JBL-BT01', quantitySold: 35, revenue: 157500 },
  { id: '5', name: 'রিয়েলমি সি৫৫', sku: 'RM-C55', quantitySold: 18, revenue: 333000 },
];

const DEMO_CUSTOMER_DUES: CustomerDue[] = [
  { customerId: '1', customerName: 'মোহাম্মদ করিম', phone: '01712345678', totalDue: 15000, lastSaleDate: '2025-01-18' },
  { customerId: '2', customerName: 'ফাতেমা বেগম', phone: '01812345678', totalDue: 3000, lastSaleDate: '2025-01-22' },
  { customerId: '3', customerName: 'রহিম উদ্দিন', phone: '01912345678', totalDue: 70000, lastSaleDate: '2025-01-20' },
  { customerId: '4', customerName: 'আবদুল হক', phone: '01612345678', totalDue: 25000, lastSaleDate: '2025-01-15' },
];

export function useReports() {
  const dailySales = DEMO_DAILY_SALES;
  const topProducts = DEMO_TOP_PRODUCTS;
  const customerDues = DEMO_CUSTOMER_DUES;

  const summary = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    const todayData = dailySales.find(d => d.date === today) || { sales: 0, profit: 0, transactions: 0 };
    
    // Current month
    const currentMonth = today.substring(0, 7);
    const monthData = dailySales.filter(d => d.date.startsWith(currentMonth));
    const monthSales = monthData.reduce((sum, d) => sum + d.sales, 0);
    const monthProfit = monthData.reduce((sum, d) => sum + d.profit, 0);
    const monthTransactions = monthData.reduce((sum, d) => sum + d.transactions, 0);
    
    // Last 7 days
    const last7Days = dailySales.slice(0, 7);
    const weekSales = last7Days.reduce((sum, d) => sum + d.sales, 0);
    const weekProfit = last7Days.reduce((sum, d) => sum + d.profit, 0);
    
    // Total dues
    const totalCustomerDue = customerDues.reduce((sum, c) => sum + c.totalDue, 0);
    
    return {
      todaySales: todayData.sales,
      todayProfit: todayData.profit,
      todayTransactions: todayData.transactions,
      monthSales,
      monthProfit,
      monthTransactions,
      weekSales,
      weekProfit,
      totalCustomerDue,
    };
  }, [dailySales, customerDues]);

  const chartData = useMemo(() => {
    return dailySales.slice(0, 7).reverse().map(d => ({
      date: new Date(d.date).toLocaleDateString('bn-BD', { day: 'numeric', month: 'short' }),
      sales: d.sales,
      profit: d.profit,
    }));
  }, [dailySales]);

  const profitMargin = useMemo(() => {
    const totalSales = dailySales.reduce((sum, d) => sum + d.sales, 0);
    const totalProfit = dailySales.reduce((sum, d) => sum + d.profit, 0);
    return totalSales > 0 ? ((totalProfit / totalSales) * 100).toFixed(1) : '0';
  }, [dailySales]);

  return {
    dailySales,
    topProducts,
    customerDues,
    summary,
    chartData,
    profitMargin,
  };
}
