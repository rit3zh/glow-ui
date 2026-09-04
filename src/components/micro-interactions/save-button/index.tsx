// @ts-check
import React, {
  Children,
  isValidElement,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { Pressable, StyleSheet, Text, View, ViewStyle } from "react-native";
import { Feather } from "@expo/vector-icons";
import Animated, {
  cancelAnimation,
  Easing,
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSpring,
  withTiming,
} from "react-native-reanimated";

import {
  CHECK_SHIFT,
  CIRCLE,
  COLORS,
  DEFAULT_MIN_LOADING,
  DEFAULT_SUCCESS_PAUSE,
  DONE_CHECK,
  HEIGHT,
  PILL_WIDTH,
  SAVED_SHIFT,
  SAVED_WIDTH,
  SPINNER_SIZE,
  SPRING,
  SPRING_POP,
  SUCCESS_BADGE,
} from "./const";
import type { ISaveButtonRoot, ISaveButtonSlot, TSavePhase } from "./types";
import { createCompoundComponent } from "@/utils/create-compound-component";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const SaveButtonLabel = (_: ISaveButtonSlot): null => null;
const SaveButtonSaved = (_: ISaveButtonSlot): null => null;
(SaveButtonLabel as { role?: string }).role = "label";
(SaveButtonSaved as { role?: string }).role = "saved";

const SaveButtonRoot: React.FC<ISaveButtonRoot> &
  React.FunctionComponent<ISaveButtonRoot> = ({
  children,
  onSave,
  onSaved,
  minLoading = DEFAULT_MIN_LOADING,
  successPause = DEFAULT_SUCCESS_PAUSE,
  resetAfter,
  disabled = false,
  colors,
  style,
}: ISaveButtonRoot): React.JSX.Element &
  React.ReactNode &
  React.ReactElement => {
  const c = useMemo(() => ({ ...COLORS, ...colors }), [colors]);

  const [phase, setPhase] = useState<TSavePhase>("idle");
  const phaseRef = useRef<TSavePhase>("idle");
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const { labelText, savedText, labelSlotStyle, savedSlotStyle } =
    useMemo(() => {
      let label: ReactNode = "Save";
      let saved: ReactNode = "Saved";
      let labelStyleProp: ISaveButtonSlot["style"];
      let savedStyleProp: ISaveButtonSlot["style"];
      Children.forEach(children, (child) => {
        if (!isValidElement(child)) return;
        const role = (child.type as { role?: string })?.role;
        const props = child.props as ISaveButtonSlot;
        if (role === "label") {
          label = props.children;
          labelStyleProp = props.style;
        } else if (role === "saved") {
          saved = props.children;
          savedStyleProp = props.style;
        }
      });
      return {
        labelText: label,
        savedText: saved,
        labelSlotStyle: labelStyleProp,
        savedSlotStyle: savedStyleProp,
      };
    }, [children]);
  const progress = useSharedValue<number>(0);
  const w = useSharedValue<number>(PILL_WIDTH);
  const bg = useSharedValue<number>(0);
  const border = useSharedValue<number>(0);
  const labelP = useSharedValue<number>(1);
  const spinP = useSharedValue<number>(0);
  const spin = useSharedValue<number>(0);
  const checkP = useSharedValue<number>(0);
  const morphP = useSharedValue<number>(0);
  const checkX = useSharedValue<number>(0);
  const savedP = useSharedValue<number>(0);

  const setPhaseBoth = useCallback((p: TSavePhase) => {
    phaseRef.current = p;
    setPhase(p);
  }, []);

  const runReset = useCallback(() => {
    setPhaseBoth("idle");
    savedP.value = withTiming(0, { duration: 160 });
    morphP.value = withTiming(0, { duration: 160 });
    checkX.value = withTiming(0, { duration: 200 });
    border.value = withTiming(0, { duration: 180 });
    bg.value = withTiming(0, { duration: 220 });
    checkP.value = withTiming(0, { duration: 150 });
    spinP.value = 0;
    w.value = withSpring(PILL_WIDTH, SPRING);
    labelP.value = withDelay(140, withTiming(1, { duration: 220 }));
  }, [
    savedP,
    morphP,
    checkX,
    border,
    bg,
    checkP,
    spinP,
    w,
    labelP,
    setPhaseBoth,
  ]);

  const runDone = useCallback(() => {
    setPhaseBoth("done");
    w.value = withSpring(SAVED_WIDTH, SPRING);
    bg.value = withTiming(0, { duration: 300 });
    border.value = withDelay(120, withTiming(1, { duration: 260 }));

    checkX.value = withSpring(CHECK_SHIFT, SPRING);
    checkP.value = withTiming(0, { duration: 220 });
    morphP.value = withDelay(10, withTiming(1, { duration: 220 }));

    savedP.value = withDelay(20, withTiming(1, { duration: 280 }));

    onSaved?.();
    if (resetAfter != null) {
      timers.current.push(setTimeout(runReset, resetAfter));
    }
  }, [
    w,
    bg,
    border,
    checkX,
    checkP,
    morphP,
    savedP,
    onSaved,
    resetAfter,
    runReset,
    setPhaseBoth,
  ]);

  const runSuccess = useCallback(() => {
    setPhaseBoth("success");
    spinP.value = withTiming(0, { duration: 180 });
    cancelAnimation(spin);
    checkP.value = withDelay(160, withSpring(1, SPRING_POP));
    timers.current.push(setTimeout(runDone, successPause));
  }, [spinP, spin, checkP, successPause, runDone, setPhaseBoth]);

  const runLoading = useCallback(() => {
    setPhaseBoth("loading");
    w.value = withSpring(CIRCLE, SPRING);
    bg.value = withTiming(1, { duration: 280 });
    labelP.value = withDelay(60, withTiming(0, { duration: 200 }));
    spinP.value = withDelay(260, withTiming(1, { duration: 200 }));
    spin.value = 0;
    spin.value = withRepeat(
      withTiming(360, { duration: 750, easing: Easing.linear }),
      -1,
      false,
    );
  }, [w, bg, labelP, spinP, spin, setPhaseBoth]);

  const handlePress = useCallback(async () => {
    if (disabled || phaseRef.current !== "idle") return;
    runLoading();
    const started = Date.now();
    try {
      await onSave?.();
    } catch {}
    const wait = Math.max(0, minLoading - (Date.now() - started));
    timers.current.push(setTimeout(runSuccess, wait));
  }, [disabled, runLoading, onSave, minLoading, runSuccess]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const containerStyle = useAnimatedStyle<
    Pick<ViewStyle, "width" | "backgroundColor" | "borderWidth">
  >(() => ({
    width: w.value,
    backgroundColor: interpolateColor(bg.value, [0, 1], [c.lightBg, c.darkBg]),
    borderWidth: interpolate(border.value, [0, 1], [0, 1.5]),
  }));

  const labelStyle = useAnimatedStyle<Pick<ViewStyle, "opacity" | "transform">>(
    () => ({
      opacity: labelP.value,
      transform: [
        {
          translateY: interpolate(
            labelP.value,
            [0, 1],
            [-SAVED_SHIFT * 0.4, 0],
          ),
        },
        {
          scale: interpolate(labelP.value, [0, 1], [0.5, 1]),
        },
      ],
    }),
  );

  const spinnerStyle = useAnimatedStyle(() => ({
    opacity: spinP.value,
    transform: [{ rotate: `${spin.value}deg` }],
  }));

  const badgeStyle = useAnimatedStyle(() => ({
    opacity: checkP.value,
    transform: [
      { translateX: checkX.value },
      { scale: interpolate(checkP.value, [0, 1], [0.5, 1]) },
    ],
  }));

  const doneCheckStyle = useAnimatedStyle(() => ({
    opacity: morphP.value,
    transform: [
      { translateX: checkX.value },
      { scale: interpolate(morphP.value, [0, 1], [0.7, 1]) },
    ],
  }));

  const savedTextStyle = useAnimatedStyle(() => ({
    opacity: savedP.value,
    transform: [
      {
        translateX: interpolate(
          savedP.value,
          [0, 1],
          [-SAVED_SHIFT * 0.5, SAVED_SHIFT],
        ),
      },
    ],
  }));

  const busy = phase !== "idle";
  const animatedPressableStylez = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: interpolate(progress.value, [0, 1], [1, 1.1]),
        },
      ],
    };
  }, []);
  const handlePressIn = useCallback(() => {
    progress.value = withSpring(1, SPRING_POP);
  }, []);
  const handlePressOut = useCallback(() => {
    progress.value = withSpring(0, SPRING_POP);
  }, []);

  return (
    <AnimatedPressable
      onPress={handlePress}
      onPressIn={handlePressIn}
      style={[animatedPressableStylez]}
      onPressOut={handlePressOut}
      disabled={disabled || busy}
      accessibilityRole="button"
      accessibilityState={{ busy, disabled }}
      accessibilityLabel={phase === "done" ? "Saved" : "Save"}
    >
      <Animated.View
        style={[
          styles.container,
          { borderColor: c.border },
          containerStyle,
          style,
        ]}
      >
        <Animated.View pointerEvents="none" style={[styles.layer, labelStyle]}>
          <Text
            style={[styles.label, { color: c.label }, labelSlotStyle]}
            numberOfLines={1}
          >
            {labelText}
          </Text>
        </Animated.View>

        <Animated.View
          pointerEvents="none"
          style={[styles.layer, spinnerStyle]}
        >
          <View
            style={[
              styles.spinner,
              { borderColor: c.spinnerTrack, borderTopColor: c.spinnerHead },
            ]}
          />
        </Animated.View>

        <Animated.View pointerEvents="none" style={[styles.layer, badgeStyle]}>
          <View
            style={[styles.successBadge, { backgroundColor: c.successBadge }]}
          >
            <Feather name="check" size={16} color={c.successCheck} />
          </View>
        </Animated.View>

        <Animated.View
          pointerEvents="none"
          style={[styles.layer, doneCheckStyle]}
        >
          <View style={[styles.doneCheck, { backgroundColor: c.doneCheckBg }]}>
            <Feather name="check" size={16} color={c.doneCheckMark} />
          </View>
        </Animated.View>

        <Animated.View
          pointerEvents="none"
          style={[styles.layer, savedTextStyle]}
        >
          <Text
            style={[styles.saved, { color: c.savedLabel }, savedSlotStyle]}
            numberOfLines={1}
          >
            {savedText}
          </Text>
        </Animated.View>
      </Animated.View>
    </AnimatedPressable>
  );
};

