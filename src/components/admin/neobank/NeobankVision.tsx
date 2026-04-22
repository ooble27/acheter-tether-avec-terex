import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  CreditCard,
  ArrowLeftRight,
  Send,
  Sparkles,
  Wifi,
  Lock,
  Globe,
  TrendingUp,
  Shield,
  Zap,
  Building2,
  Smartphone,
} from 'lucide-react';

/**
 * NeobankVision — Moodboard visuel de la vision Terex Néobanque
 * Présente 3 axes : Carte Terex, Conversion USDT↔Devises, Transferts SEPA
 */
export function NeobankVision() {
  const [tab, setTab] = useState('overview');

  return (
    <div className="space-y-6">
      {/* Hero / Intro */}
      <div className="relative overflow-hidden rounded-2xl border border-terex-gray bg-gradient-to-br from-terex-darker via-terex-darker to-black p-6 sm:p-10">
        <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="relative">
          <Badge className="bg-primary/20 text-primary border-primary/30 mb-4 hover:bg-primary/20">
            <Sparkles className="w-3 h-3 mr-1" /> Vision produit · 2026
          </Badge>
          <h1 className="text-3xl sm:text-5xl font-light text-white tracking-tight max-w-3xl leading-tight">
            Terex, la <span className="text-primary">néobanque crypto</span> de l'Afrique.
          </h1>
          <p className="mt-4 text-gray-400 max-w-2xl text-sm sm:text-base leading-relaxed">
            Au-delà de l'achat et la vente de stablecoins, Terex devient une infrastructure financière
            complète : cartes bancaires, conversion instantanée USDT ↔ devises, et transferts SEPA
            mondiaux. Une seule app pour vivre, dépenser et envoyer.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            {['Carte Terex', 'Conversion USDT', 'SEPA / Transferts', 'IBAN virtuel', 'Cashback crypto'].map((t) => (
              <span key={t} className="text-xs px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-gray-300">
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>

      <Tabs value={tab} onValueChange={setTab} className="space-y-6">
        <TabsList className="bg-terex-gray grid grid-cols-2 sm:grid-cols-4 w-full h-auto">
          <TabsTrigger value="overview" className="data-[state=active]:bg-terex-accent">
            <Building2 className="w-4 h-4 mr-2" /> Vue d'ensemble
          </TabsTrigger>
          <TabsTrigger value="card" className="data-[state=active]:bg-terex-accent">
            <CreditCard className="w-4 h-4 mr-2" /> Carte Terex
          </TabsTrigger>
          <TabsTrigger value="convert" className="data-[state=active]:bg-terex-accent">
            <ArrowLeftRight className="w-4 h-4 mr-2" /> Conversion
          </TabsTrigger>
          <TabsTrigger value="sepa" className="data-[state=active]:bg-terex-accent">
            <Send className="w-4 h-4 mr-2" /> SEPA
          </TabsTrigger>
        </TabsList>

        {/* ============ OVERVIEW ============ */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { icon: CreditCard, label: 'Carte Terex', desc: 'Carte virtuelle & physique, paiement mondial', color: 'from-primary/30 to-emerald-500/10' },
              { icon: ArrowLeftRight, label: 'Conversion instantanée', desc: 'USDT ↔ XOF, EUR, USD en 1 clic', color: 'from-blue-500/30 to-cyan-500/10' },
              { icon: Send, label: 'Transferts SEPA', desc: 'IBAN virtuel + envoi mondial', color: 'from-purple-500/30 to-pink-500/10' },
            ].map((f) => (
              <Card key={f.label} className="bg-terex-darker border-terex-gray overflow-hidden">
                <div className={`h-32 bg-gradient-to-br ${f.color} flex items-center justify-center`}>
                  <f.icon className="w-14 h-14 text-white/80" strokeWidth={1.2} />
                </div>
                <CardContent className="p-5">
                  <h3 className="text-white text-lg font-light mb-1">{f.label}</h3>
                  <p className="text-sm text-gray-400">{f.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Mini phone mockup */}
          <Card className="bg-terex-darker border-terex-gray">
            <CardContent className="p-6 sm:p-10">
              <div className="grid lg:grid-cols-2 gap-10 items-center">
                <div>
                  <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 mb-3">
                    Inspiration : Revolut · N26 · Wise
                  </Badge>
                  <h2 className="text-2xl sm:text-3xl text-white font-light mb-4">
                    Une seule app. Toute la finance.
                  </h2>
                  <p className="text-gray-400 mb-6 text-sm leading-relaxed">
                    Imagine ton compte Terex avec un solde en USDT, EUR, XOF — convertis en
                    temps réel, dépense partout dans le monde avec ta carte, et envoie de l'argent
                    par SEPA ou Mobile Money.
                  </p>
                  <div className="space-y-3">
                    {[
                      { i: Zap, t: 'Conversion 0 frais cachés' },
                      { i: Globe, t: 'Acceptée dans 180+ pays' },
                      { i: Shield, t: 'KYC Terex déjà vérifié' },
                    ].map((x) => (
                      <div key={x.t} className="flex items-center gap-3 text-gray-300 text-sm">
                        <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                          <x.i className="w-4 h-4 text-primary" />
                        </div>
                        {x.t}
                      </div>
                    ))}
                  </div>
                </div>
                <PhoneAccountMockup />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ============ CARTE TEREX ============ */}
        <TabsContent value="card" className="space-y-6">
          <Card className="bg-terex-darker border-terex-gray">
            <CardContent className="p-6 sm:p-10">
              <div className="grid lg:grid-cols-2 gap-10 items-center">
                <div className="flex justify-center">
                  <TerexCardMockup variant="black" />
                </div>
                <div>
                  <Badge className="bg-primary/20 text-primary border-primary/30 mb-3">
                    Édition Black · Premium
                  </Badge>
                  <h2 className="text-2xl sm:text-3xl text-white font-light mb-3">
                    Ta carte. Ton USDT. Partout.
                  </h2>
                  <p className="text-gray-400 mb-6 text-sm leading-relaxed">
                    Une carte Mastercard liée à ton solde Terex. Dépense en USDT, débit instantané,
                    cashback crypto sur chaque achat.
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { v: '0%', l: 'Frais à l\'étranger' },
                      { v: '2%', l: 'Cashback en USDT' },
                      { v: '180+', l: 'Pays acceptés' },
                      { v: '24/7', l: 'Support Terex' },
                    ].map((s) => (
                      <div key={s.l} className="bg-black/40 rounded-xl p-4 border border-white/5">
                        <div className="text-2xl text-primary font-light">{s.v}</div>
                        <div className="text-xs text-gray-400 mt-1">{s.l}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid sm:grid-cols-3 gap-4">
            <CardVariantTile variant="black" name="Terex Black" tag="Premium" />
            <CardVariantTile variant="green" name="Terex Classic" tag="Standard" />
            <CardVariantTile variant="virtual" name="Terex Virtual" tag="Gratuite" />
          </div>
        </TabsContent>

        {/* ============ CONVERSION ============ */}
        <TabsContent value="convert" className="space-y-6">
          <Card className="bg-terex-darker border-terex-gray">
            <CardContent className="p-6 sm:p-10">
              <div className="grid lg:grid-cols-2 gap-10 items-center">
                <ConvertMockup />
                <div>
                  <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 mb-3">
                    Multi-devises
                  </Badge>
                  <h2 className="text-2xl sm:text-3xl text-white font-light mb-3">
                    Convertis en un swipe.
                  </h2>
                  <p className="text-gray-400 mb-6 text-sm leading-relaxed">
                    USDT ↔ XOF, EUR, USD, NGN, GHS. Taux interbancaire, exécution instantanée,
                    aucune attente.
                  </p>
                  <div className="space-y-2">
                    {[
                      { from: 'USDT', to: 'XOF', rate: '1 USDT = 615 FCFA' },
                      { from: 'USDT', to: 'EUR', rate: '1 USDT = 0.92 €' },
                      { from: 'USDT', to: 'USD', rate: '1 USDT = 1.00 $' },
                    ].map((r) => (
                      <div key={r.to} className="flex items-center justify-between bg-black/40 rounded-xl p-3 border border-white/5">
                        <div className="flex items-center gap-2 text-sm text-white">
                          <span className="px-2 py-1 bg-primary/20 rounded text-primary text-xs">{r.from}</span>
                          <ArrowLeftRight className="w-3 h-3 text-gray-500" />
                          <span className="px-2 py-1 bg-white/5 rounded text-xs">{r.to}</span>
                        </div>
                        <span className="text-xs text-gray-400">{r.rate}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ============ SEPA ============ */}
        <TabsContent value="sepa" className="space-y-6">
          <Card className="bg-terex-darker border-terex-gray">
            <CardContent className="p-6 sm:p-10">
              <div className="grid lg:grid-cols-2 gap-10 items-center">
                <SepaMockup />
                <div>
                  <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 mb-3">
                    IBAN virtuel inclus
                  </Badge>
                  <h2 className="text-2xl sm:text-3xl text-white font-light mb-3">
                    Reçois & envoie en SEPA.
                  </h2>
                  <p className="text-gray-400 mb-6 text-sm leading-relaxed">
                    Chaque utilisateur Terex obtient un IBAN européen pour recevoir des virements,
                    payer ses factures, ou envoyer de l'argent à ses proches en Europe.
                  </p>
                  <div className="space-y-3">
                    {[
                      { i: Building2, t: 'IBAN luxembourgeois ou français' },
                      { i: TrendingUp, t: 'Envoi en moins d\'1 minute' },
                      { i: Lock, t: 'Conforme PSD2 / DSP2' },
                    ].map((x) => (
                      <div key={x.t} className="flex items-center gap-3 text-gray-300 text-sm">
                        <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
                          <x.i className="w-4 h-4 text-purple-400" />
                        </div>
                        {x.t}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Footer note */}
      <div className="text-center text-xs text-gray-500 py-6">
        Vision interne · Document de travail Terex · Inspirée des discussions produit
      </div>
    </div>
  );
}

/* ===================== MOCKUPS ===================== */

function TerexCardMockup({ variant = 'black' }: { variant?: 'black' | 'green' | 'virtual' }) {
  const bg =
    variant === 'black'
      ? 'bg-gradient-to-br from-zinc-900 via-black to-zinc-800'
      : variant === 'green'
      ? 'bg-gradient-to-br from-emerald-700 via-emerald-900 to-black'
      : 'bg-gradient-to-br from-zinc-800 via-zinc-900 to-black border border-dashed border-white/20';

  return (
    <div
      className={`relative ${bg} w-[320px] sm:w-[360px] aspect-[1.586/1] rounded-2xl shadow-2xl p-5 flex flex-col justify-between overflow-hidden`}
      style={{ boxShadow: '0 30px 60px -20px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.05) inset' }}
    >
      {/* Shimmer */}
      <div className="absolute inset-0 opacity-20 bg-gradient-to-tr from-transparent via-white/20 to-transparent" />
      <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-primary/20 blur-2xl" />

      <div className="relative flex items-start justify-between">
        <div>
          <div className="text-white text-lg font-light tracking-widest">TEREX</div>
          <div className="text-[10px] text-gray-400 uppercase tracking-widest mt-0.5">
            {variant === 'black' ? 'Black' : variant === 'green' ? 'Classic' : 'Virtual'}
          </div>
        </div>
        <Wifi className="w-5 h-5 text-white/70 rotate-90" />
      </div>

      {/* Chip */}
      <div className="relative w-10 h-7 rounded-md bg-gradient-to-br from-yellow-200 via-yellow-400 to-yellow-600 opacity-90">
        <div className="absolute inset-1 border border-yellow-700/40 rounded-sm" />
      </div>

      <div className="relative">
        <div className="text-white/90 tracking-[0.25em] text-base font-light mb-2">
          •••• •••• •••• 2580
        </div>
        <div className="flex items-end justify-between">
          <div>
            <div className="text-[9px] text-gray-400 uppercase tracking-wider">Titulaire</div>
            <div className="text-xs text-white tracking-wide">A. DIOP</div>
          </div>
          <div className="text-white text-sm font-light italic">mastercard</div>
        </div>
      </div>
    </div>
  );
}

function CardVariantTile({ variant, name, tag }: { variant: 'black' | 'green' | 'virtual'; name: string; tag: string }) {
  return (
    <Card className="bg-terex-darker border-terex-gray overflow-hidden">
      <div className="p-6 flex justify-center bg-gradient-to-b from-black/40 to-transparent">
        <div className="scale-75">
          <TerexCardMockup variant={variant} />
        </div>
      </div>
      <CardContent className="p-4 text-center">
        <div className="text-white font-light">{name}</div>
        <div className="text-xs text-gray-500 mt-1">{tag}</div>
      </CardContent>
    </Card>
  );
}

function PhoneAccountMockup() {
  return (
    <div className="relative mx-auto w-[260px] h-[540px] rounded-[44px] border-[10px] border-zinc-900 bg-black shadow-2xl overflow-hidden"
      style={{ boxShadow: '0 40px 80px -20px rgba(0,0,0,0.6)' }}>
      {/* Notch */}
      <div className="absolute top-2 left-1/2 -translate-x-1/2 w-24 h-6 bg-black rounded-full z-10" />
      <div className="h-full bg-gradient-to-b from-terex-darker via-black to-terex-darker p-4 pt-10 text-white flex flex-col">
        <div className="flex items-center justify-between text-xs text-gray-400 mb-4">
          <span>9:41</span>
          <span>•••</span>
        </div>
        <div className="text-xs text-gray-400">Solde total</div>
        <div className="text-3xl font-light mt-1">1 248,50 €</div>
        <div className="text-[10px] text-primary mt-1">≈ 1 358 USDT</div>

        <div className="grid grid-cols-4 gap-2 mt-5">
          {['Envoyer', 'Recevoir', 'Convertir', 'Carte'].map((a) => (
            <div key={a} className="text-center">
              <div className="w-10 h-10 mx-auto rounded-full bg-primary/20 border border-primary/30" />
              <div className="text-[9px] text-gray-400 mt-1">{a}</div>
            </div>
          ))}
        </div>

        <div className="mt-5 space-y-2">
          {[
            { n: 'USDT', s: '1 358', sub: 'Tether' },
            { n: 'EUR', s: '420,00', sub: 'Euro' },
            { n: 'XOF', s: '85 200', sub: 'Franc CFA' },
          ].map((c) => (
            <div key={c.n} className="flex items-center justify-between bg-white/5 rounded-xl p-2.5">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-primary/30 flex items-center justify-center text-[10px] text-primary">
                  {c.n[0]}
                </div>
                <div>
                  <div className="text-xs">{c.n}</div>
                  <div className="text-[9px] text-gray-500">{c.sub}</div>
                </div>
              </div>
              <div className="text-xs font-light">{c.s}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ConvertMockup() {
  return (
    <div className="bg-black rounded-3xl p-6 border border-white/10 max-w-sm mx-auto w-full">
      <div className="text-xs text-gray-400 mb-2">Vous payez</div>
      <div className="bg-white/5 rounded-2xl p-4 flex items-center justify-between">
        <input className="bg-transparent text-2xl text-white font-light w-32 outline-none" defaultValue="100.00" readOnly />
        <div className="flex items-center gap-2 bg-primary/20 rounded-full px-3 py-1.5">
          <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-[10px] text-white">U</div>
          <span className="text-sm text-white">USDT</span>
        </div>
      </div>

      <div className="flex justify-center my-3">
        <div className="w-9 h-9 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center">
          <ArrowLeftRight className="w-4 h-4 text-primary rotate-90" />
        </div>
      </div>

      <div className="text-xs text-gray-400 mb-2">Vous recevez</div>
      <div className="bg-white/5 rounded-2xl p-4 flex items-center justify-between">
        <div className="text-2xl text-white font-light">61 500</div>
        <div className="flex items-center gap-2 bg-white/10 rounded-full px-3 py-1.5">
          <div className="w-6 h-6 rounded-full bg-yellow-500/30 flex items-center justify-center text-[10px] text-yellow-300">F</div>
          <span className="text-sm text-white">XOF</span>
        </div>
      </div>

      <div className="mt-4 text-[11px] text-gray-500 flex justify-between">
        <span>Taux : 1 USDT = 615 FCFA</span>
        <span className="text-primary">0 frais</span>
      </div>

      <button className="mt-4 w-full bg-primary hover:bg-primary/90 text-white rounded-xl py-3 text-sm font-light transition">
        Convertir maintenant
      </button>
    </div>
  );
}

function SepaMockup() {
  return (
    <div className="bg-black rounded-3xl p-6 border border-white/10 max-w-sm mx-auto w-full space-y-4">
      <div className="flex items-center justify-between">
        <div className="text-xs text-gray-400">Mon IBAN Terex</div>
        <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 text-[10px]">Actif</Badge>
      </div>
      <div className="bg-gradient-to-br from-purple-900/40 to-black rounded-2xl p-4 border border-purple-500/20">
        <div className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">IBAN</div>
        <div className="text-white font-mono text-sm tracking-wider">LU28 0019 4006 4475 0000</div>
        <div className="text-[10px] text-gray-500 mt-2">BIC : BCEELULL · Titulaire : A. DIOP</div>
      </div>

      <div className="space-y-2">
        <div className="text-xs text-gray-400">Derniers virements SEPA</div>
        {[
          { n: 'Marie L.', a: '+ 250,00 €', d: 'Reçu · Aujourd\'hui' },
          { n: 'EDF Énergie', a: '- 89,40 €', d: 'Prélèvement · Hier' },
          { n: 'Salaire', a: '+ 1 800,00 €', d: 'Virement · 22 avr.' },
        ].map((t) => (
          <div key={t.n} className="flex items-center justify-between bg-white/5 rounded-xl p-3">
            <div>
              <div className="text-xs text-white">{t.n}</div>
              <div className="text-[10px] text-gray-500">{t.d}</div>
            </div>
            <div className={`text-xs font-light ${t.a.startsWith('+') ? 'text-primary' : 'text-gray-300'}`}>{t.a}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
