
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

    setUploading(null);
  };

  const handleSubmit = async () => {
    // Validation des champs requis
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
    
    setSubmitting(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 p-6">
      {/* Informations personnelles */}
      <Card className="bg-terex-darker border-terex-gray shadow-lg">
        <CardHeader className="pb-6">
          <CardTitle className="text-white flex items-center text-2xl">
            <User className="w-6 h-6 mr-3" />
            Informations personnelles
          </CardTitle>
          <CardDescription className="text-gray-400 text-base">
            Saisissez vos informations personnelles exactement comme elles apparaissent sur vos documents d'identité
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="first_name" className="text-gray-300 text-base font-medium">Prénom *</Label>
              <Input
                id="first_name"
                value={formData.first_name || ''}
                onChange={(e) => handleInputChange('first_name', e.target.value)}
                className="bg-terex-gray border-terex-gray text-white h-12 text-base"
                placeholder="Votre prénom"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="last_name" className="text-gray-300 text-base font-medium">Nom *</Label>
              <Input
                id="last_name"
                value={formData.last_name || ''}
                onChange={(e) => handleInputChange('last_name', e.target.value)}
                className="bg-terex-gray border-terex-gray text-white h-12 text-base"
                placeholder="Votre nom"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="date_of_birth" className="text-gray-300 text-base font-medium">Date de naissance *</Label>
              <Input
                id="date_of_birth"
                type="date"
                value={formData.date_of_birth || ''}
                onChange={(e) => handleInputChange('date_of_birth', e.target.value)}
                className="bg-terex-gray border-terex-gray text-white h-12 text-base"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nationality" className="text-gray-300 text-base font-medium">Nationalité *</Label>
              <Input
                id="nationality"
                value={formData.nationality || ''}
                onChange={(e) => handleInputChange('nationality', e.target.value)}
                className="bg-terex-gray border-terex-gray text-white h-12 text-base"
                placeholder="Votre nationalité"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone_number" className="text-gray-300 text-base font-medium">Téléphone *</Label>
              <Input
                id="phone_number"
                type="tel"
                value={formData.phone_number || ''}
                onChange={(e) => handleInputChange('phone_number', e.target.value)}
                className="bg-terex-gray border-terex-gray text-white h-12 text-base"
                placeholder=""
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="country" className="text-gray-300 text-base font-medium">Pays de résidence *</Label>
              <Input
                id="country"
                value={formData.country || ''}
                onChange={(e) => handleInputChange('country', e.target.value)}
                className="bg-terex-gray border-terex-gray text-white h-12 text-base"
                placeholder=""
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="address" className="text-gray-300 text-base font-medium">Adresse complète *</Label>
            <Textarea
              id="address"
              value={formData.address || ''}
              onChange={(e) => handleInputChange('address', e.target.value)}
              className="bg-terex-gray border-terex-gray text-white min-h-[100px] text-base"
              placeholder="Numéro, rue, appartement..."
              rows={4}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="city" className="text-gray-300 text-base font-medium">Ville *</Label>
              <Input
                id="city"
                value={formData.city || ''}
                onChange={(e) => handleInputChange('city', e.target.value)}
                className="bg-terex-gray border-terex-gray text-white h-12 text-base"
                placeholder="Votre ville"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="postal_code" className="text-gray-300 text-base font-medium">Code postal</Label>
              <Input
                id="postal_code"
                value={formData.postal_code || ''}
                onChange={(e) => handleInputChange('postal_code', e.target.value)}
                className="bg-terex-gray border-terex-gray text-white h-12 text-base"
                placeholder=""
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Document d'identité */}
      <Card className="bg-terex-darker border-terex-gray shadow-lg">
        <CardHeader className="pb-6">
          <CardTitle className="text-white flex items-center text-2xl">
            <FileText className="w-6 h-6 mr-3" />
            Document d'identité
          </CardTitle>
          <CardDescription className="text-gray-400 text-base">
            Téléchargez une pièce d'identité valide (recto et verso)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label className="text-gray-300 text-base font-medium">Type de document *</Label>
            <Select 
              value={formData.identity_document_type} 
              onValueChange={(value) => handleInputChange('identity_document_type', value)}
            >
              <SelectTrigger className="bg-terex-gray border-terex-gray text-white h-12 text-base">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-terex-gray border-terex-gray">
                <SelectItem value="national_id">Carte d'identité</SelectItem>
                <SelectItem value="passport">Passeport</SelectItem>
                <SelectItem value="drivers_license">Permis de conduire</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="document_number" className="text-gray-300 text-base font-medium">Numéro du document *</Label>
            <Input
              id="document_number"
              value={formData.identity_document_number || ''}
              onChange={(e) => handleInputChange('identity_document_number', e.target.value)}
              className="bg-terex-gray border-terex-gray text-white h-12 text-base"
              placeholder="Numéro de votre document"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-3">
              <Label className="text-gray-300 text-base font-medium">Recto du document *</Label>
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
                  className={`flex items-center justify-center w-full h-40 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200 ${
                    formData.identity_document_front_url 
                      ? 'border-green-500 bg-green-500/10 hover:bg-green-500/20' 
                      : 'border-terex-gray hover:border-terex-accent bg-terex-gray/30 hover:bg-terex-gray/50'
                  }`}
                >
                  {uploading === 'identity_front' ? (
                    <div className="text-white text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
                      Téléchargement...
                    </div>
                  ) : formData.identity_document_front_url ? (
                    <div className="text-green-400 text-center">
                      <FileText className="w-12 h-12 mx-auto mb-3" />
                      <p className="text-sm font-medium">Document téléchargé</p>
                    </div>
                  ) : (
                    <div className="text-gray-400 text-center">
                      <Upload className="w-12 h-12 mx-auto mb-3" />
                      <p className="text-sm font-medium">Cliquez pour télécharger</p>
                      <p className="text-xs text-gray-500 mt-1">PNG, JPG, PDF (max 10MB)</p>
                    </div>
                  )}
                </label>
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-gray-300 text-base font-medium">Verso du document *</Label>
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
                  className={`flex items-center justify-center w-full h-40 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200 ${
                    formData.identity_document_back_url 
                      ? 'border-green-500 bg-green-500/10 hover:bg-green-500/20' 
                      : 'border-terex-gray hover:border-terex-accent bg-terex-gray/30 hover:bg-terex-gray/50'
                  }`}
                >
                  {uploading === 'identity_back' ? (
                    <div className="text-white text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
                      Téléchargement...
                    </div>
                  ) : formData.identity_document_back_url ? (
                    <div className="text-green-400 text-center">
                      <FileText className="w-12 h-12 mx-auto mb-3" />
                      <p className="text-sm font-medium">Document téléchargé</p>
                    </div>
                  ) : (
                    <div className="text-gray-400 text-center">
                      <Upload className="w-12 h-12 mx-auto mb-3" />
                      <p className="text-sm font-medium">Cliquez pour télécharger</p>
                      <p className="text-xs text-gray-500 mt-1">PNG, JPG, PDF (max 10MB)</p>
                    </div>
                  )}
                </label>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Photo avec document */}
      <Card className="bg-terex-darker border-terex-gray shadow-lg">
        <CardHeader className="pb-6">
          <CardTitle className="text-white flex items-center text-2xl">
            <Camera className="w-6 h-6 mr-3" />
            Photo avec document
          </CardTitle>
          <CardDescription className="text-gray-400 text-base">
            Prenez une photo de vous en tenant votre document d'identité à côté de votre visage
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div>
            <input
              type="file"
              id="selfie"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFileUpload(file, 'selfie', 'selfie_url');
              }}
              className="hidden"
            />
            <label
              htmlFor="selfie"
              className={`flex items-center justify-center w-full h-48 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200 ${
                formData.selfie_url 
                  ? 'border-green-500 bg-green-500/10 hover:bg-green-500/20' 
                  : 'border-terex-gray hover:border-terex-accent bg-terex-gray/30 hover:bg-terex-gray/50'
              }`}
            >
              {uploading === 'selfie' ? (
                <div className="text-white text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-3"></div>
                  Téléchargement...
                </div>
              ) : formData.selfie_url ? (
                <div className="text-green-400 text-center">
                  <Camera className="w-16 h-16 mx-auto mb-4" />
                  <p className="text-lg font-medium">Photo téléchargée</p>
                </div>
              ) : (
                <div className="text-gray-400 text-center">
                  <Camera className="w-16 h-16 mx-auto mb-4" />
                  <p className="text-lg font-medium">Cliquez pour prendre une photo</p>
                  <p className="text-sm text-gray-500 mt-2">Tenez votre document à côté de votre visage</p>
                </div>
              )}
            </label>
          </div>
        </CardContent>
      </Card>

      {/* Justificatif de domicile */}
      <Card className="bg-terex-darker border-terex-gray shadow-lg">
        <CardHeader className="pb-6">
          <CardTitle className="text-white flex items-center text-2xl">
            <MapPin className="w-6 h-6 mr-3" />
            Justificatif de domicile
          </CardTitle>
          <CardDescription className="text-gray-400 text-base">
            Téléchargez un justificatif de domicile de moins de 3 mois (facture, relevé bancaire...)
          </CardDescription>
        </CardHeader>
        <CardContent>
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
              className={`flex items-center justify-center w-full h-40 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200 ${
                formData.proof_of_address_url 
                  ? 'border-green-500 bg-green-500/10 hover:bg-green-500/20' 
                  : 'border-terex-gray hover:border-terex-accent bg-terex-gray/30 hover:bg-terex-gray/50'
              }`}
            >
              {uploading === 'proof_address' ? (
                <div className="text-white text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
                  Téléchargement...
                </div>
              ) : formData.proof_of_address_url ? (
                <div className="text-green-400 text-center">
                  <FileText className="w-12 h-12 mx-auto mb-3" />
                  <p className="text-sm font-medium">Justificatif téléchargé</p>
                </div>
              ) : (
                <div className="text-gray-400 text-center">
                  <Upload className="w-12 h-12 mx-auto mb-3" />
                  <p className="text-sm font-medium">Cliquez pour télécharger</p>
                  <p className="text-xs text-gray-500 mt-1">PNG, JPG, PDF (max 10MB)</p>
                </div>
              )}
            </label>
          </div>
        </CardContent>
      </Card>

      {/* Bouton de soumission */}
      <div className="flex justify-center pt-6">
        <Button 
          onClick={handleSubmit}
          disabled={submitting}
          className="bg-terex-accent hover:bg-terex-accent/90 text-white font-medium px-12 py-4 text-lg h-auto rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
        >
          {submitting ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
              Soumission en cours...
            </>
          ) : (
            'Soumettre pour vérification'
          )}
        </Button>
      </div>
    </div>
  );
}
