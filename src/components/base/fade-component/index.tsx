import React, {
  createContext,
  forwardRef,
  memo,
  useCallback,
  useContext,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
} from "react";
import { StyleSheet, View, type ViewStyle } from "react-native";
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
  type WithSpringConfig,
} from "react-native-reanimated";

import { createCompoundComponent } from "@/utils/create-compound-component";
import type {
  IFadeComponent,
  IFadeContext,
  IFadeFromProps,
  IFadeHandle,
  IFadeToProps,
  TFadeComponents,
  TFadeState,
} from "./types";

const FadeContext = createContext<IFadeContext | null>(null);

const DEFAULT_DURATION = 1000;

const DEFAULT_SPRING: WithSpringConfig = {
  dampingRatio: 0.9,
};

const useFade = (component: TFadeComponents): IFadeContext => {
  const context = useContext<IFadeContext | null>(FadeContext);
  if (!context) {
    throw new Error(`${component} must be rendered inside <FadeComponent>.`);
  }
  return context;
};

const faceStyle = (
  visibility: number,
  hiddenOpacity: number,
  hiddenScale: number,
  blockHiddenTouches: boolean,
  pointerEvents: ViewStyle["pointerEvents"],
): ViewStyle => {
  "worklet";
  const opacity = hiddenOpacity + (1 - hiddenOpacity) * visibility;
  const scale = hiddenScale + (1 - hiddenScale) * visibility;

  return {
    opacity,
    transform: [{ scale }],
    pointerEvents:
      blockHiddenTouches && visibility < 0.5 ? "none" : pointerEvents,
  };
};

const FadeFrom: React.FC<IFadeFromProps> = ({
  children,
  style,
  hiddenOpacity = 0,
  hiddenScale = 1,
  pointerEvents = "auto",
  testID,
}: IFadeFromProps): React.ReactNode => {
  const { progress, blockHiddenTouches } = useFade("FadeComponent.From");

  const animatedStyle = useAnimatedStyle<ViewStyle>(() =>
    faceStyle(
      1 - progress.value,
      hiddenOpacity,
      hiddenScale,
      blockHiddenTouches,
      pointerEvents,
    ),
  );

  return (
    <Animated.View
      testID={testID}
      style={[StyleSheet.absoluteFill, style, animatedStyle]}
    >
      {children}
    </Animated.View>
  );
};

const FadeTo: React.FC<IFadeToProps> = ({
  children,
  style,
  hiddenOpacity = 0,
  hiddenScale = 1,
  pointerEvents = "auto",
  testID,
}: IFadeToProps): React.ReactNode => {
  const { progress, blockHiddenTouches } = useFade("FadeComponent.To");

  const animatedStyle = useAnimatedStyle<ViewStyle>(() =>
    faceStyle(
      progress.value,
      hiddenOpacity,
      hiddenScale,
      blockHiddenTouches,
      pointerEvents,
    ),
  );

  return (
    <Animated.View testID={testID} style={[style, animatedStyle]}>
      {children}
    </Animated.View>
  );
};

const FadeRoot = forwardRef<IFadeHandle, IFadeComponent>(
  (
    {
      children,
      duration = DEFAULT_DURATION,
      delay = 0,
      easing = Easing.inOut(Easing.ease),
      animation = "timing",
      springConfig,
      state,
      defaultState = "from",
      onChange,
      onAnimationEnd,
      disabled = false,
      style,
      blockHiddenTouches = true,
      testID,
    },
    ref,
  ): React.ReactNode => {
    const initial = state ?? defaultState;
    const progress = useSharedValue<number>(initial === "to" ? 1 : 0);
    const currentState = useRef<TFadeState>(initial);

    const handleEnd = useCallback(
      (next: TFadeState): void => {
        onAnimationEnd?.(next);
      },
      [onAnimationEnd],
    );

    const animateTo = useCallback(
      (next: TFadeState, animated: boolean = true): void => {
        if (disabled) return;

        const target = next === "to" ? 1 : 0;
        if (currentState.current !== next) {
          currentState.current = next;
          onChange?.(next);
        }

        const finish = (finished?: boolean): void => {
          "worklet";
          if (finished) runOnJS(handleEnd)(next);
        };

        if (!animated) {
          progress.value = target;
          handleEnd(next);
          return;
        }

        const animated$ =
          animation === "spring"
            ? withSpring<number>(
                target,
                { ...DEFAULT_SPRING, ...springConfig } as any,
                finish,
              )
            : withTiming<number>(target, { duration, easing }, finish);

        progress.value = delay > 0 ? withDelay(delay, animated$) : animated$;
      },
      [
        animation,
        delay,
        disabled,
        duration,
        easing,
        handleEnd,
        onChange,
        progress,
        springConfig,
      ],
    );

    useEffect((): void => {
      if (state === undefined) return;
      if (state === currentState.current) return;
      animateTo(state);
    }, [animateTo, state]);

    useImperativeHandle<IFadeHandle, IFadeHandle>(
      ref,
      (): IFadeHandle => ({
        toggle: (): void =>
          animateTo(currentState.current === "to" ? "from" : "to"),
        from: (): void => animateTo("from"),
        to: (): void => animateTo("to"),
        setState: (next: TFadeState, animated: boolean = true): void =>
          animateTo(next, animated),
        getState: (): TFadeState => currentState.current,
        progress,
      }),
      [animateTo, progress],
    );

    const context = useMemo<IFadeContext>(
      (): IFadeContext => ({ progress, blockHiddenTouches }),
      [blockHiddenTouches, progress],
    );

    return (
      <FadeContext.Provider value={context}>
        <View testID={testID} style={[styles.container, style]}>
          {children}
        </View>
      </FadeContext.Provider>
    );
  },
);

const From = createCompoundComponent("FadeComponent.From", memo(FadeFrom));
const To = createCompoundComponent("FadeComponent.To", memo(FadeTo));

const FadeComponent = createCompoundComponent("FadeComponent", memo(FadeRoot), {
  From,
  To,
});

const styles = StyleSheet.create({
  container: {},
});

export { FadeComponent, useFade };
