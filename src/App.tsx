
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { PWASessionSync } from "@/components/PWASessionSync";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthProvider } from '@/contexts/AuthContext';
import Index from "./pages/Index";
import AuthCallback from "./pages/AuthCallback";
import AuthPage from "./pages/AuthPage";
import AdminPage from "./pages/AdminPage";
import BlockchainPage from "./pages/BlockchainPage";
import NotFound from "./pages/NotFound";
import React from 'react';

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <TooltipProvider>
            <BrowserRouter>
              <Toaster />
              <Sonner />
              <PWASessionSync />
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/admin" element={<AdminPage />} />
                <Route path="/blockchain" element={<BlockchainPage />} />
                <Route path="/auth/callback" element={<AuthCallback />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
