import { StyleSheet, Text, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import { RippleImage, RippleRect } from "@/components/organisms/skia-ripple";
import { useFonts } from "expo-font";
import { SymbolView } from "expo-symbols";

const IMAGE_URL =
  "https://i.pinimg.com/736x/4e/7f/4f/4e7f4fc63374f90f75a80860bf4bc943.jpg";

export default function App() {
  const [fontsLoaded] = useFonts({
    SfProRounded: require("@/assets/fonts/sf-pro-rounded.ttf"),
    HelveticaNowDisplay: require("@/assets/fonts/HelveticaNowDisplayMedium.ttf"),
  });

  if (!fontsLoaded) return <></>;

  return (
    <GestureHandlerRootView style={styles.container}>
      <StatusBar style="inverted" />

      <View style={styles.cardWrapper}>
        <RippleImage
          width={350}
          height={420}
          borderRadius={28}
          source={IMAGE_URL}
          style={styles.imageCard}
        />

        <View style={styles.cardOverlay}>
          <Text
            style={[
              styles.cardTitle,
              {
                fontFamily: fontsLoaded ? "SfProRounded" : undefined,
              },
            ]}
          >
            Sherliam
          </Text>
          <Text
            style={[
              styles.cardSubtitle,
              {
                fontFamily: fontsLoaded ? "HelveticaNowDisplay" : undefined,
              },
            ]}
          >
            Carries power he never asked for
          </Text>
        </View>
      </View>

      <RippleRect
        width={220}
        height={46}
        borderRadius={28}
        color="#101010"
        style={styles.button}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
          }}
        >
          <SymbolView name="sparkle" tintColor={"white"} size={17} />
          <Text
            style={[
              styles.buttonText,
              {
                fontFamily: fontsLoaded ? "SfProRounded" : undefined,
              },
            ]}
          >
            Reacticx is awesome!
          </Text>
        </View>
      </RippleRect>
    </GestureHandlerRootView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    gap: 32,
  },

  cardWrapper: {
    borderRadius: 28,
    bottom: 100,
    shadowColor: "#000",
    shadowOpacity: 0.35,
    shadowRadius: 30,
    shadowOffset: { width: 0, height: 20 },
    paddingHorizontal: 20,
  },

  imageCard: {
    backgroundColor: "rgba(255,255,255,0.04)",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(255,255,255,0.18)",
  },

  cardOverlay: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
  },

  cardTitle: {
    fontSize: 22,
    color: "#fff",
  },

  cardSubtitle: {
    fontSize: 14,
    color: "rgba(255,255,255,0.7)",
  },

  button: {
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(255,255,255,0.16)",
    bottom: 120,
    left: 10,
  },

  buttonText: {
    color: "#fff",
    fontSize: 15,
  },
});