const styles = StyleSheet.create({
  container: {
    height: HEIGHT,
    borderRadius: HEIGHT / 2,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  layer: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    fontSize: 18,
    fontWeight: "500",
  },
  spinner: {
    width: SPINNER_SIZE,
    height: SPINNER_SIZE,
    borderRadius: SPINNER_SIZE / 2,
    borderWidth: 3,
  },
  successBadge: {
    width: SUCCESS_BADGE,
    height: SUCCESS_BADGE,
    borderRadius: SUCCESS_BADGE / 2,
    alignItems: "center",
    justifyContent: "center",
  },
  doneCheck: {
    width: DONE_CHECK,
    height: DONE_CHECK,
    borderRadius: DONE_CHECK / 2,
    alignItems: "center",
    justifyContent: "center",
  },
  saved: {
    fontSize: 17,
    fontWeight: "500",
  },
});
const Root = createCompoundComponent("Root", SaveButtonRoot);
const Label = createCompoundComponent("Label", SaveButtonLabel);
const Saved = createCompoundComponent("Saved", SaveButtonSaved);
const SaveButton = Object.assign(SaveButtonRoot, {
  Root: SaveButtonRoot,
  Label: SaveButtonLabel,
  Saved: SaveButtonSaved,
});
export {
  SaveButton,
  SaveButtonRoot,
  SaveButtonLabel,
  SaveButtonSaved,
  Root,
  Label,
  Saved,
};
export default SaveButton;
export type { ISaveButtonRoot, ISaveButtonSlot, TSavePhase } from "./types";
