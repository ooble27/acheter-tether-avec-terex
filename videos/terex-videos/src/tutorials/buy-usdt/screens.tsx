import React from "react";
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { colors } from "../../design/tokens";
import { poppins } from "../../design/fonts";

const ScreenShell: React.FC<{ children: React.ReactNode; title?: string }> = ({ children, title }) => (
  <div
    style={{
      position: "absolute",
      inset: 0,
      background: colors.dark,
      display: "flex",
      flexDirection: "column",
      padding: "80px 34px 34px",
      fontFamily: poppins,
    }}
  >
    {title && (
      <div
        style={{
          color: colors.accent,
          fontSize: 28,
          fontWeight: 600,
          marginBottom: 26,
          letterSpacing: "-0.01em",
        }}
      >
        {title}
      </div>
    )}
    {children}
  </div>
);

const FieldLabel: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ color: colors.mutedDark, fontSize: 18, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>
    {children}
  </div>
);

const Card: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <div
    style={{
      background: colors.cardLight,
      border: `1px solid ${colors.border}`,
      borderRadius: 22,
      padding: 22,
      ...style,
    }}
  >
    {children}
  </div>
);

/* ---------- STEP 1 : Montant ---------- */
export const AmountScreen: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const cfa = Math.floor(interpolate(frame, [0.4 * fps, 2 * fps], [0, 250000], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }));
  const usdt = (cfa / 655).toFixed(2);

  return (
    <ScreenShell title="Combien veux-tu acheter ?">
      <Card style={{ marginBottom: 16 }}>
        <FieldLabel>Montant CFA</FieldLabel>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
          <div style={{ color: colors.accent, fontSize: 52, fontWeight: 700, letterSpacing: "-0.03em" }}>
            {cfa.toLocaleString("fr-FR")}
          </div>
          <div style={{ color: colors.muted, fontSize: 22, fontWeight: 500 }}>CFA</div>
        </div>
      </Card>

      <Card>
        <FieldLabel>Tu recevras</FieldLabel>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
          <div style={{ color: colors.green, fontSize: 52, fontWeight: 700, letterSpacing: "-0.03em" }}>
            {usdt}
          </div>
          <div style={{ color: colors.muted, fontSize: 22, fontWeight: 500 }}>USDT</div>
        </div>
      </Card>

      <div style={{ flex: 1 }} />

      <div
        style={{
          background: colors.accent,
          color: colors.dark,
          padding: 24,
          borderRadius: 20,
          textAlign: "center",
          fontSize: 26,
          fontWeight: 700,
        }}
      >
        Continuer
      </div>
    </ScreenShell>
  );
};

