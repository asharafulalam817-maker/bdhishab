import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Receipt, 
  Plus, 
  History, 
  Trash2,
  Calendar,
  FileText,
  Tag
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useExpenses, EXPENSE_CATEGORIES, ExpenseCategory } from '@/hooks/useExpenses';
import { format } from 'date-fns';
import { bn as bnLocale } from 'date-fns/locale';

export function ExpenseCard() {
  const { 
    expenses, 
    isLoading, 
    todayExpense, 
    monthExpense,
    addExpense,
    deleteExpense 
  } = useExpenses();
  
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [historyDialogOpen, setHistoryDialogOpen] = useState(false);
  const [category, setCategory] = useState<ExpenseCategory>('other');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [expenseDate, setExpenseDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');
  const [deductFromBalance, setDeductFromBalance] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddExpense = async () => {
    const amountNum = parseFloat(amount);
    if (!amountNum || amountNum <= 0 || !description.trim()) return;
    
    setIsSubmitting(true);
    await addExpense(category, amountNum, description.trim(), expenseDate, notes.trim() || undefined, deductFromBalance);
    setIsSubmitting(false);
    
    // Reset form
    setAmount('');
    setDescription('');
    setCategory('other');
    setExpenseDate(new Date().toISOString().split('T')[0]);
    setNotes('');
    setDeductFromBalance(true);
    setAddDialogOpen(false);
  };

  const getCategoryInfo = (cat: ExpenseCategory) => {
    return EXPENSE_CATEGORIES.find(c => c.value === cat) || EXPENSE_CATEGORIES[7];
  };

  const formatDate = (dateStr: string) => {
    try {
      return format(new Date(dateStr), 'd MMM', { locale: bnLocale });
    } catch {
      return dateStr;
    }
  };

  const formatBDT = (amount: number) => {
    return `৳${amount.toLocaleString('bn-BD')}`;
  };

  if (isLoading) {
    return (
      <Card className="h-full">
        <CardHeader className="pb-3">
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-20 w-full mb-4" />
          <Skeleton className="h-10 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Receipt className="h-5 w-5 text-destructive" />
          খরচ ট্র্যাকার
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="rounded-lg bg-destructive/10 p-3 border border-destructive/20">
            <p className="text-xs text-muted-foreground">আজকের খরচ</p>
            <p className="text-lg font-bold text-destructive">{formatBDT(todayExpense)}</p>
          </div>
          <div className="rounded-lg bg-warning/10 p-3 border border-warning/20">
            <p className="text-xs text-muted-foreground">এই মাসে</p>
            <p className="text-lg font-bold text-warning">{formatBDT(monthExpense)}</p>
          </div>
        </div>

        {/* Recent expenses */}
        <div className="flex-1 min-h-0">
          <p className="text-sm text-muted-foreground mb-2">সাম্প্রতিক খরচ</p>
          <div className="space-y-2">
            {expenses.slice(0, 3).map((expense, index) => {
              const catInfo = getCategoryInfo(expense.category);
              return (
                <motion.div
                  key={expense.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-2 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{catInfo.icon}</span>
                    <div>
                      <p className="text-sm font-medium">{expense.description}</p>
                      <p className="text-xs text-muted-foreground">{formatDate(expense.expense_date)}</p>
                    </div>
                  </div>
                  <span className="font-semibold text-destructive">-{formatBDT(expense.amount)}</span>
                </motion.div>
              );
            })}
            {expenses.length === 0 && (
              <div className="text-center py-4 text-muted-foreground text-sm">
                কোন খরচ নেই
              </div>
            )}
          </div>
        </div>

        {/* Action buttons */}
        <div className="grid grid-cols-2 gap-2 mt-4">
          <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                খরচ যোগ
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>নতুন খরচ যোগ করুন</DialogTitle>
                <DialogDescription>
                  দোকানের খরচের বিবরণ দিন
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>ক্যাটাগরি</Label>
                  <Select value={category} onValueChange={(v) => setCategory(v as ExpenseCategory)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {EXPENSE_CATEGORIES.map((cat) => (
                        <SelectItem key={cat.value} value={cat.value}>
                          <span className="flex items-center gap-2">
                            <span>{cat.icon}</span>
                            <span>{cat.label}</span>
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>পরিমাণ (৳)</Label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>বিবরণ</Label>
                  <Input
                    placeholder="যেমন: দোকান ভাড়া জানুয়ারি"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>তারিখ</Label>
                  <Input
                    type="date"
                    value={expenseDate}
                    onChange={(e) => setExpenseDate(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>নোট (ঐচ্ছিক)</Label>
                  <Textarea
                    placeholder="অতিরিক্ত তথ্য..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={2}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="deductBalance"
                    checked={deductFromBalance}
                    onCheckedChange={(checked) => setDeductFromBalance(checked as boolean)}
                  />
                  <Label htmlFor="deductBalance" className="text-sm cursor-pointer">
                    ব্যালেন্স থেকে বাদ দিন
                  </Label>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setAddDialogOpen(false)}>
                  বাতিল
                </Button>
                <Button 
                  onClick={handleAddExpense} 
                  disabled={isSubmitting || !amount || !description.trim()}
                >
                  {isSubmitting ? 'যোগ হচ্ছে...' : 'খরচ যোগ করুন'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog open={historyDialogOpen} onOpenChange={setHistoryDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="gap-2">
                <History className="h-4 w-4" />
                ইতিহাস
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>খরচের ইতিহাস</DialogTitle>
                <DialogDescription>
                  সকল খরচের তালিকা
                </DialogDescription>
              </DialogHeader>
              <ScrollArea className="h-[400px] pr-4">
                <div className="space-y-2">
                  {expenses.map((expense) => {
                    const catInfo = getCategoryInfo(expense.category);
                    return (
                      <div
                        key={expense.id}
                        className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{catInfo.icon}</span>
                          <div>
                            <p className="font-medium">{expense.description}</p>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <Badge variant="secondary" className="text-xs">
                                {catInfo.label}
                              </Badge>
                              <span>{formatDate(expense.expense_date)}</span>
                            </div>
                            {expense.notes && (
                              <p className="text-xs text-muted-foreground mt-1">
                                {expense.notes}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-destructive">
                            -{formatBDT(expense.amount)}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-destructive"
                            onClick={() => deleteExpense(expense.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                  {expenses.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <Receipt className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p>কোন খরচ পাওয়া যায়নি</p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  );
}
