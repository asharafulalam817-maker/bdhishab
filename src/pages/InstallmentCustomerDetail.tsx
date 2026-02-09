import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Phone,
  User,
  CalendarDays,
  Banknote,
  CheckCircle,
  Clock,
  AlertTriangle,
  TrendingUp,
  ShoppingBag,
} from 'lucide-react';
import { formatBDT } from '@/lib/constants';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

// Demo data - same as Installments page
const demoInstallments = [
  {
    id: '1',
    customerName: 'মোহাম্মদ করিম',
    customerPhone: '01712345678',
    customerAddress: 'মিরপুর-১০, ঢাকা',
    customerEmail: 'karim@email.com',
    productName: 'স্যামসাং গ্যালাক্সি A54',
    totalAmount: 35000,
    downPayment: 10000,
    remainingAmount: 15000,
    totalInstallments: 5,
    installmentAmount: 5000,
    paidInstallments: 2,
    status: 'active' as const,
    createdAt: '2025-01-15',
    payments: [
      { number: 1, amount: 5000, dueDate: '2025-02-15', paidDate: '2025-02-14', status: 'paid' },
      { number: 2, amount: 5000, dueDate: '2025-03-15', paidDate: '2025-03-15', status: 'paid' },
      { number: 3, amount: 5000, dueDate: '2025-04-15', paidDate: null, status: 'pending' },
      { number: 4, amount: 5000, dueDate: '2025-05-15', paidDate: null, status: 'pending' },
      { number: 5, amount: 5000, dueDate: '2025-06-15', paidDate: null, status: 'pending' },
    ],
  },
  {
    id: '2',
    customerName: 'রহিম উদ্দিন',
    customerPhone: '01912345678',
    customerAddress: 'উত্তরা, ঢাকা',
    customerEmail: null,
    productName: 'আইফোন ১৫ প্রো ম্যাক্স',
    totalAmount: 175000,
    downPayment: 50000,
    remainingAmount: 50000,
    totalInstallments: 10,
    installmentAmount: 12500,
    paidInstallments: 6,
    status: 'active' as const,
    createdAt: '2024-12-01',
    payments: [
      { number: 1, amount: 12500, dueDate: '2025-01-01', paidDate: '2025-01-01', status: 'paid' },
      { number: 2, amount: 12500, dueDate: '2025-02-01', paidDate: '2025-02-01', status: 'paid' },
      { number: 3, amount: 12500, dueDate: '2025-03-01', paidDate: '2025-03-02', status: 'paid' },
      { number: 4, amount: 12500, dueDate: '2025-04-01', paidDate: '2025-04-01', status: 'paid' },
      { number: 5, amount: 12500, dueDate: '2025-05-01', paidDate: '2025-05-01', status: 'paid' },
      { number: 6, amount: 12500, dueDate: '2025-06-01', paidDate: '2025-06-01', status: 'paid' },
      { number: 7, amount: 12500, dueDate: '2025-07-01', paidDate: null, status: 'pending' },
      { number: 8, amount: 12500, dueDate: '2025-08-01', paidDate: null, status: 'pending' },
      { number: 9, amount: 12500, dueDate: '2025-09-01', paidDate: null, status: 'pending' },
      { number: 10, amount: 12500, dueDate: '2025-10-01', paidDate: null, status: 'pending' },
    ],
  },
  {
    id: '3',
    customerName: 'ফাতেমা বেগম',
    customerPhone: '01812345678',
    customerAddress: 'মোহাম্মদপুর, ঢাকা',
    customerEmail: 'fatema@email.com',
    productName: 'রিয়েলমি সি৫৫',
    totalAmount: 18500,
    downPayment: 5000,
    remainingAmount: 0,
    totalInstallments: 3,
    installmentAmount: 4500,
    paidInstallments: 3,
    status: 'completed' as const,
    createdAt: '2024-11-10',
    payments: [
      { number: 1, amount: 4500, dueDate: '2024-12-10', paidDate: '2024-12-10', status: 'paid' },
      { number: 2, amount: 4500, dueDate: '2025-01-10', paidDate: '2025-01-10', status: 'paid' },
      { number: 3, amount: 4500, dueDate: '2025-02-10', paidDate: '2025-02-09', status: 'paid' },
    ],
  },
];

