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

// Données de produits par défaut avec de vraies images de produits crypto
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
      'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=500&h=500&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1620321023374-d1a68fbc720d?w=500&h=500&fit=crop&crop=center'
    ],
    specifications: { connectivity: 'USB-C', screen: 'Tactile couleur', coins: '8000+' },
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
      'https://images.unsplash.com/photo-1605792657660-596af9009e82?w=500&h=500&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=500&h=500&fit=crop&crop=center'
    ],
    specifications: { connectivity: 'USB-C', screen: 'OLED', coins: '5000+' },
    is_active: true,
    created_at: new Date().toISOString()
  },
  {
    id: '3',
    name: 'Ledger Nano X',
    description: 'Wallet hardware premium avec Bluetooth et écran haute résolution pour plus de 5500 cryptomonnaies',
    price: 149000,
    currency: 'CFA',
    category_id: 'wallets',
    brand: 'Ledger',
    stock_quantity: 12,
    images: [
      'https://images.unsplash.com/photo-1639322537504-6427a16b0a28?w=500&h=500&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1620321023374-d1a68fbc720d?w=500&h=500&fit=crop&crop=center'
    ],
    specifications: { connectivity: 'USB-C/Bluetooth', screen: 'LCD HD', coins: '5500+' },
    is_active: true,
    created_at: new Date().toISOString()
  },
  {
    id: '4',
    name: 'Ledger Nano S Plus',
    description: 'Version améliorée du Nano S avec plus de stockage et support étendu des cryptomonnaies',
    price: 89000,
    currency: 'CFA',
    category_id: 'wallets',
    brand: 'Ledger',
    stock_quantity: 20,
    images: [
      'https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=500&h=500&fit=crop&crop=center'
    ],
    specifications: { connectivity: 'USB-C', screen: 'OLED', coins: '5500+' },
    is_active: true,
    created_at: new Date().toISOString()
  },
  {
    id: '5',
    name: 'T-shirt Bitcoin Orange Premium',
    description: 'T-shirt premium 100% coton biologique avec logo Bitcoin brodé main, édition limitée',
    price: 25000,
    currency: 'CFA',
    category_id: 'clothing',
    brand: 'Terex Fashion',
    stock_quantity: 50,
    images: [
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=500&fit=crop&crop=center'
    ],
    specifications: { material: '100% Coton Bio', sizes: 'S, M, L, XL, XXL', care: 'Lavage 30°' },
    is_active: true,
    created_at: new Date().toISOString()
  },
  {
    id: '6',
    name: 'Hoodie Ethereum Noir',
    description: 'Sweat à capuche premium avec logo Ethereum brodé, doublure polaire douce',
    price: 45000,
    currency: 'CFA',
    category_id: 'clothing',
    brand: 'Terex Fashion',
    stock_quantity: 30,
    images: [
      'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=500&h=500&fit=crop&crop=center'
    ],
    specifications: { material: '80% Coton 20% Polyester', sizes: 'S, M, L, XL, XXL', features: 'Capuche doublée' },
    is_active: true,
    created_at: new Date().toISOString()
  },
  {
    id: '7',
    name: 'CryptoSteel Capsule Solo',
    description: 'Carte en acier inoxydable pour sauvegarder vos phrases de récupération, résistant au feu et à l\'eau',
    price: 65000,
    currency: 'CFA',
    category_id: 'accessories',
    brand: 'CryptoSteel',
    stock_quantity: 25,
    images: [
      'https://images.unsplash.com/photo-1617957848587-01062d2bb7b1?w=500&h=500&fit=crop&crop=center'
    ],
    specifications: { material: 'Acier inoxydable 303', resistance: 'Feu 1000°C, Eau, Corrosion', capacity: '24 mots' },
    is_active: true,
    created_at: new Date().toISOString()
  },
  {
    id: '8',
    name: 'Formation Crypto Masterclass',
    description: 'Formation complète sur les cryptomonnaies et DeFi avec certificat, accès à vie et communauté privée',
    price: 149000,
    currency: 'CFA',
    category_id: 'training',
    brand: 'Terex Academy',
    stock_quantity: 100,
    images: [
      'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500&h=500&fit=crop&crop=center'
    ],
    specifications: { duration: '40 heures', modules: '12 modules', language: 'Français', certificate: 'Inclus' },
    is_active: true,
    created_at: new Date().toISOString()
  },
  {
    id: '9',
    name: 'Yubikey 5C NFC',
    description: 'Clé de sécurité hardware pour authentification 2FA ultra-sécurisée',
    price: 75000,
    currency: 'CFA',
    category_id: 'accessories',
    brand: 'Yubico',
    stock_quantity: 18,
    images: [
      'https://images.unsplash.com/photo-1580894732444-8ecded7900cd?w=500&h=500&fit=crop&crop=center'
    ],
    specifications: { connectivity: 'USB-C, NFC', protocols: 'FIDO2, U2F, OTP', compatibility: 'Multi-plateforme' },
    is_active: true,
    created_at: new Date().toISOString()
  },
  {
    id: '10',
    name: 'Casquette Bitcoin Snapback',
    description: 'Casquette ajustable avec logo Bitcoin brodé, visière plate, style streetwear',
    price: 18000,
    currency: 'CFA',
    category_id: 'clothing',
    brand: 'Terex Fashion',
    stock_quantity: 45,
    images: [
      'https://images.unsplash.com/photo-1588117260148-b47818741c74?w=500&h=500&fit=crop&crop=center'
    ],
    specifications: { material: '100% Coton', style: 'Snapback', colors: 'Noir, Orange', fit: 'Ajustable' },
    is_active: true,
    created_at: new Date().toISOString()
  }
];

