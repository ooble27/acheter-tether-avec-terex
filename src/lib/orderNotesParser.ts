/**
 * Parse les notes JSON d'une commande en sections lisibles.
 * Les notes sont stockées en JSON brut depuis les formulaires d'achat/vente.
 */

export interface ParsedNoteField {
  label: string;
  value: string;
  highlight?: boolean;
  copyable?: boolean;
}

export interface ParsedNotes {
  raw: string;
  isJson: boolean;
  sections: {
    title: string;
    fields: ParsedNoteField[];
  }[];
}

const PROVIDER_LABELS: Record<string, string> = {
  wave: 'Wave',
  orange: 'Orange Money',
  orange_money: 'Orange Money',
  mobile: 'Mobile Money',
  card: 'Carte bancaire',
  bank: 'Virement bancaire',
  bank_transfer: 'Virement bancaire',
  interac: 'Interac',
};

const formatProvider = (key?: string) =>
  key ? PROVIDER_LABELS[key] || key : 'Non spécifié';

export function parseOrderNotes(notes?: string | null): ParsedNotes {
  if (!notes) {
    return { raw: '', isJson: false, sections: [] };
  }

  const raw = String(notes);
  let parsed: any = null;

  try {
    parsed = JSON.parse(raw);
  } catch {
    return {
      raw,
      isJson: false,
      sections: [
        {
          title: 'Note',
          fields: [{ label: 'Contenu', value: raw }],
        },
      ],
    };
  }

  if (!parsed || typeof parsed !== 'object') {
    return { raw, isJson: false, sections: [] };
  }

  const sections: ParsedNotes['sections'] = [];

  // Section: Méthode de réception (achat/vente avec mobile money)
  const paymentFields: ParsedNoteField[] = [];
  if (parsed.provider) {
    paymentFields.push({
      label: 'Service',
      value: formatProvider(parsed.provider),
      highlight: true,
    });
  }
  if (parsed.paymentMethod && parsed.paymentMethod !== parsed.provider) {
    paymentFields.push({
      label: 'Type',
      value: formatProvider(parsed.paymentMethod),
    });
  }
  if (parsed.phoneNumber) {
    paymentFields.push({
      label: 'Numéro mobile',
      value: parsed.phoneNumber,
      highlight: true,
      copyable: true,
    });
  }
  if (parsed.mobilePayment !== undefined && !parsed.provider) {
    paymentFields.push({
      label: 'Mobile Money',
      value: parsed.mobilePayment ? 'Oui' : 'Non',
    });
  }
  if (paymentFields.length > 0) {
    sections.push({ title: 'Service de paiement', fields: paymentFields });
  }

  // Section: Destination (cas achat USDT)
  const destFields: ParsedNoteField[] = [];
  if (parsed.destination) {
    const destLabel =
      parsed.destination === 'binance'
        ? 'Compte Binance'
        : parsed.destination === 'wallet'
        ? 'Wallet personnel'
        : parsed.destination;
    destFields.push({
      label: 'Destination',
      value: destLabel,
      highlight: true,
    });
  }
  if (parsed.useBinancePay !== undefined && parsed.useBinancePay) {
    destFields.push({ label: 'Binance Pay', value: 'Activé' });
  }
  if (destFields.length > 0) {
    sections.push({ title: 'Destination', fields: destFields });
  }

  // Section: Données Binance
  if (parsed.binanceData && typeof parsed.binanceData === 'object') {
    const binFields: ParsedNoteField[] = [];
    const b = parsed.binanceData;
    if (b.email) binFields.push({ label: 'Email Binance', value: b.email, copyable: true });
    if (b.username) binFields.push({ label: 'Username', value: b.username, copyable: true });
    if (b.binanceId)
      binFields.push({ label: 'ID Binance', value: b.binanceId, highlight: true, copyable: true });
    if (binFields.length > 0) {
      sections.push({ title: 'Compte Binance du client', fields: binFields });
    }
  }

  // Champs restants (catch-all) — uniquement strings/numbers simples non déjà traités
  const handledKeys = new Set([
    'provider',
    'paymentMethod',
    'phoneNumber',
    'mobilePayment',
    'destination',
    'useBinancePay',
    'binanceData',
  ]);
  const otherFields: ParsedNoteField[] = [];
  for (const [key, value] of Object.entries(parsed)) {
    if (handledKeys.has(key)) continue;
    if (value === null || value === undefined || value === '') continue;
    if (typeof value === 'object') continue;
    otherFields.push({
      label: humanizeKey(key),
      value: String(value),
    });
  }
  if (otherFields.length > 0) {
    sections.push({ title: 'Informations complémentaires', fields: otherFields });
  }

  return { raw, isJson: true, sections };
}

function humanizeKey(key: string): string {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/[_-]/g, ' ')
    .replace(/^./, (c) => c.toUpperCase())
    .trim();
}
