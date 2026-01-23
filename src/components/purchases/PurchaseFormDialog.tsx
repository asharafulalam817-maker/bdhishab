import { useState, useEffect, useMemo } from 'react';
import { Plus, Trash2, Loader2, Package, Calculator, Wallet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { formatBDT, bn } from '@/lib/constants';
import type { Supplier } from '@/hooks/useSuppliers';
import type { PurchaseFormData } from '@/hooks/usePurchases';

interface Product {
  id: string;
  name: string;
  purchase_cost: number;
  current_stock: number;
}

interface PurchaseFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: PurchaseFormData & { deductFromBalance: boolean }) => void;
  suppliers: Supplier[];
  products: Product[];
  currentBalance?: number;
}

interface PurchaseItemRow {
  product_id: string;
  product_name: string;
  quantity: number;
  unit_cost: number;
}

export function PurchaseFormDialog({
  open,
  onOpenChange,
  onSubmit,
  suppliers,
  products,
  currentBalance = 0,
}: PurchaseFormDialogProps) {
  const [supplierId, setSupplierId] = useState('');
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [purchaseDate, setPurchaseDate] = useState(new Date().toISOString().split('T')[0]);
  const [items, setItems] = useState<PurchaseItemRow[]>([]);
  const [discount, setDiscount] = useState(0);
  const [paidAmount, setPaidAmount] = useState(0);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deductFromBalance, setDeductFromBalance] = useState(true);

  // Reset form when dialog opens
  useEffect(() => {
    if (open) {
      setSupplierId('');
      setInvoiceNumber('');
      setPurchaseDate(new Date().toISOString().split('T')[0]);
      setItems([]);
      setDiscount(0);
      setPaidAmount(0);
      setNotes('');
      setDeductFromBalance(true);
    }
  }, [open]);

  const subtotal = useMemo(() => {
    return items.reduce((sum, item) => sum + item.quantity * item.unit_cost, 0);
  }, [items]);

  const total = subtotal - discount;
  const dueAmount = total - paidAmount;
  const insufficientBalance = deductFromBalance && paidAmount > currentBalance;

  const addItem = () => {
    setItems([...items, { product_id: '', product_name: '', quantity: 1, unit_cost: 0 }]);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: keyof PurchaseItemRow, value: string | number) => {
    setItems(items.map((item, i) => {
      if (i !== index) return item;
      
      if (field === 'product_id') {
        const product = products.find(p => p.id === value);
        return {
          ...item,
          product_id: value as string,
          product_name: product?.name || '',
          unit_cost: product?.purchase_cost || 0,
        };
      }
      
      return { ...item, [field]: value };
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;

    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 300));
    
    onSubmit({
      supplier_id: supplierId,
      invoice_number: invoiceNumber,
      purchase_date: purchaseDate,
      items,
      discount,
      paid_amount: paidAmount,
      notes,
      deductFromBalance: paidAmount > 0 ? deductFromBalance : false,
    });
    
    setIsSubmitting(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>{bn.purchases.addNew}</DialogTitle>
          <DialogDescription>
            নতুন ক্রয়ের বিবরণ দিন
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <ScrollArea className="max-h-[60vh] pr-4">
            <div className="space-y-4">
              {/* Basic Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{bn.purchases.supplier}</Label>
                  <Select value={supplierId} onValueChange={setSupplierId}>
                    <SelectTrigger>
                      <SelectValue placeholder="সরবরাহকারী নির্বাচন করুন" />
                    </SelectTrigger>
                    <SelectContent>
                      {suppliers.map((supplier) => (
                        <SelectItem key={supplier.id} value={supplier.id}>
                          {supplier.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>{bn.purchases.date}</Label>
                  <Input
                    type="date"
                    value={purchaseDate}
                    onChange={(e) => setPurchaseDate(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>{bn.purchases.invoiceNo}</Label>
                <Input
                  placeholder="সরবরাহকারীর চালান নম্বর (ঐচ্ছিক)"
                  value={invoiceNumber}
                  onChange={(e) => setInvoiceNumber(e.target.value)}
                />
              </div>

              <Separator />

              {/* Items */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-base font-medium">পণ্য তালিকা</Label>
                  <Button type="button" variant="outline" size="sm" onClick={addItem}>
                    <Plus className="h-4 w-4 mr-1" />
                    পণ্য যোগ
                  </Button>
                </div>

                {items.length === 0 ? (
                  <div className="text-center py-8 border border-dashed rounded-lg">
                    <Package className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
                    <p className="text-muted-foreground">কোন পণ্য যোগ করা হয়নি</p>
                    <Button type="button" variant="link" onClick={addItem}>
                      পণ্য যোগ করুন
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {items.map((item, index) => (
                      <div key={index} className="flex gap-2 items-start p-3 border rounded-lg bg-muted/30">
                        <div className="flex-1 grid grid-cols-1 sm:grid-cols-4 gap-2">
                          <div className="sm:col-span-2">
                            <Select
                              value={item.product_id}
                              onValueChange={(v) => updateItem(index, 'product_id', v)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="পণ্য নির্বাচন" />
                              </SelectTrigger>
                              <SelectContent>
                                {products.map((product) => (
                                  <SelectItem key={product.id} value={product.id}>
                                    {product.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Input
                              type="number"
                              min="1"
                              placeholder="পরিমাণ"
                              value={item.quantity}
                              onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 0)}
                            />
                          </div>
                          <div>
                            <Input
                              type="number"
                              min="0"
                              placeholder="দাম"
                              value={item.unit_cost}
                              onChange={(e) => updateItem(index, 'unit_cost', parseFloat(e.target.value) || 0)}
                            />
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium w-24 text-right">
                            {formatBDT(item.quantity * item.unit_cost)}
                          </span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive"
                            onClick={() => removeItem(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <Separator />

              {/* Totals */}
              <div className="space-y-3 bg-muted/50 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">{bn.sales.subtotal}</span>
                  <span className="font-medium">{formatBDT(subtotal)}</span>
                </div>
                
                <div className="flex justify-between items-center gap-4">
                  <Label className="text-muted-foreground">{bn.sales.discount}</Label>
                  <Input
                    type="number"
                    min="0"
                    className="w-32 text-right"
                    value={discount}
                    onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                  />
                </div>

                <Separator />

                <div className="flex justify-between items-center text-lg font-bold">
                  <span>{bn.sales.grandTotal}</span>
                  <span>{formatBDT(total)}</span>
                </div>

                <div className="flex justify-between items-center gap-4">
                  <Label className="text-muted-foreground">{bn.sales.paidAmount}</Label>
                  <Input
                    type="number"
                    min="0"
                    className="w-32 text-right"
                    value={paidAmount}
                    onChange={(e) => setPaidAmount(parseFloat(e.target.value) || 0)}
                  />
                </div>

                {paidAmount > 0 && (
                  <div className="p-3 rounded-lg bg-background border space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="deductFromBalance"
                        checked={deductFromBalance}
                        onCheckedChange={(checked) => setDeductFromBalance(checked as boolean)}
                      />
                      <Label htmlFor="deductFromBalance" className="text-sm cursor-pointer flex items-center gap-2">
                        <Wallet className="h-4 w-4" />
                        ব্যালেন্স থেকে কাটুন
                      </Label>
                    </div>
                    
                    {deductFromBalance && (
                      <div className="text-xs text-muted-foreground">
                        বর্তমান ব্যালেন্স: <span className="font-medium">{formatBDT(currentBalance)}</span>
                        {insufficientBalance && (
                          <span className="text-destructive block mt-1">
                            ⚠️ ব্যালেন্স পর্যাপ্ত নয়
                          </span>
                        )}
                        {!insufficientBalance && (
                          <span className="block mt-1">
                            পরে থাকবে: {formatBDT(currentBalance - paidAmount)}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                )}

                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">{bn.sales.dueAmount}</span>
                  <span className={`font-bold ${dueAmount > 0 ? 'text-destructive' : 'text-green-600'}`}>
                    {formatBDT(dueAmount)}
                  </span>
                </div>

                {dueAmount > 0 && supplierId && (
                  <div className="text-xs text-muted-foreground p-2 bg-destructive/10 rounded">
                    ⚠️ সরবরাহকারীর বকেয়ায় {formatBDT(dueAmount)} যোগ হবে
                  </div>
                )}
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <Label>{bn.sales.notes}</Label>
                <Textarea
                  placeholder="নোট (ঐচ্ছিক)"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={2}
                />
              </div>
            </div>
          </ScrollArea>

          <DialogFooter className="mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              {bn.common.cancel}
            </Button>
            <Button type="submit" disabled={isSubmitting || items.length === 0 || insufficientBalance}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  সংরক্ষণ হচ্ছে...
                </>
              ) : (
                <>
                  <Calculator className="mr-2 h-4 w-4" />
                  ক্রয় সংরক্ষণ
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
