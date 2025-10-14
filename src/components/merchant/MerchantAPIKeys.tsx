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
      <Card>
        <CardHeader>
          <CardTitle>Clé API de Production</CardTitle>
          <CardDescription>
            Utilisez cette clé pour intégrer Terex dans vos applications en production
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2 p-4 border rounded-lg bg-muted/50">
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
            <p className="text-sm text-muted-foreground">
              Ne partagez jamais votre clé API. Elle donne accès à votre compte marchand.
            </p>
          </div>

          <div className="space-y-2">
            <Label>Clé API</Label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Input
                  type={showApiKey ? 'text' : 'password'}
                  value={merchantAccount.api_key}
                  readOnly
                  className="pr-10"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1/2 -translate-y-1/2"
                  onClick={() => setShowApiKey(!showApiKey)}
                >
                  {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              <Button
                variant="outline"
                onClick={() => copyToClipboard(merchantAccount.api_key)}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t">
            <div>
              <p className="text-sm font-medium">Régénérer la clé API</p>
              <p className="text-xs text-muted-foreground">
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
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Régénérer la clé API ?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Cette action invalidera immédiatement votre clé API actuelle. 
                    Toutes vos intégrations devront être mises à jour avec la nouvelle clé.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Annuler</AlertDialogCancel>
                  <AlertDialogAction onClick={regenerateApiKey}>
                    Confirmer
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Informations du compte</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-muted-foreground">Nom de l'entreprise</Label>
              <p className="font-medium">{merchantAccount.business_name}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">Type</Label>
              <p className="font-medium capitalize">{merchantAccount.business_type}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">Email</Label>
              <p className="font-medium">{merchantAccount.business_email}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">Statut</Label>
              <Badge variant={merchantAccount.is_active ? 'default' : 'secondary'}>
                {merchantAccount.is_active ? 'Actif' : 'Inactif'}
              </Badge>
            </div>
            <div>
              <Label className="text-muted-foreground">Commission</Label>
              <p className="font-medium">{(merchantAccount.commission_rate * 100).toFixed(2)}%</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
