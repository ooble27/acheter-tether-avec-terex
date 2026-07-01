import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import {
  Mail,
  Send,
  Eye,
  Loader2,
  Users,
  TestTube,
  FileText,
  Gift,
  Bell,
  PartyPopper,
  Megaphone,
  RefreshCw
} from 'lucide-react';

const CARD = '#1e1e1e';
const BORDER = 'rgba(255,255,255,0.07)';
const INPUT_BG = 'rgba(255,255,255,0.04)';

const cardStyle: React.CSSProperties = {
  background: CARD,
  border: `1px solid ${BORDER}`,
  borderRadius: 16,
  padding: 18,
};

const inputClass = 'text-white placeholder-[#6b7280]';
const inputStyle: React.CSSProperties = {
  background: INPUT_BG,
  border: `1px solid ${BORDER}`,
  borderRadius: 12,
  color: '#fff',
  outline: 'none',
};

interface NewsletterTemplate {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  subject: string;
  previewText: string;
  heroTitle: string;
  content: string;
  ctaText: string;
  ctaUrl: string;
}

const NEWSLETTER_TEMPLATES: NewsletterTemplate[] = [
  {
    id: 'welcome',
    name: 'Bienvenue',
    icon: <PartyPopper className="w-5 h-5" />,
    description: 'Nouveaux utilisateurs',
    subject: 'Bienvenue chez Terex !',
    previewText: 'Commencez votre aventure avec Terex',
    heroTitle: 'Bienvenue chez Terex !',
    content: 'Nous sommes ravis de vous accueillir sur la plateforme la plus simple pour vos transferts internationaux. Complétez votre vérification KYC pour débloquer toutes les fonctionnalités et commencer à envoyer de l\'argent en quelques minutes.',
    ctaText: 'Accéder à mon compte',
    ctaUrl: 'https://acheter-tether-avec-terex.lovable.app/dashboard',
  },
  {
    id: 'promotions',
    name: 'Promotions',
    icon: <Gift className="w-5 h-5" />,
    description: 'Offres et réductions',
    subject: 'Offre exclusive sur Terex',
    previewText: 'Profitez de tarifs exceptionnels',
    heroTitle: 'Offre Spéciale !',
    content: 'Pour vous remercier de votre fidélité, nous vous offrons 50% de réduction sur les frais de transfert jusqu\'à la fin du mois. Invitez un ami et recevez tous les deux un bonus sur votre prochaine transaction.',
    ctaText: 'Profiter de l\'offre',
    ctaUrl: 'https://acheter-tether-avec-terex.lovable.app/dashboard',
  },
  {
    id: 'updates',
    name: 'Mises à jour',
    icon: <Bell className="w-5 h-5" />,
    description: 'Nouvelles fonctionnalités',
    subject: 'Nouveautés Terex',
    previewText: 'Découvrez les dernières améliorations',
    heroTitle: 'Nouveautés Terex',
    content: 'Nous avons amélioré notre plateforme pour vous offrir une meilleure expérience. Vos transferts sont maintenant traités plus rapidement, avec une interface repensée et des mesures de sécurité renforcées.',
    ctaText: 'Découvrir',
    ctaUrl: 'https://acheter-tether-avec-terex.lovable.app/dashboard',
  },
  {
    id: 'announcement',
    name: 'Annonce',
    icon: <Megaphone className="w-5 h-5" />,
    description: 'Annonce importante',
    subject: 'Annonce importante Terex',
    previewText: 'Une nouvelle à vous partager',
    heroTitle: 'Annonce Importante',
    content: 'Nous avons une nouvelle passionnante à vous annoncer. Terex est maintenant disponible dans de nouveaux pays avec de nouvelles devises supportées et des partenariats pour des taux encore plus avantageux.',
    ctaText: 'En savoir plus',
    ctaUrl: 'https://acheter-tether-avec-terex.lovable.app/about',
  },
];

