import { AbsoluteFill, Easing, Interactive, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { colors } from "../../design/tokens";
import { poppins } from "../../design/fonts";
import { BrandMark } from "../../design/BrandMark";

export const IntroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logoScale = interpolate(frame, [0, 0.9 * fps], [0.6, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  const logoOpacity = interpolate(frame, [0, 0.4 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const taglineOpacity = interpolate(frame, [0.8 * fps, 1.3 * fps, 2.2 * fps, 2.5 * fps], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  const taglineTranslate = interpolate(frame, [0.8 * fps, 1.4 * fps], [18, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  const outOpacity = interpolate(frame, [2.2 * fps, 2.5 * fps], [1, 0], {
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
      }}
    >
      <Interactive.Div
        name="Logo"
        style={{
          scale: logoScale,
          opacity: logoOpacity,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <BrandMark size={180} />
      </Interactive.Div>

      <Interactive.Div
        name="Tagline"
        style={{
          marginTop: 44,
          opacity: taglineOpacity,
          translate: `0px ${taglineTranslate}px`,
          color: colors.muted,
          fontSize: 34,
          fontWeight: 400,
          letterSpacing: "0.02em",
        }}
      >
        Achetez des USDT en toute simplicité
      </Interactive.Div>
    </AbsoluteFill>
  );
};
