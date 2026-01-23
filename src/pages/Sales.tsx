import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  Eye,
  Receipt,
  Calendar,
  MoreHorizontal,
  Printer,
  Download,
  Trash2,
  Filter,
  CreditCard,
} from 'lucide-react';
import { formatBDT, formatDateBn, formatNumberBn } from '@/lib/constants';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useSales, Sale } from '@/hooks/useSales';
import { useBalance } from '@/hooks/useBalance';
import { SaleViewDialog } from '@/components/sales/SaleViewDialog';
import { DuePaymentDialog } from '@/components/sales/DuePaymentDialog';
import { toast } from 'sonner';

export default function Sales() {
  const { t } = useLanguage();
  const {
    filteredSales,
    stats,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    recordDuePayment,
    deleteSale,
  } = useSales();

  const { addSaleToBalance, refreshBalance } = useBalance();

  const [isViewOpen, setIsViewOpen] = useState(false);
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [paymentSale, setPaymentSale] = useState<Sale | null>(null);

  const handleViewSale = (sale: Sale) => {
    setSelectedSale(sale);
    setIsViewOpen(true);
  };

  const handlePayDue = (sale: Sale) => {
    setPaymentSale(sale);
    setIsPaymentOpen(true);
  };

  const handleDuePayment = async (saleId: string, amount: number, paymentMethod: string, addToBalance: boolean) => {
    // Update the sale
    recordDuePayment(saleId, amount);
    
    // Add to store balance if requested
    if (addToBalance) {
      await addSaleToBalance(amount, saleId);
      await refreshBalance();
    }
    
    toast.success(`৳${amount.toLocaleString('bn-BD')} ${t('sales.duePaymentSuccess')}`);
  };

  const handleDeleteSale = (sale: Sale) => {
    deleteSale(sale.id);
    toast.success(`${t('invoices.invoiceNo')} ${sale.invoiceNumber} ${t('sales.invoiceDeleted')}`);
  };

  const handlePrint = (sale: Sale) => {
    toast.success(`${t('invoices.invoiceNo')} ${sale.invoiceNumber} ${t('sales.printing')}...`);
  };

  const getStatusBadge = (status: Sale['paymentStatus']) => {
    switch (status) {
      case 'paid':
        return <Badge className="badge-success">{t('sales.paid')}</Badge>;
      case 'partial':
        return <Badge className="badge-warning">{t('sales.partial')}</Badge>;
      case 'due':
        return <Badge variant="destructive">{t('common.due')}</Badge>;
    }
  };

  const getPaymentMethodLabel = (method: Sale['paymentMethod']) => {
    const labels: Record<Sale['paymentMethod'], string> = {
      cash: t('pos.cash'),
      bkash: t('pos.bkash'),
      nagad: t('pos.nagad'),
      bank: t('pos.bank'),
      due: t('pos.due'),
      mixed: t('sales.partial'),
    };
    return labels[method];
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title flex items-center gap-2">
            <Receipt className="h-6 w-6" />
            {t('sales.title')}
          </h1>
          <p className="text-muted-foreground">{t('sales.description')}</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">{t('sales.todaySales')}</p>
              <p className="text-2xl font-bold text-primary">{formatBDT(stats.todayTotal)}</p>
              <p className="text-xs text-muted-foreground">{formatNumberBn(stats.todaySalesCount)} {t('sales.invoices')}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">{t('sales.monthlySales')}</p>
              <p className="text-2xl font-bold">{formatBDT(stats.monthTotal)}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">{t('sales.totalDue')}</p>
              <p className="text-2xl font-bold text-destructive">{formatBDT(stats.totalDue)}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">{t('sales.totalInvoices')}</p>
              <p className="text-2xl font-bold">{formatNumberBn(stats.totalSales)}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder={t('sales.searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as any)}>
              <SelectTrigger className="w-full sm:w-[160px]">
                <SelectValue placeholder={t('common.status')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('sales.allStatus')}</SelectItem>
                <SelectItem value="paid">{t('sales.paid')}</SelectItem>
                <SelectItem value="partial">{t('sales.partial')}</SelectItem>
                <SelectItem value="due">{t('common.due')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Sales Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('invoices.invoiceNo')}</TableHead>
                  <TableHead>{t('invoices.date')}</TableHead>
                  <TableHead>{t('invoices.customer')}</TableHead>
                  <TableHead className="text-right">{t('invoices.total')}</TableHead>
                  <TableHead className="text-right">{t('pos.paidAmount')}</TableHead>
                  <TableHead className="text-right">{t('pos.dueAmount')}</TableHead>
                  <TableHead>{t('common.status')}</TableHead>
                  <TableHead className="text-right">{t('common.actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSales.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      {t('sales.noSales')}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredSales.map((sale, index) => (
                    <motion.tr
                      key={sale.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.03 }}
                      className="group"
                    >
                      <TableCell className="font-mono font-medium">{sale.invoiceNumber}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          {formatDateBn(sale.saleDate)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{sale.customerName || t('sales.walkIn')}</p>
                          {sale.customerPhone && (
                            <p className="text-xs text-muted-foreground">{sale.customerPhone}</p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-medium">{formatBDT(sale.total)}</TableCell>
                      <TableCell className="text-right text-success">{formatBDT(sale.paidAmount)}</TableCell>
                      <TableCell className="text-right">
                        {sale.dueAmount > 0 ? (
                          <span className="text-destructive font-medium">{formatBDT(sale.dueAmount)}</span>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>{getStatusBadge(sale.paymentStatus)}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleViewSale(sale)} className="gap-2">
                              <Eye className="h-4 w-4" />
                              {t('common.view')}
                            </DropdownMenuItem>
                            {sale.dueAmount > 0 && (
                              <DropdownMenuItem onClick={() => handlePayDue(sale)} className="gap-2 text-success">
                                <CreditCard className="h-4 w-4" />
                                {t('sales.payDue')}
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem onClick={() => handlePrint(sale)} className="gap-2">
                              <Printer className="h-4 w-4" />
                              {t('sales.print')}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleDeleteSale(sale)} className="gap-2 text-destructive">
                              <Trash2 className="h-4 w-4" />
                              {t('common.delete')}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </motion.tr>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* View Dialog */}
      {/* View Dialog */}
      <SaleViewDialog
        open={isViewOpen}
        onOpenChange={setIsViewOpen}
        sale={selectedSale}
      />

      {/* Due Payment Dialog */}
      <DuePaymentDialog
        open={isPaymentOpen}
        onOpenChange={setIsPaymentOpen}
        sale={paymentSale}
        onPayment={handleDuePayment}
      />
    </motion.div>
  );
}
