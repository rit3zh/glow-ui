// @ts-check
import React, {
  createContext,
  memo,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Pressable,
  StyleSheet,
  View,
  type LayoutChangeEvent,
  type TextStyle,
  type ViewStyle,
} from "react-native";
import * as Haptics from "expo-haptics";
import Animated, {
  Extrapolation,
  interpolate,
  interpolateColor,
  useAnimatedReaction,
  useAnimatedRef,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
} from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";

import { createCompoundComponent } from "@/utils/create-compound-component";

import {
  CENTRE_Z,
  Z_BAND_LIMIT,
  DEFAULT_ACTIVE_INDICATOR_COLOR,
  DEFAULT_ACTIVE_LABEL_COLOR,
  DEFAULT_FONT_SIZE,
  DEFAULT_INDICATOR_BORDER,
  DEFAULT_INDICATOR_COLOR,
  DEFAULT_INDICATOR_SIZE,
  DEFAULT_ITEM_HEIGHT,
  DEFAULT_LABEL_COLOR,
  DEFAULT_MIN_OPACITY,
  DEFAULT_MIN_SCALE,
  DEFAULT_SWEEP,
  FALLOFF_PLATEAU,
  PLATEAU_SCALE,
  PROXIMITY_SPAN,
  UNKNOWN_INDEX,
} from "./const";
import {
  indexAt,
  itemOffset,
  offsetForIndex,
  projectOnArc,
  radiusForSweep,
} from "./helper";
import type {
  IArcListContext,
  IArcListIndicator,
  IArcListItem,
  IArcListItemContext,
  IArcListLabel,
  IArcListRoot,
  IArcListViewport,
} from "./types";

const ArcListContext = createContext<IArcListContext | null>(null);
const ArcListItemContext = createContext<IArcListItemContext | null>(null);
const ArcListActiveContext = createContext<number>(0);

const ArcListIndexContext = createContext<number | null>(null);

const useArcList = (part: string): IArcListContext => {
  const context = useContext(ArcListContext);
  if (!context) {
    throw new Error(`ArcList.${part} must be rendered inside <ArcList.Root>.`);
  }
  return context;
};

const useArcListActiveIndex = (): number => useContext(ArcListActiveContext);

const useArcListItem = (part: string): IArcListItemContext => {
  const context = useContext(ArcListItemContext);
  if (!context) {
    throw new Error(`ArcList.${part} must be rendered inside <ArcList.Item>.`);
  }
  return context;
};

const ArcListRoot: React.FC<IArcListRoot> = ({
  children,
  itemHeight = DEFAULT_ITEM_HEIGHT,
  height,
  sweep = DEFAULT_SWEEP,
  radius: radiusProp,
  side = "left",
  snap = true,
  index: controlledIndex,
  defaultIndex = 0,
  minOpacity = DEFAULT_MIN_OPACITY,
  minScale = DEFAULT_MIN_SCALE,
  haptics = false,
  onIndexChange,
  style,
}: IArcListRoot): React.JSX.Element => {
  const initialIndex = controlledIndex ?? defaultIndex;

  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const scrollY = useSharedValue<number>(
    offsetForIndex(initialIndex, itemHeight),
  );
  const count = useSharedValue<number>(0);

  const [measuredHeight, setMeasuredHeight] = useState<number>(0);
  const [activeIndex, setActiveIndex] = useState<number>(initialIndex);
  const firstIndex = useRef<number>(initialIndex);

  const viewportHeight = height ?? measuredHeight;
  const halfHeight = viewportHeight / 2;
  const radius = radiusProp ?? radiusForSweep(halfHeight, sweep);
  const direction = side === "right" ? -1 : 1;

  const handleLayout = useCallback(
    (event: LayoutChangeEvent) => {
      if (height !== undefined) return;
      setMeasuredHeight(event.nativeEvent.layout.height);
    },
    [height],
  );

  const setCount = useCallback(
    (next: number) => {
      count.value = next;
    },
    [count],
  );

  const scrollToIndex = useCallback(
    (index: number, animated = true) => {
      scrollRef.current?.scrollTo({
        y: offsetForIndex(index, itemHeight),
        animated,
      });
    },
    [itemHeight, scrollRef],
  );

  const handleFocus = useCallback(
    (index: number) => {
      setActiveIndex(index);
      onIndexChange?.(index);
      if (haptics) Haptics.selectionAsync();
    },
    [onIndexChange, haptics],
  );

  useAnimatedReaction(
    () =>
      count.value > 0
        ? indexAt(scrollY.value, itemHeight, count.value)
        : UNKNOWN_INDEX,
    (current, previous) => {
      if (previous === null || previous === UNKNOWN_INDEX) return;
      if (current === UNKNOWN_INDEX || current === previous) return;
      scheduleOnRN(handleFocus, current);
    },
    [itemHeight, handleFocus],
  );

  useEffect(() => {
    if (controlledIndex === undefined || controlledIndex === activeIndex)
      return;
    scrollToIndex(controlledIndex);
  }, [controlledIndex, activeIndex, scrollToIndex]);

  const context = useMemo<IArcListContext>(
    () => ({
      scrollRef,
      scrollY,
      count,
      itemHeight,
      radius,
      halfHeight,
      direction,
      side,
      snap,
      minOpacity,
      minScale,
      initialIndex: firstIndex.current,
      scrollToIndex,
      setCount,
    }),
    [
      scrollRef,
      scrollY,
      count,
      itemHeight,
      radius,
      halfHeight,
      direction,
      side,
      snap,
      minOpacity,
      minScale,
      scrollToIndex,
      setCount,
    ],
  );

  return (
    <View style={[styles.root, { height }, style]} onLayout={handleLayout}>
      {viewportHeight > 0 ? (
        <ArcListContext.Provider value={context}>
          <ArcListActiveContext.Provider value={activeIndex}>
            {children}
          </ArcListActiveContext.Provider>
        </ArcListContext.Provider>
      ) : null}
    </View>
  );
};

