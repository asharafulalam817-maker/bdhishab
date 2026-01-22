import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Package,
  AlertTriangle,
} from 'lucide-react';
import { bn, formatBDT, formatNumberBn } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

// Demo products data
const demoProducts = [
  {
    id: '1',
    name: 'স্যামসাং গ্যালাক্সি A54',
    sku: 'SAM-A54',
    category: 'মোবাইল ফোন',
    brand: 'Samsung',
    purchaseCost: 28000,
    salePrice: 35000,
    stock: 15,
    lowStockThreshold: 5,
    warrantyType: 'warranty',
    warrantyDuration: '1 বছর',
  },
  {
    id: '2',
    name: 'আইফোন ১৫ প্রো ম্যাক্স',
    sku: 'IP15-PRO',
    category: 'মোবাইল ফোন',
    brand: 'Apple',
    purchaseCost: 145000,
    salePrice: 175000,
    stock: 3,
    lowStockThreshold: 5,
    warrantyType: 'warranty',
    warrantyDuration: '1 বছর',
  },
  {
    id: '3',
    name: 'শাওমি পাওয়ার ব্যাংক 20000mAh',
    sku: 'XM-PB20',
    category: 'এক্সেসরিজ',
    brand: 'Xiaomi',
    purchaseCost: 1200,
    salePrice: 1800,
    stock: 45,
    lowStockThreshold: 10,
    warrantyType: 'guarantee',
    warrantyDuration: '৬ মাস',
  },
  {
    id: '4',
    name: 'JBL ব্লুটুথ স্পিকার',
    sku: 'JBL-BT01',
    category: 'ইলেকট্রনিক্স',
    brand: 'JBL',
    purchaseCost: 3500,
    salePrice: 4500,
    stock: 8,
    lowStockThreshold: 5,
    warrantyType: 'warranty',
    warrantyDuration: '১ বছর',
  },
  {
    id: '5',
    name: 'রিয়েলমি সি৫৫',
    sku: 'RM-C55',
    category: 'মোবাইল ফোন',
    brand: 'Realme',
    purchaseCost: 15000,
    salePrice: 18500,
    stock: 22,
    lowStockThreshold: 5,
    warrantyType: 'warranty',
    warrantyDuration: '১ বছর',
  },
];

export default function Products() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const filteredProducts = demoProducts.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const categories = [...new Set(demoProducts.map((p) => p.category))];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">{bn.products.title}</h1>
          <p className="text-muted-foreground">আপনার সব পণ্য এখানে দেখুন এবং পরিচালনা করুন</p>
        </div>
        <Button onClick={() => navigate('/products/new')} className="gap-2">
          <Plus className="h-4 w-4" />
          {bn.products.addNew}
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="পণ্যের নাম বা SKU দিয়ে খুঁজুন..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="ক্যাটাগরি ফিল্টার" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{bn.common.all} ক্যাটাগরি</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Products Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{bn.products.name}</TableHead>
                  <TableHead>{bn.products.sku}</TableHead>
                  <TableHead>{bn.products.category}</TableHead>
                  <TableHead className="text-right">{bn.products.purchaseCost}</TableHead>
                  <TableHead className="text-right">{bn.products.salePrice}</TableHead>
                  <TableHead className="text-center">{bn.products.currentStock}</TableHead>
                  <TableHead>{bn.products.warranty}</TableHead>
                  <TableHead className="text-right">{bn.common.actions}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product, index) => (
                  <motion.tr
                    key={product.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="group"
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                          <Package className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="font-medium">{product.name}</p>
                          <p className="text-xs text-muted-foreground">{product.brand}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-sm">{product.sku}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{product.category}</Badge>
                    </TableCell>
                    <TableCell className="text-right">{formatBDT(product.purchaseCost)}</TableCell>
                    <TableCell className="text-right font-medium">{formatBDT(product.salePrice)}</TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-2">
                        {product.stock <= product.lowStockThreshold && (
                          <AlertTriangle className="h-4 w-4 text-warning" />
                        )}
                        <span className={product.stock <= product.lowStockThreshold ? 'text-warning font-medium' : ''}>
                          {formatNumberBn(product.stock)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="badge-success">
                        {product.warrantyDuration}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem className="gap-2">
                            <Eye className="h-4 w-4" />
                            {bn.common.view}
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
                    </TableCell>
                  </motion.tr>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
