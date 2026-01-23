import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  PackagePlus, 
  Plus, 
  Search, 
  Save, 
  ArrowLeft,
  Package,
  Check
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useProducts } from '@/hooks/useProducts';
import { toast } from 'sonner';
import { formatBDT } from '@/lib/constants';
import { ReadOnlyGuard } from '@/components/subscription/ReadOnlyGuard';

export default function QuickStock() {
  const navigate = useNavigate();
  const { 
    products, 
    categories, 
    brands, 
    addProduct, 
    updateProduct 
  } = useProducts();

  const [activeTab, setActiveTab] = useState<'existing' | 'new'>('existing');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProductId, setSelectedProductId] = useState('');
  const [stockQuantity, setStockQuantity] = useState(1);
  const [unitCost, setUnitCost] = useState(0);
  const [batchNumber, setBatchNumber] = useState('');
  const [notes, setNotes] = useState('');

  // New product form
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    sku: '',
    categoryId: '',
    brandId: '',
    purchaseCost: 0,
    salePrice: 0,
    stock: 0,
    lowStockThreshold: 10,
    warrantyType: 'none' as 'none' | 'warranty' | 'guarantee',
    warrantyDuration: 0,
    warrantyUnit: 'months' as 'days' | 'months' | 'years',
    unit: 'pcs',
    serialRequired: false,
    batchTracking: false,
  });

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.sku.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedProduct = products.find(p => p.id === selectedProductId);

  const handleAddStockToExisting = () => {
    if (!selectedProductId || stockQuantity <= 0) {
      toast.error('পণ্য সিলেক্ট করুন এবং পরিমাণ দিন');
      return;
    }

    const product = products.find(p => p.id === selectedProductId);
    if (product) {
      updateProduct(selectedProductId, {
        stock: product.stock + stockQuantity,
        purchaseCost: unitCost > 0 ? unitCost : product.purchaseCost,
      });
      toast.success(`${product.name} এ ${stockQuantity} ${product.unit} স্টক যোগ হয়েছে`);
      
      // Reset form
      setSelectedProductId('');
      setStockQuantity(1);
      setUnitCost(0);
      setBatchNumber('');
      setNotes('');
    }
  };

  const handleAddNewProduct = () => {
    if (!newProduct.name || !newProduct.sku) {
      toast.error('পণ্যের নাম এবং SKU দিন');
      return;
    }

    const category = categories.find(c => c.id === newProduct.categoryId);
    const brand = brands.find(b => b.id === newProduct.brandId);

    addProduct({
      ...newProduct,
      category: category?.name || '',
      brand: brand?.name || '',
      barcode: '',
      imageUrl: '',
      hasExpiry: false,
    });

    toast.success(`${newProduct.name} সফলভাবে যোগ হয়েছে!`);

    // Reset form
    setNewProduct({
      name: '',
      description: '',
      sku: '',
      categoryId: '',
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
    });
  };

  return (
    <ReadOnlyGuard featureName="স্টক এন্ট্রি">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <PackagePlus className="h-7 w-7 text-primary" />
              দ্রুত স্টক যোগ করুন
            </h1>
            <p className="text-muted-foreground">
              বিদ্যমান পণ্যে স্টক যোগ করুন অথবা নতুন পণ্য তৈরি করুন
            </p>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="existing" className="gap-2">
              <Package className="h-4 w-4" />
              বিদ্যমান পণ্যে স্টক
            </TabsTrigger>
            <TabsTrigger value="new" className="gap-2">
              <Plus className="h-4 w-4" />
              নতুন পণ্য তৈরি
            </TabsTrigger>
          </TabsList>

          {/* Existing Product - Add Stock */}
          <TabsContent value="existing" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Product Selection */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">পণ্য নির্বাচন</CardTitle>
                  <CardDescription>যে পণ্যে স্টক যোগ করতে চান সেটি সিলেক্ট করুন</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="পণ্য খুঁজুন (নাম বা SKU)"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>

                  <div className="max-h-[300px] overflow-y-auto space-y-2">
                    {filteredProducts.map((product) => (
                      <div
                        key={product.id}
                        onClick={() => {
                          setSelectedProductId(product.id);
                          setUnitCost(product.purchaseCost);
                        }}
                        className={`p-3 rounded-lg border cursor-pointer transition-all ${
                          selectedProductId === product.id 
                            ? 'border-primary bg-primary/5 ring-2 ring-primary/20' 
                            : 'hover:border-primary/50 hover:bg-muted/50'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{product.name}</p>
                            <p className="text-sm text-muted-foreground">
                              SKU: {product.sku} • স্টক: {product.stock} {product.unit}
                            </p>
                          </div>
                          {selectedProductId === product.id && (
                            <Check className="h-5 w-5 text-primary" />
                          )}
                        </div>
                      </div>
                    ))}

                    {filteredProducts.length === 0 && (
                      <div className="text-center py-8 text-muted-foreground">
                        <Package className="h-10 w-10 mx-auto mb-2 opacity-50" />
                        <p>কোন পণ্য পাওয়া যায়নি</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Stock Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">স্টক তথ্য</CardTitle>
                  <CardDescription>
                    {selectedProduct 
                      ? `${selectedProduct.name} - বর্তমান স্টক: ${selectedProduct.stock} ${selectedProduct.unit}`
                      : 'প্রথমে একটি পণ্য সিলেক্ট করুন'
                    }
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>পরিমাণ *</Label>
                      <Input
                        type="number"
                        min={1}
                        value={stockQuantity}
                        onChange={(e) => setStockQuantity(parseInt(e.target.value) || 0)}
                        placeholder="পরিমাণ"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>ক্রয় মূল্য (প্রতি একক)</Label>
                      <Input
                        type="number"
                        min={0}
                        value={unitCost}
                        onChange={(e) => setUnitCost(parseFloat(e.target.value) || 0)}
                        placeholder="৳ 0"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>ব্যাচ নম্বর (ঐচ্ছিক)</Label>
                    <Input
                      value={batchNumber}
                      onChange={(e) => setBatchNumber(e.target.value)}
                      placeholder="ব্যাচ নম্বর"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>নোট (ঐচ্ছিক)</Label>
                    <Textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="অতিরিক্ত তথ্য..."
                      rows={2}
                    />
                  </div>

                  {selectedProduct && stockQuantity > 0 && (
                    <div className="p-4 rounded-lg bg-accent/50 border border-border">
                      <p className="text-sm text-foreground">
                        মোট খরচ: <strong>{formatBDT(unitCost * stockQuantity)}</strong>
                      </p>
                      <p className="text-sm text-foreground">
                        নতুন স্টক হবে: <strong>{selectedProduct.stock + stockQuantity} {selectedProduct.unit}</strong>
                      </p>
                    </div>
                  )}

                  <Button 
                    onClick={handleAddStockToExisting}
                    disabled={!selectedProductId || stockQuantity <= 0}
                    className="w-full"
                    size="lg"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    স্টক যোগ করুন
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* New Product */}
          <TabsContent value="new" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Plus className="h-5 w-5 text-primary" />
                  নতুন পণ্য তৈরি করুন
                </CardTitle>
                <CardDescription>
                  নতুন পণ্য তৈরি করুন এবং সাথে সাথে স্টক যোগ করুন
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Basic Info */}
                  <div className="space-y-2">
                    <Label>পণ্যের নাম *</Label>
                    <Input
                      value={newProduct.name}
                      onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                      placeholder="যেমন: স্যামসাং গ্যালাক্সি A54"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>SKU *</Label>
                    <Input
                      value={newProduct.sku}
                      onChange={(e) => setNewProduct({...newProduct, sku: e.target.value.toUpperCase()})}
                      placeholder="SAM-A54"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>ক্যাটাগরি</Label>
                    <Select 
                      value={newProduct.categoryId} 
                      onValueChange={(v) => setNewProduct({...newProduct, categoryId: v})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="ক্যাটাগরি সিলেক্ট" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>ব্র্যান্ড</Label>
                    <Select 
                      value={newProduct.brandId} 
                      onValueChange={(v) => setNewProduct({...newProduct, brandId: v})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="ব্র্যান্ড সিলেক্ট" />
                      </SelectTrigger>
                      <SelectContent>
                        {brands.map((brand) => (
                          <SelectItem key={brand.id} value={brand.id}>{brand.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>ক্রয় মূল্য (৳)</Label>
                    <Input
                      type="number"
                      min={0}
                      value={newProduct.purchaseCost}
                      onChange={(e) => setNewProduct({...newProduct, purchaseCost: parseFloat(e.target.value) || 0})}
                      placeholder="0"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>বিক্রয় মূল্য (৳)</Label>
                    <Input
                      type="number"
                      min={0}
                      value={newProduct.salePrice}
                      onChange={(e) => setNewProduct({...newProduct, salePrice: parseFloat(e.target.value) || 0})}
                      placeholder="0"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>প্রারম্ভিক স্টক</Label>
                    <Input
                      type="number"
                      min={0}
                      value={newProduct.stock}
                      onChange={(e) => setNewProduct({...newProduct, stock: parseInt(e.target.value) || 0})}
                      placeholder="0"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>একক</Label>
                    <Select 
                      value={newProduct.unit} 
                      onValueChange={(v) => setNewProduct({...newProduct, unit: v})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pcs">পিস</SelectItem>
                        <SelectItem value="kg">কেজি</SelectItem>
                        <SelectItem value="liter">লিটার</SelectItem>
                        <SelectItem value="box">বক্স</SelectItem>
                        <SelectItem value="dozen">ডজন</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>লো স্টক এলার্ট</Label>
                    <Input
                      type="number"
                      min={0}
                      value={newProduct.lowStockThreshold}
                      onChange={(e) => setNewProduct({...newProduct, lowStockThreshold: parseInt(e.target.value) || 0})}
                      placeholder="10"
                    />
                  </div>

                  {/* Warranty Section */}
                  <div className="space-y-2">
                    <Label>ওয়ারেন্টি ধরন</Label>
                    <Select 
                      value={newProduct.warrantyType} 
                      onValueChange={(v) => setNewProduct({...newProduct, warrantyType: v as any})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">কোন ওয়ারেন্টি নেই</SelectItem>
                        <SelectItem value="warranty">ওয়ারেন্টি</SelectItem>
                        <SelectItem value="guarantee">গ্যারান্টি</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {newProduct.warrantyType !== 'none' && (
                    <>
                      <div className="space-y-2">
                        <Label>ওয়ারেন্টি সময়কাল</Label>
                        <Input
                          type="number"
                          min={0}
                          value={newProduct.warrantyDuration}
                          onChange={(e) => setNewProduct({...newProduct, warrantyDuration: parseInt(e.target.value) || 0})}
                          placeholder="1"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>একক</Label>
                        <Select 
                          value={newProduct.warrantyUnit} 
                          onValueChange={(v) => setNewProduct({...newProduct, warrantyUnit: v as any})}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="days">দিন</SelectItem>
                            <SelectItem value="months">মাস</SelectItem>
                            <SelectItem value="years">বছর</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </>
                  )}

                  {/* Description - Full width */}
                  <div className="md:col-span-2 lg:col-span-3 space-y-2">
                    <Label>বিবরণ (ঐচ্ছিক)</Label>
                    <Textarea
                      value={newProduct.description}
                      onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                      placeholder="পণ্যের বিবরণ লিখুন..."
                      rows={2}
                    />
                  </div>

                  {/* Switches */}
                  <div className="md:col-span-2 lg:col-span-3 flex flex-wrap gap-6 pt-2">
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={newProduct.serialRequired}
                        onCheckedChange={(v) => setNewProduct({...newProduct, serialRequired: v})}
                      />
                      <Label>সিরিয়াল নম্বর প্রয়োজন</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={newProduct.batchTracking}
                        onCheckedChange={(v) => setNewProduct({...newProduct, batchTracking: v})}
                      />
                      <Label>ব্যাচ ট্র্যাকিং</Label>
                    </div>
                  </div>
                </div>

                {/* Profit Preview */}
                {newProduct.salePrice > 0 && newProduct.purchaseCost > 0 && (
                  <div className="mt-6 p-4 rounded-lg bg-primary/10 border border-primary/20">
                    <p className="text-sm text-foreground">
                      প্রতি ইউনিট লাভ: <strong>{formatBDT(newProduct.salePrice - newProduct.purchaseCost)}</strong>
                      {' '}({((newProduct.salePrice - newProduct.purchaseCost) / newProduct.purchaseCost * 100).toFixed(1)}%)
                    </p>
                    {newProduct.stock > 0 && (
                      <p className="text-sm text-foreground">
                        মোট স্টক মূল্য: <strong>{formatBDT(newProduct.purchaseCost * newProduct.stock)}</strong>
                      </p>
                    )}
                  </div>
                )}

                <div className="mt-6 flex justify-end gap-3">
                  <Button variant="outline" onClick={() => navigate(-1)}>
                    বাতিল
                  </Button>
                  <Button 
                    onClick={handleAddNewProduct}
                    disabled={!newProduct.name || !newProduct.sku}
                    size="lg"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    পণ্য সংরক্ষণ করুন
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </ReadOnlyGuard>
  );
}
