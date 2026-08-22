import React from "react";
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { ArrowLeft, Coins, Clock, CheckCircle, ExternalLink } from "lucide-react";
import { colors } from "../../design/tokens";
import { poppins } from "../../design/fonts";
import { NETWORK_LOGO_MAP } from "../../design/NetworkLogos";

/**
 * Chaque écran reproduit à l'identique le rendu réel de l'app Terex
 * (voir src/components/features/buy-usdt/MobileBuyUSDT.tsx et
 *  src/components/features/PaymentInstructions.tsx dans le monorepo).
 */

const ScreenShell: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div
    style={{
      position: "absolute",
      inset: 0,
      background: colors.bg,
      overflow: "hidden",
      fontFamily: poppins,
    }}
  >
    <div style={{ maxWidth: 480, margin: "0 auto", height: "100%" }}>{children}</div>
  </div>
);

const CircleBackBtn: React.FC = () => (
  <button
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width: 38,
      height: 38,
      flexShrink: 0,
      background: colors.circleBtnBg,
      borderRadius: "50%",
      border: "none",
    }}
  >
    <ArrowLeft size={18} color="#fff" />
  </button>
);

/* ============ STEP 1 : Amount ============ */
export const AmountScreen: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const cfa = Math.floor(
    interpolate(frame, [0.4 * fps, 2.2 * fps], [0, 250000], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    }),
  );
  const rate = 655;
  const usdt = cfa > 0 ? (cfa / rate).toFixed(2) : "0";
  const waveFee = Math.ceil(cfa * 0.01);
  const total = cfa + waveFee;

  return (
    <ScreenShell>
      <div style={{ display: "flex", flexDirection: "column", gap: 14, padding: "80px 20px 100px" }}>
        <div>
          <h2 style={{ color: "#fff", fontSize: 26, fontWeight: 700, margin: "0 0 4px", letterSpacing: "-0.4px" }}>
            Acheter USDT
          </h2>
          <p style={{ color: colors.textMuted, fontSize: 13, margin: 0 }}>
            Entrez le montant que vous souhaitez dépenser
          </p>
        </div>

        {/* Amount input card */}
        <div style={{ background: colors.card, border: `1px solid ${colors.border}`, borderRadius: 20, padding: 20 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
            <span
              style={{
                color: colors.textMuted,
                fontSize: 11,
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
              }}
            >
              Montant
            </span>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              {/* Currency toggle */}
              <div style={{ display: "inline-flex", background: "rgba(255,255,255,0.04)", borderRadius: 10, padding: 3, gap: 2 }}>
                <span
                  style={{
                    padding: "5px 12px",
                    borderRadius: 7,
                    fontSize: 12,
                    fontWeight: 600,
                    background: colors.btnGray,
                    color: "#fff",
                  }}
                >
                  CFA
                </span>
                <span style={{ padding: "5px 12px", borderRadius: 7, fontSize: 12, fontWeight: 600, color: colors.textMuted }}>
                  USDT
                </span>
              </div>
              {/* Min / Max */}
              <div style={{ display: "flex", gap: 8 }}>
                <span style={{ color: colors.textDim, fontSize: 11, textDecoration: "underline", fontWeight: 500 }}>Min</span>
                <span style={{ color: colors.textDim, fontSize: 11, textDecoration: "underline", fontWeight: 500 }}>Max</span>
              </div>
            </div>
          </div>

          {/* Amount input */}
          <div
            style={{
              position: "relative",
              background: "rgba(255,255,255,0.03)",
              border: `1px solid ${colors.border}`,
              borderRadius: 14,
              padding: "18px 84px 18px 20px",
            }}
          >
            <span style={{ color: "#fff", fontSize: 34, fontWeight: 700, letterSpacing: "-1px" }}>
              {cfa.toLocaleString("fr-FR")}
            </span>
            <span
              style={{
                position: "absolute",
                right: 16,
                top: "50%",
                translate: "0 -50%",
                color: colors.textMuted,
                fontSize: 14,
                fontWeight: 500,
              }}
            >
              CFA
            </span>
          </div>
        </div>

        {/* Summary */}
        <div
          style={{
            background: colors.card,
            border: `1px solid ${colors.border}`,
            borderRadius: 16,
            padding: "16px 20px",
            display: "flex",
            flexDirection: "column",
            gap: 10,
          }}
        >
          <SummaryRow label="Vous recevez" value={`${usdt} USDT`} />
          {cfa > 0 && <SummaryRow label="Frais Wave (1%)" value={`${waveFee.toLocaleString("fr-FR")} CFA`} valueColor={colors.orange} />}
          {cfa > 0 && <SummaryRow label="Total à payer" value={`${total.toLocaleString("fr-FR")} CFA`} bold />}
          <SummaryRow label="Taux" value={`1 USDT = ${rate} CFA`} valueColor={colors.textDim} />
        </div>

        {/* Continue button */}
        <div style={{ display: "flex", justifyContent: "flex-start" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              background: colors.btnGray,
              borderRadius: 16,
              border: `1px solid ${colors.btnBorder}`,
              padding: "13px 22px",
              color: "#fff",
              fontSize: 14,
              fontWeight: 600,
            }}
          >
            <Coins size={17} strokeWidth={2} /> Continuer
          </div>
        </div>
      </div>
    </ScreenShell>
  );
};

const SummaryRow: React.FC<{ label: string; value: string; valueColor?: string; bold?: boolean }> = ({ label, value, valueColor, bold }) => (
  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
    <span style={{ color: bold ? "#fff" : colors.textMuted, fontSize: 13, fontWeight: bold ? 600 : 400 }}>{label}</span>
    <span style={{ color: valueColor ?? "#fff", fontSize: bold ? 14 : 13, fontWeight: bold ? 700 : 500 }}>{value}</span>
  </div>
);

/* ============ STEP 2 : Network ============ */
const NETWORKS = [
  { id: "TRC20", name: "Tron" },
  { id: "BEP20", name: "BNB Chain" },
  { id: "ERC20", name: "Ethereum" },
  { id: "Polygon", name: "Polygon" },
  { id: "Solana", name: "Solana" },
  { id: "Aptos", name: "Aptos" },
  { id: "BINANCE", name: "Binance" },
];

export const NetworkScreen: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const selectedIndex = Math.floor(
    interpolate(frame, [0.5 * fps, 2.4 * fps], [0, NETWORKS.length], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }),
  );

  return (
    <ScreenShell>
      <div style={{ paddingTop: 80 }}>
        {/* StepHeader */}
        <div style={{ padding: "0 20px 16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <CircleBackBtn />
            <h2 style={{ color: "#fff", fontSize: 20, fontWeight: 700, margin: 0, letterSpacing: "-0.3px" }}>
              Destination
            </h2>
          </div>
          <p style={{ color: colors.textMuted, fontSize: 13, margin: "8px 0 0" }}>
            Choisissez où vous voulez recevoir vos USDT
          </p>
        </div>

        {/* Network pills */}
        <div style={{ padding: "4px 20px", display: "flex", flexWrap: "wrap", gap: 8 }}>
          {NETWORKS.map((n, i) => {
            const selected = i === Math.min(selectedIndex, NETWORKS.length - 1);
            const Logo = NETWORK_LOGO_MAP[n.id];
            return (
              <div
                key={n.id}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "8px 14px 8px 8px",
                  borderRadius: 10,
                  border: `1px solid ${selected ? colors.networkBorderSel : colors.btnBorder}`,
                  background: selected ? colors.selectedBgPill : "rgba(255,255,255,0.02)",
                  color: "#fff",
                  fontSize: 14,
                  fontWeight: 400,
                  lineHeight: 1,
                }}
              >
                {Logo && <Logo size={28} />}
                <span>{n.name}</span>
              </div>
            );
          })}
        </div>

        {/* Continue */}
        <div style={{ display: "flex", justifyContent: "flex-start", padding: "24px 20px 28px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              background: colors.btnGray,
              borderRadius: 16,
              border: `1px solid ${colors.btnBorder}`,
              padding: "13px 22px",
              color: "#fff",
              fontSize: 14,
              fontWeight: 600,
            }}
          >
            <Coins size={17} strokeWidth={2} /> Continuer
          </div>
        </div>
      </div>
    </ScreenShell>
  );
};

