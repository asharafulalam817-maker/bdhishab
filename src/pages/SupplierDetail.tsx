import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, Building2, Phone, Mail, MapPin, 
  Wallet, Edit, Calendar, ShoppingCart, TrendingUp 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { formatBDT } from '@/lib/constants';
import { format } from 'date-fns';
import { bn as bnLocale, enUS } from 'date-fns/locale';
import { SupplierFormDialog } from '@/components/suppliers/SupplierFormDialog';
import { SupplierDueDialog } from '@/components/suppliers/SupplierDueDialog';
import { toast } from 'sonner';
import type { Supplier, SupplierFormData } from '@/hooks/useSuppliers';

// Demo data - will be replaced with actual data fetching
const demoSuppliers: Supplier[] = [
  { id: '1', name: 'ডিজিটাল হাব', phone: '01711223344', email: 'digital@hub.com', address: '১২/এ, গুলশান-১, ঢাকা', due_amount: 15000, created_at: '2024-06-15', updated_at: '2024-06-15' },
  { id: '2', name: 'টেক সলিউশন', phone: '01822334455', email: 'tech@solution.com', address: '৪৫, বনানী, ঢাকা', due_amount: 8500, created_at: '2024-07-20', updated_at: '2024-07-20' },
  { id: '3', name: 'মোবাইল মার্ট', phone: '01933445566', email: 'mobile@mart.com', address: '৭৮, মিরপুর-১০, ঢাকা', due_amount: 0, created_at: '2024-08-10', updated_at: '2024-08-10' },
];

const demoPurchases = [
  { id: 'p1', invoice: 'PUR-2025-001', date: '2025-01-15', total: 45000, status: 'paid' },
  { id: 'p2', invoice: 'PUR-2025-002', date: '2025-01-20', total: 32000, status: 'partial' },
  { id: 'p3', invoice: 'PUR-2025-003', date: '2025-01-25', total: 18000, status: 'due' },
];

export default function SupplierDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const dateLocale = language === 'bn' ? bnLocale : enUS;

  const [supplier, setSupplier] = useState<Supplier | null>(
    demoSuppliers.find(s => s.id === id) || null
  );
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [dueDialogOpen, setDueDialogOpen] = useState(false);

  if (!supplier) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Building2 className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium">{t('common.noData')}</h3>
        <Button variant="outline" onClick={() => navigate('/suppliers')} className="mt-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          {t('common.back')}
        </Button>
      </div>
    );
  }

  const totalPurchases = demoPurchases.reduce((sum, p) => sum + p.total, 0);

  const handleEditSubmit = (data: SupplierFormData) => {
    setSupplier(prev => prev ? { ...prev, ...data } : null);
    toast.success(t('suppliers.updated'));
  };

  const handleDueAdjust = (id: string, amount: number, type: 'add' | 'subtract') => {
    setSupplier(prev => {
      if (!prev) return null;
      const newDue = type === 'subtract' 
        ? Math.max(0, prev.due_amount - amount)
        : prev.due_amount + amount;
      return { ...prev, due_amount: newDue };
    });
    toast.success(type === 'subtract' ? t('suppliers.duePaid') : t('suppliers.dueAdded'));
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="space-y-6 p-4 md:p-6"
    >
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/suppliers')}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Building2 className="h-6 w-6" />
            {supplier.name}
          </h1>
          <p className="text-muted-foreground">{t('suppliers.title')}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setDueDialogOpen(true)}>
            <Wallet className="h-4 w-4 mr-2" />
            {t('suppliers.adjustDue')}
          </Button>
          <Button variant="outline" onClick={() => setEditDialogOpen(true)}>
            <Edit className="h-4 w-4 mr-2" />
            {t('common.edit')}
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-destructive/10">
                <Wallet className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t('suppliers.totalPayable')}</p>
                <p className="text-xl font-bold text-destructive">{formatBDT(supplier.due_amount)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <ShoppingCart className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t('purchases.title')}</p>
                <p className="text-xl font-bold">{demoPurchases.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-500/10">
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t('purchases.totalPurchases')}</p>
                <p className="text-xl font-bold">{formatBDT(totalPurchases)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Contact Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{t('suppliers.contactInfo')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {supplier.phone && (
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">{t('suppliers.phone')}</p>
                  <a href={`tel:${supplier.phone}`} className="text-primary hover:underline">
                    {supplier.phone}
                  </a>
                </div>
              </div>
            )}
            {supplier.email && (
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">{t('suppliers.email')}</p>
                  <a href={`mailto:${supplier.email}`} className="text-primary hover:underline">
                    {supplier.email}
                  </a>
                </div>
              </div>
            )}
            {supplier.address && (
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">{t('suppliers.address')}</p>
                  <p>{supplier.address}</p>
                </div>
              </div>
            )}
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">{t('common.createdAt')}</p>
                <p>{format(new Date(supplier.created_at), 'PPP', { locale: dateLocale })}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Purchases */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{t('purchases.recentPurchases')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {demoPurchases.map((purchase) => (
              <div 
                key={purchase.id} 
                className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors cursor-pointer"
                onClick={() => navigate(`/purchases`)}
              >
                <div>
                  <p className="font-medium">{purchase.invoice}</p>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(purchase.date), 'PP', { locale: dateLocale })}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium">{formatBDT(purchase.total)}</p>
                  <Badge variant={
                    purchase.status === 'paid' ? 'default' : 
                    purchase.status === 'partial' ? 'secondary' : 'destructive'
                  }>
                    {purchase.status === 'paid' ? t('common.paid') : 
                     purchase.status === 'partial' ? t('common.partial') : t('common.due')}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <SupplierFormDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        supplier={supplier}
        onSubmit={handleEditSubmit}
      />

      {/* Due Dialog */}
      <SupplierDueDialog
        open={dueDialogOpen}
        onOpenChange={setDueDialogOpen}
        supplier={supplier}
        onAdjust={handleDueAdjust}
      />
    </motion.div>
  );
}
