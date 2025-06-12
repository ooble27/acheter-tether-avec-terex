
interface LimitsValidatorProps {
  amount: string;
  currency: string;
  onHighVolumeRequest: () => void;
  children: React.ReactNode;
  paymentMethod?: string;
}

export const PURCHASE_LIMITS = {
  CFA: {
    min: 50000,
    max: 2000000,
    maxCard: 5000000 // 5 millions pour les cartes bancaires
  },
  CAD: {
    min: 100,
    max: 4000,
    maxCard: 10000 // Équivalent en CAD pour les cartes bancaires
  }
};

export function LimitsValidator({ amount, currency, onHighVolumeRequest, children, paymentMethod }: LimitsValidatorProps) {
  return <>{children}</>;
}

export function getLimitMessage(amount: string, currency: string, paymentMethod?: string): { type: 'error' | 'warning' | 'max-reached' | null; message: string } {
  const numericAmount = parseFloat(amount) || 0;
  const limits = PURCHASE_LIMITS[currency as keyof typeof PURCHASE_LIMITS];
  
  if (!limits || numericAmount === 0) return { type: null, message: '' };
  
  // Utiliser la limite élevée pour les cartes bancaires
  const maxLimit = paymentMethod === 'card' ? limits.maxCard : limits.max;
  
  // Si l'utilisateur a atteint exactement la limite ou essaie de la dépasser
  if (numericAmount >= maxLimit) {
    return {
      type: 'max-reached',
      message: `Vous avez atteint la limite maximale de ${maxLimit.toLocaleString()} ${currency}. Pour des montants supérieurs, contactez notre équipe VIP.`
    };
  }
  
  if (numericAmount < limits.min) {
    return {
      type: 'error',
      message: `Montant minimum : ${limits.min.toLocaleString()} ${currency}`
    };
  }
  
  // Warning quand on approche de la limite (90% de la limite)
  if (numericAmount > maxLimit * 0.9) {
    return {
      type: 'warning',
      message: `Vous approchez de la limite maximale (${maxLimit.toLocaleString()} ${currency})`
    };
  }
  
  return { type: null, message: '' };
}

export function enforceMaxLimit(value: string, currency: string, paymentMethod?: string): string {
  const numericValue = parseFloat(value) || 0;
  const limits = PURCHASE_LIMITS[currency as keyof typeof PURCHASE_LIMITS];
  
  if (!limits) return value;
  
  // Utiliser la limite élevée pour les cartes bancaires
  const maxLimit = paymentMethod === 'card' ? limits.maxCard : limits.max;
  
  // Bloquer à la limite maximale
  if (numericValue > maxLimit) {
    return maxLimit.toString();
  }
  
  return value;
}
