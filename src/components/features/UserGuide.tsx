import {
  ArrowLeft,
  Shield,
  AlertTriangle,
  Coins,
  HandCoins,
  Send,
  Wallet,
  ArrowRightLeft,
  Clock,
  CheckCircle2,
  ChevronRight,
} from 'lucide-react';

interface UserGuideProps {
  onBack: () => void;
}

const SURFACE = '#1e1e1e';
const PAGE = '#141414';
const BORDER = 'rgba(255,255,255,0.07)';
const TILE = 'rgba(255,255,255,0.06)';

const StepNumber = ({ n }: { n: number | string }) => (
  <div
    className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
    style={{ background: TILE, border: `1px solid ${BORDER}` }}
  >
    {n}
  </div>
);

/* ── Inline neutral UI mockups (replace old screenshots) ── */

const MockFrame = ({
  children,
  caption,
}: {
  children: React.ReactNode;
  caption?: string;
}) => (
  <div className="my-4">
    <div
      className="rounded-2xl p-4 sm:p-5"
      style={{ background: SURFACE, border: `1px solid ${BORDER}` }}
    >
      {children}
    </div>
    {caption && (
      <p className="text-white/30 text-[11px] mt-2 text-center">{caption}</p>
    )}
  </div>
);

const IconTile = ({ icon: Icon }: { icon: any }) => (
  <div
    className="w-10 h-10 rounded-xl flex items-center justify-center text-white flex-shrink-0"
    style={{ background: TILE, border: `1px solid ${BORDER}` }}
  >
    <Icon className="w-5 h-5" />
  </div>
);

/* Rate card mockup */
const RateCardMock = () => (
  <MockFrame caption="Taux en temps réel sur votre tableau de bord">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <IconTile icon={ArrowRightLeft} />
        <div>
          <p className="text-white/40 text-[11px] uppercase tracking-wider">
            Taux USDT / CFA
          </p>
          <p className="text-white font-semibold text-lg">660 CFA</p>
        </div>
      </div>
      <span
        className="text-[10px] px-2 py-1 rounded-full text-white/60"
        style={{ background: TILE, border: `1px solid ${BORDER}` }}
      >
        Live
      </span>
    </div>
  </MockFrame>
);

/* Quick-action tiles mockup */
const QuickActionsMock = () => (
  <MockFrame caption="Actions rapides — Acheter, Vendre, Virement">
    <div className="grid grid-cols-3 gap-3">
      {[
        { label: 'Acheter', icon: Coins },
        { label: 'Vendre', icon: HandCoins },
        { label: 'Virement', icon: Send },
      ].map((a) => (
        <div
          key={a.label}
          className="rounded-xl p-3 flex flex-col items-center gap-2"
          style={{ background: PAGE, border: `1px solid ${BORDER}` }}
        >
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center text-white"
            style={{ background: TILE, border: `1px solid ${BORDER}` }}
          >
            <a.icon className="w-4 h-4" />
          </div>
          <span className="text-white/70 text-xs">{a.label}</span>
        </div>
      ))}
    </div>
  </MockFrame>
);

/* Amount converter mockup */
const ConverterMock = ({
  from,
  to,
  fromLabel,
  toLabel,
  caption,
}: {
  from: string;
  to: string;
  fromLabel: string;
  toLabel: string;
  caption?: string;
}) => (
  <MockFrame caption={caption}>
    <div className="space-y-2">
      <div
        className="rounded-xl p-3 flex items-center justify-between"
        style={{ background: PAGE, border: `1px solid ${BORDER}` }}
      >
        <span className="text-white/40 text-xs">{fromLabel}</span>
        <span className="text-white font-semibold">{from}</span>
      </div>
      <div className="flex justify-center">
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center text-white/60"
          style={{ background: TILE, border: `1px solid ${BORDER}` }}
        >
          <ArrowRightLeft className="w-3.5 h-3.5" />
        </div>
      </div>
      <div
        className="rounded-xl p-3 flex items-center justify-between"
        style={{ background: PAGE, border: `1px solid ${BORDER}` }}
      >
        <span className="text-white/40 text-xs">{toLabel}</span>
        <span className="text-white font-semibold">{to}</span>
      </div>
    </div>
  </MockFrame>
);

