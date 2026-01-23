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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Category, Brand } from '@/hooks/useProducts';
import { Plus, Trash2, Tags, Award } from 'lucide-react';
import { toast } from 'sonner';

interface CategoryBrandDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categories: Category[];
  brands: Brand[];
  onAddCategory: (name: string) => void;
  onDeleteCategory: (id: string) => void;
  onAddBrand: (name: string) => void;
  onDeleteBrand: (id: string) => void;
}

export function CategoryBrandDialog({
  open,
  onOpenChange,
  categories,
  brands,
  onAddCategory,
  onDeleteCategory,
  onAddBrand,
  onDeleteBrand,
}: CategoryBrandDialogProps) {
  const [newCategory, setNewCategory] = useState('');
  const [newBrand, setNewBrand] = useState('');

  const handleAddCategory = () => {
    if (newCategory.trim()) {
      onAddCategory(newCategory.trim());
      setNewCategory('');
      toast.success('ক্যাটাগরি যোগ হয়েছে');
    }
  };

  const handleAddBrand = () => {
    if (newBrand.trim()) {
      onAddBrand(newBrand.trim());
      setNewBrand('');
      toast.success('ব্র্যান্ড যোগ হয়েছে');
    }
  };

  const handleDeleteCategory = (id: string) => {
    onDeleteCategory(id);
    toast.success('ক্যাটাগরি মুছে ফেলা হয়েছে');
  };

  const handleDeleteBrand = (id: string) => {
    onDeleteBrand(id);
    toast.success('ব্র্যান্ড মুছে ফেলা হয়েছে');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>ক্যাটাগরি ও ব্র্যান্ড ম্যানেজমেন্ট</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="categories">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="categories" className="gap-2">
              <Tags className="h-4 w-4" />
              ক্যাটাগরি
            </TabsTrigger>
            <TabsTrigger value="brands" className="gap-2">
              <Award className="h-4 w-4" />
              ব্র্যান্ড
            </TabsTrigger>
          </TabsList>

          <TabsContent value="categories" className="space-y-4 pt-4">
            <div className="flex gap-2">
              <Input
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="নতুন ক্যাটাগরির নাম"
                onKeyDown={(e) => e.key === 'Enter' && handleAddCategory()}
              />
              <Button onClick={handleAddCategory} size="icon">
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-2 max-h-[300px] overflow-y-auto">
              {categories.map((category) => (
                <div
                  key={category.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                >
                  <span>{category.name}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive hover:text-destructive"
                    onClick={() => handleDeleteCategory(category.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="brands" className="space-y-4 pt-4">
            <div className="flex gap-2">
              <Input
                value={newBrand}
                onChange={(e) => setNewBrand(e.target.value)}
                placeholder="নতুন ব্র্যান্ডের নাম"
                onKeyDown={(e) => e.key === 'Enter' && handleAddBrand()}
              />
              <Button onClick={handleAddBrand} size="icon">
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-2 max-h-[300px] overflow-y-auto">
              {brands.map((brand) => (
                <div
                  key={brand.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                >
                  <span>{brand.name}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive hover:text-destructive"
                    onClick={() => handleDeleteBrand(brand.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
