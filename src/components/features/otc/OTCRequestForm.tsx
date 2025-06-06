
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Calculator, Send, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function OTCRequestForm() {
  const [formData, setFormData] = useState({
    type: '',
    amount: '',
    targetPrice: '',
    description: '',
    deadline: '',
    contactMethod: ''
  });
  const [estimatedFees, setEstimatedFees] = useState(0);
  const { toast } = useToast();

  const calculateFees = (amount: number) => {
    if (amount >= 5000000) return 0.08;
    if (amount >= 1000000) return 0.10;
    if (amount >= 500000) return 0.12;
    if (amount >= 100000) return 0.15;
    return 0.20;
  };

  const handleAmountChange = (value: string) => {
    setFormData({ ...formData, amount: value });
    const amount = parseFloat(value) || 0;
    const feeRate = calculateFees(amount);
    setEstimatedFees(amount * (feeRate / 100));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('OTC Request:', formData);
    toast({
      title: "Demande OTC envoyée",
      description: "Votre demande de trading OTC a été transmise à notre équipe. Vous serez contacté sous 30 minutes.",
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="bg-terex-darker border-terex-gray/30">
        <CardHeader>
          <CardTitle className="text-white">Nouvelle demande OTC</CardTitle>
          <CardDescription className="text-gray-400">
            Remplissez les détails de votre transaction OTC
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type" className="text-white">Type de transaction</Label>
                <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                  <SelectTrigger className="bg-terex-gray border-terex-gray text-white">
                    <SelectValue placeholder="Choisir le type" />
                  </SelectTrigger>
                  <SelectContent className="bg-terex-darker border-terex-gray">
                    <SelectItem value="buy">Achat USDT</SelectItem>
                    <SelectItem value="sell">Vente USDT</SelectItem>
                    <SelectItem value="swap">Échange crypto</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount" className="text-white">Montant (USDT)</Label>
                <Input
                  id="amount"
                  type="number"
                  min="100000"
                  value={formData.amount}
                  onChange={(e) => handleAmountChange(e.target.value)}
                  placeholder="Minimum 100,000"
                  className="bg-terex-gray border-terex-gray text-white placeholder:text-gray-400"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="targetPrice" className="text-white">Prix cible (optionnel)</Label>
              <Input
                id="targetPrice"
                type="number"
                step="0.001"
                value={formData.targetPrice}
                onChange={(e) => setFormData({ ...formData, targetPrice: e.target.value })}
                placeholder="Ex: 1.002"
                className="bg-terex-gray border-terex-gray text-white placeholder:text-gray-400"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="deadline" className="text-white">Délai souhaité</Label>
              <Select value={formData.deadline} onValueChange={(value) => setFormData({ ...formData, deadline: value })}>
                <SelectTrigger className="bg-terex-gray border-terex-gray text-white">
                  <SelectValue placeholder="Sélectionner un délai" />
                </SelectTrigger>
                <SelectContent className="bg-terex-darker border-terex-gray">
                  <SelectItem value="immediate">Immédiat (&lt; 30 min)</SelectItem>
                  <SelectItem value="1hour">Dans l&apos;heure</SelectItem>
                  <SelectItem value="4hours">Dans les 4 heures</SelectItem>
                  <SelectItem value="24hours">Dans les 24 heures</SelectItem>
                  <SelectItem value="flexible">Flexible</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="contactMethod" className="text-white">Méthode de contact préférée</Label>
              <Select value={formData.contactMethod} onValueChange={(value) => setFormData({ ...formData, contactMethod: value })}>
                <SelectTrigger className="bg-terex-gray border-terex-gray text-white">
                  <SelectValue placeholder="Comment vous contacter" />
                </SelectTrigger>
                <SelectContent className="bg-terex-darker border-terex-gray">
                  <SelectItem value="phone">Téléphone</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="telegram">Telegram</SelectItem>
                  <SelectItem value="whatsapp">WhatsApp</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-white">Détails complémentaires</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Conditions spéciales, notes, préférences..."
                className="bg-terex-gray border-terex-gray text-white placeholder:text-gray-400 min-h-[100px]"
              />
            </div>

            <Button 
              type="submit" 
              className="w-full bg-terex-accent hover:bg-terex-accent-light text-white font-medium py-3"
              disabled={!formData.type || !formData.amount || parseFloat(formData.amount) < 100000}
            >
              <Send className="mr-2 h-4 w-4" />
              Envoyer la demande OTC
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-6">
        <Card className="bg-terex-darker border-terex-gray/30">
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-2">
              <Calculator className="h-5 w-5 text-terex-accent" />
              <span>Estimation des coûts</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {formData.amount && parseFloat(formData.amount) >= 100000 ? (
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Montant</span>
                  <span className="text-white font-medium">{parseFloat(formData.amount).toLocaleString()} USDT</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Commission ({calculateFees(parseFloat(formData.amount))}%)</span>
                  <span className="text-white font-medium">{estimatedFees.toLocaleString()} USDT</span>
                </div>
                <div className="border-t border-terex-gray/30 pt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-white font-medium">Total estimé</span>
                    <span className="text-terex-accent font-bold">
                      {formData.type === 'buy' 
                        ? (parseFloat(formData.amount) + estimatedFees).toLocaleString()
                        : (parseFloat(formData.amount) - estimatedFees).toLocaleString()
                      } USDT
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-gray-400">Entrez un montant ≥ 100,000 USDT pour voir l&apos;estimation</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-terex-darker border-terex-gray/30">
          <CardHeader>
            <CardTitle className="text-white">Avantages OTC</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center space-x-3">
              <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/30">
                Liquidité
              </Badge>
              <span className="text-sm text-gray-400">Accès à des pools de liquidité privés</span>
            </div>
            <div className="flex items-center space-x-3">
              <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/30">
                Discrétion
              </Badge>
              <span className="text-sm text-gray-400">Transactions confidentielles</span>
            </div>
            <div className="flex items-center space-x-3">
              <Badge variant="outline" className="bg-terex-accent/10 text-terex-accent border-terex-accent/30">
                Support
              </Badge>
              <span className="text-sm text-gray-400">Accompagnement personnalisé</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-yellow-500/10 border-yellow-500/30">
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5" />
              <div className="space-y-2">
                <p className="text-yellow-500 font-medium text-sm">Important</p>
                <p className="text-yellow-200 text-sm">
                  Les transactions OTC sont soumises à validation. Notre équipe vous contactera pour finaliser les détails et conditions.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
