import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  View,
  Text,
  StyleSheet,
  type LayoutChangeEvent,
  type ViewStyle,
} from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  Easing,
  cancelAnimation,
  useAnimatedReaction,
  useAnimatedStyle,
  interpolateColor,
  useDerivedValue,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { Canvas, LinearGradient, Path, vec } from "@shopify/react-native-skia";
import { scheduleOnRN } from "react-native-worklets";
import { createCompoundComponent } from "@/utils/create-compound-component";
import {
  buildGridPath,
  indexForX,
  lerp,
  roundedRect,
  staggerProgress,
  formatTick,
  toDomain,
  toSlots,
  valueToHeight,
} from "./helper";
import {
  AXIS_COLOR,
  BAR_COLOR,
  BAR_RATIO,
  BOTTOM_INSET,
  GRID_COLOR,
  GROW_DURATION,
  HIGHLIGHT_COLOR,
  LEFT_INSET,
  MORPH_DURATION,
  SPRING_CONFIG,
  STAGGER,
  TICK_COUNT,
  TOP_INSET,
} from "./const";
import { BarChartContext, useBarChart } from "./context";
import type {
  IBarChartBar,
  IBarChartSlot,
  IBarChartBars,
  IBarChartContext,
  IBarChartGrid,
  IBarChartHighlight,
  IBarChartRoot,
  IBarChartTooltip,
  IBarChartXAxis,
  IBarChartYAxis,
} from "./types";

const OVERLAY_LAYER = "__barChartOverlay";

const isOverlayChild = (child: React.ReactNode): boolean =>
  React.isValidElement(child) &&
  (child.type as unknown as Record<string, unknown>)[OVERLAY_LAYER] === true;

const useSelectedIndex = (
  selectedIndex: IBarChartContext["selectedIndex"],
): number => {
  const [index, setIndex] = useState<number>(-1);
  useAnimatedReaction(
    () => selectedIndex.value,
    (current, previous) => {
      if (current !== previous) scheduleOnRN(setIndex, current);
    },
    [],
  );
  return index;
};

