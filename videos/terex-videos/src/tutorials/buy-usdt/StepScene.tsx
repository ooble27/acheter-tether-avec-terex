import { AbsoluteFill } from "remotion";
import { ScreenFrame } from "../../design/motion/ScreenFrame";
import { Cursor } from "../../design/motion/Cursor";
import { CaptionSheet } from "../../design/motion/CaptionSheet";
import { poppins } from "../../design/fonts";

export type StepAnnotation = {
  /** Trajectoire du curseur (coords canvas 1080×1920). */
  cursor?: {
    path: { at: number; to: { x: number; y: number } }[];
    taps?: number[];
    appearAt?: number;
    disappearAt?: number;
  };
};

type Props = {
  index: number;
  total: number;
  title: string;
  hint?: string;
  screen: React.ReactNode;
  annotation?: StepAnnotation;
  duration: number;
};

export const StepScene: React.FC<Props> = ({
  index,
  total,
  title,
  hint,
  screen,
  annotation = {},
  duration,
}) => {
  const enterAt = 0;
  const exitAt = duration - 8;

  return (
    <AbsoluteFill style={{ fontFamily: poppins }}>
      <ScreenFrame enterAt={enterAt} exitAt={exitAt} enterFrom="right">
        {screen}
      </ScreenFrame>

      {annotation.cursor && (
        <Cursor
          path={annotation.cursor.path}
          taps={annotation.cursor.taps}
          appearAt={annotation.cursor.appearAt}
          disappearAt={annotation.cursor.disappearAt}
        />
      )}

      <CaptionSheet
        step={index}
        total={total}
        title={title}
        hint={hint}
        appearAt={10}
        disappearAt={exitAt}
      />
    </AbsoluteFill>
  );
};
