import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, MessageCircle, Store, Users, Clock, CheckCircle, 
  AlertCircle, Search, Eye, Send, X, Ban, CheckCircle2,
  Package, ShoppingCart, TrendingUp, Calendar
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { bn as bnLocale } from 'date-fns/locale';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface Conversation {
  id: string;
  store_id: string;
  subject: string;
  status: 'open' | 'closed' | 'pending';
  created_by: string;
  created_at: string;
  updated_at: string;
  store_name?: string;
}

interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  sender_role: 'store_owner' | 'platform_admin';
  message: string;
  is_read: boolean;
  created_at: string;
}

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
}

interface Stats {
  totalConversations: number;
  openConversations: number;
  pendingConversations: number;
  closedConversations: number;
  totalStores: number;
  activeStores: number;
  blockedStores: number;
}

const ADMIN_USER_ID = '00000000-0000-0000-0000-000000000001';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [stores, setStores] = useState<StoreData[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [selectedStore, setSelectedStore] = useState<StoreData | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [storeSearchQuery, setStoreSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [storeFilter, setStoreFilter] = useState<string>('all');
  const [blockReason, setBlockReason] = useState('');
  const [stats, setStats] = useState<Stats>({
    totalConversations: 0,
    openConversations: 0,
    pendingConversations: 0,
    closedConversations: 0,
    totalStores: 0,
    activeStores: 0,
    blockedStores: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isMessageDialogOpen, setIsMessageDialogOpen] = useState(false);
  const [isStoreDialogOpen, setIsStoreDialogOpen] = useState(false);
  const [isBlockDialogOpen, setIsBlockDialogOpen] = useState(false);

  // Fetch all conversations
  const fetchConversations = async () => {
    try {
      const { data: convData, error } = await supabase
        .from('support_conversations')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) throw error;

      const storeIds = [...new Set((convData || []).map(c => c.store_id))];
      const { data: storesData } = await supabase
        .from('stores')
        .select('id, name')
        .in('id', storeIds);

      const storeMap = new Map((storesData || []).map(s => [s.id, s.name]));

      const conversationsWithStores = (convData || []).map(conv => ({
        ...conv,
        store_name: storeMap.get(conv.store_id) || 'অজানা স্টোর',
        status: conv.status as 'open' | 'closed' | 'pending'
      }));

      setConversations(conversationsWithStores);
      
      return conversationsWithStores;
    } catch (error) {
      console.error('Error fetching conversations:', error);
      return [];
    }
  };

  // Fetch all stores with stats
  const fetchStores = async () => {
    try {
      const { data: storesData, error } = await supabase
        .from('stores')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Fetch stats for each store
      const storesWithStats = await Promise.all((storesData || []).map(async (store) => {
        const [salesResult, productsResult, customersResult] = await Promise.all([
          supabase.from('sales').select('id', { count: 'exact', head: true }).eq('store_id', store.id),
          supabase.from('products').select('id', { count: 'exact', head: true }).eq('store_id', store.id),
          supabase.from('customers').select('id', { count: 'exact', head: true }).eq('store_id', store.id)
        ]);

        return {
          ...store,
          total_sales: salesResult.count || 0,
          total_products: productsResult.count || 0,
          total_customers: customersResult.count || 0
        } as StoreData;
      }));

      setStores(storesWithStats);
      return storesWithStats;
    } catch (error) {
      console.error('Error fetching stores:', error);
      return [];
    }
  };

  // Initial data load
  const loadAllData = async () => {
    setIsLoading(true);
    try {
      const [convs, storesData] = await Promise.all([
        fetchConversations(),
        fetchStores()
      ]);

      setStats({
        totalConversations: convs.length,
        openConversations: convs.filter(c => c.status === 'open').length,
        pendingConversations: convs.filter(c => c.status === 'pending').length,
        closedConversations: convs.filter(c => c.status === 'closed').length,
        totalStores: storesData.length,
        activeStores: storesData.filter(s => !s.is_blocked).length,
        blockedStores: storesData.filter(s => s.is_blocked).length
      });
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('ডেটা লোড করতে সমস্যা হয়েছে');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch messages for selected conversation
  const fetchMessages = async (conversationId: string) => {
    try {
      const { data, error } = await supabase
        .from('support_messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages((data || []) as Message[]);

      await supabase
        .from('support_messages')
        .update({ is_read: true })
        .eq('conversation_id', conversationId)
        .eq('sender_role', 'store_owner');
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  // Send message as admin
  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return;

    try {
      const { error } = await supabase
        .from('support_messages')
        .insert({
          conversation_id: selectedConversation.id,
          sender_id: ADMIN_USER_ID,
          sender_role: 'platform_admin',
          message: newMessage
        });

      if (error) throw error;

      await supabase
        .from('support_conversations')
        .update({ updated_at: new Date().toISOString(), status: 'pending' })
        .eq('id', selectedConversation.id);

      setNewMessage('');
      fetchMessages(selectedConversation.id);
      fetchConversations();
      toast.success('মেসেজ পাঠানো হয়েছে');
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('মেসেজ পাঠাতে সমস্যা হয়েছে');
    }
  };

  // Close conversation
  const closeConversation = async (conversationId: string) => {
    try {
      const { error } = await supabase
        .from('support_conversations')
        .update({ status: 'closed' })
        .eq('id', conversationId);

      if (error) throw error;
      
      fetchConversations();
      if (selectedConversation?.id === conversationId) {
        setSelectedConversation(prev => prev ? { ...prev, status: 'closed' } : null);
      }
      toast.success('কথোপকথন বন্ধ করা হয়েছে');
    } catch (error) {
      console.error('Error closing conversation:', error);
    }
  };

  // Block store
  const blockStore = async () => {
    if (!selectedStore) return;

    try {
      const { error } = await supabase
        .from('stores')
        .update({ 
          is_blocked: true, 
          blocked_at: new Date().toISOString(),
          blocked_reason: blockReason || null
        })
        .eq('id', selectedStore.id);

      if (error) throw error;

      setStores(prev => prev.map(s => 
        s.id === selectedStore.id 
          ? { ...s, is_blocked: true, blocked_at: new Date().toISOString(), blocked_reason: blockReason }
          : s
      ));
      setStats(prev => ({
        ...prev,
        activeStores: prev.activeStores - 1,
        blockedStores: prev.blockedStores + 1
      }));
      setIsBlockDialogOpen(false);
      setBlockReason('');
      toast.success('স্টোর ব্লক করা হয়েছে');
    } catch (error) {
      console.error('Error blocking store:', error);
      toast.error('স্টোর ব্লক করতে সমস্যা হয়েছে');
    }
  };

  // Unblock store
  const unblockStore = async (storeId: string) => {
    try {
      const { error } = await supabase
        .from('stores')
        .update({ 
          is_blocked: false, 
          blocked_at: null,
          blocked_reason: null
        })
        .eq('id', storeId);

      if (error) throw error;

      setStores(prev => prev.map(s => 
        s.id === storeId 
          ? { ...s, is_blocked: false, blocked_at: null, blocked_reason: null }
          : s
      ));
      setStats(prev => ({
        ...prev,
        activeStores: prev.activeStores + 1,
        blockedStores: prev.blockedStores - 1
      }));
      toast.success('স্টোর আনব্লক করা হয়েছে');
    } catch (error) {
      console.error('Error unblocking store:', error);
      toast.error('স্টোর আনব্লক করতে সমস্যা হয়েছে');
    }
  };

  // Open conversation dialog
  const openConversation = (conv: Conversation) => {
    setSelectedConversation(conv);
    setIsMessageDialogOpen(true);
    fetchMessages(conv.id);
  };

  // Open store details dialog
  const openStoreDetails = (store: StoreData) => {
    setSelectedStore(store);
    setIsStoreDialogOpen(true);
  };

  // Filter conversations
  const filteredConversations = conversations.filter(conv => {
    const matchesSearch = conv.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (conv.store_name?.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || conv.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Filter stores
  const filteredStores = stores.filter(store => {
    const matchesSearch = store.name.toLowerCase().includes(storeSearchQuery.toLowerCase()) ||
                         store.phone?.includes(storeSearchQuery) ||
                         store.email?.toLowerCase().includes(storeSearchQuery.toLowerCase());
    const matchesFilter = storeFilter === 'all' || 
                         (storeFilter === 'active' && !store.is_blocked) ||
                         (storeFilter === 'blocked' && store.is_blocked);
    return matchesSearch && matchesFilter;
  });

  // Realtime subscription
  useEffect(() => {
    loadAllData();

    const channel = supabase
      .channel('admin-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'support_conversations' },
        () => fetchConversations()
      )
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'support_messages' },
        (payload) => {
          if (selectedConversation && payload.new.conversation_id === selectedConversation.id) {
            setMessages(prev => [...prev, payload.new as Message]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'open':
        return <Badge className="bg-primary">খোলা</Badge>;
      case 'pending':
        return <Badge variant="secondary">অপেক্ষমাণ</Badge>;
      case 'closed':
        return <Badge variant="outline">বন্ধ</Badge>;
      default:
        return null;
    }
  };

  const formatTime = (dateString: string) => {
    return format(new Date(dateString), 'dd MMM yyyy, hh:mm a', { locale: bnLocale });
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'dd MMM yyyy', { locale: bnLocale });
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      {/* Header */}
      <div className="page-header">
        <h1 className="page-title flex items-center gap-2">
          <Shield className="h-6 w-6" />
          এডমিন ড্যাশবোর্ড
        </h1>
        <p className="text-muted-foreground">প্ল্যাটফর্ম পরিচালনা ও সাপোর্ট ম্যানেজমেন্ট</p>
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 max-w-md">
          <TabsTrigger value="overview">ওভারভিউ</TabsTrigger>
          <TabsTrigger value="stores">স্টোর</TabsTrigger>
          <TabsTrigger value="support">সাপোর্ট</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="mt-6 space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Store className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats.totalStores}</p>
                    <p className="text-xs text-muted-foreground">মোট স্টোর</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats.activeStores}</p>
                    <p className="text-xs text-muted-foreground">সক্রিয় স্টোর</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-destructive/10">
                    <Ban className="h-5 w-5 text-destructive" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats.blockedStores}</p>
                    <p className="text-xs text-muted-foreground">ব্লক স্টোর</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-secondary/50">
                    <MessageCircle className="h-5 w-5 text-secondary-foreground" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats.openConversations}</p>
                    <p className="text-xs text-muted-foreground">খোলা টিকেট</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">সাম্প্রতিক স্টোর</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {stores.slice(0, 5).map(store => (
                    <div key={store.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="text-xs">{store.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">{store.name}</p>
                          <p className="text-xs text-muted-foreground">{formatDate(store.created_at)}</p>
                        </div>
                      </div>
                      {store.is_blocked ? (
                        <Badge variant="destructive">ব্লক</Badge>
                      ) : (
                        <Badge variant="outline">সক্রিয়</Badge>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">সাম্প্রতিক সাপোর্ট</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {conversations.slice(0, 5).map(conv => (
                    <div 
                      key={conv.id} 
                      className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 cursor-pointer"
                      onClick={() => openConversation(conv)}
                    >
                      <div>
                        <p className="text-sm font-medium">{conv.subject}</p>
                        <p className="text-xs text-muted-foreground">{conv.store_name}</p>
                      </div>
                      {getStatusBadge(conv.status)}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Stores Tab */}
        <TabsContent value="stores" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <CardTitle className="flex items-center gap-2">
                  <Store className="h-5 w-5" />
                  স্টোর ম্যানেজমেন্ট
                </CardTitle>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="স্টোর খুঁজুন..."
                      value={storeSearchQuery}
                      onChange={(e) => setStoreSearchQuery(e.target.value)}
                      className="pl-9 w-64"
                    />
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs value={storeFilter} onValueChange={setStoreFilter}>
                <TabsList className="mb-4">
                  <TabsTrigger value="all">সব ({stats.totalStores})</TabsTrigger>
                  <TabsTrigger value="active">সক্রিয় ({stats.activeStores})</TabsTrigger>
                  <TabsTrigger value="blocked">ব্লক ({stats.blockedStores})</TabsTrigger>
                </TabsList>

                <TabsContent value={storeFilter}>
                  {isLoading ? (
                    <div className="text-center py-8 text-muted-foreground">লোড হচ্ছে...</div>
                  ) : filteredStores.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      কোন স্টোর পাওয়া যায়নি
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {filteredStores.map((store) => (
                        <div
                          key={store.id}
                          className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                        >
                          <div className="flex items-center gap-4">
                            <Avatar className="h-12 w-12">
                              <AvatarFallback className="bg-primary/10 text-primary text-lg">
                                {store.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="flex items-center gap-2">
                                <p className="font-medium">{store.name}</p>
                                {store.is_blocked ? (
                                  <Badge variant="destructive">ব্লক</Badge>
                                ) : (
                                  <Badge variant="outline">সক্রিয়</Badge>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {store.phone || 'ফোন নেই'} • {formatDate(store.created_at)}
                              </p>
                              <div className="flex gap-4 mt-1 text-xs text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <Package className="h-3 w-3" /> {store.total_products} পণ্য
                                </span>
                                <span className="flex items-center gap-1">
                                  <ShoppingCart className="h-3 w-3" /> {store.total_sales} বিক্রয়
                                </span>
                                <span className="flex items-center gap-1">
                                  <Users className="h-3 w-3" /> {store.total_customers} গ্রাহক
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openStoreDetails(store)}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              বিস্তারিত
                            </Button>
                            {store.is_blocked ? (
                              <Button
                                variant="default"
                                size="sm"
                                onClick={() => unblockStore(store.id)}
                              >
                                <CheckCircle2 className="h-4 w-4 mr-1" />
                                আনব্লক
                              </Button>
                            ) : (
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => {
                                  setSelectedStore(store);
                                  setIsBlockDialogOpen(true);
                                }}
                              >
                                <Ban className="h-4 w-4 mr-1" />
                                ব্লক
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

        {/* Support Tab */}
        <TabsContent value="support" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5" />
                  সাপোর্ট কথোপকথন
                </CardTitle>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="খুঁজুন..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9 w-64"
                    />
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs value={statusFilter} onValueChange={setStatusFilter}>
                <TabsList className="mb-4">
                  <TabsTrigger value="all">সব ({stats.totalConversations})</TabsTrigger>
                  <TabsTrigger value="open">খোলা ({stats.openConversations})</TabsTrigger>
                  <TabsTrigger value="pending">অপেক্ষমাণ ({stats.pendingConversations})</TabsTrigger>
                  <TabsTrigger value="closed">বন্ধ ({stats.closedConversations})</TabsTrigger>
                </TabsList>

                <TabsContent value={statusFilter}>
                  {isLoading ? (
                    <div className="text-center py-8 text-muted-foreground">লোড হচ্ছে...</div>
                  ) : filteredConversations.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      কোন কথোপকথন পাওয়া যায়নি
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {filteredConversations.map((conv) => (
                        <div
                          key={conv.id}
                          className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                        >
                          <div className="flex items-center gap-4">
                            <Avatar>
                              <AvatarFallback className="bg-primary/10 text-primary">
                                {conv.store_name?.charAt(0) || 'S'}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="flex items-center gap-2">
                                <p className="font-medium">{conv.subject}</p>
                                {getStatusBadge(conv.status)}
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {conv.store_name} • {formatTime(conv.updated_at)}
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openConversation(conv)}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              দেখুন
                            </Button>
                            {conv.status !== 'closed' && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => closeConversation(conv.id)}
                              >
                                <X className="h-4 w-4 mr-1" />
                                বন্ধ
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
      </Tabs>

      {/* Message Dialog */}
      <Dialog open={isMessageDialogOpen} onOpenChange={setIsMessageDialogOpen}>
        <DialogContent className="max-w-2xl h-[70vh] flex flex-col p-0">
          <DialogHeader className="p-4 border-b">
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle>{selectedConversation?.subject}</DialogTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  {selectedConversation?.store_name} • {getStatusBadge(selectedConversation?.status || 'open')}
                </p>
              </div>
            </div>
          </DialogHeader>

          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={cn(
                    "flex gap-2",
                    msg.sender_role === 'platform_admin' ? "justify-end" : "justify-start"
                  )}
                >
                  {msg.sender_role !== 'platform_admin' && (
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="text-xs">ST</AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={cn(
                      "max-w-[70%] rounded-lg px-3 py-2",
                      msg.sender_role === 'platform_admin'
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    )}
                  >
                    <p className="text-sm whitespace-pre-wrap">{msg.message}</p>
                    <p className="text-[10px] opacity-70 mt-1">
                      {format(new Date(msg.created_at), 'hh:mm a')}
                    </p>
                  </div>
                  {msg.sender_role === 'platform_admin' && (
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-primary text-primary-foreground text-xs">AD</AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>

          {selectedConversation?.status !== 'closed' && (
            <div className="p-4 border-t flex gap-2">
              <Input
                placeholder="উত্তর লিখুন..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
              />
              <Button onClick={sendMessage} disabled={!newMessage.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Store Details Dialog */}
      <Dialog open={isStoreDialogOpen} onOpenChange={setIsStoreDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Store className="h-5 w-5" />
              স্টোর বিস্তারিত
            </DialogTitle>
          </DialogHeader>
          
          {selectedStore && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarFallback className="bg-primary/10 text-primary text-2xl">
                    {selectedStore.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-semibold">{selectedStore.name}</h3>
                  {selectedStore.is_blocked ? (
                    <Badge variant="destructive">ব্লক করা হয়েছে</Badge>
                  ) : (
                    <Badge variant="outline">সক্রিয়</Badge>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-muted-foreground">ফোন</Label>
                  <p className="font-medium">{selectedStore.phone || 'নেই'}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-muted-foreground">ইমেইল</Label>
                  <p className="font-medium">{selectedStore.email || 'নেই'}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-muted-foreground">ঠিকানা</Label>
                  <p className="font-medium">{selectedStore.address || 'নেই'}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-muted-foreground">তৈরির তারিখ</Label>
                  <p className="font-medium">{formatDate(selectedStore.created_at)}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                <Card>
                  <CardContent className="pt-4 text-center">
                    <Package className="h-6 w-6 mx-auto text-primary mb-2" />
                    <p className="text-2xl font-bold">{selectedStore.total_products}</p>
                    <p className="text-xs text-muted-foreground">পণ্য</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-4 text-center">
                    <ShoppingCart className="h-6 w-6 mx-auto text-primary mb-2" />
                    <p className="text-2xl font-bold">{selectedStore.total_sales}</p>
                    <p className="text-xs text-muted-foreground">বিক্রয়</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-4 text-center">
                    <Users className="h-6 w-6 mx-auto text-primary mb-2" />
                    <p className="text-2xl font-bold">{selectedStore.total_customers}</p>
                    <p className="text-xs text-muted-foreground">গ্রাহক</p>
                  </CardContent>
                </Card>
              </div>

              {selectedStore.is_blocked && selectedStore.blocked_reason && (
                <div className="p-3 bg-destructive/10 rounded-lg">
                  <Label className="text-destructive">ব্লকের কারণ</Label>
                  <p className="text-sm mt-1">{selectedStore.blocked_reason}</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    ব্লক করা হয়েছে: {selectedStore.blocked_at && formatTime(selectedStore.blocked_at)}
                  </p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Block Store Dialog */}
      <Dialog open={isBlockDialogOpen} onOpenChange={setIsBlockDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <Ban className="h-5 w-5" />
              স্টোর ব্লক করুন
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              আপনি কি নিশ্চিত যে <strong>{selectedStore?.name}</strong> স্টোরটি ব্লক করতে চান?
            </p>
            
            <div className="space-y-2">
              <Label>ব্লকের কারণ (ঐচ্ছিক)</Label>
              <Textarea
                placeholder="ব্লকের কারণ লিখুন..."
                value={blockReason}
                onChange={(e) => setBlockReason(e.target.value)}
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsBlockDialogOpen(false)}>
              বাতিল
            </Button>
            <Button variant="destructive" onClick={blockStore}>
              <Ban className="h-4 w-4 mr-2" />
              ব্লক করুন
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
