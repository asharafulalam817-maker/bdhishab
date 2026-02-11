import { useState, useEffect } from 'react';
import { MessageSquare, ToggleLeft, ToggleRight, Loader2, Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface StoreWithSms {
  id: string;
  name: string;
  phone: string | null;
  sms_active: boolean;
  sms_subscription_id: string | null;
  total_messages?: number;
}

export function SmsManagementSection() {
  const [stores, setStores] = useState<StoreWithSms[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [togglingStore, setTogglingStore] = useState<string | null>(null);

  const fetchStoresWithSms = async () => {
    setIsLoading(true);
    
    const { data: storesData } = await supabase
      .from('stores')
      .select('id, name, phone')
      .order('name');

    if (!storesData) { setIsLoading(false); return; }

    const { data: smsData } = await supabase
      .from('sms_subscriptions')
      .select('*');

    const smsMap = new Map((smsData || []).map(s => [s.store_id, s]));

    // Get message counts
    const { data: logCounts } = await supabase
      .from('sms_logs')
      .select('store_id');

    const countMap = new Map<string, number>();
    (logCounts || []).forEach(l => {
      countMap.set(l.store_id, (countMap.get(l.store_id) || 0) + 1);
    });

    setStores(storesData.map(store => ({
      ...store,
      sms_active: smsMap.get(store.id)?.is_active === true,
      sms_subscription_id: smsMap.get(store.id)?.id || null,
      total_messages: countMap.get(store.id) || 0,
    })));
    
    setIsLoading(false);
  };

  const toggleSms = async (storeId: string, activate: boolean) => {
    setTogglingStore(storeId);
    const { data: { user } } = await supabase.auth.getUser();

    const { data: existing } = await supabase
      .from('sms_subscriptions')
      .select('id')
      .eq('store_id', storeId)
      .single();

    if (existing) {
      await supabase.from('sms_subscriptions').update({
        is_active: activate,
        activated_by: activate ? user?.id : null,
        activated_at: activate ? new Date().toISOString() : null,
        deactivated_at: activate ? null : new Date().toISOString(),
      }).eq('store_id', storeId);
    } else {
      await supabase.from('sms_subscriptions').insert({
        store_id: storeId,
        is_active: activate,
        activated_by: user?.id,
        activated_at: activate ? new Date().toISOString() : null,
      });

      // Also create default notification settings
      await supabase.from('store_notification_settings').insert({
        store_id: storeId,
        sale_notification: true,
        installment_reminder: true,
        due_reminder: true,
        reminder_days_before: 1,
      });
    }

    toast.success(activate ? 'SMS সার্ভিস চালু করা হয়েছে' : 'SMS সার্ভিস বন্ধ করা হয়েছে');
    setTogglingStore(null);
    fetchStoresWithSms();
  };

  useEffect(() => {
    fetchStoresWithSms();
  }, []);

  const filteredStores = stores.filter(s =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.phone?.includes(searchQuery)
  );

  const activeCount = stores.filter(s => s.sms_active).length;

  if (isLoading) {
    return <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin" /></div>;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            SMS/WhatsApp ম্যানেজমেন্ট
            <Badge variant="outline">{activeCount} সক্রিয়</Badge>
          </CardTitle>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="স্টোর খুঁজুন..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 w-64"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {filteredStores.map(store => (
            <div key={store.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-primary/10 text-primary">{store.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{store.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {store.phone || 'ফোন নেই'} • {store.total_messages || 0} মেসেজ পাঠানো
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant={store.sms_active ? 'default' : 'secondary'}>
                  {store.sms_active ? '৳৭০/মাস সক্রিয়' : 'নিষ্ক্রিয়'}
                </Badge>
                <Switch
                  checked={store.sms_active}
                  disabled={togglingStore === store.id}
                  onCheckedChange={(checked) => toggleSms(store.id, checked)}
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
