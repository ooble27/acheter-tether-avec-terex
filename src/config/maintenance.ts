// ─────────────────────────────────────────────────────────────────────────────
// MODE MAINTENANCE ("site en construction")
//
// Quand MAINTENANCE_MODE = true : les visiteurs voient une page « en
// construction ». À remettre à FALSE une fois la migration terminée.
//
// ACCÈS ÉQUIPE : toi et tes employés pouvez continuer à utiliser le site
// normalement (achats de test, admin…) en ouvrant une fois ce lien secret :
//
//     https://terangaexchange.com/?acces=terex-equipe
//
// L'accès est mémorisé sur l'appareil. Pour le retirer : ?acces=off
// ─────────────────────────────────────────────────────────────────────────────

export const MAINTENANCE_MODE = true;

// Code d'accès secret pour contourner la page de maintenance.
const ACCESS_CODE = 'terex-equipe';
const STORAGE_KEY = 'terex_access';

/**
 * Gère le lien d'accès secret et indique si l'utilisateur peut voir le site
 * complet malgré le mode maintenance.
 */
export function hasMaintenanceBypass(): boolean {
  try {
    const params = new URLSearchParams(window.location.search);
    const acces = params.get('acces');
    if (acces === ACCESS_CODE) {
      localStorage.setItem(STORAGE_KEY, '1');
    } else if (acces === 'off') {
      localStorage.removeItem(STORAGE_KEY);
    }
    return localStorage.getItem(STORAGE_KEY) === '1';
  } catch {
    return false;
  }
}
