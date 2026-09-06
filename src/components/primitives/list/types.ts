import type { ReactNode } from "react";
import type { StyleProp, TextStyle, ViewStyle } from "react-native";

type TListTheme = "light" | "dark";

type TListContext =
  | "List.Section"
  | "List.Section.Title"
  | "List.Section.Content"
  | "List.Section.Footer"
  | "List.Item"
  | "List.Item.Icon"
  | "List.Item.Content"
  | "List.Item.Title"
  | "List.Item.Subtitle"
  | "List.Item.Value"
  | "List.Item.Chevron"
  | "List.Separator";

interface IListPalette {
  cardBg: string;
  cardBorder: string;
  separator: string;
  header: string;
  footer: string;
  text: string;
  secondaryText: string;
  chevron: string;
  destructive: string;
  highlight: string;
}

interface IListRoot {
  children: ReactNode;
  readonly theme?: TListTheme;
  readonly style?: StyleProp<ViewStyle>;
}

interface IListSection {
  children: ReactNode;
  readonly style?: StyleProp<ViewStyle>;
}

interface IListSectionTitle {
  children: ReactNode;
  readonly style?: StyleProp<TextStyle>;
}

interface IListSectionContent {
  children: ReactNode;
  readonly style?: StyleProp<ViewStyle>;
}

interface IListSectionFooter {
  children: ReactNode;
  readonly style?: StyleProp<TextStyle>;
}

interface IListItem {
  children: ReactNode;
  readonly onPress?: () => void;
  readonly disabled?: boolean;
  readonly destructive?: boolean;
  readonly style?: StyleProp<ViewStyle>;
}

interface IListItemIcon {
  children: ReactNode;
  readonly style?: StyleProp<ViewStyle>;
}

interface IListItemContent {
  children: ReactNode;
  readonly style?: StyleProp<ViewStyle>;
}

interface IListItemTitle {
  children: ReactNode;
  readonly numberOfLines?: number;
  readonly style?: StyleProp<TextStyle>;
}

interface IListItemSubtitle {
  children: ReactNode;
  readonly numberOfLines?: number;
  readonly style?: StyleProp<TextStyle>;
}

interface IListItemValue {
  children: ReactNode;
  readonly numberOfLines?: number;
  readonly style?: StyleProp<TextStyle>;
}

interface IListItemChevron {
  readonly size?: number;
  readonly color?: string;
  readonly style?: StyleProp<TextStyle>;
}

interface IListSeparator {
  readonly inset?: number;
  readonly spacing?: number;
  readonly style?: StyleProp<ViewStyle>;
}

interface IListContextValue {
  theme: TListTheme;
  palette: IListPalette;
}

interface IListRowContextValue {
  isLast: boolean;
}

interface IListItemContextValue {
  destructive: boolean;
  disabled: boolean;
}

export type {
  TListTheme,
  TListContext,
  IListPalette,
  IListRoot,
  IListSection,
  IListSectionTitle,
  IListSectionContent,
  IListSectionFooter,
  IListItem,
  IListItemIcon,
  IListItemContent,
  IListItemTitle,
  IListItemSubtitle,
  IListItemValue,
  IListItemChevron,
  IListSeparator,
  IListContextValue,
  IListRowContextValue,
  IListItemContextValue,
};
