import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

const C = {
  bg: '#1a1a1a', l1: '#212121', l2: '#282828', l3: '#303030', l4: '#383838',
  bd: '#383838', bds: '#2a2a2a', bdh: '#484848',
  teal: '#3B968F', tealH: '#2d7870', tealT: 'rgba(59,150,143,0.08)', tealB: 'rgba(59,150,143,0.20)',
  t1: '#f0f0f0', t2: '#999999', t3: '#686868',
  amber: '#f59e0b', amberT: 'rgba(245,158,11,0.08)', amberB: 'rgba(245,158,11,0.16)',
  blue: '#3b82f6', blueT: 'rgba(59,130,246,0.08)', blueB: 'rgba(59,130,246,0.16)',
  em: '#22c55e', emT: 'rgba(34,197,94,0.08)', emB: 'rgba(34,197,94,0.16)',
  red: '#ef4444', redT: 'rgba(239,68,68,0.08)', redB: 'rgba(239,68,68,0.16)',
  purple: '#a855f7', purpleT: 'rgba(168,85,247,0.08)', purpleB: 'rgba(168,85,247,0.20)',
};
const FONT = "'Inter', sans-serif";
const MONO = '"JetBrains Mono", Consolas, monospace';

interface ApiKey {
  id: string;
  name: string;
  prefix: string;
  suffix: string;
  fullKey: string;
  type: 'live' | 'test';
  createdAt: string;
  lastUsed: string | null;
  revoked: boolean;
}

interface Webhook {
  id: string;
  url: string;
  events: string[];
  active: boolean;
}

interface WebhookLog {
  id: string;
  timestamp: string;
  event: string;
  url: string;
  statusCode: number;
  payload: object;
}

const WEBHOOK_EVENTS = [
  'payment.created',
  'payment.completed',
  'payment.failed',
  'supplier.added',
  'kyc.updated',
];

const INITIAL_KEYS: ApiKey[] = [
  {
    id: 'key-1',
    name: 'Clé principale',
    prefix: 'txb_live_',
    suffix: '3f9a',
    fullKey: 'txb_live_xK9mP2qR4vL8nJ5sT1uY7wA6bC0dE3f9a',
    type: 'live',
    createdAt: '2025-01-15',
    lastUsed: 'il y a 2h',
    revoked: false,
  },
  {
    id: 'key-2',
    name: 'Clé de test',
    prefix: 'txb_test_',
    suffix: '7b2c',
    fullKey: 'txb_test_hM3kQ7pN1rX6yZ4wA2jB8cD5eF0gH7b2c',
    type: 'test',
    createdAt: '2025-01-10',
    lastUsed: null,
    revoked: false,
  },
];

const INITIAL_WEBHOOKS: Webhook[] = [
  {
    id: 'wh-1',
    url: 'https://monsite.com/webhooks/terex',
    events: ['payment.created', 'payment.completed'],
    active: true,
  },
];

const WEBHOOK_LOGS: WebhookLog[] = [
  { id: 'log-1', timestamp: '14:23:01', event: 'payment.completed', url: '.../webhooks/terex', statusCode: 200, payload: { id: 'pay_001', amount: 1500, currency: 'USDT', status: 'completed' } },
  { id: 'log-2', timestamp: '13:45:22', event: 'payment.created', url: '.../webhooks/terex', statusCode: 200, payload: { id: 'pay_002', amount: 800, currency: 'USDT', status: 'created' } },
  { id: 'log-3', timestamp: '12:30:15', event: 'payment.failed', url: '.../webhooks/terex', statusCode: 502, payload: { id: 'pay_003', amount: 3200, currency: 'USDT', status: 'failed', error: 'Gateway timeout' } },
  { id: 'log-4', timestamp: '11:15:44', event: 'payment.completed', url: '.../webhooks/terex', statusCode: 200, payload: { id: 'pay_004', amount: 2100, currency: 'USDT', status: 'completed' } },
  { id: 'log-5', timestamp: '10:02:33', event: 'kyc.updated', url: '.../webhooks/terex', statusCode: 200, payload: { user_id: 'usr_001', level: 2, status: 'verified' } },
];

