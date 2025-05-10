import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Modal,
  TouchableWithoutFeedback,
  Animated,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Text,
  ViewStyle,
  LayoutChangeEvent,
  LayoutRectangle,
  Platform,
} from "react-native";
import { BlurView } from "expo-blur"; // Make sure to install: expo install expo-blur

type Position = "top" | "bottom" | "left" | "right";

interface PopoverProps {
  children: React.ReactNode;
  content: React.ReactNode;
  isVisible: boolean;
  onClose: () => void;
  position?: Position;
  backgroundColor?: string;
  borderRadius?: number;
  shadow?: boolean;
  containerStyle?: ViewStyle;
  contentStyle?: ViewStyle;
  animationDuration?: number;
  highlightTrigger?: boolean;
  overlayColor?: string;
  blurIntensity?: number;
  useBlur?: boolean;
}

interface LayoutPosition {
  x: number;
  y: number;
  width: number;
  height: number;
}

const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);

const Popover: React.FC<PopoverProps> = ({
  children,
  content,
  isVisible,
  onClose,
  position = "bottom",
  backgroundColor = "white",
  borderRadius = 12,
  shadow = true,
  containerStyle = {},
  contentStyle = {},
  animationDuration = 300,
  highlightTrigger = true,
  overlayColor = "rgba(0, 0, 0, 0.5)",
  blurIntensity = 50,
  useBlur = Platform.OS === "ios", // Default to use blur on iOS
}) => {
  const [popoverLayout, setPopoverLayout] = useState<LayoutRectangle | null>(
    null
  );
  const [anchorLayout, setAnchorLayout] = useState<LayoutPosition | null>(null);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const anchorRef = useRef<View>(null);

  // Animation for trigger highlight effect
  const triggerHighlightAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (isVisible) {
      setModalVisible(true);
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: animationDuration,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: animationDuration,
          useNativeDriver: true,
        }),
        // Highlight trigger animation
        ...(highlightTrigger
          ? [
              Animated.timing(triggerHighlightAnim, {
                toValue: 1.05, // Slight scale up
                duration: animationDuration,
                useNativeDriver: true,
              }),
            ]
          : []),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: animationDuration,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.8,
          duration: animationDuration,
          useNativeDriver: true,
        }),
        // Reset trigger highlight
        ...(highlightTrigger
          ? [
              Animated.timing(triggerHighlightAnim, {
                toValue: 1,
                duration: animationDuration,
                useNativeDriver: true,
              }),
            ]
          : []),
      ]).start(() => {
        setModalVisible(false);
      });
    }
  }, [
    isVisible,
    fadeAnim,
    scaleAnim,
    animationDuration,
    triggerHighlightAnim,
    highlightTrigger,
  ]);

  useEffect(() => {
    if (isVisible && anchorRef.current) {
      anchorRef.current.measureInWindow((x, y, width, height) => {
        setAnchorLayout({ x, y, width, height });
      });
    }
  }, [isVisible]);

  const calculatePosition = (): ViewStyle => {
    if (!anchorLayout || !popoverLayout) {
      return { top: 0, left: 0 };
    }

    const { width: screenWidth, height: screenHeight } =
      Dimensions.get("window");
    const { width: popoverWidth, height: popoverHeight } = popoverLayout;
    const { x, y, width: anchorWidth, height: anchorHeight } = anchorLayout;

    let top = 0;
    let left = 0;

    // Calculate horizontal position (center by default)
    left = x + (anchorWidth - popoverWidth) / 2;

    // Make sure popover doesn't go off screen horizontally
    if (left < 20) left = 20;
    if (left + popoverWidth > screenWidth - 20)
      left = screenWidth - popoverWidth - 20;

    // Calculate vertical position based on position prop
    switch (position) {
      case "top":
        top = y - popoverHeight - 10;
        break;
      case "right":
        left = x + anchorWidth + 10;
        top = y + (anchorHeight - popoverHeight) / 2;
        break;
      case "left":
        left = x - popoverWidth - 10;
        top = y + (anchorHeight - popoverHeight) / 2;
        break;
      case "bottom":
      default:
        top = y + anchorHeight + 10;
        break;
    }

    // Make sure popover doesn't go off screen vertically
    if (top < 20) top = 20;
    if (top + popoverHeight > screenHeight - 20)
      top = screenHeight - popoverHeight - 20;

    return { top, left };
  };

  const shadowStyle: ViewStyle = shadow
    ? {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
      }
    : {};

  const popoverStyle: ViewStyle = {
    position: "absolute",
    zIndex: 1000,
    ...calculatePosition(),
    backgroundColor,
    borderRadius,
    ...shadowStyle,
    ...contentStyle,
  };

  const onContentLayout = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    setPopoverLayout({ width, height, x: 0, y: 0 });
  };

  // Create a clone of children with additional animation
  const animatedChildren = React.cloneElement(
    React.Children.only(children) as React.ReactElement,
    {
      style: [
        (React.Children.only(children) as React.ReactElement).props.style,
        { transform: [{ scale: triggerHighlightAnim }] },

        highlightTrigger && isVisible
          ? {
              shadowColor: "#fff",
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: 0.3,
              shadowRadius: 10,
              elevation: 10,
              zIndex: 999,
            }
          : {},
      ],
    }
  );

  // Create an animated value for smooth blur transition
  const blurIntensityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isVisible) {
      Animated.timing(blurIntensityAnim, {
        toValue: blurIntensity,
        duration: animationDuration,
        useNativeDriver: false, // Blur intensity can't use native driver
      }).start();
    } else {
      Animated.timing(blurIntensityAnim, {
        toValue: 0,
        duration: animationDuration,

        useNativeDriver: false,
      }).start();
    }
  }, [isVisible, blurIntensity, animationDuration]);

  const renderOverlay = () => {
    if (!useBlur) {
      return (
        <TouchableWithoutFeedback onPress={onClose}>
          <Animated.View
            style={[
              styles.modalOverlay,
              {
                backgroundColor: overlayColor,
                opacity: fadeAnim, // Reuse the existing fade animation
              },
            ]}
          />
        </TouchableWithoutFeedback>
      );
    }

    return (
      <TouchableWithoutFeedback onPress={onClose}>
        <Animated.View style={styles.modalOverlay}>
          {Platform.OS === "ios" && (
            <>
              <AnimatedBlurView
                intensity={blurIntensityAnim}
                style={StyleSheet.absoluteFillObject}
                tint="systemUltraThinMaterialDark"
              />
            </>
          )}
          {/* Fallback for Android */}
          {Platform.OS !== "android" && (
            <Animated.View
              style={[
                StyleSheet.absoluteFillObject,
                {
                  backgroundColor: overlayColor,
                  opacity: fadeAnim,
                },
              ]}
            />
          )}
        </Animated.View>
      </TouchableWithoutFeedback>
    );
  };

  return (
    <>
      <Animated.View ref={anchorRef} style={[containerStyle, { zIndex: 999 }]}>
        {animatedChildren}
      </Animated.View>

      <Modal
        transparent
        visible={modalVisible}
        animationType="none"
        onRequestClose={onClose}
      >
        <View style={styles.modalContainer}>
          {/* Render overlay with either blur or color */}
          {renderOverlay()}

          {/* Render a clone of the trigger component in exactly the same position */}
          {anchorLayout && (
            <Animated.View
              style={[
                {
                  position: "absolute",
                  width: anchorLayout.width,
                  height: anchorLayout.height,
                  top: anchorLayout.y,
                  left: anchorLayout.x,
                  zIndex: 999,
                  transform: [{ scale: triggerHighlightAnim }],
                },
              ]}
            >
              {React.Children.only(children)}
            </Animated.View>
          )}

          {/* Popover content */}
          <Animated.View
            style={[
              popoverStyle,
              {
                opacity: fadeAnim,
                transform: [{ scale: scaleAnim }],
              },
            ]}
            onLayout={onContentLayout}
          >
            <TouchableWithoutFeedback>
              <View>{content}</View>
            </TouchableWithoutFeedback>
          </Animated.View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});

// Example usage demonstration
interface OptionProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  onPress: () => void;
}

const PopoverOption: React.FC<OptionProps> = ({
  title,
  description,
  icon,
  onPress,
}) => (
  <TouchableOpacity style={exampleStyles.option} onPress={onPress}>
    <View style={exampleStyles.optionContent}>
      {icon && <View style={exampleStyles.iconContainer}>{icon}</View>}
      <View>
        <Text style={exampleStyles.optionTitle}>{title}</Text>
        <Text style={exampleStyles.optionDescription}>{description}</Text>
      </View>
    </View>
  </TouchableOpacity>
);

const exampleStyles = StyleSheet.create({
  option: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  optionContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    marginRight: 16,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: "500",
  },
  optionDescription: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
});

export { Popover, PopoverOption };
