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
} from 'lucide-react';
import { bn, formatBDT, formatDateBn, formatNumberBn } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
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
import { SaleViewDialog } from '@/components/sales/SaleViewDialog';
import { toast } from 'sonner';

export default function Sales() {
  const {
    filteredSales,
    stats,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    deleteSale,
  } = useSales();

  const [isViewOpen, setIsViewOpen] = useState(false);
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);

  const handleViewSale = (sale: Sale) => {
    setSelectedSale(sale);
    setIsViewOpen(true);
  };

  const handleDeleteSale = (sale: Sale) => {
    deleteSale(sale.id);
    toast.success(`চালান ${sale.invoiceNumber} মুছে ফেলা হয়েছে`);
  };

  const handlePrint = (sale: Sale) => {
    toast.success(`চালান ${sale.invoiceNumber} প্রিন্ট হচ্ছে...`);
  };

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

  const getPaymentMethodLabel = (method: Sale['paymentMethod']) => {
    const labels: Record<Sale['paymentMethod'], string> = {
      cash: 'নগদ',
      bkash: 'বিকাশ',
      nagad: 'নগদ',
      bank: 'ব্যাংক',
      due: 'বাকি',
      mixed: 'মিশ্র',
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
            {bn.sales.title}
          </h1>
          <p className="text-muted-foreground">সব বিক্রয় এবং চালান দেখুন</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">আজকের বিক্রয়</p>
              <p className="text-2xl font-bold text-primary">{formatBDT(stats.todayTotal)}</p>
              <p className="text-xs text-muted-foreground">{formatNumberBn(stats.todaySalesCount)} টি চালান</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">এই মাসের বিক্রয়</p>
              <p className="text-2xl font-bold">{formatBDT(stats.monthTotal)}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">মোট বাকি</p>
              <p className="text-2xl font-bold text-destructive">{formatBDT(stats.totalDue)}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">মোট চালান</p>
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
                placeholder="চালান নং, গ্রাহক বা ফোন দিয়ে খুঁজুন..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as any)}>
              <SelectTrigger className="w-full sm:w-[160px]">
                <SelectValue placeholder="স্ট্যাটাস" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">সব স্ট্যাটাস</SelectItem>
                <SelectItem value="paid">পরিশোধিত</SelectItem>
                <SelectItem value="partial">আংশিক</SelectItem>
                <SelectItem value="due">বাকি</SelectItem>
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
                  <TableHead>{bn.invoices.invoiceNo}</TableHead>
                  <TableHead>{bn.invoices.date}</TableHead>
                  <TableHead>{bn.invoices.customer}</TableHead>
                  <TableHead className="text-right">{bn.invoices.total}</TableHead>
                  <TableHead className="text-right">{bn.sales.paidAmount}</TableHead>
                  <TableHead className="text-right">{bn.sales.dueAmount}</TableHead>
                  <TableHead>{bn.common.status}</TableHead>
                  <TableHead className="text-right">{bn.common.actions}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSales.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      কোনো বিক্রয় পাওয়া যায়নি
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
                          <p className="font-medium">{sale.customerName || 'ওয়াক-ইন'}</p>
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
                              {bn.common.view}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handlePrint(sale)} className="gap-2">
                              <Printer className="h-4 w-4" />
                              {bn.invoices.print}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDeleteSale(sale)} className="gap-2 text-destructive">
                              <Trash2 className="h-4 w-4" />
                              {bn.common.delete}
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
      <SaleViewDialog
        open={isViewOpen}
        onOpenChange={setIsViewOpen}
        sale={selectedSale}
      />
    </motion.div>
  );
}
