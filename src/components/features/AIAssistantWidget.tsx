
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Bot } from 'lucide-react';
import { AIAssistant } from './AIAssistant';
import { useIsMobile } from '@/hooks/use-mobile';

export function AIAssistantWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useIsMobile();

  const toggleAssistant = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Widget ouvert */}
      {isOpen && (
        <div className={`fixed z-50 animate-in slide-in-from-bottom-2 ${
          isMobile 
            ? 'bottom-20 right-2 left-2 flex justify-center' 
            : 'bottom-20 right-6'
        }`}>
          <AIAssistant />
        </div>
      )}

      {/* Bouton flottant avec tooltip Moussa */}
      <Button
        onClick={toggleAssistant}
        className={`fixed z-50 rounded-full bg-gradient-to-br from-terex-accent to-terex-accent/80 hover:from-terex-accent/90 hover:to-terex-accent/70 text-white shadow-lg hover:shadow-xl transition-all duration-300 animate-in slide-in-from-bottom-2 ${
          isMobile 
            ? 'bottom-6 right-6 w-12 h-12' 
            : 'bottom-6 right-6 w-16 h-16'
        }`}
        title="Moussa - Assistant IA"
      >
        <Bot className={isMobile ? "w-6 h-6" : "w-8 h-8"} />
      </Button>
    </>
  );
}
