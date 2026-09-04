import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
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
  useDerivedValue,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import {
  Canvas,
  Circle,
  DashPathEffect,
  LinearGradient,
  Path,
  vec,
} from "@shopify/react-native-skia";
import { scheduleOnRN } from "react-native-worklets";
import { createCompoundComponent } from "@/utils/create-compound-component";
import {
  buildAxesPath,
  buildGridPath,
  colorAt,
  indexForPoint,
  lerp,
  polar,
  polygonPath,
  staggerProgress,
  toAngles,
  toDomain,
  toRadians,
  valueToRadius,
} from "./helper";
import {
  ACTIVE_DOT_RADIUS,
  AXIS_COLOR,
  DASH,
  DOT_FILL_COLOR,
  DOT_RADIUS,
  FILL_OPACITY,
  GRID_COLOR,
  GROW_DURATION,
  LABEL_COLOR,
  LABEL_INSET,
  LEVELS,
  MORPH_DURATION,
  RADIUS_INSET,
  SERIES_COLORS,
  SHAPE_THICKNESS,
  ROW_STAGGER,
  SPRING_CONFIG,
  STAGGER,
  START_ANGLE,
  THICKNESS,
  TOOLTIP_BUMP_SCALE,
  TOOLTIP_MIN_SCALE,
  TOOLTIP_SPRING_CONFIG,
} from "./const";
import { RadarChartContext, useRadarChart } from "./context";
import type {
  IRadarChartAxes,
  IRadarChartContext,
  IRadarChartGrid,
  IRadarChartLabels,
  IRadarChartRoot,
  IRadarChartShapes,
  IRadarChartTooltip,
  IRadarChartVertex,
} from "./types";

const OVERLAY_LAYER = "__radarChartOverlay";

const isOverlayChild = (child: React.ReactNode): boolean =>
  React.isValidElement(child) &&
  (child.type as unknown as Record<string, unknown>)[OVERLAY_LAYER] === true;

