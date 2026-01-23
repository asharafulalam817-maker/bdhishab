import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useDemo } from '@/contexts/DemoContext';
import { toast } from 'sonner';

export interface BalanceTransaction {
  id: string;
  store_id: string;
  transaction_type: 'sale' | 'manual_add' | 'manual_deduct' | 'expense' | 'refund';
  amount: number;
  balance_after: number;
  reference_id: string | null;
  reference_type: string | null;
  notes: string | null;
  created_by: string | null;
  created_at: string;
}

export interface StoreBalance {
  id: string;
  store_id: string;
  current_balance: number;
  created_at: string;
  updated_at: string;
}

export function useBalance() {
  const { currentStoreId, demoProfile } = useDemo();
  const [balance, setBalance] = useState<StoreBalance | null>(null);
  const [transactions, setTransactions] = useState<BalanceTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const storeId = currentStoreId;

  // Fetch current balance
  const fetchBalance = async () => {
    if (!storeId) return;
    
    try {
      const { data, error } = await supabase
        .from('store_balance')
        .select('*')
        .eq('store_id', storeId)
        .maybeSingle();
      
      if (error) throw error;
      
      if (data) {
        setBalance(data as StoreBalance);
      } else {
        // Create initial balance record if doesn't exist
        const { data: newBalance, error: insertError } = await supabase
          .from('store_balance')
          .insert({ store_id: storeId, current_balance: 0 })
          .select()
          .single();
        
        if (!insertError && newBalance) {
          setBalance(newBalance as StoreBalance);
        }
      }
    } catch (error) {
      console.error('Error fetching balance:', error);
    }
  };

  // Fetch transaction history
  const fetchTransactions = async (limit = 50) => {
    if (!storeId) return;
    
    try {
      const { data, error } = await supabase
        .from('balance_transactions')
        .select('*')
        .eq('store_id', storeId)
        .order('created_at', { ascending: false })
        .limit(limit);
      
      if (error) throw error;
      setTransactions((data || []) as BalanceTransaction[]);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  // Add balance manually
  const addBalance = async (amount: number, notes?: string) => {
    if (!storeId || !balance) return false;
    
    try {
      const newBalance = balance.current_balance + amount;
      
      // Update balance
      const { error: updateError } = await supabase
        .from('store_balance')
        .update({ current_balance: newBalance })
        .eq('store_id', storeId);
      
      if (updateError) throw updateError;
      
      // Add transaction record
      const { error: txError } = await supabase
        .from('balance_transactions')
        .insert({
          store_id: storeId,
          transaction_type: 'manual_add',
          amount: amount,
          balance_after: newBalance,
          notes: notes || 'ম্যানুয়াল ব্যালেন্স যোগ',
          created_by: demoProfile.id
        });
      
      if (txError) throw txError;
      
      setBalance(prev => prev ? { ...prev, current_balance: newBalance } : null);
      await fetchTransactions();
      toast.success(`৳${amount.toLocaleString('bn-BD')} ব্যালেন্স যোগ হয়েছে`);
      return true;
    } catch (error) {
      console.error('Error adding balance:', error);
      toast.error('ব্যালেন্স যোগ করতে সমস্যা হয়েছে');
      return false;
    }
  };

  // Deduct balance manually
  const deductBalance = async (amount: number, notes?: string) => {
    if (!storeId || !balance) return false;
    
    try {
      const newBalance = balance.current_balance - amount;
      
      // Update balance
      const { error: updateError } = await supabase
        .from('store_balance')
        .update({ current_balance: newBalance })
        .eq('store_id', storeId);
      
      if (updateError) throw updateError;
      
      // Add transaction record
      const { error: txError } = await supabase
        .from('balance_transactions')
        .insert({
          store_id: storeId,
          transaction_type: 'manual_deduct',
          amount: -amount,
          balance_after: newBalance,
          notes: notes || 'ম্যানুয়াল ব্যালেন্স কর্তন',
          created_by: demoProfile.id
        });
      
      if (txError) throw txError;
      
      setBalance(prev => prev ? { ...prev, current_balance: newBalance } : null);
      await fetchTransactions();
      toast.success(`৳${amount.toLocaleString('bn-BD')} ব্যালেন্স কর্তন হয়েছে`);
      return true;
    } catch (error) {
      console.error('Error deducting balance:', error);
      toast.error('ব্যালেন্স কর্তন করতে সমস্যা হয়েছে');
      return false;
    }
  };

  // Add sale to balance (called when a sale is made)
  const addSaleToBalance = async (saleAmount: number, saleId: string) => {
    if (!storeId || !balance) return false;
    
    try {
      const newBalance = balance.current_balance + saleAmount;
      
      // Update balance
      const { error: updateError } = await supabase
        .from('store_balance')
        .update({ current_balance: newBalance })
        .eq('store_id', storeId);
      
      if (updateError) throw updateError;
      
      // Add transaction record
      const { error: txError } = await supabase
        .from('balance_transactions')
        .insert({
          store_id: storeId,
          transaction_type: 'sale',
          amount: saleAmount,
          balance_after: newBalance,
          reference_id: saleId,
          reference_type: 'sale',
          notes: 'বিক্রয় থেকে আয়',
          created_by: demoProfile.id
        });
      
      if (txError) throw txError;
      
      setBalance(prev => prev ? { ...prev, current_balance: newBalance } : null);
      return true;
    } catch (error) {
      console.error('Error adding sale to balance:', error);
      return false;
    }
  };

  // Initial fetch
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await Promise.all([fetchBalance(), fetchTransactions()]);
      setIsLoading(false);
    };
    
    if (storeId) {
      loadData();
    }
  }, [storeId]);

  return {
    balance,
    transactions,
    isLoading,
    addBalance,
    deductBalance,
    addSaleToBalance,
    refreshBalance: fetchBalance,
    refreshTransactions: fetchTransactions
  };
}
