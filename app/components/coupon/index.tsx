import { StyleSheet, Text, View } from "react-native";
import { StatusBar } from "expo-status-bar";

import { Coupon, EMERALD_PALETTE } from "@/components/pieces/coupon";
import { Showcase } from "~/showcase";

export default function App() {
  return (
    <Showcase>
      <View style={styles.container}>
        <StatusBar style="light" />

        <View style={styles.card}>
          <View style={styles.header}>
            <Text style={styles.brand}>Reacticx</Text>
            <Text style={styles.eyebrow}>Checkout</Text>
          </View>

          <View style={styles.rule} />

          <View style={styles.row}>
            <Text style={styles.rowLabel}>Subtotal</Text>
            <Text style={styles.rowValue}>$148.00</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Shipping</Text>
            <Text style={styles.rowValue}>Free</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Discount</Text>
            <Text style={styles.rowValue}>−$29.60</Text>
          </View>

          <Coupon
            border="dashed"
            palette={EMERALD_PALETTE}
            style={styles.coupon}
          >
            <Coupon.Code style={styles.couponCode}>REACTICX20</Coupon.Code>
            <Coupon.Discount>20% off</Coupon.Discount>
          </Coupon>

          <View style={styles.rule} />

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>$118.40</Text>
          </View>
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
  },
  card: {
    width: 320,
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
  eyebrow: {
    fontSize: 11,
    letterSpacing: 2,
    textTransform: "uppercase",
    color: "#A1A1AA",
  },
  rule: {
    height: StyleSheet.hairlineWidth,
    marginVertical: 20,
    backgroundColor: "#D4D4D8",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 7,
  },
  rowLabel: {
    fontSize: 14,
    color: "#71717A",
  },
  rowValue: {
    fontSize: 14,
    fontWeight: "500",
    color: "#27272A",
  },
  coupon: {
    alignSelf: "stretch",
    marginTop: 20,
  },
  couponCode: {
    flex: 1,
  },
  totalRow: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "space-between",
  },
  totalLabel: {
    fontSize: 11,
    letterSpacing: 2,
    textTransform: "uppercase",
    color: "#A1A1AA",
  },
  totalValue: {
    fontSize: 26,
    fontWeight: "600",
    letterSpacing: -0.6,
    color: "#18181B",
  },
});
