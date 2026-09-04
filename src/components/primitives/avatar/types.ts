import type { ReactNode } from "react";
import type {
  ImageSourcePropType,
  ImageStyle,
  StyleProp,
  ViewStyle,
} from "react-native";

type TAvatarShape = "circle" | "square";
type TAvatarLoadingStatus = "idle" | "loading" | "loaded" | "error";
type TAvatarContext = "Avatar.Image" | "Avatar.Fallback";

interface IAvatarRoot {
  children: ReactNode;
  readonly size?: number;
  readonly shape?: TAvatarShape;
  readonly style?: StyleProp<ViewStyle>;
}

interface IAvatarImage {
  readonly source: ImageSourcePropType;
  readonly style?: StyleProp<ImageStyle>;
  readonly onLoadingStatusChange?: (status: TAvatarLoadingStatus) => void;
}

interface IAvatarFallback {
  children?: ReactNode;
  readonly seed?: number | string;
  readonly delayMs?: number;
  readonly style?: StyleProp<ViewStyle>;
}

interface IAvatarContext {
  size: number;
  shape: TAvatarShape;
  status: TAvatarLoadingStatus;
  setStatus: (status: TAvatarLoadingStatus) => void;
}

export type {
  TAvatarShape,
  TAvatarLoadingStatus,
  TAvatarContext,
  IAvatarRoot,
  IAvatarImage,
  IAvatarFallback,
  IAvatarContext,
};
