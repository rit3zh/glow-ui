import type { RoundedPolygon } from "./polygon";
import type { ShapeFactory } from "./types";
import {
  circle,
  square,
  slanted,
  arch,
  fan,
  arrow,
  semiCircle,
  oval,
  pill,
  triangle,
  diamond,
  clamShell,
  pentagon,
  gem,
  sunny,
  verySunny,
  cookie4,
  cookie6,
  cookie7,
  cookie9,
  cookie12,
  ghostish,
  clover4,
  clover8,
  burst,
  softBurst,
  boom,
  softBoom,
  flower,
  puffy,
  puffyDiamond,
  pixelCircle,
  pixelTriangle,
  bun,
  heart,
} from "./material-shapes";

const shapeFactories = {
  circle,
  square,
  slanted,
  arch,
  fan,
  arrow,
  "semi-circle": semiCircle,
  oval,
  pill,
  triangle,
  diamond,
  "clam-shell": clamShell,
  pentagon,
  gem,
  sunny,
  "very-sunny": verySunny,
  "cookie-4-sided": cookie4,
  "cookie-6-sided": cookie6,
  "cookie-7-sided": cookie7,
  "cookie-9-sided": cookie9,
  "cookie-12-sided": cookie12,
  ghostish,
  "clover-4-leaf": clover4,
  "clover-8-leaf": clover8,
  burst,
  "soft-burst": softBurst,
  boom,
  "soft-boom": softBoom,
  flower,
  puffy,
  "puffy-diamond": puffyDiamond,
  "pixel-circle": pixelCircle,
  "pixel-triangle": pixelTriangle,
  bun,
  heart,
} satisfies Record<string, ShapeFactory>;

type ShapeName = keyof typeof shapeFactories;

const shapeNames: ShapeName[] = Object.keys(shapeFactories) as ShapeName[];

const cache = new Map<ShapeName, RoundedPolygon>();

function getShape(name: ShapeName): RoundedPolygon {
  let shape = cache.get(name);
  if (!shape) {
    const factory = shapeFactories[name];
    shape = factory().normalized();
    cache.set(name, shape);
  }
  return shape;
}

export { type ShapeName, shapeNames, getShape };
