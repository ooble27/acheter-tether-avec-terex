import { UnifiedConverter } from '../UnifiedConverter';

export function CurrencyConverterSection() {
  return (
    <section className="py-20 sm:py-28" style={{ backgroundColor: '#1a1a1a' }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14 sm:mb-16">
          <span
            className="block text-xs tracking-[0.25em] uppercase mb-5"
            style={{ color: 'rgba(255,255,255,0.45)' }}
          >
            Taux en temps réel
          </span>
          <h2
            className="font-bold tracking-tight text-white mx-auto max-w-3xl"
            style={{ fontSize: 'clamp(1.9rem, 4vw, 2.6rem)', lineHeight: 1.1 }}
          >
            Découvrez nos taux en temps réel
          </h2>
          <p
            className="text-base sm:text-lg max-w-2xl mx-auto mt-5"
            style={{ color: 'rgba(255,255,255,0.55)' }}
          >
            Utilisez nos convertisseurs pour connaître instantanément nos taux
            USDT et virements internationaux.
          </p>
        </div>

        <div
          className="rounded-2xl p-6 sm:p-8"
          style={{
            backgroundColor: '#1e1e1e',
            border: '1px solid rgba(255,255,255,0.07)',
          }}
        >
          <UnifiedConverter />
        </div>
      </div>
    </section>
  );
}
