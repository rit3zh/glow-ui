import {
  Button,
  SafeAreaView,
  StyleSheet,
  Text,
  Modal,
  Pressable,
  View,
} from "react-native";
import { BACKGROUND_COLOR } from "../../app.config";
import React from "react";
import { Row } from "@/components";
import Animated from "react-native-reanimated";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { GestureHandlerRootView } from "react-native-gesture-handler";
import { TestCard } from "./Test";

// Define proper type for navigation props
type RootStackParamList = {
  Home: undefined;
  Details: undefined;
};

type HomeProps = NativeStackScreenProps<RootStackParamList, "Home">;

export function Home({ navigation }: HomeProps): React.ReactElement {
  const [visible, setVisible] = React.useState(false);
  return (
    <>
      <SafeAreaView style={styles.container}>
        <Text style={styles.text}>Hey</Text>
      </SafeAreaView>
      <TestCard
        expandedContent={<Animated.View></Animated.View>}
        content={
          <Animated.View>
            <Animated.Image
              source={{
                uri: "https://timelinecovers.pro/facebook-cover/download/dua-lipa-facebook-cover.jpg",
              }}
              style={{
                width: 200,
                height: 200,
                borderRadius: 0,
              }}
            />
          </Animated.View>
        }
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: BACKGROUND_COLOR,
    flex: 1,

    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 20,
  },
});
