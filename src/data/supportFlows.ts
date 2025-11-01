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
            text: "Je découvre Terex, je ne comprends pas comment ça marche",
            nextQuestionId: "buy-first-time"
          },
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
            text: "J'ai reçu mes USDT mais le montant est incorrect",
            nextQuestionId: "buy-wrong-amount"
          },
          {
            text: "J'ai une erreur lors de la création",
            nextQuestionId: "buy-error"
          }
        ]
      },
      {
        id: "buy-first-time",
        question: "Quelle information recherchez-vous ?",
        answers: [
          {
            text: "C'est quoi USDT et pourquoi l'acheter ?",
            solution: "USDT (Tether) est une cryptomonnaie stable dont la valeur est liée au dollar américain (1 USDT = 1 USD). Avantages:\n• Protection contre l'inflation\n• Transferts internationaux rapides et peu coûteux\n• Convertible en cash facilement\n• Accepté mondialement\n\nSur Terex, vous achetez des USDT avec vos FCFA en quelques minutes. Vous recevez vos USDT dans votre wallet et pouvez les utiliser pour épargner, transférer ou trader."
          },
          {
            text: "Comment fonctionne l'achat sur Terex ?",
            solution: "Processus simple en 5 étapes:\n1. Créez un compte gratuit sur Terex\n2. Cliquez sur 'Acheter USDT'\n3. Entrez le montant en FCFA que vous voulez convertir\n4. Indiquez votre adresse wallet où recevoir les USDT\n5. Payez par Orange Money, Wave ou virement\n\nVous recevez vos USDT en 5-30 minutes! Minimum 10,000 FCFA, maximum 5,000,000 FCFA par transaction."
          },
          {
            text: "J'ai besoin d'un wallet, comment en créer un ?",
            nextQuestionId: "buy-wallet-help"
          },
          {
            text: "Combien ça coûte ? Quels sont les frais ?",
            solution: "Nos frais sont transparents:\n• Frais de service: 1-2% du montant\n• Pas de frais cachés\n• Taux de change compétitif affiché en temps réel\n\nExemple: Pour 100,000 FCFA\n- Taux: 1 USDT = 620 FCFA\n- Frais: 1,500 FCFA\n- Vous recevez: environ 159 USDT\n\nLe montant exact est toujours affiché avant validation de votre commande."
          }
        ]
      },
      {
        id: "buy-wallet-help",
        question: "Quel type de wallet préférez-vous ?",
        answers: [
          {
            text: "Application mobile (recommandé pour débutants)",
            solution: "Applications recommandées:\n\n1. Trust Wallet (iOS/Android)\n- Téléchargez depuis App Store/Play Store\n- Créez un nouveau wallet\n- IMPORTANT: Notez votre phrase secrète de 12 mots dans un endroit sûr\n- Sélectionnez USDT et copiez votre adresse\n\n2. Binance\n- Créez un compte sur binance.com\n- Vérifiez votre identité\n- Allez dans Wallet > Deposit\n- Cherchez USDT et sélectionnez le réseau (TRC20 recommandé)\n- Copiez l'adresse\n\nUtilisez cette adresse dans Terex pour recevoir vos USDT."
          },
          {
            text: "Compte Exchange (Binance, Coinbase)",
            solution: "Pour créer un compte Exchange:\n\n1. Binance (recommandé):\n- Inscrivez-vous sur binance.com\n- Vérifiez votre email et téléphone\n- Complétez la vérification d'identité (KYC)\n- Allez dans Wallet > Fiat and Spot\n- Cherchez USDT > Deposit\n- Choisissez le réseau TRC20 (frais bas)\n- Copiez l'adresse de dépôt\n\n2. Coinbase:\n- Inscrivez-vous sur coinbase.com\n- Vérifiez votre identité\n- Allez dans Portfolio > USDT > Receive\n- Copiez l'adresse affichée\n\nUtilisez cette adresse sur Terex pour recevoir vos USDT."
          },
          {
            text: "Je ne sais pas, conseillez-moi",
            solution: "Pour débuter, nous recommandons:\n\n🥇 Binance (si vous voulez trader)\n- Plateforme complète et sécurisée\n- Facile à utiliser\n- Vous pouvez trader, épargner, envoyer\n- Application mobile excellente\n\n🥈 Trust Wallet (si vous voulez juste garder vos USDT)\n- Simple et sécurisé\n- Vous contrôlez vos clés\n- Pas besoin de vérification d'identité\n- Totalement gratuit\n\nPour Binance: inscrivez-vous sur binance.com\nPour Trust Wallet: téléchargez l'app depuis votre store\n\nBesoin d'aide ? Contactez-nous sur WhatsApp: +1 4182619091"
          }
        ]
      },
      {
        id: "buy-wrong-amount",
        question: "Le montant reçu est différent de combien ?",
        answers: [
          {
            text: "Légère différence (moins de 5%)",
            solution: "Les légères différences sont normales et dues à:\n• Variation du taux de change entre la commande et le paiement\n• Frais de service (1-2%)\n• Frais réseau blockchain\n\nVérifiez le taux exact appliqué dans votre email de confirmation ou votre tableau de bord. Si vous pensez qu'il y a une erreur, contactez-nous sur WhatsApp au +1 4182619091 avec votre numéro de commande."
          },
          {
            text: "Différence importante (plus de 10%)",
            solution: "Une différence importante n'est pas normale. Contactez immédiatement notre support:\n• WhatsApp: +1 4182619091\n• Préparez: votre numéro de commande, le montant payé, le montant reçu\n• Nous vérifierons et corrigerons si erreur\n\nNous répondons en moins de 30 minutes et résolvons rapidement tout problème de montant."
          },
          {
            text: "Je ne comprends pas le calcul",
            solution: "Voici comment calculer ce que vous devez recevoir:\n\nExemple: Vous payez 100,000 FCFA\n1. Taux du jour: 1 USDT = 620 FCFA\n2. Montant avant frais: 100,000 / 620 = 161.29 USDT\n3. Frais de service (1.5%): 2.42 USDT\n4. Vous recevez: 161.29 - 2.42 = 158.87 USDT\n\nLe calcul exact avec le taux appliqué est dans votre email de confirmation. Pour vérifier, contactez-nous sur WhatsApp: +1 4182619091"
          }
        ]
      },
      {
        id: "buy-create-issue",
        question: "Quel est le problème lors de la création de votre commande ?",
        answers: [
          {
            text: "Je n'ai pas de compte / je ne peux pas me connecter",
            nextQuestionId: "buy-account-issue"
          },
          {
            text: "Je ne peux pas entrer mon adresse wallet",
            nextQuestionId: "buy-wallet-address-issue"
          },
          {
            text: "Le montant minimum/maximum me bloque",
            nextQuestionId: "buy-amount-limits"
          },
          {
            text: "Je ne vois pas ma méthode de paiement",
            nextQuestionId: "buy-payment-method"
          },
          {
            text: "Le réseau (TRC20, ERC20, BEP20) me confond",
            nextQuestionId: "buy-network-help"
          },
          {
            text: "La page se charge lentement ou freeze",
            solution: "Problème de performance:\n• Videz le cache de votre navigateur (Ctrl+Shift+Suppr)\n• Essayez un autre navigateur (Chrome, Firefox, Safari)\n• Vérifiez votre connexion internet\n• Désactivez temporairement les extensions de navigateur\n• Essayez en navigation privée\n\nSi le problème persiste, contactez-nous sur WhatsApp: +1 4182619091"
          }
        ]
      },
      {
        id: "buy-account-issue",
        question: "Quel est votre problème de compte ?",
        answers: [
          {
            text: "Je n'ai pas encore de compte",
            solution: "Créer un compte est simple et rapide:\n1. Cliquez sur 'S'inscrire' en haut à droite\n2. Entrez votre adresse email\n3. Vous recevrez un lien de connexion par email\n4. Cliquez sur le lien pour vous connecter\n5. Complétez votre profil\n\nPas de mot de passe à retenir! Vous recevez un lien magique à chaque connexion. C'est plus sécurisé et plus simple."
          },
          {
            text: "Je ne reçois pas l'email de connexion",
            solution: "Si vous ne recevez pas l'email:\n• Vérifiez vos spams/courriers indésirables\n• Attendez 5 minutes (l'email peut prendre du temps)\n• Vérifiez que vous avez bien entré votre email\n• Ajoutez noreply@terex.sn à vos contacts\n• Demandez un nouveau lien de connexion\n\nToujours rien? Contactez-nous sur WhatsApp: +1 4182619091"
          },
          {
            text: "Le lien de connexion a expiré",
            solution: "Les liens de connexion expirent après 1 heure pour votre sécurité. Demandez simplement un nouveau lien:\n1. Allez sur terex.sn\n2. Cliquez sur 'Se connecter'\n3. Entrez votre email\n4. Recevez un nouveau lien valide\n\nPour éviter l'expiration, utilisez le lien dès réception."
          },
          {
            text: "Mon compte est bloqué",
            solution: "Si votre compte est bloqué, cela peut être dû à:\n• Activité suspecte détectée\n• Problème de vérification KYC\n• Tentatives de connexion multiples\n\nContactez immédiatement notre support:\n• WhatsApp: +1 4182619091\n• Email: support@terex.sn\n• Indiquez votre email de compte\n\nNous traiterons votre cas en priorité."
          }
        ]
      },
      {
        id: "buy-wallet-address-issue",
        question: "Quel problème rencontrez-vous avec l'adresse wallet ?",
        answers: [
          {
            text: "L'adresse est refusée / marquée comme invalide",
            solution: "Vérifications à faire:\n✅ Adresse complète copiée (aucun caractère manquant)\n✅ Pas d'espaces avant/après l'adresse\n✅ Format correct selon le réseau:\n  • TRC20: commence par 'T' (34 caractères)\n  • ERC20: commence par '0x' (42 caractères)\n  • BEP20: commence par '0x' (42 caractères)\n\nAstuce: Ne tapez jamais l'adresse manuellement, utilisez toujours le copier-coller depuis votre wallet.\n\nToujours invalide? Envoyez-nous l'adresse sur WhatsApp: +1 4182619091"
          },
          {
            text: "Je ne sais pas où trouver mon adresse wallet",
            solution: "Où trouver votre adresse selon votre wallet:\n\n📱 Trust Wallet:\nOuvrez l'app > Sélectionnez 'USDT' > Appuyez sur 'Receive' > Copiez l'adresse\n\n🔶 Binance:\nOuvrez l'app > Wallet > Fiat and Spot > Cherchez USDT > Deposit > Choisissez le réseau > Copiez l'adresse\n\n🌐 Coinbase:\nOuvrez l'app > Portfolio > USDT > Receive > Copiez l'adresse\n\n💡 L'adresse ressemble à: T9yD14Nj9j7xAB4dbGeiX9h8unkKHxuWwb (TRC20) ou 0x71C7656EC7ab88b098defB751B7401B5f6d8976F (ERC20/BEP20)"
          },
          {
            text: "J'ai plusieurs adresses, laquelle utiliser ?",
            solution: "Si vous avez plusieurs adresses:\n\n1️⃣ Vérifiez le RÉSEAU:\n• Choisissez l'adresse correspondant au réseau sélectionné sur Terex\n• TRC20 ≠ ERC20 ≠ BEP20 (ce sont des adresses différentes!)\n\n2️⃣ RECOMMANDATION:\n• Utilisez TRC20 (Tron) pour les frais les plus bas\n• Les transferts TRC20 coûtent environ 1-2 USDT\n• ERC20 peut coûter 10-50 USDT de frais\n\n3️⃣ IMPORTANT:\n• Utilisez toujours la même adresse pour tous vos achats\n• Ne mélangez jamais les réseaux\n\nConfus? Contactez-nous: +1 4182619091"
          }
        ]
      },
      {
        id: "buy-amount-limits",
        question: "Que souhaitez-vous faire ?",
        answers: [
          {
            text: "J'ai besoin d'acheter moins que le minimum",
            solution: "Le minimum est de 10,000 FCFA pour des raisons de frais de traitement.\n\nAlternatives:\n• Attendez d'avoir le montant minimum\n• Groupez-vous avec des amis pour atteindre le minimum\n• Les petits montants rendent les frais proportionnellement élevés\n\nPourquoi ce minimum?\n• Frais de traitement des paiements\n• Frais réseau blockchain\n• Coûts opérationnels\n\nPour des montants < 10,000 FCFA, considérez d'autres plateformes P2P."
          },
          {
            text: "J'ai besoin d'acheter plus que le maximum (5M FCFA)",
            solution: "Pour les gros volumes (> 5,000,000 FCFA):\n\n✅ OPTION 1: Transactions multiples\n• Faites plusieurs transactions de 5M FCFA\n• Espacez-les de quelques heures\n\n✅ OPTION 2: Transaction VIP (recommandé)\n• Contactez-nous sur WhatsApp: +1 4182619091\n• Indiquez le montant souhaité\n• Nous offrons:\n  - Meilleurs taux pour gros volumes\n  - Traitement prioritaire\n  - Service dédié\n  - Frais réduits\n\n💎 Avantages VIP:\n• À partir de 10M FCFA: -0.5% de frais\n• À partir de 50M FCFA: -1% de frais\n• Service 24/7 dédié"
          },
          {
            text: "Je ne comprends pas comment est calculé le montant",
            solution: "Calcul simple:\n\n📊 Formule:\nMontant FCFA ÷ Taux USDT = USDT reçus (avant frais)\n\n📝 Exemple concret:\nVous voulez acheter pour 500,000 FCFA\n• Taux du jour: 1 USDT = 620 FCFA\n• Calcul: 500,000 ÷ 620 = 806.45 USDT\n• Frais (1.5%): 12.10 USDT\n• Total reçu: 794.35 USDT\n\n💡 Bon à savoir:\n• Le taux change légèrement chaque minute\n• Le taux est bloqué quand vous créez votre commande\n• Vous avez 30 min pour payer au taux bloqué\n• Après 30 min, le taux peut changer"
          }
        ]
      },
      {
        id: "buy-network-help",
        question: "Quelle information vous manque sur les réseaux ?",
        answers: [
          {
            text: "C'est quoi TRC20, ERC20, BEP20 ?",
            solution: "Les réseaux blockchain expliqués simplement:\n\n🔷 TRC20 (Tron) - RECOMMANDÉ\n• Frais très bas: ~1-2 USDT\n• Rapide: 1-3 minutes\n• Très populaire en Afrique\n• Adresse commence par 'T'\n\n🔶 ERC20 (Ethereum)\n• Frais élevés: 10-50 USDT\n• Lent: 5-30 minutes\n• Le plus ancien et sécurisé\n• Adresse commence par '0x'\n\n🟡 BEP20 (Binance Smart Chain)\n• Frais moyens: 0.50-2 USDT\n• Rapide: 1-5 minutes\n• Idéal si vous utilisez Binance\n• Adresse commence par '0x'\n\n💡 Pour 99% des cas: Choisissez TRC20!"
          },
          {
            text: "Comment savoir quel réseau utilise mon wallet ?",
            solution: "Pour identifier le réseau de votre wallet:\n\n📱 Dans votre app wallet:\n1. Allez dans 'Receive' ou 'Deposit' pour USDT\n2. Vous verrez une liste de réseaux disponibles\n3. Sélectionnez le réseau souhaité\n4. L'adresse affichée correspond à ce réseau\n\n🔍 Reconnaître le réseau par l'adresse:\n• Commence par 'T' + 33 autres caractères = TRC20\n• Commence par '0x' + 40 autres caractères = ERC20 ou BEP20\n\n⚠️ ATTENTION:\nUne même adresse '0x...' peut être valide sur ERC20 ET BEP20.\nVérifiez toujours quel réseau vous avez sélectionné dans votre wallet!\n\n🆘 Besoin d'aide? Envoyez-nous une capture d'écran sur WhatsApp: +1 4182619091"
          },
          {
            text: "Que se passe-t-il si je me trompe de réseau ?",
            solution: "⚠️ ERREUR DE RÉSEAU = PERTE D'ARGENT ⚠️\n\nSi vous envoyez sur le mauvais réseau:\n❌ Les USDT n'arriveront pas\n❌ Ils peuvent être perdus définitivement\n❌ La récupération est complexe et coûteuse\n\n🛡️ COMMENT ÉVITER:\n✅ Vérifiez 3 fois le réseau avant de valider\n✅ Le réseau sur Terex DOIT correspondre à celui de votre wallet\n✅ En cas de doute, demandez-nous sur WhatsApp\n✅ Testez d'abord avec un petit montant\n\n🚨 SI ERREUR DÉJÀ FAITE:\nContactez immédiatement WhatsApp: +1 4182619091\nPréparez: adresse envoyée, réseau sélectionné, hash de transaction\n\n💡 Conseil: Utilisez toujours TRC20, c'est le plus simple et le moins cher!"
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
            text: "Je ne comprends pas comment vendre des USDT",
            nextQuestionId: "sell-first-time"
          },
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
            text: "J'ai envoyé mes USDT au mauvais endroit",
            nextQuestionId: "sell-wrong-address"
          },
          {
            text: "J'ai reçu mon argent mais le montant est incorrect",
            nextQuestionId: "sell-wrong-amount"
          },
          {
            text: "J'ai une erreur lors de l'envoi",
            nextQuestionId: "sell-error"
          }
        ]
      },
      {
        id: "sell-first-time",
        question: "Que voulez-vous savoir sur la vente ?",
        answers: [
          {
            text: "Comment fonctionne la vente sur Terex ?",
            solution: "Processus de vente en 6 étapes:\n\n1️⃣ Créez votre commande de vente\n• Indiquez combien d'USDT vous voulez vendre\n• Choisissez votre méthode de réception (Orange Money/Wave)\n• Entrez votre numéro de téléphone\n\n2️⃣ Nous générons une adresse unique\n• Vous recevez une adresse Terex pour ce transfert\n• Cette adresse est valide 2 heures\n\n3️⃣ Envoyez vos USDT\n• Depuis votre wallet vers notre adresse\n• Montant exact en USDT\n• Réseau exact (TRC20 recommandé)\n\n4️⃣ Confirmez avec le hash\n• Collez le hash de transaction dans votre tableau de bord\n\n5️⃣ Nous vérifions sur la blockchain\n• Délai: 3-15 minutes selon le réseau\n\n6️⃣ Vous recevez votre argent\n• Directement sur Orange Money/Wave\n• En 10-30 minutes après vérification"
          },
          {
            text: "Quels sont les frais de vente ?",
            solution: "Structure des frais transparente:\n\n💰 Frais de service: 1-2%\n• Appliqués sur le montant en FCFA\n• Inclus dans le taux affiché\n\n📊 Exemple pour 100 USDT:\n• Taux: 1 USDT = 620 FCFA\n• Valeur: 100 × 620 = 62,000 FCFA\n• Frais (1.5%): 930 FCFA\n• Vous recevez: 61,070 FCFA\n\n⚡ Frais réseau (blockchain):\n• Payés par vous lors de l'envoi depuis votre wallet\n• TRC20: ~1-2 USDT\n• ERC20: ~10-50 USDT\n• BEP20: ~0.5-2 USDT\n\n💡 ASTUCE: Utilisez TRC20 pour minimiser les frais!\n\nLe montant exact que vous recevrez est affiché avant validation."
          },
          {
            text: "Combien de temps prend une vente ?",
            solution: "⏱️ Délais de traitement:\n\n🚀 RÉSEAU BLOCKCHAIN (hors de notre contrôle):\n• TRC20: 1-5 minutes\n• BEP20: 3-10 minutes\n• ERC20: 5-30 minutes (peut varier beaucoup)\n\n✅ VÉRIFICATION TEREX:\n• Automatique dès confirmation blockchain\n• Délai: 2-5 minutes\n\n💸 PAIEMENT VERS VOUS:\n• Orange Money: instantané à 5 minutes\n• Wave: instantané à 5 minutes\n\n📱 TOTAL MOYEN:\n• TRC20: 10-20 minutes de bout en bout\n• BEP20: 15-30 minutes\n• ERC20: 20-45 minutes\n\n⚠️ Retards possibles si:\n• Frais réseau trop bas (transaction lente)\n• Hash non fourni dans le tableau de bord\n• Heure de pointe sur la blockchain\n\nPour accélérer: utilisez TRC20 et confirmez immédiatement avec le hash!"
          },
          {
            text: "Quelle est la limite de vente ?",
            solution: "💵 LIMITES DE VENTE:\n\n📉 Minimum: 10 USDT\n• Équivaut à ~6,000-7,000 FCFA\n• Minimum imposé par les frais de traitement\n\n📈 Maximum: 5,000 USDT par transaction\n• Équivaut à ~3,000,000-3,500,000 FCFA\n• Pour votre sécurité et conformité\n\n🔄 TRANSACTIONS MULTIPLES:\n• Vous pouvez faire plusieurs ventes par jour\n• Pas de limite journalière stricte\n• Espacez de 1-2 heures pour plus de sécurité\n\n💎 GROS VOLUMES (>5,000 USDT):\n• Contactez-nous sur WhatsApp: +1 4182619091\n• Service VIP avec:\n  - Meilleurs taux\n  - Traitement prioritaire\n  - Limites augmentées\n  - Manager dédié\n\n🎖️ Avec KYC vérifié: limites plus élevées disponibles!"
          }
        ]
      },
      {
        id: "sell-wrong-address",
        question: "Où avez-vous envoyé vos USDT ?",
        answers: [
          {
            text: "J'ai envoyé à une ancienne adresse Terex",
            solution: "⚠️ IMPORTANT: Chaque commande a une adresse UNIQUE!\n\n🔍 VÉRIFICATION:\n1. Allez dans votre tableau de bord\n2. Trouvez votre dernière commande de vente\n3. Vérifiez l'adresse fournie pour CETTE commande\n4. Comparez avec l'adresse où vous avez envoyé\n\n❌ SI DIFFÉRENTE:\n• Les anciennes adresses ne fonctionnent plus\n• Vos USDT ne seront pas perdus mais retardés\n• Contactez immédiatement WhatsApp: +1 4182619091\n• Donnez: hash de transaction, ancienne adresse, nouvelle adresse\n\n⏱️ RÉSOLUTION:\n• Nous identifierons votre paiement manuellement\n• Délai: 2-6 heures\n• Vous recevrez quand même votre argent\n\n💡 Pour éviter: Utilisez toujours l'adresse de la commande active!"
          },
          {
            text: "J'ai envoyé sur le mauvais réseau",
            solution: "🚨 ENVOI SUR MAUVAIS RÉSEAU\n\nSITUATION:\n• Vous deviez envoyer en TRC20, vous avez envoyé en ERC20 (ou inverse)\n• L'adresse peut être la même mais sur réseau différent\n\n⚠️ CONSÉQUENCES:\n• Les USDT n'apparaîtront pas immédiatement\n• Récupération possible mais complexe\n• Peut prendre 24-72 heures\n• Frais de récupération: 20-50 USDT\n\n🆘 ACTION IMMÉDIATE:\n1. NE RENVOYEZ PAS d'autres USDT\n2. Contactez WhatsApp: +1 4182619091\n3. Fournissez:\n   - Hash de transaction\n   - Réseau utilisé vs réseau demandé\n   - Adresse de destination\n   - Montant envoyé\n\n⏱️ TRAITEMENT:\n• Notre équipe technique interviendra\n• Récupération sous 1-3 jours ouvrés\n• Vous recevrez quand même votre argent (moins frais)\n\n🛡️ PRÉVENTION: Vérifiez 3 fois le réseau avant d'envoyer!"
          },
          {
            text: "J'ai envoyé à mon propre wallet par erreur",
            solution: "😅 ERREUR DE MANIPULATION\n\n✅ BONNE NOUVELLE:\n• Vos USDT sont en sécurité dans votre wallet\n• Aucune perte d'argent\n• Vous pouvez recommencer\n\n📝 MARCHE À SUIVRE:\n1. Vérifiez que les USDT sont bien arrivés dans votre wallet\n2. Retournez sur Terex\n3. Allez dans votre tableau de bord\n4. Trouvez votre commande de vente\n5. Copiez LA BONNE adresse Terex\n6. Renvoyez les USDT vers cette adresse correcte\n7. Confirmez avec le hash\n\n⏱️ ATTENTION:\n• Les commandes expirent après 2 heures\n• Si expirée, créez une nouvelle commande\n• Le taux peut avoir changé entre temps\n\n💡 ASTUCE:\n• Ajoutez l'adresse Terex dans votre carnet d'adresses wallet\n• Donnez-lui un nom clair: 'TEREX VENTE USDT'\n• Vérifiez toujours avant d'envoyer"
          },
          {
            text: "J'ai envoyé à une adresse inconnue",
            solution: "🆘 SITUATION CRITIQUE\n\n❌ MAUVAISE NOUVELLE:\nSi vous avez envoyé à une adresse qui n'appartient ni à Terex ni à vous:\n• Les transactions blockchain sont IRRÉVERSIBLES\n• Les USDT sont perdus définitivement\n• Terex ne peut pas les récupérer\n• Personne ne peut annuler une transaction blockchain\n\n🔍 VÉRIFICATION URGENTE:\n1. Trouvez votre hash de transaction\n2. Allez sur:\n   - TRC20: tronscan.org\n   - ERC20: etherscan.io\n   - BEP20: bscscan.com\n3. Entrez le hash pour voir où sont allés vos USDT\n4. Vérifiez l'adresse de destination\n\n✅ SI L'ADRESSE APPARTIENT À:\n• Terex: Contactez-nous, on retrouvera votre paiement\n• Vous: Pas de problème, vos USDT sont sûrs\n• Exchange connu (Binance, etc.): Contactez leur support\n• Inconnue: Malheureusement perdu\n\n🛡️ LEÇON IMPORTANTE:\n• Toujours vérifier l'adresse 3 fois\n• Utiliser le copier-coller, jamais taper manuellement\n• Tester d'abord avec 1-2 USDT\n• Vérifier le réseau correspond"
          }
        ]
      },
      {
        id: "sell-wrong-amount",
        question: "Le montant reçu diffère de combien ?",
        answers: [
          {
            text: "Petite différence (moins de 5%)",
            solution: "Les variations normales sont dues à:\n\n📊 FACTEURS:\n✅ Frais de service (1-2%)\n✅ Variation du taux entre commande et paiement\n✅ Arrondi des montants\n✅ Frais opérateur (Orange Money/Wave)\n\n🧮 VÉRIFICATION:\n1. Consultez votre email de confirmation\n2. Regardez le taux exact appliqué\n3. Calculez: USDT vendus × Taux - Frais\n\n📱 EXEMPLE:\n• Vous vendez: 100 USDT\n• Taux: 620 FCFA/USDT\n• Valeur: 62,000 FCFA\n• Frais (1.5%): 930 FCFA\n• Attendu: 61,070 FCFA\n• Reçu: 60,500 FCFA (différence de 570 FCFA = frais opérateur)\n\n❓ Toujours confus? Contactez WhatsApp: +1 4182619091 avec:\n• Numéro de commande\n• Montant USDT envoyé\n• Montant FCFA reçu"
          },
          {
            text: "Grosse différence (plus de 10%)",
            solution: "🚨 DIFFÉRENCE ANORMALE\n\n❌ Ce n'est pas normal! Causes possibles:\n• Erreur de calcul de notre part\n• Montant d'USDT différent de ce qui était prévu\n• Problème technique de paiement\n• Taux appliqué incorrect\n\n🆘 ACTION IMMÉDIATE:\n1. Prenez des captures d'écran:\n   - Email de confirmation Terex\n   - Transaction d'envoi (hash)\n   - Réception Orange Money/Wave\n2. Notez:\n   - Numéro de commande\n   - USDT envoyés (vérifiez sur blockchain)\n   - FCFA reçus\n   - Taux affiché vs appliqué\n3. Contactez WhatsApp: +1 4182619091\n\n⚡ RÉSOLUTION RAPIDE:\n• Réponse en moins de 30 minutes\n• Vérification complète de la transaction\n• Remboursement de la différence sous 2-6 heures\n• Compensation si erreur de notre part\n\n🛡️ Terex garantit le taux affiché au moment de la commande!"
          },
          {
            text: "J'ai reçu plus que prévu",
            solution: "🎉 Bonne surprise!\n\nPOSSIBLES RAISONS:\n✨ Taux a évolué en votre faveur entre commande et paiement\n✨ Promotion ou bonus appliqué\n✨ Arrondissement commercial en votre faveur\n✨ Frais estimés étaient supérieurs aux frais réels\n\n📝 VÉRIFICATION:\n• Consultez votre email de confirmation\n• Le montant exact devrait y figurer\n• Vérifiez si une promotion était active\n\n😊 PAS D'INQUIÉTUDE:\n• Ce n'est pas une erreur que vous devez rembourser\n• Profitez simplement!\n• Si la différence est très importante (>20%), vous pouvez nous contacter pour vérifier: +1 4182619091\n\n💚 MERCI DE VOTRE CONFIANCE:\nCes petits bonus sont notre façon de remercier nos clients fidèles!"
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
            text: "Mon compte est bloqué ou suspendu",
            nextQuestionId: "account-blocked"
          },
          {
            text: "Problème de vérification KYC",
            nextQuestionId: "kyc-issue"
          },
          {
            text: "Je veux supprimer mon compte",
            nextQuestionId: "delete-account"
          },
          {
            text: "Je veux changer mon email ou téléphone",
            nextQuestionId: "change-info"
          },
          {
            text: "Problème de sécurité / compte piraté",
            nextQuestionId: "security-issue"
          }
        ]
      },
      {
        id: "account-blocked",
        question: "Pourquoi pensez-vous que votre compte est bloqué ?",
        answers: [
          {
            text: "Je reçois un message 'compte suspendu'",
            solution: "🔒 COMPTE SUSPENDU\n\nRAISONS POSSIBLES:\n• Activité suspecte détectée\n• Échec de vérification KYC\n• Violation des conditions d'utilisation\n• Mesure de sécurité préventive\n\n🆘 ACTION IMMÉDIATE:\n1. Vérifiez votre email pour une notification\n2. Lisez la raison de la suspension\n3. Contactez WhatsApp: +1 4182619091\n4. Préparez:\n   - Votre email de compte\n   - Pièce d'identité\n   - Détails des dernières transactions\n\n⏱️ RÉSOLUTION:\n• Réponse sous 1-4 heures\n• Examen complet de votre cas\n• Déblocage sous 24-48h si tout est en ordre\n\n🛡️ PRÉVENTION:\n• Complétez votre KYC\n• N'utilisez qu'une seule personne par compte\n• Ne partagez jamais vos liens de connexion"
          },
          {
            text: "Je ne peux plus créer de commandes",
            solution: "❌ IMPOSSIBILITÉ DE CRÉER DES COMMANDES\n\nCAUSES FRÉQUENTES:\n\n1️⃣ KYC NON VÉRIFIÉ:\n• Vérifiez votre statut KYC dans le tableau de bord\n• Complétez la vérification si nécessaire\n• Délai KYC: 24-48 heures\n\n2️⃣ LIMITE ATTEINTE:\n• Limite sans KYC: 100,000 FCFA/jour\n• Attendez 24h ou complétez le KYC\n• Avec KYC: limites beaucoup plus élevées\n\n3️⃣ COMMANDE EN COURS:\n• Vous avez peut-être une commande non payée\n• Complétez ou annulez l'ancienne commande\n• Maximum 1 commande en attente\n\n4️⃣ PROBLÈME TECHNIQUE:\n• Videz votre cache\n• Essayez un autre navigateur\n• Reconnectez-vous\n\n🆘 TOUJOURS BLOQUÉ?\nWhatsApp: +1 4182619091 avec:\n• Email de compte\n• Message d'erreur exact\n• Dernière transaction réussie"
          },
          {
            text: "Mes transactions sont toujours refusées",
            solution: "⛔ TRANSACTIONS SYSTÉMATIQUEMENT REFUSÉES\n\nANALYSE DU PROBLÈME:\n\n1️⃣ VÉRIFIEZ LE STATUT KYC:\n• KYC en attente → Transactions limitées\n• KYC rejeté → Complétez à nouveau\n• KYC approuvé → Passez au point 2\n\n2️⃣ VÉRIFIEZ LES LIMITES:\n• Sans KYC: max 100k FCFA/jour\n• Avec KYC: jusqu'à 5M FCFA/transaction\n• Historique des 24 dernières heures compte\n\n3️⃣ MÉTHODE DE PAIEMENT:\n• Orange Money: activé pour paiements marchands?\n• Wave: compte vérifié et chargé?\n• Virement: coordonnées bancaires valides?\n\n4️⃣ DÉTECTION FRAUDE:\n• Activité inhabituelle peut déclencher blocage\n• Changement soudain de montants\n• Trop de transactions rapprochées\n\n🔧 SOLUTIONS:\n✅ Complétez le KYC\n✅ Vérifiez vos méthodes de paiement\n✅ Espacez vos transactions\n✅ Contactez support pour déblocage: +1 4182619091\n\n⚡ URGENCE?\nWhatsApp: +1 4182619091\nRéponse: <30 minutes"
          }
        ]
      },
      {
        id: "security-issue",
        question: "Quel est votre problème de sécurité ?",
        answers: [
          {
            text: "Je pense que mon compte a été piraté",
            solution: "🚨 COMPTE POTENTIELLEMENT COMPROMIS\n\n❗ ACTIONS IMMÉDIATES (dans cet ordre):\n\n1️⃣ SÉCURISEZ VOTRE EMAIL:\n• Changez le mot de passe de votre email\n• Activez la vérification en 2 étapes\n• Déconnectez tous les appareils\n\n2️⃣ CONTACTEZ-NOUS URGENCE:\n• WhatsApp: +1 4182619091\n• Indiquez: 'COMPTE PIRATÉ - URGENT'\n• Nous bloquerons le compte immédiatement\n\n3️⃣ VÉRIFIEZ VOS TRANSACTIONS:\n• Tableau de bord > Historique\n• Notez toute transaction non autorisée\n• Prenez des captures d'écran\n\n4️⃣ PRÉPAREZ LES PREUVES:\n• Pièce d'identité\n• Dernières transactions que VOUS avez faites\n• Numéros de téléphone associés\n• Détails suspects observés\n\n⏱️ NOTRE RÉPONSE:\n• Blocage immédiat: <10 minutes\n• Enquête complète: 2-4 heures\n• Restauration sécurisée: 24-48 heures\n• Remboursement si fraude prouvée\n\n🛡️ APRÈS RÉSOLUTION:\n• Nouveau compte avec sécurité renforcée\n• Surveillance accrue\n• Formation sécurité gratuite"
          },
          {
            text: "J'ai reçu un email ou SMS suspect",
            solution: "⚠️ TENTATIVE DE PHISHING POSSIBLE\n\n🎣 SIGNES DE PHISHING:\n❌ Email demandant vos identifiants\n❌ Lien urgent à cliquer\n❌ Menace de fermeture de compte\n❌ Demande d'information bancaire\n❌ Email d'une adresse bizarre\n❌ Fautes d'orthographe multiples\n\n✅ EMAILS LÉGITIMES TEREX:\n• Envoyés depuis @terex.sn\n• Ne demandent JAMAIS:\n  - Votre mot de passe\n  - Codes de sécurité\n  - Coordonnées bancaires complètes\n  - Codes PIN Orange Money/Wave\n• Contiennent toujours votre numéro de commande\n\n🛡️ QUE FAIRE:\n1. NE CLIQUEZ PAS sur les liens suspects\n2. NE DONNEZ AUCUNE information\n3. Transférez l'email à: security@terex.sn\n4. Supprimez l'email/SMS\n5. Signalez sur WhatsApp: +1 4182619091\n\n💡 VÉRIFICATION:\nSi doute, contactez-nous DIRECTEMENT:\n• WhatsApp: +1 4182619091\n• Email: support@terex.sn\n• Ne répondez JAMAIS à l'email suspect"
          },
          {
            text: "Quelqu'un connaît mes informations de connexion",
            solution: "🔓 VOS INFOS SONT COMPROMISES\n\n⚡ ACTIONS URGENTES:\n\n1️⃣ CHANGEZ VOTRE EMAIL (si possible):\n• Contactez-nous pour changer l'email associé\n• WhatsApp: +1 4182619091\n• Nous le ferons immédiatement\n\n2️⃣ SÉCURISEZ VOTRE EMAIL ACTUEL:\n• Changez le mot de passe EMAIL\n• Activez authentification à 2 facteurs\n• Vérifiez les connexions suspectes\n• Supprimez les appareils inconnus\n\n3️⃣ VÉRIFIEZ TEREX:\n• Connectez-vous immédiatement\n• Vérifiez l'historique des transactions\n• Cherchez toute activité suspecte\n• Notez ce qui est anormal\n\n4️⃣ INFORMEZ-NOUS:\n• WhatsApp: +1 4182619091\n• Email: security@terex.sn\n• Dites qui a accès aux infos\n• On sécurisera votre compte\n\n🛡️ MESURES DE SÉCURITÉ:\n• Ne partagez JAMAIS vos liens de connexion\n• N'utilisez pas d'ordinateurs publics\n• Vérifiez l'URL: https://terex.sn\n• Déconnectez-vous après chaque session\n\n📱 NOTRE ACTION:\n• Activation surveillance renforcée\n• Notifications pour chaque action\n• Blocage automatique si activité suspecte"
          },
          {
            text: "Je veux activer plus de sécurité",
            solution: "🔐 RENFORCER LA SÉCURITÉ\n\nMESURES DISPONIBLES:\n\n1️⃣ SÉCURITÉ EMAIL:\n✅ Utilisez un email sécurisé (Gmail, Outlook)\n✅ Activez l'authentification à 2 facteurs\n✅ Mot de passe fort et unique\n✅ Changez-le régulièrement (3-6 mois)\n\n2️⃣ VÉRIFICATION KYC:\n✅ Complétez la vérification d'identité\n✅ Ajoute une couche de protection\n✅ Impossible pour un pirate de passer le KYC\n\n3️⃣ BONNES PRATIQUES:\n✅ Ne sauvegardez pas les liens de connexion\n✅ Déconnectez-vous après chaque session\n✅ N'utilisez pas de WiFi public\n✅ Vérifiez toujours l'URL du site\n✅ Ne partagez jamais vos accès\n\n4️⃣ SURVEILLANCE:\n✅ Vérifiez régulièrement l'historique\n✅ Notifications activées (email)\n✅ Confirmez chaque transaction importante\n\n5️⃣ EN CAS DE DOUTE:\n✅ Contactez immédiatement: +1 4182619091\n✅ Vérifiez toujours via nos canaux officiels\n✅ Ne faites confiance à aucun intermédiaire\n\n🎓 FORMATION GRATUITE:\nContactez-nous pour une session de sensibilisation personnalisée sur la sécurité crypto!"
          }
        ]
      },
      {
        id: "delete-account",
        question: "Pourquoi souhaitez-vous supprimer votre compte ?",
        answers: [
          {
            text: "Je n'utilise plus le service",
            solution: "😢 Désolé de vous voir partir!\n\nAVANT DE SUPPRIMER:\n• Votre compte reste gratuit même inactif\n• Vous pouvez revenir n'importe quand\n• Votre KYC sera perdu (à refaire si vous revenez)\n• Historique des transactions supprimé définitivement\n\n✅ SI VOUS ÊTES SÛR:\n1. Assurez-vous de n'avoir aucune transaction en cours\n2. Contactez: support@terex.sn\n3. Objet: 'Suppression de compte'\n4. Indiquez: votre email et raison\n5. Envoyez une copie de votre pièce d'identité\n\n⏱️ DÉLAI:\n• Vérification: 24-48 heures\n• Suppression effective: 7 jours\n• Données conservées 30 jours (légal) puis suppression définitive\n\n💔 FEEDBACK:\nDites-nous comment améliorer: feedback@terex.sn\nVos retours nous aident à progresser!"
          },
          {
            text: "J'ai eu une mauvaise expérience",
            solution: "😞 Nous sommes désolés de votre expérience\n\n🎧 PARLONS-EN D'ABORD:\nAvant la suppression, donnez-nous une chance:\n• WhatsApp: +1 4182619091\n• Décrivez votre problème\n• Nous ferons de notre mieux pour arranger\n• Compensation possible selon le cas\n\n💬 VOTRE AVIS COMPTE:\n• Que s'est-il passé?\n• Comment peut-on améliorer?\n• Qu'attendiez-vous de Terex?\n\n🎁 ON PEUT OFFRIR:\n• Résolution rapide de votre problème\n• Frais offerts sur prochaine transaction\n• Support prioritaire VIP gratuit\n• Compensation si erreur de notre part\n\n✅ SI SUPPRESSION MAINTENUE:\nSuivez le processus standard:\n1. Email à: support@terex.sn\n2. Objet: 'Suppression compte - Mauvaise expérience'\n3. Expliquez brièvement (anonyme si souhaité)\n4. Pièce d'identité pour confirmation\n\n📊 Vos retours nous aident à améliorer le service pour tous!"
          },
          {
            text: "Je veux créer un nouveau compte",
            solution: "🔄 NOUVEAU DÉPART\n\n⚠️ ATTENTION:\nCe n'est généralement pas nécessaire!\n\nAU LIEU DE SUPPRIMER:\n✅ Vous pouvez changer:\n  • Email de connexion\n  • Numéro de téléphone\n  • Informations personnelles\n  • Méthodes de paiement\n\nContactez-nous: +1 4182619091\nOn peut tout mettre à jour!\n\n❓ POURQUOI UN NOUVEAU COMPTE?\nSi c'est pour:\n• Email perdu: On peut changer\n• Données erronées: On peut corriger\n• KYC rejeté: On peut aider à réussir\n• Recommencer: Pas besoin de supprimer\n\n⚠️ CRÉER UN 2ÈME COMPTE:\nVIOLE NOS CONDITIONS!\n• Un seul compte par personne\n• Risque de blocage des deux comptes\n• Problèmes de KYC\n• Complications fiscales\n\n✅ SOLUTION:\nContactez-nous pour réinitialiser/mettre à jour votre compte actuel au lieu d'en créer un nouveau."
          }
        ]
      },
      {
        id: "change-info",
        question: "Quelle information voulez-vous changer ?",
        answers: [
          {
            text: "Mon adresse email de connexion",
            solution: "📧 CHANGEMENT D'EMAIL\n\nPROCÉDURE:\n\n1️⃣ PRÉPARATION:\n• Nouveau email valide et accessible\n• Pièce d'identité à jour\n• Accès au tableau de bord actuel\n\n2️⃣ DEMANDE:\n• Contactez: support@terex.sn\n• OU WhatsApp: +1 4182619091\n• Sujet: 'Changement email'\n• Indiquez:\n  - Email actuel\n  - Nouvel email souhaité\n  - Raison du changement\n  - Joindre pièce d'identité\n\n3️⃣ VÉRIFICATION:\n• Notre équipe vérifie votre identité\n• Confirmation de possession des deux emails\n• Délai: 2-6 heures\n\n4️⃣ ACTIVATION:\n• Nous changeons l'email\n• Vous recevez confirmation sur les deux emails\n• Connectez-vous avec le nouveau\n\n⚠️ IMPORTANT:\n• L'ancien email sera désactivé\n• Tout l'historique est préservé\n• Le KYC reste valide\n• Les commandes en cours continuent normalement\n\n💡 Vérifiez que le nouvel email est bien orthographié!"
          },
          {
            text: "Mon numéro de téléphone",
            solution: "📱 CHANGEMENT DE NUMÉRO\n\nFACILE À FAIRE:\n\n1️⃣ DANS LE TABLEAU DE BORD:\n• Connectez-vous\n• Allez dans 'Profil'\n• Section 'Informations personnelles'\n• Cliquez sur 'Modifier'\n• Entrez le nouveau numéro\n• Sauvegardez\n\n2️⃣ SI PROBLÈME:\n• WhatsApp: +1 4182619091\n• Nous le changerons manuellement\n• Délai: 5-30 minutes\n\n📝 À SAVOIR:\n• Le numéro est utilisé pour:\n  - Vous contacter si besoin\n  - Recevoir des FCFA (vente USDT)\n  - Envoyer des FCFA (transferts)\n\n⚠️ ATTENTION:\nSi vous changez le numéro:\n• Les anciennes commandes gardent l'ancien numéro\n• Pour les nouvelles, utilisez le nouveau\n• Vérifiez que le nouveau numéro a Orange Money/Wave actif\n\n✅ ASTUCE:\nGardez les deux numéros actifs pendant 1 mois pour transition en douceur."
          },
          {
            text: "Mon nom ou informations personnelles",
            solution: "✏️ MODIFICATION INFORMATIONS PERSONNELLES\n\n🔐 RESTRICTIONS:\nLes informations KYC ne peuvent pas être modifiées facilement car elles sont vérifiées contre votre pièce d'identité.\n\nINFOS MODIFIABLES LIBREMENT:\n✅ Nom d'affichage\n✅ Numéro de téléphone\n✅ Pays\n✅ Langue préférée\n✅ Préférences de notification\n\nVIA LE TABLEAU DE BORD:\n1. Connectez-vous\n2. Profil > Paramètres\n3. Modifiez les champs souhaités\n4. Sauvegardez\n\nINFOS KYC (nom, date naissance, etc.):\n❗ Nécessitent validation manuelle\n\nPROCÉDURE:\n1. Contactez: support@terex.sn\n2. Sujet: 'Modification infos KYC'\n3. Indiquez:\n   - Email de compte\n   - Information à changer\n   - Ancienne valeur → Nouvelle valeur\n   - RAISON du changement\n4. Joignez:\n   - Nouvelle pièce d'identité\n   - Justificatif si nécessaire\n\n⏱️ DÉLAI:\n• Vérification: 24-72 heures\n• Cas particuliers: contact direct avec vous\n\n⚠️ NOTES:\n• Changement de nom légal: justificatif obligatoire\n• Erreur de frappe: correction rapide\n• Changement fréquent: peut déclencher alerte sécurité"
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