export function NewsletterAdmin() {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [subject, setSubject] = useState('Nouveautés Terex');
  const [previewText, setPreviewText] = useState('Découvrez les dernières nouveautés');
  const [heroTitle, setHeroTitle] = useState('Nouveautés Terex');
  const [content, setContent] = useState('Nous avons amélioré notre plateforme pour vous offrir une meilleure expérience.');
  const [ctaText, setCtaText] = useState('Accéder à mon compte');
  const [ctaUrl, setCtaUrl] = useState('https://acheter-tether-avec-terex.lovable.app');
  const [testEmail, setTestEmail] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isTesting, setIsTesting] = useState(false);

  const applyTemplate = (template: NewsletterTemplate) => {
    setSelectedTemplate(template.id);
    setSubject(template.subject);
    setPreviewText(template.previewText);
    setHeroTitle(template.heroTitle);
    setContent(template.content);
    setCtaText(template.ctaText);
    setCtaUrl(template.ctaUrl);
    toast.success(`Template "${template.name}" appliqué`);
  };

  const resetForm = () => {
    setSelectedTemplate(null);
    setSubject('Nouveautés Terex');
    setPreviewText('Découvrez les dernières nouveautés');
    setHeroTitle('Nouveautés Terex');
    setContent('');
    setCtaText('Accéder à mon compte');
    setCtaUrl('https://acheter-tether-avec-terex.lovable.app');
    toast.success('Formulaire réinitialisé');
  };

  const sendNewsletter = async (isTest: boolean) => {
    if (isTest && !testEmail) {
      toast.error('Veuillez entrer un email de test');
      return;
    }

    if (!content.trim()) {
      toast.error('Veuillez entrer le contenu du message');
      return;
    }

    if (isTest) {
      setIsTesting(true);
    } else {
      setIsSending(true);
    }

    try {
      const payload: Record<string, unknown> = {
        subject,
        previewText,
        heroTitle,
        content,
        ctaText,
        ctaUrl,
      };

      if (isTest) {
        payload.testEmail = testEmail;
      }

      const { data, error } = await supabase.functions.invoke('send-newsletter', {
        body: payload,
      });

      if (error) throw error;

      if (isTest) {
        toast.success(`Email de test envoyé à ${testEmail}`);
      } else {
        toast.success(`Newsletter envoyée à ${data?.totalSent || 0} destinataires`);
      }
    } catch (error: any) {
      console.error('Error sending newsletter:', error);
      toast.error(error.message || 'Erreur lors de l\'envoi');
    } finally {
      setIsSending(false);
      setIsTesting(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Templates Section */}
      <div style={cardStyle}>
        <div className="flex flex-row items-center justify-between mb-4">
          <h3 className="text-white flex items-center gap-2 font-semibold">
            <FileText className="w-5 h-5 text-[#9ca3af]" />
            Templates
          </h3>
          <Button
            onClick={resetForm}
            size="sm"
            className="text-white hover:opacity-90"
            style={{ background: '#2d2d2d', border: `1px solid ${BORDER}` }}
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Réinitialiser
          </Button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {NEWSLETTER_TEMPLATES.map((template) => (
            <button
              key={template.id}
              onClick={() => applyTemplate(template)}
              className="p-4 rounded-xl transition-all text-left hover:opacity-90"
              style={{
                background: selectedTemplate === template.id ? 'rgba(255,255,255,0.08)' : INPUT_BG,
                border: selectedTemplate === template.id
                  ? '1px solid rgba(255,255,255,0.25)'
                  : `1px solid ${BORDER}`,
              }}
            >
              <div className={`mb-3 ${selectedTemplate === template.id ? 'text-white' : 'text-[#9ca3af]'}`}>
                {template.icon}
              </div>
              <h3 className="text-white font-semibold mb-1">{template.name}</h3>
              <p className="text-[#6b7280] text-xs">{template.description}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Form Section */}
        <div className="flex flex-col gap-4">
          <div style={cardStyle}>
            <h3 className="text-white flex items-center gap-2 font-semibold mb-4">
              <Mail className="w-5 h-5 text-[#9ca3af]" />
              Composer
            </h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-[#9ca3af]">Sujet</Label>
                <Input
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Sujet de l'email..."
                  className={inputClass}
                  style={inputStyle}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-[#9ca3af]">Aperçu</Label>
                <Input
                  value={previewText}
                  onChange={(e) => setPreviewText(e.target.value)}
                  placeholder="Texte d'aperçu..."
                  className={inputClass}
                  style={inputStyle}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-[#9ca3af]">Titre</Label>
                <Input
                  value={heroTitle}
                  onChange={(e) => setHeroTitle(e.target.value)}
                  placeholder="Titre principal..."
                  className={inputClass}
                  style={inputStyle}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-[#9ca3af]">Message</Label>
                <Textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Contenu du message..."
                  className={`resize-none ${inputClass}`}
                  style={inputStyle}
                  rows={5}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-[#9ca3af]">Bouton</Label>
                  <Input
                    value={ctaText}
                    onChange={(e) => setCtaText(e.target.value)}
                    className={inputClass}
                    style={inputStyle}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[#9ca3af]">URL</Label>
                  <Input
                    value={ctaUrl}
                    onChange={(e) => setCtaUrl(e.target.value)}
                    className={inputClass}
                    style={inputStyle}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Send Section */}
          <div style={cardStyle}>
            <h3 className="text-white flex items-center gap-2 font-semibold mb-4">
              <Send className="w-5 h-5 text-[#9ca3af]" />
              Envoyer
            </h3>
            <div className="space-y-4">
              <div className="flex gap-3">
                <Input
                  type="email"
                  value={testEmail}
                  onChange={(e) => setTestEmail(e.target.value)}
                  placeholder="Email de test..."
                  className={`flex-1 ${inputClass}`}
                  style={inputStyle}
                />
                <Button
                  onClick={() => sendNewsletter(true)}
                  disabled={isTesting || !testEmail}
                  className="text-white hover:opacity-90"
                  style={{ background: '#2d2d2d', border: `1px solid ${BORDER}` }}
                >
                  {isTesting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <TestTube className="w-4 h-4 mr-2" />
                      Tester
                    </>
                  )}
                </Button>
              </div>

              <Button
                onClick={() => sendNewsletter(false)}
                disabled={isSending}
                className="w-full font-bold hover:opacity-90"
                style={{ background: '#fff', color: '#141414' }}
              >
                {isSending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Envoi en cours...
                  </>
                ) : (
                  <>
                    <Users className="w-4 h-4 mr-2" />
                    Envoyer à tous les utilisateurs
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Preview Section */}
        <div style={cardStyle}>
          <h3 className="text-white flex items-center gap-2 font-semibold mb-4">
            <Eye className="w-5 h-5 text-[#9ca3af]" />
            Aperçu
          </h3>
          <div className="rounded-lg overflow-hidden" style={{ background: '#1a1a1a', border: `1px solid ${BORDER}` }}>
            {/* Email Header */}
            <div className="px-6 py-4 flex items-center justify-between" style={{ background: CARD, borderBottom: `1px solid ${BORDER}` }}>
              <span className="text-white font-bold tracking-wider">TEREX</span>
              <span className="text-[#9ca3af] text-sm px-3 py-1 rounded" style={{ border: `1px solid ${BORDER}` }}>Se connecter</span>
            </div>

            {/* Email Content */}
            <div className="p-6" style={{ background: CARD }}>
              <h2 className="text-white text-xl font-bold mb-6">{heroTitle || 'Titre principal'}</h2>
              <p className="text-white mb-4">Cher client,</p>
              <p className="text-[#9ca3af] leading-relaxed mb-6">
                {content || 'Contenu du message...'}
              </p>

              {/* CTA Button */}
              <div className="text-center my-6">
                <span className="inline-block px-8 py-3 rounded-md font-semibold" style={{ background: '#fff', color: '#141414' }}>
                  {ctaText || 'Bouton'}
                </span>
              </div>

              <p className="text-[#6b7280] text-sm mt-6">
                Si vous avez des questions, répondez à cet email pour contacter notre équipe de support client.
              </p>
            </div>

            {/* Email Footer */}
            <div className="p-6 text-center" style={{ background: '#1a1a1a', borderTop: `1px solid ${BORDER}` }}>
              <p className="text-white font-bold tracking-wider mb-4">TEREX</p>
              <p className="text-[#6b7280] text-xs mb-4">
                Vous avez reçu cet email car vous êtes inscrit chez Terex.
              </p>
              <p className="text-[#6b7280] text-xs">
                <span className="underline">Politique de Confidentialité</span> | <span className="underline">Centre d'aide</span>
              </p>
              <p className="text-[#6b7280] text-xs mt-4">© 2025 Terex. Tous droits réservés.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
