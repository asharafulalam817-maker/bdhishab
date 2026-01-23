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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Product } from '@/hooks/useProducts';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Settings2, Plus, Trash2, ArrowUp, ArrowDown, Minus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface AdjustmentItem {
  productId: string;
  productName: string;
  currentStock: number;
  newStock: number;
  reason: string;
}

interface StockAdjustmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  products: Product[];
  onSubmit: (
    items: { productId: string; newStock: number; reason: string }[],
    notes?: string
  ) => void;
}

const ADJUSTMENT_REASONS = [
  'ফিজিক্যাল কাউন্ট সংশোধন',
  'ইনভেন্টরি অডিট',
  'সিস্টেম এরর সংশোধন',
  'প্রাথমিক স্টক সেটআপ',
  'অন্যান্য',
];

export function StockAdjustmentDialog({
  open,
  onOpenChange,
  products,
  onSubmit,
}: StockAdjustmentDialogProps) {
  const [items, setItems] = useState<AdjustmentItem[]>([]);
  const [selectedProductId, setSelectedProductId] = useState('');
  const [notes, setNotes] = useState('');

  const addProduct = () => {
    if (!selectedProductId) return;
    
    const product = products.find(p => p.id === selectedProductId);
    if (!product) return;

    // Check if already added
    if (items.some(item => item.productId === selectedProductId)) return;

    setItems([
      ...items,
      {
        productId: product.id,
        productName: product.name,
        currentStock: product.stock,
        newStock: product.stock,
        reason: ADJUSTMENT_REASONS[0],
      },
    ]);
    setSelectedProductId('');
  };

  const removeItem = (productId: string) => {
    setItems(items.filter(item => item.productId !== productId));
  };

  const updateItem = (productId: string, updates: Partial<AdjustmentItem>) => {
    setItems(items.map(item =>
      item.productId === productId ? { ...item, ...updates } : item
    ));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;

    // Only submit items that have changed
    const changedItems = items
      .filter(item => item.newStock !== item.currentStock)
      .map(item => ({
        productId: item.productId,
        newStock: item.newStock,
        reason: item.reason,
      }));

    if (changedItems.length === 0) return;

    onSubmit(changedItems, notes || undefined);
    
    // Reset form
    setItems([]);
    setNotes('');
    onOpenChange(false);
  };

  const availableProducts = products.filter(
    p => !items.some(item => item.productId === p.id)
  );

  const totalChanges = items.reduce((sum, item) => {
    return sum + (item.newStock - item.currentStock);
  }, 0);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings2 className="h-5 w-5 text-blue-600" />
            স্টক এডজাস্টমেন্ট
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Add Product */}
          <div className="flex gap-2">
            <Select value={selectedProductId} onValueChange={setSelectedProductId}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="পণ্য সিলেক্ট করুন" />
              </SelectTrigger>
              <SelectContent>
                {availableProducts.map((product) => (
                  <SelectItem key={product.id} value={product.id}>
                    {product.name} (স্টক: {product.stock})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              type="button"
              onClick={addProduct}
              disabled={!selectedProductId}
            >
              <Plus className="h-4 w-4 mr-1" />
              যোগ করুন
            </Button>
          </div>

          {/* Items Table */}
          {items.length > 0 && (
            <ScrollArea className="h-[300px] border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>পণ্য</TableHead>
                    <TableHead className="text-center">বর্তমান</TableHead>
                    <TableHead className="text-center">নতুন স্টক</TableHead>
                    <TableHead className="text-center">পার্থক্য</TableHead>
                    <TableHead>কারণ</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((item) => {
                    const difference = item.newStock - item.currentStock;
                    return (
                      <TableRow key={item.productId}>
                        <TableCell className="font-medium">
                          {item.productName}
                        </TableCell>
                        <TableCell className="text-center">
                          {item.currentStock}
                        </TableCell>
                        <TableCell className="text-center">
                          <Input
                            type="number"
                            min={0}
                            value={item.newStock}
                            onChange={(e) =>
                              updateItem(item.productId, {
                                newStock: parseInt(e.target.value) || 0,
                              })
                            }
                            className="w-20 mx-auto text-center"
                          />
                        </TableCell>
                        <TableCell className="text-center">
                          {difference !== 0 ? (
                            <Badge
                              variant={difference > 0 ? 'default' : 'destructive'}
                              className="gap-1"
                            >
                              {difference > 0 ? (
                                <ArrowUp className="h-3 w-3" />
                              ) : (
                                <ArrowDown className="h-3 w-3" />
                              )}
                              {Math.abs(difference)}
                            </Badge>
                          ) : (
                            <Badge variant="secondary">
                              <Minus className="h-3 w-3" />
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <Select
                            value={item.reason}
                            onValueChange={(value) =>
                              updateItem(item.productId, { reason: value })
                            }
                          >
                            <SelectTrigger className="w-[180px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {ADJUSTMENT_REASONS.map((reason) => (
                                <SelectItem key={reason} value={reason}>
                                  {reason}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeItem(item.productId)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </ScrollArea>
          )}

          {items.length === 0 && (
            <div className="text-center py-8 text-muted-foreground border rounded-lg">
              এডজাস্ট করতে পণ্য যোগ করুন
            </div>
          )}

          {/* Summary */}
          {items.length > 0 && (
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <span className="text-sm font-medium">মোট পরিবর্তন:</span>
              <Badge
                variant={totalChanges >= 0 ? 'default' : 'destructive'}
                className="text-base"
              >
                {totalChanges >= 0 ? '+' : ''}{totalChanges}
              </Badge>
            </div>
          )}

          {/* Notes */}
          <div className="space-y-2">
            <Label>নোট</Label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="এডজাস্টমেন্টের বিস্তারিত তথ্য লিখুন"
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
              className="flex-1"
              disabled={items.length === 0 || items.every(i => i.newStock === i.currentStock)}
            >
              এডজাস্টমেন্ট সেভ করুন
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
