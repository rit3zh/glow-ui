import type { IDiaGradient } from "./types";

function buildSweepGradient(
  width: number,
  band: number,
  sweepColors: readonly string[],
  baseColor: string,
): IDiaGradient {
  const total = width * 2 + band;
  const bandStart = width / total;
  const bandEnd = (width + band) / total;

  const colors: string[] = [baseColor, baseColor];
  const locations: number[] = [0, bandStart];

  const count = sweepColors.length;
  sweepColors.forEach((color, index) => {
    const t =
      count === 1
        ? (bandStart + bandEnd) / 2
        : bandStart + (index / (count - 1)) * (bandEnd - bandStart);
    colors.push(color);
    locations.push(t);
  });

  colors.push("transparent", "transparent");
  locations.push(bandEnd, 1);

  return { colors, locations };
}

function sweepStripWidth<T extends number>(width: T, band: number): number {
  return width * 2 + band;
}

function sweepStartOffset<T extends number>(width: T, band: number): number {
  "worklet";
  return -(width + band);
}

export { buildSweepGradient, sweepStartOffset, sweepStripWidth };
