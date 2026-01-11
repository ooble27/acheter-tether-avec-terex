import { Linkedin, Twitter, Instagram, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import founderImage from '@/assets/founder-mohamed-lo.png';

export function FounderSection() {
  const socialLinks = [
    {
      name: 'LinkedIn',
      icon: Linkedin,
      url: 'https://linkedin.com/in/mohamedlo',
      color: 'hover:bg-[#0077B5]/20 hover:text-[#0077B5]'
    },
    {
      name: 'Twitter',
      icon: Twitter,
      url: 'https://twitter.com/mohamedlo',
      color: 'hover:bg-[#1DA1F2]/20 hover:text-[#1DA1F2]'
    },
    {
      name: 'Instagram',
      icon: Instagram,
      url: 'https://instagram.com/mohamedlo',
      color: 'hover:bg-[#E4405F]/20 hover:text-[#E4405F]'
    }
  ];

  return (
    <section className="py-16 sm:py-24 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-terex-accent/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-terex-accent/3 rounded-full blur-3xl" />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-terex-accent/10 border border-terex-accent/20 mb-4">
            <span className="text-terex-accent text-sm font-medium">Notre Vision</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Rencontrez le <span className="text-terex-accent">Fondateur</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-base sm:text-lg">
            Une vision audacieuse pour révolutionner les transferts financiers en Afrique
          </p>
        </div>

        {/* Founder Card */}
        <div className="max-w-4xl mx-auto">
          <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-6 sm:p-10 overflow-hidden">
            {/* Decorative accent line */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-terex-accent to-transparent" />
            
            <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
              {/* Image */}
              <div className="relative flex-shrink-0">
                <div className="w-48 h-48 sm:w-56 sm:h-56 lg:w-64 lg:h-64 rounded-2xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 shadow-2xl shadow-black/30">
                  <img 
                    src={founderImage} 
                    alt="Mohamed Lo - Fondateur de Terex" 
                    className="w-full h-full object-cover object-top"
                  />
                </div>
                {/* Decorative badge */}
                <div className="absolute -bottom-3 -right-3 bg-terex-accent text-black px-4 py-2 rounded-xl font-semibold text-sm shadow-lg shadow-terex-accent/30">
                  CEO & Fondateur
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 text-center lg:text-left">
                <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                  Mohamed Lo
                </h3>
                <p className="text-terex-accent font-medium mb-4">
                  Entrepreneur & Visionnaire Fintech
                </p>
                
                <p className="text-gray-300 leading-relaxed mb-6 text-sm sm:text-base">
                  Passionné par l'innovation technologique et l'inclusion financière, Mohamed Lo a fondé Terex 
                  avec une mission claire : rendre les transferts d'argent accessibles, rapides et abordables 
                  pour tous les Africains. Son expertise en blockchain et sa connaissance approfondie des défis 
                  financiers du continent l'ont conduit à créer une plateforme qui transforme la façon dont 
                  l'argent circule en Afrique.
                </p>

                {/* Quote */}
                <blockquote className="relative mb-8 pl-4 border-l-2 border-terex-accent/50">
                  <p className="text-gray-400 italic text-sm sm:text-base">
                    "Notre objectif est de construire un pont numérique qui connecte les familles 
                    africaines à travers le monde, en rendant chaque transfert simple et instantané."
                  </p>
                </blockquote>

                {/* Social Links */}
                <div className="flex items-center justify-center lg:justify-start gap-3">
                  <span className="text-gray-500 text-sm mr-2">Suivez-moi :</span>
                  {socialLinks.map((social) => {
                    const IconComponent = social.icon;
                    return (
                      <a
                        key={social.name}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`p-3 rounded-xl bg-white/5 border border-white/10 text-gray-400 transition-all duration-300 ${social.color}`}
                        aria-label={social.name}
                      >
                        <IconComponent className="w-5 h-5" />
                      </a>
                    );
                  })}
                  
                  {/* Website link */}
                  <a
                    href="https://mohamedlo.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-2"
                  >
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-xl border-terex-accent/30 text-gray-300 hover:bg-terex-accent/10 hover:text-white gap-2"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Site web
                    </Button>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
