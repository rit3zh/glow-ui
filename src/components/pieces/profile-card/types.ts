import type { ReactNode } from "react";
import type {
  ImageSourcePropType,
  StyleProp,
  TextStyle,
  ViewStyle,
} from "react-native";
import type { WithSpringConfig } from "react-native-reanimated";

/** Color tokens the card paints with; merged over the defaults */
type TProfilePalette = {
  /** Card body */
  surface: string;
  /** Shown behind the cover while it loads, or when it has no image */
  cover: string;
  /** Display name */
  name: string;
  /** @handle next to the name */
  handle: string;
  /** Bio paragraph */
  bio: string;
  /** Location row, icon included */
  location: string;
  /** Action button fill */
  action: string;
  /** Action button label */
  actionLabel: string;
  /** Ring punched around the avatar, usually the surface color */
  avatarRing: string;
  /** The frame drawn around the whole card */
  outline: string;
};

type TProfileComponents =
  | "ProfileCard.Cover"
  | "ProfileCard.Avatar"
  | "ProfileCard.Body"
  | "ProfileCard.Header"
  | "ProfileCard.Name"
  | "ProfileCard.Handle"
  | "ProfileCard.Bio"
  | "ProfileCard.Location"
  | "ProfileCard.Action";

interface IProfileCardContext {
  /** Palette resolved from the root's `palette` prop over the defaults */
  readonly palette: TProfilePalette;
  /** Cover height, so the avatar knows where to straddle the edge */
  readonly coverHeight: number;
  /** Outer card width, frame included */
  readonly width: number;
  /** Spring driving the action button's press feedback */
  readonly springConfig: WithSpringConfig;
}

interface IProfileCardRoot {
  children: ReactNode;
  /** Overrides any subset of the color tokens */
  readonly palette?: Partial<TProfilePalette>;
  /** Outer card width in points, frame included */
  readonly width?: number;
  /** Outer corner radius, measured on the outline */
  readonly radius?: number;
  /** Thickness of the frame around the card; `0` removes it */
  readonly outlineWidth?: number;
  /** Overrides `palette.outline` for this card only */
  readonly outlineColor?: string;
  /**
   * Radius of the content inside the frame. Defaults to
   * `radius - outlineWidth`, which keeps the two curves concentric.
   */
  readonly innerRadius?: number;
  /** Cover height in points */
  readonly coverHeight?: number;
  /** Spring used by the action button */
  readonly springConfig?: WithSpringConfig;
  readonly style?: StyleProp<ViewStyle>;
}

interface IProfileCardCover {
  /** Cover image; omit it and pass `children` for a gradient or video */
  readonly source?: ImageSourcePropType;
  /** Describes the cover to screen readers */
  readonly alt?: string;
  /** Rendered on top of the image — a gradient, a scrim, anything */
  children?: ReactNode;
  readonly height?: number;
  /** Rounds the cover's bottom corners where it meets the body */
  readonly bottomRadius?: number;
  readonly style?: StyleProp<ViewStyle>;
}

interface IProfileCardAvatar {
  readonly source: ImageSourcePropType;
  readonly alt?: string;
  readonly size?: number;
  readonly radius?: number;
  /** Ring thickness; `0` removes it */
  readonly ring?: number;
  /** Distance from the card's right edge */
  readonly inset?: number;
  /** Share of the avatar hanging below the cover, 0–1 */
  readonly overlap?: number;
  readonly style?: StyleProp<ViewStyle>;
}

interface IProfileCardSlot {
  children: ReactNode;
  readonly style?: StyleProp<ViewStyle>;
}

interface IProfileCardText {
  children: ReactNode;
  readonly numberOfLines?: number;
  readonly style?: StyleProp<TextStyle>;
}

interface IProfileCardLocation {
  children: ReactNode;
  /** Replaces the built-in pin */
  readonly icon?: ReactNode;
  readonly numberOfLines?: number;
  readonly style?: StyleProp<ViewStyle>;
  readonly textStyle?: StyleProp<TextStyle>;
}

interface IProfileCardAction {
  children: ReactNode;
  readonly onPress?: () => void;
  readonly disabled?: boolean;
  readonly radius?: number;
  readonly style?: StyleProp<ViewStyle>;
  readonly textStyle?: StyleProp<TextStyle>;
}

export type {
  TProfilePalette,
  TProfileComponents,
  IProfileCardContext,
  IProfileCardRoot,
  IProfileCardCover,
  IProfileCardAvatar,
  IProfileCardSlot,
  IProfileCardText,
  IProfileCardLocation,
  IProfileCardAction,
};
