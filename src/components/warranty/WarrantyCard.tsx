import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Package, Phone, Calendar, ShieldCheck, Printer, Eye, AlertTriangle } from 'lucide-react';
import { formatDateBn } from '@/lib/constants';
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
  const getStatusBadge = () => {
    switch (warranty.status) {
      case 'active':
        return <Badge className="bg-green-600">সক্রিয়</Badge>;
      case 'expiring':
        return <Badge variant="destructive" className="bg-yellow-600">মেয়াদ শেষ হচ্ছে</Badge>;
      case 'expired':
        return <Badge variant="destructive">মেয়াদ উত্তীর্ণ</Badge>;
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
                <span className="font-semibold">{warranty.product}</span>
                {getStatusBadge()}
              </div>
            </div>

            <p className="text-sm text-muted-foreground">
              <span className="font-medium">{warranty.invoiceNo}</span> • {warranty.customer}
            </p>

            {warranty.serialNumber && (
              <p className="text-sm text-muted-foreground">
                সিরিয়াল: <span className="font-mono">{warranty.serialNumber}</span>
              </p>
            )}

            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Phone className="h-3 w-3" />
                {warranty.phone}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                শুরু: {formatDateBn(warranty.startDate)}
              </span>
              <span className="flex items-center gap-1">
                <ShieldCheck className="h-3 w-3" />
                মেয়াদ: {formatDateBn(warranty.expiryDate)}
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
                  বিস্তারিত
                </Button>
              )}
              {onPrint && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onPrint(warranty)}
                >
                  <Printer className="h-4 w-4 mr-1" />
                  প্রিন্ট
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
                  ক্লেম
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
