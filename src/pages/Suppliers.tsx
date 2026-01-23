import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Truck, Wallet, Filter } from 'lucide-react';
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
import { SupplierTable } from '@/components/suppliers/SupplierTable';
import { SupplierFormDialog } from '@/components/suppliers/SupplierFormDialog';
import { SupplierDueDialog } from '@/components/suppliers/SupplierDueDialog';
import { useSuppliers, Supplier, SupplierFormData } from '@/hooks/useSuppliers';
import { useBalance } from '@/hooks/useBalance';
import { formatBDT, bn, formatNumberBn } from '@/lib/constants';
import { toast } from 'sonner';

export default function Suppliers() {
  const {
    suppliers,
    allSuppliers,
    searchQuery,
    setSearchQuery,
    filterDue,
    setFilterDue,
    addSupplier,
    updateSupplier,
    deleteSupplier,
    adjustDue,
    totalDue,
  } = useSuppliers();

  const { balance, deductBalance, refreshBalance } = useBalance();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDueDialogOpen, setIsDueDialogOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);

  const handleAddSupplier = () => {
    setSelectedSupplier(null);
    setIsFormOpen(true);
  };

  const handleEditSupplier = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setIsFormOpen(true);
  };

  const handleFormSubmit = (data: SupplierFormData) => {
    if (selectedSupplier) {
      updateSupplier(selectedSupplier.id, data);
      toast.success('সরবরাহকারীর তথ্য আপডেট হয়েছে');
    } else {
      addSupplier(data);
      toast.success('নতুন সরবরাহকারী যোগ হয়েছে');
    }
  };

  const handleDeleteSupplier = (id: string) => {
    deleteSupplier(id);
    toast.success('সরবরাহকারী মুছে ফেলা হয়েছে');
  };

  const handleAdjustDue = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setIsDueDialogOpen(true);
  };

  const handleDueAdjust = async (id: string, amount: number, type: 'add' | 'subtract', deductFromBalance?: boolean) => {
    adjustDue(id, amount, type);
    
    // Deduct from balance if payment and option selected
    if (type === 'subtract' && deductFromBalance) {
      await deductBalance(amount, `সরবরাহকারী বকেয়া পরিশোধ`);
      await refreshBalance();
    }
    
    toast.success(
      type === 'subtract' ? 'বকেয়া পরিশোধ হয়েছে' : 'বকেয়া যোগ হয়েছে'
    );
  };

  const dueSupplierCount = allSuppliers.filter((s) => s.due_amount > 0).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{bn.suppliers.title}</h1>
          <p className="text-muted-foreground">
            মোট {formatNumberBn(allSuppliers.length)} জন সরবরাহকারী
          </p>
        </div>
        <Button onClick={handleAddSupplier} className="gap-2">
          <Plus className="h-4 w-4" />
          {bn.suppliers.addNew}
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
                মোট সরবরাহকারী
              </CardTitle>
              <Truck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatNumberBn(allSuppliers.length)}
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
                মোট পাওনা (সরবরাহকারীদের)
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

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                পাওনাদার সরবরাহকারী
              </CardTitle>
              <Truck className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-500">
                {formatNumberBn(dueSupplierCount)}
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
            placeholder="নাম, ফোন বা ইমেইল দিয়ে খুঁজুন..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select
          value={filterDue}
          onValueChange={(v) => setFilterDue(v as 'all' | 'due' | 'clear')}
        >
          <SelectTrigger className="w-full sm:w-[180px]">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="ফিল্টার" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">সব সরবরাহকারী</SelectItem>
            <SelectItem value="due">পাওনা আছে</SelectItem>
            <SelectItem value="clear">পাওনা নেই</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Supplier Table */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <SupplierTable
          suppliers={suppliers}
          onEdit={handleEditSupplier}
          onDelete={handleDeleteSupplier}
          onAdjustDue={handleAdjustDue}
        />
      </motion.div>

      {/* Dialogs */}
      <SupplierFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        supplier={selectedSupplier}
        onSubmit={handleFormSubmit}
      />

      <SupplierDueDialog
        open={isDueDialogOpen}
        onOpenChange={setIsDueDialogOpen}
        supplier={selectedSupplier}
        onAdjust={handleDueAdjust}
        currentBalance={balance?.current_balance || 0}
      />
    </div>
  );
}
