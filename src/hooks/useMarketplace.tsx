import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  category_id: string;
  brand: string;
  stock_quantity: number;
  images: string[];
  specifications: any;
  is_active: boolean;
  created_at: string;
  category?: {
    name: string;
    description: string;
  };
}

interface CartItem {
  id: string;
  product_id: string;
  quantity: number;
  product?: Product;
}

interface Category {
  id: string;
  name: string;
  description: string;
  image_url?: string;
}

// Données de produits par défaut avec les nouvelles photos uploadées
const defaultProducts: Product[] = [
  {
    id: '1',
    name: 'Trezor Safe 5',
    description: 'Le wallet hardware le plus avancé de Trezor avec écran tactile couleur et support de 8000+ cryptomonnaies',
    price: 169000,
    currency: 'CFA',
    category_id: 'wallets',
    brand: 'Trezor',
    stock_quantity: 15,
    images: [
      '/lovable-uploads/99eec0e6-2e12-41a7-b71d-dbc871a5362e.png',
      '/lovable-uploads/b326471e-efd2-423e-b396-98ebe830eb9a.png'
    ],
    specifications: { connectivity: 'USB-C', screen: 'Tactile couleur' },
    is_active: true,
    created_at: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Trezor Safe 3',
    description: 'Wallet hardware compact et sécurisé avec écran OLED et boutons physiques',
    price: 79000,
    currency: 'CFA',
    category_id: 'wallets',
    brand: 'Trezor',
    stock_quantity: 25,
    images: [
      '/lovable-uploads/f9a810b1-b421-4c66-abc8-6ff1158d7866.png',
      '/lovable-uploads/6d76b078-0579-4506-b2a6-33ee439a62c1.png'
    ],
    specifications: { connectivity: 'USB-C', screen: 'OLED' },
    is_active: true,
    created_at: new Date().toISOString()
  },
  {
    id: '3',
    name: 'Trezor Model One',
    description: 'Le wallet hardware original de Trezor, simple et efficace pour débuter en sécurité crypto',
    price: 59000,
    currency: 'CFA',
    category_id: 'wallets',
    brand: 'Trezor',
    stock_quantity: 30,
    images: [
      '/lovable-uploads/c8b57eb3-8db7-4624-84db-f69c8a39c034.png',
      '/lovable-uploads/f6157130-037c-4cfe-9f93-6eafb39ef66b.png'
    ],
    specifications: { connectivity: 'USB', screen: 'OLED Monochrome' },
    is_active: true,
    created_at: new Date().toISOString()
  },
  {
    id: '4',
    name: 'Ledger Nano X',
    description: 'Wallet hardware premium avec Bluetooth et écran haute résolution',
    price: 149000,
    currency: 'CFA',
    category_id: 'wallets',
    brand: 'Ledger',
    stock_quantity: 12,
    images: ['/lovable-uploads/1201a99e-a9d2-4269-8a38-081a3f9ca624.png'],
    specifications: { connectivity: 'USB-C/Bluetooth', screen: 'LCD HD' },
    is_active: true,
    created_at: new Date().toISOString()
  },
  {
    id: '5',
    name: 'T-shirt Bitcoin Orange',
    description: 'T-shirt premium 100% coton avec logo Bitcoin stylisé',
    price: 15000,
    currency: 'CFA',
    category_id: 'clothing',
    brand: 'Terex',
    stock_quantity: 50,
    images: ['/lovable-uploads/29969ee7-eb01-43e8-9722-d2aa5b959735.png'],
    specifications: { material: '100% Coton', sizes: 'S, M, L, XL' },
    is_active: true,
    created_at: new Date().toISOString()
  },
  {
    id: '6',
    name: 'T-shirt Ethereum Noir',
    description: 'T-shirt élégant avec logo Ethereum brodé, coupe moderne',
    price: 18000,
    currency: 'CFA',
    category_id: 'clothing',
    brand: 'Terex',
    stock_quantity: 40,
    images: ['/lovable-uploads/3e8bdd84-3bdf-49ba-98b7-08e541f8323a.png'],
    specifications: { material: '100% Coton', sizes: 'S, M, L, XL, XXL' },
    is_active: true,
    created_at: new Date().toISOString()
  },
  {
    id: '7',
    name: 'Carte Crypto Steel',
    description: 'Carte en acier inoxydable pour sauvegarder vos phrases de récupération',
    price: 35000,
    currency: 'CFA',
    category_id: 'accessories',
    brand: 'CryptoSteel',
    stock_quantity: 30,
    images: ['/lovable-uploads/2deedbc3-65e1-4e12-85a2-301f882eaafb.png'],
    specifications: { material: 'Acier inoxydable', resistance: 'Feu/Eau' },
    is_active: true,
    created_at: new Date().toISOString()
  },
  {
    id: '8',
    name: 'Formation Crypto Complète',
    description: 'Cours en ligne complet sur la cryptomonnaie et la blockchain (accès à vie)',
    price: 89000,
    currency: 'CFA',
    category_id: 'training',
    brand: 'Terex Academy',
    stock_quantity: 100,
    images: ['/lovable-uploads/26b3437e-c333-4387-aeb9-731aa705f282.png'],
    specifications: { duration: '20 heures', language: 'Français', access: 'À vie' },
    is_active: true,
    created_at: new Date().toISOString()
  }
];

const defaultCategories: Category[] = [
  { id: 'wallets', name: 'Wallets Hardware', description: 'Portefeuilles physiques sécurisés' },
  { id: 'clothing', name: 'Vêtements Crypto', description: 'T-shirts et accessoires Bitcoin/Crypto' },
  { id: 'accessories', name: 'Accessoires', description: 'Cartes de sauvegarde et gadgets' },
  { id: 'training', name: 'Formations', description: 'Cours et guides crypto' }
];

