import React, { memo, useCallback, useEffect, useMemo, useRef } from "react";
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
import {
  DockContext,
  ItemIndexContext,
  useDock,
  useItemIndex,
} from "./context";
import type {
  IDock,
  IDockItems,
  IDockItem,
  IDockItemImage,
  IDockItemLabel,
} from "./types";
import { getIconIndex } from "./utils";

const DockRoot = memo<IDock>(
  ({
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
    children,
  }: IDock): React.JSX.Element => {
    const activeIndex = useSharedValue<number>(-1);
    const isActive = useSharedValue<number>(0);
    const dockWidth = useSharedValue<number>(0);
    const tappedIndex = useSharedValue<number>(-1);
    const itemCount = useSharedValue<number>(0);

    // Press handlers keyed by item index, filled by each <Dock.Item>.
    const pressHandlers = useRef<Array<(() => void) | undefined>>([]);
    const registerPress = useCallback((index: number, onPress?: () => void) => {
      pressHandlers.current[index] = onPress;
    }, []);

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

    const fireTap = useCallback((idx: number) => {
      const rounded = Math.round(idx);
      pressHandlers.current[rounded]?.();
    }, []);

    const gesture = useMemo(
      () =>
        Gesture.Manual()
          .onTouchesDown((e, manager) => {
            if (e.allTouches.length > 0) {
              const x = e.allTouches[0].x;
              const idx = getIconIndex(x, dockWidth.value, itemCount.value);
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
                itemCount.value,
              );
            }
          })
          .onTouchesUp((e) => {
            const finalIdx =
              e.allTouches.length > 0
                ? getIconIndex(
                    e.allTouches[0].x,
                    dockWidth.value,
                    itemCount.value,
                  )
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
        itemCount,
        settleConfig,
        fireTap,
      ],
    );

    const contextValue = useMemo(
      () => ({
        activeIndex,
        isActive,
        itemCount,
        registerPress,
        config: {
          size,
          peakSize,
          spread,
          gap,
          iconColor,
          tipColor,
          tipFontColor,
          iconRadius,
          showTip,
          paddingTop,
          paddingBottom,
          inputRange,
          outputRange,
        },
      }),
      [
        activeIndex,
        isActive,
        itemCount,
        registerPress,
        size,
        peakSize,
        spread,
        gap,
        iconColor,
        tipColor,
        tipFontColor,
        iconRadius,
        showTip,
        paddingTop,
        paddingBottom,
        inputRange,
        outputRange,
      ],
    );

    return (
      <DockContext.Provider value={contextValue}>
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
            {children}
          </Animated.View>
        </GestureDetector>
      </DockContext.Provider>
    );
  },
);

DockRoot.displayName = "Dock";

/* -------------------------------------------------------------------------- */
/*                                Dock.Items                                  */
/* -------------------------------------------------------------------------- */

const DockItems = memo<IDockItems>(
  ({ style, children }: IDockItems): React.JSX.Element => {
    const {
      itemCount,
      config: { paddingTop, paddingBottom },
    } = useDock();
    const count = React.Children.count(children);

    useEffect(() => {
      itemCount.value = count;
    }, [count, itemCount]);

    return (
      <View style={[styles.dockInner, { paddingTop, paddingBottom }, style]}>
        {React.Children.map(children, (child, index) => (
          <ItemIndexContext.Provider value={index}>
            {child}
          </ItemIndexContext.Provider>
        ))}
      </View>
    );
  },
);

DockItems.displayName = "Dock.Items";

/* -------------------------------------------------------------------------- */
/*                                 Dock.Item                                  */
/* -------------------------------------------------------------------------- */

