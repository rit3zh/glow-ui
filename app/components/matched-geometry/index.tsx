import { StyleSheet, Image, View, Text } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import { MatchedGeometry } from "@/components/organisms/matched-geometry";
import { useFonts } from "expo-font";
import { Showcase } from "~/showcase";

export default function App() {
  const [fontLoaded] = useFonts({
    SfProRounded: require("@/assets/fonts/sf-pro-rounded.ttf"),
    HelveticaNowDisplay: require("@/assets/fonts/HelveticaNowDisplayMedium.ttf"),
  });
  return (
    <Showcase>
      <GestureHandlerRootView style={styles.container}>
        <StatusBar style="light" />

        <View style={styles.stage}>
          <View style={styles.card}>
            <MatchedGeometry id="swan">
              <Image
                source={{
                  uri: "https://i.pinimg.com/1200x/c6/ce/40/c6ce40ffd43ad9a532a39951c6abfad6.jpg",
                }}
                style={styles.image}
              />
            </MatchedGeometry>

            <View style={styles.meta}>
              <Text
                style={[
                  styles.title,
                  { fontFamily: fontLoaded ? "SfProRounded" : undefined },
                ]}
              >
                Mute Swan
              </Text>
              <Text
                style={[
                  styles.subtitle,
                  {
                    fontFamily: fontLoaded ? "HelveticaNowDisplay" : undefined,
                  },
                ]}
              >
                Tap to expand
              </Text>
            </View>
          </View>
        </View>
      </GestureHandlerRootView>
    </Showcase>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },

  stage: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  card: {
    width: 200,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.06)",
    overflow: "hidden",
  },

  image: {
    width: "100%",
    height: 200,
    borderRadius: 18,
  },

  meta: {
    padding: 12,
  },

  title: {
    color: "#fff",
    fontSize: 15,
  },

  subtitle: {
    color: "rgba(255,255,255,0.6)",
    fontSize: 12,
  },
});
