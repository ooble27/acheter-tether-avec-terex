import { Button } from '@/components/ui/button';
import { ArrowLeft, Shield, AlertTriangle } from 'lucide-react';
import dashboardBuyUsdt from '@/assets/dashboard-buy-usdt.jpeg';
import dashboardConfirm from '@/assets/dashboard-confirm.jpeg';
import dashboardDestination from '@/assets/dashboard-destination.jpeg';
import dashboardPreview from '@/assets/dashboard-preview.jpeg';
import orangeMoneyLogo from '@/assets/orange-money-logo.png';
import waveLogo from '@/assets/wave-logo.png';
import usdtLogo from '@/assets/usdt-logo.png';

interface UserGuideProps {
  onBack: () => void;
}

const StepNumber = ({ n }: { n: number | string }) => (
  <div className="w-7 h-7 rounded-full bg-terex-accent text-black flex items-center justify-center text-xs font-bold flex-shrink-0">
    {n}
  </div>
);

const Screenshot = ({ src, alt }: { src: string; alt: string }) => (
  <div className="my-4 rounded-xl overflow-hidden border border-white/10">
    <img src={src} alt={alt} className="w-full" loading="lazy" />
  </div>
);

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
          Paiement automatique via Wave et Orange Money, envoi instantané des USDT.
        </p>
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-terex-darker/80 rounded-lg p-3 text-center">
            <p className="text-terex-accent text-sm font-medium">~5 min</p>
            <p className="text-white/40 text-[11px]">Traitement</p>
          </div>
          <div className="bg-terex-darker/80 rounded-lg p-3 text-center">
            <p className="text-terex-accent text-sm font-medium">1-2%</p>
            <p className="text-white/40 text-[11px]">Frais transparents</p>
          </div>
          <div className="bg-terex-darker/80 rounded-lg p-3 text-center">
            <p className="text-terex-accent text-sm font-medium">24/7</p>
            <p className="text-white/40 text-[11px]">Support</p>
          </div>
        </div>
      </section>

      {/* Step 1: Account */}
      <section className="space-y-4">
        <h2 className="text-white font-medium text-lg flex items-center gap-2">
          <StepNumber n={1} />
          Créer votre compte
        </h2>
        <div className="pl-9 space-y-3 text-sm text-white/60">
          <p>L'inscription est rapide et sans mot de passe :</p>
          <ol className="space-y-2 list-decimal list-inside">
            <li>Cliquez sur <span className="text-white">"S'inscrire"</span> depuis la page d'accueil</li>
            <li>Entrez votre adresse email</li>
            <li>Vous recevez un <span className="text-white">lien magique</span> par email — cliquez dessus pour vous connecter</li>
            <li>Complétez votre profil (nom, téléphone, pays)</li>
          </ol>
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mt-3">
            <div className="flex items-start gap-2">
              <Shield className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-blue-200 text-sm font-medium">Vérification KYC</p>
                <p className="text-blue-100/70 text-xs mt-1">
                  Pour des montants élevés, fournissez: pièce d'identité (CNI/passeport), selfie avec la pièce, et justificatif de domicile. Validation sous 24-48h.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="border-t border-dashed border-white/10" />

      {/* Step 2: Buy USDT */}
      <section className="space-y-4">
        <h2 className="text-white font-medium text-lg flex items-center gap-2">
          <StepNumber n={2} />
          Acheter des USDT
        </h2>
        <div className="pl-9 space-y-4 text-sm text-white/60">
          <p>Accédez à <span className="text-white">"Acheter USDT"</span> depuis le tableau de bord.</p>

          <div className="space-y-4">
            <div>
              <p className="text-white/80 font-medium mb-2">2.1 — Entrez le montant en FCFA</p>
              <p>Le convertisseur affiche en temps réel le nombre d'USDT que vous recevrez.</p>
              <Screenshot src={dashboardBuyUsdt} alt="Écran d'achat USDT - Saisie du montant" />
            </div>

            <div>
              <p className="text-white/80 font-medium mb-2">2.2 — Choisissez votre destination</p>
              <p>Sélectionnez où recevoir vos USDT :</p>
              <ul className="space-y-1 mt-2">
                <li className="flex items-center gap-2">
                  <img src={usdtLogo} alt="USDT" className="w-4 h-4" />
                  <span><span className="text-white">Adresse wallet</span> — collez votre adresse TRC20, BEP20 ou ERC20</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-4 h-4 bg-yellow-500 rounded text-[8px] flex items-center justify-center font-bold text-black">B</span>
                  <span><span className="text-white">Binance Pay</span> — entrez simplement votre email Binance</span>
                </li>
              </ul>
              <Screenshot src={dashboardDestination} alt="Écran de sélection de destination" />
            </div>

            <div>
              <p className="text-white/80 font-medium mb-2">2.3 — Confirmez votre commande</p>
              <p>Vérifiez le récapitulatif : montant, taux, frais, USDT reçus.</p>
              <Screenshot src={dashboardConfirm} alt="Écran de confirmation de commande" />
            </div>

            <div>
              <p className="text-white/80 font-medium mb-2">2.4 — Payez automatiquement</p>
              <p>Vous êtes redirigé vers votre application de paiement. Le montant est prélevé automatiquement :</p>
              <div className="flex gap-3 mt-3">
                <div className="flex items-center gap-2 bg-terex-darker/80 rounded-lg px-4 py-3 border border-white/10">
                  <img src={waveLogo} alt="Wave" className="w-6 h-6 object-contain" />
                  <span className="text-white text-sm">Wave</span>
                </div>
                <div className="flex items-center gap-2 bg-terex-darker/80 rounded-lg px-4 py-3 border border-white/10">
                  <img src={orangeMoneyLogo} alt="Orange Money" className="w-6 h-6 object-contain" />
                  <span className="text-white text-sm">Orange Money</span>
                </div>
              </div>
              <p className="mt-3 text-white/40 text-xs">
                Pas besoin de faire un transfert manuel. NabooPay prélève directement de votre compte Wave ou Orange Money.
              </p>
            </div>

            <div>
              <p className="text-white/80 font-medium mb-2">2.5 — Recevez vos USDT</p>
              <p>Après confirmation du paiement, vos USDT sont envoyés <span className="text-white">automatiquement</span> à votre wallet via l'API Binance. Délai moyen : 5-15 minutes.</p>
            </div>
          </div>

          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-red-200 text-sm font-medium">Attention</p>
                <ul className="text-red-100/70 text-xs mt-1 space-y-1">
                  <li>• Vérifiez 3 fois l'adresse wallet avant de confirmer</li>
                  <li>• L'adresse doit correspondre au réseau choisi (TRC20 recommandé)</li>
                  <li>• Une erreur d'adresse = perte définitive des fonds</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="border-t border-dashed border-white/10" />

      {/* Step 3: Sell USDT */}
      <section className="space-y-4">
        <h2 className="text-white font-medium text-lg flex items-center gap-2">
          <StepNumber n={3} />
          Vendre des USDT
        </h2>
        <div className="pl-9 space-y-3 text-sm text-white/60">
          <p>Convertissez vos USDT en FCFA directement sur votre Orange Money ou Wave.</p>
          <ol className="space-y-2 list-decimal list-inside">
            <li>Accédez à <span className="text-white">"Vendre USDT"</span></li>
            <li>Indiquez le montant d'USDT à vendre (min. 10 USDT)</li>
            <li>Choisissez votre méthode de réception :
              <div className="flex items-center gap-4 mt-2 ml-4">
                <span className="flex items-center gap-1.5">
                  <img src={orangeMoneyLogo} alt="Orange Money" className="w-4 h-4 object-contain" />
                  Orange Money
                </span>
                <span className="flex items-center gap-1.5">
                  <img src={waveLogo} alt="Wave" className="w-4 h-4 object-contain" />
                  Wave
                </span>
              </div>
            </li>
            <li>Entrez votre numéro de téléphone (format international sans le +)</li>
            <li>Terex génère une <span className="text-white">adresse unique</span> — envoyez-y vos USDT depuis votre wallet</li>
            <li>Collez le <span className="text-white">hash de transaction</span> dans votre tableau de bord</li>
            <li>Recevez votre argent en <span className="text-white">10-30 minutes</span></li>
          </ol>
        </div>
      </section>

      <div className="border-t border-dashed border-white/10" />

      {/* Step 4: International Transfer */}
      <section className="space-y-4">
        <h2 className="text-white font-medium text-lg flex items-center gap-2">
          <StepNumber n={4} />
          Transferts internationaux
        </h2>
        <div className="pl-9 space-y-3 text-sm text-white/60">
          <p>Envoyez de l'argent vers l'Afrique de l'Ouest rapidement et à moindre coût.</p>
          <ol className="space-y-2 list-decimal list-inside">
            <li>Accédez à <span className="text-white">"Virement International"</span></li>
            <li>Choisissez le pays de destination (Sénégal, Côte d'Ivoire, Mali, etc.)</li>
            <li>Entrez le montant en FCFA à envoyer</li>
            <li>Remplissez les infos du destinataire :
              <ul className="ml-4 mt-1 space-y-1 list-disc list-inside text-white/50">
                <li>Nom complet</li>
                <li>Numéro Orange Money ou Wave</li>
              </ul>
            </li>
            <li>Validez — le paiement est prélevé automatiquement de votre Wave/Orange Money</li>
            <li>Le destinataire reçoit l'argent en <span className="text-white">15-60 minutes</span></li>
          </ol>
        </div>
      </section>

      <div className="border-t border-dashed border-white/10" />

      {/* Step 5: Dashboard */}
      <section className="space-y-4">
        <h2 className="text-white font-medium text-lg flex items-center gap-2">
          <StepNumber n={5} />
          Tableau de bord et suivi
        </h2>
        <div className="pl-9 space-y-3 text-sm text-white/60">
          <p>Votre tableau de bord centralise toute votre activité :</p>
          <Screenshot src={dashboardPreview} alt="Aperçu du tableau de bord Terex" />
          <ul className="space-y-1.5">
            <li>• <span className="text-white">Transactions récentes</span> — statut en temps réel</li>
            <li>• <span className="text-white">Historique complet</span> — filtres par date et type</li>
            <li>• <span className="text-white">Profil et KYC</span> — gérez vos informations</li>
          </ul>
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

      {/* Security */}
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
                <li>• Email sécurisé avec 2FA activée</li>
                <li>• Déconnexion sur appareils publics</li>
                <li>• Vérifiez toujours l'URL : terex.sn</li>
                <li>• Complétez votre KYC</li>
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
