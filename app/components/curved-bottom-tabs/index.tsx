import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// TODO: import and render the CurvedBottomTabs component.
// import { CurvedBottomTabs } from "@/components";

export default function CurvedBottomTabsScreen() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/(tabs)");
  }, []);
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Curved Bottom Tabs</Text>
        <View style={styles.demo}>{/* <CurvedBottomTabs /> */}</View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  content: { padding: 16, gap: 16 },
  title: { color: "#fff", fontSize: 22, fontWeight: "600" },
  demo: { gap: 12 },
});
