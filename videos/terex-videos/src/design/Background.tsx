import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from "remotion";
import { colors } from "./tokens";

export const Background: React.FC = () => {
  const frame = useCurrentFrame();

  const glowShift = interpolate(frame, [0, 900], [0, 30], {
    extrapolateRight: "extend",
    easing: Easing.linear,
  });

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(circle at 20% ${15 + glowShift}%, rgba(63,214,165,0.09) 0%, transparent 50%),
                     radial-gradient(circle at 80% ${85 - glowShift}%, rgba(63,214,165,0.05) 0%, transparent 55%),
                     ${colors.bg}`,
      }}
    />
  );
};