const BarChartRoot: React.FC<IBarChartRoot> = ({
  children,
  data,
  maxY,
  tickCount = TICK_COUNT,
  barRatio = BAR_RATIO,
  leftInset = LEFT_INSET,
  bottomInset = BOTTOM_INSET,
  topInset = TOP_INSET,
  animate = true,
  growDuration = GROW_DURATION,
  morphDuration = MORPH_DURATION,
  stagger = STAGGER,
  enablePan = true,
  onBarChange,
  onGestureStart,
  onGestureEnd,
  style,
}: IBarChartRoot): React.JSX.Element => {
  const [size, setSize] = useState<{ width: number; height: number }>({
    width: 0,
    height: 0,
  });

  const slotsShared = useSharedValue<IBarChartSlot[]>([]);
  const originValues = useSharedValue<number[]>([]);
  const targetValues = useSharedValue<number[]>([]);
  const morph = useSharedValue<number>(1);
  const grow = useSharedValue<number>(0);
  const isActive = useSharedValue<number>(0);
  const selectedIndex = useSharedValue<number>(-1);
  const hasEntered = useRef<boolean>(false);

  const onLayout = useCallback(({ nativeEvent }: LayoutChangeEvent) => {
    const { width, height } = nativeEvent.layout;
    setSize((current) =>
      current.width === width && current.height === height
        ? current
        : { width, height },
    );
  }, []);

  const domain = useMemo(
    () => toDomain(data, tickCount, maxY),
    [data, tickCount, maxY],
  );

  const plotLeft = leftInset;
  const plotTop = topInset;
  const plotBottom = Math.max(size.height - bottomInset, topInset);
  const plotWidth = Math.max(size.width - leftInset, 0);
  const plotHeight = Math.max(plotBottom - plotTop, 0);

  const slots = useMemo(
    () => toSlots(data.length, plotLeft, plotWidth, barRatio),
    [barRatio, data.length, plotLeft, plotWidth],
  );

  useEffect(() => {
    slotsShared.value = slots;
  }, [slots, slotsShared]);

  const isMeasured = size.width > 0 && size.height > 0;

  useEffect(() => {
    if (!isMeasured || data.length === 0) return;

    const values = data.map((point) => point.value);
    const isEntrance = !hasEntered.current;
    hasEntered.current = true;

    if (!animate) {
      originValues.value = values;
      targetValues.value = values;
      cancelAnimation(morph);
      morph.value = 1;
      grow.value = 1;
      return;
    }

    if (isEntrance || targetValues.value.length !== values.length) {
      originValues.value = values;
      targetValues.value = values;
      cancelAnimation(morph);
      morph.value = 1;
      cancelAnimation(grow);
      grow.value = 0;
      grow.value = withTiming(1, {
        duration: growDuration,
        easing: Easing.out(Easing.cubic),
      });
      return;
    }

    const from = originValues.value;
    const to = targetValues.value;
    const progress = morph.value;
    originValues.value = values.map((_, i) =>
      lerp(from[i] ?? 0, to[i] ?? 0, progress),
    );
    targetValues.value = values;

    cancelAnimation(morph);
    morph.value = 0;
    morph.value = withTiming(1, {
      duration: morphDuration,
      easing: Easing.inOut(Easing.cubic),
    });
  }, [
    animate,
    data,
    grow,
    growDuration,
    isMeasured,
    morph,
    morphDuration,
    originValues,
    targetValues,
  ]);

  const bars = useDerivedValue<IBarChartBar[]>(() => {
    const slotList = slotsShared.value;
    const origin = originValues.value;
    const target = targetValues.value;

    const out: IBarChartBar[] = [];
    for (let i = 0; i < slotList.length; i++) {
      const slot = slotList[i]!;
      const value = lerp(origin[i] ?? 0, target[i] ?? 0, morph.value);
      const full = valueToHeight(value, domain.min, domain.max, plotHeight);
      const height =
        full * staggerProgress(grow.value, i, slotList.length, stagger);
      out.push({
        x: slot.x,
        width: slot.width,
        top: plotBottom - height,
        height,
      });
    }
    return out;
  }, [domain.min, domain.max, plotBottom, plotHeight, stagger]);

  const reportBar = useCallback(
    (index: number) => {
      const point = data[index];
      if (point != null) onBarChange?.(point, index);
    },
    [data, onBarChange],
  );

  const handleGestureStart = useCallback(() => {
    onGestureStart?.();
  }, [onGestureStart]);

  const handleGestureEnd = useCallback(() => {
    onGestureEnd?.();
  }, [onGestureEnd]);

  const gesture = useMemo(() => {
    return Gesture.Pan()
      .enabled(enablePan)
      .minDistance(0)
      .onBegin((event) => {
        "worklet";
        const index = indexForX(slotsShared.value, event.x);
        if (index >= 0 && index !== selectedIndex.value) {
          selectedIndex.value = index;
          scheduleOnRN(reportBar, index);
        }
        isActive.value = withTiming(1, { duration: 140 });
        scheduleOnRN(handleGestureStart);
      })
      .onUpdate((event) => {
        "worklet";
        const index = indexForX(slotsShared.value, event.x);
        if (index >= 0 && index !== selectedIndex.value) {
          selectedIndex.value = index;
          scheduleOnRN(reportBar, index);
        }
      })
      .onFinalize(() => {
        "worklet";
        isActive.value = withTiming(0, { duration: 220 });
        selectedIndex.value = -1;
        scheduleOnRN(handleGestureEnd);
      });
  }, [
    enablePan,
    handleGestureEnd,
    handleGestureStart,
    isActive,
    reportBar,
    selectedIndex,
    slotsShared,
  ]);

  const context = useMemo<IBarChartContext>(
    () => ({
      data,
      domain,
      slots,
      width: size.width,
      height: size.height,
      plotLeft,
      plotTop,
      plotBottom,
      plotWidth,
      plotHeight,
      bars,
      grow,
      isActive,
      selectedIndex,
    }),
    [
      data,
      domain,
      slots,
      size.width,
      size.height,
      plotLeft,
      plotTop,
      plotBottom,
      plotWidth,
      plotHeight,
      bars,
      grow,
      isActive,
      selectedIndex,
    ],
  );

  const [canvasChildren, overlayChildren] = useMemo(() => {
    const canvas: React.ReactNode[] = [];
    const overlay: React.ReactNode[] = [];
    React.Children.forEach(children, (child) => {
      (isOverlayChild(child) ? overlay : canvas).push(child);
    });
    return [canvas, overlay];
  }, [children]);

  const isReady = isMeasured && data.length > 0;

  return (
    <View style={[styles.root, style]} onLayout={onLayout}>
      <GestureDetector gesture={gesture}>
        <View style={styles.fill}>
          <Canvas style={styles.fill}>
            {isReady ? (
              <BarChartContext.Provider value={context}>
                {canvasChildren}
              </BarChartContext.Provider>
            ) : null}
          </Canvas>
          {isReady ? (
            <BarChartContext.Provider value={context}>
              {overlayChildren}
            </BarChartContext.Provider>
          ) : null}
        </View>
      </GestureDetector>
    </View>
  );
};

