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
  colorAt,
  distanceFromCenter,
  formatShare,
  isWithinSweep,
  lerp,
  maxValueOf,
  polar,
  ringIndexForDistance,
  ringPath,
  staggeredProgress,
  toBands,
  toRadians,
  toRings,
} from "./helper";
import {
  BAR_COLORS,
  BAR_WIDTH,
  BOTTOM_INSET,
  CIRCLE_SWEEP,
  GROW_DURATION,
  LABEL_COLOR,
  MORPH_DURATION,
  RADIUS_INSET,
  RING_GAP,
  SEMICIRCLE_START,
  SEMICIRCLE_SWEEP,
  SPRING_CONFIG,
  STAGGER,
  START_ANGLE,
  TRACK_COLOR,
  VALUE_COLOR,
} from "./const";
import { RadialChartContext, useRadialChart } from "./context";
import type {
  IRadialChartBars,
  IRadialChartContext,
  IRadialChartLabel,
  IRadialChartLegend,
  IRadialChartRoot,
  IRadialChartTooltip,
  IRadialChartTracks,
} from "./types";

const OVERLAY_LAYER = "__radialChartOverlay";

const isOverlayChild = (child: React.ReactNode): boolean =>
  React.isValidElement(child) &&
  (child.type as unknown as Record<string, unknown>)[OVERLAY_LAYER] === true;

