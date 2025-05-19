import { SFSymbol, SymbolView } from "expo-symbols";
import React, { useState, useEffect } from "react";
import { View, Pressable, StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolateColor,
  withSpring,
} from "react-native-reanimated";

interface ChipItem {
  label: string;
  icon: SFSymbol;
  activeIcon?: SFSymbol;
}

export const Chip = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const chips: ChipItem[] = [
    {
      label: "Primary",
      icon: "person",
      activeIcon: "person.fill",
    },
    {
      label: "Shopping",
      icon: "cart",
      activeIcon: "cart.fill",
    },
    {
      label: "Messages",
      icon: "bubble.left",
      activeIcon: "bubble.left.fill",
    },
    {
      label: "Promotions",
      icon: "megaphone",
      activeIcon: "megaphone.fill",
    },
  ];

  return (
    <View style={styles.container}>
      {chips.map((item, index) => (
        <AnimatedChip
          key={index}
          label={item.label}
          activeIcon={item.activeIcon}
          icon={item.icon}
          isActive={activeIndex === index}
          onPress={() => setActiveIndex(index)}
        />
      ))}
    </View>
  );
};

const AnimatedChip = ({
  label,
  icon,
  isActive,
  onPress,
  activeIcon,
}: {
  label: string;
  icon: SFSymbol;
  isActive: boolean;
  onPress: () => void;
  activeIcon?: SFSymbol;
}) => {
  const progress = useSharedValue(isActive ? 1 : 0);

  useEffect(() => {
    progress.value = withTiming(isActive ? 1 : 0, { duration: 250 });
  }, [isActive]);

  const animatedContainerStyle = useAnimatedStyle(() => {
    return {
      width: withSpring(isActive ? 140 : 50, {
        damping: 90,
        velocity: 2,
        stiffness: 180,
      }),

      backgroundColor: interpolateColor(
        progress.value,
        [0, 1],
        ["#333333", "#0A84FF"]
      ),
    };
  });

  const animatedTextStyle = useAnimatedStyle(() => {
    return {
      opacity: progress.value,
      transform: [
        {
          translateX: withTiming(isActive ? 0 : -8, { duration: 200 }),
        },
      ],
    };
  });

  return (
    <Pressable onPress={onPress}>
      <Animated.View style={[styles.chip, animatedContainerStyle]}>
        <SymbolView
          size={18}
          name={isActive && activeIcon ? activeIcon : icon}
          tintColor={isActive ? "#FFFFFF" : "#AAAAAA"}
        />
        {isActive && (
          <Animated.View>
            <Animated.View style={[styles.labelWrapper, animatedTextStyle]}>
              <Animated.Text style={styles.label}>{label}</Animated.Text>
            </Animated.View>
          </Animated.View>
        )}
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 8,
    padding: 12,
  },
  chip: {
    height: 40,
    borderRadius: 100,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  labelWrapper: {
    marginLeft: 8,
    minWidth: 60,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "#FFFFFF",
  },
});
