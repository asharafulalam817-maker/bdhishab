import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Calendar, Edit, Package, CheckCircle2, Clock, XCircle } from 'lucide-react';
import { formatDateBn } from '@/lib/constants';
import type { WarrantyClaim } from './WarrantyClaimDialog';

interface WarrantyClaimCardProps {
  claim: WarrantyClaim;
  onEdit?: (claim: WarrantyClaim) => void;
}

export function WarrantyClaimCard({ claim, onEdit }: WarrantyClaimCardProps) {
  const getStatusBadge = () => {
    switch (claim.status) {
      case 'pending':
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
            <Clock className="h-3 w-3 mr-1" />
            অপেক্ষমাণ
          </Badge>
        );
      case 'in_progress':
        return (
          <Badge className="bg-blue-600">
            <AlertTriangle className="h-3 w-3 mr-1" />
            প্রক্রিয়াধীন
          </Badge>
        );
      case 'resolved':
        return (
          <Badge className="bg-green-600">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            সমাধান হয়েছে
          </Badge>
        );
      case 'rejected':
        return (
          <Badge variant="destructive">
            <XCircle className="h-3 w-3 mr-1" />
            প্রত্যাখ্যাত
          </Badge>
        );
      default:
        return <Badge variant="secondary">{claim.status}</Badge>;
    }
  };

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Header */}
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2 flex-wrap">
              <Package className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <span className="font-semibold">{claim.warrantyInfo?.product}</span>
              {getStatusBadge()}
            </div>
            {onEdit && (
              <Button variant="ghost" size="sm" onClick={() => onEdit(claim)}>
                <Edit className="h-4 w-4" />
              </Button>
            )}
          </div>

          {/* Customer & Invoice */}
          <p className="text-sm text-muted-foreground">
            <span className="font-medium">{claim.warrantyInfo?.invoiceNo}</span> • {claim.warrantyInfo?.customer}
          </p>

          {/* Issue Description */}
          <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900">
            <p className="text-sm font-medium text-red-800 dark:text-red-200 flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 flex-shrink-0 mt-0.5" />
              {claim.issueDescription}
            </p>
          </div>

          {/* Action Taken */}
          {claim.actionTaken && (
            <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900">
              <p className="text-xs text-blue-600 dark:text-blue-400 font-medium mb-1">গৃহীত পদক্ষেপ:</p>
              <p className="text-sm text-blue-800 dark:text-blue-200">{claim.actionTaken}</p>
            </div>
          )}

          {/* Resolution */}
          {claim.resolution && (
            <div className="p-3 rounded-lg bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900">
              <p className="text-xs text-green-600 dark:text-green-400 font-medium mb-1">সমাধান:</p>
              <p className="text-sm text-green-800 dark:text-green-200">{claim.resolution}</p>
            </div>
          )}

          {/* Date */}
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Calendar className="h-3 w-3" />
            ক্লেম তারিখ: {formatDateBn(claim.claimDate)}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