const useSelectedIndex = (
  selectedIndex: IRadarChartContext["selectedIndex"],
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

const RadarChartRoot: React.FC<IRadarChartRoot> = ({
  children,
  data,
  axes,
  maxValue,
  levels = LEVELS,
  startAngle = START_ANGLE,
  radius: radiusProp,
  labelInset = LABEL_INSET,
  animate = true,
  growDuration = GROW_DURATION,
  morphDuration = MORPH_DURATION,
  stagger = STAGGER,
  enableGesture = true,
  onAxisChange,
  onGestureStart,
  onGestureEnd,
  style,
}: IRadarChartRoot): React.JSX.Element => {
  const [size, setSize] = useState<{ width: number; height: number }>({
    width: 0,
    height: 0,
  });

  const anglesShared = useSharedValue<number[]>([]);
  const originValues = useSharedValue<number[][]>([]);
  const targetValues = useSharedValue<number[][]>([]);
  const originMax = useSharedValue<number>(1);
  const targetMax = useSharedValue<number>(1);
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
    () => toDomain(data, levels, maxValue),
    [data, levels, maxValue],
  );

  const startRadians = useMemo(() => toRadians(startAngle), [startAngle]);
  const angles = useMemo(
    () => toAngles(axes.length, startRadians),
    [axes.length, startRadians],
  );

  useEffect(() => {
    anglesShared.value = angles;
  }, [angles, anglesShared]);

  const centerX = size.width / 2;
  const centerY = size.height / 2;
  const radius = Math.max(
    radiusProp ??
      Math.min(size.width, size.height) / 2 - labelInset - RADIUS_INSET,
    0,
  );

  const isMeasured = size.width > 0 && size.height > 0;

  useEffect(() => {
    if (!isMeasured || data.length === 0 || axes.length === 0) return;

    const values = data.map((series) =>
      axes.map((_, i) => series.values[i] ?? 0),
    );
    const isEntrance = !hasEntered.current;
    hasEntered.current = true;

    if (!animate) {
      originValues.value = values;
      targetValues.value = values;
      originMax.value = domain.max;
      targetMax.value = domain.max;
      cancelAnimation(morph);
      morph.value = 1;
      grow.value = 1;
      return;
    }

    const previous = targetValues.value;
    const isSameShape =
      previous.length === values.length &&
      previous.every((row, i) => row.length === (values[i]?.length ?? -1));

    if (isEntrance || !isSameShape) {
      originValues.value = values;
      targetValues.value = values;
      originMax.value = domain.max;
      targetMax.value = domain.max;
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
    const progress = morph.value;
    originValues.value = values.map((row, s) =>
      row.map((_, i) =>
        lerp(from[s]?.[i] ?? 0, previous[s]?.[i] ?? 0, progress),
      ),
    );
    targetValues.value = values;
    originMax.value = lerp(originMax.value, targetMax.value, progress);
    targetMax.value = domain.max;

    cancelAnimation(morph);
    morph.value = 0;
    morph.value = withTiming(1, {
      duration: morphDuration,
      easing: Easing.inOut(Easing.cubic),
    });
  }, [
    animate,
    axes,
    data,
    domain.max,
    grow,
    growDuration,
    isMeasured,
    morph,
    morphDuration,
    originMax,
    originValues,
    targetMax,
    targetValues,
  ]);

  const vertices = useDerivedValue<IRadarChartVertex[][]>(() => {
    const angleList = anglesShared.value;
    const origin = originValues.value;
    const target = targetValues.value;
    const count = Math.max(origin.length, target.length);

    const max = lerp(originMax.value, targetMax.value, morph.value);

    const out: IRadarChartVertex[][] = [];
    for (let s = 0; s < count; s++) {
      const entrance = staggerProgress(grow.value, s, count, stagger);
      const row: IRadarChartVertex[] = [];
      for (let i = 0; i < angleList.length; i++) {
        const value = lerp(
          origin[s]?.[i] ?? 0,
          target[s]?.[i] ?? 0,
          morph.value,
        );
        const distance =
          valueToRadius(value, domain.min, max, radius) * entrance;
        row.push(polar(centerX, centerY, distance, angleList[i]!));
      }
      out.push(row);
    }
    return out;
  }, [centerX, centerY, radius, domain.min, stagger]);

  const reportAxis = useCallback(
    (index: number) => {
      const axis = axes[index];
      if (axis != null) onAxisChange?.(axis, index);
    },
    [axes, onAxisChange],
  );

  const handleGestureStart = useCallback(() => {
    onGestureStart?.();
  }, [onGestureStart]);

  const handleGestureEnd = useCallback(() => {
    onGestureEnd?.();
  }, [onGestureEnd]);

  const axisCount = axes.length;

  const gesture = useMemo(() => {
    return Gesture.Pan()
      .enabled(enableGesture)
      .minDistance(0)
      .onBegin((event) => {
        "worklet";
        const index = indexForPoint(
          event.x,
          event.y,
          centerX,
          centerY,
          axisCount,
          startRadians,
        );
        if (index >= 0 && index !== selectedIndex.value) {
          selectedIndex.value = index;
          scheduleOnRN(reportAxis, index);
        }
        isActive.value = withTiming(1, { duration: 140 });
        scheduleOnRN(handleGestureStart);
      })
      .onUpdate((event) => {
        "worklet";
        const index = indexForPoint(
          event.x,
          event.y,
          centerX,
          centerY,
          axisCount,
          startRadians,
        );
        if (index >= 0 && index !== selectedIndex.value) {
          selectedIndex.value = index;
          scheduleOnRN(reportAxis, index);
        }
      })
      .onFinalize(() => {
        "worklet";
        isActive.value = withTiming(0, { duration: 220 });
        selectedIndex.value = -1;
        scheduleOnRN(handleGestureEnd);
      });
  }, [
    axisCount,
    centerX,
    centerY,
    enableGesture,
    handleGestureEnd,
    handleGestureStart,
    isActive,
    reportAxis,
    selectedIndex,
    startRadians,
  ]);

  const context = useMemo<IRadarChartContext>(
    () => ({
      data,
      axes,
      angles,
      domain,
      width: size.width,
      height: size.height,
      centerX,
      centerY,
      radius,
      labelInset,
      vertices,
      grow,
      isActive,
      selectedIndex,
    }),
    [
      data,
      axes,
      angles,
      domain,
      size.width,
      size.height,
      centerX,
      centerY,
      radius,
      labelInset,
      vertices,
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

  const isReady =
    isMeasured && data.length > 0 && axes.length > 2 && radius > 0;

  return (
    <View style={[styles.root, style]} onLayout={onLayout}>
      <GestureDetector gesture={gesture}>
        <View style={styles.fill}>
          <Canvas style={styles.fill}>
            {isReady ? (
              <RadarChartContext.Provider value={context}>
                {canvasChildren}
              </RadarChartContext.Provider>
            ) : null}
          </Canvas>
          {isReady ? (
            <RadarChartContext.Provider value={context}>
              {overlayChildren}
            </RadarChartContext.Provider>
          ) : null}
        </View>
      </GestureDetector>
    </View>
  );
};

const RadarChartGrid: React.FC<IRadarChartGrid> = ({
  color = GRID_COLOR,
  thickness = THICKNESS,
  dash = DASH,
}: IRadarChartGrid) => {
  const { domain, angles, centerX, centerY, radius } = useRadarChart("Grid");

  const path = useMemo(
    () => buildGridPath(domain, centerX, centerY, radius, angles),
    [angles, centerX, centerY, domain, radius],
  );

  if (path === "") return null;

  return (
    <Path path={path} color={color} style="stroke" strokeWidth={thickness}>
      {dash.length > 0 && <DashPathEffect intervals={dash as number[]} />}
    </Path>
  );
};

const RadarChartAxes: React.FC<IRadarChartAxes> = ({
  color = AXIS_COLOR,
  thickness = THICKNESS,
  dash = DASH,
}: IRadarChartAxes) => {
  const { angles, centerX, centerY, radius } = useRadarChart("Axes");

  const path = useMemo(
    () => buildAxesPath(centerX, centerY, radius, angles),
    [angles, centerX, centerY, radius],
  );

  if (path === "") return null;

  return (
    <Path path={path} color={color} style="stroke" strokeWidth={thickness}>
      {dash.length > 0 && <DashPathEffect intervals={dash as number[]} />}
    </Path>
  );
};

const RadarChartDot: React.FC<{
  readonly series: number;
  readonly index: number;
  readonly color: string;
  readonly radius: number;
  readonly activeRadius: number;
  readonly fillColor: string;
  readonly thickness: number;
}> = memo(
  ({ series, index, color, radius, activeRadius, fillColor, thickness }) => {
    const { vertices, selectedIndex, isActive } = useRadarChart("Shapes");

    const cx = useDerivedValue<number>(
      () => vertices.value[series]?.[index]?.x ?? 0,
      [series, index],
    );
    const cy = useDerivedValue<number>(
      () => vertices.value[series]?.[index]?.y ?? 0,
      [series, index],
    );

    const dotRadius = useDerivedValue<number>(() => {
      const selected = selectedIndex.value === index ? 1 : 0;
      return withSpring(
        radius + (activeRadius - radius) * selected * isActive.value,
        SPRING_CONFIG,
      );
    }, [index, radius, activeRadius]);

    return (
      <>
        <Circle cx={cx} cy={cy} r={dotRadius} color={fillColor} />
        <Circle
          cx={cx}
          cy={cy}
          r={dotRadius}
          color={color}
          style="stroke"
          strokeWidth={thickness}
        />
      </>
    );
  },
);
RadarChartDot.displayName = "RadarChart.Dot";

const RadarChartShape: React.FC<{
  readonly index: number;
  readonly color: string;
  readonly thickness: number;
  readonly fillOpacity: number;
  readonly gradientFill: boolean;
  readonly showDots: boolean;
  readonly dotRadius: number;
  readonly activeDotRadius: number;
  readonly dotFillColor: string;
  readonly axisCount: number;
}> = memo(
  ({
    index,
    color,
    thickness,
    fillOpacity,
    gradientFill,
    showDots,
    dotRadius,
    activeDotRadius,
    dotFillColor,
    axisCount,
  }) => {
    const { vertices, centerX, centerY, radius } = useRadarChart("Shapes");

    const path = useDerivedValue<string>(() => {
      const row = vertices.value[index];
      if (row == null) return "M 0 0";
      return polygonPath(row);
    }, [index]);

    return (
      <>
        <Path path={path} color={color} opacity={fillOpacity}>
          {gradientFill && (
            <LinearGradient
              start={vec(centerX, centerY - radius)}
              end={vec(centerX, centerY + radius)}
              colors={[color, `${color}00`]}
            />
          )}
        </Path>
        <Path
          path={path}
          color={color}
          style="stroke"
          strokeWidth={thickness}
          strokeJoin="round"
        />
        {showDots &&
          Array.from({ length: axisCount }, (_, axis) => (
            <RadarChartDot
              key={axis}
              series={index}
              index={axis}
              color={color}
              radius={dotRadius}
              activeRadius={activeDotRadius}
              fillColor={dotFillColor}
              thickness={thickness}
            />
          ))}
      </>
    );
  },
);
RadarChartShape.displayName = "RadarChart.Shape";

const RadarChartShapes: React.FC<IRadarChartShapes> = ({
  colors = SERIES_COLORS,
  thickness = SHAPE_THICKNESS,
  fillOpacity = FILL_OPACITY,
  gradientFill = false,
  showDots = true,
  dotRadius = DOT_RADIUS,
  activeDotRadius = ACTIVE_DOT_RADIUS,
  dotFillColor = DOT_FILL_COLOR,
}: IRadarChartShapes) => {
  const { data, axes } = useRadarChart("Shapes");

  return (
    <>
      {data.map((series, index) => (
        <RadarChartShape
          key={`${series.name}-${index}`}
          index={index}
          color={series.color ?? colorAt(colors, index)}
          thickness={thickness}
          fillOpacity={fillOpacity}
          gradientFill={gradientFill}
          showDots={showDots}
          dotRadius={dotRadius}
          activeDotRadius={activeDotRadius}
          dotFillColor={dotFillColor}
          axisCount={axes.length}
        />
      ))}
    </>
  );
};

const RadarChartLabels: React.FC<IRadarChartLabels> = ({
  format,
  style,
  activeStyle,
}: IRadarChartLabels) => {
  const {
    axes,
    angles,
    centerX,
    centerY,
    radius,
    labelInset,
    width,
    selectedIndex,
  } = useRadarChart("Labels");
  const index = useSelectedIndex(selectedIndex);

  const labelWidth = Math.max(Math.min(width / 2, 120), 40);

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      {axes.map((axis, i) => {
        const angle = angles[i];
        if (angle == null) return null;
        const point = polar(centerX, centerY, radius + labelInset, angle);
        return (
          <Text
            key={`${axis}-${i}`}
            numberOfLines={1}
            style={[
              styles.label,
              {
                left: point.x - labelWidth / 2,
                top: point.y - 9,
                width: labelWidth,
              },
              style,
              i === index && styles.labelActive,
              i === index && activeStyle,
            ]}
          >
            {format ? format(axis, i) : axis}
          </Text>
        );
      })}
    </View>
  );
};

const RadarChartTooltipRow: React.FC<{
  readonly index: number;
  readonly children: ReactNode;
}> = memo(({ index, children }) => {
  const { isActive } = useRadarChart("Tooltip");

  const entrance = useDerivedValue<number>(
    () =>
      withDelay(
        index * ROW_STAGGER,
        withSpring(isActive.value, TOOLTIP_SPRING_CONFIG),
      ),
    [index],
  );

  const animatedStyle = useAnimatedStyle<
    Pick<ViewStyle, "transform" | "opacity">
  >(() => ({
    opacity: entrance.value,
    transform: [{ translateY: (1 - entrance.value) * 10 }],
  }));

  return (
    <Animated.View style={[styles.tooltipRow, animatedStyle]}>
      {children}
    </Animated.View>
  );
});
RadarChartTooltipRow.displayName = "RadarChart.TooltipRow";

const RadarChartTooltip: React.FC<IRadarChartTooltip> = ({
  children,
  colors = SERIES_COLORS,
  format,
  style,
  labelStyle,
  nameStyle,
  valueStyle,
}: IRadarChartTooltip) => {
  const {
    data,
    axes,
    angles,
    centerX,
    centerY,
    radius,
    isActive,
    selectedIndex,
    width,
    height,
  } = useRadarChart("Tooltip");
  const index = useSelectedIndex(selectedIndex);
  const cardWidth = useSharedValue<number>(0);
  const cardHeight = useSharedValue<number>(0);
  const anglesShared = useSharedValue<number[]>([]);
  const bump = useSharedValue<number>(1);

  useEffect(() => {
    anglesShared.value = angles;
  }, [angles, anglesShared]);

  const onLayout = useCallback(
    ({ nativeEvent }: LayoutChangeEvent) => {
      cardWidth.value = nativeEvent.layout.width;
      cardHeight.value = nativeEvent.layout.height;
    },
    [cardHeight, cardWidth],
  );

  useAnimatedReaction(
    () => selectedIndex.value,
    (current, previous) => {
      if (current < 0 || previous == null || current === previous) return;
      bump.value = 0;
      bump.value = withSpring(1, TOOLTIP_SPRING_CONFIG);
    },
    [],
  );

  const presence = useDerivedValue<number>(() =>
    withSpring(isActive.value, TOOLTIP_SPRING_CONFIG),
  );

  const animatedStyle = useAnimatedStyle<
    Pick<ViewStyle, "transform" | "opacity">
  >(() => {
    const angle = anglesShared.value[selectedIndex.value];
    if (angle == null) return { opacity: 0, transform: [] };

    const point = polar(centerX, centerY, radius / 2, angle);
    const x = Math.min(
      Math.max(point.x - cardWidth.value / 2, 0),
      Math.max(width - cardWidth.value, 0),
    );
    const y = Math.min(
      Math.max(point.y - cardHeight.value / 2, 0),
      Math.max(height - cardHeight.value, 0),
    );

    const scale =
      (TOOLTIP_MIN_SCALE + (1 - TOOLTIP_MIN_SCALE) * presence.value) *
      (1 - TOOLTIP_BUMP_SCALE * (1 - bump.value));

    return {
      opacity: presence.value,
      transform: [
        { translateX: withSpring(x, SPRING_CONFIG) },
        { translateY: withSpring(y, SPRING_CONFIG) },
        { scale },
      ],
    };
  });

  const axis = index >= 0 ? axes[index] : undefined;

  return (
    <Animated.View
      pointerEvents="none"
      onLayout={onLayout}
      style={[styles.tooltip, animatedStyle, style]}
    >
      {children ??
        (axis != null ? (
          <>
            <RadarChartTooltipRow index={0}>
              <Text style={[styles.tooltipLabel, labelStyle]}>{axis}</Text>
            </RadarChartTooltipRow>
            {data.map((series, s) => {
              const value = series.values[index] ?? 0;
              return (
                <RadarChartTooltipRow key={`${series.name}-${s}`} index={s + 1}>
                  <View
                    style={[
                      styles.tooltipSwatch,
                      {
                        backgroundColor: series.color ?? colorAt(colors, s),
                      },
                    ]}
                  />
                  <Text style={[styles.tooltipName, nameStyle]}>
                    {series.name}
                  </Text>
                  <Text style={[styles.tooltipValue, valueStyle]}>
                    {format ? format(series, value, index) : String(value)}
                  </Text>
                </RadarChartTooltipRow>
              );
            })}
          </>
        ) : null)}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  root: {
    width: "100%",
    height: 300,
  },
  fill: {
    flex: 1,
  },
  label: {
    position: "absolute",
    textAlign: "center",
    color: LABEL_COLOR,
    fontSize: 13,
    fontWeight: "500",
  },
  labelActive: {
    color: "#1C1C1E",
    fontWeight: "700",
  },
  tooltip: {
    position: "absolute",
    top: 0,
    left: 0,
    paddingHorizontal: 14,
    paddingVertical: 12,
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
    marginTop: 2,
  },
  tooltipSwatch: {
    width: 11,
    height: 11,
    borderRadius: 3,
  },
  tooltipName: {
    color: "#6E6E73",
    fontSize: 14,
    fontWeight: "500",
    marginRight: 24,
  },
  tooltipValue: {
    color: "#1C1C1E",
    fontSize: 15,
    fontWeight: "700",
    marginLeft: "auto",
  },
});

const Root = createCompoundComponent("RadarChart.Root", memo(RadarChartRoot));
const Grid = createCompoundComponent("RadarChart.Grid", memo(RadarChartGrid));
const Axes = createCompoundComponent("RadarChart.Axes", memo(RadarChartAxes));
const Shapes = createCompoundComponent(
  "RadarChart.Shapes",
  memo(RadarChartShapes),
);
const Labels = createCompoundComponent(
  "RadarChart.Labels",
  memo(RadarChartLabels),
  { [OVERLAY_LAYER]: true },
);
const Tooltip = createCompoundComponent(
  "RadarChart.Tooltip",
  memo(RadarChartTooltip),
  { [OVERLAY_LAYER]: true },
);

const RadarChart = createCompoundComponent("RadarChart", Root, {
  Root,
  Grid,
  Axes,
  Shapes,
  Labels,
  Tooltip,
});

export { RadarChart, useRadarChart };
export default RadarChart;
export type {
  IRadarChartRoot,
  IRadarChartGrid,
  IRadarChartAxes,
  IRadarChartShapes,
  IRadarChartLabels,
  IRadarChartTooltip,
  IRadarChartContext,
  IRadarChartSeries,
  IRadarChartDomain,
  IRadarChartVertex,
} from "./types";
