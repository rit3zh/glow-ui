import React, {
  createContext,
  memo,
  useContext,
  useEffect,
  useRef,
  useState,
  type FC,
  type FunctionComponent,
} from "react";
import {
  Dimensions,
  Keyboard,
  Pressable,
  StyleSheet,
  TextInput,
  View,
  type ViewStyle,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withSpring,
  FadeInDown,
  FadeOutDown,
  LinearTransition,
  interpolateColor,
} from "react-native-reanimated";
import type { IOtpInput, IOtpContext, IOtpItem } from "./types";
import { ANIMATION_VARIATIONS } from "./const";

const { width: WIDTH } = Dimensions.get("window");
const OtpContext = createContext<IOtpContext>({} as IOtpContext);

const OtpItem: FC<IOtpItem> & FunctionComponent<IOtpItem> = ({
  index,
}: IOtpItem):
  | (React.ReactNode & React.JSX.Element & React.ReactElement)
  | null => {
  const {
    inputRef,
    onPress,
    otpValue,
    onFocusNext,
    onFocusPrevious,
    setFocus,
    setOtpValue,
    focus,
    autoFocus,
    containerStyle,
    otpInputStyle,
    textStyle,
    otpCount = 6,
    editable,
    error,
    rest,
    inputBorderRadius,
    inputHeight,
    inputWidth,
    animationVariant = "fadeSlideDown",
    focusedBackgroundColor = "#0f0f23",
    unfocusedBackgroundColor = "#1a1a2e",
    focusedBorderColor = "rgba(248, 250, 252, 1)",
    unfocusedBorderColor = "rgba(248, 250, 252, 0.3)",
    errorBackgroundColor = "#1c0a0a",
    errorBorderColor = "#ef4444",
  }: IOtpContext = useContext<IOtpContext>(OtpContext);

  const borderWidth = useSharedValue<number>(focus === index ? 2 : 1);
  const inputScale = useSharedValue<number>(1);
  const focusProgress = useSharedValue<number>(focus === index ? 1 : 0);
  const errorProgress = useSharedValue<number>(error ? 1 : 0);

  const animations = ANIMATION_VARIATIONS[animationVariant];

  useEffect(() => {
    borderWidth.value = withTiming<number>(focus === index ? 2 : 1, {
      duration: 1200,
    });
    focusProgress.value = withTiming<number>(focus === index ? 1 : 0, {
      duration: 200,
    });

    if (focus === index) {
      inputScale.value = withSequence<number>(
        withSpring(1.05, { damping: 50, stiffness: 120, mass: 0.5 }),
        withSpring(1, { damping: 50, stiffness: 120, mass: 0.5 }),
      );
    }
  }, [focus]);

  useEffect(() => {
    errorProgress.value = withTiming<number>(error ? 1 : 0, {
      duration: 200,
    });
  }, [error]);

  useEffect(() => {
    if (otpValue) {
      if ((otpValue[index]?.length ?? 0) > 1) {
        const format = otpValue[index]?.substring(0, otpCount);
        const numbers = format?.split("") ?? [];
        setOtpValue(numbers);
        setFocus(-1);
        Keyboard.dismiss();
      }
    }
  }, [otpValue]);

  const animatedInputStyle = useAnimatedStyle<
    Pick<
      ViewStyle,
      "borderWidth" | "borderColor" | "backgroundColor" | "transform"
    >
  >(() => {
    const normalBg = interpolateColor(
      focusProgress.value,
      [0, 1],
      [unfocusedBackgroundColor, focusedBackgroundColor],
    );

    const backgroundColor = interpolateColor(
      errorProgress.value,
      [0, 1],
      [normalBg, errorBackgroundColor],
    );

    const normalBorder = interpolateColor(
      focusProgress.value,
      [0, 1],
      [unfocusedBorderColor, focusedBorderColor],
    );

    const borderColor = interpolateColor(
      errorProgress.value,
      [0, 1],
      [normalBorder, errorBorderColor],
    );

    return {
      borderWidth: borderWidth.value,
      borderColor,
      backgroundColor,
      transform: [{ scale: inputScale.value }],
    };
  });

  const getTextStyle = () => {
    if (error) {
      return [styles.text, styles.textError, textStyle];
    }
    return [styles.text, textStyle];
  };

  return (
    <View key={index} style={[containerStyle]}>
      <TextInput
        style={[
          styles.inputSize,
          otpInputStyle,
          {
            color: "transparent",
            width: inputWidth,
            height: inputHeight,
            borderRadius: inputBorderRadius,
          },
        ]}
        caretHidden
        keyboardType="number-pad"
        ref={inputRef.current[index]}
        value={otpValue[index]}
        onChangeText={(v) => onFocusNext(v, index)}
        onKeyPress={(e) => onFocusPrevious(e.nativeEvent.key, index)}
        textContentType="oneTimeCode"
        autoFocus={autoFocus && index === 0}
        {...rest}
      />
      <Pressable disabled={!editable} onPress={onPress} style={styles.overlay}>
        <Animated.View
          layout={LinearTransition.springify()}
          style={[
            styles.input,
            styles.inputSize,
            {
              width: inputWidth,
              height: inputHeight,
              borderRadius: inputBorderRadius,
            },
            animatedInputStyle,
          ]}
        >
          {otpValue[index] !== "" && (
            <Animated.Text
              entering={animations.entering}
              exiting={animations.exiting}
              style={getTextStyle()}
            >
              {otpValue[index]}
            </Animated.Text>
          )}
        </Animated.View>
      </Pressable>
    </View>
  );
};

