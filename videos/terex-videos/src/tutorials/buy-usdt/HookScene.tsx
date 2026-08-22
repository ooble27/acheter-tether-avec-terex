import { AbsoluteFill, Easing, Interactive, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { colors } from "../../design/tokens";
import { poppins } from "../../design/fonts";

export const HookScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const line1Opacity = interpolate(frame, [0, 0.35 * fps], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  const line1Y = interpolate(frame, [0, 0.5 * fps], [40, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.16, 1, 0.3, 1) });

  const line2Opacity = interpolate(frame, [0.3 * fps, 0.7 * fps], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const line2Y = interpolate(frame, [0.3 * fps, 0.8 * fps], [40, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.16, 1, 0.3, 1) });

  const badgeScale = interpolate(frame, [0.9 * fps, 1.4 * fps], [0.5, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.back(1.5)) });
  const badgeOpacity = interpolate(frame, [0.9 * fps, 1.2 * fps], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const outOpacity = interpolate(frame, [2.2 * fps, 2.5 * fps], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill
      style={{
        alignItems: "center",
        justifyContent: "center",
        fontFamily: poppins,
        opacity: outOpacity,
        padding: "0 80px",
        textAlign: "center",
      }}
    >
      <Interactive.Div
        name="Line1"
        style={{
          opacity: line1Opacity,
          translate: `0px ${line1Y}px`,
          color: colors.muted,
          fontSize: 42,
          fontWeight: 400,
          letterSpacing: "0.02em",
        }}
      >
        Ton tuto en
      </Interactive.Div>

      <Interactive.Div
        name="Line2"
        style={{
          opacity: line2Opacity,
          translate: `0px ${line2Y}px`,
          color: colors.accent,
          fontSize: 130,
          fontWeight: 800,
          letterSpacing: "-0.04em",
          lineHeight: 1.02,
          margin: "18px 0 36px",
        }}
      >
        6 étapes
      </Interactive.Div>

      <Interactive.Div
        name="Badge"
        style={{
          scale: badgeScale,
          opacity: badgeOpacity,
          padding: "16px 36px",
          borderRadius: 999,
          background: colors.card,
          border: `1px solid ${colors.border}`,
          color: colors.accent,
          fontSize: 28,
          fontWeight: 500,
        }}
      >
        Acheter des USDT
      </Interactive.Div>
    </AbsoluteFill>
  );
};
