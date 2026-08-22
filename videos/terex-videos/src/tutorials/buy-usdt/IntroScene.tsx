import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { colors } from "../../design/tokens";
import { poppins } from "../../design/fonts";
import { BrandMark } from "../../design/BrandMark";

/**
 * Intro cinématique : brandmark qui apparaît, puis un gros titre
 * bicolore ("USDT" en dégradé vert Terex, "en 6 étapes" blanc)
 * qui s'agrandit avec un léger blur→focus. Sortie fade+scale.
 */
export const IntroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // brandmark
  const logoOpacity = interpolate(frame, [0, 0.35 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const logoY = interpolate(frame, [0, 0.5 * fps], [30, 0], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // "USDT" big word
  const usdtOpacity = interpolate(frame, [0.4 * fps, 0.85 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const usdtScale = interpolate(frame, [0.4 * fps, 1.1 * fps], [0.7, 1], {
    easing: Easing.out(Easing.back(1.6)),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const usdtBlur = interpolate(frame, [0.4 * fps, 0.9 * fps], [18, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // "en 6 étapes"
  const stepsOpacity = interpolate(frame, [1 * fps, 1.4 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const stepsY = interpolate(frame, [1 * fps, 1.5 * fps], [30, 0], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // hint line at bottom
  const hintOpacity = interpolate(frame, [1.6 * fps, 2 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const outOpacity = interpolate(frame, [2.4 * fps, 2.9 * fps], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const outScale = interpolate(frame, [2.4 * fps, 3 * fps], [1, 1.08], {
    easing: Easing.in(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        alignItems: "center",
        justifyContent: "center",
        fontFamily: poppins,
        opacity: outOpacity,
        scale: outScale,
      }}
    >
      <div
        style={{
          opacity: logoOpacity,
          translate: `0px ${logoY}px`,
          marginBottom: 44,
        }}
      >
        <BrandMark size={110} />
      </div>

      <div
        style={{
          opacity: usdtOpacity,
          scale: usdtScale,
          filter: `blur(${usdtBlur}px)`,
          fontSize: 300,
          fontWeight: 800,
          letterSpacing: "-0.08em",
          lineHeight: 0.9,
          background: `linear-gradient(180deg, #ffffff 0%, ${colors.brandGreen} 100%)`,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          textShadow: "0 20px 80px rgba(63,214,165,0.25)",
        }}
      >
        USDT
      </div>

      <div
        style={{
          opacity: stepsOpacity,
          translate: `0px ${stepsY}px`,
          marginTop: 24,
          color: "#fff",
          fontSize: 82,
          fontWeight: 700,
          letterSpacing: "-0.04em",
          lineHeight: 1,
        }}
      >
        en 6 étapes
      </div>

      <div
        style={{
          position: "absolute",
          bottom: 180,
          opacity: hintOpacity,
          color: "rgba(255,255,255,0.55)",
          fontSize: 28,
          fontWeight: 400,
          letterSpacing: "0.02em",
        }}
      >
        Tutoriel pour acheter sur Terex
      </div>
    </AbsoluteFill>
  );
};
