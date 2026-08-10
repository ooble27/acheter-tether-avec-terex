/**
 * Héro par onglet du back-office Terex — style Ooble.
 *
 * Insère un `AdminHero` juste au-dessus du contenu de chaque onglet, avec
 * des stats calculées depuis les commandes réelles quand l'onglet en dépend
 * (queue, orders, accounting). Pour les onglets sans données commandes, on
 * affiche un héro descriptif propre au domaine (ex. équipe, marketing…).
 *
 * Aucun onglet n'est modifié : le hero vit à côté, dans le AdminPortal.
 */
import { useMemo } from 'react';
import AdminHero from './AdminHero';
import { useOrdersData } from './OrdersDataProvider';

const nfCfa = new Intl.NumberFormat('fr-FR');

export function SectionHero({ tab }: { tab: string }) {
  const { orders } = useOrdersData();

  const stats = useMemo(() => {
    const buys = orders.filter(o => o.type === 'buy');
    const sells = orders.filter(o => o.type === 'sell');
    const pending = orders.filter(o => o.status === 'pending' || o.status === 'processing');
    const completed = orders.filter(o => o.status === 'completed');
    const totalVolumeCFA = completed
      .filter(o => (o as any).currency === 'CFA')
      .reduce((s, o) => s + Number(o.amount || 0), 0);
    const totalUSDT = completed.reduce((s, o) => s + Number((o as any).usdt_amount || 0), 0);
    return { buys, sells, pending, completed, totalVolumeCFA, totalUSDT };
  }, [orders]);

  switch (tab) {
    case 'queue':
      return (
        <AdminHero
          eyebrow="File d'attente"
          value={stats.pending.length}
          unit={stats.pending.length > 1 ? 'commandes à traiter' : 'commande à traiter'}
          stats={[
            { label: 'Achats', value: stats.buys.filter(o => o.status === 'pending' || o.status === 'processing').length },
            { label: 'Ventes', value: stats.sells.filter(o => o.status === 'pending' || o.status === 'processing').length },
            { label: 'Volume actif', value: nfCfa.format(stats.pending.reduce((s, o) => s + Number(o.amount || 0), 0)), hint: 'CFA' },
          ]}
        />
      );

    case 'orders':
      return (
        <AdminHero
          eyebrow="Commandes"
          value={orders.length}
          unit="au total"
          stats={[
            { label: 'Complétées', value: stats.completed.length },
            { label: 'En cours', value: stats.pending.length },
            { label: 'Achats', value: stats.buys.length },
            { label: 'Ventes', value: stats.sells.length },
          ]}
        />
      );

    case 'accounting':
      return (
        <AdminHero
          eyebrow="Comptabilité"
          value={nfCfa.format(stats.totalVolumeCFA)}
          unit="CFA échangés"
          stats={[
            { label: 'USDT traité', value: nfCfa.format(Math.round(stats.totalUSDT)), hint: 'USDT' },
            { label: 'Commandes complétées', value: stats.completed.length },
            { label: 'Marge brute', value: nfCfa.format(Math.round(stats.totalVolumeCFA * 0.02)), hint: 'CFA' },
          ]}
        />
      );

    case 'kyc':
      return (
        <AdminHero
          eyebrow="KYC"
          value="Vérifications"
          unit="d'identité"
          stats={[
            { label: 'À traiter', value: '—' },
            { label: 'Approuvées', value: '—' },
            { label: 'Rejetées', value: '—' },
          ]}
        />
      );

    case 'performance':
      return (
        <AdminHero
          eyebrow="Équipe"
          value="Performance"
          unit="par membre"
          stats={[
            { label: 'Commandes traitées', value: stats.completed.length },
            { label: 'Volume', value: nfCfa.format(stats.totalVolumeCFA), hint: 'CFA' },
          ]}
        />
      );

    case 'attendance':
      return (
        <AdminHero
          eyebrow="Ressources humaines"
          value="Présences"
          unit="et pointage"
          stats={[
            { label: 'Pour la paie', value: '—' },
          ]}
        />
      );

    case 'content':
      return (
        <AdminHero
          eyebrow="Marketing"
          value="Studio de contenu"
          stats={[
            { label: 'Réseaux', value: 'IG · X · LinkedIn' },
          ]}
        />
      );

    case 'newsletter':
      return (
        <AdminHero
          eyebrow="Marketing"
          value="Campagnes email"
          stats={[
            { label: 'Envois programmés', value: '—' },
          ]}
        />
      );

    case 'applications':
      return (
        <AdminHero
          eyebrow="Recrutement"
          value="Candidatures"
          stats={[
            { label: 'À examiner', value: '—' },
          ]}
        />
      );

    case 'team':
      return (
        <AdminHero
          eyebrow="Organisation"
          value="Équipe & rôles"
          unit="du back-office"
        />
      );

    case 'neobank':
      return (
        <AdminHero
          eyebrow="Vision"
          value="Néobanque Terex"
          unit="feuille de route"
        />
      );

    case 'kb':
      return (
        <AdminHero
          eyebrow="Interne"
          value="Base de connaissances"
          unit="équipe"
        />
      );

    default:
      return null;
  }
}
