import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Search, ShieldCheck, Printer, AlertTriangle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { WarrantyCard } from '@/components/warranty/WarrantyCard';
import { WarrantyPrintCard } from '@/components/warranty/WarrantyPrintCard';
import { WarrantyClaimDialog, WarrantyClaim } from '@/components/warranty/WarrantyClaimDialog';
import { WarrantyClaimCard } from '@/components/warranty/WarrantyClaimCard';
import { WarrantyDialogContent } from '@/components/warranty/WarrantyDialogContent';
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
  warrantyDuration?: number;
  warrantyUnit?: 'days' | 'months' | 'years';
}

const demoWarranties: WarrantyData[] = [
  { id: '1', invoiceNo: 'INV-202501-001', product: 'স্যামসাং গ্যালাক্সি A54', customer: 'মোহাম্মদ করিম', phone: '01712345678', startDate: '2025-01-15', expiryDate: '2026-01-15', serialNumber: 'SM-A546BZKD', status: 'active', warrantyDuration: 12, warrantyUnit: 'months' },
  { id: '2', invoiceNo: 'INV-202501-002', product: 'JBL ব্লুটুথ স্পিকার', customer: 'ফাতেমা বেগম', phone: '01812345678', startDate: '2025-01-10', expiryDate: '2026-01-10', serialNumber: 'JBL-FLIP6-2025', status: 'active', warrantyDuration: 1, warrantyUnit: 'years' },
  { id: '3', invoiceNo: 'INV-202412-015', product: 'শাওমি পাওয়ার ব্যাংক', customer: 'রহিম উদ্দিন', phone: '01912345678', startDate: '2024-12-01', expiryDate: '2025-06-01', serialNumber: 'MI-PB20K-001', status: 'expiring', warrantyDuration: 6, warrantyUnit: 'months' },
  { id: '4', invoiceNo: 'INV-202411-008', product: 'বেসাস চার্জার', customer: 'আবদুল হাকিম', phone: '01612345678', startDate: '2024-11-01', expiryDate: '2025-05-01', status: 'expiring', warrantyDuration: 6, warrantyUnit: 'months' },
];

// Demo claims data
const demoClaims: WarrantyClaim[] = [
  {
    id: 'claim-1',
    warrantyId: '1',
    warrantyInfo: { invoiceNo: 'INV-202501-001', product: 'স্যামসাং গ্যালাক্সি A54', customer: 'মোহাম্মদ করিম', phone: '01712345678' },
    claimDate: '2025-01-20',
    issueDescription: 'ডিসপ্লে ঠিকমতো কাজ করছে না, টাচ রেসপন্স দিচ্ছে না।',
    actionTaken: 'সার্ভিস সেন্টারে পাঠানো হয়েছে।',
    status: 'in_progress',
    createdAt: '2025-01-20T10:00:00Z',
    updatedAt: '2025-01-21T14:00:00Z',
  },
  {
    id: 'claim-2',
    warrantyId: '2',
    warrantyInfo: { invoiceNo: 'INV-202501-002', product: 'JBL ব্লুটুথ স্পিকার', customer: 'ফাতেমা বেগম', phone: '01812345678' },
    claimDate: '2025-01-18',
    issueDescription: 'ব্লুটুথ কানেক্ট হচ্ছে না।',
    actionTaken: 'রিসেট করা হয়েছে এবং ফার্মওয়্যার আপডেট করা হয়েছে।',
    resolution: 'সমস্যা সমাধান হয়েছে। ফার্মওয়্যার বাগ ছিল।',
    status: 'resolved',
    createdAt: '2025-01-18T09:00:00Z',
    updatedAt: '2025-01-19T16:00:00Z',
  },
];

