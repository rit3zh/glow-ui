import {
  Skia,
  BlendMode,
  TileMode,
  type SkCanvas,
  type SkFont,
  type SkPaint,
} from "@shopify/react-native-skia";
import {
  HEIGHT_BLUR_RATIO,
  MAX_FIELD_WIDTH,
  MIN_BLUR_PX,
  TIGHT_BLUR_SCALE,
  WIDE_BLUR_SCALE,
} from "./const";
import type {
  IBuildChromeField,
  IChromeColors,
  IChromeField,
  RGB,
} from "./types";

const TRANSPARENT = Skia.Color("#00000000");
const OPAQUE_BLACK = Skia.Color("#000000");
const WHITE = Skia.Color("#ffffff");

const CHANNEL_R = [0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1];
const CHANNEL_G = [0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1];
const CHANNEL_B = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1];

const colorToRGB = <T extends string>(color: T): RGB => {
  const c = Skia.Color(color);
  return [c[0], c[1], c[2]];
};

const colorsToFloats = (colors: IChromeColors): number[] => [
  ...colorToRGB(colors.sky),
  ...colorToRGB(colors.highlight),
  ...colorToRGB(colors.shadow),
  ...colorToRGB(colors.ground),
  ...colorToRGB(colors.base),
  ...colorToRGB(colors.spark),
];

const fieldSize = (
  width: number,
  height: number,
  scale: number,
): [number, number] => {
  const w = Math.max(2, Math.min(MAX_FIELD_WIDTH, Math.round(width * scale)));
  const h = Math.max(2, Math.round(w * (height / Math.max(1, width))));
  return [w, h];
};

const advanceOf = (font: SkFont, char: string): number => {
  const ids = font.getGlyphIDs(char);
  if (ids.length > 0) {
    const widths = font.getGlyphWidths(ids);
    if (widths.length > 0) return widths.reduce((a, b) => a + b, 0);
  }
  return font.measureText(char).width;
};

const totalAdvance = (
  font: SkFont,
  chars: string[],
  tracking: number,
): { advances: number[]; total: number } => {
  const advances = chars.map((c) => advanceOf(font, c));
  const total =
    advances.reduce((a, b) => a + b, 0) + tracking * (chars.length - 1);
  return { advances, total };
};

const drawWord = (
  canvas: SkCanvas,
  font: SkFont,
  paint: SkPaint,
  word: string,
  W: number,
  H: number,
  fontSizeRatio: number,
  widthRatio: number,
  letterSpacing: number,
) => {
  const chars = [...word];
  if (chars.length === 0) return;

  font.setSize(Math.max(1, H * fontSizeRatio));
  let size = font.getSize();
  let { advances, total } = totalAdvance(font, chars, letterSpacing * size);

  const maxW = W * widthRatio;
  if (total > maxW && total > 0) {
    size = Math.max(1, size * (maxW / total));
    font.setSize(size);
    ({ advances, total } = totalAdvance(font, chars, letterSpacing * size));
  }

  const metrics = font.getMetrics();
  const baseline = H * 0.5 - (metrics.ascent + metrics.descent) / 2;
  const tracking = letterSpacing * size;

  let x = W / 2 - total / 2;
  for (let i = 0; i < chars.length; i++) {
    canvas.drawText(chars[i], x, baseline, paint, font);
    x += advances[i] + tracking;
  }
};

const channelPaint = (matrix: number[], sigma: number): SkPaint => {
  const paint = Skia.Paint();
  paint.setAntiAlias(true);
  paint.setBlendMode(BlendMode.Plus);
  const colorFilter = Skia.ColorFilter.MakeMatrix(matrix);
  const blur =
    sigma > 0 ? Skia.ImageFilter.MakeBlur(sigma, sigma, TileMode.Decal) : null;
  paint.setImageFilter(Skia.ImageFilter.MakeColorFilter(colorFilter, blur));
  return paint;
};

const buildChromeField = (opts: IBuildChromeField): IChromeField | null => {
  const {
    text,
    font,
    width,
    height,
    scale,
    fontSizeRatio,
    widthRatio,
    letterSpacing,
    bulge,
  } = opts;

  if (!(width > 0) || !(height > 0)) return null;
  const [W, H] = fieldSize(width, height, scale);

  const glyphSurface =
    Skia.Surface.Make(W, H) ?? Skia.Surface.MakeOffscreen(W, H);
  if (!glyphSurface) return null;

  const glyphCanvas = glyphSurface.getCanvas();
  glyphCanvas.clear(TRANSPARENT);

  const word = text.trim();
  if (word.length > 0) {
    const paint = Skia.Paint();
    paint.setAntiAlias(true);
    paint.setColor(WHITE);

    const typeface = font.getTypeface();
    const working = typeface ? Skia.Font(typeface, font.getSize()) : font;
    const originalSize = font.getSize();

    drawWord(
      glyphCanvas,
      working,
      paint,
      word,
      W,
      H,
      fontSizeRatio,
      widthRatio,
      letterSpacing,
    );

    if (working === font) font.setSize(originalSize);
  }
  glyphSurface.flush();
  const glyphs = glyphSurface.makeImageSnapshot();

  const packSurface =
    Skia.Surface.Make(W, H) ?? Skia.Surface.MakeOffscreen(W, H);
  if (!packSurface) return null;

  const base = Math.max(MIN_BLUR_PX, H * HEIGHT_BLUR_RATIO);
  const wide = base * Math.max(0.05, bulge) * WIDE_BLUR_SCALE;
  const tight = base * TIGHT_BLUR_SCALE;

  const packCanvas = packSurface.getCanvas();
  packCanvas.clear(OPAQUE_BLACK);
  packCanvas.drawImage(glyphs, 0, 0, channelPaint(CHANNEL_R, 0));
  packCanvas.drawImage(glyphs, 0, 0, channelPaint(CHANNEL_G, wide));
  packCanvas.drawImage(glyphs, 0, 0, channelPaint(CHANNEL_B, tight));
  packSurface.flush();

  const image = packSurface.makeImageSnapshot();
  glyphs.dispose?.();
  glyphSurface.dispose?.();

  return { image, width: W, height: H };
};

export { colorToRGB, colorsToFloats, fieldSize, buildChromeField };