const ArcListViewport: React.FC<IArcListViewport> = ({
  children,
  style,
  contentContainerStyle,
}: IArcListViewport): React.JSX.Element => {
  const {
    scrollRef,
    scrollY,
    itemHeight,
    halfHeight,
    snap,
    initialIndex,
    setCount,
  } = useArcList("Viewport");

  const didRestore = useRef<boolean>(false);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const total = React.Children.count(children);

  useEffect(() => {
    setCount(total);
  }, [total, setCount]);

  const handleContentSizeChange = useCallback(() => {
    if (didRestore.current) return;
    didRestore.current = true;
    if (initialIndex <= 0) return;
    scrollRef.current?.scrollTo({
      y: offsetForIndex(initialIndex, itemHeight),
      animated: false,
    });
  }, [initialIndex, itemHeight, scrollRef]);

  const contentPadding = Math.max(halfHeight - itemHeight / 2, 0);

  const rows = useMemo(
    () =>
      React.Children.map(children, (child, index) => (
        <ArcListIndexContext.Provider value={index}>
          {child}
        </ArcListIndexContext.Provider>
      )),
    [children],
  );

  return (
    <Animated.ScrollView
      ref={scrollRef}
      style={style}
      onScroll={scrollHandler}
      onContentSizeChange={handleContentSizeChange}
      scrollEventThrottle={1}
      showsVerticalScrollIndicator={false}
      snapToInterval={snap ? itemHeight : undefined}
      decelerationRate={snap ? "fast" : "normal"}
      contentContainerStyle={[
        { paddingVertical: contentPadding },
        contentContainerStyle,
      ]}
    >
      {rows}
    </Animated.ScrollView>
  );
};

const ArcListItem: React.FC<IArcListItem> = ({
  children,
  index: indexProp,
  disabled = false,
  onPress,
  style,
}: IArcListItem): React.JSX.Element => {
  const {
    scrollY,
    itemHeight,
    radius,
    direction,
    halfHeight,
    minOpacity,
    minScale,
    side,
    scrollToIndex,
  } = useArcList("Item");

  const injected = useContext(ArcListIndexContext);
  const index = indexProp ?? injected ?? 0;
  const falloff = useMemo(
    () => ({
      input: [0, halfHeight * FALLOFF_PLATEAU, halfHeight],
      opacity: [1, 1, minOpacity],
      scale: [1, PLATEAU_SCALE, minScale],
    }),
    [halfHeight, minOpacity, minScale],
  );

  const rItem = useAnimatedStyle<ViewStyle>(() => {
    const offset = itemOffset(index, itemHeight, scrollY.value);
    const { translateX, translateY, rotate, y, visible } = projectOnArc(
      offset,
      radius,
      direction,
    );

    const distance = Math.abs(y);

    return {
      opacity: visible
        ? interpolate(
            distance,
            falloff.input,
            falloff.opacity,
            Extrapolation.CLAMP,
          )
        : 0,
      zIndex:
        CENTRE_Z - Math.min(Math.round(distance / itemHeight), Z_BAND_LIMIT),
      transform: [
        { translateX },
        { translateY },
        { rotate: `${rotate}deg` },
        {
          scale: interpolate(
            distance,
            falloff.input,
            falloff.scale,
            Extrapolation.CLAMP,
          ),
        },
      ],
    };
  }, [index, itemHeight, radius, direction, falloff]);

  const proximity = useDerivedValue<number>(
    () =>
      interpolate(
        Math.abs(itemOffset(index, itemHeight, scrollY.value)),
        [0, itemHeight * PROXIMITY_SPAN],
        [1, 0],
        Extrapolation.CLAMP,
      ),
    [index, itemHeight],
  );

  const itemContext = useMemo<IArcListItemContext>(
    () => ({ index, proximity }),
    [index, proximity],
  );

  const handlePress = useCallback(() => {
    scrollToIndex(index);
    onPress?.(index);
  }, [scrollToIndex, index, onPress]);

  return (
    <ArcListItemContext.Provider value={itemContext}>
      <Animated.View
        style={[
          styles.item,
          side === "right" ? styles.itemRight : styles.itemLeft,
          { height: itemHeight },
          style,
          rItem,
        ]}
      >
        <Pressable
          disabled={disabled}
          onPress={handlePress}
          style={styles.press}
        >
          {children}
        </Pressable>
      </Animated.View>
    </ArcListItemContext.Provider>
  );
};

