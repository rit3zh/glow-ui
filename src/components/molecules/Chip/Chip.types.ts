import type { SFSymbol } from "expo-symbols";

export interface ChipProps {
  label: string;
  icon: SFSymbol;
  activeIcon?: SFSymbol;
  isActive: boolean;
  onPress: () => void;
}
