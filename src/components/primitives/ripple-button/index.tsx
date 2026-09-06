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
  Text,
  View,
  type GestureResponderEvent,
  type LayoutChangeEvent,
} from "react-native";
import Animated, {
  interpolate,
  interpolateColor,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSpring,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { Feather } from "@expo/vector-icons";

import { createCompoundComponent } from "@/utils/create-compound-component";
import { RippleButtonContext, useRippleButton } from "./context";
import {
  RIPPLE_BUTTON_DISABLED_OPACITY,
  RIPPLE_BUTTON_MAX_RIPPLES,
  RIPPLE_BUTTON_METRICS,
  RIPPLE_BUTTON_PRESS_SCALE,
  RIPPLE_BUTTON_PRESS_SPRING,
  RIPPLE_BUTTON_RIPPLE_OPACITY,
  RIPPLE_BUTTON_RIPPLE_START_SCALE,
  RIPPLE_BUTTON_RIPPLE_TIMING,
  RIPPLE_BUTTON_SPINNER_DURATION,
  RIPPLE_BUTTON_THEME,
} from "./const";
import type {
  IRippleButtonContent,
  IRippleButtonContextValue,
  IRippleButtonIcon,
  IRippleButtonLabel,
  IRippleButtonRipple,
  IRippleButtonRoot,
  IRippleButtonSpinner,
} from "./types";

const RippleButtonRoot: React.FC<IRippleButtonRoot> = ({
  children,
  variant = "default",
  size = "md",
  theme = "dark",
  disabled = false,
  loading = false,
  disableRipple = false,
  icon,
  iconPosition = "start",
  loadingIcon,
  accessibilityLabel,
  onPress,
  onLongPress,
  style,
  testID,
}): React.JSX.Element => {
  const palette = RIPPLE_BUTTON_THEME[theme][variant];
  const metrics = RIPPLE_BUTTON_METRICS[size];
  const isLocked = disabled || loading;

  const pressed = useSharedValue<number>(0);
  const rippleIdRef = useRef<number>(0);
  const layoutRef = useRef({ width: 0, height: 0 });
  const [ripples, setRipples] = useState<IRippleButtonRipple[]>([]);

  const allowsRipple = !(disableRipple || isLocked || variant === "link");

  useEffect(() => {
    if (isLocked) {
      pressed.value = withSpring(0, RIPPLE_BUTTON_PRESS_SPRING);
      setRipples([]);
    }
  }, [isLocked, pressed]);

  const ctx = useMemo<IRippleButtonContextValue>(
    () => ({
      variant,
      size,
      theme,
      palette,
      metrics,
      disabled,
      loading,
      loadingIcon,
      pressed,
    }),
    [
      variant,
      size,
      theme,
      palette,
      metrics,
      disabled,
      loading,
      loadingIcon,
      pressed,
    ],
  );

  const onLayout = useCallback((event: LayoutChangeEvent): void => {
    const { width, height } = event.nativeEvent.layout;
    layoutRef.current = { width, height };
  }, []);

  const removeRipple = useCallback((id: number): void => {
    setRipples((current) => current.filter((item) => item.id !== id));
  }, []);

  const onPressIn = useCallback(
    (event: GestureResponderEvent): void => {
      if (isLocked) return;
      pressed.value = withSpring(1, RIPPLE_BUTTON_PRESS_SPRING);

      if (!allowsRipple) return;

      const { width, height } = layoutRef.current;
      const { locationX: x, locationY: y } = event.nativeEvent;
      const rippleSize =
        2 *
        Math.max(
          Math.hypot(x, y),
          Math.hypot(width - x, y),
          Math.hypot(x, height - y),
          Math.hypot(width - x, height - y),
        );

      rippleIdRef.current += 1;
      const id = rippleIdRef.current;

      setRipples((current) => {
        const next = [...current, { id, x, y, size: rippleSize }];
        return next.length > RIPPLE_BUTTON_MAX_RIPPLES
          ? next.slice(next.length - RIPPLE_BUTTON_MAX_RIPPLES)
          : next;
      });
    },
    [allowsRipple, isLocked, pressed],
  );

  const onPressOut = useCallback((): void => {
    pressed.value = withSpring(0, RIPPLE_BUTTON_PRESS_SPRING);
  }, [pressed]);

  const animatedStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      pressed.value,
      [0, 1],
      [palette.bg, palette.bgPressed],
    ),
    transform: [
      {
        scale: interpolate(pressed.value, [0, 1], [1, RIPPLE_BUTTON_PRESS_SCALE]),
      },
    ],
  }));

  const isLink = variant === "link";

  const isComposed = !(
    children === undefined ||
    typeof children === "string" ||
    typeof children === "number"
  );

  const content = isComposed ? (
    children
  ) : (
    <RippleButtonContentView>
      {loading && !icon ? <RippleButtonSpinner /> : null}
      {icon && iconPosition === "start" ? (
        <RippleButtonIcon position="start">{icon}</RippleButtonIcon>
      ) : null}
      {children === undefined ? null : <RippleButtonLabel>{children}</RippleButtonLabel>}
      {icon && iconPosition === "end" ? (
        <RippleButtonIcon position="end">{icon}</RippleButtonIcon>
      ) : null}
    </RippleButtonContentView>
  );

  return (
    <RippleButtonContext.Provider value={ctx}>
      <Pressable
        testID={testID}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        accessibilityState={{ disabled: isLocked, busy: loading }}
        disabled={isLocked}
        onLayout={onLayout}
        onPress={onPress}
        onLongPress={onLongPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
      >
        <Animated.View
          style={[
            styles.root,
            {
              borderRadius: isLink ? 0 : metrics.radius,
              backgroundColor: palette.bg,
              borderColor: palette.border,
            },
            isLink ? styles.link : { height: metrics.height },
            !isLink &&
              (metrics.iconOnly
                ? { width: metrics.height }
                : { paddingHorizontal: metrics.paddingHorizontal }),
            disabled && { opacity: RIPPLE_BUTTON_DISABLED_OPACITY },
            animatedStyle,
            style,
          ]}
        >
          {allowsRipple
            ? ripples.map((ripple) => (
                <RippleButtonLayer
                  key={ripple.id}
                  color={palette.ripple}
                  onDone={removeRipple}
                  ripple={ripple}
                />
              ))
            : null}
          {content}
        </Animated.View>
      </Pressable>
    </RippleButtonContext.Provider>
  );
};

