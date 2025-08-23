

interface LimitsValidatorProps {
  amount: string;
  currency: string;
  onHighVolumeRequest: () => void;
  children: React.ReactNode;
}

export const PURCHASE_LIMITS = {
  CFA: {
    min: 50000,
    max: 2000000
  },
  CAD: {
    min: 100,
    max: 5000
  }
};

export function LimitsValidator({ amount, currency, onHighVolumeRequest, children }: LimitsValidatorProps) {
  return <>{children}</>;
}

export function getLimitMessage(amount: string, currency: string): { type: 'error' | 'warning' | 'max-reached' | null; message: string } {
  const numericAmount = parseFloat(amount) || 0;
  const limits = PURCHASE_LIMITS[currency as keyof typeof PURCHASE_LIMITS];
  
  if (!limits || numericAmount === 0) return { type: null, message: '' };
  
  // Si l'utilisateur dépasse la limite (strictement supérieur)
  if (numericAmount > limits.max) {
    return {
      type: 'max-reached',
      message: `Vous avez dépassé la limite maximale de ${limits.max.toLocaleString()} ${currency}. Pour des montants supérieurs, contactez notre équipe VIP.`
    };
  }
  
  if (numericAmount < limits.min) {
    return {
      type: 'error',
      message: `Montant minimum : ${limits.min.toLocaleString()} ${currency}`
    };
  }
  
  // Warning quand on approche de la limite (95% de la limite)
  if (numericAmount > limits.max * 0.95 && numericAmount <= limits.max) {
    return {
      type: 'warning',
      message: `Vous approchez de la limite maximale (${limits.max.toLocaleString()} ${currency})`
    };
  }
  
  return { type: null, message: '' };
}

export function enforceMaxLimit(value: string, currency: string): string {
  const numericValue = parseFloat(value) || 0;
  const limits = PURCHASE_LIMITS[currency as keyof typeof PURCHASE_LIMITS];
  
  if (!limits) return value;
  
  // Permettre jusqu'à la limite maximale incluse
  if (numericValue > limits.max) {
    return limits.max.toString();
  }
  
  return value;
}

