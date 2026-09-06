import { StyleSheet, Text, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { RadialIntro, OrbitItem } from "@/components/organisms/radial-intro";
import { Showcase } from "~/showcase";

const ORBIT_ITEMS: OrbitItem[] = [
  {
    id: 1,
    src: "https://i.pinimg.com/1200x/0d/01/b5/0d01b54934faa4240682cf925a916bc4.jpg",
  },
  {
    id: 2,
    src: "https://i.pinimg.com/736x/89/e5/8f/89e58f7a56f71d52a48aa1cb3f119d15.jpg",
  },
  {
    id: 3,
    src: "https://i.pinimg.com/736x/8b/7e/5b/8b7e5b87d65134576cb3ea589afe55cd.jpg",
  },
  {
    id: 4,
    src: "https://i.pinimg.com/1200x/fe/2a/84/fe2a8476ea9aa681bce2208aeababc26.jpg",
  },
  {
    id: 5,
    src: "https://i.pinimg.com/736x/9a/62/e4/9a62e434096352cddae29e5a8625d321.jpg",
  },
];

export default function App() {
  const [expanded, setExpanded] = useState(false);

  return (
    <Showcase>
      <GestureHandlerRootView style={styles.container}>
        <StatusBar style="light" />

        <View style={styles.card}>
          <RadialIntro
            orbitItems={ORBIT_ITEMS}
            expanded={expanded}
            stageSize={400}
            // style={{ marginTop: 10 }}
            revealOnFanOut={Boolean(false)}
            imageSize={90}
            spinDuration={12}
            onCenterPress={() => setExpanded((v) => !v)}
          />
        </View>
      </GestureHandlerRootView>
    </Showcase>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",

    alignItems: "center",
    justifyContent: "center",
  },

  card: {},

  caption: {
    marginTop: 18,
    fontSize: 13,
    color: "rgba(255,255,255,0.55)",
    letterSpacing: -0.2,
  },
});
