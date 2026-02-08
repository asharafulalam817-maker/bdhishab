import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, ShoppingCart, Wallet, Filter, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PurchaseTable } from '@/components/purchases/PurchaseTable';
import { SimplePurchaseForm, SimplePurchaseData } from '@/components/purchases/SimplePurchaseForm';
import { PurchaseViewDialog } from '@/components/purchases/PurchaseViewDialog';
import { usePurchases, Purchase } from '@/hooks/usePurchases';
import { useSuppliers } from '@/hooks/useSuppliers';
import { useBalance } from '@/hooks/useBalance';
import { useLanguage } from '@/contexts/LanguageContext';
import { formatBDT, formatNumberBn } from '@/lib/constants';
import { toast } from 'sonner';
import { ReadOnlyGuard } from '@/components/subscription/ReadOnlyGuard';

export default function Purchases() {
  const { t, language } = useLanguage();
  const {
    purchases,
    allPurchases,
    searchQuery,
    setSearchQuery,
    filterStatus,
    setFilterStatus,
    addPurchase,
    deletePurchase,
    totalPurchases,
    totalDue,
    suppliers,
    products,
  } = usePurchases();

  const { suppliers: allSuppliers, adjustDue, addSupplier } = useSuppliers();
  const { balance, deductBalance, refreshBalance } = useBalance();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [selectedPurchase, setSelectedPurchase] = useState<Purchase | null>(null);

  const formatNumber = (num: number) => {
    return language === 'bn' ? formatNumberBn(num) : num.toLocaleString('en-US');
  };

  const formatCurrency = (amount: number) => {
    return language === 'bn' ? formatBDT(amount) : `৳ ${amount.toLocaleString('en-US')}`;
  };

  const handleAddPurchase = () => {
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (data: SimplePurchaseData) => {
    // Convert simple form data to purchase format
    const purchaseFormData = {
      supplier_id: data.supplier_id,
      invoice_number: data.invoice_number,
      purchase_date: data.purchase_date,
      items: [{
        product_id: `new-${Date.now()}`,
        product_name: data.product_name,
        quantity: data.quantity,
        unit_cost: data.purchase_cost,
      }],
      discount: 0,
      paid_amount: data.paid_amount,
      notes: data.notes,
    };

    const purchase = addPurchase(purchaseFormData);
    
    // Update supplier due if there's due amount
    const dueAmount = (data.quantity * data.purchase_cost) - data.paid_amount;
    if (dueAmount > 0 && data.supplier_id) {
      adjustDue(data.supplier_id, dueAmount, 'add');
    }
    
    // Deduct from balance if paid amount exists and option selected
    if (data.paid_amount > 0 && data.deductFromBalance) {
      await deductBalance(data.paid_amount, `${t('purchases.title')} - ${purchase.invoice_number}`);
      await refreshBalance();
    }
    
    toast.success(t('purchases.saved'));
  };

  const handleAddNewSupplier = (supplierData: { name: string; phone: string }) => {
    return addSupplier({
      name: supplierData.name,
      phone: supplierData.phone,
      email: '',
      address: '',
    });
  };

  const handleViewPurchase = (purchase: Purchase) => {
    setSelectedPurchase(purchase);
    setIsViewOpen(true);
  };

  const handleDeletePurchase = (id: string) => {
    deletePurchase(id);
    toast.success(t('purchases.deleted'));
  };

  return (
    <ReadOnlyGuard featureName={t('purchases.addNew')}>
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t('purchases.title')}</h1>
          <p className="text-muted-foreground">
            {t('purchases.totalCount').replace('{count}', formatNumber(allPurchases.length))}
          </p>
        </div>
        <Button onClick={handleAddPurchase} className="gap-2">
          <Plus className="h-4 w-4" />
          {t('purchases.addNew')}
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {t('purchases.totalPurchases')}
              </CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatNumber(allPurchases.length)}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {t('purchases.totalPurchaseValue')}
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">
                {formatCurrency(totalPurchases)}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {t('purchases.totalDue')}
              </CardTitle>
              <Wallet className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">
                {formatCurrency(totalDue)}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t('purchases.searchPlaceholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select
          value={filterStatus}
          onValueChange={(v) => setFilterStatus(v as 'all' | 'paid' | 'partial' | 'due')}
        >
          <SelectTrigger className="w-full sm:w-[180px]">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder={t('common.filter')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('purchases.filterAll')}</SelectItem>
            <SelectItem value="paid">{t('purchases.filterPaid')}</SelectItem>
            <SelectItem value="partial">{t('purchases.filterPartial')}</SelectItem>
            <SelectItem value="due">{t('purchases.filterDue')}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Purchase Table */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <PurchaseTable
          purchases={purchases}
          onView={handleViewPurchase}
          onDelete={handleDeletePurchase}
        />
      </motion.div>

      {/* Dialogs */}
      <SimplePurchaseForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        onSubmit={handleFormSubmit}
        suppliers={allSuppliers}
        currentBalance={balance?.current_balance || 0}
        onAddNewSupplier={handleAddNewSupplier}
      />

      <PurchaseViewDialog
        open={isViewOpen}
        onOpenChange={setIsViewOpen}
        purchase={selectedPurchase}
      />
    </div>
    </ReadOnlyGuard>
  );
}