const CODE_SNIPPETS: Record<string, string> = {
  cURL: `curl -X POST https://api.terex.io/v1/payments \\
  -H "Authorization: Bearer txb_live_..." \\
  -H "Content-Type: application/json" \\
  -d '{
    "amount": 1000,
    "currency": "USDT",
    "network": "TRC20",
    "supplier_id": "sup_xxxxx",
    "reference": "CMD-2025-001",
    "note": "Commande textile janvier"
  }'`,
  'Node.js': `const terex = require('@terex/sdk');

const client = new terex.Client({
  apiKey: process.env.TEREX_API_KEY,
});

const payment = await client.payments.create({
  amount: 1000,
  currency: 'USDT',
  network: 'TRC20',
  supplier_id: 'sup_xxxxx',
  reference: 'CMD-2025-001',
  note: 'Commande textile janvier',
});

console.log(payment.id, payment.status);`,
  Python: `import terex

client = terex.Client(api_key="txb_live_...")

payment = client.payments.create(
    amount=1000,
    currency="USDT",
    network="TRC20",
    supplier_id="sup_xxxxx",
    reference="CMD-2025-001",
    note="Commande textile janvier",
)

print(payment.id, payment.status)`,
};

function Btn({
  children, onClick, variant = 'ghost', size = 'sm', style: extraStyle,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'ghost' | 'primary' | 'danger' | 'outline';
  size?: 'sm' | 'md';
  style?: React.CSSProperties;
}) {
  const [hovered, setHovered] = useState(false);
  const base: React.CSSProperties = {
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 5,
    borderRadius: 7, fontSize: size === 'sm' ? 11 : 13, fontWeight: 500,
    cursor: 'pointer', fontFamily: FONT, transition: 'all 0.12s',
    padding: size === 'sm' ? '5px 10px' : '8px 16px',
    border: 'none', whiteSpace: 'nowrap' as const,
  };
  const variants: Record<string, React.CSSProperties> = {
    ghost: { background: hovered ? C.l3 : 'transparent', color: hovered ? C.t1 : C.t3, border: 'none' },
    primary: { background: hovered ? C.tealH : C.teal, color: '#fff', border: 'none' },
    danger: { background: hovered ? C.redT : 'transparent', color: hovered ? C.red : C.t3, border: `1px solid ${hovered ? C.redB : 'transparent'}` },
    outline: { background: hovered ? C.l2 : 'transparent', color: hovered ? C.t1 : C.t2, border: `1px solid ${hovered ? C.bdh : C.bd}` },
  };
  return (
    <button
      style={{ ...base, ...variants[variant], ...extraStyle }}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {children}
    </button>
  );
}

function InputField({
  value, onChange, placeholder, style: extraStyle,
}: {
  value: string; onChange: (v: string) => void; placeholder?: string; style?: React.CSSProperties;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <input
      type="text"
      value={value}
      onChange={e => onChange(e.target.value)}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      placeholder={placeholder}
      style={{
        background: C.l2, border: `1px solid ${focused ? C.teal : C.bd}`,
        borderRadius: 8, padding: '9px 12px', color: C.t1, fontSize: 13,
        outline: 'none', fontFamily: FONT, width: '100%', boxSizing: 'border-box',
        transition: 'border-color 0.15s', ...extraStyle,
      }}
    />
  );
}

