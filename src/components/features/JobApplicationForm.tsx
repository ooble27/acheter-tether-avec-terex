import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useJobApplications, JobApplication } from '@/hooks/useJobApplications';
import { useAuth } from '@/contexts/AuthContext';
import { Send, User, Mail, Phone, MapPin, Briefcase, FileText, Linkedin, Globe, Clock, DollarSign } from 'lucide-react';

interface JobApplicationFormProps {
  position: string;
  onClose?: () => void;
}

export const JobApplicationForm = ({ position, onClose }: JobApplicationFormProps) => {
  const { submitApplication, isSubmitting } = useJobApplications();
  const { user } = useAuth();
  
  const [formData, setFormData] = useState<JobApplication>({
    position,
    first_name: '',
    last_name: '',
    email: user?.email || '',
    phone: '',
    location: '',
    experience_years: undefined,
    cover_letter: '',
    linkedin_profile: '',
    portfolio_url: '',
    availability: '',
    salary_expectation: '',
  });

  const handleInputChange = (field: keyof JobApplication, value: string | number | File) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await submitApplication(formData);
    if (result.success && onClose) onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Section: Informations personnelles */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-6 h-6 rounded-md bg-white/[0.06] flex items-center justify-center">
            <User className="w-3.5 h-3.5 text-foreground" strokeWidth={1.5} />
          </div>
          <p className="text-foreground text-sm font-medium">Informations personnelles</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label htmlFor="first_name" className="text-muted-foreground text-xs">Prénom *</Label>
            <div className="relative">
              <Input id="first_name" type="text" required value={formData.first_name}
                onChange={(e) => handleInputChange('first_name', e.target.value)}
                className="bg-white/[0.03] border-white/[0.08] text-foreground h-10 rounded-xl pl-9 focus:border-white/20 placeholder:text-white/20"
                placeholder="Prénom" />
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/30" strokeWidth={1.5} />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="last_name" className="text-muted-foreground text-xs">Nom *</Label>
            <div className="relative">
              <Input id="last_name" type="text" required value={formData.last_name}
                onChange={(e) => handleInputChange('last_name', e.target.value)}
                className="bg-white/[0.03] border-white/[0.08] text-foreground h-10 rounded-xl pl-9 focus:border-white/20 placeholder:text-white/20"
                placeholder="Nom" />
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/30" strokeWidth={1.5} />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-muted-foreground text-xs">Email *</Label>
            <div className="relative">
              <Input id="email" type="email" required value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="bg-white/[0.03] border-white/[0.08] text-foreground h-10 rounded-xl pl-9 focus:border-white/20 placeholder:text-white/20"
                placeholder="votre@email.com" />
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/30" strokeWidth={1.5} />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="phone" className="text-muted-foreground text-xs">Téléphone</Label>
            <div className="relative">
              <Input id="phone" type="tel" value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className="bg-white/[0.03] border-white/[0.08] text-foreground h-10 rounded-xl pl-9 focus:border-white/20 placeholder:text-white/20"
                placeholder="+221 77 123 45 67" />
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/30" strokeWidth={1.5} />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="location" className="text-muted-foreground text-xs">Localisation</Label>
            <div className="relative">
              <Input id="location" type="text" value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                className="bg-white/[0.03] border-white/[0.08] text-foreground h-10 rounded-xl pl-9 focus:border-white/20 placeholder:text-white/20"
                placeholder="Ville, Pays" />
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/30" strokeWidth={1.5} />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label className="text-muted-foreground text-xs">Années d'expérience</Label>
            <Select onValueChange={(value) => handleInputChange('experience_years', parseInt(value))}>
              <SelectTrigger className="bg-white/[0.03] border-white/[0.08] text-foreground h-10 rounded-xl focus:border-white/20">
                <div className="flex items-center gap-2">
                  <Briefcase className="w-3.5 h-3.5 text-white/30" strokeWidth={1.5} />
                  <SelectValue placeholder="Sélectionnez" />
                </div>
              </SelectTrigger>
              <SelectContent className="bg-[hsl(var(--terex-dark))] border-white/[0.08] rounded-xl">
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
      </div>

      <div className="border-t border-dashed border-white/[0.08]" />

      {/* Section: Documents */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-6 h-6 rounded-md bg-white/[0.06] flex items-center justify-center">
            <FileText className="w-3.5 h-3.5 text-foreground" strokeWidth={1.5} />
          </div>
          <p className="text-foreground text-sm font-medium">Documents & liens</p>
        </div>
        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="cv_file" className="text-muted-foreground text-xs">CV * <span className="text-white/20">— PDF, DOC, DOCX</span></Label>
            <Input id="cv_file" type="file" accept=".pdf,.doc,.docx" required
              onChange={(e) => { const file = e.target.files?.[0]; if (file) handleInputChange('cv_file', file); }}
              className="bg-white/[0.03] border-white/[0.08] text-foreground h-10 rounded-xl focus:border-white/20 file:text-muted-foreground file:text-xs file:mr-3" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="linkedin_profile" className="text-muted-foreground text-xs">LinkedIn</Label>
              <div className="relative">
                <Input id="linkedin_profile" type="url" value={formData.linkedin_profile}
                  onChange={(e) => handleInputChange('linkedin_profile', e.target.value)}
                  className="bg-white/[0.03] border-white/[0.08] text-foreground h-10 rounded-xl pl-9 focus:border-white/20 placeholder:text-white/20"
                  placeholder="linkedin.com/in/..." />
                <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/30" strokeWidth={1.5} />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="portfolio_url" className="text-muted-foreground text-xs">Portfolio / Site web</Label>
              <div className="relative">
                <Input id="portfolio_url" type="url" value={formData.portfolio_url}
                  onChange={(e) => handleInputChange('portfolio_url', e.target.value)}
                  className="bg-white/[0.03] border-white/[0.08] text-foreground h-10 rounded-xl pl-9 focus:border-white/20 placeholder:text-white/20"
                  placeholder="https://..." />
                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/30" strokeWidth={1.5} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-dashed border-white/[0.08]" />

      {/* Section: Disponibilité */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-6 h-6 rounded-md bg-white/[0.06] flex items-center justify-center">
            <Clock className="w-3.5 h-3.5 text-foreground" strokeWidth={1.5} />
          </div>
          <p className="text-foreground text-sm font-medium">Disponibilité & attentes</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label className="text-muted-foreground text-xs">Disponibilité</Label>
            <Select onValueChange={(value) => handleInputChange('availability', value)}>
              <SelectTrigger className="bg-white/[0.03] border-white/[0.08] text-foreground h-10 rounded-xl focus:border-white/20">
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-white/30" strokeWidth={1.5} />
                  <SelectValue placeholder="Quand ?" />
                </div>
              </SelectTrigger>
              <SelectContent className="bg-[hsl(var(--terex-dark))] border-white/[0.08] rounded-xl">
                <SelectItem value="immediately">Immédiatement</SelectItem>
                <SelectItem value="1_week">Dans 1 semaine</SelectItem>
                <SelectItem value="2_weeks">Dans 2 semaines</SelectItem>
                <SelectItem value="1_month">Dans 1 mois</SelectItem>
                <SelectItem value="2_months">Dans 2 mois</SelectItem>
                <SelectItem value="negotiate">À négocier</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="salary_expectation" className="text-muted-foreground text-xs">Prétentions salariales</Label>
            <div className="relative">
              <Input id="salary_expectation" type="text" value={formData.salary_expectation}
                onChange={(e) => handleInputChange('salary_expectation', e.target.value)}
                className="bg-white/[0.03] border-white/[0.08] text-foreground h-10 rounded-xl pl-9 focus:border-white/20 placeholder:text-white/20"
                placeholder="Ex: 40 000 CFA / mois" />
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/30" strokeWidth={1.5} />
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-dashed border-white/[0.08]" />

      {/* Lettre de motivation */}
      <div className="space-y-1.5">
        <Label htmlFor="cover_letter" className="text-muted-foreground text-xs">Lettre de motivation *</Label>
        <Textarea id="cover_letter" required value={formData.cover_letter}
          onChange={(e) => handleInputChange('cover_letter', e.target.value)}
          className="bg-white/[0.03] border-white/[0.08] text-foreground rounded-xl min-h-[100px] focus:border-white/20 placeholder:text-white/20 text-sm"
          placeholder="Parlez-nous de votre motivation, de votre expérience et de ce que vous pouvez apporter à Terex..." />
      </div>

      {/* Actions */}
      <div className="flex flex-col-reverse sm:flex-row sm:justify-between gap-3 pt-2">
        {onClose && (
          <Button type="button" variant="ghost" onClick={onClose}
            className="text-muted-foreground hover:text-foreground hover:bg-white/[0.04] h-10 rounded-xl">
            Annuler
          </Button>
        )}
        <Button type="submit" disabled={isSubmitting}
          className="bg-foreground text-background hover:bg-foreground/90 font-medium h-10 px-6 rounded-xl sm:ml-auto">
          {isSubmitting ? "Envoi en cours..." : (
            <><Send className="w-3.5 h-3.5 mr-2" />Envoyer ma candidature</>
          )}
        </Button>
      </div>
    </form>
  );
};
