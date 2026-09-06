import React from "react";
import {
  Image,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Stack, useRouter, type Router } from "expo-router";
import { SymbolView } from "expo-symbols";

import {
  AnimatedScrollView,
  AnimatedScrollViewTitle,
  AnimatedScrollViewTitleWrapper,
  HeaderComponentWrapper,
  HeaderNavBar,
} from "@/components/templates/parallax-header/";

const COVER =
  "https://www.gpb.org/sites/default/files/styles/flexheight/public/npr_story_images/2024/05/07/ts-gen-use-2-1--dd29e47dfee5383819c8657b6284d983b23cb905.jpg?itok=9v7AXDsG";

const ROWS = [1, 2, 3, 4, 5];
const TILES = [1, 2, 3];

export const HeaderDemo: React.FC = (): React.ReactNode => {
  const router: Router = useRouter() as Router;

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />
      <Stack.Screen options={{ headerShown: false }} />

      <AnimatedScrollView
        showsVerticalScrollIndicator={false}
        topBarHeight={100}
        renderTopNavBarComponent={() => (
          <HeaderNavBar>
            <TouchableOpacity onPress={() => router.back()}>
              <SymbolView
                name="chevron.backward"
                size={18}
                tintColor="white"
                resizeMode="scaleAspectFit"
              />
            </TouchableOpacity>
            <Text style={styles.topNavTitle}>Dua Lipa</Text>
            <TouchableOpacity>
              <SymbolView
                name="ellipsis"
                size={18}
                tintColor="white"
                resizeMode="scaleAspectFit"
              />
            </TouchableOpacity>
          </HeaderNavBar>
        )}
        renderOveralComponent={() => (
          <AnimatedScrollViewTitleWrapper>
            <></>
          </AnimatedScrollViewTitleWrapper>
        )}
        renderHeaderComponent={() => (
          <HeaderComponentWrapper useGradient={false}>
            <Image source={{ uri: COVER }} style={styles.cover} />
            <LinearGradient
              colors={["transparent", "rgba(0,0,0,0.2)", "rgba(0,0,0,0.95)"]}
              style={styles.coverOverlay}
            />
          </HeaderComponentWrapper>
        )}
      >
        <View style={styles.content}>
          <View style={styles.meta}>
            <View style={[styles.bar, styles.barWide]} />
            <View style={[styles.bar, styles.barNarrow]} />
          </View>

          <View style={styles.actions}>
            <View style={[styles.pill, styles.pillPrimary]} />
            <View style={styles.circle} />
            <View style={styles.circle} />
          </View>

          <View style={styles.list}>
            {ROWS.map((row) => (
              <View key={row} style={styles.row}>
                <View style={styles.thumb} />
                <View style={styles.rowLines}>
                  <View style={[styles.bar, styles.barWide]} />
                  <View style={[styles.bar, styles.barNarrow]} />
                </View>
                <View style={styles.rowEnd} />
              </View>
            ))}
          </View>

          <View style={styles.tiles}>
            {TILES.map((tile) => (
              <View key={tile} style={styles.tile} />
            ))}
          </View>

          <View style={styles.block} />
        </View>
      </AnimatedScrollView>
    </View>
  );
};

const SURFACE = "#131315";
const SURFACE_SOFT = "#232327";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  topNavTitle: {
    color: "white",
    fontSize: 17,
    fontWeight: "600",
  },
  title: {
    color: "white",
    marginLeft: 10,
    maxWidth: 2000,
    letterSpacing: -1,
  },
  cover: {
    width: "100%",
    height: 400,
  },
  coverOverlay: {
    position: "absolute",
    top: 0,
    width: "100%",
    height: 400,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 24,
    gap: 24,
  },
  meta: {
    gap: 10,
  },
  bar: {
    height: 10,
    borderRadius: 5,
    backgroundColor: SURFACE_SOFT,
  },
  barWide: {
    width: "58%",
  },
  barNarrow: {
    width: "32%",
    opacity: 0.6,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  pill: {
    height: 44,
    borderRadius: 22,
    backgroundColor: SURFACE,
  },
  pillPrimary: {
    flex: 1,
    backgroundColor: "#EDEDED",
  },
  circle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: SURFACE,
  },
  list: {
    gap: 18,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  thumb: {
    width: 48,
    height: 48,
    borderRadius: 10,
    backgroundColor: SURFACE,
  },
  rowLines: {
    flex: 1,
    gap: 8,
  },
  rowEnd: {
    width: 32,
    height: 10,
    borderRadius: 5,
    backgroundColor: SURFACE,
  },
  tiles: {
    flexDirection: "row",
    gap: 12,
  },
  tile: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: 16,
    backgroundColor: SURFACE,
  },
  block: {
    height: 180,
    borderRadius: 24,
    backgroundColor: SURFACE,
    marginBottom: 40,
  },
});

export default HeaderDemo;
