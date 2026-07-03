import { CircleDollarSign, Wallet, Smartphone, Globe, ShieldCheck, Boxes, type LucideIcon } from "lucide-react";

type CoverConfig = {
  icon: LucideIcon;
  tag: string;
  /** decorative motif variant — keeps the set coherent but not identical */
  motif: "rings" | "grid" | "arcs" | "orbit" | "shield" | "stack";
};

export const ARTICLE_COVERS: Record<string, CoverConfig> = {
  "comprendre-usdt-stablecoin": { icon: CircleDollarSign, tag: "Stablecoin", motif: "rings" },
  "acheter-usdt-terex-guide": { icon: Wallet, tag: "Guide", motif: "grid" },
  "mobile-money-crypto": { icon: Smartphone, tag: "Mobile Money", motif: "arcs" },
  "transferts-internationaux": { icon: Globe, tag: "Transferts", motif: "orbit" },
  "securite-crypto": { icon: ShieldCheck, tag: "Sécurité", motif: "shield" },
  "blockchain-simple": { icon: Boxes, tag: "Blockchain", motif: "stack" },
};

const STROKE = "rgba(255,255,255,0.09)";
const STROKE_SOFT = "rgba(255,255,255,0.05)";

function Motif({ motif, uid }: { motif: CoverConfig["motif"]; uid: string }) {
  // Each motif is drawn on a 400x300 viewBox, centered, low-opacity — a quiet
  // geometric texture behind the icon tile. Monochrome, on-brand, no color.
  const common = { fill: "none", stroke: STROKE, strokeWidth: 1 } as const;
  return (
    <svg
      viewBox="0 0 400 300"
      preserveAspectRatio="xMidYMid slice"
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
      aria-hidden
    >
      <defs>
        <pattern id={`dots-${uid}`} width="22" height="22" patternUnits="userSpaceOnUse">
          <circle cx="1.2" cy="1.2" r="1.2" fill="rgba(255,255,255,0.045)" />
        </pattern>
        <radialGradient id={`vig-${uid}`} cx="50%" cy="42%" r="75%">
          <stop offset="55%" stopColor="rgba(0,0,0,0)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0.35)" />
        </radialGradient>
      </defs>

      {/* dot grid base */}
      <rect x="0" y="0" width="400" height="300" fill={`url(#dots-${uid})`} />

      {/* motif */}
      <g transform="translate(200 150)">
        {motif === "rings" && (
          <>
            <circle r="46" {...common} />
            <circle r="82" {...common} stroke={STROKE_SOFT} />
            <circle r="118" {...common} stroke={STROKE_SOFT} />
            <circle r="154" {...common} stroke={STROKE_SOFT} />
          </>
        )}
        {motif === "grid" && (
          <g stroke={STROKE_SOFT} strokeWidth={1}>
            {[-160, -120, -80, 80, 120, 160].map((x) => (
              <line key={`v${x}`} x1={x} y1={-150} x2={x} y2={150} />
            ))}
            {[-120, -80, 80, 120].map((y) => (
              <line key={`h${y}`} x1={-200} y1={y} x2={200} y2={y} />
            ))}
          </g>
        )}
        {motif === "arcs" && (
          <>
            {[60, 100, 140, 180].map((r, i) => (
              <path key={r} d={`M ${-r} 0 A ${r} ${r} 0 0 1 ${r} 0`} {...common} stroke={i === 0 ? STROKE : STROKE_SOFT} />
            ))}
          </>
        )}
        {motif === "orbit" && (
          <>
            <circle r="60" {...common} />
            <ellipse rx="150" ry="60" {...common} stroke={STROKE_SOFT} />
            <ellipse rx="150" ry="60" {...common} stroke={STROKE_SOFT} transform="rotate(60)" />
            <ellipse rx="150" ry="60" {...common} stroke={STROKE_SOFT} transform="rotate(-60)" />
          </>
        )}
        {motif === "shield" && (
          <>
            <path d="M0 -110 L95 -70 V10 C95 70 50 108 0 128 C-50 108 -95 70 -95 10 V-70 Z" {...common} />
            <path d="M0 -74 L62 -46 V6 C62 46 34 71 0 84 C-34 71 -62 46 -62 6 V-46 Z" {...common} stroke={STROKE_SOFT} />
          </>
        )}
        {motif === "stack" && (
          <g {...common}>
            <rect x="-70" y="-92" width="140" height="52" rx="8" />
            <rect x="-70" y="-26" width="140" height="52" rx="8" stroke={STROKE_SOFT} />
            <rect x="-70" y="40" width="140" height="52" rx="8" stroke={STROKE_SOFT} />
          </g>
        )}
      </g>

      <rect x="0" y="0" width="400" height="300" fill={`url(#vig-${uid})`} />
    </svg>
  );
}

interface ArticleCoverProps {
  slug: string;
  /** grid tile, featured card, or article hero — controls icon tile size */
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function ArticleCover({ slug, size = "sm", className }: ArticleCoverProps) {
  const cfg = ARTICLE_COVERS[slug] ?? { icon: CircleDollarSign, tag: "Terex", motif: "rings" as const };
  const Icon = cfg.icon;
  const uid = slug.replace(/[^a-z0-9]/gi, "");

  const tile = size === "lg" ? 92 : size === "md" ? 76 : 60;
  const iconSize = size === "lg" ? 42 : size === "md" ? 34 : 27;
  const radius = size === "lg" ? 22 : size === "md" ? 18 : 15;

  return (
    <div
      className={className}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        background: "linear-gradient(150deg, #212121 0%, #191919 55%, #1d1d1d 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      <Motif motif={cfg.motif} uid={uid} />

      {/* top highlight line */}
      <div style={{ position: "absolute", top: 0, left: "12%", right: "12%", height: 1, background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.14), transparent)" }} />

      {/* icon tile */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          width: tile,
          height: tile,
          borderRadius: radius,
          background: "rgba(255,255,255,0.06)",
          border: "1px solid rgba(255,255,255,0.12)",
          boxShadow: "0 8px 30px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.06)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backdropFilter: "blur(6px)",
        }}
      >
        <Icon size={iconSize} strokeWidth={1.6} color="#fff" />
      </div>

      {/* category chip */}
      <span
        style={{
          position: "absolute",
          top: 16,
          left: 16,
          zIndex: 1,
          fontSize: 10.5,
          fontWeight: 600,
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          padding: "5px 11px",
          borderRadius: 999,
          background: "rgba(20,20,20,0.55)",
          border: "1px solid rgba(255,255,255,0.1)",
          color: "rgba(255,255,255,0.75)",
          backdropFilter: "blur(6px)",
        }}
      >
        {cfg.tag}
      </span>
    </div>
  );
}
