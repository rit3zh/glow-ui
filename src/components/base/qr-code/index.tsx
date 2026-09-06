import { Pressable, StyleSheet, Text, type ViewStyle } from "react-native";
import React, { memo, useCallback, useEffect, useMemo, useState } from "react";
import Animated, {
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { Feather, Ionicons } from "@expo/vector-icons";
import QRCodeStyled from "react-native-qrcode-styled";
import { QRCodeContext, useQRCode } from "./context";
import type {
  QRCodeProps,
  QRCodeValueProps,
  QRCodeLabelProps,
  QRCodeExpandableLabelProps,
  QRCodeExpandableLabelIconProps,
  QRCodeActionsProps,
  QRCodeButtonProps,
} from "./types";
import {
  BACKGROUND_COLOR,
  PRESSABLE_SPRING_CONFIG,
  QR_URL,
  SPRING_CONFIG,
} from "./const";

const AnimatedQRCodeStyled = Animated.createAnimatedComponent(QRCodeStyled);
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const QRCodeRoot = memo<QRCodeProps>(
  ({
    springConfig = SPRING_CONFIG,
    backgroundColorFocused = BACKGROUND_COLOR,
    defaultExpanded = false,
    style,
    children,
  }: QRCodeProps): React.JSX.Element => {
    const progress = useSharedValue<number>(defaultExpanded ? 1 : 0);
    const press = useSharedValue(0);
    const [value, setValue] = useState<string | undefined>(undefined);

    const expand = useCallback(() => {
      progress.value = withSpring<number>(1, springConfig);
    }, [progress, springConfig]);

    const collapse = useCallback(() => {
      progress.value = withSpring<number>(0, springConfig);
    }, [progress, springConfig]);

    const toggle = useCallback(() => {
      progress.value = withSpring<number>(
        progress.value === 1 ? 0 : 1,
        springConfig,
      );
    }, [progress, springConfig]);

    const containerStyle = useAnimatedStyle<
      Pick<ViewStyle, "width" | "height" | "borderRadius" | "backgroundColor">
    >(() => ({
      width: interpolate(progress.value, [0, 1], [200, 250]),
      height: interpolate(progress.value, [0, 1], [50, 320]),
      borderRadius: interpolate(progress.value, [0, 1], [100, 25]),
      backgroundColor: interpolateColor(
        progress.value,
        [0, 1],
        [BACKGROUND_COLOR, backgroundColorFocused],
      ),
    }));

    const contextValue = useMemo(
      () => ({
        progress,
        value,
        setValue,
        toggle,
        expand,
        collapse,
        backgroundColorFocused,
      }),
      [progress, value, toggle, expand, collapse, backgroundColorFocused],
    );

    const handleOnPressIn = useCallback(() => {
      press.value = withSpring(1, PRESSABLE_SPRING_CONFIG);
    }, []);

    const handleOnPressOut = useCallback(() => {
      press.value = withSpring(0, PRESSABLE_SPRING_CONFIG);
    }, []);
    const animatedPressableStylez = useAnimatedStyle<
      Pick<ViewStyle, "transform">
    >(() => {
      return {
        transform: [
          {
            scale: interpolate(press.value, [0, 1], [1, 1.5]),
          },
        ],
      };
    });

    return (
      <QRCodeContext.Provider value={contextValue}>
        <AnimatedPressable
          onPress={toggle}
          onPressIn={handleOnPressIn}
          onPressOut={handleOnPressOut}
          style={[animatedPressableStylez]}
        >
          <Animated.View style={[styles.container, containerStyle, style]}>
            {children}
          </Animated.View>
        </AnimatedPressable>
      </QRCodeContext.Provider>
    );
  },
);

const QRCodeLabel = memo<QRCodeLabelProps>(
  ({ textStyle, children }: QRCodeLabelProps): React.JSX.Element => {
    const { progress } = useQRCode();

    const labelStyle = useAnimatedStyle<
      Pick<ViewStyle, "opacity" | "transform">
    >(() => ({
      opacity: interpolate(progress.value, [0, 1], [1, 0]),
      transform: [
        { translateY: interpolate(progress.value, [0, 1], [0, 100]) },
      ],
    }));

    const isText = typeof children === "string" || typeof children === "number";

    return (
      <Animated.View style={[styles.labelContainer, labelStyle]}>
        <Ionicons name="qr-code-outline" size={24} color="black" />
        {children == null || isText ? (
          <Text style={[styles.label, textStyle]}>
            {children ?? "Show QR Code"}
          </Text>
        ) : (
          children
        )}
      </Animated.View>
    );
  },
);

const QRCodeValue = memo<QRCodeValueProps>(
  ({
    value,
    size = 190,
    padding = 20,
    style,
  }: QRCodeValueProps): React.JSX.Element => {
    const { progress, setValue, backgroundColorFocused } = useQRCode();
    const data = value ?? QR_URL;

    useEffect(() => {
      setValue(data);
    }, [data, setValue]);

    const containerStyle = useAnimatedStyle<
      Pick<ViewStyle, "opacity" | "transform">
    >(() => {
      const translateY = withSpring(
        interpolate(progress.value, [0, 0.5, 1], [0, -20, -30]),
      );
      return {
        opacity: interpolate(progress.value, [0, 0.5, 1], [0, 0.2, 1]),
        transform: [
          { translateY },
          { scale: interpolate(progress.value, [0, 1], [0, 1]) },
        ],
      };
    });

    const qrStyle = useAnimatedStyle<
      Pick<ViewStyle, "borderRadius" | "backgroundColor">
    >(() => ({
      borderRadius: interpolate(progress.value, [0, 1], [100, 30]),
      backgroundColor: interpolateColor(
        progress.value,
        [0, 1],
        [BACKGROUND_COLOR, backgroundColorFocused],
      ),
    }));

    return (
      <Animated.View style={[styles.valueContainer, containerStyle]}>
        <AnimatedQRCodeStyled
          data={data}
          style={[qrStyle, style]}
          padding={padding}
          size={size}
        />
      </Animated.View>
    );
  },
);

const QRCodeExpandableLabelBase = memo<QRCodeExpandableLabelProps>(
  ({
    onPress,
    textStyle,
    style,
    children,
  }: QRCodeExpandableLabelProps): React.JSX.Element => {
    const { value } = useQRCode();
    const progress = useSharedValue<number>(0);

    const content = React.Children.map(children, (child) =>
      typeof child === "string" || typeof child === "number" ? (
        <Text style={[styles.buttonText, textStyle]} numberOfLines={1}>
          {child}
        </Text>
      ) : (
        child
      ),
    );

    const handleOnPressIn = useCallback(() => {
      progress.value = withSpring(1);
    }, []);
    const handleOnPressOut = useCallback(() => {
      progress.value = withSpring(0);
      onPress?.();
    }, []);

    const animatedPressableStylez = useAnimatedStyle<
      Pick<ViewStyle, "transform">
    >(() => {
      return {
        transform: [
          {
            scale: interpolate(progress.value, [0, 1], [1, 1.1]),
          },
        ],
      };
    });

    return (
      <AnimatedPressable
        style={[styles.button, style, animatedPressableStylez]}
        onPressIn={handleOnPressIn}
        onPressOut={handleOnPressOut}
      >
        {children == null ? (
          <>
            <Feather name="copy" size={20} color="black" />
            <Text style={[styles.buttonText, textStyle]}>Copy Link</Text>
          </>
        ) : (
          content
        )}
      </AnimatedPressable>
    );
  },
);

const QRCodeExpandableLabelIcon = memo<QRCodeExpandableLabelIconProps>(
  ({
    name = "copy",
    size = 20,
    color = "black",
  }: QRCodeExpandableLabelIconProps): React.JSX.Element => (
    <Feather name={name} size={size} color={color} />
  ),
);

const QRCodeExpandableLabel = Object.assign(QRCodeExpandableLabelBase, {
  Icon: QRCodeExpandableLabelIcon,
});

const QRCodeActions = memo<QRCodeActionsProps>(
  ({ style, children }: QRCodeActionsProps): React.JSX.Element => {
    const { progress } = useQRCode();

    const actionsStyle = useAnimatedStyle<
      Pick<ViewStyle, "opacity" | "transform">
    >(() => ({
      opacity: interpolate(progress.value, [0, 1], [0, 1]),
      transform: [{ translateY: interpolate(progress.value, [0, 1], [0, 5]) }],
    }));

    return (
      <Animated.View style={[styles.actionsContainer, actionsStyle, style]}>
        {children ?? (
          <>
            <QRCodeExpandableLabel />
            <QRCodeCloseButton />
          </>
        )}
      </Animated.View>
    );
  },
);

const QRCodeCopyButton = memo<QRCodeButtonProps>(
  ({
    onPress,
    textStyle,
    style,
    children,
  }: QRCodeButtonProps): React.JSX.Element => {
    const { value } = useQRCode();

    return (
      <Pressable
        style={[styles.button, style]}
        onPress={() => onPress?.(value)}
      >
        {children ?? (
          <>
            <Feather name="copy" size={20} color="black" />
            <Text style={[styles.buttonText, textStyle]}>Copy Link</Text>
          </>
        )}
      </Pressable>
    );
  },
);

const QRCodeCloseButton = memo<QRCodeButtonProps>(
  ({ onPress, style, children }: QRCodeButtonProps): React.JSX.Element => {
    const { collapse, value } = useQRCode();
    const progress = useSharedValue<number>(0);

    const handlePress = useCallback(() => {
      collapse();
      onPress?.(value);
    }, [collapse, onPress, value]);

    const handleOnPressIn = useCallback(() => {
      progress.value = withSpring(1);
    }, []);
    const handleOnPressOut = useCallback(() => {
      progress.value = withSpring(0);
    }, []);

    const animatedPressableStylez = useAnimatedStyle<
      Pick<ViewStyle, "transform">
    >(() => {
      return {
        transform: [
          {
            scale: interpolate(progress.value, [0, 1], [1, 1.1]),
          },
        ],
      };
    });

    return (
      <AnimatedPressable
        style={[styles.closeButton, style, animatedPressableStylez]}
        onPress={handlePress}
        onPressIn={handleOnPressIn}
        onPressOut={handleOnPressOut}
      >
        {children ?? <Feather name="x" size={20} color="black" />}
      </AnimatedPressable>
    );
  },
);

const QRCode = Object.assign(QRCodeRoot, {
  Label: QRCodeLabel,
  Value: QRCodeValue,
  ExpandableLabel: QRCodeExpandableLabel,
  Actions: QRCodeActions,
  CopyButton: QRCodeCopyButton,
  CloseButton: QRCodeCloseButton,
});

export default QRCode;
export { QRCode };
export type { QRCodeProps } from "./types";

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
  labelContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    position: "absolute",
  },
  label: {
    color: "#000",
    fontSize: 16,
    fontWeight: "500",
  },
  valueContainer: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
  },
  actionsContainer: {
    position: "absolute",
    bottom: 20,
    flexDirection: "row",
    gap: 12,
  },
  button: {
    backgroundColor: "#fff",
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 38,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  closeButton: {
    backgroundColor: "#fff",
    borderRadius: 100,
    width: 40,
    height: 40,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
  },
  buttonText: {
    color: "#000",
    fontSize: 14,
    fontWeight: "700",
  },
});
