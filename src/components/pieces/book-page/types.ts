import type { ReactNode } from "react";
import type {
  ImageSourcePropType,
  StyleProp,
  TextStyle,
  ViewStyle,
} from "react-native";

type TBookPalette = {
  cover: string;
  coverText: string;
  spine: string;
  page: string;
  pageEdge: string;
  rule: string;
};

type TBookComponents =
  | "BookPage.Pages"
  | "BookPage.Cover"
  | "BookPage.Author"
  | "BookPage.Footer"
  | "BookPage.Title"
  | "BookPage.Note";

interface IBookPageContext {
  readonly palette: TBookPalette;
  readonly serifFont: string;
  readonly monoFont: string;
  readonly width: number;
  readonly openAngle: number;
}

interface IBookPageRoot {
  children: ReactNode;
  readonly palette?: Partial<TBookPalette>;
  readonly width?: number;
  readonly aspectRatio?: number;

  readonly openAngle?: number;
  readonly perspective?: number;
  readonly style?: StyleProp<ViewStyle>;
}

interface IBookPagePages {
  readonly bleed?: number;
  readonly inset?: number;
  readonly spineInset?: number;
  readonly style?: StyleProp<ViewStyle>;
}

interface IBookPageCover {
  children: ReactNode;
  readonly source?: ImageSourcePropType;
  readonly alt?: string;
  readonly scrim?: boolean;
  readonly spineWidth?: number;
  readonly radius?: number;
  readonly style?: StyleProp<ViewStyle>;
}

interface IBookPageSlot {
  children: ReactNode;
  readonly style?: StyleProp<ViewStyle>;
}

interface IBookPageText {
  children: ReactNode;
  readonly numberOfLines?: number;
  readonly style?: StyleProp<TextStyle>;
}

export type {
  TBookPalette,
  TBookComponents,
  IBookPageContext,
  IBookPageRoot,
  IBookPagePages,
  IBookPageCover,
  IBookPageSlot,
  IBookPageText,
};
