
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Send, CreditCard, History, Zap } from 'lucide-react';

export function QuickActionsCard() {
  const quickActions = [
    {
      icon: ShoppingCart,
      title: 'Acheter USDT',
      description: 'Achat rapide',
      action: () => {
        // TODO: Navigation vers achat USDT
        console.log('Navigate to buy USDT');
      },
      color: 'text-green-500'
    },
    {
      icon: Send,
      title: 'Vendre USDT',
      description: 'Vente rapide',
      action: () => {
        // TODO: Navigation vers vente USDT
        console.log('Navigate to sell USDT');
      },
      color: 'text-orange-500'
    },
    {
      icon: CreditCard,
      title: 'Transfert',
      description: 'Envoi international',
      action: () => {
        // TODO: Navigation vers transfert
        console.log('Navigate to transfer');
      },
      color: 'text-blue-500'
    },
    {
      icon: History,
      title: 'Historique',
      description: 'Mes transactions',
      action: () => {
        // TODO: Navigation vers historique
        console.log('Navigate to history');
      },
      color: 'text-purple-500'
    }
  ];

  return (
    <Card className="bg-gradient-to-br from-terex-darker to-terex-dark border-terex-gray shadow-2xl">
      <CardHeader className="bg-gradient-to-r from-terex-accent/10 to-transparent border-b border-terex-gray/50">
        <CardTitle className="text-white flex items-center">
          <Zap className="w-5 h-5 mr-2 text-terex-accent" />
          Actions rapides
        </CardTitle>
        <CardDescription className="text-gray-400">
          Accès direct à vos fonctionnalités préférées
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-2 gap-4">
          {quickActions.map((action, index) => (
            <Button
              key={index}
              variant="outline"
              className="h-auto p-4 border-terex-gray bg-terex-gray/20 hover:bg-terex-gray/40 text-left flex-col items-start space-y-2"
              onClick={action.action}
            >
              <action.icon className={`w-6 h-6 ${action.color}`} />
              <div>
                <div className="text-white font-medium text-sm">{action.title}</div>
                <div className="text-gray-400 text-xs">{action.description}</div>
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
