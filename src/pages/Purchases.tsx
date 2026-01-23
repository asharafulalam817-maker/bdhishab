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
import { formatBDT, bn, formatNumberBn } from '@/lib/constants';
import { toast } from 'sonner';

export default function Purchases() {
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
      await deductBalance(data.paid_amount, `ক্রয় পেমেন্ট - ${purchase.invoice_number}`);
      await refreshBalance();
    }
    
    toast.success('নতুন ক্রয় সংরক্ষণ হয়েছে');
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
    toast.success('ক্রয় রেকর্ড মুছে ফেলা হয়েছে');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{bn.purchases.title}</h1>
          <p className="text-muted-foreground">
            মোট {formatNumberBn(allPurchases.length)} টি ক্রয় রেকর্ড
          </p>
        </div>
        <Button onClick={handleAddPurchase} className="gap-2">
          <Plus className="h-4 w-4" />
          {bn.purchases.addNew}
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
                মোট ক্রয়
              </CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatNumberBn(allPurchases.length)}
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
                মোট ক্রয় মূল্য
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">
                {formatBDT(totalPurchases)}
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
                মোট বকেয়া (সরবরাহকারীদের)
              </CardTitle>
              <Wallet className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">
                {formatBDT(totalDue)}
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
            placeholder="চালান নং বা সরবরাহকারী দিয়ে খুঁজুন..."
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
            <SelectValue placeholder="ফিল্টার" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">সব ক্রয়</SelectItem>
            <SelectItem value="paid">পরিশোধিত</SelectItem>
            <SelectItem value="partial">আংশিক পরিশোধ</SelectItem>
            <SelectItem value="due">বাকি আছে</SelectItem>
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
  );
}
