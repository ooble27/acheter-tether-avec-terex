
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight, Zap, Shield, Globe } from 'lucide-react';
import { useTerexRates } from '@/hooks/useTerexRates';

interface HeroSectionProps {
  user?: { email: string; name: string } | null;
  onShowDashboard?: () => void;
}

const TetherLogo = ({ className }: { className?: string }) => (
  <img
    src="https://coin-images.coingecko.com/coins/images/325/large/Tether.png"
    alt="USDT"
    className={className}
  />
);

function DemoCard() {
  const { terexRateCfa, loading } = useTerexRates();

  return (
    <div className="relative w-full max-w-sm mx-auto lg:mx-0">
      <div
        className="absolute inset-0 rounded-2xl blur-3xl opacity-20 -z-10"
        style={{ background: 'radial-gradient(circle, #3b968f 0%, transparent 70%)' }}
      />
      <div
        className="rounded-2xl p-6 space-y-5"
        style={{ background: '#111', border: '1px solid #2a2a2a' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TetherLogo className="w-7 h-7" />
            <div>
              <p className="text-white text-sm font-semibold">USDT</p>
              <p className="text-[11px]" style={{ color: '#666' }}>Tether · Multi-réseau</p>
            </div>
          </div>
          <div
            className="flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium"
            style={{ background: 'rgba(59,150,143,0.12)', color: '#3b968f', border: '1px solid rgba(59,150,143,0.2)' }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#3b968f] animate-pulse" />
            En direct
          </div>
        </div>

        {/* Taux */}
        <div className="rounded-xl p-4" style={{ background: '#0f0f0f', border: '1px solid #222' }}>
          <p className="text-[11px] font-medium mb-1" style={{ color: '#555' }}>TAUX D'ACHAT</p>
          <p className="text-3xl font-light text-white">
            {loading ? '—' : `${terexRateCfa.toLocaleString('fr-FR')}`}
            <span className="text-lg ml-1" style={{ color: '#666' }}>CFA</span>
          </p>
          <p className="text-[11px] mt-1" style={{ color: '#555' }}>par USDT · mis à jour à l'instant</p>
        </div>

        {/* Simulateur */}
        <div className="grid grid-cols-2 gap-3">
          {[50000, 100000, 250000, 500000].map(amount => (
            <div key={amount} className="rounded-lg p-3 text-center" style={{ background: '#0f0f0f', border: '1px solid #1e1e1e' }}>
              <p className="text-[10px] mb-1" style={{ color: '#555' }}>{amount.toLocaleString('fr-FR')} CFA</p>
              <p className="text-sm font-medium" style={{ color: '#3b968f' }}>
                ≈ {loading ? '—' : (amount / terexRateCfa).toFixed(1)} USDT
              </p>
            </div>
          ))}
        </div>

        {/* Features */}
        <div className="space-y-2 pt-1">
          {[
            { icon: Zap,    text: 'Traitement en moins de 5 minutes' },
            { icon: Shield, text: 'Transactions sécurisées et vérifiées' },
            { icon: Globe,  text: 'Disponible dans 6 pays africains' },
          ].map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center gap-2">
              <Icon className="w-3.5 h-3.5 shrink-0" style={{ color: '#3b968f' }} />
              <span className="text-[12px]" style={{ color: '#888' }}>{text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function HeroSection({ user, onShowDashboard }: HeroSectionProps) {
  const navigate = useNavigate();

  return (
    <section
      className="relative min-h-[calc(100vh-4rem)] flex items-center overflow-hidden"
      style={{ background: '#0f0f0f' }}
    >
      {/* Grille subtile */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
          backgroundSize: '48px 48px',
        }}
      />

      {/* Halo */}
      <div
        className="pointer-events-none absolute -top-40 right-0 w-[600px] h-[600px] rounded-full opacity-10"
        style={{ background: 'radial-gradient(circle, #3b968f 0%, transparent 65%)' }}
      />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 py-24 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* Texte */}
          <div className="space-y-8">
            <div>
              <Badge
                className="rounded-full border px-3 py-1 text-[12px] font-medium"
                style={{
                  background: 'rgba(59,150,143,0.08)',
                  borderColor: 'rgba(59,150,143,0.25)',
                  color: '#3b968f',
                }}
              >
                <span className="mr-1.5">✦</span>
                Taux en temps réel · Mobile Money accepté
              </Badge>
            </div>

            <div className="space-y-4">
              <h1
                className="font-light leading-[1.05] tracking-tight"
                style={{ fontSize: 'clamp(2.6rem, 5vw, 4.2rem)', color: '#fafafa' }}
              >
                Échangez l'USDT<br />
                <span style={{ color: '#3b968f' }}>simplement</span> en<br />
                Afrique.
              </h1>
              <p className="text-[17px] font-light leading-relaxed max-w-md" style={{ color: '#888' }}>
                Achetez, vendez et transférez des USDT via Wave ou Orange Money
                en quelques minutes. Meilleur taux garanti.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {user ? (
                <Button
                  onClick={onShowDashboard}
                  className="h-11 px-6 rounded-full text-[14px] font-medium text-black"
                  style={{ background: '#3b968f' }}
                >
                  Mon dashboard <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <>
                  <Button
                    onClick={() => navigate('/auth')}
                    className="h-11 px-6 rounded-full text-[14px] font-medium text-black"
                    style={{ background: '#3b968f' }}
                  >
                    Commencer gratuitement <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                  <Button
                    onClick={() => navigate('/auth')}
                    variant="ghost"
                    className="h-11 px-6 rounded-full text-[14px] font-medium text-white border border-white/15 bg-transparent hover:bg-white/5"
                  >
                    Se connecter
                  </Button>
                </>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
              {['✓ Sans frais cachés', '✓ KYC simplifié', '✓ Support 24/7'].map(t => (
                <span key={t} className="text-[12px]" style={{ color: '#555' }}>{t}</span>
              ))}
            </div>
          </div>

          {/* Carte démo */}
          <div className="flex justify-center lg:justify-end">
            <DemoCard />
          </div>
        </div>

        {/* Séparateur bas */}
        <div
          className="mt-24 h-px w-full"
          style={{ background: 'linear-gradient(90deg, transparent, #2a2a2a 20%, #2a2a2a 80%, transparent)' }}
        />
      </div>
    </section>
  );
}
