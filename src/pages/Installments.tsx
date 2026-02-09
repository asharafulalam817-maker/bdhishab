import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  CalendarDays,
  Users,
  Search,
  Eye,
  CheckCircle,
  Clock,
  AlertTriangle,
  Banknote,
  Plus,
  Phone,
} from 'lucide-react';
import { formatBDT } from '@/lib/constants';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Progress } from '@/components/ui/progress';

// Demo installment data
const demoInstallments = [
  {
    id: '1',
    customerName: 'মোহাম্মদ করিম',
    customerPhone: '01712345678',
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
    productName: 'আইফোন ১৫ প্রো ম্যাক্স',
    totalAmount: 175000,
    downPayment: 50000,
    remainingAmount: 50000,
    totalInstallments: 10,
    installmentAmount: 12500,
    paidInstallments: 6,
    status: 'active' as const,
    createdAt: '2024-12-01',
    payments: [],
  },
  {
    id: '3',
    customerName: 'ফাতেমা বেগম',
    customerPhone: '01812345678',
    productName: 'রিয়েলমি সি৫৫',
    totalAmount: 18500,
    downPayment: 5000,
    remainingAmount: 0,
    totalInstallments: 3,
    installmentAmount: 4500,
    paidInstallments: 3,
    status: 'completed' as const,
    createdAt: '2024-11-10',
    payments: [],
  },
];

