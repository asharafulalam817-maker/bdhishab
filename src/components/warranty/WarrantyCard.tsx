import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Package, Phone, Calendar, ShieldCheck, Printer, Eye, AlertTriangle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { format } from 'date-fns';
import { bn as bnLocale, enUS } from 'date-fns/locale';
import { WarrantyQRCode } from './WarrantyQRCode';

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

interface WarrantyCardProps {
  warranty: WarrantyData;
  onView?: (warranty: WarrantyData) => void;
  onPrint?: (warranty: WarrantyData) => void;
  onAddClaim?: (warranty: WarrantyData) => void;
}

export function WarrantyCard({ warranty, onView, onPrint, onAddClaim }: WarrantyCardProps) {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const dateLocale = language === 'bn' ? bnLocale : enUS;

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
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* QR Code Section */}
          <div className="flex-shrink-0 flex justify-center sm:justify-start">
            <WarrantyQRCode warranty={warranty} size={100} />
          </div>

          {/* Warranty Details */}
          <div className="flex-1 space-y-2">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2 flex-wrap">
                <Package className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <span 
                  className="font-semibold text-primary cursor-pointer hover:underline"
                  onClick={() => navigate(`/warranty/${warranty.id}`)}
                >
                  {warranty.product}
                </span>
                {getStatusBadge()}
              </div>
            </div>

            <p className="text-sm text-muted-foreground">
              <span className="font-medium">{warranty.invoiceNo}</span> • 
              <span 
                className="text-primary cursor-pointer hover:underline ml-1"
                onClick={() => navigate(`/customers/1`)}
              >
                {warranty.customer}
              </span>
            </p>

            {warranty.serialNumber && (
              <p className="text-sm text-muted-foreground">
                {t('warranty.serialNumber')}: <span className="font-mono">{warranty.serialNumber}</span>
              </p>
            )}

            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Phone className="h-3 w-3" />
                {warranty.phone}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {t('warranty.start')}: {format(new Date(warranty.startDate), 'PP', { locale: dateLocale })}
              </span>
              <span className="flex items-center gap-1">
                <ShieldCheck className="h-3 w-3" />
                {t('warranty.expiry')}: {format(new Date(warranty.expiryDate), 'PP', { locale: dateLocale })}
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-2 pt-2">
              {onView && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onView(warranty)}
                >
                  <Eye className="h-4 w-4 mr-1" />
                  {t('warranty.details')}
                </Button>
              )}
              {onPrint && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onPrint(warranty)}
                >
                  <Printer className="h-4 w-4 mr-1" />
                  {t('warranty.print')}
                </Button>
              )}
              {onAddClaim && warranty.status !== 'expired' && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onAddClaim(warranty)}
                  className="text-destructive hover:text-destructive"
                >
                  <AlertTriangle className="h-4 w-4 mr-1" />
                  {t('warranty.claim')}
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
