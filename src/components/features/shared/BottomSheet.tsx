import { useEffect, type ReactNode } from 'react';
import { X } from 'lucide-react';

interface BottomSheetProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
}

/**
 * Feuille modale qui remonte du bas sur mobile, centrée sur desktop.
 * Style copié d'Ooble (BottomSheet.tsx). Utilisé pour lister des options
 * quand il y en a trop pour un simple dropdown.
 */
export function BottomSheet({ open, onClose, title, children }: BottomSheetProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 100,
        display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
      }}
    >
      {/* Backdrop */}
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)' }} />

      {/* Sheet */}
      <div
        onClick={e => e.stopPropagation()}
        style={{
          position: 'relative', zIndex: 10,
          width: '100%', maxWidth: '520px',
          background: '#1f1f1f',
          borderRadius: '20px 20px 0 0',
          maxHeight: '85vh',
          overflowY: 'auto', overscrollBehavior: 'contain',
          paddingBottom: 'env(safe-area-inset-bottom, 20px)',
          animation: 'terex-sheet-in 0.28s cubic-bezier(0.4,0,0.2,1)',
        }}
      >
        <style>{`
          @keyframes terex-sheet-in {
            from { transform: translateY(100%); }
            to   { transform: translateY(0); }
          }
          @media (min-width: 640px) {
            .terex-sheet-outer { align-items: center !important; }
            .terex-sheet-inner { border-radius: 20px !important; margin-bottom: 0 !important; }
          }
        `}</style>

        {/* Handle bar (mobile only, décoratif) */}
        <div style={{ position: 'sticky', top: 0, background: '#1f1f1f', paddingTop: '12px', paddingBottom: '4px', zIndex: 5 }}>
          <div style={{ margin: '0 auto', height: '5px', width: '40px', borderRadius: '999px', background: 'rgba(255,255,255,0.15)' }} />
        </div>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 20px 12px' }}>
          {title && <h2 style={{ color: '#fff', fontSize: '17px', fontWeight: 600, margin: 0, letterSpacing: '-0.01em' }}>{title}</h2>}
          <button
            type="button"
            onClick={onClose}
            style={{
              marginLeft: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: '32px', height: '32px', borderRadius: '50%',
              background: 'rgba(255,255,255,0.08)', border: 'none', color: 'rgba(255,255,255,0.75)',
              cursor: 'pointer', outline: 'none', WebkitTapHighlightColor: 'transparent',
            }}
          >
            <X size={16} strokeWidth={2} />
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '0 20px 24px' }}>{children}</div>
      </div>
    </div>
  );
}
