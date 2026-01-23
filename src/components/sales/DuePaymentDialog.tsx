import { useState } from 'react';
import { Loader2, CreditCard, Wallet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { formatBDT } from '@/lib/constants';
import type { Sale } from '@/hooks/useSales';

interface DuePaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sale: Sale | null;
  onPayment: (saleId: string, amount: number, paymentMethod: string, addToBalance: boolean) => void;
}

export function DuePaymentDialog({
  open,
  onOpenChange,
  sale,
  onPayment,
}: DuePaymentDialogProps) {
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [addToBalance, setAddToBalance] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sale || !amount || parseFloat(amount) <= 0) return;

    const payAmount = Math.min(parseFloat(amount), sale.dueAmount);
    
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 300));
    onPayment(sale.id, payAmount, paymentMethod, addToBalance);
    setIsSubmitting(false);
    setAmount('');
    setPaymentMethod('cash');
    onOpenChange(false);
  };

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      setAmount('');
      setPaymentMethod('cash');
      setAddToBalance(true);
    }
    onOpenChange(isOpen);
  };

  const handlePayFull = () => {
    if (sale) {
      setAmount(sale.dueAmount.toString());
    }
  };

  if (!sale) return null;

  const payAmount = Math.min(parseFloat(amount) || 0, sale.dueAmount);
  const remainingDue = sale.dueAmount - payAmount;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[420px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            বাকি পরিশোধ
          </DialogTitle>
          <DialogDescription>
            <span className="font-medium text-foreground">{sale.invoiceNumber}</span>
            {sale.customerName && (
              <>
                <br />
                গ্রাহক: <span className="font-medium">{sale.customerName}</span>
              </>
            )}
            <br />
            বর্তমান বাকি:{' '}
            <span className="font-semibold text-destructive">
              {formatBDT(sale.dueAmount)}
            </span>
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="amount">পরিশোধের পরিমাণ *</Label>
              <Button 
                type="button" 
                variant="link" 
                size="sm" 
                onClick={handlePayFull}
                className="h-auto p-0 text-xs"
              >
                সম্পূর্ণ পরিশোধ করুন
              </Button>
            </div>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">
                ৳
              </span>
              <Input
                id="amount"
                type="number"
                min="0"
                max={sale.dueAmount}
                step="0.01"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="pl-8 text-lg"
                autoFocus
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>পেমেন্ট মেথড</Label>
            <Select value={paymentMethod} onValueChange={setPaymentMethod}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cash">নগদ</SelectItem>
                <SelectItem value="bkash">বিকাশ</SelectItem>
                <SelectItem value="nagad">নগদ (মোবাইল)</SelectItem>
                <SelectItem value="bank">ব্যাংক ট্রান্সফার</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {amount && parseFloat(amount) > 0 && (
            <div className="p-4 rounded-lg bg-muted/50 space-y-2">
              <div className="flex justify-between text-sm">
                <span>মোট বাকি:</span>
                <span className="font-medium">{formatBDT(sale.dueAmount)}</span>
              </div>
              <div className="flex justify-between text-sm text-success">
                <span>পরিশোধ হবে:</span>
                <span className="font-medium">-{formatBDT(payAmount)}</span>
              </div>
              <div className="border-t pt-2 flex justify-between">
                <span className="font-medium">অবশিষ্ট বাকি:</span>
                <span className={`font-bold ${remainingDue > 0 ? 'text-warning' : 'text-success'}`}>
                  {formatBDT(remainingDue)}
                </span>
              </div>
              {remainingDue === 0 && (
                <div className="text-center text-success text-sm font-medium">
                  ✓ সম্পূর্ণ পরিশোধ হবে!
                </div>
              )}
            </div>
          )}

          <div className="flex items-center gap-2 p-3 rounded-lg bg-primary/5 border border-primary/10">
            <Checkbox
              id="addToBalance"
              checked={addToBalance}
              onCheckedChange={(checked) => setAddToBalance(checked as boolean)}
            />
            <Label htmlFor="addToBalance" className="text-sm cursor-pointer flex items-center gap-2">
              <Wallet className="h-4 w-4" />
              ব্যালেন্সে যোগ করুন
            </Label>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
            >
              বাতিল
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !amount || parseFloat(amount) <= 0}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  প্রসেসিং...
                </>
              ) : (
                `৳${payAmount.toLocaleString('bn-BD')} পরিশোধ করুন`
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
