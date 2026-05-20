import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  type ViewStyle,
} from "react-native";
import React, { memo } from "react";
import Animated, {
  interpolate,
  interpolateColor,
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { Feather, Ionicons } from "@expo/vector-icons";
import QRCodeStyled from "react-native-qrcode-styled";
import { BlurView, type BlurViewProps } from "expo-blur";
import type { QRCodeProps } from "./types";
import { BACKGROUND_COLOR, QR_URL, TIMING_CONFIG } from "./const";
const AnimatedQRCodeStyled = Animated.createAnimatedComponent(QRCodeStyled);
const AnimatedBlurView =
  Animated.createAnimatedComponent<BlurViewProps>(BlurView);

const QRCode: React.FC<QRCodeProps> & React.FunctionComponent<QRCodeProps> =
  memo<QRCodeProps>(
    ({
      QRCodevalue,
      timingConfig = TIMING_CONFIG,
      textStyle,
      backgroundColorFocused = BACKGROUND_COLOR,
    }: QRCodeProps):
      | (React.ReactNode & React.JSX.Element & React.ReactElement)
      | null => {
      const progress = useSharedValue<number>(0);

      const containerStylez = useAnimatedStyle<
        Pick<ViewStyle, "width" | "height" | "borderRadius" | "backgroundColor">
      >(() => {
        return {
          width: interpolate(progress.value, [0, 1], [200, 250]),
          height: interpolate(progress.value, [0, 1], [50, 320]),
          borderRadius: interpolate(progress.value, [0, 1], [100, 25]),
          backgroundColor: interpolateColor(
            progress.value,
            [0, 1],
            [BACKGROUND_COLOR, backgroundColorFocused],
          ),
        };
      });

      const textContainerStyle = useAnimatedStyle<Pick<ViewStyle, "opacity">>(
        () => {
          return {
            opacity: interpolate(progress.value, [0, 1], [1, 0]),
          };
        },
      );

      const qrCodeStylez = useAnimatedStyle<
        Pick<ViewStyle, "opacity" | "transform">
      >(() => {
        const translateY = interpolate(progress.value, [0, 1], [0, -35]);
        return {
          opacity: interpolate(progress.value, [0, 1], [0, 1]),
          transform: [{ translateY }],
        };
      });

      const buttonsStyle = useAnimatedStyle<
        Pick<ViewStyle, "opacity" | "transform">
      >(() => {
        const translateY = interpolate(progress.value, [0, 1], [0, 10]);
        return {
          opacity: interpolate(progress.value, [0, 1], [0, 1]),
          transform: [{ translateY }],
        };
      });
      const onPress = () => {
        if (progress.value === 1) {
          progress.value = withTiming<number>(0, timingConfig);
          return;
        }
        progress.value = withTiming<number>(1, timingConfig);
      };
      const handleCopy = async () => {};
      const handleClose = () => {
        progress.value = withTiming<number>(0, timingConfig);
      };
      const animatedBlurViewPropz = useAnimatedProps<
        Pick<BlurViewProps, "intensity">
      >(() => {
        const intensity = interpolate(progress.value, [0, 1], [20, 1]);
        return {
          intensity,
        };
      });
      const animatedQRStylez = useAnimatedStyle<
        Pick<ViewStyle, "borderRadius" | "backgroundColor">
      >(() => {
        return {
          borderRadius: interpolate(progress.value, [0, 1], [100, 30]),
          backgroundColor: interpolateColor(
            progress.value,
            [0, 1],
            [BACKGROUND_COLOR, backgroundColorFocused],
          ),
        };
      });

      const animatedBlurViewPropsBottom = useAnimatedProps<
        Pick<BlurViewProps, "intensity">
      >(() => {
        const intensity = interpolate(progress.value, [0, 0.5, 1], [0, 50, 0]);
        return {
          intensity,
        };
      });

      return (
        <Pressable onPress={onPress}>
          <Animated.View style={[styles.container, containerStylez]}>
            <Animated.View style={[styles.textContainer, textContainerStyle]}>
              <Ionicons name="qr-code-outline" size={24} color="black" />

              <Text style={[styles.text, textStyle]}>Show QR Code</Text>
            </Animated.View>

            <Animated.View style={[styles.qrContainer, qrCodeStylez]}>
              <AnimatedQRCodeStyled
                data={QRCodevalue ?? QR_URL}
                // style={{ borderRadius: 30, backgroundColor: "red" }}
                style={animatedQRStylez}
                padding={20}
                size={190}
              />
              <AnimatedBlurView
                tint="systemChromeMaterialLight"
                animatedProps={[animatedBlurViewPropz]}
                style={[
                  StyleSheet.absoluteFillObject,
                  {
                    overflow: "hidden",
                    borderRadius: 30,
                  },
                ]}
              />
            </Animated.View>

            <Animated.View style={[styles.buttonsContainer, buttonsStyle]}>
              <Pressable style={styles.button} onPress={handleCopy}>
                <Feather name="copy" size={20} color="black" />
                <Text style={[styles.buttonText, textStyle]}>Copy Link</Text>
              </Pressable>

              <Pressable style={styles.closeButton} onPress={handleClose}>
                <Feather name="x" size={20} color="black" />
              </Pressable>
            </Animated.View>

            {Platform.OS === "ios" && (
              <AnimatedBlurView
                pointerEvents={"none"}
                tint="systemUltraThinMaterialLight"
                animatedProps={animatedBlurViewPropsBottom}
                style={[
                  StyleSheet.absoluteFillObject,
                  {
                    overflow: "hidden",
                    borderRadius: 30,
                  },
                ]}
              />
            )}
          </Animated.View>
        </Pressable>
      );
    },
  );

export default memo<
  React.FC<QRCodeProps> & React.FunctionComponent<QRCodeProps>
>(QRCode);

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
  textContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    position: "absolute",
  },
  qrContainer: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: "#000",
    fontSize: 16,
    fontWeight: "500",
  },
  buttonsContainer: {
    position: "absolute",
    bottom: 20,
    flexDirection: "row",
    gap: 12,
  },
  button: {
    backgroundColor: "#fff",
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 38,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  closeButton: {
    backgroundColor: "#fff",
    borderRadius: 100,
    flexDirection: "row",
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
  },
  buttonText: {
    color: "#000",
    fontSize: 14,
    fontWeight: "700",
  },
});
