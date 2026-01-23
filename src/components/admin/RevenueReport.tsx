import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/integrations/supabase/client';
import { format, subMonths, startOfMonth, endOfMonth, parseISO } from 'date-fns';
import { bn as bnLocale } from 'date-fns/locale';
import { 
  TrendingUp, DollarSign, Users, Calendar, CreditCard,
  ArrowUpRight, ArrowDownRight
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

interface PaymentData {
  id: string;
  amount: number;
  status: string;
  created_at: string;
  payment_method: string;
  store_id: string;
}

interface SubscriptionData {
  id: string;
  store_id: string;
  subscription_type: string;
  start_date: string;
  created_at: string;
}

interface MonthlyData {
  month: string;
  monthLabel: string;
  revenue: number;
  subscribers: number;
  paidSubscribers: number;
  trialSubscribers: number;
}

export function RevenueReport() {
  const [payments, setPayments] = useState<PaymentData[]>([]);
  const [subscriptions, setSubscriptions] = useState<SubscriptionData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [period, setPeriod] = useState<'6months' | '12months'>('6months');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Fetch verified payments from last 12 months
      const startDate = format(subMonths(new Date(), 12), 'yyyy-MM-dd');
      
      const [paymentsResult, subscriptionsResult] = await Promise.all([
        supabase
          .from('subscription_payments')
          .select('id, amount, status, created_at, payment_method, store_id')
          .eq('status', 'verified')
          .gte('created_at', startDate)
          .order('created_at', { ascending: false }),
        supabase
          .from('store_subscriptions')
          .select('id, store_id, subscription_type, start_date, created_at')
          .gte('created_at', startDate)
          .order('created_at', { ascending: false })
      ]);

      if (paymentsResult.data) {
        setPayments(paymentsResult.data);
      }
      if (subscriptionsResult.data) {
        setSubscriptions(subscriptionsResult.data);
      }
    } catch (error) {
      console.error('Error fetching revenue data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate monthly data
  const monthlyData = useMemo(() => {
    const months = period === '6months' ? 6 : 12;
    const data: MonthlyData[] = [];
    
    for (let i = months - 1; i >= 0; i--) {
      const monthDate = subMonths(new Date(), i);
      const monthStart = startOfMonth(monthDate);
      const monthEnd = endOfMonth(monthDate);
      const monthKey = format(monthDate, 'yyyy-MM');
      const monthLabel = format(monthDate, 'MMM', { locale: bnLocale });

      // Calculate revenue for this month
      const monthRevenue = payments
        .filter(p => {
          const paymentDate = parseISO(p.created_at);
          return paymentDate >= monthStart && paymentDate <= monthEnd;
        })
        .reduce((sum, p) => sum + Number(p.amount), 0);

      // Calculate subscribers for this month
      const monthSubscriptions = subscriptions.filter(s => {
        const subDate = parseISO(s.created_at);
        return subDate >= monthStart && subDate <= monthEnd;
      });

      const paidSubs = monthSubscriptions.filter(s => s.subscription_type === 'paid').length;
      const trialSubs = monthSubscriptions.filter(s => s.subscription_type === 'trial').length;

      data.push({
        month: monthKey,
        monthLabel,
        revenue: monthRevenue,
        subscribers: monthSubscriptions.length,
        paidSubscribers: paidSubs,
        trialSubscribers: trialSubs
      });
    }

    return data;
  }, [payments, subscriptions, period]);

  // Calculate summary stats
  const summary = useMemo(() => {
    const currentMonth = format(new Date(), 'yyyy-MM');
    const lastMonth = format(subMonths(new Date(), 1), 'yyyy-MM');

    const currentMonthData = monthlyData.find(m => m.month === currentMonth);
    const lastMonthData = monthlyData.find(m => m.month === lastMonth);

    const totalRevenue = monthlyData.reduce((sum, m) => sum + m.revenue, 0);
    const totalSubscribers = monthlyData.reduce((sum, m) => sum + m.subscribers, 0);
    const totalPaid = monthlyData.reduce((sum, m) => sum + m.paidSubscribers, 0);
    
    const currentRevenue = currentMonthData?.revenue || 0;
    const lastRevenue = lastMonthData?.revenue || 0;
    const revenueChange = lastRevenue > 0 
      ? ((currentRevenue - lastRevenue) / lastRevenue * 100).toFixed(1)
      : currentRevenue > 0 ? '100' : '0';

    const currentSubs = currentMonthData?.subscribers || 0;
    const lastSubs = lastMonthData?.subscribers || 0;
    const subsChange = lastSubs > 0 
      ? ((currentSubs - lastSubs) / lastSubs * 100).toFixed(1)
      : currentSubs > 0 ? '100' : '0';

    return {
      totalRevenue,
      totalSubscribers,
      totalPaid,
      currentRevenue,
      currentSubs,
      revenueChange: Number(revenueChange),
      subsChange: Number(subsChange),
      avgRevenuePerMonth: totalRevenue / monthlyData.length || 0
    };
  }, [monthlyData]);

  // Payment method breakdown
  const paymentMethodStats = useMemo(() => {
    const methods: Record<string, number> = {};
    payments.forEach(p => {
      methods[p.payment_method] = (methods[p.payment_method] || 0) + Number(p.amount);
    });
    return Object.entries(methods).map(([method, amount]) => ({
      method: method === 'bkash' ? 'বিকাশ' : method === 'nagad' ? 'নগদ' : method === 'rocket' ? 'রকেট' : method,
      amount
    }));
  }, [payments]);

  const formatCurrency = (amount: number) => {
    return `৳${amount.toLocaleString('bn-BD')}`;
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <Card key={i}>
              <CardContent className="pt-4">
                <Skeleton className="h-16 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
        <Card>
          <CardContent className="pt-4">
            <Skeleton className="h-64 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <DollarSign className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-xl font-bold">{formatCurrency(summary.totalRevenue)}</p>
                <p className="text-xs text-muted-foreground">মোট রেভিনিউ</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <TrendingUp className="h-5 w-5 text-primary" />
              </div>
              <div>
                <div className="flex items-center gap-1">
                  <p className="text-xl font-bold">{formatCurrency(summary.currentRevenue)}</p>
                  <Badge 
                    variant={summary.revenueChange >= 0 ? "default" : "destructive"}
                    className="text-[10px] px-1"
                  >
                    {summary.revenueChange >= 0 ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                    {Math.abs(summary.revenueChange)}%
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">এই মাসে</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-secondary/50">
                <Users className="h-5 w-5 text-secondary-foreground" />
              </div>
              <div>
                <div className="flex items-center gap-1">
                  <p className="text-xl font-bold">{summary.currentSubs}</p>
                  <Badge 
                    variant={summary.subsChange >= 0 ? "default" : "destructive"}
                    className="text-[10px] px-1"
                  >
                    {summary.subsChange >= 0 ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                    {Math.abs(summary.subsChange)}%
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">এই মাসে নতুন</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-accent">
                <CreditCard className="h-5 w-5 text-accent-foreground" />
              </div>
              <div>
                <p className="text-xl font-bold">{summary.totalPaid}</p>
                <p className="text-xs text-muted-foreground">পেইড সাবস্ক্রাইবার</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <Tabs value={period} onValueChange={(v) => setPeriod(v as '6months' | '12months')}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            মাসিক ট্রেন্ড
          </h3>
          <TabsList>
            <TabsTrigger value="6months">৬ মাস</TabsTrigger>
            <TabsTrigger value="12months">১২ মাস</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value={period} className="mt-0">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Revenue Chart */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  মাসিক রেভিনিউ
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={monthlyData}>
                      <defs>
                        <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis 
                        dataKey="monthLabel" 
                        tick={{ fontSize: 12 }}
                        className="text-muted-foreground"
                      />
                      <YAxis 
                        tick={{ fontSize: 12 }}
                        tickFormatter={(v) => `৳${v}`}
                        className="text-muted-foreground"
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'hsl(var(--popover))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px'
                        }}
                        formatter={(value: number) => [formatCurrency(value), 'রেভিনিউ']}
                      />
                      <Area
                        type="monotone"
                        dataKey="revenue"
                        stroke="hsl(var(--primary))"
                        fill="url(#revenueGradient)"
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Subscribers Chart */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  নতুন সাবস্ক্রাইবার
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis 
                        dataKey="monthLabel" 
                        tick={{ fontSize: 12 }}
                        className="text-muted-foreground"
                      />
                      <YAxis 
                        tick={{ fontSize: 12 }}
                        className="text-muted-foreground"
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'hsl(var(--popover))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px'
                        }}
                      />
                      <Legend />
                      <Bar 
                        dataKey="paidSubscribers" 
                        name="পেইড" 
                        fill="hsl(var(--primary))" 
                        radius={[4, 4, 0, 0]}
                      />
                      <Bar 
                        dataKey="trialSubscribers" 
                        name="ট্রায়াল" 
                        fill="hsl(var(--muted-foreground))" 
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Payment Methods */}
      {paymentMethodStats.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">পেমেন্ট মেথড ব্রেকডাউন</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              {paymentMethodStats.map(pm => (
                <div 
                  key={pm.method} 
                  className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 min-w-[150px]"
                >
                  <div className="p-2 rounded-full bg-primary/10">
                    <CreditCard className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{pm.method}</p>
                    <p className="text-sm text-muted-foreground">{formatCurrency(pm.amount)}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
