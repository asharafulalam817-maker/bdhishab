import { useState } from 'react';
import { Bell, MessageSquare, Phone, Clock, Save, TestTube } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

interface NotificationConfig {
  smsEnabled: boolean;
  whatsappEnabled: boolean;
  reminderDays: number[];
  messageTemplate: string;
  senderName: string;
}

export default function NotificationSettings() {
  const [config, setConfig] = useState<NotificationConfig>({
    smsEnabled: false,
    whatsappEnabled: false,
    reminderDays: [7, 3, 1],
    messageTemplate: 'প্রিয় {customer_name}, আপনার {product_name} পণ্যের ওয়ারেন্টি আগামী {days} দিনে শেষ হবে। ওয়ারেন্টি নং: {warranty_id}। যোগাযোগ: {store_phone}',
    senderName: '',
  });
  
  const [isConnected, setIsConnected] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate save - will connect to backend later
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
    toast.success('নোটিফিকেশন সেটিংস সেভ হয়েছে');
  };

  const handleTestSMS = () => {
    if (!isConnected) {
      toast.error('SMS সার্ভিস কানেক্ট করা হয়নি। প্রথমে Twilio কানেক্ট করুন।');
      return;
    }
    toast.info('টেস্ট SMS পাঠানো হচ্ছে...');
  };

  const toggleReminderDay = (day: number) => {
    setConfig(prev => ({
      ...prev,
      reminderDays: prev.reminderDays.includes(day)
        ? prev.reminderDays.filter(d => d !== day)
        : [...prev.reminderDays, day].sort((a, b) => b - a)
    }));
  };

  const availableDays = [30, 14, 7, 3, 1];

  return (
    <div className="space-y-6">
      {/* Connection Status */}
      <Card className={isConnected ? 'border-green-500/50' : 'border-yellow-500/50'}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Phone className="h-5 w-5" />
              <CardTitle>SMS/WhatsApp সংযোগ</CardTitle>
            </div>
            <Badge variant={isConnected ? 'default' : 'secondary'}>
              {isConnected ? 'কানেক্টেড' : 'কানেক্ট করা হয়নি'}
            </Badge>
          </div>
          <CardDescription>
            {isConnected 
              ? 'Twilio সার্ভিস সফলভাবে কানেক্ট করা হয়েছে'
              : 'SMS/WhatsApp নোটিফিকেশন পাঠাতে Twilio কানেক্ট করুন'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!isConnected && (
            <div className="bg-muted/50 p-4 rounded-lg">
              <p className="text-sm text-muted-foreground mb-3">
                Twilio কানেক্ট করতে নিম্নলিখিত তথ্য প্রয়োজন:
              </p>
              <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                <li>Account SID</li>
                <li>Auth Token</li>
                <li>Phone Number (SMS এর জন্য)</li>
                <li>WhatsApp Business Number (ঐচ্ছিক)</li>
              </ul>
              <Button className="mt-4" variant="outline" disabled>
                <Phone className="h-4 w-4 mr-2" />
                Twilio কানেক্ট করুন (শীঘ্রই আসছে)
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Notification Channels */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            <CardTitle>নোটিফিকেশন চ্যানেল</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center gap-3">
              <MessageSquare className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium">SMS নোটিফিকেশন</p>
                <p className="text-sm text-muted-foreground">
                  গ্রাহকদের মোবাইলে SMS পাঠান
                </p>
              </div>
            </div>
            <Switch
              checked={config.smsEnabled}
              onCheckedChange={(checked) => setConfig(prev => ({ ...prev, smsEnabled: checked }))}
              disabled={!isConnected}
            />
          </div>

          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center gap-3">
              <MessageSquare className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium">WhatsApp নোটিফিকেশন</p>
                <p className="text-sm text-muted-foreground">
                  গ্রাহকদের WhatsApp এ মেসেজ পাঠান
                </p>
              </div>
            </div>
            <Switch
              checked={config.whatsappEnabled}
              onCheckedChange={(checked) => setConfig(prev => ({ ...prev, whatsappEnabled: checked }))}
              disabled={!isConnected}
            />
          </div>
        </CardContent>
      </Card>

      {/* Reminder Schedule */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            <CardTitle>রিমাইন্ডার সময়সূচী</CardTitle>
          </div>
          <CardDescription>
            ওয়ারেন্টি মেয়াদ শেষ হওয়ার কত দিন আগে রিমাইন্ডার পাঠাবে
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {availableDays.map(day => (
              <Button
                key={day}
                variant={config.reminderDays.includes(day) ? 'default' : 'outline'}
                size="sm"
                onClick={() => toggleReminderDay(day)}
              >
                {day} দিন আগে
              </Button>
            ))}
          </div>
          <p className="text-sm text-muted-foreground mt-3">
            নির্বাচিত: {config.reminderDays.length > 0 
              ? config.reminderDays.map(d => `${d} দিন`).join(', ') + ' আগে'
              : 'কোনটি নির্বাচিত নয়'
            }
          </p>
        </CardContent>
      </Card>

      {/* Message Template */}
      <Card>
        <CardHeader>
          <CardTitle>মেসেজ টেমপ্লেট</CardTitle>
          <CardDescription>
            গ্রাহকদের কাছে পাঠানো মেসেজের ফরম্যাট
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>প্রেরকের নাম</Label>
            <Input
              placeholder="আপনার স্টোরের নাম"
              value={config.senderName}
              onChange={(e) => setConfig(prev => ({ ...prev, senderName: e.target.value }))}
            />
          </div>
          
          <div className="space-y-2">
            <Label>মেসেজ টেমপ্লেট</Label>
            <Textarea
              rows={4}
              value={config.messageTemplate}
              onChange={(e) => setConfig(prev => ({ ...prev, messageTemplate: e.target.value }))}
              placeholder="মেসেজ লিখুন..."
            />
            <p className="text-xs text-muted-foreground">
              ব্যবহারযোগ্য ভেরিয়েবল: {'{customer_name}'}, {'{product_name}'}, {'{days}'}, {'{warranty_id}'}, {'{store_phone}'}
            </p>
          </div>

          <div className="bg-muted/50 p-3 rounded-lg">
            <p className="text-sm font-medium mb-1">প্রিভিউ:</p>
            <p className="text-sm text-muted-foreground">
              {config.messageTemplate
                .replace('{customer_name}', 'রহিম উদ্দিন')
                .replace('{product_name}', 'Samsung Galaxy A54')
                .replace('{days}', '৭')
                .replace('{warranty_id}', 'WR-2024-001')
                .replace('{store_phone}', '01700000000')
              }
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex gap-3">
        <Button onClick={handleSave} disabled={isSaving}>
          <Save className="h-4 w-4 mr-2" />
          {isSaving ? 'সেভ হচ্ছে...' : 'সেটিংস সেভ করুন'}
        </Button>
        <Button variant="outline" onClick={handleTestSMS} disabled={!isConnected}>
          <TestTube className="h-4 w-4 mr-2" />
          টেস্ট SMS পাঠান
        </Button>
      </div>
    </div>
  );
}
