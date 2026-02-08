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
import { bn, enUS } from 'date-fns/locale';
import {
  PackagePlus,
  PackageMinus,
  Settings2,
  ShoppingCart,
  Truck,
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface StockLedgerTableProps {
  entries: StockLedgerEntry[];
}

export function StockLedgerTable({ entries }: StockLedgerTableProps) {
  const { t, language } = useLanguage();

  const transactionConfig: Record<
    string,
    { label: string; icon: React.ReactNode; variant: 'default' | 'secondary' | 'destructive' | 'outline' }
  > = {
    stock_in: {
      label: t('stock.typeStockIn'),
      icon: <PackagePlus className="h-3 w-3" />,
      variant: 'default',
    },
    stock_out: {
      label: t('stock.typeStockOut'),
      icon: <PackageMinus className="h-3 w-3" />,
      variant: 'destructive',
    },
    adjustment: {
      label: t('stock.typeAdjustment'),
      icon: <Settings2 className="h-3 w-3" />,
      variant: 'secondary',
    },
    sale: {
      label: t('stock.typeSale'),
      icon: <ShoppingCart className="h-3 w-3" />,
      variant: 'destructive',
    },
    purchase: {
      label: t('stock.typePurchase'),
      icon: <Truck className="h-3 w-3" />,
      variant: 'default',
    },
  };

  const dateLocale = language === 'bn' ? bn : enUS;

  if (entries.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        {t('stock.ledger.noTransactions')}
      </div>
    );
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead>{t('stock.ledger.dateTime')}</TableHead>
            <TableHead>{t('stock.ledger.product')}</TableHead>
            <TableHead className="text-center">{t('stock.ledger.type')}</TableHead>
            <TableHead className="text-right">{t('stock.ledger.quantity')}</TableHead>
            <TableHead className="text-right">{t('stock.ledger.balance')}</TableHead>
            <TableHead>{t('stock.ledger.notes')}</TableHead>
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
                  {format(new Date(entry.createdAt), 'dd MMM yyyy', { locale: dateLocale })}
                  <br />
                  <span className="text-muted-foreground text-xs">
                    {format(new Date(entry.createdAt), 'hh:mm a', { locale: dateLocale })}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="font-medium">{entry.productName}</div>
                  {(entry.batchNumber || entry.serialNumber) && (
                    <div className="text-xs text-muted-foreground">
                      {entry.batchNumber && `${t('stock.ledger.batch')}: ${entry.batchNumber}`}
                      {entry.batchNumber && entry.serialNumber && ' | '}
                      {entry.serialNumber && `${t('stock.ledger.serial')}: ${entry.serialNumber}`}
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
