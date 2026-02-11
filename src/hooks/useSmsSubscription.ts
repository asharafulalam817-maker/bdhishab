import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useDemo } from '@/contexts/DemoContext';

export interface SmsSubscription {
  id: string;
  store_id: string;
  is_active: boolean;
  activated_by: string | null;
  activated_at: string | null;
  deactivated_at: string | null;
  monthly_fee: number;
}

export interface NotificationSettings {
  id: string;
  store_id: string;
  sale_notification: boolean;
  installment_reminder: boolean;
  due_reminder: boolean;
  reminder_days_before: number;
}

export interface SmsLog {
  id: string;
  store_id: string;
  phone: string;
  message: string;
  notification_type: string;
  status: string;
  error_message: string | null;
  created_at: string;
}

export function useSmsSubscription() {
  const { currentStoreId, isDemoMode } = useDemo();
  const [subscription, setSubscription] = useState<SmsSubscription | null>(null);
  const [settings, setSettings] = useState<NotificationSettings | null>(null);
  const [logs, setLogs] = useState<SmsLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSubscription = async () => {
    if (!currentStoreId || isDemoMode) return;
    const { data } = await supabase
      .from('sms_subscriptions')
      .select('*')
      .eq('store_id', currentStoreId)
      .single();
    setSubscription(data as SmsSubscription | null);
  };

  const fetchSettings = async () => {
    if (!currentStoreId || isDemoMode) return;
    const { data } = await supabase
      .from('store_notification_settings')
      .select('*')
      .eq('store_id', currentStoreId)
      .single();
    setSettings(data as NotificationSettings | null);
  };

  const fetchLogs = async (limit = 50) => {
    if (!currentStoreId || isDemoMode) return;
    const { data } = await supabase
      .from('sms_logs')
      .select('*')
      .eq('store_id', currentStoreId)
      .order('created_at', { ascending: false })
      .limit(limit);
    setLogs((data as SmsLog[]) || []);
  };

  const updateSettings = async (updates: Partial<NotificationSettings>) => {
    if (!currentStoreId) return;
    
    if (settings) {
      await supabase
        .from('store_notification_settings')
        .update(updates)
        .eq('store_id', currentStoreId);
    } else {
      await supabase
        .from('store_notification_settings')
        .insert({ store_id: currentStoreId, ...updates });
    }
    await fetchSettings();
  };

  const isSmsActive = (): boolean => {
    return subscription?.is_active === true;
  };

  useEffect(() => {
    if (isDemoMode) {
      setIsLoading(false);
      return;
    }
    const load = async () => {
      setIsLoading(true);
      await Promise.all([fetchSubscription(), fetchSettings(), fetchLogs()]);
      setIsLoading(false);
    };
    load();
  }, [currentStoreId]);

  return {
    subscription,
    settings,
    logs,
    isLoading,
    isSmsActive,
    updateSettings,
    refreshSubscription: fetchSubscription,
    refreshLogs: fetchLogs,
  };
}

// Admin hook for managing all store SMS subscriptions
export function useAdminSmsManagement() {
  const [subscriptions, setSubscriptions] = useState<(SmsSubscription & { store_name?: string })[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAll = async () => {
    setIsLoading(true);
    const { data } = await supabase
      .from('sms_subscriptions')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (data) {
      const storeIds = data.map(s => s.store_id);
      const { data: stores } = await supabase
        .from('stores')
        .select('id, name')
        .in('id', storeIds);
      const storeMap = new Map((stores || []).map(s => [s.id, s.name]));
      
      setSubscriptions(data.map(s => ({
        ...(s as SmsSubscription),
        store_name: storeMap.get(s.store_id) || 'অজানা',
      })));
    }
    setIsLoading(false);
  };

  const toggleSms = async (storeId: string, activate: boolean) => {
    const { data: existing } = await supabase
      .from('sms_subscriptions')
      .select('id')
      .eq('store_id', storeId)
      .single();

    const { data: { user } } = await supabase.auth.getUser();

    if (existing) {
      await supabase
        .from('sms_subscriptions')
        .update({
          is_active: activate,
          activated_by: activate ? user?.id : null,
          activated_at: activate ? new Date().toISOString() : null,
          deactivated_at: activate ? null : new Date().toISOString(),
        })
        .eq('store_id', storeId);
    } else {
      await supabase
        .from('sms_subscriptions')
        .insert({
          store_id: storeId,
          is_active: activate,
          activated_by: user?.id,
          activated_at: activate ? new Date().toISOString() : null,
        });
    }
    await fetchAll();
  };

  useEffect(() => {
    fetchAll();
  }, []);

  return { subscriptions, isLoading, toggleSms, refresh: fetchAll };
}
