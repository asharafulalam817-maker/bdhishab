import { useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { AppSidebar } from './AppSidebar';
import { AppHeader } from './AppHeader';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

export function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isLoading, isAuthenticated, hasStore, currentStore } = useAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
          <p className="mt-4 text-muted-foreground">লোড হচ্ছে...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!hasStore) {
    return <Navigate to="/create-store" replace />;
  }

  return (
    <div className="flex min-h-screen w-full bg-background">
      <AppSidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        storeName={currentStore?.store?.name || 'স্টোর'}
      />
      
      <div className="flex flex-1 flex-col lg:ml-0">
        <AppHeader onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        
        <main className="flex-1 overflow-auto p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
