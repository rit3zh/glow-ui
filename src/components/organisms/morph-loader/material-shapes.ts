import { FLOAT_PI } from "./const";
import {
  cornerRounding,
  createCircle,
  createPolygonFromVertices,
  createRectangle,
  createStar,
  unrounded,
} from "./polygon";
import type { RoundedPolygon } from "./polygon";
import type { CornerRounding, PointNRound } from "./types";

function pnr(x: number, y: number, r: CornerRounding = unrounded): PointNRound {
  return { x, y, r };
}

function angleDegrees(x: number, y: number): number {
  return (Math.atan2(y, x) * 180) / FLOAT_PI;
}

function toRadians(degrees: number): number {
  return (degrees / 360) * 2 * FLOAT_PI;
}

function distancePt(x: number, y: number): number {
  return Math.sqrt(x * x + y * y);
}

function rotateDegrees(
  px: number,
  py: number,
  angle: number,
  cx = 0,
  cy = 0,
): [number, number] {
  const a = toRadians(angle);
  const ox = px - cx;
  const oy = py - cy;
  return [
    ox * Math.cos(a) - oy * Math.sin(a) + cx,
    ox * Math.sin(a) + oy * Math.cos(a) + cy,
  ];
}

function doRepeatMirrored(
  points: PointNRound[],
  reps: number,
  centerX: number,
  centerY: number,
): PointNRound[] {
  const angles = points.map((p) => angleDegrees(p.x - centerX, p.y - centerY));
  const distances = points.map((p) => distancePt(p.x - centerX, p.y - centerY));
  const actualReps = reps * 2;
  const sectionAngle = 360 / actualReps;
  const result: PointNRound[] = [];

  for (let it = 0; it < actualReps; it++) {
    const mirrored = it % 2 !== 0;
    for (let index = 0; index < points.length; index++) {
      const i = mirrored ? points.length - 1 - index : index;
      if (i > 0 || !mirrored) {
        const angleOffset = mirrored
          ? sectionAngle - angles[i] + 2 * angles[0]
          : angles[i];
        const a = toRadians(sectionAngle * it + angleOffset);
        const finalX = Math.cos(a) * distances[i] + centerX;
        const finalY = Math.sin(a) * distances[i] + centerY;
        result.push(pnr(finalX, finalY, points[i].r));
      }
    }
  }
  return result;
}

function doRepeatRotated(
  points: PointNRound[],
  reps: number,
  centerX: number,
  centerY: number,
): PointNRound[] {
  const np = points.length;
  const result: PointNRound[] = [];
  for (let it = 0; it < np * reps; it++) {
    const srcPoint = points[it % np];
    const [rx, ry] = rotateDegrees(
      srcPoint.x,
      srcPoint.y,
      Math.floor(it / np) * (360 / reps),
      centerX,
      centerY,
    );
    result.push(pnr(rx, ry, srcPoint.r));
  }
  return result;
}

function doRepeat(
  points: PointNRound[],
  reps: number,
  centerX: number,
  centerY: number,
  mirroring: boolean,
): PointNRound[] {
  if (mirroring) {
    return doRepeatMirrored(points, reps, centerX, centerY);
  }
  return doRepeatRotated(points, reps, centerX, centerY);
}

function customPolygon(
  points: PointNRound[],
  reps: number,
  centerX = 0.5,
  centerY = 0.5,
  mirroring = false,
): RoundedPolygon {
  const actualPoints = doRepeat(points, reps, centerX, centerY, mirroring);
  const vertices: number[] = [];
  const pvRounding: CornerRounding[] = [];
  for (const p of actualPoints) {
    vertices.push(p.x, p.y);
    pvRounding.push(p.r);
  }
  return createPolygonFromVertices(
    vertices,
    unrounded,
    pvRounding,
    centerX,
    centerY,
  );
}

function rotatePolygon(
  polygon: RoundedPolygon,
  degrees: number,
): RoundedPolygon {
  const rad = toRadians(degrees);
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);
  return polygon.transformed((x, y) => ({
    x: x * cos - y * sin,
    y: x * sin + y * cos,
  }));
}

const r15 = cornerRounding(0.15);
const r20 = cornerRounding(0.2);
const r30 = cornerRounding(0.3);
const r50 = cornerRounding(0.5);
const r100 = cornerRounding(1);

function circle(): RoundedPolygon {
  return createCircle(10);
}

function square(): RoundedPolygon {
  return createRectangle(1, 1, r30);
}

function slanted(): RoundedPolygon {
  return customPolygon(
    [
      pnr(0.926, 0.97, cornerRounding(0.189, 0.811)),
      pnr(-0.021, 0.967, cornerRounding(0.187, 0.057)),
    ],
    2,
  );
}

function arch(): RoundedPolygon {
  return rotatePolygon(
    createPolygonFromVertices(
      (() => {
        const r = 1;
        const verts: number[] = [];
        for (let i = 0; i < 4; i++) {
          const angle = (FLOAT_PI / 4) * 2 * i;
          verts.push(Math.cos(angle) * r, Math.sin(angle) * r);
        }
        return verts;
      })(),
      unrounded,
      [r100, r100, r20, r20],
      0,
      0,
    ),
    -135,
  );
}

