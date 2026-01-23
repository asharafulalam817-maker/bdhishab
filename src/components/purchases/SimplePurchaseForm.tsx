import { useState, useEffect, useMemo, useRef } from 'react';
import { Plus, Loader2, User, Calendar, Package, Upload, Hash, Tag, Shield, Wallet, UserPlus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent } from '@/components/ui/card';
import { formatBDT } from '@/lib/constants';
import type { Supplier } from '@/hooks/useSuppliers';
import { DEMO_CATEGORIES, DEMO_BRANDS } from '@/hooks/useProducts';

// Categories that typically have warranty
const WARRANTY_CATEGORIES = ['1', '2', '3', '4', '7', '8', '9', '10']; // Mobile, Accessories, Electronics, Laptop, Gaming, Home Appliances, Camera, Networking

interface SimplePurchaseFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: SimplePurchaseData) => void;
  suppliers: Supplier[];
  currentBalance?: number;
  onAddNewSupplier?: (supplier: { name: string; phone: string }) => Supplier;
}

export interface SimplePurchaseData {
  supplier_id: string;
  supplier_name?: string;
  purchase_date: string;
  invoice_number: string;
  product_name: string;
  product_image?: string;
  category_id: string;
  quantity: number;
  purchase_cost: number;
  sale_price: number;
  warranty_type: 'none' | 'official' | 'local' | 'shop';
  warranty_duration: number;
  warranty_unit: 'days' | 'months' | 'years';
  paid_amount: number;
  deductFromBalance: boolean;
  notes: string;
}

