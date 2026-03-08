
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Mail, Phone, MapPin, Twitter, Facebook, Linkedin, Instagram, Youtube, ShoppingCart, ArrowLeftRight, Globe, Code, TrendingUp, Building2, BookOpen, Briefcase, LifeBuoy, MessageCircle, BookMarked, HelpCircle, FileText, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function FooterSection() {
  const navigate = useNavigate();

  const footerSections = [
    {
      title: "Produits",
      links: [
        { label: "Acheter USDT", href: "/auth", icon: ShoppingCart },
        { label: "Vendre USDT", href: "/auth", icon: ArrowLeftRight },
        { label: "Transfert International", href: "/auth", icon: Globe },
        { label: "API Marchands", href: "/auth", icon: Code },
        { label: "Taux de Change", href: "/", icon: TrendingUp }
      ]
    },
    {
      title: "Entreprise",
      links: [
        { label: "À Propos", href: "/about", icon: Building2 },
        { label: "Blog", href: "/blog", icon: BookOpen },
        { label: "Carrières", href: "/careers", icon: Briefcase }
      ]
    },
    {
      title: "Support",
      links: [
        { label: "Centre d'Aide", href: "/help", icon: LifeBuoy },
        { label: "Nous Contacter", href: "/contact", icon: MessageCircle },
        { label: "Guide Utilisateur", href: "/guide", icon: BookMarked },
        { label: "FAQ", href: "/faq", icon: HelpCircle }
      ]
    },
    {
      title: "Légal",
      links: [
        { label: "Conditions d'Utilisation", href: "/terms", icon: FileText },
        { label: "Politique de Confidentialité", href: "/privacy", icon: Shield }
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
    <footer className="bg-terex-darker border-t border-terex-accent/20">

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-6 gap-12">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <img 
                src="/lovable-uploads/3e8bdd84-3bdf-49ba-98b7-08e541f8323a.png" 
                alt="Terex Logo" 
                className="w-12 h-12 rounded-xl"
              />
              <div>
                <h3 className="text-2xl font-light text-white">Terex</h3>
                <p className="text-terex-accent text-sm font-light">Teranga Exchange</p>
              </div>
            </div>
            
            <p className="text-gray-400 mb-6 leading-relaxed font-light">
              La plateforme leader d'échange crypto-fiat en Afrique. Échangez vos USDT contre 
              des devises locales en toute sécurité avec les meilleurs taux du marché.
            </p>

            {/* Contact Info */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center text-gray-300">
                <MapPin className="w-4 h-4 mr-3 text-terex-accent" />
                <span className="text-sm">Dakar, Sénégal</span>
              </div>
              <div className="flex items-center text-gray-300">
                <Phone className="w-4 h-4 mr-3 text-terex-accent" />
                <span className="text-sm">WhatsApp: +1 4182619091</span>
              </div>
              <div className="flex items-center text-gray-300">
                <Mail className="w-4 h-4 mr-3 text-terex-accent" />
                <span className="text-sm">terangaexchange@gmail.com</span>
              </div>
              <div className="flex items-center text-gray-300">
                <Phone className="w-4 h-4 mr-3 text-terex-accent" />
                <span className="text-sm">WhatsApp: +1 418 261 9091</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => {
                const IconComponent = social.icon;
                return (
                  <a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-terex-gray hover:bg-terex-accent rounded-lg flex items-center justify-center text-gray-300 hover:text-black transition-all duration-300"
                  >
                    <IconComponent className="w-5 h-5" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Footer Links */}
          {footerSections.map((section, index) => (
            <div key={index} className="lg:col-span-1">
              <h4 className="text-white font-light mb-6">{section.title}</h4>
              <ul className="space-y-3">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <button
                      onClick={() => navigate(link.href)}
                      className="text-gray-300 hover:text-terex-accent transition-colors duration-200 text-sm block"
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <Separator className="my-12 bg-terex-gray" />

        {/* Bottom Footer */}
        <div className="text-center">
          <div className="text-gray-400 text-sm">
            <p>&copy; 2025 Terex. Tous droits réservés.</p>
          </div>
        </div>
      </div>
    </footer>
  );  
}
