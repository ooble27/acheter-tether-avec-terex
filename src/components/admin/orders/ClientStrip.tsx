import { User, Mail, Phone } from 'lucide-react';
import type { ClientInfo } from '@/hooks/useClientInfos';

interface ClientStripProps {
  client?: ClientInfo;
}

/**
 * Bande compacte affichée sur chaque carte de commande admin
 * pour montrer le client en un coup d'œil (nom + email + téléphone).
 */
export function ClientStrip({ client }: ClientStripProps) {
  const name = client?.full_name?.trim() || 'Client sans nom';
  const email = client?.email;
  const phone = client?.phone;

  return (
    <div
      style={{
        background: 'rgba(255,255,255,0.03)',
        borderTop: '1px solid rgba(255,255,255,0.07)',
        padding: '12px 20px',
      }}
      className="flex flex-wrap items-center gap-x-5 gap-y-1.5 text-xs"
    >
      <div className="flex items-center gap-1.5" style={{ color: '#fff' }}>
        <User className="w-3.5 h-3.5" style={{ color: 'rgba(255,255,255,0.55)' }} />
        <span className="font-medium">{name}</span>
      </div>
      {email && (
        <div className="flex items-center gap-1.5" style={{ color: '#9ca3af' }}>
          <Mail className="w-3.5 h-3.5" style={{ color: '#6b7280' }} />
          <span className="font-mono">{email}</span>
        </div>
      )}
      {phone && (
        <div className="flex items-center gap-1.5" style={{ color: '#9ca3af' }}>
          <Phone className="w-3.5 h-3.5" style={{ color: '#6b7280' }} />
          <span className="font-mono">{phone}</span>
        </div>
      )}
      {!email && !phone && (
        <span className="italic" style={{ color: '#6b7280' }}>Aucun contact renseigné</span>
      )}
    </div>
  );
}
