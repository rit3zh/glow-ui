import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Pressable,
  StyleSheet,
  TextStyle,
  View,
  ViewStyle,
  type LayoutChangeEvent,
} from "react-native";
import Animated, {
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { createCompoundComponent } from "@/utils/create-compound-component";
import { ToggleContext, useToggle } from "./context";
import {
  TOGGLE_CHANGE_SCALE_X,
  TOGGLE_CHANGE_SCALE_Y,
  TOGGLE_DISABLED_OPACITY,
  TOGGLE_FLUID_FILL,
  TOGGLE_FLUID_ICON,
  TOGGLE_FLUID_SNAP,
  TOGGLE_FLUID_TAP,
  TOGGLE_ICON_REST,
  TOGGLE_METRICS,
  TOGGLE_SHEEN_FADE,
  TOGGLE_SHEEN_FROM,
  TOGGLE_SHEEN_OPACITY,
  TOGGLE_SHEEN_OVERFLOW_RATIO,
  TOGGLE_SHEEN_SKEW,
  TOGGLE_SHEEN_SWEEP,
  TOGGLE_SHEEN_TO,
  TOGGLE_SHEEN_WIDTH_RATIO,
  TOGGLE_TAP_SCALE_X,
  TOGGLE_TAP_SCALE_Y,
  TOGGLE_THEME,
} from "./const";
import type {
  IToggleContent,
  IToggleContextValue,
  IToggleIcon,
  IToggleLabel,
  IToggleRoot,
} from "./types";

const ToggleRoot: React.FC<IToggleRoot> = ({
  children,
  pressed,
  defaultPressed = false,
  onPressedChange,
  variant = "default",
  size = "md",
  theme = "dark",
  disabled = false,
  accessibilityLabel,
  style,
  testID,
}): React.JSX.Element & React.ReactNode => {
  const isControlled = pressed !== undefined;
  const [internal, setInternal] = useState<boolean>(defaultPressed);
  const isPressed = isControlled ? pressed : internal;

  const palette = TOGGLE_THEME[theme];
  const metrics = TOGGLE_METRICS[size];

  const fillProgress = useSharedValue<number>(isPressed ? 1 : 0);
  const iconScale = useSharedValue<number>(isPressed ? 1 : TOGGLE_ICON_REST);
  const iconScaleX = useSharedValue<number>(1);
  const iconScaleY = useSharedValue<number>(1);
  const sheenX = useSharedValue<number>(TOGGLE_SHEEN_FROM);
  const sheenOpacity = useSharedValue<number>(0);
  const [width, setWidth] = useState<number>(0);

  const prevPressed = useRef<boolean>(isPressed);
  const isPointerDown = useRef<boolean>(false);

  useEffect(() => {
    if (prevPressed.current === isPressed) return;
    prevPressed.current = isPressed;

    fillProgress.value = withSpring(isPressed ? 1 : 0, TOGGLE_FLUID_FILL);
    iconScale.value = withSpring(
      isPressed ? 1 : TOGGLE_ICON_REST,
      TOGGLE_FLUID_ICON,
    );

    sheenX.value = TOGGLE_SHEEN_FROM;
    sheenOpacity.value = TOGGLE_SHEEN_OPACITY;
    sheenX.value = withTiming<number>(TOGGLE_SHEEN_TO, TOGGLE_SHEEN_SWEEP);
    sheenOpacity.value = withTiming<number>(0, TOGGLE_SHEEN_FADE);

    iconScaleX.value = withSequence(
      withSpring<number>(TOGGLE_CHANGE_SCALE_X, TOGGLE_FLUID_TAP),
      withSpring<number>(1, TOGGLE_FLUID_SNAP),
    );
    iconScaleY.value = withSequence(
      withSpring<number>(TOGGLE_CHANGE_SCALE_Y, TOGGLE_FLUID_TAP),
      withSpring<number>(1, TOGGLE_FLUID_SNAP),
    );
  }, [
    fillProgress,
    iconScale,
    iconScaleX,
    iconScaleY,
    isPressed,
    sheenOpacity,
    sheenX,
  ]);

  const resetTapScale = useCallback((): void => {
    iconScaleX.value = withSpring(1, TOGGLE_FLUID_SNAP);
    iconScaleY.value = withSpring(1, TOGGLE_FLUID_SNAP);
  }, [iconScaleX, iconScaleY]);

  const onPressIn = useCallback((): void => {
    if (disabled) return;
    isPointerDown.current = true;
    iconScaleX.value = withSpring(TOGGLE_TAP_SCALE_X, TOGGLE_FLUID_TAP);
    iconScaleY.value = withSpring(TOGGLE_TAP_SCALE_Y, TOGGLE_FLUID_TAP);
  }, [disabled, iconScaleX, iconScaleY]);

  const onPressOut = useCallback((): void => {
    if (!isPointerDown.current) return;
    isPointerDown.current = false;
    resetTapScale();
  }, [resetTapScale]);

  const toggle = useCallback((): void => {
    if (disabled) return;
    const next = !isPressed;
    if (!isControlled) setInternal(next);
    onPressedChange?.(next);
  }, [disabled, isControlled, isPressed, onPressedChange]);

  const onLayout = useCallback((event: LayoutChangeEvent): void => {
    setWidth(event.nativeEvent.layout.width);
  }, []);

  const ctx = useMemo<IToggleContextValue>(
    () => ({
      pressed: isPressed,
      disabled,
      variant,
      size,
      theme,
      palette,
      metrics,
      fillProgress,
      iconScale,
      iconScaleX,
      iconScaleY,
      color: isPressed ? palette.labelOn : palette.labelOff,
      toggle,
    }),
    [
      isPressed,
      disabled,
      variant,
      size,
      theme,
      palette,
      metrics,
      fillProgress,
      iconScale,
      iconScaleX,
      iconScaleY,
      toggle,
    ],
  );

  const fillStyle = useAnimatedStyle<Pick<ViewStyle, "opacity">>(() => ({
    opacity: fillProgress.value,
  }));

  const sheenStyle = useAnimatedStyle<Pick<ViewStyle, "transform" | "opacity">>(
    () => ({
      opacity: sheenOpacity.value,
      transform: [
        { translateX: sheenX.value * width },
        { skewX: TOGGLE_SHEEN_SKEW },
      ],
    }),
  );

  const sheenWidth = width * TOGGLE_SHEEN_WIDTH_RATIO;
  const sheenOverflow = metrics.height * TOGGLE_SHEEN_OVERFLOW_RATIO;

  return (
    <ToggleContext.Provider value={ctx}>
      <Pressable
        testID={testID}
        accessibilityRole="switch"
        accessibilityLabel={accessibilityLabel}
        accessibilityState={{ checked: isPressed, disabled }}
        disabled={disabled}
        onLayout={onLayout}
        onPress={toggle}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
      >
        <View
          style={[
            styles.root,
            {
              height: metrics.height,
              minWidth: metrics.minWidth,
              paddingHorizontal: metrics.paddingHorizontal,
              borderRadius: metrics.radius,
              gap: metrics.gap,
            },
            variant === "outline" && {
              borderWidth: StyleSheet.hairlineWidth,
              borderColor: palette.border,
            },
            disabled && { opacity: TOGGLE_DISABLED_OPACITY },
            style,
          ]}
        >
          <Animated.View
            pointerEvents="none"
            style={[
              styles.fill,
              { backgroundColor: palette.fill, borderRadius: metrics.radius },
              fillStyle,
            ]}
          />
          <View
            pointerEvents="none"
            style={[styles.sheenClip, { borderRadius: metrics.radius }]}
          >
            <Animated.View
              style={[
                styles.sheen,
                {
                  width: sheenWidth,
                  top: -sheenOverflow,
                  bottom: -sheenOverflow,
                },
                sheenStyle,
              ]}
            >
              <LinearGradient
                colors={["transparent", palette.sheen, "transparent"]}
                end={{ x: 1, y: 0 }}
                start={{ x: 0, y: 0 }}
                style={StyleSheet.absoluteFill}
              />
            </Animated.View>
          </View>
          <ToggleContentView>{children}</ToggleContentView>
        </View>
      </Pressable>
    </ToggleContext.Provider>
  );
};

const ToggleContentView: React.FC<IToggleContent> = ({
  children,
  style,
}): React.JSX.Element => {
  const { metrics, iconScale, iconScaleX, iconScaleY } =
    useToggle("Toggle.Content");

  const scaleStyle = useAnimatedStyle<Pick<ViewStyle, "transform">>(() => ({
    transform: [{ scale: iconScale.value }],
  }));

  const squashStyle = useAnimatedStyle<Pick<ViewStyle, "transform">>(() => ({
    transform: [{ scaleX: iconScaleX.value }, { scaleY: iconScaleY.value }],
  }));

  return (
    <Animated.View style={[styles.content, { gap: metrics.gap }, scaleStyle]}>
      <Animated.View
        style={[styles.content, { gap: metrics.gap }, squashStyle, style]}
      >
        {children}
      </Animated.View>
    </Animated.View>
  );
};

const ToggleLabel: React.FC<IToggleLabel> = ({
  children,
  style,
}): React.JSX.Element => {
  const { palette, metrics, fillProgress } = useToggle("Toggle.Label");

  const animatedStyle = useAnimatedStyle<Pick<TextStyle, "color">>(() => ({
    color: interpolateColor(
      interpolate(fillProgress.value, [0, 1], [0, 1]),
      [0, 1],
      [palette.labelOff, palette.labelOn],
    ),
  }));

  return (
    <Animated.Text
      numberOfLines={1}
      style={[
        styles.label,
        { fontSize: metrics.fontSize },
        animatedStyle,
        style,
      ]}
    >
      {children}
    </Animated.Text>
  );
};

const ToggleIcon: React.FC<IToggleIcon> = ({
  children,
  style,
}): React.JSX.Element => {
  const { metrics } = useToggle("Toggle.Icon");

  return (
    <View
      style={[
        styles.icon,
        { width: metrics.iconSize, height: metrics.iconSize },
        style,
      ]}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    position: "relative",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    backgroundColor: "transparent",
  },
  fill: {
    ...(StyleSheet.absoluteFill as any),
    zIndex: 0,
  },
  sheenClip: {
    ...(StyleSheet.absoluteFill as any),
    zIndex: 1,
    overflow: "hidden",
  },
  sheen: {
    position: "absolute",
    left: 0,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },
  label: {
    fontWeight: "500",
    letterSpacing: -0.1,
    textAlign: "center",
  },
  icon: {
    alignItems: "center",
    justifyContent: "center",
  },
});

const Toggle = createCompoundComponent("Toggle", ToggleRoot, {
  Root: ToggleRoot,
  Content: ToggleContentView,
  Label: ToggleLabel,
  Icon: ToggleIcon,
});

export {
  Toggle,
  ToggleRoot,
  ToggleContentView as ToggleContent,
  ToggleLabel,
  ToggleIcon,
  useToggle,
};
export default Toggle;
export type {
  IToggleRoot,
  IToggleContent,
  IToggleLabel,
  IToggleIcon,
  TToggleVariant,
  TToggleSize,
  TToggleTheme,
} from "./types";
