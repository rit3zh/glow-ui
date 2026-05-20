import React, { useEffect } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  useWindowDimensions,
  TouchableOpacity,
  ScrollView,
  Pressable,
} from "react-native";
import BackgroundGradient from "./background-gradient";
import { useFonts } from "expo-font";
import { SafeAreaView } from "react-native-safe-area-context";
import { useResponsive } from "@/helpers/hooks/use-responsive";
import { AntDesign } from "@expo/vector-icons";

export default function SignUpV1() {
  const { width } = useWindowDimensions();
  const screen = useResponsive();
  const [fontLoaded] = useFonts({
    SfProRounded: require("@/assets/fonts/sf-pro-rounded.ttf"),
    HelveticaNowDisplay: require("@/assets/fonts/HelveticaNowDisplayMedium.ttf"),
  });

  return (
    <BackgroundGradient>
      <SafeAreaView style={styles.container}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.scrollContainer,
            {
              paddingTop: screen.rv<number>({
                compact: screen.height * 0.11,

                medium: screen.height * 0.18,
                expanded: screen.height * 0.13,
              }),
            },
          ]}
        >
          <View style={styles.headingContainer}>
            <Text
              style={[
                styles.headingCoreText,
                {
                  fontFamily: fontLoaded ? "HelveticaNowDisplay" : undefined,
                  fontSize: screen.rf(28),
                },
              ]}
            >
              Sign Up
            </Text>
          </View>

          <Text
            style={[
              styles.headingSubtitle,
              {
                fontFamily: fontLoaded ? "SfProRounded" : undefined,
              },
            ]}
          >
            Let's kick things off by creating your account.
          </Text>

          <View
            style={[
              styles.headingButtonContainer,
              {
                marginTop: screen.rv<number>({
                  compact: 40,
                  medium: 32,
                  expanded: 36,
                }),
              },
            ]}
          >
            <Pressable
              style={[
                styles.headingSocialsButton,
                {
                  paddingHorizontal: screen.rv<number>({
                    compact: 45,
                    medium: 20,
                    expanded: screen.width * 0.15,
                  }),
                },
              ]}
            >
              <AntDesign name="google" size={22} color="#fff" />
              <Text
                style={[
                  styles.socialIconsText,
                  {
                    fontFamily: fontLoaded ? "SfProRounded" : undefined,
                  },
                ]}
              >
                Google
              </Text>
            </Pressable>

            <Pressable
              style={[
                styles.headingSocialsButton,
                {
                  paddingHorizontal: screen.rv<number>({
                    compact: 45,
                    medium: 20,
                    expanded: screen.width * 0.15,
                  }),
                },
              ]}
            >
              <AntDesign name="github" size={22} color="#fff" />
              <Text
                style={[
                  styles.socialIconsText,
                  {
                    fontFamily: fontLoaded ? "SfProRounded" : undefined,
                  },
                ]}
              >
                Github
              </Text>
            </Pressable>
          </View>

          <View
            style={[
              styles.dividerContainer,
              {
                marginTop: screen.rv<number>({
                  compact: 40,
                  medium: 30,
                  expanded: 40,
                }),
              },
            ]}
          >
            <View
              style={[
                styles.divider,
                {
                  width: screen.rv<number>({
                    compact: 150,
                    medium: width * 0.35,
                    expanded: width * 0.35,
                  }),
                },
              ]}
            />
            <Text
              style={[
                styles.dividerText,
                {
                  fontFamily: fontLoaded ? "SfProRounded" : undefined,
                },
              ]}
            >
              OR
            </Text>
            <View
              style={[
                styles.divider,
                {
                  width: screen.rv<number>({
                    compact: 150,
                    medium: width * 0.35,
                    expanded: width * 0.35,
                  }),
                },
              ]}
            />
          </View>

          <View style={styles.inputContainerBox}>
            <Text
              style={[
                styles.inputLabel,
                {
                  fontSize: screen.rf(15),
                  fontFamily: fontLoaded ? "SfProRounded" : undefined,
                },
              ]}
            >
              Email
            </Text>

            <View style={styles.inputContainer}>
              <TextInput
                cursorColor={"#d1a0f2"}
                selectionColor={"#d1a0f2"}
                placeholder="eg.reacticxislove@gmail.com"
                placeholderTextColor="rgba(255,255,255,0.6)"
                autoCapitalize="none"
                style={[
                  styles.textInput,
                  {
                    fontFamily: fontLoaded ? "SfProRounded" : undefined,
                  },
                ]}
              />
            </View>
          </View>
          <View style={styles.inputContainerBox}>
            <Text
              style={[
                styles.inputLabel,
                {
                  fontSize: screen.rf(15),
                  fontFamily: fontLoaded ? "SfProRounded" : undefined,
                },
              ]}
            >
              Password
            </Text>

            <View style={styles.inputContainer}>
              <TextInput
                cursorColor={"#d1a0f2"}
                selectionColor={"#d1a0f2"}
                secureTextEntry
                placeholder="Enter your password"
                placeholderTextColor="rgba(255,255,255,0.6)"
                autoCapitalize="none"
                style={[
                  styles.textInput,
                  {
                    fontFamily: fontLoaded ? "SfProRounded" : undefined,
                  },
                ]}
              />
            </View>
          </View>

          <View style={styles.inputContainerBox}>
            <Text
              style={[
                styles.inputLabel,
                {
                  fontSize: screen.rf(15),
                  fontFamily: fontLoaded ? "SfProRounded" : undefined,
                },
              ]}
            >
              Confirm Password
            </Text>

            <View style={styles.inputContainer}>
              <TextInput
                cursorColor={"#d1a0f2"}
                selectionColor={"#d1a0f2"}
                autoCapitalize="none"
                secureTextEntry
                placeholder="Enter your password again"
                placeholderTextColor="rgba(255,255,255,0.6)"
                style={[
                  styles.textInput,
                  {
                    fontFamily: fontLoaded ? "SfProRounded" : undefined,
                  },
                ]}
              />
            </View>
          </View>

          <Pressable
            style={[
              styles.signUpButton,
              {
                marginTop: screen.rv<number>({
                  compact: 40,
                  medium: 30,
                  expanded: 36,
                }),
              },
            ]}
          >
            <Text
              style={[
                styles.signUpButtonText,
                {
                  fontSize: screen.rf(15),
                  fontFamily: fontLoaded ? "HelveticaNowDisplay" : undefined,
                },
              ]}
            >
              Sign Up
            </Text>
          </Pressable>

          <Text
            style={[
              styles.footerText,
              {
                fontFamily: fontLoaded ? "SfProRounded" : undefined,
                fontSize: screen.rf(14),
              },
            ]}
          >
            Already have an account? <Text style={styles.loginText}>Login</Text>
          </Text>
        </ScrollView>
      </SafeAreaView>
    </BackgroundGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  scrollContainer: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },

  headingContainer: {
    alignItems: "center",
  },

  headingCoreText: {
    color: "#fff",
    marginBottom: 12,
  },

  headingSubtitle: {
    fontSize: 16,
    color: "#e6e6e6",
    textAlign: "center",
  },

  headingButtonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 16,
  },

  headingSocialsButton: {
    flexDirection: "row",

    alignItems: "center",
    gap: 12,
    borderWidth: 0.5,
    borderColor: "#e3e3e3",
    paddingVertical: 12,
    borderRadius: 12,
  },

  socialIconsText: {
    color: "#fff",
    fontSize: 16,
  },

  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
  },

  divider: {
    height: 0.5,
    backgroundColor: "#e3e3e3",
  },

  dividerText: {
    color: "#e3e3e3",
    fontSize: 14,
  },

  inputContainerBox: {
    marginTop: 28,
  },

  inputLabel: {
    color: "#e6e6e6",
    marginBottom: 8,
  },

  inputContainer: {
    height: 50,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 10,
    justifyContent: "center",
  },

  textInput: {
    flex: 1,
    paddingHorizontal: 16,
    color: "#fff",
  },

  signUpButton: {
    backgroundColor: "#fff",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
  },

  signUpButtonText: {
    color: "#000",
  },

  footerText: {
    textAlign: "center",
    color: "#e6e6e6",
    marginTop: 18,
  },

  loginText: {
    color: "#fff",
    fontWeight: "600",
  },
});
