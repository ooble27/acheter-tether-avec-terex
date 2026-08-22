import { staticFile, CanvasImage } from "remotion";
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
        gap: size * 0.32,
        fontFamily: poppins,
      }}
    >
      <CanvasImage
        src={staticFile("terex-icon.png")}
        style={{
          width: size,
          height: size,
          objectFit: "contain",
        }}
      />
      {showLabel && (
        <span
          style={{
            color: colors.white,
            fontSize: size * 0.7,
            fontWeight: 700,
            letterSpacing: "-0.03em",
          }}
        >
          Terex
        </span>
      )}
    </div>
  );
};
