// crixsanne
// TimelineView.tsx

import React, { useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withSequence,
  FadeInDown,
  LinearTransition,
  interpolateColor,
} from "react-native-reanimated";
import { Feather } from "@expo/vector-icons";
import type { TimelineProps } from "./TimelineView.types";

const AnimatedTouchableOpacity =
  Animated.createAnimatedComponent(TouchableOpacity);
const AnimatedFeather = Animated.createAnimatedComponent(Feather);

export const Timeline: React.FC<TimelineProps> &
  React.FunctionComponent<TimelineProps> = ({
  items = [],
  activeColor = "#6366f1",
  inactiveColor = "#cbd5e1",
  animated = true,
  animationType = "bounce",
  onItemPress,
  containerStyle,
  titleStyle,
  descriptionStyle,
  timestampStyle,
  lineWidth = 2,
  iconSize = 20,
}: TimelineProps): React.ReactNode & React.JSX.Element => {
  const statusRefs = React.useRef<Record<string | number, string>>({});

  useEffect(() => {
    items.forEach((item) => {
      statusRefs.current[item.id] = item.status || "upcoming";
    });

    return () => {
      statusRefs.current = {};
    };
  }, []);

  if (!items || items.length === 0) {
    return null as unknown as React.ReactNode & React.JSX.Element;
  }

  return (
    <Animated.View style={[styles.container, containerStyle]}>
      {items.map((item, index) => {
        const isFirst = index === 0;
        const isLast = index === items.length - 1;
        const isComplete = item.status === "complete";
        const isCurrent = item.status === "current";
        const isUpcoming = item.status === "upcoming" || !item.status;

        const prevStatus = statusRefs.current[item.id];
        const wasComplete = prevStatus === "complete";
        const statusChanged = prevStatus && prevStatus !== item.status;
        statusRefs.current[item.id] = item.status || "upcoming";

        const dotScale = useSharedValue(statusChanged ? 1.5 : 1);
        const dotColorAnimated = useSharedValue(
          isComplete ? 1 : isCurrent ? 0.5 : 0
        );
        const lineProgress = useSharedValue(isComplete ? 1 : 0);
        const iconRotate = useSharedValue(statusChanged ? 0 : 1);

        useEffect(() => {
          if (statusChanged) {
            switch (animationType) {
              case "bounce":
                dotScale.value = withSequence(
                  withTiming(1.5, { duration: 200 }),
                  withSpring(1)
                );
                break;
              case "spring":
                dotScale.value = withSpring(1.2, { damping: 2, stiffness: 80 });
                break;
              case "rotate":
                iconRotate.value = withSequence(
                  withTiming(0, { duration: 10 }),
                  withTiming(4, { duration: 800 })
                );
                dotScale.value = withSequence(
                  withTiming(1.6, { duration: 200 }),
                  withSpring(1)
                );
                dotColorAnimated.value = withSequence(
                  withTiming(0, { duration: 200 }),
                  withTiming(isComplete ? 1 : isCurrent ? 0.5 : 0, {
                    duration: 400,
                  })
                );
                break;
              case "fade":
                dotColorAnimated.value = withSequence(
                  withTiming(0, { duration: 200 }),
                  withTiming(isComplete ? 1 : isCurrent ? 0.5 : 0, {
                    duration: 400,
                  })
                );
                break;
              case "scale":
                dotScale.value = withSequence(
                  withTiming(0.5, { duration: 200 }),
                  withTiming(1.2, { duration: 200 }),
                  withTiming(1, { duration: 200 })
                );
                break;
              default:
                dotScale.value = withSequence(
                  withTiming(1.5, { duration: 200 }),
                  withSpring(1)
                );
            }

            dotColorAnimated.value = withTiming(
              isComplete ? 1 : isCurrent ? 0.5 : 0,
              { duration: 400 }
            );

            iconRotate.value = withSequence(
              withTiming(0, { duration: 10 }),
              withTiming(1, { duration: 400 })
            );

            if (isComplete) {
              lineProgress.value = withTiming(1, { duration: 600 });
            } else if (wasComplete) {
              lineProgress.value = withTiming(0, { duration: 600 });
            }
          } else {
            lineProgress.value = isComplete ? 1 : 0;
          }
        }, [item.status, isComplete, isCurrent, animationType]);

        const dotAnimatedStyle = useAnimatedStyle(() => {
          return {
            transform: [{ scale: dotScale.value }],
            backgroundColor: interpolateColor(
              dotColorAnimated.value,
              [0, 0.5, 1],
              [inactiveColor, activeColor, activeColor]
            ),
          };
        });

        const lineAnimatedStyle = useAnimatedStyle(() => {
          return {
            backgroundColor: interpolateColor(
              lineProgress.value,
              [0, 1],
              [inactiveColor, activeColor]
            ),
            width: lineWidth,
            transform: [
              { scaleY: lineProgress.value },
              { translateY: -2 * (1 - lineProgress.value) },
            ],
            opacity: 0.6 + lineProgress.value * 0.4,
          };
        });

        const iconAnimatedStyle = useAnimatedStyle(() => {
          return {
            transform: [
              { rotateZ: `${iconRotate.value * 360}deg` },
              { scale: 0.8 + iconRotate.value * 0.2 },
            ],
          };
        });

        const iconName =
          item.icon ||
          (isComplete ? "check" : isCurrent ? "activity" : "circle");

        const textColor = isComplete || isCurrent ? "#0f172a" : "#64748b";

        return (
          <AnimatedTouchableOpacity
            key={item.id}
            style={styles.itemContainer}
            activeOpacity={onItemPress ? 0.7 : 1}
            onPress={() => onItemPress && onItemPress(item)}
            entering={
              animated ? FadeInDown.delay(index * 100).springify() : undefined
            }
            layout={LinearTransition.springify()}
          >
            <View style={styles.timelineColumn}>
              <Animated.View style={[styles.dot, dotAnimatedStyle]}>
                <Animated.View style={[{}, iconAnimatedStyle]}>
                  <AnimatedFeather
                    name={iconName as any}
                    size={iconSize * 0.7}
                    color="#fff"
                  />
                </Animated.View>
              </Animated.View>

              {!isLast && (
                <Animated.View style={[styles.line, lineAnimatedStyle]} />
              )}
            </View>

            <View style={styles.contentColumn}>
              <View style={styles.itemHeader}>
                <Text style={[styles.title, { color: textColor }, titleStyle]}>
                  {item.title}
                </Text>

                {item.timestamp && (
                  <Text style={[styles.timestamp, timestampStyle]}>
                    {item.timestamp}
                  </Text>
                )}
              </View>

              {item.description && (
                <Text style={[styles.description, descriptionStyle]}>
                  {item.description}
                </Text>
              )}

              {item.meta && (
                <View style={styles.metaContainer}>
                  <Text style={styles.metaText}>{item.meta}</Text>
                </View>
              )}

              {item.children && (
                <View style={styles.childrenContainer}>{item.children}</View>
              )}
            </View>
          </AnimatedTouchableOpacity>
        );
      })}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  itemContainer: {
    flexDirection: "row",
    marginBottom: 24,
  },
  timelineColumn: {
    alignItems: "center",
    width: 40,
  },
  contentColumn: {
    flex: 1,
    marginLeft: 12,
    marginTop: -4,
  },
  dot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  line: {
    flex: 1,
    marginTop: 4,
  },
  itemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 6,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    flex: 1,
  },
  description: {
    fontSize: 14,
    color: "#64748b",
    lineHeight: 20,
    marginBottom: 8,
  },
  timestamp: {
    fontSize: 12,
    color: "#94a3b8",
    marginLeft: 8,
  },
  metaContainer: {
    backgroundColor: "#f1f5f9",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    alignSelf: "flex-start",
    marginTop: 4,
    marginBottom: 8,
  },
  metaText: {
    fontSize: 12,
    color: "#475569",
  },
  childrenContainer: {
    marginTop: 12,
    backgroundColor: "#f8fafc",
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
});
