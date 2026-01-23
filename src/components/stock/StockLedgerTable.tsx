import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { StockLedgerEntry } from '@/hooks/useStockManagement';
import { format } from 'date-fns';
import { bn } from 'date-fns/locale';
import {
  PackagePlus,
  PackageMinus,
  Settings2,
  ShoppingCart,
  Truck,
} from 'lucide-react';

interface StockLedgerTableProps {
  entries: StockLedgerEntry[];
}

const transactionConfig: Record<
  string,
  { label: string; icon: React.ReactNode; variant: 'default' | 'secondary' | 'destructive' | 'outline' }
> = {
  stock_in: {
    label: 'স্টক ইন',
    icon: <PackagePlus className="h-3 w-3" />,
    variant: 'default',
  },
  stock_out: {
    label: 'স্টক আউট',
    icon: <PackageMinus className="h-3 w-3" />,
    variant: 'destructive',
  },
  adjustment: {
    label: 'এডজাস্টমেন্ট',
    icon: <Settings2 className="h-3 w-3" />,
    variant: 'secondary',
  },
  sale: {
    label: 'বিক্রয়',
    icon: <ShoppingCart className="h-3 w-3" />,
    variant: 'destructive',
  },
  purchase: {
    label: 'ক্রয়',
    icon: <Truck className="h-3 w-3" />,
    variant: 'default',
  },
};

export function StockLedgerTable({ entries }: StockLedgerTableProps) {
  if (entries.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        কোনো লেনদেন পাওয়া যায়নি
      </div>
    );
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead>তারিখ ও সময়</TableHead>
            <TableHead>পণ্য</TableHead>
            <TableHead className="text-center">ধরন</TableHead>
            <TableHead className="text-right">পরিমাণ</TableHead>
            <TableHead className="text-right">ব্যালেন্স</TableHead>
            <TableHead>নোট</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {entries.map((entry) => {
            const config = transactionConfig[entry.transactionType] || {
              label: entry.transactionType,
              icon: null,
              variant: 'outline' as const,
            };

            return (
              <TableRow key={entry.id}>
                <TableCell className="text-sm">
                  {format(new Date(entry.createdAt), 'dd MMM yyyy', { locale: bn })}
                  <br />
                  <span className="text-muted-foreground text-xs">
                    {format(new Date(entry.createdAt), 'hh:mm a', { locale: bn })}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="font-medium">{entry.productName}</div>
                  {(entry.batchNumber || entry.serialNumber) && (
                    <div className="text-xs text-muted-foreground">
                      {entry.batchNumber && `ব্যাচ: ${entry.batchNumber}`}
                      {entry.batchNumber && entry.serialNumber && ' | '}
                      {entry.serialNumber && `সিরিয়াল: ${entry.serialNumber}`}
                    </div>
                  )}
                </TableCell>
                <TableCell className="text-center">
                  <Badge variant={config.variant} className="gap-1">
                    {config.icon}
                    {config.label}
                  </Badge>
                </TableCell>
                <TableCell className="text-right font-medium">
                  <span
                    className={
                      entry.quantity > 0
                        ? 'text-green-600'
                        : entry.quantity < 0
                        ? 'text-red-600'
                        : ''
                    }
                  >
                    {entry.quantity > 0 ? '+' : ''}
                    {entry.quantity}
                  </span>
                </TableCell>
                <TableCell className="text-right font-semibold">
                  {entry.balanceAfter}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground max-w-[200px] truncate">
                  {entry.notes || '-'}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
