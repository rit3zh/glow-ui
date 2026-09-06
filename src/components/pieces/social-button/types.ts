import type { ReactNode } from "react";
import type { StyleProp, TextStyle, ViewStyle } from "react-native";
import type { WithSpringConfig } from "react-native-reanimated";

/** The brands this piece ships marks for */
type TSocialProvider =
  | "google"
  | "x"
  | "github"
  | "apple"
  | "pinterest"
  | "tiktok"
  | "meta";

/**
 * `outline` is a light button with the brand's own colors on the mark,
 * `filled` is the brand color with the mark flattened to one tone, and
 * `ghost` drops the surface entirely.
 */
type TSocialVariant = "outline" | "filled" | "ghost";

/** Color tokens the button paints with; merged over the variant's defaults */
type TSocialPalette = {
  /** Button body */
  surface: string;
  /** Button edge */
  border: string;
  /** Label */
  label: string;
  /**
   * Flattens the mark to this single tone. Left undefined by `outline`, so
   * the brand's own colors come through.
   */
  icon?: string;
};

/** How the icon-and-label group sits in a stretched button */
type TSocialAlign = "center" | "start";

type TSocialComponents = "SocialButton.Icon" | "SocialButton.Label";

interface ISocialIconProps {
  readonly size: number;
  /** Flattens the mark to one tone; omit for the brand's own colors */
  readonly color?: string;
}

interface ISocialButtonContext {
  /** Palette resolved from the variant, then the root's `palette` prop */
  readonly palette: TSocialPalette;
  /** Which brand this button is for */
  readonly provider: TSocialProvider;
  /** Default mark size, and the width of the slot reserved for it */
  readonly iconSize: number;
  /** Whether the button stretches, which is what makes the label flex */
  readonly fullWidth: boolean;
  /** Space between the icon slot and the label */
  readonly gap: number;
  /** Fixed label width, or `undefined` to let it hug its text */
  readonly labelWidth?: number;
  /** How the icon-and-label group sits in a stretched button */
  readonly align: TSocialAlign;
}

interface ISocialButtonRoot {
  /** Which brand this button is for */
  readonly provider: TSocialProvider;
  children: ReactNode;
  /** Surface treatment (defaults to `outline`) */
  readonly variant?: TSocialVariant;
  /** Overrides any subset of the variant's color tokens */
  readonly palette?: Partial<TSocialPalette>;
  readonly onPress?: () => void;
  readonly disabled?: boolean;
  /** Stretch to the parent's width instead of hugging the content */
  readonly fullWidth?: boolean;
  readonly radius?: number;
  readonly borderWidth?: number;
  /** Space between the icon slot and the label */
  readonly gap?: number;
  /**
   * Pins the label to a fixed width, which makes the icon-and-label group a
   * constant width too. Give every button in a stack the same value and their
   * icons line up at the same x while the group stays centered. Omit it and
   * the label hugs its own text, so each row centers independently.
   */
  readonly labelWidth?: number;
  /** Default mark size, which `Icon` can still override */
  readonly iconSize?: number;
  /**
   * How the icon-and-label pair sits in the button. They always stay
   * together, one `gap` apart; this only moves the pair as a group.
   * Only meaningful with `fullWidth`.
   */
  readonly align?: TSocialAlign;
  /** Spring driving the press feedback */
  readonly springConfig?: WithSpringConfig;
  /**
   * Announced to screen readers. Falls back to the brand's default label,
   * which matters most for icon-only buttons.
   */
  readonly accessibilityLabel?: string;
  readonly style?: StyleProp<ViewStyle>;
}

interface ISocialButtonIcon {
  /** Replaces the brand mark entirely */
  children?: ReactNode;
  readonly size?: number;
  /** Flattens the mark to one tone */
  readonly color?: string;
  readonly style?: StyleProp<ViewStyle>;
}

interface ISocialButtonLabel {
  /** Defaults to the brand's own label, e.g. "Continue with Google" */
  children?: ReactNode;
  readonly numberOfLines?: number;
  readonly style?: StyleProp<TextStyle>;
}

export type {
  TSocialProvider,
  TSocialVariant,
  TSocialPalette,
  TSocialAlign,
  TSocialComponents,
  ISocialIconProps,
  ISocialButtonContext,
  ISocialButtonRoot,
  ISocialButtonIcon,
  ISocialButtonLabel,
};
