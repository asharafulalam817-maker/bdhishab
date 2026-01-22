import { Edit, Trash2, Wallet, Phone, MapPin, Building2 } from 'lucide-react';
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
import { formatBDT, bn } from '@/lib/constants';
import type { Supplier } from '@/hooks/useSuppliers';

interface SupplierTableProps {
  suppliers: Supplier[];
  onEdit: (supplier: Supplier) => void;
  onDelete: (id: string) => void;
  onAdjustDue: (supplier: Supplier) => void;
}

export function SupplierTable({
  suppliers,
  onEdit,
  onDelete,
  onAdjustDue,
}: SupplierTableProps) {
  if (suppliers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
          <Building2 className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-medium">{bn.common.noData}</h3>
        <p className="text-muted-foreground mt-1">
          এখনো কোন সরবরাহকারী যোগ করা হয়নি
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
              <TableHead className="w-[200px]">{bn.suppliers.name}</TableHead>
              <TableHead>{bn.suppliers.phone}</TableHead>
              <TableHead className="hidden md:table-cell">
                {bn.suppliers.address}
              </TableHead>
              <TableHead className="text-right">{bn.suppliers.totalDue}</TableHead>
              <TableHead className="text-right w-[140px]">
                {bn.common.actions}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {suppliers.map((supplier) => (
              <TableRow key={supplier.id} className="group">
                <TableCell>
                  <div className="font-medium">{supplier.name}</div>
                  {supplier.email && (
                    <div className="text-xs text-muted-foreground">
                      {supplier.email}
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  {supplier.phone ? (
                    <a
                      href={`tel:${supplier.phone}`}
                      className="text-primary hover:underline flex items-center gap-1"
                    >
                      <Phone className="h-3 w-3" />
                      {supplier.phone}
                    </a>
                  ) : (
                    <span className="text-muted-foreground">-</span>
                  )}
                </TableCell>
                <TableCell className="hidden md:table-cell max-w-[200px] truncate">
                  {supplier.address ? (
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <MapPin className="h-3 w-3 flex-shrink-0" />
                      <span className="truncate">{supplier.address}</span>
                    </span>
                  ) : (
                    <span className="text-muted-foreground">-</span>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  {supplier.due_amount > 0 ? (
                    <Badge variant="destructive" className="font-mono">
                      {formatBDT(supplier.due_amount)}
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="font-mono">
                      ৳ ০
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => onAdjustDue(supplier)}
                        >
                          <Wallet className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>বকেয়া সমন্বয়</TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => onEdit(supplier)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>{bn.common.edit}</TooltipContent>
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
                          <AlertDialogTitle>
                            সরবরাহকারী মুছে ফেলুন?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            আপনি কি নিশ্চিত যে "{supplier.name}" সরবরাহকারীকে মুছে
                            ফেলতে চান? এই কাজটি পূর্বাবস্থায় ফেরানো যাবে না।
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>{bn.common.cancel}</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => onDelete(supplier.id)}
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
            ))}
          </TableBody>
        </Table>
      </div>
    </TooltipProvider>
  );
}
