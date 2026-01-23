import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { AppSidebar } from './AppSidebar';
import { AppHeader } from './AppHeader';
import { useDemo } from '@/contexts/DemoContext';
import SupportChatDialog from '@/components/support/SupportChatDialog';

export function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { demoStore } = useDemo();

  return (
    <div className="flex min-h-screen w-full bg-background">
      <AppSidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        storeName={demoStore.name}
      />
      
      <div className="flex flex-1 flex-col min-w-0">
        <AppHeader onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        
        <main className="flex-1 overflow-auto p-4 lg:p-6 xl:p-8">
          <div className="w-full max-w-[1600px] mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
      
      {/* Support Chat Floating Button */}
      <SupportChatDialog />
    </div>
  );
}
