/**
 * Héro par onglet du back-office Terex — style Ooble.
 *
 * Toujours 3 stats pour uniformiser la taille visuelle entre tous les onglets.
 * Les stats sont calculées depuis les commandes réelles (queue, orders,
 * accounting) ou depuis les KPIs métier attendus dans chaque section.
 */
import { useMemo } from 'react';
import AdminHero from './AdminHero';
import { useOrdersData } from './OrdersDataProvider';
import { useOrderOps } from '@/hooks/useOrderOps';

const nfCfa = new Intl.NumberFormat('fr-FR');

export function SectionHero({ tab }: { tab: string }) {
  const { orders } = useOrdersData();
  const { currentUserId } = useOrderOps();

  const s = useMemo(() => {
    const alive = orders.filter(o => !(o as any).is_deleted);
    const active = alive.filter(o => o.status === 'pending' || o.status === 'processing');
    const unassigned = active.filter(o => !(o as any).assigned_to);
    const mine = active.filter(o => (o as any).assigned_to && (o as any).assigned_to === currentUserId);
    const others = active.filter(o => (o as any).assigned_to && (o as any).assigned_to !== currentUserId);
    const completed = alive.filter(o => o.status === 'completed');
    const totalCFA = completed
      .filter(o => (o as any).currency === 'CFA')
      .reduce((sum, o) => sum + Number(o.amount || 0), 0);
    const totalUSDT = completed.reduce((sum, o) => sum + Number((o as any).usdt_amount || 0), 0);
    const buys = alive.filter(o => o.type === 'buy');
    const sells = alive.filter(o => o.type === 'sell');
    // Volume 7 derniers jours
    const weekAgo = Date.now() - 7 * 24 * 3600 * 1000;
    const weekOrders = completed.filter(o => new Date(o.created_at).getTime() >= weekAgo);
    const weekVolumeCFA = weekOrders
      .filter(o => (o as any).currency === 'CFA')
      .reduce((sum, o) => sum + Number(o.amount || 0), 0);
    return { alive, active, unassigned, mine, others, completed, totalCFA, totalUSDT, buys, sells, weekOrders, weekVolumeCFA };
  }, [orders, currentUserId]);

  switch (tab) {
    case 'queue':
      return (
        <AdminHero
          eyebrow="File d'attente"
          value={s.unassigned.length}
          unit={s.unassigned.length > 1 ? 'à prendre' : 'à prendre'}
          stats={[
            { label: 'Mes commandes', value: s.mine.length },
            { label: "Par l'équipe", value: s.others.length },
            { label: 'Volume actif', value: nfCfa.format(s.active.reduce((sum, o) => sum + Number(o.amount || 0), 0)), hint: 'CFA' },
          ]}
        />
      );

    case 'orders':
      return (
        <AdminHero
          eyebrow="Commandes"
          value={s.alive.length}
          unit="au total"
          stats={[
            { label: 'Complétées', value: s.completed.length },
            { label: 'En cours', value: s.active.length },
            { label: 'Achats · Ventes', value: `${s.buys.length} · ${s.sells.length}` },
          ]}
        />
      );

    case 'accounting':
      return (
        <AdminHero
          eyebrow="Comptabilité"
          value={nfCfa.format(s.totalCFA)}
          unit="CFA échangés"
          stats={[
            { label: 'USDT traité', value: nfCfa.format(Math.round(s.totalUSDT)), hint: 'USDT' },
            { label: 'Commandes', value: s.completed.length, hint: 'complétées' },
            { label: 'Volume 7j', value: nfCfa.format(s.weekVolumeCFA), hint: 'CFA' },
          ]}
        />
      );

    case 'kyc':
      return (
        <AdminHero
          eyebrow="KYC"
          value={s.alive.filter(o => (o as any).currency === 'CFA').length}
          unit="clients actifs"
          stats={[
            { label: 'À examiner', value: '—' },
            { label: 'Approuvés', value: '—' },
            { label: 'Rejetés', value: '—' },
          ]}
        />
      );

    case 'performance':
      return (
        <AdminHero
          eyebrow="Équipe"
          value={s.completed.length}
          unit="commandes traitées"
          stats={[
            { label: 'Volume total', value: nfCfa.format(s.totalCFA), hint: 'CFA' },
            { label: 'En cours', value: s.active.length },
            { label: 'Cette semaine', value: s.weekOrders.length },
          ]}
        />
      );

    case 'attendance':
      return (
        <AdminHero
          eyebrow="Ressources humaines"
          value={0}
          unit="membres pointés"
          stats={[
            { label: 'Actifs aujourd\'hui', value: '—' },
            { label: 'Heures cumulées', value: '—' },
            { label: 'Cette semaine', value: '—' },
          ]}
        />
      );

    case 'content':
      return (
        <AdminHero
          eyebrow="Marketing"
          value={0}
          unit="publications"
          stats={[
            { label: 'Programmées', value: '—' },
            { label: 'Publiées', value: '—' },
            { label: 'Ce mois-ci', value: '—' },
          ]}
        />
      );

    case 'newsletter':
      return (
        <AdminHero
          eyebrow="Marketing"
          value={0}
          unit="campagnes"
          stats={[
            { label: 'Envoyées', value: '—' },
            { label: 'Ouvertures', value: '—' },
            { label: 'Clics', value: '—' },
          ]}
        />
      );

    case 'applications':
      return (
        <AdminHero
          eyebrow="Recrutement"
          value={0}
          unit="candidatures"
          stats={[
            { label: 'À examiner', value: '—' },
            { label: 'Entretiens', value: '—' },
            { label: 'Ce mois-ci', value: '—' },
          ]}
        />
      );

    case 'team':
      return (
        <AdminHero
          eyebrow="Organisation"
          value={0}
          unit="membres"
          stats={[
            { label: 'Admins', value: '—' },
            { label: 'Opérateurs', value: '—' },
            { label: 'Rôles définis', value: '—' },
          ]}
        />
      );

    case 'neobank':
      return (
        <AdminHero
          eyebrow="Vision"
          value="Néobanque"
          unit="feuille de route"
          stats={[
            { label: 'Phase actuelle', value: 'Exchange' },
            { label: 'Prochaine étape', value: 'Cartes' },
            { label: 'Statut', value: 'En cours' },
          ]}
        />
      );

    case 'labo':
      return (
        <AdminHero
          eyebrow="Labo"
          value="Prototypes"
          unit="isolés de la prod"
          stats={[
            { label: 'Expérimentations', value: 2 },
            { label: 'Fonds réels', value: 'Aucun' },
            { label: 'Statut', value: 'Bêta' },
          ]}
        />
      );

    case 'kb':
      return (
        <AdminHero
          eyebrow="Interne"
          value="Guide équipe"
          unit=""
          stats={[
            { label: 'Articles', value: '—' },
            { label: 'Sections', value: '—' },
            { label: 'Mise à jour', value: '—' },
          ]}
        />
      );

    default:
      return null;
  }
}
