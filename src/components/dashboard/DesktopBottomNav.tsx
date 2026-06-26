import React from 'react';
import { Home, Wallet, TrendingUp, Send } from 'lucide-react';

interface DesktopBottomNavProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

const TEAL = '#14b8a6';
const INACTIVE = '#6b7280';

export function DesktopBottomNav({ activeSection, setActiveSection }: DesktopBottomNavProps) {
  const navItems = [
    { id: 'home',     Icon: Home,        label: 'Accueil'  },
    { id: 'buy',      Icon: Wallet,      label: 'Acheter'  },
    { id: 'sell',     Icon: TrendingUp,  label: 'Vendre'   },
    { id: 'transfer', Icon: Send,        label: 'Virement' },
  ];

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
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
          background: 'rgba(20, 20, 24, 0.97)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderRadius: '20px',
          border: '1px solid rgba(255,255,255,0.07)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
          padding: '6px',
        }}
      >
        {navItems.map(({ id, Icon, label }) => {
          const isActive = activeSection === id;
          const color = isActive ? TEAL : INACTIVE;

          return (
            <button
              key={id}
              onClick={() => setActiveSection(id)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '4px',
                padding: '10px 22px',
                border: 'none',
                background: isActive ? 'rgba(20, 184, 166, 0.08)' : 'transparent',
                borderRadius: '14px',
                cursor: 'pointer',
                transition: 'background 0.15s',
                outline: 'none',
                minWidth: '76px',
              }}
            >
              <Icon
                size={20}
                color={color}
                strokeWidth={isActive ? 2.2 : 1.6}
                style={{ transition: 'color 0.15s' }}
              />
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: isActive ? 600 : 400,
                  color,
                  letterSpacing: '0.02em',
                  whiteSpace: 'nowrap',
                  transition: 'color 0.15s',
                  fontFamily: 'inherit',
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
