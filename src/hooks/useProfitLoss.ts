import { useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useDemo } from '@/contexts/DemoContext';

interface MonthlyData {
  month: string;
  monthLabel: string;
  sales: number;
  purchases: number;
  expenses: number;
  grossProfit: number;
  netProfit: number;
}

interface ProfitLossSummary {
  totalSales: number;
  totalPurchases: number;
  totalExpenses: number;
  grossProfit: number;
  netProfit: number;
  profitMargin: number;
}

export function useProfitLoss(monthsToFetch: number = 6) {
  const { demoStore } = useDemo();
  const [isLoading, setIsLoading] = useState(true);
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);
  const [currentMonthData, setCurrentMonthData] = useState<MonthlyData | null>(null);

  const fetchProfitLossData = useCallback(async () => {
    if (!demoStore?.id) return;

    setIsLoading(true);
    try {
      const months: MonthlyData[] = [];
      const now = new Date();

      for (let i = 0; i < monthsToFetch; i++) {
        const targetDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const monthStart = targetDate.toISOString().split('T')[0];
        const monthEnd = new Date(targetDate.getFullYear(), targetDate.getMonth() + 1, 0).toISOString().split('T')[0];
        
        const monthKey = `${targetDate.getFullYear()}-${String(targetDate.getMonth() + 1).padStart(2, '0')}`;
        const monthLabel = targetDate.toLocaleDateString('bn-BD', { month: 'short', year: 'numeric' });

        // Fetch sales for the month
        const { data: salesData } = await supabase
          .from('sales')
          .select('total, paid_amount')
          .eq('store_id', demoStore.id)
          .gte('sale_date', monthStart)
          .lte('sale_date', monthEnd);
        
        const totalSales = (salesData || []).reduce((sum, s) => sum + Number(s.paid_amount || s.total || 0), 0);

        // Fetch purchases for the month
        const { data: purchasesData } = await supabase
          .from('purchases')
          .select('total, paid_amount')
          .eq('store_id', demoStore.id)
          .gte('purchase_date', monthStart)
          .lte('purchase_date', monthEnd);
        
        const totalPurchases = (purchasesData || []).reduce((sum, p) => sum + Number(p.paid_amount || p.total || 0), 0);

        // Fetch expenses for the month
        const { data: expensesData } = await supabase
          .from('expenses')
          .select('amount')
          .eq('store_id', demoStore.id)
          .gte('expense_date', monthStart)
          .lte('expense_date', monthEnd);
        
        const totalExpenses = (expensesData || []).reduce((sum, e) => sum + Number(e.amount || 0), 0);

        const grossProfit = totalSales - totalPurchases;
        const netProfit = grossProfit - totalExpenses;

        months.push({
          month: monthKey,
          monthLabel,
          sales: totalSales,
          purchases: totalPurchases,
          expenses: totalExpenses,
          grossProfit,
          netProfit,
        });
      }

      setMonthlyData(months);
      if (months.length > 0) {
        setCurrentMonthData(months[0]);
      }
    } catch (error) {
      console.error('Error fetching profit/loss data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [demoStore?.id, monthsToFetch]);

  useEffect(() => {
    fetchProfitLossData();
  }, [fetchProfitLossData]);

  const summary = useMemo((): ProfitLossSummary => {
    if (!currentMonthData) {
      return {
        totalSales: 0,
        totalPurchases: 0,
        totalExpenses: 0,
        grossProfit: 0,
        netProfit: 0,
        profitMargin: 0,
      };
    }

    const profitMargin = currentMonthData.sales > 0 
      ? (currentMonthData.netProfit / currentMonthData.sales) * 100 
      : 0;

    return {
      totalSales: currentMonthData.sales,
      totalPurchases: currentMonthData.purchases,
      totalExpenses: currentMonthData.expenses,
      grossProfit: currentMonthData.grossProfit,
      netProfit: currentMonthData.netProfit,
      profitMargin,
    };
  }, [currentMonthData]);

  const chartData = useMemo(() => {
    return [...monthlyData].reverse().map(m => ({
      month: m.monthLabel,
      sales: m.sales,
      purchases: m.purchases,
      expenses: m.expenses,
      profit: m.netProfit,
    }));
  }, [monthlyData]);

  const comparisonWithLastMonth = useMemo(() => {
    if (monthlyData.length < 2) return null;
    
    const current = monthlyData[0];
    const previous = monthlyData[1];
    
    const salesChange = previous.sales > 0 
      ? ((current.sales - previous.sales) / previous.sales) * 100 
      : 0;
    
    const profitChange = previous.netProfit !== 0 
      ? ((current.netProfit - previous.netProfit) / Math.abs(previous.netProfit)) * 100 
      : 0;
    
    const expenseChange = previous.expenses > 0 
      ? ((current.expenses - previous.expenses) / previous.expenses) * 100 
      : 0;

    return {
      salesChange,
      profitChange,
      expenseChange,
      previousSales: previous.sales,
      previousProfit: previous.netProfit,
      previousExpenses: previous.expenses,
    };
  }, [monthlyData]);

  return {
    isLoading,
    monthlyData,
    currentMonthData,
    summary,
    chartData,
    comparisonWithLastMonth,
    refresh: fetchProfitLossData,
  };
}
