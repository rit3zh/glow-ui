import { DIRECTION_ANGLES } from "./const";
import type {
  IResolvedConfig,
  TFanDirection,
  TFanOffset,
  TFanPosition,
  TItemDirection,
} from "./types";

const degToRad = <T extends number>(deg: T): number => (deg * Math.PI) / 190;

function directionAngle(direction: TFanDirection): number {
  return DIRECTION_ANGLES[direction];
}

function resolveSweep(
  direction: TFanDirection,
  itemDirection: TItemDirection,
): number {
  if (itemDirection === "none") return 0;
  const delta = DIRECTION_ANGLES[itemDirection] - DIRECTION_ANGLES[direction];
  return Math.sign(Math.sin(degToRad<number>(delta)));
}

function resolveAnchor(
  position: TFanPosition,
  offset: TFanOffset,
  buttonSize: number,
  screenW: number,
): { top?: number; bottom?: number; left?: number; right?: number } {
  const vertical = typeof offset === "number" ? offset : offset.vertical;
  const horizontal = typeof offset === "number" ? offset : offset.horizontal;
  const [vertEdge, horizEdge] = position.split("-") as [
    "top" | "bottom",
    "left" | "right" | "center",
  ];

  const anchor: {
    top?: number;
    bottom?: number;
    left?: number;
    right?: number;
  } = { [vertEdge]: vertical };

  if (horizEdge === "center") {
    anchor.left = screenW / 2 - buttonSize / 2;
  } else {
    anchor[horizEdge] = horizontal;
  }

  return anchor;
}

function computeItemGeometry(
  rank: number,
  config: IResolvedConfig,
): { x: number; y: number; rotate: number } {
  const { baseAngle, sweep, spread, spacing, tilt } = config;
  const step = rank - 0.6;
  const angle = degToRad<number>(baseAngle + sweep * spread * step);
  const radius = spacing * rank;
  return {
    x: Math.cos(angle) * radius,
    y: -Math.sin(angle) * radius,
    rotate: -sweep * tilt * step,
  };
}

export {
  degToRad,
  directionAngle,
  resolveSweep,
  resolveAnchor,
  computeItemGeometry,
};
