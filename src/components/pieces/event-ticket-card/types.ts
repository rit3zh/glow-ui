import type { ReactNode } from "react";
import type { StyleProp, TextStyle, ViewStyle } from "react-native";

/** Color tokens the ticket paints with; merged over the defaults */
type TTicketPalette = {
  /** The ticket body itself */
  surface: string;
  /** Title, holder and detail values */
  ink: string;
  /** Eyebrow, detail labels and the stub code */
  muted: string;
  /** The tear line between the main section and the stub */
  perforation: string;
  /** Barcode bars on the stub */
  bars: string;
};

/** How the tear line between the main section and the stub is drawn */
type TTicketPerforation = "dashed" | "solid" | "none";

/** Where the stub sits relative to the main section */
type TTicketStubSide = "left" | "right";

type TTicketComponents =
  | "EventTicketCard.Main"
  | "EventTicketCard.Eyebrow"
  | "EventTicketCard.Title"
  | "EventTicketCard.Holder"
  | "EventTicketCard.Details"
  | "EventTicketCard.Detail"
  | "EventTicketCard.Stub"
  | "EventTicketCard.Barcode"
  | "EventTicketCard.Code";

interface IEventTicketCardContext {
  /** Palette resolved from the root's `palette` prop over the defaults */
  readonly palette: TTicketPalette;
  /** Monospace family the eyebrow, labels and code inherit */
  readonly fontFamily: string;
  /** Width reserved for the stub, so the notches line up with its edge */
  readonly stubWidth: number;
  /** How the tear line is drawn */
  readonly perforation: TTicketPerforation;
  /** Which side the stub is on */
  readonly stubSide: TTicketStubSide;
}

interface IEventTicketCardRoot {
  children: ReactNode;
  /** Overrides any subset of the color tokens */
  readonly palette?: Partial<TTicketPalette>;
  /** Ticket width in points */
  readonly width?: number;
  /** Corner radius of the ticket body */
  readonly radius?: number;
  /** Width reserved for the stub */
  readonly stubWidth?: number;
  /** Radius of the two punched notches; `0` removes them */
  readonly notchRadius?: number;
  /** Tear-line style between the main section and the stub */
  readonly perforation?: TTicketPerforation;
  /** Which side the stub is on (defaults to `right`) */
  readonly stubSide?: TTicketStubSide;
  readonly style?: StyleProp<ViewStyle>;
}

interface IEventTicketCardSlot {
  children: ReactNode;
  readonly style?: StyleProp<ViewStyle>;
}

interface IEventTicketCardText {
  children: ReactNode;
  /** Lines before truncating (defaults to 1) */
  readonly numberOfLines?: number;
  readonly style?: StyleProp<TextStyle>;
}

interface IEventTicketCardDetail {
  readonly label: string;
  readonly value: string;
  readonly style?: StyleProp<ViewStyle>;
  readonly labelStyle?: StyleProp<TextStyle>;
  readonly valueStyle?: StyleProp<TextStyle>;
}

interface IEventTicketCardBarcode {
  /** Seeds the deterministic bar heights */
  readonly code: string;
  readonly height?: number;
  readonly width?: number;
  readonly color?: string;
  readonly style?: StyleProp<ViewStyle>;
}

interface IEventTicketCardCode {
  children: ReactNode;
  /** Print the code rotated along the stub (defaults to `true`) */
  readonly vertical?: boolean;
  readonly style?: StyleProp<TextStyle>;
}

export type {
  TTicketPalette,
  TTicketPerforation,
  TTicketStubSide,
  TTicketComponents,
  IEventTicketCardContext,
  IEventTicketCardRoot,
  IEventTicketCardSlot,
  IEventTicketCardText,
  IEventTicketCardDetail,
  IEventTicketCardBarcode,
  IEventTicketCardCode,
};
