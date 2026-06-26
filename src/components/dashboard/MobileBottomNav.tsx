import React from 'react';
import { Home, Wallet, TrendingUp, Send } from 'lucide-react';

interface MobileBottomNavProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

const TEAL = '#14b8a6';
const INACTIVE = '#6b7280';
const BG = '#17171b';

export function MobileBottomNav({ activeSection, setActiveSection }: MobileBottomNavProps) {
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
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        background: BG,
        borderTop: '1px solid rgba(255,255,255,0.06)',
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center',
          height: '60px',
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
                gap: '3px',
                flex: 1,
                height: '100%',
                border: 'none',
                background: 'none',
                cursor: 'pointer',
                WebkitTapHighlightColor: 'transparent',
                outline: 'none',
              }}
            >
              {isActive && (
                <span
                  style={{
                    position: 'absolute',
                    top: 0,
                    width: '24px',
                    height: '2px',
                    borderRadius: '0 0 2px 2px',
                    background: TEAL,
                    marginBottom: '2px',
                  }}
                />
              )}
              <Icon
                size={22}
                color={color}
                strokeWidth={isActive ? 2.2 : 1.6}
                style={{ transition: 'color 0.15s, stroke-width 0.15s' }}
              />
              <span
                style={{
                  fontSize: '10px',
                  fontWeight: isActive ? 600 : 400,
                  color,
                  letterSpacing: '0.015em',
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
