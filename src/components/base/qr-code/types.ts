import type { StyleProp, TextStyle, ViewStyle } from "react-native";
import type { SharedValue, WithSpringConfig } from "react-native-reanimated";
import type { Feather } from "@expo/vector-icons";

type FeatherName = React.ComponentProps<typeof Feather>["name"];

/** Root <QRCode> props — owns the expand/collapse animation + shared config. */
interface QRCodeProps {
  readonly springConfig?: WithSpringConfig;
  readonly backgroundColorFocused?: string;
  readonly defaultExpanded?: boolean;
  readonly style?: StyleProp<ViewStyle>;
  readonly children: React.ReactNode;
}

/** <QRCode.Value value="..." /> — the animated QR code itself. */
interface QRCodeValueProps {
  readonly value?: string;
  readonly size?: number;
  readonly padding?: number;
  readonly style?: StyleProp<ViewStyle>;
}

/** <QRCode.Label> — the collapsed pill label; fades out on expand. */
interface QRCodeLabelProps {
  readonly textStyle?: StyleProp<TextStyle>;
  readonly children?: React.ReactNode;
}

/**
 * <QRCode.ExpandableLabel> — the action pill revealed while expanded
 * (e.g. "Copy Link" with an icon). Bare string children are auto-wrapped in
 * <Text>, so it can hold an <ExpandableLabel.Icon /> alongside plain text.
 */
interface QRCodeExpandableLabelProps {
  readonly onPress?: (value?: string) => void;
  readonly textStyle?: StyleProp<TextStyle>;
  readonly style?: StyleProp<ViewStyle>;
  readonly children?: React.ReactNode;
}

/** <QRCode.ExpandableLabel.Icon> — leading icon for the action pill. */
interface QRCodeExpandableLabelIconProps {
  readonly name?: FeatherName;
  readonly size?: number;
  readonly color?: string;
}

/** <QRCode.Actions> — the action row revealed while expanded. */
interface QRCodeActionsProps {
  readonly style?: StyleProp<ViewStyle>;
  readonly children?: React.ReactNode;
}

/** <QRCode.CopyButton> / <QRCode.CloseButton> and generic action buttons. */
interface QRCodeButtonProps {
  readonly onPress?: (value?: string) => void;
  readonly textStyle?: StyleProp<TextStyle>;
  readonly style?: StyleProp<ViewStyle>;
  readonly children?: React.ReactNode;
}

interface QRCodeContextValue {
  readonly progress: SharedValue<number>;
  readonly value?: string;
  readonly setValue: (value?: string) => void;
  readonly toggle: () => void;
  readonly expand: () => void;
  readonly collapse: () => void;
  readonly backgroundColorFocused: string;
}

export type {
  QRCodeProps,
  QRCodeValueProps,
  QRCodeLabelProps,
  QRCodeExpandableLabelProps,
  QRCodeExpandableLabelIconProps,
  QRCodeActionsProps,
  QRCodeButtonProps,
  QRCodeContextValue,
};
