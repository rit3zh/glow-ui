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
  interpolate,
  useAnimatedReaction,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
  Extrapolation,
} from "react-native-reanimated";
import {
  Canvas,
  Circle,
  Group,
  LinearGradient,
  Path,
  vec,
} from "@shopify/react-native-skia";
import { scheduleOnRN } from "react-native-worklets";
import { createCompoundComponent } from "@/utils/create-compound-component";
import {
  buildAreaPath,
  buildGridPath,
  buildLinePath,
  blendFrame,
  sliceCurve,
  indexForX,
  morphGrid,
  sampleAt,
  tangentsFor,
  toPixelPoints,
  yForX,
} from "./helper";
import {
  CURSOR_BORDER_COLOR,
  DRAW_DURATION,
  GRID_COLOR,
  HORIZONTAL_PADDING,
  INDICATOR_BORDER_MULTIPLIER,
  INDICATOR_RADIUS,
  LINE_COLOR,
  MORPH_DURATION,
  PULSE_DELAY,
  PULSE_DURATION,
  PULSE_RADIUS_MULTIPLIER,
  SPRING_CONFIG,
  VERTICAL_PADDING,
} from "./const";
import { LineChartContext, useLineChart } from "./context";
import type {
  ILineChartArea,
  ILineChartContext,
  ILineChartCursor,
  ILineChartGrid,
  ILineChartIndicator,
  ILineChartLine,
  ILineChartRoot,
  ILineChartTooltip,
  ILineChartFrame,
  ILineChartVector,
} from "./types";

const OVERLAY_LAYER = "__lineChartOverlay";

const isOverlayChild = (child: React.ReactNode): boolean =>
  React.isValidElement(child) &&
  (child.type as unknown as Record<string, unknown>)[OVERLAY_LAYER] === true;

