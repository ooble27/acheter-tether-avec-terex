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
  Plus, 
  Trash2, 
  Send, 
  Eye,
  Loader2,
  Sparkles,
  Users,
  TestTube,
  FileText,
  Gift,
  Bell,
  PartyPopper,
  Megaphone,
  RefreshCw
} from 'lucide-react';

interface Update {
  icon: string;
  title: string;
  description: string;
}

interface NewsletterTemplate {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  subject: string;
  previewText: string;
  heroTitle: string;
  heroSubtitle: string;
  updates: Update[];
  ctaText: string;
  ctaUrl: string;
}

const EMOJI_OPTIONS = ['🚀', '⚡', '🔒', '💰', '🎉', '✨', '📱', '🌍', '💳', '🔔', '📊', '🛡️'];

const NEWSLETTER_TEMPLATES: NewsletterTemplate[] = [
  {
    id: 'welcome',
    name: 'Bienvenue',
    icon: <PartyPopper className="w-5 h-5" />,
    description: 'Message de bienvenue pour les nouveaux utilisateurs',
    subject: '🎉 Bienvenue dans la famille Terex !',
    previewText: 'Commencez votre aventure avec Terex dès maintenant',
    heroTitle: 'Bienvenue chez Terex !',
    heroSubtitle: 'Nous sommes ravis de vous accueillir sur la plateforme la plus simple pour vos transferts internationaux',
    updates: [
      { icon: '🚀', title: 'Premiers pas', description: 'Complétez votre vérification KYC pour débloquer toutes les fonctionnalités de la plateforme.' },
      { icon: '💳', title: 'Méthodes de paiement', description: 'Choisissez parmi Wave, Orange Money, ou virement bancaire pour vos transactions.' },
      { icon: '🔒', title: 'Sécurité maximale', description: 'Vos fonds et données personnelles sont protégés par un chiffrement de niveau bancaire.' },
    ],
    ctaText: 'Commencer maintenant',
    ctaUrl: 'https://acheter-tether-avec-terex.lovable.app/dashboard',
  },
  {
    id: 'promotions',
    name: 'Promotions',
    icon: <Gift className="w-5 h-5" />,
    description: 'Offres spéciales et réductions',
    subject: '🔥 Offre exclusive : Frais réduits sur Terex !',
    previewText: 'Profitez de tarifs exceptionnels pour une durée limitée',
    heroTitle: 'Offre Spéciale !',
    heroSubtitle: 'Pour vous remercier de votre fidélité, nous vous offrons des avantages exclusifs',
    updates: [
      { icon: '💰', title: 'Frais réduits', description: 'Bénéficiez de 50% de réduction sur les frais de transfert jusqu\'au 31 janvier !' },
      { icon: '🎁', title: 'Parrainage bonifié', description: 'Invitez un ami et recevez tous les deux 5$ en bonus sur votre prochaine transaction.' },
      { icon: '⚡', title: 'Transferts instantanés', description: 'Les transferts Wave et Orange Money sont traités en moins de 5 minutes.' },
    ],
    ctaText: 'Profiter de l\'offre',
    ctaUrl: 'https://acheter-tether-avec-terex.lovable.app/dashboard',
  },
  {
    id: 'updates',
    name: 'Mises à jour',
    icon: <Bell className="w-5 h-5" />,
    description: 'Nouvelles fonctionnalités et améliorations',
    subject: '🚀 Nouvelles fonctionnalités Terex !',
    previewText: 'Découvrez les dernières améliorations de votre plateforme',
    heroTitle: 'Nouveautés Terex',
    heroSubtitle: 'Des améliorations pour simplifier vos transactions',
    updates: [
      { icon: '⚡', title: 'Transferts plus rapides', description: 'Vos transferts sont maintenant traités en quelques minutes seulement.' },
      { icon: '🔒', title: 'Sécurité renforcée', description: 'Nouvelles mesures de protection pour vos transactions et vos données.' },
      { icon: '📱', title: 'Application améliorée', description: 'Interface repensée pour une navigation plus fluide et intuitive.' },
    ],
    ctaText: 'Découvrir maintenant',
    ctaUrl: 'https://acheter-tether-avec-terex.lovable.app/dashboard',
  },
  {
    id: 'announcement',
    name: 'Annonce',
    icon: <Megaphone className="w-5 h-5" />,
    description: 'Annonce importante ou événement',
    subject: '📢 Annonce importante de Terex',
    previewText: 'Une nouvelle importante à vous partager',
    heroTitle: 'Annonce Importante',
    heroSubtitle: 'Nous avons une nouvelle passionnante à vous annoncer',
    updates: [
      { icon: '🌍', title: 'Expansion internationale', description: 'Terex est maintenant disponible dans 10 nouveaux pays africains !' },
      { icon: '💳', title: 'Nouvelles devises', description: 'Nous ajoutons le support pour le CFA, le Naira et le Cedi.' },
      { icon: '🤝', title: 'Partenariats', description: 'De nouveaux partenaires pour des taux encore plus avantageux.' },
    ],
    ctaText: 'En savoir plus',
    ctaUrl: 'https://acheter-tether-avec-terex.lovable.app/about',
  },
];

