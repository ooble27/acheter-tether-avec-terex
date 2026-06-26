
import React, { useEffect, useState } from 'react';

interface SplashScreenProps {
  onComplete: () => void;
  minDuration?: number;
}

// Cryptomonnaies qui rebondissent
const COINS = [
  { sym: '₿',  label: 'BTC',  bg: '#F7931A', delay: 0.0 },
  { sym: 'Ξ',  label: 'ETH',  bg: '#627EEA', delay: 0.15 },
  { sym: '₮',  label: 'USDT', bg: '#26A17B', delay: 0.3 },
  { sym: '$',  label: 'USDC', bg: '#2775CA', delay: 0.45 },
];

export const SplashScreen: React.FC<SplashScreenProps> = ({
  onComplete,
  minDuration = 3500,
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onComplete, 600);
    }, minDuration);
    return () => clearTimeout(timer);
  }, [onComplete, minDuration]);

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center overflow-hidden"
      style={{
        background: 'radial-gradient(circle at 50% 42%, #1f1f1f 0%, #0c0c0c 100%)',
        transition: 'opacity 0.6s ease',
        opacity: isVisible ? 1 : 0,
      }}
    >
      <style>{`
        @keyframes tx-bounce {
          0%   { transform: translateY(0)     scale(1, 1);     }
          18%  { transform: translateY(-72px) scale(0.94,1.06);}
          36%  { transform: translateY(0)     scale(1.08,0.92);}
          50%  { transform: translateY(-30px) scale(0.97,1.03);}
          66%  { transform: translateY(0)     scale(1.05,0.95);}
          80%  { transform: translateY(-12px) scale(1, 1);     }
          100% { transform: translateY(0)     scale(1, 1);     }
        }
        @keyframes tx-shadow {
          0%,100% { transform: scaleX(1);   opacity: 0.35; }
          18%     { transform: scaleX(0.55); opacity: 0.12; }
          50%     { transform: scaleX(0.8);  opacity: 0.22; }
        }
        @keyframes tx-pop-in {
          0%   { transform: scale(0) translateY(-40px); opacity: 0; }
          100% { transform: scale(1) translateY(0);     opacity: 1; }
        }
        @keyframes tx-dots {
          0%,80%,100% { opacity: 0.25; transform: translateY(0); }
          40%         { opacity: 1;    transform: translateY(-5px); }
        }
        @keyframes tx-fade-up {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div className="relative z-10 flex flex-col items-center">
        {/* Pièces qui rebondissent */}
        <div style={{ display: 'flex', gap: 22, alignItems: 'flex-end', height: 130 }}>
          {COINS.map((c) => (
            <div key={c.label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ animation: `tx-pop-in 0.5s ${c.delay}s both` }}>
                <div
                  style={{
                    width: 58,
                    height: 58,
                    borderRadius: '50%',
                    background: c.bg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    fontSize: 28,
                    fontWeight: 700,
                    boxShadow: `0 6px 18px ${c.bg}66, inset 0 2px 4px rgba(255,255,255,0.25)`,
                    animation: `tx-bounce 1.6s ${0.5 + c.delay}s ease-in-out infinite`,
                  }}
                >
                  {c.sym}
                </div>
              </div>
              {/* Ombre au sol */}
              <div
                style={{
                  marginTop: 10,
                  width: 44,
                  height: 8,
                  borderRadius: '50%',
                  background: 'rgba(0,0,0,0.6)',
                  filter: 'blur(3px)',
                  animation: `tx-shadow 1.6s ${0.5 + c.delay}s ease-in-out infinite`,
                }}
              />
              <span
                style={{
                  marginTop: 8,
                  color: 'rgba(255,255,255,0.4)',
                  fontSize: 10,
                  fontWeight: 600,
                  letterSpacing: '0.08em',
                  animation: `tx-fade-up 0.6s ${0.6 + c.delay}s both`,
                }}
              >
                {c.label}
              </span>
            </div>
          ))}
        </div>

        {/* Points de chargement */}
        <div style={{ display: 'flex', gap: 6, marginTop: 30, animation: 'tx-fade-up 0.8s 0.6s both' }}>
          {[0, 1, 2].map(i => (
            <span
              key={i}
              style={{
                width: 6, height: 6, borderRadius: '50%', background: '#fff',
                animation: `tx-dots 1.4s ${i * 0.2}s ease-in-out infinite`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
