import { useEffect, useState, useCallback } from 'react';
import { ArrowLeft, Receipt, Send, ChevronRight, Inbox } from 'lucide-react';
import { BillPaymentLab } from './BillPaymentLab';
import { SendMoney } from '@/components/features/SendMoney';
import { ClaimTransfer, PendingTransfer } from '@/components/features/ClaimTransfer';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

const CARD = '#1e1e1e';
const BORDER = 'rgba(255,255,255,0.07)';
const ICON_BG = 'rgba(255,255,255,0.06)';
const AMBER = '#fbbf24';

interface Experiment {
  id: string;
  label: string;
  desc: string;
  icon: any;
  status: 'draft' | 'testing';
}

const EXPERIMENTS: Experiment[] = [
  {
    id: 'p2p_transfer',
    label: 'Transfert P2P',
    desc: 'Envoyer des USDT entre utilisateurs Terex — instantane, avec livraison sur wallet externe ou Binance.',
    icon: Send,
    status: 'testing',
  },
  {
    id: 'bill_payment',
    label: 'Paiement de factures en USDT',
    desc: 'Senelec, Woyofal, SDE, Canal+, credit telephone — regle en stablecoin, paye en CFA cote fournisseur.',
    icon: Receipt,
    status: 'draft',
  },
];

export function LaboAdmin() {
  const { user } = useAuth();
  const [active, setActive] = useState<string | null>(null);
  const [pending, setPending] = useState<PendingTransfer[]>([]);
  const [claiming, setClaiming] = useState<PendingTransfer | null>(null);

  const loadPending = useCallback(async () => {
    if (!user) return;
    // Recuperer les transferts a reclamer
    const { data: transfers } = await (supabase as any)
      .from('p2p_transfers')
      .select('id, created_at, sender_id, amount_usdt, amount_cfa, exchange_rate, message')
      .eq('receiver_id', user.id)
      .eq('status', 'pending_claim')
      .order('created_at', { ascending: false });

    if (!transfers || transfers.length === 0) { setPending([]); return; }

    // Enrichir avec le nom des expediteurs
    const senderIds = [...new Set(transfers.map((t: any) => t.sender_id))];
    const { data: senders } = await (supabase as any)
      .from('profiles')
      .select('id, full_name, terex_id')
      .in('id', senderIds);
    const senderMap = new Map((senders || []).map((s: any) => [s.id, s]));

    setPending(transfers.map((t: any) => {
      const s = senderMap.get(t.sender_id) as any;
      return { ...t, sender_name: s?.full_name || null, sender_terex_id: s?.terex_id || null };
    }));
  }, [user]);

  useEffect(() => { loadPending(); }, [loadPending]);

  // Vue : reclamer un transfert
  if (claiming) {
    return (
      <ClaimTransfer
        transfer={claiming}
        onBack={() => setClaiming(null)}
        onClaimed={loadPending}
      />
    );
  }

  // Vue : envoyer (P2P)
  if (active === 'p2p_transfer') {
    return (
      <div>
        <button
          onClick={() => setActive(null)}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 8, background: CARD, color: '#fff',
            border: `1px solid ${BORDER}`, borderRadius: 10, padding: '8px 14px', fontSize: 13,
            fontWeight: 600, cursor: 'pointer', marginBottom: 16,
          }}
        >
          <ArrowLeft size={15} /> Retour au labo
        </button>
        <SendMoney onBack={() => setActive(null)} />
      </div>
    );
  }

  if (active === 'bill_payment') {
    return (
      <div>
        <button
          onClick={() => setActive(null)}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 8, background: CARD, color: '#fff',
            border: `1px solid ${BORDER}`, borderRadius: 10, padding: '8px 14px', fontSize: 13,
            fontWeight: 600, cursor: 'pointer', marginBottom: 16,
          }}
        >
          <ArrowLeft size={15} /> Retour au labo
        </button>
        <BillPaymentLab />
      </div>
    );
  }

  const nf = new Intl.NumberFormat('fr-FR');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {/* Bandeau : transferts a reclamer */}
      {pending.length > 0 && (
        <div style={{
          background: 'rgba(251,191,36,0.06)',
          border: `1px solid rgba(251,191,36,0.18)`,
          borderRadius: 16, padding: 14, marginBottom: 6,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
            <div style={{
              width: 32, height: 32, borderRadius: 10, background: 'rgba(251,191,36,0.15)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Inbox size={16} color={AMBER} />
            </div>
            <div>
              <p style={{ color: '#fff', fontSize: 14, fontWeight: 700, margin: 0 }}>
                {pending.length} transfert{pending.length > 1 ? 's' : ''} en attente
              </p>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, margin: '2px 0 0' }}>
                Choisissez ou recevoir vos USDT
              </p>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {pending.map(t => (
              <button
                key={t.id}
                onClick={() => setClaiming(t)}
                style={{
                  background: 'rgba(0,0,0,0.35)', border: `1px solid rgba(255,255,255,0.06)`,
                  borderRadius: 12, padding: '12px 14px', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: 12, textAlign: 'left',
                  transition: 'transform 0.15s ease',
                }}
                onMouseDown={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(0.98)'; }}
                onMouseUp={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1)'; }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ color: '#fff', fontSize: 14, fontWeight: 600, margin: 0 }}>
                    {nf.format(t.amount_usdt)} USDT
                  </p>
                  <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, margin: '2px 0 0' }}>
                    de {t.sender_name || `Terex ID ${t.sender_terex_id || '?'}`}
                    {t.message ? ' · ' + t.message.slice(0, 40) : ''}
                  </p>
                </div>
                <ChevronRight size={16} color="rgba(255,255,255,0.4)" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Liste des experimentations */}
      {EXPERIMENTS.map(({ id, label, desc, icon: Icon, status }) => (
        <button
          key={id}
          onClick={() => setActive(id)}
          style={{
            display: 'flex', alignItems: 'center', gap: 14, textAlign: 'left', width: '100%',
            background: CARD, border: `1px solid ${BORDER}`, borderRadius: 16, padding: 16, cursor: 'pointer',
            transition: 'transform 0.15s ease',
          }}
          onMouseDown={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(0.98)'; }}
          onMouseUp={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1)'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1)'; }}
          onTouchStart={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(0.98)'; }}
          onTouchEnd={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1)'; }}
        >
          <div style={{ width: 42, height: 42, borderRadius: 12, background: ICON_BG, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Icon size={19} color="rgba(255,255,255,0.85)" strokeWidth={1.8} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <p style={{ color: '#fff', fontSize: 14, fontWeight: 700, margin: 0 }}>{label}</p>
              <span style={{
                fontSize: 10.5, fontWeight: 700, padding: '2px 7px', borderRadius: 999,
                background: status === 'testing' ? 'rgba(249,115,22,0.12)' : 'rgba(255,255,255,0.06)',
                color: status === 'testing' ? '#f97316' : '#9ca3af',
                textTransform: 'uppercase', letterSpacing: '0.04em',
              }}>
                {status === 'testing' ? 'En test' : 'Brouillon'}
              </span>
            </div>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12.5, margin: '3px 0 0', lineHeight: 1.5 }}>{desc}</p>
          </div>
          <ChevronRight size={18} color="rgba(255,255,255,0.3)" style={{ flexShrink: 0 }} />
        </button>
      ))}
    </div>
  );
}