function fan(): RoundedPolygon {
  return customPolygon(
    [
      pnr(1.004, 1.0, cornerRounding(0.148, 0.417)),
      pnr(0.0, 1.0, cornerRounding(0.151)),
      pnr(0.0, -0.003, cornerRounding(0.148)),
      pnr(0.978, 0.02, cornerRounding(0.803)),
    ],
    1,
  );
}

function arrow(): RoundedPolygon {
  return customPolygon(
    [
      pnr(0.5, 0.892, cornerRounding(0.313)),
      pnr(-0.216, 1.05, cornerRounding(0.207)),
      pnr(0.499, -0.16, cornerRounding(0.215, 1.0)),
      pnr(1.225, 1.06, cornerRounding(0.211)),
    ],
    1,
  );
}

function semiCircle(): RoundedPolygon {
  return createRectangle(1.6, 1, unrounded, [r20, r20, r100, r100]);
}

function oval(): RoundedPolygon {
  const scaled = createCircle().transformed((x, y) => ({ x, y: y * 0.64 }));
  return rotatePolygon(scaled, -45);
}

function pill(): RoundedPolygon {
  return customPolygon(
    [
      pnr(0.961, 0.039, cornerRounding(0.426)),
      pnr(1.001, 0.428),
      pnr(1.0, 0.609, cornerRounding(1.0)),
    ],
    2,
    0.5,
    0.5,
    true,
  );
}

function triangle(): RoundedPolygon {
  return rotatePolygon(
    createPolygonFromVertices(
      (() => {
        const verts: number[] = [];
        for (let i = 0; i < 3; i++) {
          verts.push(
            Math.cos((FLOAT_PI / 3) * 2 * i),
            Math.sin((FLOAT_PI / 3) * 2 * i),
          );
        }
        return verts;
      })(),
      r20,
      null,
      0,
      0,
    ),
    -90,
  );
}

function diamond(): RoundedPolygon {
  return customPolygon(
    [
      pnr(0.5, 1.096, cornerRounding(0.151, 0.524)),
      pnr(0.04, 0.5, cornerRounding(0.159)),
    ],
    2,
  );
}

function clamShell(): RoundedPolygon {
  return customPolygon(
    [
      pnr(0.171, 0.841, cornerRounding(0.159)),
      pnr(-0.02, 0.5, cornerRounding(0.14)),
      pnr(0.17, 0.159, cornerRounding(0.159)),
    ],
    2,
  );
}

function pentagon(): RoundedPolygon {
  return customPolygon(
    [
      pnr(0.5, -0.009, cornerRounding(0.172)),
      pnr(1.03, 0.365, cornerRounding(0.164)),
      pnr(0.828, 0.97, cornerRounding(0.169)),
    ],
    1,
    0.5,
    0.5,
    true,
  );
}

function gem(): RoundedPolygon {
  return customPolygon(
    [
      pnr(0.499, 1.023, cornerRounding(0.241, 0.778)),
      pnr(-0.005, 0.792, cornerRounding(0.208)),
      pnr(0.073, 0.258, cornerRounding(0.228)),
      pnr(0.433, 0.0, cornerRounding(0.491)),
    ],
    1,
    0.5,
    0.5,
    true,
  );
}

function sunny(): RoundedPolygon {
  return createStar(8, 1, 0.8, r15);
}

function verySunny(): RoundedPolygon {
  return customPolygon(
    [
      pnr(0.5, 1.08, cornerRounding(0.085)),
      pnr(0.358, 0.843, cornerRounding(0.085)),
    ],
    8,
  );
}

function cookie4(): RoundedPolygon {
  return customPolygon(
    [
      pnr(1.237, 1.236, cornerRounding(0.258)),
      pnr(0.5, 0.918, cornerRounding(0.233)),
    ],
    4,
  );
}

function cookie6(): RoundedPolygon {
  return customPolygon(
    [
      pnr(0.723, 0.884, cornerRounding(0.394)),
      pnr(0.5, 1.099, cornerRounding(0.398)),
    ],
    6,
  );
}

function cookie7(): RoundedPolygon {
  return rotatePolygon(createStar(7, 1, 0.75, r50), -90);
}

function cookie9(): RoundedPolygon {
  return rotatePolygon(createStar(9, 1, 0.8, r50), -90);
}

function cookie12(): RoundedPolygon {
  return rotatePolygon(createStar(12, 1, 0.8, r50), -90);
}

function ghostish(): RoundedPolygon {
  return customPolygon(
    [
      pnr(0.5, 0, cornerRounding(1.0)),
      pnr(1, 0, cornerRounding(1.0)),
      pnr(1, 1.14, cornerRounding(0.254, 0.106)),
      pnr(0.575, 0.906, cornerRounding(0.253)),
    ],
    1,
    0.5,
    0.5,
    true,
  );
}

