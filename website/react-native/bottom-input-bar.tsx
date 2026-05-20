import {
  StyleProp,
  StyleSheet,
  TextInput,
  View,
  type TextStyle,
  type TextInputContentSizeChangeEvent,
  type ViewStyle,
} from "react-native";
import React, { useCallback, useMemo, memo, useEffect } from "react";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  interpolate,
  Extrapolation,
} from "react-native-reanimated";
import type { IBottomInputBar, IIconGroups, IInputContent } from "./types";
import { ICON_BAR_HEIGHT, PADDING, SPRING_CONFIG } from "./conf";

const InputContent = memo<IInputContent>(
  ({
    value,
    onChangeText,
    placeholder,
    placeholderTextColor,
    multiline,
    inputMaxHeight,
    inputStyle,
    onContentSizeChange,
    textInputProps,
  }: IInputContent) => {
    const textInputRef = React.useRef<TextInput>(null);

    // This little hack help to reset the TextInput content properly on unmount, also controls the "onContentSizeChange" prop.
    useEffect(() => {
      textInputRef?.current?.setNativeProps({ text: " " });
      textInputRef?.current?.setNativeProps({ text: "" });

      return () => {
        textInputRef?.current?.setNativeProps({ text: " " });
        textInputRef?.current?.setNativeProps({ text: "" });
      };
    }, []);

    const textInputStyles = useMemo<StyleProp<TextStyle>>(
      () => [styles.input, { maxHeight: inputMaxHeight }, inputStyle],
      [inputMaxHeight, inputStyle],
    );

    return (
      <TextInput
        ref={textInputRef}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        style={textInputStyles}
        placeholderTextColor={placeholderTextColor}
        multiline={multiline}
        onContentSizeChange={onContentSizeChange}
        {...textInputProps}
      />
    );
  },
);

const IconGroups = memo<IIconGroups>(
  ({ renderLeftAccessory, renderRightAccessory }) => {
    if (!renderLeftAccessory && !renderRightAccessory) return null;

    return (
      <View style={styles.iconGroupsContainer}>
        {renderLeftAccessory && (
          <View style={styles.iconGroup}>{renderLeftAccessory()}</View>
        )}
        {renderRightAccessory && (
          <View style={styles.iconGroup}>{renderRightAccessory()}</View>
        )}
      </View>
    );
  },
);

const BottomInputBar: React.FC<IBottomInputBar> &
  React.FunctionComponent<IBottomInputBar> = memo<IBottomInputBar>(
  ({
    value,
    onChangeText,
    placeholder = "Chat with Explore...",
    placeholderTextColor = "#999",
    multiline = true,
    maxHeight = 200,
    minHeight = 100,
    renderLeftAccessory,
    renderRightAccessory,
    onSend,
    style,
    inputStyle,
    containerStyle,
    ...textInputProps
  }: IBottomInputBar): React.ReactNode => {
    const contentHeight = useSharedValue<number>(minHeight);
    const targetHeight = useSharedValue<number>(minHeight);

    const inputMaxHeight = useMemo(
      () => maxHeight - ICON_BAR_HEIGHT - PADDING,
      [maxHeight],
    );

    const handleContentSizeChange = useCallback<
      <T extends TextInputContentSizeChangeEvent>(event: T) => void
    >(
      <T extends TextInputContentSizeChangeEvent>(event: T) => {
        "worklet";
        const contentSize = event.nativeEvent.contentSize.height;
        console.log("Content Size Height:", contentSize);
        const newHeight = Math.min(
          Math.max(contentSize + ICON_BAR_HEIGHT + PADDING, minHeight),
          maxHeight,
        );
        targetHeight.value = newHeight;
        contentHeight.value = withSpring<number>(newHeight, SPRING_CONFIG);
      },
      [minHeight, maxHeight, contentHeight, targetHeight],
    );

    const animatedWrapperStyle = useAnimatedStyle<
      Pick<ViewStyle, "height" | "borderRadius">
    >(() => {
      const borderRadius = interpolate(
        contentHeight.value,
        [minHeight, minHeight + 20, minHeight + 50, maxHeight],
        [24, 20, 18, 16],
        Extrapolation.CLAMP,
      );

      return {
        height: contentHeight.value,
        borderRadius,
      };
    });

    const animatedContainerStyle = useAnimatedStyle<Pick<ViewStyle, "opacity">>(
      () => {
        const opacity = interpolate(
          contentHeight.value,
          [minHeight, maxHeight],
          [1, 0.98],
          Extrapolation.CLAMP,
        );

        return {
          opacity,
        };
      },
    );

    const animatedInputContainerStyle = useAnimatedStyle<
      Pick<ViewStyle, "paddingBottom">
    >(() => {
      const paddingBottom = interpolate(
        contentHeight.value,
        [minHeight, maxHeight],
        [0, 8],
        Extrapolation.CLAMP,
      );

      return {
        paddingBottom,
      };
    });

    return (
      <Animated.View style={[styles.wrapper, animatedWrapperStyle, style]}>
        <Animated.View
          style={[styles.container, containerStyle, animatedContainerStyle]}
        >
          <Animated.View
            style={[styles.inputContainer, animatedInputContainerStyle]}
          >
            <InputContent
              value={value}
              onChangeText={onChangeText}
              placeholder={placeholder}
              placeholderTextColor={placeholderTextColor}
              multiline={multiline}
              inputMaxHeight={inputMaxHeight}
              inputStyle={inputStyle}
              onContentSizeChange={handleContentSizeChange}
              textInputProps={textInputProps}
            />
          </Animated.View>

          <IconGroups
            renderLeftAccessory={renderLeftAccessory}
            renderRightAccessory={renderRightAccessory}
          />
        </Animated.View>
      </Animated.View>
    );
  },
);

export default memo<React.FC<IBottomInputBar>>(BottomInputBar);

const styles = StyleSheet.create({
  wrapper: {
    padding: 16,
    width: 380,
  },
  container: {
    flex: 1,
    justifyContent: "space-between",
  },
  inputContainer: {
    paddingHorizontal: 12,
  },
  input: {
    fontSize: 16,
    color: "#fff",
    textAlignVertical: "top",
    paddingTop: 0,
    paddingBottom: 0,
  },
  iconGroupsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingTop: 8,
  },
  iconGroup: {
    flexDirection: "row",
    gap: 16,
  },
  iconButton: {
    padding: 4,
  },
});
