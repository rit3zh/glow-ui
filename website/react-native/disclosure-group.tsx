import { BlurView, type BlurViewProps } from "expo-blur";
import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  memo,
} from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
  type LayoutChangeEvent,
  type ViewStyle,
} from "react-native";
import Animated, {
  Easing,
  Extrapolation,
  interpolate,
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import type {
  DisclosureGroupComposition,
  IDisclosureGroupContext,
  IDisclosureGroupItem,
  IDisclosureGroupItems,
  IDisclosureGroupTrigger,
  IDisclosureGroups,
} from "./types";

const AnimatedBlurView =
  Animated.createAnimatedComponent<BlurViewProps>(BlurView);

const createDisclosureGroupContext = () =>
  createContext<IDisclosureGroupContext | undefined>(undefined);

const useDisclosureGroup = (
  context: React.Context<IDisclosureGroupContext | undefined>,
): IDisclosureGroupContext => {
  const value = useContext(context);
  if (!value) {
    throw new Error(
      "DisclosureGroup components must be used within DisclosureGroup",
    );
  }
  return value;
};

const DisclosureGroupInstanceContext = createContext<
  React.Context<IDisclosureGroupContext | undefined> | undefined
>(undefined);

const DisclosureGroupBase: React.FC<IDisclosureGroups> = ({
  children,
}: IDisclosureGroups): React.ReactNode & React.JSX.Element => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [contentHeight, setContentHeight] = useState<number>(0);

  const DisclosureContext = useMemo(() => createDisclosureGroupContext(), []);

  const toggleDisclosure = useCallback((): void => {
    setIsOpen((prev) => !prev);
  }, []);

  const closeDisclosure = useCallback((): void => {
    setIsOpen(false);
  }, []);

  const contextValue = useMemo<IDisclosureGroupContext>(
    () => ({
      isOpen,
      toggleDisclosure,
      closeDisclosure,
      contentHeight,
      setContentHeight,
      contextId: Math.random().toString(36),
    }),
    [isOpen, toggleDisclosure, closeDisclosure, contentHeight],
  );

  return (
    <DisclosureGroupInstanceContext.Provider value={DisclosureContext}>
      <DisclosureContext.Provider value={contextValue}>
        <View style={styles.container}>{children}</View>
      </DisclosureContext.Provider>
    </DisclosureGroupInstanceContext.Provider>
  );
};

