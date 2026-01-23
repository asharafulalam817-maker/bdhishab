import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
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
} from 'lucide-react';
import { bn, formatBDT, formatNumberBn } from '@/lib/constants';
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
import { useToast } from '@/hooks/use-toast';
import POSInvoiceDialog from '@/components/pos/POSInvoiceDialog';
import { InvoiceData, InvoiceTemplate } from '@/components/invoice/types';

// Demo products
const demoProducts = [
  { id: '1', name: 'স্যামসাং গ্যালাক্সি A54', sku: 'SAM-A54', price: 35000, stock: 15 },
  { id: '2', name: 'আইফোন ১৫ প্রো ম্যাক্স', sku: 'IP15-PRO', price: 175000, stock: 3 },
  { id: '3', name: 'শাওমি পাওয়ার ব্যাংক', sku: 'XM-PB20', price: 1800, stock: 45 },
  { id: '4', name: 'JBL ব্লুটুথ স্পিকার', sku: 'JBL-BT01', price: 4500, stock: 8 },
  { id: '5', name: 'রিয়েলমি সি৫৫', sku: 'RM-C55', price: 18500, stock: 22 },
];

// Demo customers
const demoCustomers = [
  { id: '1', name: 'মোহাম্মদ করিম', phone: '01712345678' },
  { id: '2', name: 'ফাতেমা বেগম', phone: '01812345678' },
  { id: '3', name: 'রহিম উদ্দিন', phone: '01912345678' },
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
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [paidAmount, setPaidAmount] = useState('');
  const [discount, setDiscount] = useState('');
  const [notes, setNotes] = useState('');
  const [showInvoice, setShowInvoice] = useState(false);
  const [currentInvoice, setCurrentInvoice] = useState<InvoiceData | null>(null);

  const filteredProducts = demoProducts.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const addToCart = (product: typeof demoProducts[0]) => {
    const existingItem = cart.find((item) => item.productId === product.id);
    if (existingItem) {
      if (existingItem.quantity >= product.stock) {
        toast({
          title: bn.sales.insufficientStock,
          description: `মাত্র ${product.stock} পিস স্টক আছে`,
          variant: 'destructive',
        });
        return;
      }
      setCart(
        cart.map((item) =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCart([
        ...cart,
        {
          productId: product.id,
          name: product.name,
          sku: product.sku,
          price: product.price,
          quantity: 1,
          discount: 0,
          stock: product.stock,
        },
      ]);
    }
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart(
      cart.map((item) => {
        if (item.productId === productId) {
          const newQty = item.quantity + delta;
          if (newQty <= 0) return item;
          if (newQty > item.stock) {
            toast({
              title: bn.sales.insufficientStock,
              variant: 'destructive',
            });
            return item;
          }
          return { ...item, quantity: newQty };
        }
        return item;
      })
    );
  };

  const removeFromCart = (productId: string) => {
    setCart(cart.filter((item) => item.productId !== productId));
  };

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discountAmount = parseFloat(discount) || 0;
  const grandTotal = subtotal - discountAmount;
  const paid = parseFloat(paidAmount) || 0;
  const due = Math.max(0, grandTotal - paid);

  const handleCheckout = () => {
    if (cart.length === 0) {
      toast({
        title: 'কার্ট খালি!',
        description: 'অনুগ্রহ করে পণ্য যোগ করুন',
        variant: 'destructive',
      });
      return;
    }

    // Generate invoice number
    const now = new Date();
    const invoiceNumber = `INV-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`;
    
    // Get customer info
    const customer = demoCustomers.find(c => c.id === selectedCustomer);

    // Create invoice data
    const invoiceData: InvoiceData = {
      id: crypto.randomUUID(),
      invoiceNumber,
      invoiceDate: now.toLocaleDateString('bn-BD'),
      store: {
        name: 'ডিজিটাল স্টোর',
        phone: '০১৭১২৩৪৫৬৭৮',
        address: 'মিরপুর-১০, ঢাকা',
      },
      customer: customer ? {
        name: customer.name,
        phone: customer.phone,
      } : undefined,
      items: cart.map(item => ({
        id: item.productId,
        name: item.name,
        sku: item.sku,
        quantity: item.quantity,
        unitPrice: item.price,
        discount: item.discount,
        total: item.price * item.quantity - item.discount,
      })),
      subtotal,
      discount: discountAmount,
      tax: 0,
      total: grandTotal,
      paidAmount: paid,
      dueAmount: due,
      paymentMethod: paymentMethod === 'cash' ? 'নগদ' : 
                     paymentMethod === 'bkash' ? 'বিকাশ' : 
                     paymentMethod === 'nagad' ? 'নগদ' : 
                     paymentMethod === 'bank' ? 'ব্যাংক' : 'বাকি',
      paymentStatus: due > 0 ? 'partial' : 'paid',
      notes,
      footerNote: 'ধন্যবাদ! আবার আসবেন।',
    };

    setCurrentInvoice(invoiceData);
    setShowInvoice(true);

    toast({
      title: 'বিক্রয় সফল! ✓',
      description: `চালান নং: ${invoiceNumber}`,
    });
  };

  const handleInvoiceClose = () => {
    setShowInvoice(false);
    setCurrentInvoice(null);
    // Reset cart
    setCart([]);
    setPaidAmount('');
    setDiscount('');
    setNotes('');
    setSelectedCustomer('');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-4"
    >
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title flex items-center gap-2">
            <ShoppingCart className="h-6 w-6" />
            {bn.nav.pos}
          </h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Products Section */}
        <div className="lg:col-span-2 space-y-4">
          {/* Search */}
          <Card>
            <CardContent className="p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="পণ্যের নাম বা SKU দিয়ে খুঁজুন..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </CardContent>
          </Card>

          {/* Products Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {filteredProducts.map((product) => (
              <motion.button
                key={product.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => addToCart(product)}
                className="p-4 rounded-lg bg-card border border-border shadow-sm hover:shadow-md hover:border-primary/30 transition-all text-left"
              >
                <div className="font-medium text-sm line-clamp-2 mb-2">{product.name}</div>
                <div className="text-xs text-muted-foreground mb-2">{product.sku}</div>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-primary">{formatBDT(product.price)}</span>
                  <Badge variant={product.stock < 5 ? 'destructive' : 'secondary'} className="text-xs">
                    {product.stock} পিস
                  </Badge>
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Cart Section */}
        <div className="space-y-4">
          {/* Customer Select */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <User className="h-4 w-4" />
                {bn.sales.selectCustomer}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={selectedCustomer} onValueChange={setSelectedCustomer}>
                <SelectTrigger>
                  <SelectValue placeholder="গ্রাহক নির্বাচন করুন" />
                </SelectTrigger>
                <SelectContent>
                  {demoCustomers.map((customer) => (
                    <SelectItem key={customer.id} value={customer.id}>
                      {customer.name} - {customer.phone}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Cart Items */}
          <Card className="flex-1">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <ShoppingCart className="h-4 w-4" />
                  কার্ট
                </span>
                <Badge variant="secondary">{cart.length} আইটেম</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 max-h-[300px] overflow-y-auto">
              {cart.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  কার্ট খালি
                </div>
              ) : (
                cart.map((item) => (
                  <motion.div
                    key={item.productId}
                    layout
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex items-center gap-3 p-3 rounded-lg bg-muted/50"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{item.name}</p>
                      <p className="text-xs text-muted-foreground">{formatBDT(item.price)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => updateQuantity(item.productId, -1)}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-8 text-center font-medium">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => updateQuantity(item.productId, 1)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-destructive hover:text-destructive"
                      onClick={() => removeFromCart(item.productId)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </motion.div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Payment Section */}
          <Card>
            <CardContent className="p-4 space-y-4">
              {/* Totals */}
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{bn.sales.subtotal}</span>
                  <span>{formatBDT(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{bn.sales.discount}</span>
                  <Input
                    type="number"
                    placeholder="০"
                    value={discount}
                    onChange={(e) => setDiscount(e.target.value)}
                    className="w-24 h-8 text-right"
                  />
                </div>
                <div className="flex justify-between text-lg font-bold pt-2 border-t">
                  <span>{bn.sales.grandTotal}</span>
                  <span className="text-primary">{formatBDT(grandTotal)}</span>
                </div>
              </div>

              {/* Payment Method */}
              <div className="space-y-2">
                <Label>{bn.sales.paymentMethod}</Label>
                <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash">{bn.sales.cash}</SelectItem>
                    <SelectItem value="bkash">{bn.sales.bkash}</SelectItem>
                    <SelectItem value="nagad">{bn.sales.nagad}</SelectItem>
                    <SelectItem value="bank">{bn.sales.bank}</SelectItem>
                    <SelectItem value="due">{bn.sales.due}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Paid Amount */}
              <div className="space-y-2">
                <Label>{bn.sales.paidAmount}</Label>
                <Input
                  type="number"
                  placeholder="০"
                  value={paidAmount}
                  onChange={(e) => setPaidAmount(e.target.value)}
                />
              </div>

              {/* Due */}
              {due > 0 && (
                <div className="flex justify-between text-sm font-medium text-warning">
                  <span>{bn.sales.dueAmount}</span>
                  <span>{formatBDT(due)}</span>
                </div>
              )}

              {/* Notes */}
              <div className="space-y-2">
                <Label>{bn.sales.notes}</Label>
                <Textarea
                  placeholder="নোট (ঐচ্ছিক)"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={2}
                />
              </div>

              {/* Checkout Button */}
              <Button
                className="w-full gap-2"
                size="lg"
                onClick={handleCheckout}
                disabled={cart.length === 0}
              >
                <Receipt className="h-5 w-5" />
                বিক্রয় সম্পন্ন করুন
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Invoice Preview Dialog */}
      <POSInvoiceDialog
        invoice={currentInvoice}
        template="minimal"
        open={showInvoice}
        onClose={handleInvoiceClose}
      />
    </motion.div>
  );
}
