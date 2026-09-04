import type { ReactNode } from "react";
import type {
  ImageSourcePropType,
  StyleProp,
  TextStyle,
  ViewStyle,
} from "react-native";
import type { WithSpringConfig } from "react-native-reanimated";

type TPolaroidPalette = {
  paper: string;
  caption: string;
  meta: string;
  photo: string;
  tape: string;
  tapeBorder: string;
};

type TPolaroidComponents =
  | "Polaroid.Tape"
  | "Polaroid.Photo"
  | "Polaroid.Footer"
  | "Polaroid.Caption"
  | "Polaroid.Meta";

interface IPolaroidContext {
  readonly palette: TPolaroidPalette;
  readonly serifFont: string;
  readonly monoFont: string;
  readonly width: number;
}

interface IPolaroidRoot {
  children: ReactNode;
  readonly palette?: Partial<TPolaroidPalette>;
  readonly width?: number;
  readonly tilt?: number;
  readonly lift?: number;
  readonly springConfig?: WithSpringConfig;
  readonly onPress?: () => void;
  readonly style?: StyleProp<ViewStyle>;
}

interface IPolaroidTape {
  readonly width?: number;
  readonly height?: number;
  readonly tilt?: number;
  readonly color?: string;
  readonly borderColor?: string;
  readonly style?: StyleProp<ViewStyle>;
}

interface IPolaroidPhoto {
  readonly source: ImageSourcePropType;
  readonly alt?: string;
  readonly aspectRatio?: number;
  readonly style?: StyleProp<ViewStyle>;
}

interface IPolaroidSlot {
  children: ReactNode;
  readonly style?: StyleProp<ViewStyle>;
}

interface IPolaroidText {
  children: ReactNode;
  readonly numberOfLines?: number;
  readonly style?: StyleProp<TextStyle>;
}

export type {
  TPolaroidPalette,
  TPolaroidComponents,
  IPolaroidContext,
  IPolaroidRoot,
  IPolaroidTape,
  IPolaroidPhoto,
  IPolaroidSlot,
  IPolaroidText,
};
