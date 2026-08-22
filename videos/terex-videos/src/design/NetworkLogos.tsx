import React from "react";

/**
 * Petits logos SVG des reseaux blockchain — utilises dans les pastilles
 * de choix de reseau. Chaque logo tient dans un cercle 28x28.
 */

type Props = { size?: number };

const Circle: React.FC<React.PropsWithChildren<{ bg: string; size: number }>> = ({ bg, size, children }) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: "50%",
      background: bg,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
      color: "#fff",
      fontWeight: 800,
      fontSize: size * 0.4,
    }}
  >
    {children}
  </div>
);

export const TronLogo: React.FC<Props> = ({ size = 28 }) => (
  <Circle bg="#EF0027" size={size}>
    <svg width={size * 0.62} height={size * 0.62} viewBox="0 0 24 24" fill="#fff">
      <path d="M20 4L3 8l7 12 10-16zM7 9l9-2-6 9-3-7z" />
    </svg>
  </Circle>
);

export const BnbLogo: React.FC<Props> = ({ size = 28 }) => (
  <Circle bg="#F3BA2F" size={size}>
    <svg width={size * 0.6} height={size * 0.6} viewBox="0 0 24 24" fill="#000">
      <path d="M12 2l2.7 2.7L12 7.4 9.3 4.7 12 2zm-7 7L7.7 6.3 10.4 9 7.7 11.7 5 9zm14 0l2.7 2.7-2.7 2.7L16.3 9 19 6.3zM12 10.6l1.4 1.4L12 13.4 10.6 12 12 10.6zm0 6l-2.7-2.7L12 11.2l2.7 2.7L12 16.6z" />
    </svg>
  </Circle>
);

export const EthLogo: React.FC<Props> = ({ size = 28 }) => (
  <Circle bg="#627EEA" size={size}>
    <svg width={size * 0.55} height={size * 0.55} viewBox="0 0 24 24" fill="#fff">
      <path d="M12 2v7.7l6 2.7L12 2z" opacity="0.6" />
      <path d="M12 2L6 12.4l6-2.7V2z" />
      <path d="M12 16.5v5.5l6-8.6-6 3.1z" opacity="0.6" />
      <path d="M12 22v-5.5L6 13.4 12 22z" />
      <path d="M12 15.4l6-3-6-2.7v5.7z" opacity="0.2" />
      <path d="M6 12.4l6 3v-5.7l-6 2.7z" opacity="0.6" />
    </svg>
  </Circle>
);

export const PolygonLogo: React.FC<Props> = ({ size = 28 }) => (
  <Circle bg="#8247E5" size={size}>
    <svg width={size * 0.6} height={size * 0.6} viewBox="0 0 24 24" fill="#fff">
      <path d="M16.5 8l-4-2.3L8.5 8v4.6l-3-1.8V6.5L11 3.7 16.5 6.9V8zm-5 3.5v-2l1-.6 1 .6v2l-1 .6-1-.6zm4-1.5v4.1l-5.5 3.2L4.5 14v-3.4l3-1.7V13l3 1.8 3-1.8v-3l2-1z" />
    </svg>
  </Circle>
);

export const SolanaLogo: React.FC<Props> = ({ size = 28 }) => (
  <Circle bg="#000" size={size}>
    <svg width={size * 0.65} height={size * 0.65} viewBox="0 0 24 24">
      <defs>
        <linearGradient id="sol1" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#9945FF" />
          <stop offset="1" stopColor="#14F195" />
        </linearGradient>
      </defs>
      <path fill="url(#sol1)" d="M5 8h11l3-3H8L5 8zm0 8h11l3-3H8l-3 3zm14-11l-3 3H5l3-3h11z" />
    </svg>
  </Circle>
);

export const AptosLogo: React.FC<Props> = ({ size = 28 }) => (
  <Circle bg="#000" size={size}>
    <svg width={size * 0.65} height={size * 0.65} viewBox="0 0 24 24" fill="#fff">
      <circle cx="12" cy="12" r="9" fill="#fff" />
      <path d="M6 12h4l1-1.5L12 12h6" stroke="#000" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <path d="M7 8h3l1-1.5L12 8h5" stroke="#000" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <path d="M8 16h3l1-1.5L13 16h4" stroke="#000" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    </svg>
  </Circle>
);

export const BinanceLogo: React.FC<Props> = ({ size = 28 }) => (
  <Circle bg="#F3BA2F" size={size}>
    <svg width={size * 0.6} height={size * 0.6} viewBox="0 0 24 24" fill="#000">
      <path d="M12 2l3 3-3 3-3-3 3-3zM2 12l3-3 3 3-3 3-3-3zm10 10l-3-3 3-3 3 3-3 3zm10-10l-3 3-3-3 3-3 3 3zm-10 0l-3-3 3-3 3 3-3 3z" />
      <path d="M12 9l3 3-3 3-3-3 3-3z" />
    </svg>
  </Circle>
);

export const NETWORK_LOGO_MAP: Record<string, React.FC<Props>> = {
  TRC20: TronLogo,
  BEP20: BnbLogo,
  ERC20: EthLogo,
  Polygon: PolygonLogo,
  Solana: SolanaLogo,
  Aptos: AptosLogo,
  BINANCE: BinanceLogo,
};
