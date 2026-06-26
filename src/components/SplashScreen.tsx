
import React, { useEffect, useState } from 'react';

interface SplashScreenProps {
  onComplete: () => void;
  minDuration?: number;
}

// Nœuds d'un réseau abstrait — des objets qui se déplacent et se relient
const NODES = [
  { id: 0, x: 50, y: 50, r: 9,  delay: 0.0 },
  { id: 1, x: 22, y: 28, r: 5,  delay: 0.2 },
  { id: 2, x: 78, y: 26, r: 6,  delay: 0.35 },
  { id: 3, x: 18, y: 72, r: 5,  delay: 0.5 },
  { id: 4, x: 82, y: 70, r: 6,  delay: 0.65 },
  { id: 5, x: 50, y: 14, r: 4,  delay: 0.8 },
  { id: 6, x: 50, y: 86, r: 4,  delay: 0.95 },
  { id: 7, x: 33, y: 50, r: 3.5, delay: 1.1 },
  { id: 8, x: 67, y: 50, r: 3.5, delay: 1.2 },
];

// Liens entre nœuds (du centre vers les satellites + quelques arcs)
const LINKS = [
  [0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [0, 6], [0, 7], [0, 8],
  [1, 5], [2, 5], [3, 6], [4, 6], [1, 7], [3, 7], [2, 8], [4, 8],
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
        background: 'radial-gradient(circle at 50% 45%, #1d1d1d 0%, #0d0d0d 100%)',
        transition: 'opacity 0.6s ease',
        opacity: isVisible ? 1 : 0,
      }}
    >
      <style>{`
        @keyframes tx-node-pop {
          0%   { transform: scale(0); opacity: 0; }
          60%  { transform: scale(1.25); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes tx-float {
          0%,100% { transform: translate(0,0); }
          25%     { transform: translate(3px,-4px); }
          50%     { transform: translate(-2px,3px); }
          75%     { transform: translate(-3px,-2px); }
        }
        @keyframes tx-link-draw {
          0%   { stroke-dashoffset: 100; opacity: 0; }
          40%  { opacity: 0.5; }
          100% { stroke-dashoffset: 0; opacity: 0.32; }
        }
        @keyframes tx-pulse-core {
          0%,100% { transform: scale(1);   filter: drop-shadow(0 0 6px rgba(255,255,255,0.25)); }
          50%     { transform: scale(1.18); filter: drop-shadow(0 0 18px rgba(255,255,255,0.45)); }
        }
        @keyframes tx-orbit {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
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

      <div className="relative z-10 flex flex-col items-center">
        <div style={{ position: 'relative', width: 220, height: 220 }}>
          <svg viewBox="0 0 100 100" width="220" height="220" style={{ overflow: 'visible' }}>
            {/* Liens */}
            {LINKS.map(([a, b], i) => {
              const na = NODES[a], nb = NODES[b];
              return (
                <line
                  key={`l${i}`}
                  x1={na.x} y1={na.y} x2={nb.x} y2={nb.y}
                  stroke="rgba(255,255,255,0.5)"
                  strokeWidth="0.5"
                  strokeDasharray="100"
                  style={{ animation: `tx-link-draw 1.4s ${0.3 + i * 0.06}s ease-out forwards` }}
                />
              );
            })}
            {/* Nœuds */}
            {NODES.map((n) => (
              <g
                key={n.id}
                style={{
                  transformOrigin: `${n.x}px ${n.y}px`,
                  animation: n.id === 0
                    ? 'tx-pulse-core 2s ease-in-out infinite'
                    : `tx-node-pop 0.6s ${n.delay}s both, tx-float 4s ${n.delay}s ease-in-out infinite`,
                }}
              >
                <circle
                  cx={n.x} cy={n.y} r={n.r}
                  fill={n.id === 0 ? '#ffffff' : 'rgba(255,255,255,0.85)'}
                />
                {n.id === 0 && (
                  <circle cx={n.x} cy={n.y} r={n.r + 4} fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="0.5" />
                )}
              </g>
            ))}
          </svg>

          {/* Anneau en orbite autour du centre */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              animation: 'tx-orbit 6s linear infinite',
            }}
          >
            <div style={{ position: 'relative', width: 150, height: 150 }}>
              <span style={{ position: 'absolute', top: -3, left: '50%', width: 6, height: 6, borderRadius: '50%', background: 'rgba(255,255,255,0.9)', transform: 'translateX(-50%)' }} />
              <span style={{ position: 'absolute', bottom: -3, left: '50%', width: 4, height: 4, borderRadius: '50%', background: 'rgba(255,255,255,0.6)', transform: 'translateX(-50%)' }} />
            </div>
          </div>
        </div>

        {/* Points de chargement */}
        <div style={{ display: 'flex', gap: 6, marginTop: 26, animation: 'tx-fade-up 0.8s 0.4s both' }}>
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
