import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Search, ArrowRight, BookOpen, Shield, Zap, HelpCircle, FileText, Phone, Mail, ChevronRight, MessageCircle, Send, Globe, Wallet, CreditCard, Users, Settings, LifeBuoy, Menu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { FooterSection } from '@/components/marketing/sections/FooterSection';
import { HeaderSection } from '@/components/marketing/sections/HeaderSection';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

/* ── Geometric SVG illustrations (Attio-style) ── */
const GeoAcademy = () => (
  <svg viewBox="0 0 64 64" className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth="1.2">
    <rect x="16" y="20" width="20" height="20" rx="2" className="text-foreground/30" />
    <rect x="28" y="14" width="20" height="20" rx="2" className="text-foreground/20" strokeDasharray="3 3" />
    <circle cx="26" cy="30" r="3" className="text-foreground/40" />
  </svg>
);

const GeoReference = () => (
  <svg viewBox="0 0 64 64" className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth="1.2">
    <circle cx="32" cy="28" r="12" className="text-foreground/30" />
    <circle cx="32" cy="28" r="6" className="text-foreground/20" strokeDasharray="3 3" />
    <line x1="32" y1="40" x2="32" y2="52" className="text-foreground/20" />
    <line x1="24" y1="48" x2="40" y2="48" className="text-foreground/20" />
  </svg>
);

const GeoGuide = () => (
  <svg viewBox="0 0 64 64" className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth="1.2">
    <path d="M20 44 L32 18 L44 44" className="text-foreground/30" />
    <line x1="24" y1="36" x2="40" y2="36" className="text-foreground/20" strokeDasharray="3 3" />
    <circle cx="32" cy="18" r="3" className="text-foreground/20" />
  </svg>
);

const GeoContact = () => (
  <svg viewBox="0 0 64 64" className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth="1.2">
    <rect x="14" y="22" width="36" height="22" rx="3" className="text-foreground/30" />
    <path d="M14 26 L32 36 L50 26" className="text-foreground/20" strokeDasharray="3 3" />
  </svg>
);

/* ── Sidebar categories ── */
const sidebarSections = [
  {
    title: 'GUIDES',
    icon: BookOpen,
    items: [
      { label: 'Premiers pas', href: '/guide' },
      { label: 'Acheter de l\'USDT', href: '/blog' },
      { label: 'Vendre de l\'USDT', href: '/blog' },
      { label: 'Transferts internationaux', href: '/blog' },
      { label: 'Vérification KYC', href: '/blog' },
    ]
  },
  {
    title: 'RÉFÉRENCE',
    icon: FileText,
    items: [
      { label: 'FAQ', href: '/faq' },
      { label: 'Méthodes de paiement', href: '/faq' },
      { label: 'Frais & limites', href: '/faq' },
      { label: 'Réseaux blockchain', href: '/blog' },
      { label: 'Wallets supportés', href: '/blog' },
      { label: 'Pays disponibles', href: '/faq' },
    ]
  },
  {
    title: 'SÉCURITÉ',
    icon: Shield,
    items: [
      { label: 'Politique de sécurité', href: '/security' },
      { label: 'Protection des données', href: '/privacy' },
      { label: 'Conditions d\'utilisation', href: '/terms' },
      { label: 'Signaler un problème', href: '/contact' },
    ]
  },
  {
    title: 'CONTACT',
    icon: MessageCircle,
    items: [
      { label: 'Formulaire de contact', href: '/contact' },
      { label: 'WhatsApp', href: 'https://wa.me/+14182619091', external: true },
      { label: 'Email', href: 'mailto:terangaexchange@gmail.com', external: true },
      { label: 'Téléphone', href: 'tel:+14182619091', external: true },
    ]
  },
];

/* ── Popular searches ── */
const popularSearches = ['acheter USDT', 'KYC', 'frais', 'transfert', 'wallet'];

/* ── Main category cards ── */
const categoryCards = [
  {
    icon: GeoAcademy,
    title: 'Academy',
    description: 'Cours et guides pour débuter avec Terex',
    href: '/blog',
  },
  {
    icon: GeoReference,
    title: 'Référence',
    description: 'Fonctionnalités et paramètres expliqués',
    href: '/faq',
  },
  {
    icon: GeoGuide,
    title: 'Guide',
    description: 'Tutoriels pas à pas pour chaque opération',
    href: '/guide',
  },
  {
    icon: GeoContact,
    title: 'Contact',
    description: 'Parlez directement à notre équipe',
    href: '/contact',
  },
];

const SupportPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      toast({ title: "Déconnexion réussie", description: "À bientôt", className: "bg-green-600 text-white border-green-600" });
      window.location.reload();
    }
  };

  const handleNavClick = (href: string, external?: boolean) => {
    if (external) {
      window.open(href, '_blank');
    } else {
      navigate(href);
    }
  };

  return (
    <div className="min-h-screen bg-terex-dark relative overflow-x-hidden">
      {/* Grid background */}
      <div className="fixed inset-0 opacity-[0.04] pointer-events-none" style={{
        backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.5) 1px, transparent 1px),
                          linear-gradient(90deg, rgba(255, 255, 255, 0.5) 1px, transparent 1px)`,
        backgroundSize: '40px 40px'
      }} />
      
      <HeaderSection 
        user={user ? {
          email: user.email || '',
          name: user.user_metadata?.name || user.user_metadata?.full_name || user.email?.split('@')[0] || 'Utilisateur'
        } : null}
        onShowDashboard={() => navigate('/')}
        onLogout={handleLogout}
      />

      <div className="h-16 md:h-20" />

      {/* Layout with sidebar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex">
        
        {/* Sidebar - desktop only */}
        <aside className="hidden lg:block w-64 flex-shrink-0 pr-8 pt-12 border-r border-white/[0.06]">
          <div className="sticky top-24">
            {/* Sidebar search */}
            <div className="relative mb-8">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Rechercher..."
                className="pl-9 bg-white/[0.03] border-white/[0.08] text-foreground h-9 text-sm rounded-lg"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Sidebar sections */}
            <nav className="space-y-6">
              {sidebarSections.map((section) => (
                <div key={section.title}>
                  <div className="flex items-center gap-2 mb-3">
                    <section.icon className="w-4 h-4 text-muted-foreground" />
                    <span className="text-xs font-semibold tracking-wider text-muted-foreground">{section.title}</span>
                  </div>
                  <ul className="space-y-1">
                    {section.items
                      .filter(item => !searchQuery || item.label.toLowerCase().includes(searchQuery.toLowerCase()))
                      .map((item) => (
                        <li key={item.label}>
                          <button
                            onClick={() => handleNavClick(item.href, (item as any).external)}
                            className="flex items-center gap-2 w-full text-left px-2 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-white/[0.04]"
                          >
                            <ChevronRight className="w-3 h-3 flex-shrink-0 opacity-40" />
                            <span>{item.label}</span>
                          </button>
                        </li>
                      ))}
                  </ul>
                </div>
              ))}
            </nav>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 lg:pl-12 pt-12 md:pt-24 pb-20 md:pb-32">

          {/* Mobile sidebar trigger */}
          <div className="lg:hidden mb-6">
            <Sheet>
              <SheetTrigger asChild>
                <button className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-white/[0.08] bg-white/[0.03] text-sm text-muted-foreground hover:text-foreground transition-colors">
                  <Menu className="w-4 h-4" />
                  <span>Navigation</span>
                </button>
              </SheetTrigger>
              <SheetContent side="left" className="bg-terex-dark border-white/[0.06] w-72 p-6 overflow-y-auto">
                <div className="relative mb-6 mt-4">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input 
                    placeholder="Rechercher..."
                    className="pl-9 bg-white/[0.03] border-white/[0.08] text-foreground h-9 text-sm rounded-lg"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <nav className="space-y-6">
                  {sidebarSections.map((section) => (
                    <div key={section.title}>
                      <div className="flex items-center gap-2 mb-3">
                        <section.icon className="w-4 h-4 text-muted-foreground" />
                        <span className="text-xs font-semibold tracking-wider text-muted-foreground">{section.title}</span>
                      </div>
                      <ul className="space-y-1">
                        {section.items
                          .filter(item => !searchQuery || item.label.toLowerCase().includes(searchQuery.toLowerCase()))
                          .map((item) => (
                            <li key={item.label}>
                              <button
                                onClick={() => handleNavClick(item.href, (item as any).external)}
                                className="flex items-center gap-2 w-full text-left px-2 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-white/[0.04]"
                              >
                                <ChevronRight className="w-3 h-3 flex-shrink-0 opacity-40" />
                                <span>{item.label}</span>
                              </button>
                            </li>
                          ))}
                      </ul>
                    </div>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
          
          {/* Hero title */}
          <div className="max-w-2xl mb-10">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-light text-foreground mb-4 tracking-tight">
              Comment pouvons-nous vous aider ?
            </h1>
            <p className="text-muted-foreground text-base md:text-lg">
              Trouvez des réponses à toutes vos questions sur Terex
            </p>
          </div>

          {/* Search bar */}
          <div className="max-w-xl mx-auto mb-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input 
                placeholder="Rechercher (ex: acheter USDT, frais, KYC...)"
                className="pl-12 bg-white/[0.03] border-white/[0.08] text-foreground h-12 text-sm rounded-xl"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Popular searches */}
          <div className="max-w-xl mx-auto mb-14 flex items-center gap-2 flex-wrap justify-center">
            <span className="text-muted-foreground text-xs">Recherches populaires :</span>
            {popularSearches.map((term) => (
              <button
                key={term}
                onClick={() => setSearchQuery(term)}
                className="px-3 py-1 text-xs border border-white/[0.08] rounded-full text-muted-foreground hover:text-foreground hover:border-white/[0.15] transition-colors"
              >
                {term}
              </button>
            ))}
          </div>

          {/* Category cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-16">
            {categoryCards.map((card) => (
              <button
                key={card.title}
                onClick={() => navigate(card.href)}
                className="group p-5 md:p-6 rounded-xl border border-white/[0.06] hover:border-white/[0.12] bg-white/[0.02] hover:bg-white/[0.04] transition-all text-left"
              >
                <card.icon />
                <h3 className="text-foreground font-semibold text-sm mt-4 mb-1">{card.title}</h3>
                <p className="text-muted-foreground text-xs leading-relaxed">{card.description}</p>
              </button>
            ))}
          </div>

          {/* Dashed separator */}
          <div className="border-t border-dashed border-white/10 mb-16" />

          {/* Quick contact */}
          <div>
            <p className="text-muted-foreground text-xs uppercase tracking-[0.15em] mb-6">Contact direct</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <a
                href="https://wa.me/+14182619091"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-4 rounded-xl border border-white/[0.06] hover:border-white/[0.12] bg-white/[0.02] hover:bg-white/[0.04] transition-all"
              >
                <div className="w-9 h-9 rounded-lg bg-[#25D366]/10 flex items-center justify-center flex-shrink-0">
                  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="#25D366">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                </div>
                <div>
                  <p className="text-foreground text-sm font-medium">WhatsApp</p>
                  <p className="text-muted-foreground text-xs">Réponse immédiate</p>
                </div>
              </a>

              <a
                href="mailto:terangaexchange@gmail.com"
                className="flex items-center gap-3 p-4 rounded-xl border border-white/[0.06] hover:border-white/[0.12] bg-white/[0.02] hover:bg-white/[0.04] transition-all"
              >
                <div className="w-9 h-9 rounded-lg bg-white/[0.06] flex items-center justify-center flex-shrink-0">
                  <Mail className="w-4 h-4 text-white/50" />
                </div>
                <div>
                  <p className="text-foreground text-sm font-medium">Email</p>
                  <p className="text-muted-foreground text-xs">Réponse sous 2h</p>
                </div>
              </a>

              <a
                href="tel:+14182619091"
                className="flex items-center gap-3 p-4 rounded-xl border border-white/[0.06] hover:border-white/[0.12] bg-white/[0.02] hover:bg-white/[0.04] transition-all"
              >
                <div className="w-9 h-9 rounded-lg bg-white/[0.06] flex items-center justify-center flex-shrink-0">
                  <Phone className="w-4 h-4 text-white/50" />
                </div>
                <div>
                  <p className="text-foreground text-sm font-medium">Téléphone</p>
                  <p className="text-muted-foreground text-xs">24/7 disponible</p>
                </div>
              </a>
            </div>
          </div>
        </main>
      </div>

      <FooterSection />
    </div>
  );
};

export default SupportPage;