function clover4(): RoundedPolygon {
  return customPolygon(
    [pnr(0.5, 0.074), pnr(0.725, -0.099, cornerRounding(0.476))],
    4,
    0.5,
    0.5,
    true,
  );
}

function clover8(): RoundedPolygon {
  return customPolygon(
    [pnr(0.5, 0.036), pnr(0.758, -0.101, cornerRounding(0.209))],
    8,
  );
}

function burst(): RoundedPolygon {
  return customPolygon(
    [
      pnr(0.5, -0.006, cornerRounding(0.006)),
      pnr(0.592, 0.158, cornerRounding(0.006)),
    ],
    12,
  );
}

function softBurst(): RoundedPolygon {
  return customPolygon(
    [
      pnr(0.193, 0.277, cornerRounding(0.053)),
      pnr(0.176, 0.055, cornerRounding(0.053)),
    ],
    10,
  );
}

function boom(): RoundedPolygon {
  return customPolygon(
    [
      pnr(0.457, 0.296, cornerRounding(0.007)),
      pnr(0.5, -0.051, cornerRounding(0.007)),
    ],
    15,
  );
}

function softBoom(): RoundedPolygon {
  return customPolygon(
    [
      pnr(0.733, 0.454),
      pnr(0.839, 0.437, cornerRounding(0.532)),
      pnr(0.949, 0.449, cornerRounding(0.439, 1.0)),
      pnr(0.998, 0.478, cornerRounding(0.174)),
    ],
    16,
    0.5,
    0.5,
    true,
  );
}

function flower(): RoundedPolygon {
  return customPolygon(
    [
      pnr(0.37, 0.187),
      pnr(0.416, 0.049, cornerRounding(0.381)),
      pnr(0.479, 0.001, cornerRounding(0.095)),
    ],
    8,
    0.5,
    0.5,
    true,
  );
}

function puffy(): RoundedPolygon {
  const base = customPolygon(
    [
      pnr(0.5, 0.053),
      pnr(0.545, -0.04, cornerRounding(0.405)),
      pnr(0.67, -0.035, cornerRounding(0.426)),
      pnr(0.717, 0.066, cornerRounding(0.574)),
      pnr(0.722, 0.128),
      pnr(0.777, 0.002, cornerRounding(0.36)),
      pnr(0.914, 0.149, cornerRounding(0.66)),
      pnr(0.926, 0.289, cornerRounding(0.66)),
      pnr(0.881, 0.346),
      pnr(0.94, 0.344, cornerRounding(0.126)),
      pnr(1.003, 0.437, cornerRounding(0.255)),
    ],
    2,
    0.5,
    0.5,
    true,
  );
  return base.transformed((x, y) => ({ x, y: y * 0.742 }));
}

function puffyDiamond(): RoundedPolygon {
  return customPolygon(
    [
      pnr(0.87, 0.13, cornerRounding(0.146)),
      pnr(0.818, 0.357),
      pnr(1.0, 0.332, cornerRounding(0.853)),
    ],
    4,
    0.5,
    0.5,
    true,
  );
}

function pixelCircle(): RoundedPolygon {
  return customPolygon(
    [
      pnr(0.5, 0.0),
      pnr(0.704, 0.0),
      pnr(0.704, 0.065),
      pnr(0.843, 0.065),
      pnr(0.843, 0.148),
      pnr(0.926, 0.148),
      pnr(0.926, 0.296),
      pnr(1.0, 0.296),
    ],
    2,
    0.5,
    0.5,
    true,
  );
}

function pixelTriangle(): RoundedPolygon {
  return customPolygon(
    [
      pnr(0.11, 0.5),
      pnr(0.113, 0.0),
      pnr(0.287, 0.0),
      pnr(0.287, 0.087),
      pnr(0.421, 0.087),
      pnr(0.421, 0.17),
      pnr(0.56, 0.17),
      pnr(0.56, 0.265),
      pnr(0.674, 0.265),
      pnr(0.675, 0.344),
      pnr(0.789, 0.344),
      pnr(0.789, 0.439),
      pnr(0.888, 0.439),
    ],
    1,
    0.5,
    0.5,
    true,
  );
}

function bun(): RoundedPolygon {
  return customPolygon(
    [
      pnr(0.796, 0.5),
      pnr(0.853, 0.518, cornerRounding(1)),
      pnr(0.992, 0.631, cornerRounding(1)),
      pnr(0.968, 1.0, cornerRounding(1)),
    ],
    2,
    0.5,
    0.5,
    true,
  );
}

function heart(): RoundedPolygon {
  return customPolygon(
    [
      pnr(0.5, 0.268, cornerRounding(0.016)),
      pnr(0.792, -0.066, cornerRounding(0.958)),
      pnr(1.064, 0.276, cornerRounding(1.0)),
      pnr(0.501, 0.946, cornerRounding(0.129)),
    ],
    1,
    0.5,
    0.5,
    true,
  );
}

export {
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
};
