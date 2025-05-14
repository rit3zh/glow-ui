import * as React from "react";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { SegmentedControl } from "@/components/organisms/segmented-control/SegmentedControl";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Feather } from "@expo/vector-icons";

type RootStackParamList = {
  Home: undefined;
  Details: undefined;
};

type HomeProps = NativeStackScreenProps<RootStackParamList, "Home">;
export function Home({ navigation }: HomeProps): React.ReactElement {
  const [selectedOption, setSelectedOption] = React.useState("Standard");
  const [value, setValue] = React.useState("daily");
  return (
    <GestureHandlerRootView>
      <SafeAreaView style={styles.container}>
        {/* <Text style={styles.text}>React (Native) 🚀 </Text> */}
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            padding: 16,
          }}
        >
          <Text style={{ marginBottom: 16, fontSize: 16, fontWeight: "500" }}>
            View Analytics
          </Text>

          <SegmentedControl.Root
            value={value}
            onValueChange={setValue}
            theme="dark"
          >
            <SegmentedControl.Item value="daily">
              <Text
                style={{
                  fontSize: 14,
                  color: value === "daily" ? "#fff" : "#a1a1aa",
                }}
              >
                Daily
              </Text>
            </SegmentedControl.Item>

            <SegmentedControl.Item value="weekly">
              <Text
                style={{
                  fontSize: 14,
                  color: value === "weekly" ? "#fff" : "#a1a1aa",
                }}
              >
                Weekly
              </Text>
            </SegmentedControl.Item>

            <SegmentedControl.Item value="yearly">
              <Feather
                name="calendar"
                size={20}
                color={value === "yearly" ? "#fff" : "#a1a1aa"}
              />
            </SegmentedControl.Item>

            <SegmentedControl.Item value="monthly">
              <Text
                style={{
                  fontSize: 14,
                  color: value === "monthly" ? "#fff" : "#a1a1aa",
                }}
              >
                Monthly
              </Text>
            </SegmentedControl.Item>
          </SegmentedControl.Root>

          <Text style={{ marginTop: 24, fontSize: 14, color: "#71717a" }}>
            Viewing {value} analytics data
          </Text>
        </View>
        {/* <FloatingSheet /> */}
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 30,
  },
});
