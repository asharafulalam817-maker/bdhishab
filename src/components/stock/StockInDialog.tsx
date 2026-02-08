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
import { useLanguage } from '@/contexts/LanguageContext';

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
  const { t } = useLanguage();
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
            {t('stock.stockInTitle')}
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
                {products.map((product) => (
                  <SelectItem key={product.id} value={product.id}>
                    {product.name} ({t('stock.currentStock')}: {product.stock})
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
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
              placeholder={t('stock.quantityPlaceholder')}
            />
            {selectedProduct && (
              <p className="text-sm text-muted-foreground">
                {t('stock.newStockWillBe')}: {selectedProduct.stock + quantity} {selectedProduct.unit}
              </p>
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
            <Label>{t('stock.notes')}</Label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={t('stock.notesPlaceholder')}
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
              className="flex-1 bg-green-600 hover:bg-green-700"
              disabled={!productId || quantity <= 0}
            >
              {t('stock.addStockButton')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
