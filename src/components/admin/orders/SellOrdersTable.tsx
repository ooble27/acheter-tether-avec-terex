

import { useMemo, useState } from 'react';
import {
  CheckCircle,
  XCircle,
  TrendingUp,
  Eye,
  Copy,
  HandCoins,
  Trash2
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

interface SellOrdersTableProps {
  orders: UnifiedOrder[];
  onStatusUpdate: (orderId: string, status: OrderStatus, paymentStatus?: string) => void;
  onMoveToTrash: (orderId: string) => void;
}

export function SellOrdersTable({ orders, onStatusUpdate, onMoveToTrash }: SellOrdersTableProps) {
  const [selectedOrder, setSelectedOrder] = useState<UnifiedOrder | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const userIds = useMemo(() => orders.map((o) => o.user_id), [orders]);
  const clientInfos = useClientInfos(userIds);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const getPaymentServiceInfo = (order: UnifiedOrder) => {
    // Extraire les informations du service de paiement depuis les notes ou payment_details
    let serviceInfo = { service: 'Mobile Money', phone: order.recipient_phone };

    if (order.notes) {
      try {
        const parsedNotes = JSON.parse(order.notes);
        if (parsedNotes.provider === 'wave') {
          serviceInfo.service = 'Wave';
          serviceInfo.phone = parsedNotes.phoneNumber || order.recipient_phone;
        } else if (parsedNotes.provider === 'orange') {
          serviceInfo.service = 'Orange Money';
          serviceInfo.phone = parsedNotes.phoneNumber || order.recipient_phone;
        }
      } catch (e) {
        // Si les notes ne sont pas en JSON, chercher dans le texte
        if (order.notes.includes('Wave')) {
          serviceInfo.service = 'Wave';
        } else if (order.notes.includes('Orange Money')) {
          serviceInfo.service = 'Orange Money';
        }
      }
    }

    // Utiliser payment_method comme fallback
    if (serviceInfo.service === 'Mobile Money') {
      switch (order.payment_method) {
        case 'wave':
          serviceInfo.service = 'Wave';
          break;
        case 'orange_money':
          serviceInfo.service = 'Orange Money';
          break;
        default:
          serviceInfo.service = 'Mobile Money';
      }
    }

    return serviceInfo;
  };

  const handleStatusUpdate = async (orderId: string, status: OrderStatus, paymentStatus?: string) => {
    // Empêcher le rechargement de la page
    await onStatusUpdate(orderId, status, paymentStatus);
  };

  if (orders.length === 0) {
    return (
      <div className="text-center py-12">
        <div
          className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
          style={{ background: ICON_BG }}
        >
          <HandCoins className="w-8 h-8" style={{ color: 'rgba(255,255,255,0.85)' }} />
        </div>
        <h3 className="text-lg font-medium mb-2" style={{ color: '#fff' }}>Aucune vente USDT</h3>
        <p style={{ color: '#9ca3af' }}>Il n'y a aucune commande de vente à afficher.</p>
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

      <div className="space-y-3">
        {orders.map((order) => {
          const paymentInfo = getPaymentServiceInfo(order);

          return (
            <div
              key={order.id}
              style={{
                background: CARD,
                border: `1px solid ${BORDER}`,
                borderRadius: '16px',
                overflow: 'hidden',
              }}
            >
              <div className="p-3.5 sm:p-4 flex flex-col lg:flex-row lg:items-center gap-3 lg:gap-4">
                {/* Icon + identity */}
                <div className="flex items-center gap-3 min-w-0 lg:flex-1">
                  <div
                    className="flex items-center justify-center shrink-0"
                    style={{ width: '44px', height: '44px', background: ICON_BG, borderRadius: '12px' }}
                  >
                    <HandCoins className="w-5 h-5" style={{ color: 'rgba(255,255,255,0.85)' }} />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-[15px]" style={{ color: '#fff' }}>
                        #TEREX-{order.id.slice(-8)}
                      </h3>
                      <button
                        onClick={() => copyToClipboard(`TEREX-${order.id.slice(-8)}`)}
                        style={{ color: '#6b7280' }}
                        className="transition-colors hover:opacity-80"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      <StatusBadge status={order.status} />
                    </div>
                    <div className="flex items-center gap-2 mt-0.5 text-xs flex-wrap" style={{ color: '#6b7280' }}>
                      <span>{new Date(order.created_at).toLocaleDateString('fr-FR')}</span>
                      <span>•</span>
                      <span>Vente USDT</span>
                      <span>•</span>
                      <span>{paymentInfo.service}</span>
                    </div>
                  </div>
                </div>

                {/* Amount */}
                <div className="lg:text-right lg:px-2 shrink-0">
                  <div className="text-lg font-bold leading-tight" style={{ color: '#fff' }}>
                    {order.usdt_amount} USDT
                  </div>
                  <div className="text-xs" style={{ color: '#9ca3af' }}>
                    → {order.amount.toLocaleString()} {order.currency}
                  </div>
                </div>

                {/* Actions — à droite sur desktop */}
                <div className="flex flex-wrap gap-2 lg:justify-end lg:flex-nowrap shrink-0">
                  {order.status === 'pending' && (
                    <>
                      <button onClick={() => handleStatusUpdate(order.id, 'processing' as OrderStatus)} style={ctaBtnStyle}>
                        <TrendingUp className="w-4 h-4" /> Traiter
                      </button>
                      <button onClick={() => handleStatusUpdate(order.id, 'cancelled' as OrderStatus)} style={dangerBtnStyle}>
                        <XCircle className="w-4 h-4" /> Annuler
                      </button>
                    </>
                  )}
                  {order.status === 'processing' && (
                    <>
                      <button onClick={() => handleStatusUpdate(order.id, 'completed' as OrderStatus, 'paid')} style={ctaBtnStyle}>
                        <CheckCircle className="w-4 h-4" /> Terminer
                      </button>
                      <button onClick={() => handleStatusUpdate(order.id, 'cancelled' as OrderStatus)} style={dangerBtnStyle}>
                        <XCircle className="w-4 h-4" /> Annuler
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => { setSelectedOrder(order); setDialogOpen(true); }}
                    style={neutralBtnStyle}
                  >
                    <Eye className="w-4 h-4" /> Détails
                  </button>
                  <button onClick={() => onMoveToTrash(order.id)} style={iconDangerBtnStyle} aria-label="Supprimer">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <ClientStrip client={clientInfos[order.user_id]} />
            </div>
          );
        })}
      </div>
    </>
  );
}
