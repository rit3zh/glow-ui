// @ts-check
import React, {
  createContext,
  memo,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  View,
  Text,
  StyleSheet,
  type LayoutChangeEvent,
  type TextStyle,
  type ViewStyle,
} from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedReaction,
  withSpring,
  interpolate,
  Extrapolation,
} from "react-native-reanimated";
import { decay } from "./helper";
import type {
  IElasticSliderAccessory,
  IElasticSliderContext,
  IElasticSliderFill,
  IElasticSliderRoot,
  IElasticSliderTrack,
  IElasticSliderValue,
  Region,
} from "./types";
import { SNAPBACK_SPRING, SPRING_CONFIG } from "./const";
import { scheduleOnRN } from "react-native-worklets";
import { createCompoundComponent } from "@/utils/create-compound-component";

const ElasticSliderContext = createContext<IElasticSliderContext | null>(null);

const useElasticSlider = (part: string): IElasticSliderContext => {
  const context = useContext(ElasticSliderContext);
  if (!context) {
    throw new Error(
      `ElasticSlider.${part} must be rendered inside <ElasticSlider.Root>.`,
    );
  }
  return context;
};

const ElasticSliderRoot: React.FC<IElasticSliderRoot> &
  React.FunctionComponent<IElasticSliderRoot> = ({
  children,
  value: controlledValue,
  defaultValue = 50,
  min = 0,
  max = 100,
  step = 1,
  isStepped = false,
  onValueChange,
  onDragStart,
  onDragEnd,
  style,
}: IElasticSliderRoot): React.JSX.Element &
  React.ReactNode &
  React.ReactElement => {
  const sliderWidth = useSharedValue<number>(0);
  const value = useSharedValue<number>(controlledValue ?? defaultValue);
  const overflow = useSharedValue<number>(0);
  const region = useSharedValue<Region>("middle");
  const scale = useSharedValue<number>(1);

  useEffect(() => {
    if (controlledValue != null) {
      value.value = controlledValue;
    }
  }, [controlledValue, value]);

  const updateValue = useCallback(
    (val: number) => {
      onValueChange?.(Math.round(val));
    },
    [onValueChange],
  );
  const handleDragStart = useCallback(() => {
    onDragStart?.();
  }, [onDragStart]);
  const handleDragEnd = useCallback(
    (finalValue: number) => {
      onDragEnd?.(Math.round(finalValue));
    },
    [onDragEnd],
  );

  const onTrackLayout = useCallback(
    (event: LayoutChangeEvent) => {
      sliderWidth.value = event.nativeEvent.layout.width;
    },
    [sliderWidth],
  );

  const gesture = useMemo(
    () =>
      Gesture.Pan()
        .minDistance(1)
        .onStart(() => {
          "worklet";
          scale.value = withSpring(1.2, SPRING_CONFIG);
          scheduleOnRN(handleDragStart);
        })
        .onUpdate((event) => {
          "worklet";
          const x = event.x;
          const width = sliderWidth.value;
          let newValue = min + (x / width) * (max - min);
          if (isStepped) {
            newValue = Math.round(newValue / step) * step;
          }
          newValue = Math.min(Math.max(newValue, min), max);
          value.value = newValue;
          if (x < 0) {
            region.value = "left";
            overflow.value = decay(-x);
          } else if (x > width) {
            region.value = "right";
            overflow.value = decay(x - width);
          } else {
            region.value = "middle";
            overflow.value = 0;
          }
          scheduleOnRN(updateValue, newValue);
        })
        .onEnd(() => {
          "worklet";
          overflow.value = withSpring<number>(0, SNAPBACK_SPRING);
          scale.value = withSpring<number>(1, SPRING_CONFIG);
          region.value = "middle";
          scheduleOnRN(handleDragEnd, value.value);
        }),
    [
      scale,
      sliderWidth,
      value,
      region,
      overflow,
      min,
      max,
      step,
      isStepped,
      handleDragStart,
      handleDragEnd,
      updateValue,
    ],
  );

  const context = useMemo<IElasticSliderContext>(
    () => ({
      value,
      overflow,
      region,
      scale,
      sliderWidth,
      min,
      max,
      step,
      isStepped,
      gesture,
      onTrackLayout,
    }),
    [
      value,
      overflow,
      region,
      scale,
      sliderWidth,
      min,
      max,
      step,
      isStepped,
      gesture,
      onTrackLayout,
    ],
  );

  const containerStyle = useAnimatedStyle<
    Pick<ViewStyle, "transform" | "opacity">
  >(() => ({
    transform: [{ scale: scale.value }],
    opacity: interpolate(scale.value, [1, 1.2], [0.7, 1]),
  }));

  return (
    <ElasticSliderContext.Provider value={context}>
      <View style={[styles.wrapper, style]}>
        <Animated.View style={[styles.container, containerStyle]}>
          {children ?? (
            <>
              <ElasticSliderLeading />
              <ElasticSliderTrack>
                <ElasticSliderFill />
              </ElasticSliderTrack>
              <ElasticSliderTrailing />
            </>
          )}
        </Animated.View>
      </View>
    </ElasticSliderContext.Provider>
  );
};

const ElasticSliderLeading: React.FC<IElasticSliderAccessory> = ({
  children,
  style,
}: IElasticSliderAccessory) => {
  const { region, overflow, scale } = useElasticSlider("Leading");
  const animatedStyle = useAnimatedStyle<Pick<ViewStyle, "transform">>(() => {
    const isLeft = region.value === "left";
    return {
      transform: [
        { translateX: isLeft ? -overflow.value / scale.value : 0 },
        { scale: withSpring(isLeft ? 1.4 : 1, SPRING_CONFIG) },
      ],
    };
  });
  return (
    <Animated.View style={[styles.iconContainer, animatedStyle, style]}>
      {children ?? <Text style={styles.iconText}>−</Text>}
    </Animated.View>
  );
};

