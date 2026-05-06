import React from 'react';
import { Home, TrendingDown, Globe, Clock } from 'lucide-react';

const UsdtIcon = ({ active }: { active: boolean }) => (
  <img
    src="https://coin-images.coingecko.com/coins/images/325/large/Tether.png"
    alt="USDT"
    style={{ width: 22, height: 22, objectFit: 'contain', display: 'block', filter: active ? 'none' : 'grayscale(60%) opacity(0.55)' }}
  />
);

interface MobileBottomNavProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

const navItems = [
  { id: 'home',     icon: Home,        label: 'Accueil',  custom: false },
  { id: 'buy',      icon: null,        label: 'Acheter',  custom: true  },
  { id: 'sell',     icon: TrendingDown, label: 'Vendre',  custom: false },
  { id: 'history',  icon: Clock,       label: 'Historique', custom: false },
];

export function MobileBottomNav({ activeSection, setActiveSection }: MobileBottomNavProps) {
  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        paddingBottom: 'env(safe-area-inset-bottom, 8px)',
        paddingLeft: 12,
        paddingRight: 12,
        paddingTop: 0,
      }}
    >
      <div
        style={{
          background: 'rgba(18,18,18,0.92)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderRadius: 24,
          border: '1px solid rgba(255,255,255,0.07)',
          boxShadow: '0 -2px 40px rgba(0,0,0,0.5), 0 0 0 0.5px rgba(255,255,255,0.04) inset',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-around',
          padding: '6px 4px',
          marginBottom: 8,
        }}
      >
        {navItems.map((item) => {
          const isActive = activeSection === item.id;
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 4,
                padding: '8px 16px',
                borderRadius: 16,
                border: 'none',
                cursor: 'pointer',
                background: isActive ? 'rgba(59,150,143,0.15)' : 'transparent',
                transition: 'background 0.2s',
                WebkitTapHighlightColor: 'transparent',
                minWidth: 60,
                flex: 1,
              }}
            >
              {/* icon */}
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {item.custom ? (
                  <UsdtIcon active={isActive} />
                ) : (
                  <Icon
                    size={22}
                    strokeWidth={isActive ? 2.2 : 1.6}
                    color={isActive ? '#3B968F' : 'rgba(255,255,255,0.35)'}
                  />
                )}
                {isActive && (
                  <span style={{
                    position: 'absolute',
                    bottom: -5,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: 4,
                    height: 4,
                    borderRadius: '50%',
                    background: '#3B968F',
                    display: 'block',
                  }} />
                )}
              </div>
              {/* label */}
              <span style={{
                fontSize: 10,
                fontWeight: isActive ? 600 : 400,
                color: isActive ? '#3B968F' : 'rgba(255,255,255,0.35)',
                letterSpacing: '0.01em',
                whiteSpace: 'nowrap',
              }}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
