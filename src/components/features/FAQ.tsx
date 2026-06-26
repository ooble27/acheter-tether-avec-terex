import { useState } from 'react';
import { ChevronDown, Mail, MessageCircle, Phone, Clock, BookOpen, ShieldCheck, FileText, Info } from 'lucide-react';

interface FAQProps {
  onNavigate?: (section: string) => void;
}

const CARD = '#1e1e1e';
const BORDER = 'rgba(255,255,255,0.07)';
const ACCENT = '#3B968F';
const ICON_BG = 'rgba(255,255,255,0.06)';

const faqItems = [
  {
    q: 'Comment acheter des USDT sur Terex ?',
    a: "Rendez-vous dans la section « Acheter USDT », choisissez votre devise (CFA ou CAD), entrez le montant, sélectionnez votre réseau de réception et votre adresse USDT. Suivez ensuite les instructions de paiement.",
  },
  {
    q: 'Quels réseaux sont supportés ?',
    a: 'Nous supportons TRC20 (Tron), BEP20 (BSC), ERC20 (Ethereum), Arbitrum et Polygon. Chaque réseau a ses propres frais et délais de confirmation.',
  },
  {
    q: 'Combien de temps prend une transaction ?',
    a: 'Toutes nos transactions sont traitées sous 5 minutes après confirmation du paiement — achats, ventes et virements internationaux compris.',
  },
  {
    q: 'Quels sont les frais de transaction ?',
    a: 'Nos frais sont transparents et compétitifs. Les frais de réseau blockchain sont inclus dans nos taux de change. Aucun frais caché.',
  },
  {
    q: 'Comment vendre mes USDT ?',
    a: "Dans la section « Vendre USDT », entrez le montant à vendre, choisissez votre réseau d'envoi et fournissez vos coordonnées de réception (Orange Money ou Wave). Vous recevrez votre argent sous 5 minutes.",
  },
  {
    q: "Vers quels pays puis-je envoyer de l'argent ?",
    a: "Sénégal, Côte d'Ivoire, Mali, Burkina Faso et Niger. D'autres pays africains seront ajoutés prochainement.",
  },
  {
    q: 'Quels sont les montants minimum et maximum ?',
    a: 'Minimum 50 000 CFA pour l'achat (Mobile Money et carte). Minimum 50 USDT pour la vente. 10 CAD pour les virements. Les maximums dépendent de votre niveau de vérification.',
  },
  {
    q: 'La plateforme est-elle sécurisée ?',
    a: 'Oui, Terex utilise le chiffrement SSL et respecte les normes de sécurité bancaire. Vos fonds et données personnelles sont protégés.',
  },
  {
    q: 'Comment contacter le support ?',
    a: "Notre équipe support est disponible 24/7 par email, chat en direct ou téléphone. Nous répondons sous 30 minutes maximum.",
  },
  {
    q: 'Puis-je annuler une transaction ?',
    a: 'Une fois confirmée et en traitement, une transaction ne peut pas être annulée. Vérifiez toutes les informations avant de confirmer.',
  },
];

const supportItems = [
  { Icon: Mail,          label: 'Email',         value: 'Terangaexchange@gmail.com' },
  { Icon: MessageCircle, label: 'Chat en direct', value: 'Disponible 24/7' },
  { Icon: Phone,         label: 'Téléphone',      value: '+1 (418) 261-9091' },
];

const resources = [
  { Icon: BookOpen,    label: "Guide d'utilisation",       id: 'user-guide'       },
  { Icon: ShieldCheck, label: 'Politique de sécurité',     id: 'security-policy'  },
  { Icon: FileText,    label: "Conditions d'utilisation",  id: 'terms-of-service' },
  { Icon: Info,        label: 'À propos de Terex',         id: 'about-terex'      },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: `1px solid ${BORDER}` }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', padding: '18px 0', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}
      >
        <span style={{ color: '#fff', fontSize: '14px', fontWeight: 500, lineHeight: 1.4 }}>{q}</span>
        <ChevronDown
          size={16}
          color="#6b7280"
          style={{ flexShrink: 0, transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.22s ease' }}
        />
      </button>
      <div style={{ maxHeight: open ? '300px' : '0', overflow: 'hidden', transition: 'max-height 0.28s ease' }}>
        <p style={{ color: '#9ca3af', fontSize: '13px', lineHeight: 1.6, paddingBottom: '16px', margin: 0 }}>{a}</p>
      </div>
    </div>
  );
}

export function FAQ({ onNavigate }: FAQProps) {
  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '32px 20px 120px' }}>

      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <p style={{ color: '#6b7280', fontSize: '12px', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 4px' }}>Aide</p>
        <h1 style={{ color: '#fff', fontSize: '26px', fontWeight: 700, margin: 0, letterSpacing: '-0.4px' }}>Questions fréquentes</h1>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px' }}>

        {/* FAQ accordion */}
        <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: '20px', padding: '0 24px' }}>
          {faqItems.map((item, i) => (
            <FAQItem key={i} q={item.q} a={item.a} />
          ))}
        </div>

        {/* Bottom row: support + resources */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>

          {/* Support */}
          <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: '20px', padding: '20px' }}>
            <p style={{ color: '#fff', fontSize: '15px', fontWeight: 600, margin: '0 0 16px' }}>Support client</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {supportItems.map(({ Icon, label, value }) => (
                <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: ICON_BG, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon size={16} color="rgba(255,255,255,0.75)" strokeWidth={1.8} />
                  </div>
                  <div>
                    <p style={{ color: '#6b7280', fontSize: '11px', margin: '0 0 1px', fontWeight: 500 }}>{label}</p>
                    <p style={{ color: '#fff', fontSize: '13px', margin: 0, fontWeight: 500 }}>{value}</p>
                  </div>
                </div>
              ))}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingTop: '4px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: ICON_BG, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Clock size={16} color="rgba(255,255,255,0.75)" strokeWidth={1.8} />
                </div>
                <div>
                  <p style={{ color: '#6b7280', fontSize: '11px', margin: '0 0 1px', fontWeight: 500 }}>Disponibilité</p>
                  <p style={{ color: '#fff', fontSize: '13px', margin: 0, fontWeight: 500 }}>24h/24 · 7j/7</p>
                </div>
              </div>
            </div>
          </div>

          {/* Resources */}
          <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: '20px', padding: '20px' }}>
            <p style={{ color: '#fff', fontSize: '15px', fontWeight: 600, margin: '0 0 16px' }}>Ressources</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {resources.map(({ Icon, label, id }) => (
                <button
                  key={id}
                  onClick={() => onNavigate?.(id)}
                  style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px', borderRadius: '12px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', width: '100%' }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.04)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'none')}
                >
                  <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: ICON_BG, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon size={16} color="rgba(255,255,255,0.75)" strokeWidth={1.8} />
                  </div>
                  <span style={{ color: '#d1d5db', fontSize: '13px', fontWeight: 500 }}>{label}</span>
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
