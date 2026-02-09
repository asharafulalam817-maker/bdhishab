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
import { StoreLogoUpload } from '@/components/settings/StoreLogoUpload';
import { useLanguage } from '@/contexts/LanguageContext';
import { useDemo } from '@/contexts/DemoContext';

export default function Settings() {
  const { t } = useLanguage();
  const { demoStore, currentStoreId, updateStore } = useDemo();
  const [selectedTemplate, setSelectedTemplate] = useState<InvoiceTemplate>('classic');
  const [subscriptionOpen, setSubscriptionOpen] = useState(false);
  const [storeLogo, setStoreLogo] = useState<string | null>(demoStore.logo_url);

  const handleTemplateChange = (template: InvoiceTemplate) => {
    setSelectedTemplate(template);
    toast.success(`${template} ${t('settings.templateSelected')}`);
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
              {/* Store Logo Upload */}
              <StoreLogoUpload
                currentLogoUrl={storeLogo}
                storeId={currentStoreId}
                onLogoChange={setStoreLogo}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{t('settings.storeName')}</Label>
                  <Input defaultValue={demoStore.name} />
                </div>
                <div className="space-y-2">
                  <Label>{t('settings.phone')}</Label>
                  <Input defaultValue={demoStore.phone || ''} />
                </div>
                <div className="space-y-2">
                  <Label>{t('settings.email')}</Label>
                  <Input defaultValue={demoStore.email || ''} />
                </div>
                <div className="space-y-2">
                  <Label>{t('settings.address')}</Label>
                  <Input defaultValue={demoStore.address || ''} />
                </div>
              </div>
              <Button>{t('common.save')}</Button>
            </CardContent>
          </Card>

          {/* Installment Feature Toggle */}
          <Card>
            <CardHeader><CardTitle>বিক্রয় ফিচার</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg border border-border">
                <div className="space-y-1">
                  <Label className="text-base font-semibold">কিস্তিতে বিক্রি</Label>
                  <p className="text-sm text-muted-foreground">
                    এই ফিচার চালু করলে আপনি কিস্তিতে পণ্য বিক্রি করতে পারবেন
                  </p>
                </div>
                <Switch
                  checked={demoStore.installment_enabled}
                  onCheckedChange={(checked) => {
                    updateStore({ installment_enabled: checked });
                    toast.success(checked ? 'কিস্তিতে বিক্রি ফিচার চালু করা হয়েছে' : 'কিস্তিতে বিক্রি ফিচার বন্ধ করা হয়েছে');
                  }}
                />
              </div>
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
                {t('settings.subscriptionDesc')}
              </p>
              <Button onClick={() => setSubscriptionOpen(true)} className="gap-2">
                <Crown className="h-4 w-4" />
                {t('settings.viewSubscription')}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="invoice" className="mt-6 space-y-4">
          {/* Template Selector */}
          <Card>
            <CardHeader><CardTitle>{t('settings.invoiceTemplate')}</CardTitle></CardHeader>
            <CardContent>
              <InvoiceTemplateSelector 
                selectedTemplate={selectedTemplate} 
                onSelect={handleTemplateChange} 
              />
            </CardContent>
          </Card>

          {/* Other Invoice Settings */}
          <Card>
            <CardHeader><CardTitle>{t('settings.invoiceSettings')}</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>{t('settings.invoicePrefix')}</Label>
                <Input defaultValue="INV" />
              </div>
              <div className="space-y-2">
                <Label>{t('settings.invoiceHeader')}</Label>
                <Textarea defaultValue="ধন্যবাদ আমাদের কাছ থেকে কেনাকাটা করার জন্য" />
              </div>
              <div className="space-y-2">
                <Label>{t('settings.invoiceFooter')}</Label>
                <Textarea defaultValue="পণ্য বিনিময়যোগ্য, অর্থ ফেরতযোগ্য নয়" />
              </div>
              <div className="flex items-center justify-between">
                <Label>{t('settings.taxEnabled')}</Label>
                <Switch />
              </div>
              <Button>{t('common.save')}</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="warranty" className="mt-6">
          <Card>
            <CardHeader><CardTitle>{t('settings.defaultWarranty')}</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{t('settings.defaultDuration')}</Label>
                  <Input defaultValue="১" />
                </div>
                <div className="space-y-2">
                  <Label>{t('settings.durationUnit')}</Label>
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
            <CardHeader><CardTitle>{t('settings.userList')}</CardTitle></CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{t('settings.userManagement')}</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <SubscriptionDialog open={subscriptionOpen} onOpenChange={setSubscriptionOpen} />
    </motion.div>
  );
}
