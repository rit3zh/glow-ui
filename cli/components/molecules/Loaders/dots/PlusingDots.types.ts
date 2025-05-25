interface Gradient {
  from?: string;
  to?: string;
}

export interface PulsingDotsProps {
  dotCount?: number;
  radius?: number;
  spacing?: number;
  duration?: number;
  color?: string;
  gradient?: Gradient[];
}
