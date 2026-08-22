import { AbsoluteFill, Sequence } from "remotion";
import { Background } from "../../design/Background";
import { IntroScene } from "./IntroScene";
import { HookScene } from "./HookScene";
import { OutroScene } from "./OutroScene";
import { StepScene } from "./StepScene";
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
const HOOK = 2.5 * SEC;
const STEP = 4 * SEC;
const OUTRO = 3.5 * SEC;

export const BUY_USDT_DURATION = INTRO + HOOK + STEP * 6 + OUTRO;

const steps = [
  { title: "Le montant", screen: <AmountScreen /> },
  { title: "Le réseau", screen: <NetworkScreen /> },
  { title: "Ton wallet", screen: <AddressScreen /> },
  { title: "Confirme", screen: <ConfirmScreen /> },
  { title: "Wave", screen: <PaymentScreen /> },
  { title: "Reçu !", screen: <SuccessScreen /> },
];

const HOOK_START = INTRO;
const STEPS_START = INTRO + HOOK;
const OUTRO_START = STEPS_START + STEP * steps.length;

export const BuyUsdtTutorial: React.FC = () => {
  return (
    <AbsoluteFill>
      <Background />

      <Sequence from={0} durationInFrames={INTRO} name="Intro">
        <IntroScene />
      </Sequence>

      <Sequence from={HOOK_START} durationInFrames={HOOK} name="Hook">
        <HookScene />
      </Sequence>

      {steps.map((s, i) => (
        <Sequence
          key={i}
          from={STEPS_START + i * STEP}
          durationInFrames={STEP}
          name={`Step ${i + 1}`}
        >
          <StepScene index={i + 1} total={steps.length} title={s.title} screen={s.screen} />
        </Sequence>
      ))}

      <Sequence from={OUTRO_START} durationInFrames={OUTRO} name="Outro">
        <OutroScene />
      </Sequence>
    </AbsoluteFill>
  );
};
