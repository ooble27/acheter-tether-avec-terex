import React from 'react';
import { LayoutDashboard, TrendingDown, ArrowLeftRight } from 'lucide-react';

interface MobileBottomNavProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

export function MobileBottomNav({ activeSection, setActiveSection }: MobileBottomNavProps) {
  const navItems = [
    { id: 'home', icon: LayoutDashboard, label: 'Accueil' },
    { id: 'buy', label: 'Acheter', isUsdt: true },
    { id: 'sell', icon: TrendingDown, label: 'Vendre' },
    { id: 'transfer', icon: ArrowLeftRight, label: 'Virement' },
  ];

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}
    >
      <div
        style={{
          background: 'rgba(24, 24, 30, 0.97)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderTop: '1px solid rgba(255,255,255,0.07)',
          padding: '8px 0 12px',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-around',
            alignItems: 'flex-end',
          }}
        >
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            const Icon = item.icon;
            const isBuy = item.id === 'buy';

            return (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: isBuy ? '6px' : '4px',
                  padding: '0 12px',
                  border: 'none',
                  background: 'none',
                  cursor: 'pointer',
                  WebkitTapHighlightColor: 'transparent',
                  position: 'relative',
                  marginBottom: isBuy ? '2px' : '0',
                }}
              >
                {isBuy ? (
                  <div
                    style={{
                      width: '52px',
                      height: '52px',
                      borderRadius: '16px',
                      background: isActive
                        ? 'linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)'
                        : 'linear-gradient(135deg, #1e2d2c 0%, #1a2827 100%)',
                      border: isActive
                        ? '1.5px solid rgba(20,184,166,0.4)'
                        : '1.5px solid rgba(20,184,166,0.15)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: isActive
                        ? '0 4px 20px rgba(20,184,166,0.35), 0 2px 8px rgba(0,0,0,0.3)'
                        : '0 2px 12px rgba(0,0,0,0.3)',
                      transition: 'all 0.2s ease',
                      marginTop: '-8px',
                    }}
                  >
                    <img
                      src="https://coin-images.coingecko.com/coins/images/325/large/Tether.png"
                      alt="USDT"
                      style={{ width: '28px', height: '28px', display: 'block' }}
                    />
                  </div>
                ) : (
                  <div
                    style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '14px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: isActive ? 'rgba(20,184,166,0.1)' : 'transparent',
                      transition: 'background 0.2s',
                    }}
                  >
                    <Icon
                      style={{
                        width: '22px',
                        height: '22px',
                        color: isActive ? '#14b8a6' : '#71717a',
                        strokeWidth: isActive ? 2 : 1.5,
                        transition: 'all 0.2s',
                      }}
                    />
                  </div>
                )}
                <span
                  style={{
                    fontSize: '10px',
                    fontWeight: isActive ? 600 : 400,
                    color: isActive ? '#14b8a6' : '#71717a',
                    letterSpacing: '0.02em',
                    transition: 'all 0.2s',
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
