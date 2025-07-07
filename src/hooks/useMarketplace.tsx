
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

// Données de produits étendues avec des images Unsplash fonctionnelles
const defaultProducts: Product[] = [
  // Hardware Wallets
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
      'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400&h=400&fit=crop'
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
      'https://images.unsplash.com/photo-1605792657660-596af9009e82?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400&h=400&fit=crop'
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
      'https://images.unsplash.com/photo-1620321023374-d1a68fbc720d?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=400&h=400&fit=crop'
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
    images: ['https://images.unsplash.com/photo-1639322537504-6427a16b0a28?w=400&h=400&fit=crop'],
    specifications: { connectivity: 'USB-C/Bluetooth', screen: 'LCD HD' },
    is_active: true,
    created_at: new Date().toISOString()
  },
  {
    id: '5',
    name: 'Ledger Nano S Plus',
    description: 'Version améliorée du Nano S avec plus de stockage et écran plus grand',
    price: 89000,
    currency: 'CFA',
    category_id: 'wallets',
    brand: 'Ledger',
    stock_quantity: 20,
    images: ['https://images.unsplash.com/photo-1605792657660-596af9009e82?w=400&h=400&fit=crop'],
    specifications: { connectivity: 'USB-C', screen: 'OLED 128x64' },
    is_active: true,
    created_at: new Date().toISOString()
  },
  {
    id: '6',
    name: 'SafePal S1',
    description: 'Wallet hardware sans fil avec écran couleur et caméra pour QR codes',
    price: 65000,
    currency: 'CFA',
    category_id: 'wallets',
    brand: 'SafePal',
    stock_quantity: 18,
    images: ['https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&h=400&fit=crop'],
    specifications: { connectivity: 'Sans fil', screen: 'Couleur tactile', camera: 'QR Scanner' },
    is_active: true,
    created_at: new Date().toISOString()
  },

  // Vêtements et Merchandising
  {
    id: '7',
    name: 'T-shirt Bitcoin Orange',
    description: 'T-shirt premium 100% coton avec logo Bitcoin stylisé',
    price: 15000,
    currency: 'CFA',
    category_id: 'clothing',
    brand: 'Terex',
    stock_quantity: 50,
    images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop'],
    specifications: { material: '100% Coton', sizes: 'S, M, L, XL' },
    is_active: true,
    created_at: new Date().toISOString()
  },
  {
    id: '8',
    name: 'T-shirt Ethereum Noir',
    description: 'T-shirt élégant avec logo Ethereum brodé, coupe moderne',
    price: 18000,
    currency: 'CFA',
    category_id: 'clothing',
    brand: 'Terex',
    stock_quantity: 40,
    images: ['https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=400&h=400&fit=crop'],
    specifications: { material: '100% Coton', sizes: 'S, M, L, XL, XXL' },
    is_active: true,
    created_at: new Date().toISOString()
  },
  {
    id: '9',
    name: 'Hoodie "HODL" Premium',
    description: 'Sweat à capuche confortable avec broderie "HODL" et logo crypto discret',
    price: 35000,
    currency: 'CFA',
    category_id: 'clothing',
    brand: 'Terex',
    stock_quantity: 25,
    images: ['https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=400&fit=crop'],
    specifications: { material: '80% Coton 20% Polyester', sizes: 'S, M, L, XL, XXL' },
    is_active: true,
    created_at: new Date().toISOString()
  },
  {
    id: '10',
    name: 'Casquette Bitcoin Snapback',
    description: 'Casquette ajustable avec logo Bitcoin brodé, style urbain',
    price: 12000,
    currency: 'CFA',
    category_id: 'clothing',
    brand: 'Terex',
    stock_quantity: 35,
    images: ['https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=400&h=400&fit=crop'],
    specifications: { material: 'Coton/Polyester', adjustment: 'Snapback' },
    is_active: true,
    created_at: new Date().toISOString()
  },
  {
    id: '11',
    name: 'Mug "Crypto Trader"',
    description: 'Mug en céramique de qualité avec designs crypto inspirants',
    price: 8500,
    currency: 'CFA',
    category_id: 'clothing',
    brand: 'Terex',
    stock_quantity: 60,
    images: ['https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400&h=400&fit=crop'],
    specifications: { material: 'Céramique', capacity: '350ml', design: 'Double face' },
    is_active: true,
    created_at: new Date().toISOString()
  },

  // Accessoires et Sécurité
  {
    id: '12',
    name: 'Carte Crypto Steel',
    description: 'Carte en acier inoxydable pour sauvegarder vos phrases de récupération',
    price: 35000,
    currency: 'CFA',
    category_id: 'accessories',
    brand: 'CryptoSteel',
    stock_quantity: 30,
    images: ['https://images.unsplash.com/photo-1617957848587-01062d2bb7b1?w=400&h=400&fit=crop'],
    specifications: { material: 'Acier inoxydable', resistance: 'Feu/Eau' },
    is_active: true,
    created_at: new Date().toISOString()
  },
  {
    id: '13',
    name: 'Kit de Gravure Seed Phrase',
    description: 'Kit complet pour graver vos phrases de récupération sur métal',
    price: 25000,
    currency: 'CFA',
    category_id: 'accessories',
    brand: 'SecureStamp',
    stock_quantity: 45,
    images: ['https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=400&fit=crop'],
    specifications: { includes: 'Plaques métal + Poinçons + Guide', material: 'Acier inoxydable' },
    is_active: true,
    created_at: new Date().toISOString()
  },
  {
    id: '14',
    name: 'Clé USB Cryptée 32GB',
    description: 'Clé USB avec chiffrement matériel pour stockage sécurisé',
    price: 45000,
    currency: 'CFA',
    category_id: 'accessories',
    brand: 'SecureUSB',
    stock_quantity: 22,
    images: ['https://images.unsplash.com/photo-1586816001966-79b736744398?w=400&h=400&fit=crop'],
    specifications: { capacity: '32GB', encryption: 'AES-256', connector: 'USB 3.0' },
    is_active: true,
    created_at: new Date().toISOString()
  },
  {
    id: '15',
    name: 'Pochette Anti-RFID',
    description: 'Pochette de protection RFID pour cartes et wallets hardware',
    price: 15000,
    currency: 'CFA',
    category_id: 'accessories',
    brand: 'BlockWave',
    stock_quantity: 55,
    images: ['https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop'],
    specifications: { material: 'Tissu blindé', protection: 'RFID/NFC', size: 'Multiple slots' },
    is_active: true,
    created_at: new Date().toISOString()
  },

  // Formations et Éducation
  {
    id: '16',
    name: 'Formation Crypto Complète',
    description: 'Cours en ligne complet sur la cryptomonnaie et la blockchain (accès à vie)',
    price: 89000,
    currency: 'CFA',
    category_id: 'training',
    brand: 'Terex Academy',
    stock_quantity: 100,
    images: ['https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=400&fit=crop'],
    specifications: { duration: '20 heures', language: 'Français', access: 'À vie' },
    is_active: true,
    created_at: new Date().toISOString()
  },
  {
    id: '17',
    name: 'Guide Trading DeFi Avancé',
    description: 'Formation spécialisée sur le trading DeFi et les stratégies yield farming',
    price: 65000,
    currency: 'CFA',
    category_id: 'training',
    brand: 'Terex Academy',
    stock_quantity: 100,
    images: ['https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=400&h=400&fit=crop'],
    specifications: { duration: '15 heures', level: 'Avancé', includes: 'Templates Excel' },
    is_active: true,
    created_at: new Date().toISOString()
  },
  {
    id: '18',
    name: 'Masterclass NFT & Métaverse',
    description: 'Formation complète sur les NFT, création, trading et opportunités métaverse',
    price: 45000,
    currency: 'CFA',
    category_id: 'training',
    brand: 'Terex Academy',
    stock_quantity: 100,
    images: ['https://images.unsplash.com/photo-1617791160536-598cf32026fb?w=400&h=400&fit=crop'],
    specifications: { duration: '12 heures', includes: 'Outils création NFT', bonus: 'Templates' },
    is_active: true,
    created_at: new Date().toISOString()
  },
  {
    id: '19',
    name: 'eBook: Fiscalité Crypto 2024',
    description: 'Guide complet sur la fiscalité des cryptomonnaies en Afrique',
    price: 25000,
    currency: 'CFA',
    category_id: 'training',
    brand: 'Terex Legal',
    stock_quantity: 500,
    images: ['https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop'],
    specifications: { format: 'PDF', pages: '150+', updates: 'Annuelles', language: 'Français' },
    is_active: true,
    created_at: new Date().toISOString()
  },

  // Mining et Équipements
  {
    id: '20',
    name: 'ASIC Miner Antminer S19',
    description: 'Mineur Bitcoin professionnel haute performance 95TH/s',
    price: 1250000,
    currency: 'CFA',
    category_id: 'mining',
    brand: 'Bitmain',
    stock_quantity: 5,
    images: ['https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&h=400&fit=crop'],
    specifications: { hashrate: '95 TH/s', power: '3250W', efficiency: '34.2 J/TH' },
    is_active: true,
    created_at: new Date().toISOString()
  },
  {
    id: '21',
    name: 'GPU RTX 4070 Mining Rig',
    description: 'Carte graphique optimisée pour le mining Ethereum et altcoins',
    price: 850000,
    currency: 'CFA',
    category_id: 'mining',
    brand: 'NVIDIA',
    stock_quantity: 8,
    images: ['https://images.unsplash.com/photo-1591488320449-011701bb6704?w=400&h=400&fit=crop'],
    specifications: { memory: '12GB GDDR6X', hashrate: '62 MH/s ETH', power: '200W' },
    is_active: true,
    created_at: new Date().toISOString()
  },
  {
    id: '22',
    name: 'Helium Hotspot Miner',
    description: 'Mineur IoT pour le réseau Helium, gagner des HNT en fournissant une couverture',
    price: 295000,
    currency: 'CFA',
    category_id: 'mining',
    brand: 'Bobcat',
    stock_quantity: 12,
    images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop'],
    specifications: { network: 'LoRaWAN', frequency: '868MHz', range: '15km', earnings: 'HNT' },
    is_active: true,
    created_at: new Date().toISOString()
  },

  // Livres et Ressources
  {
    id: '23',
    name: 'Livre: "Bitcoin Standard" FR',
    description: 'Traduction française du livre de référence sur Bitcoin par Saifedean Ammous',
    price: 35000,
    currency: 'CFA',
    category_id: 'books',
    brand: 'Terex Éditions',
    stock_quantity: 75,
    images: ['https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=400&fit=crop'],
    specifications: { pages: '320', format: 'Papier', language: 'Français', edition: '2024' },
    is_active: true,
    created_at: new Date().toISOString()
  },
  {
    id: '24',
    name: 'Collection: Top 100 Crypto',
    description: 'Guide détaillé des 100 meilleures cryptomonnaies avec analyses techniques',
    price: 55000,
    currency: 'CFA',
    category_id: 'books',
    brand: 'Crypto Analytics',
    stock_quantity: 40,
    images: ['https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=400&fit=crop'],
    specifications: { format: 'Livre + PDF', pages: '450', updates: 'Trimestrielles' },
    is_active: true,
    created_at: new Date().toISOString()
  }
];

const defaultCategories: Category[] = [
  { id: 'wallets', name: 'Wallets Hardware', description: 'Portefeuilles physiques sécurisés' },
  { id: 'clothing', name: 'Vêtements & Goodies', description: 'T-shirts, hoodies et accessoires crypto' },
  { id: 'accessories', name: 'Accessoires Sécurité', description: 'Outils de sauvegarde et protection' },
  { id: 'training', name: 'Formations', description: 'Cours et guides crypto' },
  { id: 'mining', name: 'Mining & Hardware', description: 'Équipements de minage crypto' },
  { id: 'books', name: 'Livres & Ressources', description: 'Littérature et guides crypto' }
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
