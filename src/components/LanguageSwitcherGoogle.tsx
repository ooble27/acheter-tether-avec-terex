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

  const languages = [
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'en', name: 'English', flag: '🇬🇧' }
  ];

  const changeLanguage = (langCode: string) => {
    const selectElement = document.querySelector('.goog-te-combo') as HTMLSelectElement;
    if (selectElement) {
      selectElement.value = langCode;
      selectElement.dispatchEvent(new Event('change'));
      setCurrentLang(langCode);
    }
  };

  // Détecter le changement de langue
  useEffect(() => {
    const checkLanguage = () => {
      const frame = document.querySelector('iframe.goog-te-banner-frame') as HTMLIFrameElement;
      if (frame) {
        try {
          const lang = frame.contentWindow?.document.body.querySelector('.goog-te-menu-value span')?.textContent;
          if (lang?.includes('English')) setCurrentLang('en');
          else if (lang?.includes('Français')) setCurrentLang('fr');
        } catch (e) {
          // Cross-origin iframe, can't access
        }
      }
    };

    const interval = setInterval(checkLanguage, 1000);
    return () => clearInterval(interval);
  }, []);

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
