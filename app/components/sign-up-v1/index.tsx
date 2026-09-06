import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// TODO: import and render the SignUpV1 component.
// import { SignUpV1 } from "@/components";

export default function SignUpV1Screen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Sign Up V1</Text>
        <View style={styles.demo}>{/* <SignUpV1 /> */}</View>
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
