import { Easing, interpolate, useCurrentFrame } from "remotion";

type Point = { x: number; y: number };

type Props = {
  /** Trajectoire du curseur — chaque point atteint dans l'ordre. */
  path: { at: number; to: Point }[];
  /** Frames où un tap ripple part depuis le curseur. */
  taps?: number[];
  /** Frame où le curseur apparaît. */
  appearAt?: number;
  /** Frame où le curseur disparaît. */
  disappearAt?: number;
};

/**
 * Curseur macOS classique — flèche noire cerclée de blanc, tip en haut à gauche.
 * Le SVG reproduit le pointeur système Mac (24×24 → scale x1.9 pour être visible).
 */
export const Cursor: React.FC<Props> = ({ path, taps = [], appearAt = 0, disappearAt }) => {
  const frame = useCurrentFrame();

  let x = path[0]?.to.x ?? 0;
  let y = path[0]?.to.y ?? 0;
  for (let i = 0; i < path.length - 1; i++) {
    const a = path[i];
    const b = path[i + 1];
    if (frame >= a.at && frame <= b.at) {
      x = interpolate(frame, [a.at, b.at], [a.to.x, b.to.x], {
        easing: Easing.bezier(0.4, 0, 0.2, 1),
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });
      y = interpolate(frame, [a.at, b.at], [a.to.y, b.to.y], {
        easing: Easing.bezier(0.4, 0, 0.2, 1),
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });
    } else if (frame > b.at) {
      x = b.to.x;
      y = b.to.y;
    }
  }

  const inOpacity = interpolate(frame, [appearAt, appearAt + 6], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const outOpacity =
    disappearAt !== undefined
      ? interpolate(frame, [disappearAt - 6, disappearAt], [1, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })
      : 1;

  // On press, cursor scales slightly down like a real mouse click
  let pressScale = 1;
  for (const t of taps) {
    if (frame >= t - 3 && frame <= t + 4) {
      pressScale = interpolate(Math.abs(frame - t), [0, 3], [0.88, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });
    }
  }

  // Cursor "hit point" is the top-left tip of the arrow (0,0 in SVG).
  // We render the arrow so its tip lands exactly at (x, y).
  const cursorSize = 60;

  return (
    <>
      {/* Ripples émanant de la POINTE du curseur */}
      {taps.map((t) => {
        if (frame < t || frame > t + 32) return null;
        const r = interpolate(frame, [t, t + 32], [0, 220], {
          easing: Easing.out(Easing.cubic),
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        const op = interpolate(frame, [t, t + 32], [0.55, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        return (
          <div
            key={t}
            style={{
              position: "absolute",
              left: x - r,
              top: y - r,
              width: r * 2,
              height: r * 2,
              borderRadius: "50%",
              border: "4px solid rgba(255,255,255,0.95)",
              opacity: op,
              pointerEvents: "none",
              boxShadow: `0 0 40px rgba(255,255,255,${op * 0.5})`,
            }}
          />
        );
      })}

      {/* Flèche curseur macOS */}
      <div
        style={{
          position: "absolute",
          left: x - 2,
          top: y - 2,
          width: cursorSize,
          height: cursorSize,
          opacity: inOpacity * outOpacity,
          scale: pressScale,
          transformOrigin: "top left",
          filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.55))",
          pointerEvents: "none",
        }}
      >
        <svg
          width={cursorSize}
          height={cursorSize}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Classic macOS pointer — black arrow with white outline */}
          <path
            d="M4 2 L4 18.5 L8.2 14.3 L11 20.5 L13.4 19.4 L10.6 13.2 L16.5 13.2 Z"
            fill="#ffffff"
            stroke="#ffffff"
            strokeWidth="2.6"
            strokeLinejoin="round"
          />
          <path
            d="M4 2 L4 18.5 L8.2 14.3 L11 20.5 L13.4 19.4 L10.6 13.2 L16.5 13.2 Z"
            fill="#111111"
            stroke="none"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </>
  );
};
