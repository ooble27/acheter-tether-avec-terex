import { useLanguage, Language } from '@/i18n/LanguageContext';

export function LanguageToggle({ className = '' }: { className?: string }) {
  const { language, setLanguage } = useLanguage();

  const toggle = () => setLanguage(language === 'fr' ? 'en' : 'fr');

  return (
    <button
      onClick={toggle}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors hover:bg-white/10 text-gray-300 hover:text-white ${className}`}
      aria-label={language === 'fr' ? 'Switch to English' : 'Passer en français'}
    >
      <span className={language === 'fr' ? 'text-white font-semibold' : 'text-gray-500'}>FR</span>
      <span className="text-gray-600">/</span>
      <span className={language === 'en' ? 'text-white font-semibold' : 'text-gray-500'}>EN</span>
    </button>
  );
}
