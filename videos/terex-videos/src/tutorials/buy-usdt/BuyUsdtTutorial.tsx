import { AbsoluteFill, Sequence } from "remotion";
import { Background } from "../../design/Background";
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
 * Chorégraphie de chaque étape.
 *
 * Système de coordonnées :
 *  - `ring` / `arrow.box` → coordonnées dans le ScreenFrame (960×1780).
 *    Le contenu Terex est rendu au 480×890 puis scale(2), donc :
 *        y_visual_in_frame = y_shell × 2
 *        x_visual_in_frame = x_shell × 2
 *  - `cursor.path` → coordonnées absolues dans le canvas 1080×1920.
 *    Conversion : x_canvas = 60 + x_frame ; y_canvas = 70 + y_frame.
 *
 * Un seul point d'attention par étape : ring + arrow + tap curseur sur
 * le même élément. Les annotations persistent jusqu'à ~10 frames après
 * le tap pour laisser respirer l'action.
 */

// ---- STEP 1 : Amount — target = input card ----
// input card at shell y≈150-330 → frame y≈300-660 (canvas 370-730)
const step1: StepAnnotation = {
  ring: {
    x: 40,
    y: 300,
    width: 880,
    height: 360,
    appearAt: 22,
    disappearAt: 134,
    radius: 40,
  },
  arrow: {
    box: { x: 30, y: 140, width: 900, height: 220 },
    d: "M 80 40 C 200 -20, 500 -30, 720 130",
    head: { x: 720, y: 130 },
    headAngle: 60,
    drawAt: 28,
    disappearAt: 134,
    label: "Ton montant",
    labelAt: { x: 60, y: 0, align: "left" },
  },
  cursor: {
    path: [
      { at: 42, to: { x: 940, y: 1780 } },
      { at: 90, to: { x: 540, y: 550 } },
      { at: 118, to: { x: 540, y: 550 } },
    ],
    taps: [118],
    appearAt: 42,
    disappearAt: 148,
  },
};

// ---- STEP 2 : Network — target = network pills grid ----
// pills grid at shell y≈130-330 → frame y≈260-660 (canvas 330-730)
// Tap "Tron" pill (first): shell (~50, ~155) → canvas (~160, 380)
const step2: StepAnnotation = {
  ring: {
    x: 30,
    y: 240,
    width: 900,
    height: 440,
    appearAt: 22,
    disappearAt: 134,
    radius: 26,
  },
  arrow: {
    box: { x: 20, y: 100, width: 920, height: 200 },
    d: "M 100 30 C 260 -30, 500 -10, 660 130",
    head: { x: 660, y: 130 },
    headAngle: 60,
    drawAt: 28,
    disappearAt: 134,
    label: "Choisis un réseau",
    labelAt: { x: 60, y: -6, align: "left" },
  },
  cursor: {
    path: [
      { at: 42, to: { x: 940, y: 1780 } },
      { at: 90, to: { x: 200, y: 400 } },
      { at: 118, to: { x: 200, y: 400 } },
    ],
    taps: [118],
    appearAt: 42,
    disappearAt: 148,
  },
};

// ---- STEP 3 : Address — target = wallet input ----
// wallet input at shell y≈170-310 → frame y≈340-620 (canvas 410-690)
const step3: StepAnnotation = {
  ring: {
    x: 40,
    y: 340,
    width: 880,
    height: 290,
    appearAt: 22,
    disappearAt: 134,
    radius: 26,
  },
  arrow: {
    box: { x: 20, y: 170, width: 920, height: 240 },
    d: "M 100 30 C 260 -30, 520 -20, 700 160",
    head: { x: 700, y: 160 },
    headAngle: 65,
    drawAt: 28,
    disappearAt: 134,
    label: "Adresse USDT",
    labelAt: { x: 60, y: -4, align: "left" },
  },
  cursor: {
    path: [
      { at: 42, to: { x: 940, y: 1780 } },
      { at: 90, to: { x: 540, y: 560 } },
      { at: 118, to: { x: 540, y: 560 } },
    ],
    taps: [118],
    appearAt: 42,
    disappearAt: 148,
  },
};

// ---- STEP 4 : Confirm — target = WHITE "Confirmer et payer" button ----
// button at shell y≈460-510 → frame y≈920-1020 (canvas 990-1090)
// button padding-left 20 + button width ~240 → x=240 canvas
const step4: StepAnnotation = {
  ring: {
    x: 40,
    y: 890,
    width: 520,
    height: 150,
    appearAt: 30,
    disappearAt: 134,
    radius: 30,
  },
  arrow: {
    box: { x: 30, y: 710, width: 900, height: 220 },
    d: "M 700 30 C 550 -10, 300 0, 130 150",
    head: { x: 130, y: 150 },
    headAngle: 120,
    drawAt: 32,
    disappearAt: 134,
    label: "Confirmer et payer",
    labelAt: { x: 860, y: 0, align: "right" },
  },
  cursor: {
    path: [
      { at: 42, to: { x: 940, y: 1780 } },
      { at: 90, to: { x: 260, y: 1040 } },
      { at: 118, to: { x: 260, y: 1040 } },
    ],
    taps: [118],
    appearAt: 42,
    disappearAt: 148,
  },
};

// ---- STEP 5 : Wave Payment — target = BLUE Wave button ----
// Wave button at shell y≈402-457 → frame y≈804-914 (canvas 874-984)
const step5: StepAnnotation = {
  ring: {
    x: 60,
    y: 790,
    width: 840,
    height: 140,
    appearAt: 28,
    disappearAt: 134,
    radius: 24,
  },
  arrow: {
    box: { x: 30, y: 610, width: 900, height: 220 },
    d: "M 100 30 C 260 -20, 520 -10, 680 150",
    head: { x: 680, y: 150 },
    headAngle: 65,
    drawAt: 32,
    disappearAt: 134,
    label: "Payer avec Wave",
    labelAt: { x: 60, y: -4, align: "left" },
  },
  cursor: {
    path: [
      { at: 42, to: { x: 940, y: 1780 } },
      { at: 90, to: { x: 540, y: 930 } },
      { at: 118, to: { x: 540, y: 930 } },
    ],
    taps: [118],
    appearAt: 42,
    disappearAt: 148,
  },
};

// ---- STEP 6 : Success — halo around the green check ----
// check center visually at frame (480, 620)
const step6: StepAnnotation = {
  ring: {
    x: 350,
    y: 490,
    width: 260,
    height: 260,
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
    <AbsoluteFill>
      <Background />

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
