import { Ionicons } from "@expo/vector-icons";
import { BlurView, type BlurViewProps } from "expo-blur";
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  cloneElement,
  Children,
  isValidElement,
  ReactElement,
  memo,
} from "react";
import { Platform, Pressable, StyleSheet, View } from "react-native";
import Animated, {
  interpolate,
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { AccordionThemes } from "./presets";
import type {
  AccordionContentProps,
  AccordionContextType,
  AccordionItemProps,
  AccordionProps,
  AccordionTriggerProps,
} from "./types";
import {
  AndroidHaptics,
  impactAsync,
  ImpactFeedbackStyle,
  performAndroidHapticsAsync,
} from "expo-haptics";

const AnimatedBlurView =
  Animated.createAnimatedComponent<BlurViewProps>(BlurView);
const AccordionContext = createContext<AccordionContextType | null>(null);
const AccordionItemContext = createContext<{
  value: string;
  isOpen: boolean;
  icon: "chevron" | "cross";
} | null>(null);

const useAccordionContext = () => {
  const context = useContext(AccordionContext);
  if (!context)
    throw new Error("Accordion components must be used within Accordion");
  return context;
};

const useAccordionItemContext = () => {
  const context = useContext(AccordionItemContext);
  if (!context) throw new Error("Trigger and Content must be within Item");
  return context;
};

const ChevronIcon = ({ isOpen }: { isOpen: boolean }) => {
  const { theme } = useAccordionContext();
  const rotation = useSharedValue<number>(0);

  useEffect(() => {
    rotation.value = withTiming<number>(isOpen ? 1 : 0, { duration: 200 });
  }, [isOpen]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { rotate: `${interpolate(rotation.value, [0, 1], [0, 180])}deg` },
    ],
  }));

  return (
    <>
      <Animated.View style={animatedStyle}>
        <Ionicons name="chevron-down" size={20} color={theme.iconColor} />
      </Animated.View>
    </>
  );
};

const CrossIcon = ({ isOpen }: { isOpen: boolean }) => {
  const { theme } = useAccordionContext();
  const topLineTranslate = useSharedValue(0);
  const bottomLineTranslate = useSharedValue(0);
  const middleLineOpacity = useSharedValue(1);

  useEffect(() => {
    if (isOpen) {
      topLineTranslate.value = withTiming(6, { duration: 200 });
      bottomLineTranslate.value = withTiming(-6, { duration: 200 });
      middleLineOpacity.value = withTiming(0, { duration: 200 });
    } else {
      topLineTranslate.value = withTiming(0, { duration: 200 });
      bottomLineTranslate.value = withTiming(0, { duration: 200 });
      middleLineOpacity.value = withTiming(1, { duration: 200 });
    }
  }, [isOpen]);

  const topLineStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: topLineTranslate.value }],
  }));

  const middleLineStyle = useAnimatedStyle(() => ({
    opacity: middleLineOpacity.value,
  }));

  const bottomLineStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: bottomLineTranslate.value }],
  }));

  return (
    <View
      style={{
        width: 20,
        height: 20,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Animated.View
        style={[
          {
            width: 16,
            height: 2,
            backgroundColor: theme.iconColor,
            borderRadius: 1,
            marginBottom: 4,
          },
          topLineStyle,
        ]}
      />
      <Animated.View
        style={[
          {
            width: 16,
            height: 2,
            backgroundColor: theme.iconColor,
            borderRadius: 1,
            marginBottom: 4,
          },
          middleLineStyle,
        ]}
      />
      <Animated.View
        style={[
          {
            width: 16,
            height: 2,
            backgroundColor: theme.iconColor,
            borderRadius: 1,
          },
          bottomLineStyle,
        ]}
      />
    </View>
  );
};

const Accordion = ({
  children,
  type = "single",
  theme = AccordionThemes.light,
  spacing = 0,
}: AccordionProps) => {
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());

  const toggleItem = (id: string) => {
    setOpenItems((prev) => {
      const newSet = new Set(prev);
      if (type === "single") {
        if (newSet.has(id)) {
          newSet.clear();
        } else {
          newSet.clear();
          newSet.add(id);
        }
      } else {
        if (newSet.has(id)) {
          newSet.delete(id);
        } else {
          newSet.add(id);
        }
      }
      return newSet;
    });
  };

  const childrenArray = Children.toArray(children);
  const childrenWithProps = childrenArray.map((child, index) => {
    if (isValidElement(child)) {
      return cloneElement(child as ReactElement<any>, {
        isLast: index === childrenArray.length - 1,
      });
    }
    return child;
  });

  return (
    <AccordionContext.Provider
      value={{ openItems, toggleItem, theme, spacing }}
    >
      <View
        style={[
          styles.accordion,
          {
            backgroundColor: theme.backgroundColor,
            borderColor: theme.borderColor,
          },
        ]}
      >
        {childrenWithProps}
      </View>
    </AccordionContext.Provider>
  );
};
const AccordionItem = memo(
  ({
    children,
    value,
    pop = false,
    icon = "chevron",
    popScale = 1.02,
    isLast = false,
  }: AccordionItemProps): React.ReactNode => {
    const { openItems, theme, spacing } = useAccordionContext();
    const isOpen = openItems.has(value);
    const scale = useSharedValue(1);

    useEffect(() => {
      if (pop) {
        scale.value = withTiming(isOpen ? popScale : 1, { duration: 200 });
      }
    }, [isOpen, pop]);

    const animatedStyle = useAnimatedStyle(() => ({
      transform: [{ scale: scale.value }],
    }));

    return (
      <AccordionItemContext.Provider value={{ value, isOpen, icon }}>
        <Animated.View
          style={[
            styles.item,
            {
              borderBottomColor: theme.borderColor,
              borderBottomWidth: isLast ? 0 : 1,
              marginBottom: spacing,
            },
            pop && animatedStyle,
          ]}
        >
          {children}
        </Animated.View>
      </AccordionItemContext.Provider>
    );
  },
);
const AccordionTrigger = ({ children }: AccordionTriggerProps) => {
  const { toggleItem } = useAccordionContext();
  const { value, isOpen, icon } = useAccordionItemContext();
  const blurIntensity = useSharedValue(40);

  useEffect(() => {
    blurIntensity.value = withTiming(isOpen ? 20 : 40, {
      duration: 100,
    });
  }, [isOpen]);

  return (
    <Pressable
      style={({ pressed }) => [styles.trigger]}
      onPress={() => {
        toggleItem(value);
        if (Platform.OS === "android")
          performAndroidHapticsAsync(AndroidHaptics.Clock_Tick);
        else impactAsync(ImpactFeedbackStyle.Medium);
      }}
    >
      <View style={styles.triggerContent}>
        {children}
        {icon === "chevron" ? (
          <ChevronIcon isOpen={isOpen} />
        ) : (
          <CrossIcon isOpen={isOpen} />
        )}
      </View>
    </Pressable>
  );
};

