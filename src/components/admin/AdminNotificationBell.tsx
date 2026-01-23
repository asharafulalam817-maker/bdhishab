import { useState } from 'react';
import { Bell, BellOff, Check, Store, MessageCircle, Trash2, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { format } from 'date-fns';
import { bn as bnLocale } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { AdminNotification } from '@/hooks/useAdminNotifications';

interface AdminNotificationBellProps {
  notifications: AdminNotification[];
  unreadCount: number;
  soundEnabled: boolean;
  onSoundToggle: () => void;
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onClearAll: () => void;
  onNotificationClick?: (notification: AdminNotification) => void;
}

export function AdminNotificationBell({
  notifications,
  unreadCount,
  soundEnabled,
  onSoundToggle,
  onMarkAsRead,
  onMarkAllAsRead,
  onClearAll,
  onNotificationClick
}: AdminNotificationBellProps) {
  const [isOpen, setIsOpen] = useState(false);

  const getNotificationIcon = (type: AdminNotification['type']) => {
    switch (type) {
      case 'new_store':
        return <Store className="h-4 w-4 text-primary" />;
      case 'new_message':
      case 'new_conversation':
        return <MessageCircle className="h-4 w-4 text-primary" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    
    if (diffMins < 1) return 'এইমাত্র';
    if (diffMins < 60) return `${diffMins} মিনিট আগে`;
    if (diffHours < 24) return `${diffHours} ঘণ্টা আগে`;
    return format(date, 'dd MMM, hh:mm a', { locale: bnLocale });
  };

  const handleNotificationClick = (notification: AdminNotification) => {
    if (!notification.read) {
      onMarkAsRead(notification.id);
    }
    onNotificationClick?.(notification);
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className={cn("h-5 w-5", unreadCount > 0 && "animate-pulse")} />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 h-5 w-5 rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground flex items-center justify-center animate-bounce">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-96">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>বিজ্ঞপ্তি</span>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={(e) => {
                e.preventDefault();
                onSoundToggle();
              }}
              title={soundEnabled ? 'সাউন্ড বন্ধ করুন' : 'সাউন্ড চালু করুন'}
            >
              {soundEnabled ? (
                <Volume2 className="h-3.5 w-3.5" />
              ) : (
                <VolumeX className="h-3.5 w-3.5 text-muted-foreground" />
              )}
            </Button>
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="h-6 text-xs"
                onClick={(e) => {
                  e.preventDefault();
                  onMarkAllAsRead();
                }}
              >
                <Check className="h-3 w-3 mr-1" />
                সব পঠিত
              </Button>
            )}
            {notifications.length > 0 && (
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-muted-foreground hover:text-destructive"
                onClick={(e) => {
                  e.preventDefault();
                  onClearAll();
                }}
                title="সব মুছুন"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            )}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {notifications.length === 0 ? (
          <div className="py-8 text-center text-muted-foreground">
            <BellOff className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">কোনো বিজ্ঞপ্তি নেই</p>
          </div>
        ) : (
          <ScrollArea className="h-80">
            {notifications.map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                className={cn(
                  "flex items-start gap-3 p-3 cursor-pointer",
                  !notification.read && "bg-primary/5"
                )}
                onClick={() => handleNotificationClick(notification)}
              >
                <div className="p-1.5 rounded-full bg-muted">
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className={cn(
                      "text-sm truncate",
                      !notification.read && "font-semibold"
                    )}>
                      {notification.title}
                    </p>
                    {!notification.read && (
                      <span className="h-2 w-2 rounded-full bg-primary flex-shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
                    {notification.message}
                  </p>
                  <p className="text-[10px] text-muted-foreground mt-1">
                    {formatTime(notification.timestamp)}
                  </p>
                </div>
              </DropdownMenuItem>
            ))}
          </ScrollArea>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
