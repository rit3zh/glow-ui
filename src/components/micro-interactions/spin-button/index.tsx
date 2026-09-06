/**
 * Animation inspired by:
 * https://x.com/dev_ya/status/1991193618787254462
 * Interaction design by Yanis Lebzar.
 */

import { StyleSheet, Pressable, Text, View } from "react-native";
import type { LayoutChangeEvent } from "react-native";
import React, { useState, useCallback, useEffect, useMemo } from "react";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withRepeat,
  cancelAnimation,
  Easing,
  interpolate,
  Extrapolation,
  interpolateColor,
  withSpring,
} from "react-native-reanimated";
import Svg, { Circle } from "react-native-svg";
import type {
  SpinButtonProps,
  AnimationConfig,
  CharacterProps,
  CharacterTimeline,
  LabelLayerProps,
} from "./types";
import {
  BUTTON_SCALE,
  DEFAULT_ANIMATION_CONFIG,
  DEFAULT_BUTTON_COLORS,
  DEFAULT_CHARACTER_ENTER_INITIAL,
  DEFAULT_CHARACTER_EXIT_FINAL,
  DEFAULT_SPINNER_CONFIG,
  DEFAULT_BUTTON_STYLE,
} from "./conf";

const mergeDeep = <T extends Record<string, any>>(
  target: T,
  source: Partial<T>,
): T => {
  const output = { ...target };

  for (const key in source) {
    if (
      source[key] &&
      typeof source[key] === "object" &&
      !Array.isArray(source[key])
    ) {
      output[key] = mergeDeep(
        output[key] as Record<string, any>,
        source[key] as Record<string, any>,
      ) as T[Extract<keyof T, string>];
    } else if (source[key] !== undefined) {
      output[key] = source[key] as T[Extract<keyof T, string>];
    }
  }

  return output;
};

/**
 * Both labels stay mounted and are cross-faded by a single progress value, so
 * nothing mounts, unmounts or runs a layout animation while the button
 * transitions. Every frame is a plain transform/opacity update on the UI
 * thread — the whole interaction is one shared value deep.
 *
 * Timings are normalized against the longest of the two label sweeps so the
 * whole swap fits inside one 0 → 1 progress run, in either direction.
 */
const buildTimeline = (
  idleLength: number,
  activeLength: number,
  config: AnimationConfig,
): CharacterTimeline => {
  const delay = config.characterDelay;
  const exitSpan = config.characterExitDuration;
  const enterSpan = config.characterEnterDuration;
  // The incoming label starts before the outgoing one is done, which is what
  // makes the swap read as one motion instead of two.
  const enterOffset = exitSpan * 0.55;

  const exitEnd = Math.max(idleLength - 1, 0) * delay + exitSpan;
  const enterEnd =
    enterOffset + Math.max(activeLength - 1, 0) * delay + enterSpan;
  const total = Math.max(exitEnd, enterEnd, 1);

  return {
    delay: delay / total,
    exitSpan: exitSpan / total,
    enterSpan: enterSpan / total,
    enterOffset: enterOffset / total,
  };
};

const Character: React.FC<CharacterProps> = ({
  char,
  style,
  progress,
  colorProgress,
  start,
  end,
  mode,
  idleColor,
  activeColor,
  enterInitial,
  exitFinal,
}) => {
  const animatedStyle = useAnimatedStyle(() => {
    const local = interpolate(
      progress.value,
      [start, end],
      [0, 1],
      Extrapolation.CLAMP,
    );

    const color = interpolateColor(
      colorProgress.value,
      [0, 1],
      [idleColor, activeColor],
    );

    if (mode === "enter") {
      return {
        color,
        opacity: local,
        transform: [
          { translateY: enterInitial.translateY * (1 - local) },
          { scale: enterInitial.scale + (1 - enterInitial.scale) * local },
        ],
      };
    }

    return {
      color,
      opacity: 1 - local,
      transform: [
        { translateY: exitFinal.translateY * local },
        { scale: 1 + (exitFinal.scale - 1) * local },
      ],
    };
  });

  return (
    <Animated.Text allowFontScaling={false} style={[style, animatedStyle]}>
      {char}
    </Animated.Text>
  );
};

