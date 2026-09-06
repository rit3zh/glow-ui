import { StyleSheet, View } from "react-native";
import { StatusBar } from "expo-status-bar";

import { INK_PALETTE, VerifiedBadge } from "@/components/pieces/verified-badge";
import { Showcase } from "~/showcase";

export default function App() {
  return (
    <Showcase>
      <View style={styles.container}>
        <StatusBar style="light" />

        <VerifiedBadge palette={INK_PALETTE} gap={10} style={styles.badge}>
          <VerifiedBadge.Check size={26} />
          <VerifiedBadge.Name style={styles.name}>Reacticx</VerifiedBadge.Name>
          <VerifiedBadge.Handle style={styles.handle}>
            @reacticx
          </VerifiedBadge.Handle>
        </VerifiedBadge>
      </View>
    </Showcase>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a0a0a",
    alignItems: "center",
    justifyContent: "center",
  },
  badge: {
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  name: {
    fontSize: 19,
  },
  handle: {
    fontSize: 15,
  },
});
