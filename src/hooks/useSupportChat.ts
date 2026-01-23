import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useDemo } from '@/contexts/DemoContext';
import { toast } from 'sonner';

export interface SupportConversation {
  id: string;
  store_id: string;
  subject: string;
  status: 'open' | 'closed' | 'pending';
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface SupportMessage {
  id: string;
  conversation_id: string;
  sender_id: string;
  sender_role: 'store_owner' | 'platform_admin';
  message: string;
  is_read: boolean;
  created_at: string;
}

export interface PlatformAdmin {
  id: string;
  user_id: string;
  name: string | null;
  whatsapp_number: string | null;
  is_active: boolean;
}

export function useSupportChat() {
  const { currentStoreId, demoProfile } = useDemo();
  const [conversations, setConversations] = useState<SupportConversation[]>([]);
  const [messages, setMessages] = useState<SupportMessage[]>([]);
  const [activeConversation, setActiveConversation] = useState<SupportConversation | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isPlatformAdmin, setIsPlatformAdmin] = useState(false);
  const [adminInfo, setAdminInfo] = useState<PlatformAdmin | null>(null);

  const storeId = currentStoreId;
  const userId = demoProfile.id;

  // Check if current user is platform admin
  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!userId) return;
      
      const { data, error } = await supabase
        .from('platform_admins')
        .select('*')
        .eq('user_id', userId)
        .eq('is_active', true)
        .maybeSingle();
      
      if (data && !error) {
        setIsPlatformAdmin(true);
        setAdminInfo(data as PlatformAdmin);
      }
    };
    
    checkAdminStatus();
  }, [userId]);

  // Fetch conversations
  const fetchConversations = async () => {
    setIsLoading(true);
    try {
      let query = supabase
        .from('support_conversations')
        .select('*')
        .order('updated_at', { ascending: false });
      
      // If not platform admin, only fetch store's conversations
      if (!isPlatformAdmin && storeId) {
        query = query.eq('store_id', storeId);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      setConversations((data || []) as SupportConversation[]);
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch messages for a conversation
  const fetchMessages = async (conversationId: string) => {
    try {
      const { data, error } = await supabase
        .from('support_messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      setMessages((data || []) as SupportMessage[]);
      
      // Mark messages as read
      await supabase
        .from('support_messages')
        .update({ is_read: true })
        .eq('conversation_id', conversationId)
        .neq('sender_id', userId);
        
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  // Create new conversation
  const createConversation = async (subject: string) => {
    if (!storeId || !userId) return null;
    
    try {
      const { data, error } = await supabase
        .from('support_conversations')
        .insert({
          store_id: storeId,
          subject,
          created_by: userId,
          status: 'open'
        })
        .select()
        .single();
      
      if (error) throw error;
      
      const newConversation = data as SupportConversation;
      setConversations(prev => [newConversation, ...prev]);
      setActiveConversation(newConversation);
      toast.success('কথোপকথন শুরু হয়েছে');
      return newConversation;
    } catch (error) {
      console.error('Error creating conversation:', error);
      toast.error('কথোপকথন শুরু করতে সমস্যা হয়েছে');
      return null;
    }
  };

  // Send message
  const sendMessage = async (message: string) => {
    if (!activeConversation || !userId) return;
    
    try {
      const { data, error } = await supabase
        .from('support_messages')
        .insert({
          conversation_id: activeConversation.id,
          sender_id: userId,
          sender_role: isPlatformAdmin ? 'platform_admin' : 'store_owner',
          message
        })
        .select()
        .single();
      
      if (error) throw error;
      
      setMessages(prev => [...prev, data as SupportMessage]);
      
      // Update conversation updated_at
      await supabase
        .from('support_conversations')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', activeConversation.id);
        
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
      
      setConversations(prev => 
        prev.map(c => c.id === conversationId ? { ...c, status: 'closed' as const } : c)
      );
      toast.success('কথোপকথন বন্ধ করা হয়েছে');
    } catch (error) {
      console.error('Error closing conversation:', error);
    }
  };

  // Get admin WhatsApp number
  const getAdminWhatsApp = async (): Promise<string | null> => {
    try {
      const { data, error } = await supabase
        .from('platform_admins')
        .select('whatsapp_number')
        .eq('is_active', true)
        .limit(1)
        .maybeSingle();
      
      if (error) throw error;
      return data?.whatsapp_number || null;
    } catch (error) {
      console.error('Error fetching admin WhatsApp:', error);
      return null;
    }
  };

  // Subscribe to realtime messages
  useEffect(() => {
    if (!activeConversation) return;
    
    const channel = supabase
      .channel(`messages:${activeConversation.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'support_messages',
          filter: `conversation_id=eq.${activeConversation.id}`
        },
        (payload) => {
          const newMessage = payload.new as SupportMessage;
          if (newMessage.sender_id !== userId) {
            setMessages(prev => [...prev, newMessage]);
          }
        }
      )
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, [activeConversation, userId]);

  // Initial fetch
  useEffect(() => {
    if (storeId || isPlatformAdmin) {
      fetchConversations();
    }
  }, [storeId, isPlatformAdmin]);

  // Fetch messages when conversation changes
  useEffect(() => {
    if (activeConversation) {
      fetchMessages(activeConversation.id);
    } else {
      setMessages([]);
    }
  }, [activeConversation]);

  return {
    conversations,
    messages,
    activeConversation,
    setActiveConversation,
    isLoading,
    isPlatformAdmin,
    adminInfo,
    createConversation,
    sendMessage,
    closeConversation,
    getAdminWhatsApp,
    fetchConversations
  };
}
