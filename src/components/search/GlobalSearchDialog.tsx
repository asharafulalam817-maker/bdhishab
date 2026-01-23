import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Users,
  Package,
  FileText,
  ShoppingCart,
  Truck,
  X,
  ArrowRight,
  Command,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { useCustomers } from '@/hooks/useCustomers';
import { useProducts } from '@/hooks/useProducts';
import { useSales } from '@/hooks/useSales';

interface SearchResult {
  id: string;
  title: string;
  subtitle?: string;
  type: 'customer' | 'product' | 'invoice' | 'sale' | 'purchase';
  url: string;
}

const searchCategories = [
  { type: 'customer', label: 'গ্রাহক', icon: Users, color: 'text-blue-500 bg-blue-500/10' },
  { type: 'product', label: 'পণ্য', icon: Package, color: 'text-green-500 bg-green-500/10' },
  { type: 'invoice', label: 'ইনভয়েস', icon: FileText, color: 'text-purple-500 bg-purple-500/10' },
  { type: 'sale', label: 'বিক্রয়', icon: ShoppingCart, color: 'text-primary bg-primary/10' },
  { type: 'purchase', label: 'ক্রয়', icon: Truck, color: 'text-orange-500 bg-orange-500/10' },
];

interface GlobalSearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function GlobalSearchDialog({ open, onOpenChange }: GlobalSearchDialogProps) {
  const navigate = useNavigate();
  const { allCustomers } = useCustomers();
  const { products } = useProducts();
  const { sales } = useSales();
  
  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Search results
  const results = useMemo(() => {
    if (!query.trim()) return [];

    const q = query.toLowerCase();
    const searchResults: SearchResult[] = [];

    // Search customers
    if (!activeFilter || activeFilter === 'customer') {
      allCustomers.forEach(customer => {
        if (
          customer.name.toLowerCase().includes(q) ||
          customer.phone?.toLowerCase().includes(q)
        ) {
          searchResults.push({
            id: customer.id,
            title: customer.name,
            subtitle: customer.phone || 'ফোন নেই',
            type: 'customer',
            url: '/customers',
          });
        }
      });
    }

    // Search products
    if (!activeFilter || activeFilter === 'product') {
      products.forEach(product => {
        if (
          product.name.toLowerCase().includes(q) ||
          product.sku?.toLowerCase().includes(q) ||
          product.barcode?.toLowerCase().includes(q)
        ) {
          searchResults.push({
            id: product.id,
            title: product.name,
            subtitle: `SKU: ${product.sku || 'N/A'} | স্টক: ${product.stock}`,
            type: 'product',
            url: '/products',
          });
        }
      });
    }

    // Search sales/invoices
    if (!activeFilter || activeFilter === 'sale' || activeFilter === 'invoice') {
      sales.forEach(sale => {
        const invoiceNum = sale.invoiceNumber || `INV-${sale.id.slice(0, 6)}`;
        if (
          invoiceNum.toLowerCase().includes(q) ||
          sale.customerName?.toLowerCase().includes(q)
        ) {
          searchResults.push({
            id: sale.id,
            title: invoiceNum,
            subtitle: `${sale.customerName || 'ওয়াক-ইন'} | ৳${sale.total?.toLocaleString('bn-BD')}`,
            type: 'invoice',
            url: '/sales',
          });
        }
      });
    }

    return searchResults.slice(0, 10);
  }, [query, activeFilter, allCustomers, products, sales]);

  // Reset selected index when results change
  useEffect(() => {
    setSelectedIndex(0);
  }, [results]);

