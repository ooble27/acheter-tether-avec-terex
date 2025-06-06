import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useKYC, KYCData } from '@/hooks/useKYC';
import { Upload, FileText, Camera, MapPin, User, Calendar, Phone, Globe } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface KYCFormProps {
  onComplete?: () => void;
}

export function KYCForm({ onComplete }: KYCFormProps) {
  const { kycData, submitKYC, uploadDocument } = useKYC();
  const { toast } = useToast();
  const [uploading, setUploading] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState<Partial<KYCData>>({
    first_name: kycData?.first_name || '',
    last_name: kycData?.last_name || '',
    date_of_birth: kycData?.date_of_birth || '',
    nationality: kycData?.nationality || '',
    address: kycData?.address || '',
    city: kycData?.city || '',
    postal_code: kycData?.postal_code || '',
    country: kycData?.country || '',
    phone_number: kycData?.phone_number || '',
    identity_document_type: kycData?.identity_document_type || 'national_id',
    identity_document_number: kycData?.identity_document_number || '',
    identity_document_front_url: kycData?.identity_document_front_url || '',
    identity_document_back_url: kycData?.identity_document_back_url || '',
    selfie_url: kycData?.selfie_url || '',
    proof_of_address_url: kycData?.proof_of_address_url || ''
  });

  const handleInputChange = (field: keyof KYCData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileUpload = async (file: File, documentType: string, urlField: keyof KYCData) => {
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "Fichier trop volumineux",
        description: "La taille maximum autorisée est de 10MB",
        variant: "destructive",
      });
      return;
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Type de fichier non autorisé",
        description: "Seuls les fichiers JPG, PNG et PDF sont acceptés",
        variant: "destructive",
      });
      return;
    }

    setUploading(documentType);

    try {
      const result = await uploadDocument(file, documentType);
      
      if (result.error) {
        toast({
          title: "Erreur de téléchargement",
          description: result.error,
          variant: "destructive",
        });
      } else if (result.url) {
        handleInputChange(urlField, result.url);
        toast({
          title: "Document téléchargé",
          description: "Le document a été téléchargé avec succès",
          className: "bg-green-600 text-white border-green-600",
        });
      }
    } catch (error) {
      console.error('Erreur upload:', error);
      toast({
        title: "Erreur de téléchargement",
        description: "Une erreur est survenue lors du téléchargement",
        variant: "destructive",
      });
    } finally {
      setUploading(null);
    }
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }
    
    const requiredFields = [
      'first_name', 'last_name', 'date_of_birth', 'nationality',
      'address', 'city', 'country', 'phone_number',
      'identity_document_number', 'identity_document_front_url',
      'identity_document_back_url', 'selfie_url', 'proof_of_address_url'
    ];

    const missingFields = requiredFields.filter(field => !formData[field as keyof KYCData]);
    
    if (missingFields.length > 0) {
      toast({
        title: "Informations manquantes",
        description: "Veuillez remplir tous les champs requis et télécharger tous les documents",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);
    
    try {
      const result = await submitKYC(formData);
      
      if (result?.error) {
        toast({
          title: "Erreur de soumission",
          description: result.error,
          variant: "destructive",
        });
      } else {
        onComplete?.();
      }
    } catch (error) {
      console.error('Erreur soumission:', error);
      toast({
        title: "Erreur de soumission",
        description: "Une erreur est survenue lors de la soumission",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-none mx-auto space-y-6 md:space-y-8">
      {/* Informations personnelles */}
      <Card className="bg-terex-darker border-terex-gray shadow-lg w-full">
        <CardHeader className="pb-4 md:pb-6 px-6 md:px-8 pt-6 md:pt-8">
          <CardTitle className="text-white flex items-center text-xl md:text-2xl">
            <User className="w-6 h-6 md:w-7 md:h-7 mr-3 md:mr-4 flex-shrink-0" />
            <span className="leading-tight">Informations personnelles</span>
          </CardTitle>
          <CardDescription className="text-gray-400 text-base md:text-lg leading-relaxed">
            Saisissez vos informations personnelles exactement comme elles apparaissent sur vos documents d'identité
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 md:space-y-8 px-6 md:px-8 pb-6 md:pb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            <div className="space-y-3">
              <Label htmlFor="first_name" className="text-gray-300 text-base md:text-lg font-medium">Prénom *</Label>
              <Input
                id="first_name"
                value={formData.first_name || ''}
                onChange={(e) => handleInputChange('first_name', e.target.value)}
                className="bg-terex-gray border-terex-gray text-white h-12 md:h-14 text-base md:text-lg"
                placeholder="Votre prénom"
              />
            </div>
            <div className="space-y-3">
              <Label htmlFor="last_name" className="text-gray-300 text-base md:text-lg font-medium">Nom *</Label>
              <Input
                id="last_name"
                value={formData.last_name || ''}
                onChange={(e) => handleInputChange('last_name', e.target.value)}
                className="bg-terex-gray border-terex-gray text-white h-12 md:h-14 text-base md:text-lg"
                placeholder="Votre nom"
              />
            </div>
            <div className="space-y-3">
              <Label htmlFor="date_of_birth" className="text-gray-300 text-base md:text-lg font-medium">Date de naissance *</Label>
              <Input
                id="date_of_birth"
                type="date"
                value={formData.date_of_birth || ''}
                onChange={(e) => handleInputChange('date_of_birth', e.target.value)}
                className="bg-terex-gray border-terex-gray text-white h-12 md:h-14 text-base md:text-lg"
              />
            </div>
            <div className="space-y-3">
              <Label htmlFor="nationality" className="text-gray-300 text-base md:text-lg font-medium">Nationalité *</Label>
              <Input
                id="nationality"
                value={formData.nationality || ''}
                onChange={(e) => handleInputChange('nationality', e.target.value)}
                className="bg-terex-gray border-terex-gray text-white h-12 md:h-14 text-base md:text-lg"
                placeholder="Votre nationalité"
              />
            </div>
            <div className="space-y-3">
              <Label htmlFor="phone_number" className="text-gray-300 text-base md:text-lg font-medium">Téléphone *</Label>
              <Input
                id="phone_number"
                type="tel"
                value={formData.phone_number || ''}
                onChange={(e) => handleInputChange('phone_number', e.target.value)}
                className="bg-terex-gray border-terex-gray text-white h-12 md:h-14 text-base md:text-lg"
                placeholder="+221 XX XXX XX XX"
              />
            </div>
            <div className="space-y-3">
              <Label htmlFor="country" className="text-gray-300 text-base md:text-lg font-medium">Pays de résidence *</Label>
              <Input
                id="country"
                value={formData.country || ''}
                onChange={(e) => handleInputChange('country', e.target.value)}
                className="bg-terex-gray border-terex-gray text-white h-12 md:h-14 text-base md:text-lg"
                placeholder="Votre pays de résidence"
              />
            </div>
          </div>
          <div className="space-y-3">
            <Label htmlFor="address" className="text-gray-300 text-base md:text-lg font-medium">Adresse complète *</Label>
            <Textarea
              id="address"
              value={formData.address || ''}
              onChange={(e) => handleInputChange('address', e.target.value)}
              className="bg-terex-gray border-terex-gray text-white min-h-[100px] md:min-h-[120px] text-base md:text-lg resize-none"
              placeholder="Numéro, rue, appartement..."
              rows={4}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            <div className="space-y-3">
              <Label htmlFor="city" className="text-gray-300 text-base md:text-lg font-medium">Ville *</Label>
              <Input
                id="city"
                value={formData.city || ''}
                onChange={(e) => handleInputChange('city', e.target.value)}
                className="bg-terex-gray border-terex-gray text-white h-12 md:h-14 text-base md:text-lg"
                placeholder="Votre ville"
              />
            </div>
            <div className="space-y-3">
              <Label htmlFor="postal_code" className="text-gray-300 text-base md:text-lg font-medium">Code postal</Label>
              <Input
                id="postal_code"
                value={formData.postal_code || ''}
                onChange={(e) => handleInputChange('postal_code', e.target.value)}
                className="bg-terex-gray border-terex-gray text-white h-12 md:h-14 text-base md:text-lg"
                placeholder="Code postal"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Document d'identité */}
      <Card className="bg-terex-darker border-terex-gray shadow-lg w-full">
        <CardHeader className="pb-4 md:pb-6 px-6 md:px-8 pt-6 md:pt-8">
          <CardTitle className="text-white flex items-center text-xl md:text-2xl">
            <FileText className="w-6 h-6 md:w-7 md:h-7 mr-3 md:mr-4 flex-shrink-0" />
            <span className="leading-tight">Document d'identité</span>
          </CardTitle>
          <CardDescription className="text-gray-400 text-base md:text-lg leading-relaxed">
            Téléchargez une pièce d'identité valide (recto et verso)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 md:space-y-8 px-6 md:px-8 pb-6 md:pb-8">
          <div className="space-y-3">
            <Label className="text-gray-300 text-base md:text-lg font-medium">Type de document *</Label>
            <Select 
              value={formData.identity_document_type} 
              onValueChange={(value) => handleInputChange('identity_document_type', value)}
            >
              <SelectTrigger className="bg-terex-gray border-terex-gray text-white h-12 md:h-14 text-base md:text-lg">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-terex-gray border-terex-gray">
                <SelectItem value="national_id">Carte d'identité</SelectItem>
                <SelectItem value="passport">Passeport</SelectItem>
                <SelectItem value="drivers_license">Permis de conduire</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-3">
            <Label htmlFor="document_number" className="text-gray-300 text-base md:text-lg font-medium">Numéro du document *</Label>
            <Input
              id="document_number"
              value={formData.identity_document_number || ''}
              onChange={(e) => handleInputChange('identity_document_number', e.target.value)}
              className="bg-terex-gray border-terex-gray text-white h-12 md:h-14 text-base md:text-lg"
              placeholder="Numéro de votre document"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            <div className="space-y-4">
              <Label className="text-gray-300 text-base md:text-lg font-medium">Recto du document *</Label>
              <div>
                <input
                  type="file"
                  id="front-doc"
                  accept="image/*,.pdf"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileUpload(file, 'identity_front', 'identity_document_front_url');
                  }}
                  className="hidden"
                />
                <label
                  htmlFor="front-doc"
                  className={`flex items-center justify-center w-full h-40 md:h-48 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200 ${
                    formData.identity_document_front_url 
                      ? 'border-green-500 bg-green-500/10 hover:bg-green-500/20' 
                      : 'border-terex-gray hover:border-terex-accent bg-terex-gray/30 hover:bg-terex-gray/50'
                  }`}
                >
                  {uploading === 'identity_front' ? (
                    <div className="text-white text-center">
                      <div className="animate-spin rounded-full h-8 w-8 md:h-10 md:w-10 border-b-2 border-white mx-auto mb-3"></div>
                      <p className="text-sm md:text-base">Téléchargement...</p>
                    </div>
                  ) : formData.identity_document_front_url ? (
                    <div className="text-green-400 text-center">
                      <FileText className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-3 md:mb-4" />
                      <p className="text-sm md:text-base font-medium">Document téléchargé</p>
                    </div>
                  ) : (
                    <div className="text-gray-400 text-center px-4">
                      <Upload className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-3 md:mb-4" />
                      <p className="text-sm md:text-base font-medium">Cliquez pour télécharger</p>
                      <p className="text-xs md:text-sm text-gray-500 mt-1">PNG, JPG, PDF (max 10MB)</p>
                    </div>
                  )}
                </label>
              </div>
            </div>

            <div className="space-y-4">
              <Label className="text-gray-300 text-base md:text-lg font-medium">Verso du document *</Label>
              <div>
                <input
                  type="file"
                  id="back-doc"
                  accept="image/*,.pdf"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileUpload(file, 'identity_back', 'identity_document_back_url');
                  }}
                  className="hidden"
                />
                <label
                  htmlFor="back-doc"
                  className={`flex items-center justify-center w-full h-40 md:h-48 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200 ${
                    formData.identity_document_back_url 
                      ? 'border-green-500 bg-green-500/10 hover:bg-green-500/20' 
                      : 'border-terex-gray hover:border-terex-accent bg-terex-gray/30 hover:bg-terex-gray/50'
                  }`}
                >
                  {uploading === 'identity_back' ? (
                    <div className="text-white text-center">
                      <div className="animate-spin rounded-full h-8 w-8 md:h-10 md:w-10 border-b-2 border-white mx-auto mb-3"></div>
                      <p className="text-sm md:text-base">Téléchargement...</p>
                    </div>
                  ) : formData.identity_document_back_url ? (
                    <div className="text-green-400 text-center">
                      <FileText className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-3 md:mb-4" />
                      <p className="text-sm md:text-base font-medium">Document téléchargé</p>
                    </div>
                  ) : (
                    <div className="text-gray-400 text-center px-4">
                      <Upload className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-3 md:mb-4" />
                      <p className="text-sm md:text-base font-medium">Cliquez pour télécharger</p>
                      <p className="text-xs md:text-sm text-gray-500 mt-1">PNG, JPG, PDF (max 10MB)</p>
                    </div>
                  )}
                </label>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Photo avec document */}
      <Card className="bg-terex-darker border-terex-gray shadow-lg w-full">
        <CardHeader className="pb-4 md:pb-6 px-6 md:px-8 pt-6 md:pt-8">
          <CardTitle className="text-white flex items-center text-xl md:text-2xl">
            <Camera className="w-6 h-6 md:w-7 md:h-7 mr-3 md:mr-4 flex-shrink-0" />
            <span className="leading-tight">Photo avec document</span>
          </CardTitle>
          <CardDescription className="text-gray-400 text-base md:text-lg leading-relaxed">
            Prenez une photo de vous en tenant votre document d'identité à côté de votre visage
          </CardDescription>
        </CardHeader>
        <CardContent className="px-6 md:px-8 pb-6 md:pb-8">
          <div>
            <input
              type="file"
              id="selfie"
              accept="image/*"
              capture="user"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  e.preventDefault();
                  handleFileUpload(file, 'selfie', 'selfie_url');
                }
              }}
              className="hidden"
            />
            <label
              htmlFor="selfie"
              className={`flex items-center justify-center w-full h-48 md:h-56 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200 ${
                formData.selfie_url 
                  ? 'border-green-500 bg-green-500/10 hover:bg-green-500/20' 
                  : 'border-terex-gray hover:border-terex-accent bg-terex-gray/30 hover:bg-terex-gray/50'
              }`}
            >
              {uploading === 'selfie' ? (
                <div className="text-white text-center">
                  <div className="animate-spin rounded-full h-12 w-12 md:h-16 md:w-16 border-b-2 border-white mx-auto mb-4"></div>
                  <p className="text-base md:text-lg">Téléchargement...</p>
                </div>
              ) : formData.selfie_url ? (
                <div className="text-green-400 text-center">
                  <Camera className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-4 md:mb-5" />
                  <p className="text-base md:text-xl font-medium">Photo téléchargée</p>
                </div>
              ) : (
                <div className="text-gray-400 text-center px-4">
                  <Camera className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-4 md:mb-5" />
                  <p className="text-base md:text-xl font-medium">Cliquez pour prendre une photo</p>
                  <p className="text-sm md:text-base text-gray-500 mt-2">Tenez votre document à côté de votre visage</p>
                </div>
              )}
            </label>
          </div>
        </CardContent>
      </Card>

      {/* Justificatif de domicile */}
      <Card className="bg-terex-darker border-terex-gray shadow-lg w-full">
        <CardHeader className="pb-4 md:pb-6 px-6 md:px-8 pt-6 md:pt-8">
          <CardTitle className="text-white flex items-center text-xl md:text-2xl">
            <MapPin className="w-6 h-6 md:w-7 md:h-7 mr-3 md:mr-4 flex-shrink-0" />
            <span className="leading-tight">Justificatif de domicile</span>
          </CardTitle>
          <CardDescription className="text-gray-400 text-base md:text-lg leading-relaxed">
            Téléchargez un justificatif de domicile de moins de 3 mois (facture, relevé bancaire...)
          </CardDescription>
        </CardHeader>
        <CardContent className="px-6 md:px-8 pb-6 md:pb-8">
          <div>
            <input
              type="file"
              id="proof-address"
              accept="image/*,.pdf"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFileUpload(file, 'proof_address', 'proof_of_address_url');
              }}
              className="hidden"
            />
            <label
              htmlFor="proof-address"
              className={`flex items-center justify-center w-full h-40 md:h-48 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200 ${
                formData.proof_of_address_url 
                  ? 'border-green-500 bg-green-500/10 hover:bg-green-500/20' 
                  : 'border-terex-gray hover:border-terex-accent bg-terex-gray/30 hover:bg-terex-gray/50'
              }`}
            >
              {uploading === 'proof_address' ? (
                <div className="text-white text-center">
                  <div className="animate-spin rounded-full h-8 w-8 md:h-10 md:w-10 border-b-2 border-white mx-auto mb-3"></div>
                  <p className="text-sm md:text-base">Téléchargement...</p>
                </div>
              ) : formData.proof_of_address_url ? (
                <div className="text-green-400 text-center">
                  <FileText className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-3 md:mb-4" />
                  <p className="text-sm md:text-base font-medium">Justificatif téléchargé</p>
                </div>
              ) : (
                <div className="text-gray-400 text-center px-4">
                  <Upload className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-3 md:mb-4" />
                  <p className="text-sm md:text-base font-medium">Cliquez pour télécharger</p>
                  <p className="text-xs md:text-sm text-gray-500 mt-1">PNG, JPG, PDF (max 10MB)</p>
                </div>
              )}
            </label>
          </div>
        </CardContent>
      </Card>

      {/* Bouton de soumission */}
      <div className="flex justify-center pt-6 md:pt-8">
        <Button 
          type="submit"
          disabled={submitting}
          className="bg-terex-accent hover:bg-terex-accent/90 text-white font-medium px-12 md:px-16 py-4 md:py-5 text-lg md:text-xl h-auto rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 w-full md:w-auto max-w-md"
        >
          {submitting ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 md:h-6 md:w-6 border-b-2 border-white mr-3 md:mr-4"></div>
              Soumission en cours...
            </>
          ) : (
            'Soumettre pour vérification'
          )}
        </Button>
      </div>
    </form>
  );
}
