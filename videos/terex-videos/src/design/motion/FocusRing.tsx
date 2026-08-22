import { Easing, interpolate, useCurrentFrame } from "remotion";

type Props = {
  x: number;
  y: number;
  width: number;
  height: number;
  appearAt: number;
  disappearAt?: number;
  radius?: number;
  color?: string;
};

/**
 * Anneau lumineux qui pulse autour d'une cible.
 * Similaire aux annotations Apple / Claude Code.
 */
export const FocusRing: React.FC<Props> = ({
  x,
  y,
  width,
  height,
  appearAt,
  disappearAt,
  radius = 18,
  color = "rgba(63, 214, 165, 0.95)",
}) => {
  const frame = useCurrentFrame();

  const inOpacity = interpolate(frame, [appearAt, appearAt + 10], [0, 1], {
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
  const scale = interpolate(frame, [appearAt, appearAt + 20], [0.9, 1], {
    easing: Easing.out(Easing.back(1.4)),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // subtle pulse
  const pulse = 1 + 0.02 * Math.sin(((frame - appearAt) / 15) * Math.PI);

  return (
    <div
      style={{
        position: "absolute",
        left: x - 6,
        top: y - 6,
        width: width + 12,
        height: height + 12,
        borderRadius: radius,
        border: `2.5px solid ${color}`,
        boxShadow: `0 0 0 3px rgba(63,214,165,0.15), 0 0 44px ${color}`,
        opacity: inOpacity * outOpacity,
        scale: scale * pulse,
        pointerEvents: "none",
      }}
    />
  );
};
