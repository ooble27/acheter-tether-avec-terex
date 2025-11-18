import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Clock, MapPin, Video } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface InterviewScheduleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  application: any;
  onScheduled: () => void;
}

export function InterviewScheduleDialog({ open, onOpenChange, application, onScheduled }: InterviewScheduleDialogProps) {
  const [date, setDate] = useState<Date>();
  const [time, setTime] = useState('');
  const [interviewType, setInterviewType] = useState<'in-person' | 'online'>('online');
  const [location, setLocation] = useState('');
  const [meetingLink, setMeetingLink] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSchedule = async () => {
    if (!date || !time) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner une date et une heure",
        variant: "destructive"
      });
      return;
    }

    if (interviewType === 'in-person' && !location) {
      toast({
        title: "Erreur",
        description: "Veuillez saisir l'adresse du lieu",
        variant: "destructive"
      });
      return;
    }

    if (interviewType === 'online' && !meetingLink) {
      toast({
        title: "Erreur",
        description: "Veuillez saisir le lien de la réunion",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      const interviewDateTime = new Date(date);
      const [hours, minutes] = time.split(':');
      interviewDateTime.setHours(parseInt(hours), parseInt(minutes));

      // Update application status and add interview details to admin notes
      const interviewDetails = {
        date: format(interviewDateTime, 'PPP à HH:mm', { locale: fr }),
        type: interviewType,
        location: interviewType === 'in-person' ? location : meetingLink,
        notes: notes
      };

      const updatedNotes = `${application.admin_notes || ''}\n\n--- Entretien programmé ---\nDate: ${interviewDetails.date}\nType: ${interviewType === 'in-person' ? 'En personne' : 'En ligne'}\n${interviewType === 'in-person' ? `Lieu: ${location}` : `Lien: ${meetingLink}`}${notes ? `\nNotes: ${notes}` : ''}`;

      const { error: updateError } = await supabase
        .from('job_applications')
        .update({
          status: 'interview',
          admin_notes: updatedNotes
        })
        .eq('id', application.id);

      if (updateError) throw updateError;

      // Send email notification to applicant
      const { error: emailError } = await supabase.functions.invoke('send-email-notification', {
        body: {
          emailType: 'interview_scheduled',
          emailAddress: application.email,
          applicationData: {
            ...application,
            interviewDate: interviewDetails.date,
            interviewType: interviewType === 'in-person' ? 'En personne' : 'En ligne',
            interviewLocation: interviewType === 'in-person' ? location : meetingLink,
            interviewNotes: notes
          }
        }
      });

      if (emailError) {
        console.error('Error sending email:', emailError);
        // Don't throw - the interview is still scheduled even if email fails
        toast({
          title: "Entretien programmé",
          description: "L'entretien a été programmé mais l'email n'a pas pu être envoyé",
          variant: "default"
        });
      } else {
        toast({
          title: "Succès",
          description: "L'entretien a été programmé et un email a été envoyé au candidat"
        });
      }

      onScheduled();
      onOpenChange(false);
      
      // Reset form
      setDate(undefined);
      setTime('');
      setInterviewType('online');
      setLocation('');
      setMeetingLink('');
      setNotes('');

    } catch (error) {
      console.error('Error scheduling interview:', error);
      toast({
        title: "Erreur",
        description: "Impossible de programmer l'entretien",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-terex-dark border-terex-gray">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-white">
            Programmer un entretien
          </DialogTitle>
          <p className="text-gray-400 text-sm">
            {application?.first_name} {application?.last_name} - {application?.position}
          </p>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Date Selection */}
          <div className="space-y-2">
            <Label htmlFor="date" className="text-white">Date de l'entretien *</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal bg-terex-darker border-terex-gray",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, 'PPP', { locale: fr }) : <span>Sélectionner une date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-terex-dark border-terex-gray" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  disabled={(date) => date < new Date()}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Time Selection */}
          <div className="space-y-2">
            <Label htmlFor="time" className="text-white">Heure *</Label>
            <div className="relative">
              <Clock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="time"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="pl-10 bg-terex-darker border-terex-gray text-white"
              />
            </div>
          </div>

          {/* Interview Type */}
          <div className="space-y-2">
            <Label htmlFor="type" className="text-white">Type d'entretien *</Label>
            <Select value={interviewType} onValueChange={(value: 'in-person' | 'online') => setInterviewType(value)}>
              <SelectTrigger className="bg-terex-darker border-terex-gray text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-terex-dark border-terex-gray">
                <SelectItem value="online">
                  <div className="flex items-center">
                    <Video className="w-4 h-4 mr-2" />
                    En ligne
                  </div>
                </SelectItem>
                <SelectItem value="in-person">
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-2" />
                    En personne
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Location or Meeting Link */}
          {interviewType === 'in-person' ? (
            <div className="space-y-2">
              <Label htmlFor="location" className="text-white">Adresse du lieu *</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="123 Rue Example, Dakar, Sénégal"
                  className="pl-10 bg-terex-darker border-terex-gray text-white"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <Label htmlFor="meeting-link" className="text-white">Lien de la réunion *</Label>
              <div className="relative">
                <Video className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="meeting-link"
                  type="url"
                  value={meetingLink}
                  onChange={(e) => setMeetingLink(e.target.value)}
                  placeholder="https://meet.google.com/..."
                  className="pl-10 bg-terex-darker border-terex-gray text-white"
                />
              </div>
            </div>
          )}

          {/* Additional Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes" className="text-white">Notes supplémentaires (optionnel)</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Informations complémentaires pour le candidat..."
              className="bg-terex-darker border-terex-gray text-white min-h-[100px]"
            />
          </div>
        </div>

        <DialogFooter className="mt-6">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="border-terex-gray text-white hover:bg-terex-gray"
          >
            Annuler
          </Button>
          <Button
            onClick={handleSchedule}
            disabled={loading}
            className="bg-terex-accent hover:bg-terex-accent/90"
          >
            {loading ? 'Programmation...' : 'Programmer l\'entretien'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
