import React from "react";
import {
  Dimensions,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import MaskedView from "@react-native-masked-view/masked-view";
import { MaterialCommunityIcons } from "@expo/vector-icons";
const SCREEN_W = Dimensions.get("window").width;
const SCREEN_H = Dimensions.get("window").height;

const CARD_WIDTH = SCREEN_W * 0.9;
const CARD_HEIGHT = SCREEN_H * 0.5;
const BLUR_HEIGHT = 170;
const IMAGE_URI =
  "https://static1.squarespace.com/static/63dde481bbabc6724d988548/t/67d8f343dcebc22d7bd3b60c/1742271299305/0.jfif?format=1500w";

export default function CardUI2(): React.JSX.Element {
  return (
    <View style={styles.card}>
      <Image
        source={{ uri: IMAGE_URI }}
        style={StyleSheet.absoluteFill}
        resizeMode="cover"
      />

      <View style={styles.blurWrap} pointerEvents="none">
        <MaskedView
          style={StyleSheet.absoluteFill}
          maskElement={
            <LinearGradient
              colors={["transparent", "black", "black"]}
              locations={[0, 0.2, 1]}
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
            }}
            resizeMode="cover"
            blurRadius={6}
          />
          <View style={[StyleSheet.absoluteFill, styles.greenTint]} />
        </MaskedView>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>The Hill Guest House</Text>
        <View style={styles.addressRow}>
          <Text style={styles.pin}>◧</Text>
          <Text style={styles.address}>
            58 Hullbrook Road, Billesley, B13 OLA
          </Text>
        </View>

        <View style={styles.stats}>
          <View style={styles.stat}>
            <MaterialCommunityIcons
              name="bed-outline"
              size={14}
              color="rgba(255,255,255,0.85)"
            />
            <Text style={styles.statText}>
              Bed: <Text style={styles.statBold}>2</Text>
            </Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.stat}>
            <MaterialCommunityIcons
              name="bathtub-outline"
              size={14}
              color="rgba(255,255,255,0.85)"
            />
            <Text style={styles.statText}>
              Baths: <Text style={styles.statBold}>1</Text>
            </Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.stat}>
            <MaterialCommunityIcons
              name="move-resize-variant"
              size={14}
              color="rgba(255,255,255,0.85)"
            />
            <Text style={styles.statText}>
              Sqft: <Text style={styles.statBold}>1150</Text>
            </Text>
          </View>
        </View>
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
  blurWrap: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: BLUR_HEIGHT,
    overflow: "hidden",
  },
  greenTint: {
    backgroundColor: "rgba(20, 40, 20, 0.55)",
  },
  dots: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: BLUR_HEIGHT - 18,
    flexDirection: "row",
    justifyContent: "center",
    gap: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "rgba(255,255,255,0.45)",
  },
  dotActive: {
    backgroundColor: "#fff",
  },
  content: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 18,
    paddingBottom: 16,
    paddingTop: 8,
  },
  title: {
    fontFamily: "SfProRounded",
    fontSize: 22,
    color: "#fff",
    marginBottom: 2,
  },
  addressRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 14,
  },
  pin: {
    color: "rgba(255,255,255,0.85)",
    fontSize: 14,
  },
  address: {
    fontFamily: "DmSansMedium",
    fontSize: 13,
    color: "rgba(255,255,255,0.85)",
  },
  stats: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
  stat: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  statIcon: {
    color: "rgba(255,255,255,0.85)",
    fontSize: 14,
  },
  statText: {
    fontFamily: "DmSansMedium",
    fontSize: 13,
    color: "rgba(255,255,255,0.85)",
  },
  statBold: {
    fontFamily: "SfProRounded",
    color: "#fff",
  },
  statDivider: {
    width: 1,
    height: 22,
    backgroundColor: "rgba(255,255,255,0.25)",
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 14,
  },
  pricePill: {
    paddingHorizontal: 22,
    paddingVertical: 14,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.18)",
  },
  priceText: {
    fontFamily: "SfProRounded",
    fontSize: 18,
    color: "#fff",
  },
  reserveBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 999,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  reserveText: {
    fontFamily: "SfProRounded",
    fontSize: 16,
    color: "#1A1A1A",
  },
});
