export interface SupportAnswer {
  text: string;
  nextQuestionId?: string;
  solution?: string;
}

export interface SupportQuestion {
  id: string;
  question: string;
  answers: SupportAnswer[];
}

export interface SupportFlow {
  id: string;
  title: string;
  description: string;
  icon: string;
  startQuestionId: string;
  questions: SupportQuestion[];
}

export const supportFlows: SupportFlow[] = [
  {
    id: "buy-usdt",
    title: "Acheter USDT",
    description: "Problèmes lors de l'achat de USDT",
    icon: "ShoppingCart",
    startQuestionId: "buy-status",
    questions: [
      {
        id: "buy-status",
        question: "Où en êtes-vous dans votre achat de USDT ?",
        answers: [
          {
            text: "Je n'arrive pas à créer ma commande",
            nextQuestionId: "buy-create-issue"
          },
          {
            text: "J'ai créé ma commande mais je ne sais pas comment payer",
            nextQuestionId: "buy-payment-help"
          },
          {
            text: "J'ai déjà payé mais je n'ai pas reçu mes USDT",
            nextQuestionId: "buy-not-received"
          },
          {
            text: "J'ai une erreur lors de la création",
            nextQuestionId: "buy-error"
          }
        ]
      },
      {
        id: "buy-create-issue",
        question: "Quel est le problème lors de la création de votre commande ?",
        answers: [
          {
            text: "Je ne peux pas entrer mon adresse wallet",
            solution: "Assurez-vous de copier l'adresse complète de votre wallet depuis votre application (Binance, Trust Wallet, etc.). L'adresse doit commencer par '0x' pour les réseaux ERC20/BEP20 ou 'T' pour TRC20. Si le problème persiste, essayez de changer de navigateur."
          },
          {
            text: "Le montant minimum/maximum me bloque",
            solution: "Le montant minimum est de 10,000 FCFA et le maximum de 5,000,000 FCFA par transaction. Si vous souhaitez acheter plus, vous pouvez faire plusieurs transactions ou nous contacter sur WhatsApp au +1 4182619091 pour une transaction de gros volume."
          },
          {
            text: "Je ne vois pas ma méthode de paiement",
            nextQuestionId: "buy-payment-method"
          }
        ]
      },
      {
        id: "buy-payment-method",
        question: "Quelle méthode de paiement souhaitez-vous utiliser ?",
        answers: [
          {
            text: "Orange Money",
            solution: "Orange Money est disponible. Assurez-vous d'avoir activé les paiements marchands sur votre compte Orange Money en composant #144#. Si vous ne voyez pas cette option, actualisez la page."
          },
          {
            text: "Wave",
            solution: "Wave est disponible. Assurez-vous que votre compte Wave est vérifié et dispose de fonds suffisants. Si vous ne voyez pas cette option, actualisez la page."
          },
          {
            text: "Virement bancaire",
            solution: "Le virement bancaire est disponible. Vous recevrez nos coordonnées bancaires après la création de la commande. Le traitement prend généralement 1-2 heures après réception du virement."
          },
          {
            text: "Autre",
            solution: "Contactez-nous sur WhatsApp au +1 4182619091 pour discuter d'autres méthodes de paiement disponibles."
          }
        ]
      },
      {
        id: "buy-payment-help",
        question: "Quelle méthode de paiement avez-vous choisie ?",
        answers: [
          {
            text: "Orange Money / Wave",
            solution: "1. Vous devriez avoir reçu des instructions de paiement par email et dans votre tableau de bord.\n2. Ouvrez votre application Orange Money ou Wave\n3. Effectuez le transfert vers le numéro indiqué pour le montant exact\n4. Une fois le paiement effectué, revenez dans votre tableau de bord et cliquez sur 'J'ai effectué le paiement'\n5. Nous vérifierons le paiement (généralement sous 5-10 minutes) et enverrons vos USDT."
          },
          {
            text: "Virement bancaire",
            solution: "1. Consultez vos instructions de paiement dans votre email ou tableau de bord\n2. Effectuez un virement bancaire vers les coordonnées fournies\n3. Envoyez-nous la preuve de virement par email à support@terex.sn ou WhatsApp au +1 4182619091\n4. Le traitement prend généralement 1-2 heures après vérification du virement."
          },
          {
            text: "Je n'ai pas reçu les instructions",
            nextQuestionId: "buy-no-instructions"
          }
        ]
      },
      {
        id: "buy-no-instructions",
        question: "Avez-vous vérifié votre boîte email ?",
        answers: [
          {
            text: "Oui, rien dans mes emails",
            solution: "Vérifiez vos spams/courriers indésirables. Les instructions sont également disponibles dans votre tableau de bord Terex sous 'Historique des transactions'. Si vous ne les trouvez toujours pas, contactez-nous sur WhatsApp au +1 4182619091 avec votre numéro de commande."
          },
          {
            text: "Je n'ai pas accès à mon email",
            solution: "Pas de problème ! Connectez-vous à votre tableau de bord Terex et allez dans 'Historique des transactions'. Cliquez sur votre commande pour voir les instructions de paiement complètes."
          }
        ]
      },
      {
        id: "buy-not-received",
        question: "Depuis combien de temps avez-vous effectué le paiement ?",
        answers: [
          {
            text: "Moins de 30 minutes",
            solution: "Le traitement prend généralement 5-30 minutes. Assurez-vous d'avoir cliqué sur 'J'ai effectué le paiement' dans votre tableau de bord. Si c'est fait, patientez encore un peu. Vous recevrez une notification dès que vos USDT seront envoyés."
          },
          {
            text: "Entre 30 minutes et 2 heures",
            nextQuestionId: "buy-payment-confirmed"
          },
          {
            text: "Plus de 2 heures",
            solution: "Ce délai est anormal. Contactez immédiatement notre support sur WhatsApp au +1 4182619091 avec votre numéro de commande et la preuve de paiement. Nous traiterons votre cas en priorité."
          }
        ]
      },
      {
        id: "buy-payment-confirmed",
        question: "Avez-vous cliqué sur 'J'ai effectué le paiement' dans votre tableau de bord ?",
        answers: [
          {
            text: "Oui, j'ai confirmé",
            solution: "Votre paiement est en cours de vérification. Si le délai dépasse 2 heures, contactez-nous sur WhatsApp au +1 4182619091 avec votre numéro de commande."
          },
          {
            text: "Non, je n'ai pas confirmé",
            solution: "Il est important de confirmer votre paiement ! Allez dans votre tableau de bord > Historique des transactions > Cliquez sur votre commande > Cliquez sur 'J'ai effectué le paiement'. Cela nous notifie pour vérifier et traiter votre commande rapidement."
          }
        ]
      },
      {
        id: "buy-error",
        question: "Quel type d'erreur voyez-vous ?",
        answers: [
          {
            text: "Erreur 'Adresse wallet invalide'",
            solution: "Vérifiez que vous avez copié l'adresse complète de votre wallet (commence par '0x' pour ERC20/BEP20 ou 'T' pour TRC20). Assurez-vous de sélectionner le bon réseau correspondant à votre wallet. Si l'erreur persiste, essayez de coller l'adresse dans un autre navigateur."
          },
          {
            text: "Erreur 'Montant invalide'",
            solution: "Le montant doit être entre 10,000 FCFA et 5,000,000 FCFA. Vérifiez que vous avez entré un nombre valide sans espaces ni caractères spéciaux."
          },
          {
            text: "Erreur de connexion / erreur réseau",
            solution: "Vérifiez votre connexion internet. Si le problème persiste, videz le cache de votre navigateur ou essayez un autre navigateur. Vous pouvez aussi essayer de vous déconnecter puis reconnecter."
          },
          {
            text: "Autre erreur",
            solution: "Prenez une capture d'écran du message d'erreur et contactez-nous sur WhatsApp au +1 4182619091. Notre équipe technique vous aidera rapidement."
          }
        ]
      }
    ]
  },
  {
    id: "sell-usdt",
    title: "Vendre USDT",
    description: "Problèmes lors de la vente de USDT",
    icon: "TrendingDown",
    startQuestionId: "sell-status",
    questions: [
      {
        id: "sell-status",
        question: "Où en êtes-vous dans votre vente de USDT ?",
        answers: [
          {
            text: "Je n'arrive pas à créer ma commande de vente",
            nextQuestionId: "sell-create-issue"
          },
          {
            text: "J'ai créé ma commande mais je ne sais pas où envoyer mes USDT",
            nextQuestionId: "sell-send-help"
          },
          {
            text: "J'ai envoyé mes USDT mais je n'ai pas reçu mon argent",
            nextQuestionId: "sell-not-received"
          },
          {
            text: "J'ai une erreur lors de l'envoi",
            nextQuestionId: "sell-error"
          }
        ]
      },
      {
        id: "sell-create-issue",
        question: "Quel est le problème lors de la création de votre commande de vente ?",
        answers: [
          {
            text: "Je ne peux pas entrer mon numéro de téléphone",
            solution: "Assurez-vous d'entrer votre numéro au format international sans le '+' (exemple: 221773972749 pour le Sénégal). Le numéro doit correspondre à votre compte Orange Money ou Wave."
          },
          {
            text: "Le montant minimum/maximum me bloque",
            solution: "Le montant minimum est de 10 USDT et le maximum de 5,000 USDT par transaction. Si vous souhaitez vendre plus, contactez-nous sur WhatsApp au +1 4182619091 pour une transaction de gros volume."
          },
          {
            text: "Je ne vois pas ma méthode de réception",
            solution: "Nous supportons Orange Money et Wave pour le moment. Assurez-vous que votre numéro est enregistré sur l'un de ces services. Pour d'autres méthodes, contactez-nous sur WhatsApp."
          }
        ]
      },
      {
        id: "sell-send-help",
        question: "Avez-vous les instructions d'envoi ?",
        answers: [
          {
            text: "Oui, mais je ne comprends pas comment envoyer",
            nextQuestionId: "sell-send-instructions"
          },
          {
            text: "Non, je n'ai pas reçu les instructions",
            solution: "Les instructions sont dans votre email et dans votre tableau de bord > Historique des transactions. Vous devez envoyer vos USDT à l'adresse Terex fournie avec le réseau exact (TRC20, ERC20 ou BEP20) et le montant exact en USDT."
          }
        ]
      },
      {
        id: "sell-send-instructions",
        question: "Quelle application utilisez-vous pour envoyer vos USDT ?",
        answers: [
          {
            text: "Binance",
            solution: "Sur Binance:\n1. Allez dans 'Wallet' > 'Fiat and Spot'\n2. Cherchez 'USDT' et cliquez sur 'Withdraw'\n3. Collez l'adresse Terex fournie\n4. Sélectionnez le réseau exact (TRC20, ERC20 ou BEP20) comme indiqué\n5. Entrez le montant exact en USDT\n6. Confirmez et envoyez\n7. Copiez le hash de transaction et collez-le dans votre tableau de bord Terex"
          },
          {
            text: "Trust Wallet",
            solution: "Sur Trust Wallet:\n1. Ouvrez l'app et sélectionnez 'USDT'\n2. Cliquez sur 'Send'\n3. Collez l'adresse Terex fournie\n4. Entrez le montant exact en USDT\n5. Vérifiez que le réseau est correct (ERC20, BEP20 ou TRC20)\n6. Confirmez et envoyez\n7. Une fois envoyé, copiez le hash et collez-le dans votre tableau de bord Terex"
          },
          {
            text: "Autre wallet",
            solution: "Depuis votre wallet:\n1. Trouvez votre USDT\n2. Sélectionnez 'Envoyer' ou 'Send'\n3. Collez l'adresse Terex fournie\n4. IMPORTANT: Sélectionnez le même réseau que dans vos instructions (TRC20, ERC20 ou BEP20)\n5. Entrez le montant exact en USDT\n6. Envoyez et récupérez le hash de transaction\n7. Collez le hash dans votre tableau de bord Terex"
          }
        ]
      },
      {
        id: "sell-not-received",
        question: "Avez-vous confirmé l'envoi avec le hash de transaction ?",
        answers: [
          {
            text: "Oui, j'ai fourni le hash",
            nextQuestionId: "sell-delay"
          },
          {
            text: "Non, je ne sais pas ce qu'est un hash",
            solution: "Le hash (ou TxID) est le numéro de confirmation de votre transaction blockchain. Après avoir envoyé vos USDT, votre wallet vous montre ce numéro (une longue série de chiffres et lettres). Copiez-le et collez-le dans votre tableau de bord Terex > Historique > Votre commande > 'J'ai envoyé les USDT'. Cela nous permet de vérifier rapidement votre transaction."
          },
          {
            text: "Je ne trouve pas le hash",
            solution: "Le hash se trouve dans l'historique de transactions de votre wallet. Cherchez la transaction que vous venez d'effectuer et cliquez dessus pour voir les détails. Vous verrez 'Transaction ID', 'TxID' ou 'Hash'. Si vous ne le trouvez toujours pas, contactez-nous sur WhatsApp au +1 4182619091."
          }
        ]
      },
      {
        id: "sell-delay",
        question: "Depuis combien de temps avez-vous confirmé l'envoi ?",
        answers: [
          {
            text: "Moins de 30 minutes",
            solution: "Le traitement prend généralement 10-30 minutes après vérification de la transaction sur la blockchain. Patientez encore un peu. Vous recevrez votre paiement Orange Money/Wave dès que nous aurons confirmé la réception de vos USDT."
          },
          {
            text: "Entre 30 minutes et 2 heures",
            solution: "Vérifiez que vous avez bien fourni le hash de transaction dans votre tableau de bord. Si c'est fait, notre équipe est en train de vérifier. Si le délai dépasse 2 heures, contactez-nous sur WhatsApp au +1 4182619091 avec votre numéro de commande."
          },
          {
            text: "Plus de 2 heures",
            solution: "Ce délai est anormal. Contactez immédiatement notre support sur WhatsApp au +1 4182619091 avec votre numéro de commande et le hash de transaction. Nous traiterons votre cas en priorité."
          }
        ]
      },
      {
        id: "sell-error",
        question: "Quel type d'erreur rencontrez-vous ?",
        answers: [
          {
            text: "Erreur 'Invalid address' lors de l'envoi",
            solution: "Vérifiez que vous avez copié TOUTE l'adresse Terex sans espaces. Si l'erreur persiste, vérifiez que vous avez sélectionné le bon réseau (le même que dans vos instructions). Ne tentez jamais d'envoyer sur un réseau différent de celui indiqué."
          },
          {
            text: "Erreur 'Insufficient balance'",
            solution: "Votre wallet n'a pas assez de USDT ou pas assez de frais réseau. Si vous avez des USDT, assurez-vous d'avoir aussi des frais pour la transaction (TRX pour TRC20, ETH pour ERC20, ou BNB pour BEP20)."
          },
          {
            text: "Transaction bloquée / en attente",
            solution: "Les transactions blockchain peuvent prendre du temps selon le réseau. TRC20 est généralement le plus rapide (1-5 min), ERC20 peut prendre 5-30 min, BEP20 prend 3-10 min. Si votre transaction est confirmée sur la blockchain, elle arrivera. Patientez ou contactez-nous sur WhatsApp."
          },
          {
            text: "Autre erreur",
            solution: "Prenez une capture d'écran de l'erreur et contactez-nous sur WhatsApp au +1 4182619091 avec votre numéro de commande. Notre équipe vous aidera immédiatement."
          }
        ]
      }
    ]
  },
  {
    id: "transfer",
    title: "Transferts Internationaux",
    description: "Problèmes lors d'un transfert international",
    icon: "Send",
    startQuestionId: "transfer-status",
    questions: [
      {
        id: "transfer-status",
        question: "Où en êtes-vous dans votre transfert international ?",
        answers: [
          {
            text: "Je n'arrive pas à créer mon transfert",
            nextQuestionId: "transfer-create-issue"
          },
          {
            text: "J'ai créé le transfert mais je ne sais pas comment payer",
            nextQuestionId: "transfer-payment-help"
          },
          {
            text: "J'ai payé mais le destinataire n'a pas reçu",
            nextQuestionId: "transfer-not-received"
          },
          {
            text: "J'ai une erreur",
            nextQuestionId: "transfer-error"
          }
        ]
      },
      {
        id: "transfer-create-issue",
        question: "Quel est le problème lors de la création du transfert ?",
        answers: [
          {
            text: "Je ne trouve pas le pays de destination",
            solution: "Actuellement, nous supportons les transferts vers la majorité des pays africains. Si vous ne voyez pas votre pays, contactez-nous sur WhatsApp au +1 4182619091 pour vérifier la disponibilité."
          },
          {
            text: "Je ne peux pas entrer les informations du destinataire",
            solution: "Assurez-vous d'avoir toutes les informations requises: nom complet, numéro de téléphone Orange Money/Wave du destinataire. Le numéro doit être au format international sans le '+' (exemple: 225XXXXXXXX pour la Côte d'Ivoire)."
          },
          {
            text: "Le montant minimum/maximum me bloque",
            solution: "Le montant minimum est généralement de 10,000 FCFA et le maximum de 2,000,000 FCFA par transfert. Pour des montants plus élevés, contactez-nous sur WhatsApp au +1 4182619091."
          }
        ]
      },
      {
        id: "transfer-payment-help",
        question: "Quelle méthode de paiement utilisez-vous ?",
        answers: [
          {
            text: "Orange Money / Wave depuis le Sénégal",
            solution: "1. Consultez vos instructions dans votre email ou tableau de bord\n2. Ouvrez votre application Orange Money ou Wave\n3. Effectuez le transfert vers le numéro Terex indiqué pour le montant exact\n4. Revenez dans votre tableau de bord et confirmez le paiement\n5. Le destinataire recevra l'argent sous 10-30 minutes"
          },
          {
            text: "Virement bancaire",
            solution: "1. Effectuez le virement vers les coordonnées bancaires fournies\n2. Envoyez-nous la preuve de virement par email ou WhatsApp\n3. Le traitement prend 1-2 heures après vérification\n4. Le destinataire recevra l'argent après notre confirmation"
          },
          {
            text: "Je n'ai pas les instructions",
            solution: "Les instructions sont dans votre email et dans votre tableau de bord > Historique des transactions. Cliquez sur votre transfert pour voir les détails de paiement. Si vous ne les trouvez pas, contactez-nous sur WhatsApp au +1 4182619091."
          }
        ]
      },
      {
        id: "transfer-not-received",
        question: "Avez-vous confirmé votre paiement dans le tableau de bord ?",
        answers: [
          {
            text: "Oui, j'ai confirmé",
            nextQuestionId: "transfer-delay"
          },
          {
            text: "Non, je ne savais pas qu'il fallait confirmer",
            solution: "Il est important de confirmer votre paiement ! Allez dans votre tableau de bord > Historique des transactions > Cliquez sur votre transfert > Cliquez sur 'J'ai effectué le paiement'. Cela nous notifie pour traiter rapidement votre transfert."
          }
        ]
      },
      {
        id: "transfer-delay",
        question: "Depuis combien de temps avez-vous effectué et confirmé le paiement ?",
        answers: [
          {
            text: "Moins d'1 heure",
            solution: "Le transfert international prend généralement 15-60 minutes. Le destinataire recevra une notification Orange Money/Wave dès réception. Patientez encore un peu. Si le délai dépasse 2 heures, contactez-nous."
          },
          {
            text: "Entre 1 et 2 heures",
            solution: "Le délai est un peu long. Vérifiez avec le destinataire s'il a bien reçu une notification. Si rien après 2 heures, contactez-nous sur WhatsApp au +1 4182619091 avec votre numéro de transfert."
          },
          {
            text: "Plus de 2 heures",
            solution: "Ce délai est anormal. Contactez immédiatement notre support sur WhatsApp au +1 4182619091 avec votre numéro de transfert et la preuve de paiement. Nous traiterons votre cas en priorité."
          }
        ]
      },
      {
        id: "transfer-error",
        question: "Quel type d'erreur voyez-vous ?",
        answers: [
          {
            text: "Erreur 'Numéro de destinataire invalide'",
            solution: "Vérifiez que le numéro du destinataire est correct et au format international sans le '+'. Assurez-vous que le destinataire a bien un compte Orange Money ou Wave actif dans son pays."
          },
          {
            text: "Erreur 'Pays non supporté'",
            solution: "Nous élargissons constamment notre couverture. Contactez-nous sur WhatsApp au +1 4182619091 pour vérifier si nous pouvons traiter votre transfert manuellement."
          },
          {
            text: "Erreur de connexion",
            solution: "Vérifiez votre connexion internet. Si le problème persiste, videz le cache de votre navigateur ou essayez un autre navigateur."
          },
          {
            text: "Autre erreur",
            solution: "Prenez une capture d'écran du message d'erreur et contactez-nous sur WhatsApp au +1 4182619091. Notre équipe vous aidera rapidement."
          }
        ]
      }
    ]
  },
  {
    id: "account",
    title: "Compte et Sécurité",
    description: "Problèmes de connexion, KYC, sécurité",
    icon: "User",
    startQuestionId: "account-issue",
    questions: [
      {
        id: "account-issue",
        question: "Quel est votre problème de compte ?",
        answers: [
          {
            text: "Je n'arrive pas à me connecter",
            nextQuestionId: "login-issue"
          },
          {
            text: "Je n'ai pas reçu le lien de connexion par email",
            nextQuestionId: "magic-link-issue"
          },
          {
            text: "Mon compte est bloqué",
            solution: "Si votre compte est bloqué, contactez immédiatement notre support sur WhatsApp au +1 4182619091 avec votre adresse email. Nous examinerons votre cas en priorité."
          },
          {
            text: "Problème de vérification KYC",
            nextQuestionId: "kyc-issue"
          }
        ]
      },
      {
        id: "login-issue",
        question: "Que se passe-t-il quand vous essayez de vous connecter ?",
        answers: [
          {
            text: "Je ne reçois pas l'email de connexion",
            nextQuestionId: "magic-link-issue"
          },
          {
            text: "Le lien de connexion ne fonctionne pas",
            solution: "Les liens de connexion expirent après 1 heure. Demandez un nouveau lien. Si le problème persiste, vérifiez que vous utilisez le même navigateur que celui où vous avez demandé le lien, et videz votre cache."
          },
          {
            text: "J'ai oublié mon email de connexion",
            solution: "Essayez tous les emails que vous utilisez habituellement. Si vous ne retrouvez pas votre email, contactez-nous sur WhatsApp au +1 4182619091 avec toutes les informations que vous pouvez fournir (nom, numéro de téléphone utilisé pour les transactions, etc.)."
          }
        ]
      },
      {
        id: "magic-link-issue",
        question: "Avez-vous vérifié vos spams ?",
        answers: [
          {
            text: "Oui, rien dans les spams",
            nextQuestionId: "email-wait"
          },
          {
            text: "Je vais vérifier",
            solution: "Vérifiez votre dossier spam/courriers indésirables. Ajoutez noreply@terex.sn à vos contacts pour recevoir nos emails. Si toujours rien, demandez un nouveau lien de connexion."
          }
        ]
      },
      {
        id: "email-wait",
        question: "Depuis combien de temps avez-vous demandé le lien ?",
        answers: [
          {
            text: "Moins de 5 minutes",
            solution: "L'email peut prendre jusqu'à 5 minutes pour arriver. Patientez encore un peu et vérifiez vos spams. Si rien après 5 minutes, demandez un nouveau lien."
          },
          {
            text: "Plus de 5 minutes",
            solution: "Il semble y avoir un problème. Vérifiez que vous avez entré la bonne adresse email. Si c'est le cas, essayez avec un autre navigateur. Si le problème persiste, contactez-nous sur WhatsApp au +1 4182619091."
          }
        ]
      },
      {
        id: "kyc-issue",
        question: "Quel est votre problème avec la vérification KYC ?",
        answers: [
          {
            text: "Je ne peux pas télécharger mes documents",
            solution: "Assurez-vous que vos documents sont au format JPG, PNG ou PDF et font moins de 5MB. Essayez de prendre de nouvelles photos si elles sont floues. Si le problème persiste, contactez-nous sur WhatsApp au +1 4182619091."
          },
          {
            text: "Ma vérification KYC a été rejetée",
            nextQuestionId: "kyc-rejected"
          },
          {
            text: "Ma vérification KYC prend trop de temps",
            solution: "La vérification KYC prend généralement 24-48 heures. Si votre demande date de plus de 48 heures, contactez-nous sur WhatsApp au +1 4182619091 avec votre adresse email."
          },
          {
            text: "Je ne comprends pas quels documents fournir",
            solution: "Vous devez fournir:\n1. Une photo de votre pièce d'identité (CNI, passeport, permis)\n2. Un selfie de vous tenant votre pièce d'identité\n3. Éventuellement un justificatif de domicile de moins de 3 mois\nAssurez-vous que les photos sont claires et que toutes les informations sont lisibles."
          }
        ]
      },
      {
        id: "kyc-rejected",
        question: "Avez-vous reçu un email expliquant le rejet ?",
        answers: [
          {
            text: "Oui, je comprends pourquoi",
            solution: "Corrigez les problèmes mentionnés dans l'email (photo floue, documents expirés, etc.) et soumettez à nouveau votre demande. Si vous avez des questions, contactez-nous sur WhatsApp au +1 4182619091."
          },
          {
            text: "Oui, mais je ne comprends pas",
            solution: "Contactez-nous sur WhatsApp au +1 4182619091 avec la référence de votre demande KYC. Nous vous expliquerons en détail ce qui doit être corrigé."
          },
          {
            text: "Non, je n'ai pas reçu d'email",
            solution: "Vérifiez vos spams. Si vous ne trouvez pas l'email, connectez-vous à votre tableau de bord pour voir le statut de votre KYC. Pour plus de détails, contactez-nous sur WhatsApp au +1 4182619091."
          }
        ]
      }
    ]
  }
];

export const getSupportFlowById = (id: string): SupportFlow | undefined => {
  return supportFlows.find(flow => flow.id === id);
};

export const getQuestionById = (flow: SupportFlow, questionId: string): SupportQuestion | undefined => {
  return flow.questions.find(q => q.id === questionId);
};
