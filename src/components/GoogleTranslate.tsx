import { useEffect } from 'react';

declare global {
  interface Window {
    google: any;
    googleTranslateElementInit: () => void;
  }
}

export function GoogleTranslate() {
  useEffect(() => {
    // Supprimer les anciens scripts s'ils existent
    const existingScript = document.querySelector('script[src*="translate.google.com"]');
    if (existingScript) {
      existingScript.remove();
    }

    // Fonction d'initialisation Google Translate
    window.googleTranslateElementInit = () => {
      try {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: 'fr',
            includedLanguages: 'en,fr',
            layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
            autoDisplay: false,
            multilanguagePage: true
          },
          'google_translate_element'
        );
        console.log('Google Translate initialized successfully');
      } catch (error) {
        console.error('Error initializing Google Translate:', error);
      }
    };

    // Charger le script Google Translate
    const script = document.createElement('script');
    script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    script.async = true;
    script.onerror = () => {
      console.error('Failed to load Google Translate script');
    };
    document.body.appendChild(script);

    return () => {
      // Cleanup
      const scriptToRemove = document.querySelector('script[src*="translate.google.com"]');
      if (scriptToRemove && document.body.contains(scriptToRemove)) {
        document.body.removeChild(scriptToRemove);
      }
      delete window.googleTranslateElementInit;
    };
  }, []);

  return (
    <div 
      id="google_translate_element"
      className="google-translate-widget"
    />
  );
}
