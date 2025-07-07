
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import Index from "./pages/Index";
import AuthPage from "./pages/AuthPage";
import AuthCallback from "./pages/AuthCallback";
import NotFound from "./pages/NotFound";
import PartnersPage from "./pages/PartnersPage";
import AboutPage from "./pages/AboutPage";
import CareersPage from "./pages/CareersPage";
import NewsPage from "./pages/NewsPage";
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
    <Router>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
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
              <Route path="/partners" element={<PartnersPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/careers" element={<CareersPage />} />
              <Route path="/news" element={<NewsPage />} />
              <Route path="/admin/*" element={<AdminPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </TransactionProvider>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
