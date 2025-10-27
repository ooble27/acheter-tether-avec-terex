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
    const checkGoogleTranslate = setInterval(() => {
      const selectElement = document.querySelector('.goog-te-combo') as HTMLSelectElement;
      if (selectElement) {
        setIsReady(true);
        clearInterval(checkGoogleTranslate);
      }
    }, 500);

    return () => clearInterval(checkGoogleTranslate);
  }, []);

  const changeLanguage = (langCode: string) => {
    if (!isReady) {
      console.log('Google Translate not ready yet');
      return;
    }

    // Attendre un peu pour s'assurer que tout est chargé
    setTimeout(() => {
      const selectElement = document.querySelector('.goog-te-combo') as HTMLSelectElement;
      if (selectElement) {
        selectElement.value = langCode;
        selectElement.dispatchEvent(new Event('change', { bubbles: true }));
        setCurrentLang(langCode);
      }
    }, 100);
  };

  const currentLanguage = languages.find(lang => lang.code === currentLang) || languages[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          <span className="text-2xl">{currentLanguage.flag}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-background border z-50">
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => changeLanguage(language.code)}
            className="cursor-pointer justify-center"
          >
            <span className="text-2xl">{language.flag}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
