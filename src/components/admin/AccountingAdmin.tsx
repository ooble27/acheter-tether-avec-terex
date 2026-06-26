import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useManualTransactions } from '@/hooks/useManualTransactions';
import { Plus, DollarSign, TrendingUp, Activity, Wallet, Trash2, FileText, Search, Filter } from 'lucide-react';
import { generateInvoicePDF } from '@/utils/generateInvoicePDF';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, subMonths, isWithinInterval } from 'date-fns';
import { fr } from 'date-fns/locale';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';

const CARD = '#1e1e1e';
const BORDER = 'rgba(255,255,255,0.07)';
const ICON_BG = 'rgba(255,255,255,0.06)';
const INPUT_BG = 'rgba(255,255,255,0.04)';

const cardStyle: React.CSSProperties = {
  background: CARD,
  border: `1px solid ${BORDER}`,
  borderRadius: 16,
  padding: 18,
};

const inputClass = 'text-white placeholder-[#6b7280]';
const inputStyle: React.CSSProperties = {
  background: INPUT_BG,
  border: `1px solid ${BORDER}`,
  borderRadius: 12,
  color: '#fff',
  outline: 'none',
};

export function AccountingAdmin() {
  const { transactions, loading, addTransaction, deleteTransaction, stats } = useManualTransactions();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState<'all' | 'today' | 'week' | 'month' | 'custom'>('all');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [formData, setFormData] = useState({
    transaction_date: new Date().toISOString().slice(0, 16),
    amount: '',
    currency: 'CAD',
    crypto_amount: '',
    crypto_currency: 'USDT',
    buy_price: '',
    sell_price: '',
    client_name: '',
    client_phone: '',
    payment_method: 'Interac',
    notes: ''
  });

  // Filter transactions
  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      // Search filter
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch = !searchQuery ||
        t.client_name?.toLowerCase().includes(searchLower) ||
        t.client_phone?.toLowerCase().includes(searchLower) ||
        t.payment_method?.toLowerCase().includes(searchLower);

      // Date filter
      const transactionDate = new Date(t.transaction_date);
      const today = new Date();
      let matchesDate = true;

      if (dateFilter === 'today') {
        matchesDate = format(transactionDate, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd');
      } else if (dateFilter === 'week') {
        matchesDate = isWithinInterval(transactionDate, {
          start: startOfWeek(today, { weekStartsOn: 1 }),
          end: endOfWeek(today, { weekStartsOn: 1 })
        });
      } else if (dateFilter === 'month') {
        matchesDate = isWithinInterval(transactionDate, {
          start: startOfMonth(today),
          end: endOfMonth(today)
        });
      } else if (dateFilter === 'custom' && customStartDate && customEndDate) {
        matchesDate = isWithinInterval(transactionDate, {
          start: new Date(customStartDate),
          end: new Date(customEndDate + 'T23:59:59')
        });
      }

      return matchesSearch && matchesDate;
    });
  }, [transactions, searchQuery, dateFilter, customStartDate, customEndDate]);

  // Chart data for profit over time
  const chartData = useMemo(() => {
    const last6Months = Array.from({ length: 6 }, (_, i) => {
      const date = subMonths(new Date(), 5 - i);
      return {
        month: format(date, 'MMM yyyy', { locale: fr }),
        start: startOfMonth(date),
        end: endOfMonth(date),
        profit: 0,
        volume: 0,
        count: 0
      };
    });

    transactions.forEach(t => {
      const transactionDate = new Date(t.transaction_date);
      const monthData = last6Months.find(m =>
        isWithinInterval(transactionDate, { start: m.start, end: m.end })
      );
      if (monthData) {
        monthData.profit += t.profit;
        monthData.volume += t.amount;
        monthData.count += 1;
      }
    });

    return last6Months.map(m => ({
      month: m.month,
      profit: parseFloat(m.profit.toFixed(2)),
      volume: parseFloat(m.volume.toFixed(2)),
      count: m.count
    }));
  }, [transactions]);

  // Filtered stats
  const filteredStats = useMemo(() => {
    const totalProfit = filteredTransactions.reduce((sum, t) => sum + t.profit, 0);
    const totalVolume = filteredTransactions.reduce((sum, t) => sum + t.amount, 0);
    const avgMargin = filteredTransactions.length > 0
      ? filteredTransactions.reduce((sum, t) => sum + t.profit_percentage, 0) / filteredTransactions.length
      : 0;
    return {
      totalProfit,
      totalVolume,
      avgMargin,
      count: filteredTransactions.length
    };
  }, [filteredTransactions]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await addTransaction({
      transaction_date: new Date(formData.transaction_date).toISOString(),
      amount: parseFloat(formData.amount),
      currency: formData.currency,
      crypto_amount: parseFloat(formData.crypto_amount),
      crypto_currency: formData.crypto_currency,
      buy_price: parseFloat(formData.buy_price),
      sell_price: parseFloat(formData.sell_price),
      client_name: formData.client_name || undefined,
      client_phone: formData.client_phone || undefined,
      payment_method: formData.payment_method || undefined,
      notes: formData.notes || undefined
    });

    setIsDialogOpen(false);
    setFormData({
      transaction_date: new Date().toISOString().slice(0, 16),
      amount: '',
      currency: 'CAD',
      crypto_amount: '',
      crypto_currency: 'USDT',
      buy_price: '',
      sell_price: '',
      client_name: '',
      client_phone: '',
      payment_method: 'Interac',
      notes: ''
    });
  };

  const handleDelete = async (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette transaction ?')) {
      await deleteTransaction(id);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Toolbar */}
      <div className="flex items-center justify-end">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              className="gap-2 font-bold hover:opacity-90"
              style={{ background: '#fff', color: '#141414' }}
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Nouvelle Transaction</span>
              <span className="sm:hidden">Nouveau</span>
            </Button>
          </DialogTrigger>
          <DialogContent
            className="max-w-xl max-h-[90vh] overflow-y-auto text-white"
            style={{ background: CARD, border: `1px solid ${BORDER}` }}
          >
            <DialogHeader>
              <DialogTitle className="text-white">Ajouter une Transaction Manuelle</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-5 pt-2">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <Label htmlFor="transaction_date" className="text-[#9ca3af] text-sm">Date de Transaction</Label>
                  <Input
                    id="transaction_date"
                    type="datetime-local"
                    value={formData.transaction_date}
                    onChange={(e) => setFormData({ ...formData, transaction_date: e.target.value })}
                    required
                    className={inputClass}
                    style={inputStyle}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="client_name" className="text-[#9ca3af] text-sm">Nom du Client</Label>
                  <Input
                    id="client_name"
                    value={formData.client_name}
                    onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
                    placeholder="Nom du client"
                    className={inputClass}
                    style={inputStyle}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <Label htmlFor="client_phone" className="text-[#9ca3af] text-sm">Téléphone du Client</Label>
                  <Input
                    id="client_phone"
                    value={formData.client_phone}
                    onChange={(e) => setFormData({ ...formData, client_phone: e.target.value })}
                    placeholder="+1 234 567 8900"
                    className={inputClass}
                    style={inputStyle}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="payment_method" className="text-[#9ca3af] text-sm">Méthode de Paiement</Label>
                  <Input
                    id="payment_method"
                    value={formData.payment_method}
                    onChange={(e) => setFormData({ ...formData, payment_method: e.target.value })}
                    placeholder="Interac, Virement, etc."
                    className={inputClass}
                    style={inputStyle}
                  />
                </div>
              </div>

              <div className="pt-4" style={{ borderTop: `1px solid ${BORDER}` }}>
                <h3 className="font-semibold mb-3 text-white">Détails Financiers</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <Label htmlFor="crypto_amount" className="text-[#9ca3af] text-sm">Montant Crypto</Label>
                    <Input
                      id="crypto_amount"
                      type="number"
                      step="0.01"
                      value={formData.crypto_amount}
                      onChange={(e) => setFormData({ ...formData, crypto_amount: e.target.value })}
                      placeholder="1000"
                      required
                      className={inputClass}
                      style={inputStyle}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="crypto_currency" className="text-[#9ca3af] text-sm">Crypto</Label>
                    <Input
                      id="crypto_currency"
                      value={formData.crypto_currency}
                      onChange={(e) => setFormData({ ...formData, crypto_currency: e.target.value })}
                      placeholder="USDT"
                      required
                      className={inputClass}
                      style={inputStyle}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6 mt-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="buy_price" className="text-[#9ca3af] text-sm">Prix d'Achat (unitaire)</Label>
                    <Input
                      id="buy_price"
                      type="number"
                      step="0.000001"
                      value={formData.buy_price}
                      onChange={(e) => setFormData({ ...formData, buy_price: e.target.value })}
                      placeholder="1.35"
                      required
                      className={inputClass}
                      style={inputStyle}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="sell_price" className="text-[#9ca3af] text-sm">Prix de Vente (unitaire)</Label>
                    <Input
                      id="sell_price"
                      type="number"
                      step="0.000001"
                      value={formData.sell_price}
                      onChange={(e) => setFormData({ ...formData, sell_price: e.target.value })}
                      placeholder="1.37"
                      required
                      className={inputClass}
                      style={inputStyle}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6 mt-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="amount" className="text-[#9ca3af] text-sm">Montant Total</Label>
                    <Input
                      id="amount"
                      type="number"
                      step="0.01"
                      value={formData.amount}
                      onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                      placeholder="4000"
                      required
                      className={inputClass}
                      style={inputStyle}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="currency" className="text-[#9ca3af] text-sm">Devise</Label>
                    <Input
                      id="currency"
                      value={formData.currency}
                      onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                      placeholder="CAD"
                      required
                      className={inputClass}
                      style={inputStyle}
                    />
                  </div>
                </div>

                {formData.crypto_amount && formData.buy_price && formData.sell_price && (
                  <div
                    className="mt-4 p-4"
                    style={{ background: ICON_BG, borderRadius: 12, border: `1px solid ${BORDER}` }}
                  >
                    <div className="text-sm text-[#9ca3af]">Bénéfice Estimé</div>
                    <div className="text-2xl font-bold text-white">
                      {((parseFloat(formData.sell_price) - parseFloat(formData.buy_price)) * parseFloat(formData.crypto_amount)).toFixed(2)} {formData.currency}
                    </div>
                    <div className="text-sm text-[#9ca3af]">
                      Marge: {(((parseFloat(formData.sell_price) - parseFloat(formData.buy_price)) / parseFloat(formData.buy_price)) * 100).toFixed(2)}%
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="notes" className="text-[#9ca3af] text-sm">Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Notes additionnelles..."
                  rows={3}
                  className={inputClass}
                  style={inputStyle}
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  onClick={() => setIsDialogOpen(false)}
                  className="text-white hover:opacity-90"
                  style={{ background: '#2d2d2d', border: `1px solid ${BORDER}` }}
                >
                  Annuler
                </Button>
                <Button
                  type="submit"
                  className="font-bold hover:opacity-90"
                  style={{ background: '#fff', color: '#141414' }}
                >
                  Ajouter la Transaction
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters Section */}
      <div style={cardStyle}>
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#6b7280]" />
              <Input
                placeholder="Rechercher par client, téléphone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`pl-10 ${inputClass}`}
                style={inputStyle}
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-[#6b7280]" />
            <Select value={dateFilter} onValueChange={(v) => setDateFilter(v as any)}>
              <SelectTrigger className="w-[140px] text-white" style={inputStyle}>
                <SelectValue placeholder="Période" />
              </SelectTrigger>
              <SelectContent style={{ background: CARD, border: `1px solid ${BORDER}` }}>
                <SelectItem value="all" className="text-white">Tout</SelectItem>
                <SelectItem value="today" className="text-white">Aujourd'hui</SelectItem>
                <SelectItem value="week" className="text-white">Cette semaine</SelectItem>
                <SelectItem value="month" className="text-white">Ce mois</SelectItem>
                <SelectItem value="custom" className="text-white">Personnalisé</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {dateFilter === 'custom' && (
            <div className="flex items-center gap-2">
              <Input
                type="date"
                value={customStartDate}
                onChange={(e) => setCustomStartDate(e.target.value)}
                className="w-[140px] text-white"
                style={inputStyle}
              />
              <span className="text-[#6b7280]">à</span>
              <Input
                type="date"
                value={customEndDate}
                onChange={(e) => setCustomEndDate(e.target.value)}
                className="w-[140px] text-white"
                style={inputStyle}
              />
            </div>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <div style={cardStyle}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-[#9ca3af]">Bénéfice Total</span>
            <div
              className="w-10 h-10 flex items-center justify-center"
              style={{ background: ICON_BG, borderRadius: 10 }}
            >
              <DollarSign className="h-5 w-5 text-white" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-white">
            {filteredStats.totalProfit.toFixed(2)} CAD
          </div>
          <p className="text-xs text-[#6b7280] mt-1">sur {filteredStats.count} transactions</p>
        </div>

        <div style={cardStyle}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-[#9ca3af]">Volume Total</span>
            <div
              className="w-10 h-10 flex items-center justify-center"
              style={{ background: ICON_BG, borderRadius: 10 }}
            >
              <Wallet className="h-5 w-5 text-white" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-white">
            {filteredStats.totalVolume.toFixed(2)} CAD
          </div>
          <p className="text-xs text-[#6b7280] mt-1">volume filtré</p>
        </div>

        <div style={cardStyle}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-[#9ca3af]">Marge Moyenne</span>
            <div
              className="w-10 h-10 flex items-center justify-center"
              style={{ background: ICON_BG, borderRadius: 10 }}
            >
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-white">
            {filteredStats.avgMargin.toFixed(2)}%
          </div>
          <p className="text-xs text-[#6b7280] mt-1">marge filtrée</p>
        </div>

        <div style={cardStyle}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-[#9ca3af]">Transactions</span>
            <div
              className="w-10 h-10 flex items-center justify-center"
              style={{ background: ICON_BG, borderRadius: 10 }}
            >
              <Activity className="h-5 w-5 text-white" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-white">
            {filteredStats.count}
          </div>
          <p className="text-xs text-[#6b7280] mt-1">sur {stats.transactionCount} au total</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
        <div style={cardStyle}>
          <h3 className="text-white flex items-center gap-2 font-semibold mb-4">
            <TrendingUp className="h-5 w-5 text-[#9ca3af]" />
            Évolution des Bénéfices
          </h3>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.07)" />
                <XAxis dataKey="month" stroke="#9ca3af" fontSize={12} />
                <YAxis stroke="#9ca3af" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: CARD,
                    border: `1px solid ${BORDER}`,
                    borderRadius: '8px'
                  }}
                  labelStyle={{ color: '#fff' }}
                />
                <Line
                  type="monotone"
                  dataKey="profit"
                  stroke="rgba(255,255,255,0.85)"
                  strokeWidth={3}
                  dot={{ fill: 'rgba(255,255,255,0.85)', strokeWidth: 2 }}
                  name="Bénéfice (CAD)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div style={cardStyle}>
          <h3 className="text-white flex items-center gap-2 font-semibold mb-4">
            <Activity className="h-5 w-5 text-[#9ca3af]" />
            Volume et Transactions par Mois
          </h3>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.07)" />
                <XAxis dataKey="month" stroke="#9ca3af" fontSize={12} />
                <YAxis stroke="#9ca3af" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: CARD,
                    border: `1px solid ${BORDER}`,
                    borderRadius: '8px'
                  }}
                  labelStyle={{ color: '#fff' }}
                />
                <Legend />
                <Bar dataKey="count" fill="rgba(255,255,255,0.6)" name="Nombre de transactions" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div style={cardStyle}>
        <h3 className="text-white font-semibold mb-4">Historique des Transactions</h3>
        {loading ? (
          <div className="text-center py-8 text-[#9ca3af]">Chargement...</div>
        ) : filteredTransactions.length === 0 ? (
          <div className="text-center py-8 text-[#6b7280]">
            {transactions.length === 0 ? 'Aucune transaction enregistrée' : 'Aucune transaction correspondant aux filtres'}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow style={{ borderColor: BORDER }}>
                  <TableHead className="text-[#9ca3af]">Date</TableHead>
                  <TableHead className="text-[#9ca3af]">Client</TableHead>
                  <TableHead className="text-[#9ca3af]">Quantité</TableHead>
                  <TableHead className="text-[#9ca3af]">Prix Achat</TableHead>
                  <TableHead className="text-[#9ca3af]">Prix Vente</TableHead>
                  <TableHead className="text-[#9ca3af]">Montant</TableHead>
                  <TableHead className="text-[#9ca3af]">Bénéfice</TableHead>
                  <TableHead className="text-[#9ca3af]">Marge</TableHead>
                  <TableHead className="text-[#9ca3af]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.map((transaction) => (
                  <TableRow key={transaction.id} style={{ borderColor: BORDER }}>
                    <TableCell className="text-white">
                      {format(new Date(transaction.transaction_date), 'dd MMM yyyy HH:mm', { locale: fr })}
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium text-white">{transaction.client_name || 'N/A'}</div>
                        <div className="text-sm text-[#6b7280]">{transaction.client_phone}</div>
                      </div>
                    </TableCell>
                    <TableCell className="text-white">
                      {transaction.crypto_amount} unités
                    </TableCell>
                    <TableCell className="text-[#9ca3af]">{transaction.buy_price.toFixed(4)}</TableCell>
                    <TableCell className="text-[#9ca3af]">{transaction.sell_price.toFixed(4)}</TableCell>
                    <TableCell className="text-white">{transaction.amount.toFixed(2)} {transaction.currency}</TableCell>
                    <TableCell className="font-bold text-white">
                      +{transaction.profit.toFixed(2)} {transaction.currency}
                    </TableCell>
                    <TableCell>
                      <span
                        className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-white"
                        style={{ background: ICON_BG }}
                      >
                        {transaction.profit_percentage.toFixed(2)}%
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => generateInvoicePDF(transaction)}
                          className="text-white hover:bg-white/10"
                          title="Générer facture PDF"
                        >
                          <FileText className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(transaction.id)}
                          className="hover:bg-[rgba(248,113,113,0.10)]"
                          style={{ color: '#f87171' }}
                          title="Supprimer"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
}