const defaultCategories: Category[] = [
  { 
    id: 'wallets', 
    name: 'Wallets Hardware', 
    description: 'Portefeuilles physiques ultra-sécurisés pour cryptomonnaies',
    image_url: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=300&h=200&fit=crop'
  },
  { 
    id: 'clothing', 
    name: 'Mode Crypto', 
    description: 'Vêtements et accessoires tendance pour les passionnés de crypto',
    image_url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=200&fit=crop'
  },
  { 
    id: 'accessories', 
    name: 'Sécurité & Accessoires', 
    description: 'Outils de sécurité et accessoires pour protéger vos actifs numériques',
    image_url: 'https://images.unsplash.com/photo-1617957848587-01062d2bb7b1?w=300&h=200&fit=crop'
  },
  { 
    id: 'training', 
    name: 'Formation & Éducation', 
    description: 'Cours et formations pour maîtriser l\'univers des cryptomonnaies',
    image_url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=300&h=200&fit=crop'
  }
];

export const useMarketplace = () => {
  const [products, setProducts] = useState<Product[]>(defaultProducts);
  const [categories, setCategories] = useState<Category[]>(defaultCategories);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

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

  const fetchCart = async () => {
    if (!user) {
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

  const addToCart = async (productId: string, quantity: number = 1) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    if (!user) {
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
        title: "✅ Ajouté au panier",
        description: `${product.name} a été ajouté à votre panier`,
        className: "bg-green-600 text-white border-green-600",
      });
      return;
    }

    try {
      const existingItem = cartItems.find(item => item.product_id === productId);

      if (existingItem) {
        const { error } = await supabase
          .from('cart_items')
          .update({ quantity: existingItem.quantity + quantity })
          .eq('id', existingItem.id);

        if (error) throw error;
      } else {
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
        title: "✅ Ajouté au panier",
        description: `${product.name} a été ajouté à votre panier`,
        className: "bg-green-600 text-white border-green-600",
      });
    } catch (error) {
      console.error('Erreur lors de l\'ajout au panier:', error);
      toast({
        title: "❌ Erreur",
        description: "Impossible d'ajouter l'article au panier",
        variant: "destructive",
      });
    }
  };

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
