import { View, Text, StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import { useFonts } from "expo-font";
import { SymbolView } from "expo-symbols";
import { BlurCarousel } from "@/components/molecules/blur-carousel";
import { LinearGradient } from "expo-linear-gradient";
import {
  Breadcrumbs,
  BreadcrumbsIcon,
  BreadcrumbsItem,
  BreadcrumbsList,
  BreadcrumbsSeparator,
} from "@/components";
import React from "react";
import { Feather } from "@expo/vector-icons";

export default function App() {
  const [fontLoaded] = useFonts({
    SfProRounded: require("@/assets/fonts/sf-pro-rounded.ttf"),
    Coolveticas: require("@/assets/fonts/CoolveticaLt-Regular.ttf"),
    HelveticaNowDisplay: require("@/assets/fonts/HelveticaNowDisplayMedium.ttf"),
  });

  const DATA = [
    {
      id: "1",
      title: "Design",
      subtitle: "Create something beautiful",
      description: "Transform ideas into stunning visuals with intuitive tools",
      icon: "paintbrush.fill",
      gradient: ["#ff375f", "#ff6b8a"],
      stats: { value: "2.4k", label: "Projects" },
    },
    {
      id: "2",
      title: "Develop",
      subtitle: "Build with precision",
      description: "Write clean code and ship features faster than ever",
      icon: "chevron.left.forwardslash.chevron.right",
      gradient: ["#5e5ce6", "#8b8bf5"],
      stats: { value: "18ms", label: "Response" },
    },
    {
      id: "3",
      title: "Launch",
      subtitle: "Ship to the world",
      description: "Deploy globally with confidence and reliability",
      icon: "paperplane.fill",
      gradient: ["#30d158", "#5de37a"],
      stats: { value: "99.9%", label: "Uptime" },
    },
  ];

  return (
    <GestureHandlerRootView style={styles.container}>
      <StatusBar style="light" />

      <View style={styles.header}>
        <Text
          style={[styles.title, fontLoaded && { fontFamily: "Coolveticas" }]}
        >
          Projects
        </Text>
      </View>

      <Breadcrumbs style={{ paddingHorizontal: 20, marginBottom: 20 }}>
        <BreadcrumbsList>
          {["Workspace", "Development", "Components"].map(
            (item: string, index: number, arr: string[]) => (
              <React.Fragment key={item}>
                <BreadcrumbsItem
                  isCurrent={index === arr.length - 1}
                  onPress={() => {}}
                >
                  <View
                    className={`px-3 py-1.5 rounded-full transition-colors ${
                      index === arr.length - 1
                        ? "bg-white/10 border border-white/20"
                        : "bg-zinc-800/60 hover:bg-zinc-700/60"
                    }`}
                  >
                    <Text
                      className={`text-xs font-medium ${
                        index === arr.length - 1
                          ? "text-white"
                          : "text-zinc-300"
                      }`}
                      style={fontLoaded ? { fontFamily: "SfProRounded" } : {}}
                    >
                      {item}
                    </Text>
                  </View>
                </BreadcrumbsItem>
                {index !== arr.length - 1 && (
                  <BreadcrumbsSeparator>
                    <Feather
                      name="chevron-right"
                      size={12}
                      color="#52525B"
                      style={{ marginHorizontal: 6 }}
                    />
                  </BreadcrumbsSeparator>
                )}
              </React.Fragment>
            ),
          )}
        </BreadcrumbsList>
      </Breadcrumbs>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a0a0a",
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 70,
    paddingBottom: 20,
  },
  title: {
    fontSize: 42,
    fontWeight: "700",
    color: "#fff",
  },
  card: {
    width: "100%",
    height: 380,
    borderRadius: 28,
    overflow: "hidden",
    padding: 24,
    justifyContent: "space-between",
  },
  cardGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  cardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  cardIcon: {
    width: 60,
    height: 60,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(0,0,0,0.2)",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#fff",
  },
  cardMiddle: {
    gap: 8,
  },
  cardTitle: {
    fontSize: 44,
    fontWeight: "600",
    color: "#fff",
  },
  cardSubtitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "rgba(255,255,255,0.9)",
  },
  cardDescription: {
    fontSize: 14,
    color: "rgba(255,255,255,0.6)",
    lineHeight: 20,
    marginTop: 4,
  },
  cardBottom: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  statBox: {
    gap: 2,
  },
  statValue: {
    fontSize: 32,
    fontWeight: "700",
    color: "#fff",
  },
  statLabel: {
    fontSize: 13,
    color: "rgba(255,255,255,0.6)",
  },
  arrowButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(0,0,0,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
});
