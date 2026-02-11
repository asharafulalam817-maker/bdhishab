import { useState, useEffect } from 'react';
import { MessageSquare, Bell, Send, CheckCircle2, XCircle, Loader2, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useSmsSubscription } from '@/hooks/useSmsSubscription';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { bn as bnLocale } from 'date-fns/locale';

export function SmsNotificationSettings() {
  const { subscription, settings, logs, isLoading, isSmsActive, updateSettings, refreshLogs } = useSmsSubscription();

  if (isLoading) {
    return <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin" /></div>;
  }

  const active = isSmsActive();

  return (
    <div className="space-y-6">
      {/* Status Card */}
      <Card className={active ? 'border-emerald-500/50' : 'border-amber-500/50'}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              <CardTitle>WhatsApp নোটিফিকেশন সার্ভিস</CardTitle>
            </div>
            <Badge variant={active ? 'default' : 'secondary'} className={active ? 'bg-emerald-600' : ''}>
              {active ? '✅ সক্রিয়' : '❌ নিষ্ক্রিয়'}
            </Badge>
          </div>
          <CardDescription>
            {active 
              ? 'আপনার WhatsApp নোটিফিকেশন সার্ভিস চালু আছে। মাসিক ফি: ৳৭০'
              : 'এই সার্ভিস অ্যাডমিন দ্বারা অ্যাক্টিভেট করা হয়। সক্রিয় করতে অ্যাডমিনের সাথে যোগাযোগ করুন।'
            }
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Notification Preferences */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            <CardTitle>নোটিফিকেশন প্রেফারেন্স</CardTitle>
          </div>
          <CardDescription>কোন কোন ইভেন্টে কাস্টমারকে নোটিফিকেশন পাঠাবে তা সেট করুন</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-lg border">
            <div className="space-y-1">
              <Label className="text-base font-semibold">🧾 বিক্রির রসিদ</Label>
              <p className="text-sm text-muted-foreground">বিক্রি সম্পন্ন হলে কাস্টমারকে ইনভয়েস ও ধন্যবাদ মেসেজ</p>
            </div>
            <Switch
              disabled={!active}
              checked={settings?.sale_notification ?? true}
              onCheckedChange={(checked) => {
                updateSettings({ sale_notification: checked });
                toast.success(checked ? 'বিক্রি নোটিফিকেশন চালু' : 'বিক্রি নোটিফিকেশন বন্ধ');
              }}
            />
          </div>

          <div className="flex items-center justify-between p-4 rounded-lg border">
            <div className="space-y-1">
              <Label className="text-base font-semibold">📅 কিস্তি রিমাইন্ডার</Label>
              <p className="text-sm text-muted-foreground">কিস্তির তারিখ আসার আগে কাস্টমারকে রিমাইন্ডার</p>
            </div>
            <Switch
              disabled={!active}
              checked={settings?.installment_reminder ?? true}
              onCheckedChange={(checked) => {
                updateSettings({ installment_reminder: checked });
                toast.success(checked ? 'কিস্তি রিমাইন্ডার চালু' : 'কিস্তি রিমাইন্ডার বন্ধ');
              }}
            />
          </div>

          <div className="flex items-center justify-between p-4 rounded-lg border">
            <div className="space-y-1">
              <Label className="text-base font-semibold">💳 বাকি পেমেন্ট রিমাইন্ডার</Label>
              <p className="text-sm text-muted-foreground">বাকি টাকা থাকলে কাস্টমারকে রিমাইন্ডার পাঠান</p>
            </div>
            <Switch
              disabled={!active}
              checked={settings?.due_reminder ?? true}
              onCheckedChange={(checked) => {
                updateSettings({ due_reminder: checked });
                toast.success(checked ? 'বাকি রিমাইন্ডার চালু' : 'বাকি রিমাইন্ডার বন্ধ');
              }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Recent Logs */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Send className="h-5 w-5" />
              <CardTitle>সাম্প্রতিক মেসেজ</CardTitle>
            </div>
            <Button variant="outline" size="sm" onClick={() => refreshLogs()}>রিফ্রেশ</Button>
          </div>
        </CardHeader>
        <CardContent>
          {logs.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">কোনো মেসেজ পাঠানো হয়নি</p>
          ) : (
            <ScrollArea className="h-[300px]">
              <div className="space-y-3">
                {logs.map(log => (
                  <div key={log.id} className="flex items-start gap-3 p-3 border rounded-lg">
                    {log.status === 'sent' ? (
                      <CheckCircle2 className="h-5 w-5 text-emerald-600 mt-0.5" />
                    ) : (
                      <XCircle className="h-5 w-5 text-destructive mt-0.5" />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant="outline" className="text-xs">
                          {log.notification_type === 'sale_receipt' ? '🧾 বিক্রি' :
                           log.notification_type === 'installment_due' ? '📅 কিস্তি' : '💳 বাকি'}
                        </Badge>
                        <span className="text-xs text-muted-foreground">{log.phone}</span>
                        <span className="text-xs text-muted-foreground">
                          {format(new Date(log.created_at), 'dd MMM, hh:mm a', { locale: bnLocale })}
                        </span>
                      </div>
                      <p className="text-sm mt-1 text-muted-foreground truncate">{log.message}</p>
                      {log.error_message && (
                        <p className="text-xs text-destructive mt-1">{log.error_message}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