const RippleButtonLayer: React.FC<{
  color: string;
  onDone: (id: number) => void;
  ripple: IRippleButtonRipple;
}> = ({ color, onDone, ripple }): React.JSX.Element => {
  const progress = useSharedValue<number>(0);

  useEffect(() => {
    progress.value = withTiming(1, RIPPLE_BUTTON_RIPPLE_TIMING, (finished) => {
      if (finished) runOnJS(onDone)(ripple.id);
    });
  }, [onDone, progress, ripple.id]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      progress.value,
      [0, 0.35, 1],
      [
        RIPPLE_BUTTON_RIPPLE_OPACITY,
        RIPPLE_BUTTON_RIPPLE_OPACITY * 0.8,
        0,
      ],
    ),
    transform: [
      {
        scale: interpolate(
          progress.value,
          [0, 1],
          [RIPPLE_BUTTON_RIPPLE_START_SCALE, 1],
        ),
      },
    ],
  }));

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.ripple,
        {
          width: ripple.size,
          height: ripple.size,
          borderRadius: ripple.size / 2,
          left: ripple.x - ripple.size / 2,
          top: ripple.y - ripple.size / 2,
          backgroundColor: color,
        },
        animatedStyle,
      ]}
    />
  );
};

const RippleButtonContentView: React.FC<IRippleButtonContent> = ({
  children,
  style,
}): React.JSX.Element => {
  const { metrics } = useRippleButton("RippleButton.Content");
  return (
    <View style={[styles.content, { gap: metrics.gap }, style]}>
      {children}
    </View>
  );
};

const RippleButtonLabel: React.FC<IRippleButtonLabel> = ({
  children,
  style,
}): React.JSX.Element | null => {
  const { palette, metrics, variant, loading } = useRippleButton("RippleButton.Label");

  if (loading && metrics.iconOnly) return null;

  return (
    <Text
      numberOfLines={1}
      style={[
        styles.label,
        {
          color: palette.fg,
          fontSize: metrics.fontSize,
          opacity: loading ? 0.96 : 1,
        },
        variant === "link" && styles.linkLabel,
        style,
      ]}
    >
      {children}
    </Text>
  );
};

const RippleButtonIcon: React.FC<IRippleButtonIcon> = ({
  children,
  style,
}): React.JSX.Element => {
  const { palette, metrics, loading } = useRippleButton("RippleButton.Icon");

  if (loading) return <RippleButtonSpinner style={style} />;

  return (
    <View
      style={[
        styles.icon,
        { width: metrics.iconSize, height: metrics.iconSize },
        style,
      ]}
    >
      {children ?? (
        <Feather
          name="circle"
          size={metrics.iconSize}
          color={palette.fg}
        />
      )}
    </View>
  );
};

const RippleButtonSpinner: React.FC<IRippleButtonSpinner> = ({
  children,
  style,
}): React.JSX.Element => {
  const { palette, metrics, loadingIcon } = useRippleButton("RippleButton.Spinner");
  const rotation = useSharedValue<number>(0);

  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, {
        duration: RIPPLE_BUTTON_SPINNER_DURATION,
        easing: Easing.linear,
      }),
      -1,
      false,
    );
  }, [rotation]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  return (
    <Animated.View
      style={[
        styles.icon,
        { width: metrics.iconSize, height: metrics.iconSize },
        animatedStyle,
        style,
      ]}
    >
      {children ??
        loadingIcon ?? (
          <Feather name="loader" size={metrics.iconSize} color={palette.fg} />
        )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  root: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: StyleSheet.hairlineWidth,
    overflow: "hidden",
  },
  link: {
    alignSelf: "flex-start",
    paddingHorizontal: 0,
    borderWidth: 0,
  },
  ripple: {
    position: "absolute",
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    fontWeight: "600",
    letterSpacing: -0.1,
    textAlign: "center",
  },
  linkLabel: {
    textDecorationLine: "underline",
  },
  icon: {
    alignItems: "center",
    justifyContent: "center",
  },
});

const RippleButton = createCompoundComponent("RippleButton", RippleButtonRoot, {
  Root: RippleButtonRoot,
  Content: RippleButtonContentView,
  Label: RippleButtonLabel,
  Icon: RippleButtonIcon,
  Spinner: RippleButtonSpinner,
});

export {
  RippleButton,
  RippleButtonRoot,
  RippleButtonContentView as RippleButtonContent,
  RippleButtonLabel,
  RippleButtonIcon,
  RippleButtonSpinner,
};
export default RippleButton;
export type {
  IRippleButtonRoot,
  IRippleButtonContent,
  IRippleButtonLabel,
  IRippleButtonIcon,
  IRippleButtonSpinner,
  TRippleButtonVariant,
  TRippleButtonSize,
  TRippleButtonTheme,
  TRippleButtonIconPosition,
} from "./types";
