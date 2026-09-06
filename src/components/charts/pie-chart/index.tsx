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
import { Canvas, Path } from "@shopify/react-native-skia";
import { scheduleOnRN } from "react-native-worklets";
import { createCompoundComponent } from "@/utils/create-compound-component";
import {
  angleForPoint,
  arcCentroid,
  arcPath,
  colorAt,
  distanceFromCenter,
  formatShare,
  indexForAngle,
  lerp,
  sumValues,
  toRadians,
  toSlices,
} from "./helper";
import {
  ACTIVE_OFFSET,
  ANGLE_ORIGIN,
  BOTTOM_INSET,
  GROW_DURATION,
  INNER_RADIUS,
  LABEL_COLOR,
  MORPH_DURATION,
  PAD_ANGLE,
  RADIUS_INSET,
  SLICE_COLORS,
  SPRING_CONFIG,
  START_ANGLE,
  TAU,
  VALUE_COLOR,
} from "./const";
import { PieChartContext, usePieChart } from "./context";
import type {
  IPieChartContext,
  IPieChartLabel,
  IPieChartLegend,
  IPieChartRoot,
  IPieChartSlices,
  IPieChartTooltip,
  IPieChartArc,
} from "./types";

const OVERLAY_LAYER = "__pieChartOverlay";

const isOverlayChild = (child: React.ReactNode): boolean =>
  React.isValidElement(child) &&
  (child.type as unknown as Record<string, unknown>)[OVERLAY_LAYER] === true;