/* ============ STEP 3 : Address (wallet) ============ */
export const AddressScreen: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fullAddress = "TXYZaB1qKm9pQR7sVwEo2NcDf3jL5hUvGt";
  const shown = fullAddress.slice(
    0,
    Math.max(0, Math.floor(interpolate(frame, [0.5 * fps, 2.2 * fps], [0, fullAddress.length], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }))),
  );
  const showCaret = Math.floor(frame / 8) % 2 === 0;

  return (
    <ScreenShell>
      <div style={{ paddingTop: 80 }}>
        {/* Header */}
        <div style={{ padding: "0 20px 16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <CircleBackBtn />
            <h2 style={{ color: "#fff", fontSize: 20, fontWeight: 700, margin: 0, letterSpacing: "-0.3px" }}>
              Adresse de réception
            </h2>
          </div>
          <p style={{ color: colors.textMuted, fontSize: 13, margin: "8px 0 0" }}>Entrez votre adresse TRC20</p>
        </div>

        {/* Address input */}
        <div style={{ padding: "4px 20px", display: "flex", flexDirection: "column", gap: 14 }}>
          <div
            style={{
              background: colors.card,
              border: `1px solid ${colors.border}`,
              borderRadius: 16,
              padding: 16,
            }}
          >
            <div
              style={{
                color: colors.textMuted,
                fontSize: 11,
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                marginBottom: 10,
              }}
            >
              Adresse wallet
            </div>
            <div
              style={{
                background: "rgba(255,255,255,0.03)",
                border: `1px solid ${colors.border}`,
                borderRadius: 12,
                padding: "14px 16px",
                color: "#fff",
                fontSize: 15,
                fontFamily: "monospace",
                wordBreak: "break-all",
                lineHeight: 1.5,
                minHeight: 52,
              }}
            >
              {shown}
              {showCaret && <span style={{ color: colors.green }}>|</span>}
            </div>
          </div>

          {/* Address book row */}
          <div
            style={{
              background: colors.card,
              border: `1px solid ${colors.border}`,
              borderRadius: 14,
              padding: "12px 16px",
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: 10,
                background: "rgba(255,255,255,0.05)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: colors.textDim,
              }}
            >
              📖
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ color: "#fff", fontSize: 13, fontWeight: 500 }}>Carnet d'adresses</div>
              <div style={{ color: colors.textMuted, fontSize: 11 }}>Réutilise tes adresses</div>
            </div>
          </div>
        </div>

        {/* Continue */}
        <div style={{ display: "flex", justifyContent: "flex-start", padding: "24px 20px 28px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              background: colors.btnGray,
              borderRadius: 16,
              border: `1px solid ${colors.btnBorder}`,
              padding: "13px 22px",
              color: "#fff",
              fontSize: 14,
              fontWeight: 600,
            }}
          >
            <Coins size={17} strokeWidth={2} /> Continuer
          </div>
        </div>
      </div>
    </ScreenShell>
  );
};

