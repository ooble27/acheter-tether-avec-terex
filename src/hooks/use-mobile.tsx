import * as React from "react"

const MOBILE_BREAKPOINT = 768

function computeIsMobile() {
  if (typeof window === 'undefined') return false
  return window.innerWidth < MOBILE_BREAKPOINT
}

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean>(computeIsMobile)

  React.useEffect(() => {
    const onChange = () => setIsMobile(computeIsMobile())

    // Recalcul immédiat + après le premier rendu (corrige le cas iPad/PWA où
    // la largeur du viewport n'est pas encore stabilisée au tout premier paint).
    onChange()
    const raf = requestAnimationFrame(onChange)

    window.addEventListener("resize", onChange)
    window.addEventListener("orientationchange", onChange)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener("resize", onChange)
      window.removeEventListener("orientationchange", onChange)
    }
  }, [])

  return isMobile
}
