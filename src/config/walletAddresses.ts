// ─────────────────────────────────────────────────────────────────────────────
// ADRESSES DE RÉCEPTION TEREX — SOURCE UNIQUE
//
// Ce sont les adresses où le client dépose ses USDT quand il VEND, par réseau.
// ⚠️ NE JAMAIS dupliquer ces adresses ailleurs : modifie-les UNIQUEMENT ici.
// Tous les écrans de vente (mobile, desktop) importent ce fichier.
// ─────────────────────────────────────────────────────────────────────────────

export const WALLET_ADDRESSES: Record<string, string> = {
  TRC20:    'TSPUk2W5bcGGNPpKzx1xTDc2NuxpRJRCBb',
  // BEP20 / ERC20 / Arbitrum / Polygon partagent la même adresse EVM.
  BEP20:    '0xe1d04ef9b4c199ba6a59460ed8bd0a486dc4fc84',
  ERC20:    '0xe1d04ef9b4c199ba6a59460ed8bd0a486dc4fc84',
  Arbitrum: '0xe1d04ef9b4c199ba6a59460ed8bd0a486dc4fc84',
  Polygon:  '0xe1d04ef9b4c199ba6a59460ed8bd0a486dc4fc84',
  Solana:   '8ES2hxsfqZVX3cjxWLBJ8jCdzSu9hTBYELSkX82UdnhN',
  Aptos:    '0x87ea7ab47d563950886a4416af58cd2060f2b20bb94fd8d522cc8d3df57afca0',
};

// Réception via Binance Pay (alternative à l'adresse blockchain).
export const TEREX_BINANCE_INFO = {
  email: 'lomohamed834@gmail.com',
  id: '450715599',
  payId: '450715599',
};
