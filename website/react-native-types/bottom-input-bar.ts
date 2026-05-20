import {
  StyleProp,
  TextInputContentSizeChangeEvent,
  TextInputProps,
  TextStyle,
  ViewStyle,
} from "react-native";

interface IBottomInputBar extends Omit<TextInputProps, "style"> {
  readonly value?: string;
  readonly onChangeText?: (text: string) => void;
  readonly placeholder?: string;
  readonly placeholderTextColor?: string;
  readonly multiline?: boolean;
  readonly maxHeight?: number;
  readonly minHeight?: number;
  readonly renderLeftAccessory?: () => React.ReactNode;
  readonly renderRightAccessory?: () => React.ReactNode;
  readonly onSend?: () => void;
  readonly style?: StyleProp<ViewStyle>;
  readonly inputStyle?: StyleProp<TextStyle>;
  readonly containerStyle?: StyleProp<ViewStyle>;
}

interface IIconGroups {
  renderLeftAccessory?: () => React.ReactNode;
  renderRightAccessory?: () => React.ReactNode;
}

interface IInputContent {
  readonly value?: string;
  readonly onChangeText?: (text: string) => void;
  placeholder: string;
  placeholderTextColor: string;
  multiline: boolean;
  inputMaxHeight: number;
  readonly inputStyle?: StyleProp<TextStyle>;
  onContentSizeChange: (event: TextInputContentSizeChangeEvent) => void;
  textInputProps: Omit<TextInputProps, "style">;
}

export type { IBottomInputBar, IInputContent, IIconGroups };