function ApiKeyCard({ apiKey, onRevoke }: { apiKey: ApiKey; onRevoke: (id: string) => void }) {
  const [visible, setVisible] = useState(false);
  const [copied, setCopied] = useState(false);
  const [confirmRevoke, setConfirmRevoke] = useState(false);

  const handleShow = () => {
    setVisible(true);
    setTimeout(() => setVisible(false), 3000);
  };

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const displayKey = visible
    ? apiKey.fullKey
    : `${apiKey.prefix}${'•'.repeat(24)}${apiKey.suffix}`;

  return (
    <div style={{
      background: C.l2, border: `1px solid ${apiKey.revoked ? C.redB : C.bds}`,
      borderRadius: 10, padding: '16px 18px',
      opacity: apiKey.revoked ? 0.55 : 1,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 14 }}>🔑</span>
          <span style={{ fontSize: 13, fontWeight: 600, color: C.t1, fontFamily: FONT }}>{apiKey.name}</span>
          <span style={{
            fontSize: 10, padding: '2px 6px', borderRadius: 4, fontWeight: 600,
            background: apiKey.type === 'live' ? C.emT : C.amberT,
            color: apiKey.type === 'live' ? C.em : C.amber,
            border: `1px solid ${apiKey.type === 'live' ? C.emB : C.amberB}`,
            textTransform: 'uppercase', letterSpacing: '0.06em',
          }}>
            {apiKey.type === 'live' ? 'Live' : 'Test'}
          </span>
          {apiKey.revoked && (
            <span style={{ fontSize: 10, color: C.red, background: C.redT, border: `1px solid ${C.redB}`, padding: '2px 6px', borderRadius: 4 }}>
              Révoquée
            </span>
          )}
        </div>
      </div>
      <div style={{
        fontFamily: MONO, fontSize: 12, color: visible ? C.teal : C.t3,
        background: C.l3, borderRadius: 6, padding: '8px 12px',
        marginBottom: 12, wordBreak: 'break-all', transition: 'color 0.2s',
      }}>
        {displayKey}
      </div>
      <div style={{ fontSize: 11, color: C.t3, fontFamily: FONT, marginBottom: 12 }}>
        Créée : {apiKey.createdAt} · {apiKey.lastUsed ? `Dernière utilisation : ${apiKey.lastUsed}` : 'Jamais utilisée'}
      </div>
      {!apiKey.revoked && (
        <div style={{ display: 'flex', gap: 6 }}>
          <Btn onClick={handleShow} variant="outline" size="sm">
            {visible ? '🙈 Masquer' : '👁 Afficher'}
          </Btn>
          <Btn onClick={handleCopy} variant="outline" size="sm">
            {copied ? '✓ Copié !' : '📋 Copier'}
          </Btn>
          {confirmRevoke ? (
            <>
              <span style={{ fontSize: 11, color: C.red, display: 'flex', alignItems: 'center', fontFamily: FONT }}>Confirmer ?</span>
              <Btn onClick={() => { onRevoke(apiKey.id); setConfirmRevoke(false); }} variant="danger" size="sm">Oui, révoquer</Btn>
              <Btn onClick={() => setConfirmRevoke(false)} variant="ghost" size="sm">Annuler</Btn>
            </>
          ) : (
            <Btn onClick={() => setConfirmRevoke(true)} variant="danger" size="sm">Révoquer</Btn>
          )}
        </div>
      )}
    </div>
  );
}

