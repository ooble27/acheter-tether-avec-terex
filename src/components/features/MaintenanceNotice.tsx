import { AlertTriangle, Wrench } from 'lucide-react';
import { useLanguage } from '@/i18n/LanguageContext';

// Toggle this to enable/disable maintenance mode for transactions
export const MAINTENANCE_MODE = false;

export function MaintenanceNotice() {
  const { t } = useLanguage();
  
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] py-10 px-4 sm:px-6 text-center">
      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-amber-500/10 flex items-center justify-center mb-5 sm:mb-6">
        <Wrench className="w-8 h-8 sm:w-10 sm:h-10 text-amber-500" />
      </div>
      <h2 className="text-lg sm:text-xl font-semibold text-foreground mb-2 sm:mb-3">{t.maintenance.title}</h2>
      <p className="text-muted-foreground max-w-sm sm:max-w-md mb-5 sm:mb-6 leading-relaxed text-sm sm:text-base">
        {t.maintenance.description}
      </p>
      <div className="flex items-center gap-2 text-amber-500/80 text-xs sm:text-sm">
        <AlertTriangle className="w-4 h-4 shrink-0" />
        <span>{t.maintenance.backToDashboard}</span>
      </div>
    </div>
  );
}
