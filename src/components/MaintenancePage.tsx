const BG = '#1a1a1a';
const CARD = '#1e1e1e';
const BORDER = 'rgba(255,255,255,0.08)';
const ACCENT = '#2dd4a7';

/**
 * Page « site en construction » affichée pendant la migration.
 * Sobre, rassurante, aux couleurs de Terex.
 */
export function MaintenancePage() {
  return (
    <div style={{
      minHeight: '100vh', background: BG, color: '#fff',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '24px', fontFamily: "system-ui,-apple-system,'Segoe UI',Roboto,sans-serif",
      textAlign: 'center',
    }}>
      <style>{`@keyframes tx-pulse{0%,100%{opacity:1}50%{opacity:.4}}`}</style>
      <div style={{ maxWidth: 440, width: '100%' }}>
        {/* Logo */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 12, marginBottom: 30 }}>
          <img src="/terex-icon.png" width={46} height={46} alt="Terex"
            style={{ display: 'block', borderRadius: 13, border: `1px solid ${BORDER}` }} />
          <span style={{ fontSize: 24, fontWeight: 800, letterSpacing: '-0.02em' }}>Terex</span>
        </div>

        {/* Carte */}
        <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 22, padding: '40px 28px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: ACCENT, animation: 'tx-pulse 1.6s ease-in-out infinite' }} />
            <span style={{ fontSize: 11.5, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: ACCENT }}>
              Maintenance en cours
            </span>
          </div>

          <h1 style={{ fontSize: 26, fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.15, margin: '0 0 14px' }}>
            Nous améliorons la plateforme
          </h1>
          <p style={{ fontSize: 15, color: '#9ca3af', lineHeight: 1.65, margin: '0 0 26px' }}>
            Terex est momentanément en maintenance pour vous offrir un service encore plus rapide et sécurisé.
            Nous revenons très vite. Merci de votre confiance.
          </p>

          <div style={{ borderTop: `1px solid ${BORDER}`, paddingTop: 22 }}>
            <p style={{ fontSize: 12.5, color: '#6b7280', margin: '0 0 12px' }}>Une question ? Écrivez-nous :</p>
            <a href="mailto:terangaexchange@gmail.com"
              style={{ display: 'inline-block', background: '#fff', color: '#141414', textDecoration: 'none', fontSize: 14, fontWeight: 700, padding: '12px 24px', borderRadius: 12 }}>
              terangaexchange@gmail.com
            </a>
          </div>
        </div>

        <p style={{ fontSize: 11.5, color: '#4b5563', margin: '22px 0 0' }}>
          © {new Date().getFullYear()} Teranga Exchange — Achat &amp; vente d'USDT en CFA
        </p>
      </div>
    </div>
  );
}