export const OtpInput: FC<IOtpInput> & FunctionComponent<IOtpInput> =
  memo<IOtpInput>(
    ({
      otpCount = 6,
      containerStyle = {},
      otpInputStyle = {},
      textStyle = {},
      focusedColor = "#f8fafc",
      editable = true,
      enteringAnimated = FadeInDown,
      exitingAnimated = FadeOutDown,
      onInputFinished,
      onInputChange,
      error = false,
      errorMessage = "Invalid OTP. Please try again.",
      inputBorderRadius = 20,
      inputWidth = 60,
      inputHeight = 60,
      animationVariant = "fadeSlideDown",
      focusedBackgroundColor = "#0f0f23",
      unfocusedBackgroundColor = "#1a1a2e",
      focusedBorderColor = "rgba(248, 250, 252, 1)",
      unfocusedBorderColor = "rgba(248, 250, 252, 0.3)",
      errorBackgroundColor = "#1c0a0a",
      errorBorderColor = "#ef4444",
      ...rest
    }: IOtpInput):
      | (React.ReactNode & React.JSX.Element & React.ReactElement)
      | null => {
      const inputRef = useRef<any[]>([]);
      const data: string[] = new Array(otpCount).fill("");
      inputRef.current = data.map(
        (_, index) => (inputRef.current[index] = React.createRef<TextInput>()),
      );
      const [focus, setFocus] = useState<number>(0);
      const [otpValue, setOtpValue] = useState<string[]>(data);

      const opacity = useSharedValue<number>(1);
      const translateX = useSharedValue<number>(0);

      const onPress = () => {
        if (focus === -1) {
          setFocus(otpCount - 1);
          otpValue[data.length - 1] = "";
          setOtpValue([...otpValue]);
          inputRef.current[data.length - 1].current.focus();
        } else {
          inputRef.current[focus].current.focus();
        }
      };
      const onFocusNext = <V extends string, I extends number>(
        value: V,
        index: I,
      ) => {
        if (index < data.length - 1 && value) {
          inputRef.current[index + 1].current.focus();
          setFocus(index + 1);
        }
        if (index === data.length - 1) {
          setFocus(-1);
          inputRef.current[index].current.blur();
        }
        otpValue[index] = value;
        setOtpValue([...otpValue]);
      };
      const onFocusPrevious = <K extends string, I extends number>(
        key: K,
        index: I,
      ) => {
        if (key === "Backspace" && index !== 0) {
          inputRef.current[index - 1].current.focus();
          setFocus(index - 1);
          otpValue[index - 1] = "";
          setOtpValue([...otpValue]);
        } else if (key === "Backspace" && index === 0) {
          otpValue[0] = "";
        }
      };
      if (otpCount < 4 || otpCount > 6) {
        throw new Error("OTP Count min is 4 and max is 6");
      }
      const animatedContainerStyle = useAnimatedStyle<
        Pick<ViewStyle, "opacity" | "transform">
      >(() => ({
        opacity: opacity.value,
        transform: [{ translateX: translateX.value }],
      }));
      const triggerCompleteAnimation = (): void => {
        opacity.value = withSequence<number>(
          withTiming(0.6, { duration: 900 }),
          withTiming(1, { duration: 900 }),
        );
      };

      const triggerShakeAnimation = (): void => {
        translateX.value = withSequence<number>(
          withTiming(-4, { duration: 50 }),
          withTiming(4, { duration: 50 }),
          withTiming(-3, { duration: 50 }),
          withTiming(3, { duration: 50 }),
          withTiming(-2, { duration: 50 }),
          withTiming(2, { duration: 50 }),
          withTiming(0, { duration: 50 }),
        );
      };

      const inputProps: IOtpContext = {
        inputRef,
        otpValue,
        onPress,
        onFocusNext,
        onFocusPrevious,
        setFocus,
        setOtpValue,
        focus,
        containerStyle,
        otpInputStyle,
        textStyle,
        focusedColor,
        otpCount,
        editable,
        enteringAnimated,
        exitingAnimated,
        error,
        inputBorderRadius,
        inputWidth,
        inputHeight,
        animationVariant,
        focusedBackgroundColor,
        unfocusedBackgroundColor,
        focusedBorderColor,
        unfocusedBorderColor,
        errorBackgroundColor,
        errorBorderColor,
        ...rest,
      };

      useEffect(() => {
        onInputChange?.(otpValue?.join(""));
        if (
          otpValue &&
          otpValue.join("").length === otpCount &&
          onInputFinished
        ) {
          if (!error) {
            triggerCompleteAnimation();
          }
          onInputFinished(otpValue.join(""));
        }
      }, [otpValue]);

      useEffect(() => {
        if (error) {
          triggerShakeAnimation();
          const timeout = setTimeout(() => {
            otpValue.fill("");
            setOtpValue([...otpValue]);
            setFocus(0);
            inputRef.current[0].current.focus();
          }, 1000);
          return () => clearTimeout(timeout);
        }
      }, [error]);

      return (
        <OtpContext.Provider value={inputProps}>
          <Animated.View style={[styles.container]}>
            <Animated.View style={[styles.row, animatedContainerStyle]}>
              {data.map((_, i) => (
                <OtpItem key={i} index={i} />
              ))}
            </Animated.View>
            {error && errorMessage && (
              <Animated.Text
                entering={FadeInDown.duration(200)}
                exiting={FadeOutDown.duration(200)}
                style={styles.errorMessage}
              >
                {errorMessage}
              </Animated.Text>
            )}
          </Animated.View>
        </OtpContext.Provider>
      );
    },
  );

export default memo<FC<IOtpInput> & FunctionComponent<IOtpInput>>(OtpInput);

const styles = StyleSheet.create({
  container: {
    width: WIDTH,
    height: 120,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  inputSize: {
    marginHorizontal: 6,
  },
  input: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1a1a2e",
    borderWidth: 1,
    borderColor: "rgba(248, 250, 252, 0.2)",
  },
  inputFocused: {
    borderColor: "#f8fafc",
    backgroundColor: "#0f0f23",
  },
  inputError: {
    borderColor: "#ef4444",
    backgroundColor: "#1c0a0a",
  },
  text: {
    fontWeight: "600",
    fontSize: 18,
    color: "#f8fafc",
  },
  textError: {
    color: "#fecaca",
  },
  overlay: {
    position: "absolute",
  },
  errorMessage: {
    color: "#ef4444",
    fontSize: 14,
    fontWeight: "500",
    textAlign: "center",
    marginTop: 20,
    paddingHorizontal: 16,
  },
});
