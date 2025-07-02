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

// Données de produits par défaut avec photos réelles et variées
const defaultProducts: Product[] = [
  // Hardware Wallets - Trezor
  {
    id: '1',
    name: 'Trezor Safe 5',
    description: 'Le wallet hardware le plus avancé de Trezor avec écran tactile couleur et support de 8000+ cryptomonnaies. Sécurité maximale avec authentification biométrique.',
    price: 169000,
    currency: 'CFA',
    category_id: 'wallets',
    brand: 'Trezor',
    stock_quantity: 15,
    images: ['/lovable-uploads/6a172626-e81f-4a46-b547-c09040acb9a9.png'],
    specifications: { connectivity: 'USB-C', screen: 'Tactile couleur', coins: '8000+' },
    is_active: true,
    created_at: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Trezor Safe 3',
    description: 'Wallet hardware compact et sécurisé avec écran OLED et boutons physiques. Interface intuitive et design épuré.',
    price: 79000,
    currency: 'CFA',
    category_id: 'wallets',
    brand: 'Trezor',
    stock_quantity: 25,
    images: ['/lovable-uploads/109de98a-a26f-4bbf-b8f0-8f33c50d1a7a.png'],
    specifications: { connectivity: 'USB-C', screen: 'OLED', coins: '5000+' },
    is_active: true,
    created_at: new Date(Date.now() - 86400000).toISOString()
  },
  
  // Hardware Wallets - Ledger
  {
    id: '3',
    name: 'Ledger Nano S Plus',
    description: 'Wallet hardware Ledger avec écran et support de 5500+ cryptomonnaies. Design compact et robuste.',
    price: 79000,
    currency: 'CFA',
    category_id: 'wallets',
    brand: 'Ledger',
    stock_quantity: 20,
    images: ['/lovable-uploads/2962c334-a431-4aec-afc8-3057aedfb37f.png'],
    specifications: { connectivity: 'USB-C', screen: 'LCD', coins: '5500+' },
    is_active: true,
    created_at: new Date(Date.now() - 172800000).toISOString()
  },
  {
    id: '4',
    name: 'Ledger Nano X',
    description: 'Wallet hardware premium avec Bluetooth et écran haute résolution. Batterie intégrée et connectivité mobile.',
    price: 149000,
    currency: 'CFA',
    category_id: 'wallets',
    brand: 'Ledger',
    stock_quantity: 12,
    images: ['/lovable-uploads/1201a99e-a9d2-4269-8a38-081a3f9ca624.png'],
    specifications: { connectivity: 'USB-C/Bluetooth', screen: 'LCD HD', battery: 'Intégrée' },
    is_active: true,
    created_at: new Date(Date.now() - 259200000).toISOString()
  },
  {
    id: '5',
    name: 'Ledger Stax',
    description: 'Le wallet hardware le plus avancé de Ledger avec grand écran E-ink et design premium. Interface révolutionnaire.',
    price: 279000,
    currency: 'CFA',
    category_id: 'wallets',
    brand: 'Ledger',
    stock_quantity: 8,
    images: ['https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400'],
    specifications: { connectivity: 'USB-C/Bluetooth', screen: 'E-ink', size: 'Large' },
    is_active: true,
    created_at: new Date(Date.now() - 345600000).toISOString()
  },

  // Vêtements Crypto
  {
    id: '6',
    name: 'T-shirt Bitcoin Orange Premium',
    description: 'T-shirt premium 100% coton avec logo Bitcoin stylisé. Coupe moderne et confortable.',
    price: 15000,
    currency: 'CFA',
    category_id: 'clothing',
    brand: 'Terex',
    stock_quantity: 50,
    images: ['/lovable-uploads/29969ee7-eb01-43e8-9722-d2aa5b959735.png'],
    specifications: { material: '100% Coton', sizes: 'S, M, L, XL', care: 'Machine wash' },
    is_active: true,
    created_at: new Date(Date.now() - 432000000).toISOString()
  },
  {
    id: '7',
    name: 'T-shirt Ethereum Noir Élégant',
    description: 'T-shirt élégant avec logo Ethereum brodé. Coupe moderne et finition haut de gamme.',
    price: 18000,
    currency: 'CFA',
    category_id: 'clothing',
    brand: 'Terex',
    stock_quantity: 40,
    images: ['/lovable-uploads/3e8bdd84-3bdf-49ba-98b7-08e541f8323a.png'],
    specifications: { material: '100% Coton', sizes: 'S, M, L, XL, XXL', style: 'Brodé' },
    is_active: true,
    created_at: new Date(Date.now() - 518400000).toISOString()
  },
  {
    id: '8',
    name: 'Hoodie "HODL" Crypto',
    description: 'Sweat à capuche confortable avec message crypto emblématique. Parfait pour les vrais believers.',
    price: 35000,
    currency: 'CFA',
    category_id: 'clothing',
    brand: 'Terex',
    stock_quantity: 25,
    images: ['https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400'],
    specifications: { material: '80% Coton 20% Polyester', sizes: 'S, M, L, XL', type: 'Hoodie' },
    is_active: true,
    created_at: new Date(Date.now() - 604800000).toISOString()
  },
  {
    id: '9',
    name: 'Casquette Bitcoin Snapback',
    description: 'Casquette snapback avec logo Bitcoin brodé. Style urbain et qualité premium.',
    price: 12000,
    currency: 'CFA',
    category_id: 'clothing',
    brand: 'Terex',
    stock_quantity: 60,
    images: ['https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=400'],
    specifications: { material: '100% Coton', style: 'Snapback', color: 'Noir/Orange' },
    is_active: true,
    created_at: new Date(Date.now() - 691200000).toISOString()
  },

  // Accessoires
  {
    id: '10',
    name: 'Carte Crypto Steel Pro',
    description: 'Carte en acier inoxydable pour sauvegarder vos phrases de récupération. Résistante au feu et à l\'eau.',
    price: 35000,
    currency: 'CFA',
    category_id: 'accessories',
    brand: 'CryptoSteel',
    stock_quantity: 30,
    images: ['/lovable-uploads/2deedbc3-65e1-4e12-85a2-301f882eaafb.png'],
    specifications: { material: 'Acier inoxydable', resistance: 'Feu/Eau', capacity: '24 mots' },
    is_active: true,
    created_at: new Date(Date.now() - 777600000).toISOString()
  },
  {
    id: '11',
    name: 'Porte-clés Hardware Wallet',
    description: 'Porte-clés de protection pour votre wallet hardware. Design discret et robuste.',
    price: 8000,
    currency: 'CFA',
    category_id: 'accessories',
    brand: 'Terex',
    stock_quantity: 45,
    images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400'],
    specifications: { material: 'Silicone premium', compatibility: 'Universel', colors: 'Multiple' },
    is_active: true,
    created_at: new Date(Date.now() - 864000000).toISOString()
  },
  {
    id: '12',
    name: 'Autocollants Crypto Pack',
    description: 'Pack de 20 autocollants crypto variés. Bitcoin, Ethereum, et autres cryptos populaires.',
    price: 5000,
    currency: 'CFA',
    category_id: 'accessories',
    brand: 'Terex',
    stock_quantity: 100,
    images: ['https://images.unsplash.com/photo-1640161704729-cbe966a08853?w=400'],
    specifications: { quantity: '20 pieces', material: 'Vinyl waterproof', size: 'Various' },
    is_active: true,
    created_at: new Date(Date.now() - 950400000).toISOString()
  },

  // Formations
  {
    id: '13',
    name: 'Formation Crypto Complète - Débutant à Expert',
    description: 'Cours en ligne complet sur la cryptomonnaie et la blockchain. De débutant à expert en 20 heures.',
    price: 89000,
    currency: 'CFA',
    category_id: 'training',
    brand: 'Terex Academy',
    stock_quantity: 1000,
    images: ['/lovable-uploads/26b3437e-c333-4387-aeb9-731aa705f282.png'],
    specifications: { duration: '20 heures', language: 'Français', access: 'À vie', certificate: 'Inclus' },
    is_active: true,
    created_at: new Date(Date.now() - 1036800000).toISOString()
  },
  {
    id: '14',
    name: 'Masterclass Trading Crypto',
    description: 'Formation avancée au trading de cryptomonnaies. Stratégies, analyse technique et gestion des risques.',
    price: 149000,
    currency: 'CFA',
    category_id: 'training',
    brand: 'Terex Academy',
    stock_quantity: 500,
    images: ['https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400'],
    specifications: { duration: '15 heures', level: 'Avancé', support: '6 mois', tools: 'Inclus' },
    is_active: true,
    created_at: new Date(Date.now() - 1123200000).toISOString()
  },
  {
    id: '15',
    name: 'Guide DeFi et NFT 2024',
    description: 'Guide complet sur la finance décentralisée et les NFTs. Stratégies et opportunités pour 2024.',
    price: 59000,
    currency: 'CFA',
    category_id: 'training',
    brand: 'Terex Academy',
    stock_quantity: 750,
    images: ['https://images.unsplash.com/photo-1639762681057-408e52192e55?w=400'],
    specifications: { format: 'PDF + Vidéos', pages: '200+', updates: '1 an', bonus: 'Templates' },
    is_active: true,
    created_at: new Date(Date.now() - 1209600000).toISOString()
  },

  // Mining Equipment
  {
    id: '16',
    name: 'ASIC Miner Antminer S19 Pro',
    description: 'Mineur ASIC professionnel pour Bitcoin. Haute performance et efficacité énergétique.',
    price: 1250000,
    currency: 'CFA',
    category_id: 'mining',
    brand: 'Bitmain',
    stock_quantity: 5,
    images: ['/lovable-uploads/631f288e-7499-4396-b3dc-936d11ae8c00.png'],
    specifications: { hashrate: '110 TH/s', power: '3250W', efficiency: '29.5 J/TH', warranty: '1 an' },
    is_active: true,
    created_at: new Date(Date.now() - 1296000000).toISOString()
  },
  {
    id: '17',
    name: 'GPU RTX 4090 Mining Rig',
    description: 'Rig de minage avec RTX 4090. Parfait pour Ethereum et autres cryptos GPU-friendly.',
    price: 2800000,
    currency: 'CFA',
    category_id: 'mining',
    brand: 'NVIDIA',
    stock_quantity: 3,
    images: ['https://images.unsplash.com/photo-1591488320449-011701bb6704?w=400'],
    specifications: { gpu: 'RTX 4090', quantity: '8 GPUs', hashrate: '800 MH/s', power: '3000W' },
    is_active: true,
    created_at: new Date(Date.now() - 1382400000).toISOString()
  },
  {
    id: '18',
    name: 'Alimentation Mining 1600W 80+ Gold',
    description: 'Alimentation haute efficacité pour rigs de minage. Certification 80+ Gold et ventilation silencieuse.',
    price: 185000,
    currency: 'CFA',
    category_id: 'mining',
    brand: 'Corsair',
    stock_quantity: 15,
    images: ['https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=400'],
    specifications: { power: '1600W', efficiency: '80+ Gold', modular: 'Oui', warranty: '3 ans' },
    is_active: true,
    created_at: new Date(Date.now() - 1468800000).toISOString()
  },

  // Livres et Guides
  {
    id: '19',
    name: 'Livre "Bitcoin Standard" - Version Française',
    description: 'Le livre de référence sur Bitcoin par Saifedean Ammous. Édition française officielle.',
    price: 25000,
    currency: 'CFA',
    category_id: 'books',
    brand: 'Terex Éditions',
    stock_quantity: 200,
    images: ['https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400'],
    specifications: { pages: '320', language: 'Français', format: 'Broché', author: 'S. Ammous' },
    is_active: true,
    created_at: new Date(Date.now() - 1555200000).toISOString()
  },
  {
    id: '20',
    name: 'Guide "Blockchain pour les Nuls"',
    description: 'Guide complet et accessible sur la technologie blockchain. Parfait pour débuter.',
    price: 18000,
    currency: 'CFA',
    category_id: 'books',
    brand: 'Terex Éditions',
    stock_quantity: 150,
    images: ['https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400'],
    specifications: { pages: '250', difficulty: 'Débutant', illustrations: 'Nombreuses', examples: 'Pratiques' },
    is_active: true,
    created_at: new Date(Date.now() - 1641600000).toISOString()
  },

  // Hardware Accessories
  {
    id: '21',
    name: 'Câble USB-C Sécurisé pour Wallets',
    description: 'Câble USB-C haute qualité spécialement conçu pour les wallets hardware. Blindage EMI.',
    price: 15000,
    currency: 'CFA',
    category_id: 'accessories',
    brand: 'Terex',
    stock_quantity: 80,
    images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400'],
    specifications: { length: '1.5m', shielding: 'EMI', connector: 'USB-C', durability: 'Renforcé' },
    is_active: true,
    created_at: new Date(Date.now() - 1728000000).toISOString()
  },
  {
    id: '22',
    name: 'Station de Charge Multi-Wallets',
    description: 'Station de charge pour plusieurs wallets hardware. Design élégant et charge rapide.',
    price: 45000,
    currency: 'CFA',
    category_id: 'accessories',
    brand: 'Terex',
    stock_quantity: 20,
    images: ['https://images.unsplash.com/photo-1609172174299-0b088a441e8d?w=400'],
    specifications: { ports: '4 USB-C', charging: 'Fast charge', material: 'Aluminium', led: 'Status LED' },
    is_active: true,
    created_at: new Date(Date.now() - 1814400000).toISOString()
  },

  // Software & Outils
  {
    id: '23',
    name: 'Licence Portfolio Tracker Pro',
    description: 'Logiciel professionnel de suivi de portfolio crypto. Analyses avancées et rapports fiscaux.',
    price: 89000,
    currency: 'CFA',
    category_id: 'software',
    brand: 'CryptoTracker',
    stock_quantity: 1000,
    images: ['https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400'],
    specifications: { duration: '1 an', exchanges: '50+', features: 'Complètes', support: '24/7' },
    is_active: true,
    created_at: new Date(Date.now() - 1900800000).toISOString()
  },
  {
    id: '24',
    name: 'VPN Crypto Premium',
    description: 'VPN spécialisé pour les transactions crypto. Sécurité maximale et serveurs dédiés.',
    price: 45000,
    currency: 'CFA',
    category_id: 'software',
    brand: 'CryptoVPN',
    stock_quantity: 500,
    images: ['https://images.unsplash.com/photo-1563206767-5b18f218e8de?w=400'],
    specifications: { duration: '1 an', servers: '100+', encryption: 'AES-256', logs: 'No logs' },
    is_active: true,
    created_at: new Date(Date.now() - 1987200000).toISOString()
  }
];

const defaultCategories: Category[] = [
  { id: 'wallets', name: 'Wallets Hardware', description: 'Portefeuilles physiques sécurisés' },
  { id: 'clothing', name: 'Vêtements Crypto', description: 'T-shirts et accessoires Bitcoin/Crypto' },
  { id: 'accessories', name: 'Accessoires', description: 'Cartes de sauvegarde et gadgets' },
  { id: 'training', name: 'Formations', description: 'Cours et guides crypto' },
  { id: 'mining', name: 'Matériel Mining', description: 'ASICs et équipements de minage' },
  { id: 'books', name: 'Livres', description: 'Ouvrages de référence crypto' },
  { id: 'software', name: 'Logiciels', description: 'Outils et applications crypto' }
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
