import { AbsoluteFill } from "remotion";
import { ScreenFrame, SCREEN_ORIGIN } from "../../design/motion/ScreenFrame";
import { Cursor } from "../../design/motion/Cursor";
import { FocusRing } from "../../design/motion/FocusRing";
import { Arrow } from "../../design/motion/Arrow";
import { CaptionSheet } from "../../design/motion/CaptionSheet";
import { poppins } from "../../design/fonts";

export type StepAnnotation = {
  /** Camera zoom into a screen region. Coords en px dans le ScreenFrame (960x1780). */
  focus?: { x: number; y: number; scale: number; from: number; to: number };
  /** Anneau lumineux autour d'une cible. Coords en px dans le ScreenFrame. */
  ring?: { x: number; y: number; width: number; height: number; appearAt: number; disappearAt?: number; radius?: number };
  /** Flèche annotée. Position et forme définies par l'appelant. */
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
  /** Trajectoire du curseur (coords absolues dans le 1080x1920). */
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

/**
 * Convertit une position "dans le ScreenFrame" (960x1780) en position absolue
 * dans le canvas 1080x1920 (utile pour le curseur qui vit hors du frame).
 */
export const toAbs = (x: number, y: number) => ({
  x: SCREEN_ORIGIN.left + x,
  y: SCREEN_ORIGIN.top + y,
});

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
      <ScreenFrame
        enterAt={enterAt}
        exitAt={exitAt}
        enterFrom="right"
        focus={annotation.focus}
      >
        {screen}
      </ScreenFrame>

      {/* Overlays positioned relative to the ScreenFrame origin */}
      <div
        style={{
          position: "absolute",
          left: SCREEN_ORIGIN.left,
          top: SCREEN_ORIGIN.top,
          width: SCREEN_ORIGIN.width,
          height: SCREEN_ORIGIN.height,
          pointerEvents: "none",
        }}
      >
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
      </div>

      {/* Cursor lives on the full canvas */}
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
