import React from "react";
import { AbsoluteFill, Easing, Interactive, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { colors } from "../../design/tokens";
import { poppins } from "../../design/fonts";
import { PhoneFrame } from "../../design/PhoneFrame";

export type StepSceneProps = {
  index: number;
  total: number;
  title: string;
  screen: React.ReactNode;
};

export const StepScene: React.FC<StepSceneProps> = ({ index, total, title, screen }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const badgeOpacity = interpolate(frame, [0.1 * fps, 0.5 * fps], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const badgeY = interpolate(frame, [0.1 * fps, 0.5 * fps], [-20, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.16, 1, 0.3, 1) });

  const phoneScale = interpolate(frame, [0, 1 * fps], [0.94, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.16, 1, 0.3, 1) });
  const phoneOpacity = interpolate(frame, [0, 0.5 * fps], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const phoneY = interpolate(frame, [0, 1 * fps], [30, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.16, 1, 0.3, 1) });

  const captionOpacity = interpolate(frame, [0.6 * fps, 1 * fps], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const captionY = interpolate(frame, [0.6 * fps, 1 * fps], [16, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.16, 1, 0.3, 1) });

  const outOpacity = interpolate(frame, [3.5 * fps, 4 * fps], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ fontFamily: poppins, opacity: outOpacity }}>
      {/* Step chip at top */}
      <div
        style={{
          position: "absolute",
          top: 90,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          zIndex: 5,
        }}
      >
        <Interactive.Div
          name="StepChip"
          style={{
            opacity: badgeOpacity,
            translate: `0px ${badgeY}px`,
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            padding: "10px 20px",
            borderRadius: 999,
            background: "rgba(255,255,255,0.06)",
            border: `1px solid ${colors.border}`,
            backdropFilter: "blur(20px)",
            color: colors.white,
            fontSize: 22,
            fontWeight: 500,
            letterSpacing: "0.02em",
          }}
        >
          <span
            style={{
              width: 32,
              height: 32,
              borderRadius: 999,
              background: colors.brandGreen,
              color: colors.bg,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 18,
              fontWeight: 800,
            }}
          >
            {index}
          </span>
          <span style={{ color: colors.textDim, fontSize: 20, fontWeight: 400 }}>sur {total} ·</span>
          <span>{title}</span>
        </Interactive.Div>
      </div>

      {/* Phone */}
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "flex-end", paddingBottom: 180 }}>
        <Interactive.Div
          name="Phone"
          style={{
            opacity: phoneOpacity,
            translate: `0px ${phoneY}px`,
            scale: phoneScale,
          }}
        >
          <PhoneFrame>{screen}</PhoneFrame>
        </Interactive.Div>
      </AbsoluteFill>

      {/* Caption at bottom */}
      <div
        style={{
          position: "absolute",
          bottom: 60,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Interactive.Div
          name="Caption"
          style={{
            opacity: captionOpacity,
            translate: `0px ${captionY}px`,
            color: colors.textDim,
            fontSize: 26,
            fontWeight: 400,
            letterSpacing: "-0.01em",
            textAlign: "center",
            maxWidth: 900,
            padding: "0 60px",
          }}
        >
          {getCaption(index)}
        </Interactive.Div>
      </div>
    </AbsoluteFill>
  );
};

function getCaption(index: number): string {
  switch (index) {
    case 1: return "Le taux et les frais s'affichent en direct.";
    case 2: return "TRC20, Solana, Binance… choisis ton réseau.";
    case 3: return "Colle ton adresse ou pioche dans ton carnet.";
    case 4: return "On récapitule tout avant le paiement.";
    case 5: return "Un lien Wave, tu paies, c'est terminé.";
    case 6: return "Tes USDT arrivent en quelques minutes.";
    default: return "";
  }
}
