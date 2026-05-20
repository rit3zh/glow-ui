// @ts-check
import { StyleSheet, View, type LayoutChangeEvent } from "react-native";
import React, { useEffect, useMemo, memo, useState, useRef, useCallback } from "react";
import {
  Canvas,
  Skia,
  Fill,
  Shader,
  ImageShader,
  Group,
  rect,
  type SkRuntimeEffect,
  type Uniforms,
} from "@shopify/react-native-skia";
import {
  useSharedValue,
  withTiming,
  useDerivedValue,
  Easing,
  cancelAnimation,
} from "react-native-reanimated";
import type { IWaveScrawler, ITransitionRenderer } from "./types";
import { WAVE_SCRAWLER_SHADER, DEFAULT_CONFIG } from "./conf";
import { scheduleOnRN } from "react-native-worklets";
import { useLoadedImages } from "./hooks";

const TransitionRenderer: React.FC<ITransitionRenderer> &
  React.FunctionComponent<ITransitionRenderer> = memo<ITransitionRenderer>(
  ({
    fromImage,
    toImage,
    progress,
    width,
    height,
    amplitude,
    waves,
    colorSeparation,
  }: ITransitionRenderer):
    | (React.JSX.Element & React.ReactNode & React.ReactElement)
    | null => {
    const runtimeEffect = useMemo<SkRuntimeEffect | null>(() => {
      return Skia.RuntimeEffect.Make(WAVE_SCRAWLER_SHADER);
    }, []);

    const uniforms = useDerivedValue<Uniforms>(() => {
      return {
        progress: progress.value,
        resolution: [width, height],
        amplitude,
        waves,
        colorSeparation,
      };
    });

    if (!runtimeEffect || !fromImage || !toImage || width === 0 || height === 0) {
      return null;
    }

    return (
      <Fill>
        <Shader source={runtimeEffect} uniforms={uniforms}>
          <ImageShader
            image={fromImage}
            fit="cover"
            x={0}
            y={0}
            width={width}
            height={height}
          />
          <ImageShader
            image={toImage}
            fit="cover"
            x={0}
            y={0}
            width={width}
            height={height}
          />
        </Shader>
      </Fill>
    );
  },
);

export const WaveScrawler: React.FC<IWaveScrawler> &
  React.FunctionComponent<IWaveScrawler> = memo<IWaveScrawler>(
  ({
    source,
    index,
    duration = DEFAULT_CONFIG.duration,
    amplitude = DEFAULT_CONFIG.amplitude,
    waves = DEFAULT_CONFIG.waves,
    colorSeparation = DEFAULT_CONFIG.colorSeparation,
    style,
    onTransitionEnd,
  }: IWaveScrawler):
    | (React.ReactNode & React.JSX.Element & React.ReactElement)
    | null => {
    const [dimensions, setDimensions] = useState<{
      width: number;
      height: number;
    }>({ width: 0, height: 0 });
    const [displayedIndex, setDisplayedIndex] = useState<number>(index);
    const [transition, setTransition] = useState<{
      from: number;
      to: number;
    } | null>(null);
    const prevIndexRef = useRef<number>(index);
    const progress = useSharedValue<number>(0);
    const loadedImages = useLoadedImages(source);

    const onLayout = <T extends LayoutChangeEvent>(event: T) => {
      const { width, height } = event.nativeEvent.layout;
      setDimensions({ width, height });
    };

    const finishTransition = useCallback(
      (next: number) => {
        setDisplayedIndex(next);
        setTransition(null);
        onTransitionEnd?.(next);
      },
      [onTransitionEnd],
    );

    useEffect(() => {
      if (index === prevIndexRef.current) return;
      const from = prevIndexRef.current;
      const to = index;
      prevIndexRef.current = index;

      cancelAnimation(progress);
      setTransition({ from, to });
      progress.value = 0;
      progress.value = withTiming<number>(
        1,
        {
          duration,
          easing: Easing.bezier(0.4, 0, 0.2, 1),
        },
        (finished) => {
          if (finished) {
            scheduleOnRN<[number], void>(finishTransition, to);
          }
        },
      );
    }, [index, duration, finishTransition, progress]);

    const fromImage = transition ? loadedImages[transition.from] ?? null : null;
    const toImage = transition ? loadedImages[transition.to] ?? null : null;
    const displayedImage = loadedImages[displayedIndex] ?? null;

    return (
      <View style={[styles.container, style]} onLayout={onLayout}>
        <Canvas style={styles.canvas}>
          {transition && fromImage && toImage ? (
            <TransitionRenderer
              fromImage={fromImage}
              toImage={toImage}
              progress={progress}
              width={dimensions.width}
              height={dimensions.height}
              amplitude={amplitude}
              waves={waves}
              colorSeparation={colorSeparation}
            />
          ) : displayedImage && dimensions.width > 0 && dimensions.height > 0 ? (
            <Group>
              <ImageShader
                image={displayedImage}
                fit="cover"
                rect={rect(0, 0, dimensions.width, dimensions.height)}
              />
              <Fill />
            </Group>
          ) : null}
        </Canvas>
      </View>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    overflow: "hidden",
  },
  canvas: {
    flex: 1,
  },
});

export default memo<
  React.FC<IWaveScrawler> & React.FunctionComponent<IWaveScrawler>
>(WaveScrawler);
export type { IWaveScrawler, ImageSource, ITransitionRenderer } from "./types";
