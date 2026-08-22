import { AbsoluteFill, Sequence } from "remotion";
import { IntroScene } from "./IntroScene";
import { OutroScene } from "./OutroScene";
import { StepScene, type StepAnnotation } from "./StepScene";
import {
  AmountScreen,
  NetworkScreen,
  AddressScreen,
  ConfirmScreen,
  PaymentScreen,
  SuccessScreen,
} from "./screens";

const FPS = 30;
const SEC = FPS;

const INTRO = 3 * SEC;
const STEP = 5 * SEC;
const OUTRO = 3.5 * SEC;

/**
 * Chorégraphie de chaque étape : uniquement le curseur macOS qui glisse et tape.
 * Pas de ring vert, pas de flèche — juste la souris qui se pose sur le bon
 * bouton, un ripple au tap, puis on passe à l'étape suivante. La caption
 * en bas indique l'étape courante et l'action attendue.
 *
 * Coordonnées : canvas 1080×1920 (shell 480 × 2.25 = 1080).
 */

// STEP 1 — cursor tape le bouton Continuer (gris, bas-gauche)
const step1: StepAnnotation = {
  cursor: {
    path: [
      { at: 20, to: { x: 1050, y: 1870 } },
      { at: 78, to: { x: 210, y: 1210 } },
      { at: 118, to: { x: 210, y: 1210 } },
    ],
    taps: [118],
    appearAt: 20,
    disappearAt: 148,
  },
};

// STEP 2 — cursor tape la pastille Tron (première pastille, en haut à gauche)
const step2: StepAnnotation = {
  cursor: {
    path: [
      { at: 20, to: { x: 1050, y: 1870 } },
      { at: 78, to: { x: 155, y: 430 } },
      { at: 118, to: { x: 155, y: 430 } },
    ],
    taps: [118],
    appearAt: 20,
    disappearAt: 148,
  },
};

// STEP 3 — cursor tape le champ adresse wallet
const step3: StepAnnotation = {
  cursor: {
    path: [
      { at: 20, to: { x: 1050, y: 1870 } },
      { at: 78, to: { x: 540, y: 545 } },
      { at: 118, to: { x: 540, y: 545 } },
    ],
    taps: [118],
    appearAt: 20,
    disappearAt: 148,
  },
};

// STEP 4 — cursor tape le bouton blanc "Confirmer et payer"
const step4: StepAnnotation = {
  cursor: {
    path: [
      { at: 20, to: { x: 1050, y: 1870 } },
      { at: 78, to: { x: 250, y: 1160 } },
      { at: 118, to: { x: 250, y: 1160 } },
    ],
    taps: [118],
    appearAt: 20,
    disappearAt: 148,
  },
};

// STEP 5 — cursor tape le bouton bleu "Payer avec Wave"
const step5: StepAnnotation = {
  cursor: {
    path: [
      { at: 20, to: { x: 1050, y: 1870 } },
      { at: 78, to: { x: 540, y: 1000 } },
      { at: 118, to: { x: 540, y: 1000 } },
    ],
    taps: [118],
    appearAt: 20,
    disappearAt: 148,
  },
};

// STEP 6 — aucun tap, on regarde juste le paiement reçu (le check anime déjà)
const step6: StepAnnotation = {};

const steps = [
  {
    title: "Choisis le montant",
    hint: "En CFA ou en USDT — comme tu préfères.",
    screen: <AmountScreen />,
    annotation: step1,
  },
  {
    title: "Sélectionne le réseau",
    hint: "Tron, BNB, Ethereum, Solana… tu choisis.",
    screen: <NetworkScreen />,
    annotation: step2,
  },
  {
    title: "Colle ton adresse",
    hint: "Ton wallet USDT — ou depuis ton carnet.",
    screen: <AddressScreen />,
    annotation: step3,
  },
  {
    title: "Vérifie et confirme",
    hint: "Un dernier coup d'œil au récap.",
    screen: <ConfirmScreen />,
    annotation: step4,
  },
  {
    title: "Paie avec Wave",
    hint: "Un clic — Wave s'ouvre, tu valides.",
    screen: <PaymentScreen />,
    annotation: step5,
  },
  {
    title: "USDT reçus",
    hint: "Livrés en quelques minutes. C'est fait.",
    screen: <SuccessScreen />,
    annotation: step6,
  },
];

export const BUY_USDT_DURATION = INTRO + STEP * steps.length + OUTRO;

const STEPS_START = INTRO;
const OUTRO_START = STEPS_START + STEP * steps.length;

export const BuyUsdtTutorial: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: "#1a1a1a" }}>
      <Sequence from={0} durationInFrames={INTRO} name="Intro">
        <IntroScene />
      </Sequence>

      {steps.map((s, i) => (
        <Sequence
          key={i}
          from={STEPS_START + i * STEP}
          durationInFrames={STEP}
          name={`Step ${i + 1}`}
        >
          <StepScene
            index={i + 1}
            total={steps.length}
            title={s.title}
            hint={s.hint}
            screen={s.screen}
            annotation={s.annotation}
            duration={STEP}
          />
        </Sequence>
      ))}

      <Sequence from={OUTRO_START} durationInFrames={OUTRO} name="Outro">
        <OutroScene />
      </Sequence>
    </AbsoluteFill>
  );
};
