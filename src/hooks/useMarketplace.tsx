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
  rating?: number;
  reviewCount?: number;
  isNew?: boolean;
  isPopular?: boolean;
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
  productCount?: number;
}

// Catalogue enrichi avec vraies images et plus de produits
const defaultProducts: Product[] = [
  // Wallets Hardware Premium
  {
    id: '1',
    name: 'Trezor Safe 5',
    description: 'Le wallet hardware le plus avancé de Trezor avec écran tactile couleur 2.4" et support de 8000+ cryptomonnaies. Sécurité militaire avec authentification biométrique.',
    price: 169000,
    currency: 'CFA',
    category_id: 'wallets',
    brand: 'Trezor',
    stock_quantity: 15,
    images: ['/lovable-uploads/6a172626-e81f-4a46-b547-c09040acb9a9.png'],
    specifications: { 
      connectivity: 'USB-C', 
      screen: 'Tactile couleur 2.4"', 
      security: 'EAL6+',
      coins: '8000+' 
    },
    is_active: true,
    created_at: new Date().toISOString(),
    rating: 4.8,
    reviewCount: 127,
    isPopular: true
  },
  {
    id: '2',
    name: 'Trezor Safe 3',
    description: 'Wallet hardware compact et sécurisé avec écran OLED monochrome et boutons physiques. Parfait pour débuter en sécurité crypto.',
    price: 79000,
    currency: 'CFA',
    category_id: 'wallets',
    brand: 'Trezor',
    stock_quantity: 25,
    images: ['/lovable-uploads/109de98a-a26f-4bbf-b8f0-8f33c50d1a7a.png'],
    specifications: { 
      connectivity: 'USB-C', 
      screen: 'OLED monochrome',
      coins: '5000+' 
    },
    is_active: true,
    created_at: new Date().toISOString(),
    rating: 4.6,
    reviewCount: 89
  },
  {
    id: '3',
    name: 'Ledger Nano S Plus',
    description: 'Wallet hardware Ledger nouvelle génération avec écran plus grand et support de 5500+ cryptomonnaies. Design élégant et sécurisé.',
    price: 79000,
    currency: 'CFA',
    category_id: 'wallets',
    brand: 'Ledger',
    stock_quantity: 20,
    images: ['/lovable-uploads/2962c334-a431-4aec-afc8-3057aedfb37f.png'],
    specifications: { 
      connectivity: 'USB-C', 
      screen: 'LCD 128x64',
      coins: '5500+' 
    },
    is_active: true,
    created_at: new Date().toISOString(),
    rating: 4.5,
    reviewCount: 156
  },
  {
    id: '4',
    name: 'Ledger Nano X',
    description: 'Wallet hardware premium avec Bluetooth, écran haute résolution et batterie intégrée. Gérez vos cryptos en déplacement.',
    price: 149000,
    currency: 'CFA',
    category_id: 'wallets',
    brand: 'Ledger',
    stock_quantity: 12,
    images: ['/lovable-uploads/1201a99e-a9d2-4269-8a38-081a3f9ca624.png'],
    specifications: { 
      connectivity: 'USB-C/Bluetooth', 
      screen: 'LCD HD',
      battery: '8h autonomie',
      coins: '5500+' 
    },
    is_active: true,
    created_at: new Date().toISOString(),
    rating: 4.7,
    reviewCount: 203,
    isPopular: true
  },

  // Vêtements & Accessoires Crypto
  {
    id: '5',
    name: 'T-shirt Bitcoin Orange Premium',
    description: 'T-shirt premium 100% coton organique avec logo Bitcoin stylisé en sérigraphie haute qualité. Coupe moderne et confortable.',
    price: 15000,
    currency: 'CFA',
    category_id: 'clothing',
    brand: 'Terex',
    stock_quantity: 50,
    images: ['/lovable-uploads/29969ee7-eb01-43e8-9722-d2aa5b959735.png'],
    specifications: { 
      material: '100% Coton Bio', 
      sizes: 'S, M, L, XL, XXL',
      print: 'Sérigraphie',
      fit: 'Regular' 
    },
    is_active: true,
    created_at: new Date().toISOString(),
    rating: 4.3,
    reviewCount: 45,
    isNew: true
  },
  {
    id: '6',
    name: 'T-shirt Ethereum Noir Élégant',
    description: 'T-shirt élégant avec logo Ethereum brodé premium, coupe moderne slim fit. Parfait pour les meetups crypto.',
    price: 18000,
    currency: 'CFA',
    category_id: 'clothing',
    brand: 'Terex',
    stock_quantity: 40,
    images: ['/lovable-uploads/3e8bdd84-3bdf-49ba-98b7-08e541f8323a.png'],
    specifications: { 
      material: '95% Coton, 5% Elastane', 
      sizes: 'S, M, L, XL, XXL',
      embroidery: 'Logo brodé',
      fit: 'Slim' 
    },
    is_active: true,
    created_at: new Date().toISOString(),
    rating: 4.4,
    reviewCount: 38
  },
  
  // Accessoires de Sécurité
  {
    id: '7',
    name: 'CryptoSteel Cassette Premium',
    description: 'Carte en acier inoxydable 316L pour sauvegarder vos phrases de récupération. Résistant au feu, eau, corrosion et chocs.',
    price: 35000,
    currency: 'CFA',
    category_id: 'accessories',
    brand: 'CryptoSteel',
    stock_quantity: 30,
    images: ['/lovable-uploads/2deedbc3-65e1-4e12-85a2-301f882eaafb.png'],
    specifications: { 
      material: 'Acier inoxydable 316L', 
      resistance: 'Feu 1200°C, Eau, Chocs',
      words: '24 mots max',
      warranty: '25 ans' 
    },
    is_active: true,
    created_at: new Date().toISOString(),
    rating: 4.9,
    reviewCount: 67,
    isPopular: true
  },

  // Formations & Éducation
  {
    id: '8',
    name: 'Formation Crypto Complète Pro',
    description: 'Cours en ligne complet sur la cryptomonnaie, blockchain et DeFi. 25h de contenu vidéo HD + supports PDF + certificat.',
    price: 89000,
    currency: 'CFA',
    category_id: 'training',
    brand: 'Terex Academy',
    stock_quantity: 100,
    images: ['/lovable-uploads/26b3437e-c333-4387-aeb9-731aa705f282.png'],
    specifications: { 
      duration: '25 heures', 
      language: 'Français',
      access: 'À vie',
      certificate: 'Inclus',
      support: 'Forum privé' 
    },
    is_active: true,
    created_at: new Date().toISOString(),
    rating: 4.8,
    reviewCount: 234,
    isPopular: true
  },

  // Nouveaux Produits - Équipement Mining
  {
    id: '9',
    name: 'Antminer S19 Pro 110TH/s',
    description: 'Mineur ASIC Bitcoin professionnel haute performance. Efficacité énergétique optimale pour mining rentable.',
    price: 1200000,
    currency: 'CFA',
    category_id: 'mining',
    brand: 'Bitmain',
    stock_quantity: 5,
    images: ['https://images.unsplash.com/photo-1639322537228-f710d846310a?w=400'],
    specifications: { 
      hashrate: '110 TH/s', 
      power: '3250W',
      efficiency: '29.5 J/TH',
      noise: '75dB' 
    },
    is_active: true,
    created_at: new Date().toISOString(),
    rating: 4.6,
    reviewCount: 23
  },
  {
    id: '10',
    name: 'Whatsminer M30S++ 112TH/s',
    description: 'Mineur Bitcoin haute performance avec refroidissement avancé. Idéal pour fermes de mining professionnelles.',
    price: 1100000,
    currency: 'CFA',
    category_id: 'mining',
    brand: 'MicroBT',
    stock_quantity: 3,
    images: ['https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=400'],
    specifications: { 
      hashrate: '112 TH/s', 
      power: '3472W',
      efficiency: '31 J/TH',
      cooling: 'Ventilation optimisée' 
    },
    is_active: true,
    created_at: new Date().toISOString(),
    rating: 4.4,
    reviewCount: 18
  },

  // Livres & Guides
  {
    id: '11',
    name: 'The Bitcoin Standard - Français',
    description: 'Le livre de référence sur Bitcoin par Saifedean Ammous. Comprendre l\'économie du Bitcoin et son impact sur la société.',
    price: 25000,
    currency: 'CFA',
    category_id: 'books',
    brand: 'Éditions Crypto',
    stock_quantity: 45,
    images: ['https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400'],
    specifications: { 
      pages: '320 pages', 
      language: 'Français',
      format: 'Broché 15x23cm',
      author: 'Saifedean Ammous' 
    },
    is_active: true,
    created_at: new Date().toISOString(),
    rating: 4.7,
    reviewCount: 89,
    isNew: true
  },
  {
    id: '12',
    name: 'Guide Pratique DeFi 2024',
    description: 'Guide complet de la finance décentralisée. Stratégies, protocols, yield farming et gestion des risques expliqués simplement.',
    price: 22000,
    currency: 'CFA',
    category_id: 'books',
    brand: 'Terex Éditions',
    stock_quantity: 35,
    images: ['https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400'],
    specifications: { 
      pages: '280 pages', 
      language: 'Français',
      format: 'Broché + PDF',
      edition: '2024' 
    },
    is_active: true,
    created_at: new Date().toISOString(),
    rating: 4.5,
    reviewCount: 56
  },

  // Staking & Nodes
  {
    id: '13',
    name: 'Raspberry Pi 4 Nœud Bitcoin',
    description: 'Kit complet pour créer votre nœud Bitcoin personnel. Raspberry Pi 4 8GB + SSD 1TB + boîtier + installation.',
    price: 185000,
    currency: 'CFA',
    category_id: 'staking',
    brand: 'Raspberry Pi',
    stock_quantity: 12,
    images: ['https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400'],
    specifications: { 
      ram: '8GB', 
      storage: 'SSD 1TB',
      setup: 'Pré-configuré',
      sync: 'Blockchain complète' 
    },
    is_active: true,
    created_at: new Date().toISOString(),
    rating: 4.6,
    reviewCount: 34
  },
  {
    id: '14',
    name: 'DAppNode Mini Server',
    description: 'Serveur personnel pour héberger vos applications décentralisées et nœuds blockchain. Interface web intuitive.',
    price: 450000,
    currency: 'CFA',
    category_id: 'staking',
    brand: 'DAppNode',
    stock_quantity: 8,
    images: ['https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400'],
    specifications: { 
      cpu: 'Intel i5', 
      ram: '16GB DDR4',
      storage: 'SSD 2TB NVMe',
      os: 'DAppNode OS' 
    },
    is_active: true,
    created_at: new Date().toISOString(),
    rating: 4.8,
    reviewCount: 19
  },

  // Accessoires supplémentaires
  {
    id: '15',
    name: 'YubiKey 5C NFC',
    description: 'Clé de sécurité physique pour authentification 2FA. Compatible USB-C et NFC. Sécurisez vos comptes crypto.',
    price: 45000,
    currency: 'CFA',
    category_id: 'accessories',
    brand: 'Yubico',
    stock_quantity: 28,
    images: ['https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400'],
    specifications: { 
      connector: 'USB-C + NFC', 
      protocols: 'FIDO2, U2F, OTP',
      compatibility: 'Windows, Mac, Linux, Mobile',
      waterproof: 'IP68' 
    },
    is_active: true,
    created_at: new Date().toISOString(),
    rating: 4.7,
    reviewCount: 92
  },
  {
    id: '16',
    name: 'Casque Crypto Gaming RGB',
    description: 'Casque gaming avec éclairage RGB personnalisable et logos crypto. Audio haute définition pour gamers et traders.',
    price: 65000,
    currency: 'CFA',
    category_id: 'accessories',
    brand: 'CryptoGear',
    stock_quantity: 22,
    images: ['https://images.unsplash.com/photo-1599669454699-248893623440?w=400'],
    specifications: { 
      audio: '7.1 Surround', 
      microphone: 'Antibruit',
      lighting: 'RGB 16M couleurs',
      comfort: 'Coussinets mémoire' 
    },
    is_active: true,
    created_at: new Date().toISOString(),
    rating: 4.2,
    reviewCount: 67
  },

  // Nouveaux vêtements
  {
    id: '17',
    name: 'Hoodie Bitcoin Lightning',
    description: 'Sweat à capuche premium avec logo Lightning Network brodé. Matière ultra-douce et coupe streetwear moderne.',
    price: 45000,
    currency: 'CFA',
    category_id: 'clothing',
    brand: 'Terex',
    stock_quantity: 30,
    images: ['https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400'],
    specifications: { 
      material: '80% Coton, 20% Polyester', 
      sizes: 'S, M, L, XL, XXL',
      features: 'Capuche doublée, Poche kangourou',
      care: 'Lavage 30°C' 
    },
    is_active: true,
    created_at: new Date().toISOString(),
    rating: 4.6,
    reviewCount: 73,
    isNew: true
  },
  {
    id: '18',
    name: 'Casquette Solana Violette',
    description: 'Casquette snapback officielle Solana avec broderie premium. Design moderne aux couleurs de l\'écosystème Solana.',
    price: 28000,
    currency: 'CFA',
    category_id: 'clothing',
    brand: 'Solana Labs',
    stock_quantity: 40,
    images: ['https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=400'],
    specifications: { 
      material: '100% Coton', 
      closure: 'Snapback ajustable',
      embroidery: 'Logo Solana brodé',
      style: 'Flat brim' 
    },
    is_active: true,
    created_at: new Date().toISOString(),
    rating: 4.3,
    reviewCount: 51
  },

  // Plus de formations
  {
    id: '19',
    name: 'Trading Crypto Avancé - Masterclass',
    description: 'Formation complète de trading crypto : analyse technique, psychologie, gestion des risques. Par des traders professionnels.',
    price: 125000,
    currency: 'CFA',
    category_id: 'training',
    brand: 'CryptoTrading Pro',
    stock_quantity: 50,
    images: ['https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400'],
    specifications: { 
      duration: '40 heures', 
      level: 'Intermédiaire à Avancé',
      includes: 'Stratégies + Outils + Communauté privée',
      mentor: 'Suivi personnalisé 3 mois' 
    },
    is_active: true,
    created_at: new Date().toISOString(),
    rating: 4.9,
    reviewCount: 145,
    isPopular: true
  },
  {
    id: '20',
    name: 'NFT Creation Workshop',
    description: 'Atelier complet pour créer et vendre vos NFTs. De la création artistique au listing sur les marketplaces.',
    price: 75000,
    currency: 'CFA',
    category_id: 'training',
    brand: 'NFT Academy',
    stock_quantity: 60,
    images: ['https://images.unsplash.com/photo-1620321023374-d1a68fbc720d?w=400'],
    specifications: { 
      duration: '15 heures', 
      includes: 'Logiciels + Templates + Marketplace setup',
      bonus: 'Collection exclusive offerte',
      support: 'Discord communauté' 
    },
    is_active: true,
    created_at: new Date().toISOString(),
    rating: 4.4,
    reviewCount: 78,
    isNew: true
  }
];