const useSelectedIndex = (
  selectedIndex: IRadialChartContext["selectedIndex"],
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

const RadialChartRoot: React.FC<IRadialChartRoot> = ({
  children,
  data,
  variant = "circle",
  maxValue,
  radius: radiusProp,
  barWidth = BAR_WIDTH,
  gap = RING_GAP,
  startAngle: startAngleProp,
  sweepAngle: sweepAngleProp,
  bottomInset = BOTTOM_INSET,
  animate = true,
  growDuration = GROW_DURATION,
  morphDuration = MORPH_DURATION,
  enableGesture = true,
  onRingChange,
  onGestureStart,
  onGestureEnd,
  style,
}: IRadialChartRoot): React.JSX.Element => {
  const [size, setSize] = useState<{ width: number; height: number }>({
    width: 0,
    height: 0,
  });

  const originFractions = useSharedValue<number[]>([]);
  const targetFractions = useSharedValue<number[]>([]);
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

  const isSemicircle = variant === "semicircle";

  const resolvedMax = useMemo(
    () => (maxValue != null ? maxValue : maxValueOf(data)),
    [data, maxValue],
  );
  const rings = useMemo(() => toRings(data, resolvedMax), [data, resolvedMax]);

  const plotHeight = Math.max(size.height - bottomInset, 0);

  const radius = Math.max(
    radiusProp ??
      (isSemicircle
        ? Math.min(size.width / 2, plotHeight) - RADIUS_INSET
        : Math.min(size.width, plotHeight) / 2 - RADIUS_INSET),
    0,
  );
  const centerX = size.width / 2;
  const centerY = isSemicircle ? plotHeight / 2 + radius / 2 : plotHeight / 2;

  const bands = useMemo(
    () => toBands(radius, barWidth, gap, data.length),
    [radius, barWidth, gap, data.length],
  );

  const startRadians = useMemo(
    () =>
      toRadians(
        startAngleProp ?? (isSemicircle ? SEMICIRCLE_START : START_ANGLE),
      ),
    [isSemicircle, startAngleProp],
  );
  const sweepRadians = useMemo(
    () =>
      toRadians(
        sweepAngleProp ?? (isSemicircle ? SEMICIRCLE_SWEEP : CIRCLE_SWEEP),
      ),
    [isSemicircle, sweepAngleProp],
  );

  const isMeasured = size.width > 0 && size.height > 0;

  useEffect(() => {
    if (!isMeasured || data.length === 0) return;

    const fractions = rings.map((ring) => ring.fraction);
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
    rings,
    targetFractions,
  ]);

  const fractions = useDerivedValue<number[]>(() => {
    const origin = originFractions.value;
    const target = targetFractions.value;
    const count = Math.max(origin.length, target.length);

    const out: number[] = [];
    for (let i = 0; i < count; i++) {
      const fraction = lerp(origin[i] ?? 0, target[i] ?? 0, morph.value);
      out.push(fraction * staggeredProgress(grow.value, i, STAGGER));
    }
    return out;
  }, []);

  const reportRing = useCallback(
    (index: number) => {
      const point = data[index];
      if (point != null) onRingChange?.(point, index);
    },
    [data, onRingChange],
  );

  const handleGestureStart = useCallback(() => {
    onGestureStart?.();
  }, [onGestureStart]);

  const handleGestureEnd = useCallback(() => {
    onGestureEnd?.();
  }, [onGestureEnd]);

  const ringCount = data.length;

  const gesture = useMemo(() => {
    return Gesture.Pan()
      .enabled(enableGesture)
      .minDistance(0)
      .onBegin((event) => {
        "worklet";
        const distance = distanceFromCenter(event.x, event.y, centerX, centerY);
        const angle = angleForPoint(event.x, event.y, centerX, centerY);
        const index = isWithinSweep(angle, startRadians, sweepRadians)
          ? ringIndexForDistance(distance, radius, barWidth, gap, ringCount)
          : -1;

        if (index !== selectedIndex.value) {
          selectedIndex.value = index;
          if (index >= 0) scheduleOnRN(reportRing, index);
        }
        isActive.value = withTiming(index >= 0 ? 1 : 0, { duration: 140 });
        scheduleOnRN(handleGestureStart);
      })
      .onUpdate((event) => {
        "worklet";
        const distance = distanceFromCenter(event.x, event.y, centerX, centerY);
        const angle = angleForPoint(event.x, event.y, centerX, centerY);
        const index = isWithinSweep(angle, startRadians, sweepRadians)
          ? ringIndexForDistance(distance, radius, barWidth, gap, ringCount)
          : -1;

        if (index !== selectedIndex.value) {
          selectedIndex.value = index;
          if (index >= 0) scheduleOnRN(reportRing, index);
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
    barWidth,
    centerX,
    centerY,
    enableGesture,
    gap,
    handleGestureEnd,
    handleGestureStart,
    isActive,
    radius,
    reportRing,
    ringCount,
    selectedIndex,
    startRadians,
    sweepRadians,
  ]);

  const context = useMemo<IRadialChartContext>(
    () => ({
      data,
      rings,
      variant,
      width: size.width,
      height: size.height,
      centerX,
      centerY,
      radius,
      barWidth,
      gap,
      bands,
      startAngle: startRadians,
      sweepAngle: sweepRadians,
      bottomInset,
      fractions,
      grow,
      isActive,
      selectedIndex,
    }),
    [
      data,
      rings,
      variant,
      size.width,
      size.height,
      centerX,
      centerY,
      radius,
      barWidth,
      gap,
      bands,
      startRadians,
      sweepRadians,
      bottomInset,
      fractions,
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
              <RadialChartContext.Provider value={context}>
                {canvasChildren}
              </RadialChartContext.Provider>
            ) : null}
          </Canvas>
          {isReady ? (
            <RadialChartContext.Provider value={context}>
              {overlayChildren}
            </RadialChartContext.Provider>
          ) : null}
        </View>
      </GestureDetector>
    </View>
  );
};

const RadialChartTracks: React.FC<IRadialChartTracks> = ({
  color = TRACK_COLOR,
  opacity = 1,
  width,
  cap = "round",
}: IRadialChartTracks) => {
  const { bands, centerX, centerY, startAngle, sweepAngle, barWidth } =
    useRadialChart("Tracks");

  return (
    <>
      {bands.map((band, index) => (
        <Path
          key={index}
          path={ringPath(
            centerX,
            centerY,
            band.radius,
            startAngle,
            startAngle + sweepAngle,
          )}
          color={typeof color === "string" ? color : colorAt(color, index)}
          opacity={opacity}
          style="stroke"
          strokeWidth={width ?? barWidth}
          strokeCap={cap}
          strokeJoin="round"
        />
      ))}
    </>
  );
};

const RadialChartBar: React.FC<{
  readonly index: number;
  readonly color: string;
  readonly activeColor?: string;
  readonly inactiveOpacity: number;
  readonly width: number;
  readonly cap: "round" | "butt" | "square";
}> = memo(({ index, color, activeColor, inactiveOpacity, width, cap }) => {
  const {
    bands,
    centerX,
    centerY,
    fractions,
    startAngle,
    sweepAngle,
    selectedIndex,
    isActive,
  } = useRadialChart("Bars");

  const band = bands[index];
  const bandRadius = band?.radius ?? 0;

  const selection = useDerivedValue<number>(
    () => withSpring(selectedIndex.value === index ? 1 : 0, SPRING_CONFIG),
    [index],
  );

  const path = useDerivedValue<string>(() => {
    const fraction = fractions.value[index] ?? 0;
    return ringPath(
      centerX,
      centerY,
      bandRadius,
      startAngle,
      startAngle + fraction * sweepAngle,
    );
  }, [index, centerX, centerY, bandRadius, startAngle, sweepAngle]);

  const strokeWidth = useDerivedValue<number>(
    () => width + selection.value * isActive.value * 2,
    [width],
  );

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
    <Path
      path={path}
      color={fill}
      opacity={opacity}
      style="stroke"
      strokeWidth={strokeWidth}
      strokeCap={cap}
      strokeJoin="round"
    />
  );
});
RadialChartBar.displayName = "RadialChart.Bar";

const RadialChartBars: React.FC<IRadialChartBars> = ({
  colors = BAR_COLORS,
  activeColor,
  inactiveOpacity = 1,
  width,
  cap = "round",
}: IRadialChartBars) => {
  const { data, barWidth } = useRadialChart("Bars");

  return (
    <>
      {data.map((point, index) => (
        <RadialChartBar
          key={`${point.label}-${index}`}
          index={index}
          color={point.color ?? colorAt(colors, index)}
          activeColor={activeColor}
          inactiveOpacity={inactiveOpacity}
          width={width ?? barWidth}
          cap={cap}
        />
      ))}
    </>
  );
};

const RadialChartLabel: React.FC<IRadialChartLabel> = ({
  children,
  format,
  formatValue,
  placeholder,
  placeholderValue,
  style,
  labelStyle,
  valueStyle,
}: IRadialChartLabel) => {
  const {
    data,
    rings,
    bands,
    barWidth,
    variant,
    centerX,
    centerY,
    radius,
    selectedIndex,
  } = useRadialChart("Label");
  const index = useSelectedIndex(selectedIndex);
  const point = index >= 0 ? data[index] : undefined;
  const ring = index >= 0 ? rings[index] : undefined;

  const label =
    point != null
      ? format
        ? format(point, index)
        : point.label
      : (placeholder ?? "");
  const value =
    point != null && ring != null
      ? formatValue
        ? formatValue(point, index)
        : formatShare(ring.fraction)
      : (placeholderValue ?? "");

  const hole = Math.max(
    (bands[bands.length - 1]?.radius ?? radius) - barWidth / 2,
    0,
  );
  const maxWidth = Math.max(hole * 1.6, 88);
  const offsetY = variant === "semicircle" ? -hole * 0.55 : -22;

  return (
    <View
      pointerEvents="none"
      style={[
        styles.label,
        {
          left: centerX - maxWidth / 2,
          top: centerY,
          width: maxWidth,
          transform: [{ translateY: offsetY }],
        },
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

const RadialChartLegend: React.FC<IRadialChartLegend> = ({
  colors = BAR_COLORS,
  format,
  formatValue,
  direction = "column",
  style,
  itemStyle,
  labelStyle,
  activeLabelStyle,
  valueStyle,
}: IRadialChartLegend) => {
  const { data, rings, bottomInset, selectedIndex } = useRadialChart("Legend");
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
          style={[
            styles.legendItem,
            direction === "column" && styles.legendItemColumn,
            itemStyle,
          ]}
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
          <Text numberOfLines={1} style={[styles.legendValue, valueStyle]}>
            {formatValue
              ? formatValue(point, i)
              : formatShare(rings[i]?.fraction ?? 0)}
          </Text>
        </View>
      ))}
    </View>
  );
};

const RadialChartTooltip: React.FC<IRadialChartTooltip> = ({
  children,
  name,
  format,
  colors = BAR_COLORS,
  style,
  labelStyle,
  nameStyle,
  valueStyle,
}: IRadialChartTooltip) => {
  const {
    data,
    bands,
    centerX,
    centerY,
    fractions,
    startAngle,
    sweepAngle,
    isActive,
    selectedIndex,
    width,
    height,
  } = useRadialChart("Tooltip");
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

  const radii = useMemo(() => bands.map((band) => band.radius), [bands]);

  const animatedStyle = useAnimatedStyle<
    Pick<ViewStyle, "transform" | "opacity">
  >(() => {
    const current = selectedIndex.value;
    const bandRadius = radii[current];
    if (bandRadius == null) return { opacity: 0, transform: [] };

    const fraction = fractions.value[current] ?? 0;
    const point = polar(
      centerX,
      centerY,
      bandRadius,
      startAngle + fraction * sweepAngle,
    );
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
  },
  labelText: {
    color: LABEL_COLOR,
    fontSize: 12,
    fontWeight: "500",
    letterSpacing: 0.2,
  },
  valueText: {
    color: VALUE_COLOR,
    fontSize: 24,
    fontWeight: "600",
    letterSpacing: -0.6,
    marginTop: 3,
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
    alignItems: "stretch",
    justifyContent: "center",
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  legendItemColumn: {
    width: "100%",
  },
  legendSwatch: {
    width: 6,
    height: 6,
    borderRadius: 999,
  },
  legendLabel: {
    color: LABEL_COLOR,
    fontSize: 12,
    fontWeight: "500",
  },
  legendLabelActive: {
    color: VALUE_COLOR,
    fontWeight: "600",
  },
  legendValue: {
    color: LABEL_COLOR,
    fontSize: 12,
    fontWeight: "500",
    letterSpacing: -0.1,
    marginLeft: "auto",
  },
  tooltip: {
    position: "absolute",
    top: 0,
    left: 0,
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  tooltipLabel: {
    color: "#1C1C1E",
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 5,
  },
  tooltipRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  tooltipSwatch: {
    width: 6,
    height: 6,
    borderRadius: 999,
  },
  tooltipName: {
    color: "#6E6E73",
    fontSize: 13,
    fontWeight: "500",
    marginRight: 14,
  },
  tooltipValue: {
    color: "#1C1C1E",
    fontSize: 13,
    fontWeight: "600",
    marginLeft: "auto",
  },
});

const Root = createCompoundComponent("RadialChart.Root", memo(RadialChartRoot));
const Tracks = createCompoundComponent(
  "RadialChart.Tracks",
  memo(RadialChartTracks),
);
const Bars = createCompoundComponent("RadialChart.Bars", memo(RadialChartBars));
const Label = createCompoundComponent(
  "RadialChart.Label",
  memo(RadialChartLabel),
  { [OVERLAY_LAYER]: true },
);
const Legend = createCompoundComponent(
  "RadialChart.Legend",
  memo(RadialChartLegend),
  { [OVERLAY_LAYER]: true },
);
const Tooltip = createCompoundComponent(
  "RadialChart.Tooltip",
  memo(RadialChartTooltip),
  { [OVERLAY_LAYER]: true },
);

const RadialChart = createCompoundComponent("RadialChart", Root, {
  Root,
  Tracks,
  Bars,
  Label,
  Legend,
  Tooltip,
});

export { RadialChart, useRadialChart };
export default RadialChart;
export type {
  IRadialChartRoot,
  IRadialChartTracks,
  IRadialChartBars,
  IRadialChartLabel,
  IRadialChartLegend,
  IRadialChartTooltip,
  IRadialChartContext,
  IRadialChartPoint,
  IRadialChartRing,
  IRadialChartBand,
  TRadialChartVariant,
} from "./types";
