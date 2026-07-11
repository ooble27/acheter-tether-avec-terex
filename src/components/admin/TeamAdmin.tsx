import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Users, UserPlus, Trash2, RefreshCw, Loader2, Shield, Inbox, FileCheck, Mail, UserCheck, Headphones } from 'lucide-react';
import { PageHeader, Avatar, DrillPage, drillStyles } from '@/components/admin/AdminDrill';

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
  const [view, setView] = useState<null | 'add' | 'members'>(null);

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

  const addSection = (
    <>
      {/* Ajouter un membre */}
      <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 16, padding: 18 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
          <UserPlus size={16} color="rgba(255,255,255,0.7)" />
          <p style={{ color: '#fff', fontSize: 14, fontWeight: 700, margin: 0 }}>Ajouter un membre à l'équipe</p>
        </div>
        <p style={{ color: '#6b7280', fontSize: 12.5, margin: '0 0 14px' }}>
          La personne crée d'abord son compte Terex normalement (inscription classique), puis vous lui attribuez son rôle ici avec son email.
        </p>

        {/* Choix du rôle — pilules de sélection à taille FIXE (aucun décalage au clic :
            pas d'icône de validation ajoutée, graisse de police constante). */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 10 }}>
          {ROLES.map(({ id, label, Icon }) => {
            const sel = role === id;
            return (
              <button key={id} onClick={() => setRole(id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 9, padding: '9px 16px 9px 10px',
                  borderRadius: 100, cursor: 'pointer', outline: 'none', transition: 'background 0.15s, border-color 0.15s, color 0.15s',
                  border: `1px solid ${sel ? 'rgba(255,255,255,0.40)' : 'rgba(255,255,255,0.18)'}`,
                  background: sel ? 'rgba(255,255,255,0.16)' : 'rgba(255,255,255,0.08)',
                  WebkitTapHighlightColor: 'transparent',
                }}>
                <span style={{ width: 26, height: 26, borderRadius: '50%', background: ICON_BG, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon size={13} color={sel ? '#fff' : 'rgba(255,255,255,0.55)'} />
                </span>
                <span style={{ color: sel ? '#fff' : 'rgba(255,255,255,0.55)', fontSize: 13, fontWeight: 500 }}>{label}</span>
              </button>
            );
          })}
        </div>
        {/* Description du rôle sélectionné */}
        <p style={{ color: '#6b7280', fontSize: 12, margin: '0 0 14px 4px' }}>
          {roleMeta(role).label} — {roleMeta(role).desc}
        </p>

        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <input value={email} onChange={e => setEmail(e.target.value)} placeholder="email du compte existant…"
            type="email"
            style={{ flex: 1, minWidth: 220, background: INPUT_BG, border: `1px solid ${BORDER}`, borderRadius: 12, padding: '11px 14px', color: '#fff', fontSize: 14, outline: 'none' }} />
          <button onClick={addMember} disabled={adding || !email}
            style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: '#fff', color: '#141414', border: 'none', borderRadius: 12, padding: '11px 18px', fontSize: 13.5, fontWeight: 700, cursor: 'pointer', opacity: adding || !email ? 0.6 : 1, whiteSpace: 'nowrap' }}>
            {adding ? <Loader2 size={15} className="animate-spin" /> : <UserPlus size={15} />}
            Attribuer le rôle
          </button>
        </div>
      </div>

    </>
  );

  // Rôle affiché en texte neutre (design système monochrome) — l'admin
  // ressort en blanc, les autres rôles en gris ; aucune couleur vive.
  const RoleTag = ({ roleId }: { roleId: string }) => {
    const meta = roleMeta(roleId);
    const isAdminRole = roleId === 'admin';
    return (
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, whiteSpace: 'nowrap' }}>
        <meta.Icon size={13} color={isAdminRole ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.45)'} />
        <span style={{ color: isAdminRole ? '#fff' : '#9ca3af', fontSize: 12.5, fontWeight: 600 }}>{meta.label}</span>
      </span>
    );
  };

  const membersSection = (
    <div className="crm-table crm-fade">
      <div className="crm-thead cols-team">
        <span className="crm-th">Membre</span>
        <span className="crm-th">Rôle</span>
        <span className="crm-th">Depuis</span>
        <span className="crm-th" />
      </div>
      {loading ? (
        <p style={{ color: '#6b7280', fontSize: 13, padding: '20px 18px', margin: 0 }}>Chargement…</p>
      ) : members.length === 0 ? (
        <div style={{ padding: '40px 20px', textAlign: 'center' }}>
          <Users size={24} color="#4b5563" style={{ margin: '0 auto 10px' }} />
          <p style={{ color: '#6b7280', fontSize: 13, margin: 0 }}>Aucun membre pour le moment.</p>
        </div>
      ) : (
        members.map((m) => (
          <div key={m.roleRowId} className="crm-row cols-team">
            {/* Membre */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
              <Avatar name={m.name || m.email} size={32} />
              <div style={{ minWidth: 0 }}>
                <p style={{ color: '#fff', fontSize: 13.5, fontWeight: 600, margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{m.name || 'Sans nom'}</p>
                <p style={{ color: '#6b7280', fontSize: 12, margin: '1px 0 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{m.email}</p>
                <span className="only-m" style={{ marginTop: 4, display: 'inline-flex' }}>
                  <RoleTag roleId={m.role} />
                </span>
              </div>
            </div>
            {/* Rôle (desktop) */}
            <div className="only-d" style={{ minWidth: 0 }}>
              <RoleTag roleId={m.role} />
            </div>
            {/* Depuis (desktop) */}
            <div className="only-d" style={{ minWidth: 0 }}>
              <span style={{ color: '#6b7280', fontSize: 12, whiteSpace: 'nowrap' }}>
                {new Date(m.since).toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' })}
              </span>
            </div>
            {/* Retirer */}
            <button onClick={() => setToRemove(m)} aria-label="Retirer le rôle"
              style={{ width: 32, height: 32, borderRadius: 9, background: 'transparent', border: `1px solid ${BORDER}`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0, justifySelf: 'end' }}>
              <Trash2 size={13} color="#c98686" />
            </button>
          </div>
        ))
      )}
    </div>
  );

  const confirmDialog = (
    <>
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
    </>
  );

  // ── Sous-page : ajouter un membre ───────────────────────────────────────────
  if (view === 'add') {
    return (
      <>
        <style>{drillStyles}</style>
        <DrillPage title="Ajouter un membre" sub="Attribuer un rôle à un compte Terex existant" onBack={() => setView(null)}>
          {addSection}
        </DrillPage>
      </>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <style>{drillStyles}</style>

      <PageHeader
        title="Équipe"
        sub={`${members.length} rôle(s) attribué(s)`}
        right={
          <>
            <button className="ghost-btn" onClick={load} disabled={loading}>
              <RefreshCw size={13} className={loading ? 'animate-spin' : ''} /> Actualiser
            </button>
            <button onClick={() => setView('add')}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: '#fff', color: '#141414', border: 'none', borderRadius: 10, padding: '8px 14px', fontSize: 13, fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap' }}>
              <UserPlus size={14} /> Ajouter un membre
            </button>
          </>
        }
      />

      {membersSection}
      {confirmDialog}
    </div>
  );
}
