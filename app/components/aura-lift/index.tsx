import {
  AuraLiftGlobalContextProvider,
  useAuraLiftContext,
} from "@/components/organisms/aura-lift";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { Showcase } from "~/showcase";

const BANNER =
  "https://i.pinimg.com/1200x/75/52/6b/75526b6bfe900ef1abd890f55ee52625.jpg";
const AVATAR = {
  uri: "https://i.pinimg.com/1200x/d3/a2/38/d3a238f0e817a045c2002f14457eddc0.jpg",
};

const ProfileCard: React.FC = () => {
  const { toggle, isRunning } = useAuraLiftContext();

  return (
    <View style={styles.card}>
      <Image
        source={{ uri: BANNER }}
        style={styles.banner}
        resizeMode="cover"
      />
      <View style={styles.bannerSpacer} />

      <View style={styles.body}>
        <View style={styles.nameRow}>
          <Text style={styles.name}>rit3zh</Text>
          <Text style={styles.handle}>@rit3zh.dev</Text>
        </View>

        <Text style={styles.bio}>
          Product designer crafting simple, thoughtful experiences for the
          modern web. Design systems | UX | Coffee
        </Text>

        <View style={styles.locationRow}>
          <Ionicons name="location-outline" size={16} color="#8a8683" />
          <Text style={styles.location}>San Francisco, CA</Text>
        </View>
        <Pressable onPress={toggle} disabled={isRunning} style={styles.button}>
          <Text style={styles.buttonLabel}>Say Hello!</Text>
        </Pressable>
      </View>

      <View style={styles.avatarWrapper}>
        <Image source={AVATAR} style={styles.avatar} resizeMode="cover" />
      </View>
    </View>
  );
};

export default function AuraLiftScreen() {
  return (
    <Showcase>
      <View style={styles.container}>
        <AuraLiftGlobalContextProvider duration={2000} style={styles.box}>
          <ProfileCard />
        </AuraLiftGlobalContextProvider>
      </View>
    </Showcase>
  );
}

const AVATAR_SIZE = 76;
const BANNER_HEIGHT = 150;
const BODY_OVERLAP = 34;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: "#1c1c1c",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  box: {
    flex: 0,
    width: "100%",
    maxWidth: 340,
    borderRadius: 34,
  },
  card: {
    borderRadius: 34,
    backgroundColor: "#030000",
    padding: 10,
  },
  banner: {
    position: "absolute",
    top: 10,
    left: 10,
    right: 10,
    height: BANNER_HEIGHT,
    borderRadius: 26,
    backgroundColor: "#1a1a1a",
  },
  bannerSpacer: {
    height: BANNER_HEIGHT - BODY_OVERLAP,
  },
  body: {
    borderRadius: 26,
    backgroundColor: "#141414",
    paddingHorizontal: 18,
    paddingTop: 20,
    paddingBottom: 16,
    gap: 14,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 8,
  },
  name: {
    color: "#f5f2ef",
    fontSize: 22,
    fontWeight: "700",
    letterSpacing: -0.4,
  },
  handle: {
    color: "#8a8683",
    fontSize: 13,
  },
  bio: {
    color: "#a5a19d",
    fontSize: 15,
    lineHeight: 22,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  location: {
    color: "#c9c5c1",
    fontSize: 14,
  },
  button: {
    marginTop: 10,
    height: 38,
    borderRadius: 15,
    backgroundColor: "#333130",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonPressed: {
    opacity: 0.65,
  },
  buttonLabel: {
    color: "#f0ede9",
    fontSize: 15,
    fontWeight: "500",
  },
  avatarWrapper: {
    position: "absolute",
    right: 20,
    top: BANNER_HEIGHT - AVATAR_SIZE / 2 - 8,
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: 24,
    borderWidth: 4,
    borderColor: "#000",
    overflow: "hidden",
    backgroundColor: "#1a1a1a",
  },
  avatar: {
    width: "100%",
    height: "100%",
  },
});
