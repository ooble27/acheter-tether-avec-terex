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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Comptabilité Manuelle</h1>
          <p className="text-muted-foreground mt-1">
            Gérez vos transactions hors plateforme
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Nouvelle Transaction
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-background">
            <DialogHeader>
              <DialogTitle>Ajouter une Transaction Manuelle</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="transaction_date">Date de Transaction</Label>
                  <Input
                    id="transaction_date"
                    type="datetime-local"
                    value={formData.transaction_date}
                    onChange={(e) => setFormData({ ...formData, transaction_date: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="client_name">Nom du Client</Label>
                  <Input
                    id="client_name"
                    value={formData.client_name}
                    onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
                    placeholder="Nom du client"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="client_phone">Téléphone du Client</Label>
                  <Input
                    id="client_phone"
                    value={formData.client_phone}
                    onChange={(e) => setFormData({ ...formData, client_phone: e.target.value })}
                    placeholder="+1 234 567 8900"
                  />
                </div>
                <div>
                  <Label htmlFor="payment_method">Méthode de Paiement</Label>
                  <Input
                    id="payment_method"
                    value={formData.payment_method}
                    onChange={(e) => setFormData({ ...formData, payment_method: e.target.value })}
                    placeholder="Interac, Virement, etc."
                  />
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-semibold mb-3">Détails Financiers</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="crypto_amount">Montant Crypto</Label>
                    <Input
                      id="crypto_amount"
                      type="number"
                      step="0.01"
                      value={formData.crypto_amount}
                      onChange={(e) => setFormData({ ...formData, crypto_amount: e.target.value })}
                      placeholder="1000"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="crypto_currency">Crypto</Label>
                    <Input
                      id="crypto_currency"
                      value={formData.crypto_currency}
                      onChange={(e) => setFormData({ ...formData, crypto_currency: e.target.value })}
                      placeholder="USDT"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <Label htmlFor="buy_price">Prix d'Achat (unitaire)</Label>
                    <Input
                      id="buy_price"
                      type="number"
                      step="0.000001"
                      value={formData.buy_price}
                      onChange={(e) => setFormData({ ...formData, buy_price: e.target.value })}
                      placeholder="1.35"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="sell_price">Prix de Vente (unitaire)</Label>
                    <Input
                      id="sell_price"
                      type="number"
                      step="0.000001"
                      value={formData.sell_price}
                      onChange={(e) => setFormData({ ...formData, sell_price: e.target.value })}
                      placeholder="1.37"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <Label htmlFor="amount">Montant Total</Label>
                    <Input
                      id="amount"
                      type="number"
                      step="0.01"
                      value={formData.amount}
                      onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                      placeholder="4000"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="currency">Devise</Label>
                    <Input
                      id="currency"
                      value={formData.currency}
                      onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                      placeholder="CAD"
                      required
                    />
                  </div>
                </div>

                {formData.crypto_amount && formData.buy_price && formData.sell_price && (
                  <div className="mt-4 p-4 bg-muted/50 rounded-lg border border-border">
                    <div className="text-sm text-muted-foreground">Bénéfice Estimé</div>
                    <div className="text-2xl font-bold text-terex-highlight">
                      {((parseFloat(formData.sell_price) - parseFloat(formData.buy_price)) * parseFloat(formData.crypto_amount)).toFixed(2)} {formData.currency}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Marge: {(((parseFloat(formData.sell_price) - parseFloat(formData.buy_price)) / parseFloat(formData.buy_price)) * 100).toFixed(2)}%
                    </div>
                  </div>
                )}
              </div>

              <div>
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Notes additionnelles..."
                  rows={3}
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Annuler
                </Button>
                <Button type="submit">
                  Ajouter la Transaction
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-foreground">Bénéfice Total</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-terex-highlight">
              {stats.totalProfit.toFixed(2)} CAD
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-foreground">Volume Total</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {stats.totalVolume.toFixed(2)} CAD
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-foreground">Marge Moyenne</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {stats.averageProfitPercentage.toFixed(2)}%
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-foreground">Transactions</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {stats.transactionCount}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Transactions Table */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Historique des Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Chargement...</div>
          ) : transactions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Aucune transaction enregistrée
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Crypto</TableHead>
                    <TableHead>Prix Achat</TableHead>
                    <TableHead>Prix Vente</TableHead>
                    <TableHead>Montant</TableHead>
                    <TableHead>Bénéfice</TableHead>
                    <TableHead>Marge</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell>
                        {format(new Date(transaction.transaction_date), 'dd MMM yyyy HH:mm', { locale: fr })}
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{transaction.client_name || 'N/A'}</div>
                          <div className="text-sm text-muted-foreground">{transaction.client_phone}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {transaction.crypto_amount} {transaction.crypto_currency}
                      </TableCell>
                      <TableCell>{transaction.buy_price.toFixed(4)}</TableCell>
                      <TableCell>{transaction.sell_price.toFixed(4)}</TableCell>
                      <TableCell>{transaction.amount.toFixed(2)} {transaction.currency}</TableCell>
                      <TableCell className="font-bold text-terex-highlight">
                        +{transaction.profit.toFixed(2)} {transaction.currency}
                      </TableCell>
                      <TableCell>
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-terex-highlight/10 text-terex-highlight">
                          {transaction.profit_percentage.toFixed(2)}%
                        </span>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(transaction.id)}
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
