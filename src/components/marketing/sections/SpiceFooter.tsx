
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';
import { Twitter, Facebook, Linkedin, Instagram } from 'lucide-react';

export function SpiceFooter() {
  const navigate = useNavigate();

  const footerLinks = [
    {
      title: 'Produits',
      links: [
        { label: 'Acheter USDT', href: '/auth' },
        { label: 'Vendre USDT', href: '/auth' },
        { label: 'Transferts', href: '/auth' },
      ],
    },
    {
      title: 'Entreprise',
      links: [
        { label: 'À propos', href: '/about' },
        { label: 'Carrières', href: '/careers' },
        { label: 'Blog', href: '/blog' },
        { label: 'Contact', href: '/contact' },
      ],
    },
    {
      title: 'Légal',
      links: [
        { label: 'Conditions', href: '/terms' },
        { label: 'Confidentialité', href: '/privacy' },
        { label: 'Sécurité', href: '/security' },
      ],
    },
    {
      title: 'Support',
      links: [
        { label: 'FAQ', href: '/faq' },
        { label: 'Guide', href: '/guide' },
        { label: 'Aide', href: '/help' },
      ],
    },
  ];

  const socialLinks = [
    { icon: Twitter, href: 'https://twitter.com/terex_official' },
    { icon: Facebook, href: 'https://www.facebook.com/profile.php?id=61582482405934' },
    { icon: Linkedin, href: 'https://www.linkedin.com/company/teranga-exchange/' },
    { icon: Instagram, href: 'https://instagram.com/terex_official' },
  ];

  return (
    <footer className="bg-zinc-900 border-t border-white/5 rounded-t-[2rem] sm:rounded-t-[3rem]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 lg:gap-12">
          {/* Logo section */}
          <div className="col-span-2 lg:col-span-2">
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-500 via-purple-500 to-pink-500 p-[2px]">
                <div className="w-full h-full rounded-full bg-zinc-900 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-gradient-to-br from-pink-500 to-purple-500" />
                </div>
              </div>
              <span className="text-white font-medium text-lg">
                Terex<sup className="text-[8px] ml-0.5">®</sup>
              </span>
            </div>
            
            <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-xs">
              La plateforme de référence pour l'échange USDT et les transferts d'argent vers l'Afrique.
            </p>

            {/* Social links */}
            <div className="flex space-x-3">
              {socialLinks.map((social, index) => {
                const IconComponent = social.icon;
                return (
                  <a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 bg-white/5 hover:bg-white/10 rounded-full flex items-center justify-center text-gray-400 hover:text-white transition-all"
                  >
                    <IconComponent className="w-4 h-4" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Footer links */}
          {footerLinks.map((section, index) => (
            <div key={index}>
              <h4 className="text-white text-sm font-medium mb-4">{section.title}</h4>
              <ul className="space-y-3">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <button
                      onClick={() => navigate(link.href)}
                      className="text-gray-400 hover:text-white text-sm transition-colors"
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter section */}
        <div className="mt-12 pt-8 border-t border-white/5">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h4 className="text-white text-base mb-1">Inscrivez-vous à notre newsletter</h4>
              <p className="text-gray-500 text-sm">
                Recevez nos dernières actualités et conseils crypto.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 max-w-md w-full lg:w-auto">
              <Input
                placeholder="Votre email"
                className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 rounded-full px-5"
              />
              <Button
                className="bg-white text-black hover:bg-gray-100 rounded-full px-6 whitespace-nowrap"
              >
                S'inscrire
              </Button>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t border-white/5 text-center">
          <p className="text-gray-500 text-sm">
            2025 © Terex® - Teranga Exchange Inc.
          </p>
        </div>
      </div>
    </footer>
  );
}
