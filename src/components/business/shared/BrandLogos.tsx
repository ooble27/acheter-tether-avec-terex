import { useState } from 'react';
import waveLogo from '@/assets/wave-logo.png';
import orangeLogo from '@/assets/orange-money-logo.png';
import usdtLogo from '@/assets/usdt-logo.png';
import bankLogo from '@/assets/bank-card-logo.png';

interface LogoProps {
  size?: number;
}

export function WaveLogo({ size = 28 }: LogoProps) {
  return (
    <img
      src={waveLogo}
      alt="Wave"
      width={size}
      height={size}
      style={{ width: size, height: size, borderRadius: size / 4, objectFit: 'cover', display: 'block', flexShrink: 0 }}
    />
  );
}

export function OrangeMoneyLogo({ size = 28 }: LogoProps) {
  return (
    <img
      src={orangeLogo}
      alt="Orange Money"
      width={size}
      height={size}
      style={{ width: size, height: size, borderRadius: size / 4, objectFit: 'cover', display: 'block', flexShrink: 0 }}
    />
  );
}

export function UsdtLogo({ size = 28 }: LogoProps) {
  return (
    <img
      src={usdtLogo}
      alt="USDT"
      width={size}
      height={size}
      style={{ width: size, height: size, borderRadius: size / 4, objectFit: 'cover', display: 'block', flexShrink: 0 }}
    />
  );
}

export function FreeMoneyLogo({ size = 28 }: LogoProps) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: '#22c55e',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        color: '#fff',
        fontSize: size * 0.36,
        fontWeight: 700,
        letterSpacing: '-0.02em',
        fontFamily: "'Inter', sans-serif",
      }}
    >
      FM
    </div>
  );
}

export function BankLogo({ size = 28 }: LogoProps) {
  return (
    <img
      src={bankLogo}
      alt="Virement bancaire"
      width={size}
      height={size}
      style={{ width: size, height: size, borderRadius: size / 4, objectFit: 'cover', display: 'block', flexShrink: 0 }}
    />
  );
}

const NETWORK_IMAGES: Record<string, string> = {
  TRC20:   'https://s2.coinmarketcap.com/static/img/coins/64x64/1958.png',
  BEP20:   'https://s2.coinmarketcap.com/static/img/coins/64x64/1839.png',
  ERC20:   'https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png',
  POLYGON: 'https://s2.coinmarketcap.com/static/img/coins/64x64/3890.png',
};

const NETWORK_FALLBACK: Record<string, string> = {
  TRC20:   'T',
  BEP20:   'B',
  ERC20:   'E',
  POLYGON: 'P',
};

interface NetworkLogoProps {
  network: 'TRC20' | 'BEP20' | 'ERC20' | 'POLYGON';
  size?: number;
}

export function NetworkLogo({ network, size = 28 }: NetworkLogoProps) {
  const [error, setError] = useState(false);
  const src = NETWORK_IMAGES[network];
  const letter = NETWORK_FALLBACK[network] || network[0];

  if (error || !src) {
    return (
      <div
        style={{
          width: size,
          height: size,
          borderRadius: '50%',
          background: 'rgba(59,150,143,0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          color: '#3B968F',
          fontSize: size * 0.42,
          fontWeight: 700,
          fontFamily: "'Inter', sans-serif",
        }}
      >
        {letter}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={network}
      width={size}
      height={size}
      onError={() => setError(true)}
      style={{ width: size, height: size, borderRadius: '50%', objectFit: 'cover', display: 'block', flexShrink: 0 }}
    />
  );
}
