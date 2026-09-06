import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  type LayoutChangeEvent,
  type TextStyle,
  type ViewStyle,
} from "react-native";
import Animated, {
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { impactAsync, ImpactFeedbackStyle } from "expo-haptics";

import {
  CHIP_HEIGHT,
  CHIP_PADDING,
  DEFAULT_SPRING,
  GROUP_GAP,
  ICON_LABEL_GAP,
  ICON_SIZE,
  LABEL_TRAVEL,
  PRESS_SCALE,
  PRESS_SPRING,
  THEME,
} from "./const";
import {
  ChipGroupContext,
  ChipItemContext,
  useChipGroup,
  useChipItem,
} from "./context";
import type {
  IAnimatedChipGroup,
  IAnimatedChipIcon,
  IAnimatedChipItem,
  IAnimatedChipLabel,
  IChipState,
  TChipRenderable,
  TChipValue,
} from "./types";
import { createCompoundComponent } from "@/utils/create-compound-component";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const COLLAPSED_WIDTH = CHIP_PADDING * 2 + ICON_SIZE;

const renderChildren = (
  children: TChipRenderable,
  state: IChipState,
): React.ReactNode =>
  typeof children === "function" ? children(state) : children;

const AnimatedChipGroup: React.FC<IAnimatedChipGroup> = ({
  children,
  value,
  defaultValue,
  onValueChange,
  gap = GROUP_GAP,
  springConfig = DEFAULT_SPRING,
  haptics = true,
  reserveWidth = true,
  style,
}: IAnimatedChipGroup): React.JSX.Element => {
  const [uncontrolled, setUncontrolled] = useState<TChipValue | undefined>(
    defaultValue,
  );
  const isControlled = value !== undefined;
  const selectedValue = isControlled ? value : uncontrolled;

  const select = useCallback(
    (next: TChipValue) => {
      if (next === selectedValue) return;
      if (haptics && Platform.OS !== "web") {
        impactAsync(ImpactFeedbackStyle.Light);
      }
      if (!isControlled) setUncontrolled(next);
      onValueChange?.(next);
    },
    [selectedValue, haptics, isControlled, onValueChange],
  );

  const [items, setItems] = useState<readonly TChipValue[]>([]);
  const [labelWidths, setLabelWidths] = useState<Record<string, number>>({});

  const registerItem = useCallback((item: TChipValue) => {
    setItems((current) =>
      current.includes(item) ? current : [...current, item],
    );
    return () => {
      setItems((current) => current.filter((i) => i !== item));
      setLabelWidths(({ [item]: _removed, ...rest }) => rest);
    };
  }, []);

  const reportLabelWidth = useCallback((item: TChipValue, width: number) => {
    setLabelWidths((current) =>
      current[item] === width ? current : { ...current, [item]: width },
    );
  }, []);

  const measured = items
    .map((item) => labelWidths[item])
    .filter((width): width is number => width !== undefined);
  const reservedWidth =
    reserveWidth && items.length > 0 && measured.length === items.length
      ? items.length * COLLAPSED_WIDTH +
        (items.length - 1) * gap +
        ICON_LABEL_GAP +
        Math.max(...measured)
      : undefined;

  const ctx = useMemo(
    () => ({
      selectedValue,
      select,
      springConfig,
      registerItem,
      reportLabelWidth,
    }),
    [selectedValue, select, springConfig, registerItem, reportLabelWidth],
  );

  return (
    <ChipGroupContext.Provider value={ctx}>
      <Animated.View
        style={[styles.group, { gap, width: reservedWidth }, style]}
        accessibilityRole="tablist"
      >
        {children}
      </Animated.View>
    </ChipGroupContext.Provider>
  );
};

const AnimatedChipItem: React.FC<IAnimatedChipItem> = ({
  children,
  value,
  activeColor = THEME.active,
  inactiveColor = THEME.inactive,
  disabled = false,
  style,
}: IAnimatedChipItem): React.JSX.Element => {
  const { selectedValue, select, springConfig, registerItem } =
    useChipGroup("AnimatedChip.Item");

  const selected = selectedValue === value;

  useEffect(() => registerItem(value), [registerItem, value]);

  const progress = useSharedValue<number>(selected ? 1 : 0);
  const labelWidth = useSharedValue<number>(0);
  const pressed = useSharedValue<number>(0);

  useEffect(() => {
    progress.value = withSpring(selected ? 1 : 0, springConfig);
  }, [selected, springConfig, progress]);

  const chipStyle = useAnimatedStyle<
    Pick<ViewStyle, "width" | "backgroundColor" | "transform">
  >(() => ({
    width: interpolate(
      progress.value,
      [0, 1],
      [COLLAPSED_WIDTH, COLLAPSED_WIDTH + ICON_LABEL_GAP + labelWidth.value],
    ),
    backgroundColor: interpolateColor(
      progress.value,
      [0, 1],
      [inactiveColor, activeColor],
    ),
    transform: [
      { scale: interpolate(pressed.value, [0, 1], [1, PRESS_SCALE]) },
    ],
  }));

  const ctx = useMemo(
    () => ({ value, selected, progress, labelWidth }),
    [value, selected, progress, labelWidth],
  );

  return (
    <ChipItemContext.Provider value={ctx}>
      <AnimatedPressable
        onPress={() => select(value)}
        onPressIn={() => {
          pressed.value = withSpring(1, PRESS_SPRING);
        }}
        onPressOut={() => {
          pressed.value = withSpring(0, PRESS_SPRING);
        }}
        disabled={disabled}
        accessibilityRole="tab"
        accessibilityState={{ selected, disabled }}
        style={[styles.chip, disabled && styles.disabled, chipStyle, style]}
      >
        {children}
      </AnimatedPressable>
    </ChipItemContext.Provider>
  );
};

const AnimatedChipIcon: React.FC<IAnimatedChipIcon> = ({
  children,
  style,
}: IAnimatedChipIcon): React.JSX.Element => {
  const { selected, value } = useChipItem("AnimatedChip.Icon");

  return (
    <Animated.View style={[styles.icon, style]}>
      {renderChildren(children, { selected, value })}
    </Animated.View>
  );
};

const AnimatedChipLabel: React.FC<IAnimatedChipLabel> = ({
  children,
  color = THEME.label,
  style,
}: IAnimatedChipLabel): React.JSX.Element => {
  const { selected, value, progress, labelWidth } =
    useChipItem("AnimatedChip.Label");
  const { reportLabelWidth } = useChipGroup("AnimatedChip.Label");

  const onLayout = useCallback(
    (event: LayoutChangeEvent) => {
      const { width } = event.nativeEvent.layout;
      labelWidth.value = width;
      reportLabelWidth(value, width);
    },
    [labelWidth, reportLabelWidth, value],
  );

  const labelStyle = useAnimatedStyle<Pick<ViewStyle, "opacity" | "transform">>(
    () => ({
      opacity: interpolate(progress.value, [0.35, 1], [0, 1]),
      transform: [
        { translateX: interpolate(progress.value, [0, 1], [-LABEL_TRAVEL, 0]) },
      ],
    }),
  );

  const content = renderChildren(children, { selected, value });

  return (
    <Animated.View
      style={[styles.labelWrapper, labelStyle]}
      onLayout={onLayout}
      pointerEvents="none"
    >
      {typeof content === "string" || typeof content === "number" ? (
        <Text style={[styles.label, { color }, style]} numberOfLines={1}>
          {content}
        </Text>
      ) : (
        content
      )}
    </Animated.View>
  );
};

const AnimatedChip = createCompoundComponent(
  "AnimatedChip",
  AnimatedChipGroup,
  {
    Group: AnimatedChipGroup,
    Root: AnimatedChipGroup,
    Item: AnimatedChipItem,
    Icon: AnimatedChipIcon,
    Label: AnimatedChipLabel,
  },
);

export {
  AnimatedChip,
  AnimatedChipGroup,
  AnimatedChipItem,
  AnimatedChipIcon,
  AnimatedChipLabel,
  useChipItem,
};

const styles = StyleSheet.create<{
  group: ViewStyle;
  chip: ViewStyle;
  disabled: ViewStyle;
  icon: ViewStyle;
  labelWrapper: ViewStyle;
  label: TextStyle;
}>({
  group: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  chip: {
    height: CHIP_HEIGHT,
    borderRadius: CHIP_HEIGHT / 2,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: CHIP_PADDING,
    overflow: "hidden",
  },
  disabled: {
    opacity: 0.4,
  },
  icon: {
    width: ICON_SIZE,
    height: ICON_SIZE,
    alignItems: "center",
    justifyContent: "center",
  },
  labelWrapper: {
    position: "absolute",
    left: CHIP_PADDING + ICON_SIZE + ICON_LABEL_GAP,
    top: 0,
    bottom: 0,
    justifyContent: "center",
  },
  label: {
    fontSize: 15,
    fontWeight: "600",
  },
});