const BarChartGrid: React.FC<IBarChartGrid> = ({
  color = GRID_COLOR,
  thickness = 1,
}: IBarChartGrid) => {
  const { domain, plotLeft, plotBottom, plotHeight, width } =
    useBarChart("Grid");

  const path = useMemo(
    () => buildGridPath(domain, plotLeft, width, plotBottom, plotHeight),
    [domain, plotBottom, plotHeight, plotLeft, width],
  );

  if (path === "") return null;

  return (
    <Path path={path} color={color} style="stroke" strokeWidth={thickness} />
  );
};

const BarChartHighlight: React.FC<IBarChartHighlight> = ({
  color = HIGHLIGHT_COLOR,
  radius = 0,
  inset = 14,
}: IBarChartHighlight) => {
  const { slots, plotTop, plotHeight, isActive, selectedIndex } =
    useBarChart("Highlight");
  const bandX = useSharedValue<number>(0);
  const bandWidth = useSharedValue<number>(0);

  useAnimatedReaction(
    () => selectedIndex.value,
    (index) => {
      const slot = slots[index];
      if (slot == null) return;
      bandWidth.value = slot.width + inset * 2;
      if (isActive.value === 0) {
        bandX.value = slot.x - inset;
      } else {
        bandX.value = withSpring(slot.x - inset, SPRING_CONFIG);
      }
    },
    [slots, inset],
  );

  const path = useDerivedValue<string>(
    () =>
      bandWidth.value <= 0
        ? "M 0 0"
        : roundedRect(
            bandX.value,
            plotTop,
            bandWidth.value,
            plotHeight,
            radius,
          ),
    [plotTop, plotHeight, radius],
  );

  return <Path path={path} color={color} opacity={isActive} />;
};

