
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

export function InternationalTransfer() {
  const [cadAmount, setCadAmount] = useState('');
  const [country, setCountry] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [recipientPhone, setRecipientPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);

  const exchangeRates = {
    senegal: 456, // 1 CAD = 456 CFA
    'cote-ivoire': 456,
    mali: 456,
    burkina: 456,
    niger: 456,
  };

  const cfaAmount = cadAmount && country ? 
    (parseFloat(cadAmount) * exchangeRates[country as keyof typeof exchangeRates]).toFixed(0) : '0';

  const handleTransfer = () => {
    if (!cadAmount || !country || !recipientName || !recipientPhone || !paymentMethod) return;
    setShowConfirmation(true);
  };

  const handleConfirm = () => {
    setShowConfirmation(false);
    console.log('Redirection vers le paiement pour le virement...');
  };

  return (
    <div className="min-h-screen bg-terex-dark p-2 md:p-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 md:mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Virement International</h1>
          <p className="text-gray-400">
            Envoyez de l'argent rapidement et en toute sécurité vers l'Afrique
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="bg-terex-darker border-terex-gray">
            <CardHeader>
              <CardTitle className="text-white">Détails du virement</CardTitle>
              <CardDescription className="text-gray-400">
                Configurez votre transfert international
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label className="text-white">Montant à envoyer (CAD)</Label>
                <Input
                  type="number"
                  placeholder="Montant en dollars canadiens"
                  value={cadAmount}
                  onChange={(e) => setCadAmount(e.target.value)}
                  className="bg-terex-gray border-terex-gray-light text-white placeholder:text-gray-500"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-white">Pays de destination</Label>
                <Select value={country} onValueChange={setCountry}>
                  <SelectTrigger className="bg-terex-gray border-terex-gray-light text-white">
                    <SelectValue placeholder="Choisissez un pays" />
                  </SelectTrigger>
                  <SelectContent className="bg-terex-gray border-terex-gray-light">
                    <SelectItem value="senegal">🇸🇳 Sénégal</SelectItem>
                    <SelectItem value="cote-ivoire">🇨🇮 Côte d'Ivoire</SelectItem>
                    <SelectItem value="mali">🇲🇱 Mali</SelectItem>
                    <SelectItem value="burkina">🇧🇫 Burkina Faso</SelectItem>
                    <SelectItem value="niger">🇳🇪 Niger</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-white">Nom du bénéficiaire</Label>
                <Input
                  type="text"
                  placeholder="Nom complet du destinataire"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  className="bg-terex-gray border-terex-gray-light text-white placeholder:text-gray-500"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-white">Numéro de téléphone</Label>
                <Input
                  type="tel"
                  placeholder="+221 XX XXX XX XX"
                  value={recipientPhone}
                  onChange={(e) => setRecipientPhone(e.target.value)}
                  className="bg-terex-gray border-terex-gray-light text-white placeholder:text-gray-500"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-white">Méthode de réception</Label>
                <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                  <SelectTrigger className="bg-terex-gray border-terex-gray-light text-white">
                    <SelectValue placeholder="Choisissez une méthode" />
                  </SelectTrigger>
                  <SelectContent className="bg-terex-gray border-terex-gray-light">
                    <SelectItem value="orange">
                      <div className="flex items-center space-x-2">
                        <img 
                          src="/lovable-uploads/109de98a-a26f-4bbf-b8f0-8f33c50d1a7a.png" 
                          alt="Orange Money" 
                          className="w-6 h-6 object-contain"
                        />
                        <span>Orange Money</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="wave">
                      <div className="flex items-center space-x-2">
                        <img 
                          src="/lovable-uploads/e4d24098-9cf3-4dcb-a9fb-57e6c263dc64.png" 
                          alt="Wave" 
                          className="w-6 h-6 object-contain"
                        />
                        <span>Wave</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="interac">
                      <div className="flex items-center space-x-2">
                        <img 
                          src="/lovable-uploads/bc1a1cb4-cd89-4200-bed4-5090b6e10d48.png" 
                          alt="Interac" 
                          className="w-6 h-6 object-contain"
                        />
                        <span>Interac e-Transfer</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {paymentMethod && (
                <div className="space-y-2">
                  <Label className="text-white">
                    {paymentMethod === 'interac' ? 'Adresse email Interac' : 'Numéro de réception'}
                  </Label>
                  <Input
                    type={paymentMethod === 'interac' ? 'email' : 'tel'}
                    placeholder={paymentMethod === 'interac' ? 'email@exemple.com' : '+221 XX XXX XX XX'}
                    className="bg-terex-gray border-terex-gray-light text-white"
                  />
                </div>
              )}

              <Button 
                onClick={handleTransfer}
                disabled={!cadAmount || !country || !recipientName || !recipientPhone || !paymentMethod}
                className="w-full gradient-button text-white font-medium disabled:opacity-50"
              >
                Envoyer le virement
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-terex-darker border-terex-gray">
            <CardHeader>
              <CardTitle className="text-white">Récapitulatif</CardTitle>
              <CardDescription className="text-gray-400">
                Détails de votre transfert international
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-terex-gray rounded-lg space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-300">Montant envoyé</span>
                  <span className="text-white font-medium">
                    {cadAmount || '0'} CAD
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Taux de change</span>
                  <span className="text-terex-accent">
                    1 CAD = {country ? exchangeRates[country as keyof typeof exchangeRates] : '---'} CFA
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Frais de transfert</span>
                  <span className="text-terex-accent">
                    Inclus
                  </span>
                </div>
                <div className="flex justify-between border-t border-terex-gray-light pt-3">
                  <span className="text-gray-300">Montant reçu</span>
                  <span className="text-terex-accent font-bold text-lg">
                    {cfaAmount} CFA
                  </span>
                </div>
              </div>

              {/* Méthodes de paiement disponibles */}
              <div className="space-y-3">
                <h3 className="text-white font-medium">Méthodes de paiement acceptées</h3>
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-terex-gray p-3 rounded-lg flex flex-col items-center space-y-2">
                    <img 
                      src="/lovable-uploads/109de98a-a26f-4bbf-b8f0-8f33c50d1a7a.png" 
                      alt="Orange Money" 
                      className="w-8 h-8 object-contain"
                    />
                    <span className="text-xs text-gray-300 text-center">Orange Money</span>
                  </div>
                  <div className="bg-terex-gray p-3 rounded-lg flex flex-col items-center space-y-2">
                    <img 
                      src="/lovable-uploads/e4d24098-9cf3-4dcb-a9fb-57e6c263dc64.png" 
                      alt="Wave" 
                      className="w-8 h-8 object-contain"
                    />
                    <span className="text-xs text-gray-300 text-center">Wave</span>
                  </div>
                  <div className="bg-terex-gray p-3 rounded-lg flex flex-col items-center space-y-2">
                    <img 
                      src="/lovable-uploads/bc1a1cb4-cd89-4200-bed4-5090b6e10d48.png" 
                      alt="Interac" 
                      className="w-8 h-8 object-contain"
                    />
                    <span className="text-xs text-gray-300 text-center">Interac e-Transfer</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-white font-medium">Informations importantes</h3>
                <ul className="text-sm text-gray-400 space-y-1">
                  <li>• Transfert sous 15 minutes</li>
                  <li>• Taux de change compétitif</li>
                  <li>• Frais de transaction inclus</li>
                  <li>• Minimum 25 CAD</li>
                  <li>• Service disponible 24/7</li>
                </ul>
              </div>

              {country && (
                <div className="p-3 bg-terex-accent/10 border border-terex-accent/20 rounded-lg">
                  <p className="text-terex-accent text-sm">
                    🌍 Transfert vers {country === 'senegal' ? 'le Sénégal' : 
                      country === 'cote-ivoire' ? 'la Côte d\'Ivoire' :
                      country === 'mali' ? 'le Mali' :
                      country === 'burkina' ? 'le Burkina Faso' : 'le Niger'}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
          <DialogContent className="bg-terex-darker border-terex-gray">
            <DialogHeader>
              <DialogTitle className="text-white">Confirmer le virement</DialogTitle>
              <DialogDescription className="text-gray-400">
                Vérifiez les informations avant d'envoyer le virement.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-3">
              <div className="p-4 bg-terex-gray rounded-lg">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-300">Montant à envoyer:</span>
                  <span className="text-white">{cadAmount} CAD</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-300">Pays de destination:</span>
                  <span className="text-white">
                    {country === 'senegal' ? '🇸🇳 Sénégal' : 
                     country === 'cote-ivoire' ? '🇨🇮 Côte d\'Ivoire' :
                     country === 'mali' ? '🇲🇱 Mali' :
                     country === 'burkina' ? '🇧🇫 Burkina Faso' : '🇳🇪 Niger'}
                  </span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-300">Montant à recevoir:</span>
                  <span className="text-terex-accent">{cfaAmount} CFA</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-300">Méthode de réception:</span>
                  <div className="flex items-center space-x-2">
                    {paymentMethod === 'orange' && (
                      <img 
                        src="/lovable-uploads/109de98a-a26f-4bbf-b8f0-8f33c50d1a7a.png" 
                        alt="Orange Money" 
                        className="w-4 h-4 object-contain"
                      />
                    )}
                    {paymentMethod === 'wave' && (
                      <img 
                        src="/lovable-uploads/e4d24098-9cf3-4dcb-a9fb-57e6c263dc64.png" 
                        alt="Wave" 
                        className="w-4 h-4 object-contain"
                      />
                    )}
                    {paymentMethod === 'interac' && (
                      <img 
                        src="/lovable-uploads/bc1a1cb4-cd89-4200-bed4-5090b6e10d48.png" 
                        alt="Interac" 
                        className="w-4 h-4 object-contain"
                      />
                    )}
                    <span className="text-white">
                      {paymentMethod === 'orange' ? 'Orange Money' : 
                       paymentMethod === 'wave' ? 'Wave' : 
                       paymentMethod === 'interac' ? 'Interac e-Transfer' : 'Moov Money'}
                    </span>
                  </div>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-300">Bénéficiaire:</span>
                  <span className="text-white">{recipientName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">
                    {paymentMethod === 'interac' ? 'Email de réception:' : 'Numéro de réception:'}
                  </span>
                  <span className="text-white">{recipientPhone}</span>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setShowConfirmation(false)}
                className="border-terex-gray text-gray-300"
              >
                Annuler
              </Button>
              <Button 
                onClick={handleConfirm}
                className="gradient-button text-white"
              >
                Confirmer le virement
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
