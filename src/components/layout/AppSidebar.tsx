import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Package,
  Warehouse,
  Users,
  ShoppingCart,
  ShieldCheck,
  BarChart3,
  Settings,
  ChevronDown,
  Truck,
  UserCircle,
  CreditCard,
  X,
  Store,
  Shield,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useDemo } from '@/contexts/DemoContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { VerifiedBadge } from '@/components/ui/VerifiedBadge';

interface NavItem {
  labelKey: string;
  icon: React.ElementType;
  href?: string;
  children?: { labelKey: string; href: string }[];
}

const navItemsConfig: NavItem[] = [
  { labelKey: 'nav.dashboard', icon: LayoutDashboard, href: '/dashboard' },
  { labelKey: 'nav.products', icon: Package, href: '/products' },
  {
    labelKey: 'nav.inventory',
    icon: Warehouse,
    children: [
      { labelKey: 'inventory.stockLedger', href: '/inventory/ledger' },
      { labelKey: 'inventory.stockIn', href: '/inventory/stock-in' },
      { labelKey: 'inventory.stockOut', href: '/inventory/stock-out' },
      { labelKey: 'inventory.adjustment', href: '/inventory/adjustment' },
      { labelKey: 'inventory.lowStockAlerts', href: '/inventory/low-stock' },
    ],
  },
  { labelKey: 'nav.suppliers', icon: Truck, href: '/suppliers' },
  { labelKey: 'nav.purchases', icon: ShoppingCart, href: '/purchases' },
  { labelKey: 'nav.customers', icon: Users, href: '/customers' },
  {
    labelKey: 'nav.sales',
    icon: CreditCard,
    children: [
      { labelKey: 'nav.pos', href: '/pos' },
      { labelKey: 'nav.salesList', href: '/sales' },
      { labelKey: 'nav.invoices', href: '/invoices' },
    ],
  },
  { labelKey: 'nav.warranty', icon: ShieldCheck, href: '/warranty' },
  {
    labelKey: 'nav.reports',
    icon: BarChart3,
    children: [
      { labelKey: 'reports.dailySales', href: '/reports/daily-sales' },
      { labelKey: 'reports.monthlySales', href: '/reports/monthly-sales' },
      { labelKey: 'reports.profit', href: '/reports/profit' },
      { labelKey: 'reports.stock', href: '/reports/stock' },
      { labelKey: 'reports.topSelling', href: '/reports/top-selling' },
      { labelKey: 'reports.customerReport', href: '/reports/customers' },
      { labelKey: 'reports.supplierDue', href: '/reports/supplier-due' },
    ],
  },
  { labelKey: 'nav.settings', icon: Settings, href: '/settings' },
  { labelKey: 'nav.admin', icon: Shield, href: '/admin' },
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
  const { t } = useLanguage();

  const toggleExpand = (labelKey: string) => {
    setExpandedItems((prev) =>
      prev.includes(labelKey) ? prev.filter((item) => item !== labelKey) : [...prev, labelKey]
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
      <aside
        className={cn(
          'fixed left-0 top-0 z-50 h-full w-[280px] bg-card border-r border-border shadow-lg',
          'flex flex-col transition-transform duration-300 ease-in-out',
          'lg:relative lg:translate-x-0 lg:shadow-none lg:z-auto',
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Store className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-foreground">{t('app.name')}</span>
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                {storeName}
                <VerifiedBadge size="sm" />
              </span>
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
          {navItemsConfig.map((item) => (
            <div key={item.labelKey}>
              {item.children ? (
                <>
                  <button
                    onClick={() => toggleExpand(item.labelKey)}
                    className={cn(
                      'flex w-full items-center justify-between rounded-lg px-3 py-2.5 lg:py-3 text-sm lg:text-lg font-semibold lg:font-bold transition-colors',
                      isChildActive(item.children)
                        ? 'bg-primary/10 text-primary'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className="h-5 w-5 lg:h-6 lg:w-6" />
                      <span>{t(item.labelKey)}</span>
                    </div>
                    <ChevronDown
                      className={cn(
                        'h-4 w-4 lg:h-5 lg:w-5 transition-transform',
                        expandedItems.includes(item.labelKey) && 'rotate-180'
                      )}
                    />
                  </button>
                  <AnimatePresence>
                    {expandedItems.includes(item.labelKey) && (
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
                              'flex items-center rounded-lg px-3 py-2 lg:py-2.5 text-sm lg:text-base font-medium lg:font-semibold transition-colors',
                              isActive(child.href)
                                ? 'bg-primary text-primary-foreground'
                                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                            )}
                            onClick={() => window.innerWidth < 1024 && onToggle()}
                          >
                            <span className="ml-5">{t(child.labelKey)}</span>
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
                    'flex items-center gap-3 rounded-lg px-3 py-2.5 lg:py-3 text-sm lg:text-lg font-semibold lg:font-bold transition-colors',
                    isActive(item.href!)
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  )}
                  onClick={() => window.innerWidth < 1024 && onToggle()}
                >
                  <item.icon className="h-5 w-5 lg:h-6 lg:w-6" />
                  <span>{t(item.labelKey)}</span>
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
                {t('roles.owner')}
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
