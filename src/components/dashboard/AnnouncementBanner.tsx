/**
 * Bandeau d'annonce défilant en haut du dashboard.
 *
 * Affiche un ou plusieurs messages qui défilent horizontalement en boucle,
 * pour informer les clients d'un changement important (paiement manuel,
 * maintenance, nouveau taux, etc.).
 */
import { useMemo } from 'react';

interface Announcement {
  text: string;
}

const ANNOUNCEMENTS: Announcement[] = [
  { text: 'Les paiements sont actuellement traités manuellement via Wave. Merci de votre compréhension.' },
];

export function AnnouncementBanner() {
  // Répète les messages une fois pour créer une boucle continue fluide.
  const items = useMemo(() => {
    const line = ANNOUNCEMENTS.map(a => a.text).join('   ·   ');
    return `${line}   ·   ${line}   ·   `;
  }, []);

  return (
    <div
      style={{
        position: 'relative',
        background: 'transparent',
        color: '#ffffff',
        fontSize: '12.5px',
        fontWeight: 400,
        letterSpacing: '0.02em',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        zIndex: 45,
        // Respect de la safe area (notch iOS / PWA)
        paddingTop: 'env(safe-area-inset-top, 0px)',
      }}
    >
      <style>{`
        @keyframes terex-marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        .terex-marquee-track {
          display: inline-block;
          padding: 5px 0;
          animation: terex-marquee 32s linear infinite;
          will-change: transform;
        }
        .terex-marquee-wrap { display: flex; }
        .terex-marquee-wrap > span { padding: 0 24px; }
        @media (prefers-reduced-motion: reduce) {
          .terex-marquee-track { animation-duration: 120s; }
        }
      `}</style>
      <div className="terex-marquee-track">
        <span className="terex-marquee-wrap">
          <span>{items}</span>
          <span>{items}</span>
        </span>
      </div>
    </div>
  );
}
