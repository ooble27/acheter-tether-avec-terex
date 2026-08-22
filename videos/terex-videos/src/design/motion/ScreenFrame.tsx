import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { colors } from "../tokens";

type Props = {
  children: React.ReactNode;
  /** Camera zoom target (default: none). */
  focus?: { x: number; y: number; scale: number; from: number; to: number };
  /** Frame où l'écran entre par le côté (slide + fade). */
  enterAt?: number;
  /** Frame où l'écran sort. */
  exitAt?: number;
  /** Sens d'entrée. */
  enterFrom?: "right" | "left" | "bottom" | "none";
};

/**
 * Conteneur "vue app" — occupe presque tout le cadre 1080x1920.
 * On y met les écrans Terex full-bleed, avec camera zoom optionnel
 * (translate + scale) pour attirer l'attention sur une zone.
 *
 * Le conteneur mesure toujours 960x1780 centré (marges 60px), affichant
 * le contenu réel Terex au ratio ~1:1.85 (proche du mobile).
 */
export const ScreenFrame: React.FC<Props> = ({
  children,
  focus,
  enterAt = 0,
  exitAt,
  enterFrom = "right",
}) => {
  const frame = useCurrentFrame();

  // enter transition (slide + fade)
  const enterProgress = interpolate(
    frame,
    [enterAt, enterAt + 22],
    [0, 1],
    {
      easing: Easing.bezier(0.16, 1, 0.3, 1),
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );
  const enterOffset = 380 * (1 - enterProgress);
  const enterOpacity = interpolate(
    frame,
    [enterAt, enterAt + 14],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  let tx = 0;
  let ty = 0;
  if (enterFrom === "right") tx = enterOffset;
  else if (enterFrom === "left") tx = -enterOffset;
  else if (enterFrom === "bottom") ty = enterOffset;

  // exit transition (slide left + fade) — tight 10 frames
  let exitOpacity = 1;
  let exitTx = 0;
  if (exitAt !== undefined) {
    exitOpacity = interpolate(
      frame,
      [exitAt - 8, exitAt],
      [1, 0],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
    );
    exitTx = interpolate(frame, [exitAt - 10, exitAt], [0, -220], {
      easing: Easing.bezier(0.4, 0, 0.7, 0.4),
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
  }

  // camera zoom (translate + scale toward focus point)
  let camScale = 1;
  let camTx = 0;
  let camTy = 0;
  if (focus) {
    const p = interpolate(frame, [focus.from, focus.to], [0, 1], {
      easing: Easing.bezier(0.4, 0, 0.2, 1),
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    camScale = 1 + (focus.scale - 1) * p;
    // move the focused point toward the center
    const centerX = 540;
    const centerY = 960;
    camTx = (centerX - focus.x) * (camScale - 1) * p;
    camTy = (centerY - focus.y) * (camScale - 1) * p;
  }

  const containerWidth = 960;
  const containerHeight = 1780;

  return (
    <div
      style={{
        position: "absolute",
        left: (1080 - containerWidth) / 2,
        top: (1920 - containerHeight) / 2,
        width: containerWidth,
        height: containerHeight,
        borderRadius: 56,
        overflow: "hidden",
        background: colors.bg,
        boxShadow:
          "0 40px 120px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.06)",
        opacity: enterOpacity * exitOpacity,
        translate: `${tx + exitTx}px ${ty}px`,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          scale: camScale,
          translate: `${camTx}px ${camTy}px`,
          transformOrigin: focus ? `${focus.x}px ${focus.y}px` : "center",
        }}
      >
        {/* Terex screens are natively 480px wide (mobile). We upscale x2 to fill 960px. */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            transform: "scale(2)",
            transformOrigin: "top left",
            width: 480,
            height: 890,
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export const SCREEN_ORIGIN = {
  left: (1080 - 960) / 2, // 60
  top: (1920 - 1780) / 2, // 70
  width: 960,
  height: 1780,
};
