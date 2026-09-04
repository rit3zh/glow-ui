import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
// @ts-check
import {
  Canvas,
  RoundedRect,
  Skia,
  Group,
  Paint,
  RuntimeShader,
  rect,
  rrect,
  Image as SkiaImage,
  ImageShader,
  Fill,
  useImage,
  makeImageFromView,
  SkImage,
  SkPath,
} from "@shopify/react-native-skia";
import { PixelRatio, StyleSheet, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { scheduleOnRN } from "react-native-worklets";

import { RIPPLE_SHADER_SOURCE } from "./conf";
import { useRipple } from "./hook";
// @ts-nocheck
import type { IRippleSkiaEffect, IRippleImage, IRippleRect } from "./types";

const RIPPLE_SHADER = Skia.RuntimeEffect.Make(RIPPLE_SHADER_SOURCE);

const SkiaRippleEffect: React.FC<IRippleSkiaEffect> &
  React.FunctionComponent<IRippleSkiaEffect> = memo<IRippleSkiaEffect>(
  ({
    width,
    height,
    children,
    amplitude = 12,
    frequency = 15,
    decay = 8,
    speed = 1200,
    duration = 4,
    borderRadius = 0,
    style,
  }: IRippleSkiaEffect): React.ReactNode &
    React.JSX.Element &
    React.ReactElement => {
    const pd = PixelRatio.get();
    const viewRef = useRef<View>(null);
    const snapshotRef = useRef<SkImage | null>(null);
    const [snapshot, setSnapshot] = useState<SkImage | null>(null);

    const { uniforms, start } = useRipple({
      amplitude: amplitude * pd,
      decay,
      duration,
      frequency,
      height: height * pd,
      speed: speed * pd,
      width: width * pd,
    });

    const capture = useCallback(async (): Promise<SkImage | null> => {
      if (!viewRef.current) return null;
      await new Promise((resolve) => requestAnimationFrame(resolve));
      const image = await makeImageFromView(viewRef);
      if (image) {
        snapshotRef.current = image;
        setSnapshot(image);
      }
      return image;
    }, []);

    useEffect(() => {
      capture();
    }, [children, capture]);

    const handleTap = useCallback(
      async (x: number, y: number) => {
        const px = x * pd;
        const py = y * pd;
        if (snapshotRef.current) {
          start(px, py);
          capture();
          return;
        }
        const image = await capture();
        if (image) start(px, py);
      },
      [capture, start, pd],
    );

    const tap = Gesture.Tap().onStart((event) => {
      scheduleOnRN(handleTap, event.x, event.y);
    });

    if (!RIPPLE_SHADER) {
      return (
        <View
          style={[{ width, height, borderRadius, overflow: "hidden" }, style]}
        >
          {children}
        </View>
      );
    }

    return (
      <GestureDetector gesture={tap}>
        <View
          style={[{ width, height, borderRadius, overflow: "hidden" }, style]}
        >
          <View
            ref={viewRef}
            collapsable={false}
            onLayout={() => capture()}
            style={StyleSheet.absoluteFill}
          >
            {children}
          </View>

          {snapshot && (
            <Canvas style={StyleSheet.absoluteFill} pointerEvents="none">
              <Group transform={[{ scale: 1 / pd }]}>
                <Fill>
                  <RuntimeShader source={RIPPLE_SHADER} uniforms={uniforms}>
                    <ImageShader
                      image={snapshot}
                      fit="cover"
                      rect={rect(0, 0, snapshot.width(), snapshot.height())}
                    />
                  </RuntimeShader>
                </Fill>
              </Group>
            </Canvas>
          )}
        </View>
      </GestureDetector>
    );
  },
);

const RippleImage: React.FC<IRippleImage> &
  React.FunctionComponent<IRippleImage> = memo<IRippleImage>(
  ({
    width,
    height,
    source,
    amplitude = 12,
    frequency = 15,
    decay = 8,
    speed = 1200,
    duration = 4,
    borderRadius = 0,
    style,
    fit = "cover",
  }: IRippleImage): React.ReactNode &
    React.JSX.Element &
    React.ReactElement => {
    const image = useImage(source);
    const { uniforms, tap } = useRipple({
      amplitude,
      decay,
      duration,
      frequency,
      height,
      speed,
      width,
    });

    const clipPath = useMemo<SkPath | null>(() => {
      if (borderRadius <= 0) return null;
      const path = Skia.Path.Make();
      path.addRRect(
        rrect(rect(0, 0, width, height), borderRadius, borderRadius),
      );
      return path;
    }, [width, height, borderRadius]);

    if (!RIPPLE_SHADER) {
      return (
        <GestureDetector gesture={tap}>
          <View
            style={[{ width, height, borderRadius, overflow: "hidden" }, style]}
          >
            <Canvas style={{ width, height }}>
              {image && (
                <SkiaImage
                  image={image}
                  x={0}
                  y={0}
                  width={width}
                  height={height}
                  fit={fit}
                />
              )}
            </Canvas>
          </View>
        </GestureDetector>
      );
    }

    return (
      <GestureDetector gesture={tap}>
        <View
          style={[{ width, height, borderRadius, overflow: "hidden" }, style]}
        >
          <Canvas style={{ width, height }}>
            <Group
              clip={clipPath ?? undefined}
              layer={
                <Paint>
                  <RuntimeShader source={RIPPLE_SHADER} uniforms={uniforms} />
                </Paint>
              }
            >
              {image && (
                <SkiaImage
                  image={image}
                  x={0}
                  y={0}
                  width={width}
                  height={height}
                  fit={fit}
                />
              )}
            </Group>
          </Canvas>
        </View>
      </GestureDetector>
    );
  },
);

const RippleRect: React.FC<IRippleRect> & React.FunctionComponent<IRippleRect> =
  memo<IRippleRect>(
    ({
      width,
      height,
      color,
      amplitude = 12,
      frequency = 15,
      decay = 8,
      speed = 1200,
      duration = 4,
      borderRadius = 0,
      style,
      children,
    }: IRippleRect):
      | (React.ReactNode & React.JSX.Element & React.ReactElement)
      | null => {
      const { uniforms, tap } = useRipple({
        amplitude,
        decay,
        duration,
        frequency,
        height,
        speed,
        width,
      });

      if (!RIPPLE_SHADER) {
        return (
          <GestureDetector gesture={tap}>
            <View
              style={[
                { width, height, borderRadius, overflow: "hidden" },
                style,
              ]}
            >
              <Canvas style={{ width, height }}>
                <RoundedRect
                  x={0}
                  y={0}
                  width={width}
                  height={height}
                  r={borderRadius}
                  color={color}
                />
              </Canvas>
              {children && (
                <View style={[StyleSheet.absoluteFill, styles.container]}>
                  {children}
                </View>
              )}
            </View>
          </GestureDetector>
        );
      }

      return (
        <GestureDetector gesture={tap}>
          <View
            style={[{ width, height, borderRadius, overflow: "hidden" }, style]}
          >
            <Canvas style={{ width, height }}>
              <Group
                layer={
                  <Paint>
                    <RuntimeShader source={RIPPLE_SHADER} uniforms={uniforms} />
                  </Paint>
                }
              >
                <RoundedRect
                  x={0}
                  y={0}
                  width={width}
                  height={height}
                  r={borderRadius}
                  color={color}
                />
              </Group>
            </Canvas>
            {children && (
              <View style={[StyleSheet.absoluteFill, styles.container]}>
                {children}
              </View>
            )}
          </View>
        </GestureDetector>
      );
    },
  );

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    pointerEvents: "none",
  },
});

export { SkiaRippleEffect, RippleImage, RippleRect };
