import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Plus,
  Search,
  Phone,
  MapPin,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Users,
  Wallet,
} from 'lucide-react';
import { bn, formatBDT } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

// Demo customers data
const demoCustomers = [
  { id: '1', name: 'মোহাম্মদ করিম', phone: '01712345678', address: 'মিরপুর, ঢাকা', totalDue: 12500, totalPurchase: 85000 },
  { id: '2', name: 'ফাতেমা বেগম', phone: '01812345678', address: 'উত্তরা, ঢাকা', totalDue: 0, totalPurchase: 125000 },
  { id: '3', name: 'রহিম উদ্দিন', phone: '01912345678', address: 'গুলশান, ঢাকা', totalDue: 35000, totalPurchase: 245000 },
  { id: '4', name: 'আয়েশা খাতুন', phone: '01612345678', address: 'বনানী, ঢাকা', totalDue: 8500, totalPurchase: 45000 },
  { id: '5', name: 'আবদুল হক', phone: '01512345678', address: 'ধানমন্ডি, ঢাকা', totalDue: 0, totalPurchase: 320000 },
];

export default function Customers() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const filteredCustomers = demoCustomers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.phone.includes(searchQuery)
  );

  const totalDue = demoCustomers.reduce((sum, c) => sum + c.totalDue, 0);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">{bn.customers.title}</h1>
          <p className="text-muted-foreground">আপনার সব গ্রাহক এখানে দেখুন এবং পরিচালনা করুন</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              {bn.customers.addNew}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{bn.customers.addNew}</DialogTitle>
              <DialogDescription>নতুন গ্রাহকের তথ্য দিন</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label>{bn.customers.name}</Label>
                <Input placeholder="গ্রাহকের নাম" />
              </div>
              <div className="space-y-2">
                <Label>{bn.customers.phone}</Label>
                <Input placeholder="01XXXXXXXXX" />
              </div>
              <div className="space-y-2">
                <Label>{bn.customers.address}</Label>
                <Textarea placeholder="ঠিকানা (ঐচ্ছিক)" />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                {bn.common.cancel}
              </Button>
              <Button onClick={() => setIsAddDialogOpen(false)}>
                {bn.common.save}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">মোট গ্রাহক</p>
              <p className="text-2xl font-bold">{demoCustomers.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-warning/5 border-warning/20">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="h-12 w-12 rounded-lg bg-warning/10 flex items-center justify-center">
              <Wallet className="h-6 w-6 text-warning" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">মোট বকেয়া</p>
              <p className="text-2xl font-bold text-warning">{formatBDT(totalDue)}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-success/5 border-success/20">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="h-12 w-12 rounded-lg bg-success/10 flex items-center justify-center">
              <Wallet className="h-6 w-6 text-success" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">বকেয়া নেই</p>
              <p className="text-2xl font-bold text-success">{demoCustomers.filter(c => c.totalDue === 0).length} জন</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="নাম বা ফোন নম্বর দিয়ে খুঁজুন..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </CardContent>
      </Card>

      {/* Customers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCustomers.map((customer, index) => (
          <motion.div
            key={customer.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-lg font-bold text-primary">
                        {customer.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-semibold">{customer.name}</h3>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Phone className="h-3 w-3" />
                        {customer.phone}
                      </div>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem className="gap-2">
                        <Eye className="h-4 w-4" />
                        {bn.customers.purchaseHistory}
                      </DropdownMenuItem>
                      <DropdownMenuItem className="gap-2">
                        <Edit className="h-4 w-4" />
                        {bn.common.edit}
                      </DropdownMenuItem>
                      <DropdownMenuItem className="gap-2 text-destructive">
                        <Trash2 className="h-4 w-4" />
                        {bn.common.delete}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {customer.address && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                    <MapPin className="h-4 w-4" />
                    {customer.address}
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
                  <div>
                    <p className="text-xs text-muted-foreground">মোট ক্রয়</p>
                    <p className="font-semibold">{formatBDT(customer.totalPurchase)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">বকেয়া</p>
                    <p className={`font-semibold ${customer.totalDue > 0 ? 'text-warning' : 'text-success'}`}>
                      {formatBDT(customer.totalDue)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
