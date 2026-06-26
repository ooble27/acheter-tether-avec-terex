import React from 'react';
import { House, Coins, HandCoins, Send } from 'lucide-react';

interface DesktopBottomNavProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

const navItems = [
  { id: 'home',     Icon: House,     label: 'Accueil'  },
  { id: 'buy',      Icon: Coins,     label: 'Acheter'  },
  { id: 'sell',     Icon: HandCoins, label: 'Vendre'   },
  { id: 'transfer', Icon: Send,      label: 'Virement' },
];

export function DesktopBottomNav({ activeSection, setActiveSection }: DesktopBottomNavProps) {
  return (
    <div
      style={{
        position: 'fixed',
        bottom: '28px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 50,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          background: 'rgba(30, 30, 30, 0.97)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          borderRadius: '20px',
          border: '1px solid rgba(255,255,255,0.07)',
          boxShadow: 'none',
          padding: '6px',
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
                gap: isActive ? '9px' : '0px',
                padding: isActive ? '12px 22px' : '12px 18px',
                background: isActive ? '#2d2d2d' : 'transparent',
                borderRadius: '14px',
                border: 'none',
                cursor: 'pointer',
                transition: 'background 0.25s ease, padding 0.25s ease',
                outline: 'none',
                minWidth: '60px',
              }}
              onMouseEnter={(e) => {
                if (!isActive) (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.05)';
              }}
              onMouseLeave={(e) => {
                if (!isActive) (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
              }}
            >
              <Icon
                size={19}
                color={isActive ? '#ffffff' : '#71717a'}
                strokeWidth={isActive ? 2.1 : 1.7}
                style={{ flexShrink: 0, transition: 'color 0.2s ease' }}
              />
              <span
                style={{
                  color: '#ffffff',
                  fontSize: '13.5px',
                  fontWeight: 600,
                  whiteSpace: 'nowrap',
                  maxWidth: isActive ? '90px' : '0px',
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
