
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import Index from "./pages/Index";
import AuthPage from "./pages/AuthPage";
import AuthCallback from "./pages/AuthCallback";
import NotFound from "./pages/NotFound";
import AboutPage from "./pages/AboutPage";
import CareersPage from "./pages/CareersPage";
import SupportPage from "./pages/SupportPage";
import ContactPage from "./pages/ContactPage";
import FAQPage from "./pages/FAQPage";
import HelpPage from "./pages/HelpPage";
import GuidePage from "./pages/GuidePage";
import StatusPage from "./pages/StatusPage";
import TermsPage from "./pages/TermsPage";
import PrivacyPage from "./pages/PrivacyPage";
import SecurityPage from "./pages/SecurityPage";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "./contexts/AuthContext";
import { MarketingPage } from "./pages/MarketingPage";
import AdminPage from "./pages/AdminPage";
import { Toaster } from "@/components/ui/toaster"
import BlockchainPage from "./pages/BlockchainPage";
import { TransactionProvider } from "./contexts/TransactionContext";
import { PWASessionSync } from "./components/PWASessionSync";

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Router>
        <AuthProvider>
          <TransactionProvider>
            <PWASessionSync />
            <Toaster />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/auth/callback" element={<AuthCallback />} />
              <Route path="/blockchain" element={<BlockchainPage />} />
              <Route path="/marketing" element={<MarketingPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/careers" element={<CareersPage />} />
              <Route path="/support" element={<SupportPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/faq" element={<FAQPage />} />
              <Route path="/help" element={<HelpPage />} />
              <Route path="/guide" element={<GuidePage />} />
              <Route path="/status" element={<StatusPage />} />
              <Route path="/terms" element={<TermsPage />} />
              <Route path="/privacy" element={<PrivacyPage />} />
              <Route path="/security" element={<SecurityPage />} />
              <Route path="/admin/*" element={<AdminPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </TransactionProvider>
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;
