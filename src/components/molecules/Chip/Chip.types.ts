import type { SFSymbol } from "expo-symbols";
import type { StyleProp, ViewStyle } from "react-native";

export interface ChipItem {
  label: string;
  icon: SFSymbol;
  activeIcon?: SFSymbol;
  activeColor?: string;
}

export interface ChipGroupProps<T> {
  chips: T[];
  selectedIndex?: number;
  onChange?: (index: number) => void;
  containerStyle?: StyleProp<ViewStyle>;
}

export interface AnimatedChipProps extends ChipItem {
  isActive: boolean;
  onPress: () => void;
}
