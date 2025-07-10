
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { 
  Users, 
  Plus, 
  Search, 
  ArrowRight, 
  Phone, 
  Mail, 
  MapPin,
  Trash2,
  Clock
} from 'lucide-react';
import { useFavoriteRecipients, FavoriteRecipient } from '@/hooks/useFavoriteRecipients';

interface RecipientSelectorProps {
  onSelectRecipient: (recipient: FavoriteRecipient | null) => void;
  onContinue: () => void;
  selectedRecipient: FavoriteRecipient | null;
  isNewRecipient: boolean;
  setIsNewRecipient: (value: boolean) => void;
}

const availableCountries = [
  { code: 'SN', name: 'Sénégal', flag: '🇸🇳' },
  { code: 'CI', name: 'Côte d\'Ivoire', flag: '🇨🇮' },
  { code: 'ML', name: 'Mali', flag: '🇲🇱' },
  { code: 'BF', name: 'Burkina Faso', flag: '🇧🇫' },
  { code: 'NG', name: 'Nigeria', flag: '🇳🇬' },
  { code: 'BJ', name: 'Bénin', flag: '🇧🇯' }
];

export function RecipientSelector({ 
  onSelectRecipient, 
  onContinue, 
  selectedRecipient, 
  isNewRecipient, 
  setIsNewRecipient 
}: RecipientSelectorProps) {
  const { recipients, loading, deleteRecipient } = useFavoriteRecipients();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredRecipients = recipients.filter(recipient =>
    recipient.recipient_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    recipient.recipient_country.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getCountryName = (countryCode: string) => {
    const country = availableCountries.find(c => c.code === countryCode);
    return country ? `${country.flag} ${country.name}` : countryCode;
  };

  const getReceiveMethodName = (method: string, provider?: string) => {
    if (method === 'mobile') {
      return provider === 'wave' ? 'Wave' : provider === 'orange' ? 'Orange Money' : 'Mobile Money';
    }
    if (method === 'bank_transfer') return 'Virement bancaire';
    if (method === 'cash_pickup') return 'Retrait espèces';
    return method;
  };

  const handleSelectRecipient = (recipient: FavoriteRecipient) => {
    onSelectRecipient(recipient);
    setIsNewRecipient(false);
  };

  const handleNewRecipient = () => {
    onSelectRecipient(null);
    setIsNewRecipient(true);
  };

  if (loading) {
    return (
      <Card className="bg-terex-darker border-terex-gray">
        <CardContent className="p-6">
          <div className="text-center text-gray-400">Chargement des destinataires...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-terex-darker border-terex-gray shadow-2xl">
      <CardHeader className="border-b border-terex-gray p-4 md:p-6">
        <CardTitle className="text-white text-lg md:text-xl flex items-center">
          <Users className="w-5 h-5 mr-2 text-terex-accent" />
          Choisir le destinataire
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-4 md:p-6 space-y-6">
        {recipients.length > 0 && (
          <>
            {/* Barre de recherche */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Rechercher un destinataire..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-terex-gray border-terex-gray-light text-white pl-10 h-12"
              />
            </div>

            {/* Liste des destinataires favoris */}
            <div className="space-y-3 max-h-80 overflow-y-auto">
              <Label className="text-white text-sm font-medium">Destinataires récents</Label>
              {filteredRecipients.map((recipient) => (
                <div
                  key={recipient.id}
                  onClick={() => handleSelectRecipient(recipient)}
                  className={`p-4 rounded-lg border cursor-pointer transition-all hover:border-terex-accent/50 ${
                    selectedRecipient?.id === recipient.id
                      ? 'border-terex-accent bg-terex-accent/10'
                      : 'border-terex-gray-light bg-terex-gray/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-white font-semibold">{recipient.recipient_name}</h3>
                        <Badge variant="outline" className="text-xs">
                          {getReceiveMethodName(recipient.receive_method, recipient.provider || undefined)}
                        </Badge>
                        {recipient.usage_count > 1 && (
                          <Badge variant="outline" className="text-xs bg-terex-accent/20 text-terex-accent border-terex-accent/30">
                            {recipient.usage_count}x utilisé
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-400">
                        <div className="flex items-center space-x-1">
                          <MapPin className="w-3 h-3" />
                          <span>{getCountryName(recipient.recipient_country)}</span>
                        </div>
                        
                        {recipient.recipient_phone && (
                          <div className="flex items-center space-x-1">
                            <Phone className="w-3 h-3" />
                            <span>{recipient.recipient_phone}</span>
                          </div>
                        )}
                        
                        {recipient.last_amount && (
                          <div className="flex items-center space-x-1">
                            <Clock className="w-3 h-3" />
                            <span>Dernier: {recipient.last_amount} CAD</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteRecipient(recipient.id);
                        }}
                        variant="outline"
                        size="sm"
                        className="border-red-500/50 text-red-400 hover:bg-red-500/10 h-8 w-8 p-0"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                      
                      {selectedRecipient?.id === recipient.id && (
                        <ArrowRight className="w-4 h-4 text-terex-accent" />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <Separator className="bg-terex-gray-light" />
          </>
        )}

        {/* Option nouveau destinataire */}
        <div
          onClick={handleNewRecipient}
          className={`p-4 rounded-lg border cursor-pointer transition-all hover:border-terex-accent/50 ${
            isNewRecipient
              ? 'border-terex-accent bg-terex-accent/10'
              : 'border-terex-gray-light bg-terex-gray/50'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-terex-accent/20 rounded-lg flex items-center justify-center">
                <Plus className="w-5 h-5 text-terex-accent" />
              </div>
              <div>
                <h3 className="text-white font-semibold">Nouveau destinataire</h3>
                <p className="text-gray-400 text-sm">Ajouter une nouvelle personne</p>
              </div>
            </div>
            
            {isNewRecipient && (
              <ArrowRight className="w-4 h-4 text-terex-accent" />
            )}
          </div>
        </div>

        {/* Bouton continuer */}
        <Button 
          onClick={onContinue}
          disabled={!selectedRecipient && !isNewRecipient}
          size="lg"
          className="w-full gradient-button text-white font-semibold h-12 text-lg"
        >
          Continuer
        </Button>
      </CardContent>
    </Card>
  );
}
