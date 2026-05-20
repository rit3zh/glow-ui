interface Gradient {
  from?: string;
  to?: string;
}

interface IPulsingDots {
  dotCount?: number;
  radius?: number;
  spacing?: number;
  duration?: number;
  color?: string;
  gradient?: Gradient[];
}

export type { IPulsingDots };
