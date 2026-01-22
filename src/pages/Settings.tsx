import { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings as SettingsIcon, Store, Receipt, Shield, Users } from 'lucide-react';
import { bn } from '@/lib/constants';
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

export default function Settings() {
  const [selectedTemplate, setSelectedTemplate] = useState<InvoiceTemplate>('classic');

  const handleTemplateChange = (template: InvoiceTemplate) => {
    setSelectedTemplate(template);
    toast.success(`${template} টেমপ্লেট সিলেক্ট করা হয়েছে`);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="page-header">
        <h1 className="page-title flex items-center gap-2">
          <SettingsIcon className="h-6 w-6" />
          {bn.settings.title}
        </h1>
      </div>

      <Tabs defaultValue="store">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="store" className="gap-2"><Store className="h-4 w-4" />স্টোর</TabsTrigger>
          <TabsTrigger value="invoice" className="gap-2"><Receipt className="h-4 w-4" />চালান</TabsTrigger>
          <TabsTrigger value="warranty" className="gap-2"><Shield className="h-4 w-4" />ওয়ারেন্টি</TabsTrigger>
          <TabsTrigger value="users" className="gap-2"><Users className="h-4 w-4" />ব্যবহারকারী</TabsTrigger>
        </TabsList>

        <TabsContent value="store" className="mt-6 space-y-4">
          <Card>
            <CardHeader><CardTitle>স্টোর তথ্য</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{bn.settings.storeName}</Label>
                  <Input defaultValue="Demo Store" />
                </div>
                <div className="space-y-2">
                  <Label>{bn.settings.phone}</Label>
                  <Input defaultValue="01700000000" />
                </div>
                <div className="space-y-2">
                  <Label>{bn.settings.email}</Label>
                  <Input defaultValue="demo@store.com" />
                </div>
                <div className="space-y-2">
                  <Label>{bn.settings.address}</Label>
                  <Input defaultValue="ঢাকা, বাংলাদেশ" />
                </div>
              </div>
              <Button>{bn.common.save}</Button>
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
                <Label>{bn.settings.invoicePrefix}</Label>
                <Input defaultValue="INV" />
              </div>
              <div className="space-y-2">
                <Label>{bn.settings.invoiceHeader}</Label>
                <Textarea defaultValue="ধন্যবাদ আমাদের কাছ থেকে কেনাকাটা করার জন্য" />
              </div>
              <div className="space-y-2">
                <Label>{bn.settings.invoiceFooter}</Label>
                <Textarea defaultValue="পণ্য বিনিময়যোগ্য, অর্থ ফেরতযোগ্য নয়" />
              </div>
              <div className="flex items-center justify-between">
                <Label>{bn.settings.taxEnabled}</Label>
                <Switch />
              </div>
              <Button>{bn.common.save}</Button>
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
              <Button>{bn.common.save}</Button>
            </CardContent>
          </Card>
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
    </motion.div>
  );
}
