import { Eye, Trash2, ShoppingCart, Calendar, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { formatBDT, bn, formatDateBn } from '@/lib/constants';
import type { Purchase } from '@/hooks/usePurchases';

interface PurchaseTableProps {
  purchases: Purchase[];
  onView: (purchase: Purchase) => void;
  onDelete: (id: string) => void;
}

const statusConfig = {
  paid: { label: 'পরিশোধিত', variant: 'default' as const, className: 'bg-green-100 text-green-800 hover:bg-green-100' },
  partial: { label: 'আংশিক', variant: 'secondary' as const, className: 'bg-orange-100 text-orange-800 hover:bg-orange-100' },
  due: { label: 'বাকি', variant: 'destructive' as const, className: '' },
};

export function PurchaseTable({
  purchases,
  onView,
  onDelete,
}: PurchaseTableProps) {
  if (purchases.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
          <ShoppingCart className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-medium">{bn.common.noData}</h3>
        <p className="text-muted-foreground mt-1">
          এখনো কোন ক্রয় রেকর্ড নেই
        </p>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="rounded-lg border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>{bn.purchases.invoiceNo}</TableHead>
              <TableHead>{bn.purchases.supplier}</TableHead>
              <TableHead className="hidden md:table-cell">{bn.purchases.date}</TableHead>
              <TableHead className="text-right">{bn.purchases.total}</TableHead>
              <TableHead className="text-right">{bn.purchases.due}</TableHead>
              <TableHead className="text-center">{bn.common.status}</TableHead>
              <TableHead className="text-right w-[100px]">{bn.common.actions}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {purchases.map((purchase) => {
              const status = statusConfig[purchase.payment_status];
              return (
                <TableRow key={purchase.id} className="group">
                  <TableCell>
                    <div className="font-medium font-mono">
                      {purchase.invoice_number || '-'}
                    </div>
                    <div className="text-xs text-muted-foreground md:hidden flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {formatDateBn(purchase.purchase_date)}
                    </div>
                  </TableCell>
                  <TableCell>
                    {purchase.supplier_name ? (
                      <div className="flex items-center gap-1">
                        <Building2 className="h-3 w-3 text-muted-foreground" />
                        {purchase.supplier_name}
                      </div>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {formatDateBn(purchase.purchase_date)}
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    {formatBDT(purchase.total)}
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    {purchase.due_amount > 0 ? (
                      <span className="text-destructive">{formatBDT(purchase.due_amount)}</span>
                    ) : (
                      <span className="text-muted-foreground">৳ ০</span>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge className={status.className} variant={status.variant}>
                      {status.label}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => onView(purchase)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>{bn.common.view}</TooltipContent>
                      </Tooltip>

                      <AlertDialog>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-destructive hover:text-destructive"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                          </TooltipTrigger>
                          <TooltipContent>{bn.common.delete}</TooltipContent>
                        </Tooltip>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>ক্রয় রেকর্ড মুছে ফেলুন?</AlertDialogTitle>
                            <AlertDialogDescription>
                              আপনি কি নিশ্চিত যে এই ক্রয় রেকর্ড মুছে ফেলতে চান? 
                              এই কাজটি পূর্বাবস্থায় ফেরানো যাবে না।
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>{bn.common.cancel}</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => onDelete(purchase.id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              {bn.common.delete}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </TooltipProvider>
  );
}
