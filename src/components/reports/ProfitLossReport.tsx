import { motion } from 'framer-motion';
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  ShoppingCart,
  Truck,
  Receipt,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { useProfitLoss } from '@/hooks/useProfitLoss';
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
  Legend,
  ComposedChart,
  Line,
} from 'recharts';

const formatBDT = (amount: number) => `৳${amount.toLocaleString('bn-BD')}`;
const formatPercent = (value: number) => `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`;

export function ProfitLossReport() {
  const { 
    isLoading, 
    summary, 
    chartData, 
    comparisonWithLastMonth,
    currentMonthData 
  } = useProfitLoss(6);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-8 w-32" />
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardContent className="p-6">
              <Skeleton className="h-[300px] w-full" />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <Skeleton className="h-[300px] w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      title: 'মোট বিক্রয়',
      value: formatBDT(summary.totalSales),
      change: comparisonWithLastMonth?.salesChange,
      icon: ShoppingCart,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      title: 'মোট ক্রয়',
      value: formatBDT(summary.totalPurchases),
      change: null,
      icon: Truck,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
    },
    {
      title: 'মোট খরচ',
      value: formatBDT(summary.totalExpenses),
      change: comparisonWithLastMonth?.expenseChange,
      icon: Receipt,
      color: 'text-warning',
      bgColor: 'bg-warning/10',
      invertChange: true,
    },
    {
      title: 'নিট লাভ/ক্ষতি',
      value: formatBDT(Math.abs(summary.netProfit)),
      isProfit: summary.netProfit >= 0,
      change: comparisonWithLastMonth?.profitChange,
      icon: summary.netProfit >= 0 ? TrendingUp : TrendingDown,
      color: summary.netProfit >= 0 ? 'text-success' : 'text-destructive',
      bgColor: summary.netProfit >= 0 ? 'bg-success/10' : 'bg-destructive/10',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
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
                    <p className={`text-xl md:text-2xl font-bold ${stat.color}`}>
                      {stat.isProfit === false && '-'}{stat.value}
                    </p>
                    {stat.change !== null && stat.change !== undefined && (
                      <div className="flex items-center gap-1">
                        {stat.invertChange ? (
                          stat.change <= 0 ? (
                            <ArrowDownRight className="h-3 w-3 text-success" />
                          ) : (
                            <ArrowUpRight className="h-3 w-3 text-destructive" />
                          )
                        ) : (
                          stat.change >= 0 ? (
                            <ArrowUpRight className="h-3 w-3 text-success" />
                          ) : (
                            <ArrowDownRight className="h-3 w-3 text-destructive" />
                          )
                        )}
                        <span className={`text-xs ${
                          stat.invertChange 
                            ? (stat.change <= 0 ? 'text-success' : 'text-destructive')
                            : (stat.change >= 0 ? 'text-success' : 'text-destructive')
                        }`}>
                          {formatPercent(stat.change)}
                        </span>
                        <span className="text-xs text-muted-foreground">গত মাস</span>
                      </div>
                    )}
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

      {/* Profit Breakdown Card */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Wallet className="h-4 w-4" />
            এই মাসের লাভ-ক্ষতি বিশ্লেষণ
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-primary/5 border border-primary/10">
              <span className="text-sm">মোট বিক্রয়</span>
              <span className="font-semibold text-primary">{formatBDT(summary.totalSales)}</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <span className="text-sm flex items-center gap-2">
                <Minus className="h-3 w-3" /> মোট ক্রয় মূল্য
              </span>
              <span className="font-semibold text-muted-foreground">({formatBDT(summary.totalPurchases)})</span>
            </div>
            <div className="border-t pt-3">
              <div className="flex items-center justify-between p-3 rounded-lg bg-success/5 border border-success/10">
                <span className="text-sm font-medium">মোট লাভ (Gross Profit)</span>
                <span className={`font-bold ${summary.grossProfit >= 0 ? 'text-success' : 'text-destructive'}`}>
                  {formatBDT(summary.grossProfit)}
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <span className="text-sm flex items-center gap-2">
                <Minus className="h-3 w-3" /> মোট খরচ
              </span>
              <span className="font-semibold text-muted-foreground">({formatBDT(summary.totalExpenses)})</span>
            </div>
            <div className="border-t pt-3">
              <div className={`flex items-center justify-between p-4 rounded-lg ${
                summary.netProfit >= 0 ? 'bg-success/10 border border-success/20' : 'bg-destructive/10 border border-destructive/20'
              }`}>
                <span className="font-medium">
                  {summary.netProfit >= 0 ? '🎉 নিট লাভ (Net Profit)' : '⚠️ নিট ক্ষতি (Net Loss)'}
                </span>
                <span className={`text-xl font-bold ${summary.netProfit >= 0 ? 'text-success' : 'text-destructive'}`}>
                  {formatBDT(Math.abs(summary.netProfit))}
                </span>
              </div>
            </div>
            {summary.totalSales > 0 && (
              <div className="text-center p-3 rounded-lg bg-muted/30">
                <span className="text-sm text-muted-foreground">প্রফিট মার্জিন: </span>
                <Badge variant={summary.profitMargin >= 0 ? 'default' : 'destructive'} className="ml-1">
                  {summary.profitMargin.toFixed(1)}%
                </Badge>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Trend Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">মাসিক আয়-ব্যয় প্রবণতা</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="month" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip 
                    formatter={(value: number, name: string) => {
                      const labels: Record<string, string> = {
                        sales: 'বিক্রয়',
                        purchases: 'ক্রয়',
                        expenses: 'খরচ',
                        profit: 'লাভ',
                      };
                      return [formatBDT(value), labels[name] || name];
                    }}
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Legend 
                    formatter={(value) => {
                      const labels: Record<string, string> = {
                        sales: 'বিক্রয়',
                        purchases: 'ক্রয়',
                        expenses: 'খরচ',
                        profit: 'লাভ',
                      };
                      return labels[value] || value;
                    }}
                  />
                  <Bar dataKey="sales" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="purchases" fill="hsl(var(--muted-foreground))" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="expenses" fill="hsl(var(--warning))" radius={[4, 4, 0, 0]} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Profit Trend Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">মাসিক লাভ প্রবণতা</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--success))" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(var(--success))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="month" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip 
                    formatter={(value: number) => [formatBDT(value), 'নিট লাভ']}
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="profit"
                    stroke="hsl(var(--success))"
                    fillOpacity={1}
                    fill="url(#colorProfit)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