export default function Warranty() {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [printDialogOpen, setPrintDialogOpen] = useState(false);
  const [selectedWarranty, setSelectedWarranty] = useState<WarrantyData | null>(null);
  const [mainTab, setMainTab] = useState('warranties');
  
  // Claim management state
  const [claims, setClaims] = useState<WarrantyClaim[]>(demoClaims);
  const [claimDialogOpen, setClaimDialogOpen] = useState(false);
  const [selectedClaimWarranty, setSelectedClaimWarranty] = useState<WarrantyData | null>(null);
  const [editingClaim, setEditingClaim] = useState<WarrantyClaim | null>(null);
  
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

  // Filter claims based on search
  const filteredClaims = claims.filter((c) => {
    const query = searchQuery.toLowerCase();
    return (
      c.warrantyInfo?.invoiceNo.toLowerCase().includes(query) ||
      c.warrantyInfo?.product.toLowerCase().includes(query) ||
      c.warrantyInfo?.customer.toLowerCase().includes(query) ||
      c.issueDescription.toLowerCase().includes(query)
    );
  });

  const activeWarranties = filteredWarranties.filter((w) => w.status === 'active');
  const expiringWarranties = filteredWarranties.filter((w) => w.status === 'expiring');

  const pendingClaims = filteredClaims.filter((c) => c.status === 'pending' || c.status === 'in_progress');
  const resolvedClaims = filteredClaims.filter((c) => c.status === 'resolved' || c.status === 'rejected');

  const handleView = (warranty: WarrantyData) => {
    setSelectedWarranty(warranty);
    setPrintDialogOpen(true);
  };

  const handlePrint = (warranty: WarrantyData) => {
    setSelectedWarranty(warranty);
    setPrintDialogOpen(true);
  };

  const handleAddClaim = (warranty: WarrantyData) => {
    setSelectedClaimWarranty(warranty);
    setEditingClaim(null);
    setClaimDialogOpen(true);
  };

  const handleEditClaim = (claim: WarrantyClaim) => {
    setEditingClaim(claim);
    setSelectedClaimWarranty(null);
    setClaimDialogOpen(true);
  };

  const handleSaveClaim = (claimData: Partial<WarrantyClaim>) => {
    if (claimData.id) {
      // Update existing claim
      setClaims(prev => prev.map(c => 
        c.id === claimData.id 
          ? { ...c, ...claimData, updatedAt: new Date().toISOString() }
          : c
      ));
    } else {
      // Add new claim
      const newClaim: WarrantyClaim = {
        id: `claim-${Date.now()}`,
        warrantyId: claimData.warrantyId!,
        warrantyInfo: selectedClaimWarranty ? {
          invoiceNo: selectedClaimWarranty.invoiceNo,
          product: selectedClaimWarranty.product,
          customer: selectedClaimWarranty.customer,
          phone: selectedClaimWarranty.phone,
        } : undefined,
        claimDate: claimData.claimDate || new Date().toISOString().split('T')[0],
        issueDescription: claimData.issueDescription!,
        actionTaken: claimData.actionTaken,
        resolution: claimData.resolution,
        status: claimData.status || 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setClaims(prev => [newClaim, ...prev]);
    }
  };

  const printWarrantyCard = () => {
    if (!printRef.current) return;

    const printContent = printRef.current.innerHTML;
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      toast.error(t('warranty.popupBlocked'));
      return;
    }

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${t('warranty.warrantyCard')}</title>
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
          {t('warranty.noWarranties')}
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
              onAddClaim={handleAddClaim}
            />
          </motion.div>
        ))}
      </div>
    );
  };

  const renderClaimList = (claimsList: WarrantyClaim[]) => {
    if (claimsList.length === 0) {
      return (
        <div className="text-center py-12 text-muted-foreground">
          <AlertTriangle className="h-12 w-12 mx-auto mb-4 opacity-50" />
          {t('warranty.noClaims')}
        </div>
      );
    }

    return (
      <div className="grid gap-4">
        {claimsList.map((claim, i) => (
          <motion.div
            key={claim.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <WarrantyClaimCard claim={claim} onEdit={handleEditClaim} />
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
            {t('warranty.title')}
          </h1>
          <p className="text-muted-foreground">{t('warranty.description')}</p>
        </div>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder={t('warranty.searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </CardContent>
      </Card>

      {/* Main Tabs: Warranties vs Claims */}
      <Tabs value={mainTab} onValueChange={setMainTab}>
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="warranties" className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4" />
            {t('warranty.warranties')} ({filteredWarranties.length})
          </TabsTrigger>
          <TabsTrigger value="claims" className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            {t('warranty.claims')} ({filteredClaims.length})
          </TabsTrigger>
        </TabsList>

        {/* Warranties Tab */}
        <TabsContent value="warranties" className="mt-4">
          <Tabs defaultValue="all">
            <TabsList>
              <TabsTrigger value="all">
                {t('warranty.all')} ({filteredWarranties.length})
              </TabsTrigger>
              <TabsTrigger value="active">
                {t('warranty.active')} ({activeWarranties.length})
              </TabsTrigger>
              <TabsTrigger value="expiring">
                {t('warranty.expiring')} ({expiringWarranties.length})
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
        </TabsContent>

        {/* Claims Tab */}
        <TabsContent value="claims" className="mt-4">
          <Tabs defaultValue="all">
            <TabsList>
              <TabsTrigger value="all">
                {t('warranty.all')} ({filteredClaims.length})
              </TabsTrigger>
              <TabsTrigger value="pending">
                {t('warranty.pending')} ({pendingClaims.length})
              </TabsTrigger>
              <TabsTrigger value="resolved">
                {t('warranty.resolved')} ({resolvedClaims.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-4">
              {renderClaimList(filteredClaims)}
            </TabsContent>

            <TabsContent value="pending" className="mt-4">
              {renderClaimList(pendingClaims)}
            </TabsContent>

            <TabsContent value="resolved" className="mt-4">
              {renderClaimList(resolvedClaims)}
            </TabsContent>
          </Tabs>
        </TabsContent>
      </Tabs>

      {/* Print Dialog with Share Options */}
      <Dialog open={printDialogOpen} onOpenChange={setPrintDialogOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5" />
              {t('warranty.warrantyCard')}
            </DialogTitle>
          </DialogHeader>

          {selectedWarranty && (
            <WarrantyDialogContent
              warranty={selectedWarranty}
              onClose={() => setPrintDialogOpen(false)}
              onPrint={printWarrantyCard}
              printRef={printRef}
              t={t}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Claim Dialog */}
      <WarrantyClaimDialog
        open={claimDialogOpen}
        onOpenChange={setClaimDialogOpen}
        warranty={selectedClaimWarranty || undefined}
        existingClaim={editingClaim || undefined}
        onSave={handleSaveClaim}
      />
    </motion.div>
  );
}