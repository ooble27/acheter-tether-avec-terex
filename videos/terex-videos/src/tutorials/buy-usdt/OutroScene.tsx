import { AbsoluteFill, Easing, Interactive, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { colors } from "../../design/tokens";
import { poppins } from "../../design/fonts";
import { BrandMark } from "../../design/BrandMark";

export const OutroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logoOpacity = interpolate(frame, [0, 0.5 * fps], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const logoY = interpolate(frame, [0, 0.7 * fps], [30, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.16, 1, 0.3, 1) });

  const ctaOpacity = interpolate(frame, [0.5 * fps, 1 * fps], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const ctaY = interpolate(frame, [0.5 * fps, 1 * fps], [30, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.16, 1, 0.3, 1) });

  const urlOpacity = interpolate(frame, [1 * fps, 1.5 * fps], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill
      style={{
        alignItems: "center",
        justifyContent: "center",
        fontFamily: poppins,
        padding: "0 80px",
        textAlign: "center",
      }}
    >
      <Interactive.Div
        name="OutroLogo"
        style={{
          opacity: logoOpacity,
          translate: `0px ${logoY}px`,
        }}
      >
        <BrandMark size={140} />
      </Interactive.Div>

      <Interactive.Div
        name="OutroCTA"
        style={{
          marginTop: 60,
          opacity: ctaOpacity,
          translate: `0px ${ctaY}px`,
          color: colors.accent,
          fontSize: 66,
          fontWeight: 700,
          letterSpacing: "-0.03em",
          lineHeight: 1.1,
          maxWidth: 900,
        }}
      >
        Prêt à acheter tes USDT ?
      </Interactive.Div>

      <Interactive.Div
        name="OutroURL"
        style={{
          marginTop: 48,
          opacity: urlOpacity,
          padding: "22px 44px",
          borderRadius: 999,
          background: colors.accent,
          color: colors.dark,
          fontSize: 34,
          fontWeight: 700,
          letterSpacing: "-0.01em",
        }}
      >
        terangaexchange.com
      </Interactive.Div>

      <Interactive.Div
        name="OutroFine"
        style={{
          marginTop: 40,
          opacity: urlOpacity,
          color: colors.muted,
          fontSize: 26,
        }}
      >
        Wave · Orange Money · USDT
      </Interactive.Div>
    </AbsoluteFill>
  );
};
