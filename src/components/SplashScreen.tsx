
import React, { useEffect, useState } from 'react';

interface SplashScreenProps {
  onComplete: () => void;
  minDuration?: number;
}

// Petites pièces USDT qui s'envolent
const COINS = [
  { left: '12%', delay: 0.0,  size: 34, dur: 2.6 },
  { left: '24%', delay: 0.5,  size: 26, dur: 3.0 },
  { left: '38%', delay: 0.2,  size: 44, dur: 2.4 },
  { left: '52%', delay: 0.8,  size: 30, dur: 2.8 },
  { left: '66%', delay: 0.35, size: 38, dur: 2.5 },
  { left: '78%', delay: 0.65, size: 24, dur: 3.1 },
  { left: '88%', delay: 0.1,  size: 32, dur: 2.7 },
];

const USDT_LOGO = 'https://coin-images.coingecko.com/coins/images/325/large/Tether.png';

export const SplashScreen: React.FC<SplashScreenProps> = ({
  onComplete,
  minDuration = 3200,
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onComplete, 500);
    }, minDuration);
    return () => clearTimeout(timer);
  }, [onComplete, minDuration]);

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center overflow-hidden"
      style={{
        background: 'radial-gradient(circle at 50% 40%, #1c1c1c 0%, #0e0e0e 100%)',
        transition: 'opacity 0.5s ease',
        opacity: isVisible ? 1 : 0,
      }}
    >
      <style>{`
        @keyframes tx-coin-fly {
          0%   { transform: translateY(110vh) scale(0.6) rotate(0deg); opacity: 0; }
          12%  { opacity: 1; }
          85%  { opacity: 1; }
          100% { transform: translateY(-20vh) scale(1) rotate(360deg); opacity: 0; }
        }
        @keyframes tx-ring {
          0%   { transform: scale(0.4); opacity: 0.0; }
          40%  { opacity: 0.55; }
          100% { transform: scale(1.8); opacity: 0; }
        }
        @keyframes tx-core-pulse {
          0%,100% { transform: scale(1);    box-shadow: 0 0 0 0 rgba(255,255,255,0.10); }
          50%     { transform: scale(1.06); box-shadow: 0 0 40px 6px rgba(255,255,255,0.06); }
        }
        @keyframes tx-spark {
          0%   { transform: translate(0,0) scale(1); opacity: 1; }
          100% { transform: translate(var(--dx), var(--dy)) scale(0); opacity: 0; }
        }
        @keyframes tx-dots {
          0%, 80%, 100% { opacity: 0.25; transform: translateY(0); }
          40%           { opacity: 1;    transform: translateY(-5px); }
        }
        @keyframes tx-fade-up {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* Pièces USDT qui s'envolent en arrière-plan */}
      <div className="absolute inset-0 pointer-events-none">
        {COINS.map((c, i) => (
          <img
            key={i}
            src={USDT_LOGO}
            alt=""
            aria-hidden="true"
            style={{
              position: 'absolute',
              left: c.left,
              bottom: 0,
              width: c.size,
              height: c.size,
              opacity: 0,
              filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.5))',
              animation: `tx-coin-fly ${c.dur}s ${c.delay}s ease-in-out infinite`,
            }}
          />
        ))}
      </div>

      {/* Centre : noyau pulsant avec anneaux qui se propagent */}
      <div className="relative z-10 flex flex-col items-center">
        <div style={{ position: 'relative', width: 140, height: 140, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {/* Anneaux concentriques */}
          {[0, 0.6, 1.2].map((d, i) => (
            <span
              key={i}
              style={{
                position: 'absolute',
                width: 120,
                height: 120,
                borderRadius: '50%',
                border: '1.5px solid rgba(255,255,255,0.18)',
                animation: `tx-ring 2.4s ${d}s ease-out infinite`,
              }}
            />
          ))}

          {/* Étincelles qui jaillissent */}
          {Array.from({ length: 8 }).map((_, i) => {
            const angle = (i / 8) * Math.PI * 2;
            const dx = `${Math.cos(angle) * 70}px`;
            const dy = `${Math.sin(angle) * 70}px`;
            return (
              <span
                key={`s${i}`}
                style={{
                  position: 'absolute',
                  width: 4,
                  height: 4,
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.8)',
                  ['--dx' as any]: dx,
                  ['--dy' as any]: dy,
                  animation: `tx-spark 1.6s ${0.2 * i}s ease-out infinite`,
                }}
              />
            );
          })}

          {/* Noyau central : pièce USDT */}
          <div
            style={{
              width: 78,
              height: 78,
              borderRadius: '50%',
              background: '#1e1e1e',
              border: '1px solid rgba(255,255,255,0.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              animation: 'tx-core-pulse 1.8s ease-in-out infinite',
            }}
          >
            <img src={USDT_LOGO} alt="USDT" style={{ width: 48, height: 48 }} />
          </div>
        </div>

        {/* Légende + points de chargement */}
        <p
          style={{
            marginTop: 34,
            color: 'rgba(255,255,255,0.55)',
            fontSize: 13,
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            fontWeight: 500,
            animation: 'tx-fade-up 0.8s 0.3s both',
          }}
        >
          Sécurisation des transactions
        </p>
        <div style={{ display: 'flex', gap: 6, marginTop: 14 }}>
          {[0, 1, 2].map(i => (
            <span
              key={i}
              style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: '#fff',
                animation: `tx-dots 1.4s ${i * 0.2}s ease-in-out infinite`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
