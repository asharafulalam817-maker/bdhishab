import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useDemo } from '@/contexts/DemoContext';
import { useToast } from '@/hooks/use-toast';
import { useBalance } from '@/hooks/useBalance';

export type ExpenseCategory = 
  | 'rent' 
  | 'utilities' 
  | 'salary' 
  | 'inventory' 
  | 'maintenance' 
  | 'marketing' 
  | 'transport' 
  | 'other';

export interface Expense {
  id: string;
  store_id: string;
  category: ExpenseCategory;
  amount: number;
  description: string | null;
  expense_date: string;
  notes: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export const EXPENSE_CATEGORIES: { value: ExpenseCategory; label: string; icon: string }[] = [
  { value: 'rent', label: 'ভাড়া', icon: '🏠' },
  { value: 'utilities', label: 'বিদ্যুৎ/গ্যাস/পানি', icon: '💡' },
  { value: 'salary', label: 'বেতন', icon: '👨‍💼' },
  { value: 'inventory', label: 'মালামাল', icon: '📦' },
  { value: 'maintenance', label: 'মেরামত', icon: '🔧' },
  { value: 'marketing', label: 'মার্কেটিং', icon: '📢' },
  { value: 'transport', label: 'পরিবহন', icon: '🚚' },
  { value: 'other', label: 'অন্যান্য', icon: '📋' },
];

export function useExpenses() {
  const { demoStore } = useDemo();
  const { toast } = useToast();
  const { deductBalance, refreshBalance } = useBalance();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [todayExpense, setTodayExpense] = useState(0);
  const [monthExpense, setMonthExpense] = useState(0);

  const fetchExpenses = useCallback(async (limit?: number) => {
    if (!demoStore?.id) return;
    
    setIsLoading(true);
    try {
      let query = supabase
        .from('expenses')
        .select('*')
        .eq('store_id', demoStore.id)
        .order('expense_date', { ascending: false })
        .order('created_at', { ascending: false });
      
      if (limit) {
        query = query.limit(limit);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      setExpenses((data as Expense[]) || []);
    } catch (error) {
      console.error('Error fetching expenses:', error);
    } finally {
      setIsLoading(false);
    }
  }, [demoStore?.id]);

  const fetchExpenseStats = useCallback(async () => {
    if (!demoStore?.id) return;
    
    const today = new Date().toISOString().split('T')[0];
    const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0];

    try {
      // Today's expense
      const { data: todayData } = await supabase
        .from('expenses')
        .select('amount')
        .eq('store_id', demoStore.id)
        .eq('expense_date', today);
      
      const todayTotal = (todayData || []).reduce((sum, e) => sum + Number(e.amount), 0);
      setTodayExpense(todayTotal);

      // Month's expense
      const { data: monthData } = await supabase
        .from('expenses')
        .select('amount')
        .eq('store_id', demoStore.id)
        .gte('expense_date', monthStart);
      
      const monthTotal = (monthData || []).reduce((sum, e) => sum + Number(e.amount), 0);
      setMonthExpense(monthTotal);
    } catch (error) {
      console.error('Error fetching expense stats:', error);
    }
  }, [demoStore?.id]);

  const addExpense = useCallback(async (
    category: ExpenseCategory,
    amount: number,
    description: string,
    expenseDate: string,
    notes?: string,
    deductFromBalance: boolean = true
  ) => {
    if (!demoStore?.id) return null;

    try {
      const { data, error } = await supabase
        .from('expenses')
        .insert({
          store_id: demoStore.id,
          category,
          amount,
          description,
          expense_date: expenseDate,
          notes,
        })
        .select()
        .single();

      if (error) throw error;

      // Deduct from balance if requested
      if (deductFromBalance && amount > 0) {
        await deductBalance(amount, `খরচ: ${description}`);
      }

      toast({
        title: 'খরচ যোগ হয়েছে ✓',
        description: `৳${amount.toLocaleString('bn-BD')} - ${description}`,
      });

      await fetchExpenses();
      await fetchExpenseStats();
      await refreshBalance();
      
      return data;
    } catch (error) {
      console.error('Error adding expense:', error);
      toast({
        title: 'ত্রুটি!',
        description: 'খরচ যোগ করা যায়নি',
        variant: 'destructive',
      });
      return null;
    }
  }, [demoStore?.id, deductBalance, fetchExpenses, fetchExpenseStats, refreshBalance, toast]);

  const deleteExpense = useCallback(async (expenseId: string) => {
    try {
      const { error } = await supabase
        .from('expenses')
        .delete()
        .eq('id', expenseId);

      if (error) throw error;

      toast({
        title: 'খরচ মুছে ফেলা হয়েছে',
      });

      await fetchExpenses();
      await fetchExpenseStats();
    } catch (error) {
      console.error('Error deleting expense:', error);
      toast({
        title: 'ত্রুটি!',
        description: 'খরচ মুছে ফেলা যায়নি',
        variant: 'destructive',
      });
    }
  }, [fetchExpenses, fetchExpenseStats, toast]);

  useEffect(() => {
    if (demoStore?.id) {
      fetchExpenses();
      fetchExpenseStats();
    }
  }, [demoStore?.id, fetchExpenses, fetchExpenseStats]);

  return {
    expenses,
    isLoading,
    todayExpense,
    monthExpense,
    addExpense,
    deleteExpense,
    refreshExpenses: fetchExpenses,
    refreshStats: fetchExpenseStats,
  };
}
