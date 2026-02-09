import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { DemoProvider } from "@/contexts/DemoContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { ReadOnlyProvider } from "@/contexts/ReadOnlyContext";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { InstallPrompt } from "@/components/pwa/InstallPrompt";
// App Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import StockManagement from "./pages/StockManagement";
import Customers from "./pages/Customers";
import CustomerDetail from "./pages/CustomerDetail";
import Suppliers from "./pages/Suppliers";
import SupplierDetail from "./pages/SupplierDetail";
import Purchases from "./pages/Purchases";
import POS from "./pages/POS";
import Sales from "./pages/Sales";
import Reports from "./pages/Reports";
import Warranty from "./pages/Warranty";
import WarrantyDetail from "./pages/WarrantyDetail";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import AdminDashboard from "./pages/AdminDashboard";
import QuickStock from "./pages/QuickStock";

const queryClient = new QueryClient();


// Demo Mode: All routes are accessible without authentication
const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <LanguageProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <InstallPrompt />
          <BrowserRouter>
            <DemoProvider>
              <ReadOnlyProvider>
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />
                  
                  {/* Admin Routes - Separate Layout */}
                  <Route element={<AdminLayout />}>
                    <Route path="/admin" element={<AdminDashboard />} />
                  </Route>
                  
                  {/* Protected Dashboard Routes */}
                  <Route element={<DashboardLayout />}>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/products" element={<Products />} />
                    <Route path="/products/new" element={<Products />} />
                    <Route path="/stock" element={<StockManagement />} />
                    <Route path="/inventory/ledger" element={<StockManagement />} />
                    <Route path="/inventory/stock-in" element={<StockManagement />} />
                    <Route path="/inventory/stock-out" element={<StockManagement />} />
                    <Route path="/inventory/adjustment" element={<StockManagement />} />
                    <Route path="/inventory/low-stock" element={<StockManagement />} />
                    <Route path="/quick-stock" element={<QuickStock />} />
                    <Route path="/suppliers" element={<Suppliers />} />
                    <Route path="/suppliers/:id" element={<SupplierDetail />} />
                    <Route path="/purchases" element={<Purchases />} />
                    <Route path="/purchases/new" element={<Purchases />} />
                    <Route path="/customers" element={<Customers />} />
                    <Route path="/customers/:id" element={<CustomerDetail />} />
                    <Route path="/pos" element={<POS />} />
                    <Route path="/sales" element={<Sales />} />
                    <Route path="/invoices" element={<Sales />} />
                    <Route path="/warranty" element={<Warranty />} />
                    <Route path="/warranty/:id" element={<WarrantyDetail />} />
                    <Route path="/reports" element={<Reports />} />
                    <Route path="/reports/*" element={<Reports />} />
                    <Route path="/settings" element={<Settings />} />
                  </Route>
                  
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </ReadOnlyProvider>
            </DemoProvider>
          </BrowserRouter>
        </TooltipProvider>
      </LanguageProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
