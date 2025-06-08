import React, { forwardRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ViewStyle,
  TextStyle,
  StyleSheet,
  Pressable,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withRepeat,
  Easing,
} from "react-native-reanimated";

interface CardProps {
  children?: React.ReactNode;
  className?: string;
  style?: ViewStyle;
  variant?: "default" | "elevated" | "outlined" | "ghost";
  size?: "sm" | "md" | "lg" | "xl";
  interactive?: boolean;
  pressable?: boolean;
  disabled?: boolean;
  loading?: boolean;
  onPress?: () => void;
  onLongPress?: () => void;
  animationType?: "scale" | "fade" | "slide" | "bounce" | "none";
  animationDuration?: number;
  borderRadius?: number;
  shadow?: boolean;
  shadowIntensity?: "sm" | "md" | "lg" | "xl";
  backgroundColor?: string;
  borderColor?: string;
  borderWidth?: number;
}

interface CardHeaderProps {
  children?: React.ReactNode;
  style?: ViewStyle;
  spacing?: "sm" | "md" | "lg";
  align?: "left" | "center" | "right";
}

interface CardTitleProps {
  children: React.ReactNode;
  style?: TextStyle;
  size?: "sm" | "md" | "lg" | "xl";
  weight?: "normal" | "medium" | "semibold" | "bold";
  color?: string;
  numberOfLines?: number;
}

interface CardDescriptionProps {
  children: React.ReactNode;
  style?: TextStyle;
  size?: "xs" | "sm" | "md";
  color?: string;
  numberOfLines?: number;
}

interface CardContentProps {
  children?: React.ReactNode;
  style?: ViewStyle;
  spacing?: "sm" | "md" | "lg";
}

interface CardFooterProps {
  children?: React.ReactNode;
  style?: ViewStyle;
  spacing?: "sm" | "md" | "lg";
  justify?: "start" | "center" | "end" | "between" | "around";
}

const theme = {
  colors: {
    background: "#0a0a0a",
    card: "#1a1a1a",
    cardElevated: "#262626",
    cardOutlined: "#1a1a1a",
    cardGhost: "transparent",
    border: "#333333",
    borderLight: "#404040",
    text: "#ffffff",
    textMuted: "#a3a3a3",
    textSecondary: "#737373",
    primary: "#3b82f6",
    primaryForeground: "#ffffff",
    destructive: "#ef4444",
    destructiveForeground: "#ffffff",
  },
  spacing: {
    sm: 12,
    md: 16,
    lg: 20,
    xl: 24,
  },
  borderRadius: {
    sm: 6,
    md: 8,
    lg: 12,
    xl: 16,
  },
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    "2xl": 24,
  },
  fontWeight: {
    normal: "400",
    medium: "500",
    semibold: "600",
    bold: "700",
  },
  shadows: {
    sm: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
    },
    md: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 6,
      elevation: 3,
    },
    lg: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.15,
      shadowRadius: 15,
      elevation: 5,
    },
    xl: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 20 },
      shadowOpacity: 0.2,
      shadowRadius: 25,
      elevation: 8,
    },
  },
};

const AnimatedTouchableOpacity =
  Animated.createAnimatedComponent(TouchableOpacity);
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const Card = forwardRef<View, CardProps>(
  (
    {
      children,
      style,
      variant = "default",
      size = "md",
      interactive = false,
      pressable = false,
      disabled = false,
      loading = false,
      onPress,
      onLongPress,
      animationType = "scale",
      animationDuration = 150,
      borderRadius,
      shadow = true,
      shadowIntensity = "md",
      backgroundColor,
      borderColor,
      borderWidth,
      ...props
    },
    ref,
  ) => {
    const scale = useSharedValue(1);
    const opacity = useSharedValue(1);
    const translateY = useSharedValue(0);

    const getVariantStyles = () => {
      switch (variant) {
        case "elevated":
          return {
            backgroundColor: backgroundColor || theme.colors.cardElevated,
            ...theme.shadows[shadowIntensity],
          };
        case "outlined":
          return {
            backgroundColor: backgroundColor || theme.colors.cardOutlined,
            borderWidth: borderWidth || 1,
            borderColor: borderColor || theme.colors.border,
          };
        case "ghost":
          return {
            backgroundColor: backgroundColor || theme.colors.cardGhost,
            borderWidth: 0,
          };
        default:
          return {
            backgroundColor: backgroundColor || theme.colors.card,
            ...(shadow ? theme.shadows[shadowIntensity] : {}),
          };
      }
    };

    const getSizeStyles = () => {
      switch (size) {
        case "sm":
          return { padding: theme.spacing.sm };
        case "lg":
          return { padding: theme.spacing.lg };
        case "xl":
          return { padding: theme.spacing.xl };
        default:
          return { padding: theme.spacing.md };
      }
    };

    const animatedStyle = useAnimatedStyle(() => {
      const scaleValue = animationType === "scale" ? scale.value : 1;
      const opacityValue = animationType === "fade" ? opacity.value : 1;
      const translateYValue =
        animationType === "slide" || animationType === "bounce"
          ? translateY.value
          : 0;

      return {
        transform: [{ scale: scaleValue }, { translateY: translateYValue }],
        opacity: opacityValue,
      };
    });

    const handlePressIn = () => {
      if (disabled || loading) return;

      switch (animationType) {
        case "scale":
          scale.value = withSpring(0.95, { damping: 15, stiffness: 300 });
          break;
        case "fade":
          opacity.value = withTiming(0.7, { duration: animationDuration });
          break;
        case "slide":
          translateY.value = withSpring(2, { damping: 15, stiffness: 300 });
          break;
        case "bounce":
          scale.value = withSpring(0.98, { damping: 10, stiffness: 400 });
          translateY.value = withSpring(1, { damping: 10, stiffness: 400 });
          break;
      }
    };

    const handlePressOut = () => {
      if (disabled || loading) return;

      switch (animationType) {
        case "scale":
          scale.value = withSpring(1, { damping: 15, stiffness: 300 });
          break;
        case "fade":
          opacity.value = withTiming(1, { duration: animationDuration });
          break;
        case "slide":
          translateY.value = withSpring(0, { damping: 15, stiffness: 300 });
          break;
        case "bounce":
          scale.value = withSpring(1, { damping: 10, stiffness: 400 });
          translateY.value = withSpring(0, { damping: 10, stiffness: 400 });
          break;
      }
    };

    const cardStyles = [
      styles.card,
      getVariantStyles(),
      getSizeStyles(),
      {
        borderRadius: borderRadius || theme.borderRadius.lg,
        opacity: disabled ? 0.5 : 1,
      },
      style,
    ];

    if (pressable || onPress || onLongPress) {
      return (
        <AnimatedPressable
          ref={ref}
          style={[cardStyles, animatedStyle]}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          onPress={onPress}
          onLongPress={onLongPress}
          disabled={disabled || loading}
          {...props}
        >
          {loading && <LoadingOverlay />}
          {children}
        </AnimatedPressable>
      );
    }

    if (interactive) {
      return (
        <AnimatedTouchableOpacity
          ref={ref}
          style={[cardStyles, animatedStyle]}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          onPress={onPress}
          onLongPress={onLongPress}
          disabled={disabled || loading}
          activeOpacity={1}
          {...props}
        >
          {loading && <LoadingOverlay />}
          {children}
        </AnimatedTouchableOpacity>
      );
    }

    return (
      <Animated.View ref={ref} style={[cardStyles, animatedStyle]} {...props}>
        {loading && <LoadingOverlay />}
        {children}
      </Animated.View>
    );
  },
);

