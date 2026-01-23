import { useState, useMemo } from 'react';
import { useProducts, Product } from './useProducts';

export interface StockLedgerEntry {
  id: string;
  productId: string;
  productName: string;
  transactionType: 'stock_in' | 'stock_out' | 'adjustment' | 'sale' | 'purchase';
  quantity: number;
  balanceAfter: number;
  referenceType?: string;
  referenceId?: string;
  batchNumber?: string;
  serialNumber?: string;
  notes?: string;
  createdAt: Date;
  createdBy?: string;
}

export interface StockAdjustment {
  id: string;
  adjustmentDate: Date;
  reason: string;
  notes?: string;
  items: StockAdjustmentItem[];
  createdAt: Date;
  createdBy?: string;
}

export interface StockAdjustmentItem {
  productId: string;
  productName: string;
  previousStock: number;
  adjustedStock: number;
  difference: number;
}

// Demo stock ledger data
const generateDemoLedger = (products: Product[]): StockLedgerEntry[] => {
  const entries: StockLedgerEntry[] = [];
  const now = new Date();
  
  products.forEach((product, index) => {
    // Initial stock entry
    entries.push({
      id: `ledger-${product.id}-1`,
      productId: product.id,
      productName: product.name,
      transactionType: 'purchase',
      quantity: product.stock + 10,
      balanceAfter: product.stock + 10,
      referenceType: 'purchase',
      notes: 'প্রাথমিক স্টক',
      createdAt: new Date(now.getTime() - (7 - index) * 24 * 60 * 60 * 1000),
    });

    // Some sales
    if (product.stock < product.stock + 10) {
      entries.push({
        id: `ledger-${product.id}-2`,
        productId: product.id,
        productName: product.name,
        transactionType: 'sale',
        quantity: -5,
        balanceAfter: product.stock + 5,
        referenceType: 'sale',
        notes: 'বিক্রয়',
        createdAt: new Date(now.getTime() - (5 - index) * 24 * 60 * 60 * 1000),
      });

      entries.push({
        id: `ledger-${product.id}-3`,
        productId: product.id,
        productName: product.name,
        transactionType: 'sale',
        quantity: -5,
        balanceAfter: product.stock,
        referenceType: 'sale',
        notes: 'বিক্রয়',
        createdAt: new Date(now.getTime() - (2 - index) * 24 * 60 * 60 * 1000),
      });
    }
  });

  return entries.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
};

export function useStockManagement() {
  const { products, updateProduct } = useProducts();
  const [ledgerEntries, setLedgerEntries] = useState<StockLedgerEntry[]>(() => 
    generateDemoLedger(products)
  );
  const [adjustments, setAdjustments] = useState<StockAdjustment[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [transactionFilter, setTransactionFilter] = useState<string>('all');
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({});

  const filteredLedger = useMemo(() => {
    return ledgerEntries.filter((entry) => {
      const matchesSearch =
        entry.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (entry.notes && entry.notes.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesType = transactionFilter === 'all' || entry.transactionType === transactionFilter;
      
      let matchesDate = true;
      if (dateRange.from) {
        matchesDate = entry.createdAt >= dateRange.from;
      }
      if (dateRange.to && matchesDate) {
        matchesDate = entry.createdAt <= dateRange.to;
      }
      
      return matchesSearch && matchesType && matchesDate;
    });
  }, [ledgerEntries, searchQuery, transactionFilter, dateRange]);

  const addStockIn = (
    productId: string,
    quantity: number,
    options?: {
      batchNumber?: string;
      serialNumber?: string;
      notes?: string;
    }
  ) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const newBalance = product.stock + quantity;
    
    const entry: StockLedgerEntry = {
      id: `ledger-${Date.now()}`,
      productId,
      productName: product.name,
      transactionType: 'stock_in',
      quantity,
      balanceAfter: newBalance,
      batchNumber: options?.batchNumber,
      serialNumber: options?.serialNumber,
      notes: options?.notes || 'স্টক ইন',
      createdAt: new Date(),
    };

    setLedgerEntries([entry, ...ledgerEntries]);
    updateProduct(productId, { stock: newBalance });
  };

  const addStockOut = (
    productId: string,
    quantity: number,
    options?: {
      batchNumber?: string;
      serialNumber?: string;
      notes?: string;
    }
  ) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const newBalance = Math.max(0, product.stock - quantity);
    
    const entry: StockLedgerEntry = {
      id: `ledger-${Date.now()}`,
      productId,
      productName: product.name,
      transactionType: 'stock_out',
      quantity: -quantity,
      balanceAfter: newBalance,
      batchNumber: options?.batchNumber,
      serialNumber: options?.serialNumber,
      notes: options?.notes || 'স্টক আউট',
      createdAt: new Date(),
    };

    setLedgerEntries([entry, ...ledgerEntries]);
    updateProduct(productId, { stock: newBalance });
  };

  const createAdjustment = (
    items: { productId: string; newStock: number; reason: string }[],
    notes?: string
  ) => {
    const adjustmentItems: StockAdjustmentItem[] = [];
    const newEntries: StockLedgerEntry[] = [];

    items.forEach((item) => {
      const product = products.find(p => p.id === item.productId);
      if (!product) return;

      const difference = item.newStock - product.stock;
      
      adjustmentItems.push({
        productId: item.productId,
        productName: product.name,
        previousStock: product.stock,
        adjustedStock: item.newStock,
        difference,
      });

      newEntries.push({
        id: `ledger-adj-${Date.now()}-${item.productId}`,
        productId: item.productId,
        productName: product.name,
        transactionType: 'adjustment',
        quantity: difference,
        balanceAfter: item.newStock,
        notes: item.reason,
        createdAt: new Date(),
      });

      updateProduct(item.productId, { stock: item.newStock });
    });

    const adjustment: StockAdjustment = {
      id: `adj-${Date.now()}`,
      adjustmentDate: new Date(),
      reason: items[0]?.reason || 'স্টক এডজাস্টমেন্ট',
      notes,
      items: adjustmentItems,
      createdAt: new Date(),
    };

    setAdjustments([adjustment, ...adjustments]);
    setLedgerEntries([...newEntries, ...ledgerEntries]);
  };

  const stats = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todaysEntries = ledgerEntries.filter(e => {
      const entryDate = new Date(e.createdAt);
      entryDate.setHours(0, 0, 0, 0);
      return entryDate.getTime() === today.getTime();
    });

    const stockInToday = todaysEntries
      .filter(e => e.transactionType === 'stock_in' || e.transactionType === 'purchase')
      .reduce((sum, e) => sum + Math.abs(e.quantity), 0);

    const stockOutToday = todaysEntries
      .filter(e => e.transactionType === 'stock_out' || e.transactionType === 'sale')
      .reduce((sum, e) => sum + Math.abs(e.quantity), 0);

    const adjustmentsToday = todaysEntries
      .filter(e => e.transactionType === 'adjustment')
      .length;

    const lowStockProducts = products.filter(p => p.stock > 0 && p.stock <= p.lowStockThreshold).length;
    const outOfStockProducts = products.filter(p => p.stock === 0).length;

    return {
      stockInToday,
      stockOutToday,
      adjustmentsToday,
      lowStockProducts,
      outOfStockProducts,
      totalTransactions: ledgerEntries.length,
    };
  }, [ledgerEntries, products]);

  return {
    products,
    ledgerEntries: filteredLedger,
    adjustments,
    stats,
    searchQuery,
    setSearchQuery,
    transactionFilter,
    setTransactionFilter,
    dateRange,
    setDateRange,
    addStockIn,
    addStockOut,
    createAdjustment,
  };
}
