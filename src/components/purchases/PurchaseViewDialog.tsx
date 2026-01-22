import { X, Building2, Calendar, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';
import { formatBDT, formatDateBn, bn } from '@/lib/constants';
import type { Purchase } from '@/hooks/usePurchases';

interface PurchaseViewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  purchase: Purchase | null;
}

const statusConfig = {
  paid: { label: 'পরিশোধিত', className: 'bg-green-100 text-green-800' },
  partial: { label: 'আংশিক', className: 'bg-orange-100 text-orange-800' },
  due: { label: 'বাকি', className: 'bg-red-100 text-red-800' },
};

export function PurchaseViewDialog({
  open,
  onOpenChange,
  purchase,
}: PurchaseViewDialogProps) {
  if (!purchase) return null;

  const status = statusConfig[purchase.payment_status];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              ক্রয় বিবরণ
            </DialogTitle>
            <Badge className={status.className}>{status.label}</Badge>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          {/* Header Info */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">চালান নং:</span>
              <p className="font-mono font-medium">{purchase.invoice_number || '-'}</p>
            </div>
            <div>
              <span className="text-muted-foreground flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                তারিখ:
              </span>
              <p className="font-medium">{formatDateBn(purchase.purchase_date)}</p>
            </div>
            <div className="col-span-2">
              <span className="text-muted-foreground flex items-center gap-1">
                <Building2 className="h-3 w-3" />
                সরবরাহকারী:
              </span>
              <p className="font-medium">{purchase.supplier_name || 'নির্বাচন করা হয়নি'}</p>
            </div>
          </div>

          <Separator />

          {/* Items Table */}
          <div className="rounded-lg border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead>পণ্য</TableHead>
                  <TableHead className="text-center">পরিমাণ</TableHead>
                  <TableHead className="text-right">একক মূল্য</TableHead>
                  <TableHead className="text-right">মোট</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {purchase.items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.product_name}</TableCell>
                    <TableCell className="text-center">{item.quantity}</TableCell>
                    <TableCell className="text-right font-mono">
                      {formatBDT(item.unit_cost)}
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      {formatBDT(item.total)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Totals */}
          <div className="bg-muted/50 rounded-lg p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">{bn.sales.subtotal}</span>
              <span className="font-mono">{formatBDT(purchase.subtotal)}</span>
            </div>
            {purchase.discount > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{bn.sales.discount}</span>
                <span className="font-mono text-green-600">-{formatBDT(purchase.discount)}</span>
              </div>
            )}
            <Separator />
            <div className="flex justify-between font-bold">
              <span>{bn.sales.grandTotal}</span>
              <span className="font-mono">{formatBDT(purchase.total)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">{bn.sales.paidAmount}</span>
              <span className="font-mono">{formatBDT(purchase.paid_amount)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">{bn.sales.dueAmount}</span>
              <span className={`font-mono font-bold ${purchase.due_amount > 0 ? 'text-destructive' : 'text-green-600'}`}>
                {formatBDT(purchase.due_amount)}
              </span>
            </div>
          </div>

          {/* Notes */}
          {purchase.notes && (
            <div className="text-sm">
              <span className="text-muted-foreground">{bn.sales.notes}:</span>
              <p className="mt-1">{purchase.notes}</p>
            </div>
          )}
        </div>

        <div className="flex justify-end mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            <X className="h-4 w-4 mr-2" />
            বন্ধ করুন
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
