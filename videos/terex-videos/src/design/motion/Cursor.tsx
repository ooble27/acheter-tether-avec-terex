import { Easing, interpolate, useCurrentFrame } from "remotion";

type Point = { x: number; y: number };

type Props = {
  /** Trajectoire du curseur — chaque point atteint dans l'ordre. */
  path: { at: number; to: Point }[];
  /** Frames où un tap ripple part depuis le curseur. */
  taps?: number[];
  /** Frame où le curseur apparaît (opacity in). Par défaut 0. */
  appearAt?: number;
  /** Frame où le curseur disparaît. */
  disappearAt?: number;
};

/**
 * Curseur/pointeur promo (façon Apple/Claude Code) qui glisse
 * entre des points et laisse des ripples à chaque tap.
 */
export const Cursor: React.FC<Props> = ({ path, taps = [], appearAt = 0, disappearAt }) => {
  const frame = useCurrentFrame();

  // interpolate through path segments
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

  const inOpacity = interpolate(frame, [appearAt, appearAt + 8], [0, 1], {
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

  // press scale on nearest tap
  let pressScale = 1;
  for (const t of taps) {
    if (frame >= t - 3 && frame <= t + 3) {
      pressScale = interpolate(Math.abs(frame - t), [0, 3], [0.85, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });
    }
  }

  return (
    <>
      {/* Ripples */}
      {taps.map((t) => {
        if (frame < t || frame > t + 30) return null;
        const r = interpolate(frame, [t, t + 30], [0, 180], {
          easing: Easing.out(Easing.cubic),
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        const op = interpolate(frame, [t, t + 30], [0.45, 0], {
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
              border: "3px solid rgba(255,255,255,0.9)",
              opacity: op,
              pointerEvents: "none",
            }}
          />
        );
      })}

      {/* Pointer */}
      <div
        style={{
          position: "absolute",
          left: x - 12,
          top: y - 12,
          width: 44,
          height: 44,
          opacity: inOpacity * outOpacity,
          scale: pressScale,
          pointerEvents: "none",
          filter: "drop-shadow(0 4px 14px rgba(0,0,0,0.55))",
        }}
      >
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.95)",
            border: "3px solid rgba(0,0,0,0.25)",
          }}
        />
      </div>
    </>
  );
};
