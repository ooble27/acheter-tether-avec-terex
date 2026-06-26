import React from 'react';
import { House, Wallet, ArrowLeftRight, Send } from 'lucide-react';

interface MobileBottomNavProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

// Couleurs officielles Terex
const ACCENT = '#3B968F';
const ACCENT_LIGHT = '#4BA89F';
const INACTIVE = '#71717a';
const BG = '#1A1A1A';

export function MobileBottomNav({ activeSection, setActiveSection }: MobileBottomNavProps) {
  const navItems = [
    { id: 'home',     Icon: House,          label: 'Accueil'  },
    { id: 'buy',      Icon: Wallet,         label: 'Acheter'  },
    { id: 'sell',     Icon: ArrowLeftRight, label: 'Vendre'   },
    { id: 'transfer', Icon: Send,           label: 'Virement' },
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
        borderTop: '1px solid rgba(255,255,255,0.05)',
        boxShadow: '0 -8px 24px rgba(0,0,0,0.25)',
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center',
          height: '64px',
          padding: '0 8px',
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
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '5px',
                flex: 1,
                height: '100%',
                border: 'none',
                background: 'none',
                cursor: 'pointer',
                WebkitTapHighlightColor: 'transparent',
                outline: 'none',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '52px',
                  height: '30px',
                  borderRadius: '999px',
                  background: isActive ? 'rgba(59,150,143,0.15)' : 'transparent',
                  transition: 'background 0.25s ease',
                }}
              >
                <Icon
                  size={21}
                  color={isActive ? ACCENT_LIGHT : INACTIVE}
                  strokeWidth={isActive ? 2.3 : 1.8}
                  style={{ transition: 'color 0.2s ease' }}
                />
              </div>
              <span
                style={{
                  fontSize: '10.5px',
                  fontWeight: isActive ? 600 : 450,
                  color: isActive ? ACCENT_LIGHT : INACTIVE,
                  letterSpacing: '0.01em',
                  transition: 'color 0.2s ease',
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
