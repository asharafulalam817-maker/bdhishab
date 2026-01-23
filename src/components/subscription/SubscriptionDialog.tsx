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
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { 
  Crown, 
  Check, 
  Clock, 
  Smartphone,
  Copy,
  CheckCircle2,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { useSubscription, SubscriptionPackage } from '@/hooks/useSubscription';
import { formatBDT } from '@/lib/constants';
import { toast } from 'sonner';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const PAYMENT_NUMBER = '01712022987';

const PaymentMethodIcon = ({ method }: { method: string }) => {
  const colors: Record<string, string> = {
    bkash: 'bg-pink-500',
    rocket: 'bg-purple-600',
    nagad: 'bg-orange-500'
  };
  
  return (
    <div className={`w-8 h-8 rounded-full ${colors[method]} flex items-center justify-center text-white font-bold text-xs`}>
      {method[0].toUpperCase()}
    </div>
  );
};

export function SubscriptionDialog({ open, onOpenChange }: Props) {
  const {
    packages,
    subscription,
    payments,
    isLoading,
    isSubscriptionActive,
    isOnTrial,
    isPaid,
    getDaysRemaining,
    hasPendingPayment,
    submitPayment
  } = useSubscription();

  const [selectedPackage, setSelectedPackage] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<string>('bkash');
  const [senderNumber, setSenderNumber] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copiedNumber, setCopiedNumber] = useState(false);

  const handleCopyNumber = () => {
    navigator.clipboard.writeText(PAYMENT_NUMBER);
    setCopiedNumber(true);
    toast.success('নম্বর কপি করা হয়েছে');
    setTimeout(() => setCopiedNumber(false), 2000);
  };

  const handleSubmitPayment = async () => {
    if (!selectedPackage || !senderNumber || !transactionId) {
      toast.error('সব তথ্য পূরণ করুন');
      return;
    }

    setIsSubmitting(true);
    await submitPayment(selectedPackage, paymentMethod, senderNumber, transactionId);
    setIsSubmitting(false);
    setSenderNumber('');
    setTransactionId('');
  };

  const getPackageDiscount = (pkg: SubscriptionPackage): number | null => {
    const monthlyRate = 77;
    const expectedPrice = monthlyRate * pkg.duration_months;
    if (pkg.price < expectedPrice) {
      return Math.round((1 - pkg.price / expectedPrice) * 100);
    }
    return null;
  };

  if (isLoading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[600px]">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[650px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Crown className="h-5 w-5 text-yellow-500" />
            সাবস্ক্রিপশন
          </DialogTitle>
        </DialogHeader>

        {/* Current Status */}
        <Card className="border-primary/20 bg-accent">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">বর্তমান অবস্থা</p>
                <div className="flex items-center gap-2 mt-1">
                  {isPaid() ? (
                    <Badge className="bg-green-500">পেইড</Badge>
                  ) : isOnTrial() ? (
                    <Badge variant="secondary">ফ্রি ট্রায়াল</Badge>
                  ) : isSubscriptionActive() ? (
                    <Badge>সক্রিয়</Badge>
                  ) : (
                    <Badge variant="destructive">মেয়াদ শেষ</Badge>
                  )}
                  {isSubscriptionActive() && (
                    <span className="text-sm text-muted-foreground">
                      {getDaysRemaining()} দিন বাকি
                    </span>
                  )}
                </div>
              </div>
              {isOnTrial() && (
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">ট্রায়াল শেষ</p>
                  <p className="font-medium">{subscription?.end_date}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="packages" className="mt-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="packages">প্যাকেজ</TabsTrigger>
            <TabsTrigger value="history">পেমেন্ট হিস্টোরি</TabsTrigger>
          </TabsList>

          <TabsContent value="packages" className="space-y-4 mt-4">
            {/* Pending Payment Alert */}
            {hasPendingPayment() && (
              <div className="flex items-center gap-2 p-3 bg-secondary rounded-lg border border-border">
                <Clock className="h-5 w-5 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  আপনার একটি পেমেন্ট ভেরিফিকেশনের অপেক্ষায় আছে
                </p>
              </div>
            )}

            {/* Package Selection */}
            <div className="grid grid-cols-2 gap-3">
              {packages.map((pkg) => {
                const discount = getPackageDiscount(pkg);
                const isSelected = selectedPackage === pkg.id;
                
                return (
                  <Card 
                    key={pkg.id}
                    className={`cursor-pointer transition-all ${
                      isSelected 
                        ? 'ring-2 ring-primary border-primary' 
                        : 'hover:border-primary/50'
                    }`}
                    onClick={() => setSelectedPackage(pkg.id)}
                  >
                    <CardHeader className="p-3 pb-2">
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-sm">{pkg.name_bn}</CardTitle>
                        {discount && (
                          <Badge variant="secondary" className="text-xs">
                            {discount}% ছাড়
                          </Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="p-3 pt-0">
                      <div className="text-2xl font-bold text-primary">
                        {formatBDT(pkg.price)}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {pkg.duration_months} মাস
                      </p>
                      <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                        <Smartphone className="h-3 w-3" />
                        {pkg.max_devices}টি ডিভাইস
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Payment Form */}
            {selectedPackage && (
              <Card className="mt-4">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">পেমেন্ট করুন</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Payment Number */}
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div>
                      <p className="text-xs text-muted-foreground">পেমেন্ট পাঠান</p>
                      <p className="font-mono font-bold text-lg">{PAYMENT_NUMBER}</p>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={handleCopyNumber}
                    >
                      {copiedNumber ? <CheckCircle2 className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>

                  {/* Payment Method */}
                  <div className="space-y-2">
                    <Label>পেমেন্ট মেথড</Label>
                    <RadioGroup 
                      value={paymentMethod} 
                      onValueChange={setPaymentMethod}
                      className="flex gap-4"
                    >
                      {['bkash', 'rocket', 'nagad'].map((method) => (
                        <div key={method} className="flex items-center space-x-2">
                          <RadioGroupItem value={method} id={method} />
                          <Label htmlFor={method} className="flex items-center gap-2 cursor-pointer">
                            <PaymentMethodIcon method={method} />
                            <span className="capitalize">{method}</span>
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>

                  {/* Sender Number */}
                  <div className="space-y-2">
                    <Label>আপনার নম্বর (যে নম্বর থেকে পাঠিয়েছেন)</Label>
                    <Input
                      value={senderNumber}
                      onChange={(e) => setSenderNumber(e.target.value)}
                      placeholder="01XXXXXXXXX"
                    />
                  </div>

                  {/* Transaction ID */}
                  <div className="space-y-2">
                    <Label>ট্রানজেকশন আইডি</Label>
                    <Input
                      value={transactionId}
                      onChange={(e) => setTransactionId(e.target.value)}
                      placeholder="TrxID"
                    />
                  </div>

                  <Button 
                    className="w-full" 
                    onClick={handleSubmitPayment}
                    disabled={isSubmitting || !senderNumber || !transactionId}
                  >
                    {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                    পেমেন্ট সাবমিট করুন
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="history" className="mt-4">
            {payments.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                কোন পেমেন্ট হিস্টোরি নেই
              </div>
            ) : (
              <div className="space-y-3">
                {payments.map((payment) => (
                  <Card key={payment.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <PaymentMethodIcon method={payment.payment_method} />
                          <div>
                            <p className="font-medium">
                              {payment.package?.name_bn || 'প্যাকেজ'}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {payment.sender_number} • {payment.transaction_id}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(payment.created_at).toLocaleDateString('bn-BD')}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">{formatBDT(payment.amount)}</p>
                          {payment.status === 'pending' && (
                            <Badge variant="secondary" className="mt-1">
                              <Clock className="h-3 w-3 mr-1" />
                              অপেক্ষমান
                            </Badge>
                          )}
                          {payment.status === 'verified' && (
                            <Badge className="bg-green-500 mt-1">
                              <Check className="h-3 w-3 mr-1" />
                              ভেরিফাইড
                            </Badge>
                          )}
                          {payment.status === 'rejected' && (
                            <Badge variant="destructive" className="mt-1">
                              <AlertCircle className="h-3 w-3 mr-1" />
                              বাতিল
                            </Badge>
                          )}
                        </div>
                      </div>
                      {payment.status === 'rejected' && payment.rejection_reason && (
                        <p className="text-sm text-destructive mt-2">
                          কারণ: {payment.rejection_reason}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
