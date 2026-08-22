import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from "remotion";
import { colors } from "./tokens";

export const Background: React.FC = () => {
  const frame = useCurrentFrame();

  const glowShift = interpolate(frame, [0, 600], [0, 40], {
    extrapolateRight: "extend",
    easing: Easing.linear,
  });

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(circle at 30% ${20 + glowShift}%, rgba(255,255,255,0.06) 0%, transparent 50%),
                     radial-gradient(circle at 70% ${80 - glowShift}%, rgba(96,165,250,0.05) 0%, transparent 55%),
                     ${colors.darker}`,
      }}
    >
      {/* Subtle grain layer */}
      <AbsoluteFill
        style={{
          opacity: 0.4,
          backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.08'/></svg>")`,
        }}
      />
    </AbsoluteFill>
  );
};