const BarChartBar: React.FC<{
  readonly index: number;
  readonly color: string;
  readonly activeColor?: string;
  readonly radius?: number;
  readonly gradientColors?: readonly string[];
}> = memo(({ index, color, activeColor, radius, gradientColors }) => {
  const { bars, plotTop, plotBottom, selectedIndex, isActive } =
    useBarChart("Bars");

  const path = useDerivedValue<string>(() => {
    const bar = bars.value[index];
    if (bar == null || bar.height <= 0.5) return "M 0 0";
    return roundedRect(
      bar.x,
      bar.top,
      bar.width,
      bar.height,
      radius ?? bar.width / 2,
    );
  }, [index, radius]);

  const selection = useDerivedValue<number>(
    () => withSpring(selectedIndex.value === index ? 1 : 0, SPRING_CONFIG),
    [index],
  );

  const fill = useDerivedValue<string>(() => {
    if (activeColor == null) return color;
    return interpolateColor(
      selection.value * isActive.value,
      [0, 1],
      [color, activeColor],
    ) as string;
  }, [color, activeColor]);

  return (
    <Path path={path} color={fill}>
      {gradientColors != null && (
        <LinearGradient
          start={vec(0, plotTop)}
          end={vec(0, plotBottom)}
          colors={gradientColors as string[]}
        />
      )}
    </Path>
  );
});
BarChartBar.displayName = "BarChart.Bar";

const BarChartBars: React.FC<IBarChartBars> = ({
  color = BAR_COLOR,
  gradientColors,
  radius,
  activeColor,
}: IBarChartBars) => {
  const { data } = useBarChart("Bars");

  return (
    <>
      {data.map((point, index) => (
        <BarChartBar
          key={`${point.label}-${index}`}
          index={index}
          color={color}
          activeColor={activeColor}
          radius={radius}
          gradientColors={gradientColors}
        />
      ))}
    </>
  );
};

const BarChartYAxis: React.FC<IBarChartYAxis> = ({
  format,
  style,
}: IBarChartYAxis) => {
  const { domain, plotLeft, plotBottom, plotHeight } = useBarChart("YAxis");

  const span = domain.max - domain.min || 1;
  const step = (domain.ticks[1] ?? 1) - (domain.ticks[0] ?? 0);

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      {domain.ticks.map((tick) => {
        const y = plotBottom - ((tick - domain.min) / span) * plotHeight;
        return (
          <Text
            key={tick}
            numberOfLines={1}
            style={[
              styles.axisText,
              styles.yAxisText,
              { top: y - 8, width: Math.max(plotLeft - 8, 0) },
              style,
            ]}
          >
            {format ? format(tick) : formatTick(tick, step)}
          </Text>
        );
      })}
    </View>
  );
};

const BarChartXAxis: React.FC<IBarChartXAxis> = ({
  format,
  style,
  activeStyle,
}: IBarChartXAxis) => {
  const { data, slots, plotBottom, plotWidth, selectedIndex } =
    useBarChart("XAxis");
  const index = useSelectedIndex(selectedIndex);

  const slotWidth = data.length > 0 ? plotWidth / data.length : 0;

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      {data.map((point, i) => {
        const slot = slots[i];
        if (slot == null) return null;
        return (
          <Text
            key={`${point.label}-${i}`}
            numberOfLines={1}
            style={[
              styles.axisText,
              styles.xAxisText,
              {
                top: plotBottom + 8,
                left: slot.center - slotWidth / 2,
                width: slotWidth,
              },
              style,
              i === index && styles.xAxisTextActive,
              i === index && activeStyle,
            ]}
          >
            {format ? format(point, i) : point.label}
          </Text>
        );
      })}
    </View>
  );
};

