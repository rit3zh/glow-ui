import type { ReactNode } from "react";
import type {
  ImageSourcePropType,
  StyleProp,
  TextStyle,
  ViewStyle,
} from "react-native";
import type { WithSpringConfig } from "react-native-reanimated";

type TPhotoStackPalette = {
  frame: string;
  photo: string;
  caption: string;
};

type TPhotoStackComponents =
  | "PhotoStack.Item"
  | "PhotoStack.Photo"
  | "PhotoStack.Caption";

interface IPhotoStackContext {
  readonly palette: TPhotoStackPalette;
  readonly size: number;
  readonly rotations: readonly number[];
  readonly offsets: readonly number[];
  readonly lift: number;
  readonly springConfig: WithSpringConfig;
}

interface IPhotoStackItemContext {
  readonly index: number;
}

interface IPhotoStackRoot {
  children: ReactNode;
  readonly palette?: Partial<TPhotoStackPalette>;
  /** Edge length of the square stack, in points. */
  readonly size?: number;
  /** Per-item tilt in degrees, applied by child order. */
  readonly rotations?: readonly number[];
  /** Per-item horizontal offset in points, applied by child order. */
  readonly offsets?: readonly number[];
  /** How far an item rises when pressed. */
  readonly lift?: number;
  readonly springConfig?: WithSpringConfig;
  readonly style?: StyleProp<ViewStyle>;
}

interface IPhotoStackItem {
  children: ReactNode;
  /** Overrides the tilt this item would inherit from its position. */
  readonly rotation?: number;
  /** Overrides the offset this item would inherit from its position. */
  readonly offset?: number;
  readonly onPress?: () => void;
  readonly style?: StyleProp<ViewStyle>;
}

interface IPhotoStackPhoto {
  readonly source?: ImageSourcePropType;
  readonly alt?: string;
  readonly style?: StyleProp<ViewStyle>;
}

interface IPhotoStackCaption {
  children: ReactNode;
  readonly numberOfLines?: number;
  readonly style?: StyleProp<TextStyle>;
}

export type {
  TPhotoStackPalette,
  TPhotoStackComponents,
  IPhotoStackContext,
  IPhotoStackItemContext,
  IPhotoStackRoot,
  IPhotoStackItem,
  IPhotoStackPhoto,
  IPhotoStackCaption,
};
