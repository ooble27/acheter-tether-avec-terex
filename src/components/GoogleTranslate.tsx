import { useEffect } from 'react';

declare global {
  interface Window {
    google: any;
    googleTranslateElementInit: () => void;
  }
}

export function GoogleTranslate() {
  useEffect(() => {
    // Fonction d'initialisation Google Translate
    window.googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement(
        {
          pageLanguage: 'fr',
          includedLanguages: 'en,fr',
          layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
          autoDisplay: false
        },
        'google_translate_element'
      );
    };

    // Charger le script Google Translate
    const script = document.createElement('script');
    script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      // Cleanup
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  return (
    <div 
      id="google_translate_element"
      className="google-translate-widget"
    />
  );
}
