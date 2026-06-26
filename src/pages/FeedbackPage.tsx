import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Star, Send, AlertCircle, Lightbulb, Heart } from 'lucide-react';

const CARD = '#1e1e1e';
const BORDER = 'rgba(255,255,255,0.07)';
const ACCENT = '#3B968F';
const ICON_BG = 'rgba(255,255,255,0.06)';

type Category = 'bug' | 'suggestion' | 'appreciation';

const categories: { id: Category; label: string; Icon: typeof AlertCircle; desc: string }[] = [
  { id: 'bug',          label: 'Problème',    Icon: AlertCircle, desc: 'Signaler un bug' },
  { id: 'suggestion',   label: 'Suggestion',  Icon: Lightbulb,   desc: 'Proposer une idée' },
  { id: 'appreciation', label: 'Appréciation',Icon: Heart,       desc: 'Partager un avis' },
];

export default function FeedbackPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [rating, setRating]           = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [category, setCategory]       = useState<Category>('suggestion');
  const [message, setMessage]         = useState('');
  const [loading, setLoading]         = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({ title: 'Erreur', description: 'Vous devez être connecté.', variant: 'destructive' });
      return;
    }
    if (rating === 0 || !message.trim()) {
      toast({ title: 'Erreur', description: 'Veuillez donner une note et un message.', variant: 'destructive' });
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.from('contact_messages').insert({
        user_id: user.id,
        user_email: user.email,
        user_name: user.user_metadata?.name || user.email,
        subject: `Avis & Suggestion - ${category}`,
        message: `Note: ${rating}/5\n\nCatégorie: ${category}\n\n${message}`,
        status: 'new',
      });
      if (error) throw error;
      toast({ title: 'Merci pour votre retour !', description: 'Votre avis a été envoyé avec succès.' });
      setRating(0);
      setMessage('');
      setCategory('suggestion');
    } catch {
      toast({ title: 'Erreur', description: "Impossible d'envoyer votre avis.", variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const activeRating = hoverRating || rating;

  return (
    <div style={{ maxWidth: '560px', margin: '0 auto', padding: '32px 20px 120px' }}>

      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <p style={{ color: '#6b7280', fontSize: '12px', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 4px' }}>Compte</p>
        <h1 style={{ color: '#fff', fontSize: '26px', fontWeight: 700, margin: 0, letterSpacing: '-0.4px' }}>Avis & Suggestions</h1>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

        {/* Category */}
        <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: '20px', padding: '20px' }}>
          <p style={{ color: '#6b7280', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 14px' }}>Type de retour</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
            {categories.map(({ id, label, Icon, desc }) => {
              const isActive = category === id;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => setCategory(id)}
                  style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
                    padding: '16px 12px', borderRadius: '14px', cursor: 'pointer', border: `1px solid ${isActive ? 'rgba(59,150,143,0.4)' : BORDER}`,
                    background: isActive ? 'rgba(59,150,143,0.08)' : 'rgba(255,255,255,0.03)',
                    transition: 'all 0.18s ease',
                  }}
                >
                  <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: isActive ? 'rgba(59,150,143,0.15)' : ICON_BG, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon size={17} color={isActive ? ACCENT : 'rgba(255,255,255,0.5)'} strokeWidth={1.8} />
                  </div>
                  <span style={{ color: isActive ? '#fff' : '#6b7280', fontSize: '12px', fontWeight: 600 }}>{label}</span>
                  <span style={{ color: '#4b5563', fontSize: '10px', textAlign: 'center' }}>{desc}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Star rating */}
        <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: '20px', padding: '20px' }}>
          <p style={{ color: '#6b7280', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 16px' }}>Votre note</p>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
            {[1, 2, 3, 4, 5].map(star => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', transition: 'transform 0.12s ease' }}
                onMouseDown={e => (e.currentTarget.style.transform = 'scale(0.9)')}
                onMouseUp={e => (e.currentTarget.style.transform = 'scale(1)')}
              >
                <Star
                  size={36}
                  strokeWidth={1.5}
                  style={{
                    fill: star <= activeRating ? ACCENT : 'transparent',
                    color: star <= activeRating ? ACCENT : '#374151',
                    transition: 'fill 0.15s ease, color 0.15s ease',
                  }}
                />
              </button>
            ))}
          </div>
          {rating > 0 && (
            <p style={{ color: '#6b7280', fontSize: '12px', textAlign: 'center', margin: '10px 0 0' }}>
              {['', 'Très mauvais', 'Mauvais', 'Correct', 'Bon', 'Excellent'][rating]}
            </p>
          )}
        </div>

        {/* Message */}
        <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: '20px', padding: '20px' }}>
          <p style={{ color: '#6b7280', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 12px' }}>Votre message</p>
          <textarea
            value={message}
            onChange={e => setMessage(e.target.value)}
            placeholder="Partagez votre expérience, vos suggestions ou vos remarques..."
            required
            rows={5}
            style={{
              width: '100%', background: 'rgba(255,255,255,0.03)', border: `1px solid ${BORDER}`,
              borderRadius: '12px', padding: '14px', color: '#fff', fontSize: '14px',
              lineHeight: 1.6, resize: 'none', outline: 'none', boxSizing: 'border-box',
              fontFamily: 'inherit',
            }}
            onFocus={e => (e.currentTarget.style.borderColor = 'rgba(59,150,143,0.4)')}
            onBlur={e => (e.currentTarget.style.borderColor = BORDER)}
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading || rating === 0 || !message.trim()}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            width: '100%', padding: '16px', borderRadius: '16px', border: 'none', cursor: loading || rating === 0 || !message.trim() ? 'not-allowed' : 'pointer',
            background: loading || rating === 0 || !message.trim() ? 'rgba(59,150,143,0.3)' : ACCENT,
            color: '#fff', fontSize: '15px', fontWeight: 600, transition: 'background 0.18s ease',
          }}
        >
          <Send size={16} />
          {loading ? 'Envoi en cours…' : 'Envoyer mon avis'}
        </button>

      </form>
    </div>
  );
}
