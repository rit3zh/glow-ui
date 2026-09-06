import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  forwardRef,
  useImperativeHandle,
} from "react";
import {
  Blur,
  Canvas,
  Circle,
  Group,
  Image,
  Mask,
  Paint,
  Path,
  Rect,
  Skia,
  SkImage,
  makeImageFromView,
} from "@shopify/react-native-skia";
import {
  PixelRatio,
  StyleSheet,
  View,
  useWindowDimensions,
} from "react-native";
import {
  useDerivedValue,
  useSharedValue,
  withTiming,
  type SharedValue,
} from "react-native-reanimated";
import {
  ThemeMode,
  AnimationType,
  type IThemeOptions,
  type ThemeSwitcherProps,
  type ThemeSwitcherRef,
} from "./types";
import {
  DEFAULT_ANIMATION_DURATION,
  DEFAULT_ANIMATION_TYPE,
  DEFAULT_MASK_BLUR,
  DEFAULT_SLAT_COUNT,
  DEFAULT_SWITCH_DELAY,
  DEFAULT_EASING,
} from "./conf";
import { wait, getEasingFunction, getMaxRadius } from "./helpers";

/**
 * Geometry the mask needs that does not change while a single transition
 * plays. Keeping it in state rather than in shared values lets the mask use
 * plain numbers for everything but the one dimension actually animating,
 * which is what keeps the per-variant drawing code readable.
 */
interface Snapshot {
  readonly image: SkImage;
  readonly type: AnimationType;
  readonly originX: number;
  readonly originY: number;
  readonly maxRadius: number;
  readonly width: number;
  readonly height: number;
}