export default function InstallmentCustomerDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const installment = demoInstallments.find((i) => i.id === id);

  if (!installment) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <AlertTriangle className="h-12 w-12 text-muted-foreground mb-4" />
        <h2 className="text-lg font-semibold">কিস্তি খুঁজে পাওয়া যায়নি</h2>
        <Button variant="outline" className="mt-4" onClick={() => navigate('/installments')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          ফিরে যান
        </Button>
      </div>
    );
  }

  const progressPercent = (installment.paidInstallments / installment.totalInstallments) * 100;
  const totalPaid = installment.downPayment + installment.paidInstallments * installment.installmentAmount;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-blue-500/10 text-blue-600 border-blue-200">চলমান</Badge>;
      case 'completed':
        return <Badge className="bg-green-500/10 text-green-600 border-green-200">সম্পন্ন</Badge>;
      case 'defaulted':
        return <Badge variant="destructive">বকেয়া</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPaymentStatusBadge = (status: string) => {
    if (status === 'paid') {
      return (
        <Badge className="bg-green-500/10 text-green-600 border-green-200">
          <CheckCircle className="h-3 w-3 mr-1" />
          পরিশোধিত
        </Badge>
      );
    }
    return (
      <Badge variant="outline" className="text-muted-foreground">
        <Clock className="h-3 w-3 mr-1" />
        বকেয়া
      </Badge>
    );
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate('/installments')}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-xl font-bold text-foreground">কাস্টমার প্রোফাইল</h1>
          <p className="text-sm text-muted-foreground">কিস্তির বিস্তারিত তথ্য ও রিপোর্ট</p>
        </div>
        {getStatusBadge(installment.status)}
      </div>

      {/* Customer Profile Card */}
      <Card>
        <CardContent className="p-5">
          <div className="flex items-start gap-4">
            <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <User className="h-7 w-7 text-primary" />
            </div>
            <div className="flex-1 space-y-1">
              <h2 className="text-lg font-bold text-foreground">{installment.customerName}</h2>
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-sm text-muted-foreground">
                <a href={`tel:${installment.customerPhone}`} className="flex items-center gap-1 text-primary hover:underline">
                  <Phone className="h-3.5 w-3.5" />
                  {installment.customerPhone}
                </a>
                {installment.customerEmail && (
                  <span>{installment.customerEmail}</span>
                )}
                {installment.customerAddress && (
                  <span>{installment.customerAddress}</span>
                )}
              </div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                <CalendarDays className="h-3 w-3" />
                কিস্তি শুরু: {installment.createdAt}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Card>
          <CardContent className="p-4 text-center">
            <ShoppingBag className="h-5 w-5 text-primary mx-auto mb-1" />
            <p className="text-xs text-muted-foreground">পণ্য</p>
            <p className="text-sm font-bold mt-0.5">{installment.productName}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Banknote className="h-5 w-5 text-primary mx-auto mb-1" />
            <p className="text-xs text-muted-foreground">মোট মূল্য</p>
            <p className="text-sm font-bold mt-0.5">{formatBDT(installment.totalAmount)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <TrendingUp className="h-5 w-5 text-green-600 mx-auto mb-1" />
            <p className="text-xs text-muted-foreground">মোট পরিশোধ</p>
            <p className="text-sm font-bold text-green-600 mt-0.5">{formatBDT(totalPaid)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <AlertTriangle className="h-5 w-5 text-destructive mx-auto mb-1" />
            <p className="text-xs text-muted-foreground">বাকি আছে</p>
            <p className="text-sm font-bold text-destructive mt-0.5">{formatBDT(installment.remainingAmount)}</p>
          </CardContent>
        </Card>
      </div>

      {/* Progress */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">কিস্তির অগ্রগতি</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              {installment.paidInstallments} / {installment.totalInstallments} কিস্তি পরিশোধিত
            </span>
            <span className="font-bold">{Math.round(progressPercent)}%</span>
          </div>
          <Progress value={progressPercent} className="h-3" />
          <div className="grid grid-cols-3 gap-3 text-center text-sm">
            <div className="p-2 rounded-lg bg-muted/50">
              <p className="text-muted-foreground text-xs">ডাউন পেমেন্ট</p>
              <p className="font-bold">{formatBDT(installment.downPayment)}</p>
            </div>
            <div className="p-2 rounded-lg bg-muted/50">
              <p className="text-muted-foreground text-xs">প্রতি কিস্তি</p>
              <p className="font-bold">{formatBDT(installment.installmentAmount)}</p>
            </div>
            <div className="p-2 rounded-lg bg-muted/50">
              <p className="text-muted-foreground text-xs">মোট কিস্তি</p>
              <p className="font-bold">{installment.totalInstallments}টি</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment History Table */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">পেমেন্ট ইতিহাস</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {installment.payments.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>কিস্তি নং</TableHead>
                  <TableHead className="text-right">পরিমাণ</TableHead>
                  <TableHead>নির্ধারিত তারিখ</TableHead>
                  <TableHead>পরিশোধ তারিখ</TableHead>
                  <TableHead className="text-center">স্ট্যাটাস</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {installment.payments.map((p) => (
                  <TableRow key={p.number}>
                    <TableCell className="font-medium">#{p.number}</TableCell>
                    <TableCell className="text-right font-mono">{formatBDT(p.amount)}</TableCell>
                    <TableCell className="text-muted-foreground">{p.dueDate}</TableCell>
                    <TableCell>{p.paidDate || '-'}</TableCell>
                    <TableCell className="text-center">{getPaymentStatusBadge(p.status)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="py-8 text-center text-muted-foreground text-sm">
              বিস্তারিত পেমেন্ট ইতিহাস তৈরি হয়নি
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
