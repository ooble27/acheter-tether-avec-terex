import { MessageCircle, Mail, HelpCircle, Clock, Info, ArrowRight } from 'lucide-react';

// ── Design tokens ─────────────────────────────────────────────────
const C = {
  l1: '#212121', l2: '#282828', l3: '#303030',
  bd: '#383838', bds: '#2a2a2a', bdh: '#484848',
  teal: '#3B968F', tealH: '#2d7870', tealT: 'rgba(59,150,143,0.08)', tealB: 'rgba(59,150,143,0.20)',
  t1: '#f0f0f0', t2: '#888888', t3: '#686868',
  em: '#22c55e', emT: 'rgba(34,197,94,0.08)', emB: 'rgba(34,197,94,0.16)',
  purple: '#a855f7', purpleT: 'rgba(168,85,247,0.08)', purpleB: 'rgba(168,85,247,0.20)',
};
const FONT = "'Inter', sans-serif";

// ── SLA hours table ───────────────────────────────────────────────
const HOURS = [
  { day: 'Lun – Ven', time: '08h00 – 20h00', available: true },
  { day: 'Samedi',    time: '09h00 – 17h00', available: true },
  { day: 'Dimanche',  time: 'Fermé',          available: false },
];

// ── Card component ────────────────────────────────────────────────
function SupportCard({
  icon, iconBg, iconColor,
  title, sub, cta, href, onClick,
}: {
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
  title: string;
  sub: string;
  cta: string;
  href?: string;
  onClick?: () => void;
}) {
  return (
    <div style={{
      background: C.l1, border: `1px solid ${C.bds}`,
      borderRadius: 12, padding: '20px',
      display: 'flex', flexDirection: 'column', gap: 16,
      fontFamily: FONT,
      transition: 'border-color 0.15s',
      boxShadow: '0 2px 8px rgba(0,0,0,0.45), 0 1px 2px rgba(0,0,0,0.3)',
    }}
      onMouseEnter={e => (e.currentTarget.style.borderColor = C.bdh)}
      onMouseLeave={e => (e.currentTarget.style.borderColor = C.bds)}
    >
      {/* Icon */}
      <div style={{
        width: 44, height: 44, borderRadius: 10,
        background: iconBg, border: `1px solid ${iconColor.replace(')', ', 0.3)').replace('rgb', 'rgba')}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }}>
        <div style={{ color: iconColor }}>
          {icon}
        </div>
      </div>

      <div>
        <h3 style={{ color: C.t1, fontSize: 14, fontWeight: 600, margin: '0 0 6px' }}>{title}</h3>
        <p style={{ color: C.t3, fontSize: 12, margin: 0, lineHeight: 1.6 }}>{sub}</p>
      </div>

      <a
        href={href || '#'}
        onClick={onClick}
        target={href?.startsWith('http') ? '_blank' : undefined}
        rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          fontSize: 12, fontWeight: 500, color: C.teal,
          background: C.tealT, border: `1px solid ${C.tealB}`,
          borderRadius: 7, padding: '7px 12px',
          textDecoration: 'none', cursor: 'pointer',
          width: 'fit-content', transition: 'background 0.1s',
          fontFamily: FONT,
        }}
        onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(59,150,143,0.14)'; }}
        onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = C.tealT; }}
      >
        {cta}
        <ArrowRight style={{ width: 12, height: 12 }} />
      </a>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────
export function BusinessSupport() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, fontFamily: FONT, paddingTop: 8 }}>
      {/* Page header */}
      <div>
        <h2 style={{ color: C.t1, fontSize: 20, fontWeight: 700, letterSpacing: '-0.025em', lineHeight: 1.2, margin: 0 }}>
          Support B2B
        </h2>
        <p style={{ color: C.t3, fontSize: 12, marginTop: 4, margin: '4px 0 0' }}>
          Aide et assistance dédiée aux comptes professionnels
        </p>
      </div>

      {/* SLA info block */}
      <div style={{
        display: 'flex', alignItems: 'flex-start', gap: 12,
        padding: 16, borderRadius: 10,
        background: C.tealT, border: `1px solid ${C.tealB}`,
      }}>
        <Info style={{ width: 16, height: 16, color: C.teal, flexShrink: 0, marginTop: 1 }} />
        <div>
          <p style={{ color: C.t1, fontSize: 13, fontWeight: 500, margin: '0 0 4px' }}>
            Engagement SLA Terex Business
          </p>
          <p style={{ color: C.t3, fontSize: 12, margin: 0, lineHeight: 1.6 }}>
            Les clients B2B bénéficient d'un délai de réponse garanti sous <strong style={{ color: C.teal }}>2h ouvrées</strong> via WhatsApp ou Email.
            Les paiements sont traités dans un délai de <strong style={{ color: C.teal }}>2–24h ouvrées</strong> après confirmation.
          </p>
        </div>
      </div>

      {/* 4 cards grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
        {/* WhatsApp */}
        <SupportCard
          icon={<MessageCircle style={{ width: 20, height: 20 }} />}
          iconBg={C.emT}
          iconColor={C.em}
          title="WhatsApp Business"
          sub="Contactez notre équipe directement sur WhatsApp. Réponse rapide garantie pour les clients professionnels."
          cta="Ouvrir WhatsApp"
          href="https://wa.me/33600000000?text=Bonjour%2C%20je%20suis%20client%20Terex%20Business%20et%20j'ai%20besoin%20d'assistance."
        />

        {/* Email */}
        <SupportCard
          icon={<Mail style={{ width: 20, height: 20 }} />}
          iconBg={C.tealT}
          iconColor={C.teal}
          title="Email dédié"
          sub="Envoyez-nous un email pour toute demande complexe, document ou suivi de paiement."
          cta="Envoyer un email"
          href="mailto:b2b@terex.io?subject=Support%20Terex%20Business"
        />

        {/* FAQ */}
        <SupportCard
          icon={<HelpCircle style={{ width: 20, height: 20 }} />}
          iconBg={C.purpleT}
          iconColor={C.purple}
          title="FAQ & Documentation"
          sub="Retrouvez les réponses aux questions fréquentes : frais, réseaux, délais, KYC et bien plus."
          cta="Consulter la FAQ"
          href="https://terex.io/faq"
        />

        {/* Hours */}
        <div style={{
          background: C.l1, border: `1px solid ${C.bds}`,
          borderRadius: 12, padding: 20,
          fontFamily: FONT,
          transition: 'border-color 0.15s',
          boxShadow: '0 2px 8px rgba(0,0,0,0.45), 0 1px 2px rgba(0,0,0,0.3)',
        }}
          onMouseEnter={e => (e.currentTarget.style.borderColor = C.bdh)}
          onMouseLeave={e => (e.currentTarget.style.borderColor = C.bds)}
        >
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <div style={{
              width: 44, height: 44, borderRadius: 10,
              background: 'rgba(245,158,11,0.08)',
              border: '1px solid rgba(245,158,11,0.20)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Clock style={{ width: 20, height: 20, color: '#f59e0b' }} />
            </div>
            <div>
              <h3 style={{ color: C.t1, fontSize: 14, fontWeight: 600, margin: 0 }}>Horaires d'ouverture</h3>
              <p style={{ color: C.t3, fontSize: 11, margin: '2px 0 0' }}>Heure de Paris (CET/CEST)</p>
            </div>
          </div>

          {/* Hours table */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {HOURS.map((row, i) => (
              <div
                key={row.day}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '9px 0',
                  borderBottom: i < HOURS.length - 1 ? `1px solid ${C.bds}` : 'none',
                }}
              >
                <span style={{ fontSize: 12, color: C.t2 }}>{row.day}</span>
                <span style={{
                  fontSize: 12, fontWeight: 500,
                  color: row.available ? C.t1 : C.t3,
                }}>
                  {row.available ? (
                    row.time
                  ) : (
                    <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                      <span style={{
                        width: 6, height: 6, borderRadius: '50%',
                        background: C.t3, display: 'inline-block',
                      }} />
                      {row.time}
                    </span>
                  )}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}
