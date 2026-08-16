import React from 'react';
import { House, Coins, HandCoins, Send } from 'lucide-react';

interface MobileBottomNavProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

const navItems = [
  { id: 'home', Icon: House,     label: 'Accueil' },
  { id: 'buy',  Icon: Coins,     label: 'Acheter' },
  { id: 'sell', Icon: HandCoins, label: 'Vendre'  },
  { id: 'send', Icon: Send,      label: 'Envoyer' },
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
        display: 'flex',
        justifyContent: 'center',
        padding: '0 20px calc(12px + env(safe-area-inset-bottom))',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          background: 'rgba(30,30,30,0.95)',
          borderRadius: '22px',
          padding: '8px',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.07)',
          width: '100%',
          maxWidth: '320px',
          justifyContent: 'space-around',
        }}
      >
        {navItems.map(({ id, Icon, label }) => {
          const isActive = activeSection === id;

          return (
            <button
              key={id}
              onClick={() => setActiveSection(id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: isActive ? '8px' : '0px',
                padding: isActive ? '12px 18px' : '12px 15px',
                background: isActive ? '#2d2d2d' : 'transparent',
                borderRadius: '16px',
                border: 'none',
                cursor: 'pointer',
                transition: 'background 0.3s cubic-bezier(0.4,0,0.2,1), padding 0.3s cubic-bezier(0.4,0,0.2,1)',
                outline: 'none',
                WebkitTapHighlightColor: 'transparent',
                flexShrink: 0,
              }}
            >
              <Icon
                size={20}
                color={isActive ? '#ffffff' : '#71717a'}
                strokeWidth={isActive ? 2.1 : 1.7}
                style={{ flexShrink: 0, transition: 'color 0.2s ease' }}
              />
              <span
                style={{
                  color: '#ffffff',
                  fontSize: '13px',
                  fontWeight: 600,
                  whiteSpace: 'nowrap',
                  maxWidth: isActive ? '80px' : '0px',
                  opacity: isActive ? 1 : 0,
                  overflow: 'hidden',
                  transition: 'max-width 0.28s ease, opacity 0.2s ease',
                  letterSpacing: '0.01em',
                }}
              >
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
