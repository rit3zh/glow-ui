import { useState, useEffect } from 'react'

export function useMediaQuery(query: `(${string})`) {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    function onChange(event: MediaQueryListEvent) {
      setMatches(event.matches)
    }

    const mediaQueryList = matchMedia(query)

    mediaQueryList.addEventListener('change', onChange)
    setMatches(mediaQueryList.matches)

    return () => mediaQueryList.removeEventListener('change', onChange)
  }, [query])

  return matches
}
