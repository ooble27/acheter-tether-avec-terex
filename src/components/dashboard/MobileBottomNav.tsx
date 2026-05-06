import { Home, ArrowDownCircle, ArrowUpCircle, Clock, User } from 'lucide-react';

const ACCENT = '#3B968F';

interface MobileBottomNavProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

const NAV = [
  { id: 'home',    Icon: Home,             label: 'Accueil'    },
  { id: 'buy',     Icon: ArrowDownCircle,  label: 'Acheter'    },
  { id: 'sell',    Icon: ArrowUpCircle,    label: 'Vendre'     },
  { id: 'history', Icon: Clock,            label: 'Historique' },
  { id: 'profile', Icon: User,             label: 'Profil'     },
];

export function MobileBottomNav({ activeSection, setActiveSection }: MobileBottomNavProps) {
  return (
    <div style={{
      position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 50,
      padding: '0 8px',
      paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 8px)',
    }}>
      <div style={{
        background: 'rgba(14,14,14,0.94)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        borderRadius: 22,
        border: '1px solid rgba(255,255,255,0.08)',
        boxShadow: '0 -8px 32px rgba(0,0,0,0.6)',
        display: 'flex',
        alignItems: 'stretch',
        padding: '6px 4px',
        marginBottom: 6,
      }}>
        {NAV.map(({ id, Icon, label }) => {
          const active = activeSection === id;
          return (
            <button
              key={id}
              onClick={() => setActiveSection(id)}
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 4,
                padding: '8px 4px 6px',
                border: 'none',
                borderRadius: 16,
                background: active ? `${ACCENT}18` : 'transparent',
                cursor: 'pointer',
                transition: 'background 0.18s',
                WebkitTapHighlightColor: 'transparent',
                position: 'relative',
              }}
            >
              {/* active top bar */}
              {active && (
                <div style={{
                  position: 'absolute', top: 0, left: '50%',
                  transform: 'translateX(-50%)',
                  width: 24, height: 3,
                  borderRadius: '0 0 3px 3px',
                  background: ACCENT,
                }} />
              )}

              <Icon
                size={22}
                strokeWidth={active ? 2.2 : 1.6}
                color={active ? ACCENT : 'rgba(255,255,255,0.35)'}
              />
              <span style={{
                fontSize: 10,
                fontWeight: active ? 600 : 400,
                color: active ? ACCENT : 'rgba(255,255,255,0.35)',
                whiteSpace: 'nowrap',
              }}>
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
