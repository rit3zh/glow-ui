// @ts-check
import React, { memo, useCallback, useMemo } from "react";
import { View, Text, ViewStyle } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolate,
  Extrapolation,
  type WithSpringConfig,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { scheduleOnRN } from "react-native-worklets";
import {
  DOCK_DEFAULTS,
  ACTIVATE_SPRING,
  ISACTIVE_INPUT,
  TOOLTIP_OPACITY_INPUT,
  TOOLTIP_OPACITY_OUTPUT,
  TOOLTIP_TRANSLATE_OUTPUT,
  styles,
} from "./const";
import type { IDock, IAnimatedDockIcon } from "./types";
import { getIconIndex } from "./utils";

const AnimatedDockIcon = memo(
  ({
    item,
    index,
    size,
    inputRange,
    outputRange,
    activeIndex,
    isActive,
    iconColor,
    tipColor,
    tipFontColor,
    iconRadius,
    showTip,
    gap,
  }: IAnimatedDockIcon): React.JSX.Element => {
    const animatedStyle = useAnimatedStyle<
      Required<
        Partial<Pick<ViewStyle, "width" | "height" | "marginHorizontal">>
      >
    >(() => {
      const distance = Math.abs(activeIndex.value - index);
      const rawSize = interpolate(
        distance,
        inputRange,
        outputRange,
        Extrapolation.CLAMP,
      );
      const s = interpolate(isActive.value, ISACTIVE_INPUT, [size, rawSize]);
      const margin = gap * (1 + (s / size - 1) * 0.25);

      return {
        width: s,
        height: s,
        marginHorizontal: margin,
      };
    });

    const iconScaleStyle = useAnimatedStyle(() => {
      const distance = Math.abs(activeIndex.value - index);
      const rawSize = interpolate(
        distance,
        inputRange,
        outputRange,
        Extrapolation.CLAMP,
      );
      const s = interpolate(isActive.value, ISACTIVE_INPUT, [size, rawSize]);
      const scale = s / size;
      const translateY = -(size * (scale - 1)) / 2;
      return {
        transform: [{ translateY }, { scale }],
      };
    });

    const tooltipStyle = useAnimatedStyle<
      Required<Partial<Pick<ViewStyle, "opacity" | "transform">>>
    >(() => {
      if (!showTip) return { opacity: 0, transform: [{ translateY: 0 }] };

      const distance = Math.abs(activeIndex.value - index);
      const opacity =
        isActive.value *
        interpolate(
          distance,
          TOOLTIP_OPACITY_INPUT,
          TOOLTIP_OPACITY_OUTPUT,
          Extrapolation.CLAMP,
        );

      return {
        opacity,
        transform: [
          {
            translateY: interpolate(
              isActive.value,
              ISACTIVE_INPUT,
              TOOLTIP_TRANSLATE_OUTPUT,
            ),
          },
        ],
      };
    });

    return (
      <Animated.View style={[styles.iconWrapper, animatedStyle]}>
        <Animated.View
          style={[styles.tooltip, { backgroundColor: tipColor }, tooltipStyle]}
          pointerEvents="none"
        >
          <Text
            style={[styles.tooltipText, { color: tipFontColor }]}
            numberOfLines={1}
          >
            {item.label}
          </Text>
        </Animated.View>

        <Animated.View
          style={[
            styles.iconInner,
            {
              backgroundColor: iconColor,
              borderRadius: iconRadius,
              width: size,
              height: size,
            },
            iconScaleStyle,
          ]}
        >
          {item.icon}
        </Animated.View>
      </Animated.View>
    );
  },
);

const Dock: React.FC<IDock> & React.FunctionComponent<IDock> = memo<
  Partial<IDock> & React.ComponentProps<typeof Dock>
