import { SFSymbol, SymbolView } from "expo-symbols";
import React, { useState } from "react";
import { StyleSheet } from "react-native";
import Animated, { LinearTransition } from "react-native-reanimated";
import type { ChipGroupProps, ChipItem } from "./Chip.types";
import { AnimatedChip } from "./AnimatedChip";

export const ChipGroup: React.FC<ChipGroupProps<ChipItem>> = ({
  chips,
  onChange,
  containerStyle,
  selectedIndex,
}) => {
  const [internalIndex, setInternalIndex] = useState(0);
  const activeIndex = selectedIndex ?? internalIndex;

  const handlePress = (index: number) => {
    if (selectedIndex === undefined) {
      setInternalIndex(index);
    }
    onChange?.(index);
  };
  return (
    <Animated.View
      style={[styles.container, containerStyle]}
      layout={LinearTransition}
    >
      {chips.map((item, index) => (
        <AnimatedChip
          key={index}
          label={item.label}
          activeColor={item.activeColor}
          activeIcon={item.activeIcon}
          icon={item.icon}
          isActive={activeIndex === index}
          onPress={() => handlePress(index)}
        />
      ))}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 8,
  },
});
