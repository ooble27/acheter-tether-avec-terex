import { useState, useEffect, useMemo } from 'react';
import { FlaskConical, Plus, Trash2, ArrowRight, RotateCcw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useTerexRates } from '@/hooks/useTerexRates';

/**
 * Labo — Paiement de factures en USDT (bêta interne)
 *
 * Prototype isolé : table `bill_payment_tests`, séparée de `orders`.
 * Ne déplace AUCUN fond réel et n'appelle AUCUNE API externe (InTouch/
 * PayDunya ne sont pas encore branchés). Sert uniquement à valider le
 * workflow (calcul du montant, étapes, UX) avant intégration réelle.
 */

const CARD = '#1e1e1e';
const BORDER = 'rgba(255,255,255,0.07)';
const INPUT_BG = '#1a1a1a';

const BILL_TYPES: Record<string, string> = {
  senelec: 'Senelec (électricité)',
  woyofal: 'Woyofal (prépayé)',
  sde: 'SDE (eau)',
  canalplus: 'Canal+',
  credit_telephone: 'Crédit téléphone',
  autre: 'Autre',
};

const STATUS_FLOW = ['draft', 'awaiting_deposit', 'deposit_confirmed', 'bill_paid'] as const;
const STATUS_LABEL: Record<string, string> = {
  draft: 'Brouillon',
  awaiting_deposit: 'En attente de dépôt USDT',
  deposit_confirmed: 'Dépôt confirmé (simulé)',
  bill_paid: 'Facture payée (simulée)',
  cancelled: 'Annulé',
};
const STATUS_COLOR: Record<string, string> = {
  draft: '#9ca3af',
  awaiting_deposit: '#f97316',
  deposit_confirmed: '#3b82f6',
  bill_paid: '#4ade80',
  cancelled: '#ef4444',
};

interface BillTest {
  id: string;
  created_at: string;
  bill_type: string;
  reference: string;
  customer_label: string | null;
  amount_cfa: number;
  spread_percentage: number;
  exchange_rate: number;
  amount_usdt: number;
  status: string;
  notes: string | null;
}

