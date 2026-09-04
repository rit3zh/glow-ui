import { Platform, type TextStyle } from "react-native";
import {
  FillType,
  Skia,
  matchFont,
  type SkFont,
  type SkPath,
} from "@shopify/react-native-skia";

import {
  CANVAS_FIT,
  CANVAS_SIZE,
  MAX_CHARSET,
  MAX_TILE,
  MIN_STRIDE,
  OPAQUE_AT,
  TILE_PADDING,
} from "./const";
import { SWARM_FORMS } from "./forms";
import { readOutline } from "./svg";
import type {
  ISwarmAtlas,
  ISwarmCloud,
  ISwarmForm,
  ISwarmScatter,
  TSwarmForm,
  TSwarmPreset,
} from "./types";
function seededRandom(seed: number): () => number {
  let state = seed >>> 0 || 1;

  return () => {
    state ^= state << 13;
    state >>>= 0;
    state ^= state >> 17;
    state ^= state << 5;
    state >>>= 0;

    return state / 4294967296;
  };
}

function findTypeface(
  family: string | undefined,
  size: number,
  weight: TextStyle["fontWeight"],
): SkFont | null {
  const name =
    family ??
    Platform.select({
      ios: "Menlo",
      android: "monospace",
      default: "monospace",
    });

  try {
    return matchFont({
      fontFamily: name,
      fontSize: size,
      fontWeight: weight as never,
    });
  } catch {
    const numeric =
      weight === "bold"
        ? 700
        : weight === "normal" || weight === undefined
          ? 400
          : parseInt(String(weight), 10) || 400;

    const typeface = Skia.FontMgr.System().matchFamilyStyle(name, {
      weight: numeric,
    });

    return typeface ? Skia.Font(typeface, size) : null;
  }
}

function sizeTypeface(
  loaded: SkFont | null | undefined,
  family: string | undefined,
  size: number,
  weight: TextStyle["fontWeight"],
): SkFont | null {
  if (loaded) {
    const typeface = loaded.getTypeface();

    return typeface ? Skia.Font(typeface, size) : null;
  }

  return findTypeface(family, size, weight);
}

function dedupeCharset(charset: string): string[] {
  const seen = new Set<string>();
  const kept: string[] = [];

  for (const character of charset) {
    if (character === " " || seen.has(character)) continue;

    seen.add(character);
    kept.push(character);

    if (kept.length >= MAX_CHARSET) break;
  }

  return kept;
}

function buildLetterAtlas(
  charset: string,
  palette: string[],
  font: SkFont,
): ISwarmAtlas | null {
  const characters = dedupeCharset(charset);

  if (characters.length === 0 || palette.length === 0) return null;

  const tile = Math.min(
    MAX_TILE,
    Math.max(8, Math.ceil(font.getSize() * TILE_PADDING)),
  );

  const surface = Skia.Surface.Make(
    tile * characters.length,
    tile * palette.length,
  );

  if (!surface) return null;

  const canvas = surface.getCanvas();
  const paint = Skia.Paint();
  paint.setAntiAlias(true);

  canvas.clear(Skia.Color("transparent"));

  const rects = [];

  for (let row = 0; row < palette.length; row++) {
    paint.setColor(Skia.Color(palette[row]!));

    for (let column = 0; column < characters.length; column++) {
      const glyph = characters[column]!;
      const bounds = font.measureText(glyph);
      const left = column * tile;
      const top = row * tile;

      canvas.drawText(
        glyph,
        left + (tile - bounds.width) / 2 - bounds.x,
        top + (tile - bounds.height) / 2 - bounds.y,
        paint,
        font,
      );

      rects.push(Skia.XYWHRect(left, top, tile, tile));
    }
  }

  surface.flush();

  return { image: surface.makeImageSnapshot(), tile, rects };
}

function isPreset(form: TSwarmForm): form is TSwarmPreset {
  return typeof form === "string" && form in SWARM_FORMS;
}

function resolveForm(form: TSwarmForm): ISwarmForm {
  if (isPreset(form)) return SWARM_FORMS[form];

  return typeof form === "string" ? { outline: form } : form;
}

function toPath(commands: string[]): SkPath | null {
  const parts = commands
    .map((command) => Skia.Path.MakeFromSVGString(command))
    .filter(Boolean) as SkPath[];

  if (parts.length === 0) return null;
  if (parts.length === 1) return parts[0]!;

  const merged = Skia.Path.Make();

  parts.forEach((part) => merged.addPath(part));

  return merged;
}

