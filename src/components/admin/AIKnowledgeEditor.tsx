import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Save, Check, Brain } from 'lucide-react';
import { PageHeader, drillStyles } from '@/components/admin/AdminDrill';

const CARD = '#1e1e1e';
const BORDER = 'rgba(255,255,255,0.07)';

export function AIKnowledgeEditor() {
  const [value, setValue] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const { data, error: err } = await supabase
        .from('ai_config' as any)
        .select('value')
        .eq('key', 'platform_knowledge')
        .maybeSingle();
      if (err) {
        setError("Impossible de charger la connaissance. La table ai_config existe-t-elle ?");
      } else {
        setValue((data as any)?.value ?? '');
      }
      setLoading(false);
    })();
  }, []);

  const save = async () => {
    setSaving(true);
    setError(null);

    const { error: upsertErr } = await supabase
      .from('ai_config' as any)
      .upsert(
        { key: 'platform_knowledge', value, updated_at: new Date().toISOString() } as any,
        { onConflict: 'key' }
      );

    if (upsertErr) {
      setError("Erreur lors de la sauvegarde : " + upsertErr.message);
    } else {
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
    setSaving(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <style>{drillStyles}</style>
      <PageHeader
        title="Connaissance IA"
        sub="Modifie le texte ci-dessous pour mettre a jour ce que l'IA sait de la plateforme. Les changements s'appliquent immediatement aux prochains emails."
      />

      <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 16, padding: 18, display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Brain size={18} color="rgba(255,255,255,0.7)" />
          </div>
          <div>
            <p style={{ color: '#fff', fontSize: 14, fontWeight: 600, margin: 0 }}>Base de connaissance plateforme</p>
            <p style={{ color: '#6b7280', fontSize: 11.5, margin: '2px 0 0' }}>
              Utilisee par l'IA pour rediger les emails clients (messagerie)
            </p>
          </div>
        </div>

        {loading ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 40 }}>
            <Loader2 size={20} color="#6b7280" className="animate-spin" />
          </div>
        ) : (
          <>
            <textarea
              value={value}
              onChange={e => setValue(e.target.value)}
              rows={28}
              style={{
                width: '100%',
                background: '#141414',
                border: `1px solid ${BORDER}`,
                borderRadius: 12,
                color: '#e5e5e5',
                fontSize: 13,
                lineHeight: 1.7,
                padding: '14px 16px',
                resize: 'vertical',
                fontFamily: 'inherit',
                boxSizing: 'border-box',
              }}
              placeholder="Decris ici tout ce que l'IA doit savoir sur Terex : fonctionnalites, flux d'achat/vente, moyens de paiement, KYC, support..."
            />

            <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
              <button
                onClick={save}
                disabled={saving}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  background: saved ? 'rgba(52,211,153,0.12)' : '#fff',
                  color: saved ? '#34d399' : '#141414',
                  border: saved ? '1px solid rgba(52,211,153,0.3)' : 'none',
                  borderRadius: 12,
                  padding: '12px 22px',
                  fontSize: 14,
                  fontWeight: 700,
                  cursor: saving ? 'default' : 'pointer',
                  opacity: saving ? 0.7 : 1,
                  transition: 'all 0.2s ease',
                }}
              >
                {saving ? (
                  <><Loader2 size={16} className="animate-spin" /> Sauvegarde...</>
                ) : saved ? (
                  <><Check size={16} /> Sauvegarde</>
                ) : (
                  <><Save size={16} /> Sauvegarder</>
                )}
              </button>

              <p style={{ color: '#6b7280', fontSize: 11.5, margin: 0 }}>
                {value.length.toLocaleString()} caracteres
              </p>
            </div>
          </>
        )}

        {error && (
          <div style={{
            background: 'rgba(239,68,68,0.08)',
            border: '1px solid rgba(239,68,68,0.2)',
            borderRadius: 10,
            padding: '10px 14px',
          }}>
            <p style={{ color: '#f87171', fontSize: 12.5, margin: 0 }}>{error}</p>
          </div>
        )}
      </div>

      <div style={{
        background: 'rgba(255,255,255,0.03)',
        border: `1px solid ${BORDER}`,
        borderRadius: 12,
        padding: '14px 16px',
      }}>
        <p style={{ color: '#6b7280', fontSize: 12, margin: 0, lineHeight: 1.65 }}>
          Ce texte est injecte dans le prompt systeme de l'IA a chaque generation d'email.
          Decris toutes les fonctionnalites, les etapes d'achat/vente, les moyens de paiement,
          le KYC, le profil, le parrainage, le support, et liste les fonctionnalites qui n'existent pas
          pour eviter que l'IA ne les invente.
        </p>
      </div>
    </div>
  );
}
