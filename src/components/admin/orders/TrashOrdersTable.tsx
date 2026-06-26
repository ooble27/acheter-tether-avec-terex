
import { useState } from 'react';
import {
  RotateCcw,
  Eye,
  Copy,
  Trash2,
  Coins,
  HandCoins,
  Send
} from 'lucide-react';
import { UnifiedOrder } from '@/hooks/useOrders';

const CARD = '#1e1e1e';
const BORDER = 'rgba(255,255,255,0.07)';
const ICON_BG = 'rgba(255,255,255,0.06)';

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

interface TrashOrdersTableProps {
  orders: UnifiedOrder[];
  onRestoreFromTrash: (orderId: string) => void;
  onDeletePermanently: (orderId: string) => void;
}

export function TrashOrdersTable({ orders, onRestoreFromTrash, onDeletePermanently }: TrashOrdersTableProps) {
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  const getOrderIcon = (type: string) => {
    switch (type) {
      case 'buy':
        return <Coins className="w-6 h-6" style={{ color: 'rgba(255,255,255,0.85)' }} />;
      case 'sell':
        return <HandCoins className="w-6 h-6" style={{ color: 'rgba(255,255,255,0.85)' }} />;
      case 'transfer':
        return <Send className="w-6 h-6" style={{ color: 'rgba(255,255,255,0.85)' }} />;
      default:
        return <Trash2 className="w-6 h-6" style={{ color: 'rgba(255,255,255,0.85)' }} />;
    }
  };

  const getOrderTypeLabel = (type: string) => {
    switch (type) {
      case 'buy':
        return 'Achat USDT';
      case 'sell':
        return 'Vente USDT';
      case 'transfer':
        return 'Transfert International';
      default:
        return type;
    }
  };

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
          <Trash2 className="w-8 h-8" style={{ color: 'rgba(255,255,255,0.85)' }} />
        </div>
        <h3 className="text-lg font-medium mb-2" style={{ color: '#fff' }}>Corbeille vide</h3>
        <p style={{ color: '#9ca3af' }}>Aucune commande supprimée à afficher.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <div
          key={order.id}
          style={{
            background: CARD,
            border: `1px solid ${BORDER}`,
            borderRadius: '16px',
            overflow: 'hidden',
            opacity: 0.85,
          }}
        >
          <div className="p-4 sm:p-6">
            {/* Top row */}
            <div className="flex items-start gap-3 flex-wrap">
              <div
                className="flex items-center justify-center shrink-0"
                style={{ width: '46px', height: '46px', background: ICON_BG, borderRadius: '12px' }}
              >
                {getOrderIcon(order.type)}
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
                  <span
                    style={{
                      background: 'rgba(255,255,255,0.06)',
                      color: 'rgba(255,255,255,0.65)',
                      borderRadius: '999px',
                      padding: '3px 10px',
                      fontSize: '11px',
                      fontWeight: 600,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    Supprimé
                  </span>
                </div>

                <div className="flex items-center gap-2 mt-1 text-sm flex-wrap" style={{ color: '#9ca3af' }}>
                  <span>{new Date(order.created_at).toLocaleDateString('fr-FR')}</span>
                  <span>•</span>
                  <span>{getOrderTypeLabel(order.type)}</span>
                </div>
              </div>
            </div>

            {/* Amount row */}
            <div className="mt-4">
              {order.type === 'buy' && (
                <>
                  <div className="text-2xl font-bold" style={{ color: '#fff' }}>
                    {order.amount.toLocaleString()} {order.currency}
                  </div>
                  <div className="text-sm" style={{ color: '#9ca3af' }}>
                    → {order.usdt_amount} USDT
                  </div>
                </>
              )}

              {order.type === 'sell' && (
                <>
                  <div className="text-2xl font-bold" style={{ color: '#fff' }}>
                    {order.usdt_amount} USDT
                  </div>
                  <div className="text-sm" style={{ color: '#9ca3af' }}>
                    → {order.amount.toLocaleString()} {order.currency}
                  </div>
                </>
              )}

              {order.type === 'transfer' && (
                <>
                  <div className="text-2xl font-bold" style={{ color: '#fff' }}>
                    {order.amount.toLocaleString()} {order.from_currency || order.currency}
                  </div>
                  <div className="text-sm" style={{ color: '#9ca3af' }}>
                    → {order.total_amount?.toLocaleString()} {order.to_currency}
                  </div>
                </>
              )}
            </div>

            {/* Actions row */}
            <div className="mt-4 flex flex-wrap" style={{ gap: '8px' }}>
              <button
                onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                style={neutralBtnStyle}
              >
                <Eye className="w-4 h-4" />
                {expandedOrder === order.id ? 'Masquer' : 'Détails'}
              </button>

              <button
                onClick={() => onRestoreFromTrash(order.id)}
                style={neutralBtnStyle}
              >
                <RotateCcw className="w-4 h-4" />
                Restaurer
              </button>

              <button
                onClick={() => {
                  if (window.confirm('Êtes-vous sûr de vouloir supprimer définitivement cette commande ? Cette action est irréversible.')) {
                    onDeletePermanently(order.id);
                  }
                }}
                style={dangerBtnStyle}
              >
                <Trash2 className="w-4 h-4" />
                Supprimer
              </button>
            </div>
          </div>

          {/* Expanded Details */}
          {expandedOrder === order.id && (
            <div
              className="p-4 sm:p-6"
              style={{ borderTop: `1px solid ${BORDER}`, background: 'rgba(255,255,255,0.03)' }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <h4 className="text-sm font-medium mb-2" style={{ color: '#9ca3af' }}>Informations générales</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span style={{ color: '#6b7280' }}>Type:</span>
                      <span style={{ color: '#fff' }}>{getOrderTypeLabel(order.type)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span style={{ color: '#6b7280' }}>Date de suppression:</span>
                      <span style={{ color: '#fff' }}>{new Date(order.deleted_at || order.updated_at).toLocaleDateString('fr-FR')}</span>
                    </div>
                  </div>
                </div>

                {order.payment_method && (
                  <div>
                    <h4 className="text-sm font-medium mb-2" style={{ color: '#9ca3af' }}>Méthode de paiement</h4>
                    <div className="text-sm" style={{ color: '#fff' }}>{order.payment_method}</div>
                  </div>
                )}

                {order.notes && (
                  <div>
                    <h4 className="text-sm font-medium mb-2" style={{ color: '#9ca3af' }}>Notes</h4>
                    <div
                      className="p-3 rounded text-sm"
                      style={{ background: 'rgba(255,255,255,0.04)', color: '#fff' }}
                    >
                      {order.notes}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
