import React from 'react';
import { Home, TrendingDown, Globe } from 'lucide-react';

interface DesktopBottomNavProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

export function DesktopBottomNav({ activeSection, setActiveSection }: DesktopBottomNavProps) {
  const navItems = [
    { id: 'home', icon: Home, label: 'Accueil' },
    { id: 'buy', label: 'Acheter', isUsdt: true },
    { id: 'sell', icon: TrendingDown, label: 'Vendre' },
    { id: 'transfer', icon: Globe, label: 'Virement' },
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
          background: 'rgba(14, 14, 14, 0.96)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          borderRadius: '24px',
          border: '1px solid rgba(255,255,255,0.06)',
          boxShadow: '0 8px 40px rgba(0,0,0,0.6), 0 2px 12px rgba(0,0,0,0.4)',
          padding: '6px 8px',
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
                gap: '4px',
                padding: '8px 20px',
                border: 'none',
                background: isActive ? 'rgba(20, 184, 166, 0.1)' : 'transparent',
                borderRadius: '18px',
                cursor: 'pointer',
                transition: 'background 0.2s',
                position: 'relative',
                minWidth: '80px',
              }}
            >
              <div
                style={{
                  width: '24px',
                  height: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                }}
              >
                {item.isUsdt ? (
                  <img
                    src="https://coin-images.coingecko.com/coins/images/325/large/Tether.png"
                    alt="USDT"
                    style={{ width: '22px', height: '22px', display: 'block' }}
                  />
                ) : (
                  <Icon
                    style={{
                      width: '20px',
                      height: '20px',
                      color: isActive ? '#14b8a6' : '#6b7280',
                      transition: 'color 0.2s',
                      strokeWidth: isActive ? 2 : 1.5,
                    }}
                  />
                )}
              </div>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: isActive ? 500 : 400,
                  color: isActive ? '#14b8a6' : '#6b7280',
                  transition: 'color 0.2s',
                  letterSpacing: '0.02em',
                  whiteSpace: 'nowrap',
                }}
              >
                {item.label}
              </span>
              {isActive && (
                <span
                  style={{
                    position: 'absolute',
                    bottom: '4px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '3px',
                    height: '3px',
                    borderRadius: '50%',
                    background: '#14b8a6',
                    boxShadow: '0 0 6px rgba(20,184,166,0.8)',
                  }}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