const AccordionContent = ({ children }: AccordionContentProps) => {
  const { isOpen } = useAccordionItemContext();
  const { theme } = useAccordionContext();
  const height = useSharedValue<number>(0);
  const opacity = useSharedValue<number>(0);
  const [contentHeight, setContentHeight] = useState<number>(0);
  const [measured, setMeasured] = useState<boolean>(false);
  const blurIntensity = useSharedValue<number>(40);

  const onLayout = (e: any) => {
    const h = e.nativeEvent.layout.height;
    if (h > 0 && !measured) {
      setContentHeight(h);
      setMeasured(true);
    }
  };

  useEffect(() => {
    if (measured) {
      if (isOpen) {
        height.value = withTiming(contentHeight, { duration: 200 });
        opacity.value = withTiming(1, { duration: 200 });
      } else {
        height.value = withTiming(0, { duration: 200 });
        opacity.value = withTiming(0, { duration: 200 });
      }
    }
  }, [isOpen, measured, contentHeight]);

  const animatedStyle = useAnimatedStyle(() => ({
    height: height.value,
    opacity: measured ? opacity.value : 0,
    overflow: "hidden",
  }));

  useEffect(() => {
    blurIntensity.value = withTiming(isOpen ? 0 : 20, {
      duration: 200,
    });
  }, [isOpen]);

  const animatedBlurProps = useAnimatedProps(() => ({
    intensity: blurIntensity.value,
  }));

  const animatedAndroidBlurStylez = useAnimatedStyle(() => ({
    filter: [
      {
        blur: interpolate(blurIntensity.value, [0, 40], [0, 20]),
      },
    ],
  }));

  return (
    <>
      {!measured && (
        <View onLayout={onLayout} style={styles.measuringContainer}>
          <View style={styles.content}>{children}</View>
        </View>
      )}
      <Animated.View style={animatedStyle}>
        <View style={styles.contentWrapper}>
          <Animated.View
            style={[
              styles.content,
              Platform.OS === "android" && animatedAndroidBlurStylez,
            ]}
          >
            {children}
          </Animated.View>
          {Platform.OS === "ios" && (
            <AnimatedBlurView
              tint={
                theme.backgroundColor === "#18181b" ||
                theme.backgroundColor === "#0c4a6e" ||
                theme.backgroundColor === "#7c2d12"
                  ? "dark"
                  : "systemUltraThinMaterialDark"
              }
              animatedProps={animatedBlurProps}
              style={[
                {
                  overflow: "hidden",
                  position: "absolute",
                  width: "100%",
                  height: "100%",
                },
              ]}
            />
          )}
        </View>
      </Animated.View>
    </>
  );
};

Accordion.Item = AccordionItem;
Accordion.Trigger = AccordionTrigger;
Accordion.Content = AccordionContent;

const styles = StyleSheet.create({
  accordion: {
    width: "100%",
    borderRadius: 8,
    overflow: "hidden",
    borderWidth: 1,
  },
  item: {
    overflow: "hidden",
  },
  trigger: {
    position: "relative",
    overflow: "hidden",
  },
  triggerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  triggerText: {
    fontSize: 15,
    fontWeight: "500",
    flex: 1,
    zIndex: 1,
  },
  measuringContainer: {
    position: "absolute",
    opacity: 0,
    left: 0,
    right: 0,
  },
  contentWrapper: {
    position: "absolute",
    width: "100%",
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 0,
    paddingBottom: 16,
  },
  contentText: {
    fontSize: 14,
    lineHeight: 20,
  },
});

export {
  AccordionThemes,
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
};
