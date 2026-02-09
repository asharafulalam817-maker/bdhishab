import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Search,
  Minus,
  Trash2,
  User,
  ShoppingCart,
  CreditCard,
  Receipt,
  Check,
  Printer,
  ScanLine,
  Package,
  Hash,
  Percent,
  X,
  UserPlus,
  Phone,
  Wallet,
  FileText,
  AlertCircle,
  Calendar as CalendarIcon,
  ListOrdered,
} from 'lucide-react';
import { formatBDT, formatNumberBn } from '@/lib/constants';
import { useLanguage } from '@/contexts/LanguageContext';
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
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import POSInvoiceDialog from '@/components/pos/POSInvoiceDialog';
import { BarcodeScanner } from '@/components/pos/BarcodeScanner';
import { InvoiceData, InvoiceTemplate } from '@/components/invoice/types';
import { toast as sonnerToast } from 'sonner';
import { useBalance } from '@/hooks/useBalance';
import { ReadOnlyGuard } from '@/components/subscription/ReadOnlyGuard';
import { CustomerFormDialog } from '@/components/customers/CustomerFormDialog';
import type { CustomerFormData } from '@/hooks/useCustomers';

// Demo products with barcodes
const demoProducts = [
  { id: '1', name: 'স্যামসাং গ্যালাক্সি A54', sku: 'SAM-A54', barcode: '8801643123451', price: 35000, cost: 30000, stock: 15, category: 'মোবাইল' },
  { id: '2', name: 'আইফোন ১৫ প্রো ম্যাক্স', sku: 'IP15-PRO', barcode: '0194253456780', price: 175000, cost: 160000, stock: 3, category: 'মোবাইল' },
  { id: '3', name: 'শাওমি পাওয়ার ব্যাংক', sku: 'XM-PB20', barcode: '6934177712345', price: 1800, cost: 1200, stock: 45, category: 'এক্সেসরিজ' },
  { id: '4', name: 'JBL ব্লুটুথ স্পিকার', sku: 'JBL-BT01', barcode: '0500000012345', price: 4500, cost: 3500, stock: 8, category: 'এক্সেসরিজ' },
  { id: '5', name: 'রিয়েলমি সি৫৫', sku: 'RM-C55', barcode: '6941399012345', price: 18500, cost: 16000, stock: 22, category: 'মোবাইল' },
  { id: '6', name: 'স্যামসাং ইয়ারবাড প্রো', sku: 'SAM-EBP', barcode: '8806094123456', price: 8500, cost: 6500, stock: 30, category: 'এক্সেসরিজ' },
  { id: '7', name: 'অ্যাংকার চার্জার ৬৫W', sku: 'ANK-65W', barcode: '0194644012345', price: 3200, cost: 2200, stock: 50, category: 'এক্সেসরিজ' },
  { id: '8', name: 'টেকনো স্পার্ক ২০', sku: 'TKN-SP20', barcode: '6940456112345', price: 12500, cost: 10500, stock: 18, category: 'মোবাইল' },
];

// Demo customers
const demoCustomers = [
  { id: '1', name: 'মোহাম্মদ করিম', phone: '01712345678', due: 5000 },
  { id: '2', name: 'ফাতেমা বেগম', phone: '01812345678', due: 0 },
  { id: '3', name: 'রহিম উদ্দিন', phone: '01912345678', due: 12000 },
];

interface CartItem {
  productId: string;
  name: string;
  sku: string;
  price: number;
  quantity: number;
  discount: number;
  stock: number;
}

