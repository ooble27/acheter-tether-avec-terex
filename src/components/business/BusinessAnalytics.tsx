import { useState, useCallback } from 'react';
import { Download, TrendingUp, TrendingDown, CheckCircle2, Clock, Loader2, XCircle } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  PieChart, Pie, Cell,
  LineChart, Line,
  AreaChart, Area,
  ResponsiveContainer,
} from 'recharts';

const C = {
  bg: '#1a1a1a', l1: '#212121', l2: '#282828', l3: '#303030', l4: '#383838',
  bd: '#383838', bds: '#2a2a2a', bdh: '#484848',
  teal: '#3B968F', tealH: '#2d7870', tealT: 'rgba(59,150,143,0.08)', tealB: 'rgba(59,150,143,0.20)',
  t1: '#f0f0f0', t2: '#999999', t3: '#686868',
  amber: '#f59e0b', amberT: 'rgba(245,158,11,0.08)', amberB: 'rgba(245,158,11,0.16)',
  blue: '#3b82f6', blueT: 'rgba(59,130,246,0.08)', blueB: 'rgba(59,130,246,0.16)',
  em: '#22c55e', emT: 'rgba(34,197,94,0.08)', emB: 'rgba(34,197,94,0.16)',
  red: '#ef4444', redT: 'rgba(239,68,68,0.08)', redB: 'rgba(239,68,68,0.16)',
  purple: '#a855f7', purpleT: 'rgba(168,85,247,0.08)', purpleB: 'rgba(168,85,247,0.20)',
};
const FONT = "'Inter', sans-serif";
const MONO = '"JetBrains Mono", Consolas, monospace';

// ─── Mock data ────────────────────────────────────────────────────────────────

const MONTHS = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];

const MONTHLY_VOLUME_12 = [
  { month: 'Jan', current: 8200,  prev: 6800  },
  { month: 'Fév', current: 9400,  prev: 7200  },
  { month: 'Mar', current: 10100, prev: 8400  },
  { month: 'Avr', current: 11300, prev: 9100  },
  { month: 'Mai', current: 9800,  prev: 8700  },
  { month: 'Jun', current: 12400, prev: 10200 },
  { month: 'Jul', current: 13100, prev: 9800  },
  { month: 'Aoû', current: 11700, prev: 10600 },
  { month: 'Sep', current: 12900, prev: 11200 },
  { month: 'Oct', current: 14200, prev: 12000 },
  { month: 'Nov', current: 13600, prev: 11400 },
  { month: 'Déc', current: 11750, prev: 10800 },
];

const MONTHLY_VOLUME_6 = MONTHLY_VOLUME_12.slice(6);

const PIE_DATA = [
  { name: 'TRC20', value: 83450, color: C.red },
  { name: 'BEP20', value: 32100, color: C.amber },
  { name: 'ERC20', value: 10200, color: C.blue },
  { name: 'Polygon', value: 2700, color: C.purple },
];

const TOP_SUPPLIERS = [
  { name: 'Shenzhen Electronics Ltd', volume: 28400 },
  { name: 'Guangzhou Textile Co.',    volume: 21200 },
  { name: 'Hong Kong Trading Grp',    volume: 17800 },
  { name: 'Beijing Tech Supplies',    volume: 13600 },
  { name: 'Shanghai Machinery Co.',   volume: 11200 },
  { name: 'Chengdu Components Inc.',  volume: 8900  },
  { name: 'Wuhan Industrial Parts',   volume: 6700  },
  { name: 'Tianjin Metal Works',      volume: 4200  },
];

const FEES_12 = [
  { month: 'Jan', fees: 186 },
  { month: 'Fév', fees: 214 },
  { month: 'Mar', fees: 229 },
  { month: 'Avr', fees: 258 },
  { month: 'Mai', fees: 223 },
  { month: 'Jun', fees: 282 },
  { month: 'Jul', fees: 298 },
  { month: 'Aoû', fees: 266 },
  { month: 'Sep', fees: 294 },
  { month: 'Oct', fees: 323 },
  { month: 'Nov', fees: 309 },
  { month: 'Déc', fees: 329 },
];