const BarChartTooltip: React.FC<IBarChartTooltip> = ({
  children,
  name,
  format,
  swatchColor = BAR_COLOR,
  style,
  labelStyle,
  nameStyle,
  valueStyle,
}: IBarChartTooltip) => {
  const { data, bars, isActive, selectedIndex, width, plotTop } =
    useBarChart("Tooltip");
  const index = useSelectedIndex(selectedIndex);
  const cardWidth = useSharedValue<number>(0);
  const cardHeight = useSharedValue<number>(0);

  const onLayout = useCallback(
    ({ nativeEvent }: LayoutChangeEvent) => {
      cardWidth.value = nativeEvent.layout.width;
      cardHeight.value = nativeEvent.layout.height;
    },
    [cardHeight, cardWidth],
  );

  const animatedStyle = useAnimatedStyle<
    Pick<ViewStyle, "transform" | "opacity">
  >(() => {
    const bar = bars.value[selectedIndex.value];
    if (bar == null) return { opacity: 0, transform: [] };

    const center = bar.x + bar.width / 2;
    const x = Math.min(
      Math.max(center - cardWidth.value / 2, 0),
      Math.max(width - cardWidth.value, 0),
    );
    const y = Math.max(bar.top - cardHeight.value - 12, plotTop);

    return {
      opacity: isActive.value,
      transform: [
        { translateX: withSpring(x, SPRING_CONFIG) },
        { translateY: withSpring(y, SPRING_CONFIG) },
      ],
    };
  });

  const point = index >= 0 ? data[index] : undefined;

  return (
    <Animated.View
      pointerEvents="none"
      onLayout={onLayout}
      style={[styles.tooltip, animatedStyle, style]}
    >
      {children ??
        (point != null ? (
          <>
            <Text style={[styles.tooltipLabel, labelStyle]}>{point.label}</Text>
            <View style={styles.tooltipRow}>
              <View
                style={[styles.tooltipSwatch, { backgroundColor: swatchColor }]}
              />
              {name != null && (
                <Text style={[styles.tooltipName, nameStyle]}>{name}</Text>
              )}
              <Text style={[styles.tooltipValue, valueStyle]}>
                {format ? format(point, index) : String(point.value)}
              </Text>
            </View>
          </>
        ) : null)}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  root: {
    width: "100%",
    height: 260,
  },
  fill: {
    flex: 1,
  },
  axisText: {
    position: "absolute",
    color: AXIS_COLOR,
    fontSize: 12,
    fontWeight: "500",
  },
  yAxisText: {
    left: 0,
    textAlign: "right",
  },
  xAxisText: {
    textAlign: "center",
  },
  xAxisTextActive: {
    color: "#1C1C1E",
    fontWeight: "700",
  },
  tooltip: {
    position: "absolute",
    top: 0,
    left: 0,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
  tooltipLabel: {
    color: "#1C1C1E",
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 6,
  },
  tooltipRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  tooltipSwatch: {
    width: 9,
    height: 9,
    borderRadius: 999,
  },
  tooltipName: {
    color: "#6E6E73",
    fontSize: 14,
    fontWeight: "500",
    marginRight: 16,
  },
  tooltipValue: {
    color: "#1C1C1E",
    fontSize: 15,
    fontWeight: "700",
    marginLeft: "auto",
  },
});

const Root = createCompoundComponent("BarChart.Root", memo(BarChartRoot));
const Grid = createCompoundComponent("BarChart.Grid", memo(BarChartGrid));
const Highlight = createCompoundComponent(
  "BarChart.Highlight",
  memo(BarChartHighlight),
);
const Bars = createCompoundComponent("BarChart.Bars", memo(BarChartBars));
const YAxis = createCompoundComponent("BarChart.YAxis", memo(BarChartYAxis), {
  [OVERLAY_LAYER]: true,
});
const XAxis = createCompoundComponent("BarChart.XAxis", memo(BarChartXAxis), {
  [OVERLAY_LAYER]: true,
});
const Tooltip = createCompoundComponent(
  "BarChart.Tooltip",
  memo(BarChartTooltip),
  { [OVERLAY_LAYER]: true },
);

const BarChart = createCompoundComponent("BarChart", Root, {
  Root,
  Grid,
  Highlight,
  Bars,
  YAxis,
  XAxis,
  Tooltip,
});

export { BarChart, useBarChart };
export default BarChart;
export type {
  IBarChartRoot,
  IBarChartBars,
  IBarChartGrid,
  IBarChartHighlight,
  IBarChartYAxis,
  IBarChartXAxis,
  IBarChartTooltip,
  IBarChartContext,
  IBarChartPoint,
  IBarChartSlot,
  IBarChartDomain,
  IBarChartBar,
} from "./types";