export const CardHeader: React.FC<CardHeaderProps> = ({
  children,
  style,
  spacing = "md",
  align = "left",
}) => {
  const spacingValue = theme.spacing[spacing];
  const alignItems =
    align === "center"
      ? "center"
      : align === "right"
        ? "flex-end"
        : "flex-start";

  return (
    <View
      style={[
        styles.cardHeader,
        { paddingBottom: spacingValue, alignItems },
        style,
      ]}
    >
      {children}
    </View>
  );
};

export const CardTitle: React.FC<CardTitleProps> = ({
  children,
  style,
  size = "lg",
  weight = "semibold",
  color,
  numberOfLines,
}) => {
  return (
    <Text
      style={[
        styles.cardTitle,
        {
          fontSize: theme.fontSize[size],
          fontWeight: theme.fontWeight[weight],
          color: color || theme.colors.text,
        } as any,
        style,
      ]}
      numberOfLines={numberOfLines}
    >
      {children}
    </Text>
  );
};

export const CardDescription: React.FC<CardDescriptionProps> = ({
  children,
  style,
  size = "sm",
  color,
  numberOfLines,
}) => {
  return (
    <Text
      style={[
        styles.cardDescription,
        {
          fontSize: theme.fontSize[size],
          color: color || theme.colors.textMuted,
        },
        style,
      ]}
      numberOfLines={numberOfLines}
    >
      {children}
    </Text>
  );
};

export const CardContent: React.FC<CardContentProps> = ({
  children,
  style,
  spacing = "md",
}) => {
  const spacingValue = theme.spacing[spacing];

  return (
    <View
      style={[styles.cardContent, { paddingVertical: spacingValue }, style]}
    >
      {children}
    </View>
  );
};

export const CardFooter: React.FC<CardFooterProps> = ({
  children,
  style,
  spacing = "md",
  justify = "start",
}) => {
  const spacingValue = theme.spacing[spacing];
  const justifyContent = {
    start: "flex-start",
    center: "center",
    end: "flex-end",
    between: "space-between",
    around: "space-around",
  }[justify] as any;

  return (
    <View
      style={[
        styles.cardFooter,
        {
          paddingTop: spacingValue,
          justifyContent,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
};

const LoadingOverlay: React.FC = () => {
  const rotation = useSharedValue(0);

  React.useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, {
        duration: 1000,
        easing: Easing.bezier(0.4, 0, 0.2, 1),
      }),
      -1,
      false,
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  return (
    <View style={styles.loadingOverlay}>
      <Animated.View style={[styles.spinner, animatedStyle]} />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: theme.borderRadius.lg,
    backgroundColor: theme.colors.card,
  },
  cardHeader: {
    marginBottom: 0,
  },
  cardTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme?.fontWeight?.semibold as any,
    color: theme?.colors?.text,
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textMuted,
    lineHeight: theme.fontSize.sm * 1.4,
  },
  cardContent: {
    flex: 1,
  },
  cardFooter: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 0,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: theme.borderRadius.lg,
  },
  spinner: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: theme.colors.primary,
    borderTopColor: "transparent",
  },
});
export { theme };
