import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useDemo } from '@/contexts/DemoContext';
import { toast } from 'sonner';

export interface SubscriptionPackage {
  id: string;
  name: string;
  name_bn: string;
  duration_months: number;
  price: number;
  max_devices: number;
  features: string[];
  is_active: boolean;
}

export interface StoreSubscription {
  id: string;
  store_id: string;
  package_id: string | null;
  subscription_type: 'trial' | 'paid' | 'expired';
  start_date: string;
  end_date: string;
  is_active: boolean;
  package?: SubscriptionPackage;
}

export interface SubscriptionPayment {
  id: string;
  store_id: string;
  package_id: string;
  amount: number;
  payment_method: string;
  sender_number: string;
  transaction_id: string;
  status: 'pending' | 'verified' | 'rejected';
  rejection_reason?: string;
  created_at: string;
  package?: SubscriptionPackage;
}

export function useSubscription() {
  const { currentStoreId } = useDemo();
  const [packages, setPackages] = useState<SubscriptionPackage[]>([]);
  const [subscription, setSubscription] = useState<StoreSubscription | null>(null);
  const [payments, setPayments] = useState<SubscriptionPayment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPackages = async () => {
    const { data, error } = await supabase
      .from('subscription_packages')
      .select('*')
      .eq('is_active', true)
      .order('duration_months', { ascending: true });

    if (error) {
      console.error('Error fetching packages:', error);
      return;
    }

    setPackages(data?.map(p => ({
      ...p,
      features: Array.isArray(p.features) 
        ? (p.features as unknown as string[]).map(f => String(f)) 
        : []
    })) || []);
  };

  const fetchSubscription = async () => {
    if (!currentStoreId) return;

    const { data, error } = await supabase
      .from('store_subscriptions')
      .select(`
        *,
        package:subscription_packages(*)
      `)
      .eq('store_id', currentStoreId)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching subscription:', error);
    }

    if (data) {
      const pkg = data.package as unknown as {
        id: string;
        name: string;
        name_bn: string;
        duration_months: number;
        price: number;
        max_devices: number;
        features: unknown[];
        is_active: boolean;
      } | null;
      
      setSubscription({
        ...data,
        subscription_type: data.subscription_type as 'trial' | 'paid' | 'expired',
        package: pkg ? {
          ...pkg,
          features: Array.isArray(pkg.features) 
            ? pkg.features.map(f => String(f)) 
            : []
        } : undefined
      });
    } else {
      setSubscription(null);
    }
  };

  const fetchPayments = async () => {
    if (!currentStoreId) return;

    const { data, error } = await supabase
      .from('subscription_payments')
      .select(`
        *,
        package:subscription_packages(*)
      `)
      .eq('store_id', currentStoreId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching payments:', error);
      return;
    }

    setPayments(data?.map(p => {
      const pkg = p.package as unknown as {
        id: string;
        name: string;
        name_bn: string;
        duration_months: number;
        price: number;
        max_devices: number;
        features: unknown[];
        is_active: boolean;
      } | null;
      
      return {
        ...p,
        status: p.status as 'pending' | 'verified' | 'rejected',
        package: pkg ? {
          ...pkg,
          features: Array.isArray(pkg.features) 
            ? pkg.features.map(f => String(f)) 
            : []
        } : undefined
      };
    }) || []);
  };

  const createTrialSubscription = async () => {
    if (!currentStoreId) return null;

    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 3); // 3 days trial

    const { data, error } = await supabase
      .from('store_subscriptions')
      .insert({
        store_id: currentStoreId,
        subscription_type: 'trial',
        start_date: new Date().toISOString().split('T')[0],
        end_date: endDate.toISOString().split('T')[0],
        is_active: true
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating trial:', error);
      toast.error('ট্রায়াল তৈরি করতে সমস্যা হয়েছে');
      return null;
    }

    await fetchSubscription();
    return data;
  };

  const submitPayment = async (
    packageId: string,
    paymentMethod: string,
    senderNumber: string,
    transactionId: string
  ) => {
    if (!currentStoreId) return null;

    const selectedPackage = packages.find(p => p.id === packageId);
    if (!selectedPackage) return null;

    const { data, error } = await supabase
      .from('subscription_payments')
      .insert({
        store_id: currentStoreId,
        package_id: packageId,
        amount: selectedPackage.price,
        payment_method: paymentMethod,
        sender_number: senderNumber,
        transaction_id: transactionId,
        status: 'pending'
      })
      .select()
      .single();

    if (error) {
      console.error('Error submitting payment:', error);
      toast.error('পেমেন্ট সাবমিট করতে সমস্যা হয়েছে');
      return null;
    }

    toast.success('পেমেন্ট সাবমিট করা হয়েছে। ভেরিফিকেশনের জন্য অপেক্ষা করুন।');
    await fetchPayments();
    return data;
  };

  const isSubscriptionActive = (): boolean => {
    if (!subscription) return false;
    const today = new Date();
    const endDate = new Date(subscription.end_date);
    return subscription.is_active && endDate >= today;
  };

  const isSubscriptionExpired = (): boolean => {
    if (!subscription) return true; // No subscription = expired
    const today = new Date();
    const endDate = new Date(subscription.end_date);
    return endDate < today;
  };

  const isReadOnly = (): boolean => {
    // Read-only if subscription is expired
    return isSubscriptionExpired();
  };

  const getDaysExpired = (): number => {
    if (!subscription) return 0;
    const today = new Date();
    const endDate = new Date(subscription.end_date);
    if (endDate >= today) return 0;
    const diff = today.getTime() - endDate.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const isOnTrial = (): boolean => {
    return isSubscriptionActive() && subscription?.subscription_type === 'trial';
  };

  const isPaid = (): boolean => {
    return isSubscriptionActive() && subscription?.subscription_type === 'paid';
  };

  const getDaysRemaining = (): number => {
    if (!subscription) return 0;
    const today = new Date();
    const endDate = new Date(subscription.end_date);
    const diff = endDate.getTime() - today.getTime();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  };

  const hasPendingPayment = (): boolean => {
    return payments.some(p => p.status === 'pending');
  };

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await Promise.all([
        fetchPackages(),
        fetchSubscription(),
        fetchPayments()
      ]);
      setIsLoading(false);
    };

    loadData();
  }, [currentStoreId]);

  return {
    packages,
    subscription,
    payments,
    isLoading,
    isSubscriptionActive,
    isSubscriptionExpired,
    isReadOnly,
    getDaysExpired,
    isOnTrial,
    isPaid,
    getDaysRemaining,
    hasPendingPayment,
    createTrialSubscription,
    submitPayment,
    refreshSubscription: fetchSubscription,
    refreshPayments: fetchPayments
  };
}
