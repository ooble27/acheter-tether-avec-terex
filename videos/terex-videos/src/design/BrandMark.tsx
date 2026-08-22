import { colors } from "./tokens";
import { poppins } from "./fonts";

export const BrandMark: React.FC<{ size?: number; showLabel?: boolean }> = ({
  size = 64,
  showLabel = true,
}) => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: size * 0.28,
        fontFamily: poppins,
      }}
    >
      <div
        style={{
          width: size,
          height: size,
          borderRadius: size * 0.24,
          background: `linear-gradient(135deg, ${colors.accent} 0%, ${colors.accentDim} 100%)`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 8px 32px rgba(255,255,255,0.14)",
        }}
      >
        <span
          style={{
            color: colors.dark,
            fontWeight: 800,
            fontSize: size * 0.55,
            letterSpacing: "-0.04em",
            lineHeight: 1,
          }}
        >
          T
        </span>
      </div>
      {showLabel && (
        <span
          style={{
            color: colors.accent,
            fontSize: size * 0.62,
            fontWeight: 700,
            letterSpacing: "-0.02em",
          }}
        >
          terex
        </span>
      )}
    </div>
  );
};
