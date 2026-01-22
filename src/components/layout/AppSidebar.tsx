import { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Package,
  Warehouse,
  Users,
  ShoppingCart,
  Receipt,
  ShieldCheck,
  BarChart3,
  Settings,
  ChevronDown,
  Truck,
  UserCircle,
  CreditCard,
  X,
  Store,
} from 'lucide-react';
import { bn } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useDemo } from '@/contexts/DemoContext';

interface NavItem {
  label: string;
  icon: React.ElementType;
  href?: string;
  children?: { label: string; href: string }[];
}

const navItems: NavItem[] = [
  { label: bn.nav.dashboard, icon: LayoutDashboard, href: '/dashboard' },
  { label: bn.nav.products, icon: Package, href: '/products' },
  {
    label: bn.nav.inventory,
    icon: Warehouse,
    children: [
      { label: bn.inventory.stockLedger, href: '/inventory/ledger' },
      { label: bn.inventory.stockIn, href: '/inventory/stock-in' },
      { label: bn.inventory.stockOut, href: '/inventory/stock-out' },
      { label: bn.inventory.adjustment, href: '/inventory/adjustment' },
      { label: bn.inventory.lowStockAlerts, href: '/inventory/low-stock' },
    ],
  },
  { label: bn.nav.suppliers, icon: Truck, href: '/suppliers' },
  { label: bn.nav.purchases, icon: ShoppingCart, href: '/purchases' },
  { label: bn.nav.customers, icon: Users, href: '/customers' },
  {
    label: bn.nav.sales,
    icon: CreditCard,
    children: [
      { label: bn.nav.pos, href: '/pos' },
      { label: bn.sales.title, href: '/sales' },
      { label: bn.invoices.title, href: '/invoices' },
    ],
  },
  { label: bn.nav.warranty, icon: ShieldCheck, href: '/warranty' },
  {
    label: bn.nav.reports,
    icon: BarChart3,
    children: [
      { label: bn.reports.dailySales, href: '/reports/daily-sales' },
      { label: bn.reports.monthlySales, href: '/reports/monthly-sales' },
      { label: bn.reports.profit, href: '/reports/profit' },
      { label: bn.reports.stock, href: '/reports/stock' },
      { label: bn.reports.topSelling, href: '/reports/top-selling' },
      { label: bn.reports.customerReport, href: '/reports/customers' },
      { label: bn.reports.supplierDue, href: '/reports/supplier-due' },
    ],
  },
  { label: bn.nav.settings, icon: Settings, href: '/settings' },
];

interface AppSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  storeName?: string;
}

export function AppSidebar({ isOpen, onToggle, storeName = 'My Store' }: AppSidebarProps) {
  const location = useLocation();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const { demoProfile } = useDemo();

  const toggleExpand = (label: string) => {
    setExpandedItems((prev) =>
      prev.includes(label) ? prev.filter((item) => item !== label) : [...prev, label]
    );
  };

  const isActive = (href: string) => location.pathname === href;
  const isChildActive = (children?: { href: string }[]) =>
    children?.some((child) => location.pathname === child.href);

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            onClick={onToggle}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ x: isOpen ? 0 : -280 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className={cn(
          'fixed left-0 top-0 z-50 h-full w-[280px] bg-card border-r border-border shadow-lg lg:shadow-none',
          'flex flex-col',
          'lg:translate-x-0 lg:static lg:z-auto'
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Store className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-foreground">{bn.appName}</span>
              <span className="text-xs text-muted-foreground">{storeName}</span>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={onToggle}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {navItems.map((item) => (
            <div key={item.label}>
              {item.children ? (
                <>
                  <button
                    onClick={() => toggleExpand(item.label)}
                    className={cn(
                      'flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                      isChildActive(item.children)
                        ? 'bg-primary/10 text-primary'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className="h-5 w-5" />
                      <span>{item.label}</span>
                    </div>
                    <ChevronDown
                      className={cn(
                        'h-4 w-4 transition-transform',
                        expandedItems.includes(item.label) && 'rotate-180'
                      )}
                    />
                  </button>
                  <AnimatePresence>
                    {expandedItems.includes(item.label) && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden ml-4 mt-1 space-y-1"
                      >
                        {item.children.map((child) => (
                          <NavLink
                            key={child.href}
                            to={child.href}
                            className={cn(
                              'flex items-center rounded-lg px-3 py-2 text-sm transition-colors',
                              isActive(child.href)
                                ? 'bg-primary text-primary-foreground'
                                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                            )}
                            onClick={() => window.innerWidth < 1024 && onToggle()}
                          >
                            <span className="ml-5">{child.label}</span>
                          </NavLink>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              ) : (
                <NavLink
                  to={item.href!}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                    isActive(item.href!)
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  )}
                  onClick={() => window.innerWidth < 1024 && onToggle()}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </NavLink>
              )}
            </div>
          ))}
        </nav>

        {/* User Section */}
        <div className="border-t border-border p-3">
          <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary">
              <UserCircle className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {demoProfile.full_name}
              </p>
              <p className="text-xs text-muted-foreground">
                {bn.roles.owner}
              </p>
            </div>
          </div>
        </div>
      </motion.aside>
    </>
  );
}
