import { useState, useEffect } from 'react';
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
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Product, Category, Brand } from '@/hooks/useProducts';
import { bn } from '@/lib/constants';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ProductFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product | null;
  categories: Category[];
  brands: Brand[];
  onSubmit: (data: Omit<Product, 'id'>) => void;
}

export function ProductFormDialog({
  open,
  onOpenChange,
  product,
  categories,
  brands,
  onSubmit,
}: ProductFormDialogProps) {
  const [formData, setFormData] = useState<{
    name: string;
    description: string;
    imageUrl: string;
    sku: string;
    barcode: string;
    category: string;
    categoryId: string;
    brand: string;
    brandId: string;
    purchaseCost: number;
    salePrice: number;
    stock: number;
    lowStockThreshold: number;
    warrantyType: 'none' | 'warranty' | 'guarantee';
    warrantyDuration: number;
    warrantyUnit: 'days' | 'months' | 'years';
    unit: string;
    serialRequired: boolean;
    batchTracking: boolean;
    hasExpiry: boolean;
  }>({
    name: '',
    description: '',
    imageUrl: '',
    sku: '',
    barcode: '',
    category: '',
    categoryId: '',
    brand: '',
    brandId: '',
    purchaseCost: 0,
    salePrice: 0,
    stock: 0,
    lowStockThreshold: 10,
    warrantyType: 'none',
    warrantyDuration: 0,
    warrantyUnit: 'months',
    unit: 'pcs',
    serialRequired: false,
    batchTracking: false,
    hasExpiry: false,
  });

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        description: product.description || '',
        imageUrl: product.imageUrl || '',
        sku: product.sku,
        barcode: product.barcode || '',
        category: product.category,
        categoryId: product.categoryId || '',
        brand: product.brand,
        brandId: product.brandId || '',
        purchaseCost: product.purchaseCost,
        salePrice: product.salePrice,
        stock: product.stock,
        lowStockThreshold: product.lowStockThreshold,
        warrantyType: product.warrantyType,
        warrantyDuration: product.warrantyDuration,
        warrantyUnit: product.warrantyUnit,
        unit: product.unit,
        serialRequired: product.serialRequired,
        batchTracking: product.batchTracking,
        hasExpiry: product.hasExpiry,
      });
    } else {
      setFormData({
        name: '',
        description: '',
        imageUrl: '',
        sku: '',
        barcode: '',
        category: '',
        categoryId: '',
        brand: '',
        brandId: '',
        purchaseCost: 0,
        salePrice: 0,
        stock: 0,
        lowStockThreshold: 10,
        warrantyType: 'none',
        warrantyDuration: 0,
        warrantyUnit: 'months',
        unit: 'pcs',
        serialRequired: false,
        batchTracking: false,
        hasExpiry: false,
      });
    }
  }, [product, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleCategoryChange = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    setFormData({
      ...formData,
      categoryId,
      category: category?.name || '',
    });
  };

  const handleBrandChange = (brandId: string) => {
    const brand = brands.find(b => b.id === brandId);
    setFormData({
      ...formData,
      brandId,
      brand: brand?.name || '',
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{product ? 'পণ্য সম্পাদনা' : bn.products.addNew}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Tabs defaultValue="basic">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="basic">মৌলিক তথ্য</TabsTrigger>
              <TabsTrigger value="pricing">মূল্য ও স্টক</TabsTrigger>
              <TabsTrigger value="warranty">ওয়ারেন্টি</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="name">{bn.products.name} *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="পণ্যের নাম লিখুন"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">বিবরণ</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="পণ্যের বিবরণ লিখুন (ঐচ্ছিক)"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="imageUrl">পণ্যের ছবি URL</Label>
                <Input
                  id="imageUrl"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                />
                {formData.imageUrl && (
                  <div className="mt-2">
                    <img 
                      src={formData.imageUrl} 
                      alt="পণ্যের ছবি" 
                      className="w-20 h-20 object-cover rounded-md border"
                      onError={(e) => (e.currentTarget.style.display = 'none')}
                    />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sku">{bn.products.sku} *</Label>
                  <Input
                    id="sku"
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value.toUpperCase() })}
                    placeholder="SAM-A54"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="barcode">{bn.products.barcode}</Label>
                  <Input
                    id="barcode"
                    value={formData.barcode}
                    onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
                    placeholder="বারকোড (ঐচ্ছিক)"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{bn.products.category}</Label>
                  <Select value={formData.categoryId} onValueChange={handleCategoryChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="ক্যাটাগরি নির্বাচন করুন" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>{bn.products.brand}</Label>
                  <Select value={formData.brandId} onValueChange={handleBrandChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="ব্র্যান্ড নির্বাচন করুন" />
                    </SelectTrigger>
                    <SelectContent>
                      {brands.map((brand) => (
                        <SelectItem key={brand.id} value={brand.id}>{brand.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="unit">{bn.products.unit}</Label>
                <Select value={formData.unit} onValueChange={(v) => setFormData({ ...formData, unit: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pcs">{bn.units.pcs}</SelectItem>
                    <SelectItem value="kg">{bn.units.kg}</SelectItem>
                    <SelectItem value="liter">{bn.units.liter}</SelectItem>
                    <SelectItem value="box">{bn.units.box}</SelectItem>
                    <SelectItem value="dozen">{bn.units.dozen}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

            </TabsContent>

            <TabsContent value="pricing" className="space-y-4 pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="purchaseCost">{bn.products.purchaseCost} (৳)</Label>
                  <Input
                    id="purchaseCost"
                    type="number"
                    value={formData.purchaseCost}
                    onChange={(e) => setFormData({ ...formData, purchaseCost: parseFloat(e.target.value) || 0 })}
                    min="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="salePrice">{bn.products.salePrice} (৳)</Label>
                  <Input
                    id="salePrice"
                    type="number"
                    value={formData.salePrice}
                    onChange={(e) => setFormData({ ...formData, salePrice: parseFloat(e.target.value) || 0 })}
                    min="0"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="stock">{bn.products.currentStock}</Label>
                  <Input
                    id="stock"
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })}
                    min="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lowStockThreshold">{bn.products.lowStockThreshold}</Label>
                  <Input
                    id="lowStockThreshold"
                    type="number"
                    value={formData.lowStockThreshold}
                    onChange={(e) => setFormData({ ...formData, lowStockThreshold: parseInt(e.target.value) || 0 })}
                    min="0"
                  />
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>{bn.products.serialRequired}</Label>
                    <p className="text-sm text-muted-foreground">প্রতিটি পণ্যের জন্য সিরিয়াল নম্বর প্রয়োজন</p>
                  </div>
                  <Switch
                    checked={formData.serialRequired}
                    onCheckedChange={(v) => setFormData({ ...formData, serialRequired: v })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>{bn.products.batchNumber}</Label>
                    <p className="text-sm text-muted-foreground">ব্যাচ ট্র্যাকিং সক্রিয় করুন</p>
                  </div>
                  <Switch
                    checked={formData.batchTracking}
                    onCheckedChange={(v) => setFormData({ ...formData, batchTracking: v })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>{bn.products.expiryDate}</Label>
                    <p className="text-sm text-muted-foreground">মেয়াদ শেষ তারিখ ট্র্যাক করুন</p>
                  </div>
                  <Switch
                    checked={formData.hasExpiry}
                    onCheckedChange={(v) => setFormData({ ...formData, hasExpiry: v })}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="warranty" className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>{bn.products.warrantyType}</Label>
                <Select 
                  value={formData.warrantyType} 
                  onValueChange={(v) => setFormData({ ...formData, warrantyType: v as any })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">{bn.warrantyTypes.none}</SelectItem>
                    <SelectItem value="warranty">{bn.warrantyTypes.warranty}</SelectItem>
                    <SelectItem value="guarantee">{bn.warrantyTypes.guarantee}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {formData.warrantyType !== 'none' && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>{bn.products.warrantyDuration}</Label>
                    <Input
                      type="number"
                      value={formData.warrantyDuration}
                      onChange={(e) => setFormData({ ...formData, warrantyDuration: parseInt(e.target.value) || 0 })}
                      min="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>একক</Label>
                    <Select 
                      value={formData.warrantyUnit} 
                      onValueChange={(v) => setFormData({ ...formData, warrantyUnit: v as any })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="days">{bn.durationUnits.days}</SelectItem>
                        <SelectItem value="months">{bn.durationUnits.months}</SelectItem>
                        <SelectItem value="years">{bn.durationUnits.years}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              {bn.common.cancel}
            </Button>
            <Button type="submit">
              {product ? bn.common.update : bn.common.save}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
