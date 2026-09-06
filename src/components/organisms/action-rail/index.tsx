// @ts-check
import React, { memo, useCallback, useEffect, useMemo, useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  type ViewStyle,
} from "react-native";
import Animated, {
  FadeIn,
  FadeOut,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

import {
  ENTER_DURATION,
  EXIT_DURATION,
  GLYPH_MIN_SCALE,
  GLYPH_SPRING,
  PALETTES,
  PRESS_SCALE,
  PRESS_SPRING,
  SIZES,
} from "./const";
import { shellLayout } from "./helper";
import {
  ActionRailContext,
  ActionRailTintContext,
  useActionRail,
  useActionRailTint,
} from "./context";
import type {
  IActionRail,
  IActionRailAction,
  IActionRailContext,
  IActionRailGroup,
  IActionRailIcon,
  IActionRailLabel,
  IActionRailOverflow,
  IActionRailPalette,
  IActionRailTrigger,
} from "./types";
import { createCompoundComponent } from "@/utils/create-compound-component";

const ActionRailRoot: React.FC<IActionRail> &
  React.FunctionComponent<IActionRail> = ({
  children,
  expanded: expandedProp,
  defaultExpanded = false,
  onExpandedChange,
  onAction,
  collapseOnAction = false,
  size = "md",
  theme = "light",
  palette: paletteProp,
  style,
}: IActionRail): React.JSX.Element => {
  const isControlled = expandedProp !== undefined;
  const [internalExpanded, setInternalExpanded] =
    useState<boolean>(defaultExpanded);
  const expanded = isControlled ? (expandedProp as boolean) : internalExpanded;

  const reduceMotion = useReducedMotion();

  const setExpanded = useCallback(
    (next: boolean) => {
      if (!isControlled) setInternalExpanded(next);
      onExpandedChange?.(next);
    },
    [isControlled, onExpandedChange],
  );

  const notifyAction = useCallback(
    (value?: string) => {
      onAction?.(value);
      if (collapseOnAction) setExpanded(false);
    },
    [onAction, collapseOnAction, setExpanded],
  );

  const palette = useMemo<IActionRailPalette>(
    () => ({ ...PALETTES[theme], ...paletteProp }),
    [theme, paletteProp],
  );
  const metrics = SIZES[size];

  const ctx = useMemo<IActionRailContext>(
    () => ({
      expanded,
      setExpanded,
      notifyAction,
      palette,
      metrics,
      reduceMotion,
    }),
    [expanded, setExpanded, notifyAction, palette, metrics, reduceMotion],
  );

  const trackStyle = useMemo<ViewStyle>(
    () => ({
      backgroundColor: palette.track,
      borderColor: palette.border,
      borderRadius: metrics.actionHeight / 2 + metrics.trackPadding,
      padding: metrics.trackPadding,
      gap: metrics.gap,
    }),
    [palette, metrics],
  );

  return (
    <ActionRailContext.Provider value={ctx}>
      <View style={style}>
        <Animated.View
          layout={reduceMotion ? undefined : shellLayout()}
          style={[styles.track, trackStyle]}
        >
          {children}
        </Animated.View>
      </View>
    </ActionRailContext.Provider>
  );
};

const ActionRailGroup: React.FC<IActionRailGroup> &
  React.FunctionComponent<IActionRailGroup> = ({
  children,
  style,
}: IActionRailGroup): React.JSX.Element => {
  const { metrics, reduceMotion } = useActionRail("ActionRail.Group");
  return (
    <Animated.View
      layout={reduceMotion ? undefined : shellLayout()}
      style={[styles.row, { gap: metrics.gap }, style]}
    >
      {children}
    </Animated.View>
  );
};

const ActionRailOverflow: React.FC<IActionRailOverflow> &
  React.FunctionComponent<IActionRailOverflow> = ({
  children,
  style,
}: IActionRailOverflow): React.JSX.Element | null => {
  const { expanded, metrics, reduceMotion } = useActionRail(
    "ActionRail.Overflow",
  );

  if (!expanded) return null;

  return (
    <Animated.View
      entering={reduceMotion ? undefined : FadeIn.duration(ENTER_DURATION)}
      exiting={reduceMotion ? undefined : FadeOut.duration(EXIT_DURATION)}
      layout={reduceMotion ? undefined : shellLayout()}
      style={[styles.row, { gap: metrics.gap }, style]}
    >
      {children}
    </Animated.View>
  );
};

const ActionRailAction: React.FC<IActionRailAction> &
  React.FunctionComponent<IActionRailAction> = ({
  children,
  value,
  onPress,
  disabled = false,
  style,
}: IActionRailAction): React.JSX.Element => {
  const { palette, metrics, notifyAction, reduceMotion } =
    useActionRail("ActionRail.Action");
  const pressed = useSharedValue<number>(0);

  const pressStyle = useAnimatedStyle<Pick<ViewStyle, "transform">>(() => ({
    transform: [
      { scale: 1 - (1 - PRESS_SCALE) * (reduceMotion ? 0 : pressed.value) },
    ],
  }));

  const handlePress = useCallback(() => {
    onPress?.();
    notifyAction(value);
  }, [onPress, notifyAction, value]);

  return (
    <Animated.View style={pressStyle}>
      <Pressable
        accessibilityRole="button"
        disabled={disabled}
        onPress={handlePress}
        onPressIn={() => {
          pressed.value = withSpring(1, PRESS_SPRING);
        }}
        onPressOut={() => {
          pressed.value = withSpring(0, PRESS_SPRING);
        }}
        style={[
          styles.action,
          {
            backgroundColor: palette.action,
            height: metrics.actionHeight,
            minWidth: metrics.actionHeight,
            borderRadius: metrics.actionHeight / 2,
            paddingHorizontal: metrics.actionPaddingX,
            gap: metrics.actionGap,
          },
          disabled ? styles.disabled : null,
          style,
        ]}
      >
        <ActionRailTintContext.Provider value={palette.actionText}>
          {children}
        </ActionRailTintContext.Provider>
      </Pressable>
    </Animated.View>
  );
};

const ActionRailIcon: React.FC<IActionRailIcon> &
  React.FunctionComponent<IActionRailIcon> = ({
  children,
  style,
}: IActionRailIcon): React.JSX.Element => {
  const { palette, metrics } = useActionRail("ActionRail.Icon");
  const color = useActionRailTint(palette.actionText);

  const content =
    typeof children === "function"
      ? children({ color, size: metrics.iconSize })
      : children;

  return (
    <View
      style={[
        styles.icon,
        { width: metrics.iconSize, height: metrics.iconSize },
        style,
      ]}
    >
      {content}
    </View>
  );
};

const ActionRailLabel: React.FC<IActionRailLabel> &
  React.FunctionComponent<IActionRailLabel> = ({
  children,
  style,
}: IActionRailLabel): React.JSX.Element => {
  const { palette, metrics } = useActionRail("ActionRail.Label");
  const color = useActionRailTint(palette.actionText);

  return (
    <Text
      numberOfLines={1}
      style={[{ color, fontSize: metrics.fontSize, fontWeight: "500" }, style]}
    >
      {children}
    </Text>
  );
};

const ActionRailTrigger: React.FC<IActionRailTrigger> &
  React.FunctionComponent<IActionRailTrigger> = ({
  children,
  style,
}: IActionRailTrigger): React.JSX.Element => {
  const { expanded, setExpanded, palette, metrics, reduceMotion } =
    useActionRail("ActionRail.Trigger");
  const pressed = useSharedValue<number>(0);

  const pressStyle = useAnimatedStyle<Pick<ViewStyle, "transform">>(() => ({
    transform: [
      { scale: 1 - (1 - PRESS_SCALE) * (reduceMotion ? 0 : pressed.value) },
    ],
  }));

  const state = { expanded, color: palette.toggleText, size: metrics.iconSize };
  const content =
    typeof children === "function" ? children(state) : (children ?? null);

  return (
    <Animated.View
      layout={reduceMotion ? undefined : shellLayout()}
      style={pressStyle}
    >
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ expanded }}
        accessibilityLabel={
          expanded ? "Hide extra actions" : "Show extra actions"
        }
        onPress={() => setExpanded(!expanded)}
        onPressIn={() => {
          pressed.value = withSpring<number>(1, PRESS_SPRING);
        }}
        onPressOut={() => {
          pressed.value = withSpring<number>(0, PRESS_SPRING);
        }}
        style={[
          styles.trigger,
          {
            backgroundColor: palette.toggle,
            width: metrics.toggleSize,
            height: metrics.toggleSize,
            borderRadius: metrics.toggleSize / 2,
          },
          style,
        ]}
      >
        <ActionRailTintContext.Provider value={palette.toggleText}>
          {content ?? (
            <DefaultTriggerGlyph
              expanded={expanded}
              color={palette.toggleText}
              size={metrics.fontSize}
              reduceMotion={reduceMotion}
            />
          )}
        </ActionRailTintContext.Provider>
      </Pressable>
    </Animated.View>
  );
};

