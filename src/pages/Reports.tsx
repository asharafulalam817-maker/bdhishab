import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingBag,
  Users,
  Package,
  Calendar,
  Download,
  ArrowUp,
  ArrowDown,
  PieChart,
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { formatBDT, formatNumberBn, formatDateBn } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useReports } from '@/hooks/useReports';
import { ProfitLossReport } from '@/components/reports/ProfitLossReport';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';

export default function Reports() {
  const { t, language } = useLanguage();
  const { summary, chartData, topProducts, customerDues, profitMargin } = useReports();
  const [activeTab, setActiveTab] = useState('overview');

  const formatNumber = (num: number) => {
    return language === 'bn' ? formatNumberBn(num) : num.toLocaleString('en-US');
  };

  const formatCurrency = (amount: number) => {
    return language === 'bn' ? formatBDT(amount) : `৳ ${amount.toLocaleString('en-US')}`;
  };

  const formatDate = (date: string) => {
    return language === 'bn' ? formatDateBn(date) : new Date(date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const statCards = [
    {
      title: t('reports.todaySales'),
      value: formatCurrency(summary.todaySales),
      subtext: `${formatNumber(summary.todayTransactions)}${t('reports.transactions')}`,
      icon: ShoppingBag,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      title: t('reports.todayProfit'),
      value: formatCurrency(summary.todayProfit),
      subtext: `${t('reports.margin')} ${profitMargin}%`,
      icon: TrendingUp,
      color: 'text-success',
      bgColor: 'bg-success/10',
    },
    {
      title: t('reports.monthSales'),
      value: formatCurrency(summary.monthSales),
      subtext: `${formatNumber(summary.monthTransactions)}${t('reports.transactions')}`,
      icon: Calendar,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
    },
    {
      title: t('reports.totalDue'),
      value: formatCurrency(summary.totalCustomerDue),
      subtext: t('reports.fromCustomers'),
      icon: Users,
      color: 'text-destructive',
      bgColor: 'bg-destructive/10',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title flex items-center gap-2">
            <TrendingUp className="h-6 w-6" />
            {t('reports.title')}
          </h1>
          <p className="text-muted-foreground">{t('reports.description')}</p>
        </div>
        <Button variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          {t('reports.export')}
        </Button>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="overview" className="gap-2">
            <ShoppingBag className="h-4 w-4" />
            {t('reports.overview')}
          </TabsTrigger>
          <TabsTrigger value="profit-loss" className="gap-2">
            <PieChart className="h-4 w-4" />
            {t('reports.profitLoss')}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                    <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.subtext}</p>
                  </div>
                  <div className={`h-10 w-10 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
                    <stat.icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{t('reports.weeklySales')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="date" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip 
                    formatter={(value: number) => [formatCurrency(value), t('reports.sales')]}
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="sales"
                    stroke="hsl(var(--primary))"
                    fillOpacity={1}
                    fill="url(#colorSales)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Profit Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{t('reports.weeklyProfit')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="date" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip 
                    formatter={(value: number) => [formatCurrency(value), t('reports.profitLoss')]}
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar dataKey="profit" fill="hsl(var(--success))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tables Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Package className="h-4 w-4" />
              {t('reports.topSelling')}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('reports.product')}</TableHead>
                  <TableHead className="text-center">{t('reports.sales')}</TableHead>
                  <TableHead className="text-right">{t('reports.revenue')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topProducts.slice(0, 5).map((product, index) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">{index + 1}.</span>
                        <div>
                          <p className="font-medium">{product.name}</p>
                          <p className="text-xs text-muted-foreground">{product.sku}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="secondary">{formatNumber(product.quantitySold)} {t('reports.pieces')}</Badge>
                    </TableCell>
                    <TableCell className="text-right font-medium">{formatCurrency(product.revenue)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Customer Dues */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Users className="h-4 w-4" />
              {t('reports.dueList')}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('reports.customer')}</TableHead>
                  <TableHead>{t('reports.lastPurchase')}</TableHead>
                  <TableHead className="text-right">{t('reports.due')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customerDues.map((customer) => (
                  <TableRow key={customer.customerId}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{customer.customerName}</p>
                        <p className="text-xs text-muted-foreground">{customer.phone}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDate(customer.lastSaleDate)}
                    </TableCell>
                    <TableCell className="text-right font-medium text-destructive">
                      {formatCurrency(customer.totalDue)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
        </TabsContent>

        <TabsContent value="profit-loss">
          <ProfitLossReport />
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}