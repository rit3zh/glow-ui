import type { ReactNode } from "react";
import type { StyleProp, TextStyle, ViewStyle } from "react-native";

/** Color tokens the receipt paints with; merged over the defaults */
type TReceiptPalette = {
  /** Card background — kept fixed white by default so it reads as printed */
  paper: string;
  /** Item labels and values */
  ink: string;
  /** Meta line, note and printed code */
  muted: string;
  /** Separator rules */
  rule: string;
  /** Dotted leader between an item label and its value */
  leader: string;
  /** Store name and total row */
  accent: string;
};

type TReceiptEdgeSide = "top" | "bottom";

type TReceiptComponents =
  | "ReceiptCard.Header"
  | "ReceiptCard.Store"
  | "ReceiptCard.Meta"
  | "ReceiptCard.Separator"
  | "ReceiptCard.Items"
  | "ReceiptCard.Item"
  | "ReceiptCard.Total"
  | "ReceiptCard.Note"
  | "ReceiptCard.Barcode"
  | "ReceiptCard.TornEdge";

interface IReceiptCardContext {
  /** Palette resolved from the root's `palette` prop over the defaults */
  readonly palette: TReceiptPalette;
  readonly fontFamily: string;
  readonly width: number;
}

interface IReceiptCardRoot {
  children: ReactNode;
  /** Overrides any subset of the color tokens */
  readonly palette?: Partial<TReceiptPalette>;
  readonly width?: number;
  readonly tilted?: boolean;
  readonly style?: StyleProp<ViewStyle>;
  readonly paperStyle?: StyleProp<ViewStyle>;
}

interface IReceiptCardSlot {
  children: ReactNode;
  readonly style?: StyleProp<ViewStyle>;
}

interface IReceiptCardText {
  children: ReactNode;
  readonly style?: StyleProp<TextStyle>;
}

interface IReceiptCardSeparator {
  readonly variant?: "dashed" | "solid";
  readonly color?: string;
  readonly style?: StyleProp<ViewStyle>;
}

interface IReceiptCardItem {
  readonly label: string;
  readonly value: string;
  readonly leader?: boolean;
  readonly style?: StyleProp<ViewStyle>;
  readonly labelStyle?: StyleProp<TextStyle>;
  readonly valueStyle?: StyleProp<TextStyle>;
}

interface IReceiptCardTotal {
  readonly label?: string;
  readonly value: string;
  readonly style?: StyleProp<ViewStyle>;
  readonly labelStyle?: StyleProp<TextStyle>;
  readonly valueStyle?: StyleProp<TextStyle>;
}

interface IReceiptCardBarcode {
  readonly code: string;
  readonly showCode?: boolean;
  readonly height?: number;
  readonly width?: number;
  readonly color?: string;
  readonly style?: StyleProp<ViewStyle>;
  readonly codeStyle?: StyleProp<TextStyle>;
}

interface IReceiptCardTornEdge {
  readonly side?: TReceiptEdgeSide;
  readonly toothWidth?: number;
  readonly toothHeight?: number;
  readonly color?: string;
  readonly style?: StyleProp<ViewStyle>;
}

export type {
  TReceiptPalette,
  TReceiptEdgeSide,
  TReceiptComponents,
  IReceiptCardContext,
  IReceiptCardRoot,
  IReceiptCardSlot,
  IReceiptCardText,
  IReceiptCardSeparator,
  IReceiptCardItem,
  IReceiptCardTotal,
  IReceiptCardBarcode,
  IReceiptCardTornEdge,
};
