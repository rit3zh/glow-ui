import { View, Text, StyleSheet, Dimensions, Image } from "react-native";
import React from "react";

import { LinearGradient } from "expo-linear-gradient";
import Svg, {
  Circle,
  Defs,
  Path,
  RadialGradient,
  Stop,
} from "react-native-svg";

const { width, height } = Dimensions.get("window");

const GRADIENT_COLORS: string[] = [
  "#f8a5a5",
  "#f57b82",
  "#e8435d",
  "#c22b54",
  "#941c6a",
];

interface AdBannerProps {}

export const AdBanner: React.JSX.ElementType &
  React.FC<AdBannerProps> &
  React.FunctionComponent<AdBannerProps> = ({}: AdBannerProps) => {
  return (
    <LinearGradient
      style={styles.container}
      colors={[...(GRADIENT_COLORS as [string, string, ...string[]])]}
      locations={[0, 0.25, 0.5, 0.75, 1]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <Svg height="100%" width="50%" viewBox="0 0 100 100" style={styles.svg}>
        <Defs>
          <RadialGradient id="grad" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
            <Stop offset="0%" stopColor="#ffffff" stopOpacity="0.2" />
            <Stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </RadialGradient>
        </Defs>
        <Path
          d="M43,-45.7C56.2,-29.8,67.7,-14.9,68.7,0.9C69.6,16.7,59.9,33.4,46.7,49.2C33.4,64.9,16.7,79.6,-3.3,82.9C-23.3,86.1,-46.6,78,-59,62.3C-71.4,46.6,-72.9,23.3,-67.5,5.4C-62.1,-12.5,-49.8,-25,-37.4,-40.9C-25,-56.8,-12.5,-76,1.2,-77.2C14.9,-78.4,29.8,-61.5,43,-45.7Z"
          fill="rgba(255, 255, 255, 0.1)"
          transform="translate(50 40)"
          translate={[0, 20]}
          scale={0.6}
        />
        <Circle cx="30" cy="40" r="5" fill="rgba(255,255,255,0.15)" />
        <Circle cx="70" cy="60" r="8" fill="rgba(255,255,255,0.1)" />
        <Circle cx="20" cy="70" r="10" fill="rgba(255,255,255,0.05)" />
      </Svg>
      <Image
        source={require("../../../../assets/vector-banner.png")}
        style={styles.image}
      />

      <View
        style={{
          position: "absolute",
          width: width - 40,
          height: height,

          justifyContent: "center",
          alignItems: "flex-end",
        }}
      >
        <Text
          style={{
            fontSize: 14,
            fontWeight: "bold",
            color: "white",

            textAlign: "center",
            textShadowColor: "rgba(0, 0, 0, 0.2)",
            textShadowOffset: { width: 1, height: 1 },
            textShadowRadius: 3,
          }}
        >
          Get 50% off on your first purchase!
        </Text>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    width: width - 30,
    height: 150,

    borderRadius: 10,
    justifyContent: "center",
  },

  gradient: {
    position: "absolute",
    width: width,
    height: height,
  },
  svgContainer: {
    position: "absolute",
    width: width,
    height: height,
    opacity: 0.1,
  },
  svg: {
    position: "absolute",
  },
  contentContainer: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 30,
  },
  title: {
    fontSize: 42,
    fontWeight: "bold",
    color: "white",
    textShadowColor: "rgba(0, 0, 0, 0.2)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: "rgba(255, 255, 255, 0.8)",
    marginBottom: 20,
  },
  illustrationContainer: {
    alignItems: "center",
    marginVertical: 30,
  },
  textContent: {
    marginBottom: 30,
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 24,
    color: "rgba(255, 255, 255, 0.8)",
    marginBottom: 20,
  },
  buttonContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  button: {
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  image: {
    width: 120,
    height: 120,
    marginLeft: 10,
  },
});
