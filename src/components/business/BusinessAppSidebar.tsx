import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Send, Clock, Users2,
  Building2, LifeBuoy, LogOut, ArrowLeft,
  Wallet, CalendarClock, BarChart2, UserCog, ShieldCheck,
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';

const NAV_SECTIONS = [
  {
    label: 'Principal',
    items: [
      { id: 'overview',    label: "Vue d'ensemble",     icon: LayoutDashboard },
      { id: 'payment',     label: 'Paiements',           icon: Send },
      { id: 'treasury',    label: 'Trésorerie',          icon: Wallet },
    ],
  },
  {
    label: 'Gestion',
    items: [
      { id: 'history',     label: 'Historique & Reçus',  icon: Clock },
      { id: 'suppliers',   label: 'Fournisseurs',        icon: Users2 },
      { id: 'batch',       label: 'Lots & Planification',icon: CalendarClock },
    ],
  },
  {
    label: 'Business',
    items: [
      { id: 'analytics',   label: 'Analytique',          icon: BarChart2 },
      { id: 'team',        label: 'Équipe & Accès',      icon: UserCog },
      { id: 'compliance',  label: 'Conformité KYC',      icon: ShieldCheck },
    ],
  },
  {
    label: 'Paramètres',
    items: [
      { id: 'profile',     label: 'Profil entreprise',   icon: Building2 },
      { id: 'support',     label: 'Support',             icon: LifeBuoy },
    ],
  },
];

const FONT = "'Inter', sans-serif";

function InitialAvatar({ name, size = 28 }: { name: string; size?: number }) {
  const parts = (name || 'U').split(' ').filter(Boolean);
  const initials = parts.length >= 2
    ? (parts[0][0] + parts[1][0]).toUpperCase()
    : (parts[0]?.slice(0, 2) || 'U').toUpperCase();
  return (
    <div style={{
      width: size, height: size, borderRadius: 7,
      background: 'rgba(255, 255, 255,0.22)', color: '#ffffff',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size * 0.38, fontWeight: 600, flexShrink: 0, fontFamily: FONT,
    }}>
      {initials}
    </div>
  );
}

interface BusinessAppSidebarProps {
  activeSection: string;
  onNavigate: (id: string) => void;
  user: { id?: string; email: string; name: string } | null;
  onLogout: () => void;
}

export function BusinessAppSidebar({ activeSection, onNavigate, user, onLogout }: BusinessAppSidebarProps) {
  const { setOpen, setOpenMobile } = useSidebar();
  const navigate = useNavigate();

  const handleNavigate = (id: string) => {
    onNavigate(id);
    setOpen(false);
    setOpenMobile(false);
  };

  return (
    <Sidebar collapsible="offcanvas">
      {/* Logo */}
      <SidebarHeader style={{ padding: '18px 16px 14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 30, height: 30, borderRadius: 7, flexShrink: 0,
            background: 'linear-gradient(135deg, #ffffff, #2d7870)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{ color: '#fff', fontSize: 11, fontWeight: 800, letterSpacing: '-0.02em' }}>TB</span>
          </div>
          <div>
            <p style={{ color: 'hsl(var(--sidebar-foreground))', fontSize: 11, fontWeight: 700, letterSpacing: '0.10em', margin: 0 }}>
              TEREX BUSINESS
            </p>
            <p style={{ color: '#ffffff', fontSize: 9, letterSpacing: '0.12em', margin: '3px 0 0' }}>
              PORTAIL B2B PRO
            </p>
          </div>
        </div>
      </SidebarHeader>

      {/* Nav */}
      <SidebarContent>
        {NAV_SECTIONS.map(section => (
          <SidebarGroup key={section.label}>
            <SidebarGroupLabel>{section.label}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {section.items.map(item => (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton
                      isActive={activeSection === item.id}
                      onClick={() => handleNavigate(item.id)}
                      style={{ fontFamily: FONT }}
                    >
                      <item.icon />
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter style={{ padding: '10px 12px 12px' }}>
        {/* Retour espace personnel */}
        <button
          onClick={() => navigate('/dashboard')}
          style={{
            width: '100%', display: 'flex', alignItems: 'center', gap: 6,
            padding: '6px 8px', borderRadius: 7, border: 'none', cursor: 'pointer',
            fontSize: 11.5, color: 'hsl(var(--sidebar-foreground) / 0.5)',
            background: 'transparent', fontFamily: FONT, marginBottom: 8, textAlign: 'left',
            transition: 'color 0.1s',
          }}
          onMouseEnter={e => (e.currentTarget.style.color = 'hsl(var(--sidebar-foreground) / 0.8)')}
          onMouseLeave={e => (e.currentTarget.style.color = 'hsl(var(--sidebar-foreground) / 0.5)')}
        >
          <ArrowLeft style={{ width: 12, height: 12 }} />
          Espace personnel
        </button>

        {/* User card */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '8px 10px', borderRadius: 10,
          background: 'hsl(var(--sidebar-accent))',
        }}>
          <InitialAvatar name={user?.name || 'U'} size={28} />
          <div style={{ minWidth: 0, flex: 1 }}>
            <p style={{ color: 'hsl(var(--sidebar-foreground))', fontSize: 12, fontWeight: 600, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontFamily: FONT }}>
              {user?.name || 'Utilisateur'}
            </p>
            <p style={{ color: 'hsl(var(--sidebar-foreground) / 0.5)', fontSize: 10.5, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontFamily: FONT }}>
              {user?.email}
            </p>
          </div>
          <button
            onClick={onLogout}
            title="Déconnexion"
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: 'hsl(var(--sidebar-foreground) / 0.5)', padding: '4px',
              display: 'flex', borderRadius: 6, transition: 'color 0.1s',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = '#ef4444')}
            onMouseLeave={e => (e.currentTarget.style.color = 'hsl(var(--sidebar-foreground) / 0.5)')}
          >
            <LogOut style={{ width: 13, height: 13 }} />
          </button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
