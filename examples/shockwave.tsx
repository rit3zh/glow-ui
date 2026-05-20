import React, { useState } from "react";
import {
  Dimensions,
  Image,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFonts } from "expo-font";
import { Feather } from "@expo/vector-icons";
import { Shockwave } from "@/components/organisms/shockwave";
import type {
  IShockwaveOrigin,
  ShockwaveValue,
} from "@/components/organisms/shockwave";
import CardUI1 from "../app/components/card-ui-1";
import CardUI2 from "../app/components/card-ui-2";
import Animated, { FadeInLeft, FadeInUp } from "react-native-reanimated";

const SCREEN_W = Dimensions.get("window").width;
const SCREEN_H = Dimensions.get("window").height;

const CARD_W = SCREEN_W * 0.9;
const CARD_H = SCREEN_H * 0.5;

const CATEGORIES = ["Villa", "Hotel", "Apartment", "Campsite", "Eco"];

const CITIES = [
  {
    name: "London",
    image:
      "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=200&q=80",
  },
  {
    name: "Paris",
    image:
      "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=200&q=80",
  },
  {
    name: "Amsterdam",
    image:
      "https://images.pexels.com/photos/16148465/pexels-photo-16148465.jpeg",
  },
  {
    name: "Rome",
    image:
      "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=200&q=80",
  },
];

const AVATAR_URI =
  "https://pbs.twimg.com/profile_images/2018442567407583232/LCIqE-R__400x400.jpg";

