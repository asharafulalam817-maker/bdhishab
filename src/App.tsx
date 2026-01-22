import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
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
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route element={<DashboardLayout />}>
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
            <Route path="/settings" element={<Settings />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
