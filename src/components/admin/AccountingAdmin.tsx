import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useManualTransactions } from '@/hooks/useManualTransactions';
import { Plus, DollarSign, TrendingUp, Activity, Wallet, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export function AccountingAdmin() {
  const { transactions, loading, addTransaction, deleteTransaction, stats } = useManualTransactions();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
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
    <div className="min-h-screen bg-gray-50 p-3 sm:p-6 space-y-4 sm:space-y-8">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-terex-accent/20 to-gray-100 rounded-xl sm:rounded-2xl p-4 sm:p-8 border border-gray-200">
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-2 sm:mb-3">Comptabilité Manuelle</h1>
            <p className="text-gray-600 text-sm sm:text-lg">Gérez vos transactions hors plateforme</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2 bg-terex-accent hover:bg-terex-accent/90 text-white">
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">Nouvelle Transaction</span>
                <span className="sm:hidden">Nouveau</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white">
              <DialogHeader>
                <DialogTitle className="text-gray-900">Ajouter une Transaction Manuelle</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="transaction_date" className="text-gray-700">Date de Transaction</Label>
                    <Input
                      id="transaction_date"
                      type="datetime-local"
                      value={formData.transaction_date}
                      onChange={(e) => setFormData({ ...formData, transaction_date: e.target.value })}
                      required
                      className="bg-white border-gray-200 text-gray-900"
                    />
                  </div>
                  <div>
                    <Label htmlFor="client_name" className="text-gray-700">Nom du Client</Label>
                    <Input
                      id="client_name"
                      value={formData.client_name}
                      onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
                      placeholder="Nom du client"
                      className="bg-white border-gray-200 text-gray-900"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="client_phone" className="text-gray-700">Téléphone du Client</Label>
                    <Input
                      id="client_phone"
                      value={formData.client_phone}
                      onChange={(e) => setFormData({ ...formData, client_phone: e.target.value })}
                      placeholder="+1 234 567 8900"
                      className="bg-white border-gray-200 text-gray-900"
                    />
                  </div>
                  <div>
                    <Label htmlFor="payment_method" className="text-gray-700">Méthode de Paiement</Label>
                    <Input
                      id="payment_method"
                      value={formData.payment_method}
                      onChange={(e) => setFormData({ ...formData, payment_method: e.target.value })}
                      placeholder="Interac, Virement, etc."
                      className="bg-white border-gray-200 text-gray-900"
                    />
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h3 className="font-semibold mb-3 text-gray-900">Détails Financiers</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="crypto_amount" className="text-gray-700">Montant Crypto</Label>
                      <Input
                        id="crypto_amount"
                        type="number"
                        step="0.01"
                        value={formData.crypto_amount}
                        onChange={(e) => setFormData({ ...formData, crypto_amount: e.target.value })}
                        placeholder="1000"
                        required
                        className="bg-white border-gray-200 text-gray-900"
                      />
                    </div>
                    <div>
                      <Label htmlFor="crypto_currency" className="text-gray-700">Crypto</Label>
                      <Input
                        id="crypto_currency"
                        value={formData.crypto_currency}
                        onChange={(e) => setFormData({ ...formData, crypto_currency: e.target.value })}
                        placeholder="USDT"
                        required
                        className="bg-white border-gray-200 text-gray-900"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div>
                      <Label htmlFor="buy_price" className="text-gray-700">Prix d'Achat (unitaire)</Label>
                      <Input
                        id="buy_price"
                        type="number"
                        step="0.000001"
                        value={formData.buy_price}
                        onChange={(e) => setFormData({ ...formData, buy_price: e.target.value })}
                        placeholder="1.35"
                        required
                        className="bg-white border-gray-200 text-gray-900"
                      />
                    </div>
                    <div>
                      <Label htmlFor="sell_price" className="text-gray-700">Prix de Vente (unitaire)</Label>
                      <Input
                        id="sell_price"
                        type="number"
                        step="0.000001"
                        value={formData.sell_price}
                        onChange={(e) => setFormData({ ...formData, sell_price: e.target.value })}
                        placeholder="1.37"
                        required
                        className="bg-white border-gray-200 text-gray-900"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div>
                      <Label htmlFor="amount" className="text-gray-700">Montant Total</Label>
                      <Input
                        id="amount"
                        type="number"
                        step="0.01"
                        value={formData.amount}
                        onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                        placeholder="4000"
                        required
                        className="bg-white border-gray-200 text-gray-900"
                      />
                    </div>
                    <div>
                      <Label htmlFor="currency" className="text-gray-700">Devise</Label>
                      <Input
                        id="currency"
                        value={formData.currency}
                        onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                        placeholder="CAD"
                        required
                        className="bg-white border-gray-200 text-gray-900"
                      />
                    </div>
                  </div>

                  {formData.crypto_amount && formData.buy_price && formData.sell_price && (
                    <div className="mt-4 p-4 bg-terex-accent/10 rounded-lg border border-terex-accent/20">
                      <div className="text-sm text-gray-600">Bénéfice Estimé</div>
                      <div className="text-2xl font-bold text-terex-accent">
                        {((parseFloat(formData.sell_price) - parseFloat(formData.buy_price)) * parseFloat(formData.crypto_amount)).toFixed(2)} {formData.currency}
                      </div>
                      <div className="text-sm text-gray-600">
                        Marge: {(((parseFloat(formData.sell_price) - parseFloat(formData.buy_price)) / parseFloat(formData.buy_price)) * 100).toFixed(2)}%
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <Label htmlFor="notes" className="text-gray-700">Notes</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Notes additionnelles..."
                    rows={3}
                    className="bg-white border-gray-200 text-gray-900"
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} className="border-gray-300 text-gray-700 hover:bg-gray-100">
                    Annuler
                  </Button>
                  <Button type="submit" className="bg-terex-accent hover:bg-terex-accent/90 text-white">
                    Ajouter la Transaction
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
        
        <div className="absolute top-0 right-0 w-32 sm:w-64 h-32 sm:h-64 bg-terex-accent/10 rounded-full -translate-y-16 sm:-translate-y-32 translate-x-16 sm:translate-x-32"></div>
        <div className="absolute bottom-0 left-0 w-16 sm:w-32 h-16 sm:h-32 bg-terex-accent/5 rounded-full translate-y-8 sm:translate-y-16 -translate-x-8 sm:-translate-x-16"></div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
        <Card className="bg-white border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Bénéfice Total</CardTitle>
            <div className="w-10 h-10 bg-terex-accent/10 rounded-full flex items-center justify-center">
              <DollarSign className="h-5 w-5 text-terex-accent" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-bold text-terex-accent">
              {stats.totalProfit.toFixed(2)} CAD
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Volume Total</CardTitle>
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <Wallet className="h-5 w-5 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-bold text-gray-900">
              {stats.totalVolume.toFixed(2)} CAD
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Marge Moyenne</CardTitle>
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-bold text-gray-900">
              {stats.averageProfitPercentage.toFixed(2)}%
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Transactions</CardTitle>
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <Activity className="h-5 w-5 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-bold text-gray-900">
              {stats.transactionCount}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Transactions Table */}
      <Card className="bg-white border-gray-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-gray-900">Historique des Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-gray-600">Chargement...</div>
          ) : transactions.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Aucune transaction enregistrée
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-200">
                    <TableHead className="text-gray-700">Date</TableHead>
                    <TableHead className="text-gray-700">Client</TableHead>
                    <TableHead className="text-gray-700">Crypto</TableHead>
                    <TableHead className="text-gray-700">Prix Achat</TableHead>
                    <TableHead className="text-gray-700">Prix Vente</TableHead>
                    <TableHead className="text-gray-700">Montant</TableHead>
                    <TableHead className="text-gray-700">Bénéfice</TableHead>
                    <TableHead className="text-gray-700">Marge</TableHead>
                    <TableHead className="text-gray-700">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((transaction) => (
                    <TableRow key={transaction.id} className="border-gray-200 hover:bg-gray-50">
                      <TableCell className="text-gray-900">
                        {format(new Date(transaction.transaction_date), 'dd MMM yyyy HH:mm', { locale: fr })}
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium text-gray-900">{transaction.client_name || 'N/A'}</div>
                          <div className="text-sm text-gray-500">{transaction.client_phone}</div>
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-900">
                        {transaction.crypto_amount} {transaction.crypto_currency}
                      </TableCell>
                      <TableCell className="text-gray-700">{transaction.buy_price.toFixed(4)}</TableCell>
                      <TableCell className="text-gray-700">{transaction.sell_price.toFixed(4)}</TableCell>
                      <TableCell className="text-gray-900">{transaction.amount.toFixed(2)} {transaction.currency}</TableCell>
                      <TableCell className="font-bold text-terex-accent">
                        +{transaction.profit.toFixed(2)} {transaction.currency}
                      </TableCell>
                      <TableCell>
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-terex-accent/10 text-terex-accent">
                          {transaction.profit_percentage.toFixed(2)}%
                        </span>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(transaction.id)}
                          className="hover:bg-red-50 hover:text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