export default function ShockwaveExample(): React.JSX.Element {
  const [fontsLoaded] = useFonts({
    SfProRounded: require("@/assets/fonts/sf-pro-rounded.ttf"),
    DmSansMedium: require("@/assets/fonts/DMSansMedium.ttf"),
  });

  const [value, setValue] = useState<ShockwaveValue>("from");
  const [origin, setOrigin] = useState<IShockwaveOrigin>({
    x: CARD_W / 2,
    y: CARD_H / 2,
  });
  const [activeCategory, setActiveCategory] = useState<string>("Hotel");

  const triggerAt = (x: number, y: number): void => {
    setOrigin({ x, y });
    setValue((v) => (v === "from" ? "to" : "from"));
  };

  if (!fontsLoaded) return <View style={styles.root} />;

  return (
    <GestureHandlerRootView style={styles.root}>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={styles.safe} edges={["top", "bottom"]}>
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
        >
          <Animated.View
            style={styles.header}
            entering={FadeInUp.delay(180)
              .springify()
              .mass(0.5)
              .stiffness(120)
              .damping(12)}
          >
            <Animated.View style={styles.headerLeft}>
              <Image source={{ uri: AVATAR_URI }} style={styles.avatar} />
              <View>
                <Text style={styles.greeting}>Good Morning</Text>
                <Text style={styles.userName}>rit3zh</Text>
              </View>
            </Animated.View>
            <View style={styles.headerRight}>
              <Pressable style={styles.iconBtn}>
                <Feather name="map" size={18} color="#1A1A1A" />
              </Pressable>
              <Pressable style={styles.iconBtn}>
                <Feather name="sliders" size={18} color="#1A1A1A" />
              </Pressable>
            </View>
          </Animated.View>

          <Animated.View
            style={styles.titleBlock}
            entering={FadeInLeft.damping(12)
              .stiffness(120)
              .mass(0.8)
              .delay(200)}
          >
            <Text style={styles.titleSoft}>Unlock Your</Text>
            <Text style={styles.titleBold}>Perfect Stay Today!</Text>
          </Animated.View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.tabs}
          >
            {CATEGORIES.map((cat, idx) => {
              const active = cat === activeCategory;
              return (
                <Animated.View
                  key={`${cat}-${idx}`}
                  entering={FadeInLeft.delay(idx * 80)
                    .springify()
                    .mass(0.7)
                    .stiffness(120)
                    .damping(12)}
                >
                  <Pressable
                    onPress={() => setActiveCategory(cat)}
                    style={[styles.tab, active && styles.tabActive]}
                  >
                    <Text
                      style={[styles.tabText, active && styles.tabTextActive]}
                    >
                      {cat}
                    </Text>
                  </Pressable>
                </Animated.View>
              );
            })}
          </ScrollView>

          <View style={styles.cardArea}>
            <Pressable
              onPress={(e) =>
                triggerAt(e.nativeEvent.locationX, e.nativeEvent.locationY)
              }
            >
              <Shockwave
                value={value}
                origin={origin}
                width={CARD_W}
                height={CARD_H}
                duration={1200}
                style={styles.canvas}
              >
                <Shockwave.Transition.From>
                  <View style={styles.cardSlot}>
                    <CardUI1 />
                  </View>
                </Shockwave.Transition.From>

                <Shockwave.Transition.To>
                  <View style={styles.cardSlot}>
                    <CardUI2 />
                  </View>
                </Shockwave.Transition.To>
              </Shockwave>
            </Pressable>
          </View>

          <View style={styles.exploreHeader}>
            <Text style={styles.sectionTitle}>Explore City</Text>
            <Text style={styles.sectionLink}>See all</Text>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.cities}
          >
            {CITIES.map((city, idx) => (
              <Animated.View
                key={`city-${idx}`}
                style={styles.city}
                entering={FadeInLeft.delay(idx * 120)
                  .springify()
                  .mass(0.7)
                  .stiffness(120)
                  .damping(12)}
              >
                <Image source={{ uri: city.image }} style={styles.cityImage} />
                <Text style={styles.cityName}>{city.name}</Text>
              </Animated.View>
            ))}
          </ScrollView>
        </ScrollView>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#F5F5F2" },
  safe: { flex: 1, backgroundColor: "#F5F5F2" },
  scroll: {
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 8,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#DDD",
  },
  greeting: {
    fontFamily: "DmSansMedium",
    fontSize: 12,
    color: "#8A8A8A",
  },
  userName: {
    fontFamily: "SfProRounded",
    fontSize: 16,
    color: "#1A1A1A",
    marginTop: 1,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  iconBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  titleBlock: {
    marginTop: 22,
  },
  titleSoft: {
    fontFamily: "DmSansMedium",
    fontSize: 24,
    color: "#B5B5B0",
    letterSpacing: -0.5,
  },
  titleBold: {
    fontFamily: "SfProRounded",
    fontSize: 32,
    color: "#1A1A1A",
    letterSpacing: -1,
    marginTop: 2,
  },
  tabs: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 20,
    paddingRight: 20,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
  },
  tabActive: {
    backgroundColor: "#D8F26A",
  },
  tabText: {
    fontFamily: "DmSansMedium",
    fontSize: 14,
    color: "#9A9A95",
  },
  tabTextActive: {
    fontFamily: "SfProRounded",
    color: "#1A1A1A",
  },
  cardArea: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
  },
  canvas: {
    borderRadius: 28,
  },
  cardSlot: {
    width: CARD_W,
    height: CARD_H,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 240,
  },
  nextBtn: {
    position: "absolute",
    right: -6,
    top: "50%",
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
    transform: [{ translateY: -22 }],
  },
  exploreHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 28,
  },
  sectionTitle: {
    fontFamily: "SfProRounded",
    fontSize: 18,
    color: "#1A1A1A",
  },
  sectionLink: {
    fontFamily: "DmSansMedium",
    fontSize: 13,
    color: "#8A8A8A",
  },
  cities: {
    flexDirection: "row",
    alignItems: "center",
    gap: 18,
    paddingVertical: 16,
    paddingRight: 20,
  },
  city: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#FFFFFF",
    paddingLeft: 6,
    paddingRight: 16,
    paddingVertical: 6,
    borderRadius: 999,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  cityImage: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#DDD",
  },
  cityName: {
    fontFamily: "SfProRounded",
    fontSize: 14,
    color: "#1A1A1A",
  },
});
