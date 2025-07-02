
-- Créer la table des catégories de produits
CREATE TABLE public.product_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Créer la table des produits
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'CFA',
  category_id UUID REFERENCES public.product_categories(id),
  brand TEXT,
  stock_quantity INTEGER NOT NULL DEFAULT 0,
  images TEXT[] DEFAULT '{}',
  specifications JSONB,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Créer la table du panier
CREATE TABLE public.cart_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, product_id)
);

-- Créer la table des commandes marketplace
CREATE TABLE public.marketplace_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'CFA',
  status TEXT NOT NULL DEFAULT 'pending',
  shipping_address JSONB,
  payment_method TEXT,
  payment_reference TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Créer la table des items de commande
CREATE TABLE public.marketplace_order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES public.marketplace_orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id),
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Activer RLS sur toutes les tables
ALTER TABLE public.product_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketplace_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketplace_order_items ENABLE ROW LEVEL SECURITY;

-- Politiques pour les catégories (lecture publique)
CREATE POLICY "Anyone can view product categories" ON public.product_categories
  FOR SELECT USING (true);

-- Politiques pour les produits (lecture publique, admin peut tout)
CREATE POLICY "Anyone can view active products" ON public.products
  FOR SELECT USING (is_active = true OR has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage products" ON public.products
  FOR ALL USING (has_role(auth.uid(), 'admin'));

-- Politiques pour le panier (utilisateurs peuvent gérer leur panier)
CREATE POLICY "Users can manage their cart" ON public.cart_items
  FOR ALL USING (auth.uid() = user_id);

-- Politiques pour les commandes (utilisateurs voient leurs commandes, admins voient tout)
CREATE POLICY "Users can view their orders" ON public.marketplace_orders
  FOR SELECT USING (auth.uid() = user_id OR has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can create their orders" ON public.marketplace_orders
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can update orders" ON public.marketplace_orders
  FOR UPDATE USING (has_role(auth.uid(), 'admin'));

-- Politiques pour les items de commande
CREATE POLICY "Users can view their order items" ON public.marketplace_order_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.marketplace_orders 
      WHERE id = order_id AND (user_id = auth.uid() OR has_role(auth.uid(), 'admin'))
    )
  );

CREATE POLICY "Service can insert order items" ON public.marketplace_order_items
  FOR INSERT WITH CHECK (true);

-- Insérer quelques catégories par défaut
INSERT INTO public.product_categories (name, description) VALUES
  ('Hardware Wallets', 'Portefeuilles matériels pour sécuriser vos cryptomonnaies'),
  ('Accessoires Crypto', 'Accessoires et gadgets pour les cryptomonnaies'),
  ('Formations', 'Guides et formations sur les cryptomonnaies'),
  ('Cartes Crypto', 'Cartes de débit et crédit crypto');

-- Insérer quelques produits d'exemple
INSERT INTO public.products (name, description, price, category_id, brand, stock_quantity, images, specifications) VALUES
  (
    'Ledger Nano X',
    'Portefeuille matériel Bluetooth avec écran pour gérer plus de 5500 cryptomonnaies',
    75000,
    (SELECT id FROM public.product_categories WHERE name = 'Hardware Wallets'),
    'Ledger',
    25,
    ARRAY['/marketplace/ledger-nano-x.jpg'],
    '{"connectivity": "Bluetooth + USB-C", "cryptocurrencies": "5500+", "screen": "128x64 pixels", "battery": "100 mAh"}'::jsonb
  ),
  (
    'Trezor Model T',
    'Portefeuille matériel avec écran tactile couleur et support complet des cryptomonnaies',
    95000,
    (SELECT id FROM public.product_categories WHERE name = 'Hardware Wallets'),
    'Trezor',
    15,
    ARRAY['/marketplace/trezor-model-t.jpg'],
    '{"connectivity": "USB-C", "screen": "Tactile couleur 240x240", "cryptocurrencies": "1600+", "features": "Écran tactile"}'::jsonb
  ),
  (
    'Guide Complet Crypto 2024',
    'Formation complète sur les cryptomonnaies, DeFi et trading pour débutants et avancés',
    15000,
    (SELECT id FROM public.product_categories WHERE name = 'Formations'),
    'Terex Academy',
    999,
    ARRAY['/marketplace/crypto-guide.jpg'],
    '{"format": "PDF + Vidéos", "pages": "200+", "duration": "10 heures", "level": "Débutant à Avancé"}'::jsonb
  );
