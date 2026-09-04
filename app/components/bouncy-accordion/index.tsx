import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { BouncyAccordion } from "@/components";
import { Showcase } from "~/showcase";
import { SFSymbol, SymbolView } from "expo-symbols";
import { useFonts } from "expo-font";

const _DS_TOKENS = {
  bg: "#121212",
  label: "#ebebeb",
};

interface AccordionContent {
  value: string;
  label: string;
  content: string;
  icon: SFSymbol;
}

const _ACCORDION_CONTENT: AccordionContent[] = [
  {
    value: "what-is-reacticx",
    label: "What is Reacticx?",
    content:
      "Reacticx is a collection of beautifully crafted React Native components, animations, and utilities designed to help you build polished mobile apps faster.",
    icon: "sparkles",
  },
  {
    value: "is-reacticx-free",
    label: "Is Reacticx free?",
    content:
      "Yes. Most components and utilities are open source and free to use. Some advanced features or premium packages may be available in the future.",
    icon: "gift",
  },
  {
    value: "expo-support",
    label: "Does it support Expo?",
    content:
      "Absolutely. Reacticx is built with Expo and React Native in mind, while also supporting bare React Native projects whenever possible.",
    icon: "iphone",
  },
  {
    value: "customization",
    label: "Can I customize the components?",
    content:
      "Every component is designed to be customizable. You can adjust colors, spacing, animations, and behavior to match your app's design system.",
    icon: "paintbrush",
  },
];

export default function BouncyAccordionScreen() {
  const insets = useSafeAreaInsets();
  const [fontLoaded] = useFonts({
    SfProRounded: require("@/assets/fonts/sf-pro-rounded.ttf"),
    SfProRoundedBold: require("~/assets/fonts/SF-Pro-Rounded-Bold.otf"),
    SfProRoundedMedium: require("~/assets/fonts/SF-Pro-Rounded-Medium.otf"),
  });

  return (
    <Showcase>
      <View
        style={[
          styles.content,
          {
            paddingTop: insets.top * 4,
          },
        ]}
      >
        <View style={styles.stage}>
          <Text
            style={[
              styles.headingTitle,
              fontLoaded && { fontFamily: "SfProRoundedBold" },
            ]}
          >
            FAQ
          </Text>
          <Text
            style={[
              styles.headingSubtitle,
              fontLoaded && { fontFamily: "SfProRounded" },
            ]}
          >
            Common questions
          </Text>
        </View>

        <BouncyAccordion.Root defaultValue="react">
          {_ACCORDION_CONTENT.map((item, index) => (
            <BouncyAccordion.Item
              value={item.value}
              style={styles.item}
              key={index.toString()}
            >
              <BouncyAccordion.Trigger>
                <BouncyAccordion.Trigger.Icon>
                  <SymbolView
                    name={item.icon}
                    size={18}
                    tintColor={_DS_TOKENS.label}
                  />
                </BouncyAccordion.Trigger.Icon>
                <BouncyAccordion.Trigger.Label style={styles.title}>
                  {item.label}
                </BouncyAccordion.Trigger.Label>
              </BouncyAccordion.Trigger>
              <BouncyAccordion.Content>{item.content}</BouncyAccordion.Content>
            </BouncyAccordion.Item>
          ))}
        </BouncyAccordion.Root>
      </View>
    </Showcase>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f2f2f7" },
  content: { padding: 20 },
  stage: {
    paddingHorizontal: 12,
  },
  title: {
    color: _DS_TOKENS.label,
  },
  item: {
    backgroundColor: _DS_TOKENS.bg,
  },
  headingTitle: {
    fontSize: 32,
    color: "#fff",
  },
  headingSubtitle: {
    fontSize: 15,
    color: "#555",
    marginBottom: 32,
  },
});
