import { MAX_COLORS } from "./const";

function parseColor<T extends string>(input: T): [number, number, number] {
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

function buildPalette<T extends string>(
  colors: T[],
): { flat: number[]; count: number } {
  const list = colors.slice(0, MAX_COLORS).map(parseColor);
  const count = Math.max(2, list.length);
  const flat: number[] = [];
  for (let i = 0; i < MAX_COLORS; i++) {
    const c = list[i] ?? list[list.length - 1];
    flat.push(c[0], c[1], c[2]);
  }
  return { flat, count };
}

export { parseColor, buildPalette };
