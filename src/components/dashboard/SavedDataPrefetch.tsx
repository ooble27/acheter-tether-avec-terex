import { useSavedWallets } from '@/hooks/useSavedWallets';
import { useSavedPhones } from '@/hooks/useSavedPhones';

/**
 * Composant invisible monté dans le Dashboard : appelle les hooks
 * useSavedWallets/useSavedPhones dès que l'utilisateur est authentifié,
 * ce qui préchauffe le cache module-level. Quand le client ouvre ensuite
 * le flow Achat/Vente et arrive à l'étape adresse/numéro, l'affichage
 * est immédiat (aucun round-trip Supabase).
 */
export function SavedDataPrefetch() {
  useSavedWallets();
  useSavedPhones();
  return null;
}
