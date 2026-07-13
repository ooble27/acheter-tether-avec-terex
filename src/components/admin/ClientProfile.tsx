import { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { UnifiedOrder } from '@/hooks/useOrders';
import { useOrdersData } from '@/components/admin/OrdersDataProvider';
import { useClientInfos } from '@/hooks/useClientInfos';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Coins, HandCoins, Send, User, Mail, Phone, AlertTriangle, Copy } from 'lucide-react';
import { DrillPage, StatStrip, StatusText, Avatar, drillStyles } from '@/components/admin/AdminDrill';

const CARD = '#1e1e1e';
const BORDER = 'rgba(255,255,255,0.07)';
const RED = '#e07a7a';

const TYPE_META: Record<string, { label: string; Icon: any }> = {
  buy: { label: 'Achat', Icon: Coins },
  sell: { label: 'Vente', Icon: HandCoins },
  transfer: { label: 'Virement', Icon: Send },
};

const KYC_LABEL: Record<string, string> = {
  approved: 'KYC vérifié', pending: 'KYC en attente', submitted: 'KYC soumis',
  under_review: 'KYC en révision', rejected: 'KYC rejeté',
};

// Marge estimée par commande (mêmes règles que la Comptabilité).
function revenueOf(o: UnifiedOrder): number {
  if (o.type === 'buy') return Number(o.amount || 0) * (0.02 / 1.02);
  if (o.type === 'sell') return Number(o.usdt_amount || 0) * 10;
  return Number((o as any).fees || 0);
}

interface ClientProfileProps {
  userId: string;
  onBack: () => void;
  onOpenOrder?: (order: UnifiedOrder) => void;
}

