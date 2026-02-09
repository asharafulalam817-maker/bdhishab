import { useState } from 'react';
import { Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield, LayoutDashboard, Users, Package, BarChart3, Settings,
  Menu, X, LogOut, Sun, Moon, Store, ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useTheme } from 'next-themes';
import { AdminNotificationBell } from '@/components/admin/AdminNotificationBell';
import { useAdminNotifications } from '@/hooks/useAdminNotifications';

const adminNavItems = [
  { label: 'ড্যাশবোর্ড', icon: LayoutDashboard, href: '/admin' },
  { label: 'সাবস্ক্রাইবার', icon: Users, href: '/admin/subscribers' },
  { label: 'প্যাকেজ', icon: Package, href: '/admin/packages' },
  { label: 'রিপোর্ট', icon: BarChart3, href: '/admin/reports' },
  { label: 'সেটিংস', icon: Settings, href: '/admin/settings' },
];

export function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const {
    notifications, unreadCount, soundEnabled, setSoundEnabled,
    markAsRead, markAllAsRead, clearAll,
  } = useAdminNotifications();

  const isActive = (href: string) => {
    if (href === '/admin') return location.pathname === '/admin';
    return location.pathname.startsWith(href);
  };

  return (
    <div className="flex min-h-screen w-full bg-background">
      {/* Mobile Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Admin Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-0 z-50 h-full w-[260px] bg-card border-r border-border shadow-lg',
          'flex flex-col transition-transform duration-300 ease-in-out',
          'lg:relative lg:translate-x-0 lg:shadow-none lg:z-auto',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Shield className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-foreground text-sm">সুপার অ্যাডমিন</span>
              <span className="text-xs text-muted-foreground">কন্ট্রোল প্যানেল</span>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setSidebarOpen(false)}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {adminNavItems.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              end={item.href === '/admin'}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-semibold transition-colors',
                isActive(item.href)
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
              onClick={() => window.innerWidth < 1024 && setSidebarOpen(false)}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.label}</span>
              {isActive(item.href) && <ChevronRight className="h-4 w-4 ml-auto" />}
            </NavLink>
          ))}
        </nav>

        {/* Bottom Actions */}
        <div className="border-t border-border p-3 space-y-2">
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-muted-foreground hover:text-foreground"
            onClick={() => navigate('/dashboard')}
          >
            <Store className="h-5 w-5" />
            <span className="text-sm">স্টোর ড্যাশবোর্ডে যান</span>
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-muted-foreground hover:text-foreground"
            onClick={() => navigate('/login')}
          >
            <LogOut className="h-5 w-5" />
            <span className="text-sm">লগআউট</span>
          </Button>
        </div>
      </aside>

      {/* Main content area */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* Admin Header */}
        <header className="sticky top-0 z-30 flex h-14 items-center gap-2 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80 px-3 lg:px-4">
          <Button variant="ghost" size="icon" className="lg:hidden h-9 w-9" onClick={() => setSidebarOpen(!sidebarOpen)}>
            <Menu className="h-5 w-5" />
          </Button>

          <h2 className="text-sm font-semibold text-foreground hidden sm:block">
            প্ল্যাটফর্ম কন্ট্রোল সেন্টার
          </h2>

          <div className="flex-1" />

          {/* Theme Toggle */}
          <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>

          {/* Notifications */}
          <AdminNotificationBell
            notifications={notifications}
            unreadCount={unreadCount}
            soundEnabled={soundEnabled}
            onSoundToggle={() => setSoundEnabled(!soundEnabled)}
            onMarkAsRead={markAsRead}
            onMarkAllAsRead={markAllAsRead}
            onClearAll={clearAll}
            onNotificationClick={() => {}}
          />
        </header>

        <main className="flex-1 overflow-auto p-4 lg:p-6 xl:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
