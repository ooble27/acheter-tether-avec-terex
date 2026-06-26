import React from 'react';
import { House, ArrowDownCircle, ArrowUpCircle, ArrowRightLeft } from 'lucide-react';

interface MobileBottomNavProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

const navItems = [
  { id: 'home',     Icon: House,           label: 'Accueil'  },
  { id: 'buy',      Icon: ArrowDownCircle, label: 'Acheter'  },
  { id: 'sell',     Icon: ArrowUpCircle,   label: 'Vendre'   },
  { id: 'transfer', Icon: ArrowRightLeft,  label: 'Virement' },
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
        padding: '0 20px calc(20px + env(safe-area-inset-bottom))',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          background: '#1e1e1e',
          borderRadius: '24px',
          padding: '8px',
          boxShadow: '0 8px 40px rgba(0,0,0,0.55), 0 2px 12px rgba(0,0,0,0.3)',
          border: '1px solid rgba(255,255,255,0.07)',
          width: '100%',
          maxWidth: '390px',
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
                padding: isActive ? '13px 18px' : '13px 15px',
                background: isActive ? '#2d2d2d' : 'transparent',
                borderRadius: '16px',
                border: 'none',
                cursor: 'pointer',
                transition: 'background 0.25s ease, padding 0.25s ease',
                outline: 'none',
                WebkitTapHighlightColor: 'transparent',
                flexShrink: 0,
              }}
            >
              <Icon
                size={21}
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
