import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Product } from '@/hooks/useProducts';
import { bn, formatBDT, formatNumberBn } from '@/lib/constants';
import { Package, Check, X } from 'lucide-react';

interface ProductViewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product | null;
}

export function ProductViewDialog({ open, onOpenChange, product }: ProductViewDialogProps) {
  if (!product) return null;

  const getWarrantyLabel = () => {
    if (product.warrantyType === 'none') return 'নেই';
    const unit = product.warrantyUnit === 'days' ? 'দিন' : product.warrantyUnit === 'months' ? 'মাস' : 'বছর';
    return `${product.warrantyDuration} ${unit} ${product.warrantyType === 'warranty' ? 'ওয়ারেন্টি' : 'গ্যারান্টি'}`;
  };

  const InfoRow = ({ label, value }: { label: string; value: React.ReactNode }) => (
    <div className="flex justify-between py-2 border-b last:border-b-0">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium text-right">{value}</span>
    </div>
  );

  const profit = product.salePrice - product.purchaseCost;
  const profitMargin = product.purchaseCost > 0 ? ((profit / product.purchaseCost) * 100).toFixed(1) : 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <Package className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-lg">{product.name}</p>
              <p className="text-sm text-muted-foreground font-normal">{product.sku}</p>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <div className="flex gap-2 flex-wrap">
            <Badge variant="secondary">{product.category}</Badge>
            <Badge variant="outline">{product.brand}</Badge>
            {product.stock <= product.lowStockThreshold && product.stock > 0 && (
              <Badge variant="destructive">কম স্টক</Badge>
            )}
            {product.stock === 0 && (
              <Badge variant="destructive">স্টক শেষ</Badge>
            )}
          </div>

          <div className="bg-muted/50 rounded-lg p-4">
            <InfoRow label={bn.products.purchaseCost} value={formatBDT(product.purchaseCost)} />
            <InfoRow label={bn.products.salePrice} value={formatBDT(product.salePrice)} />
            <InfoRow label="লাভ" value={<span className="text-success">{formatBDT(profit)} ({profitMargin}%)</span>} />
          </div>

          <div className="bg-muted/50 rounded-lg p-4">
            <InfoRow label={bn.products.currentStock} value={formatNumberBn(product.stock)} />
            <InfoRow label={bn.products.lowStockThreshold} value={formatNumberBn(product.lowStockThreshold)} />
            <InfoRow label="স্টক মূল্য" value={formatBDT(product.stock * product.purchaseCost)} />
          </div>

          <div className="bg-muted/50 rounded-lg p-4">
            <InfoRow label={bn.products.warranty} value={getWarrantyLabel()} />
            <InfoRow 
              label={bn.products.serialRequired} 
              value={product.serialRequired ? <Check className="h-4 w-4 text-success" /> : <X className="h-4 w-4 text-muted-foreground" />} 
            />
            <InfoRow 
              label="ব্যাচ ট্র্যাকিং" 
              value={product.batchTracking ? <Check className="h-4 w-4 text-success" /> : <X className="h-4 w-4 text-muted-foreground" />} 
            />
            <InfoRow 
              label="মেয়াদ ট্র্যাকিং" 
              value={product.hasExpiry ? <Check className="h-4 w-4 text-success" /> : <X className="h-4 w-4 text-muted-foreground" />} 
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
