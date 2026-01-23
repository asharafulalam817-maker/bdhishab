import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ShoppingCart,
  Truck,
  Package,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Wallet,
  RefreshCw,
  ArrowUpRight,
  ArrowDownRight,
  Users,
  FileText,
  ChevronRight,
  Receipt,
  CreditCard,
  PiggyBank,
} from 'lucide-react';
import { bn, formatBDT, formatNumberBn } from '@/lib/constants';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { useDemo } from '@/contexts/DemoContext';
import { 
  useDashboardStats, 
  useRecentSales, 
  useLowStockItems,
} from '@/hooks/useDashboard';
import { useBalance } from '@/hooks/useBalance';
import { format } from 'date-fns';
import { bn as bnLocale } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { useState, useEffect } from 'react';

export default function Dashboard() {
  const navigate = useNavigate();
  const { demoProfile, demoStore } = useDemo();
  
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

  const { balance, isLoading: balanceLoading } = useBalance();

  // Fetch total stock value and customer dues
  const [totalStockValue, setTotalStockValue] = useState(0);
  const [totalDueAmount, setTotalDueAmount] = useState(0);
  const [isLoadingExtras, setIsLoadingExtras] = useState(true);

  useEffect(() => {
    const fetchExtras = async () => {
      if (!demoStore?.id) return;
      setIsLoadingExtras(true);
      
      try {
        // Fetch products for stock value
        const { data: products } = await supabase
          .from('products')
          .select('current_stock, sale_price')
          .eq('store_id', demoStore.id);
        
        if (products) {
          const stockValue = products.reduce((sum, p) => {
            return sum + ((p.current_stock || 0) * (p.sale_price || 0));
          }, 0);
          setTotalStockValue(stockValue);
        }

        // Fetch customers for due amount
        const { data: customers } = await supabase
          .from('customers')
          .select('due_amount')
          .eq('store_id', demoStore.id);
        
        if (customers) {
          const dueAmount = customers.reduce((sum, c) => sum + (c.due_amount || 0), 0);
          setTotalDueAmount(dueAmount);
        }
      } catch (error) {
        console.error('Error fetching extras:', error);
      } finally {
        setIsLoadingExtras(false);
      }
    };

    fetchExtras();
  }, [demoStore?.id]);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  const formatTime = (dateStr: string) => {
    try {
      return format(new Date(dateStr), 'hh:mm a', { locale: bnLocale });
    } catch {
      return '';
    }
  };

  // Quick actions
  const quickActions = [
    { label: 'নতুন বিক্রয়', icon: ShoppingCart, path: '/pos', variant: 'primary' as const },
    { label: 'নতুন ক্রয়', icon: Truck, path: '/purchases/new', variant: 'default' as const },
    { label: 'পণ্য যোগ', icon: Package, path: '/products/new', variant: 'default' as const },
    { label: 'গ্রাহক', icon: Users, path: '/customers', variant: 'default' as const },
  ];

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-4 lg:space-y-6 w-full"
    >
      {/* Minimal Header */}
      <motion.div variants={item} className="flex items-center justify-between">
        <div>
          <h1 className="text-xl lg:text-2xl font-bold text-foreground">
            {bn.dashboard.welcome}, {demoProfile.full_name?.split(' ')[0]}! 👋
          </h1>
          <p className="text-sm text-muted-foreground hidden sm:block">
            {format(new Date(), 'd MMMM yyyy', { locale: bnLocale })}
          </p>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => refetchStats()}
          className="h-9 w-9"
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
      </motion.div>

      {/* Balance & Summary Cards */}
      <motion.div variants={item} className="grid grid-cols-2 md:grid-cols-4 gap-2 lg:gap-3">
        {/* Total Capital (Combined) */}
        <Card className="bg-gradient-to-br from-violet-600 via-violet-600 to-violet-500 text-white border-0 shadow-lg shadow-violet-600/20">
          <CardContent className="p-3 lg:p-4">
            <div className="flex items-start justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium opacity-90 mb-0.5 truncate">মোট মূলধন</p>
                <p className="text-lg lg:text-2xl font-bold tracking-tight">
                  {(balanceLoading || isLoadingExtras) ? '...' : formatBDT((balance?.current_balance || 0) + totalStockValue + totalDueAmount)}
                </p>
                <p className="text-[10px] opacity-75 mt-0.5 truncate">
                  সব মিলিয়ে
                </p>
              </div>
              <div className="p-2 rounded-lg bg-white/20 shrink-0">
                <PiggyBank className="h-4 w-4" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Total Cash */}
        <Card className="bg-gradient-to-br from-primary via-primary to-primary/80 text-primary-foreground border-0 shadow-lg shadow-primary/20">
          <CardContent className="p-3 lg:p-4">
            <div className="flex items-start justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium opacity-90 mb-0.5 truncate">মোট ক্যাশ আছে</p>
                <p className="text-lg lg:text-2xl font-bold tracking-tight">
                  {balanceLoading ? '...' : formatBDT(balance?.current_balance || 0)}
                </p>
                <p className="text-[10px] opacity-75 mt-0.5 truncate">
                  হাতে নগদ
                </p>
              </div>
              <div className="p-2 rounded-lg bg-white/20 shrink-0">
                <Wallet className="h-4 w-4" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Total Stock Value */}
        <Card className="bg-gradient-to-br from-emerald-600 via-emerald-600 to-emerald-500 text-white border-0 shadow-lg shadow-emerald-600/20">
          <CardContent className="p-3 lg:p-4">
            <div className="flex items-start justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium opacity-90 mb-0.5 truncate">মোট স্টক মূল্য</p>
                <p className="text-lg lg:text-2xl font-bold tracking-tight">
                  {isLoadingExtras ? '...' : formatBDT(totalStockValue)}
                </p>
                <p className="text-[10px] opacity-75 mt-0.5 truncate">
                  সব পণ্যের মূল্য
                </p>
              </div>
              <div className="p-2 rounded-lg bg-white/20 shrink-0">
                <Package className="h-4 w-4" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Total Due Amount */}
        <Card className="bg-gradient-to-br from-orange-500 via-orange-500 to-orange-400 text-white border-0 shadow-lg shadow-orange-500/20">
          <CardContent className="p-3 lg:p-4">
            <div className="flex items-start justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium opacity-90 mb-0.5 truncate">মোট বাকি পাওনা</p>
                <p className="text-lg lg:text-2xl font-bold tracking-tight">
                  {isLoadingExtras ? '...' : formatBDT(totalDueAmount)}
                </p>
                <p className="text-[10px] opacity-75 mt-0.5 truncate">
                  গ্রাহকদের বকেয়া
                </p>
              </div>
              <div className="p-2 rounded-lg bg-white/20 shrink-0">
                <CreditCard className="h-4 w-4" />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Today's Stats Grid */}
      <motion.div variants={item} className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 lg:gap-3">
        {/* Today's Sales */}
        <StatCard
          title="আজকের বিক্রয়"
          value={statsLoading ? '...' : formatBDT(stats?.todaySales || 0)}
          subtitle={`${formatNumberBn(stats?.todayInvoices || 0)} ইনভয়েস`}
          icon={ShoppingCart}
          trend="up"
          loading={statsLoading}
        />

        {/* Today's Purchases */}
        <StatCard
          title="আজকের ক্রয়"
          value={statsLoading ? '...' : formatBDT(stats?.todayPurchases || 0)}
          subtitle={`${formatNumberBn(stats?.todayPurchaseCount || 0)} পার্চেজ`}
          icon={Truck}
          trend="neutral"
          loading={statsLoading}
        />

        {/* Today's Due Sales */}
        <StatCard
          title="আজকের বাকি"
          value={statsLoading ? '...' : formatBDT(stats?.todayDueSales || 0)}
          subtitle="বিক্রয় বাকি"
          icon={CreditCard}
          trend="down"
          loading={statsLoading}
        />

        {/* Today's Profit */}
        <StatCard
          title="আজকের লাভ"
          value={statsLoading ? '...' : formatBDT(stats?.todayProfit || 0)}
          subtitle="নেট প্রফিট"
          icon={PiggyBank}
          trend={(stats?.todayProfit || 0) >= 0 ? 'up' : 'down'}
          loading={statsLoading}
        />

        {/* Today's Expenses */}
        <StatCard
          title="আজকের খরচ"
          value={statsLoading ? '...' : formatBDT(stats?.todayExpenses || 0)}
          subtitle="মোট ব্যয়"
          icon={Receipt}
          trend="down"
          loading={statsLoading}
        />
      </motion.div>

      {/* Quick Actions */}
      <motion.div variants={item} className="grid grid-cols-4 gap-2 lg:gap-3">
        {quickActions.map((action) => (
          <Button
            key={action.path}
            variant={action.variant === 'primary' ? 'default' : 'outline'}
            className={cn(
              'h-auto py-3 lg:py-4 flex-col gap-1.5 lg:gap-2',
              action.variant === 'primary' && 'bg-primary hover:bg-primary/90'
            )}
            onClick={() => navigate(action.path)}
          >
            <action.icon className="h-5 w-5 lg:h-6 lg:w-6" />
            <span className="text-[11px] lg:text-xs font-medium">{action.label}</span>
          </Button>
        ))}
      </motion.div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        {/* Recent Sales */}
        <motion.div variants={item}>
          <Card className="h-full">
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
              <CardTitle className="text-base lg:text-lg font-semibold">সাম্প্রতিক বিক্রয়</CardTitle>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-xs gap-1"
                onClick={() => navigate('/sales')}
              >
                সব দেখুন <ChevronRight className="h-3 w-3" />
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              {salesLoading ? (
                <div className="px-4 pb-4 space-y-3">
                  {[...Array(4)].map((_, i) => (
                    <Skeleton key={i} className="h-14 w-full" />
                  ))}
                </div>
              ) : recentSales && recentSales.length > 0 ? (
                <div className="divide-y divide-border">
                  {recentSales.map((sale) => (
                    <div
                      key={sale.id}
                      className="flex items-center justify-between px-4 py-3 hover:bg-muted/50 transition-colors cursor-pointer"
                      onClick={() => navigate(`/sales`)}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                          <FileText className="h-4 w-4 text-primary" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-sm truncate">{sale.customer_name || 'ওয়াক-ইন'}</p>
                          <p className="text-xs text-muted-foreground">
                            {sale.invoice_number} • {formatTime(sale.created_at)}
                          </p>
                        </div>
                      </div>
                      <span className="font-semibold text-sm shrink-0">{formatBDT(sale.total)}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-muted-foreground">
                  <ShoppingCart className="h-10 w-10 mx-auto mb-2 opacity-30" />
                  <p className="text-sm">আজ কোন বিক্রয় হয়নি</p>
                  <Button 
                    variant="link" 
                    size="sm"
                    onClick={() => navigate('/pos')}
                    className="mt-2"
                  >
                    নতুন বিক্রয় করুন
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Alerts Section */}
        <motion.div variants={item}>
          <Card className="h-full">
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
              <CardTitle className="text-base lg:text-lg font-semibold flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-warning" />
                সতর্কতা
              </CardTitle>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-xs gap-1"
                onClick={() => navigate('/inventory/low-stock')}
              >
                সব দেখুন <ChevronRight className="h-3 w-3" />
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              {/* Stats Row */}
              <div className="grid grid-cols-2 gap-3 px-4 pb-3">
                <div className="rounded-lg bg-destructive/10 p-3 border border-destructive/20">
                  <p className="text-xs text-muted-foreground">কম স্টক</p>
                  <p className="text-xl font-bold text-destructive">
                    {statsLoading ? '...' : formatNumberBn(stats?.lowStockCount || 0)}
                  </p>
                </div>
                <div className="rounded-lg bg-warning/10 p-3 border border-warning/20">
                  <p className="text-xs text-muted-foreground">ওয়ারেন্টি শেষ</p>
                  <p className="text-xl font-bold text-warning">
                    {statsLoading ? '...' : formatNumberBn(stats?.warrantyExpiring7 || 0)}
                  </p>
                </div>
              </div>

              {/* Low Stock Items */}
              {lowStockLoading ? (
                <div className="px-4 pb-4 space-y-2">
                  {[...Array(3)].map((_, i) => (
                    <Skeleton key={i} className="h-12 w-full" />
                  ))}
                </div>
              ) : lowStockItems && lowStockItems.length > 0 ? (
                <div className="divide-y divide-border">
                  {lowStockItems.slice(0, 4).map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between px-4 py-2.5 hover:bg-muted/50 transition-colors cursor-pointer"
                      onClick={() => navigate('/products')}
                    >
                      <div className="min-w-0">
                        <p className="font-medium text-sm truncate">{item.name}</p>
                        <p className="text-xs text-muted-foreground">SKU: {item.sku || 'N/A'}</p>
                      </div>
                      <Badge variant="destructive" className="shrink-0">
                        {formatNumberBn(item.current_stock)} পিস
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-6 text-center text-muted-foreground">
                  <Package className="h-8 w-8 mx-auto mb-2 opacity-30" />
                  <p className="text-sm">সব পণ্যের স্টক পর্যাপ্ত 🎉</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}

// Stat Card Component
interface StatCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: React.ElementType;
  trend?: 'up' | 'down' | 'neutral';
  loading?: boolean;
}

function StatCard({ title, value, subtitle, icon: Icon, trend, loading }: StatCardProps) {
  if (loading) {
    return (
      <Card>
        <CardContent className="p-3 lg:p-4">
          <Skeleton className="h-4 w-16 mb-2" />
          <Skeleton className="h-6 w-20 mb-1" />
          <Skeleton className="h-3 w-12" />
        </CardContent>
      </Card>
    );
  }

  const getTrendColors = () => {
    switch (trend) {
      case 'up':
        return 'bg-emerald-500/10 text-emerald-600';
      case 'down':
        return 'bg-destructive/10 text-destructive';
      default:
        return 'bg-primary/10 text-primary';
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-3 lg:p-4">
        <div className="flex items-start justify-between mb-1.5 lg:mb-2">
          <p className="text-[10px] lg:text-xs text-muted-foreground font-medium leading-tight">{title}</p>
          <div className={cn('p-1.5 rounded-lg', getTrendColors())}>
            <Icon className="h-3 w-3 lg:h-3.5 lg:w-3.5" />
          </div>
        </div>
        <p className="text-base lg:text-lg font-bold text-foreground leading-tight">{value}</p>
        {subtitle && (
          <p className="text-[9px] lg:text-[10px] text-muted-foreground mt-0.5">{subtitle}</p>
        )}
      </CardContent>
    </Card>
  );
}
