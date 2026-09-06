import React from "react";
import { StyleSheet, Text, View, Pressable, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { SymbolView } from "expo-symbols";
import { useFonts } from "expo-font";
import {
  ScrollableSearch,
  useScrollableSearch,
} from "@/components/base/scrollable-search";
import { Showcase } from "~/showcase";

const PLACES = [
  { id: "1", title: "Tokyo", subtitle: "Japan", symbol: "building.2.fill" },
  { id: "2", title: "Kyoto", subtitle: "Japan", symbol: "leaf.fill" },
  {
    id: "3",
    title: "Mount Fuji",
    subtitle: "Nature",
    symbol: "mountain.2.fill",
  },
  { id: "4", title: "Osaka", subtitle: "Japan", symbol: "sparkles" },
];

const RECENT = ["Tokyo", "Kyoto", "Osaka"];

const SearchBar = ({ fontLoaded }: { fontLoaded: boolean }) => {
  const { setIsFocused, isFocused } = useScrollableSearch();

  return (
    <ScrollableSearch.AnimatedComponent
      onPullToFocus={() => setIsFocused(true)}
      focusedOffset={-70}
      unfocusedOffset={53}
    >
      <Pressable
        style={styles.searchBar}
        onPress={() => setIsFocused(!isFocused)}
      >
        <SymbolView name="magnifyingglass" size={18} tintColor="#666" />
        <Text
          style={[
            styles.searchPlaceholder,
            fontLoaded && { fontFamily: "SfProRounded" },
          ]}
        >
          Search destinations...
        </Text>
      </Pressable>
    </ScrollableSearch.AnimatedComponent>
  );
};

const Content = ({ fontLoaded }: { fontLoaded: boolean }) => {
  const { setIsFocused } = useScrollableSearch();

  return (
    <>
      <ScrollableSearch.ScrollContent>
        <SafeAreaView>
          <View style={styles.header}>
            <Text
              style={[
                styles.title,
                fontLoaded && { fontFamily: "HelveticaNowDisplay" },
              ]}
            >
              Explore
            </Text>
            <Text
              style={[
                styles.subtitle,
                fontLoaded && { fontFamily: "SfProRounded" },
              ]}
            >
              Find your next adventure
            </Text>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <SymbolView name="star.fill" size={16} tintColor="#fbbf24" />
              <Text
                style={[
                  styles.sectionTitle,
                  fontLoaded && { fontFamily: "SfProRounded" },
                ]}
              >
                Popular
              </Text>
            </View>

            {PLACES.map((place) => (
              <Pressable key={place.id} style={styles.card}>
                <View style={styles.cardIcon}>
                  <SymbolView
                    name={place.symbol as any}
                    size={20}
                    tintColor="#fff"
                  />
                </View>
                <View style={styles.cardContent}>
                  <Text
                    style={[
                      styles.cardTitle,
                      fontLoaded && { fontFamily: "HelveticaNowDisplay" },
                    ]}
                  >
                    {place.title}
                  </Text>
                  <Text
                    style={[
                      styles.cardSubtitle,
                      fontLoaded && { fontFamily: "SfProRounded" },
                    ]}
                  >
                    {place.subtitle}
                  </Text>
                </View>
                <SymbolView name="chevron.right" size={14} tintColor="#444" />
              </Pressable>
            ))}
          </View>
        </SafeAreaView>
      </ScrollableSearch.ScrollContent>

      <ScrollableSearch.Overlay onPress={() => setIsFocused(false)}>
        <ScrollableSearch.FocusedScreen>
          <SafeAreaView edges={["top"]} style={styles.focusedContainer}>
            <ScrollView
              style={styles.focusedScroll}
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.focusedSection}>
                <View style={styles.focusedHeader}>
                  <SymbolView name="clock.fill" size={16} tintColor="#888" />
                  <Text
                    style={[
                      styles.focusedTitle,
                      fontLoaded && { fontFamily: "SfProRounded" },
                    ]}
                  >
                    Recent Searches
                  </Text>
                </View>

                {RECENT.map((item, index) => (
                  <Pressable key={index} style={styles.recentItem}>
                    <SymbolView
                      name="magnifyingglass"
                      size={16}
                      tintColor="#666"
                    />
                    <Text
                      style={[
                        styles.recentText,
                        fontLoaded && { fontFamily: "SfProRounded" },
                      ]}
                    >
                      {item}
                    </Text>
                    <SymbolView
                      name="arrow.up.left"
                      size={14}
                      tintColor="#444"
                    />
                  </Pressable>
                ))}
              </View>
            </ScrollView>
          </SafeAreaView>
        </ScrollableSearch.FocusedScreen>
      </ScrollableSearch.Overlay>

      <SearchBar fontLoaded={fontLoaded} />
    </>
  );
};

export default function App() {
  const [fontLoaded] = useFonts({
    SfProRounded: require("@/assets/fonts/sf-pro-rounded.ttf"),
    HelveticaNowDisplay: require("@/assets/fonts/HelveticaNowDisplayMedium.ttf"),
  });

  return (
    <Showcase>
      <ScrollableSearch>
        <Content fontLoaded={fontLoaded} />
      </ScrollableSearch>
    </Showcase>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 28,
    bottom: 60,
  },
  title: {
    fontSize: 34,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 15,
    color: "#666",
  },
  section: {
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "600",
    color: "#fff",
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#121212",
    padding: 16,
    borderRadius: 16,
    marginBottom: 10,
    gap: 14,
  },
  cardIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#252525",
    justifyContent: "center",
    alignItems: "center",
  },
  cardContent: {
    flex: 1,
    gap: 2,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: "600",
    color: "#fff",
  },
  cardSubtitle: {
    fontSize: 14,
    color: "#666",
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1a1a1a",
    marginHorizontal: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 14,
    gap: 10,
    borderWidth: 1,
    borderColor: "#252525",
  },
  searchPlaceholder: {
    flex: 1,
    fontSize: 16,
    color: "#555",
  },
  focusedContainer: {
    flex: 1,
  },
  focusedScroll: {
    flex: 1,
    paddingTop: 90,
  },
  focusedSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  focusedHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 14,
  },
  focusedTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#888",
  },
  recentItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1a1a1a",
    padding: 14,
    borderRadius: 12,
    marginBottom: 8,
    gap: 12,
    borderWidth: 1,
    borderColor: "#252525",
  },
  recentText: {
    flex: 1,
    fontSize: 15,
    color: "#fff",
  },
  tipCard: {
    flexDirection: "row",
    backgroundColor: "rgba(167, 139, 250, 0.1)",
    marginHorizontal: 20,
    padding: 16,
    borderRadius: 14,
    gap: 12,
    borderWidth: 1,
    borderColor: "rgba(167, 139, 250, 0.2)",
  },
  tipContent: {
    flex: 1,
    gap: 2,
  },
  tipTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#a78bfa",
  },
  tipText: {
    fontSize: 13,
    color: "#888",
  },
});