const ArcListLabel: React.FC<IArcListLabel> &
  React.FunctionComponent<IArcListLabel> = ({
  children,
  color = DEFAULT_LABEL_COLOR,
  activeColor = DEFAULT_ACTIVE_LABEL_COLOR,
  numberOfLines = 1,
  style,
}: IArcListLabel): React.JSX.Element & React.ReactNode => {
  const { proximity } = useArcListItem("Label");
  const rLabel = useAnimatedStyle<Pick<TextStyle, "color">>(() => {
    const t = proximity.value;
    if (t <= 0) return { color };
    if (t >= 1) return { color: activeColor };
    return { color: interpolateColor(t, [0, 1], [color, activeColor]) };
  }, [color, activeColor]);

  return (
    <Animated.Text
      numberOfLines={numberOfLines}
      style={[styles.label, style, rLabel]}
    >
      {children}
    </Animated.Text>
  );
};

const ArcListIndicator: React.FC<IArcListIndicator> = ({
  children,
  size = DEFAULT_INDICATOR_SIZE,
  color = DEFAULT_INDICATOR_COLOR,
  activeColor = DEFAULT_ACTIVE_INDICATOR_COLOR,
  borderWidth = DEFAULT_INDICATOR_BORDER,
  style,
}: IArcListIndicator): React.JSX.Element => {
  const { proximity } = useArcListItem("Indicator");

  const rBorder = useAnimatedStyle<Pick<ViewStyle, "borderColor">>(() => {
    const t = proximity.value;
    if (t <= 0) return { borderColor: color };
    if (t >= 1) return { borderColor: activeColor };
    return { borderColor: interpolateColor(t, [0, 1], [color, activeColor]) };
  }, [color, activeColor]);

  const rFill = useAnimatedStyle<Pick<ViewStyle, "opacity">>(() => ({
    opacity: proximity.value,
  }));

  return (
    <Animated.View
      style={[
        styles.indicator,
        { width: size, height: size, borderRadius: size / 2, borderWidth },
        style,
        rBorder,
      ]}
    >
      <Animated.View
        pointerEvents="none"
        style={[
          StyleSheet.absoluteFill,
          { backgroundColor: activeColor, borderRadius: size / 2 },
          rFill,
        ]}
      />
      {children}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    overflow: "hidden",
  },
  item: {
    justifyContent: "center",
  },
  itemLeft: {
    alignItems: "flex-start",
    transformOrigin: "0% 50%",
  },
  itemRight: {
    alignItems: "flex-end",
    transformOrigin: "100% 50%",
  },
  press: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    flexGrow: 1,
    gap: 10,
  },
  label: {
    fontSize: DEFAULT_FONT_SIZE,
    fontWeight: "600",
  },
  indicator: {
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
});

const Root = createCompoundComponent("ArcList.Root", memo(ArcListRoot));
const Viewport = createCompoundComponent(
  "ArcList.Viewport",
  memo(ArcListViewport),
);
const Item = createCompoundComponent("ArcList.Item", memo(ArcListItem));
const Label = createCompoundComponent("ArcList.Label", memo(ArcListLabel));
const Indicator = createCompoundComponent(
  "ArcList.Indicator",
  memo(ArcListIndicator),
);

const ArcList = createCompoundComponent("ArcList", Root, {
  Root,
  Viewport,
  Item,
  Label,
  Indicator,
});

export {
  ArcList,
  Root as ArcListRoot,
  Viewport as ArcListViewport,
  Item as ArcListItem,
  Label as ArcListLabel,
  Indicator as ArcListIndicator,
  useArcList,
  useArcListActiveIndex,
  useArcListItem,
};
export default ArcList;
export type {
  ArcSide,
  IArcListContext,
  IArcListIndicator,
  IArcListItem,
  IArcListItemContext,
  IArcListLabel,
  IArcListRoot,
  IArcListViewport,
} from "./types";