const defaultCategories: Category[] = [
  { 
    id: 'wallets', 
    name: 'Wallets Hardware', 
    description: 'Portefeuilles physiques sécurisés',
    productCount: 4
  },
  { 
    id: 'clothing', 
    name: 'Vêtements Crypto', 
    description: 'T-shirts, hoodies et accessoires Bitcoin/Crypto',
    productCount: 4
  },
  { 
    id: 'accessories', 
    name: 'Accessoires', 
    description: 'Cartes de sauvegarde et gadgets crypto',
    productCount: 4
  },
  { 
    id: 'training', 
    name: 'Formations', 
    description: 'Cours et guides crypto professionnels',
    productCount: 4
  },
  { 
    id: 'mining', 
    name: 'Mining', 
    description: 'Équipement de minage Bitcoin et crypto',
    productCount: 2
  },
  { 
    id: 'books', 
    name: 'Livres', 
    description: 'Littérature crypto et blockchain',
    productCount: 2
  },
  { 
    id: 'staking', 
    name: 'Staking & Nodes', 
    description: 'Équipement pour nœuds et staking',
    productCount: 2
  }
];

export const useMarketplace = () => {
  const [products, setProducts] = useState<Product[]>(defaultProducts);
  const [categories, setCategories] = useState<Category[]>(defaultCategories);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [wishlistItems, setWishlistItems] = useState<string[]>([]);
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

  // Nouvelle fonction pour la wishlist
  const toggleWishlist = async (productId: string) => {
    const isCurrentlyInWishlist = wishlistItems.includes(productId);
    
    if (isCurrentlyInWishlist) {
      setWishlistItems(prev => prev.filter(id => id !== productId));
    } else {
      setWishlistItems(prev => [...prev, productId]);
    }

    // Sauvegarder dans localStorage
    const updatedWishlist = isCurrentlyInWishlist 
      ? wishlistItems.filter(id => id !== productId)
      : [...wishlistItems, productId];
    
    localStorage.setItem('terex_wishlist', JSON.stringify(updatedWishlist));
  };

  // Charger la wishlist depuis localStorage
  useEffect(() => {
    const savedWishlist = localStorage.getItem('terex_wishlist');
    if (savedWishlist) {
      setWishlistItems(JSON.parse(savedWishlist));
    }
  }, []);

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
    wishlistItems,
    loading,
    fetchProducts,
    fetchCategories,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    toggleWishlist,
  };
};
