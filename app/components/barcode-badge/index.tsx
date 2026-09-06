import { StyleSheet, Text, View } from "react-native";
import { StatusBar } from "expo-status-bar";

import { BarcodeBadge } from "@/components/pieces/barcode-badge";
import { Showcase } from "~/showcase";

export default function App() {
  return (
    <Showcase>
      <View style={styles.container}>
        <StatusBar style="light" />

        <View style={styles.tag}>
          <View style={styles.header}>
            <Text style={styles.brand}>Reacticx</Text>
            <Text style={styles.edition}>01 / 50</Text>
          </View>

          <View style={styles.rule} />

          <Text style={styles.product}>Cotton Overshirt</Text>
          <Text style={styles.subtitle}>Garment dyed, boxy fit</Text>

          <View style={styles.meta}>
            <View>
              <Text style={styles.metaLabel}>Size</Text>
              <Text style={styles.metaValue}>M</Text>
            </View>
            <View>
              <Text style={styles.metaLabel}>Color</Text>
              <Text style={styles.metaValue}>Ecru</Text>
            </View>
            <View>
              <Text style={styles.metaLabel}>Price</Text>
              <Text style={styles.metaValue}>$148</Text>
            </View>
          </View>

          <BarcodeBadge
            label="RCTX 0421 M"
            barCount={44}
            palette={{ bars: "#18181B", label: "#71717A" }}
            style={styles.badge}
          >
            <BarcodeBadge.Bars height={52} gap={2} />
            <BarcodeBadge.Label style={styles.badgeLabel} />
          </BarcodeBadge>
        </View>
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
    gap: 56,
  },
  tag: {
    width: 300,
    padding: 26,
    borderRadius: 22,
    backgroundColor: "#FAFAF9",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  brand: {
    fontSize: 15,
    fontWeight: "600",
    letterSpacing: 4,
    textTransform: "uppercase",
    color: "#18181B",
  },
  edition: {
    fontSize: 11,
    letterSpacing: 2,
    color: "#A1A1AA",
  },
  rule: {
    height: StyleSheet.hairlineWidth,
    marginVertical: 20,
    backgroundColor: "#D4D4D8",
  },
  product: {
    fontSize: 26,
    fontWeight: "600",
    letterSpacing: -0.6,
    color: "#18181B",
  },
  subtitle: {
    marginTop: 6,
    fontSize: 13,
    color: "#A1A1AA",
  },
  meta: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 26,
    marginBottom: 30,
  },
  metaLabel: {
    fontSize: 10,
    letterSpacing: 2,
    textTransform: "uppercase",
    color: "#A1A1AA",
  },
  metaValue: {
    marginTop: 5,
    fontSize: 15,
    fontWeight: "500",
    color: "#27272A",
  },
  badge: {
    alignItems: "center",
    gap: 10,
  },
  badgeLabel: {
    fontSize: 11,
    letterSpacing: 4,
  },
  footerBadge: {
    alignItems: "center",
  },
});