const DockItemBase = memo<IDockItem>(
  ({ onPress, children }: IDockItem): React.JSX.Element => {
    const index = useItemIndex();
    const {
      activeIndex,
      isActive,
      itemCount,
      registerPress,
      config: { size, gap, inputRange, outputRange },
    } = useDock();

    useEffect(() => {
      registerPress(index, onPress);
      return () => registerPress(index, undefined);
    }, [index, onPress, registerPress]);

    // Conserved-width fisheye: the focused icon grows, and the extra width is
    // taken back evenly from every icon, so the row's total width stays fixed.
    // The shelf never grows past the screen and nothing gets clipped — while
    // the falloff (spread) still reads like the macOS magnification.
    const wrapperStyle = useAnimatedStyle<
      Required<
        Partial<Pick<ViewStyle, "width" | "height" | "marginHorizontal">>
      >
    >(() => {
      const n = Math.max(itemCount.value, 1);

      let totalExtra = 0;
      for (let j = 0; j < n; j++) {
        const d = Math.abs(activeIndex.value - j);
        const r = interpolate(d, inputRange, outputRange, Extrapolation.CLAMP);
        totalExtra += interpolate(isActive.value, ISACTIVE_INPUT, [
          0,
          r - size,
        ]);
      }

      const distance = Math.abs(activeIndex.value - index);
      const raw = interpolate(
        distance,
        inputRange,
        outputRange,
        Extrapolation.CLAMP,
      );
      const mine = interpolate(isActive.value, ISACTIVE_INPUT, [size, raw]);
      const s = mine - totalExtra / n;

      return { width: s, height: s, marginHorizontal: gap };
    });

    return (
      <Animated.View style={[styles.iconWrapper, wrapperStyle]}>
        {children}
      </Animated.View>
    );
  },
);

DockItemBase.displayName = "Dock.Item";

/* -------------------------------------------------------------------------- */
/*                              Dock.Item.Image                               */
/* -------------------------------------------------------------------------- */

const DockItemImage = memo<IDockItemImage>(
  ({
    style,
    children,
    useBackgroundColor,
  }: IDockItemImage): React.JSX.Element => {
    const index = useItemIndex();
    const {
      activeIndex,
      isActive,
      itemCount,
      config: { size, iconColor, iconRadius, inputRange, outputRange },
    } = useDock();

    // Scale the icon to fill its slot, whose size comes from the same
    // conserved-width fisheye used by <Dock.Item>. Bottom edge stays anchored
    // so icons grow upward off the shelf, macOS-style.
    const scaleStyle = useAnimatedStyle(() => {
      const n = Math.max(itemCount.value, 1);

      let totalExtra = 0;
      for (let j = 0; j < n; j++) {
        const d = Math.abs(activeIndex.value - j);
        const r = interpolate(d, inputRange, outputRange, Extrapolation.CLAMP);
        totalExtra += interpolate(isActive.value, ISACTIVE_INPUT, [
          0,
          r - size,
        ]);
      }

      const distance = Math.abs(activeIndex.value - index);
      const raw = interpolate(
        distance,
        inputRange,
        outputRange,
        Extrapolation.CLAMP,
      );
      const mine = interpolate(isActive.value, ISACTIVE_INPUT, [size, raw]);
      const s = mine - totalExtra / n;

      const scale = s / size;
      const translateY = -(size * (scale - 1)) / 2;
      return { transform: [{ translateY }, { scale }] };
    });

    return (
      <Animated.View
        style={[
          styles.iconInner,
          {
            ...(useBackgroundColor
              ? {
                  backgroundColor: iconColor,
                }
              : {}),
            borderRadius: iconRadius,
            width: size,
            height: size,
          },
          scaleStyle,
          style,
        ]}
      >
        {children}
      </Animated.View>
    );
  },
);

DockItemImage.displayName = "Dock.Item.Image";

/* -------------------------------------------------------------------------- */
/*                              Dock.Item.Label                               */
/* -------------------------------------------------------------------------- */

const DockItemLabel = memo<IDockItemLabel>(
  ({ children }: IDockItemLabel): React.JSX.Element => {
    const index = useItemIndex();
    const {
      activeIndex,
      isActive,
      config: { showTip, tipColor, tipFontColor },
    } = useDock();

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
      <Animated.View
        style={[styles.tooltip, { backgroundColor: tipColor }, tooltipStyle]}
        pointerEvents="none"
      >
        <Text
          style={[styles.tooltipText, { color: tipFontColor }]}
          numberOfLines={1}
        >
          {children}
        </Text>
      </Animated.View>
    );
  },
);

DockItemLabel.displayName = "Dock.Item.Label";

/* -------------------------------------------------------------------------- */
/*                          Compound component wiring                          */
/* -------------------------------------------------------------------------- */

const DockItem = Object.assign(DockItemBase, {
  Image: DockItemImage,
  Label: DockItemLabel,
});

const Dock = Object.assign(DockRoot, {
  Items: DockItems,
  Item: DockItem,
});

export { Dock };
export type {
  IDock,
  IDockItems,
  IDockItem,
  IDockItemImage,
  IDockItemLabel,
} from "./types";
