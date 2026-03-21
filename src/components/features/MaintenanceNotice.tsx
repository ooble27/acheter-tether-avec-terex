import { AlertTriangle, Wrench } from 'lucide-react';

// Toggle this to enable/disable maintenance mode for transactions
export const MAINTENANCE_MODE = true;
export const MAINTENANCE_MESSAGE = "Notre système de paiement est en cours de maintenance. Les transactions seront disponibles très prochainement. Merci de votre patience.";

export function MaintenanceNotice() {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div className="w-20 h-20 rounded-full bg-amber-500/10 flex items-center justify-center mb-6">
        <Wrench className="w-10 h-10 text-amber-500" />
      </div>
      <h2 className="text-xl font-semibold text-white mb-3">Maintenance en cours</h2>
      <p className="text-gray-400 max-w-md mb-6 leading-relaxed">
        {MAINTENANCE_MESSAGE}
      </p>
      <div className="flex items-center gap-2 text-amber-500/80 text-sm">
        <AlertTriangle className="w-4 h-4" />
        <span>Nous nous excusons pour la gêne occasionnée</span>
      </div>
    </div>
  );
}
