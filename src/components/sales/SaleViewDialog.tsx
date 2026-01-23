import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Sale } from '@/hooks/useSales';
import { bn, formatBDT, formatDateBn } from '@/lib/constants';
import { Printer, Download, Receipt } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface SaleViewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sale: Sale | null;
}

export function SaleViewDialog({ open, onOpenChange, sale }: SaleViewDialogProps) {
  if (!sale) return null;

  const getStatusBadge = (status: Sale['paymentStatus']) => {
    switch (status) {
      case 'paid':
        return <Badge className="badge-success">পরিশোধিত</Badge>;
      case 'partial':
        return <Badge className="badge-warning">আংশিক</Badge>;
      case 'due':
        return <Badge variant="destructive">বাকি</Badge>;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Receipt className="h-5 w-5" />
              <span>{sale.invoiceNumber}</span>
              {getStatusBadge(sale.paymentStatus)}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="gap-2">
                <Printer className="h-4 w-4" />
                প্রিন্ট
              </Button>
              <Button variant="outline" size="sm" className="gap-2">
                <Download className="h-4 w-4" />
                PDF
              </Button>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Customer Info */}
          <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
            <div>
              <p className="text-sm text-muted-foreground">গ্রাহক</p>
              <p className="font-medium">{sale.customerName || 'ওয়াক-ইন কাস্টমার'}</p>
              {sale.customerPhone && (
                <p className="text-sm text-muted-foreground">{sale.customerPhone}</p>
              )}
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">তারিখ</p>
              <p className="font-medium">{formatDateBn(sale.saleDate)}</p>
            </div>
          </div>

          {/* Items Table */}
          <div>
            <h3 className="font-medium mb-3">পণ্য তালিকা</h3>
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>পণ্য</TableHead>
                    <TableHead className="text-center">পরিমাণ</TableHead>
                    <TableHead className="text-right">মূল্য</TableHead>
                    <TableHead className="text-right">ছাড়</TableHead>
                    <TableHead className="text-right">মোট</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sale.items.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{item.productName}</p>
                          <p className="text-xs text-muted-foreground">{item.sku}</p>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">{item.quantity}</TableCell>
                      <TableCell className="text-right">{formatBDT(item.unitPrice)}</TableCell>
                      <TableCell className="text-right">
                        {item.discount > 0 ? formatBDT(item.discount) : '-'}
                      </TableCell>
                      <TableCell className="text-right font-medium">{formatBDT(item.total)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Totals */}
          <div className="space-y-2 p-4 bg-muted/50 rounded-lg">
            <div className="flex justify-between">
              <span className="text-muted-foreground">{bn.sales.subtotal}</span>
              <span>{formatBDT(sale.subtotal)}</span>
            </div>
            {sale.discount > 0 && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">{bn.sales.discount}</span>
                <span className="text-destructive">-{formatBDT(sale.discount)}</span>
              </div>
            )}
            {sale.tax > 0 && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">{bn.sales.vat}</span>
                <span>{formatBDT(sale.tax)}</span>
              </div>
            )}
            <div className="flex justify-between text-lg font-bold pt-2 border-t">
              <span>{bn.sales.grandTotal}</span>
              <span className="text-primary">{formatBDT(sale.total)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">{bn.sales.paidAmount}</span>
              <span className="text-success">{formatBDT(sale.paidAmount)}</span>
            </div>
            {sale.dueAmount > 0 && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">{bn.sales.dueAmount}</span>
                <span className="text-destructive font-medium">{formatBDT(sale.dueAmount)}</span>
              </div>
            )}
          </div>

          {/* Notes */}
          {sale.notes && (
            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">{bn.sales.notes}</p>
              <p>{sale.notes}</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
