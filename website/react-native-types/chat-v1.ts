import type { StyleProp, TextStyle, ViewStyle } from "react-native";

interface IChipOption {
  text: string;
  icon: React.ReactNode;
  onPress?: () => void;
}

interface IChipGrid {
  options: IChipOption[];
  columns?: number;
  gap?: number;
  containerStyle?: StyleProp<ViewStyle>;
  chipStyle?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  iconStyle?: StyleProp<ViewStyle>;
}

export type { IChipOption, IChipGrid };
