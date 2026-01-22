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
} from 'lucide-react';
import { bn, formatBDT, formatNumberBn } from '@/lib/constants';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { QuickActionButton } from '@/components/dashboard/QuickActionButton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Demo data
const demoStats = {
  todaySales: 45750,
  todayInvoices: 12,
  monthSales: 892450,
  customerDue: 125000,
  supplierDue: 85000,
  lowStockCount: 8,
  warrantyExpiring7: 3,
  warrantyExpiring30: 12,
};

const recentSales = [
  { id: 'INV-202501-001', customer: 'মোহাম্মদ করিম', amount: 12500, time: '১০:৩০ AM' },
  { id: 'INV-202501-002', customer: 'ফাতেমা বেগম', amount: 8700, time: '১১:১৫ AM' },
  { id: 'INV-202501-003', customer: 'রহিম উদ্দিন', amount: 24550, time: '১২:০০ PM' },
  { id: 'INV-202501-004', customer: 'আয়েশা খাতুন', amount: 5200, time: '০২:৪৫ PM' },
];

const lowStockItems = [
  { name: 'স্যামসাং গ্যালাক্সি A54', sku: 'SAM-A54', stock: 2, threshold: 5 },
  { name: 'আইফোন ১৫ কভার', sku: 'IP15-COV', stock: 3, threshold: 10 },
  { name: 'শাওমি পাওয়ার ব্যাংক', sku: 'XM-PB10', stock: 1, threshold: 5 },
];

export default function Dashboard() {
  const navigate = useNavigate();

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">{bn.dashboard.welcome}! 👋</h1>
          <p className="text-muted-foreground">আজকের ব্যবসার সারসংক্ষেপ দেখুন</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title={bn.dashboard.todaySales}
          value={formatBDT(demoStats.todaySales)}
          subtitle={`${formatNumberBn(demoStats.todayInvoices)} ${bn.dashboard.invoiceCount}`}
          icon={TrendingUp}
          variant="primary"
        />
        <StatsCard
          title={bn.dashboard.monthSales}
          value={formatBDT(demoStats.monthSales)}
          icon={Wallet}
          variant="success"
        />
        <StatsCard
          title={bn.dashboard.totalDue}
          value={formatBDT(demoStats.customerDue + demoStats.supplierDue)}
          subtitle={`গ্রাহক: ${formatBDT(demoStats.customerDue)}`}
          icon={AlertTriangle}
          variant="warning"
        />
        <StatsCard
          title={bn.dashboard.lowStock}
          value={formatNumberBn(demoStats.lowStockCount)}
          subtitle={bn.dashboard.items}
          icon={Package}
          variant="danger"
        />
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
            <QuickActionButton
              label={bn.dashboard.newPurchase}
              icon={Truck}
              onClick={() => navigate('/purchases/new')}
            />
            <QuickActionButton
              label={bn.dashboard.addProduct}
              icon={Package}
              onClick={() => navigate('/products/new')}
            />
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
            <div className="divide-y divide-border">
              {recentSales.map((sale, index) => (
                <motion.div
                  key={sale.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between px-6 py-3 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex flex-col">
                    <span className="font-medium text-foreground">{sale.customer}</span>
                    <span className="text-xs text-muted-foreground">{sale.id} • {sale.time}</span>
                  </div>
                  <span className="font-semibold text-foreground">{formatBDT(sale.amount)}</span>
                </motion.div>
              ))}
            </div>
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
            <div className="divide-y divide-border">
              {lowStockItems.map((item, index) => (
                <motion.div
                  key={item.sku}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between px-6 py-3 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex flex-col">
                    <span className="font-medium text-foreground">{item.name}</span>
                    <span className="text-xs text-muted-foreground">SKU: {item.sku}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-semibold text-destructive">{formatNumberBn(item.stock)} পিস</span>
                    <p className="text-xs text-muted-foreground">সীমা: {formatNumberBn(item.threshold)}</p>
                  </div>
                </motion.div>
              ))}
            </div>
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center justify-between rounded-lg bg-warning/10 p-4 border border-warning/20">
                <div>
                  <p className="text-sm text-muted-foreground">{bn.dashboard.next7Days}</p>
                  <p className="text-2xl font-bold text-warning">{formatNumberBn(demoStats.warrantyExpiring7)}</p>
                </div>
                <ShieldAlert className="h-10 w-10 text-warning/50" />
              </div>
              <div className="flex items-center justify-between rounded-lg bg-info/10 p-4 border border-info/20">
                <div>
                  <p className="text-sm text-muted-foreground">{bn.dashboard.next30Days}</p>
                  <p className="text-2xl font-bold text-info">{formatNumberBn(demoStats.warrantyExpiring30)}</p>
                </div>
                <ShieldAlert className="h-10 w-10 text-info/50" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}
