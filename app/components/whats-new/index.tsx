import { Text, StyleSheet, SafeAreaView, Dimensions } from "react-native";
import React from "react";
import {
  WhatsNew,
  WhatsNewButton,
  WhatsNewItemContainer,
} from "@/components/templates";
import { PrivacyNoticeLink, Subtitle, Title } from "@/components";
import { SymbolView } from "expo-symbols";
import { MediaList } from "@/components/templates/media-list";

export const WHATS_NEW = [
  {
    title: "Dark Mode Support",
    description: "Enjoy a sleek new look that’s easier on the eyes at night.",
    icon: "moon.fill",
    color: "#8e8e93",
  },
  {
    title: "Faster Performance",
    description:
      "We’ve optimized loading and improved smoothness across the app.",
    icon: "speedometer",
    color: "#34c759",
  },
  {
    title: "New Onboarding Flow",
    description: "A refreshed experience to help you get started quickly.",
    icon: "sparkles",
    color: "#5e5ce6",
  },
  {
    title: "Bug Fixes",
    description: "Squashed a bunch of bugs to make things more reliable.",
    icon: "checkmark.seal.fill",
    color: "#ff9500",
  },
  {
    title: "Offline Mode",
    description: "Use the app without an internet connection.",
    icon: "wifi.slash",
    color: "#ff3b30",
  },
  {
    title: "New Themes",
    description: "Personalize your experience with custom themes.",
    icon: "paintbrush.fill",
    color: "#af52de",
  },
  {
    title: "Improved Search",
    description: "Find what you need faster with smarter search.",
    icon: "magnifyingglass.circle.fill",
    color: "#007aff",
  },
  {
    title: "Favorites",
    description: "Mark and quickly access your favorite items.",
    icon: "star.fill",
    color: "#ffd60a",
  },
  {
    title: "Cloud Sync",
    description: "Sync your data securely across devices.",
    icon: "icloud.fill",
    color: "#5ac8fa",
  },
  {
    title: "Multi-Language Support",
    description: "Now available in 10+ languages.",
    icon: "globe",
    color: "#34c759",
  },
  {
    title: "Push Notifications",
    description: "Stay up to date with real-time alerts.",
    icon: "bell.badge.fill",
    color: "#ff375f",
  },
  {
    title: "New Widgets",
    description: "Add app widgets to your home screen.",
    icon: "square.grid.2x2.fill",
    color: "#5e5ce6",
  },
  {
    title: "Gesture Support",
    description: "Navigate faster with intuitive gestures.",
    icon: "hand.draw.fill",
    color: "#ff9500",
  },
  {
    title: "Accessibility Enhancements",
    description: "Improved support for screen readers and larger text.",
    icon: "figure.wave",
    color: "#8e8e93",
  },
  {
    title: "App Lock",
    description: "Secure your app with Face ID or Passcode.",
    icon: "lock.shield.fill",
    color: "#34c759",
  },
  {
    title: "Download Manager",
    description: "Easily manage and track file downloads.",
    icon: "arrow.down.circle.fill",
    color: "#007aff",
  },
  {
    title: "In-App Feedback",
    description: "Share feedback directly from the app.",
    icon: "bubble.left.and.bubble.right.fill",
    color: "#af52de",
  },
  {
    title: "Live Chat Support",
    description: "Get instant help through live chat.",
    icon: "message.fill",
    color: "#ff9500",
  },
  {
    title: "Custom Notifications",
    description: "Choose what alerts you want to receive.",
    icon: "bell.circle.fill",
    color: "#ffcc00",
  },
  {
    title: "Enhanced Security",
    description: "We've added new protections to keep your data safe.",
    icon: "shield.lefthalf.fill",
    color: "#ff3b30",
  },
];

export default function WhatsNewDemo() {
  return (
    <SafeAreaView style={styles.container}>
      <WhatsNew blurTint="dark">
        <WhatsNew.Trigger>
          <Text style={styles.text}>Show What's New</Text>
        </WhatsNew.Trigger>
        <WhatsNew.Content>
          <WhatsNew.Title>What's New In Translate</WhatsNew.Title>
          <WhatsNew.Wrapper>
            <MediaList
              data={WHATS_NEW}
              keyExtractor={(item) => item.title}
              renderItem={(item, index) => (
                <React.Fragment key={index.toString() + "_"}>
                  <WhatsNewItemContainer>
                    <SymbolView
                      name={item.icon as any}
                      size={50}
                      tintColor={item.color}
                    />
                    <Title key={index.toString()}>{item.title}</Title>
                    <Subtitle
                      key={index.toString() + "_subtitle"}
                      className="max-w-14"
                    >
                      {item.description}
                    </Subtitle>
                  </WhatsNewItemContainer>
                </React.Fragment>
              )}
              chunkSize={4}
            />

            <PrivacyNoticeLink style={styles.tosContainer}>
              About Translation & Privacy
            </PrivacyNoticeLink>
            <WhatsNewButton>Continue</WhatsNewButton>
          </WhatsNew.Wrapper>
        </WhatsNew.Content>
      </WhatsNew>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1a1a1a",
  },
  text: {
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "black",
  },
  tosContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    top: 0,
    justifyContent: "flex-end",
    alignItems: "center",
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height * 0.54,
  },
});
