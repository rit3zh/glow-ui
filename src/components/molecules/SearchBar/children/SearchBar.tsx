import React, { useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  LayoutChangeEvent,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  Easing,
  LinearTransition,
} from "react-native-reanimated";
import { SymbolView } from "expo-symbols";
import { BlurView } from "expo-blur";

import type { SearchBarProps } from "./SearchBar.types";

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);
const AnimatedView = Animated.createAnimatedComponent(View);
const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);

export const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = "Search...",
  onSearch,
  onClear,
  className,
  parentHeight = 40,
  renderLeadingIcons,
  renderTrailingIcons,
  ...props
}) => {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [containerHeight, setContainerHeight] = useState(0);

  // Animation values
  const scale = useSharedValue(0.8);
  const opacity = useSharedValue(0);
  const searchIconScale = useSharedValue(1);
  const searchIconOpacity = useSharedValue(1);
  const containerScale = useSharedValue(1);
  const translateY = useSharedValue(0);
  const containerPadding = useSharedValue(8);
  const blurIntensity = useSharedValue(20);

  const animatedClearButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const animatedSearchIconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: searchIconScale.value }],
    opacity: searchIconOpacity.value,
  }));

  const animatedContainerStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: containerScale.value },
      { translateY: translateY.value },
    ],
    paddingVertical: containerPadding.value,
  }));

  const animatedBlurStyle = useAnimatedStyle(() => ({
    opacity: blurIntensity.value / 20,
  }));

  const handleLayout = (event: LayoutChangeEvent) => {
    const { height } = event.nativeEvent.layout;
    setContainerHeight(height);
  };

  const calculateTranslation = () => {
    const maxTranslation = containerHeight;
    return Math.max(containerHeight, parentHeight - 80) / 2;
  };

  const handleFocus = () => {
    props.onSearchMount!();
    setIsFocused(true);

    containerScale.value = withSpring(1.02, {
      damping: 15,
      stiffness: 120,
    });
    searchIconScale.value = withSpring(0.8, {
      damping: 15,
      stiffness: 120,
    });
    searchIconOpacity.value = withTiming(0.5, {
      duration: 200,
      easing: Easing.out(Easing.ease),
    });
    translateY.value = withSpring(-calculateTranslation(), {
      damping: 25,
      stiffness: 120,
    });
    containerPadding.value = withSpring(4, {
      damping: 15,
      stiffness: 120,
    });
    blurIntensity.value = withSpring(40, {
      damping: 15,
      stiffness: 120,
    });
  };

  const handleBlur = (e: any) => {
    setIsFocused(false);
    props.onSearchDone!();
    containerScale.value = withSpring(1, {
      damping: 15,
      stiffness: 120,
    });
    searchIconScale.value = withSpring(1, {
      damping: 15,
      stiffness: 120,
    });
    searchIconOpacity.value = withTiming(1, {
      duration: 200,
      easing: Easing.out(Easing.ease),
    });
    translateY.value = withSpring(0, {
      damping: 15,
      stiffness: 120,
    });
    containerPadding.value = withSpring(8, {
      damping: 15,
      stiffness: 120,
    });
    blurIntensity.value = withSpring(20, {
      damping: 15,
      stiffness: 120,
    });
  };

  const handleChangeText = (text: string) => {
    setQuery(text);
    if (text.length > 0) {
      scale.value = withSpring(1, {
        damping: 15,
        stiffness: 120,
      });
      opacity.value = withTiming(1, {
        duration: 200,
        easing: Easing.out(Easing.ease),
      });
    } else {
      scale.value = withSpring(0.8, {
        damping: 15,
        stiffness: 120,
      });
      opacity.value = withTiming(0, {
        duration: 200,
        easing: Easing.out(Easing.ease),
      });
    }
    onSearch?.(text);
  };

  const handleClear = () => {
    setQuery("");
    scale.value = withSpring(0.8, {
      damping: 15,
      stiffness: 120,
    });
    opacity.value = withTiming(0, {
      duration: 200,
      easing: Easing.out(Easing.ease),
    });
    onClear?.();
  };

  return (
    <AnimatedView
      style={[styles.container, animatedContainerStyle]}
      className={className}
      layout={LinearTransition}
      onLayout={handleLayout}
    >
      <AnimatedBlurView
        intensity={blurIntensity.value}
        tint="systemUltraThinMaterialDark"
        style={[
          styles.searchContainer,
          isFocused && styles.focusedContainer,
          // animatedBlurStyle,
        ]}
      >
        <AnimatedView
          style={[styles.searchIconContainer, animatedSearchIconStyle]}
        >
          {renderLeadingIcons ? (
            renderLeadingIcons()
          ) : (
            <SymbolView
              name="magnifyingglass"
              size={18}
              tintColor={props.tint}
            />
          )}
        </AnimatedView>
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor="#8E8E93"
          value={query}
          onChangeText={handleChangeText}
          onFocus={handleFocus}
          onBlur={handleBlur}
          returnKeyType="search"
          {...props}
        />
        {query.length > 0 && (
          <AnimatedTouchable
            onPress={handleClear}
            style={[styles.clearButton, animatedClearButtonStyle]}
          >
            {renderTrailingIcons ? (
              renderTrailingIcons()
            ) : (
              <SymbolView
                name="xmark.circle.fill"
                size={18}
                tintColor={props.tint}
              />
            )}
          </AnimatedTouchable>
        )}
      </AnimatedBlurView>
    </AnimatedView>
  );
};

const styles = StyleSheet.create({
  wrapper: {},
  container: {
    width: "100%",
    paddingHorizontal: 16,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(28, 28, 30, 0.6)",
    overflow: "hidden",

    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  focusedContainer: {
    backgroundColor: "rgba(28, 28, 30, 0.8)",
  },
  searchIconContainer: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    color: "#FFFFFF",
    fontSize: 17,
    fontFamily: "System",
    paddingVertical: 2,
  },
  clearButton: {},
});
