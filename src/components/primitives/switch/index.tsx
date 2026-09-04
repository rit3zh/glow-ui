import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, {
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

import { createCompoundComponent } from "@/utils/create-compound-component";
import { SwitchContext, useSwitch } from "./context";
import {
  SWITCH_DISABLED_OPACITY,
  SWITCH_METRICS,
  SWITCH_PRESS_SPRING,
  SWITCH_PRESS_STRETCH,
  SWITCH_SPRING,
  SWITCH_THEME,
} from "./const";
import type {
  ISwitchContent,
  ISwitchContextValue,
  ISwitchDescription,
  ISwitchLabel,
  ISwitchRoot,
  ISwitchThumb,
  ISwitchTrack,
} from "./types";

const SwitchRoot: React.FC<ISwitchRoot> = ({
  children,
  checked,
  defaultChecked = false,
  onCheckedChange,
  disabled = false,
  size = "md",
  theme = "dark",
  trackColor,
  thumbColor,
  style,
  testID,
}): React.JSX.Element => {
  const isControlled = checked !== undefined;
  const [internal, setInternal] = useState<boolean>(defaultChecked);
  const isChecked = isControlled ? checked : internal;

  const palette = SWITCH_THEME[theme];
  const metrics = SWITCH_METRICS[size];

  const progress = useSharedValue<number>(isChecked ? 1 : 0);
  const pressed = useSharedValue<number>(0);
  const mounted = useRef<boolean>(false);

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    progress.value = withSpring(isChecked ? 1 : 0, SWITCH_SPRING);
  }, [isChecked, progress]);

  const toggle = useCallback((): void => {
    if (disabled) return;
    const next = !isChecked;
    if (!isControlled) setInternal(next);
    onCheckedChange?.(next);
  }, [disabled, isChecked, isControlled, onCheckedChange]);

  const ctx = useMemo<ISwitchContextValue>(
    () => ({
      checked: isChecked,
      disabled,
      size,
      palette: trackColor ? { ...palette, trackOn: trackColor } : palette,
      metrics,
      progress,
      pressed,
      thumbColor,
      toggle,
    }),
    [
      isChecked,
      disabled,
      size,
      palette,
      metrics,
      progress,
      pressed,
      trackColor,
      thumbColor,
      toggle,
    ],
  );

  const onPressIn = useCallback((): void => {
    if (disabled) return;
    pressed.value = withSpring(1, SWITCH_PRESS_SPRING);
  }, [disabled, pressed]);

  const onPressOut = useCallback((): void => {
    pressed.value = withSpring(0, SWITCH_PRESS_SPRING);
  }, [pressed]);

  return (
    <SwitchContext.Provider value={ctx}>
      <Pressable
        testID={testID}
        accessibilityRole="switch"
        accessibilityState={{ checked: isChecked, disabled }}
        disabled={disabled}
        onPress={toggle}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        style={[
          styles.root,
          disabled && { opacity: SWITCH_DISABLED_OPACITY },
          style,
        ]}
      >
        {children ?? (
          <SwitchTrack>
            <SwitchThumb />
          </SwitchTrack>
        )}
      </Pressable>
    </SwitchContext.Provider>
  );
};

const SwitchTrack: React.FC<ISwitchTrack> = ({
  children,
  style,
}): React.JSX.Element => {
  const { palette, metrics, progress } = useSwitch("Switch.Track");

  const animatedStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      progress.value,
      [0, 1],
      [palette.trackOff, palette.trackOn],
    ),
  }));

  return (
    <Animated.View
      style={[
        styles.track,
        {
          width: metrics.trackWidth,
          height: metrics.trackHeight,
          borderRadius: metrics.trackHeight / 2,
          padding: metrics.padding,
          borderColor: palette.border,
        },
        animatedStyle,
        style,
      ]}
    >
      {children ?? <SwitchThumb />}
    </Animated.View>
  );
};

const SwitchThumb: React.FC<ISwitchThumb> = ({
  children,
  style,
}): React.JSX.Element => {
  const { palette, metrics, progress, pressed, thumbColor } =
    useSwitch("Switch.Thumb");

  const animatedStyle = useAnimatedStyle(() => {
    const stretch = interpolate(
      pressed.value,
      [0, 1],
      [1, SWITCH_PRESS_STRETCH],
    );
    const anchor = interpolate(progress.value, [0, 1], [1, -1]);
    const overflow = (metrics.thumbSize * (stretch - 1)) / 2;

    return {
      transform: [
        { translateX: progress.value * metrics.travel + anchor * overflow },
        { scaleX: stretch },
      ],
    };
  });

  return (
    <Animated.View
      style={[
        styles.thumb,
        {
          width: metrics.thumbSize,
          height: metrics.thumbSize,
          borderRadius: metrics.thumbSize / 2,
          backgroundColor: thumbColor ?? palette.thumb,
        },
        animatedStyle,
        style,
      ]}
    >
      {children}
    </Animated.View>
  );
};

const SwitchContentView: React.FC<ISwitchContent> = ({
  children,
  style,
}): React.JSX.Element => {
  useSwitch("Switch.Content");
  return <View style={[styles.content, style]}>{children}</View>;
};

const SwitchLabel: React.FC<ISwitchLabel> = ({
  children,
  style,
}): React.JSX.Element => {
  const { palette } = useSwitch("Switch.Label");
  return (
    <Text style={[styles.label, { color: palette.label }, style]}>
      {children}
    </Text>
  );
};

const SwitchDescription: React.FC<ISwitchDescription> = ({
  children,
  style,
}): React.JSX.Element => {
  const { palette } = useSwitch("Switch.Description");
  return (
    <Text style={[styles.description, { color: palette.description }, style]}>
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  root: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  track: {
    justifyContent: "center",
    borderWidth: StyleSheet.hairlineWidth,
  },
  thumb: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.18,
    shadowRadius: 3,
    elevation: 2,
  },
  content: {
    flex: 1,
    gap: 2,
  },
  label: {
    fontSize: 14.5,
    fontWeight: "600",
    letterSpacing: -0.1,
  },
  description: {
    fontSize: 13,
    lineHeight: 18,
  },
});

const SwitchContent = createCompoundComponent(
  "Switch.Content",
  SwitchContentView,
  {
    Label: SwitchLabel,
    Description: SwitchDescription,
  },
);

const Switch = createCompoundComponent("Switch", SwitchRoot, {
  Root: SwitchRoot,
  Track: SwitchTrack,
  Thumb: SwitchThumb,
  Content: SwitchContent,
  Label: SwitchLabel,
  Description: SwitchDescription,
});

export {
  Switch,
  SwitchRoot,
  SwitchTrack,
  SwitchThumb,
  SwitchContent,
  SwitchLabel,
  SwitchDescription,
};
export default Switch;
export type {
  ISwitchRoot,
  ISwitchTrack,
  ISwitchThumb,
  ISwitchContent,
  ISwitchLabel,
  ISwitchDescription,
  TSwitchSize,
  TSwitchTheme,
} from "./types";