/* ============ STEP 4 : Confirm ============ */
export const ConfirmScreen: React.FC = () => {
  const rows = [
    { label: "Montant", value: "250 000 CFA" },
    { label: "Frais Wave (1%)", value: "2 500 CFA", accent: colors.orange },
    { label: "Total à payer", value: "252 500 CFA", bold: true },
    { label: "Vous recevez", value: "381.68 USDT" },
    { label: "Destination", value: "TRC20" },
    { label: "Adresse", value: "TXYZaB1qKm9pQR7sVwEo2NcDf3jL5hUvGt", mono: true },
  ];

  return (
    <ScreenShell>
      <div style={{ paddingTop: 80 }}>
        {/* Header */}
        <div style={{ padding: "0 20px 16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <CircleBackBtn />
            <h2 style={{ color: "#fff", fontSize: 20, fontWeight: 700, margin: 0, letterSpacing: "-0.3px" }}>
              Confirmer l'achat
            </h2>
          </div>
          <p style={{ color: colors.textMuted, fontSize: 13, margin: "8px 0 0" }}>Vérifiez les détails avant de payer</p>
        </div>

        {/* Recap card */}
        <div style={{ padding: "4px 20px" }}>
          <div
            style={{
              background: colors.card,
              border: `1px solid ${colors.border}`,
              borderRadius: 16,
              overflow: "hidden",
            }}
          >
            {rows.map((r, i) => (
              <div
                key={r.label}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "14px 16px",
                  borderBottom: i < rows.length - 1 ? `1px solid ${colors.border}` : "none",
                }}
              >
                <span style={{ color: colors.textMuted, fontSize: 13 }}>{r.label}</span>
                <span
                  style={{
                    color: r.accent ?? "#fff",
                    fontSize: r.mono ? 11 : 13,
                    fontWeight: r.bold ? 700 : 500,
                    maxWidth: "60%",
                    textAlign: "right",
                    wordBreak: "break-all",
                    fontFamily: r.mono ? "monospace" : undefined,
                  }}
                >
                  {r.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Confirm button (white) */}
        <div style={{ display: "flex", justifyContent: "flex-start", padding: "16px 20px 28px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              background: "#ffffff",
              borderRadius: 16,
              border: `1px solid rgba(255,255,255,0.15)`,
              padding: "13px 22px",
              color: colors.onWhite,
              fontSize: 14,
              fontWeight: 700,
            }}
          >
            <Coins size={17} strokeWidth={2} /> Confirmer et payer
          </div>
        </div>
      </div>
    </ScreenShell>
  );
};

/* ============ STEP 5 : Paiement Wave ============ */
export const PaymentScreen: React.FC = () => {
  return (
    <ScreenShell>
      <div style={{ padding: "80px 20px 20px" }}>
        {/* Header with countdown */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
          <CircleBackBtn />
          <div>
            <h2 style={{ color: "#fff", fontSize: 20, fontWeight: 700, margin: 0 }}>Paiement Wave</h2>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 4 }}>
              <Clock size={13} color={colors.orange} />
              <span style={{ color: colors.orange, fontSize: 13, fontWeight: 500 }}>29:47</span>
            </div>
          </div>
        </div>

        {/* Order recap */}
        <div
          style={{
            background: colors.cardSolid,
            border: `1px solid ${colors.border}`,
            borderRadius: 16,
            padding: 16,
            marginBottom: 16,
          }}
        >
          <RecapRow label="Montant" value="250 000 CFA" />
          <RecapRow label="Vous recevez" value="381.68 USDT" borderTop />
          <RecapRow label="Réseau" value="TRC20" />
        </div>

        {/* Ready to pay + Wave button */}
        <div
          style={{
            background: colors.cardSolid,
            border: `1px solid ${colors.border}`,
            borderRadius: 16,
            padding: 20,
            marginBottom: 16,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
            <CheckCircle size={18} color={colors.green} />
            <p style={{ color: colors.green, fontSize: 14, fontWeight: 600, margin: 0 }}>Prêt à payer</p>
          </div>
          <p style={{ color: colors.textSoft, fontSize: 13, margin: "0 0 16px", lineHeight: 1.5 }}>
            Cliquez ci-dessous pour ouvrir Wave et effectuer le paiement.
          </p>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
              width: "100%",
              background: colors.wave,
              color: "#fff",
              borderRadius: 14,
              padding: 15,
              fontSize: 15,
              fontWeight: 700,
              boxSizing: "border-box",
            }}
          >
            <ExternalLink size={18} />
            Payer avec Wave
          </div>
        </div>

        {/* J'ai payé (white bottom button) */}
        <div
          style={{
            width: "100%",
            background: "#fff",
            color: colors.onWhite,
            borderRadius: 14,
            padding: 15,
            fontSize: 15,
            fontWeight: 700,
            textAlign: "center",
            boxSizing: "border-box",
          }}
        >
          J'ai payé
        </div>
      </div>
    </ScreenShell>
  );
};

const RecapRow: React.FC<{ label: string; value: string; borderTop?: boolean }> = ({ label, value, borderTop }) => (
  <div
    style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 8,
      paddingTop: borderTop ? 8 : 0,
      borderTop: borderTop ? "1px solid rgba(255,255,255,0.06)" : "none",
    }}
  >
    <span style={{ color: colors.textFaint, fontSize: 13 }}>{label}</span>
    <span style={{ color: "#fff", fontSize: 13, fontWeight: 600 }}>{value}</span>
  </div>
);

