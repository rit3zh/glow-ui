import { Button, SafeAreaView, StyleSheet, Text } from "react-native";
import { BACKGROUND_COLOR } from "../../app.config";
import React from "react";
import { Row } from "@/components";
import Animated, {
  SharedTransition,
  SharedTransitionType,
  withSpring,
} from "react-native-reanimated";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

type RootStackParamList = {
  Home: undefined;
  Details: undefined;
};

type DetailsProps = NativeStackScreenProps<RootStackParamList, "Details">;

export function Details({
  navigation,
  route,
}: DetailsProps): React.ReactElement {
  const params = route.params as any;

  return (
    <SafeAreaView style={styles.container}>
      <Row
        style={{
          alignItems: "center",
          justifyContent: "center",
        }}
      >
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
            sharedTransitionTag="profile_image"
          />
        </Animated.View>
      </Row>
      <Text style={styles.text}>Details Screen</Text>
      <Button title="Go back" onPress={() => navigation.goBack()} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: BACKGROUND_COLOR,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 20,
  },
});
