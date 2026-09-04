import type { SkImage } from "@shopify/react-native-skia";
import type { ReactNode } from "react";
import type { StyleProp, ViewStyle } from "react-native";

type Fit = "cover" | "contain" | "fill" | "fitWidth" | "fitHeight" | "none";

interface IMenuItem {
  image: string;
  /** Optional payload — handy for `renderOverlay` and the press callbacks. */
  title?: string;
  description?: string;
  data?: unknown;
}

interface IMenuState {
  activeItem: IMenuItem | null;
  activeIndex: number;
  isMoving: boolean;
}

interface IInfiniteMenu {
  items: IMenuItem[];

  /* ── Layout ─────────────────────────────────────────────────────────── */
  /**
   * Multiplier on the auto-fit projection. `1` (default) sizes the sphere so
   * it always fits its container; above `1` it deliberately overflows.
   */
  readonly scale?: number;
  /** Explicit projection scale in px. Overrides the auto-fit + `scale`. */
  readonly projectionScale?: number;
  readonly backgroundColor?: string;
  readonly style?: StyleProp<ViewStyle>;

  /* ── Geometry ───────────────────────────────────────────────────────── */
  /** Icosahedron subdivisions — more subdivisions means more discs. */
  readonly subdivisions?: number;
  readonly sphereRadius?: number;
  /** Camera distance from the sphere centre. Smaller = stronger perspective. */
  readonly cameraDistance?: number;
  /** Disc radius as a fraction of the projection scale. */
  readonly discSize?: number;

  /* ── Appearance ─────────────────────────────────────────────────────── */
  /** `[back, front]` opacity, interpolated by depth. */
  readonly opacityRange?: readonly [number, number];
  /** `[equator, pole]` size factor, interpolated by |depth|. */
  readonly depthScaleRange?: readonly [number, number];
  /** Fill used for discs whose image has not loaded yet. */
  readonly placeholderColor?: string;
  readonly imageFit?: Fit;
  readonly discBorderWidth?: number;
  readonly discBorderColor?: string;
  /** Discs smaller than this (in px) are skipped. */
  readonly minDiscRadius?: number;

  /* ── Interaction ────────────────────────────────────────────────────── */
  readonly gesturesEnabled?: boolean;
  /** How much of each finger delta is applied per frame. */
  readonly dragSensitivity?: number;
  readonly dragAmplification?: number;
  /** Glide decay — lower spins longer after release. */
  readonly inertia?: number;
  /** Snap the nearest disc to face the camera when idle. */
  readonly snapEnabled?: boolean;
  readonly snapStrength?: number;
  /** Extra camera pull-back while dragging. `0` disables the zoom-out. */
  readonly zoomOnDrag?: number;
  /** Idle spin in radians per second. `0` (default) disables it. */
  readonly autoRotateSpeed?: number;

  /* ── Callbacks & overlay ────────────────────────────────────────────── */
  readonly onActiveItemChange?: (item: IMenuItem, index: number) => void;
  readonly onItemPress?: (item: IMenuItem, index: number) => void;
  /** Rendered above the canvas; fades out while the sphere is moving. */
  readonly renderOverlay?: (state: IMenuState) => ReactNode;
  /** Overlay fade-out timing, in ms, when the sphere starts moving. */
  readonly overlayFadeInDuration?: number;
  /** Overlay fade-in timing, in ms, when the sphere settles. */
  readonly overlayFadeOutDuration?: number;
  /** Scale the overlay shrinks to while the sphere is moving. */
  readonly overlayRestingScale?: number;
}

interface IDisc {
  screenX: number;
  screenY: number;
  radius: number;
  alpha: number;
  z: number;
  itemIndex: number;
}

interface IDiscComponent {
  x: number;
  y: number;
  radius: number;
  alpha: number;
  image: SkImage | null;
  fit?: Fit;
  placeholderColor?: string;
  borderWidth?: number;
  borderColor?: string;
  minRadius?: number;
}

export type {
  Fit,
  IMenuItem,
  IMenuState,
  IInfiniteMenu,
  IDisc,
  IDiscComponent,
};