export function BillPaymentLab() {
  const { user } = useAuth();
  const { toast } = useToast();
  const { marketRateCfa } = useTerexRates(2.5);

  const [tests, setTests] = useState<BillTest[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  const [billType, setBillType] = useState('senelec');
  const [reference, setReference] = useState('');
  const [customerLabel, setCustomerLabel] = useState('');
  const [amountCfa, setAmountCfa] = useState('');
  const [spreadPct, setSpreadPct] = useState('2');

  const rate = marketRateCfa || 0;
  const computedUsdt = useMemo(() => {
    const cfa = parseFloat(amountCfa) || 0;
    const spread = parseFloat(spreadPct) || 0;
    if (!cfa || !rate) return 0;
    return Math.round(((cfa * (1 + spread / 100)) / rate) * 100) / 100;
  }, [amountCfa, spreadPct, rate]);

  const loadTests = async () => {
    setLoading(true);
    const { data, error } = await (supabase as any)
      .from('bill_payment_tests')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error) setTests((data as BillTest[]) || []);
    setLoading(false);
  };

  useEffect(() => { loadTests(); }, []);

  const handleCreate = async () => {
    if (!reference.trim() || !amountCfa || !rate) {
      toast({ title: 'Champs manquants', description: 'Référence et montant sont requis.', variant: 'destructive' });
      return;
    }
    setCreating(true);
    try {
      const { error } = await (supabase as any).from('bill_payment_tests').insert({
        bill_type: billType,
        reference: reference.trim(),
        customer_label: customerLabel.trim() || null,
        amount_cfa: parseFloat(amountCfa),
        spread_percentage: parseFloat(spreadPct) || 0,
        exchange_rate: rate,
        amount_usdt: computedUsdt,
        status: 'draft',
        created_by: user?.id || null,
      });
      if (error) throw error;
      toast({ title: 'Test créé', description: 'Le scénario a été ajouté au labo.' });
      setReference(''); setCustomerLabel(''); setAmountCfa('');
      loadTests();
    } catch (err: any) {
      toast({ title: 'Erreur', description: err?.message || 'Création impossible', variant: 'destructive' });
    }
    setCreating(false);
  };

  const advanceStatus = async (test: BillTest) => {
    const idx = STATUS_FLOW.indexOf(test.status as any);
    const next = idx >= 0 && idx < STATUS_FLOW.length - 1 ? STATUS_FLOW[idx + 1] : null;
    if (!next) return;
    const { error } = await (supabase as any)
      .from('bill_payment_tests')
      .update({ status: next, updated_at: new Date().toISOString() })
      .eq('id', test.id);
    if (error) {
      toast({ title: 'Erreur', description: 'Mise à jour impossible', variant: 'destructive' });
      return;
    }
    setTests(prev => prev.map(t => t.id === test.id ? { ...t, status: next } : t));
  };

  const resetStatus = async (test: BillTest) => {
    await (supabase as any).from('bill_payment_tests').update({ status: 'draft' }).eq('id', test.id);
    setTests(prev => prev.map(t => t.id === test.id ? { ...t, status: 'draft' } : t));
  };

  const cancelTest = async (test: BillTest) => {
    await (supabase as any).from('bill_payment_tests').update({ status: 'cancelled' }).eq('id', test.id);
    setTests(prev => prev.map(t => t.id === test.id ? { ...t, status: 'cancelled' } : t));
  };

  const deleteTest = async (test: BillTest) => {
    const { error } = await (supabase as any).from('bill_payment_tests').delete().eq('id', test.id);
    if (!error) setTests(prev => prev.filter(t => t.id !== test.id));
  };

  const inputStyle: React.CSSProperties = {
    width: '100%', background: INPUT_BG, color: '#fff', border: `1px solid ${BORDER}`,
    borderRadius: 10, padding: '10px 12px', fontSize: 13.5, outline: 'none',
  };
  const labelStyle: React.CSSProperties = {
    color: 'rgba(255,255,255,0.45)', fontSize: 11.5, fontWeight: 600,
    textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6, display: 'block',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Bandeau d'avertissement */}
      <div style={{
        display: 'flex', alignItems: 'flex-start', gap: 10, background: 'rgba(249,115,22,0.08)',
        border: '1px solid rgba(249,115,22,0.25)', borderRadius: 14, padding: '14px 16px',
      }}>
        <FlaskConical size={18} color="#f97316" style={{ flexShrink: 0, marginTop: 1 }} />
        <div>
          <p style={{ color: '#f97316', fontSize: 13, fontWeight: 700, margin: '0 0 4px' }}>Environnement de test — isolé de la production</p>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12.5, margin: 0, lineHeight: 1.6 }}>
            Cette page ne touche ni les commandes réelles ni les fonds des clients. Aucune API de paiement de facture
            (InTouch/PayDunya) n'est branchée pour l'instant — les statuts « Dépôt confirmé » et « Facture payée »
            sont avancés manuellement pour valider le workflow avant intégration.
          </p>
        </div>
      </div>

      {/* Formulaire de création */}
      <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 16, padding: 18 }}>
        <p style={{ color: '#fff', fontSize: 14, fontWeight: 700, margin: '0 0 14px' }}>Nouveau scénario de test</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12, marginBottom: 12 }}>
          <div>
            <label style={labelStyle}>Type de facture</label>
            <select value={billType} onChange={e => setBillType(e.target.value)} style={inputStyle}>
              {Object.entries(BILL_TYPES).map(([id, label]) => (
                <option key={id} value={id}>{label}</option>
              ))}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Référence (n° compteur / police / tél.)</label>
            <input value={reference} onChange={e => setReference(e.target.value)} placeholder="Ex: 123456789" style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Client (optionnel, pour le test)</label>
            <input value={customerLabel} onChange={e => setCustomerLabel(e.target.value)} placeholder="Ex: Mohamed Lo" style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Montant facture (CFA)</label>
            <input type="number" value={amountCfa} onChange={e => setAmountCfa(e.target.value)} placeholder="Ex: 15000" style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Spread Terex (%)</label>
            <input type="number" value={spreadPct} onChange={e => setSpreadPct(e.target.value)} step="0.5" style={inputStyle} />
          </div>
        </div>

        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          background: 'rgba(255,255,255,0.03)', border: `1px solid ${BORDER}`, borderRadius: 10,
          padding: '10px 14px', marginBottom: 14,
        }}>
          <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12.5 }}>
            Taux marché : {rate ? rate.toLocaleString('fr-FR') : '—'} CFA/USDT
          </span>
          <span style={{ color: '#fff', fontSize: 14, fontWeight: 700 }}>
            = {computedUsdt.toLocaleString('fr-FR')} USDT à faire déposer
          </span>
        </div>

        <button
          onClick={handleCreate}
          disabled={creating || !reference.trim() || !amountCfa}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 8, background: '#1B6EF3', color: '#fff',
            border: 'none', borderRadius: 10, padding: '10px 18px', fontSize: 13.5, fontWeight: 700,
            cursor: creating ? 'wait' : 'pointer', opacity: (!reference.trim() || !amountCfa) ? 0.4 : 1,
          }}
        >
          <Plus size={15} /> {creating ? 'Création…' : 'Créer le scénario'}
        </button>
      </div>

      {/* Liste des scénarios */}
      <div>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 10px' }}>
          Scénarios ({tests.length})
        </p>
        {loading ? (
          <p style={{ color: '#6b7280', fontSize: 13 }}>Chargement…</p>
        ) : tests.length === 0 ? (
          <p style={{ color: '#6b7280', fontSize: 13 }}>Aucun scénario pour l'instant — crée le premier ci-dessus.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {tests.map(test => {
              const isFinal = test.status === 'bill_paid' || test.status === 'cancelled';
              return (
                <div key={test.id} style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 14, padding: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, flexWrap: 'wrap' }}>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                        <span style={{ color: '#fff', fontSize: 14, fontWeight: 700 }}>{BILL_TYPES[test.bill_type] || test.bill_type}</span>
                        <span style={{
                          color: STATUS_COLOR[test.status], fontSize: 11, fontWeight: 700, padding: '3px 8px',
                          borderRadius: 999, background: `${STATUS_COLOR[test.status]}1a`, border: `1px solid ${STATUS_COLOR[test.status]}40`,
                        }}>
                          {STATUS_LABEL[test.status]}
                        </span>
                      </div>
                      <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12.5, margin: 0 }}>
                        Réf. {test.reference}{test.customer_label ? ` · ${test.customer_label}` : ''}
                      </p>
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <p style={{ color: '#fff', fontSize: 14, fontWeight: 700, margin: 0 }}>{test.amount_cfa.toLocaleString('fr-FR')} CFA</p>
                      <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 12, margin: '2px 0 0' }}>{test.amount_usdt.toLocaleString('fr-FR')} USDT (+{test.spread_percentage}%)</p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
                    {!isFinal && (
                      <button onClick={() => advanceStatus(test)} style={{
                        display: 'inline-flex', alignItems: 'center', gap: 6, background: '#2d2d2d', color: '#fff',
                        border: `1px solid ${BORDER}`, borderRadius: 8, padding: '7px 12px', fontSize: 12.5, fontWeight: 600, cursor: 'pointer',
                      }}>
                        <ArrowRight size={13} /> Étape suivante
                      </button>
                    )}
                    {test.status !== 'draft' && test.status !== 'cancelled' && (
                      <button onClick={() => resetStatus(test)} style={{
                        display: 'inline-flex', alignItems: 'center', gap: 6, background: 'transparent', color: 'rgba(255,255,255,0.5)',
                        border: `1px solid ${BORDER}`, borderRadius: 8, padding: '7px 12px', fontSize: 12.5, fontWeight: 600, cursor: 'pointer',
                      }}>
                        <RotateCcw size={13} /> Réinitialiser
                      </button>
                    )}
                    {test.status !== 'cancelled' && test.status !== 'bill_paid' && (
                      <button onClick={() => cancelTest(test)} style={{
                        background: 'transparent', color: '#ef4444', border: '1px solid rgba(239,68,68,0.3)',
                        borderRadius: 8, padding: '7px 12px', fontSize: 12.5, fontWeight: 600, cursor: 'pointer',
                      }}>
                        Annuler
                      </button>
                    )}
                    <button onClick={() => deleteTest(test)} style={{
                      display: 'inline-flex', alignItems: 'center', gap: 6, background: 'transparent', color: '#6b7280',
                      border: 'none', borderRadius: 8, padding: '7px 8px', fontSize: 12.5, fontWeight: 600, cursor: 'pointer', marginLeft: 'auto',
                    }}>
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
