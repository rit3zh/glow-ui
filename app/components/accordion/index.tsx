import { View, Text, StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import { useFonts } from "expo-font";
import { SymbolView } from "expo-symbols";
import { Accordion } from "@/components";
import { Fragment } from "react";
import { Stack } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
const FAQS = [
  {
    id: "1",
    question: "How do I get started?",
    answer:
      "Simply create an account and follow the onboarding steps. It only takes a minute.",
    icon: "questionmark.circle.fill",
  },
  {
    id: "2",
    question: "Is my data secure?",
    answer:
      "Yes, we use end-to-end encryption and never share your data with third parties.",
    icon: "lock.fill",
  },
  {
    id: "3",
    question: "Can I cancel anytime?",
    answer:
      "Absolutely. No contracts, no hidden fees. Cancel whenever you want.",
    icon: "xmark.circle.fill",
  },
];

export default function App() {
  const [fontLoaded] = useFonts({
    SfProRounded: require("@/assets/fonts/sf-pro-rounded.ttf"),
    SfProRoundedBold: require("~/assets/fonts/SF-Pro-Rounded-Bold.otf"),
    SfProRoundedMedium: require("~/assets/fonts/SF-Pro-Rounded-Medium.otf"),
  });

  const darkTheme = {
    backgroundColor: "#141414",
    borderColor: "#222",
    textColor: "#fff",
    iconColor: "#666",
  };

  const insets = useSafeAreaInsets();
  return (
    <Fragment>
      <Stack.Screen
        options={{
          headerBackVisible: true,
          headerShown: true,
          headerTitle: "",
          headerTransparent: true,
        }}
      />
      <GestureHandlerRootView
        style={[
          styles.container,
          {
            paddingTop: insets.top,
          },
        ]}
      >
        <StatusBar style="light" />

        <View style={styles.content}>
          <Text
            style={[
              styles.title,
              fontLoaded && { fontFamily: "SfProRoundedBold" },
            ]}
          >
            FAQ
          </Text>
          <Text
            style={[
              styles.subtitle,
              fontLoaded && { fontFamily: "SfProRounded" },
            ]}
          >
            Common questions
          </Text>

          <View style={styles.accordionWrapper}>
            <Accordion
              theme={{
                backgroundColor: darkTheme.backgroundColor,
                borderColor: darkTheme.borderColor,
                iconColor: darkTheme.iconColor,
                headlineColor: darkTheme.textColor,
                subtitleColor: darkTheme.textColor,
              }}
              spacing={8}
            >
              {FAQS.map((faq) => (
                <Accordion.Item key={faq.id} value={faq.id} icon="chevron">
                  <Accordion.Trigger>
                    <View style={styles.triggerContent}>
                      <SymbolView
                        name={faq.icon as any}
                        size={18}
                        tintColor="#888"
                      />
                      <Text
                        style={[
                          styles.question,
                          fontLoaded && { fontFamily: "SfProRoundedMedium" },
                        ]}
                      >
                        {faq.question}
                      </Text>
                    </View>
                  </Accordion.Trigger>
                  <Accordion.Content>
                    <Text
                      style={[
                        styles.answer,
                        fontLoaded && { fontFamily: "SfProRounded" },
                      ]}
                    >
                      {faq.answer}
                    </Text>
                  </Accordion.Content>
                </Accordion.Item>
              ))}
            </Accordion>
          </View>
        </View>
      </GestureHandlerRootView>
    </Fragment>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a0a0a",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 80,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 15,
    color: "#555",
    marginBottom: 32,
  },
  accordionWrapper: {
    gap: 8,
    top: 150,
  },
  triggerContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  question: {
    fontSize: 15,
    fontWeight: "600",
    color: "#fff",
    flex: 1,
  },
  answer: {
    fontSize: 14,
    color: "#888",
    lineHeight: 22,
  },
});
