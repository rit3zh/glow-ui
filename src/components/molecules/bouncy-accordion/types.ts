import type { ReactNode } from "react";
import type { StyleProp, TextStyle, ViewStyle } from "react-native";

type TBouncyAccordionValue = string | null;

interface IBouncyAccordionRoot {
  children: ReactNode;
  /** Controlled open value. */
  readonly value?: TBouncyAccordionValue;
  /** Uncontrolled initial open value. */
  readonly defaultValue?: TBouncyAccordionValue;
  readonly onValueChange?: (value: TBouncyAccordionValue) => void;
  /** Allow closing the open item by tapping it again. */
  readonly collapsible?: boolean;
  /** Gap that opens up between connected groups. */
  readonly gap?: number;
  /** Corner radius applied to the outer edges of each group. */
  readonly radius?: number;
  readonly style?: StyleProp<ViewStyle>;
}

interface IBouncyAccordionItem {
  children: ReactNode;
  readonly value: string;
  readonly disabled?: boolean;
  readonly style?: StyleProp<ViewStyle>;
}

/** Grouping/layout props injected by Root — not part of the public API. */
interface IBouncyAccordionItemInternal {
  readonly open?: boolean;
  readonly startsGroup?: boolean;
  readonly endsGroup?: boolean;
  readonly separatedFromPrevious?: boolean;
}

interface IBouncyAccordionTrigger {
  children: ReactNode;
  /** Optional leading icon rendered before the title. */
  readonly icon?: ReactNode;
  readonly hideChevron?: boolean;
  readonly style?: StyleProp<ViewStyle>;
  readonly textStyle?: StyleProp<TextStyle>;
}

interface IBouncyAccordionTriggerIcon {
  children: ReactNode;
  readonly style?: StyleProp<ViewStyle>;
}

interface IBouncyAccordionTriggerLabel {
  children: ReactNode;
  readonly style?: StyleProp<TextStyle>;
}

interface IBouncyAccordionContent {
  children: ReactNode;
  readonly style?: StyleProp<ViewStyle>;
  readonly textStyle?: StyleProp<TextStyle>;
}

interface IBouncyAccordionRootContext {
  activeValue: TBouncyAccordionValue;
  setActiveValue: (value: TBouncyAccordionValue) => void;
  collapsible: boolean;
  radius: number;
  gap: number;
}

interface IBouncyAccordionItemContext {
  value: string;
  open: boolean;
  disabled: boolean;
  startsGroup: boolean;
  endsGroup: boolean;
  toggle: () => void;
}

export type {
  TBouncyAccordionValue,
  IBouncyAccordionRoot,
  IBouncyAccordionItem,
  IBouncyAccordionItemInternal,
  IBouncyAccordionTrigger,
  IBouncyAccordionTriggerIcon,
  IBouncyAccordionTriggerLabel,
  IBouncyAccordionContent,
  IBouncyAccordionRootContext,
  IBouncyAccordionItemContext,
};
