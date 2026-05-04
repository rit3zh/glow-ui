import React from "react";
import { Dimensions, Image, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import MaskedView from "@react-native-masked-view/masked-view";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

const SCREEN_W = Dimensions.get("window").width;
const SCREEN_H = Dimensions.get("window").height;

const CARD_WIDTH = SCREEN_W * 0.9;
const CARD_HEIGHT = SCREEN_H * 0.5;
const BLUR_HEIGHT = 170;
const IMAGE_URI =
  "https://images.squarespace-cdn.com/content/v1/63dde481bbabc6724d988548/14a6ed44-1c2d-470b-aa7a-1b61b3cbf42f/2.jfif";

export default function CardUI1(): React.JSX.Element {
  return (
    <View style={styles.card}>
      <Image
        source={{ uri: IMAGE_URI }}
        style={StyleSheet.absoluteFill}
        resizeMode="cover"
      />

      <View style={styles.badge}>
        <Text style={styles.star}>★</Text>
        <Text style={styles.badgeText}>Prime Pick</Text>
      </View>

      <View style={styles.blurWrap} pointerEvents="none">
        <MaskedView
          style={StyleSheet.absoluteFill}
          maskElement={
            <LinearGradient
              colors={["transparent", "black", "black"]}
              locations={[0, 0.25, 1]}
              style={StyleSheet.absoluteFill}
            />
          }
        >
          <Image
            source={{ uri: IMAGE_URI }}
            style={{
              width: CARD_WIDTH,
              height: CARD_HEIGHT,
              transform: [{ translateY: -(CARD_HEIGHT - BLUR_HEIGHT) }],
              opacity: 0.9,
            }}
            resizeMode="cover"
            blurRadius={5}
          />
          <View style={[StyleSheet.absoluteFill, styles.greenTint]} />
        </MaskedView>
      </View>

      <View style={styles.content}>
        <Text style={styles.price}>List: $250,000</Text>
        <View style={styles.row}>
          <View style={{ flex: 1 }}>
            <Text style={styles.address} numberOfLines={1}>
              Harry Konigsberg's…
            </Text>
            <Text style={styles.address}>1065 AG Guillaume Briard</Text>
          </View>
          <View style={styles.stats}>
            <View style={styles.stat}>
              <View style={[styles.row, { gap: 4 }]}>
                <MaterialCommunityIcons
                  name="pencil-ruler"
                  size={14}
                  color="#fff"
                />
                <Text style={styles.statValue}>29m²</Text>
              </View>
              <Text style={styles.statLabel}>Living</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.stat}>
              <View
                style={[
                  styles.row,
                  {
                    gap: 4,
                  },
                ]}
              >
                <Ionicons name="bed-outline" size={14} color="#fff" />
                <Text style={styles.statValue}>2</Text>
              </View>
              <Text style={styles.statLabel}>Rooms</Text>
            </View>
          </View>
        </View>

        <View style={styles.hairline} />

        <Text style={styles.byline}>
          By <Text style={styles.dot}>•</Text>{" "}
          <Text style={styles.author}>Waleed Sabir</Text>{" "}
          <Text style={styles.time}>2 days ago</Text>
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 28,
    overflow: "hidden",
    backgroundColor: "#222",
  },
  badge: {
    position: "absolute",
    top: 16,
    left: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: "#fff",
  },
  star: { color: "#F5A623", fontSize: 12 },
  badgeText: {
    fontFamily: "DmSansMedium",
    fontSize: 13,
    color: "#1A1A1A",
  },
  blurWrap: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: BLUR_HEIGHT,
    overflow: "hidden",
  },
  greenTint: {
    backgroundColor: "rgba(0, 0, 0,0.24)",
  },
  content: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    padding: 18,
  },
  price: {
    fontFamily: "SfProRounded",
    fontSize: 22,
    color: "#fff",
    marginBottom: 6,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  address: {
    fontFamily: "DmSansMedium",
    fontSize: 13,
    color: "rgba(255,255,255,0.85)",
    lineHeight: 18,
  },
  stats: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  stat: {
    alignItems: "center",
    minWidth: 44,
  },
  statValue: {
    fontFamily: "SfProRounded",
    fontSize: 14,
    color: "#fff",
  },
  statLabel: {
    fontFamily: "DmSansMedium",
    fontSize: 11,
    color: "rgba(255,255,255,0.7)",
    marginTop: 2,
  },
  divider: {
    width: 1,
    height: 24,
    backgroundColor: "rgba(255,255,255,0.25)",
  },
  hairline: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.2)",
    marginVertical: 12,
  },
  byline: {
    fontFamily: "DmSansMedium",
    fontSize: 12,
    color: "rgba(255,255,255,0.7)",
  },
  dot: { color: "#fff" },
  author: {
    color: "#fff",
    textDecorationLine: "underline",
  },
  time: {
    color: "rgba(255,255,255,0.6)",
  },
});
