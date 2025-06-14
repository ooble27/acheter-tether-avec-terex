
import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Bot, 
  User, 
  Send, 
  Loader2, 
  RefreshCw,
  ShoppingCart,
  TrendingUp,
  Send as SendIcon,
  Info
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/contexts/AuthContext';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  intent?: any;
}

interface AIResponse {
  content: string;
  intent?: {
    intent: string;
    action: string;
    parameters: any;
    needsConfirmation: boolean;
  };
  userContext?: any;
  success: boolean;
}

export function AIAssistant() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: `Bonjour ! Je suis votre assistant Terex intelligent.

Je peux vous aider à :
• Créer automatiquement vos commandes d'achat/vente USDT
• Organiser vos virements internationaux
• Répondre à toutes vos questions sur nos services
• Accéder à votre historique de transactions

Dites-moi simplement ce que vous voulez faire en langage naturel !

Exemples :
"Je veux acheter 500$ d'USDT"
"Envoie 1000$ à Moussa au Sénégal"
"Vends mes USDT pour 200$"`,
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const { user } = useAuth();

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const sendMessage = async (retryMessage?: string) => {
    const messageToSend = retryMessage || inputMessage;
    if (!messageToSend.trim() || isLoading) return;

    if (!retryMessage) {
      const userMessage: ChatMessage = {
        role: 'user',
        content: messageToSend,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, userMessage]);
      setInputMessage('');
    }

    setIsLoading(true);

    try {
      console.log('Envoi du message avec IA avancée:', messageToSend);

      const conversationHistory = messages.slice(-8).map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      const { data, error } = await supabase.functions.invoke('terex-ai-assistant', {
        body: {
          message: messageToSend,
          conversationHistory,
          userId: user?.id // Envoyer l'ID utilisateur pour la personnalisation
        }
      });

      console.log('Réponse IA avancée reçue:', data);

      if (error) {
        console.error('Erreur fonction Supabase:', error);
        throw error;
      }

      if (data && data.content) {
        const aiResponse: AIResponse = data;
        
        const assistantMessage: ChatMessage = {
          role: 'assistant',
          content: aiResponse.content,
          timestamp: new Date(),
          intent: aiResponse.intent
        };
        
        setMessages(prev => [...prev, assistantMessage]);

        // Si l'IA a détecté une intention d'action, afficher des boutons d'action
        if (aiResponse.intent && aiResponse.intent.needsConfirmation) {
          console.log('Action détectée:', aiResponse.intent);
          
          // Ajouter un message avec des boutons d'action
          setTimeout(() => {
            const actionMessage: ChatMessage = {
              role: 'assistant',
              content: `Je peux créer cette ${aiResponse.intent.intent === 'buy_usdt' ? 'commande d\'achat' : 
                        aiResponse.intent.intent === 'sell_usdt' ? 'commande de vente' : 
                        'demande de transfert'} automatiquement pour vous.
                        
Voulez-vous procéder ?`,
              timestamp: new Date(),
              intent: aiResponse.intent
            };
            setMessages(prev => [...prev, actionMessage]);
          }, 1000);
        }
      } else {
        throw new Error('Réponse invalide du serveur');
      }

    } catch (error) {
      console.error('Erreur envoi message:', error);
      
      const assistantErrorMessage: ChatMessage = {
        role: 'assistant',
        content: `Une erreur temporaire s'est produite. Veuillez réessayer.
        
Si le problème persiste, contactez notre support :
📞 +1 (418) 261-9091
📧 Terangaexchange@gmail.com`,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantErrorMessage]);

      toast({
        title: "Erreur de connexion",
        description: "Veuillez réessayer dans quelques instants.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleActionConfirm = (intent: any) => {
    // Ici, vous pourriez naviguer vers la page appropriée ou ouvrir un modal
    console.log('Action confirmée:', intent);
    
    let message = '';
    if (intent.intent === 'buy_usdt') {
      message = `Parfait ! Je vous redirige vers la page d'achat USDT${intent.parameters.amount ? ` avec un montant de ${intent.parameters.amount}$` : ''}.`;
    } else if (intent.intent === 'sell_usdt') {
      message = `Parfait ! Je vous redirige vers la page de vente USDT${intent.parameters.amount ? ` avec un montant de ${intent.parameters.amount}$` : ''}.`;
    } else if (intent.intent === 'international_transfer') {
      message = `Parfait ! Je vous redirige vers la page de virement international${intent.parameters.amount ? ` pour ${intent.parameters.amount}$` : ''}${intent.parameters.recipient ? ` à ${intent.parameters.recipient}` : ''}${intent.parameters.country ? ` au ${intent.parameters.country}` : ''}.`;
    }

    const confirmMessage: ChatMessage = {
      role: 'assistant',
      content: message,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, confirmMessage]);

    toast({
      title: "Action confirmée",
      description: "Redirection en cours...",
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleRetry = () => {
    if (messages.length > 0) {
      const lastUserMessage = [...messages].reverse().find(msg => msg.role === 'user');
      if (lastUserMessage) {
        sendMessage(lastUserMessage.content);
      }
    }
  };

  const quickActions = [
    { icon: ShoppingCart, text: "Acheter USDT", message: "Je veux acheter des USDT" },
    { icon: TrendingUp, text: "Vendre USDT", message: "Je veux vendre mes USDT" },
    { icon: SendIcon, text: "Virement international", message: "Je veux envoyer de l'argent" },
    { icon: Info, text: "Mes transactions", message: "Montre-moi mes dernières transactions" }
  ];

  const intelligentSuggestions = [
    "Achète-moi 500$ d'USDT sur TRC20",
    "Envoie 1000$ à Moussa au Sénégal",
    "Vends 200 USDT via Orange Money",
    "Quels sont mes frais avec mon niveau KYC ?",
    "Quel est le meilleur réseau pour économiser ?",
    "Comment augmenter mes limites ?"
  ];

  return (
    <Card className={`bg-terex-darker border-terex-gray flex flex-col ${
      isMobile ? 'w-full h-[400px]' : 'w-96 h-[600px]'
    }`}>
      <CardHeader className="pb-3">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-br from-terex-accent/20 to-terex-accent/10 rounded-full">
            <Bot className="w-6 h-6 text-terex-accent" />
          </div>
          <div className="flex-1">
            <CardTitle className="text-white">
              Assistant Terex IA
            </CardTitle>
            <div className="flex items-center space-x-2 mt-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs text-green-400">Intelligence artificielle</span>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col space-y-4 min-h-0">
        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div key={index}>
                <div
                  className={`flex items-start space-x-3 ${
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {message.role === 'assistant' && (
                    <div className="p-2 bg-terex-accent/20 rounded-full flex-shrink-0">
                      <Bot className="w-4 h-4 text-terex-accent" />
                    </div>
                  )}
                  
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      message.role === 'user'
                        ? 'bg-terex-accent text-white'
                        : 'bg-terex-gray text-gray-100'
                    }`}
                  >
                    <div className="text-sm leading-relaxed whitespace-pre-wrap">
                      {message.content}
                    </div>
                    <span className="text-xs opacity-70 mt-1 block">
                      {message.timestamp.toLocaleTimeString('fr-FR', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>

                  {message.role === 'user' && (
                    <div className="p-2 bg-terex-accent/20 rounded-full flex-shrink-0">
                      <User className="w-4 h-4 text-terex-accent" />
                    </div>
                  )}
                </div>

                {/* Boutons d'action pour les intentions détectées */}
                {message.intent && message.intent.needsConfirmation && (
                  <div className="flex justify-center mt-2">
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        onClick={() => handleActionConfirm(message.intent)}
                        className="bg-terex-accent hover:bg-terex-accent/80 text-white"
                      >
                        Oui, procéder
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-terex-gray text-gray-300 hover:bg-terex-gray/50"
                      >
                        Non, merci
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-terex-accent/20 rounded-full">
                  <Bot className="w-4 h-4 text-terex-accent" />
                </div>
                <div className="bg-terex-gray p-3 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Loader2 className="w-4 h-4 animate-spin text-terex-accent" />
                    <span className="text-sm text-gray-300">
                      Analyse en cours...
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {messages.length === 1 && !isLoading && (
          <div className="space-y-3">
            {/* Actions rapides */}
            <div className="space-y-2">
              <p className="text-xs text-gray-400 text-center">Actions rapides :</p>
              <div className="grid grid-cols-2 gap-2">
                {quickActions.map((action, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => setInputMessage(action.message)}
                    className="text-xs h-8 border-terex-gray/50 text-gray-300 hover:bg-terex-gray/50 hover:text-white justify-start"
                  >
                    <action.icon className="w-3 h-3 mr-1" />
                    {action.text}
                  </Button>
                ))}
              </div>
            </div>

            {/* Suggestions intelligentes */}
            <div className="space-y-2">
              <p className="text-xs text-gray-400 text-center">Essayez ces exemples :</p>
              <div className="space-y-1">
                {intelligentSuggestions.slice(0, 3).map((suggestion, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    size="sm"
                    onClick={() => setInputMessage(suggestion)}
                    className="w-full text-xs h-6 text-gray-400 hover:bg-terex-gray/30 hover:text-white justify-start px-2"
                  >
                    "{suggestion}"
                  </Button>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="flex space-x-2">
          <Input
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Dites-moi ce que vous voulez faire..."
            className="bg-terex-gray border-terex-gray text-white placeholder-gray-400 focus:border-terex-accent"
            disabled={isLoading}
          />
          <Button
            onClick={() => sendMessage()}
            disabled={!inputMessage.trim() || isLoading}
            className="bg-terex-accent hover:bg-terex-accent/80 text-white px-4"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
          {!isLoading && messages.length > 1 && (
            <Button
              onClick={handleRetry}
              variant="outline"
              size="icon"
              className="border-terex-gray/50 text-gray-400 hover:text-white hover:bg-terex-gray/50"
              title="Réessayer la dernière question"
            >
              <RefreshCw className="w-4 h-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
