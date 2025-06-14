
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

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export function AIAssistant() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: 'Bonjour ! Je suis votre assistant Terex, spécialisé dans les transactions USDT et virements internationaux.\n\nComment puis-je vous aider ?',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const isMobile = useIsMobile();

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
      console.log('Envoi du message:', messageToSend);

      const conversationHistory = messages.slice(-8).map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      const { data, error } = await supabase.functions.invoke('terex-ai-assistant', {
        body: {
          message: messageToSend,
          conversationHistory
        }
      });

      console.log('Réponse reçue:', data);

      if (error) {
        console.error('Erreur fonction Supabase:', error);
        throw error;
      }

      if (data && data.content) {
        const assistantMessage: ChatMessage = {
          role: 'assistant',
          content: data.content,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, assistantMessage]);
      } else {
        throw new Error('Réponse invalide du serveur');
      }

    } catch (error) {
      console.error('Erreur envoi message:', error);
      
      const assistantErrorMessage: ChatMessage = {
        role: 'assistant',
        content: `❌ Erreur temporaire. Veuillez réessayer.`,
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

  const quickQuestions = [
    "Comment acheter des USDT ?",
    "Quels sont vos frais ?",
    "Quel réseau choisir ?",
    "Comment fonctionne le KYC ?",
    "Virement international ?",
    "Conseils sécurité"
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
              Assistant Terex
            </CardTitle>
            <div className="flex items-center space-x-2 mt-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs text-green-400">En ligne</span>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col space-y-4 min-h-0">
        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
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
                      Réflexion...
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {messages.length === 1 && !isLoading && (
          <div className="space-y-2">
            <p className="text-xs text-gray-400 text-center">Questions fréquentes :</p>
            <div className="grid grid-cols-1 gap-1">
              {quickQuestions.map((question, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => setInputMessage(question)}
                  className="text-xs h-8 border-terex-gray/50 text-gray-300 hover:bg-terex-gray/50 hover:text-white justify-start"
                >
                  {question}
                </Button>
              ))}
            </div>
          </div>
        )}

        <div className="flex space-x-2">
          <Input
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Posez votre question..."
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
