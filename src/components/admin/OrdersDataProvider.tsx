import { createContext, useContext } from 'react';
import { useOrders } from '@/hooks/useOrders';

/**
 * Source de données UNIQUE des commandes pour tout le back-office.
 *
 * Avant : chaque onglet (File d'attente, Commandes, Comptabilité…) appelait
 * `useOrders()` de son côté → en changeant d'onglet, tout se rechargeait et un
 * « Chargement… » clignotait. Ici, on charge et on s'abonne au temps réel UNE
 * SEULE fois au niveau de l'admin ; tous les onglets lisent les mêmes données
 * déjà prêtes → changement d'onglet instantané, sans flash.
 */
type OrdersValue = ReturnType<typeof useOrders>;
const OrdersDataContext = createContext<OrdersValue | null>(null);

export function OrdersDataProvider({ children }: { children: React.ReactNode }) {
  const value = useOrders();
  return <OrdersDataContext.Provider value={value}>{children}</OrdersDataContext.Provider>;
}

export function useOrdersData(): OrdersValue {
  const ctx = useContext(OrdersDataContext);
  if (!ctx) throw new Error('useOrdersData doit être utilisé dans <OrdersDataProvider>');
  return ctx;
}