function WebhookCard({
  webhook, onTest, onToggle,
}: {
  webhook: Webhook;
  onTest: (id: string) => void;
  onToggle: (id: string) => void;
}) {
  return (
    <div style={{
      background: C.l2, border: `1px solid ${C.bds}`, borderRadius: 10, padding: '16px 18px',
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 10 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <div style={{ width: 7, height: 7, borderRadius: '50%', background: webhook.active ? C.em : C.t3 }} />
            <span style={{ fontSize: 12, color: webhook.active ? C.em : C.t3, fontFamily: FONT, fontWeight: 500 }}>
              {webhook.active ? 'Actif' : 'Inactif'}
            </span>
          </div>
          <div style={{ fontFamily: MONO, fontSize: 12, color: C.t2, wordBreak: 'break-all' }}>{webhook.url}</div>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 12 }}>
        {webhook.events.map(ev => (
          <span key={ev} style={{
            fontSize: 10, padding: '2px 7px', borderRadius: 4,
            background: C.blueT, color: C.blue, border: `1px solid ${C.blueB}`,
            fontFamily: MONO,
          }}>
            {ev}
          </span>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 6 }}>
        <Btn onClick={() => onTest(webhook.id)} variant="outline" size="sm">Tester</Btn>
        <Btn onClick={() => {}} variant="outline" size="sm">Modifier</Btn>
        <Btn onClick={() => onToggle(webhook.id)} variant="ghost" size="sm">
          {webhook.active ? 'Désactiver' : 'Activer'}
        </Btn>
      </div>
    </div>
  );
}

function WebhookLogRow({ log }: { log: WebhookLog }) {
  const [expanded, setExpanded] = useState(false);
  const isOk = log.statusCode >= 200 && log.statusCode < 300;

  return (
    <>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '80px 160px 1fr 80px 70px 80px',
          gap: 12, padding: '10px 16px',
          borderBottom: `1px solid ${C.bds}`,
          cursor: 'pointer', transition: 'background 0.1s',
          alignItems: 'center',
        }}
        onClick={() => setExpanded(e => !e)}
        onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.015)')}
        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
      >
        <span style={{ fontFamily: MONO, fontSize: 11, color: C.t3 }}>{log.timestamp}</span>
        <span style={{
          fontFamily: MONO, fontSize: 11,
          color: log.event.includes('failed') ? C.red : log.event.includes('completed') ? C.em : C.blue,
        }}>
          {log.event}
        </span>
        <span style={{ fontFamily: MONO, fontSize: 11, color: C.t3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {log.url}
        </span>
        <span style={{
          fontSize: 11, fontWeight: 600, padding: '2px 7px', borderRadius: 4,
          background: isOk ? C.emT : C.redT,
          color: isOk ? C.em : C.red,
          border: `1px solid ${isOk ? C.emB : C.redB}`,
          fontFamily: MONO, textAlign: 'center',
        }}>
          {log.statusCode} {isOk ? '✓' : '✗'}
        </span>
        <span style={{ fontSize: 11, color: C.t3, fontFamily: FONT }}>Payload</span>
        {!isOk ? (
          <Btn
            variant="outline" size="sm"
            onClick={e => { e.stopPropagation(); }}
          >
            Réessayer
          </Btn>
        ) : <span />}
      </div>
      {expanded && (
        <div style={{
          background: C.l3, borderBottom: `1px solid ${C.bds}`, padding: '12px 16px',
        }}>
          <pre style={{
            fontFamily: MONO, fontSize: 11, color: C.teal,
            margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-all',
          }}>
            {JSON.stringify(log.payload, null, 2)}
          </pre>
        </div>
      )}
    </>
  );
}

