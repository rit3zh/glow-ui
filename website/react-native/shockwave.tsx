// @ts-check
import React, {
  createContext,
  memo,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { StyleSheet, View } from "react-native";
import {
  Canvas,
  Fill,
  ImageShader,
  Shader,
  Skia,
  type SkImage,
  type Uniforms,
} from "@shopify/react-native-skia";
import {
  Easing,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { DEFAULTS } from "./conf";
import { SHOCKWAVE_SHADER_SOURCE } from "./const";
import { snapshotPair } from "./utils";
import type {
  IShockwaveContext,
  IShockwaveProps,
  IShockwaveSlotProps,
  ShockwaveValue,
} from "./types";
import { scheduleOnRN } from "react-native-worklets";

const shader = Skia.RuntimeEffect.Make(SHOCKWAVE_SHADER_SOURCE);

const ShockwaveContext = createContext<IShockwaveContext | null>(null);

const useShockwaveContext = (): IShockwaveContext => {
  const ctx = useContext(ShockwaveContext);
  if (!ctx)
    throw new Error(
      "Shockwave.Transition.* must be rendered inside <Shockwave>",
    );
  return ctx;
};

const OFFSCREEN_OFFSET = 100000;

const From: React.FC<IShockwaveSlotProps> = memo<IShockwaveSlotProps>(
  ({ children, style }: IShockwaveSlotProps) => {
    const { fromRef, activeValue, isTransitioning } = useShockwaveContext();
    const isActive = activeValue === "from";
    return (
      <View
        ref={fromRef}
        collapsable={false}
        pointerEvents={isActive && !isTransitioning ? "auto" : "none"}
        style={[
          StyleSheet.absoluteFill,
          {
            zIndex: isActive ? 2 : 1,
            transform: [{ translateX: isActive ? 0 : OFFSCREEN_OFFSET }],
          },
          style,
        ]}
      >
        {children}
      </View>
    );
  },
);

const To: React.FC<IShockwaveSlotProps> = memo<IShockwaveSlotProps>(
  ({ children, style }: IShockwaveSlotProps) => {
    const { toRef, activeValue, isTransitioning } = useShockwaveContext();
    const isActive = activeValue === "to";
    return (
      <View
        ref={toRef}
        collapsable={false}
        pointerEvents={isActive && !isTransitioning ? "auto" : "none"}
        style={[
          StyleSheet.absoluteFill,
          {
            zIndex: isActive ? 2 : 1,
            transform: [{ translateX: isActive ? 0 : OFFSCREEN_OFFSET }],
          },
          style,
        ]}
      >
        {children}
      </View>
    );
  },
);

const Transition = { From, To } as const;

const ShockwaveRoot: React.MemoExoticComponent<React.FC<IShockwaveProps>> =
  memo(
    ({
      value,
      width = DEFAULTS.WIDTH,
      height = DEFAULTS.HEIGHT,
      duration = DEFAULTS.DURATION,
      origin,
      shockStrength = DEFAULTS.SHOCK_STRENGTH,
      lensingSpread = DEFAULTS.LENSING_SPREAD,
      style,
      children,
      onTransitionEnd,
    }: IShockwaveProps): React.JSX.Element &
      React.ReactNode &
      React.ReactElement => {
      const fromRef = useRef<View | null>(null);
      const toRef = useRef<View | null>(null);
      const prevValueRef = useRef<ShockwaveValue>(value);

      const [activeValue, setActiveValue] = useState<ShockwaveValue>(value);
      const [snapshots, setSnapshots] = useState<{
        from: SkImage;
        to: SkImage;
      } | null>(null);

      const progress = useSharedValue<number>(0);

      const finishTransition = useCallback(
        (next: ShockwaveValue) => {
          setActiveValue(next);
          setSnapshots(null);
          onTransitionEnd?.(next);
        },
        [onTransitionEnd],
      );

      useEffect(() => {
        if (value === prevValueRef.current) return;
        const prev = prevValueRef.current;
        const next = value;
        prevValueRef.current = value;

        let cancelled = false;
        (async () => {
          const pair = await snapshotPair(
            fromRef as React.RefObject<View>,
            toRef as React.RefObject<View>,
            prev,
            next,
          );
          if (cancelled) return;
          if (!pair) {
            setActiveValue(next);
            return;
          }
          setSnapshots(pair);
          progress.value = 0;
          progress.value = withTiming(
            1,
            { duration, easing: Easing.linear },
            (done) => {
              if (done) scheduleOnRN(finishTransition, next);
            },
          );
        })();

        return () => {
          cancelled = true;
        };
      }, [value, duration, finishTransition, progress]);

      const ox = origin?.x ?? width / 2;
      const oy = origin?.y ?? height / 2;

      const uniforms = useDerivedValue<Uniforms>(() => ({
        iResolution: [width, height],
        iTime: progress.value,
        iMouse: [ox, oy],
        uShockStrength: shockStrength,
        uLensingSpread: lensingSpread,
      }));

      const ctxValue = useMemo<IShockwaveContext>(
        () => ({
          fromRef,
          toRef,
          activeValue,
          isTransitioning: snapshots !== null,
        }),
        [activeValue, snapshots],
      );

      return (
        <View style={[styles.wrapper, { width, height }, style]}>
          <ShockwaveContext.Provider value={ctxValue}>
            {children}
          </ShockwaveContext.Provider>
          {snapshots && shader && (
            <Canvas
              style={[StyleSheet.absoluteFill, styles.canvasOverlay]}
              pointerEvents="none"
            >
              <Fill>
                <Shader source={shader} uniforms={uniforms}>
                  <ImageShader
                    image={snapshots.from}
                    fit="cover"
                    rect={{ x: 0, y: 0, width, height }}
                  />
                  <ImageShader
                    image={snapshots.to}
                    fit="cover"
                    rect={{ x: 0, y: 0, width, height }}
                  />
                </Shader>
              </Fill>
            </Canvas>
          )}
        </View>
      );
    },
  );

const styles = StyleSheet.create({
  wrapper: {
    position: "relative",
    overflow: "hidden",
    backgroundColor: "transparent",
  },
  canvasOverlay: {
    zIndex: 3,
  },
});

const Shockwave = Object.assign(ShockwaveRoot, { Transition });

export { Shockwave };
export type {
  IShockwaveProps,
  IShockwaveSlotProps,
  IShockwaveContext,
  IShockwaveOrigin,
  ShockwaveValue,
} from "./types";
export default Shockwave;
