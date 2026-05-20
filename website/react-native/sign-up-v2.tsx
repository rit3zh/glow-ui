// @ts-ignore
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Pressable,
} from "react-native";
import React from "react";
import { GridBackground } from "./background-grid";
import { useFonts } from "expo-font";
import { SafeAreaView } from "react-native-safe-area-context";
import { useResponsive } from "@/helpers/hooks/use-responsive";
import { AntDesign, Ionicons } from "@expo/vector-icons";
export default function SignUpV2() {
  const [fontLoaded] = useFonts({
    SfProRounded: require("@/assets/fonts/sf-pro-rounded.ttf"),
    HelveticaNowDisplay: require("@/assets/fonts/HelveticaNowDisplayMedium.ttf"),
  });

  const screen = useResponsive();

  return (
    <GridBackground
      cellSize={55}
      lineColor="rgba(255, 255, 255, 0.5)"
      showVignette={true}
      showTopFade={false}
    >
      <SafeAreaView style={styles.container}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.scrollContainer,
            {
              paddingTop: screen.rv<number>({
                compact: screen.height * 0.1,

                medium: screen.height * 0.18,
                expanded: screen.height * 0.13,
              }),
            },
          ]}
        >
          <View style={styles.heading}>
            <Text
              style={[
                styles.headingLabel,
                {
                  color: "#fff",
                  letterSpacing: -0.5,
                  fontSize: screen.rf(42),
                },
                {
                  fontFamily: fontLoaded ? "HelveticaNowDisplay" : undefined,
                },
              ]}
            >
              Create Account
            </Text>
            <Text
              style={[
                styles.headingSubtitle,
                {
                  fontFamily: fontLoaded ? "SfProRounded" : undefined,
                  fontSize: screen.rv({
                    compact: screen.rf(13),
                    medium: 16,
                    expanded: 18,
                  }),
                },
              ]}
            >
              Happy to see you here! Let's start by creating your account.
            </Text>
          </View>

          <View
            style={[
              styles.inputFieldBoxContainer,
              {
                paddingTop: screen.rv<number>({
                  compact: screen.width * 0.12,
                  medium: screen.width * 0.18,
                  expanded: screen.width * 0.13,
                }),
              },
            ]}
          >
            <Text
              style={[
                styles.inputLabelField,
                {
                  fontSize: screen.rf(18),
                  fontFamily: fontLoaded ? "HelveticaNowDisplay" : undefined,
                },
              ]}
            >
              Email Address
            </Text>
            <View style={styles.inputContainer}>
              <TextInput
                placeholder="eg.reacticxislove@gmail.com"
                placeholderTextColor="rgba(255,255,255,0.6)"
                style={[
                  styles.textInput,
                  {
                    fontFamily: fontLoaded ? "SfProRounded" : undefined,
                  },
                ]}
              />
            </View>
            <Text
              style={[
                styles.inputLabelField,
                {
                  fontSize: screen.rf(18),
                  fontFamily: fontLoaded ? "HelveticaNowDisplay" : undefined,
                },
              ]}
            >
              Password
            </Text>
            <View style={styles.inputContainer}>
              <View style={styles.inputSecureFieldContainer}>
                <TextInput
                  placeholder="Enter your password"
                  placeholderTextColor="rgba(255,255,255,0.6)"
                  style={[
                    styles.textInput,
                    {
                      fontFamily: fontLoaded ? "SfProRounded" : undefined,
                    },
                  ]}
                />
                <View style={styles.eyeIconContainer}>
                  <Ionicons name="eye-sharp" size={22} color="#dbdbdb" />
                </View>
              </View>
              <View
                style={[
                  styles.forgotPasswordAbsoluteContainer,
                  {
                    top: -screen.rf(30),
                  },
                ]}
              >
                <Text
                  style={[
                    styles.forgotPasswordText,
                    {
                      fontFamily: fontLoaded ? "SfProRounded" : undefined,
                      fontSize: screen.rf(13),
                    },
                  ]}
                >
                  Forgot Password?
                </Text>
              </View>
            </View>

            <Text
              style={[
                styles.tos,
                {
                  fontFamily: fontLoaded ? "SfProRounded" : undefined,
                  fontSize: screen.rf(13),
                },
              ]}
            >
              I agree to the Terms and Conditions and Privacy Policy
            </Text>
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
                    compact: 120,
                    medium: screen.width * 0.35,
                    expanded: screen.width * 0.4,
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
                    compact: 120,
                    medium: screen.width * 0.35,
                    expanded: screen.width * 0.4,
                  }),
                },
              ]}
            />
          </View>
          <View
            style={[
              styles.socialButtonContainer,
              {
                paddingTop: screen.rv<number>({
                  compact: 30,
                  medium: 20,
                  expanded: 30,
                }),
              },
            ]}
          >
            <Pressable
              style={[
                styles.socialLoginButton,
                {
                  paddingHorizontal: screen.rv<number>({
                    compact: 45,
                    medium: 20,
                    expanded: screen.width * 0.15,
                  }),
                },
              ]}
            >
              <AntDesign name="apple" size={22} color="#fff" />
              <Text
                style={[
                  styles.socialIconsText,
                  {
                    fontFamily: fontLoaded ? "SfProRounded" : undefined,
                  },
                ]}
              >
                Continue using Apple
              </Text>
            </Pressable>
            <Pressable
              style={[
                styles.socialLoginButton,
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
                Continue using Google
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
              Already have an account?{" "}
              <Text style={styles.loginText}>Sign In</Text>
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </GridBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    paddingHorizontal: 18,
    paddingBottom: 40,
  },
  heading: {
    gap: 4,
  },
  headingLabel: {
    color: "#fff",
    letterSpacing: -0.5,
  },
  headingSubtitle: {
    color: "#dbdbdb",
  },
  inputFieldBoxContainer: {
    gap: 12,
  },
  inputLabelField: {
    color: "#fff",
  },
  inputContainer: {
    height: 50,
    backgroundColor: "#121212",
    borderRadius: 10,
    justifyContent: "center",
    marginBottom: 16,
  },
  textInput: {
    flex: 1,
    paddingHorizontal: 16,
    color: "#fff",
  },
  inputSecureFieldContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  eyeIconContainer: {
    paddingRight: 20,
  },
  forgotPasswordAbsoluteContainer: {
    position: "absolute",

    right: 0,
  },
  forgotPasswordText: {
    color: "#dbdbdb",
  },
  tos: {
    color: "#dbdbdb",
    letterSpacing: -0.3,
  },
  signUpButton: {
    backgroundColor: "#fff",
    paddingVertical: 16,

    borderRadius: 99,
    alignItems: "center",
  },
  signUpButtonText: {
    color: "#000",
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
  },

  divider: {
    height: 0.28,
    backgroundColor: "#fff",
  },

  dividerText: {
    color: "#e3e3e3",
    fontSize: 14,
  },

  socialButtonContainer: {
    gap: 18,
  },
  socialLoginButton: {
    flexDirection: "row",

    alignItems: "center",
    gap: 12,
    justifyContent: "center",
    borderColor: "#e3e3e3",
    borderWidth: 0.5,
    paddingVertical: 12,
    borderRadius: 15,
  },

  socialIconsText: {
    color: "#fff",
    fontSize: 16,
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
