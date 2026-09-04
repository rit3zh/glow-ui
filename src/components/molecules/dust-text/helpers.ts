import { Platform, type TextStyle } from "react-native";
import { Skia, matchFont, type SkFont } from "@shopify/react-native-skia";

import {
  ALPHA_CUTOFF,
  ATLAS_CELL,
  FIT_RATIO,
  SAMPLE_GAP_BASE,
  SPAWN_RING_MIN,
  SPAWN_RING_SPREAD,
} from "./const";
import type { IDustAtlas, IDustField, TDustShape } from "./types";

function resolveFont(
  fontFamily: string | undefined,
  fontSize: number,
  fontWeight: TextStyle["fontWeight"],
): SkFont | null {
  const family =
    fontFamily ??
    Platform.select({
      ios: "Helvetica",
      android: "sans-serif",
      default: "serif",
    });

  try {
    return matchFont({
      fontFamily: family,
      fontSize,
      fontWeight: fontWeight as never,
    });
  } catch {
    const weight =
      fontWeight === "bold"
        ? 700
        : fontWeight === "normal" || fontWeight === undefined
          ? 400
          : parseInt(String(fontWeight), 10) || 400;

    const typeface = Skia.FontMgr.System().matchFamilyStyle(family, { weight });

    return typeface ? Skia.Font(typeface, fontSize) : null;
  }
}

function deriveFont(
  custom: SkFont | null | undefined,
  fontFamily: string | undefined,
  fontSize: number,
  fontWeight: TextStyle["fontWeight"],
): SkFont | null {
  if (custom) {
    const typeface = custom.getTypeface();

    return typeface ? Skia.Font(typeface, fontSize) : null;
  }

  return resolveFont(fontFamily, fontSize, fontWeight);
}

function buildAtlas(colors: string[], shape: TDustShape): IDustAtlas | null {
  const cell = ATLAS_CELL;
  const surface = Skia.Surface.Make(cell * colors.length, cell);
  if (!surface) return null;

  const canvas = surface.getCanvas();
  const paint = Skia.Paint();
  paint.setAntiAlias(true);

  colors.forEach((color, index) => {
    paint.setColor(Skia.Color(color));

    const left = index * cell;

    if (shape === "square") {
      canvas.drawRect(Skia.XYWHRect(left + 1, 1, cell - 2, cell - 2), paint);
    } else {
      canvas.drawCircle(left + cell / 2, cell / 2, cell / 2 - 1, paint);
    }
  });

  surface.flush();

  return {
    image: surface.makeImageSnapshot(),
    cell,
    rects: colors.map((_, index) => Skia.XYWHRect(index * cell, 0, cell, cell)),
  };
}

function sampleField(
  text: string,
  font: SkFont,
  width: number,
  height: number,
  density: number,
  maxParticles: number,
  autoFit: boolean,
): IDustField | null {
  if (!text || width <= 0 || height <= 0) return null;

  const maxW = width * FIT_RATIO;
  const maxH = height * FIT_RATIO;

  let bounds = font.measureText(text);
  const scale = Math.min(
    maxW / (bounds.width || 1),
    maxH / (bounds.height || 1),
  );

  if (autoFit || scale < 1) {
    font.setSize(Math.max(6, font.getSize() * scale));
    bounds = font.measureText(text);
  }

  const surface = Skia.Surface.Make(Math.ceil(width), Math.ceil(height));

  if (!surface) return null;

  const canvas = surface.getCanvas();
  const paint = Skia.Paint();
  paint.setColor(Skia.Color("white"));
  paint.setAntiAlias(true);

  canvas.clear(Skia.Color("transparent"));
  canvas.drawText(
    text,
    (width - bounds.width) / 2 - bounds.x,
    (height - bounds.height) / 2 - bounds.y,
    paint,
    font,
  );
  surface.flush();

  const image = surface.makeImageSnapshot();
  const pixels = image.readPixels();

  if (!pixels) return null;

  const rowStride = image.width();
  const gap = Math.max(1, Math.round(SAMPLE_GAP_BASE / Math.max(1, density)));

  let hits = 0;

  for (let y = 0; y < height; y += gap) {
    for (let x = 0; x < width; x += gap) {
      if ((pixels[(y * rowStride + x) * 4 + 3] as number) > ALPHA_CUTOFF)
        hits++;
    }
  }

  if (hits === 0) return null;

  const skip = hits > maxParticles ? Math.ceil(hits / maxParticles) : 1;
  const size = Math.min(hits, maxParticles);

  const ox = new Float32Array(size);
  const oy = new Float32Array(size);
  const sx = new Float32Array(size);
  const sy = new Float32Array(size);
  const seed = new Float32Array(size);
  const phase = new Float32Array(size);

  const ring = Math.max(width, height);
  const cx = width / 2;
  const cy = height / 2;

  let i = 0;
  let seen = 0;

  for (let y = 0; y < height && i < size; y += gap) {
    for (let x = 0; x < width && i < size; x += gap) {
      if ((pixels[(y * rowStride + x) * 4 + 3] as number) <= ALPHA_CUTOFF)
        continue;

      if (seen++ % skip !== 0) continue;

      const angle = Math.random() * Math.PI * 2;
      const radius =
        ring * (SPAWN_RING_MIN + Math.random() * SPAWN_RING_SPREAD);

      ox[i] = x;
      oy[i] = y;
      sx[i] = cx + Math.cos(angle) * radius;
      sy[i] = cy + Math.sin(angle) * radius;
      seed[i] = Math.random();
      phase[i] = Math.random() * Math.PI * 2;
      i++;
    }
  }

  return { count: i, ox, oy, sx, sy, seed, phase };
}

export { resolveFont, deriveFont, buildAtlas, sampleField };
