
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { TransactionProvider } from "@/contexts/TransactionContext";
import { ScrollToTop } from "@/components/ScrollToTop";
import { PWAInstallPrompt } from "@/components/PWAInstallPrompt";
import { PWASessionSync } from "@/components/PWASessionSync";

// Pages publiques
import Index from "./pages/Index";
import AuthPage from "./pages/AuthPage";
import AuthCallback from "./pages/AuthCallback";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import FAQPage from "./pages/FAQPage";
import HelpPage from "./pages/HelpPage";
import SupportPage from "./pages/SupportPage";
import TermsPage from "./pages/TermsPage";
import PrivacyPage from "./pages/PrivacyPage";
import SecurityPage from "./pages/SecurityPage";
import StatusPage from "./pages/StatusPage";
import CareersPage from "./pages/CareersPage";
import GuidePage from "./pages/GuidePage";
import { MarketingPage } from "./pages/MarketingPage";
import BlockchainPage from "./pages/BlockchainPage";
import NotFound from "./pages/NotFound";

// Pages blog
import BlogPage from "./pages/BlogPage";
import BlogPostPage from "./pages/BlogPostPage";

// Pages admin
import AdminPage from "./pages/AdminPage";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <TransactionProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <ScrollToTop />
                <PWAInstallPrompt />
                <PWASessionSync />
                <Routes>
                  {/* Routes publiques */}
                  <Route path="/" element={<Index />} />
                  <Route path="/auth" element={<AuthPage />} />
                  <Route path="/auth/callback" element={<AuthCallback />} />
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/contact" element={<ContactPage />} />
                  <Route path="/faq" element={<FAQPage />} />
                  <Route path="/help" element={<HelpPage />} />
                  <Route path="/support" element={<SupportPage />} />
                  <Route path="/terms" element={<TermsPage />} />
                  <Route path="/privacy" element={<PrivacyPage />} />
                  <Route path="/security" element={<SecurityPage />} />
                  <Route path="/status" element={<StatusPage />} />
                  <Route path="/careers" element={<CareersPage />} />
                  <Route path="/guide" element={<GuidePage />} />
                  <Route path="/marketing" element={<MarketingPage />} />
                  <Route path="/blockchain" element={<BlockchainPage />} />
                  
                  {/* Routes blog */}
                  <Route path="/blog" element={<BlogPage />} />
                  <Route path="/blog/:slug" element={<BlogPostPage />} />
                  
                  {/* Routes admin */}
                  <Route path="/admin" element={<AdminPage />} />
                  
                  {/* Page 404 */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </TooltipProvider>
          </TransactionProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
