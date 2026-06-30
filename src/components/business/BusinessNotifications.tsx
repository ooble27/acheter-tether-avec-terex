import { useState, useEffect } from 'react';
import { Bell, Check, X, Send, ArrowDownToLine, AlertTriangle, Info, CheckCircle2, Clock, Trash2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const C = {
  bg: '#1a1a1a', l1: '#212121', l2: '#282828', l3: '#303030',
  bd: '#383838', bds: '#2a2a2a', bdh: '#484848',
  teal: '#ffffff', tealH: '#2d7870', tealT: 'rgba(255, 255, 255,0.08)', tealB: 'rgba(255, 255, 255,0.20)',
  t1: '#f0f0f0', t2: '#888888', t3: '#686868',
  red: '#ef4444', redT: 'rgba(239,68,68,0.08)', redB: 'rgba(239,68,68,0.16)',
  amber: '#f59e0b', amberT: 'rgba(245,158,11,0.08)', amberB: 'rgba(245,158,11,0.20)',
  blue: '#3b82f6', blueT: 'rgba(59,130,246,0.08)', blueB: 'rgba(59,130,246,0.20)',
};
const FONT = "'Inter', sans-serif";
const MONO = '"JetBrains Mono", Consolas, monospace';

interface Notification {
  id: string;
  type: 'payment_success' | 'payment_pending' | 'payment_failed' | 'rate_alert' | 'system' | 'deposit';
  title: string;
  body: string;
  timestamp: string;
  read: boolean;
  reference?: string;
  amount?: number;
}

interface Props {
  user: { email: string; name: string } | null;
  onNavigate?: (section: string) => void;
}

const TYPE_CONFIG: Record<Notification['type'], { icon: React.FC<any>; iconColor: string; iconBg: string }> = {
  payment_success: { icon: CheckCircle2, iconColor: C.teal,  iconBg: C.tealT },
  payment_pending: { icon: Clock,        iconColor: C.amber, iconBg: C.amberT },
  payment_failed:  { icon: AlertTriangle, iconColor: C.red,  iconBg: C.redT  },
  rate_alert:      { icon: Info,         iconColor: C.blue,  iconBg: C.blueT },
  system:          { icon: Bell,         iconColor: C.t2,   iconBg: C.l3    },
  deposit:         { icon: ArrowDownToLine, iconColor: C.teal, iconBg: C.tealT },
};

const FILTER_TABS = [
  { value: 'all',     label: 'Tout' },
  { value: 'unread',  label: 'Non lues' },
  { value: 'payment', label: 'Paiements' },
  { value: 'system',  label: 'Système' },
];

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (mins < 2) return 'À l\'instant';
  if (mins < 60) return `Il y a ${mins} min`;
  if (hours < 24) return `Il y a ${hours}h`;
  if (days < 7) return `Il y a ${days}j`;
  return new Date(dateStr).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
}

function buildDemoNotifications(): Notification[] {
  const now = Date.now();
  return [
    {
      id: 'n1', type: 'payment_success',
      title: 'Paiement confirmé',
      body: 'Votre paiement de 8 500 USDT à Shenzhen Electronics a été traité avec succès.',
      timestamp: new Date(now - 12 * 60000).toISOString(),
      read: false, reference: 'TRX-SHZ001', amount: 8500,
    },
    {
      id: 'n2', type: 'rate_alert',
      title: 'Taux favorable',
      body: 'Le taux USDT/XOF a atteint 620 XOF — supérieur à votre alerte configurée.',
      timestamp: new Date(now - 45 * 60000).toISOString(),
      read: false,
    },
    {
      id: 'n3', type: 'payment_pending',
      title: 'Paiement en attente d\'approbation',
      body: 'Le paiement de 15 000 USDT à Dubai Trade Co. nécessite une validation administrateur.',
      timestamp: new Date(now - 2 * 3600000).toISOString(),
      read: false, reference: 'TRX-DUB003', amount: 15000,
    },
    {
      id: 'n4', type: 'deposit',
      title: 'Dépôt reçu',
      body: '2 500 000 XOF reçus — 4 000 USDT crédités sur votre wallet TRC20.',
      timestamp: new Date(now - 5 * 3600000).toISOString(),
      read: true, amount: 4000,
    },
    {
      id: 'n5', type: 'payment_failed',
      title: 'Paiement échoué',
      body: 'Le paiement TRX-TUR004 a échoué. L\'adresse wallet ERC20 semble invalide.',
      timestamp: new Date(now - 8 * 3600000).toISOString(),
      read: true, reference: 'TRX-TUR004',
    },
    {
      id: 'n6', type: 'system',
      title: 'Maintenance planifiée',
      body: 'Une maintenance est prévue dimanche 25 mai de 02h à 04h UTC. Les paiements seront suspendus.',
      timestamp: new Date(now - 24 * 3600000).toISOString(),
      read: true,
    },
    {
      id: 'n7', type: 'payment_success',
      title: 'Paiement confirmé',
      body: 'Votre paiement de 3 200 USDT à Lagos Imports Ltd a été traité.',
      timestamp: new Date(now - 2 * 86400000).toISOString(),
      read: true, reference: 'TRX-LAG002', amount: 3200,
    },
    {
      id: 'n8', type: 'rate_alert',
      title: 'Alerte taux configurée',
      body: 'Votre alerte pour USDT/XOF ≥ 618 a été enregistrée. Vous serez notifié dès l\'atteinte.',
      timestamp: new Date(now - 3 * 86400000).toISOString(),
      read: true,
    },
  ];
}

