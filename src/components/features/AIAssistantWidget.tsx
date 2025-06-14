
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Bot, MessageCircle } from 'lucide-react';
import { AIAssistant } from './AIAssistant';

export function AIAssistantWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  const toggleAssistant = () => {
    if (!isOpen) {
      setIsOpen(true);
      setIsMinimized(false);
    } else {
      setIsOpen(false);
    }
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  return (
    <>
      {/* Widget ouvert */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-2">
          <AIAssistant 
            isMinimized={isMinimized}
            onToggleMinimize={toggleMinimize}
          />
        </div>
      )}

      {/* Bouton flottant quand fermé */}
      {!isOpen && (
        <Button
          onClick={toggleAssistant}
          className="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full bg-gradient-to-br from-terex-accent to-terex-accent/80 hover:from-terex-accent/90 hover:to-terex-accent/70 text-white shadow-lg hover:shadow-xl transition-all duration-300 animate-in slide-in-from-bottom-2"
        >
          <div className="relative">
            <Bot className="w-8 h-8" />
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
          </div>
        </Button>
      )}
    </>
  );
}
