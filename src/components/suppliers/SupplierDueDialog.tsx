import { useState } from 'react';
import { Loader2, Plus, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { formatBDT } from '@/lib/constants';
import type { Supplier } from '@/hooks/useSuppliers';

interface SupplierDueDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  supplier: Supplier | null;
  onAdjust: (id: string, amount: number, type: 'add' | 'subtract') => void;
}

export function SupplierDueDialog({
  open,
  onOpenChange,
  supplier,
  onAdjust,
}: SupplierDueDialogProps) {
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<'add' | 'subtract'>('subtract');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supplier || !amount || parseFloat(amount) <= 0) return;

    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 300));
    onAdjust(supplier.id, parseFloat(amount), type);
    setIsSubmitting(false);
    setAmount('');
    onOpenChange(false);
  };

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      setAmount('');
      setType('subtract');
    }
    onOpenChange(isOpen);
  };

  if (!supplier) return null;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>বকেয়া সমন্বয়</DialogTitle>
          <DialogDescription>
            <span className="font-medium text-foreground">{supplier.name}</span>
            <br />
            বর্তমান বকেয়া:{' '}
            <span className="font-semibold text-destructive">
              {formatBDT(supplier.due_amount)}
            </span>
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Tabs
            value={type}
            onValueChange={(v) => setType(v as 'add' | 'subtract')}
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="subtract" className="gap-2">
                <Minus className="h-4 w-4" />
                বকেয়া পরিশোধ
              </TabsTrigger>
              <TabsTrigger value="add" className="gap-2">
                <Plus className="h-4 w-4" />
                বকেয়া যোগ
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="space-y-2">
            <Label htmlFor="amount">টাকার পরিমাণ *</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">
                ৳
              </span>
              <Input
                id="amount"
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="pl-8 text-lg"
                autoFocus
              />
            </div>
          </div>

          {type === 'subtract' && amount && parseFloat(amount) > 0 && (
            <div className="p-3 rounded-lg bg-muted/50 text-sm">
              <p>
                পরিশোধের পর বকেয়া থাকবে:{' '}
                <span className="font-semibold">
                  {formatBDT(
                    Math.max(0, supplier.due_amount - parseFloat(amount))
                  )}
                </span>
              </p>
            </div>
          )}

          {type === 'add' && amount && parseFloat(amount) > 0 && (
            <div className="p-3 rounded-lg bg-destructive/10 text-sm">
              <p>
                নতুন বকেয়া হবে:{' '}
                <span className="font-semibold text-destructive">
                  {formatBDT(supplier.due_amount + parseFloat(amount))}
                </span>
              </p>
            </div>
          )}

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
              variant={type === 'add' ? 'destructive' : 'default'}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  সংরক্ষণ হচ্ছে...
                </>
              ) : type === 'subtract' ? (
                'পরিশোধ নিশ্চিত করুন'
              ) : (
                'বকেয়া যোগ করুন'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
