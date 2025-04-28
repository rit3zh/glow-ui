export type BorderRadiusKey =
  | "none"
  | "sm"
  | "md"
  | "lg"
  | "xl"
  | "2xl"
  | "3xl"
  | "full";

export const borderRadiusStyles: Record<
  BorderRadiusKey,
  { borderRadius: number }
> = {
  none: { borderRadius: 0 },
  sm: { borderRadius: 2 },
  md: { borderRadius: 6 },
  lg: { borderRadius: 8 },
  xl: { borderRadius: 16 },
  "2xl": { borderRadius: 24 },
  "3xl": { borderRadius: 32 },
  full: { borderRadius: 9999 },
};
