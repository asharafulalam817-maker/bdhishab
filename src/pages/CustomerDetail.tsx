import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, User, Phone, Mail, MapPin, 
  Wallet, Edit, Calendar, ShoppingBag, TrendingUp, ShieldCheck
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { formatBDT } from '@/lib/constants';
import { format } from 'date-fns';
import { bn as bnLocale, enUS } from 'date-fns/locale';

// Demo data
const demoCustomers = [
  { id: '1', name: 'মোহাম্মদ করিম', phone: '01712345678', email: 'karim@email.com', address: '১২৩/এ, গুলশান, ঢাকা', due_amount: 5000, created_at: '2024-05-10' },
  { id: '2', name: 'ফাতেমা বেগম', phone: '01812345678', email: 'fatema@email.com', address: '৪৫, বনানী, ঢাকা', due_amount: 0, created_at: '2024-06-15' },
  { id: '3', name: 'রহিম উদ্দিন', phone: '01912345678', email: null, address: '৭৮, মিরপুর, ঢাকা', due_amount: 12000, created_at: '2024-07-20' },
];

const demoSales = [
  { id: 's1', invoice: 'INV-2025-001', date: '2025-01-15', total: 25000, status: 'paid' },
  { id: 's2', invoice: 'INV-2025-002', date: '2025-01-20', total: 18000, status: 'partial' },
  { id: 's3', invoice: 'INV-2025-003', date: '2025-01-25', total: 8000, status: 'due' },
];

const demoWarranties = [
  { id: 'w1', product: 'স্যামসাং গ্যালাক্সি A54', expiry: '2026-01-15', status: 'active' },
  { id: 'w2', product: 'JBL স্পিকার', expiry: '2026-01-10', status: 'active' },
];

export default function CustomerDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const dateLocale = language === 'bn' ? bnLocale : enUS;

  const customer = demoCustomers.find(c => c.id === id);

  if (!customer) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <User className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium">{t('common.noData')}</h3>
        <Button variant="outline" onClick={() => navigate('/customers')} className="mt-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          {t('common.back')}
        </Button>
      </div>
    );
  }

  const totalSales = demoSales.reduce((sum, s) => sum + s.total, 0);

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="space-y-6 p-4 md:p-6"
    >
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/customers')}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <User className="h-6 w-6" />
            {customer.name}
          </h1>
          <p className="text-muted-foreground">{t('customers.title')}</p>
        </div>
        <Button variant="outline">
          <Edit className="h-4 w-4 mr-2" />
          {t('common.edit')}
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900/20">
                <Wallet className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t('customers.totalDue')}</p>
                <p className="text-xl font-bold text-red-600">{formatBDT(customer.due_amount)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/20">
                <ShoppingBag className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t('sales.title')}</p>
                <p className="text-xl font-bold">{demoSales.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/20">
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t('reports.totalSales')}</p>
                <p className="text-xl font-bold">{formatBDT(totalSales)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/20">
                <ShieldCheck className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t('warranty.activeWarranties')}</p>
                <p className="text-xl font-bold">{demoWarranties.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Contact Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{t('customers.contactInfo')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {customer.phone && (
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">{t('customers.phone')}</p>
                  <a href={`tel:${customer.phone}`} className="text-primary hover:underline">
                    {customer.phone}
                  </a>
                </div>
              </div>
            )}
            {customer.email && (
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">{t('customers.email')}</p>
                  <a href={`mailto:${customer.email}`} className="text-primary hover:underline">
                    {customer.email}
                  </a>
                </div>
              </div>
            )}
            {customer.address && (
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">{t('customers.address')}</p>
                  <p>{customer.address}</p>
                </div>
              </div>
            )}
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">{t('common.createdAt')}</p>
                <p>{format(new Date(customer.created_at), 'PPP', { locale: dateLocale })}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Sales */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{t('sales.recentSales')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {demoSales.map((sale) => (
              <div 
                key={sale.id} 
                className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors cursor-pointer"
                onClick={() => navigate(`/sales`)}
              >
                <div>
                  <p className="font-medium">{sale.invoice}</p>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(sale.date), 'PP', { locale: dateLocale })}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium">{formatBDT(sale.total)}</p>
                  <Badge variant={
                    sale.status === 'paid' ? 'default' : 
                    sale.status === 'partial' ? 'secondary' : 'destructive'
                  }>
                    {sale.status === 'paid' ? t('common.paid') : 
                     sale.status === 'partial' ? t('common.partial') : t('common.due')}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Active Warranties */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{t('warranty.activeWarranties')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {demoWarranties.map((warranty) => (
              <div 
                key={warranty.id} 
                className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors cursor-pointer"
                onClick={() => navigate(`/warranty`)}
              >
                <div className="flex items-center gap-3">
                  <ShieldCheck className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="font-medium">{warranty.product}</p>
                    <p className="text-sm text-muted-foreground">
                      {t('warranty.expiryDate')}: {format(new Date(warranty.expiry), 'PP', { locale: dateLocale })}
                    </p>
                  </div>
                </div>
                <Badge className="bg-green-600">{t('warranty.active')}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
