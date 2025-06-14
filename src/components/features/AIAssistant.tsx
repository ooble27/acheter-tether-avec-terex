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
  RefreshCw
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
  transactionExecuted?: boolean;
  transactionResult?: any;
}

export function AIAssistant() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationLoaded, setConversationLoaded] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const { user } = useAuth();

  // Charger l'historique des conversations au démarrage
  useEffect(() => {
    if (user && !conversationLoaded) {
      loadConversationHistory();
    }
  }, [user, conversationLoaded]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const loadConversationHistory = async () => {
    try {
      const { data: conversations, error } = await supabase
        .from('ai_conversations')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Erreur chargement conversations:', error);
        setDefaultWelcomeMessage();
        return;
      }

      if (conversations && conversations.length > 0) {
        const loadedMessages: ChatMessage[] = conversations.map(conv => ({
          role: conv.message_role as 'user' | 'assistant',
          content: conv.message_content,
          timestamp: new Date(conv.created_at),
          intent: conv.intent_data
        }));
        
        setMessages(loadedMessages);
        console.log(`${conversations.length} messages de conversation chargés`);
      } else {
        setDefaultWelcomeMessage();
      }
      
      setConversationLoaded(true);
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
      setDefaultWelcomeMessage();
      setConversationLoaded(true);
    }
  };

  const setDefaultWelcomeMessage = () => {
    const welcomeMessage: ChatMessage = {
      role: 'assistant',
      content: `Bonjour ! Je suis votre assistant Terex intelligent.

Je peux vous aider avec vos questions ET exécuter automatiquement vos transactions :

• Achat/Vente USDT
• Virements internationaux 
• Consultation de votre historique

Donnez-moi simplement toutes les informations nécessaires et je peux traiter votre demande directement !`,
      timestamp: new Date()
    };
    setMessages([welcomeMessage]);
    saveMessageToDatabase(welcomeMessage);
  };

  const saveMessageToDatabase = async (message: ChatMessage) => {
    if (!user) return;

    try {
      await supabase.from('ai_conversations').insert({
        user_id: user.id,
        message_role: message.role,
        message_content: message.content,
        intent_data: message.intent || null
      });
    } catch (error) {
      console.error('Erreur sauvegarde message:', error);
    }
  };

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
      await saveMessageToDatabase(userMessage);
      setInputMessage('');
    }

    setIsLoading(true);

    try {
      console.log('Envoi du message avec IA avancée et transactionnelle:', messageToSend);

      const conversationHistory = messages.slice(-15).map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      const { data, error } = await supabase.functions.invoke('terex-ai-assistant', {
        body: {
          message: messageToSend,
          conversationHistory,
          userId: user?.id,
          enableTransactions: true
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
        await saveMessageToDatabase(assistantMessage);

        // Afficher une notification spéciale si une transaction a été exécutée
        if (aiResponse.transactionExecuted) {
          toast({
            title: "Transaction exécutée !",
            description: "Votre opération a été traitée automatiquement.",
            variant: "default"
          });
        }

        // Si l'IA a détecté une intention d'action et n'a pas encore exécuté
        if (aiResponse.intent && aiResponse.intent.needsConfirmation && !aiResponse.transactionExecuted) {
          console.log('Action détectée nécessitant confirmation:', aiResponse.intent);
          
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
            saveMessageToDatabase(actionMessage);
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
      await saveMessageToDatabase(assistantErrorMessage);

      toast({
        title: "Erreur de connexion",
        description: "Veuillez réessayer dans quelques instants.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleActionConfirm = async (intent: any) => {
    console.log('Action confirmée:', intent);
    
    setIsLoading(true);
    
    try {
      // Appeler l'IA pour exécuter l'action confirmée
      const { data, error } = await supabase.functions.invoke('terex-ai-assistant', {
        body: {
          message: "EXÉCUTER_ACTION_CONFIRMÉE",
          conversationHistory: [],
          userId: user?.id,
          enableTransactions: true,
          executeIntent: intent
        }
      });

      if (error) throw error;

      if (data && data.transactionExecuted) {
        const confirmMessage: ChatMessage = {
          role: 'assistant',
          content: data.content || "Transaction exécutée avec succès !",
          timestamp: new Date()
        };
        setMessages(prev => [...prev, confirmMessage]);
        await saveMessageToDatabase(confirmMessage);

        toast({
          title: "Transaction exécutée !",
          description: "Votre opération a été traitée automatiquement.",
        });
      } else {
        throw new Error('Échec de l\'exécution de la transaction');
      }
    } catch (error) {
      console.error('Erreur lors de l\'exécution:', error);
      const errorMessage: ChatMessage = {
        role: 'assistant',
        content: "Désolé, une erreur s'est produite lors de l'exécution de votre transaction. Veuillez réessayer ou contacter le support.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
      await saveMessageToDatabase(errorMessage);

      toast({
        title: "Erreur d'exécution",
        description: "Impossible d'exécuter la transaction automatiquement.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
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

  const clearConversation = async () => {
    if (!user) return;
    
    try {
      // Supprimer toutes les conversations de la base de données
      await supabase
        .from('ai_conversations')
        .delete()
        .eq('user_id', user.id);
      
      // Réinitialiser l'interface
      setDefaultWelcomeMessage();
      
      toast({
        title: "Conversation effacée",
        description: "L'historique des conversations a été supprimé.",
      });
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer l'historique.",
        variant: "destructive"
      });
    }
  };

  return (
    <Card className={`border-terex-gray flex flex-col ${
      isMobile 
        ? 'w-[85vw] max-w-sm h-[400px] bg-white' 
        : 'w-96 h-[600px] bg-white'
    }`}>
      <CardHeader className="pb-3">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-br from-terex-accent/20 to-terex-accent/10 rounded-full">
            <Bot className="w-6 h-6 text-terex-accent" />
          </div>
          <div className="flex-1">
            <CardTitle className="text-black">
              Moussa
            </CardTitle>
          </div>
          <Button
            size="sm"
            variant="ghost"
            onClick={clearConversation}
            className="text-gray-500 hover:text-red-500 text-xs"
          >
            Effacer
          </Button>
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
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <div className="text-sm leading-relaxed whitespace-pre-wrap">
                      {message.content}
                    </div>
                    <span className="text-xs opacity-70 mt-1 block text-gray-600">
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

                {/* Bouton d'action unique pour les intentions détectées */}
                {message.intent && message.intent.needsConfirmation && (
                  <div className="flex justify-center mt-2">
                    <Button
                      size="sm"
                      onClick={() => handleActionConfirm(message.intent)}
                      className="bg-terex-accent hover:bg-terex-accent/80 text-white"
                      disabled={isLoading}
                    >
                      Exécuter automatiquement
                    </Button>
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-terex-accent/20 rounded-full">
                  <Bot className="w-4 h-4 text-terex-accent" />
                </div>
                <div className="p-3 rounded-lg bg-gray-100">
                  <div className="flex items-center space-x-2">
                    <Loader2 className="w-4 h-4 animate-spin text-terex-accent" />
                    <span className="text-sm text-gray-700">
                      Analyse et traitement en cours...
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        <div className="flex space-x-2">
          <Input
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Dites-moi ce que vous voulez faire..."
            className="border-terex-gray focus:border-terex-accent bg-white text-black placeholder-gray-500"
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
              className="border-gray-300 text-gray-600 hover:text-black hover:bg-gray-100"
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
