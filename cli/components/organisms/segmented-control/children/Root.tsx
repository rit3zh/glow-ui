import { StyleSheet, useWindowDimensions, View } from "react-native";
import type { SegmentedControlRootProps } from "../SegmentedControl.types";
import { Children, isValidElement, useEffect, useState } from "react";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { SegmentedControlContext } from "../context/SegmentedControlContext";
import { SegmentedControlItem } from "./Item";

export const SegmentedControlRoot = ({
  defaultValue,
  value: controlledValue,
  onValueChange,
  children,
  theme = "dark",
  className,
}: SegmentedControlRootProps) => {
  const { width } = useWindowDimensions();
  const internalPadding = 4;
  const segmentedControlWidth = width - 40;

  const items = Children.toArray(children).filter(
    (child) => isValidElement(child) && child.type === SegmentedControlItem,
  );

  const itemWidth = (segmentedControlWidth - internalPadding) / items.length;

  const [selectedValue, setSelectedValue] = useState(
    controlledValue || defaultValue || (items[0] as any)?.props?.value || "",
  );

  useEffect(() => {
    if (controlledValue !== undefined) {
      setSelectedValue(controlledValue);
    }
  }, [controlledValue]);

  const handleValueChange = (value: string) => {
    if (controlledValue === undefined) {
      setSelectedValue(value);
    }
    onValueChange?.(value);
  };

  const selectedIndex = items.findIndex(
    (child) => isValidElement(child) && child.props.value === selectedValue,
  );

  const translateX = useSharedValue(
    selectedIndex >= 0 ? selectedIndex * itemWidth + internalPadding / 2 : 0,
  );

  useEffect(() => {
    if (selectedIndex >= 0) {
      translateX.value = withTiming(
        selectedIndex * itemWidth + internalPadding / 2,
        { duration: 350 },
      );
    }
  }, [selectedIndex, itemWidth, translateX]);

  const indicatorStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  const backgroundColor = theme === "dark" ? "#09090b" : "#f8f9fa";
  const indicatorColor = theme === "dark" ? "#27272a" : "#e4e4e7";

  return (
    <SegmentedControlContext.Provider
      value={{
        selectedValue,
        onValueChange: handleValueChange,
        itemWidth,
        theme,
      }}
    >
      <View
        style={[
          styles.container,
          {
            width: segmentedControlWidth,
            backgroundColor,
          },
        ]}
      >
        <Animated.View
          style={[
            {
              width: itemWidth - 4,
            },
            styles.indicator,
            indicatorStyle,
            { backgroundColor: indicatorColor },
          ]}
        />
        {children}
      </View>
    </SegmentedControlContext.Provider>
  );
};
const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    height: 40,
    borderRadius: 10,
    padding: 2,
    position: "relative",
    alignItems: "center",
    overflow: "hidden",
  },
  indicator: {
    position: "absolute",
    borderRadius: 10,
    height: "90%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1,
  },
  itemContainer: {
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
    height: "100%",
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    textAlign: "center",
  },
  darkLabel: {
    color: "#a1a1aa",
  },
  lightLabel: {
    color: "#71717a",
  },
  selectedLabel: {
    color: "#ffffff",
    fontWeight: "600",
  },
});
