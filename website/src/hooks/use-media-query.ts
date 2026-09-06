"use client";

import { useEffect, useState } from "react";

/**
 * Subscribes to a media query.
 *
 * Always starts `false` so the server render and the first client render agree;
 * the real answer lands in an effect. Callers must therefore treat `false` as
 * "not yet known", which is why every use of this reads as "the expensive path
 * is the default and the cheap one is opted into" rather than the reverse.
 */
export function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    const update = () => setMatches(media.matches);

    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, [query]);

  return matches;
}

/**
 * A phone or tablet, by input device rather than by width.
 *
 * Width alone misreads a narrow desktop window as a phone and a large tablet as
 * a desktop; `pointer: coarse` is asking the question we actually care about —
 * is this a touch device with a mobile GPU and a mobile compositor. The width
 * bound catches touchscreen laptops, which have the pointer but not the budget
 * problem.
 */
/**
 * Kept in step with the `.progressive-blur-*` query in `globals.css`, which
 * asks the same question in CSS because it needs the answer at first paint
 * rather than after hydration.
 */
export const COARSE_POINTER = "(pointer: coarse), (max-width: 767px)";

export function useIsMobileDevice() {
  return useMediaQuery(COARSE_POINTER);
}
