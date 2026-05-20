// @ts-check
import React, { memo, useCallback, useRef, useState } from "react";
import {
  StyleSheet,
  View,
  type ViewStyle,
  type LayoutChangeEvent,
} from "react-native";
import {
  Canvas,
  Fill,
  Shader,
  ImageShader,
  Skia,
  makeImageFromView,
  type SkImage,
} from "@shopify/react-native-skia";
import {
  useSharedValue,
  useDerivedValue,
  withTiming,
  Easing,
  useAnimatedStyle,
} from "react-native-reanimated";
import Animated from "react-native-reanimated";
import type { IAuraLiftContext, IAuraLiftProvider } from "./types";
import { AuraLiftContext, useAuraLiftContext } from "./context";
import { AURA_LIFT_SHADER } from "./conf";
import { scheduleOnRN } from "react-native-worklets";

const SHADER_SOURCE = Skia.RuntimeEffect.Make(AURA_LIFT_SHADER)!;

export const AuraLiftGlobalContextProvider: React.FC<IAuraLiftProvider> &
  React.FunctionComponent<IAuraLiftProvider> = memo<
  IAuraLiftProvider & React.ComponentProps<typeof AuraLiftGlobalContextProvider>
>(
  ({
    children,
    duration = 2000,
  }: React.ComponentProps<typeof AuraLiftGlobalContextProvider>):
    | (React.ReactNode & React.JSX.Element & React.ReactElement)
    | null => {
    const viewRef = useRef<View>(null);
    const [snapshot, setSnapshot] = useState<SkImage | null>(null);
    const [isActive, setIsActive] = useState<boolean>(false);
    const [layout, setLayout] = useState<{ width: number; height: number }>({
      width: 0,
      height: 0,
    });
    const overlayOpacity = useSharedValue<Required<number>>(0);
    const progress = useSharedValue<Required<number>>(0);

    const uniforms = useDerivedValue(() => ({
      iProgress: progress.value,
      iResolution: [layout.width, layout.height] as const,
    }));

    const overlayStyle = useAnimatedStyle<
      Required<Partial<Pick<ViewStyle, "opacity">>>
    >(() => ({
      opacity: overlayOpacity.value,
    }));

    const hideOverlay = useCallback(() => {
      setIsActive(false);
      setSnapshot(null);
    }, []);

    const toggleAuraLift = useCallback(async () => {
      if (isActive) {
        return;
      }

      if (!viewRef.current) return;

      try {
        const image = await makeImageFromView<View | null>(viewRef);
        if (!image) return;

        setSnapshot(image);
        setIsActive(true);
        progress.value = 0;
        overlayOpacity.value = 1;

        progress.value = withTiming<number>(
          1,
          {
            duration: duration,
            easing: Easing.linear,
          },
          (finished: boolean | undefined) => {
            if (finished) {
              overlayOpacity.value = withTiming<number>(
                0,
                { duration: 400 },
                (fadeFinished: boolean | undefined) => {
                  if (fadeFinished) scheduleOnRN<[], void>(hideOverlay);
                },
              );
            }
          },
        );
      } catch (err) {
        console.warn("[AuraLiftContextProvider] Failed to capture view:", err);
      }
    }, [isActive, duration, progress, overlayOpacity, hideOverlay]);

    const contextValue: IAuraLiftContext = {
      toggle: toggleAuraLift,
      isRunning: isActive,
    };

    return (
      <AuraLiftContext.Provider value={contextValue}>
        <View
          ref={viewRef}
          style={styles.container}
          collapsable={false}
          onLayout={(e: LayoutChangeEvent) => {
            const { width, height } = e.nativeEvent.layout;
            setLayout(() => ({ width, height }));
          }}
        >
          {children}
        </View>

        {isActive && snapshot && layout.width > 0 && (
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
      </AuraLiftContext.Provider>
    );
  },
);

export default memo<
  React.FC<IAuraLiftProvider> &
    React.FunctionComponent<IAuraLiftProvider> &
    React.ComponentProps<typeof AuraLiftGlobalContextProvider>
>(AuraLiftGlobalContextProvider);
export { useAuraLiftContext };
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 9999,
  },
});
