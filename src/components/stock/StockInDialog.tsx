import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Product } from '@/hooks/useProducts';
import { PackagePlus } from 'lucide-react';

interface StockInDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  products: Product[];
  onSubmit: (
    productId: string,
    quantity: number,
    options?: { batchNumber?: string; serialNumber?: string; notes?: string }
  ) => void;
  preselectedProductId?: string;
}

export function StockInDialog({
  open,
  onOpenChange,
  products,
  onSubmit,
  preselectedProductId,
}: StockInDialogProps) {
  const [productId, setProductId] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [batchNumber, setBatchNumber] = useState('');
  const [serialNumber, setSerialNumber] = useState('');
  const [notes, setNotes] = useState('');

  // Set preselected product when dialog opens
  React.useEffect(() => {
    if (open && preselectedProductId) {
      setProductId(preselectedProductId);
    }
  }, [open, preselectedProductId]);

  const selectedProduct = products.find(p => p.id === productId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productId || quantity <= 0) return;

    onSubmit(productId, quantity, {
      batchNumber: batchNumber || undefined,
      serialNumber: serialNumber || undefined,
      notes: notes || undefined,
    });

    // Reset form
    setProductId('');
    setQuantity(1);
    setBatchNumber('');
    setSerialNumber('');
    setNotes('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <PackagePlus className="h-5 w-5 text-green-600" />
            স্টক ইন
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>পণ্য নির্বাচন করুন *</Label>
            <Select value={productId} onValueChange={setProductId}>
              <SelectTrigger>
                <SelectValue placeholder="পণ্য সিলেক্ট করুন" />
              </SelectTrigger>
              <SelectContent>
                {products.map((product) => (
                  <SelectItem key={product.id} value={product.id}>
                    {product.name} (বর্তমান স্টক: {product.stock})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>পরিমাণ *</Label>
            <Input
              type="number"
              min={1}
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
              placeholder="পরিমাণ লিখুন"
            />
            {selectedProduct && (
              <p className="text-sm text-muted-foreground">
                নতুন স্টক হবে: {selectedProduct.stock + quantity} {selectedProduct.unit}
              </p>
            )}
          </div>

          {selectedProduct?.batchTracking && (
            <div className="space-y-2">
              <Label>ব্যাচ নম্বর</Label>
              <Input
                value={batchNumber}
                onChange={(e) => setBatchNumber(e.target.value)}
                placeholder="ব্যাচ নম্বর লিখুন"
              />
            </div>
          )}

          {selectedProduct?.serialRequired && (
            <div className="space-y-2">
              <Label>সিরিয়াল নম্বর</Label>
              <Input
                value={serialNumber}
                onChange={(e) => setSerialNumber(e.target.value)}
                placeholder="সিরিয়াল নম্বর লিখুন"
              />
            </div>
          )}

          <div className="space-y-2">
            <Label>নোট</Label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="অতিরিক্ত তথ্য লিখুন"
              rows={2}
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => onOpenChange(false)}
            >
              বাতিল
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-green-600 hover:bg-green-700"
              disabled={!productId || quantity <= 0}
            >
              স্টক যোগ করুন
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
