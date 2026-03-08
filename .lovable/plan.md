

## Clarification : MetaMask multi-chaînes et frais de gas

### MetaMask supporte bien plusieurs réseaux

Tu as raison. MetaMask a évolué et supporte maintenant plusieurs réseaux, y compris certains non-EVM comme Solana et Tron (via les "Snaps" ou le support natif récent). **Mais** pour l'automatisation serveur, ce qui compte c'est la **clé privée**, pas l'interface MetaMask.

Voici ce que ta clé privée MetaMask peut faire côté serveur :

| Réseau | Compatible avec ta clé privée EVM ? | Gas token requis |
|--------|-------------------------------------|-----------------|
| BNB Chain (BEP20) | Oui | BNB |
| Polygon | Oui | MATIC (POL) |
| Ethereum (ERC20) | Oui (mais cher) | ETH |
| Arbitrum | Oui | ETH |
| Base | Oui | ETH |
| OP Mainnet | Oui | ETH |
| **Tron (TRC20)** | Non -- clé privée différente | TRX |
| **Solana** | Non -- clé privée différente | SOL |
| **Bitcoin** | Non -- clé privée différente | BTC |

**Bonne nouvelle** : ta seule clé privée MetaMask fonctionne sur TOUS les réseaux EVM (BNB Chain, Polygon, Arbitrum, Base, OP, Ethereum). Même adresse, même clé.

### Oui, les frais de gas sont obligatoires

Pour chaque envoi de USDT, tu dois payer des frais de gas dans le token natif du réseau :

| Réseau | Gas token | Coût moyen par envoi USDT | À garder en réserve |
|--------|-----------|--------------------------|-------------------|
| BNB Chain | **BNB** | ~0.05-0.15$ | ~10$ de BNB |
| Polygon | **MATIC/POL** | ~0.01-0.05$ | ~5$ de MATIC |

Tu dois donc avoir :
- Des **USDT** sur chaque réseau (pour envoyer aux clients)
- Du **BNB** sur BNB Chain (pour payer le gas)
- Du **MATIC** sur Polygon (pour payer le gas)

### Plan d'implémentation mis à jour

Vu que ta clé privée MetaMask supporte tous les réseaux EVM, on peut supporter plus que juste BEP20 et Polygon. Voici ce que je propose :

**Phase 1 (immédiat) :**
- BNB Chain (BEP20) -- populaire, frais bas
- Polygon -- très populaire, frais très bas

**Phase 1.5 (facile à ajouter, même clé privée) :**
- Arbitrum -- frais bas (~0.10$)
- Base -- frais bas (~0.05$)

**Phase 2 (nécessite wallet séparé) :**
- TRC20 (Tron) -- clé privée Tron séparée
- Solana -- clé privée Solana séparée

### Ce qui sera implémenté

1. **`supabase/functions/send-usdt/index.ts`** -- Edge Function qui :
   - Prend la clé privée EVM depuis les secrets Supabase
   - Détecte le réseau choisi par le client
   - Connecte au bon RPC (BSC ou Polygon)
   - Signe et envoie la transaction USDT
   - Vérifie le solde USDT et gas avant d'envoyer
   - Alerte l'admin si le solde gas ou USDT est bas

2. **Modification du webhook NabooPay** pour déclencher l'envoi automatique

3. **Mise à jour du `NetworkSelector`** pour retirer les réseaux non supportés (Solana, Aptos, ERC20) en Phase 1

4. **Ajout d'un check de solde** dans l'admin pour voir combien de BNB/MATIC/USDT reste sur le wallet

### Secrets requis

| Secret | Valeur |
|--------|--------|
| `EVM_PRIVATE_KEY` | Ta clé privée exportée depuis MetaMask |

Un seul secret suffit pour tous les réseaux EVM.

### Prochaine étape

Tu exportes ta clé privée MetaMask, tu achètes un peu de BNB et MATIC pour le gas, et on lance l'implémentation.

