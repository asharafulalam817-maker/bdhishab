import { useState, useMemo } from 'react';

export interface Product {
  id: string;
  name: string;
  sku: string;
  barcode?: string;
  category: string;
  categoryId?: string;
  brand: string;
  brandId?: string;
  purchaseCost: number;
  salePrice: number;
  stock: number;
  lowStockThreshold: number;
  warrantyType: 'none' | 'warranty' | 'guarantee';
  warrantyDuration: number;
  warrantyUnit: 'days' | 'months' | 'years';
  unit: string;
  imageUrl?: string;
  serialRequired: boolean;
  batchTracking: boolean;
  hasExpiry: boolean;
}

export interface Category {
  id: string;
  name: string;
  parentId?: string;
}

export interface Brand {
  id: string;
  name: string;
}

// Demo data
const DEMO_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'স্যামসাং গ্যালাক্সি A54',
    sku: 'SAM-A54',
    category: 'মোবাইল ফোন',
    categoryId: '1',
    brand: 'Samsung',
    brandId: '1',
    purchaseCost: 28000,
    salePrice: 35000,
    stock: 15,
    lowStockThreshold: 5,
    warrantyType: 'warranty',
    warrantyDuration: 1,
    warrantyUnit: 'years',
    unit: 'pcs',
    serialRequired: true,
    batchTracking: false,
    hasExpiry: false,
  },
  {
    id: '2',
    name: 'আইফোন ১৫ প্রো ম্যাক্স',
    sku: 'IP15-PRO',
    category: 'মোবাইল ফোন',
    categoryId: '1',
    brand: 'Apple',
    brandId: '2',
    purchaseCost: 145000,
    salePrice: 175000,
    stock: 3,
    lowStockThreshold: 5,
    warrantyType: 'warranty',
    warrantyDuration: 1,
    warrantyUnit: 'years',
    unit: 'pcs',
    serialRequired: true,
    batchTracking: false,
    hasExpiry: false,
  },
  {
    id: '3',
    name: 'শাওমি পাওয়ার ব্যাংক 20000mAh',
    sku: 'XM-PB20',
    category: 'এক্সেসরিজ',
    categoryId: '2',
    brand: 'Xiaomi',
    brandId: '3',
    purchaseCost: 1200,
    salePrice: 1800,
    stock: 45,
    lowStockThreshold: 10,
    warrantyType: 'guarantee',
    warrantyDuration: 6,
    warrantyUnit: 'months',
    unit: 'pcs',
    serialRequired: false,
    batchTracking: true,
    hasExpiry: false,
  },
  {
    id: '4',
    name: 'JBL ব্লুটুথ স্পিকার',
    sku: 'JBL-BT01',
    category: 'ইলেকট্রনিক্স',
    categoryId: '3',
    brand: 'JBL',
    brandId: '4',
    purchaseCost: 3500,
    salePrice: 4500,
    stock: 8,
    lowStockThreshold: 5,
    warrantyType: 'warranty',
    warrantyDuration: 1,
    warrantyUnit: 'years',
    unit: 'pcs',
    serialRequired: false,
    batchTracking: false,
    hasExpiry: false,
  },
  {
    id: '5',
    name: 'রিয়েলমি সি৫৫',
    sku: 'RM-C55',
    category: 'মোবাইল ফোন',
    categoryId: '1',
    brand: 'Realme',
    brandId: '5',
    purchaseCost: 15000,
    salePrice: 18500,
    stock: 22,
    lowStockThreshold: 5,
    warrantyType: 'warranty',
    warrantyDuration: 1,
    warrantyUnit: 'years',
    unit: 'pcs',
    serialRequired: true,
    batchTracking: false,
    hasExpiry: false,
  },
  {
    id: '6',
    name: 'স্যামসাং এয়ারবাডস',
    sku: 'SAM-BUDS',
    category: 'এক্সেসরিজ',
    categoryId: '2',
    brand: 'Samsung',
    brandId: '1',
    purchaseCost: 2500,
    salePrice: 3500,
    stock: 30,
    lowStockThreshold: 10,
    warrantyType: 'warranty',
    warrantyDuration: 6,
    warrantyUnit: 'months',
    unit: 'pcs',
    serialRequired: false,
    batchTracking: false,
    hasExpiry: false,
  },
];

const DEMO_CATEGORIES: Category[] = [
  { id: '1', name: 'মোবাইল ফোন' },
  { id: '2', name: 'এক্সেসরিজ' },
  { id: '3', name: 'ইলেকট্রনিক্স' },
  { id: '4', name: 'ল্যাপটপ ও কম্পিউটার' },
];

const DEMO_BRANDS: Brand[] = [
  { id: '1', name: 'Samsung' },
  { id: '2', name: 'Apple' },
  { id: '3', name: 'Xiaomi' },
  { id: '4', name: 'JBL' },
  { id: '5', name: 'Realme' },
  { id: '6', name: 'Oppo' },
  { id: '7', name: 'Vivo' },
];

export function useProducts() {
  const [products, setProducts] = useState<Product[]>(DEMO_PRODUCTS);
  const [categories, setCategories] = useState<Category[]>(DEMO_CATEGORIES);
  const [brands, setBrands] = useState<Brand[]>(DEMO_BRANDS);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [stockFilter, setStockFilter] = useState<'all' | 'low' | 'out'>('all');

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (product.barcode && product.barcode.includes(searchQuery));
      
      const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
      
      let matchesStock = true;
      if (stockFilter === 'low') {
        matchesStock = product.stock > 0 && product.stock <= product.lowStockThreshold;
      } else if (stockFilter === 'out') {
        matchesStock = product.stock === 0;
      }
      
      return matchesSearch && matchesCategory && matchesStock;
    });
  }, [products, searchQuery, categoryFilter, stockFilter]);

  const stats = useMemo(() => {
    const totalProducts = products.length;
    const lowStockCount = products.filter(p => p.stock > 0 && p.stock <= p.lowStockThreshold).length;
    const outOfStockCount = products.filter(p => p.stock === 0).length;
    const totalStockValue = products.reduce((sum, p) => sum + (p.purchaseCost * p.stock), 0);
    
    return { totalProducts, lowStockCount, outOfStockCount, totalStockValue };
  }, [products]);

  const addProduct = (productData: Omit<Product, 'id'>) => {
    const newProduct: Product = {
      ...productData,
      id: Date.now().toString(),
    };
    setProducts([newProduct, ...products]);
    return newProduct;
  };

  const updateProduct = (id: string, productData: Partial<Product>) => {
    setProducts(products.map(p => p.id === id ? { ...p, ...productData } : p));
  };

  const deleteProduct = (id: string) => {
    setProducts(products.filter(p => p.id !== id));
  };

  const addCategory = (name: string, parentId?: string) => {
    const newCategory: Category = {
      id: Date.now().toString(),
      name,
      parentId,
    };
    setCategories([...categories, newCategory]);
    return newCategory;
  };

  const deleteCategory = (id: string) => {
    setCategories(categories.filter(c => c.id !== id));
  };

  const addBrand = (name: string) => {
    const newBrand: Brand = {
      id: Date.now().toString(),
      name,
    };
    setBrands([...brands, newBrand]);
    return newBrand;
  };

  const deleteBrand = (id: string) => {
    setBrands(brands.filter(b => b.id !== id));
  };

  return {
    products,
    categories,
    brands,
    filteredProducts,
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
  };
}
