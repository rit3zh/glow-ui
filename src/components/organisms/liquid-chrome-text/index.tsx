import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  StyleSheet,
  View,
  type ViewStyle,
  type LayoutChangeEvent,
} from "react-native";
import {
  Canvas,
  Fill,
  ImageShader,
  Shader,
  Skia,
  type Uniforms,
} from "@shopify/react-native-skia";
import Animated, {
  useAnimatedStyle,
  useDerivedValue,
  useFrameCallback,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { SHADER_SOURCE } from "./conf";
import {
  COLOR_TRANSITION_MS,
  DEFAULTS,
  REVEAL_MS,
  SLOPE_GAIN,
  SLOPE_REFERENCE_HEIGHT,
  STATIC_TIME,
  TILT_FREQ_X,
  TILT_FREQ_Y,
  TILT_RANGE,
} from "./const";
import { colorsToFloats } from "./helper";
import {
  useAppActive,
  useChromeField,
  useChromeFont,
  useReduceMotion,
} from "./hooks";
import type { ILiquidChromeText } from "./types";

const shader = Skia.RuntimeEffect.Make(SHADER_SOURCE);

export const LiquidChromeText: React.FC<ILiquidChromeText> &
  React.FunctionComponent<ILiquidChromeText> = memo(
  ({
    text = DEFAULTS.TEXT,
    width: widthProp,
    height = DEFAULTS.HEIGHT,
    borderRadius = DEFAULTS.BORDER_RADIUS,
    skyColor,
    highlightColor,
    shadowColor,
    groundColor,
    baseColor,
    sparkColor,
    colors,
    fontSource,
    fontFamily,
    fontWeight = DEFAULTS.FONT_WEIGHT,
    fontSizeRatio = DEFAULTS.FONT_SIZE_RATIO,
    widthRatio = DEFAULTS.WIDTH_RATIO,
    letterSpacing = DEFAULTS.LETTER_SPACING,
    bulge = DEFAULTS.BULGE,
    normalStrength = DEFAULTS.NORMAL_STRENGTH,
    horizonSharpness = DEFAULTS.HORIZON_SHARPNESS,
    roughness = DEFAULTS.ROUGHNESS,
    fresnel = DEFAULTS.FRESNEL,
    sparkle = DEFAULTS.SPARKLE,
    edgeSoftness = DEFAULTS.EDGE_SOFTNESS,
    speed = DEFAULTS.SPEED,
    drift = DEFAULTS.DRIFT,
    resolution = DEFAULTS.RESOLUTION,
    paused = false,
    asChild = false,
    children,
    style,
    onReady,
  }: ILiquidChromeText): (React.ReactNode & React.JSX.Element) | null => {
    const [measured, setMeasured] = useState<number>(0);
    const width = widthProp ?? measured;

    const reduceMotion = useReduceMotion();
    const appActive = useAppActive();
    const font = useChromeFont(fontSource, fontFamily, fontWeight);

    const field = useChromeField({
      text,
      font,
      width,
      height,
      scale: resolution,
      fontSizeRatio,
      widthRatio,
      letterSpacing,
      bulge,
    });

    const tick = useSharedValue<number>(0);
    const reveal = useSharedValue<number>(0);

    const frame = useFrameCallback(({ timeSincePreviousFrame }) => {
      const dt =
        timeSincePreviousFrame != null ? timeSincePreviousFrame / 1000 : 0.016;
      tick.value += dt * speed;
    }, false);

    const running = !!field && appActive && !paused && !reduceMotion;
    useEffect(() => {
      frame.setActive(running);
      return () => frame.setActive(false);
    }, [frame, running]);

    useEffect(() => {
      if (reduceMotion) tick.value = STATIC_TIME;
    }, [reduceMotion, tick]);

    const palette = useMemo<number[]>(
      () =>
        colorsToFloats({
          sky: skyColor ?? colors?.sky ?? DEFAULTS.SKY,
          highlight: highlightColor ?? colors?.highlight ?? DEFAULTS.HIGHLIGHT,
          shadow: shadowColor ?? colors?.shadow ?? DEFAULTS.SHADOW,
          ground: groundColor ?? colors?.ground ?? DEFAULTS.GROUND,
          base: baseColor ?? colors?.base ?? DEFAULTS.BASE,
          spark: sparkColor ?? colors?.spark ?? DEFAULTS.SPARK,
        }),
      [
        skyColor,
        highlightColor,
        shadowColor,
        groundColor,
        baseColor,
        sparkColor,
        colors,
      ],
    );

    const previous = useRef(palette);
    const [pair, setPair] = useState(() => ({ from: palette, to: palette }));
    const colorMix = useSharedValue<number>(1);

    useEffect(() => {
      setPair({ from: previous.current, to: palette });
      previous.current = palette;
      colorMix.value = 0;
      colorMix.value = withTiming(1, { duration: COLOR_TRANSITION_MS });
    }, [palette, colorMix]);

    const onReadyRef = useRef(onReady);
    onReadyRef.current = onReady;

    useEffect(() => {
      if (!field) return;
      reveal.value = withTiming(1, { duration: REVEAL_MS });
      onReadyRef.current?.();
    }, [field, reveal]);

    const revealStyle = useAnimatedStyle<Pick<ViewStyle, "opacity">>(() => ({
      opacity: reveal.value,
    }));

    const fieldWidth = field?.width ?? 1;
    const fieldHeight = field?.height ?? 1;
    const slope =
      (SLOPE_GAIN * normalStrength * fieldHeight) / SLOPE_REFERENCE_HEIGHT;

    const uniforms = useDerivedValue<Uniforms>(() => {
      const { from, to } = pair;
      const m = colorMix.value;
      const stop = (i: number): [number, number, number] => [
        from[i] + (to[i] - from[i]) * m,
        from[i + 1] + (to[i + 1] - from[i + 1]) * m,
        from[i + 2] + (to[i + 2] - from[i + 2]) * m,
      ];

      const t = tick.value;
      const amp = TILT_RANGE * drift;

      return {
        uResolution: [width, height],
        uTexel: [1 / fieldWidth, 1 / fieldHeight],
        uTilt: [
          Math.sin(t * TILT_FREQ_X) * amp * 0.5,
          Math.cos(t * TILT_FREQ_Y) * amp * 0.4,
        ],
        uAspect: width / Math.max(1, height),
        uTime: t,
        uSlope: slope,
        uHorizon: Math.max(0.02, Math.min(1, horizonSharpness)),
        uRough: Math.max(0, Math.min(1, roughness)),
        uFresnel: Math.max(0, fresnel),
        uSparkle: Math.max(0, sparkle),
        uEdge: Math.max(0.05, edgeSoftness),
        uS0: stop(0),
        uS1: stop(3),
        uS2: stop(6),
        uS3: stop(9),
        uS4: stop(12),
        uSpark: stop(15),
      };
    }, [
      pair,
      width,
      height,
      fieldWidth,
      fieldHeight,
      slope,
      horizonSharpness,
      roughness,
      fresnel,
      sparkle,
      edgeSoftness,
      drift,
    ]);

    const onLayout = useCallback((e: LayoutChangeEvent) => {
      const next = e.nativeEvent.layout.width;
      setMeasured((prev) => (prev === next ? prev : next));
    }, []);

    if (!shader) return null;

    const shaderContent: React.ReactNode & React.ReactElement = (
      <Animated.View style={[StyleSheet.absoluteFill, revealStyle]}>
        {field && width > 0 ? (
          <Canvas style={styles.canvas}>
            <Fill>
              <Shader source={shader} uniforms={uniforms}>
                <ImageShader
                  image={field.image}
                  x={0}
                  y={0}
                  width={width}
                  height={height}
                  fit="fill"
                  tx="clamp"
                  ty="clamp"
                />
              </Shader>
            </Fill>
          </Canvas>
        ) : null}
      </Animated.View>
    );

    const wrapperStyle = [
      styles.wrapper,
      { width: widthProp, height, borderRadius },
      style,
    ];

    if (asChild) {
      return (
        <View style={wrapperStyle} onLayout={onLayout}>
          {shaderContent}
          <View style={[styles.content, { borderRadius }]}>{children}</View>
        </View>
      );
    }

    return (
      <View style={wrapperStyle} onLayout={onLayout}>
        {shaderContent}
      </View>
    );
  },
);

const styles = StyleSheet.create({
  wrapper: {
    position: "relative",
    overflow: "hidden",
    backgroundColor: "transparent",
    alignSelf: "stretch",
  },
  canvas: {
    flex: 1,
  },
  content: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
});

export type { ILiquidChromeText, IChromeColors } from "./types";
export default memo<
  React.FC<ILiquidChromeText> & React.FunctionComponent<ILiquidChromeText>
>(LiquidChromeText);