export default function POS() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const saleMode = searchParams.get('mode') || 'cash';
  const { toast } = useToast();
  const { t } = useLanguage();
  const { addSaleToBalance, balance, refreshBalance } = useBalance();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [paymentMethod, setPaymentMethod] = useState(saleMode === 'due' ? 'due' : 'cash');
  const [paidAmount, setPaidAmount] = useState('');
  const [discount, setDiscount] = useState('');
  const [notes, setNotes] = useState('');
  const [showInvoice, setShowInvoice] = useState(false);
  const [currentInvoice, setCurrentInvoice] = useState<InvoiceData | null>(null);
  const [scannerOpen, setScannerOpen] = useState(false);
  const [showProductList, setShowProductList] = useState(false);
  const [showNewCustomer, setShowNewCustomer] = useState(false);
  const [customers, setCustomers] = useState(demoCustomers);

  // Installment config states
  const [totalInstallments, setTotalInstallments] = useState('3');
  const [downPayment, setDownPayment] = useState('');
  const [installmentStartDate, setInstallmentStartDate] = useState(
    new Date().toISOString().split('T')[0]
  );

  const handleAddCustomer = (data: CustomerFormData) => {
    const newCustomer = {
      id: Date.now().toString(),
      name: data.name,
      phone: data.phone || '',
      due: 0,
    };
    setCustomers((prev) => [newCustomer, ...prev]);
    setSelectedCustomer(newCustomer.id);
    sonnerToast.success(`${newCustomer.name} যোগ করা হয়েছে`);
  };

  const filteredProducts = demoProducts.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.barcode.includes(searchQuery)
  );

  const handleBarcodeScan = (barcode: string) => {
    const product = demoProducts.find(
      (p) => p.barcode === barcode || p.sku.toLowerCase() === barcode.toLowerCase()
    );
    if (product) {
      addToCart(product);
      sonnerToast.success(`${product.name} ${t('pos.productAdded')}`, {
        description: `${t('products.barcode')}: ${barcode}`,
      });
    } else {
      sonnerToast.error(t('pos.productNotFound'), {
        description: `${t('products.barcode')}: ${barcode}`,
      });
    }
  };

  const addToCart = (product: typeof demoProducts[0]) => {
    const existingItem = cart.find((item) => item.productId === product.id);
    if (existingItem) {
      if (existingItem.quantity >= product.stock) {
        toast({ title: t('pos.insufficientStock'), variant: 'destructive' });
        return;
      }
      setCart(cart.map((item) =>
        item.productId === product.id ? { ...item, quantity: item.quantity + 1 } : item
      ));
    } else {
      setCart([...cart, {
        productId: product.id, name: product.name, sku: product.sku,
        price: product.price, quantity: 1, discount: 0, stock: product.stock,
      }]);
    }
    setSearchQuery('');
    setShowProductList(false);
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart(cart.map((item) => {
      if (item.productId === productId) {
        const newQty = item.quantity + delta;
        if (newQty <= 0) return item;
        if (newQty > item.stock) {
          toast({ title: t('pos.insufficientStock'), variant: 'destructive' });
          return item;
        }
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const updateItemDiscount = (productId: string, discountVal: number) => {
    setCart(cart.map((item) =>
      item.productId === productId ? { ...item, discount: discountVal } : item
    ));
  };

  const updateItemPrice = (productId: string, newPrice: number) => {
    setCart(cart.map((item) =>
      item.productId === productId ? { ...item, price: newPrice } : item
    ));
  };

  const removeFromCart = (productId: string) => {
    setCart(cart.filter((item) => item.productId !== productId));
  };

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const itemDiscounts = cart.reduce((sum, item) => sum + item.discount, 0);
  const discountAmount = (parseFloat(discount) || 0) + itemDiscounts;
  const grandTotal = Math.max(0, subtotal - discountAmount);
  const paid = parseFloat(paidAmount) || 0;
  const due = Math.max(0, grandTotal - paid);
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const selectedCustomerData = customers.find(c => c.id === selectedCustomer);

  // Installment calculations
  const installmentCount = parseInt(totalInstallments) || 1;
  const downPaymentAmount = parseFloat(downPayment) || 0;
  const remainingForInstallments = Math.max(0, grandTotal - downPaymentAmount);
  const perInstallmentAmount = installmentCount > 0 ? Math.ceil(remainingForInstallments / installmentCount) : 0;

  // Generate installment schedule
  const getInstallmentSchedule = () => {
    const schedule = [];
    const startDate = new Date(installmentStartDate);
    for (let i = 0; i < installmentCount; i++) {
      const dueDate = new Date(startDate);
      dueDate.setMonth(dueDate.getMonth() + i + 1);
      schedule.push({
        number: i + 1,
        amount: perInstallmentAmount,
        dueDate: dueDate.toLocaleDateString('bn-BD', { year: 'numeric', month: 'long', day: 'numeric' }),
        dueDateISO: dueDate.toISOString().split('T')[0],
      });
    }
    return schedule;
  };

  const handleCheckout = async () => {
    if (cart.length === 0) {
      toast({ title: t('pos.emptyCart'), description: t('common.add') + ' ' + t('products.title').toLowerCase(), variant: 'destructive' });
      return;
    }

    const now = new Date();
    const invoiceNumber = `INV-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`;
    const customer = customers.find(c => c.id === selectedCustomer);

    const invoiceData: InvoiceData = {
      id: crypto.randomUUID(),
      invoiceNumber,
      invoiceDate: now.toLocaleDateString('bn-BD'),
      store: { name: 'ডিজিটাল স্টোর', phone: '০১৭১২৩৪৫৬৭৮', address: 'মিরপুর-১০, ঢাকা' },
      customer: customer ? { name: customer.name, phone: customer.phone } : undefined,
      items: cart.map(item => ({
        id: item.productId, name: item.name, sku: item.sku,
        quantity: item.quantity, unitPrice: item.price, discount: item.discount,
        total: item.price * item.quantity - item.discount,
      })),
      subtotal, discount: discountAmount, tax: 0, total: grandTotal,
      paidAmount: paid, dueAmount: due,
      paymentMethod: paymentMethod === 'cash' ? t('pos.cash') : paymentMethod === 'bkash' ? t('pos.bkash') : paymentMethod === 'nagad' ? t('pos.nagad') : paymentMethod === 'bank' ? t('pos.bank') : t('pos.due'),
      paymentStatus: due > 0 ? 'partial' : 'paid',
      notes, footerNote: 'ধন্যবাদ! আবার আসবেন।',
    };

    if (paid > 0) await addSaleToBalance(paid, invoiceData.id);
    setCurrentInvoice(invoiceData);
    setShowInvoice(true);
    toast({ title: `${t('pos.saleSuccess')} ✓`, description: `${t('pos.invoiceNo')}: ${invoiceNumber}` });
  };

  const handleInvoiceClose = () => {
    setShowInvoice(false);
    setCurrentInvoice(null);
    setCart([]);
    setPaidAmount('');
    setDiscount('');
    setNotes('');
    setSelectedCustomer('');
  };

  const handleSearchFocus = () => {
    setShowProductList(true);
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && filteredProducts.length === 1) {
      addToCart(filteredProducts[0]);
    }
  };

  return (
    <ReadOnlyGuard featureName="নতুন বিক্রয়">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
        {/* Top Bar - Compact Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold flex items-center gap-2 text-foreground">
            <div className="h-9 w-9 rounded-lg bg-primary flex items-center justify-center">
              <ShoppingCart className="h-5 w-5 text-primary-foreground" />
            </div>
            {saleMode === 'due' ? 'কিস্তিতে বিক্রি' : 'নগদে বিক্রি'}
          </h1>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="gap-1.5 px-3 py-1.5 text-sm font-mono">
              <Wallet className="h-3.5 w-3.5" />
              {formatBDT(balance?.current_balance ?? 0)}
            </Badge>
          </div>
        </div>

        {/* Main Layout - Full Width */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-3">
          {/* Left: Customer + Product Search + Cart Table */}
          <div className="xl:col-span-8 space-y-3">
            {/* Customer & Search Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* Customer Selection */}
              <Card className="border-2 border-dashed border-primary/20">
                <CardContent className="p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <User className="h-4 w-4 text-primary" />
                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      কাস্টমার তথ্য
                    </Label>
                  </div>
                  <div className="flex gap-2">
                    <Select value={selectedCustomer} onValueChange={setSelectedCustomer}>
                      <SelectTrigger className="h-10 flex-1">
                        <SelectValue placeholder="কাস্টমার সিলেক্ট করুন..." />
                      </SelectTrigger>
                      <SelectContent>
                        {customers.map((customer) => (
                          <SelectItem key={customer.id} value={customer.id}>
                            <div className="flex items-center justify-between w-full gap-4">
                              <span className="font-medium">{customer.name}</span>
                              <span className="text-muted-foreground text-xs">{customer.phone}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button
                      variant="outline"
                      size="icon"
                      className="shrink-0 h-10 w-10 border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground"
                      title="নতুন কাস্টমার যোগ করুন"
                      onClick={() => setShowNewCustomer(true)}
                    >
                      <UserPlus className="h-4 w-4" />
                    </Button>
                  </div>
                  {selectedCustomerData && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-2 flex items-center gap-3 text-xs"
                    >
                      <span className="flex items-center gap-1 text-muted-foreground">
                        <Phone className="h-3 w-3" />
                        {selectedCustomerData.phone}
                      </span>
                      {selectedCustomerData.due > 0 && (
                        <Badge variant="destructive" className="text-xs gap-1">
                          <AlertCircle className="h-3 w-3" />
                          পূর্বের বাকি: {formatBDT(selectedCustomerData.due)}
                        </Badge>
                      )}
                    </motion.div>
                  )}
                </CardContent>
              </Card>

              {/* Product Search */}
              <Card className="border-2 border-dashed border-primary/20">
                <CardContent className="p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Package className="h-4 w-4 text-primary" />
                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      পণ্য যোগ করুন
                    </Label>
                  </div>
                  <div className="relative">
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          placeholder="নাম, SKU বা বারকোড দিয়ে সার্চ..."
                          value={searchQuery}
                          onChange={(e) => {
                            setSearchQuery(e.target.value);
                            setShowProductList(true);
                          }}
                          onFocus={handleSearchFocus}
                          onKeyDown={handleSearchKeyDown}
                          className="pl-9 h-10"
                        />
                      </div>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setScannerOpen(true)}
                        className="shrink-0 h-10 w-10"
                        title={t('pos.scanBarcode')}
                      >
                        <ScanLine className="h-5 w-5" />
                      </Button>
                    </div>

                    {/* Dropdown product list */}
                    <AnimatePresence>
                      {showProductList && searchQuery.length > 0 && (
                        <motion.div
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -5 }}
                          className="absolute z-50 top-full mt-1 left-0 right-0 bg-popover border border-border rounded-lg shadow-xl max-h-[280px] overflow-y-auto"
                        >
                          {filteredProducts.length === 0 ? (
                            <div className="p-4 text-center text-muted-foreground text-sm">
                              কোনো পণ্য পাওয়া যায়নি
                            </div>
                          ) : (
                            filteredProducts.map((product) => (
                              <button
                                key={product.id}
                                onClick={() => addToCart(product)}
                                className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-accent transition-colors text-left border-b border-border/50 last:border-0"
                              >
                                <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                                  <Package className="h-4 w-4 text-primary" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="font-medium text-sm truncate">{product.name}</p>
                                  <p className="text-xs text-muted-foreground">
                                    {product.sku} • {product.category}
                                  </p>
                                </div>
                                <div className="text-right shrink-0">
                                  <p className="font-bold text-sm text-primary">{formatBDT(product.price)}</p>
                                  <p className={`text-xs ${product.stock < 5 ? 'text-destructive' : 'text-muted-foreground'}`}>
                                    স্টক: {product.stock}
                                  </p>
                                </div>
                                <Plus className="h-4 w-4 text-primary shrink-0" />
                              </button>
                            ))
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Cart Table - Enterprise Style */}
            <Card>
              <CardHeader className="py-3 px-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-bold flex items-center gap-2 uppercase tracking-wider text-muted-foreground">
                    <Receipt className="h-4 w-4" />
                    বিক্রয় আইটেম
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="font-mono">
                      {cart.length} আইটেম • {totalItems} পিস
                    </Badge>
                    {cart.length > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 text-xs text-destructive hover:text-destructive"
                        onClick={() => setCart([])}
                      >
                        <Trash2 className="h-3 w-3 mr-1" />
                        সব মুছুন
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead className="w-8 text-center font-bold">#</TableHead>
                      <TableHead className="font-bold">পণ্যের নাম</TableHead>
                      <TableHead className="font-bold text-center w-[100px]">SKU</TableHead>
                      <TableHead className="font-bold text-right w-[120px]">দাম (৳)</TableHead>
                      <TableHead className="font-bold text-center w-[140px]">পরিমাণ</TableHead>
                      <TableHead className="font-bold text-right w-[100px]">ছাড় (৳)</TableHead>
                      <TableHead className="font-bold text-right w-[120px]">মোট (৳)</TableHead>
                      <TableHead className="w-10"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {cart.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-16">
                          <div className="flex flex-col items-center gap-3 text-muted-foreground">
                            <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
                              <ShoppingCart className="h-8 w-8" />
                            </div>
                            <div>
                              <p className="font-medium text-foreground">কার্ট খালি</p>
                              <p className="text-sm">উপরে সার্চ করে পণ্য যোগ করুন</p>
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      <AnimatePresence>
                        {cart.map((item, index) => (
                          <motion.tr
                            key={item.productId}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ delay: index * 0.03 }}
                            className="group hover:bg-accent/50"
                          >
                            <TableCell className="text-center text-muted-foreground font-mono text-xs">
                              {index + 1}
                            </TableCell>
                            <TableCell>
                              <p className="font-medium text-sm">{item.name}</p>
                            </TableCell>
                            <TableCell className="text-center">
                              <code className="text-xs bg-muted px-1.5 py-0.5 rounded">{item.sku}</code>
                            </TableCell>
                            <TableCell className="text-right">
                              <Input
                                type="number"
                                value={item.price}
                                onChange={(e) => updateItemPrice(item.productId, parseFloat(e.target.value) || 0)}
                                className="h-8 w-[100px] text-right text-sm font-mono ml-auto"
                              />
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center justify-center gap-1">
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-7 w-7"
                                  onClick={() => updateQuantity(item.productId, -1)}
                                >
                                  <Minus className="h-3 w-3" />
                                </Button>
                                <span className="w-10 text-center font-bold font-mono">{item.quantity}</span>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-7 w-7"
                                  onClick={() => updateQuantity(item.productId, 1)}
                                >
                                  <Plus className="h-3 w-3" />
                                </Button>
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <Input
                                type="number"
                                value={item.discount || ''}
                                onChange={(e) => updateItemDiscount(item.productId, parseFloat(e.target.value) || 0)}
                                placeholder="০"
                                className="h-8 w-[80px] text-right text-sm font-mono ml-auto"
                              />
                            </TableCell>
                            <TableCell className="text-right font-bold font-mono text-primary">
                              {formatBDT(item.price * item.quantity - item.discount)}
                            </TableCell>
                            <TableCell>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 opacity-0 group-hover:opacity-100 text-destructive hover:text-destructive transition-opacity"
                                onClick={() => removeFromCart(item.productId)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </motion.tr>
                        ))}
                      </AnimatePresence>
                    )}
                  </TableBody>
                </Table>
              </div>
            </Card>
          </div>

          {/* Right: Payment & Summary Panel */}
          <div className="xl:col-span-4 space-y-3">
            {/* Summary Card */}
            <Card className="border-2 border-primary/20 shadow-lg">
              <CardHeader className="py-3 px-4 bg-primary/5">
                <CardTitle className="text-sm font-bold flex items-center gap-2 uppercase tracking-wider text-primary">
                  <CreditCard className="h-4 w-4" />
                  বিল সামারি
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-3">
                {/* Bill Details */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">সাবটোটাল ({totalItems} পিস)</span>
                    <span className="font-mono">{formatBDT(subtotal)}</span>
                  </div>
                  {itemDiscounts > 0 && (
                    <div className="flex justify-between text-sm text-destructive">
                      <span>আইটেম ডিসকাউন্ট</span>
                      <span className="font-mono">-{formatBDT(itemDiscounts)}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground flex items-center gap-1">
                      <Percent className="h-3 w-3" />
                      অতিরিক্ত ছাড়
                    </span>
                    <Input
                      type="number"
                      placeholder="০"
                      value={discount}
                      onChange={(e) => setDiscount(e.target.value)}
                      className="w-24 h-8 text-right font-mono"
                    />
                  </div>
                </div>

                <Separator />

                {/* Grand Total */}
                <div className="flex justify-between items-center py-2">
                  <span className="text-lg font-bold">সর্বমোট</span>
                  <motion.span
                    key={grandTotal}
                    initial={{ scale: 1.2, color: 'hsl(var(--primary))' }}
                    animate={{ scale: 1, color: 'hsl(var(--foreground))' }}
                    className="text-2xl font-black font-mono"
                  >
                    {formatBDT(grandTotal)}
                  </motion.span>
                </div>

                <Separator />

                {saleMode === 'due' ? (
                  /* Installment Configuration */
                  <>
                    <div className="space-y-2">
                      <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                        <ListOrdered className="h-3 w-3" />
                        কিস্তি কনফিগারেশন
                      </Label>

                      {/* Down Payment */}
                      <div className="space-y-1">
                        <Label className="text-xs text-muted-foreground">ডাউন পেমেন্ট (৳)</Label>
                        <Input
                          type="number"
                          placeholder="০"
                          value={downPayment}
                          onChange={(e) => setDownPayment(e.target.value)}
                          className="h-10 font-mono text-right"
                        />
                      </div>

                      {/* Number of Installments */}
                      <div className="space-y-1">
                        <Label className="text-xs text-muted-foreground">কিস্তির সংখ্যা</Label>
                        <Select value={totalInstallments} onValueChange={setTotalInstallments}>
                          <SelectTrigger className="h-10">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {[1, 2, 3, 4, 5, 6, 8, 10, 12, 18, 24].map((n) => (
                              <SelectItem key={n} value={String(n)}>
                                {n} কিস্তি
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Start Date */}
                      <div className="space-y-1">
                        <Label className="text-xs text-muted-foreground flex items-center gap-1">
                          <CalendarIcon className="h-3 w-3" />
                          কিস্তি শুরুর তারিখ
                        </Label>
                        <Input
                          type="date"
                          value={installmentStartDate}
                          onChange={(e) => setInstallmentStartDate(e.target.value)}
                          className="h-10"
                        />
                      </div>
                    </div>

                    <Separator />

                    {/* Installment Summary */}
                    {grandTotal > 0 && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="rounded-lg border border-primary/20 bg-primary/5 p-3 space-y-2"
                      >
                        <p className="text-xs font-bold uppercase tracking-wider text-primary">কিস্তি সারাংশ</p>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">মোট মূল্য</span>
                            <span className="font-mono font-bold">{formatBDT(grandTotal)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">ডাউন পেমেন্ট</span>
                            <span className="font-mono font-bold text-primary">{formatBDT(downPaymentAmount)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">বাকি পরিমাণ</span>
                            <span className="font-mono font-bold">{formatBDT(remainingForInstallments)}</span>
                          </div>
                          <Separator className="my-1" />
                          <div className="flex justify-between items-center">
                            <span className="font-bold">প্রতি কিস্তি</span>
                            <span className="text-lg font-black font-mono text-primary">{formatBDT(perInstallmentAmount)}</span>
                          </div>
                        </div>

                        {/* Installment Schedule */}
                        <div className="mt-2 max-h-[150px] overflow-y-auto space-y-1">
                          {getInstallmentSchedule().map((inst) => (
                            <div
                              key={inst.number}
                              className="flex items-center justify-between text-xs bg-background/60 rounded px-2 py-1.5"
                            >
                              <span className="text-muted-foreground">
                                কিস্তি #{inst.number}
                              </span>
                              <span className="text-muted-foreground">{inst.dueDate}</span>
                              <span className="font-mono font-bold">{formatBDT(inst.amount)}</span>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}

                    {/* Customer required warning */}
                    {!selectedCustomer && (
                      <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-2 flex items-center gap-2 text-xs text-destructive">
                        <AlertCircle className="h-4 w-4 shrink-0" />
                        কিস্তিতে বিক্রির জন্য কাস্টমার সিলেক্ট করা আবশ্যক
                      </div>
                    )}
                  </>
                ) : (
                  /* Regular Payment Section */
                  <>
                    {/* Payment Method - Visual Buttons */}
                    <div className="space-y-2">
                      <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        পেমেন্ট মাধ্যম
                      </Label>
                      <div className="grid grid-cols-3 gap-1.5">
                        {[
                          { value: 'cash', label: 'ক্যাশ', icon: '💵' },
                          { value: 'bkash', label: 'বিকাশ', icon: '📱' },
                          { value: 'nagad', label: 'নগদ', icon: '📲' },
                          { value: 'bank', label: 'ব্যাংক', icon: '🏦' },
                          { value: 'due', label: 'বাকি', icon: '📝' },
                          { value: 'mixed', label: 'মিশ্র', icon: '🔄' },
                        ].map((method) => (
                          <Button
                            key={method.value}
                            variant={paymentMethod === method.value ? 'default' : 'outline'}
                            size="sm"
                            className="h-10 text-xs font-medium"
                            onClick={() => setPaymentMethod(method.value)}
                          >
                            <span className="mr-1">{method.icon}</span>
                            {method.label}
                          </Button>
                        ))}
                      </div>
                    </div>

                    {/* Paid Amount */}
                    <div className="space-y-2">
                      <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        প্রদত্ত টাকা
                      </Label>
                      <Input
                        type="number"
                        placeholder="০"
                        value={paidAmount}
                        onChange={(e) => setPaidAmount(e.target.value)}
                        className="h-12 text-xl font-bold font-mono text-right"
                      />
                      {/* Quick amount buttons */}
                      {grandTotal > 0 && (
                        <div className="flex gap-1.5">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 text-xs h-7"
                            onClick={() => setPaidAmount(String(grandTotal))}
                          >
                            পুরো: {formatBDT(grandTotal)}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 text-xs h-7"
                            onClick={() => setPaidAmount(String(Math.ceil(grandTotal / 1000) * 1000))}
                          >
                            {formatBDT(Math.ceil(grandTotal / 1000) * 1000)}
                          </Button>
                        </div>
                      )}
                    </div>

                    {/* Due / Change */}
                    {paid > 0 && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className={`rounded-lg p-3 text-center ${
                          due > 0
                            ? 'bg-destructive/10 border border-destructive/20'
                            : 'bg-primary/10 border border-primary/20'
                        }`}
                      >
                        {due > 0 ? (
                          <>
                            <p className="text-xs text-destructive font-medium">বাকি থাকবে</p>
                            <p className="text-xl font-black font-mono text-destructive">{formatBDT(due)}</p>
                          </>
                        ) : (
                          <>
                            <p className="text-xs text-primary font-medium">ফেরত দিন</p>
                            <p className="text-xl font-black font-mono text-primary">{formatBDT(paid - grandTotal)}</p>
                          </>
                        )}
                      </motion.div>
                    )}
                  </>
                )}

                {/* Notes */}
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                    <FileText className="h-3 w-3" />
                    নোট
                  </Label>
                  <Textarea
                    placeholder="বিশেষ কোনো তথ্য..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="h-14 text-sm resize-none"
                  />
                </div>

                {/* Checkout Button */}
                <Button
                  onClick={handleCheckout}
                  className="w-full gap-2 h-14 text-lg font-bold shadow-lg"
                  size="lg"
                  disabled={cart.length === 0 || (saleMode === 'due' && !selectedCustomer)}
                >
                  <Check className="h-6 w-6" />
                  {saleMode === 'due' ? 'কিস্তিতে বিক্রয় সম্পন্ন করুন' : 'বিক্রয় সম্পন্ন করুন'}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Invoice Dialog */}
        {currentInvoice && (
          <POSInvoiceDialog
            invoice={currentInvoice}
            template="modern"
            open={showInvoice}
            onClose={handleInvoiceClose}
          />
        )}

        {/* Barcode Scanner */}
        <BarcodeScanner
          open={scannerOpen}
          onOpenChange={setScannerOpen}
          onScan={handleBarcodeScan}
        />

        {/* New Customer Dialog */}
        <CustomerFormDialog
          open={showNewCustomer}
          onOpenChange={setShowNewCustomer}
          onSubmit={handleAddCustomer}
        />

        {/* Click outside to close product list */}
        {showProductList && (
          <div className="fixed inset-0 z-40" onClick={() => setShowProductList(false)} />
        )}
      </motion.div>
    </ReadOnlyGuard>
  );
}
