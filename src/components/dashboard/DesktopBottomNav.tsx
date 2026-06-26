import React from 'react';
import { House, Wallet, ArrowLeftRight, Send } from 'lucide-react';

interface DesktopBottomNavProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

// Couleurs officielles Terex
const ACCENT = '#3B968F';
const ACCENT_LIGHT = '#4BA89F';
const INACTIVE = '#71717a';

export function DesktopBottomNav({ activeSection, setActiveSection }: DesktopBottomNavProps) {
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
          background: 'rgba(26, 26, 26, 0.92)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          borderRadius: '20px',
          border: '1px solid rgba(255,255,255,0.07)',
          boxShadow: '0 12px 40px rgba(0,0,0,0.45)',
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
                gap: '9px',
                padding: '10px 18px',
                border: 'none',
                background: isActive ? 'rgba(59,150,143,0.15)' : 'transparent',
                borderRadius: '14px',
                cursor: 'pointer',
                transition: 'background 0.2s ease',
                outline: 'none',
              }}
              onMouseEnter={(e) => {
                if (!isActive) e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
              }}
              onMouseLeave={(e) => {
                if (!isActive) e.currentTarget.style.background = 'transparent';
              }}
            >
              <Icon
                size={19}
                color={isActive ? ACCENT_LIGHT : INACTIVE}
                strokeWidth={isActive ? 2.3 : 1.8}
                style={{ transition: 'color 0.2s ease' }}
              />
              <span
                style={{
                  fontSize: '13px',
                  fontWeight: isActive ? 600 : 450,
                  color: isActive ? ACCENT_LIGHT : INACTIVE,
                  letterSpacing: '0.01em',
                  whiteSpace: 'nowrap',
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
