import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Copy, RefreshCw, Eye, EyeOff, AlertTriangle } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface MerchantAPIKeysProps {
  merchantAccount: any;
  onUpdate: (userId: string) => void;
}

export function MerchantAPIKeys({ merchantAccount, onUpdate }: MerchantAPIKeysProps) {
  const [showApiKey, setShowApiKey] = useState(false);
  const [regenerating, setRegenerating] = useState(false);
  const { toast } = useToast();

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: 'Copié',
      description: 'La clé API a été copiée dans le presse-papiers'
    });
  };

  const regenerateApiKey = async () => {
    setRegenerating(true);
    
    const newApiKey = Array.from(crypto.getRandomValues(new Uint8Array(32)))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');

    const { error } = await supabase
      .from('merchant_accounts')
      .update({ api_key: newApiKey })
      .eq('id', merchantAccount.id);

    if (error) {
      toast({
        title: 'Erreur',
        description: error.message,
        variant: 'destructive'
      });
    } else {
      toast({
        title: 'Clé API régénérée',
        description: 'Votre nouvelle clé API a été générée avec succès'
      });
      onUpdate(merchantAccount.user_id);
    }

    setRegenerating(false);
  };

  return (
    <div className="space-y-6">
      <Card className="bg-white border-gray-200">
        <CardHeader>
          <CardTitle className="text-black">Clé API de Production</CardTitle>
          <CardDescription className="text-gray-600">
            Utilisez cette clé pour intégrer Terex dans vos applications en production
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2 p-4 border border-gray-200 rounded-lg bg-yellow-50">
            <AlertTriangle className="h-5 w-5 text-yellow-600" />
            <p className="text-sm text-gray-700">
              Ne partagez jamais votre clé API. Elle donne accès à votre compte marchand.
            </p>
          </div>

          <div className="space-y-2">
            <Label className="text-black">Clé API</Label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Input
                  type={showApiKey ? 'text' : 'password'}
                  value={merchantAccount.api_key}
                  readOnly
                  className="pr-10 bg-white border-gray-200 text-black"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1/2 -translate-y-1/2 text-black hover:bg-gray-100"
                  onClick={() => setShowApiKey(!showApiKey)}
                >
                  {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              <Button
                variant="outline"
                onClick={() => copyToClipboard(merchantAccount.api_key)}
                className="border-gray-200 text-black hover:bg-gray-100"
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <div>
              <p className="text-sm font-medium text-black">Régénérer la clé API</p>
              <p className="text-xs text-gray-600">
                Attention : cela invalidera l'ancienne clé
              </p>
            </div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" disabled={regenerating}>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Régénérer
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="bg-white border-gray-200">
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-black">Régénérer la clé API ?</AlertDialogTitle>
                  <AlertDialogDescription className="text-gray-700">
                    Cette action invalidera immédiatement votre clé API actuelle. 
                    Toutes vos intégrations devront être mises à jour avec la nouvelle clé.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="bg-white text-black border-gray-200 hover:bg-gray-100">Annuler</AlertDialogCancel>
                  <AlertDialogAction onClick={regenerateApiKey} className="bg-red-600 text-white hover:bg-red-700">
                    Confirmer
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white border-gray-200">
        <CardHeader>
          <CardTitle className="text-black">Informations du compte</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-gray-600">Nom de l'entreprise</Label>
              <p className="font-medium text-black">{merchantAccount.business_name}</p>
            </div>
            <div>
              <Label className="text-gray-600">Type</Label>
              <p className="font-medium capitalize text-black">{merchantAccount.business_type}</p>
            </div>
            <div>
              <Label className="text-gray-600">Email</Label>
              <p className="font-medium text-black">{merchantAccount.business_email}</p>
            </div>
            <div>
              <Label className="text-gray-600">Statut</Label>
              <Badge variant={merchantAccount.is_active ? 'default' : 'secondary'}>
                {merchantAccount.is_active ? 'Actif' : 'Inactif'}
              </Badge>
            </div>
            <div>
              <Label className="text-gray-600">Commission</Label>
              <p className="font-medium text-black">{(merchantAccount.commission_rate * 100).toFixed(2)}%</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
