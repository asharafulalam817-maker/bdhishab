import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft, Store, Users, ShoppingCart, Truck, Package, Wallet,
  CreditCard, Receipt, PiggyBank, TrendingUp, BarChart3, Loader2,
  Calendar, Phone, Mail, MapPin, Shield,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { bn as bnLocale } from 'date-fns/locale';
import { formatBDT } from '@/lib/constants';

interface StoreInfo {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  address: string | null;
  logo_url: string | null;
  is_blocked: boolean;
  created_at: string;
}

interface StoreStats {
  totalProducts: number;
  totalCustomers: number;
  totalSuppliers: number;
  totalSales: number;
  totalSalesAmount: number;
  totalPurchases: number;
  totalPurchasesAmount: number;
  totalExpenses: number;
  totalDueFromCustomers: number;
  totalDueToSuppliers: number;
  totalStockValue: number;
  balance: number;
  todaySales: number;
  todaySalesAmount: number;
  todayPurchasesAmount: number;
  todayExpenses: number;
  recentSales: any[];
  lowStockItems: any[];
}

export default function AdminStoreView() {
  const { id: storeId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [store, setStore] = useState<StoreInfo | null>(null);
  const [stats, setStats] = useState<StoreStats | null>(null);
  const [subscription, setSubscription] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const formatDate = (d: string) => format(new Date(d), 'dd MMM yyyy', { locale: bnLocale });

  useEffect(() => {
    if (!storeId) return;
    fetchAllData();
  }, [storeId]);

  const fetchAllData = async () => {
    if (!storeId) return;
    setIsLoading(true);

    // Fetch store info
    const { data: storeData } = await supabase
      .from('stores')
      .select('*')
      .eq('id', storeId)
      .single();

    if (!storeData) {
      setIsLoading(false);
      return;
    }
    setStore(storeData as StoreInfo);

    // Fetch all stats in parallel
    const [
      productsRes, customersRes, suppliersRes, salesRes, purchasesRes,
      expensesRes, balanceRes, subscriptionRes,
      todaySalesRes, todayPurchasesRes, todayExpensesRes,
      recentSalesRes, lowStockRes,
    ] = await Promise.all([
      supabase.from('products').select('id, current_stock, sale_price, purchase_cost', { count: 'exact' }).eq('store_id', storeId),
      supabase.from('customers').select('id, due_amount', { count: 'exact' }).eq('store_id', storeId),
      supabase.from('suppliers').select('id, due_amount', { count: 'exact' }).eq('store_id', storeId),
      supabase.from('sales').select('id, total', { count: 'exact' }).eq('store_id', storeId),
      supabase.from('purchases').select('id, total', { count: 'exact' }).eq('store_id', storeId),
      supabase.from('expenses').select('id, amount', { count: 'exact' }).eq('store_id', storeId),
      supabase.from('store_balance').select('current_balance').eq('store_id', storeId).single(),
      supabase.from('store_subscriptions').select('*, package:subscription_packages(name, name_bn)').eq('store_id', storeId).single(),
      // Today's data
      supabase.from('sales').select('id, total', { count: 'exact' }).eq('store_id', storeId).gte('sale_date', new Date().toISOString().split('T')[0]),
      supabase.from('purchases').select('id, total').eq('store_id', storeId).gte('purchase_date', new Date().toISOString().split('T')[0]),
      supabase.from('expenses').select('id, amount').eq('store_id', storeId).gte('expense_date', new Date().toISOString().split('T')[0]),
      // Recent sales
      supabase.from('sales').select('id, total, sale_date, payment_status, customer:customers(name)').eq('store_id', storeId).order('created_at', { ascending: false }).limit(10),
      // Low stock
      supabase.from('products').select('id, name, current_stock, low_stock_threshold').eq('store_id', storeId).lt('current_stock', 10).order('current_stock').limit(10),
    ]);

    const totalStockValue = (productsRes.data || []).reduce((sum, p) => sum + ((p.current_stock || 0) * (p.sale_price || 0)), 0);
    const totalDueFromCustomers = (customersRes.data || []).reduce((sum, c) => sum + (c.due_amount || 0), 0);
    const totalDueToSuppliers = (suppliersRes.data || []).reduce((sum, s) => sum + (s.due_amount || 0), 0);
    const totalSalesAmount = (salesRes.data || []).reduce((sum, s) => sum + Number(s.total || 0), 0);
    const totalPurchasesAmount = (purchasesRes.data || []).reduce((sum, p) => sum + Number(p.total || 0), 0);
    const totalExpensesAmount = (expensesRes.data || []).reduce((sum, e) => sum + Number(e.amount || 0), 0);
    const todaySalesAmount = (todaySalesRes.data || []).reduce((sum, s) => sum + Number(s.total || 0), 0);
    const todayPurchasesAmount = (todayPurchasesRes.data || []).reduce((sum, p) => sum + Number(p.total || 0), 0);
    const todayExpensesAmount = (todayExpensesRes.data || []).reduce((sum, e) => sum + Number(e.amount || 0), 0);

    setStats({
      totalProducts: productsRes.count || 0,
      totalCustomers: customersRes.count || 0,
      totalSuppliers: suppliersRes.count || 0,
      totalSales: salesRes.count || 0,
      totalSalesAmount,
      totalPurchases: purchasesRes.count || 0,
      totalPurchasesAmount,
      totalExpenses: totalExpensesAmount,
      totalDueFromCustomers,
      totalDueToSuppliers,
      totalStockValue,
      balance: balanceRes.data?.current_balance || 0,
      todaySales: todaySalesRes.count || 0,
      todaySalesAmount,
      todayPurchasesAmount,
      todayExpenses: todayExpensesAmount,
      recentSales: recentSalesRes.data || [],
      lowStockItems: lowStockRes.data || [],
    });

    if (subscriptionRes.data) {
      setSubscription({
        ...subscriptionRes.data,
        package_name: (subscriptionRes.data.package as any)?.name_bn || (subscriptionRes.data.package as any)?.name,
      });
    }

    setIsLoading(false);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!store || !stats) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">স্টোর পাওয়া যায়নি</p>
        <Button variant="outline" className="mt-4" onClick={() => navigate('/admin/subscribers')}>
          <ArrowLeft className="h-4 w-4 mr-2" /> ফিরে যান
        </Button>
      </div>
    );
  }

  const todayProfit = stats.todaySalesAmount - stats.todayPurchasesAmount - stats.todayExpenses;
  const totalCapital = stats.balance + stats.totalStockValue + stats.totalDueFromCustomers;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex items-center gap-4 flex-1">
          <Avatar className="h-14 w-14">
            {store.logo_url ? <AvatarImage src={store.logo_url} /> : null}
            <AvatarFallback className="bg-primary/10 text-primary text-xl font-bold">{store.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-xl lg:text-2xl font-bold text-foreground">{store.name}</h1>
            <div className="flex items-center gap-2 text-sm text-muted-foreground flex-wrap">
              {store.phone && <span className="flex items-center gap-1"><Phone className="h-3 w-3" />{store.phone}</span>}
              {store.email && <span className="flex items-center gap-1"><Mail className="h-3 w-3" />{store.email}</span>}
              {store.address && <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{store.address}</span>}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {store.is_blocked ? <Badge variant="destructive">ব্লক</Badge> : <Badge variant="outline" className="border-emerald-500 text-emerald-600">সক্রিয়</Badge>}
          {subscription && (
            <Badge className={
              new Date(subscription.end_date) < new Date() ? 'bg-destructive' :
              subscription.subscription_type === 'trial' ? 'bg-amber-500' : 'bg-emerald-600'
            }>
              {new Date(subscription.end_date) < new Date() ? 'মেয়াদোত্তীর্ণ' :
               subscription.subscription_type === 'trial' ? 'ট্রায়াল' : 'পেইড'}
            </Badge>
          )}
        </div>
      </div>

      {/* Subscription Info */}
      {subscription && (
        <Card className="bg-muted/50">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="h-4 w-4 text-primary" />
              <span className="font-semibold text-sm">সাবস্ক্রিপশন তথ্য</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
              <div><span className="text-muted-foreground">প্যাকেজ:</span> <strong>{subscription.package_name || 'N/A'}</strong></div>
              <div><span className="text-muted-foreground">ধরন:</span> <strong>{subscription.subscription_type === 'paid' ? 'পেইড' : 'ট্রায়াল'}</strong></div>
              <div><span className="text-muted-foreground">শুরু:</span> <strong>{formatDate(subscription.start_date)}</strong></div>
              <div><span className="text-muted-foreground">মেয়াদ:</span> <strong>{formatDate(subscription.end_date)}</strong></div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Balance Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card className="bg-gradient-to-br from-primary via-primary to-primary/80 text-primary-foreground border-0">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-1 opacity-90"><Wallet className="h-4 w-4" /><span className="text-xs font-semibold">ক্যাশ ব্যালেন্স</span></div>
            <p className="text-xl lg:text-2xl font-black">{formatBDT(stats.balance)}</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-emerald-600 to-emerald-500 text-white border-0">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-1 opacity-90"><Package className="h-4 w-4" /><span className="text-xs font-semibold">স্টক মূল্য</span></div>
            <p className="text-xl lg:text-2xl font-black">{formatBDT(stats.totalStockValue)}</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-orange-500 to-orange-400 text-white border-0">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-1 opacity-90"><CreditCard className="h-4 w-4" /><span className="text-xs font-semibold">গ্রাহক বকেয়া</span></div>
            <p className="text-xl lg:text-2xl font-black">{formatBDT(stats.totalDueFromCustomers)}</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-violet-600 to-violet-500 text-white border-0">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-1 opacity-90"><PiggyBank className="h-4 w-4" /><span className="text-xs font-semibold">মোট মূলধন</span></div>
            <p className="text-xl lg:text-2xl font-black">{formatBDT(totalCapital)}</p>
          </CardContent>
        </Card>
      </div>

      {/* Today's Stats */}
      <div>
        <h2 className="text-lg font-bold mb-3">আজকের সারসংক্ষেপ</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatMini icon={ShoppingCart} label="বিক্রয়" value={formatBDT(stats.todaySalesAmount)} sub={`${stats.todaySales} টি`} color="text-blue-600" />
          <StatMini icon={Truck} label="ক্রয়" value={formatBDT(stats.todayPurchasesAmount)} color="text-purple-600" />
          <StatMini icon={Receipt} label="খরচ" value={formatBDT(stats.todayExpenses)} color="text-red-500" />
          <StatMini icon={TrendingUp} label="লাভ" value={formatBDT(todayProfit)} color={todayProfit >= 0 ? 'text-emerald-600' : 'text-red-500'} />
        </div>
      </div>

      {/* Overall Stats */}
      <div>
        <h2 className="text-lg font-bold mb-3">সামগ্রিক পরিসংখ্যান</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <OverviewCard icon={Package} label="পণ্য" value={stats.totalProducts} />
          <OverviewCard icon={Users} label="গ্রাহক" value={stats.totalCustomers} />
          <OverviewCard icon={Truck} label="সরবরাহকারী" value={stats.totalSuppliers} />
          <OverviewCard icon={ShoppingCart} label="মোট বিক্রয়" value={stats.totalSales} sub={formatBDT(stats.totalSalesAmount)} />
          <OverviewCard icon={Truck} label="মোট ক্রয়" value={stats.totalPurchases} sub={formatBDT(stats.totalPurchasesAmount)} />
          <OverviewCard icon={CreditCard} label="সরবরাহকারী বকেয়া" value={formatBDT(stats.totalDueToSuppliers)} />
        </div>
      </div>

      {/* Recent Sales & Low Stock */}
      <div className="grid lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2"><ShoppingCart className="h-4 w-4" /> সাম্প্রতিক বিক্রয়</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {stats.recentSales.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-6">কোন বিক্রয় নেই</p>
            ) : (
              <div className="divide-y">
                {stats.recentSales.map((sale) => (
                  <div key={sale.id} className="flex items-center justify-between px-4 py-3">
                    <div>
                      <p className="text-sm font-medium">{(sale.customer as any)?.name || 'ওয়াক-ইন'}</p>
                      <p className="text-xs text-muted-foreground">{formatDate(sale.sale_date)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold">{formatBDT(Number(sale.total || 0))}</p>
                      <Badge variant={sale.payment_status === 'paid' ? 'default' : 'destructive'} className="text-[10px]">
                        {sale.payment_status === 'paid' ? 'পেইড' : sale.payment_status === 'partial' ? 'আংশিক' : 'বাকি'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2"><Package className="h-4 w-4 text-amber-500" /> কম স্টক পণ্য</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {stats.lowStockItems.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-6">কম স্টক পণ্য নেই</p>
            ) : (
              <div className="divide-y">
                {stats.lowStockItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between px-4 py-3">
                    <p className="text-sm font-medium">{item.name}</p>
                    <Badge variant={item.current_stock <= 0 ? 'destructive' : 'outline'} className="text-xs">
                      {item.current_stock} টি
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}

// Helper components
function StatMini({ icon: Icon, label, value, sub, color }: { icon: any; label: string; value: string; sub?: string; color?: string }) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-1">
          <Icon className={`h-4 w-4 ${color || 'text-primary'}`} />
          <span className="text-xs font-medium text-muted-foreground">{label}</span>
        </div>
        <p className="text-lg font-bold">{value}</p>
        {sub && <p className="text-xs text-muted-foreground">{sub}</p>}
      </CardContent>
    </Card>
  );
}

function OverviewCard({ icon: Icon, label, value, sub }: { icon: any; label: string; value: string | number; sub?: string }) {
  return (
    <Card>
      <CardContent className="p-4 text-center">
        <Icon className="h-5 w-5 mx-auto text-primary mb-2" />
        <p className="text-xl font-bold">{value}</p>
        <p className="text-xs text-muted-foreground">{label}</p>
        {sub && <p className="text-xs font-medium text-primary mt-1">{sub}</p>}
      </CardContent>
    </Card>
  );
}