export default function Installments() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedInstallment, setSelectedInstallment] = useState<typeof demoInstallments[0] | null>(null);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [paymentInstallment, setPaymentInstallment] = useState<typeof demoInstallments[0] | null>(null);

  const filtered = demoInstallments.filter((item) => {
    const matchesSearch =
      item.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.customerPhone.includes(searchQuery) ||
      item.productName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || item.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const totalActive = demoInstallments.filter((i) => i.status === 'active').length;
  const totalRemaining = demoInstallments
    .filter((i) => i.status === 'active')
    .reduce((sum, i) => sum + i.remainingAmount, 0);
  const totalCompleted = demoInstallments.filter((i) => i.status === 'completed').length;

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

  const handleCollectPayment = () => {
    toast.success('কিস্তি আদায় সফল হয়েছে!');
    setPaymentDialogOpen(false);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold flex items-center gap-2 text-foreground">
          <div className="h-9 w-9 rounded-lg bg-primary flex items-center justify-center">
            <CalendarDays className="h-5 w-5 text-primary-foreground" />
          </div>
          কিস্তি ম্যানেজমেন্ট
        </h1>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <Clock className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">চলমান কিস্তি</p>
              <p className="text-xl font-bold">{totalActive}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-orange-500/10 flex items-center justify-center">
              <Banknote className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">মোট বাকি</p>
              <p className="text-xl font-bold">{formatBDT(totalRemaining)}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-green-500/10 flex items-center justify-center">
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">সম্পন্ন</p>
              <p className="text-xl font-bold">{totalCompleted}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search & Filter */}
      <Card>
        <CardContent className="p-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="কাস্টমার, ফোন বা পণ্যের নাম দিয়ে সার্চ..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="স্ট্যাটাস" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">সব</SelectItem>
                <SelectItem value="active">চলমান</SelectItem>
                <SelectItem value="completed">সম্পন্ন</SelectItem>
                <SelectItem value="defaulted">বকেয়া</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>কাস্টমার</TableHead>
                <TableHead>পণ্য</TableHead>
                <TableHead className="text-right">মোট মূল্য</TableHead>
                <TableHead className="text-right">ডাউন পেমেন্ট</TableHead>
                <TableHead className="text-center">কিস্তি (প্রদত্ত/মোট)</TableHead>
                <TableHead className="text-right">বাকি</TableHead>
                <TableHead>স্ট্যাটাস</TableHead>
                <TableHead className="text-right">অ্যাকশন</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                    কোনো কিস্তি পাওয়া যায়নি
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((item) => (
                  <TableRow key={item.id} className="group">
                    <TableCell>
                      <div>
                        <p
                          className="font-medium text-primary cursor-pointer hover:underline"
                          onClick={() => navigate(`/installments/${item.id}`)}
                        >
                          {item.customerName}
                        </p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {item.customerPhone}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{item.productName}</TableCell>
                    <TableCell className="text-right font-mono">{formatBDT(item.totalAmount)}</TableCell>
                    <TableCell className="text-right font-mono">{formatBDT(item.downPayment)}</TableCell>
                    <TableCell className="text-center">
                      <div className="flex flex-col items-center gap-1">
                        <span className="text-sm font-medium">
                          {item.paidInstallments}/{item.totalInstallments}
                        </span>
                        <Progress
                          value={(item.paidInstallments / item.totalInstallments) * 100}
                          className="h-1.5 w-20"
                        />
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-mono font-bold text-destructive">
                      {formatBDT(item.remainingAmount)}
                    </TableCell>
                    <TableCell>{getStatusBadge(item.status)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedInstallment(item)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        {item.status === 'active' && (
                          <Button
                            size="sm"
                            onClick={() => {
                              setPaymentInstallment(item);
                              setPaymentDialogOpen(true);
                            }}
                          >
                            <Banknote className="h-4 w-4 mr-1" />
                            আদায়
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Detail Dialog */}
      <Dialog open={!!selectedInstallment} onOpenChange={() => setSelectedInstallment(null)}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>কিস্তির বিস্তারিত</DialogTitle>
            <DialogDescription>
              {selectedInstallment?.customerName} - {selectedInstallment?.productName}
            </DialogDescription>
          </DialogHeader>
          {selectedInstallment && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="p-3 rounded-lg bg-muted/50">
                  <p className="text-muted-foreground">মোট মূল্য</p>
                  <p className="font-bold text-lg">{formatBDT(selectedInstallment.totalAmount)}</p>
                </div>
                <div className="p-3 rounded-lg bg-muted/50">
                  <p className="text-muted-foreground">ডাউন পেমেন্ট</p>
                  <p className="font-bold text-lg">{formatBDT(selectedInstallment.downPayment)}</p>
                </div>
                <div className="p-3 rounded-lg bg-muted/50">
                  <p className="text-muted-foreground">প্রতি কিস্তি</p>
                  <p className="font-bold text-lg">{formatBDT(selectedInstallment.installmentAmount)}</p>
                </div>
                <div className="p-3 rounded-lg bg-muted/50">
                  <p className="text-muted-foreground">বাকি আছে</p>
                  <p className="font-bold text-lg text-destructive">{formatBDT(selectedInstallment.remainingAmount)}</p>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-semibold mb-2">কিস্তির সময়সূচি</h4>
                <div className="space-y-2">
                  {selectedInstallment.payments.length > 0 ? (
                    selectedInstallment.payments.map((p) => (
                      <div key={p.number} className="flex items-center justify-between p-2 rounded-lg border border-border">
                        <div className="flex items-center gap-2">
                          {p.status === 'paid' ? (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          ) : (
                            <Clock className="h-4 w-4 text-muted-foreground" />
                          )}
                          <span className="text-sm">কিস্তি #{p.number}</span>
                        </div>
                        <div className="text-right text-sm">
                          <p className="font-mono">{formatBDT(p.amount)}</p>
                          <p className="text-xs text-muted-foreground">
                            {p.status === 'paid' ? `পরিশোধ: ${p.paidDate}` : `তারিখ: ${p.dueDate}`}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      বিস্তারিত সময়সূচি তৈরি হয়নি
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Payment Collection Dialog */}
      <Dialog open={paymentDialogOpen} onOpenChange={setPaymentDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>কিস্তি আদায়</DialogTitle>
            <DialogDescription>
              {paymentInstallment?.customerName} - কিস্তি #{(paymentInstallment?.paidInstallments ?? 0) + 1}
            </DialogDescription>
          </DialogHeader>
          {paymentInstallment && (
            <div className="space-y-4">
              <div className="p-3 rounded-lg bg-muted/50 text-center">
                <p className="text-sm text-muted-foreground">আদায়যোগ্য পরিমাণ</p>
                <p className="text-2xl font-black text-primary">{formatBDT(paymentInstallment.installmentAmount)}</p>
              </div>
              <div className="space-y-2">
                <Label>পেমেন্ট মাধ্যম</Label>
                <Select defaultValue="cash">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash">ক্যাশ</SelectItem>
                    <SelectItem value="bkash">বিকাশ</SelectItem>
                    <SelectItem value="nagad">নগদ</SelectItem>
                    <SelectItem value="bank">ব্যাংক</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setPaymentDialogOpen(false)}>
                  বাতিল
                </Button>
                <Button onClick={handleCollectPayment}>
                  <CheckCircle className="h-4 w-4 mr-1" />
                  আদায় নিশ্চিত করুন
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
