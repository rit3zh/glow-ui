import type { StyleProp, ViewStyle } from "react-native";

declare global {
  interface WithStyle<T> {
    style?: StyleProp<T>;
  }
}
