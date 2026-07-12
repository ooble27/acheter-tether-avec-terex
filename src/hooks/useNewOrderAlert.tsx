import { useEffect, useRef, useState } from 'react';
import { useToast } from '@/hooks/use-toast';

// Petit « bip » synthétisé (aucun fichier à charger) — un signal discret.
function beep() {
  try {
    const Ctx = (window as any).AudioContext || (window as any).webkitAudioContext;
    if (!Ctx) return;
    const ctx = new Ctx();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = 'sine';
    o.frequency.value = 880;
    g.gain.value = 0.0001;
    o.connect(g); g.connect(ctx.destination);
    const now = ctx.currentTime;
    g.gain.exponentialRampToValueAtTime(0.12, now + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, now + 0.25);
    o.start(now); o.stop(now + 0.26);
    setTimeout(() => ctx.close(), 400);
  } catch { /* audio bloqué : on ignore */ }
}

/**
 * Alerte « nouvelle commande à traiter » : compare les IDs des commandes en
 * file, et au moindre NOUVEAU (non vu au premier rendu), joue un bip + toast.
 * Marche aussi bien via le temps réel que via le sondage.
 * Renvoie le nombre de nouvelles commandes non encore consultées (badge).
 */
export function useNewOrderAlert(unassignedIds: string[]) {
  const { toast } = useToast();
  const known = useRef<Set<string> | null>(null);
  const [unseen, setUnseen] = useState(0);

  useEffect(() => {
    // Premier passage : on mémorise l'état existant sans alerter.
    if (known.current === null) {
      known.current = new Set(unassignedIds);
      return;
    }
    const fresh = unassignedIds.filter(id => !known.current!.has(id));
    if (fresh.length > 0) {
      fresh.forEach(id => known.current!.add(id));
      setUnseen(n => n + fresh.length);
      beep();
      toast({
        title: fresh.length === 1 ? 'Nouvelle commande' : `${fresh.length} nouvelles commandes`,
        description: 'À traiter dans la file d\'attente.',
      });
    }
    // Nettoie les IDs qui ne sont plus en file (traités/annulés).
    const current = new Set(unassignedIds);
    for (const id of Array.from(known.current)) if (!current.has(id)) known.current.delete(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unassignedIds.join(',')]);

  const clearUnseen = () => setUnseen(0);
  return { unseen, clearUnseen };
}
