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
import { PackageMinus, AlertTriangle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface StockOutDialogProps {
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

export function StockOutDialog({
  open,
  onOpenChange,
  products,
  onSubmit,
  preselectedProductId,
}: StockOutDialogProps) {
  const { t } = useLanguage();
  const [productId, setProductId] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [batchNumber, setBatchNumber] = useState('');
  const [serialNumber, setSerialNumber] = useState('');
  const [notes, setNotes] = useState('');
  const [reason, setReason] = useState('');

  // Set preselected product when dialog opens
  React.useEffect(() => {
    if (open && preselectedProductId) {
      setProductId(preselectedProductId);
    }
  }, [open, preselectedProductId]);

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

  const reasons = [
    { value: 'damaged', label: t('stock.reasonDamaged') },
    { value: 'expired', label: t('stock.reasonExpired') },
    { value: 'return', label: t('stock.reasonReturn') },
    { value: 'theft', label: t('stock.reasonTheft') },
    { value: 'sample', label: t('stock.reasonSample') },
    { value: 'other', label: t('stock.reasonOther') },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <PackageMinus className="h-5 w-5 text-red-600" />
            {t('stock.stockOutTitle')}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>{t('stock.selectProduct')} *</Label>
            <Select value={productId} onValueChange={setProductId}>
              <SelectTrigger>
                <SelectValue placeholder={t('stock.selectProductPlaceholder')} />
              </SelectTrigger>
              <SelectContent>
                {products.filter(p => p.stock > 0).map((product) => (
                  <SelectItem key={product.id} value={product.id}>
                    {product.name} ({t('products.stock')}: {product.stock})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>{t('stock.reason')} *</Label>
            <Select value={reason} onValueChange={setReason}>
              <SelectTrigger>
                <SelectValue placeholder={t('stock.reasonPlaceholder')} />
              </SelectTrigger>
              <SelectContent>
                {reasons.map((r) => (
                  <SelectItem key={r.value} value={r.label}>
                    {r.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>{t('stock.quantity')} *</Label>
            <Input
              type="number"
              min={1}
              max={availableStock}
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
              placeholder={t('stock.quantityPlaceholder')}
            />
            {selectedProduct && (
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">
                  {t('stock.currentStock')}: {selectedProduct.stock} {selectedProduct.unit}
                </p>
                {isOverStock && (
                  <p className="text-sm text-destructive flex items-center gap-1">
                    <AlertTriangle className="h-4 w-4" />
                    {t('stock.quantityExceedsStock')}
                  </p>
                )}
                {!isOverStock && (
                  <p className="text-sm text-muted-foreground">
                    {t('stock.remaining')}: {selectedProduct.stock - quantity} {selectedProduct.unit}
                  </p>
                )}
              </div>
            )}
          </div>

          {selectedProduct?.batchTracking && (
            <div className="space-y-2">
              <Label>{t('stock.batchNumber')}</Label>
              <Input
                value={batchNumber}
                onChange={(e) => setBatchNumber(e.target.value)}
                placeholder={t('stock.batchNumberPlaceholder')}
              />
            </div>
          )}

          {selectedProduct?.serialRequired && (
            <div className="space-y-2">
              <Label>{t('stock.serialNumber')}</Label>
              <Input
                value={serialNumber}
                onChange={(e) => setSerialNumber(e.target.value)}
                placeholder={t('stock.serialNumberPlaceholder')}
              />
            </div>
          )}

          <div className="space-y-2">
            <Label>{t('stock.additionalNotes')}</Label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={t('stock.detailsPlaceholder')}
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
              {t('stock.cancel')}
            </Button>
            <Button
              type="submit"
              variant="destructive"
              className="flex-1"
              disabled={!productId || quantity <= 0 || isOverStock || !reason}
            >
              {t('stock.reduceStockButton')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
