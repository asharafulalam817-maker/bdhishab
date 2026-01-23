import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface AdminNotification {
  id: string;
  type: 'new_message' | 'new_store' | 'new_conversation';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  data?: {
    storeId?: string;
    storeName?: string;
    conversationId?: string;
  };
}

export function useAdminNotifications() {
  const [notifications, setNotifications] = useState<AdminNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize audio
  useEffect(() => {
    // Create audio element with a simple notification sound
    audioRef.current = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1idH2Nk42FfXR1fIWMkIuEfHR0eYOKj42IgXl1dn6Gi4+OioN8dnV4gImOkI2HgHp2d3qEi5GQjYV+eHd4fIeMkpCLhH15eHp+h42Rj4qDfXl4en+Ij5KQioN9eXl6f4iPkpCKg315eXl/iI+SkIqDfXl5eX+Ij5KQioN9eXl5f4iPkZCKg315eXl/iI+RkIqDfXl5eX+Ij5GQioN9eXl5f4iPkZCKg316eXl/iI+RkIqDfXl5eX+Ij5GQioN9enl5f4iPkZCKg316eXl/iI+RkIqDfXp5eX+Ij5GQioN9enl5f4iPkZCKg316eXl/h4+RkIqDfXp5eX+Hj5GQioN9enl5f4ePkZCKg316eXl/h4+RkIqDfXp5eX+Hj5GQioN9enl5f4ePkZCKg316eXl/h4+RkIqDfXp5eX+Hj5GQioN9enl5f4ePkZCKg316eXl/h4+RkIqDfXp5eX+Hj5GQioN9enl5f4ePkZCKg316eXl/h4+RkIqDfXp5eX+Hj5CPioN9enl5f4ePkI+Kg316eXl+h4+Qj4qDfXp5eX6Hj5CPioN9enl5foePkI+Kg316eXl+h4+Qj4qDfXp5eX6Hj5CPioN9enl5foePkI+Kg316eXl+h4+Qj4qDfXp5eX6Hj5CPioN9enl5foePkI+Kg316eXl+h4+Qj4qDfXp5eX6Hj5CPioN9enl5foePkI+Kg316eXl+h4+Qj4qDfXp5eX6Hj5CPioN9enl5foePkI+Kg316eXl+h4+Qj4qDfXp5eX6Hj4+PioN9enl5foePj4+Kg316eXl+h4+Pj4qDfXp5eX6Hj4+PioN9enl5foeOj4+Kg316eXl+h46Pj4qDfXp5eX6Hjo+PioN9enl5foeOj4+Kg316eXl+h46Pj4qDfXp5eX6Hjo+PioN9enl5foeOj4+Kg316eXl+h46Pj4qDfXp5eX6Hjo+PioN9enl5foeOj4+Kg316eXl+h46Pj4qDfXp5eX6Hjo+PioN9enl5foeOj4+Kg316eXl+h46Pj4mDfXp5eX6Hjo6PiYN9enl5foeOjo+Jg316eXl+h46Oj4mDfXp5eX6Gjo6PiYN9enl5foaOjo+Jg316eXl+ho6Oj4mDfXp5eX6Gjo6PiYN9enl5foaOjo+Jg316eXl+ho6Oj4mDfXp5eX6Gjo6PiYN9enl5foaOjo+Jg316eXl+ho6Oj4mDfXp5eX6Gjo6PiYN9enl5foaOjo6Jg316eXl+ho6OjomDfXp5eX6Gjo6OiYN9enl5foaOjo6Jg316eXl+ho6OjomDfXp5eX6Gjo6OiYN9enl5foaOjo6Jg316eXl+ho6OjomDfXp5eX6Gjo6OiYN9enl5foaOjo6Jg316eXl+ho6OjomDfXp5eX6Gjo6OiYN9enl5foaNjo6Jg316eXl+ho2OjomDfXp5eX6GjY6OiYN9enl5foaNjo6Jg316eXl+ho2OjomDfXp5eX6GjY6OiYN9enl5foaNjo6Jg316eXl+ho2OjomDfXp5eX6GjY6OiYN9enl5foaNjo6Jg316eXl+ho2OjomDfXp5eX6GjY6OiYN9enl5foaNjo6Jg316eXl+ho2OjomDfXp5eX6GjY2OiYN9enl5foaNjY6Jg316eXl+ho2NjomDfXp5eX6GjY2OiYN9enl5foWNjY6Jg316eXl+hY2NjomDfXp5eX6FjY2OiYN9enl5foWNjY6Jg316eXl+hY2NjomDfXp5eX6FjY2OiYN9enl5foWNjY6Jg316eXl+hY2NjomDfXp5eX6FjY2OiIN9enl5foWNjY6Ig316eXl+hY2NjomDfXp5eX6FjY2NiIN9enl5foWNjY2Ig316eXl+hY2NjYiDfXp5eX6FjY2NiIN9enl5foWMjY2Ig316eXl+hYyNjYiDfXp5eX6FjI2NiIN9');
  }, []);

  // Play notification sound
  const playNotificationSound = useCallback(() => {
    if (soundEnabled && audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {
        // Autoplay might be blocked
      });
    }
  }, [soundEnabled]);

  // Add notification
  const addNotification = useCallback((notification: Omit<AdminNotification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: AdminNotification = {
      ...notification,
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      read: false
    };

    setNotifications(prev => [newNotification, ...prev].slice(0, 50)); // Keep last 50
    setUnreadCount(prev => prev + 1);
    playNotificationSound();
    
    // Show toast notification
    toast.info(notification.title, {
      description: notification.message
    });
  }, [playNotificationSound]);

  // Mark notification as read
  const markAsRead = useCallback((notificationId: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  }, []);

  // Mark all as read
  const markAllAsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setUnreadCount(0);
  }, []);

  // Clear all notifications
  const clearAll = useCallback(() => {
    setNotifications([]);
    setUnreadCount(0);
  }, []);

  // Subscribe to realtime events
  useEffect(() => {
    const channel = supabase
      .channel('admin-notifications')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'stores' },
        async (payload) => {
          const store = payload.new as { id: string; name: string };
          addNotification({
            type: 'new_store',
            title: 'নতুন স্টোর যোগ হয়েছে',
            message: `"${store.name}" নামে নতুন স্টোর তৈরি হয়েছে`,
            data: { storeId: store.id, storeName: store.name }
          });
        }
      )
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'support_conversations' },
        async (payload) => {
          const conv = payload.new as { id: string; store_id: string; subject: string };
          // Fetch store name
          const { data: store } = await supabase
            .from('stores')
            .select('name')
            .eq('id', conv.store_id)
            .single();
          
          addNotification({
            type: 'new_conversation',
            title: 'নতুন সাপোর্ট টিকেট',
            message: `${store?.name || 'একটি স্টোর'} থেকে: ${conv.subject}`,
            data: { 
              storeId: conv.store_id, 
              storeName: store?.name,
              conversationId: conv.id 
            }
          });
        }
      )
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'support_messages', filter: 'sender_role=eq.store_owner' },
        async (payload) => {
          const msg = payload.new as { id: string; conversation_id: string; message: string };
          // Fetch conversation and store
          const { data: conv } = await supabase
            .from('support_conversations')
            .select('store_id, subject')
            .eq('id', msg.conversation_id)
            .single();
          
          if (conv) {
            const { data: store } = await supabase
              .from('stores')
              .select('name')
              .eq('id', conv.store_id)
              .single();
            
            addNotification({
              type: 'new_message',
              title: 'নতুন সাপোর্ট মেসেজ',
              message: `${store?.name || 'একটি স্টোর'}: ${msg.message.substring(0, 50)}${msg.message.length > 50 ? '...' : ''}`,
              data: { 
                storeId: conv.store_id, 
                storeName: store?.name,
                conversationId: msg.conversation_id 
              }
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [addNotification]);

  return {
    notifications,
    unreadCount,
    soundEnabled,
    setSoundEnabled,
    markAsRead,
    markAllAsRead,
    clearAll
  };
}