export function BusinessNotifications({ user, onNavigate }: Props) {
  const { session } = useAuth();
  const userId = session?.user?.id || user?.email || 'guest';
  const storageKey = `terex_b2b_${userId}_notifications`;

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState('all');
  const [alertThreshold, setAlertThreshold] = useState('');
  const [alertSaved, setAlertSaved] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      setNotifications(stored ? JSON.parse(stored) : buildDemoNotifications());
    } catch {
      setNotifications(buildDemoNotifications());
    }
  }, [userId]);

  const persist = (list: Notification[]) => {
    setNotifications(list);
    try { localStorage.setItem(storageKey, JSON.stringify(list)); } catch {}
  };

  const markRead = (id: string) => persist(notifications.map(n => n.id === id ? { ...n, read: true } : n));
  const markAllRead = () => persist(notifications.map(n => ({ ...n, read: true })));
  const deleteOne = (id: string) => persist(notifications.filter(n => n.id !== id));
  const clearAll = () => persist([]);

  const filtered = notifications.filter(n => {
    if (filter === 'unread') return !n.read;
    if (filter === 'payment') return ['payment_success', 'payment_pending', 'payment_failed', 'deposit'].includes(n.type);
    if (filter === 'system') return ['system', 'rate_alert'].includes(n.type);
    return true;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  const saveAlert = () => {
    if (!alertThreshold.trim()) return;
    setAlertSaved(true);
    setTimeout(() => setAlertSaved(false), 3000);
    const newN: Notification = {
      id: Date.now().toString(), type: 'rate_alert',
      title: 'Alerte taux configurée',
      body: `Votre alerte pour USDT/XOF ≥ ${alertThreshold} XOF a été enregistrée.`,
      timestamp: new Date().toISOString(), read: false,
    };
    persist([newN, ...notifications]);
    setAlertThreshold('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, fontFamily: FONT }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
        <div>
          <h2 style={{ color: C.t1, fontSize: 20, fontWeight: 700, letterSpacing: '-0.025em', lineHeight: 1.2, margin: 0 }}>
            Notifications
          </h2>
          <p style={{ color: C.t3, fontSize: 12, margin: '4px 0 0' }}>
            {unreadCount > 0 ? `${unreadCount} non lue${unreadCount > 1 ? 's' : ''}` : 'Tout est lu'}
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {unreadCount > 0 && (
            <button onClick={markAllRead} style={{
              height: 32, padding: '0 12px', background: 'transparent',
              border: `1px solid ${C.bds}`, borderRadius: 7, color: C.t2, fontSize: 12,
              cursor: 'pointer', fontFamily: FONT, display: 'flex', alignItems: 'center', gap: 6,
              transition: 'all 0.1s',
            }}
              onMouseEnter={e => { e.currentTarget.style.color = C.t1; e.currentTarget.style.borderColor = C.bdh; }}
              onMouseLeave={e => { e.currentTarget.style.color = C.t2; e.currentTarget.style.borderColor = C.bds; }}>
              <Check style={{ width: 12, height: 12 }} /> Tout lire
            </button>
          )}
          {notifications.length > 0 && (
            <button onClick={clearAll} style={{
              height: 32, padding: '0 12px', background: 'transparent',
              border: `1px solid ${C.bds}`, borderRadius: 7, color: C.t3, fontSize: 12,
              cursor: 'pointer', fontFamily: FONT, display: 'flex', alignItems: 'center', gap: 6,
              transition: 'all 0.1s',
            }}
              onMouseEnter={e => { e.currentTarget.style.color = C.red; e.currentTarget.style.borderColor = C.redB; }}
              onMouseLeave={e => { e.currentTarget.style.color = C.t3; e.currentTarget.style.borderColor = C.bds; }}>
              <Trash2 style={{ width: 12, height: 12 }} /> Effacer tout
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr,300px]" style={{ gap: 16, alignItems: 'start' }}>

        {/* Left: notification list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>

          {/* Filter tabs */}
          <div style={{ display: 'flex', gap: 0, borderBottom: `1px solid ${C.bds}`, marginBottom: 16 }}>
            {FILTER_TABS.map(tab => {
              const active = filter === tab.value;
              return (
                <button key={tab.value} onClick={() => setFilter(tab.value)} style={{
                  padding: '10px 16px', background: 'none', border: 'none', cursor: 'pointer',
                  fontSize: 13, fontWeight: active ? 600 : 400, fontFamily: FONT,
                  color: active ? C.teal : C.t3,
                  borderBottom: `2px solid ${active ? C.teal : 'transparent'}`,
                  marginBottom: -1, transition: 'all 0.12s',
                }}>{tab.label}</button>
              );
            })}
          </div>

          {/* List */}
          {filtered.length === 0 ? (
            <div style={{ padding: '60px 20px', textAlign: 'center', background: C.l1, border: `1px solid ${C.bds}`, borderRadius: 12 }}>
              <Bell style={{ width: 28, height: 28, color: C.t3, margin: '0 auto 12px', display: 'block' }} />
              <p style={{ color: C.t3, fontSize: 13, margin: 0 }}>Aucune notification</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {filtered.map(n => {
                const cfg = TYPE_CONFIG[n.type];
                const Icon = cfg.icon;
                return (
                  <div
                    key={n.id}
                    onClick={() => markRead(n.id)}
                    style={{
                      display: 'flex', gap: 12, padding: '14px 16px',
                      background: n.read ? C.l1 : `${C.l1}`,
                      border: `1px solid ${n.read ? C.bds : C.tealB}`,
                      borderLeft: `3px solid ${n.read ? 'transparent' : C.teal}`,
                      borderRadius: 11, cursor: 'pointer', transition: 'all 0.12s',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.background = C.l2)}
                    onMouseLeave={e => (e.currentTarget.style.background = n.read ? C.l1 : C.l1)}
                  >
                    <div style={{ width: 36, height: 36, borderRadius: 9, flexShrink: 0, background: cfg.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Icon style={{ width: 16, height: 16, color: cfg.iconColor }} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
                        <div style={{ fontSize: 13, fontWeight: n.read ? 400 : 600, color: C.t1, lineHeight: 1.3 }}>
                          {n.title}
                          {!n.read && (
                            <span style={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%', background: C.teal, marginLeft: 8, verticalAlign: 'middle' }} />
                          )}
                        </div>
                        <span style={{ fontSize: 10, color: C.t3, flexShrink: 0, fontFamily: MONO }}>{timeAgo(n.timestamp)}</span>
                      </div>
                      <p style={{ fontSize: 12, color: C.t3, margin: '4px 0 0', lineHeight: 1.5 }}>{n.body}</p>
                      {n.reference && (
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, marginTop: 6, padding: '2px 8px', background: C.l3, border: `1px solid ${C.bds}`, borderRadius: 5 }}>
                          <span style={{ fontSize: 10, color: C.t3, fontFamily: MONO }}>{n.reference}</span>
                        </div>
                      )}
                    </div>
                    <button
                      onClick={e => { e.stopPropagation(); deleteOne(n.id); }}
                      style={{ background: 'none', border: 'none', color: C.t3, cursor: 'pointer', padding: '2px', flexShrink: 0, borderRadius: 4, display: 'flex', alignItems: 'center', alignSelf: 'flex-start', transition: 'color 0.1s' }}
                      onMouseEnter={e => (e.currentTarget.style.color = C.red)}
                      onMouseLeave={e => (e.currentTarget.style.color = C.t3)}
                    >
                      <X style={{ width: 13, height: 13 }} />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right: preferences */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

          {/* Rate alert */}
          <div style={{ background: C.l1, border: `1px solid ${C.bds}`, borderRadius: 12, padding: '18px 20px' }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: C.t1, marginBottom: 4 }}>Alerte taux</div>
            <p style={{ fontSize: 11, color: C.t3, margin: '0 0 14px', lineHeight: 1.5 }}>
              Soyez notifié quand le taux USDT/XOF atteint votre seuil
            </p>
            <label style={{ fontSize: 10, fontWeight: 600, color: C.t3, textTransform: 'uppercase', letterSpacing: '0.07em', display: 'block', marginBottom: 8 }}>
              Seuil (XOF)
            </label>
            <div style={{ display: 'flex', gap: 8 }}>
              <input
                type="number"
                value={alertThreshold}
                onChange={e => setAlertThreshold(e.target.value)}
                placeholder="Ex: 620"
                style={{ flex: 1, background: C.l2, border: `1px solid ${C.bd}`, borderRadius: 7, padding: '8px 12px', color: C.t1, fontSize: 13, outline: 'none', fontFamily: MONO, boxSizing: 'border-box' }}
                onFocus={e => { e.currentTarget.style.borderColor = C.teal; }}
                onBlur={e => { e.currentTarget.style.borderColor = C.bd; }}
              />
              <button
                onClick={saveAlert}
                disabled={!alertThreshold.trim()}
                style={{ height: 36, padding: '0 12px', borderRadius: 7, background: alertSaved ? C.teal : (alertThreshold.trim() ? C.teal : C.l3), border: 'none', color: alertThreshold.trim() ? '#fff' : C.t3, fontSize: 12, fontWeight: 600, cursor: alertThreshold.trim() ? 'pointer' : 'not-allowed', fontFamily: FONT, display: 'flex', alignItems: 'center', gap: 6, transition: 'all 0.12s' }}>
                {alertSaved ? <><Check style={{ width: 12, height: 12 }} /> OK</> : 'Activer'}
              </button>
            </div>
          </div>

          {/* Notification prefs */}
          <div style={{ background: C.l1, border: `1px solid ${C.bds}`, borderRadius: 12, padding: '18px 20px' }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: C.t1, marginBottom: 14 }}>Préférences</div>
            {[
              { label: 'Paiements confirmés', checked: true },
              { label: 'Paiements en attente', checked: true },
              { label: 'Alertes de taux', checked: true },
              { label: 'Messages système', checked: false },
            ].map((pref, i) => (
              <label key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: i < 3 ? 12 : 0, cursor: 'pointer' }}>
                <span style={{ fontSize: 12, color: C.t2 }}>{pref.label}</span>
                <input type="checkbox" defaultChecked={pref.checked} style={{ accentColor: C.teal, width: 15, height: 15, cursor: 'pointer' }} />
              </label>
            ))}
          </div>

          {/* Quick links */}
          <div style={{ background: C.l1, border: `1px solid ${C.bds}`, borderRadius: 12, padding: '18px 20px' }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: C.t1, marginBottom: 12 }}>Liens rapides</div>
            {[
              { label: 'Voir l\'historique', action: 'history', icon: Send },
              { label: 'Initier un paiement', action: 'payment', icon: Send },
            ].map((link, i) => {
              const Icon = link.icon;
              return (
                <button key={i} onClick={() => onNavigate?.(link.action)} style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: 8, padding: '8px 0',
                  background: 'none', border: 'none', cursor: 'pointer', fontFamily: FONT,
                  color: C.teal, fontSize: 12, textAlign: 'left',
                  borderBottom: i === 0 ? `1px solid ${C.bds}` : 'none',
                  marginBottom: i === 0 ? 8 : 0,
                }}>
                  <Icon style={{ width: 12, height: 12 }} />
                  {link.label} →
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
