import { AbsoluteFill, Easing, Interactive, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { colors } from "../../design/tokens";
import { poppins } from "../../design/fonts";
import { BrandMark } from "../../design/BrandMark";

export const OutroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logoOpacity = interpolate(frame, [0, 0.6 * fps], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const logoScale = interpolate(frame, [0, 0.9 * fps], [0.8, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });

  const ctaOpacity = interpolate(frame, [0.5 * fps, 1 * fps], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const ctaY = interpolate(frame, [0.5 * fps, 1 * fps], [24, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.16, 1, 0.3, 1) });

  const urlOpacity = interpolate(frame, [1 * fps, 1.5 * fps], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const urlY = interpolate(frame, [1 * fps, 1.5 * fps], [20, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.16, 1, 0.3, 1) });

  const fineOpacity = interpolate(frame, [1.5 * fps, 2 * fps], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill
      style={{
        alignItems: "center",
        justifyContent: "center",
        fontFamily: poppins,
        padding: "0 60px",
        textAlign: "center",
      }}
    >
      <Interactive.Div
        name="OutroLogo"
        style={{
          opacity: logoOpacity,
          scale: logoScale,
        }}
      >
        <BrandMark size={160} />
      </Interactive.Div>

      <Interactive.Div
        name="OutroCTA"
        style={{
          marginTop: 50,
          opacity: ctaOpacity,
          translate: `0px ${ctaY}px`,
          color: colors.white,
          fontSize: 60,
          fontWeight: 700,
          letterSpacing: "-0.03em",
          lineHeight: 1.15,
          maxWidth: 900,
        }}
      >
        Achète tes USDT dès maintenant
      </Interactive.Div>

      <Interactive.Div
        name="OutroURL"
        style={{
          marginTop: 44,
          opacity: urlOpacity,
          translate: `0px ${urlY}px`,
          padding: "20px 44px",
          borderRadius: 999,
          background: colors.white,
          color: colors.onWhite,
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
          opacity: fineOpacity,
          color: colors.textDim,
          fontSize: 24,
          display: "flex",
          alignItems: "center",
          gap: 14,
        }}
      >
        <span>Wave</span>
        <span style={{ opacity: 0.35 }}>·</span>
        <span>Orange Money</span>
        <span style={{ opacity: 0.35 }}>·</span>
        <span>USDT</span>
      </Interactive.Div>
    </AbsoluteFill>
  );
};
