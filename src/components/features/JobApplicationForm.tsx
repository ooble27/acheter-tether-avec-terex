import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useJobApplications, JobApplication } from '@/hooks/useJobApplications';
import { Send, Upload } from 'lucide-react';

interface JobApplicationFormProps {
  position: string;
  onClose?: () => void;
}

export const JobApplicationForm = ({ position, onClose }: JobApplicationFormProps) => {
  const { submitApplication, isSubmitting } = useJobApplications();
  
  const [formData, setFormData] = useState<JobApplication>({
    position,
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    location: '',
    experience_years: undefined,
    cover_letter: '',
    linkedin_profile: '',
    portfolio_url: '',
    availability: '',
    salary_expectation: '',
  });

  const handleInputChange = (field: keyof JobApplication, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const result = await submitApplication(formData);
    
    if (result.success && onClose) {
      onClose();
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto bg-terex-darker border-terex-accent/20">
      <CardHeader>
        <CardTitle className="text-white text-2xl">Postuler pour : {position}</CardTitle>
        <CardDescription className="text-gray-300">
          Remplissez ce formulaire pour postuler. Tous les champs marqués d'un * sont obligatoires.
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informations personnelles */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="first_name" className="text-white">Prénom *</Label>
              <Input
                id="first_name"
                type="text"
                required
                value={formData.first_name}
                onChange={(e) => handleInputChange('first_name', e.target.value)}
                className="bg-terex-gray border-terex-accent/30 text-white"
                placeholder="Votre prénom"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="last_name" className="text-white">Nom *</Label>
              <Input
                id="last_name"
                type="text"
                required
                value={formData.last_name}
                onChange={(e) => handleInputChange('last_name', e.target.value)}
                className="bg-terex-gray border-terex-accent/30 text-white"
                placeholder="Votre nom"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white">Email *</Label>
              <Input
                id="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="bg-terex-gray border-terex-accent/30 text-white"
                placeholder="votre@email.com"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-white">Téléphone</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className="bg-terex-gray border-terex-accent/30 text-white"
                placeholder="+33 1 23 45 67 89"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="location" className="text-white">Localisation</Label>
              <Input
                id="location"
                type="text"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                className="bg-terex-gray border-terex-accent/30 text-white"
                placeholder="Ville, Pays"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="experience_years" className="text-white">Années d'expérience</Label>
              <Select onValueChange={(value) => handleInputChange('experience_years', parseInt(value))}>
                <SelectTrigger className="bg-terex-gray border-terex-accent/30 text-white">
                  <SelectValue placeholder="Sélectionnez" />
                </SelectTrigger>
                <SelectContent className="bg-terex-gray border-terex-accent/30">
                  <SelectItem value="0">Débutant (0 an)</SelectItem>
                  <SelectItem value="1">1 an</SelectItem>
                  <SelectItem value="2">2 ans</SelectItem>
                  <SelectItem value="3">3 ans</SelectItem>
                  <SelectItem value="4">4 ans</SelectItem>
                  <SelectItem value="5">5+ ans</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Liens professionnels */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="linkedin_profile" className="text-white">Profil LinkedIn</Label>
              <Input
                id="linkedin_profile"
                type="url"
                value={formData.linkedin_profile}
                onChange={(e) => handleInputChange('linkedin_profile', e.target.value)}
                className="bg-terex-gray border-terex-accent/30 text-white"
                placeholder="https://linkedin.com/in/votre-profil"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="portfolio_url" className="text-white">Portfolio / Site web</Label>
              <Input
                id="portfolio_url"
                type="url"
                value={formData.portfolio_url}
                onChange={(e) => handleInputChange('portfolio_url', e.target.value)}
                className="bg-terex-gray border-terex-accent/30 text-white"
                placeholder="https://votre-portfolio.com"
              />
            </div>
          </div>

          {/* Disponibilité et salaire */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="availability" className="text-white">Disponibilité</Label>
              <Select onValueChange={(value) => handleInputChange('availability', value)}>
                <SelectTrigger className="bg-terex-gray border-terex-accent/30 text-white">
                  <SelectValue placeholder="Quand pouvez-vous commencer ?" />
                </SelectTrigger>
                <SelectContent className="bg-terex-gray border-terex-accent/30">
                  <SelectItem value="immediately">Immédiatement</SelectItem>
                  <SelectItem value="1_week">Dans 1 semaine</SelectItem>
                  <SelectItem value="2_weeks">Dans 2 semaines</SelectItem>
                  <SelectItem value="1_month">Dans 1 mois</SelectItem>
                  <SelectItem value="2_months">Dans 2 mois</SelectItem>
                  <SelectItem value="negotiate">À négocier</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="salary_expectation" className="text-white">Prétentions salariales</Label>
              <Input
                id="salary_expectation"
                type="text"
                value={formData.salary_expectation}
                onChange={(e) => handleInputChange('salary_expectation', e.target.value)}
                className="bg-terex-gray border-terex-accent/30 text-white"
                placeholder="Ex: 40 000 € / an"
              />
            </div>
          </div>

          {/* Lettre de motivation */}
          <div className="space-y-2">
            <Label htmlFor="cover_letter" className="text-white">Lettre de motivation *</Label>
            <Textarea
              id="cover_letter"
              required
              value={formData.cover_letter}
              onChange={(e) => handleInputChange('cover_letter', e.target.value)}
              className="bg-terex-gray border-terex-accent/30 text-white min-h-[120px]"
              placeholder="Parlez-nous de votre motivation, de votre expérience et de ce que vous pouvez apporter à Terex..."
            />
          </div>

          {/* Note CV */}
          <div className="bg-terex-accent/10 border border-terex-accent/20 rounded-lg p-4">
            <div className="flex items-center space-x-2 text-terex-accent">
              <Upload className="w-5 h-5" />
              <span className="font-medium">CV</span>
            </div>
            <p className="text-gray-300 text-sm mt-1">
              Veuillez envoyer votre CV à <strong>Terangaexchange@gmail.com</strong> en mentionnant le poste "{position}" en objet.
            </p>
          </div>

          {/* Boutons */}
          <div className="flex justify-between pt-6">
            {onClose && (
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="border-terex-accent/30 text-terex-accent hover:bg-terex-accent/10"
              >
                Annuler
              </Button>
            )}
            
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-terex-accent hover:bg-terex-accent/90 text-black font-semibold ml-auto"
            >
              {isSubmitting ? (
                "Envoi en cours..."
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Envoyer ma candidature
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};