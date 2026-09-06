// @ts-check
import React, {
  createContext,
  memo,
  useCallback,
  useContext,
  useEffect,
  useMemo,
} from "react";
import {
  Pressable,
  StyleSheet,
  Platform,
  View,
  type ViewStyle,
  ActivityIndicator,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
  Easing,
  interpolateColor,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import type {
  IButtonContent,
  IButtonContext,
  IButtonIndicator,
  IButtonLabel,
  IButtonLoading,
  IButtonRoot,
} from "./types";
import { createCompoundComponent } from "@/utils/create-compound-component";

const ButtonContext = createContext<IButtonContext | null>(null);

const useButton = (part: string): IButtonContext => {
  const context = useContext(ButtonContext);
  if (!context) {
    throw new Error(`Button.${part} must be rendered inside <Button.Root>.`);
  }
  return context;
};

const ButtonRoot: React.FC<IButtonRoot> & React.FunctionComponent<IButtonRoot> =
  ({
    children,
    isLoading = false,
    onPress,
    width = 200,
    height = 48,
    backgroundColor = "#fff",
    loadingBackgroundColor = "#cacaca",
    borderRadius,
    gradientColors,
    withPressAnimation = true,
    animationDuration = 250,
    disabled = false,
    accessibilityLabel,
    style,
  }: IButtonRoot): React.ReactNode &
    React.JSX.Element &
    React.ReactElement => {
    const progress = useSharedValue<number>(isLoading ? 1 : 0);
    const scaleValue = useSharedValue<number>(1);

    useEffect(() => {
      progress.value = withTiming<number>(isLoading ? 1 : 0, {
        duration: animationDuration,
        easing: Easing.bezier(0.4, 0, 0.2, 1),
      });
    }, [isLoading, animationDuration, progress]);

    const calculatedBorderRadius = borderRadius ?? height / 2;

    const context = useMemo<IButtonContext>(
      () => ({ progress, isLoading, disabled }),
      [progress, isLoading, disabled],
    );

    const surfaceStyle = useAnimatedStyle<
      Pick<ViewStyle, "transform" | "backgroundColor">
    >(() => ({
      transform: [{ scale: scaleValue.value }],
      backgroundColor: interpolateColor(
        progress.value,
        [0, 1],
        [backgroundColor, loadingBackgroundColor],
      ),
    }));

    const handlePressIn = useCallback(() => {
      if (withPressAnimation && !disabled && !isLoading) {
        scaleValue.value = withTiming(0.95, { duration: 100 });
      }
    }, [withPressAnimation, disabled, isLoading, scaleValue]);

    const handlePressOut = useCallback(() => {
      if (withPressAnimation && !disabled && !isLoading) {
        scaleValue.value = withTiming(1, { duration: 200 });
      }
    }, [withPressAnimation, disabled, isLoading, scaleValue]);

    const inner = <View style={styles.contentWrapper}>{children}</View>;

    const surface = gradientColors ? (
      <Animated.View style={[surfaceStyle]}>
        <LinearGradient
          colors={gradientColors as [string, string, ...string[]]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[
            styles.button,
            { width, height, borderRadius: calculatedBorderRadius },
            style,
          ]}
        >
          {inner}
        </LinearGradient>
      </Animated.View>
    ) : (
      <Animated.View
        style={[
          styles.button,
          { width, height, borderRadius: calculatedBorderRadius },
          surfaceStyle,
          style,
        ]}
      >
        {inner}
      </Animated.View>
    );

    return (
      <ButtonContext.Provider value={context}>
        <Pressable
          onPress={onPress}
          disabled={isLoading || disabled}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          style={({ pressed }) => [
            styles.pressable,
            Platform.OS === "ios" && pressed && styles.pressed,
          ]}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel={accessibilityLabel}
          accessibilityState={{ disabled: isLoading || disabled, busy: isLoading }}
        >
          {surface}
        </Pressable>
      </ButtonContext.Provider>
    );
  };

const ButtonContent: React.FC<IButtonContent> = ({
  children,
  style,
}: IButtonContent) => {
  const { progress } = useButton("Content");
  const animatedStyle = useAnimatedStyle<
    Pick<ViewStyle, "transform" | "opacity">
  >(() => ({
    transform: [{ translateY: interpolate(progress.value, [0, 1], [0, -20]) }],
    opacity: interpolate(progress.value, [0, 0.5], [1, 0]),
  }));
  return (
    <Animated.View style={[styles.layer, animatedStyle, style]}>
      {children}
    </Animated.View>
  );
};

const ButtonLoading: React.FC<IButtonLoading> = ({
  children,
  style,
}: IButtonLoading) => {
  const { progress } = useButton("Loading");
  const animatedStyle = useAnimatedStyle<
    Pick<ViewStyle, "transform" | "opacity">
  >(() => ({
    transform: [{ translateY: interpolate(progress.value, [0, 1], [20, 0]) }],
    opacity: interpolate(progress.value, [0.5, 1], [0, 1]),
  }));
  return (
    <Animated.View
      pointerEvents="none"
      style={[styles.layer, animatedStyle, style]}
    >
      {children}
    </Animated.View>
  );
};

const ButtonIndicator: React.FC<IButtonIndicator> = ({
  children,
  color = "#000",
  size = "small",
  style,
}: IButtonIndicator) => {
  useButton("Indicator");
  return (
    <View style={[styles.indicator, style]}>
      {children ?? <ActivityIndicator color={color} size={size} />}
    </View>
  );
};

const ButtonLabel: React.FC<IButtonLabel> = ({
  children,
  color = "white",
  size = 16,
  style,
}: IButtonLabel) => {
  useButton("Label");
  return (
    <Animated.Text style={[styles.label, { color, fontSize: size }, style]}>
      {children}
    </Animated.Text>
  );
};

const styles = StyleSheet.create({
  pressable: {
    alignSelf: "flex-start",
  },
  pressed: {
    opacity: 0.9,
  },
  button: {
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  contentWrapper: {
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
  },
  layer: {
    position: "absolute",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  indicator: {
    marginRight: 8,
  },
  label: {
    fontWeight: "600",
  },
});

const Root = createCompoundComponent("Button.Root", memo(ButtonRoot));
const Content = createCompoundComponent("Button.Content", memo(ButtonContent));
const Loading = createCompoundComponent("Button.Loading", memo(ButtonLoading));
const Indicator = createCompoundComponent(
  "Button.Indicator",
  memo(ButtonIndicator),
);
const Label = createCompoundComponent("Button.Label", memo(ButtonLabel));

const Button = createCompoundComponent("Button", Root, {
  Root,
  Content,
  Loading,
  Indicator,
  Label,
});

export { Button, Root, Content, Loading, Indicator, Label, useButton };
export default Button;
export type {
  IButtonRoot,
  IButtonContent,
  IButtonLoading,
  IButtonIndicator,
  IButtonLabel,
  IButtonContext,
} from "./types";
