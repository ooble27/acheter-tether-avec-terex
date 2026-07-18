import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Sparkles, Copy, Check, Loader2, Info, RefreshCw } from 'lucide-react';
import { PageHeader, drillStyles } from '@/components/admin/AdminDrill';

const CARD = '#1e1e1e';
const BORDER = 'rgba(255,255,255,0.07)';

type Variant = { text: string; hashtags: string[] };

const PLATFORMS = [
  { id: 'facebook', label: 'Facebook' },
  { id: 'instagram', label: 'Instagram' },
  { id: 'tiktok', label: 'TikTok' },
  { id: 'whatsapp', label: 'Statut WhatsApp' },
  { id: 'twitter', label: 'X (Twitter)' },
];

const TONES = [
  { id: 'proximite', label: 'Proche & humain' },
  { id: 'confiance', label: 'Confiance' },
  { id: 'educatif', label: 'Éducatif' },
  { id: 'promo', label: 'Promo' },
];

// Idées d'angles pour démarrer vite.
const IDEAS = [
  'Rassurer un débutant : comment acheter de l\'USDT en toute sécurité',
  'Rapidité : recevez vos USDT en quelques minutes via Wave',
  'Vendre ses USDT et recevoir des CFA sur Orange Money',
  'Pourquoi choisir Terex plutôt qu\'un particulier inconnu',
  'À quoi sert l\'USDT (Tether) expliqué simplement',
];

