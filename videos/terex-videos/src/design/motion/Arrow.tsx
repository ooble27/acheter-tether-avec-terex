import { Easing, interpolate, useCurrentFrame } from "remotion";

type Props = {
  /** Absolute positioned bounding box (px). */
  x: number;
  y: number;
  width: number;
  height: number;
  /** Frame où la flèche commence à se tracer. */
  drawAt: number;
  /** Durée du tracé (frames). Défaut 18. */
  drawDuration?: number;
  /** Frame où la flèche disparaît. */
  disappearAt?: number;
  /** Label court à afficher près de la pointe. */
  label?: string;
  /** SVG path pour la ligne (dans le viewBox du bounding box). */
  d: string;
  /** Angle pour orienter la pointe (deg). */
  headAngle?: number;
  /** Position de la pointe (px dans le bounding box). */
  head?: { x: number; y: number };
  /** Position du label (px dans le bounding box). */
  labelAt?: { x: number; y: number; align?: "left" | "right" | "center" };
  color?: string;
};

/**
 * Flèche annotative dessinée à la main (style Apple / Excalidraw).
 * Elle se trace en 18 frames par défaut puis affiche la pointe et le label.
 */
export const Arrow: React.FC<Props> = ({
  x,
  y,
  width,
  height,
  drawAt,
  drawDuration = 18,
  disappearAt,
  label,
  d,
  headAngle = 0,
  head,
  labelAt,
  color = "rgba(63, 214, 165, 1)",
}) => {
  const frame = useCurrentFrame();

  const progress = interpolate(
    frame,
    [drawAt, drawAt + drawDuration],
    [0, 1],
    {
      easing: Easing.bezier(0.4, 0, 0.2, 1),
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  const headOpacity = interpolate(
    frame,
    [drawAt + drawDuration - 3, drawAt + drawDuration + 4],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const labelOpacity = interpolate(
    frame,
    [drawAt + drawDuration, drawAt + drawDuration + 8],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const outOpacity =
    disappearAt !== undefined
      ? interpolate(frame, [disappearAt - 10, disappearAt], [1, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })
      : 1;

  const pathLen = 600; // rough visual length; strokeDasharray covers all
  const dashOffset = pathLen * (1 - progress);

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width,
        height,
        opacity: outOpacity,
        pointerEvents: "none",
      }}
    >
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        style={{ overflow: "visible" }}
      >
        <path
          d={d}
          fill="none"
          stroke={color}
          strokeWidth={5}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray={pathLen}
          strokeDashoffset={dashOffset}
          style={{
            filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.35))",
          }}
        />
        {head && (
          <g
            transform={`translate(${head.x}, ${head.y}) rotate(${headAngle})`}
            style={{ opacity: headOpacity }}
          >
            <path
              d="M0 0 L -22 -12 L -16 0 L -22 12 Z"
              fill={color}
              style={{ filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.35))" }}
            />
          </g>
        )}
      </svg>
      {label && labelAt && (
        <div
          style={{
            position: "absolute",
            left: labelAt.x,
            top: labelAt.y,
            transform:
              labelAt.align === "center"
                ? "translateX(-50%)"
                : labelAt.align === "right"
                  ? "translateX(-100%)"
                  : "none",
            opacity: labelOpacity,
            color: "#fff",
            fontSize: 30,
            fontWeight: 700,
            letterSpacing: "-0.01em",
            padding: "8px 16px",
            borderRadius: 999,
            background: color,
            boxShadow: "0 8px 24px rgba(0,0,0,0.35)",
            whiteSpace: "nowrap",
          }}
        >
          {label}
        </div>
      )}
    </div>
  );
};
