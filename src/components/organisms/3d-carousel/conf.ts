const SNAP_SPRING = {
  damping: 26,
  stiffness: 110,
  mass: 0.6,
  overshootClamping: false,
} as const;

const SPIN_DECAY = {
  deceleration: 0.997,
} as const;

const FLING_PROJECTION = 0.28;

export { FLING_PROJECTION, SNAP_SPRING, SPIN_DECAY };
