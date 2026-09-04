import { View, Text, StyleSheet, StatusBar, Dimensions } from "react-native";
import React, { useState } from "react";
import InfiniteMenu, {
  type IMenuItem,
} from "@/components/organisms/infinite-menu";
import { Showcase } from "~/showcase";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const MENU_HEIGHT = SCREEN_WIDTH * 0.9;

const MENU_ITEMS: IMenuItem[] = [
  {
    title: "Bloom",
    image:
      "https://i.pinimg.com/736x/22/1e/ae/221eae1af669db2d93cc2155c74371ff.jpg",
  },
  {
    title: "Drift",
    image:
      "https://i.pinimg.com/736x/2c/d9/66/2cd96620a3a595e3e80e5ddf364fa162.jpg",
  },
  {
    title: "Wings",
    image:
      "https://i.pinimg.com/736x/83/49/c2/8349c22cc5c73a6eddbf561a41c09fda.jpg",
  },
  {
    title: "Ember",
    image:
      "https://i.pinimg.com/736x/08/0f/3c/080f3c1e3b8d4a4c020e72ed8ebe982b.jpg",
  },
];

export default function App() {
  return (
    <Showcase>
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#000" />

        <View style={styles.menuContainer}>
          <InfiniteMenu items={MENU_ITEMS} scale={0.7} style={styles.menu} />
        </View>
      </View>
    </Showcase>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
  },
  header: {
    paddingHorizontal: 24,
    marginBottom: 20,
  },
  title: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "700",
    letterSpacing: -0.5,
  },
  subtitle: {
    color: "#8a8a8a",
    fontSize: 14,
    marginTop: 4,
  },
  menuContainer: {
    height: MENU_HEIGHT,
    marginHorizontal: 16,
    borderRadius: 28,
    overflow: "hidden",
    backgroundColor: "#0a0a0a",
  },
  menu: {
    width: "100%",
    height: "100%",
  },
  badge: {
    position: "absolute",
    bottom: 16,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  badgeText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "600",
  },
});