export function NewsletterAdmin() {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [subject, setSubject] = useState('🎉 Nouvelles fonctionnalités Terex !');
  const [previewText, setPreviewText] = useState('Découvrez les dernières nouveautés de votre plateforme préférée');
  const [heroTitle, setHeroTitle] = useState('Nouveautés Terex');
  const [heroSubtitle, setHeroSubtitle] = useState('Des améliorations pour simplifier vos transactions');
  const [updates, setUpdates] = useState<Update[]>([
    { icon: '⚡', title: 'Transferts plus rapides', description: 'Vos transferts sont maintenant traités en quelques minutes.' },
  ]);
  const [ctaText, setCtaText] = useState('Découvrir maintenant');
  const [ctaUrl, setCtaUrl] = useState('https://acheter-tether-avec-terex.lovable.app');
  const [testEmail, setTestEmail] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isTesting, setIsTesting] = useState(false);

  const applyTemplate = (template: NewsletterTemplate) => {
    setSelectedTemplate(template.id);
    setSubject(template.subject);
    setPreviewText(template.previewText);
    setHeroTitle(template.heroTitle);
    setHeroSubtitle(template.heroSubtitle);
    setUpdates([...template.updates]);
    setCtaText(template.ctaText);
    setCtaUrl(template.ctaUrl);
    toast.success(`Template "${template.name}" appliqué`);
  };

  const resetForm = () => {
    setSelectedTemplate(null);
    setSubject('🎉 Nouvelles fonctionnalités Terex !');
    setPreviewText('Découvrez les dernières nouveautés de votre plateforme préférée');
    setHeroTitle('Nouveautés Terex');
    setHeroSubtitle('Des améliorations pour simplifier vos transactions');
    setUpdates([{ icon: '⚡', title: '', description: '' }]);
    setCtaText('Découvrir maintenant');
    setCtaUrl('https://acheter-tether-avec-terex.lovable.app');
    toast.success('Formulaire réinitialisé');
  };

  const addUpdate = () => {
    if (updates.length >= 5) {
      toast.error('Maximum 5 mises à jour');
      return;
    }
    setUpdates([...updates, { icon: '✨', title: '', description: '' }]);
  };

  const removeUpdate = (index: number) => {
    setUpdates(updates.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: keyof Update, value: string) => {
    const newUpdates = [...updates];
    newUpdates[index][field] = value;
    setUpdates(newUpdates);
  };

  const sendNewsletter = async (isTest: boolean) => {
    if (isTest && !testEmail) {
      toast.error('Veuillez entrer un email de test');
      return;
    }

    if (updates.some(u => !u.title || !u.description)) {
      toast.error('Veuillez remplir tous les champs des mises à jour');
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
        heroSubtitle,
        updates,
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
            Templates prédéfinis
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
                Composer la Newsletter
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Subject */}
              <div className="space-y-2">
                <Label className="text-gray-300">Sujet de l'email</Label>
                <Input
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Sujet de l'email..."
                  className="bg-terex-gray border-terex-gray text-white"
                />
              </div>

              {/* Preview Text */}
              <div className="space-y-2">
                <Label className="text-gray-300">Texte de prévisualisation</Label>
                <Input
                  value={previewText}
                  onChange={(e) => setPreviewText(e.target.value)}
                  placeholder="Aperçu dans la boîte de réception..."
                  className="bg-terex-gray border-terex-gray text-white"
                />
              </div>

              {/* Hero Title */}
              <div className="space-y-2">
                <Label className="text-gray-300">Titre principal</Label>
                <Input
                  value={heroTitle}
                  onChange={(e) => setHeroTitle(e.target.value)}
                  placeholder="Titre accrocheur..."
                  className="bg-terex-gray border-terex-gray text-white"
                />
              </div>

              {/* Hero Subtitle */}
              <div className="space-y-2">
                <Label className="text-gray-300">Sous-titre</Label>
                <Textarea
                  value={heroSubtitle}
                  onChange={(e) => setHeroSubtitle(e.target.value)}
                  placeholder="Description courte..."
                  className="bg-terex-gray border-terex-gray text-white resize-none"
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>

          {/* Updates Section */}
          <Card className="bg-terex-darker border-terex-gray">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-terex-accent" />
                Mises à jour ({updates.length}/5)
              </CardTitle>
              <Button
                onClick={addUpdate}
                size="sm"
                className="bg-terex-accent hover:bg-terex-accent/80"
                disabled={updates.length >= 5}
              >
                <Plus className="w-4 h-4 mr-1" />
                Ajouter
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {updates.map((update, index) => (
                <div key={index} className="bg-terex-gray/50 p-4 rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-sm">Mise à jour #{index + 1}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeUpdate(index)}
                      className="text-red-400 hover:text-red-300 hover:bg-red-500/20"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  {/* Emoji Picker */}
                  <div className="space-y-2">
                    <Label className="text-gray-400 text-xs">Icône</Label>
                    <div className="flex flex-wrap gap-2">
                      {EMOJI_OPTIONS.map((emoji) => (
                        <button
                          key={emoji}
                          onClick={() => updateItem(index, 'icon', emoji)}
                          className={`text-xl p-2 rounded transition-all ${
                            update.icon === emoji 
                              ? 'bg-terex-accent scale-110' 
                              : 'bg-terex-gray hover:bg-terex-gray/80'
                          }`}
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-gray-400 text-xs">Titre</Label>
                    <Input
                      value={update.title}
                      onChange={(e) => updateItem(index, 'title', e.target.value)}
                      placeholder="Titre de la mise à jour..."
                      className="bg-terex-gray border-terex-gray text-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-gray-400 text-xs">Description</Label>
                    <Textarea
                      value={update.description}
                      onChange={(e) => updateItem(index, 'description', e.target.value)}
                      placeholder="Description détaillée..."
                      className="bg-terex-gray border-terex-gray text-white resize-none"
                      rows={2}
                    />
                  </div>
                </div>
              ))}

              {updates.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Sparkles className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>Ajoutez des mises à jour à votre newsletter</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* CTA Section */}
          <Card className="bg-terex-darker border-terex-gray">
            <CardHeader>
              <CardTitle className="text-white text-sm">Bouton d'action</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-gray-300">Texte du bouton</Label>
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
            <CardContent className="pt-6 space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex-1 space-y-2">
                  <Label className="text-gray-300">Email de test</Label>
                  <Input
                    type="email"
                    value={testEmail}
                    onChange={(e) => setTestEmail(e.target.value)}
                    placeholder="votre@email.com"
                    className="bg-terex-gray border-terex-gray text-white"
                  />
                </div>
                <Button
                  onClick={() => sendNewsletter(true)}
                  variant="outline"
                  className="mt-6 border-terex-gray text-white hover:bg-terex-gray"
                  disabled={isTesting || !testEmail}
                >
                  {isTesting ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <TestTube className="w-4 h-4 mr-2" />
                  )}
                  Tester
                </Button>
              </div>

              <Button
                onClick={() => sendNewsletter(false)}
                className="w-full bg-terex-accent hover:bg-terex-accent/80 text-white"
                disabled={isSending || updates.length === 0}
              >
                {isSending ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Send className="w-4 h-4 mr-2" />
                )}
                <Users className="w-4 h-4 mr-2" />
                Envoyer à tous les utilisateurs
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Preview Section */}
        <div className="lg:sticky lg:top-4 h-fit">
          <Card className="bg-terex-darker border-terex-gray overflow-hidden">
            <CardHeader className="bg-terex-gray/50">
              <CardTitle className="text-white flex items-center gap-2">
                <Eye className="w-5 h-5 text-terex-accent" />
                Aperçu en temps réel
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="bg-[#0a0a0a] max-h-[70vh] overflow-y-auto">
                {/* Email Preview */}
                <div className="max-w-[600px] mx-auto">
                  {/* Header */}
                  <div className="bg-[#111111] p-6 border-b border-[#222222] text-center">
                    <div className="text-2xl font-bold text-terex-accent tracking-widest">TEREX</div>
                    <div className="text-xs text-gray-500 mt-2 tracking-wider uppercase">
                      L'avenir des transferts d'argent
                    </div>
                  </div>

                  {/* Hero */}
                  <div className="bg-gradient-to-r from-terex-accent to-green-600 p-10 text-center">
                    <div className="text-5xl mb-4">🚀</div>
                    <h1 className="text-2xl font-bold text-white mb-3">{heroTitle || 'Titre principal'}</h1>
                    <p className="text-white/90">{heroSubtitle || 'Sous-titre'}</p>
                  </div>

                  {/* Content */}
                  <div className="bg-[#111111] p-6">
                    <p className="text-white font-semibold mb-3">Bonjour Cher client,</p>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      Nous sommes ravis de vous partager les dernières nouveautés de Terex ! 
                      Voici ce qui a changé pour améliorer votre expérience :
                    </p>
                  </div>

                  {/* Updates */}
                  <div className="bg-[#111111] px-6 pb-6 space-y-4">
                    {updates.map((update, index) => (
                      <div key={index} className="bg-[#1a1a1a] rounded-xl p-5 border border-[#222222]">
                        <div className="text-3xl mb-3">{update.icon}</div>
                        <h3 className="text-white font-semibold mb-2">{update.title || 'Titre'}</h3>
                        <p className="text-gray-500 text-sm">{update.description || 'Description'}</p>
                      </div>
                    ))}
                  </div>

                  {/* CTA */}
                  <div className="bg-[#111111] p-8 text-center border-t border-[#222222]">
                    <p className="text-white mb-4">Prêt à profiter de ces nouveautés ?</p>
                    <button className="bg-terex-accent text-white px-8 py-3 rounded-lg font-semibold">
                      {ctaText || 'Découvrir'}
                    </button>
                  </div>

                  {/* Benefits */}
                  <div className="bg-[#0a0a0a] p-6 text-center">
                    <h3 className="text-white font-semibold mb-4">Pourquoi choisir Terex ?</h3>
                    <div className="grid grid-cols-2 gap-2 text-gray-500 text-sm">
                      <div>✅ Taux compétitifs</div>
                      <div>✅ Sécurité maximale</div>
                      <div>✅ Transferts rapides</div>
                      <div>✅ Support 24/7</div>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="bg-[#111111] p-6 text-center border-t border-[#222222]">
                    <p className="text-gray-500 text-sm mb-4">
                      L'équipe Terex vous remercie de votre confiance.
                    </p>
                    <div className="text-terex-accent text-sm mb-4">
                      WhatsApp • Site Web
                    </div>
                    <p className="text-gray-600 text-xs">
                      © 2025 Terex. Tous droits réservés.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
