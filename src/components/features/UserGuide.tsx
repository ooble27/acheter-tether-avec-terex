
import { ArrowLeft, Shield, AlertTriangle, CheckCircle2 } from 'lucide-react';

// Real screenshots
import guideLogin from '@/assets/guide-login.jpeg';
import guideSignup from '@/assets/guide-signup.jpeg';
import guideBuyUsdt from '@/assets/dashboard-buy-usdt.jpeg';
import guideDestination from '@/assets/guide-destination.jpeg';
import guideWalletAddress from '@/assets/guide-wallet-address.jpeg';
import guideConfirmOrder from '@/assets/guide-confirm-order.jpeg';
import guideNaboopayCheckout from '@/assets/guide-naboopay-checkout.jpeg';
import guideNaboopaySummary from '@/assets/guide-naboopay-summary.jpeg';
import guideWaveConfirm from '@/assets/guide-wave-confirm.jpeg';
import guideTransactionDetails from '@/assets/guide-transaction-details.jpeg';
import guideSellUsdt from '@/assets/guide-sell-usdt.jpeg';
import dashboardPreview from '@/assets/dashboard-preview.jpeg';

interface UserGuideProps {
  onBack: () => void;
}

const StepNumber = ({ n }: { n: number | string }) => (
  <div className="w-7 h-7 rounded-full bg-terex-accent text-black flex items-center justify-center text-xs font-bold flex-shrink-0">
    {n}
  </div>
);

const Screenshot = ({ src, alt, caption }: { src: string; alt: string; caption?: string }) => (
  <div className="my-4">
    <div className="rounded-xl overflow-hidden border border-white/10">
      <img src={src} alt={alt} className="w-full" loading="lazy" />
    </div>
    {caption && <p className="text-white/30 text-[11px] mt-1.5 text-center italic">{caption}</p>}
  </div>
);

const InfoBox = ({ icon: Icon, color, title, children }: { icon: any; color: string; title: string; children: React.ReactNode }) => {
  const colors: Record<string, string> = {
    blue: 'bg-blue-500/10 border-blue-500/20 text-blue-200',
    red: 'bg-red-500/10 border-red-500/20 text-red-200',
    green: 'bg-green-500/10 border-green-500/20 text-green-200',
  };
  const iconColors: Record<string, string> = {
    blue: 'text-blue-400',
    red: 'text-red-400',
    green: 'text-green-400',
  };
  return (
    <div className={`${colors[color]} border rounded-lg p-4 mt-3`}>
      <div className="flex items-start gap-2">
        <Icon className={`w-4 h-4 ${iconColors[color]} mt-0.5 flex-shrink-0`} />
        <div>
          <p className="text-sm font-medium">{title}</p>
          <div className="text-xs mt-1 opacity-70">{children}</div>
        </div>
      </div>
    </div>
  );
};

