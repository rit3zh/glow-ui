import type { StyleProp, TextStyle } from "react-native";
import type { WithTimingConfig } from "react-native-reanimated";

interface QRCodeProps {
  readonly QRCodevalue?: string;
  readonly timingConfig?: WithTimingConfig;
  readonly textStyle?: StyleProp<TextStyle>;
  readonly backgroundColorFocused?: string;
}

export type { QRCodeProps };
