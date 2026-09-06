import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Shockwave } from "@/components/organisms/shockwave";
import type {
  IShockwaveOrigin,
  ShockwaveValue,
} from "@/components/organisms/shockwave";
import { Showcase } from "~/showcase";

const SCREEN_W = Dimensions.get("window").width;

const CARD_W = SCREEN_W * 0.86;
const CARD_H = CARD_W * 1.25;

const IMAGES: Record<ShockwaveValue, string> = {
  from: "https://i.pinimg.com/736x/24/69/72/246972a3a8613a09da5bfe4cf1f09f56.jpg",
  to: "https://i.pinimg.com/736x/56/2f/40/562f40fccfd2cc5cb91963d59831794b.jpg",
};

export default function ShockwaveExample(): React.JSX.Element {
  const [ready, setReady] = useState(false);
  const [value, setValue] = useState<ShockwaveValue>("from");
  const [origin, setOrigin] = useState<IShockwaveOrigin>({
    x: CARD_W / 2,
    y: CARD_H / 2,
  });

  useEffect(() => {
    let mounted = true;
    Promise.all([
      Image.prefetch(IMAGES.from),
      Image.prefetch(IMAGES.to),
    ]).finally(() => mounted && setReady(true));
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <Showcase>
      <View style={styles.root}>
        <StatusBar barStyle="light-content" />
        <SafeAreaView style={styles.safe} edges={["top", "bottom"]}>
          <View style={styles.center}>
            {ready ? (
              <Pressable
                onPress={(e) => {
                  setOrigin({
                    x: e.nativeEvent.locationX,
                    y: e.nativeEvent.locationY,
                  });
                  setValue((v) => (v === "from" ? "to" : "from"));
                }}
              >
                <Shockwave
                  value={value}
                  origin={origin}
                  width={CARD_W}
                  height={CARD_H}
                  duration={1100}
                  lensingSpread={1.2}
                  shockStrength={0.99}
                  style={styles.canvas}
                >
                  <Shockwave.Transition.From>
                    <Image source={{ uri: IMAGES.from }} style={styles.image} />
                  </Shockwave.Transition.From>

                  <Shockwave.Transition.To>
                    <Image source={{ uri: IMAGES.to }} style={styles.image} />
                  </Shockwave.Transition.To>
                </Shockwave>
              </Pressable>
            ) : (
              <View style={[styles.canvas, styles.placeholder]}>
                <ActivityIndicator color="#8A8A8A" />
              </View>
            )}
          </View>
        </SafeAreaView>
      </View>
    </Showcase>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#0B0B0C" },
  safe: { flex: 1 },
  center: { flex: 1, alignItems: "center", justifyContent: "center", gap: 22 },
  canvas: {
    width: CARD_W,
    height: CARD_H,
    borderRadius: 28,
    overflow: "hidden",
  },
  placeholder: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#161618",
  },
  image: {
    width: CARD_W,
    height: CARD_H,
    borderRadius: 28,
  },
  hint: {
    fontSize: 13,
    letterSpacing: 0.2,
    color: "#7A7A80",
  },
});
