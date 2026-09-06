import type { StyleProp, ViewStyle } from "react-native";
import type { BlurTint } from "expo-blur";

import { DisclosureGroupThemes } from "./conf";

interface IDisclosureGroupContext {
  isOpen: boolean;
  toggleDisclosure: () => void;
  closeDisclosure: () => void;
  contentHeight: number;
  setContentHeight: (height: number) => void;
  contextId: string;
}

interface IDisclosureGroups {
  children: React.ReactNode;
}

interface IDisclosureGroupTrigger {
  readonly children?: React.ReactNode;
  readonly style?: StyleProp<ViewStyle>;
  readonly contentContainerStyle?: StyleProp<ViewStyle>;
  readonly showChevron?: boolean;
  readonly chevronColor?: string;
}

interface IDisclosureGroupItems {
  readonly children: React.ReactNode;
  readonly maxHeight?: number;
  readonly scrollable?: boolean;
  readonly blurTint?: BlurTint;
  readonly useBlur?: boolean;
  readonly style?: StyleProp<ViewStyle>;
}

interface IDisclosureGroupItemSpringConfig {
  readonly mass?: number;
  readonly stiffness?: number;
  readonly damping?: number;
}

interface IDisclosureGroupItem {
  readonly children?: React.ReactNode;
  readonly onPress?: () => void;
  readonly style?: StyleProp<ViewStyle>;
  readonly disabled?: boolean;
  readonly pressScale?: number;
  readonly springConfig?: IDisclosureGroupItemSpringConfig;
}

type DisclosureComponent<P> = React.NamedExoticComponent<P>;

interface DisclosureGroupComposition {
  Trigger: DisclosureComponent<IDisclosureGroupTrigger>;
  Items: DisclosureComponent<IDisclosureGroupItems>;
  Item: DisclosureComponent<IDisclosureGroupItem>;
}

type DisclosureGroupTheme =
  (typeof DisclosureGroupThemes)[keyof typeof DisclosureGroupThemes];

export type {
  IDisclosureGroupContext,
  IDisclosureGroups,
  IDisclosureGroupTrigger,
  IDisclosureGroupItems,
  IDisclosureGroupItem,
  IDisclosureGroupItemSpringConfig,
  DisclosureGroupComposition,
  DisclosureGroupTheme,
};
