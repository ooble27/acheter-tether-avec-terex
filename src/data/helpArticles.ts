export interface HelpArticleData {
  id: string;
  title: string;
  category: string;
  content: {
    intro: string;
    steps?: Array<{
      title: string;
      description: string;
    }>;
    tips?: string[];
    conclusion?: string;
  };
}

export const helpArticles: HelpArticleData[] = [
  // Commencer
  {
    id: 'create-account',
    title: 'Comment créer un compte',
    category: 'Commencer',
    content: {
      intro: 'Créer un compte Terex est simple et rapide. Suivez ces étapes pour commencer à utiliser notre plateforme d\'échange crypto-fiat.',
      steps: [
        {
          title: 'Accédez à la page d\'inscription',
          description: 'Cliquez sur le bouton "S\'inscrire" ou "Commencer" sur la page d\'accueil de Terex. Vous serez redirigé vers la page de création de compte.'
        },
        {
          title: 'Renseignez vos informations',
          description: 'Entrez votre adresse email et créez un mot de passe sécurisé. Assurez-vous que votre mot de passe contient au moins 8 caractères, incluant des lettres majuscules, minuscules et des chiffres.'
        },
        {
          title: 'Vérifiez votre email',
          description: 'Un email de vérification sera envoyé à l\'adresse fournie. Cliquez sur le lien dans l\'email pour activer votre compte.'
        },
        {
          title: 'Complétez votre profil',
          description: 'Une fois votre email vérifié, connectez-vous et complétez votre profil avec vos informations personnelles.'
        }
      ],
      tips: [
        'Utilisez une adresse email valide et accessible',
        'Créez un mot de passe unique et sécurisé',
        'Vérifiez vos spams si vous ne recevez pas l\'email de vérification',
        'Conservez vos identifiants dans un endroit sûr'
      ],
      conclusion: 'Félicitations ! Votre compte est maintenant créé. La prochaine étape est de compléter votre vérification KYC pour accéder à toutes les fonctionnalités de la plateforme.'
    }
  },
  {
    id: 'kyc-verification',
    title: 'Vérification d\'identité (KYC)',
    category: 'Commencer',
    content: {
      intro: 'La vérification KYC (Know Your Customer) est obligatoire pour garantir la sécurité de tous nos utilisateurs et respecter les réglementations en vigueur.',
      steps: [
        {
          title: 'Accédez à la section KYC',
          description: 'Depuis votre tableau de bord, cliquez sur "Vérifier mon identité" ou accédez à la section KYC dans votre profil.'
        },
        {
          title: 'Préparez vos documents',
          description: 'Vous aurez besoin d\'une pièce d\'identité valide (carte d\'identité, passeport ou permis de conduire) et d\'un justificatif de domicile récent (facture d\'électricité, relevé bancaire, etc.).'
        },
        {
          title: 'Téléchargez vos documents',
          description: 'Prenez des photos claires de vos documents. Assurez-vous que toutes les informations sont lisibles et que les documents ne sont pas expirés.'
        },
        {
          title: 'Soumettez votre demande',
          description: 'Une fois tous les documents téléchargés, soumettez votre demande. Notre équipe la vérifiera sous 24h maximum.'
        },
        {
          title: 'Recevez la confirmation',
          description: 'Vous recevrez un email dès que votre compte sera vérifié. Vous pourrez alors accéder à toutes les fonctionnalités de Terex.'
        }
      ],
      tips: [
        'Assurez-vous que vos documents sont valides et non expirés',
        'Prenez des photos de bonne qualité, bien éclairées',
        'Vérifiez que toutes les informations sont lisibles',
        'Le justificatif de domicile doit dater de moins de 3 mois',
        'La vérification prend généralement moins de 24 heures'
      ],
      conclusion: 'Une fois votre KYC approuvé, vous pourrez effectuer des transactions sans limitation et profiter pleinement de tous nos services.'
    }
  },
  {
    id: 'first-transaction',
    title: 'Première transaction',
    category: 'Commencer',
    content: {
      intro: 'Effectuer votre première transaction sur Terex est simple. Voici comment procéder pour acheter ou vendre des USDT.',
      steps: [
        {
          title: 'Vérifiez votre statut KYC',
          description: 'Assurez-vous que votre compte est vérifié (KYC approuvé) avant d\'effectuer une transaction.'
        },
        {
          title: 'Choisissez votre action',
          description: 'Depuis le tableau de bord, sélectionnez "Acheter USDT" ou "Vendre USDT" selon votre besoin.'
        },
        {
          title: 'Entrez le montant',
          description: 'Indiquez le montant que vous souhaitez échanger. Le taux de change et les frais seront affichés automatiquement.'
        },
        {
          title: 'Sélectionnez votre méthode de paiement',
          description: 'Choisissez parmi les méthodes disponibles (Orange Money, Wave, Mobile Money, etc.).'
        },
        {
          title: 'Confirmez la transaction',
          description: 'Vérifiez tous les détails et confirmez votre transaction. Suivez les instructions pour finaliser le paiement.'
        },
        {
          title: 'Recevez vos fonds',
          description: 'Une fois le paiement confirmé, vous recevrez vos USDT ou votre argent selon le type de transaction.'
        }
      ],
      tips: [
        'Commencez par une petite transaction pour vous familiariser',
        'Vérifiez toujours le taux de change avant de confirmer',
        'Conservez vos reçus de transaction',
        'Le support est disponible 24/7 si vous avez besoin d\'aide'
      ],
      conclusion: 'Félicitations pour votre première transaction ! Vous pouvez maintenant utiliser Terex en toute confiance pour tous vos échanges crypto-fiat.'
    }
  },
  {
    id: 'configure-profile',
    title: 'Configurer votre profil',
    category: 'Commencer',
    content: {
      intro: 'Un profil bien configuré vous permet d\'utiliser Terex de manière optimale et sécurisée.',
      steps: [
        {
          title: 'Accédez à votre profil',
          description: 'Cliquez sur votre avatar ou nom d\'utilisateur dans le menu pour accéder à la page de profil.'
        },
        {
          title: 'Complétez vos informations personnelles',
          description: 'Renseignez votre nom complet, numéro de téléphone et adresse. Ces informations sont nécessaires pour la sécurité de votre compte.'
        },
        {
          title: 'Configurez la sécurité',
          description: 'Activez l\'authentification à deux facteurs (2FA) pour une sécurité maximale de votre compte.'
        },
        {
          title: 'Ajoutez vos méthodes de paiement',
          description: 'Enregistrez vos numéros de Mobile Money ou comptes bancaires pour faciliter vos transactions futures.'
        },
        {
          title: 'Personnalisez vos préférences',
          description: 'Configurez vos notifications et préférences de langue selon vos besoins.'
        }
      ],
      tips: [
        'Utilisez une photo de profil claire',
        'Vérifiez que vos informations de contact sont à jour',
        'Activez toutes les options de sécurité disponibles',
        'Configurez les notifications pour suivre vos transactions'
      ],
      conclusion: 'Votre profil est maintenant complet ! Vous êtes prêt à utiliser toutes les fonctionnalités de Terex.'
    }
  },

  // Acheter USDT
  {
    id: 'how-to-buy-usdt',
    title: 'Comment acheter des USDT',
    category: 'Acheter USDT',
    content: {
      intro: 'Acheter des USDT sur Terex est rapide et sécurisé. Suivez ce guide pour effectuer votre achat.',
      steps: [
        {
          title: 'Connectez-vous à votre compte',
          description: 'Assurez-vous d\'être connecté et que votre compte est vérifié (KYC approuvé).'
        },
        {
          title: 'Cliquez sur "Acheter USDT"',
          description: 'Depuis le tableau de bord, sélectionnez l\'option "Acheter USDT".'
        },
        {
          title: 'Entrez le montant',
          description: 'Indiquez combien d\'USDT vous souhaitez acheter ou le montant en monnaie locale que vous voulez dépenser.'
        },
        {
          title: 'Choisissez la méthode de paiement',
          description: 'Sélectionnez votre méthode de paiement préférée (Orange Money, Wave, Mobile Money, virement bancaire).'
        },
        {
          title: 'Entrez votre adresse wallet',
          description: 'Fournissez l\'adresse de votre portefeuille où vous souhaitez recevoir vos USDT. Choisissez également le réseau (TRC20, ERC20, etc.).'
        },
        {
          title: 'Effectuez le paiement',
          description: 'Suivez les instructions pour effectuer le paiement via la méthode choisie.'
        },
        {
          title: 'Recevez vos USDT',
          description: 'Une fois le paiement confirmé, vos USDT seront envoyés à votre adresse wallet dans les délais indiqués.'
        }
      ],
      tips: [
        'Vérifiez toujours l\'adresse de votre wallet avant de confirmer',
        'Assurez-vous de choisir le bon réseau (TRC20 est généralement moins cher)',
        'Les frais de transaction sont affichés avant confirmation',
        'Conservez la preuve de paiement jusqu\'à réception des USDT'
      ],
      conclusion: 'Vos USDT seront dans votre wallet rapidement. Vous recevrez une notification dès l\'envoi effectué.'
    }
  },
  {
    id: 'payment-methods',
    title: 'Méthodes de paiement acceptées',
    category: 'Acheter USDT',
    content: {
      intro: 'Terex accepte plusieurs méthodes de paiement pour faciliter vos achats d\'USDT.',
      steps: [
        {
          title: 'Mobile Money',
          description: 'Orange Money, MTN Money, Moov Money sont acceptés dans la plupart des pays africains. Paiement instantané et sécurisé.'
        },
        {
          title: 'Wave',
          description: 'Paiement via Wave disponible au Sénégal, en Côte d\'Ivoire et dans plusieurs autres pays.'
        },
        {
          title: 'Virement bancaire',
          description: 'Vous pouvez effectuer un virement bancaire local. Le traitement peut prendre 1 à 3 jours ouvrables.'
        },
        {
          title: 'Carte bancaire',
          description: 'Paiement par carte Visa ou Mastercard accepté (bientôt disponible).'
        }
      ],
      tips: [
        'Les paiements Mobile Money sont les plus rapides',
        'Vérifiez les frais associés à chaque méthode',
        'Assurez-vous d\'avoir suffisamment de fonds avant de commencer',
        'Le support peut vous aider à choisir la meilleure méthode'
      ],
      conclusion: 'Choisissez la méthode qui vous convient le mieux selon votre localisation et vos préférences.'
    }
  },
  {
    id: 'processing-time',
    title: 'Délais de traitement',
    category: 'Acheter USDT',
    content: {
      intro: 'Les délais de traitement varient selon la méthode de paiement choisie.',
      steps: [
        {
          title: 'Mobile Money / Wave',
          description: 'Traitement instantané à 15 minutes maximum après confirmation du paiement.'
        },
        {
          title: 'Virement bancaire',
          description: 'De 1 à 3 jours ouvrables selon votre banque et le pays.'
        },
        {
          title: 'Carte bancaire',
          description: 'Traitement immédiat après validation de la transaction.'
        },
        {
          title: 'Envoi des USDT',
          description: 'Une fois le paiement confirmé, les USDT sont envoyés dans les 30 minutes maximum.'
        }
      ],
      tips: [
        'Les paiements Mobile Money sont les plus rapides',
        'Évitez les weekends et jours fériés pour les virements bancaires',
        'Vous recevrez des notifications à chaque étape',
        'Contactez le support si un délai semble anormal'
      ],
      conclusion: 'Nous nous efforçons de traiter toutes les transactions le plus rapidement possible tout en garantissant la sécurité maximale.'
    }
  },
  {
    id: 'transaction-limits',
    title: 'Limites de transaction',
    category: 'Acheter USDT',
    content: {
      intro: 'Des limites de transaction sont en place pour garantir la sécurité et respecter les réglementations.',
      steps: [
        {
          title: 'Comptes non vérifiés',
          description: 'Maximum 100 000 FCFA par transaction et 500 000 FCFA par mois.'
        },
        {
          title: 'Comptes KYC niveau 1',
          description: 'Maximum 1 000 000 FCFA par transaction et 5 000 000 FCFA par mois.'
        },
        {
          title: 'Comptes KYC niveau 2',
          description: 'Maximum 10 000 000 FCFA par transaction et 50 000 000 FCFA par mois.'
        },
        {
          title: 'Comptes VIP',
          description: 'Limites personnalisées selon vos besoins. Contactez-nous pour plus d\'informations.'
        }
      ],
      tips: [
        'Complétez votre KYC pour augmenter vos limites',
        'Les limites se renouvellent chaque mois',
        'Contactez le support pour des besoins spécifiques',
        'Des justificatifs supplémentaires peuvent être demandés pour les gros montants'
      ],
      conclusion: 'Ces limites assurent la sécurité de tous nos utilisateurs tout en offrant une flexibilité adaptée à vos besoins.'
    }
  },

  // Vendre USDT
  {
    id: 'how-to-sell-usdt',
    title: 'Comment vendre des USDT',
    category: 'Vendre USDT',
    content: {
      intro: 'Vendre vos USDT sur Terex est simple et vous recevez votre argent rapidement.',
      steps: [
        {
          title: 'Accédez à "Vendre USDT"',
          description: 'Depuis le tableau de bord, cliquez sur "Vendre USDT".'
        },
        {
          title: 'Entrez le montant',
          description: 'Indiquez combien d\'USDT vous souhaitez vendre. Le montant que vous recevrez sera affiché automatiquement.'
        },
        {
          title: 'Choisissez votre méthode de réception',
          description: 'Sélectionnez comment vous souhaitez recevoir votre argent (Mobile Money, Wave, virement bancaire).'
        },
        {
          title: 'Renseignez vos coordonnées',
          description: 'Entrez votre numéro Mobile Money ou coordonnées bancaires.'
        },
        {
          title: 'Envoyez vos USDT',
          description: 'Envoyez le montant d\'USDT à l\'adresse fournie. Assurez-vous d\'utiliser le bon réseau.'
        },
        {
          title: 'Confirmez l\'envoi',
          description: 'Une fois vos USDT reçus et vérifiés, votre paiement sera traité.'
        },
        {
          title: 'Recevez votre argent',
          description: 'Vous recevrez votre paiement dans les délais indiqués selon la méthode choisie.'
        }
      ],
      tips: [
        'Vérifiez l\'adresse de dépôt avant d\'envoyer vos USDT',
        'Utilisez le réseau indiqué (généralement TRC20)',
        'Conservez le hash de transaction comme preuve',
        'Le paiement est traité dès réception et confirmation des USDT'
      ],
      conclusion: 'Votre argent sera dans votre compte rapidement après la confirmation de la transaction.'
    }
  },
  {
    id: 'receive-payment',
    title: 'Recevoir votre paiement',
    category: 'Vendre USDT',
    content: {
      intro: 'Après avoir vendu vos USDT, voici comment vous recevrez votre paiement.',
      steps: [
        {
          title: 'Vérification de la transaction',
          description: 'Notre système vérifie automatiquement la réception de vos USDT sur la blockchain.'
        },
        {
          title: 'Validation du paiement',
          description: 'Une fois les USDT confirmés (généralement quelques minutes), votre paiement est préparé.'
        },
        {
          title: 'Envoi des fonds',
          description: 'Les fonds sont envoyés à votre numéro Mobile Money ou compte bancaire.'
        },
        {
          title: 'Notification',
          description: 'Vous recevez une notification dès que le paiement est effectué.'
        }
      ],
      tips: [
        'Mobile Money: réception instantanée',
        'Wave: réception en quelques minutes',
        'Virement bancaire: 1 à 3 jours ouvrables',
        'Vérifiez toujours vos coordonnées de réception'
      ],
      conclusion: 'Nos délais de paiement sont parmi les plus rapides du marché.'
    }
  },
  {
    id: 'transaction-fees',
    title: 'Frais de transaction',
    category: 'Vendre USDT',
    content: {
      intro: 'Terex applique des frais transparents et compétitifs pour toutes les transactions.',
      steps: [
        {
          title: 'Frais de vente USDT',
          description: '0.5% du montant de la transaction. Ce frais est déduit du montant que vous recevez.'
        },
        {
          title: 'Frais de réseau',
          description: 'Les frais de réseau blockchain sont à votre charge lors de l\'envoi des USDT.'
        },
        {
          title: 'Frais de paiement',
          description: 'Aucun frais supplémentaire pour Mobile Money ou Wave. Frais bancaires standards pour les virements.'
        },
        {
          title: 'Calcul automatique',
          description: 'Tous les frais sont affichés clairement avant la confirmation de votre transaction.'
        }
      ],
      tips: [
        'Le TRC20 a des frais de réseau plus bas que l\'ERC20',
        'Aucun frais caché, tout est transparent',
        'Les frais sont déduits automatiquement',
        'Comparez toujours le montant final avant de confirmer'
      ],
      conclusion: 'Nos frais sont parmi les plus compétitifs du marché tout en garantissant un service de qualité.'
    }
  },
  {
    id: 'confirm-sale',
    title: 'Confirmer la vente',
    category: 'Vendre USDT',
    content: {
      intro: 'La confirmation de vente est une étape importante pour sécuriser votre transaction.',
      steps: [
        {
          title: 'Vérification des détails',
          description: 'Avant de confirmer, vérifiez le montant, l\'adresse de réception et la méthode de paiement.'
        },
        {
          title: 'Envoi des USDT',
          description: 'Envoyez exactement le montant indiqué à l\'adresse fournie, sur le réseau spécifié.'
        },
        {
          title: 'Copie du hash',
          description: 'Une fois l\'envoi effectué, copiez le hash de transaction (TX ID) de votre wallet.'
        },
        {
          title: 'Confirmation sur Terex',
          description: 'Revenez sur Terex et confirmez que vous avez envoyé les USDT. Collez le hash de transaction si demandé.'
        },
        {
          title: 'Attente de validation',
          description: 'Attendez que notre système confirme la réception des USDT sur la blockchain.'
        },
        {
          title: 'Paiement automatique',
          description: 'Dès la confirmation, votre paiement est automatiquement traité et envoyé.'
        }
      ],
      tips: [
        'Ne confirmez que lorsque vous avez vraiment envoyé les USDT',
        'Conservez le hash de transaction comme preuve',
        'Vérifiez que le réseau utilisé correspond à celui demandé',
        'En cas de doute, contactez le support avant de confirmer'
      ],
      conclusion: 'Une fois confirmé et vérifié, votre paiement sera traité rapidement et en toute sécurité.'
    }
  },

  // Transferts Internationaux
  {
    id: 'send-money-africa',
    title: 'Envoyer de l\'argent en Afrique',
    category: 'Transferts Internationaux',
    content: {
      intro: 'Terex facilite l\'envoi d\'argent vers l\'Afrique avec des frais compétitifs et une rapidité inégalée.',
      steps: [
        {
          title: 'Sélectionnez "Transfert International"',
          description: 'Depuis votre tableau de bord, cliquez sur "Transfert International".'
        },
        {
          title: 'Choisissez le pays de destination',
          description: 'Sélectionnez le pays africain où vous souhaitez envoyer de l\'argent.'
        },
        {
          title: 'Entrez le montant',
          description: 'Indiquez le montant à envoyer. Le taux de change et les frais seront affichés.'
        },
        {
          title: 'Informations du bénéficiaire',
          description: 'Renseignez le nom complet, numéro de téléphone et méthode de réception du bénéficiaire.'
        },
        {
          title: 'Choisissez votre mode de paiement',
          description: 'Sélectionnez comment vous souhaitez payer (USDT, Mobile Money, carte bancaire).'
        },
        {
          title: 'Confirmez le transfert',
          description: 'Vérifiez tous les détails et confirmez. Le bénéficiaire recevra une notification.'
        },
        {
          title: 'Suivi en temps réel',
          description: 'Suivez l\'état de votre transfert en temps réel depuis votre tableau de bord.'
        }
      ],
      tips: [
        'Vérifiez toujours les informations du bénéficiaire',
        'Le bénéficiaire recevra l\'argent directement sur son Mobile Money',
        'Les transferts sont généralement instantanés',
        'Vous recevez une notification à chaque étape',
        'Le support est disponible 24/7 pour vous aider'
      ],
      conclusion: 'Vos proches recevront l\'argent rapidement et en toute sécurité, directement sur leur téléphone.'
    }
  },
  {
    id: 'transfer-fees',
    title: 'Frais de transfert',
    category: 'Transferts Internationaux',
    content: {
      intro: 'Nos frais de transfert sont transparents et parmi les plus compétitifs du marché.',
      steps: [
        {
          title: 'Frais de base',
          description: '2-3% du montant transféré selon le pays de destination.'
        },
        {
          title: 'Taux de change',
          description: 'Taux de change compétitif mis à jour en temps réel.'
        },
        {
          title: 'Frais de réception',
          description: 'Aucun frais pour le bénéficiaire. Il reçoit exactement le montant indiqué.'
        },
        {
          title: 'Calcul transparent',
          description: 'Le montant total et tous les frais sont affichés avant la confirmation.'
        }
      ],
      tips: [
        'Comparez toujours le montant final que recevra le bénéficiaire',
        'Les gros montants peuvent bénéficier de frais réduits',
        'Aucun frais caché',
        'Contactez-nous pour des transferts réguliers ou importants'
      ],
      conclusion: 'Terex s\'engage à offrir les meilleurs taux pour vos transferts internationaux.'
    }
  },
  {
    id: 'delivery-time',
    title: 'Délais de livraison',
    category: 'Transferts Internationaux',
    content: {
      intro: 'Les délais de livraison varient selon le pays et la méthode de paiement choisie.',
      steps: [
        {
          title: 'Paiement par USDT',
          description: 'Livraison instantanée à 15 minutes maximum après confirmation.'
        },
        {
          title: 'Paiement par Mobile Money',
          description: 'De 15 minutes à 2 heures selon le pays de destination.'
        },
        {
          title: 'Paiement par carte bancaire',
          description: 'Généralement sous 1 heure après validation du paiement.'
        },
        {
          title: 'Weekends et jours fériés',
          description: 'Les délais peuvent être légèrement plus longs pendant ces périodes.'
        }
      ],
      tips: [
        'Les transferts USDT sont les plus rapides',
        'Le bénéficiaire reçoit une notification SMS dès réception',
        'Vous pouvez suivre votre transfert en temps réel',
        'Contactez le support si un délai semble anormal'
      ],
      conclusion: 'Dans la majorité des cas, vos proches reçoivent l\'argent en quelques minutes seulement.'
    }
  },
  {
    id: 'track-transfer',
    title: 'Suivi de transfert',
    category: 'Transferts Internationaux',
    content: {
      intro: 'Suivez vos transferts en temps réel et restez informé à chaque étape.',
      steps: [
        {
          title: 'Accédez à l\'historique',
          description: 'Depuis votre tableau de bord, cliquez sur "Historique" ou "Mes transferts".'
        },
        {
          title: 'Sélectionnez le transfert',
          description: 'Cliquez sur le transfert que vous souhaitez suivre pour voir les détails.'
        },
        {
          title: 'Consultez le statut',
          description: 'Le statut actuel s\'affiche: En attente, En cours, Complété ou Annulé.'
        },
        {
          title: 'Notifications automatiques',
          description: 'Vous recevez des notifications email et SMS à chaque changement de statut.'
        },
        {
          title: 'Preuve de transfert',
          description: 'Une fois complété, vous pouvez télécharger un reçu officiel.'
        }
      ],
      tips: [
        'Activez les notifications pour rester informé',
        'Conservez vos reçus de transfert',
        'Le bénéficiaire reçoit aussi une notification',
        'Contactez le support pour toute question'
      ],
      conclusion: 'La transparence totale sur vos transferts vous permet d\'avoir l\'esprit tranquille.'
    }
  }
];

export const getArticleById = (id: string): HelpArticleData | undefined => {
  return helpArticles.find(article => article.id === id);
};

export const getArticlesByCategory = (category: string): HelpArticleData[] => {
  return helpArticles.filter(article => article.category === category);
};
