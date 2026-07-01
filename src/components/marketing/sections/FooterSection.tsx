
import { Twitter, Facebook, Linkedin, Instagram, Youtube } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SURFACE = '#1e1e1e';
const BORDER = 'rgba(255,255,255,0.07)';
const MUTED = 'rgba(255,255,255,0.55)';
const MUTED_SOFT = 'rgba(255,255,255,0.45)';
const ICON_MUTED = 'rgba(255,255,255,0.5)';

export function FooterSection() {
  const navigate = useNavigate();

  const footerSections = [
    {
      title: "Produits",
      links: [
        { label: "Acheter USDT", href: "/auth" },
        { label: "Vendre USDT", href: "/auth" },
        { label: "Transfert International", href: "/auth" },
        { label: "Taux de Change", href: "/" },
        { label: "Business", href: "/business" }
      ]
    },
    {
      title: "Entreprise",
      links: [
        { label: "À Propos", href: "/about" },
        { label: "Academy", href: "/blog" },
        { label: "Carrières", href: "/careers" }
      ]
    },
    {
      title: "Support",
      links: [
        { label: "Centre d'Aide", href: "/help" },
        { label: "Contact", href: "/contact" },
        { label: "Guide", href: "/guide" },
        { label: "FAQ", href: "/faq" }
      ]
    },
    {
      title: "Légal",
      links: [
        { label: "Conditions d'Utilisation", href: "/terms" },
        { label: "Confidentialité", href: "/privacy" },
        { label: "Sécurité", href: "/security" }
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
    <footer style={{ backgroundColor: '#1a1a1a', borderTop: `1px solid ${BORDER}` }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-10">

          {/* Brand */}
          <div className="col-span-2">
            <div className="flex items-center gap-1.5 mb-4">
              <img
                src="/terex-logo.png"
                alt="Terex Logo"
                className="w-12 h-12 object-contain"
              />
              <span className="text-xl font-bold tracking-tight" style={{ color: '#fff', letterSpacing: '-0.03em' }}>Terex</span>
            </div>

            <p className="text-sm leading-relaxed mb-6 max-w-xs" style={{ color: MUTED }}>
              La plateforme leader d'échange crypto-fiat en Afrique de l'Ouest.
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
                  className="w-9 h-9 rounded-lg flex items-center justify-center transition-colors"
                  style={{ backgroundColor: SURFACE, border: `1px solid ${BORDER}`, color: ICON_MUTED }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#fff')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = ICON_MUTED)}
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>

          </div>

          {/* Link columns */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h4 className="text-sm font-semibold mb-4" style={{ color: '#fff' }}>{section.title}</h4>
              <ul className="space-y-2.5">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <button
                      onClick={() => navigate(link.href)}
                      className="text-sm transition-colors"
                      style={{ color: MUTED }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = '#fff')}
                      onMouseLeave={(e) => (e.currentTarget.style.color = MUTED)}
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
      <div style={{ borderTop: `1px solid ${BORDER}` }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs" style={{ color: MUTED_SOFT }}>
            &copy; 2026 Terex — Teranga Exchange Inc.
          </p>
          <div className="flex items-center gap-5">
            <button
              onClick={() => navigate('/privacy')}
              className="text-xs transition-colors"
              style={{ color: MUTED_SOFT }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#fff')}
              onMouseLeave={(e) => (e.currentTarget.style.color = MUTED_SOFT)}
            >
              Confidentialité
            </button>
            <button
              onClick={() => navigate('/terms')}
              className="text-xs transition-colors"
              style={{ color: MUTED_SOFT }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#fff')}
              onMouseLeave={(e) => (e.currentTarget.style.color = MUTED_SOFT)}
            >
              Conditions
            </button>
            <button
              onClick={() => navigate('/security')}
              className="text-xs transition-colors"
              style={{ color: MUTED_SOFT }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#fff')}
              onMouseLeave={(e) => (e.currentTarget.style.color = MUTED_SOFT)}
            >
              Sécurité
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