/* ---------- STEP 2 : Réseau ---------- */
export const NetworkScreen: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const networks = [
    { name: "TRC20", desc: "Tron · rapide, frais bas", color: "#EF4444" },
    { name: "BEP20", desc: "BNB Smart Chain", color: "#F0B90B" },
    { name: "Polygon", desc: "MATIC network", color: "#8247E5" },
    { name: "Solana", desc: "SOL network", color: "#14F195" },
  ];

  const selectedIndex = Math.min(
    3,
    Math.floor(interpolate(frame, [0.5 * fps, 2.4 * fps], [0, 4], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })),
  );

  return (
    <ScreenShell title="Choisis le réseau">
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {networks.map((n, i) => {
          const active = i === selectedIndex;
          return (
            <Card
              key={n.name}
              style={{
                background: active ? "rgba(255,255,255,0.09)" : colors.cardLight,
                border: active ? `1px solid ${colors.accent}` : `1px solid ${colors.border}`,
                transition: "all 0.2s ease",
                display: "flex",
                alignItems: "center",
                gap: 16,
                padding: 18,
              }}
            >
              <div
                style={{
                  width: 46,
                  height: 46,
                  borderRadius: 14,
                  background: n.color,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#000",
                  fontWeight: 800,
                  fontSize: 18,
                }}
              >
                {n.name.slice(0, 2)}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ color: colors.accent, fontSize: 22, fontWeight: 600 }}>{n.name}</div>
                <div style={{ color: colors.muted, fontSize: 15 }}>{n.desc}</div>
              </div>
              {active && (
                <div
                  style={{
                    width: 26,
                    height: 26,
                    borderRadius: 999,
                    background: colors.accent,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: colors.dark,
                    fontSize: 16,
                    fontWeight: 800,
                  }}
                >
                  ✓
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </ScreenShell>
  );
};

/* ---------- STEP 3 : Adresse wallet ---------- */
export const AddressScreen: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fullAddress = "TXYZaB1qKm9pQR7sVwEo2NcDf3jL5hUvGt";
  const shown = fullAddress.slice(0, Math.max(0, Math.floor(interpolate(frame, [0.4 * fps, 2 * fps], [0, fullAddress.length], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }))));

  return (
    <ScreenShell title="Adresse de réception">
      <Card style={{ marginBottom: 16 }}>
        <FieldLabel>Adresse wallet (TRC20)</FieldLabel>
        <div style={{ color: colors.accent, fontSize: 20, fontFamily: "monospace", wordBreak: "break-all", lineHeight: 1.5 }}>
          {shown}
          <span style={{ color: colors.green, opacity: (Math.floor(frame / 8) % 2 === 0 ? 1 : 0) }}>|</span>
        </div>
      </Card>

      <Card style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(52,211,153,0.12)", display: "flex", alignItems: "center", justifyContent: "center", color: colors.green, fontSize: 22 }}>📖</div>
        <div>
          <div style={{ color: colors.accent, fontSize: 18, fontWeight: 600 }}>Carnet d'adresses</div>
          <div style={{ color: colors.muted, fontSize: 14 }}>Réutilise tes adresses</div>
        </div>
      </Card>
    </ScreenShell>
  );
};

/* ---------- STEP 4 : Confirmation ---------- */
export const ConfirmScreen: React.FC = () => {
  return (
    <ScreenShell title="Récapitulatif">
      <Card style={{ marginBottom: 14 }}>
        <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0" }}>
          <span style={{ color: colors.muted, fontSize: 18 }}>Montant</span>
          <span style={{ color: colors.accent, fontSize: 20, fontWeight: 600 }}>250 000 CFA</span>
        </div>
        <div style={{ height: 1, background: colors.border, margin: "8px 0" }} />
        <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0" }}>
          <span style={{ color: colors.muted, fontSize: 18 }}>Tu reçois</span>
          <span style={{ color: colors.green, fontSize: 20, fontWeight: 600 }}>381.68 USDT</span>
        </div>
        <div style={{ height: 1, background: colors.border, margin: "8px 0" }} />
        <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0" }}>
          <span style={{ color: colors.muted, fontSize: 18 }}>Réseau</span>
          <span style={{ color: colors.accent, fontSize: 20, fontWeight: 600 }}>TRC20</span>
        </div>
      </Card>

      <Card style={{ background: "rgba(52,211,153,0.08)", border: "1px solid rgba(52,211,153,0.25)", display: "flex", alignItems: "center", gap: 14 }}>
        <div style={{ width: 40, height: 40, borderRadius: 999, background: colors.green, display: "flex", alignItems: "center", justifyContent: "center", color: colors.dark, fontSize: 20, fontWeight: 800 }}>✓</div>
        <div>
          <div style={{ color: colors.green, fontSize: 18, fontWeight: 600 }}>KYC approuvé</div>
          <div style={{ color: colors.muted, fontSize: 14 }}>Tu peux continuer</div>
        </div>
      </Card>

      <div style={{ flex: 1 }} />

      <div style={{ background: colors.accent, color: colors.dark, padding: 24, borderRadius: 20, textAlign: "center", fontSize: 26, fontWeight: 700 }}>
        Confirmer et payer
      </div>
    </ScreenShell>
  );
};

/* ---------- STEP 5 : Paiement Wave ---------- */
export const PaymentScreen: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const pulse = interpolate(frame % (2 * fps), [0, 1 * fps, 2 * fps], [1, 1.06, 1], { easing: Easing.inOut(Easing.cubic) });

  return (
    <ScreenShell title="Paiement">
      <div
        style={{
          background: "linear-gradient(160deg, #21D2FF 0%, #007DFF 100%)",
          borderRadius: 26,
          padding: 30,
          marginBottom: 18,
          color: "#fff",
        }}
      >
        <div style={{ fontSize: 16, fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", opacity: 0.9 }}>Wave</div>
        <div style={{ fontSize: 44, fontWeight: 700, marginTop: 8, letterSpacing: "-0.02em" }}>250 000 CFA</div>
        <div style={{ fontSize: 16, marginTop: 6, opacity: 0.9 }}>Paiement sécurisé instantané</div>
      </div>

      <Card style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 14 }}>
        <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(255,107,26,0.18)", display: "flex", alignItems: "center", justifyContent: "center", color: colors.orange, fontSize: 22 }}>📱</div>
        <div>
          <div style={{ color: colors.accent, fontSize: 18, fontWeight: 600 }}>Orange Money</div>
          <div style={{ color: colors.muted, fontSize: 14 }}>Alternative disponible</div>
        </div>
      </Card>

      <div style={{ flex: 1 }} />

      <div
        style={{
          background: "linear-gradient(160deg, #21D2FF 0%, #007DFF 100%)",
          color: "#fff",
          padding: 24,
          borderRadius: 20,
          textAlign: "center",
          fontSize: 26,
          fontWeight: 700,
          scale: pulse,
          boxShadow: "0 20px 50px rgba(0,125,255,0.35)",
        }}
      >
        Payer avec Wave
      </div>
    </ScreenShell>
  );
};

/* ---------- STEP 6 : USDT reçus ---------- */
export const SuccessScreen: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const checkScale = interpolate(frame, [0.2 * fps, 0.7 * fps], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.back(2)) });
  const textOpacity = interpolate(frame, [0.6 * fps, 1 * fps], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <ScreenShell>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 26 }}>
        <div
          style={{
            width: 160,
            height: 160,
            borderRadius: 999,
            background: colors.green,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 90,
            color: colors.dark,
            fontWeight: 800,
            scale: checkScale,
            boxShadow: "0 20px 80px rgba(52,211,153,0.45)",
          }}
        >
          ✓
        </div>
        <div style={{ opacity: textOpacity, textAlign: "center" }}>
          <div style={{ color: colors.accent, fontSize: 36, fontWeight: 700, letterSpacing: "-0.02em" }}>USDT reçus !</div>
          <div style={{ color: colors.muted, fontSize: 20, marginTop: 8 }}>381.68 USDT · Wallet TRC20</div>
        </div>
      </div>
    </ScreenShell>
  );
};
