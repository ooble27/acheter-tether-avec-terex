

## Automatisation des envois USDT via wallet privé (style MetaMask)

### Contexte

MetaMask est un wallet navigateur -- il ne peut pas fonctionner sur un serveur. **Mais** ce que MetaMask fait en coulisses (signer des transactions avec une clé privée), on peut le reproduire dans une Edge Function Supabase.

Le principe : tu exportes ta clé privée depuis MetaMask, tu la stockes comme secret Supabase, et l'Edge Function signe et envoie les USDT automatiquement sans aucune intervention humaine.

### Architecture

```text
Client paie (Orange Money/Wave)
        ↓
NabooPay confirme le paiement (webhook)
        ↓
Edge Function "naboopay-webhook" (existante, à modifier)
        ↓
Appelle Edge Function "send-usdt" (nouvelle)
        ↓
Sign transaction avec clé privée (ethers.js / tronweb)
        ↓
Broadcast sur la blockchain
        ↓
USDT reçus par le client ✅
```

### Réseaux supportés

| Réseau | SDK | Contrat USDT |
|--------|-----|-------------|
| TRC20 (Tron) | TronWeb | TR7NHqjeK... |
| BEP20 (BSC) | ethers.js | 0x55d398... |
| ERC20 (Ethereum) | ethers.js | 0xdAC17F... |
| Polygon | ethers.js | 0xc2132D... |

Solana et Aptos nécessitent des SDKs différents -- on peut les ajouter plus tard.

### Ce qui sera créé/modifié

1. **`supabase/functions/send-usdt/index.ts`** (nouvelle Edge Function)
   - Reçoit un `orderId`
   - Récupère la commande (montant USDT, adresse wallet, réseau)
   - Selon le réseau, utilise ethers.js (EVM) ou TronWeb (TRC20) pour signer et envoyer la transaction USDT
   - Met à jour le statut de la commande à `completed`
   - Envoie un email de confirmation

2. **`supabase/functions/naboopay-webhook/index.ts`** (modifier l'existant)
   - Après confirmation du paiement, appeler automatiquement `send-usdt`

3. **`src/components/admin/ManualTransfersAdmin.tsx`** (modifier)
   - Ajouter un bouton "Envoyer USDT" comme fallback manuel

4. **`supabase/config.toml`** (modifier)
   - Ajouter `[functions.send-usdt]` avec `verify_jwt = false`

### Secrets requis (à ajouter dans Supabase)

| Secret | Description |
|--------|-------------|
| `EVM_PRIVATE_KEY` | Clé privée exportée depuis MetaMask (pour BSC, ETH, Polygon) |
| `TRON_PRIVATE_KEY` | Clé privée du wallet Tron (pour TRC20) |

### Ce que tu dois faire avant l'implémentation

1. **Ouvre MetaMask** → Paramètres → Sécurité → **Exporter la clé privée**
2. **Crée un wallet Tron** (via TronLink) si tu veux supporter TRC20
3. **Charge tes wallets en USDT** (c'est depuis ces wallets que les USDT seront envoyés aux clients)
4. Reviens me dire quand tes clés privées sont prêtes, je les ajouterai comme secrets Supabase et j'implémenterai tout

### Avantages vs Binance API
- Pas de problème d'IP à whitelister
- Pas de limite de 90 jours sur les clés
- Contrôle total sur tes fonds
- Frais de réseau uniquement (pas de frais Binance)

