import { AbsoluteFill } from "remotion";
import { ScreenFrame } from "../../design/motion/ScreenFrame";
import { Cursor } from "../../design/motion/Cursor";
import { FocusRing } from "../../design/motion/FocusRing";
import { Arrow } from "../../design/motion/Arrow";
import { CaptionSheet } from "../../design/motion/CaptionSheet";
import { poppins } from "../../design/fonts";

export type StepAnnotation = {
  /** Anneau lumineux collant à un élément (coords canvas 1080×1920). */
  ring?: {
    x: number;
    y: number;
    width: number;
    height: number;
    appearAt: number;
    disappearAt?: number;
    radius?: number;
  };
  /** Flèche annotée (coords canvas). */
  arrow?: {
    box: { x: number; y: number; width: number; height: number };
    d: string;
    head?: { x: number; y: number };
    headAngle?: number;
    label?: string;
    labelAt?: { x: number; y: number; align?: "left" | "right" | "center" };
    drawAt: number;
    disappearAt?: number;
  };
  /** Trajectoire du curseur (coords canvas). */
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

      {annotation.ring && (
        <FocusRing
          x={annotation.ring.x}
          y={annotation.ring.y}
          width={annotation.ring.width}
          height={annotation.ring.height}
          appearAt={annotation.ring.appearAt}
          disappearAt={annotation.ring.disappearAt}
          radius={annotation.ring.radius}
        />
      )}
      {annotation.arrow && (
        <Arrow
          x={annotation.arrow.box.x}
          y={annotation.arrow.box.y}
          width={annotation.arrow.box.width}
          height={annotation.arrow.box.height}
          d={annotation.arrow.d}
          head={annotation.arrow.head}
          headAngle={annotation.arrow.headAngle}
          label={annotation.arrow.label}
          labelAt={annotation.arrow.labelAt}
          drawAt={annotation.arrow.drawAt}
          disappearAt={annotation.arrow.disappearAt}
        />
      )}

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
