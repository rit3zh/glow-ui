import React, { useEffect, useState, useRef, memo } from "react";
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  type ViewStyle,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import type { IThinkingState } from "./types";

export const LoadingState: React.FC<IThinkingState> &
  React.FunctionComponent<IThinkingState> = memo<IThinkingState>(
  ({
    lines = [
      "Connecting to API...",
      "Authenticating user...",
      "Loading profile data...",
      "Fetching notifications...",
      "Syncing preferences...",
      "Ready!",
    ],
    scrollSpeed = 1500,
    lineHeight = 28,
    visibleLines = 3,
    showLineNumbers = true,
    containerStyle,
    codeContainerStyle,
    lineTextStyle,
    lineNumberStyle,
    onLineChange,
    onCycleComplete,
    onStart,
    gradientColors = ["transparent", "rgba(0,0,0,0.6)", "rgba(0,0,0,0.9)"],
    gradientHeight = "60%",
    gradientLocations = [0, 0.5, 1],
    centerLineIndex = 1,
  }: IThinkingState): React.ReactNode => {
    const scrollViewRef = useRef<ScrollView>(null);
    const currentIndex = useRef<number>(0);
    const isResetting = useRef<boolean>(false);
    const [currentScrollLine, setCurrentScrollLine] = useState<number>(0);

    const displayLines = lines.map((text, i) => ({
      text,
      number: i + 1,
    }));

    useEffect(() => {
      onStart?.();
    }, []);

    useEffect(() => {
      const maxIndex = lines.length - 1;

      const interval = setInterval(() => {
        if (isResetting.current) return;

        const index = currentIndex.current;

        if (index > maxIndex) {
          isResetting.current = true;
          onCycleComplete?.();

          scrollViewRef.current?.scrollTo({ y: 0, animated: true });

          setTimeout(() => {
            currentIndex.current = 0;
            setCurrentScrollLine(0);
            isResetting.current = false;
          }, 600);
          return;
        }
        onLineChange?.(index, lines[index]);
        setCurrentScrollLine(index);

        scrollViewRef.current?.scrollTo({
          y: index * lineHeight,
          animated: true,
        });

        currentIndex.current += 1;
      }, scrollSpeed);

      return () => clearInterval(interval);
    }, [lines, scrollSpeed, lineHeight, visibleLines]);

    const fade = useSharedValue<number>(1);

    useEffect(() => {
      fade.value = withRepeat<number>(
        withSequence<number>(
          withTiming<number>(0.85, { duration: 1400 }),
          withTiming<number>(1, { duration: 1400 }),
        ),
        -1,
        true,
      );
    }, []);

    const fadeStyle = useAnimatedStyle<Pick<ViewStyle, "opacity">>(() => ({
      opacity: fade.value,
    }));

    const focusedLineNumber = currentScrollLine + centerLineIndex;

    return (
      <View style={[styles.container, containerStyle]}>
        <View style={[styles.codeContainer, codeContainerStyle]}>
          <ScrollView
            ref={scrollViewRef}
            scrollEnabled={false}
            showsVerticalScrollIndicator={false}
            style={[styles.scrollView, { height: visibleLines * lineHeight }]}
          >
            {displayLines.map((line, index: number) => {
              const isFocusedLine = line.number === focusedLineNumber + 1;

              return (
                <View
                  key={line.number}
                  style={[styles.line, { height: lineHeight }]}
                >
                  {showLineNumbers && (
                    <Text style={[styles.number, lineNumberStyle]}>
                      {line.number}
                    </Text>
                  )}
                  <Text
                    numberOfLines={1}
                    style={[
                      styles.text,
                      lineTextStyle,
                      isFocusedLine && styles.focusedText,
                    ]}
                  >
                    {line.text}
                  </Text>
                </View>
              );
            })}

            <View style={{ height: (visibleLines - 1) * lineHeight - 35 }} />
          </ScrollView>
          <Animated.View
            style={[
              styles.fadeOverlay,
              fadeStyle,
              {
                height:
                  typeof gradientHeight === "number"
                    ? gradientHeight
                    : gradientHeight,
              } as any,
            ]}
          >
            <LinearGradient
              colors={gradientColors as any}
              locations={gradientLocations as any}
              style={StyleSheet.absoluteFill}
            />
          </Animated.View>
        </View>
      </View>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  codeContainer: {
    width: "100%",
    position: "relative",
  },
  scrollView: {
    borderRadius: 8,
    overflow: "hidden",
  },
  line: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    position: "relative",
  },
  number: {
    width: 32,
    textAlign: "right",
    marginRight: 12,
    fontFamily: "monospace",
    color: "#6B7280",
    fontSize: 12,
  },
  text: {
    flex: 1,
    fontFamily: "monospace",
    fontSize: 12,
    color: "#E5E7EB",
  },
  focusedText: {
    color: "#FFFFFF",
    opacity: 1,
  },
  fadeOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "60%",
    pointerEvents: "none",
  },
});

export default memo<React.FC<IThinkingState>>(LoadingState);
