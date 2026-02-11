import { supabase } from '@/integrations/supabase/client';

interface SendNotificationParams {
  type: 'sale_receipt' | 'installment_due' | 'due_reminder';
  store_id: string;
  store_name: string;
  customer_phone: string;
  customer_name: string;
  data?: Record<string, any>;
}

export async function sendCustomerNotification(params: SendNotificationParams) {
  try {
    const { data, error } = await supabase.functions.invoke('send-customer-notification', {
      body: {
        type: params.type,
        store_id: params.store_id,
        store_name: params.store_name,
        customer_phone: params.customer_phone,
        customer_name: params.customer_name,
        data: params.data,
      },
    });

    if (error) {
      console.error('Notification error:', error);
      return { success: false, error: error.message };
    }

    if (data?.code === 'SMS_INACTIVE' || data?.code === 'NOTIFICATION_DISABLED') {
      return { success: false, error: data.code };
    }

    return { success: data?.success ?? false, error: data?.error };
  } catch (err: any) {
    console.error('Failed to send notification:', err);
    return { success: false, error: err.message };
  }
}
