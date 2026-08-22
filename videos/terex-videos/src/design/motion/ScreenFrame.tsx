import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { colors } from "../tokens";

/**
 * Écran Terex plein-écran (1080×1920) — sans cadre, sans ombre, sans marges.
 * Le contenu Terex est écrit en tailles natives 480×N, on l'upscale à 2.25x
 * pour couvrir exactement les 1080 px de large (480 × 2.25 = 1080).
 *
 * Transitions d'entrée / sortie : slide horizontal net (10 frames).
 */

const SCALE = 2.25;
const NATIVE_WIDTH = 480;
export const CANVAS_W = 1080;
export const CANVAS_H = 1920;
/** Facteur pour convertir des coords "shell Terex" (natives 480) vers canvas. */
export const SHELL_TO_CANVAS = SCALE;

type Props = {
  children: React.ReactNode;
  enterAt?: number;
  exitAt?: number;
  enterFrom?: "right" | "left" | "none";
};

export const ScreenFrame: React.FC<Props> = ({
  children,
  enterAt = 0,
  exitAt,
  enterFrom = "right",
}) => {
  const frame = useCurrentFrame();

  // Enter (slide + fade)
  const enterProgress = interpolate(frame, [enterAt, enterAt + 14], [0, 1], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const enterOpacity = interpolate(frame, [enterAt, enterAt + 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const enterOffset = (1 - enterProgress) * (enterFrom === "left" ? -CANVAS_W : CANVAS_W);
  const tx = enterFrom === "none" ? 0 : enterOffset;

  // Exit (slide + fade)
  let exitOpacity = 1;
  let exitTx = 0;
  if (exitAt !== undefined) {
    exitOpacity = interpolate(frame, [exitAt - 8, exitAt], [1, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    exitTx = interpolate(frame, [exitAt - 10, exitAt], [0, -240], {
      easing: Easing.bezier(0.4, 0, 0.7, 0.4),
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
  }

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: colors.bg,
        overflow: "hidden",
        opacity: enterOpacity * exitOpacity,
        translate: `${tx + exitTx}px 0px`,
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: NATIVE_WIDTH,
          height: CANVAS_H / SCALE,
          transform: `scale(${SCALE})`,
          transformOrigin: "top left",
        }}
      >
        {children}
      </div>
    </div>
  );
};