/* Network / option selector mockup */
const OptionListMock = ({
  title,
  options,
  caption,
}: {
  title?: string;
  options: { label: string; hint?: string; active?: boolean }[];
  caption?: string;
}) => (
  <MockFrame caption={caption}>
    {title && <p className="text-white/40 text-[11px] mb-3">{title}</p>}
    <div className="space-y-2">
      {options.map((o) => (
        <div
          key={o.label}
          className="rounded-xl px-3 py-2.5 flex items-center justify-between"
          style={{
            background: PAGE,
            border: o.active
              ? '1px solid rgba(255,255,255,0.25)'
              : `1px solid ${BORDER}`,
          }}
        >
          <div className="flex items-center gap-2">
            <span className="text-white text-sm">{o.label}</span>
            {o.hint && <span className="text-white/35 text-xs">{o.hint}</span>}
          </div>
          <ChevronRight className="w-4 h-4 text-white/25" />
        </div>
      ))}
    </div>
  </MockFrame>
);

/* Generic field / address mockup */
const FieldMock = ({
  label,
  value,
  caption,
}: {
  label: string;
  value: string;
  caption?: string;
}) => (
  <MockFrame caption={caption}>
    <p className="text-white/40 text-[11px] mb-2">{label}</p>
    <div
      className="rounded-xl px-3 py-2.5 flex items-center justify-between gap-2"
      style={{ background: PAGE, border: `1px solid ${BORDER}` }}
    >
      <span className="text-white/80 text-sm font-mono truncate">{value}</span>
      <Wallet className="w-4 h-4 text-white/30 flex-shrink-0" />
    </div>
  </MockFrame>
);

/* Order summary mockup */
const SummaryMock = ({
  rows,
  caption,
}: {
  rows: { label: string; value: string }[];
  caption?: string;
}) => (
  <MockFrame caption={caption}>
    <div className="space-y-2.5">
      {rows.map((r, i) => (
        <div
          key={i}
          className="flex items-center justify-between text-sm"
        >
          <span className="text-white/40">{r.label}</span>
          <span className="text-white font-medium">{r.value}</span>
        </div>
      ))}
    </div>
  </MockFrame>
);

const InfoBox = ({
  icon: Icon,
  title,
  children,
}: {
  icon: any;
  title: string;
  children: React.ReactNode;
}) => (
  <div
    className="rounded-xl p-4 mt-3"
    style={{ background: TILE, border: `1px solid ${BORDER}` }}
  >
    <div className="flex items-start gap-3">
      <Icon className="w-4 h-4 text-white mt-0.5 flex-shrink-0" />
      <div>
        <p className="text-sm font-medium text-white">{title}</p>
        <div className="text-xs mt-1 text-white/55">{children}</div>
      </div>
    </div>
  </div>
);

const SectionDivider = () => (
  <div className="border-t" style={{ borderColor: BORDER }} />
);

