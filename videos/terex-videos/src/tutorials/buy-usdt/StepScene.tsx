import React from "react";
import { AbsoluteFill, Easing, Interactive, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { colors } from "../../design/tokens";
import { poppins } from "../../design/fonts";
import { PhoneFrame } from "../../design/PhoneFrame";

export type StepSceneProps = {
  index: number;
  total: number;
  title: string;
  subtitle: string;
  screen: React.ReactNode;
};

export const StepScene: React.FC<StepSceneProps> = ({ index, total, title, subtitle, screen }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const badgeOpacity = interpolate(frame, [0, 0.35 * fps], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const badgeY = interpolate(frame, [0, 0.4 * fps], [-24, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.16, 1, 0.3, 1) });

  const titleOpacity = interpolate(frame, [0.15 * fps, 0.55 * fps], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const titleY = interpolate(frame, [0.15 * fps, 0.55 * fps], [26, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.16, 1, 0.3, 1) });

  const subOpacity = interpolate(frame, [0.35 * fps, 0.75 * fps], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const phoneScale = interpolate(frame, [0.3 * fps, 1 * fps], [0.92, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.16, 1, 0.3, 1) });
  const phoneOpacity = interpolate(frame, [0.3 * fps, 0.7 * fps], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const phoneY = interpolate(frame, [0.3 * fps, 1 * fps], [40, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.16, 1, 0.3, 1) });

  // Outro fade
  const outOpacity = interpolate(frame, [3.5 * fps, 4 * fps], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ fontFamily: poppins, opacity: outOpacity }}>
      {/* Header */}
      <div
        style={{
          padding: "70px 80px 0",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        <Interactive.Div
          name="StepBadge"
          style={{
            opacity: badgeOpacity,
            translate: `0px ${badgeY}px`,
            padding: "10px 22px",
            borderRadius: 999,
            background: "rgba(255,255,255,0.06)",
            border: `1px solid ${colors.border}`,
            color: colors.muted,
            fontSize: 24,
            fontWeight: 500,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          Étape {index} / {total}
        </Interactive.Div>

        <Interactive.Div
          name="StepTitle"
          style={{
            marginTop: 22,
            opacity: titleOpacity,
            translate: `0px ${titleY}px`,
            color: colors.accent,
            fontSize: 78,
            fontWeight: 700,
            letterSpacing: "-0.03em",
            lineHeight: 1.05,
          }}
        >
          {title}
        </Interactive.Div>

        <Interactive.Div
          name="StepSubtitle"
          style={{
            marginTop: 14,
            opacity: subOpacity,
            color: colors.muted,
            fontSize: 30,
            fontWeight: 400,
            maxWidth: 800,
          }}
        >
          {subtitle}
        </Interactive.Div>
      </div>

      {/* Phone with screen */}
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "flex-end", paddingBottom: 60 }}>
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
    </AbsoluteFill>
  );
};