const DefaultTriggerGlyph: React.FC<{
  expanded: boolean;
  color: string;
  size: number;
  reduceMotion: boolean;
}> = ({ expanded, color, size, reduceMotion }) => {
  const progress = useSharedValue<number>(expanded ? 1 : 0);

  useEffect(() => {
    const target = expanded ? 1 : 0;
    progress.value = reduceMotion
      ? target
      : withSpring(target, GLYPH_SPRING);
  }, [expanded, reduceMotion, progress]);

  // Each glyph scales up from GLYPH_MIN_SCALE as it fades in, and back down as
  // it fades out, so the swap reads as one continuous motion.
  const moreStyle = useAnimatedStyle(() => {
    const shown = 1 - progress.value;
    return {
      opacity: shown,
      transform: [
        { scale: GLYPH_MIN_SCALE + (1 - GLYPH_MIN_SCALE) * shown },
        { rotate: `${progress.value * 90}deg` },
      ],
    };
  });

  const closeStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: [
      { scale: GLYPH_MIN_SCALE + (1 - GLYPH_MIN_SCALE) * progress.value },
      { rotate: `${(progress.value - 1) * 90}deg` },
    ],
  }));

  return (
    <View style={styles.glyph}>
      <Animated.Text
        style={[styles.glyphText, { color, fontSize: size }, moreStyle]}
      >
        •••
      </Animated.Text>
      <Animated.Text
        style={[
          styles.glyphText,
          styles.glyphOverlay,
          { color, fontSize: size },
          closeStyle,
        ]}
      >
        ✕
      </Animated.Text>
    </View>
  );
};

