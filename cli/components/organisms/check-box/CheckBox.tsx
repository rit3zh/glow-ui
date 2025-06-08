import React, { useEffect } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
  StyleProp,
  View,
  Text,
  TextStyle,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolateColor,
  Easing,
  withSequence,
  withSpring,
  interpolate,
  Extrapolate,
  Extrapolation,
} from "react-native-reanimated";
import { Path, Svg } from "react-native-svg";

interface AnimatedCheckboxProps {
  /** Whether the checkbox is checked */
  checked: boolean;
  /** Function called when checkbox is pressed */
  onPress: (checked: boolean) => void;
  /** Size of the checkbox (width and height) */
  size?: number;
  /** Border radius of the checkbox */
  borderRadius?: number;
  /** Color when checkbox is checked */
  activeColor?: string;
  /** Color when checkbox is unchecked */
  inactiveColor?: string;
  /** Border color when checkbox is unchecked */
  borderColor?: string;
  /** Border width */
  borderWidth?: number;
  /** Check mark color */
  checkMarkColor?: string;
  /** Animation duration in milliseconds */
  animationDuration?: number;
  /** Label to display next to checkbox */
  label?: string;
  /** Position of the label relative to checkbox */
  labelPosition?: "left" | "right";
  /** Additional styling for the container */
  containerStyle?: StyleProp<ViewStyle>;
  /** Additional styling for the checkbox */
  checkboxStyle?: StyleProp<ViewStyle>;
  /** Style for the label text */
  labelStyle?: StyleProp<TextStyle>;
  /** Whether checkbox is disabled */
  disabled?: boolean;
  /** Whether to use bounce animation */
  bounceEffect?: boolean;
  /** Whether to use ripple effect when pressing */
  rippleEffect?: boolean;
}

export const AnimatedCheckbox: React.FC<AnimatedCheckboxProps> = ({
  checked,
  onPress,
  size = 24,
  borderRadius,
  activeColor = "#2196F3",
  inactiveColor = "transparent",
  borderColor = "#757575",
  borderWidth = 2,
  checkMarkColor = "white",
  animationDuration = 300,
  label,
  labelPosition = "right",
  containerStyle,
  checkboxStyle,
  labelStyle,
  disabled = false,
  bounceEffect = true,
  rippleEffect = true,
}) => {
  const progress = useSharedValue(checked ? 1 : 0);
  const scale = useSharedValue(1);
  const rippleOpacity = useSharedValue(0);
  const rippleScale = useSharedValue(0);

  useEffect(() => {
    progress.value = withTiming(checked ? 1 : 0, {
      duration: animationDuration,
      easing: Easing.bezier(0.16, 1, 0.3, 1),
    });

    if (checked && bounceEffect) {
      scale.value = withSequence(
        withTiming(0.8, { duration: animationDuration / 2 }),
        withSpring(1, {
          mass: 1,
          stiffness: 500,
          damping: 15,
        }),
      );
    }
  }, [checked, animationDuration, progress, scale, bounceEffect]);

  const handlePress = () => {
    if (disabled) return;

    onPress(!checked);

    if (rippleEffect) {
      rippleOpacity.value = withSequence(
        withTiming(0.3, { duration: 100 }),
        withTiming(0, { duration: 300 }),
      );

      rippleScale.value = withSequence(
        withTiming(0, { duration: 0 }),
        withTiming(1, { duration: 400 }),
      );
    }
  };

  const animatedBoxStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: interpolateColor(
        progress.value,
        [0, 1],
        [inactiveColor, activeColor],
      ),
      borderColor: interpolateColor(
        progress.value,
        [0, 1],
        [borderColor, activeColor],
      ),
      transform: [{ scale: scale.value }],
    };
  });

  const animatedCheckStyle = useAnimatedStyle(() => {
    return {
      opacity: progress.value,
      transform: [
        {
          scale: interpolate(
            progress.value,
            [0, 0.5, 1],
            [0, 1.2, 1],
            Extrapolation.CLAMP,
          ),
        },
      ],
    };
  });

  const animatedRippleStyle = useAnimatedStyle(() => {
    return {
      opacity: rippleOpacity.value,
      transform: [{ scale: rippleScale.value }],
    };
  });

  const actualBorderRadius =
    borderRadius !== undefined ? borderRadius : size / 4;

  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.8}
      disabled={disabled}
      style={[
        styles.container,
        labelPosition === "left" ? styles.rowReverse : styles.row,
        { opacity: disabled ? 0.6 : 1 },
        containerStyle,
      ]}
    >
      <View style={{ position: "relative" }}>
        <Animated.View
          style={[
            styles.checkbox,
            {
              width: size,
              height: size,
              borderRadius: actualBorderRadius,
              borderWidth,
            },
            animatedBoxStyle,
            checkboxStyle,
          ]}
        />

        {rippleEffect && (
          <Animated.View
            style={[
              styles.ripple,
              {
                width: size * 2.5,
                height: size * 2.5,
                borderRadius: size * 2.5,
                top: -size * 0.75,
                left: -size * 0.75,
              },
              animatedRippleStyle,
            ]}
          />
        )}

        <Animated.View
          style={[
            styles.checkMarkContainer,
            {
              width: size,
              height: size,
            },
            animatedCheckStyle,
          ]}
        >
          <Svg width={size * 0.6} height={size * 0.4} viewBox="0 0 18 13">
            <Path
              d="M1 5.5L6 11L17 1"
              stroke={checkMarkColor}
              strokeWidth={2.5}
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </Svg>
        </Animated.View>
      </View>

      {label && (
        <Text
          style={[
            styles.label,
            {
              marginLeft: labelPosition === "right" ? 10 : 0,
              marginRight: labelPosition === "left" ? 10 : 0,
            },
            labelStyle,
          ]}
        >
          {label}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  row: {
    flexDirection: "row",
  },
  rowReverse: {
    flexDirection: "row-reverse",
  },
  checkbox: {
    justifyContent: "center",
    alignItems: "center",
    borderStyle: "solid",
  },
  ripple: {
    position: "absolute",
    backgroundColor: "#000",
    zIndex: -1,
  },
  checkMarkContainer: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
  },
  label: {
    fontSize: 16,
  },
});
