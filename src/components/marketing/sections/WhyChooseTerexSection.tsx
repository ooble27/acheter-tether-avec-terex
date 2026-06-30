import { AnimatedSection, AnimatedItem } from '@/hooks/useScrollAnimation';

const advantages = [
  {
    stat: '2%',
    statLabel: 'commission unique',
    title: 'Frais transparents',
    description:
      "Pas de frais cachés, pas de surprises. Un taux fixe de 2% sur chaque transaction, parmi les plus bas du marché.",
  },
  {
    stat: '<5',
    statLabel: 'minutes',
    title: 'Exécution instantanée',
    description:
      'De la confirmation à la réception, vos transactions sont complétées en quelques minutes, 24h/24.',
  },
  {
    stat: '6',
    statLabel: 'pays couverts',
    title: "Couverture Afrique de l'Ouest",
    description:
      "Sénégal, Côte d'Ivoire, Mali, Burkina Faso, Niger et Guinée. Mobile Money & virements bancaires.",
  },
];

export function WhyChooseTerexSection() {
  return (
    <section className="py-20 sm:py-28" style={{ backgroundColor: '#141414' }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="mb-14 sm:mb-20">
          <span
            className="block text-xs tracking-[0.25em] uppercase mb-5"
            style={{ color: 'rgba(255,255,255,0.45)' }}
          >
            Nos avantages
          </span>
          <h2
            className="font-bold tracking-tight text-white max-w-3xl"
            style={{ fontSize: 'clamp(1.9rem, 4vw, 2.6rem)', lineHeight: 1.12 }}
          >
            Des frais réduits à 2%, une livraison en 5 minutes, et une couverture
            de 6 pays en Afrique de l'Ouest.
          </h2>
          <p
            className="text-base sm:text-lg max-w-2xl mt-5"
            style={{ color: 'rgba(255,255,255,0.55)' }}
          >
            Tout ce qu'il faut pour transférer de la valeur rapidement, à moindre
            coût et en toute confiance.
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {advantages.map((item, index) => (
            <AnimatedItem index={index} key={item.title}>
              <div
                className="group rounded-2xl h-full p-8 transition-colors duration-300"
                style={{
                  backgroundColor: '#1e1e1e',
                  border: '1px solid rgba(255,255,255,0.07)',
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.16)')
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)')
                }
              >
                <div className="mb-8">
                  <div className="text-6xl sm:text-7xl font-extralight text-white leading-none mb-2">
                    {item.stat}
                  </div>
                  <div
                    className="text-sm"
                    style={{ color: 'rgba(255,255,255,0.45)' }}
                  >
                    {item.statLabel}
                  </div>
                </div>
                <h3 className="text-white text-lg font-medium mb-3">
                  {item.title}
                </h3>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: 'rgba(255,255,255,0.55)' }}
                >
                  {item.description}
                </p>
              </div>
            </AnimatedItem>
          ))}
        </div>
      </div>
    </section>
  );
}
