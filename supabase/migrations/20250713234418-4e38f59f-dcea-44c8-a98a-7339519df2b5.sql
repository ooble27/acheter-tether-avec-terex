
-- Créer la table des catégories de blog
CREATE TABLE public.blog_categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  color TEXT DEFAULT '#3B968F',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Créer la table des tags de blog
CREATE TABLE public.blog_tags (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Créer la table des articles de blog
CREATE TABLE public.blog_posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT,
  content TEXT NOT NULL,
  featured_image TEXT,
  author_name TEXT NOT NULL DEFAULT 'Équipe Terex',
  author_avatar TEXT,
  author_bio TEXT,
  category_id UUID REFERENCES public.blog_categories(id),
  is_published BOOLEAN NOT NULL DEFAULT false,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  reading_time INTEGER DEFAULT 5,
  views_count INTEGER DEFAULT 0,
  likes_count INTEGER DEFAULT 0,
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  meta_title TEXT,
  meta_description TEXT,
  meta_keywords TEXT
);

-- Table de liaison pour les tags des articles
CREATE TABLE public.blog_post_tags (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES public.blog_posts(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES public.blog_tags(id) ON DELETE CASCADE,
  UNIQUE(post_id, tag_id)
);

-- Créer la table des commentaires
CREATE TABLE public.blog_comments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES public.blog_posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  author_name TEXT NOT NULL,
  author_email TEXT NOT NULL,
  content TEXT NOT NULL,
  is_approved BOOLEAN NOT NULL DEFAULT false,
  parent_id UUID REFERENCES public.blog_comments(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Créer la table des abonnements newsletter
CREATE TABLE public.blog_subscriptions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  is_active BOOLEAN NOT NULL DEFAULT true,
  subscribed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  unsubscribed_at TIMESTAMP WITH TIME ZONE
);

-- Activer RLS sur toutes les tables
ALTER TABLE public.blog_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_post_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_subscriptions ENABLE ROW LEVEL SECURITY;

-- Policies pour les catégories (publiques en lecture)
CREATE POLICY "Anyone can view blog categories" ON public.blog_categories FOR SELECT USING (true);
CREATE POLICY "Admins can manage blog categories" ON public.blog_categories FOR ALL USING (has_role(auth.uid(), 'admin'::user_role));

-- Policies pour les tags (publiques en lecture)
CREATE POLICY "Anyone can view blog tags" ON public.blog_tags FOR SELECT USING (true);
CREATE POLICY "Admins can manage blog tags" ON public.blog_tags FOR ALL USING (has_role(auth.uid(), 'admin'::user_role));

-- Policies pour les articles (publiques en lecture si publiés)
CREATE POLICY "Anyone can view published blog posts" ON public.blog_posts FOR SELECT USING (is_published = true);
CREATE POLICY "Admins can manage blog posts" ON public.blog_posts FOR ALL USING (has_role(auth.uid(), 'admin'::user_role));

-- Policies pour les tags des articles
CREATE POLICY "Anyone can view blog post tags" ON public.blog_post_tags FOR SELECT USING (true);
CREATE POLICY "Admins can manage blog post tags" ON public.blog_post_tags FOR ALL USING (has_role(auth.uid(), 'admin'::user_role));

-- Policies pour les commentaires
CREATE POLICY "Anyone can view approved comments" ON public.blog_comments FOR SELECT USING (is_approved = true);
CREATE POLICY "Users can create comments" ON public.blog_comments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own comments" ON public.blog_comments FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage all comments" ON public.blog_comments FOR ALL USING (has_role(auth.uid(), 'admin'::user_role));

-- Policies pour les abonnements newsletter
CREATE POLICY "Anyone can subscribe to newsletter" ON public.blog_subscriptions FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can view their own subscription" ON public.blog_subscriptions FOR SELECT USING (auth.uid() = user_id OR email = auth.email());
CREATE POLICY "Users can update their own subscription" ON public.blog_subscriptions FOR UPDATE USING (auth.uid() = user_id OR email = auth.email());
CREATE POLICY "Admins can manage subscriptions" ON public.blog_subscriptions FOR ALL USING (has_role(auth.uid(), 'admin'::user_role));

-- Insérer des catégories par défaut
INSERT INTO public.blog_categories (name, slug, description, color) VALUES
('Guides', 'guides', 'Guides complets pour débuter et approfondir vos connaissances', '#3B968F'),
('Actualités', 'actualites', 'Les dernières nouvelles du monde de la crypto et blockchain', '#2563EB'),
('Analyses', 'analyses', 'Analyses techniques et fondamentales des marchés', '#DC2626'),
('Tutoriels', 'tutoriels', 'Tutoriels pas à pas pour utiliser nos services', '#7C3AED'),
('Éducation', 'education', 'Articles éducatifs sur la blockchain et les cryptomonnaies', '#059669'),
('Sécurité', 'securite', 'Conseils et bonnes pratiques de sécurité', '#EA580C');

-- Insérer des tags par défaut
INSERT INTO public.blog_tags (name, slug) VALUES
('Bitcoin', 'bitcoin'),
('Ethereum', 'ethereum'),
('USDT', 'usdt'),
('Blockchain', 'blockchain'),
('DeFi', 'defi'),
('Trading', 'trading'),
('Sécurité', 'securite'),
('Débutant', 'debutant'),
('Avancé', 'avance'),
('Afrique', 'afrique'),
('Mobile Money', 'mobile-money'),
('Portefeuille', 'portefeuille');

-- Insérer des articles de démonstration
INSERT INTO public.blog_posts (title, slug, excerpt, content, author_name, author_bio, category_id, is_published, is_featured, reading_time, views_count, likes_count, published_at, meta_title, meta_description) VALUES
(
  'Guide Complet : Comment Acheter du Bitcoin en Afrique',
  'guide-acheter-bitcoin-afrique',
  'Découvrez comment acheter facilement du Bitcoin en Afrique avec les méthodes de paiement locales comme Mobile Money.',
  '<h2>Introduction au Bitcoin en Afrique</h2><p>Le Bitcoin révolutionne les transactions financières en Afrique. Dans ce guide complet, nous vous expliquons comment acheter facilement du Bitcoin en utilisant les méthodes de paiement locales.</p><h2>Méthodes de Paiement Disponibles</h2><p>En Afrique, plusieurs options s''offrent à vous :</p><ul><li>Mobile Money (Orange Money, MTN Mobile Money)</li><li>Virements bancaires</li><li>Cartes bancaires</li></ul><h2>Étapes pour Acheter du Bitcoin</h2><ol><li>Créez votre compte sur Terex</li><li>Vérifiez votre identité (KYC)</li><li>Choisissez votre méthode de paiement</li><li>Confirmez votre achat</li></ol><p>Avec Terex, l''achat de Bitcoin devient simple et sécurisé pour tous les utilisateurs africains.</p>',
  'Sarah Kouame',
  'Experte en cryptomonnaies et blockchain, Sarah aide les utilisateurs africains à naviguer dans l''écosystème crypto.',
  (SELECT id FROM public.blog_categories WHERE slug = 'guides'),
  true,
  true,
  8,
  1250,
  89,
  now() - interval '2 days',
  'Guide Complet : Acheter du Bitcoin en Afrique | Terex',
  'Découvrez comment acheter facilement du Bitcoin en Afrique avec Mobile Money, virements bancaires et plus. Guide complet et sécurisé.'
),
(
  'USDT vs Bitcoin : Quelle Cryptomonnaie Choisir ?',
  'usdt-vs-bitcoin-quelle-crypto-choisir',
  'Analyse comparative entre USDT et Bitcoin pour vous aider à faire le meilleur choix selon vos objectifs d''investissement.',
  '<h2>Comprendre les Différences</h2><p>USDT et Bitcoin sont deux cryptomonnaies avec des caractéristiques très différentes. Voici une analyse détaillée pour vous aider à choisir.</p><h2>Le Bitcoin : L''Or Numérique</h2><p>Le Bitcoin est considéré comme une réserve de valeur digitale :</p><ul><li>Volatilité élevée</li><li>Potentiel de croissance important</li><li>Adoption institutionnelle croissante</li></ul><h2>USDT : La Stabilité</h2><p>USDT (Tether) est une stablecoin liée au dollar américain :</p><ul><li>Prix stable autour de 1 USD</li><li>Idéal pour les transactions</li><li>Protection contre la volatilité</li></ul><h2>Notre Recommandation</h2><p>Pour débuter, commencez avec USDT pour vous familiariser, puis diversifiez progressivement vers Bitcoin selon votre profil de risque.</p>',
  'Mohamed Diallo',
  'Analyste financier spécialisé dans les cryptomonnaies avec 5 ans d''expérience sur les marchés africains.',
  (SELECT id FROM public.blog_categories WHERE slug = 'analyses'),
  true,
  true,
  6,
  890,
  67,
  now() - interval '5 days',
  'USDT vs Bitcoin : Comparaison et Guide de Choix | Terex',
  'Comparaison détaillée entre USDT et Bitcoin. Découvrez quelle cryptomonnaie choisir selon vos objectifs d''investissement.'
),
(
  'Sécurité Crypto : 10 Règles d''Or à Suivre',
  'securite-crypto-10-regles-or',
  'Protégez vos cryptomonnaies avec ces 10 règles de sécurité essentielles. Guide complet pour éviter les piratages et arnaques.',
  '<h2>La Sécurité Avant Tout</h2><p>La sécurité de vos cryptomonnaies est primordiale. Voici 10 règles essentielles à suivre absolument.</p><h2>1. Utilisez l''Authentification à Deux Facteurs</h2><p>Activez toujours la 2FA sur tous vos comptes crypto.</p><h2>2. Ne Partagez Jamais Vos Clés Privées</h2><p>Vos clés privées sont comme votre mot de passe bancaire : gardez-les secrètes.</p><h2>3. Méfiez-vous des Emails de Phishing</h2><p>Vérifiez toujours l''URL avant de saisir vos identifiants.</p><h2>4. Utilisez des Réseaux Sécurisés</h2><p>Évitez les WiFi publics pour vos transactions crypto.</p><h2>5. Gardez Vos Logiciels à Jour</h2><p>Mettez régulièrement à jour vos applications et navigateurs.</p><p>Suivre ces règles vous protégera contre 99% des attaques courantes.</p>',
  'Aminata Ba',
  'Experte en cybersécurité et blockchain, Aminata forme les utilisateurs aux bonnes pratiques de sécurité crypto.',
  (SELECT id FROM public.blog_categories WHERE slug = 'securite'),
  true,
  false,
  7,
  1100,
  95,
  now() - interval '1 week',
  'Sécurité Crypto : 10 Règles d''Or Essentielles | Terex',
  'Protégez vos cryptomonnaies avec ces 10 règles de sécurité. Guide complet pour éviter piratages et arnaques crypto.'
);

-- Associer des tags aux articles
INSERT INTO public.blog_post_tags (post_id, tag_id) VALUES
((SELECT id FROM public.blog_posts WHERE slug = 'guide-acheter-bitcoin-afrique'), (SELECT id FROM public.blog_tags WHERE slug = 'bitcoin')),
((SELECT id FROM public.blog_posts WHERE slug = 'guide-acheter-bitcoin-afrique'), (SELECT id FROM public.blog_tags WHERE slug = 'afrique')),
((SELECT id FROM public.blog_posts WHERE slug = 'guide-acheter-bitcoin-afrique'), (SELECT id FROM public.blog_tags WHERE slug = 'debutant')),
((SELECT id FROM public.blog_posts WHERE slug = 'guide-acheter-bitcoin-afrique'), (SELECT id FROM public.blog_tags WHERE slug = 'mobile-money')),
((SELECT id FROM public.blog_posts WHERE slug = 'usdt-vs-bitcoin-quelle-crypto-choisir'), (SELECT id FROM public.blog_tags WHERE slug = 'bitcoin')),
((SELECT id FROM public.blog_posts WHERE slug = 'usdt-vs-bitcoin-quelle-crypto-choisir'), (SELECT id FROM public.blog_tags WHERE slug = 'usdt')),
((SELECT id FROM public.blog_posts WHERE slug = 'usdt-vs-bitcoin-quelle-crypto-choisir'), (SELECT id FROM public.blog_tags WHERE slug = 'trading')),
((SELECT id FROM public.blog_posts WHERE slug = 'securite-crypto-10-regles-or'), (SELECT id FROM public.blog_tags WHERE slug = 'securite')),
((SELECT id FROM public.blog_posts WHERE slug = 'securite-crypto-10-regles-or'), (SELECT id FROM public.blog_tags WHERE slug = 'debutant')),
((SELECT id FROM public.blog_posts WHERE slug = 'securite-crypto-10-regles-or'), (SELECT id FROM public.blog_tags WHERE slug = 'portefeuille'));

-- Trigger pour mettre à jour updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Appliquer le trigger aux tables concernées
CREATE TRIGGER update_blog_categories_updated_at BEFORE UPDATE ON public.blog_categories FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();
CREATE TRIGGER update_blog_posts_updated_at BEFORE UPDATE ON public.blog_posts FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();
CREATE TRIGGER update_blog_comments_updated_at BEFORE UPDATE ON public.blog_comments FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();
