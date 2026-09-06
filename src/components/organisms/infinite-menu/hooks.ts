// @ts-check
import { useImage, type SkImage } from "@shopify/react-native-skia";
import { useMemo } from "react";

/** Hook rules mean the image slots are fixed; 20 is the item ceiling. */
const useLoadImages = <T extends string[]>(urls: T): (SkImage | null)[] => {
  const i0 = useImage(urls[0] || undefined);
  const i1 = useImage(urls[1] || undefined);
  const i2 = useImage(urls[2] || undefined);
  const i3 = useImage(urls[3] || undefined);
  const i4 = useImage(urls[4] || undefined);
  const i5 = useImage(urls[5] || undefined);
  const i6 = useImage(urls[6] || undefined);
  const i7 = useImage(urls[7] || undefined);
  const i8 = useImage(urls[8] || undefined);
  const i9 = useImage(urls[9] || undefined);
  const i10 = useImage(urls[10] || undefined);
  const i11 = useImage(urls[11] || undefined);
  const i12 = useImage(urls[12] || undefined);
  const i13 = useImage(urls[13] || undefined);
  const i14 = useImage(urls[14] || undefined);
  const i15 = useImage(urls[15] || undefined);
  const i16 = useImage(urls[16] || undefined);
  const i17 = useImage(urls[17] || undefined);
  const i18 = useImage(urls[18] || undefined);
  const i19 = useImage(urls[19] || undefined);

  return useMemo<(SkImage | null)[]>(() => {
    return [i0, i1, i2, i3, i4, i5, i6, i7, i8, i9, i10, i11, i12, i13, i14, i15, i16, i17, i18, i19].slice(0, urls.length);
  }, [i0, i1, i2, i3, i4, i5, i6, i7, i8, i9, i10, i11, i12, i13, i14, i15, i16, i17, i18, i19, urls.length]);
};

export { useLoadImages };
