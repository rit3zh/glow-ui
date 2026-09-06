import { View, Text, StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import { useFonts } from "expo-font";
import { useState } from "react";
import { SymbolView } from "expo-symbols";
import OtpInput from "@/components/base/otp-input";
import { FadeInUp } from "react-native-reanimated";
import { Showcase } from "~/showcase";

const wait = async <T extends number>(ms: T): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

export default function App() {
  const [fontLoaded] = useFonts({
    SfProRounded: require("@/assets/fonts/sf-pro-rounded.ttf"),
    HelveticaNowDisplay: require("@/assets/fonts/HelveticaNowDisplayMedium.ttf"),
  });

  const [code, setCode] = useState<string>("");
  const [error, setError] = useState<boolean>(false);

  return (
    <Showcase>
      <GestureHandlerRootView style={styles.container}>
        <StatusBar style="light" />

        <View style={styles.content}>
          <View style={styles.inputWrapper}>
            <OtpInput
              onInputChange={setCode}
              otpCount={4}
              animationVariant="fadeSlideDown"
              focusedBackgroundColor="#000000"
              enableAutoFocus={true}
              unfocusedBackgroundColor="#000000"
              focusedBorderColor="#b4adad"
              unfocusedBorderColor="#4f4f4f"
              errorBackgroundColor="#2d1f1f"
              errorBorderColor="#f44336"
              enteringAnimated={FadeInUp}
              inputBorderRadius={10}
              inputHeight={70}
              error={error}
              textStyle={{
                fontFamily: fontLoaded ? "HelveticaNowDisplay" : undefined,
                fontSize: 24,
              }}
              onInputFinished={(input: string) => {
                if (input !== "2342") {
                  setError(true);
                  wait<number>(2000).then<void, never>(() => {
                    setError(false);
                  });
                } else {
                  alert("Verification successful!");
                }
              }}
              inputWidth={70}
            />
          </View>

          <Text
            style={[
              styles.resend,
              fontLoaded && { fontFamily: "SfProRounded" },
            ]}
          >
            Resend code
          </Text>
        </View>
      </GestureHandlerRootView>
    </Showcase>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a0a0a",
    paddingHorizontal: 32,
  },
  content: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  iconBox: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: "#1a1a1a",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#fff",
  },
  subtitle: {
    fontSize: 15,
    color: "#555",
    textAlign: "center",
  },
  inputWrapper: {
    marginVertical: 24,
  },
  resend: {
    fontSize: 14,
    color: "#666",
    textDecorationLine: "underline",
  },
});
