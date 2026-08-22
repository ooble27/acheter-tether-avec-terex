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
 * Chorégraphie de chaque étape — coordonnées en canvas 1080×1920.
 * Le contenu Terex est en shell 480 upscale x2.25 → 1080 de large.
 * Pour convertir : canvas = shell × 2.25.
 */

// STEP 1 — target = "Continuer" gray button (bottom-left)
// button visually at canvas y≈1140-1270, x≈90-345
const step1: StepAnnotation = {
  ring: {
    x: 70,
    y: 1130,
    width: 300,
    height: 150,
    appearAt: 22,
    disappearAt: 132,
    radius: 40,
  },
  arrow: {
    box: { x: 360, y: 970, width: 660, height: 240 },
    d: "M 600 40 C 440 -20, 180 -10, 30 170",
    head: { x: 30, y: 170 },
    headAngle: 130,
    drawAt: 28,
    disappearAt: 132,
    label: "Continuer",
    labelAt: { x: 400, y: 0, align: "left" },
  },
  cursor: {
    path: [
      { at: 42, to: { x: 1050, y: 1870 } },
      { at: 90, to: { x: 210, y: 1210 } },
      { at: 118, to: { x: 210, y: 1210 } },
    ],
    taps: [118],
    appearAt: 42,
    disappearAt: 148,
  },
};

// STEP 2 — target = network pills grid (specifically TRC20/Tron top-left)
// pills grid at shell y ≈ 170-320 → canvas 383-720
// Tron pill top-left at shell ≈ (20, 170), pill ~92×44 native → canvas (45, 383), (207, 99)
const step2: StepAnnotation = {
  ring: {
    x: 40,
    y: 375,
    width: 1000,
    height: 350,
    appearAt: 22,
    disappearAt: 132,
    radius: 30,
  },
  arrow: {
    box: { x: 60, y: 180, width: 950, height: 220 },
    d: "M 100 30 C 260 -20, 520 -10, 700 180",
    head: { x: 700, y: 180 },
    headAngle: 70,
    drawAt: 28,
    disappearAt: 132,
    label: "Choisis un réseau",
    labelAt: { x: 60, y: -4, align: "left" },
  },
  cursor: {
    path: [
      { at: 42, to: { x: 1050, y: 1870 } },
      { at: 90, to: { x: 155, y: 430 } },
      { at: 118, to: { x: 155, y: 430 } },
    ],
    taps: [118],
    appearAt: 42,
    disappearAt: 148,
  },
};

// STEP 3 — target = wallet address input
// Address input inside its card at shell y ≈ 216-270 → canvas 486-608
const step3: StepAnnotation = {
  ring: {
    x: 50,
    y: 475,
    width: 980,
    height: 155,
    appearAt: 22,
    disappearAt: 132,
    radius: 26,
  },
  arrow: {
    box: { x: 60, y: 280, width: 950, height: 220 },
    d: "M 100 30 C 260 -20, 520 -10, 700 180",
    head: { x: 700, y: 180 },
    headAngle: 70,
    drawAt: 28,
    disappearAt: 132,
    label: "Ton adresse USDT",
    labelAt: { x: 60, y: -4, align: "left" },
  },
  cursor: {
    path: [
      { at: 42, to: { x: 1050, y: 1870 } },
      { at: 90, to: { x: 540, y: 545 } },
      { at: 118, to: { x: 540, y: 545 } },
    ],
    taps: [118],
    appearAt: 42,
    disappearAt: 148,
  },
};

// STEP 4 — target = WHITE "Confirmer et payer" button
// button visually at canvas y≈1100-1220, x≈95-435
const step4: StepAnnotation = {
  ring: {
    x: 80,
    y: 1090,
    width: 370,
    height: 145,
    appearAt: 26,
    disappearAt: 132,
    radius: 40,
  },
  arrow: {
    box: { x: 440, y: 930, width: 620, height: 240 },
    d: "M 560 40 C 400 -20, 160 -10, 30 170",
    head: { x: 30, y: 170 },
    headAngle: 130,
    drawAt: 30,
    disappearAt: 132,
    label: "Confirmer",
    labelAt: { x: 360, y: 0, align: "left" },
  },
  cursor: {
    path: [
      { at: 42, to: { x: 1050, y: 1870 } },
      { at: 90, to: { x: 250, y: 1160 } },
      { at: 118, to: { x: 250, y: 1160 } },
    ],
    taps: [118],
    appearAt: 42,
    disappearAt: 148,
  },
};

// STEP 5 — target = BLUE "Payer avec Wave" button
// button inside ready-to-pay card at shell y ≈ 417-472 → canvas 938-1062
const step5: StepAnnotation = {
  ring: {
    x: 60,
    y: 930,
    width: 960,
    height: 140,
    appearAt: 26,
    disappearAt: 132,
    radius: 30,
  },
  arrow: {
    box: { x: 60, y: 740, width: 950, height: 220 },
    d: "M 100 30 C 260 -20, 520 -10, 700 180",
    head: { x: 700, y: 180 },
    headAngle: 70,
    drawAt: 30,
    disappearAt: 132,
    label: "Payer avec Wave",
    labelAt: { x: 60, y: -4, align: "left" },
  },
  cursor: {
    path: [
      { at: 42, to: { x: 1050, y: 1870 } },
      { at: 90, to: { x: 540, y: 1000 } },
      { at: 118, to: { x: 540, y: 1000 } },
    ],
    taps: [118],
    appearAt: 42,
    disappearAt: 148,
  },
};

// STEP 6 — halo autour du check
// Check circle visually centered at canvas (540, 700)
const step6: StepAnnotation = {
  ring: {
    x: 405,
    y: 575,
    width: 270,
    height: 270,
    appearAt: 30,
    disappearAt: 140,
    radius: 999,
  },
};

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
