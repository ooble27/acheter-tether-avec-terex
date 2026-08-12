import { useId } from 'react';

interface MiniRateChartProps {
  data: number[];
  className?: string;
  height?: number;
}

// Catmull-Rom → Bézier lissé, copié à l'identique du RateChart Ooble.
function smoothPath(pts: [number, number][]): string {
  if (pts.length < 2) return '';
  let d = `M ${pts[0][0]} ${pts[0][1]}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] ?? p2;
    const c1x = p1[0] + (p2[0] - p0[0]) / 6;
    const c1y = p1[1] + (p2[1] - p0[1]) / 6;
    const c2x = p2[0] - (p3[0] - p1[0]) / 6;
    const c2y = p2[1] - (p3[1] - p1[1]) / 6;
    d += ` C ${c1x} ${c1y}, ${c2x} ${c2y}, ${p2[0]} ${p2[1]}`;
  }
  return d;
}

/**
 * Mini-graphe d'aire lissé — SVG pur, `currentColor` pour l'adaptation
 * en dark/light mode via la couleur texte du parent. Copié du RateChart
 * d'Ooble.
 */
export function MiniRateChart({ data, className, height = 96 }: MiniRateChartProps) {
  const id = useId();
  const W = 320;
  const H = height;
  const padY = 12;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const span = max - min || 1;

  const pts: [number, number][] = data.map((v, i) => [
    (i * W) / (data.length - 1),
    padY + (H - padY * 2) * (1 - (v - min) / span),
  ]);

  const line = smoothPath(pts);
  const area = `${line} L ${W} ${H} L 0 ${H} Z`;
  const last = pts[pts.length - 1];

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="none"
      className={className}
      role="img"
      aria-label="Tendance du taux"
      style={{ width: '100%', height: `${height}px` }}
    >
      <defs>
        <linearGradient id={`fill-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="currentColor" stopOpacity="0.15" />
          <stop offset="1" stopColor="currentColor" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#fill-${id})`} />
      <path d={line} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
      <circle cx={last[0]} cy={last[1]} r="3" fill="currentColor" />
      <circle cx={last[0]} cy={last[1]} r="7" fill="currentColor" opacity="0.18" />
    </svg>
  );
}

/**
 * Génère une trajectoire synthétique autour du taux actuel (±0.4%),
 * lissée et stable pour un rendu de démonstration élégant. À remplacer
 * par un vrai hook d'historique dès qu'on a la source.
 */
export function synthHistory(currentRate: number, n = 24): number[] {
  if (!currentRate || currentRate <= 0) return Array.from({ length: n }, () => 1);
  const pts: number[] = [];
  let v = currentRate * (0.997 + Math.sin(currentRate) * 0.003);
  for (let i = 0; i < n; i++) {
    // marche pseudo-aléatoire déterministe (dépend du taux, pas de Math.random)
    const noise = Math.sin(i * 1.7 + currentRate) * 0.0015 + Math.cos(i * 0.9) * 0.001;
    v = v + currentRate * noise;
    pts.push(v);
  }
  pts[pts.length - 1] = currentRate;
  return pts;
}
