import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Users, Wallet, Filter } from 'lucide-react';
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
import { CustomerTable } from '@/components/customers/CustomerTable';
import { CustomerFormDialog } from '@/components/customers/CustomerFormDialog';
import { DueAdjustDialog } from '@/components/customers/DueAdjustDialog';
import { useCustomers, Customer, CustomerFormData } from '@/hooks/useCustomers';
import { formatBDT, bn, formatNumberBn } from '@/lib/constants';
import { toast } from 'sonner';

export default function Customers() {
  const {
    customers,
    allCustomers,
    searchQuery,
    setSearchQuery,
    filterDue,
    setFilterDue,
    addCustomer,
    updateCustomer,
    deleteCustomer,
    adjustDue,
    totalDue,
  } = useCustomers();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDueDialogOpen, setIsDueDialogOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  const handleAddCustomer = () => {
    setSelectedCustomer(null);
    setIsFormOpen(true);
  };

  const handleEditCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsFormOpen(true);
  };

  const handleFormSubmit = (data: CustomerFormData) => {
    if (selectedCustomer) {
      updateCustomer(selectedCustomer.id, data);
      toast.success('গ্রাহকের তথ্য আপডেট হয়েছে');
    } else {
      addCustomer(data);
      toast.success('নতুন গ্রাহক যোগ হয়েছে');
    }
  };

  const handleDeleteCustomer = (id: string) => {
    deleteCustomer(id);
    toast.success('গ্রাহক মুছে ফেলা হয়েছে');
  };

  const handleAdjustDue = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsDueDialogOpen(true);
  };

  const handleDueAdjust = (id: string, amount: number, type: 'add' | 'subtract') => {
    adjustDue(id, amount, type);
    toast.success(
      type === 'subtract' ? 'বকেয়া পরিশোধ হয়েছে' : 'বকেয়া যোগ হয়েছে'
    );
  };

  const dueCustomersCount = allCustomers.filter((c) => c.due_amount > 0).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{bn.customers.title}</h1>
          <p className="text-muted-foreground">
            মোট {formatNumberBn(allCustomers.length)} জন গ্রাহক
          </p>
        </div>
        <Button onClick={handleAddCustomer} className="gap-2">
          <Plus className="h-4 w-4" />
          {bn.customers.addNew}
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
                মোট গ্রাহক
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatNumberBn(allCustomers.length)}
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
                মোট বকেয়া
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
                বকেয়াদার গ্রাহক
              </CardTitle>
              <Users className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-500">
                {formatNumberBn(dueCustomersCount)}
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
            <SelectItem value="all">সব গ্রাহক</SelectItem>
            <SelectItem value="due">বকেয়াদার</SelectItem>
            <SelectItem value="clear">বকেয়া নেই</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Customer Table */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <CustomerTable
          customers={customers}
          onEdit={handleEditCustomer}
          onDelete={handleDeleteCustomer}
          onAdjustDue={handleAdjustDue}
        />
      </motion.div>

      {/* Dialogs */}
      <CustomerFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        customer={selectedCustomer}
        onSubmit={handleFormSubmit}
      />

      <DueAdjustDialog
        open={isDueDialogOpen}
        onOpenChange={setIsDueDialogOpen}
        customer={selectedCustomer}
        onAdjust={handleDueAdjust}
      />
    </div>
  );
}