const useSelectedIndex = (
  selectedIndex: ILineChartContext["selectedIndex"],
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

const LineChartRoot: React.FC<ILineChartRoot> = ({
  children,
  data,
  curve = "natural",
  minY,
  maxY,
  horizontalPadding = HORIZONTAL_PADDING,
  verticalPadding = VERTICAL_PADDING,
  animate = true,
  drawDuration = DRAW_DURATION,
  morphDuration = MORPH_DURATION,
  enablePan = true,
  panDelay = 0,
  onPointChange,
  onGestureStart,
  onGestureEnd,
  style,
}: ILineChartRoot): React.JSX.Element => {
  const [size, setSize] = useState<{ width: number; height: number }>({
    width: 0,
    height: 0,
  });

  const dataPoints = useSharedValue<ILineChartVector[]>([]);
  const targetPoints = useSharedValue<ILineChartVector[]>([]);
  const targetTangents = useSharedValue<number[]>([]);
  const originPoints = useSharedValue<ILineChartVector[]>([]);
  const originTangents = useSharedValue<number[]>([]);
  const morph = useSharedValue<number>(1);
  const draw = useSharedValue<number>(0);
  const isActive = useSharedValue<number>(0);
  const cursorX = useSharedValue<number>(0);
  const cursorY = useSharedValue<number>(0);
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

  const pixelPoints = useMemo<ILineChartVector[]>(
    () =>
      toPixelPoints(
        data,
        size.width,
        size.height,
        horizontalPadding,
        verticalPadding,
        minY,
        maxY,
      ),
    [
      data,
      size.width,
      size.height,
      horizontalPadding,
      verticalPadding,
      minY,
      maxY,
    ],
  );

  const frame = useDerivedValue<ILineChartFrame>(
    () =>
      blendFrame(
        originPoints.value,
        originTangents.value,
        targetPoints.value,
        targetTangents.value,
        morph.value,
        curve,
      ),
    [curve],
  );

  const drawn = useDerivedValue<ILineChartFrame>(
    () =>
      sliceCurve(frame.value.points, frame.value.tangents, curve, draw.value),
    [curve],
  );

  const isMeasured = size.width > 0 && size.height > 0;

  useEffect(() => {
    if (!isMeasured || pixelPoints.length < 2) return;

    const nextTangents = tangentsFor(pixelPoints, curve);
    const isEntrance = !hasEntered.current;
    hasEntered.current = true;

    dataPoints.value = pixelPoints;

    if (!animate) {
      originPoints.value = pixelPoints;
      originTangents.value = nextTangents;
      targetPoints.value = pixelPoints;
      targetTangents.value = nextTangents;
      cancelAnimation(morph);
      morph.value = 1;
      draw.value = 1;
      return;
    }

    if (isEntrance) {
      originPoints.value = pixelPoints;
      originTangents.value = nextTangents;
      targetPoints.value = pixelPoints;
      targetTangents.value = nextTangents;

      cancelAnimation(morph);
      morph.value = 1;
      cancelAnimation(draw);
      draw.value = 0;
      draw.value = withTiming(1, {
        duration: drawDuration,
        easing: Easing.out(Easing.cubic),
      });
      return;
    }
    const current = frame.value;
    const hasCurrent = current.points.length > 1;
    const source = hasCurrent ? current.points : targetPoints.value;
    const sourceTangents = hasCurrent ? current.tangents : targetTangents.value;

    const grid = morphGrid(source, pixelPoints, curve);
    const origin = sampleAt(source, sourceTangents, curve, grid);
    const target = sampleAt(pixelPoints, nextTangents, curve, grid);

    originPoints.value = origin;
    originTangents.value = tangentsFor(origin, curve);
    targetPoints.value = target;
    targetTangents.value = tangentsFor(target, curve);

    cancelAnimation(morph);
    morph.value = 0;
    morph.value = withTiming(1, {
      duration: morphDuration,
      easing: Easing.inOut(Easing.cubic),
    });
  }, [
    animate,
    curve,
    draw,
    drawDuration,
    frame,
    isMeasured,
    morph,
    morphDuration,
    dataPoints,
    originPoints,
    originTangents,
    pixelPoints,
    size.height,
    targetPoints,
    targetTangents,
    verticalPadding,
  ]);

  const reportPoint = useCallback(
    (index: number) => {
      const point = data[index];
      if (point != null) onPointChange?.(point, index);
    },
    [data, onPointChange],
  );

  const handleGestureStart = useCallback(() => {
    onGestureStart?.();
  }, [onGestureStart]);

  const handleGestureEnd = useCallback(() => {
    onGestureEnd?.();
  }, [onGestureEnd]);

  const gesture = useMemo(() => {
    const pan = Gesture.Pan()
      .enabled(enablePan)
      .minDistance(0)
      .onBegin((event) => {
        "worklet";
        if (panDelay > 0) return;
        const { points, tangents } = frame.value;
        if (points.length > 1) {
          const x = Math.min(
            Math.max(event.x, points[0]!.x),
            points[points.length - 1]!.x,
          );
          cursorX.value = x;
          cursorY.value = yForX(points, tangents, curve, x);

          const index = indexForX(dataPoints.value, x);
          if (index !== selectedIndex.value) {
            selectedIndex.value = index;
            scheduleOnRN(reportPoint, index);
          }
        }
        isActive.value = withTiming(1, { duration: 140 });
        scheduleOnRN(handleGestureStart);
      })
      .onStart((event) => {
        "worklet";
        if (panDelay === 0) return;
        const { points, tangents } = frame.value;
        if (points.length > 1) {
          const x = Math.min(
            Math.max(event.x, points[0]!.x),
            points[points.length - 1]!.x,
          );
          cursorX.value = x;
          cursorY.value = yForX(points, tangents, curve, x);

          const index = indexForX(dataPoints.value, x);
          if (index !== selectedIndex.value) {
            selectedIndex.value = index;
            scheduleOnRN(reportPoint, index);
          }
        }
        isActive.value = withTiming(1, { duration: 140 });
        scheduleOnRN(handleGestureStart);
      })
      .onUpdate((event) => {
        "worklet";
        const { points, tangents } = frame.value;
        if (points.length < 2) return;

        const x = Math.min(
          Math.max(event.x, points[0]!.x),
          points[points.length - 1]!.x,
        );
        cursorX.value = x;
        cursorY.value = yForX(points, tangents, curve, x);

        const index = indexForX(dataPoints.value, x);
        if (index !== selectedIndex.value) {
          selectedIndex.value = index;
          scheduleOnRN(reportPoint, index);
        }
      })
      .onFinalize(() => {
        "worklet";
        isActive.value = withTiming(0, { duration: 220 });
        selectedIndex.value = -1;
        scheduleOnRN(handleGestureEnd);
      });

    return panDelay > 0 ? pan.activateAfterLongPress(panDelay) : pan;
  }, [
    curve,
    cursorX,
    cursorY,
    dataPoints,
    enablePan,
    frame,
    handleGestureEnd,
    handleGestureStart,
    isActive,
    panDelay,
    reportPoint,
    selectedIndex,
  ]);

  const context = useMemo<ILineChartContext>(
    () => ({
      data,
      curve,
      width: size.width,
      height: size.height,
      horizontalPadding,
      verticalPadding,
      frame,
      drawn,
      draw,
      isActive,
      cursorX,
      cursorY,
      selectedIndex,
    }),
    [
      data,
      curve,
      size.width,
      size.height,
      horizontalPadding,
      verticalPadding,
      frame,
      drawn,
      draw,
      isActive,
      cursorX,
      cursorY,
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

  const isReady = size.width > 0 && size.height > 0 && pixelPoints.length > 1;

  return (
    <View style={[styles.root, style]} onLayout={onLayout}>
      <GestureDetector gesture={gesture}>
        <View style={styles.fill}>
          <Canvas style={styles.fill}>
            {isReady ? (
              <LineChartContext.Provider value={context}>
                {canvasChildren}
              </LineChartContext.Provider>
            ) : null}
          </Canvas>
          {isReady ? (
            <LineChartContext.Provider value={context}>
              {overlayChildren}
            </LineChartContext.Provider>
          ) : null}
        </View>
      </GestureDetector>
    </View>
  );
};

const LineChartGrid: React.FC<ILineChartGrid> = ({
  count = 4,
  color = GRID_COLOR,
  thickness = 1,
}: ILineChartGrid) => {
  const { width, height, verticalPadding } = useLineChart("Grid");

  const path = useMemo(
    () => buildGridPath(count, width, height, verticalPadding),
    [count, height, verticalPadding, width],
  );

  if (path === "") return null;

  return (
    <Path
      path={path}
      color={color}
      style="stroke"
      strokeWidth={thickness}
      strokeCap="round"
    />
  );
};

const LineChartArea: React.FC<ILineChartArea> = ({
  colors,
  opacity = 1,
}: ILineChartArea) => {
  const { drawn, curve, height } = useLineChart("Area");

  const path = useDerivedValue<string>(
    () =>
      buildAreaPath(drawn.value.points, drawn.value.tangents, curve, height),
    [curve, height],
  );

  const gradient = colors ?? [`${LINE_COLOR}59`, `${LINE_COLOR}00`];

  return (
    <Path path={path} opacity={opacity}>
      <LinearGradient
        start={vec(0, 0)}
        end={vec(0, height)}
        colors={gradient as string[]}
      />
    </Path>
  );
};

const LineChartLine: React.FC<ILineChartLine> = ({
  color = LINE_COLOR,
  thickness = 3,
  gradientColors,
}: ILineChartLine) => {
  const { drawn, curve, width } = useLineChart("Line");

  const path = useDerivedValue<string>(
    () => buildLinePath(drawn.value.points, drawn.value.tangents, curve),
    [curve],
  );

  return (
    <Path
      path={path}
      color={color}
      style="stroke"
      strokeWidth={thickness}
      strokeJoin="round"
      strokeCap="round"
    >
      {gradientColors != null && (
        <LinearGradient
          start={vec(0, 0)}
          end={vec(width, 0)}
          colors={gradientColors as string[]}
        />
      )}
    </Path>
  );
};

const LineChartIndicator: React.FC<ILineChartIndicator> = ({
  color = LINE_COLOR,
  radius = INDICATOR_RADIUS,
  borderColor = CURSOR_BORDER_COLOR,
  pulsating = true,
}: ILineChartIndicator) => {
  const { frame, draw, isActive } = useLineChart("Indicator");
  const pulse = useSharedValue<number>(0);

  useEffect(() => {
    if (!pulsating) {
      cancelAnimation(pulse);
      pulse.value = 0;
      return;
    }
    pulse.value = withRepeat(
      withDelay(
        PULSE_DELAY,
        withSequence(
          withTiming(1, { duration: PULSE_DURATION }),
          withTiming(0, { duration: 0 }),
        ),
      ),
      -1,
    );
    return () => cancelAnimation(pulse);
  }, [pulsating, pulse]);

  const lastPoint = useDerivedValue<ILineChartVector>(() => {
    const { points } = frame.value;
    return points[points.length - 1] ?? { x: 0, y: 0 };
  });

  const cx = useDerivedValue<number>(() => lastPoint.value.x);
  const cy = useDerivedValue<number>(() => lastPoint.value.y);

  const opacity = useDerivedValue<number>(
    () =>
      interpolate(draw.value, [0.85, 1], [0, 1], Extrapolation.CLAMP) *
      (1 - isActive.value),
  );

  const pulseRadius = useDerivedValue<number>(() =>
    interpolate(
      pulse.value,
      [0, 1],
      [radius, radius * PULSE_RADIUS_MULTIPLIER],
    ),
  );
  const pulseOpacity = useDerivedValue<number>(
    () => interpolate(pulse.value, [0, 1], [0.35, 0]) * opacity.value,
  );

  return (
    <Group>
      {pulsating && (
        <Circle
          cx={cx}
          cy={cy}
          r={pulseRadius}
          opacity={pulseOpacity}
          color={color}
        />
      )}
      <Circle
        cx={cx}
        cy={cy}
        r={radius * INDICATOR_BORDER_MULTIPLIER}
        opacity={opacity}
        color={borderColor}
      />
      <Circle cx={cx} cy={cy} r={radius} opacity={opacity} color={color} />
    </Group>
  );
};

const LineChartCursor: React.FC<ILineChartCursor> = ({
  color = LINE_COLOR,
  radius = 6,
  borderColor = CURSOR_BORDER_COLOR,
  showCrosshair = true,
  crosshairColor = "rgba(255,255,255,0.25)",
  crosshairThickness = 1,
}: ILineChartCursor) => {
  const { cursorX, cursorY, isActive, height, verticalPadding } =
    useLineChart("Cursor");

  const crosshair = useDerivedValue<string>(
    () =>
      `M ${cursorX.value} ${verticalPadding} L ${cursorX.value} ${
        height - verticalPadding
      }`,
    [height, verticalPadding],
  );

  const scale = useDerivedValue<number>(() =>
    withSpring(isActive.value, SPRING_CONFIG),
  );
  const dotRadius = useDerivedValue<number>(() => radius * scale.value);
  const borderRadius = useDerivedValue<number>(
    () => radius * 1.9 * scale.value,
  );

  return (
    <Group>
      {showCrosshair && (
        <Path
          path={crosshair}
          opacity={isActive}
          color={crosshairColor}
          style="stroke"
          strokeWidth={crosshairThickness}
        />
      )}
      <Circle
        cx={cursorX}
        cy={cursorY}
        r={borderRadius}
        opacity={isActive}
        color={borderColor}
      />
      <Circle
        cx={cursorX}
        cy={cursorY}
        r={dotRadius}
        opacity={isActive}
        color={color}
      />
    </Group>
  );
};

const LineChartTooltip: React.FC<ILineChartTooltip> = ({
  children,
  format,
  style,
  textStyle,
}: ILineChartTooltip) => {
  const { data, cursorX, cursorY, isActive, selectedIndex, width } =
    useLineChart("Tooltip");
  const tooltipWidth = useSharedValue<number>(0);
  const tooltipHeight = useSharedValue<number>(0);
  const index = useSelectedIndex(selectedIndex);

  const onLayout = useCallback(
    ({ nativeEvent }: LayoutChangeEvent) => {
      tooltipWidth.value = nativeEvent.layout.width;
      tooltipHeight.value = nativeEvent.layout.height;
    },
    [tooltipHeight, tooltipWidth],
  );

  const animatedStyle = useAnimatedStyle<
    Pick<ViewStyle, "transform" | "opacity">
  >(() => {
    const half = tooltipWidth.value / 2;
    const translateX = Math.min(
      Math.max(cursorX.value - half, 0),
      Math.max(width - tooltipWidth.value, 0),
    );
    return {
      opacity: isActive.value,
      transform: [
        { translateX },
        { translateY: Math.max(cursorY.value - tooltipHeight.value - 14, 0) },
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
          <Text style={[styles.tooltipText, textStyle]}>
            {format ? format(point, index) : String(point.y)}
          </Text>
        ) : null)}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  root: {
    width: "100%",
    height: 220,
  },
  fill: {
    flex: 1,
  },
  tooltip: {
    position: "absolute",
    top: 0,
    left: 0,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: "rgba(24,24,27,0.92)",
  },
  tooltipText: {
    color: "#FAFAFA",
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 0.3,
  },
});

const Root = createCompoundComponent("LineChart.Root", memo(LineChartRoot));
const Grid = createCompoundComponent("LineChart.Grid", memo(LineChartGrid));
const Area = createCompoundComponent("LineChart.Area", memo(LineChartArea));
const Line = createCompoundComponent("LineChart.Line", memo(LineChartLine));
const Indicator = createCompoundComponent(
  "LineChart.Indicator",
  memo(LineChartIndicator),
);
const Cursor = createCompoundComponent(
  "LineChart.Cursor",
  memo(LineChartCursor),
);
const Tooltip = createCompoundComponent(
  "LineChart.Tooltip",
  memo(LineChartTooltip),
  { [OVERLAY_LAYER]: true },
);

const LineChart = createCompoundComponent("LineChart", Root, {
  Root,
  Grid,
  Area,
  Line,
  Indicator,
  Cursor,
  Tooltip,
});

export { LineChart, useLineChart };
export default LineChart;
export type {
  ILineChartRoot,
  ILineChartGrid,
  ILineChartArea,
  ILineChartLine,
  ILineChartIndicator,
  ILineChartCursor,
  ILineChartTooltip,
  ILineChartContext,
  TLineChartCurve,
  ILineChartPoint,
  ILineChartVector,
  ILineChartFrame,
} from "./types";
