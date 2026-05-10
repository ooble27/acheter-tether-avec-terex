import { ArrowUpRight, ArrowDownLeft, Send, Plus, Bell, TrendingDown, Check, AlertCircle } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useCryptoRates } from '@/hooks/useCryptoRates';
import { useTerexRates } from '@/hooks/useTerexRates';
import { useTransactions } from '@/hooks/useTransactions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

interface DashboardHomeProps {
  user: { email: string; name: string } | null;
  onNavigate?: (section: string) => void;
}

const TetherLogo = ({ className }: { className?: string }) => (
  <img src="https://coin-images.coingecko.com/coins/images/325/large/Tether.png" alt="USDT" className={cn('object-contain', className)} />
);

function Spark({ data, color, width = 80, height = 24, fill = true }: {
  data: number[]; color: string; width?: number; height?: number; fill?: boolean;
}) {
  const max = Math.max(...data), min = Math.min(...data);
  const pts = data.map((v, i) =>
    `${(i / (data.length - 1)) * width},${height - ((v - min) / (max - min || 1)) * (height - 4) - 2}`
  ).join(' ');
  const id = `fill-${color.replace(/[^a-zA-Z0-9]/g, '')}`;
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
      {fill && (
        <defs>
          <linearGradient id={id} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.18" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
      )}
      {fill && <polygon points={`0,${height} ${pts} ${width},${height}`} fill={`url(#${id})`} />}
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

function PortfolioChart() {
  const data = [120, 135, 128, 142, 138, 155, 148, 162, 175, 168, 172, 185, 178, 192, 188, 205, 198, 215, 212, 228, 222, 240, 235, 248, 242, 258, 252, 268, 275, 290];
  const w = 800, h = 160;
  const max = Math.max(...data), min = Math.min(...data);
  const pts = data.map((v, i) =>
    `${(i / (data.length - 1)) * w},${h - ((v - min) / (max - min)) * (h - 16) - 8}`
  ).join(' ');
  return (
    <div className="w-full" style={{ height: h }}>
      <svg width="100%" height={h} viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
        <defs>
          <linearGradient id="chartGrad" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#3B968F" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#3B968F" stopOpacity="0" />
          </linearGradient>
        </defs>
        <polygon points={`0,${h} ${pts} ${w},${h}`} fill="url(#chartGrad)" />
        <polyline points={pts} fill="none" stroke="#3B968F" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
      </svg>
    </div>
  );
}

const UP_SPARK   = [8, 9, 8, 10, 9, 11, 12, 11, 13, 14, 12, 15];
const FLAT_SPARK = [10, 10, 11, 10, 11, 10, 11, 10, 11, 10, 11, 10];

export function DashboardHome({ user, onNavigate }: DashboardHomeProps) {
  const isMobile = useIsMobile();
  const { usdtToCfa, loading } = useCryptoRates();
  const { terexRateCfa, terexBuyRateCfa } = useTerexRates();
  const { transactions, loading: txLoading } = useTransactions();

  const firstName = user?.name?.split(' ')[0] || 'Trader';
  const recentTx = transactions.slice(0, 4);

  const getTxColor  = (type: string) => type === 'buy' ? '#3B968F' : '#dc2626';
  const getTxLabel  = (type: string) => ({ buy: 'Achat USDT', sell: 'Vente USDT', transfer: 'Virement' }[type] ?? 'Transaction');
  const getTxAmt    = (tx: any) => tx.type === 'buy'
    ? `+ ${tx.usdt_amount?.toFixed(2) ?? '—'} USDT`
    : `- ${tx.cfa_amount?.toLocaleString('fr-FR') ?? '—'} F`;
  const getTxIcon   = (type: string) => {
    if (type === 'buy')  return <ArrowDownLeft className="w-3.5 h-3.5" />;
    if (type === 'sell') return <ArrowUpRight  className="w-3.5 h-3.5" />;
    return <Send className="w-3.5 h-3.5" />;
  };

  // MOBILE
  if (isMobile) {
    return (
      <div className="min-h-screen bg-[#141414] space-y-4 pb-6">
        <div className="flex items-center justify-between pt-2">
          <div>
            <p className="text-[10px] text-gray-500 uppercase tracking-[0.2em] font-mono">Tableau de bord</p>
            <h1 className="text-xl font-light text-white mt-0.5">
              Bonjour, <span className="text-[#3B968F]">{firstName}</span>
            </h1>
          </div>
          <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white hover:bg-white/5 h-9 w-9">
            <Bell className="h-4 w-4" />
          </Button>
        </div>

        <Card className="bg-[#1a1a1a] border-[#2e2e2e]">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <TetherLogo className="w-7 h-7" />
                <div>
                  <p className="text-white text-sm font-medium">USDT / XOF</p>
                  <p className="text-[10px] text-gray-500 font-mono">{loading ? '—' : `1 USDT = ${Math.round(usdtToCfa)} XOF`}</p>
                </div>
              </div>
              <Badge className="bg-[#3B968F]/15 text-[#3B968F] border-[#3B968F]/25 text-[10px] font-mono px-2 py-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#3B968F] mr-1.5 animate-pulse inline-block" />
                LIVE
              </Badge>
            </div>
            <Separator className="bg-white/5 mb-3" />
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">Achat</p>
                <p className="text-[#3B968F] text-base font-mono font-medium">{terexRateCfa.toLocaleString('fr-FR')}</p>
              </div>
              <div>
                <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">Vente</p>
                <p className="text-white text-base font-mono font-medium">{terexBuyRateCfa.toLocaleString('fr-FR')}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-2 gap-2">
          {[
            { id: 'buy',      label: 'Acheter',  sub: 'USDT instant',  icon: <TetherLogo className="w-5 h-5" />,               accent: true },
            { id: 'sell',     label: 'Vendre',   sub: 'Wave / Orange', icon: <TrendingDown className="w-4 h-4 text-white" />,  accent: false },
            { id: 'transfer', label: 'Virement', sub: 'International', icon: <Send className="w-4 h-4 text-white" />,          accent: false },
            { id: 'otc',      label: 'OTC Desk', sub: 'Gros volumes',  icon: <ArrowUpRight className="w-4 h-4 text-white" />,  accent: false },
          ].map(it => (
            <button
              key={it.id}
              onClick={() => onNavigate?.(it.id)}
              className="group rounded-xl bg-[#1a1a1a] border border-[#2e2e2e] hover:border-[#3B968F]/30 p-3 text-left transition-all"
            >
              <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center mb-2', it.accent ? 'bg-[#3B968F]/15' : 'bg-white/5')}>
                {it.icon}
              </div>
              <p className="text-white text-sm font-light">{it.label}</p>
              <p className="text-[10px] text-gray-500">{it.sub}</p>
            </button>
          ))}
        </div>

        <Card className="bg-[#1a1a1a] border-[#2e2e2e]">
          <CardHeader className="p-4 pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-white">Activité récente</CardTitle>
              <button onClick={() => onNavigate?.('history')} className="text-[11px] text-gray-500 hover:text-[#3B968F] transition-colors">
                Tout voir →
              </button>
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-2 space-y-3">
            {txLoading ? (
              <p className="text-xs text-gray-500 text-center py-4">Chargement…</p>
            ) : recentTx.length === 0 ? (
              <p className="text-xs text-gray-500 text-center py-4">Aucune transaction</p>
            ) : recentTx.map((tx: any) => (
              <div key={tx.id} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#1f1f1f] flex items-center justify-center shrink-0" style={{ color: getTxColor(tx.type) }}>
                  {getTxIcon(tx.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] font-medium text-white truncate">{getTxLabel(tx.type)}</p>
                  <p className="text-[10px] text-gray-500">{new Date(tx.created_at).toLocaleDateString('fr-FR')}</p>
                </div>
                <p className="text-[12px] font-medium font-mono tabular-nums" style={{ color: getTxColor(tx.type) }}>
                  {getTxAmt(tx)}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }

  // DESKTOP
  return (
    <div className="flex flex-col h-full overflow-hidden bg-[#141414]">
      <header className="flex items-center justify-between px-7 py-5 border-b border-[#2e2e2e] shrink-0">
        <div>
          <h1 className="text-[22px] font-semibold tracking-[-0.02em] text-white">Bonjour {firstName}</h1>
          <p className="text-[13px] text-gray-500 mt-0.5">Voici un aperçu de votre activité financière.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="h-9 w-9 p-0 border-[#2e2e2e] bg-transparent text-gray-400 hover:text-white hover:bg-white/5"
          >
            <Bell className="w-4 h-4" />
          </Button>
          <Button
            onClick={() => onNavigate?.('buy')}
            size="sm"
            className="h-9 px-4 bg-[#3B968F] hover:bg-[#3B968F]/90 text-white border-0 text-[13px] font-medium"
          >
            <Plus className="w-3.5 h-3.5 mr-1.5" />
            Acheter USDT
          </Button>
        </div>
      </header>

      <div className="flex-1 overflow-auto p-7 space-y-5">
        <div className="grid grid-cols-4 gap-3.5">
          {[
            { label: 'Taux marché',  value: loading ? '—' : Math.round(usdtToCfa).toLocaleString('fr-FR'), unit: 'XOF', sub: 'USDT/XOF · temps réel',   spark: UP_SPARK,   color: '#3B968F', up: true },
            { label: 'Taux achat',   value: terexRateCfa.toLocaleString('fr-FR'),                           unit: 'XOF', sub: 'Prix Terex garanti',        spark: UP_SPARK,   color: '#16a34a', up: true },
            { label: 'Taux vente',   value: terexBuyRateCfa.toLocaleString('fr-FR'),                        unit: 'XOF', sub: 'Par USDT vendu',             spark: FLAT_SPARK, color: '#a3a3a3', up: null },
            { label: 'Réseaux',      value: 'TRC20',                                                         unit: '',    sub: 'BEP20 · ERC20 disponibles', spark: FLAT_SPARK, color: '#3B968F', up: null },
          ].map((s, i) => (
            <Card key={i} className="bg-[#1a1a1a] border-[#2e2e2e] hover:border-[#3B968F]/25 transition-colors">
              <CardContent className="p-[18px]">
                <p className="text-[12px] text-gray-500 mb-1.5">{s.label}</p>
                <p className="text-[22px] font-medium tracking-[-0.02em] text-white tabular-nums leading-none">
                  {s.value}
                  {s.unit && <span className="text-[13px] text-gray-500 font-normal ml-1">{s.unit}</span>}
                </p>
                <div className="flex items-center justify-between mt-2.5">
                  <span className="text-[11px]" style={{ color: s.up ? '#16a34a' : '#a3a3a3' }}>{s.sub}</span>
                  <Spark data={s.spark} color={s.color} width={56} height={20} fill={false} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-3.5" style={{ gridTemplateColumns: '1.6fr 1fr' }}>
          <Card className="bg-[#1a1a1a] border-[#2e2e2e]">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-[14px] font-medium text-white">Évolution du portefeuille</p>
                  <p className="text-[11px] text-gray-500 mt-0.5">30 derniers jours · USDT</p>
                </div>
                <div className="flex gap-1">
                  {['7J', '30J', '3M', '1A'].map((p, i) => (
                    <button
                      key={p}
                      className={cn(
                        'text-[11px] px-2.5 py-1 rounded-md transition-colors',
                        i === 1 ? 'bg-[#1f1f1f] text-white' : 'text-gray-500 hover:text-gray-300'
                      )}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
              <PortfolioChart />
              <div className="flex justify-between text-[10px] text-gray-600 mt-2 font-mono">
                <span>10 avr</span><span>17 avr</span><span>24 avr</span><span>1 mai</span><span>8 mai</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#1a1a1a] border-[#2e2e2e]">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-4">
                <p className="text-[14px] font-medium text-white">Activité récente</p>
                <button onClick={() => onNavigate?.('history')} className="text-[11px] text-gray-500 hover:text-[#3B968F] transition-colors">
                  Tout voir →
                </button>
              </div>
              {txLoading ? (
                <p className="text-xs text-gray-500 text-center py-8">Chargement…</p>
              ) : recentTx.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 gap-2">
                  <div className="w-10 h-10 rounded-xl bg-[#1f1f1f] flex items-center justify-center">
                    <TetherLogo className="w-5 h-5 opacity-40" />
                  </div>
                  <p className="text-xs text-gray-500">Aucune transaction</p>
                  <button onClick={() => onNavigate?.('buy')} className="text-[11px] text-[#3B968F] hover:underline mt-1">
                    Faire votre premier achat →
                  </button>
                </div>
              ) : (
                <div className="space-y-3.5">
                  {recentTx.map((tx: any) => (
                    <div key={tx.id} className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#1f1f1f] flex items-center justify-center shrink-0" style={{ color: getTxColor(tx.type) }}>
                        {getTxIcon(tx.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[12px] font-medium text-white truncate">{getTxLabel(tx.type)}</p>
                        <p className="text-[10px] text-gray-500">{new Date(tx.created_at).toLocaleDateString('fr-FR')}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[12px] font-medium tabular-nums" style={{ color: getTxColor(tx.type) }}>{getTxAmt(tx)}</p>
                        <p className="text-[10px] text-gray-500">
                          {tx.status === 'completed' ? 'Complété' : tx.status === 'pending' ? 'En attente' : tx.status}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-2 gap-3.5">
          <Card className="bg-[#1a1a1a] border-[#2e2e2e]">
            <CardContent className="p-5">
              <p className="text-[14px] font-medium text-white mb-4">Marchés</p>
              <div className="space-y-3.5">
                {[
                  { pair: 'USDT/XOF', value: loading ? '—' : Math.round(usdtToCfa).toLocaleString('fr-FR'), change: '+0.12%', up: true },
                  { pair: 'USDT/USD', value: '1.0001', change: '+0.01%', up: true },
                  { pair: 'USDT/EUR', value: '0.9234', change: '-0.18%', up: false },
                  { pair: 'BTC/USD',  value: '67 412', change: '+1.84%', up: true },
                ].map((m, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <span className="text-[13px] font-medium font-mono text-white">{m.pair}</span>
                    <Spark
                      data={m.up ? [9, 10, 9, 11, 10, 11, 12, 11, 13] : [13, 12, 11, 12, 11, 10, 11, 10, 9]}
                      color={m.up ? '#16a34a' : '#dc2626'}
                      width={80} height={20} fill={false}
                    />
                    <div className="text-right">
                      <p className="text-[13px] font-medium tabular-nums text-white">{m.value}</p>
                      <p className="text-[10px]" style={{ color: m.up ? '#16a34a' : '#dc2626' }}>{m.change}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#1a1a1a] border-[#2e2e2e]">
            <CardContent className="p-5">
              <p className="text-[14px] font-medium text-white mb-4">Actions rapides</p>
              <div className="grid grid-cols-2 gap-2 mb-4">
                {[
                  { id: 'buy',      label: 'Acheter USDT', icon: <TetherLogo className="w-4 h-4" />,        accent: true },
                  { id: 'sell',     label: 'Vendre USDT',  icon: <TrendingDown className="w-4 h-4" />,       accent: false },
                  { id: 'transfer', label: 'Virement',      icon: <Send className="w-4 h-4" />,              accent: false },
                  { id: 'otc',      label: 'OTC Desk',      icon: <ArrowUpRight className="w-4 h-4" />,      accent: false },
                ].map(it => (
                  <button
                    key={it.id}
                    onClick={() => onNavigate?.(it.id)}
                    className={cn(
                      'flex items-center gap-2 px-3 py-2.5 rounded-lg text-[12px] font-medium transition-all text-left',
                      it.accent
                        ? 'bg-[#3B968F] text-white hover:bg-[#3B968F]/90'
                        : 'bg-[#1f1f1f] text-gray-300 hover:bg-white/5 hover:text-white border border-[#2e2e2e]'
                    )}
                  >
                    <span className={cn(it.accent ? 'text-white' : 'text-gray-400')}>{it.icon}</span>
                    {it.label}
                  </button>
                ))}
              </div>
              <Separator className="bg-[#2e2e2e] mb-4" />
              <div className="space-y-2.5">
                {[
                  'Réseau TRC20 (TRON)',
                  'Réseau BEP20 (BSC)',
                  'Réseau ERC20 (ETH)',
                  'Wave · Orange · MTN · Moov',
                ].map((label, i) => (
                  <div key={i} className="flex items-center gap-2.5">
                    <div className="w-4 h-4 rounded-full bg-[#3B968F]/15 flex items-center justify-center shrink-0">
                      <Check className="w-2.5 h-2.5 text-[#3B968F]" />
                    </div>
                    <span className="text-[12px] text-gray-400">{label}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