const DisclosureGroupTriggerBase: React.FC<IDisclosureGroupTrigger> = ({
  children,
  style,
  contentContainerStyle,
  showChevron = true,
  chevronColor = "#ffffff",
}): React.ReactNode & React.JSX.Element => {
  const DisclosureContext = useContext(DisclosureGroupInstanceContext);
  if (!DisclosureContext) {
    throw new Error(
      "DisclosureGroup.Trigger must be used within DisclosureGroup",
    );
  }

  const { isOpen, toggleDisclosure } = useDisclosureGroup(DisclosureContext);

  const rotation = useSharedValue<number>(0);
  const { width } = useWindowDimensions();

  React.useEffect(() => {
    rotation.value = withTiming(isOpen ? 180 : 0, {
      duration: 300,
      easing: Easing.bezier(0.4, 0, 0.2, 1),
    });
  }, [isOpen]);

  const animatedChevronStyle = useAnimatedStyle<ViewStyle>(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  return (
    <Pressable onPress={toggleDisclosure} style={[styles.trigger, style]}>
      <View style={[styles.triggerContent, contentContainerStyle]}>
        {children}
        {showChevron && (
          <Animated.View
            style={[styles.chevronContainer, animatedChevronStyle]}
          >
            <Text style={[styles.chevron, { color: chevronColor }]}>^</Text>
          </Animated.View>
        )}
      </View>
    </Pressable>
  );
};

const DisclosureGroupItemsBase: React.FC<IDisclosureGroupItems> = ({
  children,
  maxHeight = 400,
  scrollable = true,
  blurTint = "dark",
  useBlur = false,
  style,
}): React.ReactNode & React.JSX.Element => {
  const DisclosureContext = useContext(DisclosureGroupInstanceContext);
  if (!DisclosureContext) {
    throw new Error(
      "DisclosureGroup.Items must be used within DisclosureGroup",
    );
  }

  const { isOpen, contentHeight, setContentHeight } =
    useDisclosureGroup(DisclosureContext);

  const animationProgress = useSharedValue<number>(0);
  const opacity = useSharedValue<number>(0);
  const blurIntensity = useSharedValue<number>(0);

  const [measured, setMeasured] = useState<boolean>(false);

  React.useEffect(() => {
    if (isOpen && measured) {
      animationProgress.value = withTiming(1, {
        duration: 350,
        easing: Easing.bezier(0.4, 0, 0.2, 1),
      });
      blurIntensity.value = withTiming(0);
      opacity.value = withTiming(1, { duration: 300 });
    } else {
      blurIntensity.value = withTiming(20);
      animationProgress.value = withTiming(0);
      opacity.value = withTiming(0);
    }
  }, [isOpen, measured]);

  const animatedContainerStyle = useAnimatedStyle<ViewStyle>(() => {
    const targetHeight = Math.min(contentHeight || 0, maxHeight);
    return {
      filter: [
        {
          blur: blurIntensity.value,
        },
      ],
      height: interpolate(
        animationProgress.value,
        [0, 1],
        [0, targetHeight],
        Extrapolation.CLAMP,
      ),
      opacity: opacity.value,
    };
  });

  const animatedBlurViewProps = useAnimatedProps(() => ({
    intensity: blurIntensity.value,
  }));

  const handleLayout = useCallback(
    <T extends LayoutChangeEvent>(event: T): void => {
      const { height } = event.nativeEvent.layout;
      if (height > 0 && !measured) {
        setContentHeight(height);
        setMeasured(true);
      }
    },
    [measured],
  );

  if (!measured) {
    return (
      <View style={styles.measurementContainer} onLayout={handleLayout}>
        <View style={styles.itemsContent}>{children}</View>
      </View>
    );
  }

  const content = scrollable ? (
    <ScrollView
      style={{ maxHeight }}
      showsVerticalScrollIndicator={false}
      bounces
    >
      <View style={styles.itemsContent}>{children}</View>
      <AnimatedBlurView
        tint={blurTint}
        animatedProps={animatedBlurViewProps}
        style={StyleSheet.absoluteFillObject}
        pointerEvents="none"
      />
    </ScrollView>
  ) : (
    <View style={styles.itemsContent}>{children}</View>
  );

  if (useBlur) {
    return (
      <Animated.View
        style={[styles.itemsContainer, animatedContainerStyle, style]}
      >
        {children}
        {Platform.OS === "ios" && (
          <AnimatedBlurView
            tint={blurTint}
            animatedProps={animatedBlurViewProps}
            style={StyleSheet.absoluteFillObject}
            pointerEvents="none"
          />
        )}
      </Animated.View>
    );
  }

  return (
    <Animated.View
      style={[styles.itemsContainer, animatedContainerStyle, style]}
    >
      {content}
    </Animated.View>
  );
};

const DisclosureGroupItemBase: React.FC<IDisclosureGroupItem> = ({
  children,
  onPress,
  style,
  disabled = false,
}): React.ReactNode & React.JSX.Element => {
  const DisclosureContext = useContext(DisclosureGroupInstanceContext);
  if (!DisclosureContext) {
    throw new Error("DisclosureGroup.Item must be used within DisclosureGroup");
  }

  const scale = useSharedValue<number>(1);

  const animatedStyle = useAnimatedStyle<ViewStyle>(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = useCallback(
    <T extends (() => void) | undefined>(cb: T): void => {
      if (!disabled) cb?.();
    },
    [disabled],
  );

  return (
    <Pressable
      disabled={disabled}
      onPress={() => handlePress(onPress)}
      onPressIn={() => (scale.value = 0.97)}
      onPressOut={() => (scale.value = 1)}
    >
      <Animated.View style={[styles.item, style, animatedStyle]}>
        {children}
      </Animated.View>
    </Pressable>
  );
};

const DisclosureGroupTrigger = memo<IDisclosureGroupTrigger>(
  DisclosureGroupTriggerBase,
);
const DisclosureGroupItems = memo<IDisclosureGroupItems>(
  DisclosureGroupItemsBase,
);
const DisclosureGroupItem = memo<IDisclosureGroupTrigger>(
  DisclosureGroupItemBase,
);

export const DisclosureGroup: React.NamedExoticComponent<IDisclosureGroups> &
  DisclosureGroupComposition = Object.assign(memo(DisclosureGroupBase), {
  Trigger: DisclosureGroupTrigger,
  Items: DisclosureGroupItems,
  Item: DisclosureGroupItem,
});

const styles = StyleSheet.create({
  container: { width: "100%" },
  trigger: {},
  triggerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
  },
  chevronContainer: { marginLeft: 12 },
  chevron: { fontSize: 16, fontWeight: "600" },
  measurementContainer: {
    position: "absolute",
    opacity: 0,
    pointerEvents: "none",
  },
  itemsContainer: {},
  itemsContent: {
    paddingHorizontal: 8,
    paddingTop: 10,
    paddingBottom: 4,
  },
  item: {
    padding: 12,
    borderRadius: 12,
    marginBottom: 4,
  },
});
