import { useState } from 'react';
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
import { PackageMinus, AlertTriangle } from 'lucide-react';

interface StockOutDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  products: Product[];
  onSubmit: (
    productId: string,
    quantity: number,
    options?: { batchNumber?: string; serialNumber?: string; notes?: string }
  ) => void;
}

export function StockOutDialog({
  open,
  onOpenChange,
  products,
  onSubmit,
}: StockOutDialogProps) {
  const [productId, setProductId] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [batchNumber, setBatchNumber] = useState('');
  const [serialNumber, setSerialNumber] = useState('');
  const [notes, setNotes] = useState('');
  const [reason, setReason] = useState('');

  const selectedProduct = products.find(p => p.id === productId);
  const availableStock = selectedProduct?.stock || 0;
  const isOverStock = quantity > availableStock;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productId || quantity <= 0 || isOverStock) return;

    const fullNotes = reason ? `${reason}${notes ? ` - ${notes}` : ''}` : notes;

    onSubmit(productId, quantity, {
      batchNumber: batchNumber || undefined,
      serialNumber: serialNumber || undefined,
      notes: fullNotes || undefined,
    });

    // Reset form
    setProductId('');
    setQuantity(1);
    setBatchNumber('');
    setSerialNumber('');
    setNotes('');
    setReason('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <PackageMinus className="h-5 w-5 text-red-600" />
            স্টক আউট
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
                {products.filter(p => p.stock > 0).map((product) => (
                  <SelectItem key={product.id} value={product.id}>
                    {product.name} (স্টক: {product.stock})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>কারণ *</Label>
            <Select value={reason} onValueChange={setReason}>
              <SelectTrigger>
                <SelectValue placeholder="কারণ সিলেক্ট করুন" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="নষ্ট/ক্ষতিগ্রস্ত">নষ্ট/ক্ষতিগ্রস্ত</SelectItem>
                <SelectItem value="মেয়াদ উত্তীর্ণ">মেয়াদ উত্তীর্ণ</SelectItem>
                <SelectItem value="রিটার্ন/ফেরত">রিটার্ন/ফেরত</SelectItem>
                <SelectItem value="চুরি/হারিয়ে গেছে">চুরি/হারিয়ে গেছে</SelectItem>
                <SelectItem value="স্যাম্পল/প্রদর্শনী">স্যাম্পল/প্রদর্শনী</SelectItem>
                <SelectItem value="অন্যান্য">অন্যান্য</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>পরিমাণ *</Label>
            <Input
              type="number"
              min={1}
              max={availableStock}
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
              placeholder="পরিমাণ লিখুন"
            />
            {selectedProduct && (
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">
                  বর্তমান স্টক: {selectedProduct.stock} {selectedProduct.unit}
                </p>
                {isOverStock && (
                  <p className="text-sm text-destructive flex items-center gap-1">
                    <AlertTriangle className="h-4 w-4" />
                    পরিমাণ স্টকের চেয়ে বেশি হতে পারবে না
                  </p>
                )}
                {!isOverStock && (
                  <p className="text-sm text-muted-foreground">
                    অবশিষ্ট থাকবে: {selectedProduct.stock - quantity} {selectedProduct.unit}
                  </p>
                )}
              </div>
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
            <Label>অতিরিক্ত নোট</Label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="বিস্তারিত তথ্য লিখুন"
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
              variant="destructive"
              className="flex-1"
              disabled={!productId || quantity <= 0 || isOverStock || !reason}
            >
              স্টক কমান
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
