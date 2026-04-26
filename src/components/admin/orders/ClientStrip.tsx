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
    <div className="bg-terex-darker/60 border-t border-terex-gray/30 px-6 py-3 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-xs">
      <div className="flex items-center gap-1.5 text-white">
        <User className="w-3.5 h-3.5 text-terex-accent" />
        <span className="font-medium">{name}</span>
      </div>
      {email && (
        <div className="flex items-center gap-1.5 text-gray-300">
          <Mail className="w-3.5 h-3.5 text-gray-500" />
          <span className="font-mono">{email}</span>
        </div>
      )}
      {phone && (
        <div className="flex items-center gap-1.5 text-gray-300">
          <Phone className="w-3.5 h-3.5 text-gray-500" />
          <span className="font-mono">{phone}</span>
        </div>
      )}
      {!email && !phone && (
        <span className="text-gray-500 italic">Aucun contact renseigné</span>
      )}
    </div>
  );
}
