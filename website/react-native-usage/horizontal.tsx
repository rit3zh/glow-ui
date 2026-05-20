import { View, StyleSheet, Text } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import { HorizontalDivider } from "@/components";
import { MaterialIcons } from "@expo/vector-icons";
import { useFonts } from "expo-font";

export default function App() {
  const [fontLoaded] = useFonts({
    SfProRounded: require("@/assets/fonts/sf-pro-rounded.ttf"),
    HelveticaNowDisplay: require("@/assets/fonts/CoolveticaLt-Regular.ttf"),
  });

  return (
    <GestureHandlerRootView style={styles.container}>
      <StatusBar style="light" />

      <Text
        style={{
          color: "#fff",
          fontSize: 24,
          fontFamily: fontLoaded ? "HelveticaNowDisplay" : undefined,
          marginBottom: 20,
          marginLeft: 10,
        }}
      >
        Horizontal Divider
      </Text>

      <HorizontalDivider color="#27272a" height={34} width={1}>
        <View style={styles.statColumn}>
          <Text style={styles.statLabel}>RATINGS</Text>
          <Text style={styles.statValue}>4.7</Text>
          <View style={styles.starsContainer}>
            {[...Array(5)].map((_, i) => (
              <Text key={i} style={styles.star}>
                ★
              </Text>
            ))}
          </View>
          <Text style={styles.statSubtext}>912K</Text>
        </View>

        <View style={styles.statColumn}>
          <Text style={styles.statLabel}>AGE RATING</Text>
          <Text style={styles.statValue}>4+</Text>
          <Text style={styles.statSubtext}>Years Old</Text>
        </View>

        <View style={styles.statColumn}>
          <Text style={styles.statLabel}>CHART</Text>
          <Text style={styles.statValue}>#7</Text>
          <Text style={styles.statSubtext}>Racing</Text>
        </View>

        <View style={styles.statColumn}>
          <Text style={styles.statLabel}>DEVELOPER</Text>
          <View style={styles.developerIcon}>
            <MaterialIcons name="games" size={20} color="#a1a1aa" />
          </View>
          <Text style={styles.statSubtext}>Nintendo</Text>
        </View>
      </HorizontalDivider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    paddingHorizontal: 24,
    paddingTop: 100,
  },
  box: {
    height: 60,
    backgroundColor: "#ffffff",
    borderRadius: 12,
    marginVertical: 8,
  },
  statColumn: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  statLabel: {
    fontSize: 10,
    color: "#a1a1aa",
    fontWeight: "500",
    marginBottom: 4,
    letterSpacing: 0,
  },
  statValue: {
    fontSize: 24,
    color: "#fafafa",
    fontWeight: "700",
    marginBottom: 4,
  },
  starsContainer: {
    flexDirection: "row",
    marginBottom: 4,
  },
  star: {
    color: "#f59e0b",
    fontSize: 12.5,
  },
  statSubtext: {
    fontSize: 12,
    color: "#71717a",
  },
  developerIcon: {
    width: 32,
    height: 32,
    backgroundColor: "#27272a",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
});