export const ThemeSwitcher = forwardRef<ThemeSwitcherRef, ThemeSwitcherProps>(
  (
    {
      theme,
      onThemeChange,
      children,
      animationDuration = DEFAULT_ANIMATION_DURATION,
      animationType = DEFAULT_ANIMATION_TYPE,
      style,
      onAnimationStart,
      onAnimationComplete,
      switchDelay = DEFAULT_SWITCH_DELAY,
      easing = DEFAULT_EASING,
    },
    ref,
  ) => {
    const pd = PixelRatio.get();
    const viewRef = useRef<View>(null);

    // useWindowDimensions rather than a Dimensions.get() read at first render:
    // the latter is captured once, so after a rotation the mask was still sized
    // to the old orientation and the reveal stopped short of the screen edge.
    const { width, height } = useWindowDimensions();

    const [snapshot, setSnapshot] = useState<Snapshot | null>(null);

    // A single normalised 0 -> 1 driver. Every variant derives its own geometry
    // from it, so there is exactly one value to reset between runs — the old
    // per-variant shared values could be left mid-flight by one transition and
    // then clobbered by the next one's trailing reset.
    const progress = useSharedValue(0);

    // Refs, not state, for the re-entrancy guard. setIsAnimating does not
    // update the captured `isAnimating` until the next render, so two taps in
    // the same frame both used to pass the check and race two snapshots.
    const busyRef = useRef(false);
    const mountedRef = useRef(true);
    const snapshotRef = useRef<SkImage | null>(null);

    useEffect(() => {
      mountedRef.current = true;
      return () => {
        mountedRef.current = false;
        // Skia images hold native memory that GC will not reclaim; a
        // transition interrupted by unmount would leak a full-screen bitmap.
        snapshotRef.current?.dispose();
        snapshotRef.current = null;
      };
    }, []);

    const animateThemeChange = useCallback(
      async (options?: IThemeOptions): Promise<void> => {
        if (busyRef.current) return;
        busyRef.current = true;

        const type = options?.animationType ?? animationType;
        const duration = options?.animationDuration ?? animationDuration;
        const easingFn = getEasingFunction(options?.easing ?? easing);

        const originX = options?.touchX ?? width / 2;
        const originY = options?.touchY ?? height / 2;

        const finish = (): void => {
          busyRef.current = false;
          onAnimationComplete?.();
        };

        const nextTheme: ThemeMode =
          theme === ThemeMode.Dark ? ThemeMode.Light : ThemeMode.Dark;

        onAnimationStart?.();

        // makeImageFromView rejects on a backgrounded app and on views that are
        // not yet attached. Without this the rejection escaped as an unhandled
        // promise, busyRef stayed latched, and the switch was dead until
        // reload. Falling back to an un-animated swap keeps the app usable.
        let image: SkImage | null = null;
        try {
          image = await makeImageFromView(
            viewRef as React.RefObject<React.Component>,
          );
        } catch {
          image = null;
        }

        if (!mountedRef.current) {
          image?.dispose();
          busyRef.current = false;
          return;
        }

        if (!image) {
          onThemeChange(nextTheme);
          finish();
          return;
        }

        // Reset before the overlay mounts, never after it unmounts. The old
        // code zeroed the shared values 200ms *after* clearing `isAnimating`,
        // so a tap inside that window had its fresh animation reset to 0 by
        // the previous run's tail.
        progress.value = 0;
        snapshotRef.current = image;
        setSnapshot({
          image,
          type,
          originX,
          originY,
          maxRadius: getMaxRadius(originX, originY, width, height),
          width,
          height,
        });

        // One frame for the overlay to paint before the themed UI changes
        // underneath it, otherwise the swap is visible as a flash.
        await wait(switchDelay);
        if (!mountedRef.current) return;

        onThemeChange(nextTheme);

        progress.value = withTiming(1, { duration, easing: easingFn });

        await wait(duration);
        if (!mountedRef.current) return;

        setSnapshot(null);
        finish();

        // Dispose a frame after unmounting the <Image>, not before: disposing
        // while Skia still holds the image queued for paint crashes the canvas.
        await wait(50);
        if (snapshotRef.current === image) {
          image.dispose();
          snapshotRef.current = null;
        }
      },
      [
        animationDuration,
        animationType,
        easing,
        height,
        onAnimationComplete,
        onAnimationStart,
        onThemeChange,
        progress,
        switchDelay,
        theme,
        width,
      ],
    );

    useImperativeHandle(ref, () => ({ animate: animateThemeChange }), [
      animateThemeChange,
    ]);

    return (
      <View style={[styles.container, style]} ref={viewRef} collapsable={false}>
        {children}

        {snapshot && (
          <>
            <Canvas
              style={StyleSheet.absoluteFillObject}
              pointerEvents="none"
            >
              <Mask mode="luminance" mask={<ThemeMask {...snapshot} progress={progress} />}>
                <Image
                  image={snapshot.image}
                  x={0}
                  y={0}
                  width={snapshot.image.width() / pd}
                  height={snapshot.image.height() / pd}
                />
              </Mask>
            </Canvas>

            {/* Swallows touches for the length of the transition. Taps landing
                on controls the user cannot currently see are never intentional,
                and this stops a queue of them building up behind the guard. */}
            <View
              style={StyleSheet.absoluteFillObject}
              onStartShouldSetResponder={returnTrue}
            />
          </>
        )}
      </View>
    );
  },
);

const returnTrue = (): boolean => true;

/**
 * The luminance mask for one transition. White keeps the outgoing snapshot,
 * black lets the newly themed UI through, so every variant is a shape growing
 * in black over a white field (or the inverse, for the shrinking ones).
 */
const ThemeMask: React.FC<
  Omit<Snapshot, "image"> & { progress: SharedValue<number> }
