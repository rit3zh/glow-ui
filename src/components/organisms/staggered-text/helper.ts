import type { SkFont } from "@shopify/react-native-skia";
import type { TStaggerFrom, ICharacterMetrics, ITextMetrics } from "./types";

const withBuildCharacterMetrics = <T extends SkFont>(
  text: string,
  font: NonNullable<T extends SkFont ? T : never>,
  staggerFrom: TStaggerFrom,
  charDelay: number,
  letterSpacing: number = 0,
): ITextMetrics => {
  // Array.from splits by code point, which matches getGlyphIDs' per-code-point ids.
  const chars = Array.from(text);
  // Advance widths, not glyph bounds: measureText returns a tight bounding box,
  // so whitespace measures as 0 and words collapse into each other.
  const advances = font.getGlyphWidths(font.getGlyphIDs(text));
  const delays = getStaggerDelays(chars.length, staggerFrom, charDelay);

  let xOffset: number = 0;
  const characters = chars.map<ICharacterMetrics>((char, i) => {
    const width = advances[i] ?? font.measureText(char).width;
    const m: ICharacterMetrics = {
      char,
      x: xOffset,
      width,
      delay: delays[i],
    };
    xOffset += width + letterSpacing;
    return m;
  });

  // Drop the trailing letterSpacing so centering isn't biased to the left.
  return {
    characters,
    width: Math.max(0, xOffset - letterSpacing),
  };
};

const getStaggerDelays = <T extends number>(
  count: T,
  from: TStaggerFrom,
  step: number,
): number[] => {
  switch (from) {
    case "leading":
      return Array.from({ length: count }, (_, i) => i * step);
    case "trailing":
      return Array.from({ length: count }, (_, i) => (count - 1 - i) * step);
    case "center": {
      const mid = (count - 1) / 2;
      return Array.from({ length: count }, (_, i) => Math.abs(i - mid) * step);
    }
    case "edges": {
      const mid = (count - 1) / 2;
      return Array.from(
        { length: count },
        (_, i) => (mid - Math.abs(i - mid)) * step,
      );
    }
    case "random":
      return Array.from({ length: count }, () => Math.random() * count * step);
  }
};

export { withBuildCharacterMetrics, getStaggerDelays };
