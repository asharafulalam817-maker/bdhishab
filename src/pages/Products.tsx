import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Plus,
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Package,
  AlertTriangle,
  Tags,
  Layers,
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
import { useProducts, Product } from '@/hooks/useProducts';
import { ProductFormDialog } from '@/components/products/ProductFormDialog';
import { ProductViewDialog } from '@/components/products/ProductViewDialog';
import { CategoryBrandDialog } from '@/components/products/CategoryBrandDialog';
import { toast } from 'sonner';

export default function Products() {
  const {
    filteredProducts,
    categories,
    brands,
    stats,
    searchQuery,
    setSearchQuery,
    categoryFilter,
    setCategoryFilter,
    stockFilter,
    setStockFilter,
    addProduct,
    updateProduct,
    deleteProduct,
    addCategory,
    deleteCategory,
    addBrand,
    deleteBrand,
  } = useProducts();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const handleAddProduct = () => {
    setSelectedProduct(null);
    setIsFormOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product);
    setIsFormOpen(true);
  };

  const handleViewProduct = (product: Product) => {
    setSelectedProduct(product);
    setIsViewOpen(true);
  };

  const handleDeleteProduct = (product: Product) => {
    deleteProduct(product.id);
    toast.success(`${product.name} মুছে ফেলা হয়েছে`);
  };

  const handleFormSubmit = (data: Omit<Product, 'id'>) => {
    if (selectedProduct) {
      updateProduct(selectedProduct.id, data);
      toast.success('পণ্য আপডেট হয়েছে');
    } else {
      addProduct(data);
      toast.success('নতুন পণ্য যোগ হয়েছে');
    }
    setIsFormOpen(false);
  };

  const getWarrantyLabel = (product: Product) => {
    if (product.warrantyType === 'none') return 'নেই';
    const unit = product.warrantyUnit === 'days' ? 'দিন' : product.warrantyUnit === 'months' ? 'মাস' : 'বছর';
    return `${product.warrantyDuration} ${unit}`;
  };

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
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setIsCategoryDialogOpen(true)} className="gap-2">
            <Tags className="h-4 w-4" />
            ক্যাটাগরি/ব্র্যান্ড
          </Button>
          <Button onClick={handleAddProduct} className="gap-2">
            <Plus className="h-4 w-4" />
            {bn.products.addNew}
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Package className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{formatNumberBn(stats.totalProducts)}</p>
                <p className="text-sm text-muted-foreground">মোট পণ্য</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-warning/10 flex items-center justify-center">
                <AlertTriangle className="h-5 w-5 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold text-warning">{formatNumberBn(stats.lowStockCount)}</p>
                <p className="text-sm text-muted-foreground">কম স্টক</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-destructive/10 flex items-center justify-center">
                <Package className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <p className="text-2xl font-bold text-destructive">{formatNumberBn(stats.outOfStockCount)}</p>
                <p className="text-sm text-muted-foreground">স্টক শেষ</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-success/10 flex items-center justify-center">
                <Layers className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold">{formatBDT(stats.totalStockValue)}</p>
                <p className="text-sm text-muted-foreground">স্টক মূল্য</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="পণ্যের নাম, SKU বা বারকোড দিয়ে খুঁজুন..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="ক্যাটাগরি" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{bn.common.all} ক্যাটাগরি</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.name}>{cat.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={stockFilter} onValueChange={(v) => setStockFilter(v as any)}>
              <SelectTrigger className="w-full sm:w-[150px]">
                <SelectValue placeholder="স্টক স্ট্যাটাস" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">সব স্টক</SelectItem>
                <SelectItem value="low">কম স্টক</SelectItem>
                <SelectItem value="out">স্টক শেষ</SelectItem>
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
                {filteredProducts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      কোনো পণ্য পাওয়া যায়নি
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredProducts.map((product, index) => (
                    <motion.tr
                      key={product.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.03 }}
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
                          {product.stock <= product.lowStockThreshold && product.stock > 0 && (
                            <AlertTriangle className="h-4 w-4 text-warning" />
                          )}
                          <span className={
                            product.stock === 0 
                              ? 'text-destructive font-medium' 
                              : product.stock <= product.lowStockThreshold 
                              ? 'text-warning font-medium' 
                              : ''
                          }>
                            {formatNumberBn(product.stock)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={product.warrantyType !== 'none' ? 'badge-success' : ''}>
                          {getWarrantyLabel(product)}
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
                            <DropdownMenuItem onClick={() => handleViewProduct(product)} className="gap-2">
                              <Eye className="h-4 w-4" />
                              {bn.common.view}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEditProduct(product)} className="gap-2">
                              <Edit className="h-4 w-4" />
                              {bn.common.edit}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDeleteProduct(product)} className="gap-2 text-destructive">
                              <Trash2 className="h-4 w-4" />
                              {bn.common.delete}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </motion.tr>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Dialogs */}
      <ProductFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        product={selectedProduct}
        categories={categories}
        brands={brands}
        onSubmit={handleFormSubmit}
      />

      <ProductViewDialog
        open={isViewOpen}
        onOpenChange={setIsViewOpen}
        product={selectedProduct}
      />

      <CategoryBrandDialog
        open={isCategoryDialogOpen}
        onOpenChange={setIsCategoryDialogOpen}
        categories={categories}
        brands={brands}
        onAddCategory={addCategory}
        onDeleteCategory={deleteCategory}
        onAddBrand={addBrand}
        onDeleteBrand={deleteBrand}
      />
    </motion.div>
  );
}