export function UserGuide({ onBack }: UserGuideProps) {
  return (
    <div className="space-y-8 animate-fade-in max-w-3xl mx-auto">
      {/* Header */}
      <div>
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-white/50 hover:text-white text-sm mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour aux guides
        </button>
        <h1 className="text-2xl sm:text-3xl font-light text-white mb-2">Guide d'utilisation Terex</h1>
        <p className="text-white/40 text-sm">
          Maîtrisez toutes les fonctionnalités étape par étape avec de vraies captures d'écran.
        </p>
      </div>

      {/* Intro */}
      <section className="bg-terex-gray/60 rounded-xl p-5 sm:p-6 border border-white/10">
        <h2 className="text-white font-medium text-lg mb-3">Bienvenue sur Terex</h2>
        <p className="text-white/60 text-sm leading-relaxed mb-4">
          Terex est la plateforme la plus simple pour acheter et vendre des USDT en Afrique de l'Ouest.
          Paiement automatique via Wave et Orange Money grâce à NabooPay, envoi instantané des USDT.
        </p>
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-terex-darker/80 rounded-lg p-3 text-center">
            <p className="text-terex-accent text-sm font-medium">~5 min</p>
            <p className="text-white/40 text-[11px]">Traitement</p>
          </div>
          <div className="bg-terex-darker/80 rounded-lg p-3 text-center">
            <p className="text-terex-accent text-sm font-medium">Automatique</p>
            <p className="text-white/40 text-[11px]">Paiement NabooPay</p>
          </div>
          <div className="bg-terex-darker/80 rounded-lg p-3 text-center">
            <p className="text-terex-accent text-sm font-medium">24/7</p>
            <p className="text-white/40 text-[11px]">Support</p>
          </div>
        </div>
      </section>

      {/* ─── ÉTAPE 1 : CRÉER UN COMPTE ─── */}
      <section className="space-y-4">
        <h2 className="text-white font-medium text-lg flex items-center gap-2">
          <StepNumber n={1} />
          Créer votre compte
        </h2>
        <div className="pl-9 space-y-4 text-sm text-white/60">
          <p>L'inscription se fait avec un email et un mot de passe :</p>
          <ol className="space-y-2 list-decimal list-inside">
            <li>Cliquez sur <span className="text-white">"S'inscrire"</span> depuis la page de connexion</li>
            <li>Entrez votre <span className="text-white">nom complet</span>, votre <span className="text-white">adresse email</span> et un <span className="text-white">mot de passe</span></li>
            <li>Vous pouvez entrer un <span className="text-white">code de parrainage</span> si vous en avez un</li>
            <li>Acceptez les conditions d'utilisation et cliquez sur <span className="text-white">"Continuer"</span></li>
          </ol>

          <Screenshot src={guideSignup} alt="Page d'inscription Terex" caption="Page d'inscription — Nom, email et mot de passe" />

          <p className="mt-2">Pour vous connecter ensuite, entrez simplement votre email et mot de passe :</p>

          <Screenshot src={guideLogin} alt="Page de connexion Terex" caption="Page de connexion — Email et mot de passe" />

          <InfoBox icon={Shield} color="blue" title="Vérification KYC">
            <p>Pour des montants élevés, fournissez : pièce d'identité (CNI/passeport), selfie avec la pièce, et justificatif de domicile. Validation sous 24-48h.</p>
          </InfoBox>
        </div>
      </section>

      <div className="border-t border-dashed border-white/10" />

      {/* ─── ÉTAPE 2 : ACHETER DES USDT ─── */}
      <section className="space-y-4">
        <h2 className="text-white font-medium text-lg flex items-center gap-2">
          <StepNumber n={2} />
          Acheter des USDT — Le processus complet
        </h2>
        <div className="pl-9 space-y-6 text-sm text-white/60">

          {/* 2.1 Montant */}
          <div>
            <p className="text-white/80 font-medium mb-2">2.1 — Entrez le montant en FCFA</p>
            <p>Accédez à <span className="text-white">"Acheter"</span> depuis la barre de navigation. Le convertisseur affiche en temps réel le nombre d'USDT que vous recevrez selon le taux actuel.</p>
            <Screenshot src={guideBuyUsdt} alt="Saisie du montant FCFA" caption="Entrez le montant en CFA — conversion USDT en temps réel" />
          </div>

          {/* 2.2 Destination */}
          <div>
            <p className="text-white/80 font-medium mb-2">2.2 — Choisissez votre destination</p>
            <p>Sélectionnez le réseau blockchain sur lequel vous souhaitez recevoir vos USDT :</p>
            <ul className="space-y-1 mt-2 ml-2">
              <li>• <span className="text-white">TRC20</span> — Réseau Tron (frais les plus bas)</li>
              <li>• <span className="text-white">BEP20</span> — Binance Smart Chain</li>
              <li>• <span className="text-white">ERC20</span> — Réseau Ethereum</li>
              <li>• <span className="text-white">Polygon</span> — Réseau Polygon</li>
              <li>• <span className="text-white">Solana</span> — Réseau Solana</li>
              <li>• <span className="text-white">Aptos</span> — Réseau Aptos</li>
              <li>• <span className="text-white">Binance</span> — Via Binance Pay (email Binance)</li>
            </ul>
            <Screenshot src={guideDestination} alt="Sélection de la destination" caption="Choisissez votre réseau — TRC20, BEP20, Polygon, Solana, etc." />
          </div>

          {/* 2.3 Adresse */}
          <div>
            <p className="text-white/80 font-medium mb-2">2.3 — Entrez votre adresse de réception</p>
            <p>Collez l'adresse de votre wallet correspondant au réseau choisi. <span className="text-white">Vérifiez bien que l'adresse correspond au bon réseau.</span></p>
            <Screenshot src={guideWalletAddress} alt="Saisie de l'adresse wallet" caption="Collez votre adresse de réception — vérifiez 3 fois !" />
          </div>

          {/* 2.4 Confirmation */}
          <div>
            <p className="text-white/80 font-medium mb-2">2.4 — Confirmez votre commande</p>
            <p>Vérifiez le récapitulatif de votre achat : montant en CFA, USDT que vous recevrez, réseau de destination et adresse wallet.</p>
            <Screenshot src={guideConfirmOrder} alt="Confirmation de la commande" caption="Vérifiez les détails — Montant, USDT, destination et adresse" />
          </div>

          {/* 2.5 Paiement NabooPay */}
          <div>
            <p className="text-white/80 font-medium mb-2">2.5 — Paiement automatique via NabooPay</p>
            <p>En cliquant sur <span className="text-white">"Confirmer et payer"</span>, vous êtes redirigé vers la page de paiement sécurisée NabooPay. Choisissez votre méthode de paiement :</p>
            <ul className="space-y-1 mt-2 ml-2">
              <li>• <span className="text-white">Wave</span> — Paiement mobile sécurisé (le plus populaire)</li>
              <li>• <span className="text-white">Orange Money</span> — Scannez le QR code pour payer</li>
            </ul>
            <p className="mt-2">Remplissez vos informations (prénom, nom, numéro de téléphone) et le résumé de la commande s'affiche avec les frais.</p>
            <Screenshot src={guideNaboopayCheckout} alt="Page de paiement NabooPay" caption="NabooPay — Choisissez Wave ou Orange Money" />
            <Screenshot src={guideNaboopaySummary} alt="Résumé et paiement NabooPay" caption="Résumé de la commande — Sous-total, frais et montant total" />
          </div>

          {/* 2.6 Confirmation Wave */}
          <div>
            <p className="text-white/80 font-medium mb-2">2.6 — Confirmation sur Wave</p>
            <p>Si vous choisissez Wave, l'application Wave s'ouvre automatiquement sur votre téléphone avec une demande de confirmation. Le montant est <span className="text-white">prélevé automatiquement</span> — pas besoin de faire de transfert manuel.</p>
            <Screenshot src={guideWaveConfirm} alt="Confirmation de paiement Wave" caption="Wave — Confirmez le paiement automatique d'un simple clic" />
          </div>

          {/* 2.7 Réception */}
          <div>
            <p className="text-white/80 font-medium mb-2">2.7 — Recevez vos USDT</p>
            <p>Après confirmation du paiement, vos USDT sont envoyés <span className="text-white">automatiquement</span> à votre wallet via l'API Binance. Délai moyen : <span className="text-white">5-15 minutes</span>.</p>
          </div>

          <InfoBox icon={AlertTriangle} color="red" title="Attention — Vérifiez votre adresse !">
            <ul className="space-y-1">
              <li>• Vérifiez 3 fois l'adresse wallet avant de confirmer</li>
              <li>• L'adresse doit correspondre au réseau choisi</li>
              <li>• Une erreur d'adresse = perte définitive des fonds</li>
            </ul>
          </InfoBox>
        </div>
      </section>

      <div className="border-t border-dashed border-white/10" />

      {/* ─── ÉTAPE 3 : VENDRE DES USDT ─── */}
      <section className="space-y-4">
        <h2 className="text-white font-medium text-lg flex items-center gap-2">
          <StepNumber n={3} />
          Vendre des USDT
        </h2>
        <div className="pl-9 space-y-4 text-sm text-white/60">
          <p>Convertissez vos USDT en FCFA directement sur votre Wave ou Orange Money.</p>

          <Screenshot src={guideSellUsdt} alt="Page Vendre USDT" caption="Vendre USDT — Entrez le montant et voyez la conversion en CFA" />

          <ol className="space-y-2 list-decimal list-inside">
            <li>Accédez à <span className="text-white">"Vendre"</span> depuis la barre de navigation</li>
            <li>Entrez le montant d'USDT que vous souhaitez vendre</li>
            <li>Le taux de conversion et le montant en CFA s'affichent en temps réel</li>
            <li>Choisissez votre méthode de réception : <span className="text-white">Wave</span> ou <span className="text-white">Orange Money</span></li>
            <li>Entrez votre numéro de téléphone</li>
            <li>Terex génère une <span className="text-white">adresse unique</span> — envoyez-y vos USDT depuis votre wallet</li>
            <li>Collez le <span className="text-white">hash de transaction</span> pour confirmer l'envoi</li>
            <li>Recevez votre argent en <span className="text-white">10-30 minutes</span></li>
          </ol>
        </div>
      </section>

      <div className="border-t border-dashed border-white/10" />

      {/* ─── ÉTAPE 4 : TRANSFERTS INTERNATIONAUX ─── */}
      <section className="space-y-4">
        <h2 className="text-white font-medium text-lg flex items-center gap-2">
          <StepNumber n={4} />
          Transferts internationaux
        </h2>
        <div className="pl-9 space-y-3 text-sm text-white/60">
          <p>Envoyez de l'argent vers l'Afrique de l'Ouest rapidement et à moindre coût.</p>
          <ol className="space-y-2 list-decimal list-inside">
            <li>Accédez à <span className="text-white">"Virement"</span> depuis la barre de navigation</li>
            <li>Choisissez le pays de destination (Sénégal, Côte d'Ivoire, Mali, etc.)</li>
            <li>Entrez le montant en FCFA à envoyer</li>
            <li>Remplissez les infos du destinataire :
              <ul className="ml-4 mt-1 space-y-1 list-disc list-inside text-white/50">
                <li>Nom complet</li>
                <li>Numéro Wave ou Orange Money</li>
              </ul>
            </li>
            <li>Validez — le paiement est prélevé automatiquement via NabooPay</li>
            <li>Le destinataire reçoit l'argent en <span className="text-white">15-60 minutes</span></li>
          </ol>
        </div>
      </section>

      <div className="border-t border-dashed border-white/10" />

      {/* ─── ÉTAPE 5 : SUIVI DES TRANSACTIONS ─── */}
      <section className="space-y-4">
        <h2 className="text-white font-medium text-lg flex items-center gap-2">
          <StepNumber n={5} />
          Suivi de vos transactions
        </h2>
        <div className="pl-9 space-y-4 text-sm text-white/60">
          <p>Retrouvez l'historique complet de vos transactions avec tous les détails : type, montant, statut, réseau, adresse wallet et date.</p>

          <Screenshot src={guideTransactionDetails} alt="Détails de transaction" caption="Historique — Cliquez sur une transaction pour voir tous les détails" />

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3">
            <div className="bg-yellow-500/10 border border-yellow-500/20 p-2.5 rounded-lg text-center">
              <p className="text-yellow-400 text-xs font-medium">En attente</p>
            </div>
            <div className="bg-blue-500/10 border border-blue-500/20 p-2.5 rounded-lg text-center">
              <p className="text-blue-400 text-xs font-medium">En cours</p>
            </div>
            <div className="bg-green-500/10 border border-green-500/20 p-2.5 rounded-lg text-center">
              <p className="text-green-400 text-xs font-medium">Complétée</p>
            </div>
            <div className="bg-red-500/10 border border-red-500/20 p-2.5 rounded-lg text-center">
              <p className="text-red-400 text-xs font-medium">Échouée</p>
            </div>
          </div>
        </div>
      </section>

      <div className="border-t border-dashed border-white/10" />

      {/* ─── ÉTAPE 6 : TABLEAU DE BORD ─── */}
      <section className="space-y-4">
        <h2 className="text-white font-medium text-lg flex items-center gap-2">
          <StepNumber n={6} />
          Votre tableau de bord
        </h2>
        <div className="pl-9 space-y-3 text-sm text-white/60">
          <p>Le tableau de bord centralise toute votre activité sur Terex :</p>
          <Screenshot src={dashboardPreview} alt="Tableau de bord Terex" caption="Tableau de bord — Vue d'ensemble de votre activité" />
          <ul className="space-y-1.5">
            <li>• <span className="text-white">Transactions récentes</span> — statut en temps réel</li>
            <li>• <span className="text-white">Historique complet</span> — filtres par date et type</li>
            <li>• <span className="text-white">Profil et KYC</span> — gérez vos informations</li>
            <li>• <span className="text-white">Actions rapides</span> — Acheter, Vendre, Virement</li>
          </ul>
        </div>
      </section>

      <div className="border-t border-dashed border-white/10" />

      {/* Sécurité */}
      <section className="space-y-4">
        <h2 className="text-white font-medium text-lg flex items-center gap-2">
          <Shield className="w-5 h-5 text-terex-accent" />
          Sécurité et bonnes pratiques
        </h2>
        <div className="pl-7 space-y-3 text-sm text-white/60">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-terex-gray/60 rounded-lg p-4 border border-white/10">
              <p className="text-white font-medium text-sm mb-2">Sécurité du compte</p>
              <ul className="space-y-1 text-xs">
                <li>• Utilisez un mot de passe fort et unique</li>
                <li>• Déconnectez-vous sur les appareils publics</li>
                <li>• Vérifiez toujours l'URL : terex.sn</li>
                <li>• Complétez votre vérification KYC</li>
              </ul>
            </div>
            <div className="bg-terex-gray/60 rounded-lg p-4 border border-white/10">
              <p className="text-white font-medium text-sm mb-2">Sécurité des fonds</p>
              <ul className="space-y-1 text-xs">
                <li>• Vérifiez 3x les adresses wallet</li>
                <li>• Testez avec un petit montant d'abord</li>
                <li>• Ne partagez jamais vos accès</li>
                <li>• Ignorez les offres trop avantageuses</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Support */}
      <section className="bg-terex-gray/60 rounded-xl p-5 sm:p-6 border border-white/10">
        <h2 className="text-white font-medium mb-3">Besoin d'aide ?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
          <div className="bg-terex-darker/80 rounded-lg p-3 text-center">
            <p className="text-white font-medium text-sm">WhatsApp</p>
            <p className="text-white/40 text-xs">+1 (418) 261-9091</p>
          </div>
          <div className="bg-terex-darker/80 rounded-lg p-3 text-center">
            <p className="text-white font-medium text-sm">Email</p>
            <p className="text-white/40 text-xs">Terangaexchange@gmail.com</p>
          </div>
          <div className="bg-terex-darker/80 rounded-lg p-3 text-center">
            <p className="text-white font-medium text-sm">Centre d'aide</p>
            <p className="text-white/40 text-xs">terex.sn/help</p>
          </div>
        </div>
      </section>
    </div>
  );
}
