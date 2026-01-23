import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Search, ShieldCheck, Printer } from 'lucide-react';
import { bn } from '@/lib/constants';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { WarrantyCard } from '@/components/warranty/WarrantyCard';
import { WarrantyPrintCard } from '@/components/warranty/WarrantyPrintCard';
import { toast } from 'sonner';

interface WarrantyData {
  id: string;
  invoiceNo: string;
  product: string;
  customer: string;
  phone: string;
  startDate: string;
  expiryDate: string;
  serialNumber?: string;
  status: string;
}

const demoWarranties: WarrantyData[] = [
  { id: '1', invoiceNo: 'INV-202501-001', product: 'স্যামসাং গ্যালাক্সি A54', customer: 'মোহাম্মদ করিম', phone: '01712345678', startDate: '2025-01-15', expiryDate: '2026-01-15', serialNumber: 'SM-A546BZKD', status: 'active' },
  { id: '2', invoiceNo: 'INV-202501-002', product: 'JBL ব্লুটুথ স্পিকার', customer: 'ফাতেমা বেগম', phone: '01812345678', startDate: '2025-01-10', expiryDate: '2026-01-10', serialNumber: 'JBL-FLIP6-2025', status: 'active' },
  { id: '3', invoiceNo: 'INV-202412-015', product: 'শাওমি পাওয়ার ব্যাংক', customer: 'রহিম উদ্দিন', phone: '01912345678', startDate: '2024-12-01', expiryDate: '2025-06-01', serialNumber: 'MI-PB20K-001', status: 'expiring' },
  { id: '4', invoiceNo: 'INV-202411-008', product: 'বেসাস চার্জার', customer: 'আবদুল হাকিম', phone: '01612345678', startDate: '2024-11-01', expiryDate: '2025-05-01', status: 'expiring' },
];

export default function Warranty() {
  const [searchQuery, setSearchQuery] = useState('');
  const [printDialogOpen, setPrintDialogOpen] = useState(false);
  const [selectedWarranty, setSelectedWarranty] = useState<WarrantyData | null>(null);
  const printRef = useRef<HTMLDivElement>(null);

  // Filter warranties based on search
  const filteredWarranties = demoWarranties.filter((w) => {
    const query = searchQuery.toLowerCase();
    return (
      w.invoiceNo.toLowerCase().includes(query) ||
      w.product.toLowerCase().includes(query) ||
      w.customer.toLowerCase().includes(query) ||
      w.phone.includes(query) ||
      (w.serialNumber && w.serialNumber.toLowerCase().includes(query))
    );
  });

  const activeWarranties = filteredWarranties.filter((w) => w.status === 'active');
  const expiringWarranties = filteredWarranties.filter((w) => w.status === 'expiring');

  const handleView = (warranty: WarrantyData) => {
    setSelectedWarranty(warranty);
    setPrintDialogOpen(true);
  };

  const handlePrint = (warranty: WarrantyData) => {
    setSelectedWarranty(warranty);
    setPrintDialogOpen(true);
  };

  const printWarrantyCard = () => {
    if (!printRef.current) return;

    const printContent = printRef.current.innerHTML;
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      toast.error('পপআপ ব্লক করা আছে। অনুগ্রহ করে পপআপ অনুমতি দিন।');
      return;
    }

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>ওয়ারেন্টি কার্ড প্রিন্ট</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { 
              font-family: system-ui, -apple-system, sans-serif; 
              padding: 20px;
              display: flex;
              justify-content: center;
            }
            @media print {
              body { padding: 0; }
            }
          </style>
        </head>
        <body>
          ${printContent}
        </body>
      </html>
    `);
    printWindow.document.close();
    
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  };

  const renderWarrantyList = (warranties: WarrantyData[]) => {
    if (warranties.length === 0) {
      return (
        <div className="text-center py-12 text-muted-foreground">
          <ShieldCheck className="h-12 w-12 mx-auto mb-4 opacity-50" />
          কোনো ওয়ারেন্টি রেকর্ড পাওয়া যায়নি
        </div>
      );
    }

    return (
      <div className="grid gap-4">
        {warranties.map((warranty, i) => (
          <motion.div
            key={warranty.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <WarrantyCard
              warranty={warranty}
              onView={handleView}
              onPrint={handlePrint}
            />
          </motion.div>
        ))}
      </div>
    );
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 p-4 md:p-6">
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
            <Input
              placeholder="চালান নং, ফোন নম্বর, সিরিয়াল বা পণ্যের নাম দিয়ে খুঁজুন..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">
            সব ({filteredWarranties.length})
          </TabsTrigger>
          <TabsTrigger value="active">
            সক্রিয় ({activeWarranties.length})
          </TabsTrigger>
          <TabsTrigger value="expiring">
            মেয়াদ শেষ হচ্ছে ({expiringWarranties.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-4">
          {renderWarrantyList(filteredWarranties)}
        </TabsContent>

        <TabsContent value="active" className="mt-4">
          {renderWarrantyList(activeWarranties)}
        </TabsContent>

        <TabsContent value="expiring" className="mt-4">
          {renderWarrantyList(expiringWarranties)}
        </TabsContent>
      </Tabs>

      {/* Print Dialog */}
      <Dialog open={printDialogOpen} onOpenChange={setPrintDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5" />
              ওয়ারেন্টি কার্ড
            </DialogTitle>
          </DialogHeader>

          {selectedWarranty && (
            <div className="space-y-4">
              {/* Print Preview */}
              <div className="flex justify-center overflow-auto py-4" ref={printRef}>
                <WarrantyPrintCard
                  warranty={selectedWarranty}
                  storeName="ডিজিটাল বন্ধু"
                  storePhone="০১৭১২-৩৪৫৬৭৮"
                  storeAddress="১২৩/এ, গুলশান, ঢাকা-১২১২"
                />
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setPrintDialogOpen(false)}>
                  বন্ধ করুন
                </Button>
                <Button onClick={printWarrantyCard}>
                  <Printer className="h-4 w-4 mr-2" />
                  প্রিন্ট করুন
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