export function ClientProfile({ userId, onBack, onOpenOrder }: ClientProfileProps) {
  const { orders } = useOrdersData();
  const infos = useClientInfos([userId]);
  const info = infos[userId];
  const [kycStatus, setKycStatus] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data } = await supabase
        .from('kyc_verifications')
        .select('status')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      if (!cancelled) setKycStatus((data as any)?.status ?? null);
    })();
    return () => { cancelled = true; };
  }, [userId]);

  const clientOrders = useMemo(
    () => (orders || [])
      .filter(o => o.user_id === userId && !o.is_deleted)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()),
    [orders, userId]
  );

  const stats = useMemo(() => {
    const completed = clientOrders.filter(o => o.status === 'completed');
    const cancelled = clientOrders.filter(o => o.status === 'cancelled' || o.status === 'failed');
    const volumeCfa = completed.reduce((s, o) => s + Number(o.amount || 0), 0);
    const usdt = completed.reduce((s, o) => s + Number(o.usdt_amount || 0), 0);
    const margin = completed.reduce((s, o) => s + revenueOf(o), 0);
    const dates = clientOrders.map(o => new Date(o.created_at).getTime());
    const since = dates.length ? new Date(Math.min(...dates)) : null;
    // Vélocité : commandes sur les dernières 24 h
    const dayAgo = Date.now() - 24 * 3600 * 1000;
    const last24 = clientOrders.filter(o => new Date(o.created_at).getTime() >= dayAgo).length;
    return {
      total: clientOrders.length, completed: completed.length, cancelled: cancelled.length,
      volumeCfa, usdt, margin, since, last24,
    };
  }, [clientOrders]);

  const fmt = (n: number) => Math.round(n).toLocaleString('fr-FR');
  const name = info?.full_name || 'Client';
  const copy = (v: string) => navigator.clipboard.writeText(v);

  // Drapeaux de risque — sobres, en rouge uniquement quand c'est réel.
  const flags: string[] = [];
  if (stats.total >= 3 && stats.cancelled / stats.total >= 0.4) flags.push(`Taux d'annulation élevé (${stats.cancelled}/${stats.total})`);
  if (stats.last24 >= 5) flags.push(`${stats.last24} commandes en 24 h (vélocité élevée)`);
  if (kycStatus && kycStatus !== 'approved') flags.push(`Identité non vérifiée (${KYC_LABEL[kycStatus] || kycStatus})`);

  const contactRow = (Icon: any, label: string, value?: string) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, padding: '13px 16px', borderBottom: `1px solid ${BORDER}` }}>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: '#6b7280', fontSize: 13 }}><Icon size={14} /> {label}</span>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, minWidth: 0 }}>
        <span style={{ color: '#fff', fontSize: 13.5, fontWeight: 500, textAlign: 'right', wordBreak: 'break-word' }}>{value || '—'}</span>
        {value && <button onClick={() => copy(value)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', padding: 2, flexShrink: 0, display: 'flex' }}><Copy size={13} /></button>}
      </span>
    </div>
  );

  return (
    <>
      <style>{drillStyles}</style>
      <DrillPage
        title={name}
        sub={stats.since ? `Client depuis ${format(stats.since, 'MMM yyyy', { locale: fr })}` : 'Fiche client'}
        onBack={onBack}
        right={kycStatus === 'approved'
          ? <StatusText status="completed" label="KYC vérifié" />
          : kycStatus ? <StatusText status={kycStatus} label={KYC_LABEL[kycStatus] || 'KYC'} /> : undefined}
      >
        {/* Chiffres à vie */}
        <StatStrip items={[
          { label: 'Commandes', value: stats.total },
          { label: 'Terminées', value: stats.completed },
          { label: 'Volume à vie', value: `${fmt(stats.volumeCfa)} CFA` },
          { label: 'USDT échangés', value: fmt(stats.usdt) },
          { label: 'Marge générée', value: `${fmt(stats.margin)} CFA` },
        ]} />

        {/* Drapeaux de risque */}
        {flags.length > 0 && (
          <div style={{ background: 'rgba(224,122,122,0.05)', border: `1px solid rgba(224,122,122,0.25)`, borderRadius: 14, padding: '12px 14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <AlertTriangle size={14} color={RED} />
              <p style={{ color: RED, fontSize: 12.5, fontWeight: 700, margin: 0 }}>À surveiller</p>
            </div>
            <ul style={{ margin: 0, padding: '0 0 0 20px' }}>
              {flags.map((f, i) => <li key={i} style={{ color: '#d1d5db', fontSize: 12.5, lineHeight: 1.7 }}>{f}</li>)}
            </ul>
          </div>
        )}

        {/* Coordonnées */}
        <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 16, overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', borderBottom: `1px solid ${BORDER}` }}>
            <Avatar name={name} size={40} />
            <div style={{ minWidth: 0 }}>
              <p style={{ color: '#fff', fontSize: 15, fontWeight: 700, margin: 0 }}>{name}</p>
              <p style={{ color: '#6b7280', fontSize: 12, margin: '1px 0 0', fontFamily: 'ui-monospace,Menlo,monospace' }}>ID {userId.slice(0, 8)}…</p>
            </div>
          </div>
          {contactRow(User, 'Nom', info?.full_name)}
          {contactRow(Mail, 'Email', info?.email)}
          <div style={{ borderBottom: 'none' }}>{contactRow(Phone, 'Téléphone', info?.phone)}</div>
        </div>

        {/* Historique complet des commandes */}
        <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 16, overflow: 'hidden' }}>
          <div style={{ padding: '14px 16px', borderBottom: `1px solid ${BORDER}` }}>
            <p style={{ color: '#fff', fontSize: 13.5, fontWeight: 700, margin: 0 }}>Toutes les commandes <span style={{ color: '#6b7280', fontWeight: 500 }}>· {clientOrders.length}</span></p>
          </div>
          {clientOrders.length === 0 ? (
            <p style={{ color: '#6b7280', fontSize: 13, padding: '20px 16px', margin: 0 }}>Aucune commande.</p>
          ) : (
            clientOrders.map((o, i) => {
              const t = TYPE_META[o.type] || TYPE_META.buy;
              return (
                <div key={o.id}
                  onClick={onOpenOrder ? () => onOpenOrder(o) : undefined}
                  style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderBottom: i < clientOrders.length - 1 ? `1px solid ${BORDER}` : 'none', cursor: onOpenOrder ? 'pointer' : 'default' }}>
                  <div style={{ width: 34, height: 34, borderRadius: 10, background: 'rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <t.Icon size={15} color="rgba(255,255,255,0.7)" />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                      <span style={{ color: '#fff', fontSize: 13, fontWeight: 600 }}>{t.label}</span>
                      <StatusText status={o.status} size={11.5} />
                    </div>
                    <p style={{ color: '#6b7280', fontSize: 11.5, margin: '1px 0 0' }}>{format(new Date(o.created_at), "d MMM yyyy 'à' HH:mm", { locale: fr })}</p>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <p style={{ color: '#fff', fontSize: 13, fontWeight: 700, margin: 0 }}>{Number(o.amount).toLocaleString('fr-FR')} {o.currency}</p>
                    <p style={{ color: '#6b7280', fontSize: 11, margin: '1px 0 0' }}>{Number(o.usdt_amount || 0).toLocaleString('fr-FR')} USDT</p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </DrillPage>
    </>
  );
}
