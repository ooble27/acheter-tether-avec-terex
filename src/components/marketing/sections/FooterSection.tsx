
import { Separator } from '@/components/ui/separator';
import { Mail, Phone, MapPin, Twitter, Facebook, Linkedin, Instagram, Youtube } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/i18n/LanguageContext';

export function FooterSection() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const footerSections = [
    {
      title: t.footer.products,
      links: [
        { label: t.footer.buyUsdt, href: "/auth" },
        { label: t.footer.sellUsdt, href: "/auth" },
        { label: t.footer.internationalTransfer, href: "/auth" },
        { label: t.footer.exchangeRate, href: "/" }
      ]
    },
    {
      title: t.footer.company,
      links: [
        { label: t.footer.about, href: "/about" },
        { label: t.footer.academy, href: "/blog" },
        { label: t.footer.careers, href: "/careers" }
      ]
    },
    {
      title: t.footer.support,
      links: [
        { label: t.footer.helpCenter, href: "/help" },
        { label: t.footer.contact, href: "/contact" },
        { label: t.footer.guide, href: "/guide" },
        { label: t.footer.faq, href: "/faq" }
      ]
    },
    {
      title: t.footer.legal,
      links: [
        { label: t.footer.terms, href: "/terms" },
        { label: t.footer.privacy, href: "/privacy" },
        { label: t.footer.security, href: "/security" }
      ]
    }
  ];

  const socialLinks = [
    { icon: Twitter, href: "https://twitter.com/terex_official", label: "X" },
    { icon: Facebook, href: "https://www.facebook.com/profile.php?id=61582482405934", label: "Facebook" },
    { icon: Linkedin, href: "https://www.linkedin.com/company/teranga-exchange/", label: "LinkedIn" },
    { icon: Instagram, href: "https://instagram.com/terex_official", label: "Instagram" },
    { icon: Youtube, href: "https://youtube.com/@terex-official", label: "YouTube" }
  ];

  return (
    <footer className="bg-white/[0.03] border-t border-white/[0.06]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-10">
          
          {/* Brand */}
          <div className="col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <img 
                src="/lovable-uploads/3e8bdd84-3bdf-49ba-98b7-08e541f8323a.png" 
                alt="Terex Logo" 
                className="w-9 h-9 rounded-lg"
              />
              <span className="text-foreground text-lg font-medium tracking-tight">Terex</span>
            </div>
            
            <p className="text-muted-foreground text-sm leading-relaxed mb-6 max-w-xs">
              {t.footer.tagline}
            </p>

            {/* Social */}
            <div className="flex gap-3 mb-6">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="w-8 h-8 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>

          </div>

          {/* Link columns */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h4 className="text-foreground text-sm font-semibold mb-4">{section.title}</h4>
              <ul className="space-y-2.5">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <button
                      onClick={() => navigate(link.href)}
                      className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-muted-foreground text-xs">
            {t.footer.copyright}
          </p>
          <div className="flex items-center gap-5">
            <button onClick={() => navigate('/privacy')} className="text-muted-foreground hover:text-foreground text-xs transition-colors">
              {t.footer.privacy}
            </button>
            <button onClick={() => navigate('/terms')} className="text-muted-foreground hover:text-foreground text-xs transition-colors">
              {t.footer.terms}
            </button>
            <button onClick={() => navigate('/security')} className="text-muted-foreground hover:text-foreground text-xs transition-colors">
              {t.footer.security}
            </button>
          </div>
        </div>
      </div>
    </footer>
  );  
}
