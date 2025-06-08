import * as React from "react";
import { useState, useEffect } from "react";
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  type ViewStyle,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
  runOnJS,
} from "react-native-reanimated";
import { ChipGroup } from "@/components";

const ChipDemo: React.FunctionComponent = (_$_): React.ReactNode => {
  const [index, setIndex] = useState<number>(0);
  const [displayedLabel, setDisplayedLabel] = useState<string>("Primary");
  const [displayedCount, setDisplayedCount] = useState<number>(42);

  const fadeAnim = useSharedValue<number>(1);
  const chipData = [
    {
      label: "Primary",
      icon: "person",
      activeIcon: "person.fill",
      activeColor: "#0A84FF",
    },
    {
      label: "Notification",
      icon: "cart",
      activeIcon: "cart.fill",
      activeColor: "#FF453A",
    },
    {
      label: "Messages",
      icon: "bubble.left",
      activeIcon: "bubble.left.fill",
      activeColor: "#FF9F0A",
    },
    {
      label: "Promotions",
      icon: "megaphone",
      activeIcon: "megaphone.fill",
      activeColor: "#30D158",
    },
  ];

  const updateDisplayedContent = (newIndex: number) => {
    setDisplayedLabel(chipData[newIndex].label);
    setDisplayedCount(Math.floor(Math.random() * 100) + 1);
  };

  const handleChipChange = (newIndex: number) => {
    if (newIndex !== index) {
      fadeAnim.value = withTiming(0, { duration: 150 }, (finished) => {
        if (finished) {
          runOnJS(updateDisplayedContent)(newIndex);
          fadeAnim.value = withTiming(1, { duration: 150 });
        }
      });
      setIndex(newIndex);
    }
  };

  const animatedStyle = useAnimatedStyle<ViewStyle>(() => {
    return {
      opacity: fadeAnim.value,
      transform: [
        {
          translateY: interpolate(fadeAnim.value, [0, 1], [4, 0]),
        },
      ],
    };
  });

  useEffect(() => {
    updateDisplayedContent(0);
  }, []);

  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>Filter</Text>
            <Text style={styles.subtitle}>Choose your view</Text>
          </View>

          <View style={styles.chipContainer}>
            <ChipGroup
              chips={chipData as any}
              selectedIndex={index}
              onChange={handleChipChange}
              containerStyle={styles.chipGroupContainer}
            />
          </View>

          <Animated.View style={[styles.selectedInfo, animatedStyle]}>
            <Text style={styles.selectedText}>{displayedLabel}</Text>
            <View style={styles.dot} />
            <Text style={styles.selectedCount}>{displayedCount} items</Text>
          </Animated.View>
        </View>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

export default ChipDemo;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#0A0A0A",
  },
  container: {
    flex: 1,
    backgroundColor: "#0A0A0A",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  header: {
    alignItems: "center",
    marginBottom: 48,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: -0.5,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 15,
    color: "#71717A",
    fontWeight: "400",
  },
  chipContainer: {
    width: "100%",
    alignItems: "center",
    marginBottom: 32,
  },
  chipGroupContainer: {
    paddingHorizontal: 4,
  },
  selectedInfo: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#18181B",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#27272A",
  },
  selectedText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#FFFFFF",
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: "#52525B",
    marginHorizontal: 8,
  },
  selectedCount: {
    fontSize: 14,
    color: "#71717A",
    fontWeight: "400",
  },
});
