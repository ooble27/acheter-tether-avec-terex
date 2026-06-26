import React from 'react';
import { House, Wallet, TrendingUp, ArrowRightLeft } from 'lucide-react';

interface DesktopBottomNavProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

const navItems = [
  { id: 'home',     Icon: House,          label: 'Accueil'  },
  { id: 'buy',      Icon: Wallet,         label: 'Acheter'  },
  { id: 'sell',     Icon: TrendingUp,     label: 'Vendre'   },
  { id: 'transfer', Icon: ArrowRightLeft, label: 'Virement' },
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
      {/* Pill container */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          background: '#1e1e1e',
          borderRadius: '9999px',
          padding: '6px',
          boxShadow: '0 12px 48px rgba(0,0,0,0.55), 0 4px 16px rgba(0,0,0,0.3)',
          border: '1px solid rgba(255,255,255,0.06)',
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
                padding: isActive ? '12px 24px' : '12px 18px',
                background: isActive ? '#2d2d2d' : 'transparent',
                borderRadius: '9999px',
                border: 'none',
                cursor: 'pointer',
                transition: 'background 0.25s ease, padding 0.25s ease',
                outline: 'none',
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.04)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
                }
              }}
            >
              <Icon
                size={20}
                color={isActive ? '#4BA89F' : '#6b7280'}
                strokeWidth={isActive ? 2.2 : 1.7}
                style={{ flexShrink: 0, transition: 'color 0.2s ease' }}
              />
              <span
                style={{
                  color: '#4BA89F',
                  fontSize: '14px',
                  fontWeight: 600,
                  whiteSpace: 'nowrap',
                  maxWidth: isActive ? '100px' : '0px',
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