export function UserGuide({ onBack }: UserGuideProps) {
  return (
    <div className="space-y-10 animate-fade-in max-w-3xl mx-auto">
      {/* Header */}
      <div>
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-white/50 hover:text-white text-sm mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour aux guides
        </button>
        <p className="text-white/40 text-xs uppercase tracking-[0.2em] mb-3">
          Guide complet
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-3">
          Guide d'utilisation Terex
        </h1>
        <p className="text-white/55 text-sm sm:text-base max-w-xl">
          Maîtrisez toutes les fonctionnalités, étape par étape.
        </p>
      </div>

      {/* Intro */}
      <section
        className="rounded-2xl p-6 sm:p-7"
        style={{ background: SURFACE, border: `1px solid ${BORDER}` }}
      >
        <h2 className="text-white font-semibold text-lg mb-3 tracking-tight">
          Bienvenue sur Terex
        </h2>
        <p className="text-white/55 text-sm leading-relaxed mb-5">
          Terex est la plateforme la plus simple pour acheter et vendre des USDT en
          Afrique de l'Ouest. Paiement automatique via Wave et Orange Money grâce à
          NabooPay, envoi instantané des USDT.
        </p>
        <div className="grid grid-cols-3 gap-3">
          {[
            { v: '~5 min', l: 'Traitement' },
            { v: 'Automatique', l: 'Paiement NabooPay' },
            { v: '24/7', l: 'Support' },
          ].map((s) => (
            <div
              key={s.l}
              className="rounded-xl p-3 text-center"
              style={{ background: PAGE, border: `1px solid ${BORDER}` }}
            >
              <p className="text-white text-sm font-semibold">{s.v}</p>
              <p className="text-white/40 text-[11px] mt-0.5">{s.l}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── ÉTAPE 1 : CRÉER UN COMPTE ─── */}
      <section className="space-y-4">
        <h2 className="text-white font-semibold text-lg flex items-center gap-3 tracking-tight">
          <StepNumber n={1} />
          Créer votre compte
        </h2>
        <div className="pl-12 space-y-4 text-sm text-white/55">
          <p>L'inscription se fait avec un email et un mot de passe :</p>
          <ol className="space-y-2 list-decimal list-inside">
            <li>
              Cliquez sur <span className="text-white">"S'inscrire"</span> depuis la
              page de connexion
            </li>
            <li>
              Entrez votre <span className="text-white">nom complet</span>, votre{' '}
              <span className="text-white">adresse email</span> et un{' '}
              <span className="text-white">mot de passe</span>
            </li>
            <li>
              Vous pouvez entrer un{' '}
              <span className="text-white">code de parrainage</span> si vous en avez un
            </li>
            <li>
              Acceptez les conditions d'utilisation et cliquez sur{' '}
              <span className="text-white">"Continuer"</span>
            </li>
          </ol>

          <FieldMock
            label="Adresse email"
            value="vous@exemple.com"
            caption="Page d'inscription — Nom, email et mot de passe"
          />

          <InfoBox icon={Shield} title="Vérification KYC">
            <p>
              Pour des montants élevés, fournissez : pièce d'identité (CNI/passeport),
              selfie avec la pièce, et justificatif de domicile. Validation sous 24-48h.
            </p>
          </InfoBox>
        </div>
      </section>

      <SectionDivider />

      {/* ─── ÉTAPE 2 : ACHETER DES USDT ─── */}
      <section className="space-y-4">
        <h2 className="text-white font-semibold text-lg flex items-center gap-3 tracking-tight">
          <StepNumber n={2} />
          Acheter des USDT — Le processus complet
        </h2>
        <div className="pl-12 space-y-6 text-sm text-white/55">
          {/* 2.1 Montant */}
          <div>
            <p className="text-white font-medium mb-2">
              2.1 — Entrez le montant en FCFA
            </p>
            <p>
              Accédez à <span className="text-white">"Acheter"</span> depuis la barre de
              navigation. Le convertisseur affiche en temps réel le nombre d'USDT que
              vous recevrez selon le taux actuel.
            </p>
            <ConverterMock
              fromLabel="Vous payez"
              from="66 000 CFA"
              toLabel="Vous recevez"
              to="100 USDT"
              caption="Entrez le montant en CFA — conversion USDT en temps réel"
            />
          </div>

          {/* 2.2 Destination */}
          <div>
            <p className="text-white font-medium mb-2">
              2.2 — Choisissez votre destination
            </p>
            <p>
              Sélectionnez le réseau blockchain sur lequel vous souhaitez recevoir vos
              USDT :
            </p>
            <ul className="space-y-1 mt-2 ml-2">
              <li>
                • <span className="text-white">TRC20</span> — Réseau Tron (frais les plus
                bas)
              </li>
              <li>
                • <span className="text-white">BEP20</span> — Binance Smart Chain
              </li>
              <li>
                • <span className="text-white">ERC20</span> — Réseau Ethereum
              </li>
              <li>
                • <span className="text-white">Polygon</span> — Réseau Polygon
              </li>
              <li>
                • <span className="text-white">Solana</span> — Réseau Solana
              </li>
              <li>
                • <span className="text-white">Aptos</span> — Réseau Aptos
              </li>
              <li>
                • <span className="text-white">Binance</span> — Via Binance Pay (email
                Binance)
              </li>
            </ul>
            <OptionListMock
              title="Réseau de réception"
              options={[
                { label: 'TRC20', hint: 'Tron — frais bas', active: true },
                { label: 'BEP20', hint: 'BNB Smart Chain' },
                { label: 'Polygon', hint: 'MATIC' },
                { label: 'Solana', hint: 'SOL' },
              ]}
              caption="Choisissez votre réseau — TRC20, BEP20, Polygon, Solana, etc."
            />
          </div>

          {/* 2.3 Adresse */}
          <div>
            <p className="text-white font-medium mb-2">
              2.3 — Entrez votre adresse de réception
            </p>
            <p>
              Collez l'adresse de votre wallet correspondant au réseau choisi.{' '}
              <span className="text-white">
                Vérifiez bien que l'adresse correspond au bon réseau.
              </span>
            </p>
            <FieldMock
              label="Adresse wallet (TRC20)"
              value="TJ9...x7Qa"
              caption="Collez votre adresse de réception — vérifiez 3 fois !"
            />
          </div>

          {/* 2.4 Confirmation */}
          <div>
            <p className="text-white font-medium mb-2">
              2.4 — Confirmez votre commande
            </p>
            <p>
              Vérifiez le récapitulatif de votre achat : montant en CFA, USDT que vous
              recevrez, réseau de destination et adresse wallet.
            </p>
            <SummaryMock
              rows={[
                { label: 'Montant', value: '66 000 CFA' },
                { label: 'Vous recevez', value: '100 USDT' },
                { label: 'Réseau', value: 'TRC20' },
                { label: 'Adresse', value: 'TJ9...x7Qa' },
              ]}
              caption="Vérifiez les détails — Montant, USDT, destination et adresse"
            />
          </div>

          {/* 2.5 Paiement NabooPay */}
          <div>
            <p className="text-white font-medium mb-2">
              2.5 — Paiement automatique via NabooPay
            </p>
            <p>
              En cliquant sur <span className="text-white">"Confirmer et payer"</span>,
              vous êtes redirigé vers la page de paiement sécurisée NabooPay. Choisissez
              votre méthode de paiement :
            </p>
            <ul className="space-y-1 mt-2 ml-2">
              <li>
                • <span className="text-white">Wave</span> — Paiement mobile sécurisé (le
                plus populaire)
              </li>
              <li>
                • <span className="text-white">Orange Money</span> — Scannez le QR code
                pour payer
              </li>
            </ul>
            <p className="mt-2">
              Remplissez vos informations (prénom, nom, numéro de téléphone) et le résumé
              de la commande s'affiche avec les frais.
            </p>
            <OptionListMock
              title="Méthode de paiement"
              options={[
                { label: 'Wave', hint: 'Mobile money', active: true },
                { label: 'Orange Money', hint: 'QR code' },
              ]}
              caption="NabooPay — Choisissez Wave ou Orange Money"
            />
            <SummaryMock
              rows={[
                { label: 'Sous-total', value: '66 000 CFA' },
                { label: 'Frais', value: '500 CFA' },
                { label: 'Total', value: '66 500 CFA' },
              ]}
              caption="Résumé de la commande — Sous-total, frais et montant total"
            />
          </div>

          {/* 2.6 Confirmation Wave */}
          <div>
            <p className="text-white font-medium mb-2">2.6 — Confirmation sur Wave</p>
            <p>
              Si vous choisissez Wave, l'application Wave s'ouvre automatiquement sur
              votre téléphone avec une demande de confirmation. Le montant est{' '}
              <span className="text-white">prélevé automatiquement</span> — pas besoin de
              faire de transfert manuel.
            </p>
            <SummaryMock
              rows={[
                { label: 'Bénéficiaire', value: 'NabooPay' },
                { label: 'Montant', value: '66 500 CFA' },
                { label: 'Statut', value: 'En attente' },
              ]}
              caption="Wave — Confirmez le paiement automatique d'un simple clic"
            />
          </div>

          {/* 2.7 Réception */}
          <div>
            <p className="text-white font-medium mb-2">2.7 — Recevez vos USDT</p>
            <p>
              Après confirmation du paiement, vos USDT sont envoyés{' '}
              <span className="text-white">automatiquement</span> à votre wallet via l'API
              Binance. Délai moyen : <span className="text-white">5-15 minutes</span>.
            </p>
          </div>

          <InfoBox
            icon={AlertTriangle}
            title="Attention — Vérifiez votre adresse !"
          >
            <ul className="space-y-1">
              <li>• Vérifiez 3 fois l'adresse wallet avant de confirmer</li>
              <li>• L'adresse doit correspondre au réseau choisi</li>
              <li>• Une erreur d'adresse = perte définitive des fonds</li>
            </ul>
          </InfoBox>
        </div>
      </section>

      <SectionDivider />

      {/* ─── ÉTAPE 3 : VENDRE DES USDT ─── */}
      <section className="space-y-4">
        <h2 className="text-white font-semibold text-lg flex items-center gap-3 tracking-tight">
          <StepNumber n={3} />
          Vendre des USDT
        </h2>
        <div className="pl-12 space-y-4 text-sm text-white/55">
          <p>
            Convertissez vos USDT en FCFA directement sur votre Wave ou Orange Money.
          </p>

          {/* 3.1 Montant */}
          <div>
            <p className="text-white font-medium mb-2">
              3.1 — Entrez le montant d'USDT à vendre
            </p>
            <p>
              Le taux de conversion et le montant en CFA que vous recevrez s'affichent en
              temps réel.
            </p>
            <ConverterMock
              fromLabel="Vous vendez"
              from="60 USDT"
              toLabel="Vous recevez"
              to="33 360 CFA"
              caption="Entrez le montant — ex: 60 USDT = 33 360 CFA"
            />
          </div>

          {/* 3.2 Mode d'envoi */}
          <div>
            <p className="text-white font-medium mb-2">
              3.2 — Choisissez le mode d'envoi de vos USDT
            </p>
            <p>Deux options s'offrent à vous :</p>
            <ul className="space-y-1 mt-2 ml-2">
              <li>
                • <span className="text-white">Réseau blockchain</span> — Envoyez depuis
                votre wallet (TRC20, BEP20, ERC20, Solana, Aptos)
              </li>
              <li>
                • <span className="text-white">Binance Pay</span> — Envoi instantané
                depuis votre compte Binance
              </li>
            </ul>
            <OptionListMock
              options={[
                {
                  label: 'Réseau blockchain',
                  hint: 'TRC20 recommandé',
                  active: true,
                },
                { label: 'Binance Pay', hint: 'Instantané' },
              ]}
              caption="Deux modes d'envoi — Réseau blockchain ou Binance Pay"
            />
          </div>

          {/* 3.3 Infos de paiement */}
          <div>
            <p className="text-white font-medium mb-2">
              3.3 — Informations de réception
            </p>
            <p>
              Choisissez comment recevoir vos CFA : <span className="text-white">Wave</span>{' '}
              ou <span className="text-white">Orange Money</span>, puis entrez votre numéro
              de téléphone.
            </p>
            <OptionListMock
              title="Recevoir mes CFA via"
              options={[
                { label: 'Wave', hint: '+221 ...', active: true },
                { label: 'Orange Money', hint: '+221 ...' },
              ]}
              caption="Choisissez Wave ou Orange Money et entrez votre numéro"
            />
          </div>

          {/* 3.4 Confirmation */}
          <div>
            <p className="text-white font-medium mb-2">3.4 — Confirmez la vente</p>
            <p>
              Vérifiez le récapitulatif : USDT envoyés, CFA reçus, réseau, service mobile
              money et numéro de téléphone.
            </p>
            <SummaryMock
              rows={[
                { label: 'USDT envoyés', value: '60 USDT' },
                { label: 'CFA reçus', value: '33 360 CFA' },
                { label: 'Réseau', value: 'TRC20' },
                { label: 'Réception', value: 'Wave' },
              ]}
              caption="Récapitulatif de la vente — réseau blockchain ou Binance Pay"
            />
          </div>

          {/* 3.5 Envoi des USDT */}
          <div>
            <p className="text-white font-medium mb-2">3.5 — Envoyez vos USDT</p>
            <p>Terex vous donne les instructions précises pour envoyer vos USDT :</p>

            <p className="text-white/70 text-xs font-medium mt-3 mb-1">
              Via réseau blockchain :
            </p>
            <p>
              Envoyez le montant exact à l'adresse indiquée sur le bon réseau. Copiez
              l'adresse en un clic.
            </p>
            <FieldMock
              label="Envoyer 60 USDT (TRC20) à"
              value="TQ5...kP2v"
              caption="Envoyez exactement 60 USDT sur le réseau TRC20 à l'adresse indiquée"
            />

            <p className="text-white/70 text-xs font-medium mt-3 mb-1">
              Via Binance Pay :
            </p>
            <p>
              Suivez les instructions pour envoyer via Binance Pay avec l'email ou l'ID
              Binance fourni.
            </p>
            <FieldMock
              label="Binance Pay — Email / ID"
              value="terex@binance.id"
              caption="Instructions détaillées pour l'envoi via Binance Pay"
            />
          </div>

          {/* 3.6 Réception */}
          <div>
            <p className="text-white font-medium mb-2">3.6 — Recevez vos CFA</p>
            <p>
              Une fois l'envoi confirmé, Terex traite votre paiement en{' '}
              <span className="text-white">2-5 minutes</span>. L'argent est envoyé
              directement sur votre Wave ou Orange Money.
            </p>
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* ─── ÉTAPE 4 : TRANSFERTS INTERNATIONAUX ─── */}
      <section className="space-y-4">
        <h2 className="text-white font-semibold text-lg flex items-center gap-3 tracking-tight">
          <StepNumber n={4} />
          Transferts internationaux
        </h2>
        <div className="pl-12 space-y-3 text-sm text-white/55">
          <p>
            Envoyez de l'argent vers l'Afrique de l'Ouest rapidement et à moindre coût.
          </p>
          <ol className="space-y-2 list-decimal list-inside">
            <li>
              Accédez à <span className="text-white">"Virement"</span> depuis la barre de
              navigation
            </li>
            <li>
              Choisissez le pays de destination (Sénégal, Côte d'Ivoire, Mali, etc.)
            </li>
            <li>Entrez le montant en FCFA à envoyer</li>
            <li>
              Remplissez les infos du destinataire :
              <ul className="ml-4 mt-1 space-y-1 list-disc list-inside text-white/40">
                <li>Nom complet</li>
                <li>Numéro Wave ou Orange Money</li>
              </ul>
            </li>
            <li>Validez — le paiement est prélevé automatiquement via NabooPay</li>
            <li>
              Le destinataire reçoit l'argent en{' '}
              <span className="text-white">15-60 minutes</span>
            </li>
          </ol>
        </div>
      </section>

      <SectionDivider />

      {/* ─── ÉTAPE 5 : SUIVI DES TRANSACTIONS ─── */}
      <section className="space-y-4">
        <h2 className="text-white font-semibold text-lg flex items-center gap-3 tracking-tight">
          <StepNumber n={5} />
          Suivi de vos transactions
        </h2>
        <div className="pl-12 space-y-4 text-sm text-white/55">
          <p>
            Retrouvez l'historique complet de vos transactions avec tous les détails :
            type, montant, statut, réseau, adresse wallet et date.
          </p>

          <MockFrame caption="Historique — Cliquez sur une transaction pour voir tous les détails">
            <div className="space-y-2">
              {[
                { type: 'Achat USDT', amount: '+100 USDT', status: 'Complétée' },
                { type: 'Vente USDT', amount: '+33 360 CFA', status: 'En cours' },
                { type: 'Virement', amount: '50 000 CFA', status: 'En attente' },
              ].map((t, i) => (
                <div
                  key={i}
                  className="rounded-xl px-3 py-2.5 flex items-center justify-between"
                  style={{ background: PAGE, border: `1px solid ${BORDER}` }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-white"
                      style={{ background: TILE, border: `1px solid ${BORDER}` }}
                    >
                      <ArrowRightLeft className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-white text-sm">{t.type}</p>
                      <p className="text-white/35 text-[11px]">{t.status}</p>
                    </div>
                  </div>
                  <span className="text-white/70 text-sm">{t.amount}</span>
                </div>
              ))}
            </div>
          </MockFrame>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3">
            {[
              { label: 'En attente', icon: Clock },
              { label: 'En cours', icon: ArrowRightLeft },
              { label: 'Complétée', icon: CheckCircle2 },
              { label: 'Échouée', icon: AlertTriangle },
            ].map((s) => (
              <div
                key={s.label}
                className="p-2.5 rounded-xl flex items-center justify-center gap-1.5"
                style={{ background: TILE, border: `1px solid ${BORDER}` }}
              >
                <s.icon className="w-3.5 h-3.5 text-white/60" />
                <p className="text-white/70 text-xs font-medium">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* ─── ÉTAPE 6 : TABLEAU DE BORD ─── */}
      <section className="space-y-4">
        <h2 className="text-white font-semibold text-lg flex items-center gap-3 tracking-tight">
          <StepNumber n={6} />
          Votre tableau de bord
        </h2>
        <div className="pl-12 space-y-3 text-sm text-white/55">
          <p>Le tableau de bord centralise toute votre activité sur Terex :</p>
          <RateCardMock />
          <QuickActionsMock />
          <ul className="space-y-1.5">
            <li>
              • <span className="text-white">Transactions récentes</span> — statut en
              temps réel
            </li>
            <li>
              • <span className="text-white">Historique complet</span> — filtres par date
              et type
            </li>
            <li>
              • <span className="text-white">Profil et KYC</span> — gérez vos informations
            </li>
            <li>
              • <span className="text-white">Actions rapides</span> — Acheter, Vendre,
              Virement
            </li>
          </ul>
        </div>
      </section>

      <SectionDivider />

      {/* Sécurité */}
      <section className="space-y-4">
        <h2 className="text-white font-semibold text-lg flex items-center gap-3 tracking-tight">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center text-white flex-shrink-0"
            style={{ background: TILE, border: `1px solid ${BORDER}` }}
          >
            <Shield className="w-4 h-4" />
          </div>
          Sécurité et bonnes pratiques
        </h2>
        <div className="pl-12 space-y-3 text-sm text-white/55">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div
              className="rounded-2xl p-5"
              style={{ background: SURFACE, border: `1px solid ${BORDER}` }}
            >
              <p className="text-white font-medium text-sm mb-2">Sécurité du compte</p>
              <ul className="space-y-1 text-xs text-white/55">
                <li>• Utilisez un mot de passe fort et unique</li>
                <li>• Déconnectez-vous sur les appareils publics</li>
                <li>• Vérifiez toujours l'URL : terangaexchange.com</li>
                <li>• Complétez votre vérification KYC</li>
              </ul>
            </div>
            <div
              className="rounded-2xl p-5"
              style={{ background: SURFACE, border: `1px solid ${BORDER}` }}
            >
              <p className="text-white font-medium text-sm mb-2">Sécurité des fonds</p>
              <ul className="space-y-1 text-xs text-white/55">
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
      <section
        className="rounded-2xl p-6 sm:p-7"
        style={{ background: SURFACE, border: `1px solid ${BORDER}` }}
      >
        <h2 className="text-white font-semibold mb-4 tracking-tight">Besoin d'aide ?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
          {[
            { t: 'WhatsApp', d: '+1 (418) 261-9091' },
            { t: 'Email', d: 'Terangaexchange@gmail.com' },
            { t: "Centre d'aide", d: 'terangaexchange.com/guide' },
          ].map((c) => (
            <div
              key={c.t}
              className="rounded-xl p-3 text-center"
              style={{ background: PAGE, border: `1px solid ${BORDER}` }}
            >
              <p className="text-white font-medium text-sm">{c.t}</p>
              <p className="text-white/40 text-xs mt-0.5 break-all">{c.d}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