  // Reset query when dialog closes
  useEffect(() => {
    if (!open) {
      setQuery('');
      setActiveFilter(null);
    }
  }, [open]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!open) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => Math.min(prev + 1, results.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => Math.max(prev - 1, 0));
      } else if (e.key === 'Enter' && results[selectedIndex]) {
        e.preventDefault();
        navigate(results[selectedIndex].url);
        onOpenChange(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, results, selectedIndex, navigate, onOpenChange]);

  const handleResultClick = (result: SearchResult) => {
    navigate(result.url);
    onOpenChange(false);
  };

  const getCategoryInfo = (type: string) => {
    return searchCategories.find(c => c.type === type) || searchCategories[0];
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl p-0 gap-0 overflow-hidden">
        <DialogHeader className="sr-only">
          <DialogTitle>গ্লোবাল সার্চ</DialogTitle>
        </DialogHeader>
        
        {/* Search Input */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
          <Search className="h-5 w-5 text-muted-foreground shrink-0" />
          <Input
            placeholder="গ্রাহক, পণ্য, ইনভয়েস সার্চ করুন..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="border-0 focus-visible:ring-0 px-0 text-base"
            autoFocus
          />
          {query && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 shrink-0"
              onClick={() => setQuery('')}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-2 px-4 py-2 border-b border-border overflow-x-auto">
          <Button
            variant={activeFilter === null ? 'default' : 'ghost'}
            size="sm"
            className="h-7 text-xs shrink-0"
            onClick={() => setActiveFilter(null)}
          >
            সব
          </Button>
          {searchCategories.map((cat) => (
            <Button
              key={cat.type}
              variant={activeFilter === cat.type ? 'default' : 'ghost'}
              size="sm"
              className="h-7 text-xs gap-1.5 shrink-0"
              onClick={() => setActiveFilter(activeFilter === cat.type ? null : cat.type)}
            >
              <cat.icon className="h-3.5 w-3.5" />
              {cat.label}
            </Button>
          ))}
        </div>

        {/* Results */}
        <ScrollArea className="max-h-[400px]">
          {query.trim() === '' ? (
            <div className="p-8 text-center text-muted-foreground">
              <Command className="h-12 w-12 mx-auto mb-3 opacity-30" />
              <p className="text-sm font-medium mb-1">দ্রুত সার্চ</p>
              <p className="text-xs">গ্রাহক, পণ্য বা ইনভয়েস সার্চ করুন</p>
            </div>
          ) : results.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              <Search className="h-12 w-12 mx-auto mb-3 opacity-30" />
              <p className="text-sm font-medium mb-1">কোন ফলাফল পাওয়া যায়নি</p>
              <p className="text-xs">অন্য কিওয়ার্ড দিয়ে চেষ্টা করুন</p>
            </div>
          ) : (
            <div className="p-2">
              {results.map((result, index) => {
                const catInfo = getCategoryInfo(result.type);
                const Icon = catInfo.icon;
                return (
                  <button
                    key={`${result.type}-${result.id}`}
                    onClick={() => handleResultClick(result)}
                    className={cn(
                      'w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors',
                      index === selectedIndex
                        ? 'bg-primary/10 text-primary'
                        : 'hover:bg-muted'
                    )}
                  >
                    <div className={cn('p-2 rounded-lg shrink-0', catInfo.color)}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{result.title}</p>
                      {result.subtitle && (
                        <p className="text-xs text-muted-foreground truncate">
                          {result.subtitle}
                        </p>
                      )}
                    </div>
                    <Badge variant="secondary" className="text-[10px] shrink-0">
                      {catInfo.label}
                    </Badge>
                    <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />
                  </button>
                );
              })}
            </div>
          )}
        </ScrollArea>

        {/* Footer */}
        <div className="flex items-center justify-between px-4 py-2 border-t border-border bg-muted/30 text-xs text-muted-foreground">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-background rounded border border-border font-mono">↑↓</kbd>
              নেভিগেট
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-background rounded border border-border font-mono">Enter</kbd>
              সিলেক্ট
            </span>
          </div>
          <span className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 bg-background rounded border border-border font-mono">Esc</kbd>
            বন্ধ
          </span>
        </div>
      </DialogContent>
    </Dialog>
  );
}
