import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { colors } from "../../design/tokens";
import { poppins } from "../../design/fonts";
import { BrandMark } from "../../design/BrandMark";

/**
 * Outro : brandmark, gros CTA blanc→vert, bouton pill URL, ligne fine avec
 * les moyens de paiement. Toute la scène respire ("breathing" scale léger)
 * et la pill URL glisse en dernier.
 */
export const OutroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logoOpacity = interpolate(frame, [0, 0.5 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const logoScale = interpolate(frame, [0, 0.9 * fps], [0.7, 1], {
    easing: Easing.out(Easing.back(1.4)),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const ctaOpacity = interpolate(frame, [0.4 * fps, 1 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const ctaY = interpolate(frame, [0.4 * fps, 1 * fps], [30, 0], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const urlOpacity = interpolate(frame, [1 * fps, 1.5 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const urlY = interpolate(frame, [1 * fps, 1.5 * fps], [30, 0], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  // pulsing highlight around the URL pill
  const urlGlow = interpolate(frame, [1.4 * fps, 3 * fps], [0.3, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "extend",
  });
  const urlPulse = 0.5 + 0.5 * Math.sin((frame / 12) * Math.PI);

  const fineOpacity = interpolate(frame, [1.6 * fps, 2 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

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
      <div
        style={{
          opacity: logoOpacity,
          scale: logoScale,
        }}
      >
        <BrandMark size={140} />
      </div>

      <div
        style={{
          marginTop: 44,
          opacity: ctaOpacity,
          translate: `0px ${ctaY}px`,
          fontSize: 96,
          fontWeight: 800,
          letterSpacing: "-0.04em",
          lineHeight: 1.02,
          maxWidth: 950,
          background: `linear-gradient(180deg, #ffffff 0%, ${colors.brandGreen} 100%)`,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}
      >
        Achète tes USDT
        <br />
        maintenant
      </div>

      <div
        style={{
          marginTop: 50,
          opacity: urlOpacity,
          translate: `0px ${urlY}px`,
          padding: "26px 56px",
          borderRadius: 999,
          background: colors.white,
          color: colors.onWhite,
          fontSize: 44,
          fontWeight: 800,
          letterSpacing: "-0.02em",
          boxShadow: `0 24px 60px rgba(63,214,165,${(0.15 + urlGlow * 0.25) * urlPulse}), 0 0 0 3px rgba(63,214,165,${0.4 * urlPulse})`,
        }}
      >
        terangaexchange.com
      </div>

      <div
        style={{
          position: "absolute",
          bottom: 140,
          opacity: fineOpacity,
          color: "rgba(255,255,255,0.55)",
          fontSize: 26,
          display: "flex",
          alignItems: "center",
          gap: 16,
        }}
      >
        <span>Wave</span>
        <span style={{ opacity: 0.4 }}>·</span>
        <span>Orange Money</span>
        <span style={{ opacity: 0.4 }}>·</span>
        <span>USDT en 5 min</span>
      </div>
    </AbsoluteFill>
  );
};
