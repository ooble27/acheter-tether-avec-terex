
import React from 'react';
import { Home, TrendingDown, Globe } from 'lucide-react';

interface MobileBottomNavProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

export function MobileBottomNav({ activeSection, setActiveSection }: MobileBottomNavProps) {
  const navItems = [
    { id: 'home', icon: Home, label: 'Accueil' },
    { id: 'buy', label: 'Acheter', isUsdt: true },
    { id: 'sell', icon: TrendingDown, label: 'Vendre' },
    { id: 'transfer', icon: Globe, label: 'Virement' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      <div
        style={{
          margin: '0 12px 16px',
          background: 'rgba(14, 14, 14, 0.96)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          borderRadius: '20px',
          border: '1px solid rgba(255,255,255,0.06)',
          boxShadow: '0 -2px 40px rgba(0,0,0,0.6), 0 8px 32px rgba(0,0,0,0.5)',
          padding: '8px 4px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
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
                  padding: '6px 16px',
                  border: 'none',
                  background: 'none',
                  cursor: 'pointer',
                  position: 'relative',
                  transition: 'opacity 0.15s',
                }}
              >
                <div
                  style={{
                    width: '40px',
                    height: '36px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '12px',
                    background: isActive ? 'rgba(20, 184, 166, 0.12)' : 'transparent',
                    transition: 'background 0.2s',
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
                  {isActive && (
                    <span
                      style={{
                        position: 'absolute',
                        bottom: '-2px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: '4px',
                        height: '4px',
                        borderRadius: '50%',
                        background: '#14b8a6',
                        boxShadow: '0 0 6px rgba(20,184,166,0.8)',
                      }}
                    />
                  )}
                </div>
                <span
                  style={{
                    fontSize: '10px',
                    fontWeight: isActive ? 500 : 400,
                    color: isActive ? '#14b8a6' : '#6b7280',
                    transition: 'color 0.2s',
                    letterSpacing: '0.01em',
                  }}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