const styles = StyleSheet.create({
  track: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    maxWidth: "100%",
    borderWidth: StyleSheet.hairlineWidth,
    overflow: "hidden",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  action: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  trigger: {
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    alignItems: "center",
    justifyContent: "center",
  },
  disabled: {
    opacity: 0.45,
  },
  glyph: {
    alignItems: "center",
    justifyContent: "center",
  },
  glyphText: {
    fontWeight: "600",
    includeFontPadding: false,
    textAlign: "center",
  },
  glyphOverlay: {
    ...StyleSheet.absoluteFillObject,
    textAlignVertical: "center",
  },
});

const ActionRail = createCompoundComponent(
  "ActionRail",
  memo<IActionRail>(ActionRailRoot),
  {
    Group: createCompoundComponent("ActionRail.Group", ActionRailGroup),
    Overflow: createCompoundComponent(
      "ActionRail.Overflow",
      ActionRailOverflow,
    ),
    Action: createCompoundComponent("ActionRail.Action", ActionRailAction),
    Icon: createCompoundComponent("ActionRail.Icon", ActionRailIcon),
    Label: createCompoundComponent("ActionRail.Label", ActionRailLabel),
    Trigger: createCompoundComponent("ActionRail.Trigger", ActionRailTrigger),
  },
);

export {
  ActionRail,
  ActionRailRoot,
  ActionRailGroup,
  ActionRailOverflow,
  ActionRailAction,
  ActionRailIcon,
  ActionRailLabel,
  ActionRailTrigger,
};
export type {
  IActionRail,
  IActionRailAction,
  IActionRailGroup,
  IActionRailIcon,
  IActionRailLabel,
  IActionRailOverflow,
  IActionRailPalette,
  IActionRailTrigger,
  TActionRailSize,
  TActionRailTheme,
} from "./types";
export default ActionRail;
