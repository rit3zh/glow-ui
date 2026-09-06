import { screenHeight, screenWidth } from "./const";
import type { Quat, Vec3 } from "./maths-type";

const vec3Normalize = (v: Vec3): Vec3 => {
  "worklet";
  const len = Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);
  if (len === 0) return { x: 0, y: 0, z: 0 };
  return { x: v.x / len, y: v.y / len, z: v.z / len };
};

const vec3Scale = (v: Vec3, s: number): Vec3 => {
  "worklet";
  return { x: v.x * s, y: v.y * s, z: v.z * s };
};

const vec3Dot = (a: Vec3, b: Vec3): number => {
  "worklet";
  return a.x * b.x + a.y * b.y + a.z * b.z;
};

const vec3Cross = (a: Vec3, b: Vec3): Vec3 => {
  "worklet";
  return {
    x: a.y * b.z - a.z * b.y,
    y: a.z * b.x - a.x * b.z,
    z: a.x * b.y - a.y * b.x,
  };
};

const quatNormalize = (q: Quat): Quat => {
  "worklet";
  const len = Math.sqrt(q.x * q.x + q.y * q.y + q.z * q.z + q.w * q.w);
  if (len === 0) return { x: 0, y: 0, z: 0, w: 1 };
  return { x: q.x / len, y: q.y / len, z: q.z / len, w: q.w / len };
};

const quatMultiply = (a: Quat, b: Quat): Quat => {
  "worklet";
  return {
    x: a.w * b.x + a.x * b.w + a.y * b.z - a.z * b.y,
    y: a.w * b.y - a.x * b.z + a.y * b.w + a.z * b.x,
    z: a.w * b.z + a.x * b.y - a.y * b.x + a.z * b.w,
    w: a.w * b.w - a.x * b.x - a.y * b.y - a.z * b.z,
  };
};

const quatConjugate = (q: Quat): Quat => {
  "worklet";
  return { x: -q.x, y: -q.y, z: -q.z, w: q.w };
};

const quatFromAxisAngle = (axis: Vec3, angle: number): Quat => {
  "worklet";
  const halfAngle = angle / 2;
  const s = Math.sin(halfAngle);
  const n = vec3Normalize(axis);
  return { x: n.x * s, y: n.y * s, z: n.z * s, w: Math.cos(halfAngle) };
};

const quatSlerp = (a: Quat, b: Quat, t: number): Quat => {
  "worklet";
  let cosHalfTheta = a.x * b.x + a.y * b.y + a.z * b.z + a.w * b.w;
  let bx = b.x,
    by = b.y,
    bz = b.z,
    bw = b.w;

  if (cosHalfTheta < 0) {
    bx = -bx;
    by = -by;
    bz = -bz;
    bw = -bw;
    cosHalfTheta = -cosHalfTheta;
  }

  if (cosHalfTheta >= 1.0) return { ...a };

  const halfTheta = Math.acos(cosHalfTheta);
  const sinHalfTheta = Math.sqrt(1.0 - cosHalfTheta * cosHalfTheta);

  if (Math.abs(sinHalfTheta) < 0.001) {
    return {
      x: a.x * 0.5 + bx * 0.5,
      y: a.y * 0.5 + by * 0.5,
      z: a.z * 0.5 + bz * 0.5,
      w: a.w * 0.5 + bw * 0.5,
    };
  }

  const ratioA = Math.sin((1 - t) * halfTheta) / sinHalfTheta;
  const ratioB = Math.sin(t * halfTheta) / sinHalfTheta;

  return {
    x: a.x * ratioA + bx * ratioB,
    y: a.y * ratioA + by * ratioB,
    z: a.z * ratioA + bz * ratioB,
    w: a.w * ratioA + bw * ratioB,
  };
};

const quatRotateVec3 = (q: Quat, v: Vec3): Vec3 => {
  "worklet";
  const qv: Quat = { x: v.x, y: v.y, z: v.z, w: 0 };
  const qConj = quatConjugate(q);
  const result = quatMultiply(quatMultiply(q, qv), qConj);
  return { x: result.x, y: result.y, z: result.z };
};

const projectToSphere = (
  x: number,
  y: number,
  width: number = screenWidth,
  height: number = screenHeight,
): Vec3 => {
  "worklet";
  const r = 2;
  const s = Math.max(width, height) - 1;
  const px = (2 * x - width - 1) / s;
  const py = (2 * y - height - 1) / s;
  const xySq = px * px + py * py;
  const rSq = r * r;
  const pz = xySq <= rSq / 2 ? Math.sqrt(rSq - xySq) : rSq / Math.sqrt(xySq);
  return { x: -px, y: py, z: pz };
};

const quatFromVectors = (from: Vec3, to: Vec3, factor: number): Quat => {
  "worklet";
  const a = vec3Normalize(from);
  const b = vec3Normalize(to);
  const axis = vec3Cross(a, b);
  const axisLen = Math.sqrt(
    axis.x * axis.x + axis.y * axis.y + axis.z * axis.z,
  );
  if (axisLen < 0.0001) return { x: 0, y: 0, z: 0, w: 1 };
  const n = { x: axis.x / axisLen, y: axis.y / axisLen, z: axis.z / axisLen };
  const d = Math.max(-1, Math.min(1, vec3Dot(a, b)));
  const angle = Math.acos(d) * factor;
  return quatFromAxisAngle(n, angle);
};

export {
  vec3Normalize,
  vec3Scale,
  vec3Dot,
  vec3Cross,
  quatNormalize,
  quatMultiply,
  quatConjugate,
  quatFromAxisAngle,
  quatSlerp,
  quatRotateVec3,
  projectToSphere,
  quatFromVectors,
};