export function ContentStudio() {
  const [platform, setPlatform] = useState('facebook');
  const [tone, setTone] = useState('proximite');
  const [topic, setTopic] = useState('');
  const [rate, setRate] = useState('');
  const [count, setCount] = useState(3);
  const [loading, setLoading] = useState(false);
  const [variants, setVariants] = useState<Variant[]>([]);
  const [notice, setNotice] = useState<string | null>(null);
  const [copied, setCopied] = useState<number | null>(null);

  const generate = async () => {
    setLoading(true);
    setNotice(null);
    try {
      const { data, error } = await supabase.functions.invoke('generate-marketing-content', {
        body: { platform, tone, topic, rate, count },
      });
      if (error) throw error;
      if (data?.message && (!data.variants || data.variants.length === 0)) {
        setNotice(data.message);
        setVariants([]);
      } else {
        setVariants(data?.variants || []);
        if (!data?.variants?.length) setNotice("Aucun contenu généré. Réessaie.");
      }
    } catch (e: any) {
      setNotice("Le générateur est indisponible. Vérifie que la clé API est bien configurée.");
      setVariants([]);
    } finally {
      setLoading(false);
    }
  };

  const copy = (v: Variant, i: number) => {
    const tags = v.hashtags?.length ? '\n\n' + v.hashtags.map(h => '#' + h.replace(/^#/, '')).join(' ') : '';
    navigator.clipboard.writeText(v.text + tags);
    setCopied(i);
    setTimeout(() => setCopied(null), 1500);
  };

  const chip = (active: boolean) => ({
    padding: '9px 15px', borderRadius: 10, cursor: 'pointer', fontSize: 13, fontWeight: active ? 700 : 500,
    background: active ? '#fff' : CARD, color: active ? '#141414' : '#9ca3af',
    border: `1px solid ${active ? '#fff' : BORDER}`, whiteSpace: 'nowrap' as const,
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <style>{drillStyles}</style>
      <PageHeader title="Studio de contenu" sub="Génère des publications prêtes à poster pour tes réseaux — relis, puis publie." />

      {/* Composeur */}
      <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 16, padding: 18, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div>
          <p style={{ color: '#6b7280', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 8px' }}>Plateforme</p>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {PLATFORMS.map(p => <button key={p.id} onClick={() => setPlatform(p.id)} style={chip(platform === p.id)}>{p.label}</button>)}
          </div>
        </div>

        <div>
          <p style={{ color: '#6b7280', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 8px' }}>Ton</p>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {TONES.map(t => <button key={t.id} onClick={() => setTone(t.id)} style={chip(tone === t.id)}>{t.label}</button>)}
          </div>
        </div>

        <div>
          <p style={{ color: '#6b7280', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 8px' }}>Sujet / angle <span style={{ textTransform: 'none', fontWeight: 400 }}>(optionnel)</span></p>
          <textarea value={topic} onChange={e => setTopic(e.target.value)} rows={2}
            placeholder="Ex : rassurer un client qui achète pour la première fois…"
            style={{ width: '100%', background: '#141414', border: `1px solid ${BORDER}`, borderRadius: 10, color: '#fff', fontSize: 13.5, padding: '11px 13px', resize: 'vertical', fontFamily: 'inherit', boxSizing: 'border-box' }} />
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 8 }}>
            {IDEAS.map((idea, i) => (
              <button key={i} onClick={() => setTopic(idea)}
                style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${BORDER}`, borderRadius: 999, padding: '5px 11px', fontSize: 11.5, color: '#9ca3af', cursor: 'pointer' }}>
                {idea.length > 42 ? idea.slice(0, 42) + '…' : idea}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <div style={{ flex: 1, minWidth: 160 }}>
            <p style={{ color: '#6b7280', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 8px' }}>Taux du jour <span style={{ textTransform: 'none', fontWeight: 400 }}>(optionnel)</span></p>
            <input value={rate} onChange={e => setRate(e.target.value)} placeholder="Ex : 655 CFA / USDT"
              style={{ width: '100%', background: '#141414', border: `1px solid ${BORDER}`, borderRadius: 10, color: '#fff', fontSize: 13.5, padding: '11px 13px', boxSizing: 'border-box' }} />
          </div>
          <div>
            <p style={{ color: '#6b7280', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 8px' }}>Variantes</p>
            <div style={{ display: 'flex', gap: 4 }}>
              {[2, 3, 4, 5].map(n => (
                <button key={n} onClick={() => setCount(n)} style={{ width: 40, height: 40, borderRadius: 10, cursor: 'pointer', fontSize: 14, fontWeight: 700, background: count === n ? '#fff' : CARD, color: count === n ? '#141414' : '#9ca3af', border: `1px solid ${count === n ? '#fff' : BORDER}` }}>{n}</button>
              ))}
            </div>
          </div>
        </div>

        <button onClick={generate} disabled={loading}
          style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: '#fff', color: '#141414', border: 'none', borderRadius: 12, padding: '13px 20px', fontSize: 14.5, fontWeight: 700, cursor: loading ? 'default' : 'pointer', opacity: loading ? 0.7 : 1 }}>
          {loading ? <><Loader2 size={16} className="animate-spin" /> Génération…</> : <><Sparkles size={16} /> Générer le contenu</>}
        </button>
      </div>

      {/* Notice */}
      {notice && (
        <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', background: 'rgba(255,255,255,0.03)', border: `1px solid ${BORDER}`, borderRadius: 12, padding: '14px 16px' }}>
          <Info size={16} color="#6b7280" style={{ flexShrink: 0, marginTop: 1 }} />
          <p style={{ color: '#9ca3af', fontSize: 13, margin: 0, lineHeight: 1.6 }}>{notice}</p>
        </div>
      )}

      {/* Résultats */}
      {variants.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <p style={{ color: '#fff', fontSize: 13.5, fontWeight: 700, margin: 0 }}>{variants.length} proposition(s)</p>
            <button className="ghost-btn" onClick={generate} disabled={loading}><RefreshCw size={13} className={loading ? 'animate-spin' : ''} /> Regénérer</button>
          </div>
          {variants.map((v, i) => (
            <div key={i} style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 14, padding: 16 }}>
              <p style={{ color: '#f0f0f0', fontSize: 14, lineHeight: 1.65, margin: 0, whiteSpace: 'pre-wrap' }}>{v.text}</p>
              {v.hashtags?.length > 0 && (
                <p style={{ color: '#7aa2e0', fontSize: 12.5, margin: '10px 0 0', lineHeight: 1.6 }}>
                  {v.hashtags.map(h => '#' + h.replace(/^#/, '')).join(' ')}
                </p>
              )}
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 12 }}>
                <button onClick={() => copy(v, i)}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: copied === i ? 'rgba(52,211,153,0.12)' : 'rgba(255,255,255,0.05)', color: copied === i ? '#34d399' : '#fff', border: `1px solid ${BORDER}`, borderRadius: 9, padding: '8px 14px', fontSize: 12.5, fontWeight: 600, cursor: 'pointer' }}>
                  {copied === i ? <><Check size={14} /> Copié</> : <><Copy size={14} /> Copier</>}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
