import * as React from "react"

const MOBILE_BREAKPOINT = 768
const QUERY = `(max-width: ${MOBILE_BREAKPOINT - 1}px)`

/**
 * Vrai en dessous de 768px de large.
 *
 * On s'appuie sur `matchMedia` (viewport de MISE EN PAGE) et non sur
 * `window.innerWidth` (viewport VISUEL). Sur iPad / PWA, `innerWidth` suit le
 * zoom pincé et pouvait momentanément passer sous 768 → l'accueil basculait
 * par erreur sur la disposition mobile étirée. `matchMedia` n'est pas affecté
 * par le zoom visuel : la disposition reste stable.
 */
function query(): MediaQueryList | null {
  if (typeof window === 'undefined' || !window.matchMedia) return null
  return window.matchMedia(QUERY)
}

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean>(() => query()?.matches ?? false)

  React.useEffect(() => {
    const mql = query()
    if (!mql) return
    const onChange = () => setIsMobile(mql.matches)
    onChange()
    // addEventListener('change') sur les navigateurs récents ; addListener en repli.
    if (mql.addEventListener) mql.addEventListener('change', onChange)
    else mql.addListener(onChange)
    // Repli supplémentaire (certains WebView iOS ne notifient pas toujours mql).
    window.addEventListener('orientationchange', onChange)
    return () => {
      if (mql.removeEventListener) mql.removeEventListener('change', onChange)
      else mql.removeListener(onChange)
      window.removeEventListener('orientationchange', onChange)
    }
  }, [])

  return isMobile
}
