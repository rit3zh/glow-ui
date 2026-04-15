// @ts-check
import React, { memo, useCallback, useRef, useState } from "react";
import { StyleSheet, View, ViewStyle } from "react-native";
import {
  Canvas,
  Fill,
  Shader,
  ImageShader,
  makeImageFromView,
  type SkImage,
} from "@shopify/react-native-skia";
import {
  useSharedValue,
  withTiming,
  Easing,
  useAnimatedStyle,
} from "react-native-reanimated";
import Animated from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";
import { SiriContext } from "./context";
import { SHADER_SOURCE } from "./conf";
import { useSiriUniforms } from "./use-siri-uniforms";
import type { IAppleIntelligenceProvider, ISiriToggleOptions } from "./types";

export const SiriProvider: React.FC<IAppleIntelligenceProvider> &
  React.FunctionComponent<IAppleIntelligenceProvider> = memo<
  IAppleIntelligenceProvider & React.ComponentProps<typeof SiriProvider>
>(
  ({
    children,
    introDuration = 1200,
    outroDuration = 600,
    wave: defaultWave,
    noise: defaultNoise,
    glow: defaultGlow,
    shimmer: defaultShimmer,
    border: defaultBorder,
  }: IAppleIntelligenceProvider & React.ComponentProps<typeof SiriProvider>):
    | (React.ReactNode & React.JSX.Element & React.ReactElement)
    | null => {
    const viewRef = useRef<View>(null);
    const [snapshot, setSnapshot] = useState<SkImage | null>(null);
    const [active, setActive] = useState<boolean>(false);
    const [layout, setLayout] = useState<{ width: number; height: number }>({
      width: 0,
      height: 0,
    });
    const busyRef = useRef<boolean>(false);

    const [overlayContent, setOverlayContent] = useState<React.ReactNode>(null);

    const overlayOpacity = useSharedValue<number>(0);

    const { iTime, intensity, uniforms, applyConfig, frameCallback } = useSiriUniforms({
      layout,
      defaultWave,
      defaultNoise,
      defaultGlow,
      defaultShimmer,
      defaultBorder,
    });

    const overlayStyle = useAnimatedStyle<
      Required<Partial<Pick<ViewStyle, "opacity">>>
    >(() => ({
      opacity: overlayOpacity.value,
    }));

    const dismiss = useCallback(() => {
      frameCallback.setActive(false);
      busyRef.current = false;
      setActive(false);
      setSnapshot(null);
      setOverlayContent(null);
    }, [frameCallback]);

    const toggle = useCallback(
      async (options?: ISiriToggleOptions) => {
        if (active) {
          busyRef.current = true;
          intensity.value = withTiming<number>(
            0,
            { duration: outroDuration, easing: Easing.out(Easing.quad) },
            (finished) => {
              if (finished) {
                overlayOpacity.value = withTiming(
                  0,
                  { duration: 200 },
                  (done) => {
                    if (done) scheduleOnRN(dismiss);
                  },
                );
              }
            },
          );
          return;
        }

        if (
          busyRef.current ||
          !viewRef.current ||
          layout.width === 0 ||
          layout.height === 0
        )
          return;
        busyRef.current = true;

        try {
          const image = await makeImageFromView(viewRef);
          if (!image) {
            busyRef.current = false;
            return;
          }

          applyConfig(options);
          intensity.value = 0;
          iTime.value = 0;
          overlayOpacity.value = 1;

          setSnapshot(image);
          setActive(true);
          frameCallback.setActive(true);
          busyRef.current = false;

          intensity.value = withTiming(1, {
            duration: introDuration,
            easing: Easing.bezier(0.25, 0.1, 0.25, 1),
          });
        } catch (err) {
          busyRef.current = false;
          console.warn("[SiriProvider]", err);
        }
      },
      [
        active,
        layout,
        introDuration,
        outroDuration,
        applyConfig,
        frameCallback,
        dismiss,
        intensity,
        overlayOpacity,
        iTime,
      ],
    );

    const setOverlay = useCallback((content: React.ReactNode) => {
      setOverlayContent(content);
    }, []);

    return (
      <SiriContext.Provider value={{ toggle, isActive: active, setOverlay }}>
        <View
          ref={viewRef}
          style={styles.container}
          collapsable={false}
          onLayout={(e) => {
            const { width, height } = e.nativeEvent.layout;
            setLayout({ width, height });
          }}
        >
          {children}
        </View>
        {active && snapshot && layout.width > 0 && (
          <Animated.View
            style={[styles.overlay, overlayStyle]}
            pointerEvents="none"
          >
            <Canvas style={{ width: layout.width, height: layout.height }}>
              <Fill>
                <Shader source={SHADER_SOURCE} uniforms={uniforms}>
                  <ImageShader
                    image={snapshot}
                    fit="cover"
                    width={layout.width}
                    height={layout.height}
                  />
                </Shader>
              </Fill>
            </Canvas>
          </Animated.View>
        )}
        {overlayContent}
      </SiriContext.Provider>
    );
  },
);

export default memo<
  React.FC<IAppleIntelligenceProvider> &
    React.FunctionComponent<IAppleIntelligenceProvider> &
    React.ComponentProps<typeof SiriProvider>
>(SiriProvider);

const styles = StyleSheet.create({
  container: { flex: 1 },
  overlay: { ...StyleSheet.absoluteFillObject, zIndex: 9999 },
});