/* ============ STEP 6 : Success (Payment pending) ============ */
export const SuccessScreen: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const checkScale = interpolate(frame, [0.2 * fps, 0.8 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.back(1.8)),
  });
  const textOpacity = interpolate(frame, [0.7 * fps, 1.1 * fps], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <ScreenShell>
      <div
        style={{
          padding: "80px 20px 20px",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 24,
        }}
      >
        <div
          style={{
            width: 110,
            height: 110,
            borderRadius: "50%",
            background: "rgba(74,222,128,0.14)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            scale: checkScale,
          }}
        >
          <CheckCircle size={64} color={colors.green} strokeWidth={2.4} />
        </div>

        <div style={{ opacity: textOpacity, textAlign: "center" }}>
          <div style={{ color: "#fff", fontSize: 26, fontWeight: 700, letterSpacing: "-0.4px" }}>Paiement reçu</div>
          <div style={{ color: colors.textMuted, fontSize: 14, marginTop: 6 }}>Vos USDT arrivent dans quelques minutes</div>
        </div>

        <div
          style={{
            width: "100%",
            maxWidth: 360,
            background: colors.card,
            border: `1px solid ${colors.border}`,
            borderRadius: 16,
            padding: 16,
            marginTop: 8,
          }}
        >
          <RecapRow label="Montant" value="250 000 CFA" />
          <RecapRow label="Vous recevez" value="381.68 USDT" borderTop />
          <RecapRow label="Réseau" value="TRC20" />
        </div>
      </div>
    </ScreenShell>
  );
};
