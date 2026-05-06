import { wrapEmail, hero, steps, noticeBox, ctaButton, infoTable, checkRing, statusBadge, spacer } from './html-utils.ts';

interface JobApplicationConfirmationProps {
  firstName: string;
  lastName?: string;
  position: string;
  appliedAt?: string;
}

export function jobApplicationConfirmationHtml({ firstName, lastName, position, appliedAt }: JobApplicationConfirmationProps): string {
  const dateStr = appliedAt
    ? new Date(appliedAt).toLocaleString('fr-FR', { dateStyle: 'long', timeStyle: 'short' })
    : new Date().toLocaleDateString('fr-FR', { dateStyle: 'long' });

  const stepsItems = [
    { text: 'Candidature reçue et enregistrée', done: true },
    { text: 'Examen de votre dossier par notre équipe RH' },
    { text: 'Contact pour un entretien si votre profil correspond' },
    { text: 'Décision finale — offre ou retour' },
  ];

  const rows =
    hero({
      iconHtml: checkRing(),
      title: 'Votre candidature a été reçue',
      subtitle: `Bonjour ${firstName}, nous avons bien enregistré votre candidature pour le poste de <strong style="color:#fafafa;">${position}</strong> chez Terex.`,
    }) +
    spacer(28) +
    infoTable([
      { label: 'Poste',          value: position,          green: true },
      { label: 'Candidat',       value: [firstName, lastName].filter(Boolean).join(' ') },
      { label: 'Date de dépôt',  value: dateStr },
      { label: 'Délai de réponse', value: '48 heures ouvrables', last: true },
    ], 'Récapitulatif') +
    steps(stepsItems) +
    noticeBox('Nous examinons chaque candidature avec attention. Si votre profil correspond à nos besoins, notre équipe RH vous contactera directement pour organiser un entretien.') +
    ctaButton('Voir nos autres offres', 'https://terangaexchange.com/careers');

  return wrapEmail(
    `Candidature reçue — ${position} chez Terex`,
    rows,
    statusBadge('Reçue', 'success'),
    'Vous avez reçu cet email suite à votre candidature chez Terex.'
  );
}
