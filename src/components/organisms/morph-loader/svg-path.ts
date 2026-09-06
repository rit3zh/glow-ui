import type { Cubic } from "./cubic";
import type { RoundedPolygon } from "./polygon";

function toPathD(cubics: Cubic[], size = 100): string {
  if (cubics.length === 0) {
    return "";
  }

  const s = size;
  const parts: string[] = [
    `M${(cubics[0].anchor0X * s).toFixed(2)},${(cubics[0].anchor0Y * s).toFixed(2)}`,
  ];

  for (const c of cubics) {
    parts.push(
      `C${(c.control0X * s).toFixed(2)},${(c.control0Y * s).toFixed(2)} ${(c.control1X * s).toFixed(2)},${(c.control1Y * s).toFixed(2)} ${(c.anchor1X * s).toFixed(2)},${(c.anchor1Y * s).toFixed(2)}`,
    );
  }

  parts.push("Z");
  return parts.join("");
}

function toSvgPath(polygon: RoundedPolygon, size = 100): string {
  return toPathD(polygon.cubics, size);
}

export { toPathD, toSvgPath };
