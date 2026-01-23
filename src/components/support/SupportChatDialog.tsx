import { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, X, Plus, Phone, ExternalLink, Check, CheckCheck } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useSupportChat, SupportConversation, SupportMessage } from '@/hooks/useSupportChat';
import { useDemo } from '@/contexts/DemoContext';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { bn } from 'date-fns/locale';
import { toast } from 'sonner';

export default function SupportChatDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [newSubject, setNewSubject] = useState('');
  const [showNewConversation, setShowNewConversation] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { demoProfile } = useDemo();
  const userId = demoProfile.id;

  const {
    conversations,
    messages,
    activeConversation,
    setActiveConversation,
    isLoading,
    isPlatformAdmin,
    createConversation,
    sendMessage,
    closeConversation,
    getAdminWhatsApp
  } = useSupportChat();

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;
    await sendMessage(newMessage);
    setNewMessage('');
  };

  const handleCreateConversation = async () => {
    if (!newSubject.trim()) return;
    const conversation = await createConversation(newSubject);
    if (conversation) {
      setNewSubject('');
      setShowNewConversation(false);
    }
  };

  const handleWhatsAppClick = async () => {
    const whatsappNumber = await getAdminWhatsApp();
    if (whatsappNumber) {
      const cleanNumber = whatsappNumber.replace(/\D/g, '');
      window.open(`https://wa.me/${cleanNumber}?text=হ্যালো, আমি সাপোর্ট প্রয়োজন।`, '_blank');
    } else {
      toast.info('WhatsApp নম্বর সেট করা হয়নি');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'open':
        return <Badge variant="default" className="bg-primary">খোলা</Badge>;
      case 'pending':
        return <Badge variant="secondary">অপেক্ষমাণ</Badge>;
      case 'closed':
        return <Badge variant="outline">বন্ধ</Badge>;
      default:
        return null;
    }
  };

  const formatTime = (dateString: string) => {
    return format(new Date(dateString), 'dd MMM, hh:mm a', { locale: bn });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="icon" 
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg z-50 bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-4xl h-[80vh] p-0 gap-0">
        <DialogHeader className="p-4 border-b">
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              {isPlatformAdmin ? 'সাপোর্ট ম্যানেজমেন্ট' : 'সাপোর্ট চ্যাট'}
            </DialogTitle>
            <Button variant="ghost" size="sm" onClick={handleWhatsAppClick}>
              <Phone className="h-4 w-4 mr-2" />
              WhatsApp
              <ExternalLink className="h-3 w-3 ml-1" />
            </Button>
          </div>
        </DialogHeader>

        <div className="flex flex-1 overflow-hidden">
          {/* Conversation List */}
          <div className="w-1/3 border-r flex flex-col">
            <div className="p-3 border-b">
              <Button 
                className="w-full" 
                size="sm"
                onClick={() => setShowNewConversation(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                নতুন কথোপকথন
              </Button>
            </div>
            
            <ScrollArea className="flex-1">
              {conversations.length === 0 ? (
                <div className="p-4 text-center text-muted-foreground">
                  কোন কথোপকথন নেই
                </div>
              ) : (
                conversations.map((conv) => (
                  <div
                    key={conv.id}
                    onClick={() => {
                      setActiveConversation(conv);
                      setShowNewConversation(false);
                    }}
                    className={cn(
                      "p-3 border-b cursor-pointer hover:bg-muted/50 transition-colors",
                      activeConversation?.id === conv.id && "bg-muted"
                    )}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-medium text-sm line-clamp-1">{conv.subject}</p>
                      {getStatusBadge(conv.status)}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatTime(conv.updated_at)}
                    </p>
                  </div>
                ))
              )}
            </ScrollArea>
          </div>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col">
            {showNewConversation ? (
              <div className="flex-1 flex items-center justify-center p-6">
                <div className="w-full max-w-sm space-y-4">
                  <h3 className="text-lg font-semibold text-center">নতুন কথোপকথন শুরু করুন</h3>
                  <Input
                    placeholder="বিষয় লিখুন (যেমন: পেমেন্ট সমস্যা)"
                    value={newSubject}
                    onChange={(e) => setNewSubject(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleCreateConversation()}
                  />
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => setShowNewConversation(false)}
                    >
                      বাতিল
                    </Button>
                    <Button 
                      className="flex-1"
                      onClick={handleCreateConversation}
                      disabled={!newSubject.trim()}
                    >
                      শুরু করুন
                    </Button>
                  </div>
                </div>
              </div>
            ) : activeConversation ? (
              <>
                {/* Chat Header */}
                <div className="p-3 border-b flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">{activeConversation.subject}</h3>
                    {getStatusBadge(activeConversation.status)}
                  </div>
                  {activeConversation.status === 'open' && (
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => closeConversation(activeConversation.id)}
                    >
                      <X className="h-4 w-4 mr-1" />
                      বন্ধ করুন
                    </Button>
                  )}
                </div>

                {/* Messages */}
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-4">
                    {messages.map((msg) => (
                      <MessageBubble 
                        key={msg.id} 
                        message={msg} 
                        isOwn={msg.sender_id === userId}
                      />
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>

                {/* Input */}
                {activeConversation.status === 'open' && (
                  <div className="p-3 border-t flex gap-2">
                    <Input
                      placeholder="মেসেজ লিখুন..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                    />
                    <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-muted-foreground">
                একটি কথোপকথন নির্বাচন করুন বা নতুন শুরু করুন
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function MessageBubble({ message, isOwn }: { message: SupportMessage; isOwn: boolean }) {
  return (
    <div className={cn("flex gap-2", isOwn ? "justify-end" : "justify-start")}>
      {!isOwn && (
        <Avatar className="h-8 w-8">
          <AvatarFallback className="bg-primary text-primary-foreground text-xs">
            {message.sender_role === 'platform_admin' ? 'AD' : 'ST'}
          </AvatarFallback>
        </Avatar>
      )}
      <div 
        className={cn(
          "max-w-[70%] rounded-lg px-3 py-2",
          isOwn 
            ? "bg-primary text-primary-foreground" 
            : "bg-muted"
        )}
      >
        <p className="text-sm whitespace-pre-wrap">{message.message}</p>
        <div className={cn(
          "flex items-center gap-1 mt-1",
          isOwn ? "justify-end" : "justify-start"
        )}>
          <span className="text-[10px] opacity-70">
            {format(new Date(message.created_at), 'hh:mm a')}
          </span>
          {isOwn && (
            message.is_read 
              ? <CheckCheck className="h-3 w-3 opacity-70" />
              : <Check className="h-3 w-3 opacity-70" />
          )}
        </div>
      </div>
    </div>
  );
}
