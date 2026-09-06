import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ruler from "@/components/base/ruler";
import { Showcase } from "~/showcase";

export default function RulerScreen() {
  const [value, setValue] = useState<number>(0);

  return (
    <Showcase>
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.label}>Weight</Text>
          <View style={styles.valueRow}>
            <Text style={styles.value}>{value}</Text>
            <Text style={styles.unit}>kg</Text>
          </View>
        </View>
        <View
          style={{
            left: 15,
          }}
        >
          <Ruler
            height={150}
            width={400}
            minValue={5}
            maxValue={50}
            step={18}
            tickColor="rgba(255,255,255,0.3)"
            activeTickColor="#b56c1d"
            notchHeight={40}
            notchWidth={3}
            onValueChange={setValue}
          />
        </View>
      </SafeAreaView>
    </Showcase>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0a0a0a" },
  content: { alignItems: "center", gap: 9, marginTop: 100 },
  label: {
    fontSize: 15,
    color: "rgba(255,255,255,0.5)",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  valueRow: { flexDirection: "row", alignItems: "baseline", gap: 6 },
  value: { fontSize: 72, color: "#fff", fontWeight: "600" },
  unit: { fontSize: 24, color: "rgba(255,255,255,0.5)" },
});
