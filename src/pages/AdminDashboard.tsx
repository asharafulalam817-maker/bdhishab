import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, MessageCircle, Store, Users, Clock, CheckCircle, 
  AlertCircle, Search, Eye, Send, X 
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
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

interface Stats {
  totalConversations: number;
  openConversations: number;
  pendingConversations: number;
  closedConversations: number;
  totalStores: number;
}

const ADMIN_USER_ID = '00000000-0000-0000-0000-000000000001';

export default function AdminDashboard() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [stats, setStats] = useState<Stats>({
    totalConversations: 0,
    openConversations: 0,
    pendingConversations: 0,
    closedConversations: 0,
    totalStores: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Fetch all conversations (admin sees all)
  const fetchConversations = async () => {
    setIsLoading(true);
    try {
      const { data: convData, error } = await supabase
        .from('support_conversations')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) throw error;

      // Fetch store names
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

      // Calculate stats
      setStats({
        totalConversations: conversationsWithStores.length,
        openConversations: conversationsWithStores.filter(c => c.status === 'open').length,
        pendingConversations: conversationsWithStores.filter(c => c.status === 'pending').length,
        closedConversations: conversationsWithStores.filter(c => c.status === 'closed').length,
        totalStores: storeIds.length
      });
    } catch (error) {
      console.error('Error fetching conversations:', error);
      toast.error('কথোপকথন লোড করতে সমস্যা হয়েছে');
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

      // Mark as read
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

      // Update conversation
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

  // Open conversation dialog
  const openConversation = (conv: Conversation) => {
    setSelectedConversation(conv);
    setIsDialogOpen(true);
    fetchMessages(conv.id);
  };

  // Filter conversations
  const filteredConversations = conversations.filter(conv => {
    const matchesSearch = conv.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (conv.store_name?.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || conv.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Realtime subscription
  useEffect(() => {
    fetchConversations();

    const channel = supabase
      .channel('admin-conversations')
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

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      {/* Header */}
      <div className="page-header">
        <h1 className="page-title flex items-center gap-2">
          <Shield className="h-6 w-6" />
          এডমিন ড্যাশবোর্ড
        </h1>
        <p className="text-muted-foreground">সব স্টোরের সাপোর্ট মেসেজ পরিচালনা করুন</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <MessageCircle className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.totalConversations}</p>
                <p className="text-xs text-muted-foreground">মোট কথোপকথন</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <AlertCircle className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.openConversations}</p>
                <p className="text-xs text-muted-foreground">খোলা</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-secondary/50">
                <Clock className="h-5 w-5 text-secondary-foreground" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.pendingConversations}</p>
                <p className="text-xs text-muted-foreground">অপেক্ষমাণ</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-muted">
                <CheckCircle className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.closedConversations}</p>
                <p className="text-xs text-muted-foreground">সমাধান হয়েছে</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-accent/50">
                <Store className="h-5 w-5 text-accent-foreground" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.totalStores}</p>
                <p className="text-xs text-muted-foreground">স্টোর</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Conversations */}
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

      {/* Message Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
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
    </motion.div>
  );
}
