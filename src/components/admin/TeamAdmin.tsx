import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Users, UserPlus, Trash2, RefreshCw, Loader2, Shield, Inbox, FileCheck, Mail, UserCheck, Headphones } from 'lucide-react';

const CARD = '#1e1e1e';
const BORDER = 'rgba(255,255,255,0.07)';
const ICON_BG = 'rgba(255,255,255,0.06)';
const INPUT_BG = 'rgba(255,255,255,0.04)';

// Rôles métier — ce que chacun voit dans le back-office
const ROLES: { id: string; label: string; desc: string; Icon: any }[] = [
  { id: 'operator',     label: 'Opérateur',   desc: "Traite les commandes : achats, ventes, virements. Rien d'autre.", Icon: Inbox },
  { id: 'kyc_reviewer', label: 'KYC',         desc: "Vérifications d'identité uniquement.", Icon: FileCheck },
  { id: 'marketing',    label: 'Marketing',   desc: 'Campagnes email aux clients.', Icon: Mail },
  { id: 'hr',           label: 'RH',          desc: 'Candidatures et recrutement.', Icon: UserCheck },
  { id: 'support',      label: 'Support',     desc: 'Assistance clients.', Icon: Headphones },
  { id: 'admin',        label: 'Admin complet', desc: 'TOUT : opérations, finance, campagnes, équipe. À réserver.', Icon: Shield },
];

const roleMeta = (id: string) => ROLES.find(r => r.id === id) || { id, label: id, desc: '', Icon: Shield };

// Supabase masque la vraie erreur derrière « non-2xx status code » —
// on lit le corps de la réponse pour afficher la raison réelle.
async function realError(e: any): Promise<string> {
  try {
    const body = await e?.context?.json?.();
    if (body?.error) return body.error;
  } catch { /* corps illisible */ }
  return e?.message || 'Erreur inconnue';
}

interface Member {
  roleRowId: string;
  userId: string;
  role: string;
  name: string;
  email: string;
  since: string;
}

