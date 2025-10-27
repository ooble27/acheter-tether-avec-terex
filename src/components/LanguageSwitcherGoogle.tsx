import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useEffect, useState } from 'react';

export function LanguageSwitcherGoogle() {
  const [currentLang, setCurrentLang] = useState('fr');
  const [isReady, setIsReady] = useState(false);

  const languages = [
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'en', name: 'English', flag: '🇬🇧' }
  ];

  // Vérifier que Google Translate est chargé
  useEffect(() => {
    let attempts = 0;
    const maxAttempts = 20;
    
    const checkGoogleTranslate = setInterval(() => {
      attempts++;
      const selectElement = document.querySelector('.goog-te-combo') as HTMLSelectElement;
      
      if (selectElement) {
        console.log('Google Translate is ready!');
        setIsReady(true);
        clearInterval(checkGoogleTranslate);
      } else if (attempts >= maxAttempts) {
        console.error('Google Translate failed to load after', maxAttempts, 'attempts');
        clearInterval(checkGoogleTranslate);
      }
    }, 500);

    return () => clearInterval(checkGoogleTranslate);
  }, []);

  const changeLanguage = (langCode: string) => {
    if (!isReady) {
      console.warn('Google Translate not ready yet');
      return;
    }

    const selectElement = document.querySelector('.goog-te-combo') as HTMLSelectElement;
    if (selectElement) {
      console.log('Changing language to:', langCode);
      selectElement.value = langCode;
      
      // Déclencher les événements
      selectElement.dispatchEvent(new Event('change', { bubbles: true }));
      selectElement.dispatchEvent(new Event('click', { bubbles: true }));
      
      setCurrentLang(langCode);
      
      // Forcer le rechargement si nécessaire
      setTimeout(() => {
        if (selectElement.value !== langCode) {
          console.log('Forcing language change');
          selectElement.value = langCode;
          selectElement.dispatchEvent(new Event('change', { bubbles: true }));
        }
      }, 500);
    } else {
      console.error('Google Translate select element not found');
    }
  };

  const currentLanguage = languages.find(lang => lang.code === currentLang) || languages[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2" disabled={!isReady}>
          <span className="text-2xl">{currentLanguage.flag}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-background border z-50">
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => changeLanguage(language.code)}
            className="cursor-pointer justify-center gap-2"
          >
            <span className="text-2xl">{language.flag}</span>
            <span className="text-sm">{language.name}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
