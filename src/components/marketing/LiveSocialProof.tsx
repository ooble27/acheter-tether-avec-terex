import { useState, useEffect, useRef } from 'react';
import { Shield, Users, TrendingUp, Zap, Globe, CheckCircle2 } from 'lucide-react';
import { AnimatedSection } from '@/hooks/useScrollAnimation';

// Animated counter hook
function useAnimatedCounter(target: number, duration: number = 2000, startOnView: boolean = true) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(!startOnView);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!startOnView) return;
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setStarted(true); obs.disconnect(); } },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [startOnView]);

  useEffect(() => {
    if (!started) return;
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    const interval = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(interval);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(interval);
  }, [started, target, duration]);

  return { count, ref };
}

// Simulated live activity feed
const activities = [
  { user: 'A. Diallo', action: 'a acheté', amount: '150 USDT', flag: '🇸🇳', time: '2 min' },
  { user: 'F. Traoré', action: 'a vendu', amount: '300 USDT', flag: '🇲🇱', time: '5 min' },
  { user: 'M. Ouedraogo', action: 'a transféré', amount: '200 000 CFA', flag: '🇧🇫', time: '8 min' },
  { user: 'I. Ndiaye', action: 'a acheté', amount: '500 USDT', flag: '🇸🇳', time: '12 min' },
  { user: 'K. Konaté', action: 'a acheté', amount: '1 000 USDT', flag: '🇨🇮', time: '15 min' },
  { user: 'S. Ba', action: 'a transféré', amount: '50 000 CFA', flag: '🇸🇳', time: '18 min' },
  { user: 'O. Camara', action: 'a vendu', amount: '75 USDT', flag: '🇬🇳', time: '22 min' },
  { user: 'D. Touré', action: 'a acheté', amount: '250 USDT', flag: '🇲🇱', time: '25 min' },
];

function LiveActivityTicker() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % activities.length);
        setIsVisible(true);
      }, 400);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  const activity = activities[currentIndex];

  return (
    <div className="relative overflow-hidden h-10 flex items-center">
      <div className={`flex items-center gap-2 transition-all duration-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-3'}`}>
        <div className="relative">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <div className="absolute inset-0 w-2 h-2 rounded-full bg-emerald-400/50 animate-ping" />
        </div>
        <span className="text-xs sm:text-sm text-muted-foreground">
          <span className="text-foreground font-medium">{activity.flag} {activity.user}</span>
          {' '}{activity.action}{' '}
          <span className="text-terex-accent font-semibold">{activity.amount}</span>
          {' '}
          <span className="text-muted-foreground/50">• il y a {activity.time}</span>
        </span>
      </div>
    </div>
  );
}

function TrustBadge({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-[hsl(0,0%,14%)]/80 border border-[hsl(0,0%,20%)]/30 backdrop-blur-sm">
      <Icon className="w-4 h-4 text-terex-accent shrink-0" />
      <div className="flex flex-col">
        <span className="text-[10px] text-muted-foreground/60 uppercase tracking-wider leading-none">{label}</span>
        <span className="text-xs text-foreground font-semibold leading-tight">{value}</span>
      </div>
    </div>
  );
}

export function LiveSocialProof() {
  const { count: usersCount, ref: usersRef } = useAnimatedCounter(2847, 2500);
  const { count: txCount, ref: txRef } = useAnimatedCounter(15420, 2500);
  const { count: volumeCount, ref: volumeRef } = useAnimatedCounter(892, 2500);

  return (
    <section className="py-16 sm:py-24 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-terex-accent/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Live activity ticker */}
        <AnimatedSection delay={100}>
          <div className="flex items-center justify-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[hsl(0,0%,12%)]/80 border border-[hsl(0,0%,20%)]/30 backdrop-blur-sm">
              <span className="text-[10px] uppercase tracking-widest text-terex-accent font-semibold">Activité en direct</span>
            </div>
          </div>
          <div className="flex justify-center mb-16">
            <LiveActivityTicker />
          </div>
        </AnimatedSection>

        {/* Big animated counters */}
        <AnimatedSection delay={200}>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-4 mb-16">
            {/* Users */}
            <div ref={usersRef} className="text-center group">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Users className="w-5 h-5 text-terex-accent/70" />
                <span className="text-xs uppercase tracking-widest text-muted-foreground/60 font-medium">Utilisateurs actifs</span>
              </div>
              <div className="text-5xl sm:text-6xl lg:text-7xl font-bold text-foreground tabular-nums tracking-tight">
                {usersCount.toLocaleString()}
                <span className="text-terex-accent text-3xl sm:text-4xl ml-1">+</span>
              </div>
              <div className="mt-2 flex items-center justify-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[11px] text-emerald-400/80">+12% ce mois</span>
              </div>
            </div>

            {/* Transactions */}
            <div ref={txRef} className="text-center group">
              <div className="flex items-center justify-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-terex-accent/70" />
                <span className="text-xs uppercase tracking-widest text-muted-foreground/60 font-medium">Transactions</span>
              </div>
              <div className="text-5xl sm:text-6xl lg:text-7xl font-bold text-foreground tabular-nums tracking-tight">
                {txCount.toLocaleString()}
                <span className="text-terex-accent text-3xl sm:text-4xl ml-1">+</span>
              </div>
              <div className="mt-2 flex items-center justify-center gap-1.5">
                <Zap className="w-3 h-3 text-terex-accent" />
                <span className="text-[11px] text-muted-foreground/60">Temps moyen : 4 min</span>
              </div>
            </div>

            {/* Volume */}
            <div ref={volumeRef} className="text-center group">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Globe className="w-5 h-5 text-terex-accent/70" />
                <span className="text-xs uppercase tracking-widest text-muted-foreground/60 font-medium">Volume échangé</span>
              </div>
              <div className="text-5xl sm:text-6xl lg:text-7xl font-bold text-foreground tabular-nums tracking-tight">
                {volumeCount.toLocaleString()}M
                <span className="text-terex-accent text-lg sm:text-xl ml-1">CFA</span>
              </div>
              <div className="mt-2 flex items-center justify-center gap-1.5">
                <TrendingUp className="w-3 h-3 text-emerald-400" />
                <span className="text-[11px] text-emerald-400/80">+28% cette semaine</span>
              </div>
            </div>
          </div>
        </AnimatedSection>

        {/* Trust badges row */}
        <AnimatedSection delay={400}>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <TrustBadge icon={Shield} label="Sécurité" value="Chiffrement 256-bit" />
            <TrustBadge icon={CheckCircle2} label="Vérification" value="KYC certifié" />
            <TrustBadge icon={Globe} label="Couverture" value="6 pays africains" />
            <TrustBadge icon={Zap} label="Disponibilité" value="24/7 opérationnel" />
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}