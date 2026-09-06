import { MAX_STOPS } from "./const";
import type { TRGB, IStopData } from "./types";

function parseColor<T extends string>(input: T): TRGB {
  const s = input.trim();
  if (s.startsWith("#")) {
    let hex = s.slice(1);
    if (hex.length === 3) {
      hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    const n = parseInt(hex, 16);
    return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
  }
  const m = s.match(/rgba?\(([^)]+)\)/i);
  if (m) {
    const parts = m[1].split(",").map((v) => parseFloat(v));
    return [
      (parts[0] || 0) / 255,
      (parts[1] || 0) / 255,
      (parts[2] || 0) / 255,
    ];
  }
  return [1, 1, 1];
}

function buildStops(
  colors: string[],
  baseColor: string,
  bandGap: number,
  bandCount: number,
): IStopData {
  const base = parseColor(baseColor);
  const palette = colors.length ? colors : ["#ffffff"];

  const positions: number[] = [0];
  const rgb: TRGB[] = [base];

  const bands = Math.min(bandCount, palette.length * 2, MAX_STOPS - 2);
  for (let i = 0; i < bands; i++) {
    positions.push((i + 2) * bandGap);
    rgb.push(parseColor(palette[i % palette.length]));
  }

  positions.push((bands + 2) * bandGap);
  rgb.push(base);

  const count = positions.length;

  const lastPos = positions[positions.length - 1];
  const lastCol = rgb[rgb.length - 1];
  const outPos: number[] = [];
  const outCol: number[] = [];
  for (let i = 0; i < MAX_STOPS; i++) {
    const p = positions[i] ?? lastPos;
    const c = rgb[i] ?? lastCol;
    outPos.push(p);
    outCol.push(c[0], c[1], c[2]);
  }

  return { positions: outPos, colors: outCol, count };
}

export { parseColor, buildStops };
