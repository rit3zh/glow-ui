import type { WithSpringConfig } from "react-native-reanimated";

import type { TSocialPalette, TSocialProvider, TSocialVariant } from "./types";

interface IBrand {
  /** Default label, used by `Label` and by the a11y announcement */
  readonly label: string;
  /** The brand's own color, used as the filled surface */
  readonly color: string;
  /** Readable against `color` */
  readonly onColor: string;
}

const BRANDS: Record<TSocialProvider, IBrand> = {
  google: {
    label: "Continue with Google",
    color: "#FFFFFF",
    onColor: "#18181B",
  },
  x: { label: "Continue with X", color: "#000000", onColor: "#FFFFFF" },
  github: {
    label: "Continue with GitHub",
    color: "#181717",
    onColor: "#FFFFFF",
  },
  apple: { label: "Continue with Apple", color: "#000000", onColor: "#FFFFFF" },
  pinterest: {
    label: "Continue with Pinterest",
    color: "#E60023",
    onColor: "#FFFFFF",
  },
  tiktok: {
    label: "Continue with TikTok",
    color: "#000000",
    onColor: "#FFFFFF",
  },
  meta: { label: "Continue with Meta", color: "#0081FB", onColor: "#FFFFFF" },
};

const SURFACE = "#FFFFFF";
const BORDER = "#E4E4E7";
const LABEL = "#18181B";

/** Resolves a variant to its tokens for one brand */
function paletteFor(
  provider: TSocialProvider,
  variant: TSocialVariant,
): TSocialPalette {
  const brand = BRANDS[provider];

  if (variant === "filled") {
    return {
      surface: brand.color,
      // Google's brand surface is white, so its filled state still needs an edge
      border: provider === "google" ? BORDER : brand.color,
      label: brand.onColor,
      icon: provider === "google" ? undefined : brand.onColor,
    };
  }

  if (variant === "ghost") {
    return { surface: "transparent", border: "transparent", label: LABEL };
  }

  return { surface: SURFACE, border: BORDER, label: LABEL };
}

const BUTTON_RADIUS = 12;
const BORDER_WIDTH = 1;
const PADDING_X = 16;
const PADDING_Y = 12;
const GAP = 10;
const ICON_SIZE = 20;

const PRESS_SPRING: WithSpringConfig = {
  damping: 18,
  stiffness: 320,
  mass: 0.5,
};

export {
  BRANDS,
  paletteFor,
  BUTTON_RADIUS,
  BORDER_WIDTH,
  PADDING_X,
  PADDING_Y,
  GAP,
  ICON_SIZE,
  PRESS_SPRING,
};
export type { IBrand };
