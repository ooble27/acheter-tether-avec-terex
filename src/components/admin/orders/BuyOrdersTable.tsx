
import { useMemo, useState } from 'react';
import {
  CheckCircle,
  XCircle,
  TrendingUp,
  Eye,
  Copy,
  Trash2,
  Coins
} from 'lucide-react';
import { UnifiedOrder } from '@/hooks/useOrders';
import type { Database } from '@/integrations/supabase/types';
import { OrderDetailsDialog } from './OrderDetailsDialog';
import { useClientInfos } from '@/hooks/useClientInfos';
import { ClientStrip } from './ClientStrip';

type OrderStatus = Database['public']['Enums']['order_status'];

const CARD = '#1e1e1e';
const BORDER = 'rgba(255,255,255,0.07)';
const ICON_BG = 'rgba(255,255,255,0.06)';

const statusBadgeStyles: Record<string, { bg: string; color: string; label: string }> = {
  pending: { bg: 'rgba(251,191,36,0.10)', color: '#fbbf24', label: 'En attente' },
  processing: { bg: 'rgba(96,165,250,0.10)', color: '#60a5fa', label: 'En traitement' },
  completed: { bg: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.65)', label: 'Terminé' },
  cancelled: { bg: 'rgba(248,113,113,0.10)', color: '#f87171', label: 'Annulé' },
};

function StatusBadge({ status }: { status: string }) {
  const s = statusBadgeStyles[status] || {
    bg: 'rgba(255,255,255,0.06)',
    color: 'rgba(255,255,255,0.65)',
    label: status,
  };
  return (
    <span
      style={{
        background: s.bg,
        color: s.color,
        borderRadius: '999px',
        padding: '3px 10px',
        fontSize: '11px',
        fontWeight: 600,
        whiteSpace: 'nowrap',
      }}
    >
      {s.label}
    </span>
  );
}

const neutralBtnStyle: React.CSSProperties = {
  background: '#2d2d2d',
  border: '1px solid rgba(255,255,255,0.07)',
  color: '#fff',
  borderRadius: '10px',
  padding: '8px 14px',
  fontSize: '13px',
  fontWeight: 600,
  display: 'inline-flex',
  alignItems: 'center',
  gap: '6px',
  cursor: 'pointer',
};

const ctaBtnStyle: React.CSSProperties = {
  background: '#fff',
  color: '#141414',
  border: 'none',
  borderRadius: '10px',
  padding: '8px 14px',
  fontSize: '13px',
  fontWeight: 700,
  display: 'inline-flex',
  alignItems: 'center',
  gap: '6px',
  cursor: 'pointer',
};

const dangerBtnStyle: React.CSSProperties = {
  background: '#2d2d2d',
  border: '1px solid rgba(248,113,113,0.25)',
  color: '#f87171',
  borderRadius: '10px',
  padding: '8px 14px',
  fontSize: '13px',
  fontWeight: 600,
  display: 'inline-flex',
  alignItems: 'center',
  gap: '6px',
  cursor: 'pointer',
};

const iconDangerBtnStyle: React.CSSProperties = {
  ...dangerBtnStyle,
  padding: '8px 10px',
};

