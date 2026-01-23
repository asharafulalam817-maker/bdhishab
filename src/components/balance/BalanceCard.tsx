import { useState } from 'react';
import { motion } from 'framer-motion';
import { Wallet, Plus, Minus, ArrowUpRight, ArrowDownRight, History, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { format } from 'date-fns';
import { bn as bnLocale } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { useBalance, BalanceTransaction } from '@/hooks/useBalance';

export function BalanceCard() {
  const { balance, transactions, isLoading, addBalance, deductBalance } = useBalance();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDeductDialogOpen, setIsDeductDialogOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [amount, setAmount] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddBalance = async () => {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) return;
    
    setIsSubmitting(true);
    const success = await addBalance(numAmount, notes || undefined);
    setIsSubmitting(false);
    
    if (success) {
      setAmount('');
      setNotes('');
      setIsAddDialogOpen(false);
    }
  };

  const handleDeductBalance = async () => {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) return;
    
    setIsSubmitting(true);
    const success = await deductBalance(numAmount, notes || undefined);
    setIsSubmitting(false);
    
    if (success) {
      setAmount('');
      setNotes('');
      setIsDeductDialogOpen(false);
    }
  };

  const formatCurrency = (value: number) => {
    return `৳${value.toLocaleString('bn-BD')}`;
  };

  const formatTime = (dateString: string) => {
    return format(new Date(dateString), 'dd MMM yyyy, hh:mm a', { locale: bnLocale });
  };

  const getTransactionIcon = (type: BalanceTransaction['transaction_type']) => {
    switch (type) {
      case 'sale':
        return <ArrowUpRight className="h-4 w-4 text-primary" />;
      case 'manual_add':
        return <Plus className="h-4 w-4 text-primary" />;
      case 'manual_deduct':
      case 'expense':
        return <Minus className="h-4 w-4 text-destructive" />;
      case 'refund':
        return <ArrowDownRight className="h-4 w-4 text-destructive" />;
      default:
        return <Wallet className="h-4 w-4" />;
    }
  };

  const getTransactionLabel = (type: BalanceTransaction['transaction_type']) => {
    switch (type) {
      case 'sale': return 'বিক্রয়';
      case 'manual_add': return 'যোগ';
      case 'manual_deduct': return 'কর্তন';
      case 'expense': return 'খরচ';
      case 'refund': return 'রিফান্ড';
      default: return type;
    }
  };

  // Calculate today's income
  const todayIncome = transactions
    .filter(t => {
      const txDate = new Date(t.created_at);
      const today = new Date();
      return txDate.toDateString() === today.toDateString() && t.amount > 0;
    })
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border-primary/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Wallet className="h-5 w-5 text-primary" />
                ব্যালেন্স
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsHistoryOpen(true)}
                className="text-xs"
              >
                <History className="h-4 w-4 mr-1" />
                ইতিহাস
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Current Balance */}
            <div className="text-center py-4">
              <p className="text-sm text-muted-foreground mb-1">মোট ব্যালেন্স</p>
              <p className="text-4xl font-bold text-primary">
                {isLoading ? '...' : formatCurrency(balance?.current_balance || 0)}
              </p>
              <div className="flex items-center justify-center gap-2 mt-2">
                <TrendingUp className="h-4 w-4 text-primary" />
                <span className="text-sm text-muted-foreground">
                  আজকের আয়: {formatCurrency(todayIncome)}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <Button
                onClick={() => setIsAddDialogOpen(true)}
                className="gap-2"
                variant="default"
              >
                <Plus className="h-4 w-4" />
                ব্যালেন্স যোগ
              </Button>
              <Button
                onClick={() => setIsDeductDialogOpen(true)}
                className="gap-2"
                variant="outline"
              >
                <Minus className="h-4 w-4" />
                ব্যালেন্স কর্তন
              </Button>
            </div>

            {/* Recent Transactions */}
            {transactions.length > 0 && (
              <div className="pt-2">
                <p className="text-xs text-muted-foreground mb-2">সাম্প্রতিক লেনদেন</p>
                <div className="space-y-2">
                  {transactions.slice(0, 3).map((tx) => (
                    <div
                      key={tx.id}
                      className="flex items-center justify-between p-2 rounded-lg bg-muted/50"
                    >
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-full bg-background">
                          {getTransactionIcon(tx.transaction_type)}
                        </div>
                        <div>
                          <p className="text-sm font-medium">
                            {getTransactionLabel(tx.transaction_type)}
                          </p>
                          <p className="text-[10px] text-muted-foreground">
                            {formatTime(tx.created_at)}
                          </p>
                        </div>
                      </div>
                      <p className={cn(
                        "font-semibold",
                        tx.amount > 0 ? "text-primary" : "text-destructive"
                      )}>
                        {tx.amount > 0 ? '+' : ''}{formatCurrency(tx.amount)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Add Balance Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5 text-primary" />
              ব্যালেন্স যোগ করুন
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>পরিমাণ (৳)</Label>
              <Input
                type="number"
                placeholder="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min="0"
                step="0.01"
              />
            </div>
            <div className="space-y-2">
              <Label>নোট (ঐচ্ছিক)</Label>
              <Textarea
                placeholder="ব্যালেন্স যোগের কারণ..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              বাতিল
            </Button>
            <Button onClick={handleAddBalance} disabled={isSubmitting || !amount}>
              {isSubmitting ? 'যোগ হচ্ছে...' : 'যোগ করুন'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Deduct Balance Dialog */}
      <Dialog open={isDeductDialogOpen} onOpenChange={setIsDeductDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Minus className="h-5 w-5 text-destructive" />
              ব্যালেন্স কর্তন করুন
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>পরিমাণ (৳)</Label>
              <Input
                type="number"
                placeholder="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min="0"
                step="0.01"
              />
            </div>
            <div className="space-y-2">
              <Label>কারণ</Label>
              <Textarea
                placeholder="ব্যালেন্স কর্তনের কারণ..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeductDialogOpen(false)}>
              বাতিল
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDeductBalance} 
              disabled={isSubmitting || !amount}
            >
              {isSubmitting ? 'কর্তন হচ্ছে...' : 'কর্তন করুন'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Transaction History Dialog */}
      <Dialog open={isHistoryOpen} onOpenChange={setIsHistoryOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <History className="h-5 w-5" />
              লেনদেনের ইতিহাস
            </DialogTitle>
          </DialogHeader>
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="all">সব</TabsTrigger>
              <TabsTrigger value="income">আয়</TabsTrigger>
              <TabsTrigger value="expense">ব্যয়</TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="mt-4">
              <TransactionList transactions={transactions} />
            </TabsContent>
            <TabsContent value="income" className="mt-4">
              <TransactionList 
                transactions={transactions.filter(t => t.amount > 0)} 
              />
            </TabsContent>
            <TabsContent value="expense" className="mt-4">
              <TransactionList 
                transactions={transactions.filter(t => t.amount < 0)} 
              />
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </>
  );
}

function TransactionList({ transactions }: { transactions: BalanceTransaction[] }) {
  const formatCurrency = (value: number) => `৳${Math.abs(value).toLocaleString('bn-BD')}`;
  const formatTime = (dateString: string) => {
    return format(new Date(dateString), 'dd MMM yyyy, hh:mm a', { locale: bnLocale });
  };

  const getTransactionIcon = (type: BalanceTransaction['transaction_type']) => {
    switch (type) {
      case 'sale':
        return <ArrowUpRight className="h-4 w-4 text-primary" />;
      case 'manual_add':
        return <Plus className="h-4 w-4 text-primary" />;
      case 'manual_deduct':
      case 'expense':
        return <Minus className="h-4 w-4 text-destructive" />;
      case 'refund':
        return <ArrowDownRight className="h-4 w-4 text-destructive" />;
      default:
        return <Wallet className="h-4 w-4" />;
    }
  };

  const getTransactionLabel = (type: BalanceTransaction['transaction_type']) => {
    switch (type) {
      case 'sale': return 'বিক্রয়';
      case 'manual_add': return 'যোগ';
      case 'manual_deduct': return 'কর্তন';
      case 'expense': return 'খরচ';
      case 'refund': return 'রিফান্ড';
      default: return type;
    }
  };

  if (transactions.length === 0) {
    return (
      <div className="py-8 text-center text-muted-foreground">
        <Wallet className="h-10 w-10 mx-auto mb-2 opacity-50" />
        <p>কোনো লেনদেন নেই</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-80">
      <div className="space-y-2">
        {transactions.map((tx) => (
          <div
            key={tx.id}
            className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-background">
                {getTransactionIcon(tx.transaction_type)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-medium">
                    {getTransactionLabel(tx.transaction_type)}
                  </p>
                  <Badge variant="outline" className="text-[10px]">
                    {tx.transaction_type}
                  </Badge>
                </div>
                {tx.notes && (
                  <p className="text-xs text-muted-foreground line-clamp-1">
                    {tx.notes}
                  </p>
                )}
                <p className="text-[10px] text-muted-foreground mt-0.5">
                  {formatTime(tx.created_at)}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className={cn(
                "font-bold",
                tx.amount > 0 ? "text-primary" : "text-destructive"
              )}>
                {tx.amount > 0 ? '+' : '-'}{formatCurrency(tx.amount)}
              </p>
              <p className="text-[10px] text-muted-foreground">
                ব্যালেন্স: {formatCurrency(tx.balance_after)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}