const FEES_6 = FEES_12.slice(6);

const SUCCESS_RATE_12 = [
  { month: 'Jan', rate: 91.2 },
  { month: 'Fév', rate: 92.4 },
  { month: 'Mar', rate: 90.8 },
  { month: 'Avr', rate: 93.1 },
  { month: 'Mai', rate: 92.7 },
  { month: 'Jun', rate: 94.0 },
  { month: 'Jul', rate: 93.6 },
  { month: 'Aoû', rate: 94.2 },
  { month: 'Sep', rate: 95.1 },
  { month: 'Oct', rate: 94.8 },
  { month: 'Nov', rate: 95.4 },
  { month: 'Déc', rate: 94.6 },
];

const SUCCESS_RATE_6 = SUCCESS_RATE_12.slice(6);

// Current year data (up to May)
const YEAR_VOLUME = MONTHLY_VOLUME_12.slice(0, 5);
const YEAR_FEES = FEES_12.slice(0, 5);
const YEAR_SUCCESS = SUCCESS_RATE_12.slice(0, 5);

// ─── Custom Tooltip ───────────────────────────────────────────────────────────

interface TooltipProps {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color?: string }>;
  label?: string;
}

function CustomTooltip({ active, payload, label }: TooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: C.l2, border: `1px solid ${C.bd}`,
      borderRadius: 8, padding: '10px 14px', fontFamily: FONT,
      boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
    }}>
      {label && <p style={{ color: C.t3, fontSize: 10, margin: '0 0 6px' }}>{label}</p>}
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color || C.t1, fontSize: 12, fontWeight: 600, margin: '2px 0', fontFamily: MONO }}>
          {p.name}: {typeof p.value === 'number' && p.value > 100
            ? p.value.toLocaleString()
            : p.value}{p.name === 'Taux' ? '%' : p.name.includes('Frais') ? ' USDT' : ' USDT'}
        </p>
      ))}
    </div>
  );
}

// ─── KPI Card ─────────────────────────────────────────────────────────────────

interface KpiCardProps {
  label: string;
  value: string;
  change: string;
  positive: boolean;
}

function KpiCard({ label, value, change, positive }: KpiCardProps) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: C.l1,
        border: `1px solid ${hovered ? C.bdh : C.bds}`,
        borderRadius: 12, padding: '18px 20px',
        transition: 'border-color 0.15s, box-shadow 0.15s',
        boxShadow: hovered ? '0 4px 20px rgba(0,0,0,0.2)' : 'none',
      }}
    >
      <p style={{ color: C.t3, fontSize: 11, margin: '0 0 10px', fontFamily: FONT }}>{label}</p>
      <p style={{ color: C.t1, fontSize: 22, fontWeight: 700, fontFamily: MONO, margin: '0 0 8px', letterSpacing: '-0.02em' }}>
        {value}
      </p>
      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        {positive
          ? <TrendingUp style={{ width: 11, height: 11, color: C.em }} />
          : <TrendingDown style={{ width: 11, height: 11, color: C.red }} />}
        <span style={{ color: positive ? C.em : C.red, fontSize: 11, fontFamily: FONT }}>
          {change}
        </span>
      </div>
    </div>
  );
}

// ─── Chart Card ───────────────────────────────────────────────────────────────

function ChartCard({ title, children, style }: { title: string; children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{
      background: C.l1, border: `1px solid ${C.bds}`,
      borderRadius: 12, padding: 20,
      boxShadow: '0 2px 8px rgba(0,0,0,0.45), 0 1px 2px rgba(0,0,0,0.3)',
      ...style,
    }}>
      <p style={{ color: C.t1, fontSize: 13, fontWeight: 600, margin: '0 0 16px', fontFamily: FONT }}>
        {title}
      </p>
      {children}
    </div>
  );
}

