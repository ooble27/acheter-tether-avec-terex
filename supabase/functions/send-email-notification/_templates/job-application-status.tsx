import { wrapEmail, hero, infoTable, noticeBox, ctaButton, spacer, checkRing, alertRing, dotBadge, C } from './html-utils.ts';

interface JobApplicationStatusProps {
  firstName: string;
  position: string;
  status: 'pending' | 'reviewing' | 'interview' | 'accepted' | 'rejected' | string;
  adminNotes?: string;
}

const F = `-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif`;

export function jobApplicationStatusHtml({ firstName, position, status, adminNotes }: JobApplicationStatusProps): string {
  const configs: Record<string, {
    icon: string; title: string; subtitle: string;
    statusLabel: string; statusColor: string; notice: string; cta: string;
  }> = {
    reviewing: {
      icon: dotBadge('En cours d\'examen', C.amber),
      title: 'Votre candidature est en cours d\'examen',
      subtitle: `Bonjour ${firstName}, notre équipe RH examine actuellement votre dossier pour le poste de <strong style="color:#fafafa;">${position}</strong>.`,
      statusLabel: 'En cours d\'examen', statusColor: C.amber,
      notice: 'Nous faisons de notre mieux pour vous répondre rapidement. Merci de votre patience.',
      cta: 'https://terangaexchange.com/careers',
    },
    interview: {
      icon: dotBadge('Entretien programmé', C.green),
      title: 'Votre candidature a retenu notre attention',
      subtitle: `Bonjour ${firstName}, nous avons le plaisir de vous informer que votre candidature pour <strong style="color:#fafafa;">${position}</strong> a été présélectionnée.`,
      statusLabel: 'Entretien à venir', statusColor: C.green,
      notice: 'Un membre de notre équipe RH vous contactera dans les 48 heures pour convenir d\'un créneau d\'entretien.',
      cta: 'https://terangaexchange.com',
    },
    accepted: {
      icon: checkRing(),
      title: 'Félicitations, votre candidature a été acceptée !',
      subtitle: `Bonjour ${firstName}, nous avons le plaisir de vous informer que votre candidature pour le poste de <strong style="color:#fafafa;">${position}</strong> a été retenue.`,
      statusLabel: 'Acceptée', statusColor: C.green,
      notice: 'Notre équipe RH vous contactera très prochainement pour vous communiquer les prochaines étapes et les détails de votre intégration.',
      cta: 'https://terangaexchange.com',
    },
    rejected: {
      icon: alertRing('✕', C.red),
      title: 'Candidature non retenue',
      subtitle: `Bonjour ${firstName}, après examen attentif de votre dossier pour le poste de <strong style="color:#fafafa;">${position}</strong>, nous ne pouvons malheureusement pas donner suite à votre candidature.`,
      statusLabel: 'Non retenue', statusColor: C.red,
      notice: 'Votre profil a été conservé dans notre base de talents. Nous vous contacterons si d\'autres opportunités correspondant à votre profil se présentent.',
      cta: 'https://terangaexchange.com/careers',
    },
    pending: {
      icon: dotBadge('En attente', C.amber),
      title: 'Candidature en attente d\'examen',
      subtitle: `Bonjour ${firstName}, votre candidature pour le poste de <strong style="color:#fafafa;">${position}</strong> est en file d\'attente d\'examen.`,
      statusLabel: 'En attente', statusColor: C.amber,
      notice: 'Notre équipe traitera votre dossier dans les meilleurs délais.',
      cta: 'https://terangaexchange.com/careers',
    },
  };

  const cfg = configs[status] || configs.pending;

  const adminNotesBlock = adminNotes ? `
<tr>
  <td style="padding:0 24px 24px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
      style="background-color:${C.infoBg};border:1px solid ${C.border};border-left:3px solid ${C.green};border-radius:10px;overflow:hidden;border-collapse:separate;border-spacing:0;">
      <tr>
        <td class="edim" style="padding:10px 16px;font-family:${F};font-size:10px;font-weight:600;letter-spacing:1.8px;text-transform:uppercase;color:${C.textDim};border-bottom:1px solid ${C.borderSoft};">
          Message de l'équipe RH Terex
        </td>
      </tr>
      <tr>
        <td class="emuted" style="padding:16px;font-family:${F};font-size:13px;color:${C.textMuted};line-height:1.7;font-style:italic;">
          « ${adminNotes.replace(/</g, '&lt;').replace(/>/g, '&gt;')} »
        </td>
      </tr>
    </table>
  </td>
</tr>` : '';

  const rows =
    hero({ iconHtml: cfg.icon, title: cfg.title, subtitle: cfg.subtitle }) +
    spacer(20) +
    infoTable([
      { label: 'Poste',   value: position },
      { label: 'Statut',  value: cfg.statusLabel, green: status === 'accepted' || status === 'interview' },
      { label: 'Candidat', value: firstName, last: true },
    ], 'Mise à jour de votre candidature') +
    adminNotesBlock +
    noticeBox(cfg.notice, status === 'rejected' ? 'warning' : undefined) +
    ctaButton(
      status === 'accepted' ? 'Accéder à Terex' : status === 'rejected' ? 'Voir d\'autres offres' : 'Suivre ma candidature',
      cfg.cta
    );

  const badgeColor = status === 'accepted' || status === 'interview' ? 'success' : status === 'rejected' ? 'error' : 'pending';

  return wrapEmail(
    `Candidature ${position} — ${cfg.statusLabel}`,
    rows,
    dotBadge(cfg.statusLabel, cfg.statusColor),
    'Vous avez reçu cet email suite à une mise à jour de votre candidature chez Terex.'
  );
}
