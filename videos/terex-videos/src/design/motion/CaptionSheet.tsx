import { Easing, interpolate, useCurrentFrame } from "remotion";
import { colors } from "../tokens";
import { poppins } from "../fonts";

type Props = {
  step: number;
  total: number;
  title: string;
  hint?: string;
  appearAt?: number;
  disappearAt?: number;
};

/**
 * Panneau flottant en bas de l'écran qui annonce l'étape courante.
 * S'inspire des sous-titres promo Apple / Claude Code.
 */
export const CaptionSheet: React.FC<Props> = ({
  step,
  total,
  title,
  hint,
  appearAt = 0,
  disappearAt,
}) => {
  const frame = useCurrentFrame();

  const inOpacity = interpolate(frame, [appearAt, appearAt + 12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const inTranslate = interpolate(frame, [appearAt, appearAt + 18], [40, 0], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const outOpacity =
    disappearAt !== undefined
      ? interpolate(frame, [disappearAt - 10, disappearAt], [1, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })
      : 1;

  return (
    <div
      style={{
        position: "absolute",
        left: 60,
        right: 60,
        bottom: 90,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: 14,
        opacity: inOpacity * outOpacity,
        translate: `0px ${inTranslate}px`,
        fontFamily: poppins,
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 10,
          padding: "8px 16px",
          borderRadius: 999,
          background: "rgba(255,255,255,0.10)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(255,255,255,0.14)",
          color: colors.white,
          fontSize: 24,
          fontWeight: 600,
          letterSpacing: "0.02em",
        }}
      >
        <span
          style={{
            width: 30,
            height: 30,
            borderRadius: "50%",
            background: colors.brandGreen,
            color: "#062018",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 18,
            fontWeight: 800,
          }}
        >
          {step}
        </span>
        <span>Étape {step} sur {total}</span>
      </div>
      <div
        style={{
          color: colors.white,
          fontSize: 62,
          fontWeight: 700,
          letterSpacing: "-0.03em",
          lineHeight: 1.05,
          textShadow: "0 4px 24px rgba(0,0,0,0.5)",
        }}
      >
        {title}
      </div>
      {hint && (
        <div
          style={{
            color: "rgba(255,255,255,0.75)",
            fontSize: 30,
            fontWeight: 400,
            letterSpacing: "-0.01em",
            lineHeight: 1.3,
            textShadow: "0 2px 14px rgba(0,0,0,0.5)",
          }}
        >
          {hint}
        </div>
      )}
    </div>
  );
};
