
interface LimitsValidatorProps {
  amount: string;
  currency: string;
  onLimitExceeded: (amount: string) => void;
  children: React.ReactNode;
}

export const PURCHASE_LIMITS = {
  CFA: {
    min: 50000,
    max: 2000000
  },
  CAD: {
    min: 100,
    max: 4000
  }
};

export function LimitsValidator({ amount, currency, onLimitExceeded, children }: LimitsValidatorProps) {
  const numericAmount = parseFloat(amount) || 0;
  const limits = PURCHASE_LIMITS[currency as keyof typeof PURCHASE_LIMITS];
  
  if (!limits) return <>{children}</>;
  
  const isOverLimit = numericAmount > limits.max;
  const isUnderLimit = numericAmount > 0 && numericAmount < limits.min;
  
  if (isOverLimit) {
    onLimitExceeded(amount);
    return null;
  }
  
  return <>{children}</>;
}

export function getLimitMessage(amount: string, currency: string): { type: 'error' | 'warning' | null; message: string } {
  const numericAmount = parseFloat(amount) || 0;
  const limits = PURCHASE_LIMITS[currency as keyof typeof PURCHASE_LIMITS];
  
  if (!limits || numericAmount === 0) return { type: null, message: '' };
  
  if (numericAmount > limits.max) {
    return {
      type: 'error',
      message: `Montant maximum : ${limits.max.toLocaleString()} ${currency}. Pour des montants supérieurs, contactez notre équipe VIP.`
    };
  }
  
  if (numericAmount < limits.min) {
    return {
      type: 'error',
      message: `Montant minimum : ${limits.min.toLocaleString()} ${currency}`
    };
  }
  
  // Warning quand on approche de la limite
  if (numericAmount > limits.max * 0.9) {
    return {
      type: 'warning',
      message: `Vous approchez de la limite maximale (${limits.max.toLocaleString()} ${currency})`
    };
  }
  
  return { type: null, message: '' };
}
