
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import Index from "./pages/Index";
import AuthPage from "./pages/AuthPage";
import AuthCallback from "./pages/AuthCallback";
import NotFound from "./pages/NotFound";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "./contexts/AuthContext";
import { MarketingPage } from "./pages/MarketingPage";
import AdminPage from "./pages/AdminPage";
import { Toaster } from "@/components/ui/toaster"
import BlockchainPage from "./pages/BlockchainPage";
import { TransactionProvider } from "./contexts/TransactionContext";
import { PWASessionSync } from "./components/PWASessionSync";
import { MarketplacePage } from '@/pages/MarketplacePage';
import { ProductDetailPage } from '@/pages/ProductDetailPage';
import { SearchPage } from '@/pages/SearchPage';
import { WishlistPage } from '@/pages/WishlistPage';
import { ComparePage } from '@/pages/ComparePage';
import { ReviewsPage } from '@/pages/ReviewsPage';

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
              <Route path="/admin/*" element={<AdminPage />} />
              <Route path="/marketplace" element={<MarketplacePage />} />
              <Route path="/marketplace/product/:productId" element={<ProductDetailPage />} />
              <Route path="/marketplace/search" element={<SearchPage />} />
              <Route path="/marketplace/wishlist" element={<WishlistPage />} />
              <Route path="/marketplace/compare" element={<ComparePage />} />
              <Route path="/marketplace/product/:productId/reviews" element={<ReviewsPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </TransactionProvider>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
