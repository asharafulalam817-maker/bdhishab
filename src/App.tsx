import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { DashboardLayout } from "@/components/layout/DashboardLayout";

// Auth Pages
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import CreateStore from "./pages/CreateStore";

// App Pages
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Customers from "./pages/Customers";
import POS from "./pages/POS";
import Warranty from "./pages/Warranty";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/create-store" element={
              <ProtectedRoute requireStore={false}>
                <CreateStore />
              </ProtectedRoute>
            } />
            
            {/* Protected Routes */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/products" element={<Products />} />
              <Route path="/products/new" element={<Products />} />
              <Route path="/inventory/ledger" element={<Products />} />
              <Route path="/inventory/stock-in" element={<Products />} />
              <Route path="/inventory/stock-out" element={<Products />} />
              <Route path="/inventory/adjustment" element={<Products />} />
              <Route path="/inventory/low-stock" element={<Products />} />
              <Route path="/suppliers" element={<Customers />} />
              <Route path="/purchases" element={<Products />} />
              <Route path="/purchases/new" element={<Products />} />
              <Route path="/customers" element={<Customers />} />
              <Route path="/pos" element={<POS />} />
              <Route path="/sales" element={<Products />} />
              <Route path="/invoices" element={<Products />} />
              <Route path="/warranty" element={<Warranty />} />
              <Route path="/reports/*" element={<Products />} />
              {/* Settings - Only for Owner/Manager */}
              <Route path="/settings" element={
                <ProtectedRoute allowedRoles={['owner', 'manager']}>
                  <Settings />
                </ProtectedRoute>
              } />
            </Route>
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
