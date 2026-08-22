# Terex Videos

Videos marketing pour Terex, construites avec [Remotion](https://www.remotion.dev/).

## Compositions disponibles

- `BuyUsdtTutorial` — Tutoriel vertical (1080x1920, 33s) : les 6 etapes pour acheter des USDT sur Terex.

## Preview

```bash
cd videos/terex-videos
npx remotion studio --no-open
```

## Render

```bash
npx remotion render BuyUsdtTutorial out/buy-usdt.mp4 \
  --browser-executable=/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell
```

## Design

- Palette : tokens dans `src/design/tokens.ts` (aligne sur le design system Terex)
- Font : Poppins (bundlee localement via `@fontsource/poppins`)
- Cadre iPhone reutilisable : `src/design/PhoneFrame.tsx`

## Structure

- `src/design/` — tokens, fond, cadre iPhone, logo
- `src/tutorials/buy-usdt/` — scenes du tutoriel achat USDT
  - `BuyUsdtTutorial.tsx` — composition principale
  - `IntroScene.tsx`, `HookScene.tsx`, `OutroScene.tsx`
  - `StepScene.tsx` — layout parametrable pour chaque etape
  - `screens.tsx` — les 6 ecrans du telephone
