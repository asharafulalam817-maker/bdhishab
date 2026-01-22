import { motion } from 'framer-motion';
import { Search, ShieldCheck, Calendar, Phone, Package } from 'lucide-react';
import { bn, formatDateBn } from '@/lib/constants';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const demoWarranties = [
  { id: '1', invoiceNo: 'INV-202501-001', product: 'স্যামসাং গ্যালাক্সি A54', customer: 'মোহাম্মদ করিম', phone: '01712345678', startDate: '2025-01-15', expiryDate: '2026-01-15', status: 'active' },
  { id: '2', invoiceNo: 'INV-202501-002', product: 'JBL ব্লুটুথ স্পিকার', customer: 'ফাতেমা বেগম', phone: '01812345678', startDate: '2025-01-10', expiryDate: '2026-01-10', status: 'active' },
  { id: '3', invoiceNo: 'INV-202412-015', product: 'শাওমি পাওয়ার ব্যাংক', customer: 'রহিম উদ্দিন', phone: '01912345678', startDate: '2024-12-01', expiryDate: '2025-06-01', status: 'expiring' },
];

export default function Warranty() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="page-header">
        <div>
          <h1 className="page-title flex items-center gap-2">
            <ShieldCheck className="h-6 w-6" />
            {bn.warranty.title}
          </h1>
          <p className="text-muted-foreground">ওয়ারেন্টি তথ্য খুঁজুন এবং ট্র্যাক করুন</p>
        </div>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="চালান নং, ফোন নম্বর বা SKU দিয়ে খুঁজুন..." className="pl-9" />
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">সব</TabsTrigger>
          <TabsTrigger value="active">সক্রিয়</TabsTrigger>
          <TabsTrigger value="expiring">মেয়াদ শেষ হচ্ছে</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="mt-4">
          <div className="grid gap-4">
            {demoWarranties.map((w, i) => (
              <motion.div key={w.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Package className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{w.product}</span>
                          <Badge variant={w.status === 'active' ? 'default' : 'destructive'}>
                            {w.status === 'active' ? bn.warranty.active : 'মেয়াদ শেষ হচ্ছে'}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{w.invoiceNo} • {w.customer}</p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1"><Phone className="h-3 w-3" />{w.phone}</span>
                          <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />মেয়াদ: {formatDateBn(w.expiryDate)}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}
