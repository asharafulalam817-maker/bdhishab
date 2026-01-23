import { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings as SettingsIcon, Store, Receipt, Shield, Users, Bell, Crown, Palette } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import InvoiceTemplateSelector from '@/components/invoice/InvoiceTemplateSelector';
import { InvoiceTemplate } from '@/components/invoice/types';
import { toast } from 'sonner';
import NotificationSettings from '@/components/warranty/NotificationSettings';
import { SubscriptionDialog } from '@/components/subscription/SubscriptionDialog';
import { AppearanceSettings } from '@/components/settings/AppearanceSettings';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Settings() {
  const [selectedTemplate, setSelectedTemplate] = useState<InvoiceTemplate>('classic');
  const [subscriptionOpen, setSubscriptionOpen] = useState(false);
  const { t } = useLanguage();

  const handleTemplateChange = (template: InvoiceTemplate) => {
    setSelectedTemplate(template);
    toast.success(`${template} টেমপ্লেট সিলেক্ট করা হয়েছে`);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="page-header">
        <h1 className="page-title flex items-center gap-2">
          <SettingsIcon className="h-6 w-6" />
          {t('settings.title')}
        </h1>
      </div>

      <Tabs defaultValue="store">
        <TabsList className="flex flex-wrap h-auto gap-1">
          <TabsTrigger value="store" className="gap-2">
            <Store className="h-4 w-4" />
            <span className="hidden sm:inline">{t('settings.store')}</span>
          </TabsTrigger>
          <TabsTrigger value="appearance" className="gap-2">
            <Palette className="h-4 w-4" />
            <span className="hidden sm:inline">{t('settings.appearance')}</span>
          </TabsTrigger>
          <TabsTrigger value="subscription" className="gap-2">
            <Crown className="h-4 w-4" />
            <span className="hidden sm:inline">{t('settings.subscription')}</span>
          </TabsTrigger>
          <TabsTrigger value="invoice" className="gap-2">
            <Receipt className="h-4 w-4" />
            <span className="hidden sm:inline">{t('settings.invoice')}</span>
          </TabsTrigger>
          <TabsTrigger value="warranty" className="gap-2">
            <Shield className="h-4 w-4" />
            <span className="hidden sm:inline">{t('settings.warranty')}</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2">
            <Bell className="h-4 w-4" />
            <span className="hidden sm:inline">{t('settings.notifications')}</span>
          </TabsTrigger>
          <TabsTrigger value="users" className="gap-2">
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">{t('settings.users')}</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="store" className="mt-6 space-y-4">
          <Card>
            <CardHeader><CardTitle>{t('settings.store')}</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>স্টোরের নাম</Label>
                  <Input defaultValue="Demo Store" />
                </div>
                <div className="space-y-2">
                  <Label>ফোন</Label>
                  <Input defaultValue="01700000000" />
                </div>
                <div className="space-y-2">
                  <Label>ইমেইল</Label>
                  <Input defaultValue="demo@store.com" />
                </div>
                <div className="space-y-2">
                  <Label>ঠিকানা</Label>
                  <Input defaultValue="ঢাকা, বাংলাদেশ" />
                </div>
              </div>
              <Button>{t('common.save')}</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance" className="mt-6">
          <AppearanceSettings />
        </TabsContent>

        <TabsContent value="subscription" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Crown className="h-5 w-5 text-yellow-500" />
                {t('settings.subscription')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                আপনার সাবস্ক্রিপশন প্যাকেজ দেখুন এবং আপগ্রেড করুন
              </p>
              <Button onClick={() => setSubscriptionOpen(true)} className="gap-2">
                <Crown className="h-4 w-4" />
                সাবস্ক্রিপশন দেখুন
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="invoice" className="mt-6 space-y-4">
          {/* Template Selector */}
          <Card>
            <CardHeader><CardTitle>চালান টেমপ্লেট সিলেক্ট করুন</CardTitle></CardHeader>
            <CardContent>
              <InvoiceTemplateSelector 
                selectedTemplate={selectedTemplate} 
                onSelect={handleTemplateChange} 
              />
            </CardContent>
          </Card>

          {/* Other Invoice Settings */}
          <Card>
            <CardHeader><CardTitle>চালান সেটিংস</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>ইনভয়েস প্রিফিক্স</Label>
                <Input defaultValue="INV" />
              </div>
              <div className="space-y-2">
                <Label>ইনভয়েস হেডার</Label>
                <Textarea defaultValue="ধন্যবাদ আমাদের কাছ থেকে কেনাকাটা করার জন্য" />
              </div>
              <div className="space-y-2">
                <Label>ইনভয়েস ফুটার</Label>
                <Textarea defaultValue="পণ্য বিনিময়যোগ্য, অর্থ ফেরতযোগ্য নয়" />
              </div>
              <div className="flex items-center justify-between">
                <Label>ট্যাক্স সক্রিয়</Label>
                <Switch />
              </div>
              <Button>{t('common.save')}</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="warranty" className="mt-6">
          <Card>
            <CardHeader><CardTitle>ডিফল্ট ওয়ারেন্টি সেটিংস</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>ডিফল্ট সময়কাল</Label>
                  <Input defaultValue="১" />
                </div>
                <div className="space-y-2">
                  <Label>একক</Label>
                  <Input defaultValue="বছর" />
                </div>
              </div>
              <Button>{t('common.save')}</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="mt-6">
          <NotificationSettings />
        </TabsContent>

        <TabsContent value="users" className="mt-6">
          <Card>
            <CardHeader><CardTitle>ব্যবহারকারী তালিকা</CardTitle></CardHeader>
            <CardContent>
              <p className="text-muted-foreground">ব্যবহারকারী ব্যবস্থাপনা শীঘ্রই আসছে...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <SubscriptionDialog open={subscriptionOpen} onOpenChange={setSubscriptionOpen} />
    </motion.div>
  );
}
