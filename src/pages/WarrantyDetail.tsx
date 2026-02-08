import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, ShieldCheck, Phone, Calendar, User, 
  Package, Printer, AlertTriangle, FileText, Hash
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useLanguage } from '@/contexts/LanguageContext';
import { format, differenceInDays } from 'date-fns';
import { bn as bnLocale, enUS } from 'date-fns/locale';
import { WarrantyQRCode } from '@/components/warranty/WarrantyQRCode';

// Demo data
const demoWarranties = [
  { 
    id: '1', 
    invoiceNo: 'INV-202501-001', 
    product: 'স্যামসাং গ্যালাক্সি A54', 
    customer: 'মোহাম্মদ করিম', 
    phone: '01712345678', 
    startDate: '2025-01-15', 
    expiryDate: '2026-01-15', 
    serialNumber: 'SM-A546BZKD', 
    status: 'active',
    warrantyType: 'warranty',
    warrantyDuration: 12,
    warrantyUnit: 'months'
  },
  { 
    id: '2', 
    invoiceNo: 'INV-202501-002', 
    product: 'JBL ব্লুটুথ স্পিকার', 
    customer: 'ফাতেমা বেগম', 
    phone: '01812345678', 
    startDate: '2025-01-10', 
    expiryDate: '2026-01-10', 
    serialNumber: 'JBL-FLIP6-2025', 
    status: 'active',
    warrantyType: 'warranty',
    warrantyDuration: 12,
    warrantyUnit: 'months'
  },
  { 
    id: '3', 
    invoiceNo: 'INV-202412-015', 
    product: 'শাওমি পাওয়ার ব্যাংক', 
    customer: 'রহিম উদ্দিন', 
    phone: '01912345678', 
    startDate: '2024-12-01', 
    expiryDate: '2025-06-01', 
    serialNumber: 'MI-PB20K-001', 
    status: 'expiring',
    warrantyType: 'warranty',
    warrantyDuration: 6,
    warrantyUnit: 'months'
  },
];

const demoClaims = [
  {
    id: 'claim-1',
    claimDate: '2025-01-20',
    issue: 'ডিসপ্লে ঠিকমতো কাজ করছে না',
    action: 'সার্ভিস সেন্টারে পাঠানো হয়েছে',
    status: 'in_progress',
  },
];

export default function WarrantyDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const dateLocale = language === 'bn' ? bnLocale : enUS;

  const warranty = demoWarranties.find(w => w.id === id);

  if (!warranty) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <ShieldCheck className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium">{t('common.noData')}</h3>
        <Button variant="outline" onClick={() => navigate('/warranty')} className="mt-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          {t('common.back')}
        </Button>
      </div>
    );
  }

  const daysRemaining = differenceInDays(new Date(warranty.expiryDate), new Date());

  const getStatusBadge = () => {
    switch (warranty.status) {
      case 'active':
        return <Badge className="bg-green-600">{t('warranty.active')}</Badge>;
      case 'expiring':
        return <Badge variant="destructive" className="bg-yellow-600">{t('warranty.expiring')}</Badge>;
      case 'expired':
        return <Badge variant="destructive">{t('warranty.expired')}</Badge>;
      default:
        return <Badge variant="secondary">{warranty.status}</Badge>;
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="space-y-6 p-4 md:p-6"
    >
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/warranty')}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <ShieldCheck className="h-6 w-6" />
            {t('warranty.warrantyDetails')}
          </h1>
          <p className="text-muted-foreground">{warranty.invoiceNo}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Printer className="h-4 w-4 mr-2" />
            {t('warranty.print')}
          </Button>
          {warranty.status !== 'expired' && (
            <Button variant="destructive">
              <AlertTriangle className="h-4 w-4 mr-2" />
              {t('warranty.addClaim')}
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Product Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Package className="h-5 w-5" />
                {t('warranty.productInfo')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">{t('products.name')}</span>
                <span className="font-medium">{warranty.product}</span>
              </div>
              {warranty.serialNumber && (
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">{t('warranty.serialNumber')}</span>
                  <span className="font-mono">{warranty.serialNumber}</span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">{t('warranty.warrantyType')}</span>
                <Badge variant="outline">
                  {warranty.warrantyType === 'warranty' ? t('warranty.warranty') : t('warranty.guarantee')}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">{t('warranty.duration')}</span>
                <span>{warranty.warrantyDuration} {t(`warranty.${warranty.warrantyUnit}`)}</span>
              </div>
            </CardContent>
          </Card>

          {/* Customer Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <User className="h-5 w-5" />
                {t('customers.title')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">{t('customers.name')}</span>
                <span 
                  className="font-medium text-primary cursor-pointer hover:underline"
                  onClick={() => navigate('/customers/1')}
                >
                  {warranty.customer}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">{t('customers.phone')}</span>
                <a href={`tel:${warranty.phone}`} className="text-primary hover:underline flex items-center gap-1">
                  <Phone className="h-4 w-4" />
                  {warranty.phone}
                </a>
              </div>
            </CardContent>
          </Card>

          {/* Warranty Period */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                {t('warranty.period')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">{t('warranty.startDate')}</span>
                <span>{format(new Date(warranty.startDate), 'PPP', { locale: dateLocale })}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">{t('warranty.expiryDate')}</span>
                <span>{format(new Date(warranty.expiryDate), 'PPP', { locale: dateLocale })}</span>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">{t('warranty.status')}</span>
                {getStatusBadge()}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">{t('warranty.daysRemaining')}</span>
                <span className={`font-bold ${daysRemaining < 30 ? 'text-red-600' : 'text-green-600'}`}>
                  {daysRemaining > 0 ? `${daysRemaining} ${t('warranty.days')}` : t('warranty.expired')}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Claims History */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                {t('warranty.claimsHistory')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {demoClaims.length > 0 ? (
                <div className="space-y-3">
                  {demoClaims.map((claim) => (
                    <div key={claim.id} className="p-3 rounded-lg bg-muted/50">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-muted-foreground">
                          {format(new Date(claim.claimDate), 'PP', { locale: dateLocale })}
                        </span>
                        <Badge variant={claim.status === 'resolved' ? 'default' : 'secondary'}>
                          {claim.status === 'in_progress' ? t('warranty.inProgress') : 
                           claim.status === 'resolved' ? t('warranty.resolved') : t('warranty.pending')}
                        </Badge>
                      </div>
                      <p className="font-medium">{claim.issue}</p>
                      {claim.action && (
                        <p className="text-sm text-muted-foreground mt-1">{claim.action}</p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-4">{t('warranty.noClaims')}</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - QR Code & Quick Info */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{t('warranty.warrantyCard')}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <WarrantyQRCode warranty={warranty} size={200} />
              <p className="text-sm text-muted-foreground mt-4 text-center">
                {t('warranty.scanQRCode')}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{t('warranty.quickInfo')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{warranty.invoiceNo}</span>
              </div>
              <div className="flex items-center gap-2">
                <Hash className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-mono">{warranty.serialNumber || '-'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{daysRemaining} {t('warranty.daysLeft')}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  );
}