const LabelLayer: React.FC<LabelLayerProps> = ({
  text,
  style,
  progress,
  colorProgress,
  timeline,
  mode,
  idleColor,
  activeColor,
  enterInitial,
  exitFinal,
}) => {
  const characters = Array.from(text);

  return (
    <View style={styles.characterRow} pointerEvents="none">
      {characters.map((char, index) => {
        const start =
          mode === "enter"
            ? timeline.enterOffset + index * timeline.delay
            : index * timeline.delay;
        const span = mode === "enter" ? timeline.enterSpan : timeline.exitSpan;

        return (
          <Character
            key={`${char}-${index}`}
            char={char}
            style={style}
            progress={progress}
            colorProgress={colorProgress}
            start={start}
            end={start + span}
            mode={mode}
            idleColor={idleColor}
            activeColor={activeColor}
            enterInitial={enterInitial}
            exitFinal={exitFinal}
          />
        );
      })}
    </View>
  );
};

/**
 * One arc, one rotation, no track ring behind it — a second faint circle is
 * what makes a small spinner read as two overlapping loaders.
 */
const Spinner: React.FC<{
  readonly size: number;
  readonly strokeWidth: number;
  readonly color: string;
  readonly duration: number;
  readonly spinning: boolean;
  readonly arc: number;
}> = ({ size, strokeWidth, color, duration, spinning, arc }) => {
  const rotation = useSharedValue<number>(0);

  useEffect(() => {
    if (!spinning) return;

    // Resuming from the current angle instead of 0 keeps the arc from
    // snapping back when the button is toggled mid-spin.
    rotation.value = withRepeat(
      withTiming(rotation.value + 360, { duration, easing: Easing.linear }),
      -1,
      false,
    );

    return () => cancelAnimation(rotation);
  }, [spinning, duration, rotation]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  return (
    <Animated.View style={[{ width: size, height: size }, animatedStyle]}>
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={`${circumference * arc} ${circumference}`}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
    </Animated.View>
  );
};

const SpinButton: React.FC<SpinButtonProps> = ({
  idleText = "Save",
  activeText = "Saving",
  colors,
  animationConfig,
  spinnerConfig,
  buttonStyle,
  onPress,
  onStateChange,
  initialState = false,
  disabled = false,
  controlled = false,
  isActive,
}) => {
  const [internalState, setInternalState] = useState<boolean>(initialState);

  const isSaving = controlled ? (isActive ?? false) : internalState;

  const mergedColors = useMemo(
    () => mergeDeep(DEFAULT_BUTTON_COLORS, colors ?? {}),
    [colors],
  );
  const mergedAnimationConfig = useMemo(
    () => mergeDeep(DEFAULT_ANIMATION_CONFIG, animationConfig ?? {}),
    [animationConfig],
  );
  const mergedSpinnerConfig = useMemo(
    () => mergeDeep(DEFAULT_SPINNER_CONFIG, spinnerConfig ?? {}),
    [spinnerConfig],
  );
  const mergedButtonStyle = useMemo(
    () => mergeDeep(DEFAULT_BUTTON_STYLE, buttonStyle ?? {}),
    [buttonStyle],
  );

  const timeline = useMemo(
    () =>
      buildTimeline(
        Array.from(idleText).length,
        Array.from(activeText).length,
        mergedAnimationConfig,
      ),
    [idleText, activeText, mergedAnimationConfig],
  );

  const lineHeight = Math.round(mergedButtonStyle.fontSize * 1.35);

  const textStyle = useMemo(
    () => [
      {
        fontSize: mergedButtonStyle.fontSize,
        fontWeight: mergedButtonStyle.fontWeight,
        lineHeight,
      },
      styles.label,
    ],
    [mergedButtonStyle.fontSize, mergedButtonStyle.fontWeight, lineHeight],
  );

  // Both labels are measured off to the side, so the button can animate its
  // width between two known values instead of running a layout animation. The
  // measuring layer stays mounted, so a font or label change re-measures on
  // its own instead of leaving a stale width behind.
  const [idleWidth, setIdleWidth] = useState<number>(0);
  const [activeWidth, setActiveWidth] = useState<number>(0);

  const measureIdle = useCallback((event: LayoutChangeEvent): void => {
    const width = Math.ceil(event.nativeEvent.layout.width);
    setIdleWidth((current) => (current === width ? current : width));
  }, []);

  const measureActive = useCallback((event: LayoutChangeEvent): void => {
    const width = Math.ceil(event.nativeEvent.layout.width);
    setActiveWidth((current) => (current === width ? current : width));
  }, []);

  const measured = idleWidth > 0 && activeWidth > 0;

  // The spinner keeps rotating until its fade-out is done, so it never
  // freezes mid-frame while still on screen.
  const [spinnerActive, setSpinnerActive] = useState<boolean>(initialState);

  useEffect(() => {
    if (isSaving) {
      setSpinnerActive(true);
      return;
    }

    const timeout = setTimeout(
      () => setSpinnerActive(false),
      mergedAnimationConfig.spinnerExitDuration,
    );

    return () => clearTimeout(timeout);
  }, [isSaving, mergedAnimationConfig.spinnerExitDuration]);

  const progress = useSharedValue<number>(initialState ? 1 : 0);
  const colorProgress = useSharedValue<number>(initialState ? 1 : 0);
  const pressProgress = useSharedValue<number>(0);
  const spinnerProgress = useSharedValue<number>(initialState ? 1 : 0);

  const idleBackground = mergedColors.idle.background;
  const activeBackground = mergedColors.active.background;
  const idleTextColor = mergedColors.idle.text;
  const activeTextColor = mergedColors.active.text;

  // A single source of truth for the swap, so a controlled parent animates
  // exactly like an uncontrolled press does.
  useEffect(() => {
    progress.value = withSpring(isSaving ? 1 : 0, mergedAnimationConfig.spring);

    colorProgress.value = withTiming(isSaving ? 1 : 0, {
      duration: mergedAnimationConfig.colorTransitionDuration,
      easing: mergedAnimationConfig.timing.easing,
    });

    spinnerProgress.value = isSaving
      ? withSpring(1, {
          duration: mergedAnimationConfig.spinnerEnterDuration,
          dampingRatio: 0.62,
        })
      : withTiming(0, {
          duration: mergedAnimationConfig.spinnerExitDuration,
          easing: Easing.in(Easing.quad),
        });
  }, [
    isSaving,
    mergedAnimationConfig,
    progress,
    colorProgress,
    spinnerProgress,
  ]);

  const handlePressIn = useCallback((): void => {
    pressProgress.value = withTiming(1, {
      duration: mergedAnimationConfig.buttonPressDuration,
      easing: Easing.out(Easing.quad),
    });
  }, [mergedAnimationConfig, pressProgress]);

  const handlePressOut = useCallback((): void => {
    pressProgress.value = withSpring(0, {
      duration: mergedAnimationConfig.buttonReleaseDuration,
      dampingRatio: 0.6,
    });
  }, [mergedAnimationConfig, pressProgress]);

  const handlePress = useCallback((): void => {
    if (disabled) return;

    const newState = !isSaving;

    if (!controlled) {
      setInternalState(newState);
    }

    onPress?.(newState);
    onStateChange?.(newState);
  }, [disabled, isSaving, controlled, onPress, onStateChange]);

  const animatedButtonStyle = useAnimatedStyle(() => {
    const scale = interpolate(
      pressProgress.value,
      [0, 1],
      [BUTTON_SCALE.released, BUTTON_SCALE.pressed],
      Extrapolation.CLAMP,
    );

    return {
      transform: [{ scale }],
      backgroundColor: interpolateColor(
        colorProgress.value,
        [0, 1],
        [idleBackground, activeBackground],
      ),
    };
  });

  const animatedLabelStyle = useAnimatedStyle(() => ({
    width: interpolate(
      progress.value,
      [0, 1],
      [idleWidth, activeWidth],
      Extrapolation.CLAMP,
    ),
  }));

  const animatedSpinnerStyle = useAnimatedStyle(() => ({
    transform: [
      {
        scale: interpolate(
          spinnerProgress.value,
          [0, 1],
          [0.4, 1],
          Extrapolation.CLAMP,
        ),
      },
    ],
    opacity: interpolate(
      spinnerProgress.value,
      [0, 0.45, 1],
      [0, 1, 1],
      Extrapolation.CLAMP,
    ),
  }));

  return (
    <Pressable
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityState={{ disabled, busy: isSaving }}
      accessibilityLabel={isSaving ? activeText : idleText}
    >
      <Animated.View
        // The label layers spell the text out one character at a time, so the
        // whole visual tree is hidden from screen readers in favour of the
        // Pressable's own label.
        importantForAccessibility="no-hide-descendants"
        accessibilityElementsHidden
        style={[
          styles.button,
          {
            paddingHorizontal: mergedButtonStyle.paddingHorizontal,
            paddingVertical: mergedButtonStyle.paddingVertical,
            borderRadius: mergedButtonStyle.borderRadius,
            opacity: disabled ? 0.5 : 1,
          },
          animatedButtonStyle,
        ]}
      >
        {/* Measuring layer: laid out wide and invisible so each label reports
            its natural width, and never constrained by the animating button. */}
        <View style={styles.measureLayer} pointerEvents="none">
          <Text
            style={textStyle}
            numberOfLines={1}
            allowFontScaling={false}
            onLayout={measureIdle}
          >
            {idleText}
          </Text>
          <Text
            style={textStyle}
            numberOfLines={1}
            allowFontScaling={false}
            onLayout={measureActive}
          >
            {activeText}
          </Text>
        </View>

        <Animated.View
          style={[
            styles.labelWrapper,
            { height: lineHeight },
            // Before the measurement lands, the in-flow sizer owns the width.
            measured ? animatedLabelStyle : undefined,
          ]}
        >
          {!measured ? (
            <Text
              style={[textStyle, styles.sizer]}
              numberOfLines={1}
              allowFontScaling={false}
            >
              {isSaving ? activeText : idleText}
            </Text>
          ) : null}

          <LabelLayer
            text={idleText}
            style={textStyle}
            progress={progress}
            colorProgress={colorProgress}
            timeline={timeline}
            mode="exit"
            idleColor={idleTextColor}
            activeColor={activeTextColor}
            enterInitial={DEFAULT_CHARACTER_ENTER_INITIAL}
            exitFinal={DEFAULT_CHARACTER_EXIT_FINAL}
          />

          <LabelLayer
            text={activeText}
            style={textStyle}
            progress={progress}
            colorProgress={colorProgress}
            timeline={timeline}
            mode="enter"
            idleColor={idleTextColor}
            activeColor={activeTextColor}
            enterInitial={DEFAULT_CHARACTER_ENTER_INITIAL}
            exitFinal={DEFAULT_CHARACTER_EXIT_FINAL}
          />
        </Animated.View>

        <Animated.View
          pointerEvents="none"
          style={[
            styles.spinnerContainer,
            {
              right: mergedSpinnerConfig.position.right,
              bottom: mergedSpinnerConfig.position.bottom,
              width: mergedSpinnerConfig.containerSize,
              height: mergedSpinnerConfig.containerSize,
              backgroundColor: mergedSpinnerConfig.containerBackground,
            },
            animatedSpinnerStyle,
          ]}
        >
          <Spinner
            size={mergedSpinnerConfig.size}
            strokeWidth={mergedSpinnerConfig.strokeWidth}
            color={mergedSpinnerConfig.color}
            duration={mergedSpinnerConfig.duration}
            arc={mergedSpinnerConfig.arc}
            spinning={spinnerActive}
          />
        </Animated.View>
      </Animated.View>
    </Pressable>
  );
};

export default SpinButton;

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  labelWrapper: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  measureLayer: {
    position: "absolute",
    top: 0,
    left: 0,
    width: 1000,
    opacity: 0,
  },
  sizer: {
    opacity: 0,
  },
  characterRow: {
    position: "absolute",
    top: 0,
    bottom: 0,
    // Slack on both sides keeps characters from wrapping or being clipped
    // while the wrapper animates between two widths.
    left: -80,
    right: -80,
    flexDirection: "row",
    flexWrap: "nowrap",
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    textAlign: "center",
    includeFontPadding: false,
  },
  spinnerContainer: {
    position: "absolute",
    borderRadius: 99,
    justifyContent: "center",
    alignItems: "center",
  },
});