// ─── Donut legend ─────────────────────────────────────────────────────────────

function DonutLegend({ data }: { data: typeof PIE_DATA }) {
  const total = data.reduce((s, d) => s + d.value, 0);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 14 }}>
      {data.map(d => (
        <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 8, height: 8, borderRadius: 2, background: d.color, flexShrink: 0 }} />
          <span style={{ color: C.t2, fontSize: 11, fontFamily: FONT, flex: 1 }}>{d.name}</span>
          <span style={{ color: C.t3, fontSize: 10, fontFamily: MONO }}>
            {((d.value / total) * 100).toFixed(0)}%
          </span>
          <span style={{ color: C.t2, fontSize: 11, fontFamily: MONO }}>
            {d.value.toLocaleString()}
          </span>
        </div>
      ))}
    </div>
  );
}

// ─── Transaction status row ───────────────────────────────────────────────────

interface StatusStatProps {
  icon: React.ReactNode;
  label: string;
  count: number;
  pct: string;
  color: string;
  colorT: string;
}

function StatusStat({ icon, label, count, pct, color, colorT }: StatusStatProps) {
  return (
    <div style={{
      flex: 1, background: C.l2, border: `1px solid ${C.bds}`,
      borderRadius: 10, padding: '14px 16px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <div style={{
          width: 28, height: 28, borderRadius: 8,
          background: colorT,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: color,
        }}>
          {icon}
        </div>
        <span style={{ color: C.t3, fontSize: 11, fontFamily: FONT }}>{label}</span>
      </div>
      <p style={{ color: C.t1, fontSize: 20, fontWeight: 700, fontFamily: MONO, margin: '0 0 2px' }}>{count}</p>
      <p style={{ color: C.t3, fontSize: 11, fontFamily: FONT, margin: 0 }}>{pct}</p>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function BusinessAnalytics({ user }: { user: { email: string; name: string; id?: string } | null }) {
  const [period, setPeriod] = useState<'6m' | '12m' | 'year'>('12m');
  const [downloading, setDownloading] = useState(false);

  void user;

  const handleDownload = useCallback(() => {
    setDownloading(true);
    setTimeout(() => setDownloading(false), 2000);
  }, []);

  const volumeData = period === '6m' ? MONTHLY_VOLUME_6 : period === 'year' ? YEAR_VOLUME : MONTHLY_VOLUME_12;
  const feesData   = period === '6m' ? FEES_6          : period === 'year' ? YEAR_FEES   : FEES_12;
  const rateData   = period === '6m' ? SUCCESS_RATE_6  : period === 'year' ? YEAR_SUCCESS : SUCCESS_RATE_12;

  const totalFees = feesData.reduce((s, f) => s + f.fees, 0);
  const periods = [
    { id: '6m',   label: '6 mois' },
    { id: '12m',  label: '12 mois' },
    { id: 'year', label: 'Cette année' },
  ] as const;

  return (
    <div style={{ fontFamily: FONT, color: C.t1, paddingTop: 8 }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ color: C.t1, fontSize: 20, fontWeight: 700, margin: '0 0 4px', letterSpacing: '-0.02em' }}>
            Analytique
          </h1>
          <p style={{ color: C.t3, fontSize: 12, margin: 0 }}>
            Performances et insights
          </p>
        </div>

        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          {/* Period pills */}
          <div style={{
            display: 'flex', gap: 2,
            background: C.l2, border: `1px solid ${C.bds}`,
            borderRadius: 8, padding: 3,
          }}>
            {periods.map(p => (
              <button
                key={p.id}
                onClick={() => setPeriod(p.id)}
                style={{
                  height: 28, paddingLeft: 12, paddingRight: 12,
                  borderRadius: 6, border: 'none', cursor: 'pointer',
                  fontSize: 12, fontWeight: 500, fontFamily: FONT,
                  background: period === p.id ? C.teal : 'transparent',
                  color: period === p.id ? '#fff' : C.t3,
                  transition: 'all 0.15s',
                }}
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Download */}
          <button
            onClick={handleDownload}
            style={{
              height: 34, paddingLeft: 14, paddingRight: 14,
              background: downloading ? C.tealT : C.l2,
              border: `1px solid ${downloading ? C.tealB : C.bd}`,
              borderRadius: 8, color: downloading ? C.teal : C.t2,
              fontSize: 12, fontWeight: 500, cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 6,
              fontFamily: FONT, transition: 'all 0.15s',
            }}
          >
            <Download style={{ width: 13, height: 13 }} />
            {downloading ? 'Génération en cours…' : 'Télécharger rapport'}
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 20 }}>
        <KpiCard label="Volume total" value="128,450 USDT" change="+12.3% vs période préc." positive={true} />
        <KpiCard label="Transactions" value="47" change="+8 vs période préc." positive={true} />
        <KpiCard label="Frais payés" value="3,211 USDT" change="+2.5% vs période préc." positive={false} />
        <KpiCard label="Taux de succès" value="94.6%" change="+1.2% vs période préc." positive={true} />
      </div>

      {/* Volume + Donut */}
      <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: 14, marginBottom: 14 }}>
        <ChartCard title="Volume mensuel — Comparaison">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={volumeData} margin={{ top: 4, right: 8, left: 0, bottom: 0 }} barCategoryGap="30%">
              <CartesianGrid strokeDasharray="3 3" stroke={C.bds} vertical={false} />
              <XAxis dataKey="month" tick={{ fill: C.t3, fontSize: 11, fontFamily: FONT }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fill: C.t3, fontSize: 10, fontFamily: MONO }} tickLine={false} axisLine={false} width={52}
                tickFormatter={(v: number) => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : `${v}`} />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                formatter={(value) => <span style={{ color: C.t3, fontSize: 11, fontFamily: FONT }}>{value}</span>}
                wrapperStyle={{ paddingTop: 8 }}
              />
              <Bar dataKey="current" name="Année N" fill={C.teal} radius={[3, 3, 0, 0]} />
              <Bar dataKey="prev" name="Année N-1" fill={C.l4} radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Répartition par réseau">
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie
                data={PIE_DATA}
                cx="50%"
                cy="50%"
                innerRadius={42}
                outerRadius={68}
                paddingAngle={2}
                dataKey="value"
              >
                {PIE_DATA.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number) => [`${value.toLocaleString()} USDT`, '']}
                contentStyle={{
                  background: C.l2, border: `1px solid ${C.bd}`,
                  borderRadius: 8, fontFamily: FONT, fontSize: 12,
                  color: C.t1,
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <DonutLegend data={PIE_DATA} />
        </ChartCard>
      </div>

      {/* Suppliers + Fees */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
        <ChartCard title="Top fournisseurs par volume">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart
              data={TOP_SUPPLIERS}
              layout="vertical"
              margin={{ top: 0, right: 48, left: 8, bottom: 0 }}
              barCategoryGap="20%"
            >
              <CartesianGrid strokeDasharray="3 3" stroke={C.bds} horizontal={false} />
              <XAxis
                type="number"
                tick={{ fill: C.t3, fontSize: 10, fontFamily: MONO }}
                tickLine={false} axisLine={false}
                tickFormatter={(v: number) => `${(v / 1000).toFixed(0)}k`}
              />
              <YAxis
                dataKey="name"
                type="category"
                tick={{ fill: C.t2, fontSize: 10, fontFamily: FONT }}
                tickLine={false} axisLine={false}
                width={130}
              />
              <Tooltip
                formatter={(value: number) => [`${value.toLocaleString()} USDT`, 'Volume']}
                contentStyle={{
                  background: C.l2, border: `1px solid ${C.bd}`,
                  borderRadius: 8, fontFamily: FONT, fontSize: 12,
                  color: C.t1,
                }}
              />
              <Bar dataKey="volume" fill={C.teal} radius={[0, 3, 3, 0]}
                label={{ position: 'right', fill: C.t3, fontSize: 10, fontFamily: MONO,
                  formatter: (v: number) => `${(v / 1000).toFixed(0)}k` }}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title={`Frais cumulés — Total: ${totalFees.toLocaleString()} USDT`}>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={feesData} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="feesGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={C.teal} stopOpacity={0.25} />
                  <stop offset="95%" stopColor={C.teal} stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={C.bds} vertical={false} />
              <XAxis dataKey="month" tick={{ fill: C.t3, fontSize: 11, fontFamily: FONT }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fill: C.t3, fontSize: 10, fontFamily: MONO }} tickLine={false} axisLine={false} width={40} />
              <Tooltip
                formatter={(value: number) => [`${value} USDT`, 'Frais']}
                contentStyle={{
                  background: C.l2, border: `1px solid ${C.bd}`,
                  borderRadius: 8, fontFamily: FONT, fontSize: 12,
                  color: C.t1,
                }}
              />
              <Area
                type="monotone" dataKey="fees" name="Frais"
                stroke={C.teal} strokeWidth={2}
                fill="url(#feesGrad)" dot={false}
                activeDot={{ r: 4, fill: C.teal, stroke: C.l1, strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Transaction performance */}
      <div style={{
        background: C.l1, border: `1px solid ${C.bds}`,
        borderRadius: 12, padding: 20,
        boxShadow: '0 2px 8px rgba(0,0,0,0.45), 0 1px 2px rgba(0,0,0,0.3)',
      }}>
        <p style={{ color: C.t1, fontSize: 13, fontWeight: 600, margin: '0 0 16px', fontFamily: FONT }}>
          Performance des transactions
        </p>

        {/* Status stats */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
          <StatusStat
            icon={<CheckCircle2 style={{ width: 14, height: 14 }} />}
            label="Complétées" count={44} pct="93.6%"
            color={C.em} colorT={C.emT}
          />
          <StatusStat
            icon={<Clock style={{ width: 14, height: 14 }} />}
            label="En attente" count={2} pct="4.3%"
            color={C.amber} colorT={C.amberT}
          />
          <StatusStat
            icon={<Loader2 style={{ width: 14, height: 14 }} />}
            label="En cours" count={1} pct="2.1%"
            color={C.blue} colorT={C.blueT}
          />
          <StatusStat
            icon={<XCircle style={{ width: 14, height: 14 }} />}
            label="Échouées" count={0} pct="0%"
            color={C.red} colorT={C.redT}
          />
        </div>

        {/* Success rate chart */}
        <ResponsiveContainer width="100%" height={160}>
          <LineChart data={rateData} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={C.bds} vertical={false} />
            <XAxis dataKey="month" tick={{ fill: C.t3, fontSize: 11, fontFamily: FONT }} tickLine={false} axisLine={false} />
            <YAxis
              domain={[88, 98]}
              tick={{ fill: C.t3, fontSize: 10, fontFamily: MONO }}
              tickLine={false} axisLine={false} width={36}
              tickFormatter={(v: number) => `${v}%`}
            />
            <Tooltip
              formatter={(value: number) => [`${value}%`, 'Taux de succès']}
              contentStyle={{
                background: C.l2, border: `1px solid ${C.bd}`,
                borderRadius: 8, fontFamily: FONT, fontSize: 12,
                color: C.t1,
              }}
            />
            <Line
              type="monotone" dataKey="rate" name="Taux"
              stroke={C.teal} strokeWidth={2} dot={false}
              activeDot={{ r: 4, fill: C.teal, stroke: C.l1, strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
}

// Suppress unused import warnings
void MONTHS;