>(
  ({
    items,
    height = DOCK_DEFAULTS.height,
    size = DOCK_DEFAULTS.size,
    peakSize = DOCK_DEFAULTS.peakSize,
    spread = DOCK_DEFAULTS.spread,
    damping = DOCK_DEFAULTS.damping,
    stiffness = DOCK_DEFAULTS.stiffness,
    mass = DOCK_DEFAULTS.mass,
    dockColor = DOCK_DEFAULTS.dockColor,
    iconColor = DOCK_DEFAULTS.iconColor,
    tipColor = DOCK_DEFAULTS.tipColor,
    tipFontColor = DOCK_DEFAULTS.tipFontColor,
    iconRadius = DOCK_DEFAULTS.iconRadius,
    dockRadius = DOCK_DEFAULTS.dockRadius,
    showTip = DOCK_DEFAULTS.showTip,
    gap = DOCK_DEFAULTS.gap,
    paddingTop = DOCK_DEFAULTS.paddingTop,
    paddingBottom = DOCK_DEFAULTS.paddingBottom,
    marginBottom = DOCK_DEFAULTS.marginBottom,
    style,
  }: Partial<IDock> & React.ComponentProps<typeof Dock>): React.JSX.Element &
    React.ReactElement &
    React.ReactNode => {
    const activeIndex = useSharedValue<number>(-1);
    const isActive = useSharedValue<number>(0);
    const dockWidth = useSharedValue<number>(0);
    const tappedIndex = useSharedValue<number>(-1);

    const settleConfig = useMemo<WithSpringConfig>(
      () => ({
        damping: damping * 1.5,
        stiffness: stiffness * 1.1,
        mass: mass * 0.8,
      }),
      [damping, stiffness, mass],
    );

    const { inputRange, outputRange } = useMemo(() => {
      const ir: number[] = [];
      const or: number[] = [];
      for (let d = 0; d <= spread; d++) {
        ir.push(d);
        or.push(
          d === 0
            ? peakSize
            : size + (peakSize - size) * Math.max(0, 1 - d / spread),
        );
      }
      return { inputRange: ir, outputRange: or };
    }, [spread, size, peakSize]);

    const itemsLength = items.length;

    const fireTap = useCallback(
      (idx: number) => {
        const rounded = Math.round(idx);
        if (rounded >= 0 && rounded < items.length) {
          items[rounded].onPress?.();
        }
      },
      [items],
    );

    const gesture = useMemo(
      () =>
        Gesture.Manual()
          .onTouchesDown((e, manager) => {
            if (e.allTouches.length > 0) {
              const x = e.allTouches[0].x;
              const idx = getIconIndex(x, dockWidth.value, itemsLength);
              isActive.value = withSpring(1, ACTIVATE_SPRING);
              activeIndex.value = idx;
              tappedIndex.value = idx;
              manager.activate();
            }
          })
          .onTouchesMove((e) => {
            if (e.allTouches.length > 0) {
              activeIndex.value = getIconIndex(
                e.allTouches[0].x,
                dockWidth.value,
                itemsLength,
              );
            }
          })
          .onTouchesUp((e) => {
            const finalIdx =
              e.allTouches.length > 0
                ? getIconIndex(e.allTouches[0].x, dockWidth.value, itemsLength)
                : tappedIndex.value;

            if (finalIdx >= -0.5) {
              scheduleOnRN(fireTap, finalIdx);
            }
            isActive.value = withSpring(0, settleConfig);
            tappedIndex.value = -1;
          })
          .onTouchesCancelled((_, manager) => {
            isActive.value = withSpring(0, settleConfig);
            tappedIndex.value = -1;
            manager.end();
          })
          .shouldCancelWhenOutside(false),
      [
        dockWidth,
        activeIndex,
        isActive,
        tappedIndex,
        settleConfig,
        fireTap,
        itemsLength,
      ],
    );

    return (
      <GestureDetector gesture={gesture}>
        <Animated.View
          style={[
            styles.dockContainer,
            {
              height,
              backgroundColor: dockColor,
              borderRadius: dockRadius,
              marginBottom,
            },
            style,
          ]}
          onLayout={(e) => {
            dockWidth.value = e.nativeEvent.layout.width;
          }}
        >
          <View style={[styles.dockInner, { paddingTop, paddingBottom }]}>
            {items.map((item, i) => (
              <AnimatedDockIcon
                key={item.label}
                item={item}
                index={i}
                size={size}
                inputRange={inputRange}
                outputRange={outputRange}
                activeIndex={activeIndex}
                isActive={isActive}
                iconColor={iconColor}
                tipColor={tipColor}
                tipFontColor={tipFontColor}
                iconRadius={iconRadius}
                showTip={showTip}
                gap={gap}
              />
            ))}
          </View>
        </Animated.View>
      </GestureDetector>
    );
  },
);

export { Dock };
export type { IDock, IDockItem } from "./types";
