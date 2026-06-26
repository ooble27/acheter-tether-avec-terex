import React from 'react';
import { LayoutDashboard, TrendingDown, ArrowLeftRight } from 'lucide-react';

interface DesktopBottomNavProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

export function DesktopBottomNav({ activeSection, setActiveSection }: DesktopBottomNavProps) {
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
          gap: '2px',
          background: 'rgba(24, 24, 30, 0.97)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderRadius: '22px',
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.45), 0 2px 8px rgba(0,0,0,0.3)',
          padding: '6px',
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
                justifyContent: 'center',
                gap: '5px',
                padding: isBuy ? '10px 22px' : '10px 20px',
                border: 'none',
                background: isBuy
                  ? (isActive
                    ? 'linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)'
                    : 'rgba(20,184,166,0.08)')
                  : (isActive ? 'rgba(20,184,166,0.1)' : 'transparent'),
                borderRadius: '16px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: isBuy && isActive ? '0 4px 16px rgba(20,184,166,0.3)' : 'none',
                minWidth: '80px',
              }}
            >
              {isBuy ? (
                <img
                  src="https://coin-images.coingecko.com/coins/images/325/large/Tether.png"
                  alt="USDT"
                  style={{ width: '24px', height: '24px', display: 'block' }}
                />
              ) : (
                <Icon
                  style={{
                    width: '20px',
                    height: '20px',
                    color: isActive ? '#14b8a6' : '#71717a',
                    strokeWidth: isActive ? 2 : 1.5,
                    transition: 'all 0.2s',
                  }}
                />
              )}
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: isActive ? 600 : 400,
                  color: isBuy && isActive ? '#ffffff' : (isActive ? '#14b8a6' : '#71717a'),
                  letterSpacing: '0.02em',
                  whiteSpace: 'nowrap',
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
  );
}
