
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TransactionHistory } from '@/components/features/TransactionHistory';
import { useTransactions } from '@/hooks/useTransactions';
import { RefreshCw, Download, Filter } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function TransactionHistoryPage() {
  const { transactions, loading, loadTransactions, refetch, hasLoaded } = useTransactions();
  const { toast } = useToast();

  useEffect(() => {
    if (!hasLoaded) {
      loadTransactions();
    }
  }, [hasLoaded, loadTransactions]);

  const handleRefresh = async () => {
    try {
      await refetch();
      toast({
        title: "Historique mis à jour",
        description: "Vos transactions ont été actualisées avec succès."
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour l'historique.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* En-tête */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-white mb-2">
            Historique des transactions
          </h1>
          <p className="text-gray-400">
            Consultez et gérez toutes vos transactions passées
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button
            onClick={handleRefresh}
            disabled={loading}
            variant="outline"
            className="border-terex-gray text-gray-300 hover:bg-terex-gray"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Actualiser
          </Button>
          
          <Button
            variant="outline"
            className="border-terex-gray text-gray-300 hover:bg-terex-gray"
            disabled
          >
            <Download className="w-4 h-4 mr-2" />
            Exporter
          </Button>
        </div>
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-terex-darker border-terex-gray">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total transactions</p>
                <p className="text-2xl font-bold text-white">{transactions?.length || 0}</p>
              </div>
              <div className="w-12 h-12 bg-terex-accent/20 rounded-lg flex items-center justify-center">
                <RefreshCw className="w-6 h-6 text-terex-accent" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-terex-darker border-terex-gray">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Transactions réussies</p>
                <p className="text-2xl font-bold text-green-400">
                  {transactions?.filter(t => t.status === 'completed' || t.status === 'confirmed').length || 0}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                <RefreshCw className="w-6 h-6 text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-terex-darker border-terex-gray">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">En attente</p>
                <p className="text-2xl font-bold text-yellow-400">
                  {transactions?.filter(t => t.status === 'pending').length || 0}
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                <RefreshCw className="w-6 h-6 text-yellow-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Historique des transactions */}
      {loading && !hasLoaded ? (
        <Card className="bg-terex-darker border-terex-gray">
          <CardContent className="p-8">
            <div className="flex items-center justify-center">
              <RefreshCw className="w-6 h-6 animate-spin text-terex-accent mr-2" />
              <span className="text-white">Chargement de votre historique...</span>
            </div>
          </CardContent>
        </Card>
      ) : (
        <TransactionHistory transactions={transactions} />
      )}
    </div>
  );
}
