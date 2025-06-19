import React, { useState, useEffect } from "react";
import { View, Image, Text, Pressable, StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  interpolate,
  Easing,
  FadeIn,
  FadeOut,
  LinearTransition,
} from "react-native-reanimated";
import type { AvatarGroupProps } from "./Avatar.types";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const Avatar: React.FC<AvatarGroupProps> = ({
  image,
  size = 40,
  onPress,
  showBorder = true,
  borderColor = "#fff",
  borderWidth = 2,
  backgroundColor,
  textColor = "#fff",
  disabled = false,
  loading = false,
  showAvatar = true,
  showText = false,
  textPosition = "bottom",
  textStyle,
  shimmerSpeed = 1500,
  pressedScale = 0.95,
  pressedOpacity = 0.8,
  showOnlineIndicator = false,
  onlineIndicatorColor = "#4CAF50",
  onlineIndicatorSize,
}) => {
  const [hasError, setHasError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const shimmerProgress = useSharedValue(0);
  const pressScale = useSharedValue(1);
  const pressOpacity = useSharedValue(1);
  const fadeOpacity = useSharedValue(loading ? 0 : 1);

  useEffect(() => {
    if (loading) {
      shimmerProgress.value = withRepeat(
        withTiming(1, {
          duration: shimmerSpeed,
          easing: Easing.linear,
        }),
        -1,
        false,
      );
      fadeOpacity.value = 0;
    } else {
      shimmerProgress.value = 0;
      fadeOpacity.value = withTiming(1, {
        duration: 400,
        easing: Easing.out(Easing.quad),
      });
    }
  }, [loading, shimmerSpeed]);

  const getInitials = (name?: string): string => {
    if (!name) return "?";

    const words = name.trim().split(/\s+/);
    if (words.length === 1) {
      return words[0].charAt(0).toUpperCase();
    }

    return (
      words[0].charAt(0) + words[words.length - 1].charAt(0)
    ).toUpperCase();
  };

  const getBackgroundColor = (): string => {
    if (backgroundColor) return backgroundColor;

    if (image.name) {
      const colors = [
        "#FF6B6B",
        "#4ECDC4",
        "#45B7D1",
        "#96CEB4",
        "#FFEAA7",
        "#DDA0DD",
        "#98D8C8",
        "#F7DC6F",
        "#BB8FCE",
        "#85C1E9",
        "#FF8A80",
        "#82B1FF",
        "#B39DDB",
        "#A5D6A7",
        "#FFCC02",
      ];

      let hash = 0;
      for (let i = 0; i < image.name.length; i++) {
        hash = image.name.charCodeAt(i) + ((hash << 5) - hash);
      }

      return colors[Math.abs(hash) % colors.length];
    }

    return "#ccc";
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
    setHasError(false);
  };

  const handleImageError = () => {
    setHasError(true);
    setImageLoaded(false);
  };

  const handlePressIn = () => {
    if (!disabled && !loading) {
      pressScale.value = withTiming(pressedScale, { duration: 100 });
      pressOpacity.value = withTiming(pressedOpacity, { duration: 100 });
    }
  };

  const handlePressOut = () => {
    if (!disabled && !loading) {
      pressScale.value = withTiming(1, { duration: 100 });
      pressOpacity.value = withTiming(1, { duration: 100 });
    }
  };

  const handlePress = () => {
    if (!disabled && !loading && onPress) {
      onPress(image.name || image.uri);
    }
  };

  const shouldShowImage = image.uri && !loading && showAvatar;
  const avatarSize = { width: size, height: size, borderRadius: size / 2 };
  const fontSize = size <= 32 ? size * 0.4 : size * 0.35;
  const indicatorSize = onlineIndicatorSize || size * 0.25;

  const shimmerAnimatedStyle = useAnimatedStyle(() => {
    const translateX = interpolate(
      shimmerProgress.value,
      [0, 1],
      [-size * 1.5, size * 1.5],
    );
    const opacity = interpolate(
      shimmerProgress.value,
      [0, 0.5, 1],
      [0.3, 0.8, 0.3],
    );

    return {
      transform: [{ translateX }],
      opacity,
    };
  });

  const pressAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pressScale.value }],
    opacity: pressOpacity.value,
  }));

  const fadeAnimatedStyle = useAnimatedStyle(() => ({
    opacity: fadeOpacity.value,
  }));

  const ShimmerEffect = () => (
    <View style={[styles.shimmerContainer, avatarSize]}>
      <Animated.View
        style={[
          styles.shimmerOverlay,
          shimmerAnimatedStyle,
          {
            width: size * 0.6,
            height: size,
            left: -size * 0.3,
          },
        ]}
      />
    </View>
  );

  const AvatarContent = () => {
    if (loading) {
      return (
        <Animated.View layout={LinearTransition.springify()}>
          <View
            style={[
              styles.loadingContainer,
              avatarSize,
              { backgroundColor: getBackgroundColor() },
            ]}
          >
            <Text
              style={[
                styles.fallbackText,
                {
                  fontSize,
                  color: textColor,
                  opacity: 0.6,
                },
              ]}
              numberOfLines={1}
            >
              {getInitials(image.name)}
            </Text>
            <ShimmerEffect />
          </View>
        </Animated.View>
      );
    }

    if (shouldShowImage) {
      return (
        <Animated.View style={[styles.imageContainer, fadeAnimatedStyle]}>
          <Image
            source={{ uri: image.uri }}
            style={[
              styles.avatar,
              avatarSize,
              showBorder && {
                borderWidth,
                borderColor,
              },
            ]}
            onLoad={() => {
              console.log("Image loaded!");
              handleImageLoad();
            }}
            onError={(e) => {
              console.error("Image failed to load:", e.nativeEvent);
              handleImageError();
            }}
          />
          {showOnlineIndicator && (
            <Animated.View
              style={[
                styles.onlineIndicator,
                {
                  width: indicatorSize,
                  height: indicatorSize,
                  borderRadius: indicatorSize / 2,
                  backgroundColor: onlineIndicatorColor,
                  right: size * 0.05,
                  bottom: size * 0.05,
                },
              ]}
            />
          )}
        </Animated.View>
      );
    }

    return (
      <Animated.View style={[styles.fallbackContainer, fadeAnimatedStyle]}>
        <View
          style={[
            styles.fallback,
            avatarSize,
            { backgroundColor: getBackgroundColor() },
            showBorder && {
              borderWidth,
              borderColor,
            },
          ]}
        >
          <Text
            style={[
              styles.fallbackText,
              {
                fontSize,
                color: textColor,
              },
            ]}
            numberOfLines={1}
          >
            {getInitials(image.name)}
          </Text>
        </View>
        {showOnlineIndicator && (
          <View
            style={[
              styles.onlineIndicator,
              {
                width: indicatorSize,
                height: indicatorSize,
                borderRadius: indicatorSize / 2,
                backgroundColor: onlineIndicatorColor,
                right: size * 0.05,
                bottom: size * 0.05,
              },
            ]}
          />
        )}
      </Animated.View>
    );
  };

  const TextContent = () => {
    if (!showText || !image.name) return null;

    return (
      <Text
        style={[
          styles.nameText,
          textPosition === "right" && styles.nameTextRight,
          textPosition === "top" && styles.nameTextTop,
          { fontSize: size * 0.3 },
          textStyle,
        ]}
        numberOfLines={1}
      >
        {image.name}
      </Text>
    );
  };

  return (
    <View
      style={[
        styles.container,
        textPosition === "right" && styles.containerRow,
        textPosition === "top" && styles.containerColumn,
      ]}
    >
      {textPosition === "top" && <TextContent />}

      <AnimatedPressable
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled || loading}
        style={[
          styles.pressable,
          pressAnimatedStyle,
          disabled && styles.disabled,
        ]}
      >
        <AvatarContent />
      </AnimatedPressable>

      {textPosition === "right" && <TextContent />}
      {textPosition === "bottom" && <TextContent />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  containerRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  containerColumn: {
    flexDirection: "column",
  },
  pressable: {
    borderRadius: 50,
  },
  disabled: {
    opacity: 0.5,
  },
  imageContainer: {
    position: "relative",
  },
  avatar: {
    backgroundColor: "#f0f0f0",
  },
  fallbackContainer: {
    position: "relative",
  },
  fallback: {
    justifyContent: "center",
    alignItems: "center",
  },
  fallbackText: {
    fontWeight: "600",
    textAlign: "center",
  },
  loadingContainer: {
    position: "relative",
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },
  shimmerContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: "hidden",
  },
  shimmerOverlay: {
    position: "absolute",
    backgroundColor: "rgba(255, 255, 255, 0.6)",
    borderRadius: 4,
    transform: [{ rotate: "20deg" }],
  },
  onlineIndicator: {
    position: "absolute",
    borderWidth: 2,
    borderColor: "#fff",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
    elevation: 2,
  },
  nameText: {
    color: "#333",
    fontWeight: "500",
    textAlign: "center",
    marginVertical: 4,
  },
  nameTextRight: {
    marginLeft: 8,
    marginVertical: 0,
  },
  nameTextTop: {
    marginBottom: 6,
    marginVertical: 0,
  },
});
