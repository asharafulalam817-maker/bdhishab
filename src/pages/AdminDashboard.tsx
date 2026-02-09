import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, Store, Users, CheckCircle2, Search, Eye, Ban, 
  Package, ShoppingCart, DollarSign, Settings, BarChart3,
  Plus, Edit, Save, Phone, Calendar, Clock, ArrowUpDown,
  UserPlus, Loader2, X, MessageCircle, Send
} from 'lucide-react';
import { useAdminNotifications } from '@/hooks/useAdminNotifications';
import { AdminNotificationBell } from '@/components/admin/AdminNotificationBell';
import { RevenueReport } from '@/components/admin/RevenueReport';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { bn as bnLocale } from 'date-fns/locale';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface StoreData {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  address: string | null;
  is_blocked: boolean;
  blocked_at: string | null;
  blocked_reason: string | null;
  created_at: string;
  total_sales?: number;
  total_products?: number;
  total_customers?: number;
  total_purchases?: number;
  total_revenue?: number;
  subscription?: {
    id: string;
    subscription_type: string;
    start_date: string;
    end_date: string;
    is_active: boolean;
    package_name?: string;
  } | null;
}

interface SubscriptionPackage {
  id: string;
  name: string;
  name_bn: string;
  duration_months: number;
  price: number;
  max_devices: number;
  features: string[];
  is_active: boolean;
}

interface PlatformSetting {
  id: string;
  key: string;
  value: string | null;
  description: string | null;
}

interface Conversation {
  id: string;
  store_id: string;
  subject: string;
  status: string;
  created_by: string;
  created_at: string;
  updated_at: string;
  store_name?: string;
}

interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  sender_role: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stores, setStores] = useState<StoreData[]>([]);
  const [packages, setPackages] = useState<SubscriptionPackage[]>([]);
  const [settings, setSettings] = useState<PlatformSetting[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [storeSearchQuery, setStoreSearchQuery] = useState('');
  const [storeFilter, setStoreFilter] = useState('all');
  
  // Dialogs
  const [selectedStore, setSelectedStore] = useState<StoreData | null>(null);
  const [isStoreDetailOpen, setIsStoreDetailOpen] = useState(false);
  const [isBlockDialogOpen, setIsBlockDialogOpen] = useState(false);
  const [blockReason, setBlockReason] = useState('');
  const [isSubscriptionDialogOpen, setIsSubscriptionDialogOpen] = useState(false);
  const [selectedPackageId, setSelectedPackageId] = useState('');
  const [subscriptionDays, setSubscriptionDays] = useState('30');
  const [subscriptionAction, setSubscriptionAction] = useState<'extend' | 'reduce' | 'assign'>('assign');
  
  // Package editing
  const [isPackageDialogOpen, setIsPackageDialogOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState<SubscriptionPackage | null>(null);
  const [packageForm, setPackageForm] = useState({ name: '', name_bn: '', price: '', duration_months: '', max_devices: '3', features: '' });
  
  // Settings editing
  const [editingSettings, setEditingSettings] = useState<Record<string, string>>({});
  const [isSavingSettings, setIsSavingSettings] = useState(false);

  // Support chat
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isMessageDialogOpen, setIsMessageDialogOpen] = useState(false);

  const {
    notifications, unreadCount, soundEnabled, setSoundEnabled,
    markAsRead, markAllAsRead, clearAll
  } = useAdminNotifications();

  // ==================== DATA FETCHING ====================
  
  const fetchStores = async () => {
    const { data: storesData } = await supabase
      .from('stores')
      .select('*')
      .order('created_at', { ascending: false });

    if (!storesData) return [];

    const storesWithStats = await Promise.all(storesData.map(async (store) => {
      const [salesResult, productsResult, customersResult, purchasesResult, subscriptionResult] = await Promise.all([
        supabase.from('sales').select('id, total', { count: 'exact' }).eq('store_id', store.id),
        supabase.from('products').select('id', { count: 'exact', head: true }).eq('store_id', store.id),
        supabase.from('customers').select('id', { count: 'exact', head: true }).eq('store_id', store.id),
        supabase.from('purchases').select('id', { count: 'exact', head: true }).eq('store_id', store.id),
        supabase.from('store_subscriptions').select('*, package:subscription_packages(name, name_bn)').eq('store_id', store.id).single()
      ]);

      const totalRevenue = salesResult.data?.reduce((sum, s) => sum + Number(s.total || 0), 0) || 0;

      return {
        ...store,
        total_sales: salesResult.count || 0,
        total_products: productsResult.count || 0,
        total_customers: customersResult.count || 0,
        total_purchases: purchasesResult.count || 0,
        total_revenue: totalRevenue,
        subscription: subscriptionResult.data ? {
          id: subscriptionResult.data.id,
          subscription_type: subscriptionResult.data.subscription_type,
          start_date: subscriptionResult.data.start_date,
          end_date: subscriptionResult.data.end_date,
          is_active: subscriptionResult.data.is_active,
          package_name: (subscriptionResult.data.package as any)?.name_bn || (subscriptionResult.data.package as any)?.name
        } : null
      } as StoreData;
    }));

    setStores(storesWithStats);
    return storesWithStats;
  };

  const fetchPackages = async () => {
    const { data } = await supabase.from('subscription_packages').select('*').order('duration_months');
    if (data) {
      setPackages(data.map(p => ({
        ...p,
        features: Array.isArray(p.features) ? (p.features as unknown as string[]).map(f => String(f)) : []
      })));
    }
  };

  const fetchSettings = async () => {
    const { data } = await supabase.from('platform_settings').select('*');
    if (data) {
      setSettings(data as PlatformSetting[]);
      const settingsMap: Record<string, string> = {};
      data.forEach((s: any) => { settingsMap[s.key] = s.value || ''; });
      setEditingSettings(settingsMap);
    }
  };

  const fetchConversations = async () => {
    const { data: convData } = await supabase
      .from('support_conversations')
      .select('*')
      .order('updated_at', { ascending: false });

    if (!convData) return;

    const storeIds = [...new Set(convData.map(c => c.store_id))];
    const { data: storesData } = await supabase.from('stores').select('id, name').in('id', storeIds);
    const storeMap = new Map((storesData || []).map(s => [s.id, s.name]));

    setConversations(convData.map(conv => ({
      ...conv,
      store_name: storeMap.get(conv.store_id) || 'অজানা স্টোর'
    })));
  };

  const loadAllData = async () => {
    setIsLoading(true);
    await Promise.all([fetchStores(), fetchPackages(), fetchSettings(), fetchConversations()]);
    setIsLoading(false);
  };

  useEffect(() => {
    loadAllData();

    const channel = supabase
      .channel('admin-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'support_conversations' }, () => fetchConversations())
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'support_messages' }, (payload) => {
        if (selectedConversation && payload.new.conversation_id === selectedConversation.id) {
          setMessages(prev => [...prev, payload.new as Message]);
        }
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  // ==================== ACTIONS ====================

  const blockStore = async () => {
    if (!selectedStore) return;
    const { error } = await supabase.from('stores').update({
      is_blocked: true, blocked_at: new Date().toISOString(), blocked_reason: blockReason || null
    }).eq('id', selectedStore.id);

    if (!error) {
      toast.success('স্টোর ব্লক করা হয়েছে');
      setIsBlockDialogOpen(false);
      setBlockReason('');
      fetchStores();
    }
  };

  const unblockStore = async (storeId: string) => {
    const { error } = await supabase.from('stores').update({
      is_blocked: false, blocked_at: null, blocked_reason: null
    }).eq('id', storeId);

    if (!error) {
      toast.success('স্টোর আনব্লক করা হয়েছে');
      fetchStores();
    }
  };

  const handleSubscriptionAction = async () => {
    if (!selectedStore?.subscription && subscriptionAction !== 'assign') {
      toast.error('এই স্টোরের কোন সাবস্ক্রিপশন নেই');
      return;
    }

    if (subscriptionAction === 'assign') {
      if (!selectedPackageId) {
        toast.error('প্যাকেজ সিলেক্ট করুন');
        return;
      }
      const pkg = packages.find(p => p.id === selectedPackageId);
      if (!pkg) return;

      const startDate = new Date();
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + pkg.duration_months);

      if (selectedStore?.subscription) {
        // Update existing
        const { error } = await supabase.from('store_subscriptions').update({
          package_id: selectedPackageId,
          subscription_type: 'paid',
          start_date: startDate.toISOString().split('T')[0],
          end_date: endDate.toISOString().split('T')[0],
          is_active: true
        }).eq('id', selectedStore.subscription.id);

        if (error) { toast.error('আপডেট ব্যর্থ'); return; }
      } else {
        // Create new
        const { error } = await supabase.from('store_subscriptions').insert({
          store_id: selectedStore!.id,
          package_id: selectedPackageId,
          subscription_type: 'paid',
          start_date: startDate.toISOString().split('T')[0],
          end_date: endDate.toISOString().split('T')[0],
          is_active: true
        });

        if (error) { toast.error('সাবস্ক্রিপশন তৈরি ব্যর্থ'); return; }
      }
      toast.success('প্যাকেজ সংযুক্ত করা হয়েছে');
    } else {
      // Extend or reduce
      const currentEnd = new Date(selectedStore!.subscription!.end_date);
      const days = parseInt(subscriptionDays) || 0;
      
      if (subscriptionAction === 'extend') {
        currentEnd.setDate(currentEnd.getDate() + days);
      } else {
        currentEnd.setDate(currentEnd.getDate() - days);
      }

      const { error } = await supabase.from('store_subscriptions').update({
        end_date: currentEnd.toISOString().split('T')[0],
        is_active: true
      }).eq('id', selectedStore!.subscription!.id);

      if (error) { toast.error('আপডেট ব্যর্থ'); return; }
      toast.success(subscriptionAction === 'extend' ? 'মেয়াদ বাড়ানো হয়েছে' : 'মেয়াদ কমানো হয়েছে');
    }

    setIsSubscriptionDialogOpen(false);
    fetchStores();
  };

  const savePackage = async () => {
    const data = {
      name: packageForm.name,
      name_bn: packageForm.name_bn,
      price: parseFloat(packageForm.price),
      duration_months: parseInt(packageForm.duration_months),
      max_devices: parseInt(packageForm.max_devices) || 3,
      features: packageForm.features.split('\n').filter(f => f.trim()),
      is_active: true
    };

    if (editingPackage) {
      const { error } = await supabase.from('subscription_packages').update(data).eq('id', editingPackage.id);
      if (error) { toast.error('আপডেট ব্যর্থ'); return; }
      toast.success('প্যাকেজ আপডেট হয়েছে');
    } else {
      const { error } = await supabase.from('subscription_packages').insert(data);
      if (error) { toast.error('তৈরি ব্যর্থ'); return; }
      toast.success('নতুন প্যাকেজ তৈরি হয়েছে');
    }

    setIsPackageDialogOpen(false);
    fetchPackages();
  };

  const deletePackage = async (id: string) => {
    const { error } = await supabase.from('subscription_packages').update({ is_active: false }).eq('id', id);
    if (!error) {
      toast.success('প্যাকেজ নিষ্ক্রিয় করা হয়েছে');
      fetchPackages();
    }
  };

  const saveSettings = async () => {
    setIsSavingSettings(true);
    for (const [key, value] of Object.entries(editingSettings)) {
      await supabase.from('platform_settings').update({ value }).eq('key', key);
    }
    toast.success('সেটিংস সেভ হয়েছে');
    setIsSavingSettings(false);
    fetchSettings();
  };

  // Support chat
  const fetchMessages = async (conversationId: string) => {
    const { data } = await supabase.from('support_messages')
      .select('*').eq('conversation_id', conversationId).order('created_at');
    if (data) setMessages(data as Message[]);
    await supabase.from('support_messages').update({ is_read: true })
      .eq('conversation_id', conversationId).eq('sender_role', 'store_owner');
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    
    const { error } = await supabase.from('support_messages').insert({
      conversation_id: selectedConversation.id,
      sender_id: user.id,
      sender_role: 'platform_admin',
      message: newMessage
    });
    if (!error) {
      setNewMessage('');
      fetchMessages(selectedConversation.id);
      await supabase.from('support_conversations').update({ updated_at: new Date().toISOString(), status: 'pending' }).eq('id', selectedConversation.id);
      fetchConversations();
    }
  };

  // ==================== COMPUTED ====================

  const filteredStores = stores.filter(store => {
    const matchesSearch = store.name.toLowerCase().includes(storeSearchQuery.toLowerCase()) ||
      store.phone?.includes(storeSearchQuery);
    const matchesFilter = storeFilter === 'all' ||
      (storeFilter === 'active' && !store.is_blocked) ||
      (storeFilter === 'blocked' && store.is_blocked) ||
      (storeFilter === 'expired' && store.subscription && new Date(store.subscription.end_date) < new Date());
    return matchesSearch && matchesFilter;
  });

  const stats = {
    totalStores: stores.length,
    activeStores: stores.filter(s => !s.is_blocked).length,
    blockedStores: stores.filter(s => s.is_blocked).length,
    expiredStores: stores.filter(s => s.subscription && new Date(s.subscription.end_date) < new Date()).length,
    totalRevenue: stores.reduce((sum, s) => sum + (s.total_revenue || 0), 0),
    openTickets: conversations.filter(c => c.status === 'open').length,
  };

  const formatDate = (d: string) => format(new Date(d), 'dd MMM yyyy', { locale: bnLocale });
  const formatTime = (d: string) => format(new Date(d), 'dd MMM yyyy, hh:mm a', { locale: bnLocale });

  const getSubscriptionBadge = (store: StoreData) => {
    if (!store.subscription) return <Badge variant="outline">সাবস্ক্রিপশন নেই</Badge>;
    const isExpired = new Date(store.subscription.end_date) < new Date();
    if (isExpired) return <Badge variant="destructive">মেয়াদোত্তীর্ণ</Badge>;
    if (store.subscription.subscription_type === 'trial') return <Badge className="bg-amber-500">ট্রায়াল</Badge>;
    return <Badge className="bg-emerald-600">পেইড</Badge>;
  };

  const openPackageDialog = (pkg?: SubscriptionPackage) => {
    if (pkg) {
      setEditingPackage(pkg);
      setPackageForm({
        name: pkg.name, name_bn: pkg.name_bn, price: String(pkg.price),
        duration_months: String(pkg.duration_months), max_devices: String(pkg.max_devices),
        features: pkg.features.join('\n')
      });
    } else {
      setEditingPackage(null);
      setPackageForm({ name: '', name_bn: '', price: '', duration_months: '', max_devices: '3', features: '' });
    }
    setIsPackageDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            সুপার অ্যাডমিন প্যানেল
          </h1>
          <p className="text-muted-foreground text-sm">প্ল্যাটফর্ম কন্ট্রোল সেন্টার</p>
        </div>
        <AdminNotificationBell
          notifications={notifications}
          unreadCount={unreadCount}
          soundEnabled={soundEnabled}
          onSoundToggle={() => setSoundEnabled(!soundEnabled)}
          onMarkAsRead={markAsRead}
          onMarkAllAsRead={markAllAsRead}
          onClearAll={clearAll}
          onNotificationClick={(notification) => {
            if (notification.type === 'new_message' || notification.type === 'new_conversation') {
              setActiveTab('dashboard');
            }
          }}
        />
      </div>

      {/* Main Navigation */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5 max-w-2xl">
          <TabsTrigger value="dashboard" className="text-xs sm:text-sm">ড্যাশবোর্ড</TabsTrigger>
          <TabsTrigger value="subscribers" className="text-xs sm:text-sm">সাবস্ক্রাইবার</TabsTrigger>
          <TabsTrigger value="packages" className="text-xs sm:text-sm">প্যাকেজ</TabsTrigger>
          <TabsTrigger value="reports" className="text-xs sm:text-sm">রিপোর্ট</TabsTrigger>
          <TabsTrigger value="settings" className="text-xs sm:text-sm">সেটিংস</TabsTrigger>
        </TabsList>

        {/* ==================== DASHBOARD TAB ==================== */}
        <TabsContent value="dashboard" className="mt-6 space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card><CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10"><Store className="h-5 w-5 text-primary" /></div>
                <div><p className="text-2xl font-bold">{stats.totalStores}</p><p className="text-xs text-muted-foreground">মোট স্টোর</p></div>
              </div>
            </CardContent></Card>
            <Card><CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-emerald-500/10"><CheckCircle2 className="h-5 w-5 text-emerald-600" /></div>
                <div><p className="text-2xl font-bold">{stats.activeStores}</p><p className="text-xs text-muted-foreground">সক্রিয়</p></div>
              </div>
            </CardContent></Card>
            <Card><CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-destructive/10"><Ban className="h-5 w-5 text-destructive" /></div>
                <div><p className="text-2xl font-bold">{stats.blockedStores}</p><p className="text-xs text-muted-foreground">ব্লক</p></div>
              </div>
            </CardContent></Card>
            <Card><CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-amber-500/10"><Clock className="h-5 w-5 text-amber-600" /></div>
                <div><p className="text-2xl font-bold">{stats.expiredStores}</p><p className="text-xs text-muted-foreground">মেয়াদোত্তীর্ণ</p></div>
              </div>
            </CardContent></Card>
          </div>

          {/* Recent stores + Support */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader><CardTitle className="text-lg">সাম্প্রতিক স্টোর</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {stores.slice(0, 5).map(store => (
                    <div key={store.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 cursor-pointer"
                      onClick={() => { setSelectedStore(store); setIsStoreDetailOpen(true); }}>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8"><AvatarFallback className="text-xs">{store.name.charAt(0)}</AvatarFallback></Avatar>
                        <div>
                          <p className="text-sm font-medium">{store.name}</p>
                          <p className="text-xs text-muted-foreground">{formatDate(store.created_at)}</p>
                        </div>
                      </div>
                      {getSubscriptionBadge(store)}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle className="text-lg flex items-center gap-2"><MessageCircle className="h-5 w-5" /> সাপোর্ট টিকেট ({stats.openTickets} খোলা)</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {conversations.slice(0, 5).map(conv => (
                    <div key={conv.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 cursor-pointer"
                      onClick={() => { setSelectedConversation(conv); setIsMessageDialogOpen(true); fetchMessages(conv.id); }}>
                      <div>
                        <p className="text-sm font-medium">{conv.subject}</p>
                        <p className="text-xs text-muted-foreground">{conv.store_name}</p>
                      </div>
                      <Badge variant={conv.status === 'open' ? 'default' : 'outline'}>{conv.status === 'open' ? 'খোলা' : conv.status === 'pending' ? 'অপেক্ষমাণ' : 'বন্ধ'}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ==================== SUBSCRIBERS TAB ==================== */}
        <TabsContent value="subscribers" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <CardTitle className="flex items-center gap-2"><Users className="h-5 w-5" /> সাবস্ক্রাইবার ম্যানেজমেন্ট</CardTitle>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="নাম বা ফোন দিয়ে খুঁজুন..." value={storeSearchQuery}
                      onChange={(e) => setStoreSearchQuery(e.target.value)} className="pl-9 w-64" />
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs value={storeFilter} onValueChange={setStoreFilter}>
                <TabsList className="mb-4">
                  <TabsTrigger value="all">সব ({stats.totalStores})</TabsTrigger>
                  <TabsTrigger value="active">সক্রিয় ({stats.activeStores})</TabsTrigger>
                  <TabsTrigger value="expired">মেয়াদোত্তীর্ণ ({stats.expiredStores})</TabsTrigger>
                  <TabsTrigger value="blocked">ব্লক ({stats.blockedStores})</TabsTrigger>
                </TabsList>

                <TabsContent value={storeFilter}>
                  {filteredStores.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">কোন সাবস্ক্রাইবার পাওয়া যায়নি</div>
                  ) : (
                    <div className="space-y-3">
                      {filteredStores.map((store) => (
                        <div key={store.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                          <div className="flex items-center gap-4 flex-1 min-w-0 cursor-pointer"
                            onClick={() => { setSelectedStore(store); setIsStoreDetailOpen(true); }}>
                            <Avatar className="h-12 w-12">
                              <AvatarFallback className="bg-primary/10 text-primary text-lg">{store.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <p className="font-medium truncate">{store.name}</p>
                                {store.is_blocked && <Badge variant="destructive">ব্লক</Badge>}
                                {getSubscriptionBadge(store)}
                              </div>
                              <p className="text-sm text-muted-foreground">{store.phone || 'ফোন নেই'} • {formatDate(store.created_at)}</p>
                              {store.subscription && (
                                <p className="text-xs text-muted-foreground">
                                  মেয়াদ: {formatDate(store.subscription.end_date)}
                                  {store.subscription.package_name && ` • ${store.subscription.package_name}`}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="flex gap-2 flex-shrink-0">
                            <Button variant="outline" size="sm" onClick={() => {
                              setSelectedStore(store);
                              setSubscriptionAction('assign');
                              setIsSubscriptionDialogOpen(true);
                            }}>
                              <ArrowUpDown className="h-4 w-4 mr-1" /> মেয়াদ
                            </Button>
                            {store.is_blocked ? (
                              <Button variant="default" size="sm" onClick={() => unblockStore(store.id)}>
                                <CheckCircle2 className="h-4 w-4 mr-1" /> আনব্লক
                              </Button>
                            ) : (
                              <Button variant="destructive" size="sm" onClick={() => {
                                setSelectedStore(store);
                                setIsBlockDialogOpen(true);
                              }}>
                                <Ban className="h-4 w-4 mr-1" /> ব্লক
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ==================== PACKAGES TAB ==================== */}
        <TabsContent value="packages" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2"><Package className="h-5 w-5" /> সাবস্ক্রিপশন প্যাকেজ</CardTitle>
                <Button onClick={() => openPackageDialog()}><Plus className="h-4 w-4 mr-1" /> নতুন প্যাকেজ</Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {packages.map(pkg => (
                  <Card key={pkg.id} className={cn(!pkg.is_active && 'opacity-50')}>
                    <CardContent className="pt-6 space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-bold text-lg">{pkg.name_bn}</h3>
                          <p className="text-sm text-muted-foreground">{pkg.name}</p>
                        </div>
                        {!pkg.is_active && <Badge variant="outline">নিষ্ক্রিয়</Badge>}
                      </div>
                      <div className="text-3xl font-bold text-primary">৳{pkg.price}</div>
                      <div className="text-sm text-muted-foreground">
                        <p>{pkg.duration_months} মাস • {pkg.max_devices} ডিভাইস</p>
                      </div>
                      {pkg.features.length > 0 && (
                        <ul className="text-sm space-y-1">
                          {pkg.features.map((f, i) => (
                            <li key={i} className="flex items-center gap-2">
                              <CheckCircle2 className="h-3 w-3 text-emerald-600" />{f}
                            </li>
                          ))}
                        </ul>
                      )}
                      <div className="flex gap-2 pt-2">
                        <Button variant="outline" size="sm" className="flex-1" onClick={() => openPackageDialog(pkg)}>
                          <Edit className="h-4 w-4 mr-1" /> এডিট
                        </Button>
                        {pkg.is_active && (
                          <Button variant="ghost" size="sm" onClick={() => deletePackage(pkg.id)}>
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ==================== REPORTS TAB ==================== */}
        <TabsContent value="reports" className="mt-6">
          <RevenueReport />
        </TabsContent>

        {/* ==================== SETTINGS TAB ==================== */}
        <TabsContent value="settings" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Settings className="h-5 w-5" /> প্ল্যাটফর্ম সেটিংস</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                {settings.map(setting => (
                  <div key={setting.id} className="space-y-2">
                    <Label className="flex items-center gap-2">
                      {setting.key === 'support_whatsapp' && <Phone className="h-4 w-4" />}
                      {setting.description || setting.key}
                    </Label>
                    <Input
                      value={editingSettings[setting.key] || ''}
                      onChange={(e) => setEditingSettings(prev => ({ ...prev, [setting.key]: e.target.value }))}
                    />
                  </div>
                ))}
              </div>
              <Button onClick={saveSettings} disabled={isSavingSettings}>
                {isSavingSettings ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <Save className="h-4 w-4 mr-1" />}
                সেভ করুন
              </Button>
            </CardContent>
          </Card>

          {/* Package price quick edit */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">প্যাকেজ মূল্য দ্রুত এডিট</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {packages.filter(p => p.is_active).map(pkg => (
                  <div key={pkg.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{pkg.name_bn}</p>
                      <p className="text-sm text-muted-foreground">{pkg.duration_months} মাস</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">৳</span>
                      <Input
                        type="number"
                        className="w-28"
                        defaultValue={pkg.price}
                        onBlur={async (e) => {
                          const newPrice = parseFloat(e.target.value);
                          if (newPrice !== pkg.price && newPrice > 0) {
                            await supabase.from('subscription_packages').update({ price: newPrice }).eq('id', pkg.id);
                            toast.success(`${pkg.name_bn} মূল্য আপডেট হয়েছে`);
                            fetchPackages();
                          }
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* ==================== STORE DETAIL DIALOG ==================== */}
      <Dialog open={isStoreDetailOpen} onOpenChange={setIsStoreDetailOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><Store className="h-5 w-5" /> স্টোর বিস্তারিত</DialogTitle>
          </DialogHeader>
          {selectedStore && (
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarFallback className="bg-primary/10 text-primary text-2xl">{selectedStore.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-semibold">{selectedStore.name}</h3>
                  <div className="flex gap-2 mt-1">
                    {selectedStore.is_blocked ? <Badge variant="destructive">ব্লক</Badge> : <Badge variant="outline">সক্রিয়</Badge>}
                    {getSubscriptionBadge(selectedStore)}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div><Label className="text-muted-foreground">ফোন</Label><p className="font-medium">{selectedStore.phone || 'নেই'}</p></div>
                <div><Label className="text-muted-foreground">ইমেইল</Label><p className="font-medium">{selectedStore.email || 'নেই'}</p></div>
                <div><Label className="text-muted-foreground">ঠিকানা</Label><p className="font-medium">{selectedStore.address || 'নেই'}</p></div>
                <div><Label className="text-muted-foreground">তৈরির তারিখ</Label><p className="font-medium">{formatDate(selectedStore.created_at)}</p></div>
              </div>

              {selectedStore.subscription && (
                <div className="p-4 bg-muted/50 rounded-lg space-y-2">
                  <h4 className="font-semibold">সাবস্ক্রিপশন তথ্য</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div><span className="text-muted-foreground">ধরন:</span> {selectedStore.subscription.subscription_type === 'paid' ? 'পেইড' : 'ট্রায়াল'}</div>
                    <div><span className="text-muted-foreground">প্যাকেজ:</span> {selectedStore.subscription.package_name || 'নেই'}</div>
                    <div><span className="text-muted-foreground">শুরু:</span> {formatDate(selectedStore.subscription.start_date)}</div>
                    <div><span className="text-muted-foreground">মেয়াদ:</span> {formatDate(selectedStore.subscription.end_date)}</div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card><CardContent className="pt-4 text-center">
                  <Package className="h-6 w-6 mx-auto text-primary mb-2" />
                  <p className="text-2xl font-bold">{selectedStore.total_products}</p>
                  <p className="text-xs text-muted-foreground">পণ্য</p>
                </CardContent></Card>
                <Card><CardContent className="pt-4 text-center">
                  <ShoppingCart className="h-6 w-6 mx-auto text-primary mb-2" />
                  <p className="text-2xl font-bold">{selectedStore.total_sales}</p>
                  <p className="text-xs text-muted-foreground">বিক্রয়</p>
                </CardContent></Card>
                <Card><CardContent className="pt-4 text-center">
                  <Users className="h-6 w-6 mx-auto text-primary mb-2" />
                  <p className="text-2xl font-bold">{selectedStore.total_customers}</p>
                  <p className="text-xs text-muted-foreground">গ্রাহক</p>
                </CardContent></Card>
                <Card><CardContent className="pt-4 text-center">
                  <DollarSign className="h-6 w-6 mx-auto text-emerald-600 mb-2" />
                  <p className="text-2xl font-bold">৳{(selectedStore.total_revenue || 0).toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">মোট বিক্রয়</p>
                </CardContent></Card>
              </div>

              {selectedStore.is_blocked && selectedStore.blocked_reason && (
                <div className="p-3 bg-destructive/10 rounded-lg">
                  <Label className="text-destructive">ব্লকের কারণ</Label>
                  <p className="text-sm mt-1">{selectedStore.blocked_reason}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* ==================== BLOCK DIALOG ==================== */}
      <Dialog open={isBlockDialogOpen} onOpenChange={setIsBlockDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive"><Ban className="h-5 w-5" /> স্টোর ব্লক করুন</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              <strong>{selectedStore?.name}</strong> স্টোরটি ব্লক করতে চান?
            </p>
            <div className="space-y-2">
              <Label>ব্লকের কারণ (ঐচ্ছিক)</Label>
              <Textarea placeholder="কারণ লিখুন..." value={blockReason} onChange={(e) => setBlockReason(e.target.value)} rows={3} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsBlockDialogOpen(false)}>বাতিল</Button>
            <Button variant="destructive" onClick={blockStore}><Ban className="h-4 w-4 mr-2" /> ব্লক করুন</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ==================== SUBSCRIPTION DIALOG ==================== */}
      <Dialog open={isSubscriptionDialogOpen} onOpenChange={setIsSubscriptionDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><Calendar className="h-5 w-5" /> সাবস্ক্রিপশন ম্যানেজমেন্ট</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm font-medium">{selectedStore?.name}</p>
            {selectedStore?.subscription && (
              <p className="text-sm text-muted-foreground">
                বর্তমান মেয়াদ: {formatDate(selectedStore.subscription.end_date)}
              </p>
            )}

            <div className="space-y-2">
              <Label>অ্যাকশন</Label>
              <Select value={subscriptionAction} onValueChange={(v) => setSubscriptionAction(v as any)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="assign">নতুন প্যাকেজ সংযুক্ত</SelectItem>
                  <SelectItem value="extend">মেয়াদ বাড়ানো</SelectItem>
                  <SelectItem value="reduce">মেয়াদ কমানো</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {subscriptionAction === 'assign' ? (
              <div className="space-y-2">
                <Label>প্যাকেজ সিলেক্ট করুন</Label>
                <Select value={selectedPackageId} onValueChange={setSelectedPackageId}>
                  <SelectTrigger><SelectValue placeholder="প্যাকেজ বাছুন" /></SelectTrigger>
                  <SelectContent>
                    {packages.filter(p => p.is_active).map(pkg => (
                      <SelectItem key={pkg.id} value={pkg.id}>{pkg.name_bn} - ৳{pkg.price} ({pkg.duration_months} মাস)</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ) : (
              <div className="space-y-2">
                <Label>{subscriptionAction === 'extend' ? 'কত দিন বাড়াবেন?' : 'কত দিন কমাবেন?'}</Label>
                <Input type="number" value={subscriptionDays} onChange={(e) => setSubscriptionDays(e.target.value)} placeholder="দিন সংখ্যা" />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSubscriptionDialogOpen(false)}>বাতিল</Button>
            <Button onClick={handleSubscriptionAction}>
              {subscriptionAction === 'assign' ? 'সংযুক্ত করুন' : subscriptionAction === 'extend' ? 'বাড়ান' : 'কমান'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ==================== PACKAGE DIALOG ==================== */}
      <Dialog open={isPackageDialogOpen} onOpenChange={setIsPackageDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingPackage ? 'প্যাকেজ এডিট' : 'নতুন প্যাকেজ'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>নাম (English)</Label>
                <Input value={packageForm.name} onChange={(e) => setPackageForm(p => ({ ...p, name: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label>নাম (বাংলা)</Label>
                <Input value={packageForm.name_bn} onChange={(e) => setPackageForm(p => ({ ...p, name_bn: e.target.value }))} />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>মূল্য (৳)</Label>
                <Input type="number" value={packageForm.price} onChange={(e) => setPackageForm(p => ({ ...p, price: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label>মেয়াদ (মাস)</Label>
                <Input type="number" value={packageForm.duration_months} onChange={(e) => setPackageForm(p => ({ ...p, duration_months: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label>ডিভাইস</Label>
                <Input type="number" value={packageForm.max_devices} onChange={(e) => setPackageForm(p => ({ ...p, max_devices: e.target.value }))} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>ফিচার (প্রতি লাইনে একটি)</Label>
              <Textarea value={packageForm.features} onChange={(e) => setPackageForm(p => ({ ...p, features: e.target.value }))} rows={4} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPackageDialogOpen(false)}>বাতিল</Button>
            <Button onClick={savePackage}><Save className="h-4 w-4 mr-1" /> সেভ করুন</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ==================== MESSAGE DIALOG ==================== */}
      <Dialog open={isMessageDialogOpen} onOpenChange={setIsMessageDialogOpen}>
        <DialogContent className="max-w-2xl h-[70vh] flex flex-col p-0">
          <DialogHeader className="p-4 border-b">
            <DialogTitle>{selectedConversation?.subject}</DialogTitle>
            <p className="text-sm text-muted-foreground">{selectedConversation?.store_name}</p>
          </DialogHeader>
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((msg) => (
                <div key={msg.id} className={cn("flex gap-2", msg.sender_role === 'platform_admin' ? "justify-end" : "justify-start")}>
                  {msg.sender_role !== 'platform_admin' && (
                    <Avatar className="h-8 w-8"><AvatarFallback className="text-xs">ST</AvatarFallback></Avatar>
                  )}
                  <div className={cn("max-w-[70%] rounded-lg px-3 py-2",
                    msg.sender_role === 'platform_admin' ? "bg-primary text-primary-foreground" : "bg-muted")}>
                    <p className="text-sm whitespace-pre-wrap">{msg.message}</p>
                    <p className="text-[10px] opacity-70 mt-1">{format(new Date(msg.created_at), 'hh:mm a')}</p>
                  </div>
                  {msg.sender_role === 'platform_admin' && (
                    <Avatar className="h-8 w-8"><AvatarFallback className="bg-primary text-primary-foreground text-xs">AD</AvatarFallback></Avatar>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
          {selectedConversation?.status !== 'closed' && (
            <div className="p-4 border-t flex gap-2">
              <Input placeholder="উত্তর লিখুন..." value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()} />
              <Button onClick={sendMessage} disabled={!newMessage.trim()}><Send className="h-4 w-4" /></Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
