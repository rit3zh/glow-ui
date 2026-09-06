import { memo } from "react";
import { Pressable, StyleSheet, Text, ViewStyle } from "react-native";
import Animated, { useAnimatedStyle } from "react-native-reanimated";

import { TOAST_ACTION_REVEAL_WIDTH, TOAST_RADIUS } from "../toast.constants";
import { getCommitWidth, getRevealed } from "../toast.math";
import { useToastTheme } from "../toast.theme";
import type { IToastSwipeActionLayer } from "../Toast.types";
import { CheckIcon } from "./toast-icons";

const ToastSwipeAction = memo(
  ({
    action,
    toast,
    side,
    rowHeight,
    rowWidth,
    dragX,
    onPress,
  }: IToastSwipeActionLayer) => {
    const { colors, styles } = useToastTheme();

    const color = action.color ?? colors.destructive;
    const tint = action.tint ?? "#FFFFFF";
    const revealWidth = action.revealWidth ?? TOAST_ACTION_REVEAL_WIDTH;
    const commitWidth = getCommitWidth(
      rowWidth,
      revealWidth,
      action.commitThreshold,
      action.commitOffset,
    );
    const icon =
      typeof action.icon === "function" ? action.icon(toast) : action.icon;
    const travelRamp = 56;

    const layerStyle = useAnimatedStyle<Pick<ViewStyle, "width" | "opacity">>(
      () => {
        const revealed = getRevealed(dragX.value, side, rowWidth);

        return {
          width: Math.ceil(revealed > revealWidth ? revealed : revealWidth),
          opacity: revealed > 0 ? 1 : 0,
        };
      },
    );

    const contentStyle = useAnimatedStyle(() => {
      const revealed = getRevealed(dragX.value, side, rowWidth);
      const past = revealed - commitWidth;
      const ramp = past <= 0 ? 0 : past >= travelRamp ? 1 : past / travelRamp;
      const room = revealed - revealWidth;
      const shift = room > 0 ? room * ramp : 0;

      return { transform: [{ translateX: side === "left" ? -shift : shift }] };
    });

    return (
      <Animated.View
        style={[
          styles.swipeAction,
          side === "left" ? { right: 0 } : { left: 0 },
          {
            backgroundColor: color,
            borderRadius:
              rowHeight > 0
                ? Math.min(TOAST_RADIUS, rowHeight / 2)
                : TOAST_RADIUS,
          },
          layerStyle,
        ]}
      >
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={
            typeof action.label === "string" ? action.label : "Swipe action"
          }
          onPress={onPress}
          style={StyleSheet.absoluteFill}
        >
          <Animated.View
            style={[
              styles.swipeActionSlot,
              side === "left" ? { right: 0 } : { left: 0 },
              { width: revealWidth },
              contentStyle,
            ]}
          >
            {icon ?? <CheckIcon color={tint} />}
            {action.label != null ? (
              <Text
                numberOfLines={1}
                style={[styles.swipeActionLabel, { color: tint }]}
              >
                {action.label}
              </Text>
            ) : null}
          </Animated.View>
        </Pressable>
      </Animated.View>
    );
  },
);

ToastSwipeAction.displayName = "ToastSwipeAction";

export { ToastSwipeAction };