export function BuyOrdersTable({ orders, onStatusUpdate, onMoveToTrash }: BuyOrdersTableProps) {
  const [selectedOrder, setSelectedOrder] = useState<UnifiedOrder | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const userIds = useMemo(() => orders.map((o) => o.user_id), [orders]);
  const clientInfos = useClientInfos(userIds);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  if (orders.length === 0) {
    return (
      <div className="text-center py-12">
        <div
          className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
          style={{ background: ICON_BG }}
        >
          <Coins className="w-8 h-8" style={{ color: 'rgba(255,255,255,0.85)' }} />
        </div>
        <h3 className="text-lg font-medium mb-2" style={{ color: '#fff' }}>Aucun achat USDT</h3>
        <p style={{ color: '#9ca3af' }}>Il n'y a aucune commande d'achat à afficher.</p>
      </div>
    );
  }

  return (
    <>
      <OrderDetailsDialog
        order={selectedOrder}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onStatusUpdate={onStatusUpdate}
      />

      <div className="space-y-4">
        {orders.map((order) => (
          <div
            key={order.id}
            style={{
              background: CARD,
              border: `1px solid ${BORDER}`,
              borderRadius: '16px',
              overflow: 'hidden',
            }}
          >
            <div className="p-4 sm:p-6">
              {/* Top row */}
              <div className="flex items-start gap-3 flex-wrap">
                <div
                  className="flex items-center justify-center shrink-0"
                  style={{ width: '46px', height: '46px', background: ICON_BG, borderRadius: '12px' }}
                >
                  <Coins className="w-6 h-6" style={{ color: 'rgba(255,255,255,0.85)' }} />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-medium" style={{ color: '#fff' }}>
                      #TEREX-{order.id.slice(-8)}
                    </h3>
                    <button
                      onClick={() => copyToClipboard(`TEREX-${order.id.slice(-8)}`)}
                      style={{ color: '#6b7280' }}
                      className="transition-colors hover:opacity-80"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <StatusBadge status={order.status} />
                  </div>

                  <div className="flex items-center gap-2 mt-1 text-sm flex-wrap" style={{ color: '#9ca3af' }}>
                    <span>{new Date(order.created_at).toLocaleDateString('fr-FR')}</span>
                    <span>•</span>
                    <span>Achat USDT</span>
                  </div>
                </div>
              </div>

              {/* Amount row */}
              <div className="mt-4">
                <div className="text-2xl font-bold" style={{ color: '#fff' }}>
                  {order.amount.toLocaleString()} {order.currency}
                </div>
                <div className="text-sm" style={{ color: '#9ca3af' }}>
                  → {order.usdt_amount} USDT
                </div>
              </div>

              {/* Actions row */}
              <div className="mt-4 flex flex-wrap" style={{ gap: '8px' }}>
                <button
                  onClick={() => {
                    setSelectedOrder(order);
                    setDialogOpen(true);
                  }}
                  style={neutralBtnStyle}
                >
                  <Eye className="w-4 h-4" />
                  Détails
                </button>

                <button
                  onClick={() => onMoveToTrash(order.id)}
                  style={iconDangerBtnStyle}
                  aria-label="Supprimer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                {order.status === 'pending' && (
                  <>
                    <button
                      onClick={() => onStatusUpdate(order.id, 'processing' as OrderStatus)}
                      style={ctaBtnStyle}
                    >
                      <TrendingUp className="w-4 h-4" />
                      Traiter
                    </button>
                    <button
                      onClick={() => onStatusUpdate(order.id, 'cancelled' as OrderStatus)}
                      style={dangerBtnStyle}
                    >
                      <XCircle className="w-4 h-4" />
                      Annuler
                    </button>
                  </>
                )}

                {order.status === 'processing' && (
                  <>
                    <button
                      onClick={() => onStatusUpdate(order.id, 'completed' as OrderStatus, 'paid')}
                      style={ctaBtnStyle}
                    >
                      <CheckCircle className="w-4 h-4" />
                      Terminer
                    </button>
                    <button
                      onClick={() => onStatusUpdate(order.id, 'cancelled' as OrderStatus)}
                      style={dangerBtnStyle}
                    >
                      <XCircle className="w-4 h-4" />
                      Annuler
                    </button>
                  </>
                )}
              </div>
            </div>
            <ClientStrip client={clientInfos[order.user_id]} />
          </div>
        ))}
      </div>
    </>
  );
}

interface BuyOrdersTableProps {
  orders: UnifiedOrder[];
  onStatusUpdate: (orderId: string, status: OrderStatus, paymentStatus?: string) => void;
  onMoveToTrash: (orderId: string) => void;
}
