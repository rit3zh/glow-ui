import { MIN_PROJECTION_DENOMINATOR } from "./const";

const TAU = Math.PI * 2;

function radiusOf(circumference: number): number {
  "worklet";
  return circumference / TAU;
}

function tiledFaceWidth(
  radius: number,
  faceCount: number,
  gap: number,
): number {
  "worklet";
  return Math.max((TAU * radius) / Math.max(faceCount, 1) - gap, 1);
}

function stepOf(faceCount: number): number {
  "worklet";
  return 360 / Math.max(faceCount, 1);
}

function degreesPerPixel(radius: number): number {
  "worklet";
  return 180 / (Math.PI * Math.max(radius, 1));
}

function faceAngle(index: number, rotation: number, step: number): number {
  "worklet";
  return rotation + index * step;
}

function projectFace(
  angle: number,
  radius: number,
  perspective: number,
): {
  matrix: number[];
  depth: number;
  scale: number;
  facing: number;
} {
  "worklet";
  const radians = (angle * Math.PI) / 180;
  const cos = Math.cos(radians);
  const sin = Math.sin(radians);

  const distance = Math.max(perspective, MIN_PROJECTION_DENOMINATOR);
  const depth = radius * cos;
  const scale =
    distance / Math.max(distance - depth, MIN_PROJECTION_DENOMINATOR);

  return {
    matrix: [
      cos,
      0,
      -sin,
      sin / distance,
      0,
      1,
      0,
      0,
      sin,
      0,
      cos,
      -cos / distance,
      sin * radius,
      0,
      depth,
      1 - depth / distance,
    ],
    depth,
    scale,

    facing: depth - (radius * radius) / distance,
  };
}

function frontIndex(rotation: number, step: number, faceCount: number): number {
  "worklet";
  if (faceCount <= 0) return 0;
  const index = Math.round(-rotation / step) % faceCount;
  return index < 0 ? index + faceCount : index;
}

function snapRotation(rotation: number, step: number): number {
  "worklet";
  return Math.round(rotation / step) * step;
}

function rotationForIndex(index: number, step: number): number {
  "worklet";
  return -index * step;
}

export {
  degreesPerPixel,
  faceAngle,
  frontIndex,
  projectFace,
  radiusOf,
  rotationForIndex,
  snapRotation,
  stepOf,
  tiledFaceWidth,
};
