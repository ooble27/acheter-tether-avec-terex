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
} from 'lucide-react';

const TEREX_LOGO = '/lovable-uploads/3e8bdd84-3bdf-49ba-98b7-08e541f8323a.png';

/* Neutral dark design tokens */
const CARD = '#1e1e1e';
const BORDER = 'rgba(255,255,255,0.07)';
const ICON_BG = 'rgba(255,255,255,0.06)';
const SUBTLE_TINT = 'rgba(255,255,255,0.03)';
const ICON_COLOR = 'rgba(255,255,255,0.85)';
const MUTED = '#9ca3af';
const MUTED_DIM = '#6b7280';

const cardStyle: React.CSSProperties = {
  background: CARD,
  border: `1px solid ${BORDER}`,
  borderRadius: 18,
};

const iconTileStyle: React.CSSProperties = {
  background: ICON_BG,
  color: ICON_COLOR,
};

const neutralButtonStyle: React.CSSProperties = {
  background: '#2d2d2d',
  border: `1px solid ${BORDER}`,
  color: '#fff',
};

/**
 * NeobankVision — Moodboard visuel de la vision Terex Néobanque
 * Design system neutre sombre.
 */
export function NeobankVision() {
  const [tab, setTab] = useState('overview');

  return (
    <div className="space-y-6">
      {/* Hero / Intro */}
      <div
        className="relative overflow-hidden p-6 sm:p-10"
        style={{ ...cardStyle, borderRadius: 20, background: CARD }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: SUBTLE_TINT }}
        />
        <div className="relative">
          <div className="flex items-center gap-3 mb-4">
            <img src={TEREX_LOGO} alt="Terex" className="w-10 h-10 rounded-lg" />
            <Badge
              className="border-0"
              style={{ background: ICON_BG, color: '#fff' }}
            >
              <Sparkles className="w-3 h-3 mr-1" /> Vision produit · 2026
            </Badge>
          </div>
          <h1 className="text-3xl sm:text-5xl font-light text-white tracking-tight max-w-3xl leading-tight">
            Terex, la <span style={{ color: '#fff' }}>néobanque crypto</span> de l'Afrique.
          </h1>
          <p className="mt-4 max-w-2xl text-sm sm:text-base leading-relaxed" style={{ color: MUTED }}>
            Au-delà de l'achat et la vente de stablecoins, Terex devient une infrastructure financière
            complète : cartes bancaires, conversion instantanée USDT ↔ devises, et transferts SEPA
            mondiaux. Une seule app pour vivre, dépenser et envoyer.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            {['Carte Terex', 'Conversion USDT', 'SEPA / Transferts', 'IBAN virtuel', 'Cashback crypto'].map((t) => (
              <span
                key={t}
                className="text-xs px-3 py-1.5 rounded-full"
                style={{ background: ICON_BG, border: `1px solid ${BORDER}`, color: MUTED }}
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>

      <Tabs value={tab} onValueChange={setTab} className="space-y-6">
        <TabsList
          className="grid grid-cols-2 sm:grid-cols-4 w-full h-auto gap-1 p-1"
          style={{ background: CARD, border: `1px solid ${BORDER}` }}
        >
          <TabsTrigger
            value="overview"
            className="text-white data-[state=active]:!bg-white data-[state=active]:!text-[#141414] data-[state=active]:font-bold"
          >
            <Building2 className="w-4 h-4 mr-2" /> Vue d'ensemble
          </TabsTrigger>
          <TabsTrigger
            value="card"
            className="text-white data-[state=active]:!bg-white data-[state=active]:!text-[#141414] data-[state=active]:font-bold"
          >
            <CreditCard className="w-4 h-4 mr-2" /> Carte Terex
          </TabsTrigger>
          <TabsTrigger
            value="convert"
            className="text-white data-[state=active]:!bg-white data-[state=active]:!text-[#141414] data-[state=active]:font-bold"
          >
            <ArrowLeftRight className="w-4 h-4 mr-2" /> Conversion
          </TabsTrigger>
          <TabsTrigger
            value="sepa"
            className="text-white data-[state=active]:!bg-white data-[state=active]:!text-[#141414] data-[state=active]:font-bold"
          >
            <Send className="w-4 h-4 mr-2" /> SEPA
          </TabsTrigger>
        </TabsList>

        {/* OVERVIEW */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { icon: CreditCard, label: 'Carte Terex', desc: 'Carte virtuelle & physique, paiement mondial' },
              { icon: ArrowLeftRight, label: 'Conversion instantanée', desc: 'USDT ↔ XOF, EUR, USD en 1 clic' },
              { icon: Send, label: 'Transferts SEPA', desc: 'IBAN virtuel + envoi mondial' },
            ].map((f) => (
              <Card key={f.label} className="overflow-hidden" style={cardStyle}>
                <div
                  className="h-32 flex items-center justify-center"
                  style={{ background: SUBTLE_TINT }}
                >
                  <f.icon className="w-14 h-14" strokeWidth={1.2} style={{ color: ICON_COLOR }} />
                </div>
                <CardContent className="p-5">
                  <h3 className="text-white text-lg font-light mb-1">{f.label}</h3>
                  <p className="text-sm" style={{ color: MUTED }}>{f.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card style={cardStyle}>
            <CardContent className="p-6 sm:p-10">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
                <div>
                  <Badge className="mb-3 border-0" style={{ background: ICON_BG, color: '#fff' }}>
                    Inspiration : Revolut · N26 · Wise
                  </Badge>
                  <h2 className="text-2xl sm:text-3xl text-white font-light mb-4">
                    Une seule app. Toute la finance.
                  </h2>
                  <p className="mb-6 text-sm leading-relaxed" style={{ color: MUTED }}>
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
                      <div key={x.t} className="flex items-center gap-3 text-sm" style={{ color: MUTED }}>
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={iconTileStyle}>
                          <x.i className="w-4 h-4" style={{ color: ICON_COLOR }} />
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

        {/* CARTE TEREX */}
        <TabsContent value="card" className="space-y-6">
          <Card style={cardStyle}>
            <CardContent className="p-6 sm:p-10">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
                <div className="flex justify-center">
                  <TerexCardMockup variant="signature" />
                </div>
                <div>
                  <Badge className="mb-3 border-0" style={{ background: ICON_BG, color: '#fff' }}>
                    Édition Signature · Premium
                  </Badge>
                  <h2 className="text-2xl sm:text-3xl text-white font-light mb-3">
                    Ta carte. Ton USDT. Partout.
                  </h2>
                  <p className="mb-6 text-sm leading-relaxed" style={{ color: MUTED }}>
                    Une carte Mastercard liée à ton solde Terex. Dépense en USDT, débit instantané,
                    cashback crypto sur chaque achat.
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { v: '0%', l: "Frais à l'étranger" },
                      { v: '2%', l: 'Cashback en USDT' },
                      { v: '180+', l: 'Pays acceptés' },
                      { v: '24/7', l: 'Support Terex' },
                    ].map((s) => (
                      <div
                        key={s.l}
                        className="rounded-xl p-4"
                        style={{ background: SUBTLE_TINT, border: `1px solid ${BORDER}` }}
                      >
                        <div className="text-2xl text-white font-light">{s.v}</div>
                        <div className="text-xs mt-1" style={{ color: MUTED }}>{s.l}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <CardVariantTile variant="signature" name="Terex Signature" tag="Premium" />
            <CardVariantTile variant="classic" name="Terex Classic" tag="Standard" />
            <CardVariantTile variant="virtual" name="Terex Virtual" tag="Gratuite" />
          </div>
        </TabsContent>

        {/* CONVERSION */}
        <TabsContent value="convert" className="space-y-6">
          <Card style={cardStyle}>
            <CardContent className="p-6 sm:p-10">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
                <ConvertMockup />
                <div>
                  <Badge className="mb-3 border-0" style={{ background: ICON_BG, color: '#fff' }}>
                    Multi-devises
                  </Badge>
                  <h2 className="text-2xl sm:text-3xl text-white font-light mb-3">
                    Convertis en un swipe.
                  </h2>
                  <p className="mb-6 text-sm leading-relaxed" style={{ color: MUTED }}>
                    USDT ↔ XOF, EUR, USD, NGN, GHS. Taux interbancaire, exécution instantanée,
                    aucune attente.
                  </p>
                  <div className="space-y-2">
                    {[
                      { from: 'USDT', to: 'XOF', rate: '1 USDT = 615 FCFA' },
                      { from: 'USDT', to: 'EUR', rate: '1 USDT = 0.92 €' },
                      { from: 'USDT', to: 'USD', rate: '1 USDT = 1.00 $' },
                    ].map((r) => (
                      <div
                        key={r.to}
                        className="flex items-center justify-between rounded-xl p-3"
                        style={{ background: SUBTLE_TINT, border: `1px solid ${BORDER}` }}
                      >
                        <div className="flex items-center gap-2 text-sm text-white">
                          <span className="px-2 py-1 rounded text-xs text-white" style={{ background: ICON_BG }}>{r.from}</span>
                          <ArrowLeftRight className="w-3 h-3" style={{ color: MUTED_DIM }} />
                          <span className="px-2 py-1 rounded text-xs" style={{ background: ICON_BG, color: MUTED }}>{r.to}</span>
                        </div>
                        <span className="text-xs" style={{ color: MUTED }}>{r.rate}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* SEPA */}
        <TabsContent value="sepa" className="space-y-6">
          <Card style={cardStyle}>
            <CardContent className="p-6 sm:p-10">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
                <SepaMockup />
                <div>
                  <Badge className="mb-3 border-0" style={{ background: ICON_BG, color: '#fff' }}>
                    IBAN virtuel inclus
                  </Badge>
                  <h2 className="text-2xl sm:text-3xl text-white font-light mb-3">
                    Reçois & envoie en SEPA.
                  </h2>
                  <p className="mb-6 text-sm leading-relaxed" style={{ color: MUTED }}>
                    Chaque utilisateur Terex obtient un IBAN européen pour recevoir des virements,
                    payer ses factures, ou envoyer de l'argent à ses proches en Europe.
                  </p>
                  <div className="space-y-3">
                    {[
                      { i: Building2, t: 'IBAN luxembourgeois ou français' },
                      { i: TrendingUp, t: "Envoi en moins d'1 minute" },
                      { i: Lock, t: 'Conforme PSD2 / DSP2' },
                    ].map((x) => (
                      <div key={x.t} className="flex items-center gap-3 text-sm" style={{ color: MUTED }}>
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={iconTileStyle}>
                          <x.i className="w-4 h-4" style={{ color: ICON_COLOR }} />
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

      <div className="text-center text-xs py-6" style={{ color: MUTED_DIM }}>
        Vision interne · Document de travail Terex
      </div>
    </div>
  );
}

/* ===================== MOCKUPS ===================== */

function TerexCardMockup({ variant = 'signature' }: { variant?: 'signature' | 'classic' | 'virtual' }) {
  const cardBg: React.CSSProperties =
    variant === 'virtual'
      ? { background: '#1e1e1e', border: `1px dashed ${BORDER}` }
      : variant === 'classic'
      ? { background: '#2d2d2d' }
      : { background: '#1a1a1a' };

  return (
    <div
      className="relative w-[320px] sm:w-[360px] aspect-[1.586/1] rounded-2xl shadow-2xl p-5 flex flex-col justify-between overflow-hidden"
      style={{
        ...cardBg,
        boxShadow: '0 30px 60px -20px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.07) inset',
      }}
    >
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)',
          backgroundSize: '14px 14px',
        }}
      />

      {/* Top: logo + edition */}
      <div className="relative flex items-start justify-between">
        <div className="flex items-center gap-2">
          <img src={TEREX_LOGO} alt="Terex" className="w-9 h-9 rounded-md object-contain p-0.5" style={{ background: 'rgba(0,0,0,0.3)' }} />
          <div>
            <div className="text-white text-base font-light tracking-[0.3em]">TEREX</div>
            <div className="text-[9px] uppercase tracking-widest mt-0.5" style={{ color: MUTED }}>
              {variant === 'signature' ? 'Signature' : variant === 'classic' ? 'Classic' : 'Virtual'}
            </div>
          </div>
        </div>
        <Wifi className="w-5 h-5 rotate-90" style={{ color: 'rgba(255,255,255,0.7)' }} />
      </div>

      <div className="relative w-10 h-7 rounded-md opacity-90" style={{ background: 'rgba(255,255,255,0.18)' }}>
        <div className="absolute inset-1 rounded-sm" style={{ border: '1px solid rgba(255,255,255,0.2)' }} />
      </div>

      <div className="relative">
        <div className="text-white/90 tracking-[0.25em] text-base font-light mb-2">
          •••• •••• •••• 2580
        </div>
        <div className="flex items-end justify-between">
          <div>
            <div className="text-[9px] uppercase tracking-wider" style={{ color: MUTED }}>Titulaire</div>
            <div className="text-xs text-white tracking-wide">A. DIOP</div>
          </div>
          <div className="text-white text-sm font-light italic">mastercard</div>
        </div>
      </div>
    </div>
  );
}

function CardVariantTile({ variant, name, tag }: { variant: 'signature' | 'classic' | 'virtual'; name: string; tag: string }) {
  return (
    <Card className="overflow-hidden" style={cardStyle}>
      <div className="p-6 flex justify-center" style={{ background: SUBTLE_TINT }}>
        <div className="scale-75">
          <TerexCardMockup variant={variant} />
        </div>
      </div>
      <CardContent className="p-4 text-center">
        <div className="text-white font-light">{name}</div>
        <div className="text-xs mt-1" style={{ color: MUTED_DIM }}>{tag}</div>
      </CardContent>
    </Card>
  );
}

function PhoneAccountMockup() {
  return (
    <div
      className="relative mx-auto w-[260px] h-[540px] rounded-[44px] overflow-hidden"
      style={{ border: '10px solid #1a1a1a', background: '#141414', boxShadow: '0 40px 80px -20px rgba(0,0,0,0.6)' }}
    >
      <div className="absolute top-2 left-1/2 -translate-x-1/2 w-24 h-6 rounded-full z-10" style={{ background: '#141414' }} />
      <div className="h-full p-4 pt-10 text-white flex flex-col" style={{ background: '#141414' }}>
        <div className="flex items-center justify-between text-xs mb-4" style={{ color: MUTED }}>
          <span>9:41</span>
          <img src={TEREX_LOGO} alt="Terex" className="w-5 h-5 rounded" />
        </div>
        <div className="text-xs" style={{ color: MUTED }}>Solde total</div>
        <div className="text-3xl font-light mt-1">1 248,50 €</div>
        <div className="text-[10px] mt-1" style={{ color: MUTED }}>≈ 1 358 USDT</div>

        <div className="grid grid-cols-4 gap-2 mt-5">
          {['Envoyer', 'Recevoir', 'Convertir', 'Carte'].map((a) => (
            <div key={a} className="text-center">
              <div className="w-10 h-10 mx-auto rounded-full" style={{ background: ICON_BG, border: `1px solid ${BORDER}` }} />
              <div className="text-[9px] mt-1" style={{ color: MUTED }}>{a}</div>
            </div>
          ))}
        </div>

        <div className="mt-5 space-y-2">
          {[
            { n: 'USDT', s: '1 358', sub: 'Tether' },
            { n: 'EUR', s: '420,00', sub: 'Euro' },
            { n: 'XOF', s: '85 200', sub: 'Franc CFA' },
          ].map((c) => (
            <div key={c.n} className="flex items-center justify-between rounded-xl p-2.5" style={{ background: ICON_BG }}>
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-medium" style={{ background: 'rgba(255,255,255,0.1)', color: ICON_COLOR }}>
                  {c.n[0]}
                </div>
                <div>
                  <div className="text-xs">{c.n}</div>
                  <div className="text-[9px]" style={{ color: MUTED_DIM }}>{c.sub}</div>
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
    <div className="rounded-3xl p-6 max-w-sm mx-auto w-full" style={{ background: '#141414', border: `1px solid ${BORDER}` }}>
      <div className="flex items-center gap-2 mb-4">
        <img src={TEREX_LOGO} alt="Terex" className="w-6 h-6 rounded" />
        <span className="text-white text-sm font-light">Convertir</span>
      </div>

      <div className="text-xs mb-2" style={{ color: MUTED }}>Vous payez</div>
      <div className="rounded-2xl p-4 flex items-center justify-between" style={{ background: ICON_BG }}>
        <input
          className="bg-transparent text-2xl text-white font-light w-32 outline-none"
          defaultValue="100.00"
          readOnly
        />
        <div className="flex items-center gap-2 rounded-full px-3 py-1.5" style={{ background: 'rgba(255,255,255,0.1)' }}>
          <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-medium" style={{ background: 'rgba(255,255,255,0.18)', color: '#fff' }}>
            U
          </div>
          <span className="text-sm text-white">USDT</span>
        </div>
      </div>

      <div className="flex justify-center my-3">
        <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: ICON_BG, border: `1px solid ${BORDER}` }}>
          <ArrowLeftRight className="w-4 h-4 rotate-90" style={{ color: ICON_COLOR }} />
        </div>
      </div>

      <div className="text-xs mb-2" style={{ color: MUTED }}>Vous recevez</div>
      <div className="rounded-2xl p-4 flex items-center justify-between" style={{ background: ICON_BG }}>
        <div className="text-2xl text-white font-light">61 500</div>
        <div className="flex items-center gap-2 rounded-full px-3 py-1.5" style={{ background: 'rgba(255,255,255,0.1)' }}>
          <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-medium" style={{ background: 'rgba(255,255,255,0.18)', color: '#fff' }}>
            F
          </div>
          <span className="text-sm text-white">XOF</span>
        </div>
      </div>

      <div className="mt-4 text-[11px] flex justify-between" style={{ color: MUTED_DIM }}>
        <span>Taux : 1 USDT = 615 FCFA</span>
        <span style={{ color: MUTED }}>0 frais</span>
      </div>

      <button
        className="mt-4 w-full rounded-xl py-3 text-sm transition"
        style={{ background: '#fff', color: '#141414', fontWeight: 700 }}
      >
        Convertir maintenant
      </button>
    </div>
  );
}

function SepaMockup() {
  return (
    <div className="rounded-3xl p-6 max-w-sm mx-auto w-full space-y-4" style={{ background: '#141414', border: `1px solid ${BORDER}` }}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img src={TEREX_LOGO} alt="Terex" className="w-6 h-6 rounded" />
          <span className="text-white text-sm font-light">Mon IBAN</span>
        </div>
        <Badge className="text-[10px] border-0" style={{ background: ICON_BG, color: '#fff' }}>
          Actif
        </Badge>
      </div>
      <div className="rounded-2xl p-4" style={{ background: SUBTLE_TINT, border: `1px solid ${BORDER}` }}>
        <div className="text-[10px] uppercase tracking-wider mb-1" style={{ color: MUTED }}>IBAN</div>
        <div className="text-white font-mono text-sm tracking-wider">LU28 0019 4006 4475 0000</div>
        <div className="text-[10px] mt-2" style={{ color: MUTED_DIM }}>BIC : BCEELULL · Titulaire : A. DIOP</div>
      </div>

      <div className="space-y-2">
        <div className="text-xs" style={{ color: MUTED }}>Derniers virements SEPA</div>
        {[
          { n: 'Marie L.', a: '+ 250,00 €', d: "Reçu · Aujourd'hui" },
          { n: 'EDF Énergie', a: '- 89,40 €', d: 'Prélèvement · Hier' },
          { n: 'Salaire', a: '+ 1 800,00 €', d: 'Virement · 22 avr.' },
        ].map((t) => (
          <div key={t.n} className="flex items-center justify-between rounded-xl p-3" style={{ background: ICON_BG }}>
            <div>
              <div className="text-xs text-white">{t.n}</div>
              <div className="text-[10px]" style={{ color: MUTED_DIM }}>{t.d}</div>
            </div>
            <div className="text-xs font-light" style={{ color: t.a.startsWith('+') ? '#fff' : MUTED }}>
              {t.a}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
