import { AbsoluteFill, Easing, Interactive, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { colors } from "../../design/tokens";
import { poppins } from "../../design/fonts";

export const HookScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const line1Opacity = interpolate(frame, [0, 0.35 * fps], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  const line1Y = interpolate(frame, [0, 0.5 * fps], [30, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.16, 1, 0.3, 1) });

  const numberScale = interpolate(frame, [0.3 * fps, 0.9 * fps], [0.5, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.back(1.4)) });
  const numberOpacity = interpolate(frame, [0.3 * fps, 0.7 * fps], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const line3Opacity = interpolate(frame, [0.8 * fps, 1.2 * fps], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const line3Y = interpolate(frame, [0.8 * fps, 1.2 * fps], [20, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.16, 1, 0.3, 1) });

  const outOpacity = interpolate(frame, [2.1 * fps, 2.5 * fps], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill
      style={{
        alignItems: "center",
        justifyContent: "center",
        fontFamily: poppins,
        opacity: outOpacity,
        padding: "0 60px",
        textAlign: "center",
      }}
    >
      <Interactive.Div
        name="Line1"
        style={{
          opacity: line1Opacity,
          translate: `0px ${line1Y}px`,
          color: colors.textDim,
          fontSize: 38,
          fontWeight: 400,
        }}
      >
        Ton USDT en
      </Interactive.Div>

      <Interactive.Div
        name="BigNumber"
        style={{
          opacity: numberOpacity,
          scale: numberScale,
          margin: "18px 0 30px",
          fontSize: 220,
          fontWeight: 800,
          letterSpacing: "-0.06em",
          lineHeight: 1,
          background: `linear-gradient(180deg, ${colors.white} 0%, ${colors.brandGreen} 100%)`,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}
      >
        6
      </Interactive.Div>

      <Interactive.Div
        name="Line3"
        style={{
          opacity: line3Opacity,
          translate: `0px ${line3Y}px`,
          color: colors.white,
          fontSize: 44,
          fontWeight: 600,
          letterSpacing: "-0.02em",
        }}
      >
        étapes simples
      </Interactive.Div>
    </AbsoluteFill>
  );
};
