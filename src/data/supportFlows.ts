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
            text: "J'ai payé mais je n'ai pas reçu mes USDT",
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
            solution: "USDT (Tether) est une cryptomonnaie stable dont la valeur est liée au dollar américain (1 USDT ≈ 1 USD).\n\nAvantages:\n• Protection contre l'inflation\n• Transferts internationaux rapides et peu coûteux\n• Convertible en cash facilement\n• Accepté mondialement\n\nSur Terex, vous achetez des USDT avec vos FCFA en quelques minutes. Vous recevez vos USDT dans votre wallet et pouvez les utiliser pour épargner, transférer ou trader."
          },
          {
            text: "Comment fonctionne l'achat sur Terex ?",
            solution: "Processus simple et automatisé:\n\n1. Créez un compte gratuit sur Terex\n2. Cliquez sur 'Acheter USDT'\n3. Entrez le montant en FCFA que vous voulez convertir\n4. Indiquez votre adresse wallet ou email Binance\n5. Validez — vous serez redirigé vers Wave ou Orange Money pour payer\n6. Le paiement est prélevé automatiquement de votre compte Wave/Orange Money\n7. Vos USDT sont envoyés automatiquement après confirmation du paiement\n\nTout est automatisé, pas besoin de faire de transfert manuel ! Minimum 5 000 FCFA, maximum 5 000 000 FCFA par transaction."
          },
          {
            text: "J'ai besoin d'un wallet, comment en créer un ?",
            nextQuestionId: "buy-wallet-help"
          },
          {
            text: "Combien ça coûte ? Quels sont les frais ?",
            solution: "Nos frais sont transparents:\n• Frais de service: 1-2% du montant\n• Pas de frais cachés\n• Taux de change compétitif affiché en temps réel\n\nExemple: Pour 100 000 FCFA\n- Taux: 1 USDT = 620 FCFA\n- Frais: ~1 500 FCFA\n- Vous recevez: environ 159 USDT\n\nLe montant exact est toujours affiché avant validation de votre commande."
          }
        ]
      },
      {
        id: "buy-wallet-help",
        question: "Quel type de wallet préférez-vous ?",
        answers: [
          {
            text: "Application mobile (recommandé pour débutants)",
            solution: "Applications recommandées:\n\n1. Trust Wallet (iOS/Android)\n- Téléchargez depuis App Store/Play Store\n- Créez un nouveau wallet\n- IMPORTANT: Notez votre phrase secrète de 12 mots dans un endroit sûr\n- Sélectionnez USDT et copiez votre adresse\n\n2. Binance\n- Créez un compte sur binance.com\n- Vérifiez votre identité\n- Allez dans Wallet > Deposit > USDT\n- Choisissez le réseau (TRC20 recommandé)\n- Copiez l'adresse\n\nUtilisez cette adresse dans Terex pour recevoir vos USDT."
          },
          {
            text: "Compte Exchange (Binance, Coinbase)",
            solution: "Pour créer un compte Exchange:\n\n1. Binance (recommandé):\n- Inscrivez-vous sur binance.com\n- Vérifiez votre email et téléphone\n- Complétez la vérification d'identité (KYC)\n- Allez dans Wallet > Fiat and Spot > USDT > Deposit\n- Choisissez le réseau TRC20 (frais bas)\n- Copiez l'adresse de dépôt\n\n2. Coinbase:\n- Inscrivez-vous sur coinbase.com\n- Vérifiez votre identité\n- Allez dans Portfolio > USDT > Receive\n- Copiez l'adresse\n\nSur Terex, vous pouvez aussi simplement entrer votre email Binance (Binance Pay) au lieu d'une adresse wallet."
          },
          {
            text: "Je ne sais pas, conseillez-moi",
            solution: "Pour débuter, nous recommandons:\n\n🥇 Binance (si vous voulez trader)\n- Plateforme complète et sécurisée\n- Facile à utiliser\n- Sur Terex, entrez simplement votre email Binance\n- Application mobile excellente\n\n🥈 Trust Wallet (si vous voulez juste garder vos USDT)\n- Simple et sécurisé\n- Vous contrôlez vos clés\n- Pas besoin de vérification d'identité\n- Totalement gratuit\n\nPour Binance: inscrivez-vous sur binance.com\nPour Trust Wallet: téléchargez l'app depuis votre store\n\nBesoin d'aide ? Contactez-nous sur WhatsApp: +1 4182619091"
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
            solution: "Une différence importante n'est pas normale. Contactez immédiatement notre support:\n• WhatsApp: +1 4182619091\n• Préparez: votre numéro de commande, le montant payé, le montant reçu\n• Nous vérifierons et corrigerons si erreur\n\nNous répondons en moins de 30 minutes."
          },
          {
            text: "Je ne comprends pas le calcul",
            solution: "Voici comment calculer ce que vous devez recevoir:\n\nExemple: Vous payez 100 000 FCFA\n1. Taux du jour: 1 USDT = 620 FCFA\n2. Montant avant frais: 100 000 / 620 = 161.29 USDT\n3. Frais de service (~1.5%): 2.42 USDT\n4. Vous recevez: ~158.87 USDT\n\nLe calcul exact avec le taux appliqué est dans votre email de confirmation. Pour vérifier, contactez-nous sur WhatsApp: +1 4182619091"
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
            solution: "Créer un compte est simple et rapide:\n1. Allez sur terangaexchange.com\n2. Cliquez sur 'S'inscrire'\n3. Entrez votre email et créez un mot de passe\n4. Confirmez votre email via le lien reçu\n5. Complétez votre profil\n\nVotre mot de passe doit contenir au moins 8 caractères. Conservez-le en lieu sûr."
          },
          {
            text: "Je ne reçois pas l'email de connexion",
            solution: "Si vous ne recevez pas l'email de confirmation:\n• Vérifiez vos spams/courriers indésirables\n• Attendez 5 minutes (l'email peut prendre du temps)\n• Vérifiez que vous avez bien entré votre email\n• Ajoutez noreply@terangaexchange.com à vos contacts\n\nToujours rien ? Contactez-nous sur WhatsApp: +1 4182619091"
          },
          {
            text: "J'ai oublié mon mot de passe",
            solution: "Pour réinitialiser votre mot de passe:\n1. Allez sur terangaexchange.com\n2. Cliquez sur 'Se connecter'\n3. Cliquez sur 'Mot de passe oublié'\n4. Entrez votre email\n5. Suivez le lien reçu pour créer un nouveau mot de passe\n\nLe lien de réinitialisation expire après 1 heure."
          },
          {
            text: "Mon compte est bloqué",
            solution: "Si votre compte est bloqué, cela peut être dû à:\n• Activité suspecte détectée\n• Problème de vérification KYC\n• Tentatives de connexion multiples\n\nContactez immédiatement notre support:\n• WhatsApp: +1 4182619091\n• Email: terangaexchange@gmail.com\n• Indiquez votre email de compte\n\nNous traiterons votre cas en priorité."
          }
        ]
      },
      {
        id: "buy-wallet-address-issue",
        question: "Quel problème rencontrez-vous avec l'adresse wallet ?",
        answers: [
          {
            text: "L'adresse est refusée / marquée comme invalide",
            solution: "Vérifications à faire:\n✅ Adresse complète copiée (aucun caractère manquant)\n✅ Pas d'espaces avant/après l'adresse\n✅ Format correct selon le réseau:\n  • TRC20: commence par 'T' (34 caractères)\n  • ERC20: commence par '0x' (42 caractères)\n  • BEP20: commence par '0x' (42 caractères)\n\nAstuce: Ne tapez jamais l'adresse manuellement, utilisez toujours le copier-coller depuis votre wallet.\n\nToujours invalide ? Envoyez-nous l'adresse sur WhatsApp: +1 4182619091"
          },
          {
            text: "Je ne sais pas où trouver mon adresse wallet",
            solution: "Où trouver votre adresse selon votre wallet:\n\n📱 Trust Wallet:\nOuvrez l'app > Sélectionnez 'USDT' > Appuyez sur 'Receive' > Copiez l'adresse\n\n🔶 Binance:\nOuvrez l'app > Wallet > Fiat and Spot > Cherchez USDT > Deposit > Choisissez le réseau > Copiez l'adresse\n(Ou utilisez simplement votre email Binance sur Terex !)\n\n🌐 Coinbase:\nOuvrez l'app > Portfolio > USDT > Receive > Copiez l'adresse"
          },
          {
            text: "J'ai plusieurs adresses, laquelle utiliser ?",
            solution: "Si vous avez plusieurs adresses:\n\n1️⃣ Vérifiez le RÉSEAU:\n• Choisissez l'adresse correspondant au réseau sélectionné sur Terex\n• TRC20 ≠ ERC20 ≠ BEP20 (ce sont des adresses différentes !)\n\n2️⃣ RECOMMANDATION:\n• Utilisez TRC20 (Tron) pour les frais les plus bas\n• Les transferts TRC20 coûtent environ 1-2 USDT de frais réseau\n• ERC20 peut coûter 10-50 USDT de frais\n\n3️⃣ IMPORTANT:\n• Ne mélangez jamais les réseaux\n\nConfus ? Contactez-nous: +1 4182619091"
          }
        ]
      },
      {
        id: "buy-amount-limits",
        question: "Que souhaitez-vous faire ?",
        answers: [
          {
            text: "J'ai besoin d'acheter moins que le minimum",
            solution: "Le minimum est de 5 000 FCFA pour des raisons de frais de traitement.\n\nPourquoi ce minimum ?\n• Frais de traitement des paiements\n• Frais réseau blockchain\n• Coûts opérationnels\n\nLes petits montants rendent les frais proportionnellement élevés."
          },
          {
            text: "J'ai besoin d'acheter plus que le maximum (5M FCFA)",
            solution: "Pour les gros volumes (> 5 000 000 FCFA):\n\n✅ OPTION 1: Transactions multiples\n• Faites plusieurs transactions de 5M FCFA\n• Espacez-les de quelques heures\n\n✅ OPTION 2: Transaction VIP (recommandé)\n• Contactez-nous sur WhatsApp: +1 4182619091\n• Nous offrons:\n  - Meilleurs taux pour gros volumes\n  - Traitement prioritaire\n  - Frais réduits\n\n💎 Avantages VIP:\n• À partir de 10M FCFA: -0.5% de frais\n• À partir de 50M FCFA: -1% de frais"
          },
          {
            text: "Je ne comprends pas comment est calculé le montant",
            solution: "Calcul simple:\n\n📊 Formule:\nMontant FCFA ÷ Taux USDT = USDT reçus (avant frais)\n\n📝 Exemple:\nVous voulez acheter pour 500 000 FCFA\n• Taux du jour: 1 USDT = 620 FCFA\n• Calcul: 500 000 ÷ 620 = 806.45 USDT\n• Frais (1.5%): 12.10 USDT\n• Total reçu: ~794.35 USDT\n\n💡 Bon à savoir:\n• Le taux change légèrement chaque minute\n• Le taux est bloqué quand vous créez votre commande\n• Vous avez 30 min pour payer au taux bloqué"
          }
        ]
      },
      {
        id: "buy-network-help",
        question: "Quelle information vous manque sur les réseaux ?",
        answers: [
          {
            text: "C'est quoi TRC20, ERC20, BEP20 ?",
            solution: "Les réseaux blockchain expliqués simplement:\n\n🔷 TRC20 (Tron) - RECOMMANDÉ\n• Frais très bas: ~1-2 USDT\n• Rapide: 1-3 minutes\n• Très populaire en Afrique\n• Adresse commence par 'T'\n\n🔶 ERC20 (Ethereum)\n• Frais élevés: 10-50 USDT\n• Lent: 5-30 minutes\n• Le plus ancien et sécurisé\n• Adresse commence par '0x'\n\n🟡 BEP20 (Binance Smart Chain)\n• Frais moyens: 0.50-2 USDT\n• Rapide: 1-5 minutes\n• Idéal si vous utilisez Binance\n• Adresse commence par '0x'\n\n💡 Pour 99% des cas: Choisissez TRC20 !"
          },
          {
            text: "Comment savoir quel réseau utilise mon wallet ?",
            solution: "Pour identifier le réseau de votre wallet:\n\n📱 Dans votre app wallet:\n1. Allez dans 'Receive' ou 'Deposit' pour USDT\n2. Vous verrez une liste de réseaux disponibles\n3. Sélectionnez le réseau souhaité\n4. L'adresse affichée correspond à ce réseau\n\n🔍 Reconnaître le réseau par l'adresse:\n• Commence par 'T' + 33 caractères = TRC20\n• Commence par '0x' + 40 caractères = ERC20 ou BEP20\n\n⚠️ ATTENTION:\nUne même adresse '0x...' peut être valide sur ERC20 ET BEP20.\nVérifiez toujours quel réseau vous avez sélectionné dans votre wallet !\n\n🆘 Besoin d'aide ? WhatsApp: +1 4182619091"
          },
          {
            text: "Que se passe-t-il si je me trompe de réseau ?",
            solution: "⚠️ ERREUR DE RÉSEAU = RISQUE DE PERTE\n\nSi vous indiquez le mauvais réseau:\n❌ Les USDT peuvent ne pas arriver\n❌ Ils peuvent être perdus définitivement\n\n🛡️ COMMENT ÉVITER:\n✅ Vérifiez 3 fois le réseau avant de valider\n✅ Le réseau sur Terex DOIT correspondre à celui de votre wallet\n✅ En cas de doute, demandez-nous sur WhatsApp\n\n🚨 SI ERREUR DÉJÀ FAITE:\nContactez immédiatement WhatsApp: +1 4182619091\nPréparez: adresse, réseau sélectionné, numéro de commande\n\n💡 Conseil: Utilisez toujours TRC20, c'est le plus simple et le moins cher !"
          }
        ]
      },
      {
        id: "buy-not-received",
        question: "Depuis combien de temps avez-vous payé ?",
        answers: [
          {
            text: "Moins de 15 minutes",
            solution: "Le traitement est automatique et prend généralement 5-15 minutes après confirmation de votre paiement Wave/Orange Money. Vos USDT sont envoyés automatiquement dès que le paiement est confirmé. Patientez encore un peu, vous recevrez une notification."
          },
          {
            text: "Entre 15 et 60 minutes",
            solution: "Vérifiez dans votre tableau de bord > Historique des transactions si le statut de votre commande a changé. Si votre paiement Wave/Orange Money a bien été prélevé, nos systèmes traiteront automatiquement l'envoi. Si le délai dépasse 1 heure, contactez-nous sur WhatsApp au +1 4182619091 avec votre numéro de commande."
          },
          {
            text: "Plus d'1 heure",
            solution: "Ce délai est anormal. Contactez immédiatement notre support sur WhatsApp au +1 4182619091 avec:\n• Votre numéro de commande\n• Confirmation du prélèvement sur votre Wave/Orange Money\n\nNous traiterons votre cas en priorité."
          },
          {
            text: "Le paiement n'a pas été prélevé",
            solution: "Si le montant n'a pas été prélevé de votre Wave/Orange Money:\n• La transaction a peut-être échoué côté opérateur\n• Vérifiez votre solde Wave/Orange Money\n• Vérifiez que vous avez bien validé le paiement sur votre téléphone\n\nVous pouvez recréer une commande et réessayer. Si le problème persiste, contactez-nous sur WhatsApp: +1 4182619091"
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
            solution: "Le montant doit être entre 5 000 FCFA et 5 000 000 FCFA. Vérifiez que vous avez entré un nombre valide sans espaces ni caractères spéciaux."
          },
          {
            text: "Erreur lors du paiement Wave/Orange Money",
            solution: "Si le paiement échoue:\n• Vérifiez que votre solde est suffisant\n• Vérifiez que votre compte Wave/Orange Money est actif\n• Assurez-vous d'avoir validé la demande de paiement sur votre téléphone\n• Pour Orange Money: vérifiez que les paiements marchands sont activés (#144#)\n• Réessayez après quelques minutes\n\nSi le problème persiste, contactez-nous sur WhatsApp: +1 4182619091"
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
            solution: "Processus de vente en 5 étapes:\n\n1️⃣ Créez votre commande de vente\n• Indiquez combien d'USDT vous voulez vendre\n• Choisissez votre méthode de réception (Orange Money ou Wave)\n• Entrez votre numéro de téléphone\n\n2️⃣ Nous générons une adresse unique\n• Vous recevez une adresse Terex pour envoyer vos USDT\n• Cette adresse est valide 2 heures\n\n3️⃣ Envoyez vos USDT\n• Depuis votre wallet vers notre adresse\n• Réseau exact (TRC20 recommandé)\n\n4️⃣ Confirmez avec le hash de transaction\n• Collez le hash dans votre tableau de bord\n\n5️⃣ Vous recevez votre argent\n• Directement sur votre Orange Money ou Wave\n• En 10-30 minutes après vérification"
          },
          {
            text: "Quels sont les frais de vente ?",
            solution: "Structure des frais transparente:\n\n💰 Frais de service: 1-2%\n• Inclus dans le taux affiché\n\n📊 Exemple pour 100 USDT:\n• Taux: 1 USDT = 620 FCFA\n• Valeur: 100 × 620 = 62 000 FCFA\n• Frais (1.5%): 930 FCFA\n• Vous recevez: 61 070 FCFA\n\n⚡ Frais réseau (blockchain):\n• Payés par vous lors de l'envoi depuis votre wallet\n• TRC20: ~1-2 USDT\n• ERC20: ~10-50 USDT\n• BEP20: ~0.5-2 USDT\n\n💡 ASTUCE: Utilisez TRC20 pour minimiser les frais !"
          },
          {
            text: "Combien de temps prend une vente ?",
            solution: "⏱️ Délais de traitement:\n\n🚀 Réseau blockchain:\n• TRC20: 1-5 minutes\n• BEP20: 3-10 minutes\n• ERC20: 5-30 minutes\n\n✅ Vérification Terex: 2-5 minutes\n\n💸 Paiement vers vous:\n• Orange Money: instantané à 5 minutes\n• Wave: instantané à 5 minutes\n\n📱 Total moyen:\n• TRC20: 10-20 minutes\n• BEP20: 15-30 minutes\n• ERC20: 20-45 minutes\n\nPour accélérer: utilisez TRC20 et confirmez immédiatement avec le hash !"
          },
          {
            text: "Quelle est la limite de vente ?",
            solution: "💵 Limites de vente:\n\n📉 Minimum: 10 USDT (~6 000-7 000 FCFA)\n📈 Maximum: 5 000 USDT par transaction (~3 000 000-3 500 000 FCFA)\n\n🔄 Vous pouvez faire plusieurs ventes par jour.\n\n💎 Gros volumes (>5 000 USDT):\n• Contactez-nous sur WhatsApp: +1 4182619091\n• Meilleurs taux et traitement prioritaire\n\n🎖️ Avec KYC vérifié: limites plus élevées disponibles !"
          }
        ]
      },
      {
        id: "sell-wrong-address",
        question: "Où avez-vous envoyé vos USDT ?",
        answers: [
          {
            text: "J'ai envoyé à une ancienne adresse Terex",
            solution: "⚠️ Chaque commande a une adresse UNIQUE !\n\nSi vous avez envoyé à une ancienne adresse:\n• Vos USDT ne seront pas perdus mais retardés\n• Contactez immédiatement WhatsApp: +1 4182619091\n• Donnez: hash de transaction, ancienne adresse, numéro de commande\n\nRésolution sous 2-6 heures."
          },
          {
            text: "J'ai envoyé sur le mauvais réseau",
            solution: "🚨 Envoi sur mauvais réseau:\n• Récupération possible mais complexe\n• Peut prendre 24-72 heures\n• Frais de récupération: 20-50 USDT\n\n🆘 Contactez immédiatement WhatsApp: +1 4182619091\nFournissez: hash de transaction, réseau utilisé vs réseau demandé, montant envoyé\n\n🛡️ Prévention: Vérifiez 3 fois le réseau avant d'envoyer !"
          },
          {
            text: "J'ai envoyé à mon propre wallet par erreur",
            solution: "✅ Bonne nouvelle: Vos USDT sont en sécurité dans votre wallet !\n\nMarche à suivre:\n1. Vérifiez que les USDT sont dans votre wallet\n2. Retournez sur Terex\n3. Trouvez votre commande de vente\n4. Copiez la bonne adresse Terex\n5. Renvoyez les USDT vers cette adresse\n6. Confirmez avec le hash\n\n⏱️ Si la commande a expiré (après 2h), créez-en une nouvelle."
          },
          {
            text: "J'ai envoyé à une adresse inconnue",
            solution: "🆘 Situation critique:\n\nLes transactions blockchain sont IRRÉVERSIBLES. Si l'adresse n'appartient ni à Terex ni à vous, les USDT sont malheureusement perdus.\n\n🔍 Vérification urgente:\n1. Trouvez votre hash de transaction\n2. Vérifiez sur tronscan.org (TRC20), etherscan.io (ERC20) ou bscscan.com (BEP20)\n3. Vérifiez l'adresse de destination\n\nSi l'adresse appartient à Terex, contactez-nous: +1 4182619091\n\n🛡️ Leçon: Toujours vérifier l'adresse 3 fois, utiliser le copier-coller !"
          }
        ]
      },
      {
        id: "sell-wrong-amount",
        question: "Le montant reçu diffère de combien ?",
        answers: [
          {
            text: "Petite différence (moins de 5%)",
            solution: "Les variations normales sont dues à:\n• Frais de service (1-2%)\n• Variation du taux entre commande et paiement\n• Arrondi des montants\n\nVérifiez votre email de confirmation pour le calcul exact. Toujours confus ? WhatsApp: +1 4182619091"
          },
          {
            text: "Grosse différence (plus de 10%)",
            solution: "🚨 Ce n'est pas normal !\n\nContactez immédiatement WhatsApp: +1 4182619091 avec:\n• Numéro de commande\n• USDT envoyés (vérifiez sur blockchain)\n• FCFA reçus\n\nRéponse en moins de 30 minutes. Remboursement de la différence sous 2-6 heures si erreur confirmée."
          },
          {
            text: "J'ai reçu plus que prévu",
            solution: "🎉 Bonne surprise ! Cela peut être dû à:\n• Taux favorable entre commande et paiement\n• Arrondi commercial en votre faveur\n\nCe n'est pas une erreur à rembourser. Profitez-en !"
          }
        ]
      },
      {
        id: "sell-create-issue",
        question: "Quel est le problème lors de la création de votre commande de vente ?",
        answers: [
          {
            text: "Je ne peux pas entrer mon numéro de téléphone",
            solution: "Entrez votre numéro au format international sans le '+' (exemple: 221773972749 pour le Sénégal). Le numéro doit correspondre à votre compte Orange Money ou Wave."
          },
          {
            text: "Le montant minimum/maximum me bloque",
            solution: "Minimum: 10 USDT | Maximum: 5 000 USDT par transaction.\n\nPour vendre plus, contactez-nous sur WhatsApp au +1 4182619091 pour une transaction de gros volume."
          },
          {
            text: "Je ne vois pas ma méthode de réception",
            solution: "Nous supportons Orange Money et Wave. Assurez-vous que votre numéro est enregistré sur l'un de ces services. Pour d'autres méthodes, contactez-nous sur WhatsApp: +1 4182619091"
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
            solution: "Les instructions sont dans votre email et dans votre tableau de bord > Historique des transactions. Vous devez envoyer vos USDT à l'adresse Terex fournie avec le réseau exact (TRC20 recommandé) et le montant exact."
          }
        ]
      },
      {
        id: "sell-send-instructions",
        question: "Quelle application utilisez-vous pour envoyer vos USDT ?",
        answers: [
          {
            text: "Binance",
            solution: "Sur Binance:\n1. Allez dans 'Wallet' > 'Fiat and Spot'\n2. Cherchez 'USDT' et cliquez sur 'Withdraw'\n3. Collez l'adresse Terex fournie\n4. Sélectionnez le réseau exact comme indiqué (TRC20 recommandé)\n5. Entrez le montant exact\n6. Confirmez et envoyez\n7. Copiez le hash de transaction et collez-le dans votre tableau de bord Terex"
          },
          {
            text: "Trust Wallet",
            solution: "Sur Trust Wallet:\n1. Ouvrez l'app et sélectionnez 'USDT'\n2. Cliquez sur 'Send'\n3. Collez l'adresse Terex fournie\n4. Entrez le montant exact\n5. Vérifiez le réseau\n6. Confirmez et envoyez\n7. Copiez le hash et collez-le dans votre tableau de bord Terex"
          },
          {
            text: "Autre wallet",
            solution: "Depuis votre wallet:\n1. Trouvez votre USDT\n2. Sélectionnez 'Envoyer' ou 'Send'\n3. Collez l'adresse Terex fournie\n4. Sélectionnez le même réseau que dans vos instructions\n5. Entrez le montant exact\n6. Envoyez et récupérez le hash de transaction\n7. Collez le hash dans votre tableau de bord Terex"
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
            solution: "Le hash (ou TxID) est le numéro de confirmation de votre transaction blockchain. Après avoir envoyé vos USDT, votre wallet vous montre ce numéro (une longue série de chiffres et lettres). Copiez-le et collez-le dans votre tableau de bord Terex > Historique > Votre commande. Cela nous permet de vérifier rapidement votre transaction."
          },
          {
            text: "Je ne trouve pas le hash",
            solution: "Le hash se trouve dans l'historique de transactions de votre wallet. Cherchez la transaction que vous venez d'effectuer et cliquez dessus pour voir les détails ('Transaction ID', 'TxID' ou 'Hash'). Si introuvable, contactez-nous sur WhatsApp au +1 4182619091."
          }
        ]
      },
      {
        id: "sell-delay",
        question: "Depuis combien de temps avez-vous confirmé l'envoi ?",
        answers: [
          {
            text: "Moins de 30 minutes",
            solution: "Le traitement prend généralement 10-30 minutes après vérification sur la blockchain. Patientez encore un peu. Vous recevrez votre paiement Orange Money/Wave dès confirmation."
          },
          {
            text: "Entre 30 minutes et 2 heures",
            solution: "Vérifiez que le hash est bien enregistré dans votre tableau de bord. Si c'est fait, notre équipe vérifie. Si le délai dépasse 2 heures, contactez-nous sur WhatsApp au +1 4182619091."
          },
          {
            text: "Plus de 2 heures",
            solution: "Ce délai est anormal. Contactez immédiatement notre support sur WhatsApp au +1 4182619091 avec votre numéro de commande et le hash de transaction."
          }
        ]
      },
      {
        id: "sell-error",
        question: "Quel type d'erreur rencontrez-vous ?",
        answers: [
          {
            text: "Erreur 'Invalid address' lors de l'envoi",
            solution: "Vérifiez que vous avez copié TOUTE l'adresse Terex sans espaces. Vérifiez aussi que vous avez sélectionné le bon réseau (le même que dans vos instructions). Ne tentez jamais d'envoyer sur un réseau différent."
          },
          {
            text: "Erreur 'Insufficient balance'",
            solution: "Votre wallet n'a pas assez de USDT ou pas assez de frais réseau. Assurez-vous d'avoir des frais pour la transaction (TRX pour TRC20, ETH pour ERC20, BNB pour BEP20)."
          },
          {
            text: "Transaction bloquée / en attente",
            solution: "Les transactions blockchain peuvent prendre du temps. TRC20: 1-5 min, BEP20: 3-10 min, ERC20: 5-30 min. Si confirmée sur la blockchain, elle arrivera. Patientez ou contactez-nous sur WhatsApp."
          },
          {
            text: "Autre erreur",
            solution: "Prenez une capture d'écran et contactez-nous sur WhatsApp au +1 4182619091 avec votre numéro de commande."
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
            text: "Je ne comprends pas comment fonctionnent les transferts",
            solution: "Le transfert international Terex, c'est simple:\n\n1️⃣ Choisissez le pays de destination\n2️⃣ Entrez les infos du destinataire (nom, numéro Orange Money/Wave)\n3️⃣ Indiquez le montant à envoyer en FCFA\n4️⃣ Validez — vous êtes redirigé vers Wave ou Orange Money pour payer\n5️⃣ Le paiement est prélevé automatiquement\n6️⃣ Le destinataire reçoit l'argent sur son Orange Money/Wave\n\nTout est automatisé ! Délai moyen: 15-60 minutes.\nFrais: 1-3% selon le montant et la destination."
          },
          {
            text: "Je n'arrive pas à créer mon transfert",
            nextQuestionId: "transfer-create-issue"
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
            solution: "Nous supportons les transferts vers la majorité des pays d'Afrique de l'Ouest et Centrale. Si vous ne voyez pas votre pays, contactez-nous sur WhatsApp au +1 4182619091 pour vérifier la disponibilité."
          },
          {
            text: "Je ne peux pas entrer les informations du destinataire",
            solution: "Assurez-vous d'avoir: nom complet du destinataire et numéro de téléphone Orange Money ou Wave. Le numéro doit être au format international sans le '+' (exemple: 225XXXXXXXX pour la Côte d'Ivoire)."
          },
          {
            text: "Le montant minimum/maximum me bloque",
            solution: "Minimum: 5 000 FCFA | Maximum: 2 000 000 FCFA par transfert.\n\nPour des montants plus élevés, contactez-nous sur WhatsApp au +1 4182619091."
          }
        ]
      },
      {
        id: "transfer-not-received",
        question: "Votre paiement Wave/Orange Money a-t-il bien été prélevé ?",
        answers: [
          {
            text: "Oui, j'ai été débité",
            nextQuestionId: "transfer-delay"
          },
          {
            text: "Non, le paiement n'a pas été prélevé",
            solution: "Si le montant n'a pas été prélevé:\n• La transaction a peut-être échoué côté opérateur\n• Vérifiez votre solde Wave/Orange Money\n• Assurez-vous d'avoir validé le paiement sur votre téléphone\n\nVous pouvez recréer un transfert et réessayer. Si le problème persiste: WhatsApp +1 4182619091"
          }
        ]
      },
      {
        id: "transfer-delay",
        question: "Depuis combien de temps avez-vous payé ?",
        answers: [
          {
            text: "Moins d'1 heure",
            solution: "Le transfert international prend généralement 15-60 minutes. Le destinataire recevra une notification Orange Money/Wave dès réception. Patientez encore un peu."
          },
          {
            text: "Entre 1 et 2 heures",
            solution: "Le délai est un peu long. Vérifiez avec le destinataire s'il a reçu une notification. Si rien après 2 heures, contactez-nous sur WhatsApp au +1 4182619091 avec votre numéro de transfert."
          },
          {
            text: "Plus de 2 heures",
            solution: "Ce délai est anormal. Contactez immédiatement notre support sur WhatsApp au +1 4182619091 avec votre numéro de transfert et la confirmation du prélèvement."
          }
        ]
      },
      {
        id: "transfer-error",
        question: "Quel type d'erreur voyez-vous ?",
        answers: [
          {
            text: "Erreur 'Numéro de destinataire invalide'",
            solution: "Vérifiez que le numéro du destinataire est correct et au format international sans le '+'. Assurez-vous que le destinataire a un compte Orange Money ou Wave actif dans son pays."
          },
          {
            text: "Erreur 'Pays non supporté'",
            solution: "Nous élargissons constamment notre couverture. Contactez-nous sur WhatsApp au +1 4182619091 pour vérifier si nous pouvons traiter votre transfert."
          },
          {
            text: "Erreur lors du paiement",
            solution: "Si le paiement Wave/Orange Money échoue:\n• Vérifiez votre solde\n• Assurez-vous d'avoir validé sur votre téléphone\n• Pour Orange Money: activez les paiements marchands (#144#)\n• Réessayez après quelques minutes\n\nSi le problème persiste: WhatsApp +1 4182619091"
          },
          {
            text: "Autre erreur",
            solution: "Prenez une capture d'écran et contactez-nous sur WhatsApp au +1 4182619091. Notre équipe vous aidera rapidement."
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
            solution: "Raisons possibles:\n• Activité suspecte détectée\n• Échec de vérification KYC\n• Violation des conditions d'utilisation\n\nContactez WhatsApp: +1 4182619091 avec:\n• Votre email de compte\n• Pièce d'identité\n\nRéponse sous 1-4 heures. Déblocage sous 24-48h si tout est en ordre."
          },
          {
            text: "Je ne peux plus créer de commandes",
            solution: "Causes fréquentes:\n\n1️⃣ KYC non vérifié → Complétez la vérification\n2️⃣ Limite atteinte → Attendez 24h ou complétez le KYC\n3️⃣ Commande en cours → Complétez ou attendez l'expiration\n4️⃣ Problème technique → Videz le cache, reconnectez-vous\n\nToujours bloqué ? WhatsApp: +1 4182619091"
          },
          {
            text: "Mes transactions sont toujours refusées",
            solution: "Vérifiez:\n1️⃣ Statut KYC (en attente/rejeté ?)\n2️⃣ Limites (sans KYC: limites réduites)\n3️⃣ Méthode de paiement (Wave/Orange Money actif et chargé ?)\n4️⃣ Trop de transactions rapprochées → Espacez-les\n\nContactez support: +1 4182619091 pour déblocage."
          }
        ]
      },
      {
        id: "security-issue",
        question: "Quel est votre problème de sécurité ?",
        answers: [
          {
            text: "Je pense que mon compte a été piraté",
            solution: "🚨 Actions immédiates:\n\n1️⃣ Sécurisez votre email (changez le mot de passe, activez 2FA)\n2️⃣ Contactez-nous URGENCE WhatsApp: +1 4182619091 → Nous bloquerons le compte immédiatement\n3️⃣ Vérifiez l'historique des transactions\n\nNotre réponse:\n• Blocage immédiat: <10 minutes\n• Enquête: 2-4 heures\n• Restauration: 24-48 heures\n• Remboursement si fraude prouvée"
          },
          {
            text: "J'ai reçu un email ou SMS suspect",
            solution: "⚠️ Tentative de phishing possible !\n\nEmails légitimes Terex:\n• Envoyés depuis @terangaexchange.com\n• Ne demandent JAMAIS votre mot de passe ou codes PIN\n\nQue faire:\n1. NE CLIQUEZ PAS sur les liens suspects\n2. NE DONNEZ AUCUNE information\n3. Supprimez l'email/SMS\n4. Signalez sur WhatsApp: +1 4182619091\n\nEn cas de doute, contactez-nous directement."
          },
          {
            text: "Je veux renforcer la sécurité de mon compte",
            solution: "Mesures recommandées:\n\n✅ Utilisez un email sécurisé (Gmail, Outlook) avec 2FA activée\n✅ Complétez la vérification KYC\n✅ Utilisez un mot de passe fort et unique\n✅ Déconnectez-vous après chaque session\n✅ N'utilisez pas de WiFi public\n✅ Vérifiez toujours l'URL: terangaexchange.com\n✅ Ne partagez jamais vos accès\n\nEn cas de doute: WhatsApp +1 4182619091"
          }
        ]
      },
      {
        id: "delete-account",
        question: "Pourquoi souhaitez-vous supprimer votre compte ?",
        answers: [
          {
            text: "Je n'utilise plus le service",
            solution: "Avant de supprimer:\n• Votre compte reste gratuit même inactif\n• Votre KYC sera perdu (à refaire si vous revenez)\n• Historique supprimé définitivement\n\nSi vous êtes sûr:\n1. Aucune transaction en cours\n2. Email à: terangaexchange@gmail.com (Objet: 'Suppression de compte')\n3. Indiquez votre email et raison\n4. Pièce d'identité pour confirmation\n\nDélai: vérification 24-48h, suppression sous 7 jours."
          },
          {
            text: "J'ai eu une mauvaise expérience",
            solution: "Nous sommes désolés ! Avant de supprimer, donnez-nous une chance:\n• WhatsApp: +1 4182619091\n• Décrivez votre problème\n• Compensation possible selon le cas\n\nSi suppression maintenue: email à support@terex.sn avec 'Suppression compte' en objet."
          },
          {
            text: "Je veux créer un nouveau compte",
            solution: "Ce n'est généralement pas nécessaire ! Nous pouvons mettre à jour:\n• Email de connexion\n• Numéro de téléphone\n• Informations personnelles\n\nContactez-nous: +1 4182619091\n\n⚠️ Créer un 2ème compte viole nos conditions et risque de bloquer les deux comptes."
          }
        ]
      },
      {
        id: "change-info",
        question: "Quelle information voulez-vous changer ?",
        answers: [
          {
            text: "Mon adresse email de connexion",
            solution: "Procédure:\n1. Contactez support@terex.sn ou WhatsApp: +1 4182619091\n2. Indiquez email actuel + nouvel email\n3. Joindre pièce d'identité\n4. Vérification: 2-6 heures\n\nTout l'historique et le KYC sont préservés."
          },
          {
            text: "Mon numéro de téléphone",
            solution: "Facile à faire:\n1. Connectez-vous > Profil > Informations personnelles\n2. Modifiez le numéro\n3. Sauvegardez\n\nSi problème: WhatsApp +1 4182619091, on le changera manuellement.\n\n⚠️ Vérifiez que le nouveau numéro a Orange Money ou Wave actif."
          },
          {
            text: "Mon nom ou informations personnelles",
            solution: "Infos modifiables dans Profil: nom d'affichage, téléphone, pays, langue.\n\nInfos KYC (nom légal, date de naissance): nécessitent validation manuelle.\n→ Email à support@terex.sn avec nouvelle pièce d'identité\n→ Délai: 24-72 heures"
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
            solution: "Les liens expirent après 1 heure. Demandez un nouveau lien. Si le problème persiste, vérifiez que vous utilisez le même navigateur et videz votre cache."
          },
          {
            text: "J'ai oublié mon email de connexion",
            solution: "Essayez tous les emails que vous utilisez habituellement. Si introuvable, contactez-nous sur WhatsApp au +1 4182619091 avec votre nom et numéro de téléphone utilisé pour les transactions."
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
            solution: "Vérifiez votre dossier spam/courriers indésirables. Ajoutez noreply@terex.sn à vos contacts pour recevoir nos emails. Si toujours rien, demandez un nouveau lien."
          }
        ]
      },
      {
        id: "email-wait",
        question: "Depuis combien de temps avez-vous demandé le lien ?",
        answers: [
          {
            text: "Moins de 5 minutes",
            solution: "L'email peut prendre jusqu'à 5 minutes. Patientez et vérifiez vos spams. Si rien après 5 minutes, demandez un nouveau lien."
          },
          {
            text: "Plus de 5 minutes",
            solution: "Vérifiez que vous avez entré la bonne adresse email. Essayez avec un autre navigateur. Si le problème persiste, contactez-nous sur WhatsApp au +1 4182619091."
          }
        ]
      },
      {
        id: "kyc-issue",
        question: "Quel est votre problème avec la vérification KYC ?",
        answers: [
          {
            text: "Je ne peux pas télécharger mes documents",
            solution: "Assurez-vous que vos documents sont au format JPG, PNG ou PDF et font moins de 5MB. Prenez de nouvelles photos si elles sont floues. Si le problème persiste: WhatsApp +1 4182619091"
          },
          {
            text: "Ma vérification KYC a été rejetée",
            nextQuestionId: "kyc-rejected"
          },
          {
            text: "Ma vérification KYC prend trop de temps",
            solution: "La vérification KYC prend généralement 24-48 heures. Si votre demande date de plus de 48 heures, contactez-nous sur WhatsApp au +1 4182619091."
          },
          {
            text: "Je ne comprends pas quels documents fournir",
            solution: "Documents requis:\n1. Photo de votre pièce d'identité (CNI, passeport, permis)\n2. Selfie de vous tenant votre pièce d'identité\n3. Éventuellement un justificatif de domicile de moins de 3 mois\n\nAssurez-vous que les photos sont claires et lisibles."
          }
        ]
      },
      {
        id: "kyc-rejected",
        question: "Avez-vous reçu un email expliquant le rejet ?",
        answers: [
          {
            text: "Oui, je comprends pourquoi",
            solution: "Corrigez les problèmes mentionnés (photo floue, documents expirés, etc.) et soumettez à nouveau. Questions ? WhatsApp: +1 4182619091"
          },
          {
            text: "Oui, mais je ne comprends pas",
            solution: "Contactez-nous sur WhatsApp au +1 4182619091 avec la référence de votre demande KYC. Nous vous expliquerons en détail."
          },
          {
            text: "Non, je n'ai pas reçu d'email",
            solution: "Vérifiez vos spams. Sinon, connectez-vous à votre tableau de bord pour voir le statut KYC. Pour plus de détails: WhatsApp +1 4182619091"
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
