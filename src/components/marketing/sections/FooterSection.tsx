
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mail, Phone, MapPin, Twitter, Facebook, Linkedin, Instagram, Youtube, ArrowRight, Send } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function FooterSection() {
  const navigate = useNavigate();

  const footerSections = [
    {
      title: "Produits",
      links: [
        { label: "Acheter USDT", href: "/auth" },
        { label: "Vendre USDT", href: "/auth" },
        { label: "Transfert International", href: "/auth" },
        { label: "API Marchands", href: "/auth" },
        { label: "Taux de Change", href: "/" }
      ]
    },
    {
      title: "Entreprise",
      links: [
        { label: "À Propos", href: "/about" },
        { label: "Blog", href: "/blog" },
        { label: "Carrières", href: "/careers" }
      ]
    },
    {
      title: "Support",
      links: [
        { label: "Centre d'Aide", href: "/help" },
        { label: "Nous Contacter", href: "/contact" },
        { label: "Guide Utilisateur", href: "/guide" },
        { label: "FAQ", href: "/faq" }
      ]
    },
    {
      title: "Légal",
      links: [
        { label: "Conditions d'Utilisation", href: "/terms" },
        { label: "Politique de Confidentialité", href: "/privacy" },
        { label: "Politique de Sécurité", href: "/security" },
        { label: "Conformité AML/KYC", href: "/compliance" }
      ]
    }
  ];

  const socialLinks = [
    { icon: Twitter, href: "https://twitter.com/terex_official" },
    { icon: Facebook, href: "https://www.facebook.com/profile.php?id=61582482405934" },
    { icon: Linkedin, href: "https://www.linkedin.com/company/teranga-exchange/" },
    { icon: Instagram, href: "https://instagram.com/terex_official" },
    { icon: Youtube, href: "https://youtube.com/@terex-official" }
  ];

  return (
    <footer className="bg-terex-darker relative overflow-hidden">
      {/* Top gradient line */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-terex-accent/30 to-transparent" />
      
      {/* Newsletter Section */}
      <div className="relative border-b border-white/5">
        <div className="absolute inset-0 bg-gradient-to-r from-terex-accent/5 via-transparent to-terex-teal/5" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <h3 className="text-3xl text-white mb-4">
                Restez informé des dernières actualités crypto
              </h3>
              <p className="text-gray-400 text-lg">
                Recevez nos analyses de marché et conseils de trading.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Input 
                  placeholder="Votre adresse email"
                  className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 h-14 pl-5 pr-14 rounded-xl focus:border-terex-accent/50"
                />
                <Button 
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-terex-accent hover:bg-terex-accent/90 text-black rounded-lg h-10 w-10"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-6 gap-12">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <img 
                src="/lovable-uploads/3e8bdd84-3bdf-49ba-98b7-08e541f8323a.png" 
                alt="Terex Logo" 
                className="w-12 h-12 rounded-xl"
              />
              <div>
                <h3 className="text-2xl text-white">Terex</h3>
                <p className="text-terex-accent text-sm">Teranga Exchange</p>
              </div>
            </div>
            
            <p className="text-gray-400 mb-8 leading-relaxed">
              La plateforme leader d'échange crypto-fiat en Afrique. Échangez vos USDT 
              en toute sécurité avec les meilleurs taux.
            </p>

            {/* Contact Info */}
            <div className="space-y-3 mb-8">
              <div className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors group">
                <MapPin className="w-4 h-4 text-terex-accent" />
                <span className="text-sm">Dakar, Sénégal</span>
              </div>
              <div className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors group">
                <Phone className="w-4 h-4 text-terex-accent" />
                <span className="text-sm">WhatsApp: +1 418 261 9091</span>
              </div>
              <div className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors group">
                <Mail className="w-4 h-4 text-terex-accent" />
                <span className="text-sm">terangaexchange@gmail.com</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex gap-3">
              {socialLinks.map((social, index) => {
                const IconComponent = social.icon;
                return (
                  <a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-xl bg-white/5 hover:bg-terex-accent flex items-center justify-center text-gray-400 hover:text-black transition-all duration-300 border border-white/5 hover:border-terex-accent"
                  >
                    <IconComponent className="w-4 h-4" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Footer Links */}
          {footerSections.map((section, index) => (
            <div key={index} className="lg:col-span-1">
              <h4 className="text-white mb-6 flex items-center gap-2">
                {section.title}
                <ArrowRight className="w-3 h-3 text-terex-accent" />
              </h4>
              <ul className="space-y-3">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <button
                      onClick={() => navigate(link.href)}
                      className="text-gray-400 hover:text-terex-accent transition-colors duration-200 text-sm"
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-8 border-t border-white/5 text-center">
          <p className="text-gray-500 text-sm">
            &copy; 2025 Terex. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );  
}