export function SimplePurchaseForm({
  open,
  onOpenChange,
  onSubmit,
  suppliers,
  currentBalance = 0,
  onAddNewSupplier,
}: SimplePurchaseFormProps) {
  // Supplier
  const [supplierId, setSupplierId] = useState('');
  const [showNewSupplier, setShowNewSupplier] = useState(false);
  const [newSupplierName, setNewSupplierName] = useState('');
  const [newSupplierPhone, setNewSupplierPhone] = useState('');
  
  // Basic info
  const [purchaseDate, setPurchaseDate] = useState(new Date().toISOString().split('T')[0]);
  const [invoiceNumber, setInvoiceNumber] = useState('');
  
  // Product info
  const [productName, setProductName] = useState('');
  const [productImage, setProductImage] = useState<string | null>(null);
  const [productImageFile, setProductImageFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [categoryId, setCategoryId] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [purchaseCost, setPurchaseCost] = useState(0);
  const [salePrice, setSalePrice] = useState(0);
  
  // Warranty
  const [warrantyType, setWarrantyType] = useState<'none' | 'official' | 'local' | 'shop'>('none');
  const [warrantyDuration, setWarrantyDuration] = useState(0);
  const [warrantyUnit, setWarrantyUnit] = useState<'days' | 'months' | 'years'>('months');
  
  // Payment
  const [paidAmount, setPaidAmount] = useState(0);
  const [deductFromBalance, setDeductFromBalance] = useState(true);
  const [notes, setNotes] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localSuppliers, setLocalSuppliers] = useState<Supplier[]>(suppliers);

  useEffect(() => {
    setLocalSuppliers(suppliers);
  }, [suppliers]);

  // Reset form when dialog opens
  useEffect(() => {
    if (open) {
      setSupplierId('');
      setShowNewSupplier(false);
      setNewSupplierName('');
      setNewSupplierPhone('');
      setPurchaseDate(new Date().toISOString().split('T')[0]);
      setInvoiceNumber('');
      setProductName('');
      setProductImage(null);
      setProductImageFile(null);
      setQuantity(1);
      setPurchaseCost(0);
      setSalePrice(0);
      setWarrantyType('none');
      setWarrantyDuration(0);
      setWarrantyUnit('months');
      setPaidAmount(0);
      setDeductFromBalance(true);
      setNotes('');
    }
  }, [open]);

  const totalCost = useMemo(() => quantity * purchaseCost, [quantity, purchaseCost]);
  const totalSale = useMemo(() => quantity * salePrice, [quantity, salePrice]);
  const profit = useMemo(() => totalSale - totalCost, [totalSale, totalCost]);
  const dueAmount = useMemo(() => totalCost - paidAmount, [totalCost, paidAmount]);
  const insufficientBalance = deductFromBalance && paidAmount > currentBalance;
  
  // Check if selected category supports warranty
  const showWarrantySection = useMemo(() => WARRANTY_CATEGORIES.includes(categoryId), [categoryId]);

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProductImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProductImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setProductImage(null);
    setProductImageFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleAddNewSupplier = () => {
    if (!newSupplierName.trim()) return;
    
    if (onAddNewSupplier) {
      const newSupplier = onAddNewSupplier({ name: newSupplierName, phone: newSupplierPhone });
      setLocalSuppliers(prev => [...prev, newSupplier]);
      setSupplierId(newSupplier.id);
    } else {
      // Create a temporary supplier
      const tempSupplier: Supplier = {
        id: `temp-${Date.now()}`,
        name: newSupplierName,
        phone: newSupplierPhone,
        email: null,
        address: null,
        due_amount: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      setLocalSuppliers(prev => [...prev, tempSupplier]);
      setSupplierId(tempSupplier.id);
    }
    
    setShowNewSupplier(false);
    setNewSupplierName('');
    setNewSupplierPhone('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productName.trim() || quantity <= 0) return;

    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 300));

    const supplier = localSuppliers.find(s => s.id === supplierId);
    
    onSubmit({
      supplier_id: supplierId,
      supplier_name: supplier?.name,
      purchase_date: purchaseDate,
      invoice_number: invoiceNumber,
      product_name: productName,
      product_image: productImage || undefined,
      category_id: categoryId,
      quantity,
      purchase_cost: purchaseCost,
      sale_price: salePrice,
      warranty_type: warrantyType,
      warranty_duration: warrantyDuration,
      warranty_unit: warrantyUnit,
      paid_amount: paidAmount,
      deductFromBalance: paidAmount > 0 ? deductFromBalance : false,
      notes,
    });

    setIsSubmitting(false);
    onOpenChange(false);
  };

  const warrantyTypes = [
    { value: 'none', label: 'কোন ওয়ারেন্টি নেই' },
    { value: 'official', label: 'অফিসিয়াল ওয়ারেন্টি' },
    { value: 'local', label: 'লোকাল ওয়ারেন্টি' },
    { value: 'shop', label: 'দোকান ওয়ারেন্টি' },
  ];

  const warrantyUnits = [
    { value: 'days', label: 'দিন' },
    { value: 'months', label: 'মাস' },
    { value: 'years', label: 'বছর' },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[95vh] p-0 flex flex-col">
        <DialogHeader className="p-6 pb-0 flex-shrink-0">
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            নতুন ক্রয় এন্ট্রি
          </DialogTitle>
          <DialogDescription>
            পণ্য ক্রয়ের সব তথ্য এক জায়গায় দিন
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <ScrollArea className="flex-1 px-6">
            <div className="space-y-5 py-4 pb-6">
              
              {/* Supplier Section */}
              <Card className="border-primary/20">
                <CardContent className="pt-4 space-y-3">
                  <Label className="text-sm font-medium flex items-center gap-2">
                    <User className="h-4 w-4" />
                    সরবরাহকারী
                  </Label>
                  
                  {!showNewSupplier ? (
                    <div className="flex gap-2">
                      <Select value={supplierId} onValueChange={setSupplierId}>
                        <SelectTrigger className="flex-1">
                          <SelectValue placeholder="সরবরাহকারী নির্বাচন করুন" />
                        </SelectTrigger>
                        <SelectContent>
                          {localSuppliers.map((supplier) => (
                            <SelectItem key={supplier.id} value={supplier.id}>
                              {supplier.name} {supplier.phone && `(${supplier.phone})`}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="icon"
                        onClick={() => setShowNewSupplier(true)}
                        title="নতুন সরবরাহকারী"
                      >
                        <UserPlus className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-2 p-3 bg-muted/50 rounded-lg">
                      <div className="flex gap-2">
                        <Input
                          placeholder="সরবরাহকারীর নাম *"
                          value={newSupplierName}
                          onChange={(e) => setNewSupplierName(e.target.value)}
                          className="flex-1"
                        />
                        <Input
                          placeholder="ফোন"
                          value={newSupplierPhone}
                          onChange={(e) => setNewSupplierPhone(e.target.value)}
                          className="w-32"
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          type="button" 
                          size="sm" 
                          onClick={handleAddNewSupplier}
                          disabled={!newSupplierName.trim()}
                        >
                          <Plus className="h-3 w-3 mr-1" />
                          যোগ করুন
                        </Button>
                        <Button 
                          type="button" 
                          size="sm" 
                          variant="ghost"
                          onClick={() => {
                            setShowNewSupplier(false);
                            setNewSupplierName('');
                            setNewSupplierPhone('');
                          }}
                        >
                          বাতিল
                        </Button>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        তারিখ
                      </Label>
                      <Input
                        type="date"
                        value={purchaseDate}
                        onChange={(e) => setPurchaseDate(e.target.value)}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground flex items-center gap-1">
                        <Hash className="h-3 w-3" />
                        চালান নং (ঐচ্ছিক)
                      </Label>
                      <Input
                        placeholder="INV-001"
                        value={invoiceNumber}
                        onChange={(e) => setInvoiceNumber(e.target.value)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Product Section */}
              <Card className="border-primary/20">
                <CardContent className="pt-4 space-y-3">
                  <Label className="text-sm font-medium flex items-center gap-2">
                    <Package className="h-4 w-4" />
                    পণ্যের তথ্য
                  </Label>
                  
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">পণ্যের নাম *</Label>
                    <Input
                      placeholder="পণ্যের নাম লিখুন"
                      value={productName}
                      onChange={(e) => setProductName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground flex items-center gap-1">
                        <Upload className="h-3 w-3" />
                        পণ্যের ছবি (ঐচ্ছিক)
                      </Label>
                      <div className="flex flex-col gap-2">
                        {productImage ? (
                          <div className="relative w-24 h-24 group">
                            <img 
                              src={productImage} 
                              alt="Product preview" 
                              className="w-full h-full object-cover rounded-lg border"
                            />
                            <button
                              type="button"
                              onClick={removeImage}
                              className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        ) : (
                          <label className="flex items-center justify-center w-24 h-24 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                            <input
                              ref={fileInputRef}
                              type="file"
                              accept="image/*"
                              onChange={handleImageUpload}
                              className="hidden"
                            />
                            <div className="text-center">
                              <Upload className="h-6 w-6 mx-auto text-muted-foreground" />
                              <span className="text-xs text-muted-foreground">ছবি দিন</span>
                            </div>
                          </label>
                        )}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground flex items-center gap-1">
                        <Tag className="h-3 w-3" />
                        ক্যাটাগরি
                      </Label>
                      <Select value={categoryId} onValueChange={setCategoryId}>
                        <SelectTrigger>
                          <SelectValue placeholder="নির্বাচন করুন" />
                        </SelectTrigger>
                        <SelectContent>
                          {DEMO_CATEGORIES.map((cat) => (
                            <SelectItem key={cat.id} value={cat.id}>
                              {cat.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Separator />

                  <div className="grid grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground">পরিমাণ *</Label>
                      <Input
                        type="number"
                        min="1"
                        value={quantity}
                        onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground">ক্রয় মূল্য (৳) *</Label>
                      <Input
                        type="number"
                        min="0"
                        value={purchaseCost}
                        onChange={(e) => setPurchaseCost(parseFloat(e.target.value) || 0)}
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground">বিক্রয় মূল্য (৳)</Label>
                      <Input
                        type="number"
                        min="0"
                        value={salePrice}
                        onChange={(e) => setSalePrice(parseFloat(e.target.value) || 0)}
                      />
                    </div>
                  </div>

                  {salePrice > 0 && purchaseCost > 0 && (
                    <div className={`text-sm p-2 rounded ${profit >= 0 ? 'bg-green-500/10 text-green-600' : 'bg-red-500/10 text-red-600'}`}>
                      প্রতি পণ্যে {profit >= 0 ? 'লাভ' : 'ক্ষতি'}: {formatBDT(Math.abs(salePrice - purchaseCost))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Warranty Section - Only show for warranty-eligible categories */}
              {showWarrantySection && (
                <Card className="border-primary/20">
                  <CardContent className="pt-4 space-y-3">
                    <Label className="text-sm font-medium flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      ওয়ারেন্টি
                    </Label>
                    
                    <div className="grid grid-cols-3 gap-3">
                      <div className="space-y-1">
                        <Label className="text-xs text-muted-foreground">ধরন</Label>
                        <Select value={warrantyType} onValueChange={(v) => setWarrantyType(v as typeof warrantyType)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {warrantyTypes.map((type) => (
                              <SelectItem key={type.value} value={type.value}>
                                {type.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      {warrantyType !== 'none' && (
                        <>
                          <div className="space-y-1">
                            <Label className="text-xs text-muted-foreground">মেয়াদ</Label>
                            <Input
                              type="number"
                              min="0"
                              value={warrantyDuration}
                              onChange={(e) => setWarrantyDuration(parseInt(e.target.value) || 0)}
                            />
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs text-muted-foreground">একক</Label>
                            <Select value={warrantyUnit} onValueChange={(v) => setWarrantyUnit(v as typeof warrantyUnit)}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {warrantyUnits.map((unit) => (
                                  <SelectItem key={unit.value} value={unit.value}>
                                    {unit.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Payment Summary */}
              <Card className="border-primary/20 bg-primary/5">
                <CardContent className="pt-4 space-y-3">
                  <Label className="text-sm font-medium flex items-center gap-2">
                    <Wallet className="h-4 w-4" />
                    পেমেন্ট
                  </Label>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">মোট ক্রয় মূল্য:</span>
                      <span className="font-bold text-lg">{formatBDT(totalCost)}</span>
                    </div>
                    
                    <div className="flex justify-between items-center gap-3">
                      <Label className="text-sm text-muted-foreground">পরিশোধ:</Label>
                      <Input
                        type="number"
                        min="0"
                        className="w-40 text-right"
                        value={paidAmount}
                        onChange={(e) => setPaidAmount(parseFloat(e.target.value) || 0)}
                      />
                    </div>

                    {paidAmount > 0 && (
                      <div className="p-3 rounded-lg bg-background border space-y-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="deductBalance"
                            checked={deductFromBalance}
                            onCheckedChange={(checked) => setDeductFromBalance(checked as boolean)}
                          />
                          <Label htmlFor="deductBalance" className="text-sm cursor-pointer">
                            ব্যালেন্স থেকে কাটুন
                          </Label>
                        </div>
                        
                        {deductFromBalance && (
                          <div className="text-xs text-muted-foreground">
                            বর্তমান ব্যালেন্স: <span className="font-medium">{formatBDT(currentBalance)}</span>
                            {insufficientBalance ? (
                              <span className="text-destructive block">⚠️ ব্যালেন্স পর্যাপ্ত নয়</span>
                            ) : (
                              <span className="block">পরে থাকবে: {formatBDT(currentBalance - paidAmount)}</span>
                            )}
                          </div>
                        )}
                      </div>
                    )}

                    <div className="flex justify-between pt-2 border-t">
                      <span className="font-medium">বাকি:</span>
                      <span className={`font-bold ${dueAmount > 0 ? 'text-destructive' : 'text-green-600'}`}>
                        {formatBDT(dueAmount)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Notes */}
              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">নোট (ঐচ্ছিক)</Label>
                <Textarea
                  placeholder="অতিরিক্ত তথ্য..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={2}
                />
              </div>
            </div>
          </ScrollArea>

          <DialogFooter className="p-6 pt-4 border-t flex-shrink-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              বাতিল
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting || !productName.trim() || quantity <= 0 || insufficientBalance}
              className="min-w-[140px]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  সংরক্ষণ হচ্ছে...
                </>
              ) : (
                <>
                  <Package className="mr-2 h-4 w-4" />
                  ক্রয় সংরক্ষণ
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
