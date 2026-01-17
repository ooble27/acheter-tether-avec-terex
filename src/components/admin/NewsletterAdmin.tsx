import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
    <div className="space-y-6">
      {/* Templates Section */}
      <Card className="bg-terex-darker border-terex-gray">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-terex-accent" />
            Templates
          </CardTitle>
          <Button
            onClick={resetForm}
            variant="outline"
            size="sm"
            className="border-terex-gray text-gray-300 hover:bg-terex-gray"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Réinitialiser
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {NEWSLETTER_TEMPLATES.map((template) => (
              <button
                key={template.id}
                onClick={() => applyTemplate(template)}
                className={`p-4 rounded-xl border-2 transition-all text-left ${
                  selectedTemplate === template.id
                    ? 'border-terex-accent bg-terex-accent/10'
                    : 'border-terex-gray bg-terex-gray/30 hover:border-terex-accent/50 hover:bg-terex-gray/50'
                }`}
              >
                <div className={`mb-3 ${selectedTemplate === template.id ? 'text-terex-accent' : 'text-gray-400'}`}>
                  {template.icon}
                </div>
                <h3 className="text-white font-semibold mb-1">{template.name}</h3>
                <p className="text-gray-500 text-xs">{template.description}</p>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form Section */}
        <div className="space-y-6">
          <Card className="bg-terex-darker border-terex-gray">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Mail className="w-5 h-5 text-terex-accent" />
                Composer
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-gray-300">Sujet</Label>
                <Input
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Sujet de l'email..."
                  className="bg-terex-gray border-terex-gray text-white"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-gray-300">Aperçu</Label>
                <Input
                  value={previewText}
                  onChange={(e) => setPreviewText(e.target.value)}
                  placeholder="Texte d'aperçu..."
                  className="bg-terex-gray border-terex-gray text-white"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-gray-300">Titre</Label>
                <Input
                  value={heroTitle}
                  onChange={(e) => setHeroTitle(e.target.value)}
                  placeholder="Titre principal..."
                  className="bg-terex-gray border-terex-gray text-white"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-gray-300">Message</Label>
                <Textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Contenu du message..."
                  className="bg-terex-gray border-terex-gray text-white resize-none"
                  rows={5}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-gray-300">Bouton</Label>
                  <Input
                    value={ctaText}
                    onChange={(e) => setCtaText(e.target.value)}
                    className="bg-terex-gray border-terex-gray text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-300">URL</Label>
                  <Input
                    value={ctaUrl}
                    onChange={(e) => setCtaUrl(e.target.value)}
                    className="bg-terex-gray border-terex-gray text-white"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Send Section */}
          <Card className="bg-terex-darker border-terex-gray">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Send className="w-5 h-5 text-terex-accent" />
                Envoyer
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-3">
                <Input
                  type="email"
                  value={testEmail}
                  onChange={(e) => setTestEmail(e.target.value)}
                  placeholder="Email de test..."
                  className="bg-terex-gray border-terex-gray text-white flex-1"
                />
                <Button
                  onClick={() => sendNewsletter(true)}
                  disabled={isTesting || !testEmail}
                  variant="outline"
                  className="border-terex-accent text-terex-accent hover:bg-terex-accent/10"
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
                className="w-full bg-terex-accent hover:bg-terex-accent/80 text-white"
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
            </CardContent>
          </Card>
        </div>

        {/* Preview Section */}
        <Card className="bg-terex-darker border-terex-gray">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Eye className="w-5 h-5 text-terex-accent" />
              Aperçu
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-[#111111] rounded-lg overflow-hidden border border-gray-800">
              {/* Email Header */}
              <div className="bg-[#1a1a1a] px-6 py-4 border-b border-gray-700 flex items-center justify-between">
                <span className="text-terex-accent font-bold tracking-wider">TEREX</span>
                <span className="text-gray-400 text-sm border border-gray-600 px-3 py-1 rounded">Se connecter</span>
              </div>

              {/* Email Content */}
              <div className="bg-[#1a1a1a] p-6">
                <h2 className="text-white text-xl font-bold mb-6">{heroTitle || 'Titre principal'}</h2>
                <p className="text-white mb-4">Cher client,</p>
                <p className="text-gray-400 leading-relaxed mb-6">
                  {content || 'Contenu du message...'}
                </p>

                {/* CTA Button */}
                <div className="text-center my-6">
                  <span className="inline-block bg-terex-accent text-white px-8 py-3 rounded-md font-semibold">
                    {ctaText || 'Bouton'}
                  </span>
                </div>

                <p className="text-gray-500 text-sm mt-6">
                  Si vous avez des questions, répondez à cet email pour contacter notre équipe de support client.
                </p>
              </div>

              {/* Email Footer */}
              <div className="bg-[#111111] p-6 text-center border-t border-gray-800">
                <p className="text-terex-accent font-bold tracking-wider mb-4">TEREX</p>
                <p className="text-gray-600 text-xs mb-4">
                  Vous avez reçu cet email car vous êtes inscrit chez Terex.
                </p>
                <p className="text-gray-600 text-xs">
                  <span className="underline">Politique de Confidentialité</span> | <span className="underline">Centre d'aide</span>
                </p>
                <p className="text-gray-700 text-xs mt-4">© 2025 Terex. Tous droits réservés.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
