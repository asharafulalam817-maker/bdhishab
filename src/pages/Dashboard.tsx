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
  PackagePlus,
} from 'lucide-react';
import { formatBDT, formatNumberBn } from '@/lib/constants';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { useDemo } from '@/contexts/DemoContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { 
  useDashboardStats, 
  useRecentSales, 
  useLowStockItems,
} from '@/hooks/useDashboard';
import { useBalance } from '@/hooks/useBalance';
import { useSubscription } from '@/hooks/useSubscription';
import { format } from 'date-fns';
import { bn as bnLocale, enUS } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { useState, useEffect } from 'react';
import { SubscriptionExpiredBanner } from '@/components/subscription/SubscriptionExpiredBanner';
import { useReadOnly } from '@/contexts/ReadOnlyContext';
import { toast } from 'sonner';

export default function Dashboard() {
  const navigate = useNavigate();
  const { demoProfile, demoStore } = useDemo();
  const { t, language } = useLanguage();
  
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
  const { isSubscriptionExpired, getDaysExpired, isLoading: subscriptionLoading } = useSubscription();
  const { isReadOnly, showReadOnlyToast } = useReadOnly();

  // Fetch total stock value and customer dues
  const [totalStockValue, setTotalStockValue] = useState(0);
  const [totalDueAmount, setTotalDueAmount] = useState(0);
  const [isLoadingExtras, setIsLoadingExtras] = useState(true);

  const dateLocale = language === 'bn' ? bnLocale : enUS;
  const showExpiredBanner = !subscriptionLoading && isSubscriptionExpired();

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
      return format(new Date(dateStr), 'hh:mm a', { locale: dateLocale });
    } catch {
      return '';
    }
  };

  // Quick actions - Short labels (Order: ক্রয়, বিক্রয়, স্টক, গ্রাহক)
  // Note: readOnly actions (purchase, sale, stock) will show toast if subscription expired
  const quickActions = [
    { label: t('quickAction.purchase'), icon: Truck, path: '/purchases/new', variant: 'default' as const, requiresActive: true },
    { label: t('quickAction.sale'), icon: ShoppingCart, path: '/pos', variant: 'primary' as const, requiresActive: true },
    { label: t('quickAction.stock'), icon: PackagePlus, path: '/quick-stock', variant: 'default' as const, requiresActive: true },
    { label: t('quickAction.customer'), icon: Users, path: '/customers', variant: 'default' as const, requiresActive: false },
  ];

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-4 lg:space-y-6 w-full"
    >
      {/* Subscription Expired Banner */}
      {showExpiredBanner && (
        <motion.div variants={item}>
          <SubscriptionExpiredBanner daysExpired={getDaysExpired()} />
        </motion.div>
      )}

      {/* Minimal Header */}
      <motion.div variants={item} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-foreground">
            {t('dashboard.welcome')}, {demoProfile.full_name?.split(' ')[0]}! 👋
          </h1>
          <p className="text-base font-medium text-muted-foreground hidden sm:block">
            {format(new Date(), 'd MMMM yyyy', { locale: dateLocale })}
          </p>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => refetchStats()}
          className="h-10 w-10"
        >
          <RefreshCw className="h-5 w-5" />
        </Button>
      </motion.div>

      {/* Balance & Summary Cards */}
      <motion.div variants={item} className="grid grid-cols-2 md:grid-cols-4 gap-2 lg:gap-3">
        {/* Total Cash */}
        <Card className="bg-gradient-to-br from-primary via-primary to-primary/80 text-primary-foreground border-0 shadow-lg shadow-primary/20">
          <CardContent className="p-4 lg:p-5">
            <div className="flex items-start justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-base lg:text-lg font-extrabold opacity-95 mb-1 truncate">{t('dashboard.totalCash')}</p>
                <p className="text-2xl lg:text-4xl font-black tracking-tight">
                  {balanceLoading ? '...' : formatBDT(balance?.current_balance || 0)}
                </p>
                <p className="text-sm font-bold opacity-80 mt-1 truncate">
                  {t('dashboard.cashOnHand')}
                </p>
              </div>
              <div className="p-2.5 rounded-lg bg-white/20 shrink-0">
                <Wallet className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Total Stock Value */}
        <Card className="bg-gradient-to-br from-emerald-600 via-emerald-600 to-emerald-500 text-white border-0 shadow-lg shadow-emerald-600/20">
          <CardContent className="p-4 lg:p-5">
            <div className="flex items-start justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-base lg:text-lg font-extrabold opacity-95 mb-1 truncate">{t('dashboard.totalStockValue')}</p>
                <p className="text-2xl lg:text-4xl font-black tracking-tight">
                  {isLoadingExtras ? '...' : formatBDT(totalStockValue)}
                </p>
                <p className="text-sm font-bold opacity-80 mt-1 truncate">
                  {t('dashboard.allProductsValue')}
                </p>
              </div>
              <div className="p-2.5 rounded-lg bg-white/20 shrink-0">
                <Package className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Total Due Amount */}
        <Card className="bg-gradient-to-br from-orange-500 via-orange-500 to-orange-400 text-white border-0 shadow-lg shadow-orange-500/20">
          <CardContent className="p-4 lg:p-5">
            <div className="flex items-start justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-base lg:text-lg font-extrabold opacity-95 mb-1 truncate">{t('dashboard.totalReceivables')}</p>
                <p className="text-2xl lg:text-4xl font-black tracking-tight">
                  {isLoadingExtras ? '...' : formatBDT(totalDueAmount)}
                </p>
                <p className="text-sm font-bold opacity-80 mt-1 truncate">
                  {t('dashboard.customerDues')}
                </p>
              </div>
              <div className="p-2.5 rounded-lg bg-white/20 shrink-0">
                <CreditCard className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Total Capital (Combined) - 4th position */}
        <Card className="bg-gradient-to-br from-violet-600 via-violet-600 to-violet-500 text-white border-0 shadow-lg shadow-violet-600/20">
          <CardContent className="p-4 lg:p-5">
            <div className="flex items-start justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-base lg:text-lg font-extrabold opacity-95 mb-1 truncate">{t('dashboard.totalCapital')}</p>
                <p className="text-2xl lg:text-4xl font-black tracking-tight">
                  {(balanceLoading || isLoadingExtras) ? '...' : formatBDT((balance?.current_balance || 0) + totalStockValue + totalDueAmount)}
                </p>
                <p className="text-sm font-bold opacity-80 mt-1 truncate">
                  {t('dashboard.combined')}
                </p>
              </div>
              <div className="p-2.5 rounded-lg bg-white/20 shrink-0">
                <PiggyBank className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Today's Stats Grid */}
      <motion.div variants={item} className="space-y-3">
        {/* Section Headline */}
        <h2 className="text-xl lg:text-2xl font-extrabold text-foreground">
          {t('dashboard.todayStats')} 📊
        </h2>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 lg:gap-3">
          {/* Purchases - First */}
          <StatCard
            title={t('dashboard.purchasesShort')}
            value={statsLoading ? '...' : formatBDT(stats?.todayPurchases || 0)}
            subtitle={`${formatNumberBn(stats?.todayPurchaseCount || 0)} ${t('dashboard.purchases')}`}
            icon={Truck}
            trend="neutral"
            loading={statsLoading}
          />

          {/* Sales - Second */}
          <StatCard
            title={t('dashboard.sales')}
            value={statsLoading ? '...' : formatBDT(stats?.todaySales || 0)}
            subtitle={`${formatNumberBn(stats?.todayInvoices || 0)} ${t('dashboard.invoices')}`}
            icon={ShoppingCart}
            trend="up"
            loading={statsLoading}
          />

          {/* Due */}
          <StatCard
            title={t('dashboard.due')}
            value={statsLoading ? '...' : formatBDT(stats?.todayDueSales || 0)}
            subtitle={t('dashboard.salesDue')}
            icon={CreditCard}
            trend="down"
            loading={statsLoading}
          />

          {/* Profit */}
          <StatCard
            title={t('dashboard.profit')}
            value={statsLoading ? '...' : formatBDT(stats?.todayProfit || 0)}
            subtitle={t('dashboard.netProfit')}
            icon={PiggyBank}
            trend={(stats?.todayProfit || 0) >= 0 ? 'up' : 'down'}
            loading={statsLoading}
          />

          {/* Expenses */}
          <StatCard
            title={t('dashboard.expenses')}
            value={statsLoading ? '...' : formatBDT(stats?.todayExpenses || 0)}
            subtitle={t('dashboard.totalExpense')}
            icon={Receipt}
            trend="down"
            loading={statsLoading}
          />
        </div>
      </motion.div>

      {/* Quick Actions - Dark Premium Solid Buttons */}
      <motion.div variants={item} className="space-y-3">
        {/* Section Headline */}
        <h2 className="text-xl lg:text-2xl font-extrabold text-foreground">
          {t('dashboard.quickActions')} ⚡
        </h2>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 lg:gap-5">
        {quickActions.map((action, index) => {
          const styles = [
            {
              bg: 'bg-slate-900',
              accent: 'text-blue-400',
              accentBg: 'bg-blue-500',
              border: 'border-slate-700',
            },
            {
              bg: 'bg-slate-900',
              accent: 'text-purple-400',
              accentBg: 'bg-purple-500',
              border: 'border-slate-700',
            },
            {
              bg: 'bg-slate-900',
              accent: 'text-emerald-400',
              accentBg: 'bg-emerald-500',
              border: 'border-slate-700',
            },
            {
              bg: 'bg-slate-900',
              accent: 'text-rose-400',
              accentBg: 'bg-rose-500',
              border: 'border-slate-700',
            },
          ];
          
          const style = styles[index];
          const isDisabled = action.requiresActive && isReadOnly;
          
          const handleClick = () => {
            if (isDisabled) {
              showReadOnlyToast();
              return;
            }
            navigate(action.path);
          };
          
          return (
            <motion.button
              key={action.path}
              whileHover={isDisabled ? {} : { scale: 1.03, y: -2 }}
              whileTap={isDisabled ? {} : { scale: 0.97 }}
              onClick={handleClick}
              className={cn(
                'group relative flex flex-col items-center justify-center gap-3 lg:gap-4 p-5 lg:p-6 rounded-2xl font-bold transition-all duration-200 border-2 shadow-xl',
                isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:shadow-2xl',
                style.bg,
                style.border
              )}
            >
              {/* Accent badge */}
              <div className={cn(
                'absolute -top-2 -right-2 w-7 h-7 rounded-full flex items-center justify-center shadow-lg',
                style.accentBg,
                isDisabled && 'opacity-50'
              )}>
                <span className="text-white text-lg font-black">+</span>
              </div>
              
              {/* Icon */}
              <div className={cn(
                'p-3 lg:p-4 rounded-xl',
                style.accentBg,
                isDisabled && 'opacity-50'
              )}>
                <action.icon className="h-6 w-6 lg:h-7 lg:w-7 text-white" />
              </div>
              
              {/* Label - Extra Large text especially on mobile */}
              <span className={cn(
                'text-2xl sm:text-2xl lg:text-3xl font-extrabold text-center leading-tight',
                style.accent,
                isDisabled && 'opacity-50'
              )}>
                {action.label}
              </span>
              
              {/* Click hint */}
              <span className="text-xs lg:text-sm text-slate-400 font-semibold flex items-center gap-1">
                {isDisabled ? '🔒' : `${t('common.clickHere')} →`}
              </span>
            </motion.button>
          );
        })}
        </div>
      </motion.div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        {/* Recent Sales */}
        <motion.div variants={item}>
          <Card className="h-full">
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
              <CardTitle className="text-lg lg:text-xl font-bold">{t('dashboard.recentSales')}</CardTitle>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-xs gap-1"
                onClick={() => navigate('/sales')}
              >
                {t('dashboard.viewAll')} <ChevronRight className="h-3 w-3" />
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
                          <p className="font-bold text-base truncate">{sale.customer_name || t('sales.walkIn')}</p>
                          <p className="text-sm font-medium text-muted-foreground">
                            {sale.invoice_number} • {formatTime(sale.created_at)}
                          </p>
                        </div>
                      </div>
                      <span className="font-bold text-base shrink-0">{formatBDT(sale.total)}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-muted-foreground">
                  <ShoppingCart className="h-10 w-10 mx-auto mb-2 opacity-30" />
                  <p className="text-sm">{t('dashboard.noSalesToday')}</p>
                  <Button 
                    variant="link" 
                    size="sm"
                    onClick={() => navigate('/pos')}
                    className="mt-2"
                  >
                    {t('dashboard.newSale')}
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
              <CardTitle className="text-lg lg:text-xl font-bold flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-warning" />
                {t('dashboard.alerts')}
              </CardTitle>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-xs gap-1"
                onClick={() => navigate('/inventory/low-stock')}
              >
                {t('dashboard.viewAll')} <ChevronRight className="h-3 w-3" />
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              {/* Stats Row */}
              <div className="grid grid-cols-2 gap-3 px-4 pb-3">
                <div className="rounded-lg bg-destructive/10 p-3 border border-destructive/20">
                  <p className="text-sm font-bold text-muted-foreground">{t('dashboard.lowStock')}</p>
                  <p className="text-2xl font-extrabold text-destructive">
                    {statsLoading ? '...' : formatNumberBn(stats?.lowStockCount || 0)}
                  </p>
                </div>
                <div className="rounded-lg bg-warning/10 p-3 border border-warning/20">
                  <p className="text-sm font-bold text-muted-foreground">{t('dashboard.warrantyExpiring')}</p>
                  <p className="text-2xl font-extrabold text-warning">
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
                        <p className="font-bold text-base truncate">{item.name}</p>
                        <p className="text-sm font-medium text-muted-foreground">SKU: {item.sku || 'N/A'}</p>
                      </div>
                      <Badge variant="destructive" className="shrink-0 text-sm font-bold">
                        {formatNumberBn(item.current_stock)} {t('dashboard.pieces')}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-6 text-center text-muted-foreground">
                  <Package className="h-8 w-8 mx-auto mb-2 opacity-30" />
                  <p className="text-sm">{t('dashboard.allStockOk')} 🎉</p>
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
      <CardContent className="p-4 lg:p-5">
        <div className="flex items-start justify-between mb-2 lg:mb-3">
          <p className="text-xl lg:text-2xl text-muted-foreground font-black leading-tight">{title}</p>
          <div className={cn('p-2 rounded-lg', getTrendColors())}>
            <Icon className="h-4 w-4 lg:h-5 lg:w-5" />
          </div>
        </div>
        <p className="text-xl lg:text-2xl font-black text-foreground leading-tight">{value}</p>
        {subtitle && (
          <p className="text-sm lg:text-base text-muted-foreground font-semibold mt-1">{subtitle}</p>
        )}
      </CardContent>
    </Card>
  );
}
