import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ShoppingCart,
  Truck,
  Package,
  Printer,
  TrendingUp,
  AlertTriangle,
  ShieldAlert,
  Wallet,
  Users,
  Loader2,
  RefreshCw,
} from 'lucide-react';
import { bn, formatBDT, formatNumberBn, formatDateBn } from '@/lib/constants';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { QuickActionButton } from '@/components/dashboard/QuickActionButton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/contexts/AuthContext';
import { 
  useDashboardStats, 
  useRecentSales, 
  useLowStockItems,
  useExpiringWarranties 
} from '@/hooks/useDashboard';
import { format } from 'date-fns';
import { bn as bnLocale } from 'date-fns/locale';

export default function Dashboard() {
  const navigate = useNavigate();
  const { profile, currentStore, isManager } = useAuth();
  
  const { 
    data: stats, 
    isLoading: statsLoading, 
    refetch: refetchStats 
  } = useDashboardStats();
  
  const { 
    data: recentSales, 
    isLoading: salesLoading 
  } = useRecentSales(5);
  
  const { 
    data: lowStockItems, 
    isLoading: lowStockLoading 
  } = useLowStockItems(5);
  
  const { 
    data: expiringWarranties, 
    isLoading: warrantiesLoading 
  } = useExpiringWarranties(30, 5);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const formatTime = (dateStr: string) => {
    try {
      return format(new Date(dateStr), 'hh:mm a', { locale: bnLocale });
    } catch {
      return '';
    }
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      {/* Page Header */}
      <div className="page-header flex items-center justify-between">
        <div>
          <h1 className="page-title">
            {bn.dashboard.welcome}{profile?.full_name ? `, ${profile.full_name}` : ''}! 👋
          </h1>
          <p className="text-muted-foreground">
            {currentStore?.store?.name} - আজকের ব্যবসার সারসংক্ষেপ
          </p>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => refetchStats()}
          className="gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          রিফ্রেশ
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsLoading ? (
          <>
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="p-6">
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-8 w-32 mb-1" />
                <Skeleton className="h-3 w-20" />
              </Card>
            ))}
          </>
        ) : (
          <>
            <StatsCard
              title={bn.dashboard.todaySales}
              value={formatBDT(stats?.todaySales || 0)}
              subtitle={`${formatNumberBn(stats?.todayInvoices || 0)} ${bn.dashboard.invoiceCount}`}
              icon={TrendingUp}
              variant="primary"
            />
            <StatsCard
              title={bn.dashboard.monthSales}
              value={formatBDT(stats?.monthSales || 0)}
              subtitle={`${formatNumberBn(stats?.monthInvoices || 0)} ${bn.dashboard.invoiceCount}`}
              icon={Wallet}
              variant="success"
            />
            <StatsCard
              title={bn.dashboard.totalDue}
              value={formatBDT((stats?.customerDue || 0) + (stats?.supplierDue || 0))}
              subtitle={`গ্রাহক: ${formatBDT(stats?.customerDue || 0)}`}
              icon={AlertTriangle}
              variant="warning"
            />
            <StatsCard
              title={bn.dashboard.lowStock}
              value={formatNumberBn(stats?.lowStockCount || 0)}
              subtitle={bn.dashboard.items}
              icon={Package}
              variant="danger"
            />
          </>
        )}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">{bn.dashboard.quickActions}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <QuickActionButton
              label={bn.dashboard.newSale}
              icon={ShoppingCart}
              variant="primary"
              onClick={() => navigate('/pos')}
            />
            {isManager && (
              <QuickActionButton
                label={bn.dashboard.newPurchase}
                icon={Truck}
                onClick={() => navigate('/purchases/new')}
              />
            )}
            {isManager && (
              <QuickActionButton
                label={bn.dashboard.addProduct}
                icon={Package}
                onClick={() => navigate('/products/new')}
              />
            )}
            <QuickActionButton
              label={bn.dashboard.printLastInvoice}
              icon={Printer}
              onClick={() => navigate('/invoices')}
            />
          </div>
        </CardContent>
      </Card>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Sales */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-lg">সাম্প্রতিক বিক্রয়</CardTitle>
            <button
              onClick={() => navigate('/sales')}
              className="text-sm text-primary hover:underline"
            >
              সব দেখুন
            </button>
          </CardHeader>
          <CardContent className="p-0">
            {salesLoading ? (
              <div className="p-6 space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex justify-between">
                    <Skeleton className="h-10 w-40" />
                    <Skeleton className="h-6 w-20" />
                  </div>
                ))}
              </div>
            ) : recentSales && recentSales.length > 0 ? (
              <div className="divide-y divide-border">
                {recentSales.map((sale, index) => (
                  <motion.div
                    key={sale.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between px-6 py-3 hover:bg-muted/50 transition-colors cursor-pointer"
                    onClick={() => navigate(`/invoices/${sale.id}`)}
                  >
                    <div className="flex flex-col">
                      <span className="font-medium text-foreground">{sale.customer_name}</span>
                      <span className="text-xs text-muted-foreground">
                        {sale.invoice_number} • {formatTime(sale.created_at)}
                      </span>
                    </div>
                    <span className="font-semibold text-foreground">{formatBDT(sale.total)}</span>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="p-6 text-center text-muted-foreground">
                <ShoppingCart className="h-10 w-10 mx-auto mb-2 opacity-50" />
                <p>আজ কোন বিক্রয় হয়নি</p>
                <Button 
                  variant="link" 
                  onClick={() => navigate('/pos')}
                  className="mt-2"
                >
                  নতুন বিক্রয় করুন
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Low Stock Alerts */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-warning" />
              কম স্টক সতর্কতা
            </CardTitle>
            <button
              onClick={() => navigate('/inventory/low-stock')}
              className="text-sm text-primary hover:underline"
            >
              সব দেখুন
            </button>
          </CardHeader>
          <CardContent className="p-0">
            {lowStockLoading ? (
              <div className="p-6 space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex justify-between">
                    <Skeleton className="h-10 w-40" />
                    <Skeleton className="h-6 w-16" />
                  </div>
                ))}
              </div>
            ) : lowStockItems && lowStockItems.length > 0 ? (
              <div className="divide-y divide-border">
                {lowStockItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between px-6 py-3 hover:bg-muted/50 transition-colors cursor-pointer"
                    onClick={() => navigate(`/products/${item.id}`)}
                  >
                    <div className="flex flex-col">
                      <span className="font-medium text-foreground">{item.name}</span>
                      <span className="text-xs text-muted-foreground">SKU: {item.sku || 'N/A'}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-semibold text-destructive">
                        {formatNumberBn(item.current_stock)} পিস
                      </span>
                      <p className="text-xs text-muted-foreground">
                        সীমা: {formatNumberBn(item.low_stock_threshold)}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="p-6 text-center text-muted-foreground">
                <Package className="h-10 w-10 mx-auto mb-2 opacity-50" />
                <p>সব পণ্যের স্টক পর্যাপ্ত আছে! 🎉</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Warranty Expiring */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-info" />
              {bn.dashboard.warrantyExpiring}
            </CardTitle>
            <button
              onClick={() => navigate('/warranty')}
              className="text-sm text-primary hover:underline"
            >
              সব দেখুন
            </button>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div className="flex items-center justify-between rounded-lg bg-warning/10 p-4 border border-warning/20">
                <div>
                  <p className="text-sm text-muted-foreground">{bn.dashboard.next7Days}</p>
                  <p className="text-2xl font-bold text-warning">
                    {statsLoading ? (
                      <Loader2 className="h-6 w-6 animate-spin" />
                    ) : (
                      formatNumberBn(stats?.warrantyExpiring7 || 0)
                    )}
                  </p>
                </div>
                <ShieldAlert className="h-10 w-10 text-warning/50" />
              </div>
              <div className="flex items-center justify-between rounded-lg bg-info/10 p-4 border border-info/20">
                <div>
                  <p className="text-sm text-muted-foreground">{bn.dashboard.next30Days}</p>
                  <p className="text-2xl font-bold text-info">
                    {statsLoading ? (
                      <Loader2 className="h-6 w-6 animate-spin" />
                    ) : (
                      formatNumberBn(stats?.warrantyExpiring30 || 0)
                    )}
                  </p>
                </div>
                <ShieldAlert className="h-10 w-10 text-info/50" />
              </div>
            </div>

            {/* Expiring warranties list */}
            {warrantiesLoading ? (
              <div className="space-y-2">
                {[...Array(2)].map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : expiringWarranties && expiringWarranties.length > 0 ? (
              <div className="rounded-lg border border-border overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="text-left p-3 font-medium">পণ্য</th>
                      <th className="text-left p-3 font-medium">গ্রাহক</th>
                      <th className="text-left p-3 font-medium hidden sm:table-cell">ফোন</th>
                      <th className="text-right p-3 font-medium">মেয়াদ শেষ</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {expiringWarranties.map((warranty) => (
                      <tr 
                        key={warranty.id} 
                        className="hover:bg-muted/30 cursor-pointer"
                        onClick={() => navigate('/warranty')}
                      >
                        <td className="p-3">{warranty.product_name}</td>
                        <td className="p-3">{warranty.customer_name}</td>
                        <td className="p-3 hidden sm:table-cell">{warranty.customer_phone}</td>
                        <td className="p-3 text-right text-warning">
                          {formatDateBn(warranty.warranty_expiry)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-4 text-muted-foreground">
                <p>আগামী ৩০ দিনে কোন ওয়ারেন্টি শেষ হচ্ছে না</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}