const ElasticSliderTrailing: React.FC<IElasticSliderAccessory> = ({
  children,
  style,
}: IElasticSliderAccessory) => {
  const { region, overflow, scale } = useElasticSlider("Trailing");
  const animatedStyle = useAnimatedStyle<Pick<ViewStyle, "transform">>(() => {
    const isRight = region.value === "right";
    return {
      transform: [
        { translateX: isRight ? overflow.value / scale.value : 0 },
        { scale: withSpring(isRight ? 1.4 : 1, SPRING_CONFIG) },
      ],
    };
  });
  return (
    <Animated.View style={[styles.iconContainer, animatedStyle, style]}>
      {children ?? <Text style={styles.iconText}>+</Text>}
    </Animated.View>
  );
};

const ElasticSliderTrack: React.FC<IElasticSliderTrack> = ({
  children,
  color = "#9CA3AF",
  style,
}: IElasticSliderTrack) => {
  const { gesture, onTrackLayout, sliderWidth, overflow, region, scale } =
    useElasticSlider("Track");
  const trackStyle = useAnimatedStyle<Pick<ViewStyle, "transform" | "height">>(
    () => {
      const width = sliderWidth.value || 1;
      const scaleX = 1 + overflow.value / width;
      const scaleY = interpolate(
        overflow.value,
        [0, 80],
        [1, 0.8],
        Extrapolation.CLAMP,
      );
      const height = interpolate(scale.value, [1, 1.2], [6, 12]);
      const expansion = width * (scaleX - 1);
      let translateX = 0;
      if (region.value === "left") {
        translateX = -expansion / 4;
      } else if (region.value === "right") {
        translateX = expansion / 4;
      }
      return {
        transform: [{ translateX }, { scaleX }, { scaleY }],
        height,
      };
    },
  );
  return (
    <GestureDetector gesture={gesture}>
      <View style={styles.sliderContainer} onLayout={onTrackLayout}>
        <Animated.View style={[styles.track, trackStyle, style]}>
          <View style={[styles.trackBg, { backgroundColor: color }]}>
            {children}
          </View>
        </Animated.View>
      </View>
    </GestureDetector>
  );
};

const ElasticSliderFill: React.FC<IElasticSliderFill> = ({
  color = "#6B7280",
  style,
}: IElasticSliderFill) => {
  const { value, min, max } = useElasticSlider("Fill");
  const fillStyle = useAnimatedStyle<Pick<ViewStyle, "width">>(() => {
    const totalRange = max - min;
    const percentage =
      totalRange === 0 ? 0 : ((value.value - min) / totalRange) * 100;
    return { width: `${percentage}%` };
  });
  return (
    <Animated.View
      style={[styles.trackFill, { backgroundColor: color }, fillStyle, style]}
    />
  );
};

const ElasticSliderValue: React.FC<IElasticSliderValue> = ({
  format,
  style,
}: IElasticSliderValue) => {
  const { value } = useElasticSlider("Value");
  const [displayed, setDisplayed] = useState<number>(() =>
    Math.round(value.value),
  );
  useAnimatedReaction(
    () => Math.round(value.value),
    (current, previous) => {
      if (current !== previous) {
        scheduleOnRN(setDisplayed, current);
      }
    },
    [],
  );
  return (
    <Text style={[styles.valueText, style]}>
      {format ? format(displayed) : String(displayed)}
    </Text>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
    width: 192,
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
    width: "100%",
  },
  iconContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  iconText: {
    fontSize: 18,
    color: "#6B7280",
    fontWeight: "500",
  },
  sliderContainer: {
    flex: 1,
    height: 44,
    justifyContent: "center",
  },
  track: {
    width: "100%",
    borderRadius: 100,
    overflow: "hidden",
  },
  trackBg: {
    width: "100%",
    height: "100%",
    borderRadius: 100,
    overflow: "hidden",
  },
  trackFill: {
    height: "100%",
    borderRadius: 100,
  },
  valueText: {
    fontSize: 12,
    color: "#9CA3AF",
    fontWeight: "500",
    letterSpacing: 0.5,
  },
});

const Root = createCompoundComponent(
  "ElasticSlider.Root",
  memo(ElasticSliderRoot),
);
const Leading = createCompoundComponent(
  "ElasticSlider.Leading",
  memo(ElasticSliderLeading),
);
const Trailing = createCompoundComponent(
  "ElasticSlider.Trailing",
  memo(ElasticSliderTrailing),
);
const Track = createCompoundComponent(
  "ElasticSlider.Track",
  memo(ElasticSliderTrack),
);
const Fill = createCompoundComponent(
  "ElasticSlider.Fill",
  memo(ElasticSliderFill),
);
const Value = createCompoundComponent(
  "ElasticSlider.Value",
  memo(ElasticSliderValue),
);

const ElasticSlider = createCompoundComponent("ElasticSlider", Root, {
  Root,
  Leading,
  Trailing,
  Track,
  Fill,
  Value,
});

export {
  ElasticSlider,
  Root,
  Leading,
  Trailing,
  Track,
  Fill,
  Value,
  useElasticSlider,
};
export default ElasticSlider;
export type {
  IElasticSliderRoot,
  IElasticSliderTrack,
  IElasticSliderFill,
  IElasticSliderAccessory,
  IElasticSliderValue,
  IElasticSliderContext,
  Region,
} from "./types";
