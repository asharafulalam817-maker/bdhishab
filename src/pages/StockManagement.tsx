import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  Package,
  PackagePlus,
  PackageMinus,
  Settings2,
  Search,
  ArrowUpDown,
  AlertTriangle,
  XCircle,
  TrendingUp,
  TrendingDown,
  ScanLine,
} from 'lucide-react';
import { useStockManagement } from '@/hooks/useStockManagement';
import { StockLedgerTable } from '@/components/stock/StockLedgerTable';
import { StockInDialog } from '@/components/stock/StockInDialog';
import { StockOutDialog } from '@/components/stock/StockOutDialog';
import { StockAdjustmentDialog } from '@/components/stock/StockAdjustmentDialog';
import { BarcodeScanner } from '@/components/pos/BarcodeScanner';
import { toast } from 'sonner';

export default function StockManagement() {
  const {
    products,
    ledgerEntries,
    stats,
    searchQuery,
    setSearchQuery,
    transactionFilter,
    setTransactionFilter,
    addStockIn,
    addStockOut,
    createAdjustment,
  } = useStockManagement();

  const [stockInOpen, setStockInOpen] = useState(false);
  const [stockOutOpen, setStockOutOpen] = useState(false);
  const [adjustmentOpen, setAdjustmentOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('ledger');
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [scanAction, setScanAction] = useState<'in' | 'out'>('in');
  const [preselectedProductId, setPreselectedProductId] = useState<string | undefined>();

  const handleBarcodeScan = (barcode: string) => {
    // Find product by barcode or SKU
    const product = products.find(
      (p) => p.barcode === barcode || p.sku === barcode
    );

    if (product) {
      setPreselectedProductId(product.id);
      setIsScannerOpen(false);
      
      if (scanAction === 'in') {
        setStockInOpen(true);
        toast.success(`"${product.name}" স্টক ইন এর জন্য সিলেক্ট হয়েছে`);
      } else {
        if (product.stock > 0) {
          setStockOutOpen(true);
          toast.success(`"${product.name}" স্টক আউট এর জন্য সিলেক্ট হয়েছে`);
        } else {
          toast.error(`"${product.name}" এর স্টক নেই`);
        }
      }
    } else {
      setIsScannerOpen(false);
      toast.error(`বারকোড "${barcode}" দিয়ে কোনো পণ্য পাওয়া যায়নি`);
    }
  };

  const openScannerForStockIn = () => {
    setScanAction('in');
    setIsScannerOpen(true);
  };

  const openScannerForStockOut = () => {
    setScanAction('out');
    setIsScannerOpen(true);
  };

  const handleStockIn = (
    productId: string,
    quantity: number,
    options?: { batchNumber?: string; serialNumber?: string; notes?: string }
  ) => {
    addStockIn(productId, quantity, options);
    toast.success('স্টক সফলভাবে যোগ হয়েছে');
  };

  const handleStockOut = (
    productId: string,
    quantity: number,
    options?: { batchNumber?: string; serialNumber?: string; notes?: string }
  ) => {
    addStockOut(productId, quantity, options);
    toast.success('স্টক সফলভাবে কমানো হয়েছে');
  };

  const handleAdjustment = (
    items: { productId: string; newStock: number; reason: string }[],
    notes?: string
  ) => {
    createAdjustment(items, notes);
    toast.success(`${items.length}টি পণ্যের স্টক এডজাস্ট করা হয়েছে`);
  };

  // Low stock products
  const lowStockProducts = products.filter(
    (p) => p.stock > 0 && p.stock <= p.lowStockThreshold
  );
  const outOfStockProducts = products.filter((p) => p.stock === 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 p-4 md:p-6"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">স্টক ম্যানেজমেন্ট</h1>
          <p className="text-muted-foreground">
            স্টক ইন/আউট, এডজাস্টমেন্ট এবং লেজার দেখুন
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <div className="flex gap-1">
            <Button
              onClick={() => {
                setPreselectedProductId(undefined);
                setStockInOpen(true);
              }}
              className="bg-green-600 hover:bg-green-700"
            >
              <PackagePlus className="h-4 w-4 mr-2" />
              স্টক ইন
            </Button>
            <Button
              onClick={openScannerForStockIn}
              size="icon"
              className="bg-green-600 hover:bg-green-700"
              title="বারকোড স্ক্যান করে স্টক ইন"
            >
              <ScanLine className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex gap-1">
            <Button
              onClick={() => {
                setPreselectedProductId(undefined);
                setStockOutOpen(true);
              }}
              variant="destructive"
            >
              <PackageMinus className="h-4 w-4 mr-2" />
              স্টক আউট
            </Button>
            <Button
              onClick={openScannerForStockOut}
              size="icon"
              variant="destructive"
              title="বারকোড স্ক্যান করে স্টক আউট"
            >
              <ScanLine className="h-4 w-4" />
            </Button>
          </div>
          <Button
            onClick={() => setAdjustmentOpen(true)}
            variant="outline"
          >
            <Settings2 className="h-4 w-4 mr-2" />
            এডজাস্টমেন্ট
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">আজকের স্টক ইন</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              +{stats.stockInToday}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">আজকের স্টক আউট</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              -{stats.stockOutToday}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">কম স্টক</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {stats.lowStockProducts}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">স্টক শেষ</CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {stats.outOfStockProducts}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="ledger" className="gap-2">
            <ArrowUpDown className="h-4 w-4" />
            স্টক লেজার
          </TabsTrigger>
          <TabsTrigger value="low-stock" className="gap-2">
            <AlertTriangle className="h-4 w-4" />
            কম স্টক
            {lowStockProducts.length > 0 && (
              <Badge variant="destructive" className="ml-1">
                {lowStockProducts.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="out-of-stock" className="gap-2">
            <XCircle className="h-4 w-4" />
            স্টক শেষ
            {outOfStockProducts.length > 0 && (
              <Badge variant="destructive" className="ml-1">
                {outOfStockProducts.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        {/* Stock Ledger Tab */}
        <TabsContent value="ledger" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              {/* Filters */}
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="পণ্য খুঁজুন..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <Select
                  value={transactionFilter}
                  onValueChange={setTransactionFilter}
                >
                  <SelectTrigger className="w-full md:w-[200px]">
                    <SelectValue placeholder="ধরন ফিল্টার" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">সব ধরন</SelectItem>
                    <SelectItem value="stock_in">স্টক ইন</SelectItem>
                    <SelectItem value="stock_out">স্টক আউট</SelectItem>
                    <SelectItem value="adjustment">এডজাস্টমেন্ট</SelectItem>
                    <SelectItem value="sale">বিক্রয়</SelectItem>
                    <SelectItem value="purchase">ক্রয়</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Ledger Table */}
              <StockLedgerTable entries={ledgerEntries} />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Low Stock Tab */}
        <TabsContent value="low-stock" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              {lowStockProducts.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <AlertTriangle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  কম স্টকে কোনো পণ্য নেই
                </div>
              ) : (
                <div className="grid gap-4">
                  {lowStockProducts.map((product) => (
                    <div
                      key={product.id}
                      className="flex items-center justify-between p-4 border rounded-lg bg-yellow-50 dark:bg-yellow-900/10"
                    >
                      <div className="flex items-center gap-4">
                        <Package className="h-10 w-10 text-yellow-600" />
                        <div>
                          <h3 className="font-semibold">{product.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            SKU: {product.sku}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant="outline" className="text-yellow-600 border-yellow-600">
                          স্টক: {product.stock} / {product.lowStockThreshold}
                        </Badge>
                        <p className="text-sm text-muted-foreground mt-1">
                          থ্রেশহোল্ড: {product.lowStockThreshold}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => {
                          setStockInOpen(true);
                        }}
                      >
                        <PackagePlus className="h-4 w-4 mr-1" />
                        স্টক বাড়ান
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Out of Stock Tab */}
        <TabsContent value="out-of-stock" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              {outOfStockProducts.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <XCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  স্টক শেষ হওয়া কোনো পণ্য নেই
                </div>
              ) : (
                <div className="grid gap-4">
                  {outOfStockProducts.map((product) => (
                    <div
                      key={product.id}
                      className="flex items-center justify-between p-4 border rounded-lg bg-red-50 dark:bg-red-900/10"
                    >
                      <div className="flex items-center gap-4">
                        <Package className="h-10 w-10 text-red-600" />
                        <div>
                          <h3 className="font-semibold">{product.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            SKU: {product.sku}
                          </p>
                        </div>
                      </div>
                      <Badge variant="destructive">স্টক শেষ</Badge>
                      <Button
                        size="sm"
                        onClick={() => {
                          setStockInOpen(true);
                        }}
                      >
                        <PackagePlus className="h-4 w-4 mr-1" />
                        স্টক যোগ করুন
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialogs */}
      <StockInDialog
        open={stockInOpen}
        onOpenChange={(open) => {
          setStockInOpen(open);
          if (!open) setPreselectedProductId(undefined);
        }}
        products={products}
        onSubmit={handleStockIn}
        preselectedProductId={preselectedProductId}
      />

      <StockOutDialog
        open={stockOutOpen}
        onOpenChange={(open) => {
          setStockOutOpen(open);
          if (!open) setPreselectedProductId(undefined);
        }}
        products={products}
        onSubmit={handleStockOut}
        preselectedProductId={preselectedProductId}
      />

      <StockAdjustmentDialog
        open={adjustmentOpen}
        onOpenChange={setAdjustmentOpen}
        products={products}
        onSubmit={handleAdjustment}
      />

      <BarcodeScanner
        open={isScannerOpen}
        onOpenChange={setIsScannerOpen}
        onScan={handleBarcodeScan}
      />
    </motion.div>
  );
}