export const useMarketplace = () => {
  const [products, setProducts] = useState<Product[]>(defaultProducts);
  const [categories, setCategories] = useState<Category[]>(defaultCategories);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  // Charger les produits
  const fetchProducts = async (categoryId?: string) => {
    try {
      setLoading(true);
      let query = supabase
        .from('products')
        .select(`
          *,
          category:product_categories(name, description)
        `)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (categoryId) {
        query = query.eq('category_id', categoryId);
      }

      const { data, error } = await query;

      if (error) {
        console.log('Utilisation des produits par défaut:', error);
        const filteredProducts = categoryId 
          ? defaultProducts.filter(p => p.category_id === categoryId)
          : defaultProducts;
        setProducts(filteredProducts);
      } else {
        setProducts(data || defaultProducts);
      }
    } catch (error) {
      console.log('Utilisation des produits par défaut:', error);
      setProducts(defaultProducts);
    } finally {
      setLoading(false);
    }
  };

  // Charger les catégories
  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('product_categories')
        .select('*')
        .order('name');

      if (error) {
        console.log('Utilisation des catégories par défaut:', error);
        setCategories(defaultCategories);
      } else {
        setCategories(data || defaultCategories);
      }
    } catch (error) {
      console.log('Utilisation des catégories par défaut:', error);
      setCategories(defaultCategories);
    }
  };

  // Charger le panier
  const fetchCart = async () => {
    if (!user) {
      // Charger le panier depuis localStorage si pas connecté
      const localCart = localStorage.getItem('terex_cart');
      if (localCart) {
        const cartData = JSON.parse(localCart);
        const cartWithProducts = cartData.map((item: any) => ({
          ...item,
          product: products.find(p => p.id === item.product_id)
        }));
        setCartItems(cartWithProducts);
      }
      return;
    }

    try {
      const { data, error } = await supabase
        .from('cart_items')
        .select(`
          *,
          product:products(*)
        `)
        .eq('user_id', user.id);

      if (error) {
        console.log('Erreur chargement panier:', error);
      } else {
        setCartItems(data || []);
      }
    } catch (error) {
      console.log('Erreur chargement panier:', error);
    }
  };

  // Ajouter au panier
  const addToCart = async (productId: string, quantity: number = 1) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    if (!user) {
      // Panier local pour utilisateurs non connectés
      const localCart = JSON.parse(localStorage.getItem('terex_cart') || '[]');
      const existingItem = localCart.find((item: any) => item.product_id === productId);
      
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        localCart.push({
          id: Date.now().toString(),
          product_id: productId,
          quantity,
          product
        });
      }
      
      localStorage.setItem('terex_cart', JSON.stringify(localCart));
      setCartItems(localCart);
      
      toast({
        title: "Ajouté au panier",
        description: "L'article a été ajouté à votre panier",
        className: "bg-green-600 text-white border-green-600",
      });
      return;
    }

    try {
      // Vérifier si le produit est déjà dans le panier
      const existingItem = cartItems.find(item => item.product_id === productId);

      if (existingItem) {
        // Mettre à jour la quantité
        const { error } = await supabase
          .from('cart_items')
          .update({ quantity: existingItem.quantity + quantity })
          .eq('id', existingItem.id);

        if (error) throw error;
      } else {
        // Ajouter un nouvel article
        const { error } = await supabase
          .from('cart_items')
          .insert({
            user_id: user.id,
            product_id: productId,
            quantity
          });

        if (error) throw error;
      }

      await fetchCart();
      toast({
        title: "Ajouté au panier",
        description: "L'article a été ajouté à votre panier",
        className: "bg-green-600 text-white border-green-600",
      });
    } catch (error) {
      console.error('Erreur lors de l\'ajout au panier:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter l'article au panier",
        variant: "destructive",
      });
    }
  };

  // Supprimer du panier
  const removeFromCart = async (cartItemId: string) => {
    if (!user) {
      const localCart = JSON.parse(localStorage.getItem('terex_cart') || '[]');
      const updatedCart = localCart.filter((item: any) => item.id !== cartItemId);
      localStorage.setItem('terex_cart', JSON.stringify(updatedCart));
      setCartItems(updatedCart);
      return;
    }

    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('id', cartItemId);

      if (error) throw error;
      await fetchCart();
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer l'article",
        variant: "destructive",
      });
    }
  };

  // Mettre à jour la quantité
  const updateQuantity = async (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      await removeFromCart(cartItemId);
      return;
    }

    if (!user) {
      const localCart = JSON.parse(localStorage.getItem('terex_cart') || '[]');
      const item = localCart.find((item: any) => item.id === cartItemId);
      if (item) {
        item.quantity = quantity;
        localStorage.setItem('terex_cart', JSON.stringify(localCart));
        setCartItems([...localCart]);
      }
      return;
    }

    try {
      const { error } = await supabase
        .from('cart_items')
        .update({ quantity })
        .eq('id', cartItemId);

      if (error) throw error;
      await fetchCart();
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour la quantité",
        variant: "destructive",
      });
    }
  };

  // Vider le panier
  const clearCart = async () => {
    if (!user) {
      localStorage.removeItem('terex_cart');
      setCartItems([]);
      return;
    }

    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', user.id);

      if (error) throw error;
      setCartItems([]);
    } catch (error) {
      console.error('Erreur lors du vidage du panier:', error);
    }
  };

  // Calculer le total du panier
  const getCartTotal = () => {
    return cartItems.reduce((total, item) => {
      return total + (item.product?.price || 0) * item.quantity;
    }, 0);
  };

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  useEffect(() => {
    fetchCart();
  }, [user, products]);

  return {
    products,
    categories,
    cartItems,
    loading,
    fetchProducts,
    fetchCategories,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
  };
};