function scatterInside(
  form: ISwarmForm,
  stride: number,
  random: () => number,
): ISwarmScatter | null {
  const outline = readOutline(form.outline, form.box, form.fillRule);
  const path = toPath(outline.commands);

  if (!path) return null;

  if (outline.fillRule === "evenodd") path.setFillType(FillType.EvenOdd);

  const source = outline.box
    ? {
        x: outline.box[0],
        y: outline.box[1],
        width: outline.box[2],
        height: outline.box[3],
      }
    : path.computeTightBounds();

  const reach = Math.max(source.width, source.height);

  if (!(reach > 0)) return null;

  const frame = CANVAS_SIZE * CANVAS_FIT;
  const zoom = frame / reach;
  const middle = CANVAS_SIZE / 2;

  const surface = Skia.Surface.Make(CANVAS_SIZE, CANVAS_SIZE);

  if (!surface) return null;

  const canvas = surface.getCanvas();
  const paint = Skia.Paint();
  paint.setColor(Skia.Color("white"));
  paint.setAntiAlias(true);

  canvas.clear(Skia.Color("transparent"));
  canvas.save();
  canvas.translate(middle, middle);
  canvas.scale(zoom, zoom);
  canvas.translate(
    -(source.x + source.width / 2),
    -(source.y + source.height / 2),
  );
  canvas.drawPath(path, paint);
  canvas.restore();
  surface.flush();

  const pixels = surface.makeImageSnapshot().readPixels();

  if (!pixels) return null;

  const filled = new Uint8Array(CANVAS_SIZE * CANVAS_SIZE);

  let left = CANVAS_SIZE;
  let top = CANVAS_SIZE;
  let right = -1;
  let bottom = -1;

  for (let y = 0; y < CANVAS_SIZE; y++) {
    for (let x = 0; x < CANVAS_SIZE; x++) {
      const at = y * CANVAS_SIZE + x;

      if ((pixels[at * 4 + 3] as number) <= OPAQUE_AT) continue;

      filled[at] = 1;

      if (x < left) left = x;
      if (x > right) right = x;
      if (y < top) top = y;
      if (y > bottom) bottom = y;
    }
  }

  if (right < 0) return null;

  const step = Math.max(MIN_STRIDE, stride * frame);
  const xs: number[] = [];
  const ys: number[] = [];

  for (let y = top; y < bottom; y += step) {
    for (let x = left; x < right; x += step) {
      const jitterX = x + random() * step;
      const jitterY = y + random() * step;
      const column = jitterX | 0;
      const row = jitterY | 0;

      if (column < 0 || column >= CANVAS_SIZE) continue;
      if (row < 0 || row >= CANVAS_SIZE) continue;
      if (!filled[row * CANVAS_SIZE + column]) continue;

      xs.push((jitterX - middle) / frame);
      ys.push((jitterY - middle) / frame);
    }
  }

  if (xs.length === 0) return null;

  return {
    total: xs.length,
    x: Float32Array.from(xs),
    y: Float32Array.from(ys),
  };
}

function sortRadially(scatter: ISwarmScatter): number[] {
  return Array.from({ length: scatter.total }, (_, at) => at).sort((a, b) => {
    const bearing =
      Math.atan2(scatter.y[a]!, scatter.x[a]!) -
      Math.atan2(scatter.y[b]!, scatter.x[b]!);

    if (bearing !== 0) return bearing;

    return (
      Math.hypot(scatter.x[a]!, scatter.y[a]!) -
      Math.hypot(scatter.x[b]!, scatter.y[b]!)
    );
  });
}

function buildCloud(
  forms: readonly TSwarmForm[],
  stride: number,
  maxLetters: number,
  tiles: number,
  random: () => number,
): ISwarmCloud | null {
  if (forms.length === 0 || tiles <= 0) return null;

  const scattered = forms.map((form) =>
    scatterInside(resolveForm(form), stride, random),
  );

  const stand = scattered.find(Boolean);

  if (!stand) return null;

  const clouds = scattered.map((scatter) => scatter ?? stand);
  const letters = Math.min(
    maxLetters,
    ...clouds.map((scatter) => (scatter as ISwarmScatter).total),
  );

  if (letters <= 0) return null;

  const x = new Float32Array(clouds.length * letters);
  const y = new Float32Array(clouds.length * letters);

  clouds.forEach((scatter, form) => {
    const cloud = scatter as ISwarmScatter;
    const order = sortRadially(cloud);
    const base = form * letters;

    for (let i = 0; i < letters; i++) {
      const picked = order[Math.floor((i * cloud.total) / letters)]!;

      x[base + i] = cloud.x[picked]!;
      y[base + i] = cloud.y[picked]!;
    }
  });

  const drift = new Float32Array(letters);
  const phase = new Float32Array(letters);
  const tile = new Uint16Array(letters);

  for (let i = 0; i < letters; i++) {
    drift[i] = 0.55 + random() * 0.9;
    phase[i] = random() * Math.PI * 2;
    tile[i] = Math.min(tiles - 1, Math.floor(random() * tiles));
  }

  const startX = x.slice(0, letters);
  const startY = y.slice(0, letters);

  return {
    letters,
    forms: clouds.length,
    x,
    y,
    drift,
    phase,
    tile,
    nowX: startX.slice(),
    nowY: startY.slice(),
    startX,
    startY,
  };
}

export {
  seededRandom,
  findTypeface,
  sizeTypeface,
  dedupeCharset,
  buildLetterAtlas,
  isPreset,
  resolveForm,
  toPath,
  scatterInside,
  sortRadially,
  buildCloud,
};
