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
    <section className="py-16 sm:py-24 relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Card */}
        <div className="bg-white/[0.02] backdrop-blur-sm border border-white/10 rounded-3xl overflow-hidden">
          <div className="flex flex-col lg:flex-row">
            {/* Left Side - Image */}
            <div className="lg:w-2/5 relative bg-gradient-to-br from-gray-100 to-gray-200">
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
                      className="p-2.5 rounded-full bg-black/50 backdrop-blur-sm text-white hover:bg-black/70 transition-all"
                      aria-label={social.name}
                    >
                      <IconComponent className="w-4 h-4" />
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Right Side - Content */}
            <div className="lg:w-3/5 p-8 sm:p-10 lg:p-12 flex flex-col justify-center">
              {/* Logo/Brand badge */}
              <div className="flex items-center gap-2 mb-6">
                <img 
                  src="/lovable-uploads/3e8bdd84-3bdf-49ba-98b7-08e541f8323a.png" 
                  alt="Terex" 
                  className="w-8 h-8 rounded-lg"
                />
                <span className="text-white font-semibold text-lg tracking-wide">TEREX</span>
              </div>

              {/* Quote */}
              <blockquote className="mb-8">
                <p className="text-xl sm:text-2xl lg:text-3xl text-white font-light leading-relaxed">
                  "Notre mission est de rendre les stablecoins accessibles à tous. 
                  La blockchain nous permet de construire un système financier plus juste 
                  et plus rapide pour l'Afrique."
                </p>
              </blockquote>

              {/* Author info */}
              <div className="mb-8">
                <h3 className="text-white font-semibold text-lg">
                  Mohamed Lo
                  <span className="text-gray-400 font-normal">, CEO & Fondateur</span>
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
                      className="p-3 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-300"
                      aria-label={social.name}
                    >
                      <IconComponent className="w-5 h-5" />
                    </a>
                  );
                })}
              </div>

              {/* Separator */}
              <div className="border-t border-dashed border-white/10 pt-6">
                {/* Highlights */}
                <div className="flex flex-wrap items-center gap-6">
                  <span className="text-gray-500 text-sm">Valeurs clés</span>
                  <div className="flex items-center gap-6">
                    {highlights.map((item, index) => {
                      const IconComponent = item.icon;
                      return (
                        <div key={index} className="flex items-center gap-2 text-gray-400">
                          <IconComponent className="w-4 h-4 text-terex-accent" />
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