export function TeamAdmin() {
  const { toast } = useToast();
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('operator');
  const [adding, setAdding] = useState(false);
  const [toRemove, setToRemove] = useState<Member | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('manage-team', { body: { action: 'list' } });
      if (error) throw new Error(await realError(error));
      if (!data?.success) throw new Error(data?.error || 'Chargement impossible');
      setMembers(data.members || []);
    } catch (e: any) {
      toast({ title: 'Erreur', description: e.message || "Impossible de charger l'équipe", variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { load(); }, []);

  const addMember = async () => {
    if (!email.includes('@')) { toast({ title: 'Email invalide', variant: 'destructive' }); return; }
    setAdding(true);
    try {
      const { data, error } = await supabase.functions.invoke('manage-team', { body: { action: 'add', email, role } });
      if (error) throw new Error(await realError(error));
      if (!data?.success) throw new Error(data?.error || 'Ajout impossible');
      toast({ title: 'Membre ajouté', description: data.message });
      setEmail('');
      load();
    } catch (e: any) {
      toast({ title: 'Impossible', description: e.message, variant: 'destructive' });
    } finally {
      setAdding(false);
    }
  };

  const removeRole = async () => {
    if (!toRemove) return;
    try {
      const { data, error } = await supabase.functions.invoke('manage-team', {
        body: { action: 'remove', userId: toRemove.userId, role: toRemove.role },
      });
      if (error) throw new Error(await realError(error));
      if (!data?.success) throw new Error(data?.error || 'Retrait impossible');
      toast({ title: 'Rôle retiré', description: `${toRemove.email} n'a plus le rôle ${roleMeta(toRemove.role).label}.` });
      load();
    } catch (e: any) {
      toast({ title: 'Impossible', description: e.message, variant: 'destructive' });
    } finally {
      setToRemove(null);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* Ajouter un membre */}
      <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 16, padding: 18 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
          <UserPlus size={16} color="rgba(255,255,255,0.7)" />
          <p style={{ color: '#fff', fontSize: 14, fontWeight: 700, margin: 0 }}>Ajouter un membre à l'équipe</p>
        </div>
        <p style={{ color: '#6b7280', fontSize: 12.5, margin: '0 0 14px' }}>
          La personne crée d'abord son compte Terex normalement (inscription classique), puis vous lui attribuez son rôle ici avec son email.
        </p>

        {/* Choix du rôle */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: 8, marginBottom: 14 }}>
          {ROLES.map(({ id, label, desc, Icon }) => (
            <button key={id} onClick={() => setRole(id)}
              style={{
                display: 'flex', gap: 10, alignItems: 'flex-start', textAlign: 'left', padding: '12px',
                borderRadius: 12, cursor: 'pointer',
                background: role === id ? 'rgba(255,255,255,0.08)' : INPUT_BG,
                border: `1px solid ${role === id ? 'rgba(255,255,255,0.25)' : BORDER}`,
              }}>
              <div style={{ width: 30, height: 30, borderRadius: 9, background: ICON_BG, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon size={14} color={role === id ? '#fff' : 'rgba(255,255,255,0.55)'} />
              </div>
              <div>
                <p style={{ color: '#fff', fontSize: 13, fontWeight: 600, margin: '0 0 2px' }}>{label}</p>
                <p style={{ color: '#6b7280', fontSize: 11, margin: 0, lineHeight: 1.45 }}>{desc}</p>
              </div>
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <input value={email} onChange={e => setEmail(e.target.value)} placeholder="email du compte existant…"
            type="email"
            style={{ flex: 1, minWidth: 220, background: INPUT_BG, border: `1px solid ${BORDER}`, borderRadius: 12, padding: '11px 14px', color: '#fff', fontSize: 14, outline: 'none' }} />
          <button onClick={addMember} disabled={adding || !email}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#fff', color: '#141414', border: 'none', borderRadius: 12, padding: '11px 18px', fontSize: 13.5, fontWeight: 700, cursor: 'pointer', opacity: adding || !email ? 0.6 : 1 }}>
            {adding ? <Loader2 size={15} className="animate-spin" /> : <UserPlus size={15} />}
            Attribuer le rôle {roleMeta(role).label}
          </button>
        </div>
      </div>

      {/* Membres actuels */}
      <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 16, overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 18px', borderBottom: `1px solid ${BORDER}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Users size={16} color="rgba(255,255,255,0.7)" />
            <p style={{ color: '#fff', fontSize: 14, fontWeight: 700, margin: 0 }}>Membres de l'équipe</p>
            <span style={{ color: '#6b7280', fontSize: 12 }}>{members.length} rôle(s) attribué(s)</span>
          </div>
          <button onClick={load} disabled={loading}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: '#2d2d2d', color: '#fff', border: `1px solid ${BORDER}`, borderRadius: 10, padding: '8px 12px', fontSize: 12.5, fontWeight: 600, cursor: 'pointer' }}>
            <RefreshCw size={12} className={loading ? 'animate-spin' : ''} /> Actualiser
          </button>
        </div>

        {loading ? (
          <p style={{ color: '#6b7280', fontSize: 13, padding: '20px 18px', margin: 0 }}>Chargement…</p>
        ) : members.length === 0 ? (
          <p style={{ color: '#6b7280', fontSize: 13, padding: '20px 18px', margin: 0 }}>Aucun membre pour le moment.</p>
        ) : (
          members.map((m, i) => {
            const meta = roleMeta(m.role);
            return (
              <div key={m.roleRowId} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '13px 18px', borderBottom: i < members.length - 1 ? `1px solid ${BORDER}` : 'none', flexWrap: 'wrap' }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#2d2d2d', border: `1px solid rgba(255,255,255,0.1)`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 13, fontWeight: 700, flexShrink: 0 }}>
                  {(m.name || m.email || '?').slice(0, 1).toUpperCase()}
                </div>
                <div style={{ flex: 1, minWidth: 160 }}>
                  <p style={{ color: '#fff', fontSize: 14, fontWeight: 600, margin: 0 }}>{m.name || 'Sans nom'}</p>
                  <p style={{ color: '#6b7280', fontSize: 12, margin: 0 }}>{m.email}</p>
                </div>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 11.5, fontWeight: 600, color: m.role === 'admin' ? '#fff' : '#9ca3af', background: m.role === 'admin' ? 'rgba(255,255,255,0.1)' : ICON_BG, border: `1px solid ${BORDER}`, borderRadius: 999, padding: '5px 12px', flexShrink: 0 }}>
                  <meta.Icon size={12} /> {meta.label}
                </span>
                <span style={{ color: '#4b5563', fontSize: 11, flexShrink: 0 }}>
                  depuis {new Date(m.since).toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' })}
                </span>
                <button onClick={() => setToRemove(m)} aria-label="Retirer le rôle"
                  style={{ width: 34, height: 34, borderRadius: 10, background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
                  <Trash2 size={14} color="#ef4444" />
                </button>
              </div>
            );
          })
        )}
      </div>

      {/* Confirmation de retrait */}
      <AlertDialog open={!!toRemove} onOpenChange={(o) => { if (!o) setToRemove(null); }}>
        <AlertDialogContent className="bg-[#1e1e1e] border-[rgba(255,255,255,0.07)]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Retirer ce rôle ?</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              {toRemove ? `${toRemove.email} perdra immédiatement l'accès « ${roleMeta(toRemove.role).label} » du back-office. Son compte client reste intact.` : ''}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-[#2d2d2d] border-[rgba(255,255,255,0.07)] text-white hover:bg-[#2d2d2d]">Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={removeRole} className="bg-red-600 hover:bg-red-700 text-white">Retirer le rôle</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
