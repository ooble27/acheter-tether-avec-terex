import { Linkedin, Twitter, Instagram, Zap, Shield, Globe } from 'lucide-react';
import founderImage from '@/assets/founder-mohamed-lo.png';

export function FounderSection() {
  const socialLinks = [
    {
      name: 'LinkedIn',
      icon: Linkedin,
      url: 'https://linkedin.com/in/mohamedlo',
    },
    {
      name: 'Twitter',
      icon: Twitter,
      url: 'https://twitter.com/mohamedlo',
    },
    {
      name: 'Instagram',
      icon: Instagram,
      url: 'https://instagram.com/mohamedlo',
    }
  ];

  const highlights = [
    { icon: Zap, label: 'Rapidité' },
    { icon: Shield, label: 'Sécurité' },
    { icon: Globe, label: 'Accessibilité' },
  ];

  return (
    <section className="py-20 sm:py-28" style={{ backgroundColor: "#141414" }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Card */}
        <div
          className="rounded-2xl overflow-hidden"
          style={{
            backgroundColor: "#1e1e1e",
            border: "1px solid rgba(255,255,255,0.07)",
          }}
        >
          <div className="flex flex-col lg:flex-row">
            {/* Left Side - Image */}
            <div
              className="lg:w-2/5 relative"
              style={{ backgroundColor: "#2d2d2d" }}
            >
              <div className="aspect-square lg:aspect-auto lg:h-full">
                <img
                  src={founderImage}
                  alt="Mohamed Lo - Fondateur de Terex"
                  className="w-full h-full object-cover object-top"
                />
              </div>

              {/* Social links overlay on mobile */}
              <div className="absolute bottom-4 left-4 flex gap-2 lg:hidden">
                {socialLinks.map((social) => {
                  const IconComponent = social.icon;
                  return (
                    <a
                      key={social.name}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 rounded-full backdrop-blur-sm transition-all"
                      style={{
                        backgroundColor: "rgba(20,20,20,0.6)",
                        border: "1px solid rgba(255,255,255,0.08)",
                        color: "rgba(255,255,255,0.6)",
                      }}
                      aria-label={social.name}
                    >
                      <IconComponent className="w-4 h-4" />
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Right Side - Content */}
            <div className="lg:w-3/5 p-8 sm:p-10 lg:p-14 flex flex-col justify-center">
              {/* Logo/Brand badge */}
              <div className="flex items-center gap-2 mb-6">
                <img
                  src="/terex-logo.png"
                  alt="Terex"
                  className="w-8 h-8 rounded-lg"
                />
                <span className="text-white font-semibold text-lg tracking-wide">TEREX</span>
              </div>

              {/* Eyebrow */}
              <p
                className="text-xs sm:text-sm font-medium uppercase tracking-widest mb-6"
                style={{ color: "rgba(255,255,255,0.45)" }}
              >
                Le fondateur
              </p>

              {/* Quote */}
              <blockquote className="mb-8">
                <p
                  className="text-xl sm:text-2xl lg:text-3xl text-white font-light leading-relaxed tracking-tight"
                >
                  "Notre mission est de rendre les stablecoins accessibles à tous.
                  La blockchain nous permet de construire un système financier plus juste
                  et plus rapide pour l'Afrique."
                </p>
              </blockquote>

              {/* Author info */}
              <div className="mb-8">
                <h3 className="text-white font-semibold text-lg">
                  Mohamed Lo
                  <span
                    className="font-normal"
                    style={{ color: "rgba(255,255,255,0.55)" }}
                  >
                    , CEO &amp; Fondateur
                  </span>
                </h3>
              </div>

              {/* Social Links - Desktop */}
              <div className="hidden lg:flex items-center gap-3 mb-8">
                {socialLinks.map((social) => {
                  const IconComponent = social.icon;
                  return (
                    <a
                      key={social.name}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 rounded-xl transition-all duration-300"
                      style={{
                        backgroundColor: "rgba(255,255,255,0.06)",
                        border: "1px solid rgba(255,255,255,0.08)",
                        color: "rgba(255,255,255,0.6)",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = "#fff";
                        e.currentTarget.style.borderColor = "rgba(255,255,255,0.16)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = "rgba(255,255,255,0.6)";
                        e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
                      }}
                      aria-label={social.name}
                    >
                      <IconComponent className="w-5 h-5" />
                    </a>
                  );
                })}
              </div>

              {/* Separator */}
              <div
                className="pt-6"
                style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}
              >
                {/* Highlights */}
                <div className="flex flex-wrap items-center gap-6">
                  <span
                    className="text-sm"
                    style={{ color: "rgba(255,255,255,0.45)" }}
                  >
                    Valeurs clés
                  </span>
                  <div className="flex flex-wrap items-center gap-6">
                    {highlights.map((item, index) => {
                      const IconComponent = item.icon;
                      return (
                        <div
                          key={index}
                          className="flex items-center gap-2"
                          style={{ color: "rgba(255,255,255,0.55)" }}
                        >
                          <IconComponent
                            className="w-4 h-4"
                            style={{ color: "rgba(255,255,255,0.6)" }}
                          />
                          <span className="text-sm">{item.label}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