const useSelectedIndex = (
  selectedIndex: IPieChartContext["selectedIndex"],
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

const PieChartRoot: React.FC<IPieChartRoot> = ({
  children,
  data,
  radius: radiusProp,
  innerRadius = INNER_RADIUS,
  startAngle = START_ANGLE,
  padAngle = PAD_ANGLE,
  bottomInset = BOTTOM_INSET,
  activeOffset = ACTIVE_OFFSET,
  animate = true,
  growDuration = GROW_DURATION,
  morphDuration = MORPH_DURATION,
  enableGesture = true,
  onSliceChange,
  onGestureStart,
  onGestureEnd,
  style,
}: IPieChartRoot): React.JSX.Element => {
  const [size, setSize] = useState<{ width: number; height: number }>({
    width: 0,
    height: 0,
  });

  const originFractions = useSharedValue<number[]>([]);
  const targetFractions = useSharedValue<number[]>([]);
  const spansShared = useSharedValue<number[]>([]);
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

  const slices = useMemo(() => toSlices(data), [data]);
  const total = useMemo(() => sumValues(data), [data]);

  const plotHeight = Math.max(size.height - bottomInset, 0);
  const centerX = size.width / 2;
  const centerY = plotHeight / 2;

  const radius = Math.max(
    radiusProp ??
      Math.min(size.width, plotHeight) / 2 - activeOffset - RADIUS_INSET,
    0,
  );
  const innerRadiusPx = radius * Math.min(Math.max(innerRadius, 0), 0.95);

  const startRadians = useMemo(() => toRadians(startAngle), [startAngle]);
  const padRadians = useMemo(() => toRadians(padAngle), [padAngle]);

  const spans = useMemo(() => {
    const out: number[] = [0];
    let cursor = 0;
    for (const slice of slices) {
      cursor += slice.fraction * TAU;
      out.push(cursor);
    }
    return out;
  }, [slices]);

  useEffect(() => {
    spansShared.value = spans;
  }, [spans, spansShared]);

  const isMeasured = size.width > 0 && size.height > 0;

  useEffect(() => {
    if (!isMeasured || data.length === 0) return;

    const fractions = slices.map((slice) => slice.fraction);
    const isEntrance = !hasEntered.current;
    hasEntered.current = true;

    if (!animate) {
      originFractions.value = fractions;
      targetFractions.value = fractions;
      cancelAnimation(morph);
      morph.value = 1;
      grow.value = 1;
      return;
    }

    if (isEntrance || targetFractions.value.length !== fractions.length) {
      originFractions.value = fractions;
      targetFractions.value = fractions;
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

    const from = originFractions.value;
    const to = targetFractions.value;
    const progress = morph.value;
    originFractions.value = fractions.map((_, i) =>
      lerp(from[i] ?? 0, to[i] ?? 0, progress),
    );
    targetFractions.value = fractions;

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
    originFractions,
    slices,
    targetFractions,
  ]);

  const arcs = useDerivedValue<IPieChartArc[]>(() => {
    const origin = originFractions.value;
    const target = targetFractions.value;
    const count = Math.max(origin.length, target.length);
    const limit = grow.value * TAU;

    const out: IPieChartArc[] = [];
    let cursor = 0;
    for (let i = 0; i < count; i++) {
      const sweep = lerp(origin[i] ?? 0, target[i] ?? 0, morph.value) * TAU;
      const rawStart = cursor;
      const rawEnd = cursor + sweep;
      cursor = rawEnd;

      const pad = sweep > padRadians ? padRadians : 0;
      const start = rawStart + pad / 2;
      const end = Math.max(Math.min(rawEnd - pad / 2, limit), start);

      out.push({
        start: startRadians + start,
        end: startRadians + end,
        mid: startRadians + (rawStart + rawEnd) / 2,
      });
    }
    return out;
  }, [padRadians, startRadians]);

  const reportSlice = useCallback(
    (index: number) => {
      const point = data[index];
      if (point != null) onSliceChange?.(point, index);
    },
    [data, onSliceChange],
  );

  const handleGestureStart = useCallback(() => {
    onGestureStart?.();
  }, [onGestureStart]);

  const handleGestureEnd = useCallback(() => {
    onGestureEnd?.();
  }, [onGestureEnd]);

  const gesture = useMemo(() => {
    return Gesture.Pan()
      .enabled(enableGesture)
      .minDistance(0)
      .onBegin((event) => {
        "worklet";
        const distance = distanceFromCenter(event.x, event.y, centerX, centerY);
        const inside =
          distance <= radius + activeOffset && distance >= innerRadiusPx;
        const index = inside
          ? indexForAngle(
              spansShared.value,
              angleForPoint(event.x, event.y, centerX, centerY),
            )
          : -1;

        if (index !== selectedIndex.value) {
          selectedIndex.value = index;
          if (index >= 0) scheduleOnRN(reportSlice, index);
        }
        isActive.value = withTiming(index >= 0 ? 1 : 0, { duration: 140 });
        scheduleOnRN(handleGestureStart);
      })
      .onUpdate((event) => {
        "worklet";
        const distance = distanceFromCenter(event.x, event.y, centerX, centerY);
        const inside =
          distance <= radius + activeOffset && distance >= innerRadiusPx;
        const index = inside
          ? indexForAngle(
              spansShared.value,
              angleForPoint(event.x, event.y, centerX, centerY),
            )
          : -1;

        if (index !== selectedIndex.value) {
          selectedIndex.value = index;
          if (index >= 0) scheduleOnRN(reportSlice, index);
          isActive.value = withTiming(index >= 0 ? 1 : 0, { duration: 140 });
        }
      })
      .onFinalize(() => {
        "worklet";
        isActive.value = withTiming(0, { duration: 220 });
        selectedIndex.value = -1;
        scheduleOnRN(handleGestureEnd);
      });
  }, [
    activeOffset,
    centerX,
    centerY,
    enableGesture,
    handleGestureEnd,
    handleGestureStart,
    innerRadiusPx,
    isActive,
    radius,
    reportSlice,
    selectedIndex,
    spansShared,
  ]);

  const context = useMemo<IPieChartContext>(
    () => ({
      data,
      slices,
      total,
      width: size.width,
      height: size.height,
      centerX,
      centerY,
      radius,
      innerRadius: innerRadiusPx,
      activeOffset,
      bottomInset,
      arcs,
      grow,
      isActive,
      selectedIndex,
    }),
    [
      data,
      slices,
      total,
      size.width,
      size.height,
      centerX,
      centerY,
      radius,
      innerRadiusPx,
      activeOffset,
      bottomInset,
      arcs,
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

  const isReady = isMeasured && data.length > 0 && radius > 0;

  return (
    <View style={[styles.root, style]} onLayout={onLayout}>
      <GestureDetector gesture={gesture}>
        <View style={styles.fill}>
          <Canvas style={styles.fill}>
            {isReady ? (
              <PieChartContext.Provider value={context}>
                {canvasChildren}
              </PieChartContext.Provider>
            ) : null}
          </Canvas>
          {isReady ? (
            <PieChartContext.Provider value={context}>
              {overlayChildren}
            </PieChartContext.Provider>
          ) : null}
        </View>
      </GestureDetector>
    </View>
  );
};

const PieChartSlice: React.FC<{
  readonly index: number;
  readonly color: string;
  readonly activeColor?: string;
  readonly inactiveOpacity: number;
  readonly strokeColor?: string;
  readonly strokeWidth: number;
}> = memo(
  ({
    index,
    color,
    activeColor,
    inactiveOpacity,
    strokeColor,
    strokeWidth,
  }) => {
    const {
      arcs,
      centerX,
      centerY,
      radius,
      innerRadius,
      activeOffset,
      selectedIndex,
      isActive,
    } = usePieChart("Slices");

    const selection = useDerivedValue<number>(
      () => withSpring(selectedIndex.value === index ? 1 : 0, SPRING_CONFIG),
      [index],
    );

    const path = useDerivedValue<string>(() => {
      const arc = arcs.value[index];
      if (arc == null) return "M 0 0";

      const push = selection.value * isActive.value * activeOffset;
      const theta = ANGLE_ORIGIN + arc.mid;
      return arcPath(
        centerX + Math.cos(theta) * push,
        centerY + Math.sin(theta) * push,
        radius,
        innerRadius,
        arc.start,
        arc.end,
      );
    }, [index, centerX, centerY, radius, innerRadius, activeOffset]);

    const opacity = useDerivedValue<number>(() => {
      const dim = 1 - inactiveOpacity;
      return 1 - isActive.value * dim * (1 - selection.value);
    }, [inactiveOpacity]);

    const fill = useDerivedValue<string>(() => {
      if (activeColor == null) return color;
      return interpolateColor(
        selection.value * isActive.value,
        [0, 1],
        [color, activeColor],
      ) as string;
    }, [color, activeColor]);

    return (
      <>
        <Path path={path} color={fill} opacity={opacity} />
        {strokeColor != null && (
          <Path
            path={path}
            color={strokeColor}
            opacity={opacity}
            style="stroke"
            strokeWidth={strokeWidth}
          />
        )}
      </>
    );
  },
);
PieChartSlice.displayName = "PieChart.Slice";

const PieChartSlices: React.FC<IPieChartSlices> = ({
  colors = SLICE_COLORS,
  activeColor,
  inactiveOpacity = 1,
  strokeColor,
  strokeWidth = 2,
}: IPieChartSlices) => {
  const { data } = usePieChart("Slices");

  return (
    <>
      {data.map((point, index) => (
        <PieChartSlice
          key={`${point.label}-${index}`}
          index={index}
          color={point.color ?? colorAt(colors, index)}
          activeColor={activeColor}
          inactiveOpacity={inactiveOpacity}
          strokeColor={strokeColor}
          strokeWidth={strokeWidth}
        />
      ))}
    </>
  );
};

const PieChartLabel: React.FC<IPieChartLabel> = ({
  children,
  format,
  formatValue,
  placeholder,
  placeholderValue,
  style,
  labelStyle,
  valueStyle,
}: IPieChartLabel) => {
  const { data, slices, centerX, centerY, innerRadius, selectedIndex } =
    usePieChart("Label");
  const index = useSelectedIndex(selectedIndex);
  const point = index >= 0 ? data[index] : undefined;
  const slice = index >= 0 ? slices[index] : undefined;

  const label =
    point != null
      ? format
        ? format(point, index)
        : point.label
      : (placeholder ?? "");
  const value =
    point != null && slice != null
      ? formatValue
        ? formatValue(point, index)
        : formatShare(slice.fraction)
      : (placeholderValue ?? "");

  const maxWidth = Math.max(innerRadius * 1.4, 0);

  return (
    <View
      pointerEvents="none"
      style={[
        styles.label,
        { left: centerX - maxWidth / 2, top: centerY, width: maxWidth },
        style,
      ]}
    >
      {children ?? (
        <>
          {label !== "" && (
            <Text numberOfLines={1} style={[styles.labelText, labelStyle]}>
              {label}
            </Text>
          )}
          {value !== "" && (
            <Text numberOfLines={1} style={[styles.valueText, valueStyle]}>
              {value}
            </Text>
          )}
        </>
      )}
    </View>
  );
};

const PieChartLegend: React.FC<IPieChartLegend> = ({
  colors = SLICE_COLORS,
  format,
  direction = "row",
  style,
  itemStyle,
  labelStyle,
  activeLabelStyle,
}: IPieChartLegend) => {
  const { data, bottomInset, selectedIndex } = usePieChart("Legend");
  const index = useSelectedIndex(selectedIndex);

  return (
    <View
      pointerEvents="none"
      style={[
        styles.legend,
        { height: bottomInset },
        direction === "column" && styles.legendColumn,
        style,
      ]}
    >
      {data.map((point, i) => (
        <View
          key={`${point.label}-${i}`}
          style={[styles.legendItem, itemStyle]}
        >
          <View
            style={[
              styles.legendSwatch,
              { backgroundColor: point.color ?? colorAt(colors, i) },
            ]}
          />
          <Text
            numberOfLines={1}
            style={[
              styles.legendLabel,
              labelStyle,
              i === index && styles.legendLabelActive,
              i === index && activeLabelStyle,
            ]}
          >
            {format ? format(point, i) : point.label}
          </Text>
        </View>
      ))}
    </View>
  );
};

const PieChartTooltip: React.FC<IPieChartTooltip> = ({
  children,
  name,
  format,
  colors = SLICE_COLORS,
  style,
  labelStyle,
  nameStyle,
  valueStyle,
}: IPieChartTooltip) => {
  const {
    data,
    arcs,
    centerX,
    centerY,
    radius,
    innerRadius,
    isActive,
    selectedIndex,
    width,
    height,
  } = usePieChart("Tooltip");
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
    const arc = arcs.value[selectedIndex.value];
    if (arc == null) return { opacity: 0, transform: [] };

    const point = arcCentroid(centerX, centerY, radius, innerRadius, arc.mid);
    const x = Math.min(
      Math.max(point.x - cardWidth.value / 2, 0),
      Math.max(width - cardWidth.value, 0),
    );
    const y = Math.min(
      Math.max(point.y - cardHeight.value / 2, 0),
      Math.max(height - cardHeight.value, 0),
    );

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
                style={[
                  styles.tooltipSwatch,
                  { backgroundColor: point.color ?? colorAt(colors, index) },
                ]}
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
  label: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    transform: [{ translateY: -22 }],
  },
  labelText: {
    color: LABEL_COLOR,
    fontSize: 13,
    fontWeight: "500",
  },
  valueText: {
    color: VALUE_COLOR,
    fontSize: 22,
    fontWeight: "700",
    marginTop: 2,
  },
  legend: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "center",
    columnGap: 16,
    rowGap: 6,
  },
  legendColumn: {
    flexDirection: "column",
    alignItems: "flex-start",
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  legendSwatch: {
    width: 9,
    height: 9,
    borderRadius: 999,
  },
  legendLabel: {
    color: LABEL_COLOR,
    fontSize: 12,
    fontWeight: "500",
  },
  legendLabelActive: {
    color: VALUE_COLOR,
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

const Root = createCompoundComponent("PieChart.Root", memo(PieChartRoot));
const Slices = createCompoundComponent("PieChart.Slices", memo(PieChartSlices));
const Label = createCompoundComponent("PieChart.Label", memo(PieChartLabel), {
  [OVERLAY_LAYER]: true,
});
const Legend = createCompoundComponent(
  "PieChart.Legend",
  memo(PieChartLegend),
  { [OVERLAY_LAYER]: true },
);
const Tooltip = createCompoundComponent(
  "PieChart.Tooltip",
  memo(PieChartTooltip),
  { [OVERLAY_LAYER]: true },
);

const PieChart = createCompoundComponent("PieChart", Root, {
  Root,
  Slices,
  Label,
  Legend,
  Tooltip,
});

export { PieChart, usePieChart };
export default PieChart;
export type {
  IPieChartRoot,
  IPieChartSlices,
  IPieChartLabel,
  IPieChartLegend,
  IPieChartTooltip,
  IPieChartContext,
  IPieChartPoint,
  IPieChartSlice,
  IPieChartArc,
} from "./types";