> = ({ type, originX, originY, maxRadius, width, height, progress }) => {
  const grow = useDerivedValue(() => progress.value * maxRadius);
  const shrink = useDerivedValue(() => (1 - progress.value) * maxRadius);
  const spanX = useDerivedValue(() => progress.value * width);
  const spanY = useDerivedValue(() => progress.value * height);
  const trailX = useDerivedValue(() => (1 - progress.value) * width);
  const trailY = useDerivedValue(() => (1 - progress.value) * height);

  const slatWidth = width / DEFAULT_SLAT_COUNT;
  const slatHeight = height / DEFAULT_SLAT_COUNT;
  const slatSpanX = useDerivedValue(() => progress.value * slatWidth);
  const slatSpanY = useDerivedValue(() => progress.value * slatHeight);
  const slats = React.useMemo(
    () => Array.from({ length: DEFAULT_SLAT_COUNT }, (_, i) => i),
    [],
  );

  const curtainX = useDerivedValue(() => (width - progress.value * width) / 2);

  // A rhombus |x| + |y| <= d only clears the far corner once d reaches
  // (width + height) / 2, and a square rotated 45deg has half-diagonal
  // side * sqrt(2) / 2 — so the side has to grow past (width + height) / sqrt(2).
  const irisSide = useDerivedValue(
    () => (progress.value * (width + height) * 1.05) / Math.SQRT2,
  );
  const irisX = useDerivedValue(() => originX - irisSide.value / 2);
  const irisY = useDerivedValue(() => originY - irisSide.value / 2);

  const clockPath = useDerivedValue(() => {
    const path = Skia.Path.Make();
    const oval = Skia.XYWHRect(
      originX - maxRadius,
      originY - maxRadius,
      maxRadius * 2,
      maxRadius * 2,
    );
    path.moveTo(originX, originY);
    // Start at -90deg so the sweep begins at 12 o'clock rather than 3.
    path.arcToOval(oval, -90, 360 * progress.value, false);
    path.close();
    return path;
  });

  const full = <Rect x={0} y={0} width={width} height={height} color="white" />;

  switch (type) {
    case AnimationType.Circular:
      return (
        <Group>
          {full}
          <Circle cx={originX} cy={originY} r={grow} color="black" />
        </Group>
      );

    case AnimationType.CircularInverted:
      return (
        <Group>
          <Circle cx={originX} cy={originY} r={shrink} color="white" />
        </Group>
      );

    case AnimationType.CircularBlur: {
      // The white field is overscanned by three blur radii so the blur that
      // softens the circle does not also feather the screen edges, which would
      // leave the outgoing snapshot semi-transparent in a border all round.
      const pad = DEFAULT_MASK_BLUR * 3;
      return (
        <Group
          layer={
            <Paint>
              <Blur blur={DEFAULT_MASK_BLUR} />
            </Paint>
          }
        >
          <Rect
            x={-pad}
            y={-pad}
            width={width + pad * 2}
            height={height + pad * 2}
            color="white"
          />
          <Circle cx={originX} cy={originY} r={grow} color="black" />
        </Group>
      );
    }

    case AnimationType.Wipe:
      return (
        <Group>
          {full}
          <Rect x={0} y={0} width={spanX} height={height} color="black" />
        </Group>
      );

    case AnimationType.WipeRight:
      return (
        <Group>
          {full}
          <Rect x={trailX} y={0} width={width} height={height} color="black" />
        </Group>
      );

    case AnimationType.WipeDown:
      return (
        <Group>
          {full}
          <Rect x={0} y={0} width={width} height={spanY} color="black" />
        </Group>
      );

    case AnimationType.WipeUp:
      return (
        <Group>
          {full}
          <Rect x={0} y={trailY} width={width} height={height} color="black" />
        </Group>
      );

    case AnimationType.Blinds:
      return (
        <Group>
          {full}
          {slats.map((i) => (
            <Rect
              key={i}
              x={i * slatWidth}
              y={0}
              width={slatSpanX}
              height={height}
              color="black"
            />
          ))}
        </Group>
      );

    case AnimationType.BlindsHorizontal:
      return (
        <Group>
          {full}
          {slats.map((i) => (
            <Rect
              key={i}
              x={0}
              y={i * slatHeight}
              width={width}
              height={slatSpanY}
              color="black"
            />
          ))}
        </Group>
      );

    case AnimationType.Curtain:
      return (
        <Group>
          {full}
          <Rect
            x={curtainX}
            y={0}
            width={spanX}
            height={height}
            color="black"
          />
        </Group>
      );

    case AnimationType.Iris:
      return (
        <Group>
          {full}
          <Group
            transform={[{ rotate: Math.PI / 4 }]}
            origin={{ x: originX, y: originY }}
          >
            <Rect
              x={irisX}
              y={irisY}
              width={irisSide}
              height={irisSide}
              color="black"
            />
          </Group>
        </Group>
      );

    case AnimationType.Fade:
      // A grey ramp rather than a shape: mid-luminance means the outgoing
      // snapshot is drawn semi-transparent, which is exactly a cross-fade.
      return (
        <Group>
          {full}
          <Group opacity={progress}>
            <Rect x={0} y={0} width={width} height={height} color="black" />
          </Group>
        </Group>
      );

    case AnimationType.ClockWipe:
      return (
        <Group>
          {full}
          <Path path={clockPath} color="black" />
        </Group>
      );

    default:
      return (
        <Group>
          {full}
          <Rect x={0} y={0} width={spanX} height={height} color="black" />
        </Group>
      );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