export function BusinessAPI({ user }: { user: { email: string; name: string; id?: string } | null }) {
  useAuth();
  void user;

  const [liveMode, setLiveMode] = useState(true);
  const [apiKeys, setApiKeys] = useState<ApiKey[]>(INITIAL_KEYS);
  const [webhooks, setWebhooks] = useState<Webhook[]>(INITIAL_WEBHOOKS);
  const [showCreateKey, setShowCreateKey] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [newKeyGenerated, setNewKeyGenerated] = useState<ApiKey | null>(null);
  const [showAddWebhook, setShowAddWebhook] = useState(false);
  const [newWhUrl, setNewWhUrl] = useState('');
  const [newWhEvents, setNewWhEvents] = useState<string[]>([]);
  const [codeTab, setCodeTab] = useState<'cURL' | 'Node.js' | 'Python'>('cURL');
  const [codeCopied, setCodeCopied] = useState(false);
  const [testedWebhook, setTestedWebhook] = useState<string | null>(null);

  const handleRevokeKey = (id: string) => {
    setApiKeys(prev => prev.map(k => k.id === id ? { ...k, revoked: true } : k));
  };

  const handleGenerateKey = () => {
    if (!newKeyName.trim()) return;
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const rand = (n: number) => Array.from({ length: n }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
    const suffix = rand(4);
    const newKey: ApiKey = {
      id: `key-${Date.now()}`,
      name: newKeyName,
      prefix: liveMode ? 'txb_live_' : 'txb_test_',
      suffix,
      fullKey: `${liveMode ? 'txb_live_' : 'txb_test_'}${rand(28)}${suffix}`,
      type: liveMode ? 'live' : 'test',
      createdAt: new Date().toLocaleDateString('fr-FR'),
      lastUsed: null,
      revoked: false,
    };
    setApiKeys(prev => [newKey, ...prev]);
    setNewKeyGenerated(newKey);
    setNewKeyName('');
  };

  const handleAddWebhook = () => {
    if (!newWhUrl.trim() || newWhEvents.length === 0) return;
    setWebhooks(prev => [{
      id: `wh-${Date.now()}`,
      url: newWhUrl,
      events: newWhEvents,
      active: true,
    }, ...prev]);
    setNewWhUrl('');
    setNewWhEvents([]);
    setShowAddWebhook(false);
  };

  const handleTestWebhook = (id: string) => {
    setTestedWebhook(id);
    setTimeout(() => setTestedWebhook(null), 2500);
  };

  const handleToggleWebhook = (id: string) => {
    setWebhooks(prev => prev.map(w => w.id === id ? { ...w, active: !w.active } : w));
  };

  const handleCopyCode = () => {
    setCodeCopied(true);
    setTimeout(() => setCodeCopied(false), 2000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, fontFamily: FONT }}>
      {/* Test mode banner */}
      {!liveMode && (
        <div style={{
          background: C.amberT, border: `1px solid ${C.amberB}`,
          borderRadius: 10, padding: '12px 16px',
          display: 'flex', alignItems: 'center', gap: 10,
        }}>
          <span style={{ fontSize: 14 }}>⚠</span>
          <span style={{ fontSize: 13, color: C.amber, fontFamily: FONT }}>
            Vous êtes en mode test — les opérations n'affectent pas les fonds réels
          </span>
        </div>
      )}

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
        <div>
          <h2 style={{ color: C.t1, fontSize: 22, fontWeight: 700, letterSpacing: '-0.025em', margin: '0 0 4px' }}>
            Intégrations & API
          </h2>
          <p style={{ color: C.t3, fontSize: 13, margin: 0 }}>Connectez Terex Business à vos outils</p>
        </div>
        {/* Live/Test toggle */}
        <button
          onClick={() => setLiveMode(m => !m)}
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            background: C.l2, border: `1px solid ${C.bd}`, borderRadius: 999,
            padding: '7px 14px', cursor: 'pointer', fontFamily: FONT,
            transition: 'all 0.15s',
          }}
          onMouseEnter={e => (e.currentTarget.style.borderColor = C.bdh)}
          onMouseLeave={e => (e.currentTarget.style.borderColor = C.bd)}
        >
          <div style={{ width: 7, height: 7, borderRadius: '50%', background: liveMode ? C.em : C.amber }} />
          <span style={{ fontSize: 12, fontWeight: 600, color: C.t1 }}>
            Mode {liveMode ? 'live' : 'test'}
          </span>
          <span style={{ fontSize: 11, color: C.t3 }}>{liveMode ? '●' : '○'}</span>
        </button>
      </div>

      {/* Two columns: API Keys + Webhooks */}
      <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>
        {/* LEFT: API Keys */}
        <div style={{ flex: '0 0 50%', background: C.l1, border: `1px solid ${C.bds}`, borderRadius: 12, overflow: 'hidden' }}>
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '18px 20px', borderBottom: `1px solid ${C.bds}`,
          }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: C.t1 }}>Clés API</div>
              <div style={{ fontSize: 11, color: C.t3, marginTop: 2 }}>{apiKeys.filter(k => !k.revoked).length} clés actives</div>
            </div>
            <Btn onClick={() => { setShowCreateKey(v => !v); setNewKeyGenerated(null); }} variant="primary" size="sm">
              + Créer une clé
            </Btn>
          </div>

          {/* Create key form */}
          {showCreateKey && (
            <div style={{ padding: '16px 20px', borderBottom: `1px solid ${C.bds}`, background: C.l2 }}>
              {newKeyGenerated ? (
                <div>
                  <div style={{ fontSize: 12, color: C.em, marginBottom: 8, fontFamily: FONT }}>
                    ✓ Clé créée — copiez-la maintenant, elle ne sera plus visible
                  </div>
                  <div style={{
                    fontFamily: MONO, fontSize: 11, background: C.l3, borderRadius: 6, padding: '8px 12px',
                    color: C.teal, marginBottom: 10, wordBreak: 'break-all',
                  }}>
                    {newKeyGenerated.fullKey}
                  </div>
                  <Btn onClick={() => { setShowCreateKey(false); setNewKeyGenerated(null); }} variant="outline" size="sm">
                    Fermer
                  </Btn>
                </div>
              ) : (
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <InputField value={newKeyName} onChange={setNewKeyName} placeholder="Nom de la clé…" style={{ flex: 1 }} />
                  <Btn onClick={handleGenerateKey} variant="primary" size="sm">Générer</Btn>
                  <Btn onClick={() => setShowCreateKey(false)} variant="ghost" size="sm">Annuler</Btn>
                </div>
              )}
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {apiKeys.map((key, i) => (
              <div key={key.id} style={{ padding: '14px 20px', borderBottom: i < apiKeys.length - 1 ? `1px solid ${C.bds}` : 'none' }}>
                <ApiKeyCard apiKey={key} onRevoke={handleRevokeKey} />
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT: Webhooks */}
        <div style={{ flex: '0 0 calc(50% - 20px)', background: C.l1, border: `1px solid ${C.bds}`, borderRadius: 12, overflow: 'hidden' }}>
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '18px 20px', borderBottom: `1px solid ${C.bds}`,
          }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: C.t1 }}>Webhooks</div>
              <div style={{ fontSize: 11, color: C.t3, marginTop: 2 }}>{webhooks.filter(w => w.active).length} actif(s)</div>
            </div>
            <Btn onClick={() => setShowAddWebhook(v => !v)} variant="primary" size="sm">
              + Ajouter
            </Btn>
          </div>

          {/* Add webhook form */}
          {showAddWebhook && (
            <div style={{ padding: '16px 20px', borderBottom: `1px solid ${C.bds}`, background: C.l2 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <InputField value={newWhUrl} onChange={setNewWhUrl} placeholder="https://..." />
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {WEBHOOK_EVENTS.map(ev => {
                    const checked = newWhEvents.includes(ev);
                    return (
                      <button
                        key={ev}
                        onClick={() => setNewWhEvents(prev => checked ? prev.filter(e => e !== ev) : [...prev, ev])}
                        style={{
                          fontSize: 10, padding: '3px 8px', borderRadius: 4, cursor: 'pointer',
                          background: checked ? C.blueT : 'transparent',
                          color: checked ? C.blue : C.t3,
                          border: `1px solid ${checked ? C.blueB : C.bd}`,
                          fontFamily: MONO, transition: 'all 0.1s',
                        }}
                      >
                        {ev}
                      </button>
                    );
                  })}
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <Btn onClick={handleAddWebhook} variant="primary" size="sm">Ajouter</Btn>
                  <Btn onClick={() => setShowAddWebhook(false)} variant="ghost" size="sm">Annuler</Btn>
                </div>
              </div>
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {webhooks.map((wh, i) => (
              <div key={wh.id} style={{ padding: '14px 20px', borderBottom: i < webhooks.length - 1 ? `1px solid ${C.bds}` : 'none' }}>
                {testedWebhook === wh.id && (
                  <div style={{
                    fontSize: 11, color: C.em, background: C.emT, border: `1px solid ${C.emB}`,
                    borderRadius: 6, padding: '5px 10px', marginBottom: 8, fontFamily: FONT,
                  }}>
                    ✓ Webhook testé — 200 OK reçu
                  </div>
                )}
                <WebhookCard webhook={wh} onTest={handleTestWebhook} onToggle={handleToggleWebhook} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Webhook logs */}
      <div style={{ background: C.l1, border: `1px solid ${C.bds}`, borderRadius: 12, overflow: 'hidden' }}>
        <div style={{ padding: '18px 20px', borderBottom: `1px solid ${C.bds}` }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: C.t1 }}>Logs des webhooks</div>
          <div style={{ fontSize: 11, color: C.t3, marginTop: 2 }}>Dernières 24h · Cliquez sur une ligne pour voir le payload</div>
        </div>
        {/* Table header */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '80px 160px 1fr 80px 70px 80px',
          gap: 12, padding: '8px 16px',
          borderBottom: `1px solid ${C.bds}`,
        }}>
          {['Heure', 'Événement', 'URL', 'Code HTTP', 'Payload', 'Retry'].map(h => (
            <span key={h} style={{ fontSize: 10, fontWeight: 600, color: C.t3, textTransform: 'uppercase', letterSpacing: '0.07em' }}>
              {h}
            </span>
          ))}
        </div>
        {WEBHOOK_LOGS.map(log => <WebhookLogRow key={log.id} log={log} />)}
      </div>

      {/* Quick start snippets */}
      <div style={{ background: C.l1, border: `1px solid ${C.bds}`, borderRadius: 12, overflow: 'hidden' }}>
        <div style={{ padding: '18px 20px', borderBottom: `1px solid ${C.bds}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, color: C.t1 }}>Démarrage rapide</div>
            <div style={{ fontSize: 11, color: C.t3, marginTop: 2 }}>Exemples d'intégration par langage</div>
          </div>
          <div style={{ display: 'flex', gap: 4 }}>
            {(['cURL', 'Node.js', 'Python'] as const).map(lang => (
              <button
                key={lang}
                onClick={() => setCodeTab(lang)}
                style={{
                  padding: '5px 12px', borderRadius: 6, fontSize: 12, cursor: 'pointer',
                  background: codeTab === lang ? C.tealT : 'transparent',
                  color: codeTab === lang ? C.teal : C.t3,
                  border: `1px solid ${codeTab === lang ? C.tealB : 'transparent'}`,
                  fontFamily: FONT, fontWeight: codeTab === lang ? 600 : 400,
                  transition: 'all 0.12s',
                }}
              >
                {lang}
              </button>
            ))}
          </div>
        </div>
        <div style={{ position: 'relative', padding: 0 }}>
          <pre style={{
            margin: 0, padding: '20px 24px',
            fontFamily: MONO, fontSize: 12, lineHeight: 1.7,
            color: C.teal, background: C.l2,
            overflowX: 'auto', whiteSpace: 'pre',
          }}>
            {CODE_SNIPPETS[codeTab]}
          </pre>
          <button
            onClick={handleCopyCode}
            style={{
              position: 'absolute', top: 12, right: 16,
              fontSize: 11, padding: '4px 10px', borderRadius: 6,
              background: codeCopied ? C.emT : C.l3,
              color: codeCopied ? C.em : C.t3,
              border: `1px solid ${codeCopied ? C.emB : C.bd}`,
              cursor: 'pointer', fontFamily: FONT, transition: 'all 0.15s',
            }}
          >
            {codeCopied ? '✓ Copié !' : 'Copier le code'}
          </button>
        </div>
      </div>
    </div>
  );
}
