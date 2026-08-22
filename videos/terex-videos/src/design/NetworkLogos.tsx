import React from "react";
import { staticFile, CanvasImage } from "remotion";

/**
 * Logos réseau — vrais PNGs officiels (source: TrustWallet + cryptocurrency-icons)
 * chargés depuis `public/networks/`. Chaque logo est enroulé dans un cercle
 * transparent pour reproduire le rendu Terex (h-7 w-7 rounded-full).
 */

type Props = { size?: number };

const LOGO_FILE: Record<string, string> = {
  TRC20: "networks/trx.png",
  BEP20: "networks/bnb.png",
  ERC20: "networks/eth.png",
  Polygon: "networks/matic.png",
  Solana: "networks/sol.png",
  Aptos: "networks/apt.png",
  BINANCE: "networks/binance.png",
};

const Logo: React.FC<Props & { file: string }> = ({ size = 28, file }) => (
  <CanvasImage
    src={staticFile(file)}
    style={{
      width: size,
      height: size,
      borderRadius: "50%",
      flexShrink: 0,
      display: "block",
    }}
  />
);

export const TronLogo: React.FC<Props> = (p) => <Logo {...p} file="networks/trx.png" />;
export const BnbLogo: React.FC<Props> = (p) => <Logo {...p} file="networks/bnb.png" />;
export const EthLogo: React.FC<Props> = (p) => <Logo {...p} file="networks/eth.png" />;
export const PolygonLogo: React.FC<Props> = (p) => <Logo {...p} file="networks/matic.png" />;
export const SolanaLogo: React.FC<Props> = (p) => <Logo {...p} file="networks/sol.png" />;
export const AptosLogo: React.FC<Props> = (p) => <Logo {...p} file="networks/apt.png" />;
export const BinanceLogo: React.FC<Props> = (p) => <Logo {...p} file="networks/binance.png" />;

export const NETWORK_LOGO_MAP: Record<string, React.FC<Props>> = {
  TRC20: TronLogo,
  BEP20: BnbLogo,
  ERC20: EthLogo,
  Polygon: PolygonLogo,
  Solana: SolanaLogo,
  Aptos: AptosLogo,
  BINANCE: BinanceLogo,
};

export const USDT_LOGO_FILE = "networks/usdt.png";
