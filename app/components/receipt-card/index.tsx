import { StyleSheet, View } from "react-native";
import { StatusBar } from "expo-status-bar";

import { ReceiptCard } from "@/components/pieces/receipt-card";
import { Showcase } from "~/showcase";

export default function App() {
  return (
    <Showcase>
      <View style={styles.container}>
        <StatusBar style="light" />

        <ReceiptCard width={300}>
          <ReceiptCard.TornEdge side="top" />

          <ReceiptCard.Header>
            <ReceiptCard.Store>Reacticx</ReceiptCard.Store>
            <ReceiptCard.Meta>INV-2026-0142 · Aug 26</ReceiptCard.Meta>
          </ReceiptCard.Header>

          <ReceiptCard.Separator />

          <ReceiptCard.Items>
            <ReceiptCard.Item label="Landing page" value="$1,900" />
            <ReceiptCard.Item label="Brand refresh" value="$2,400" />
            <ReceiptCard.Item label="Rush delivery" value="$350" />
          </ReceiptCard.Items>

          <ReceiptCard.Separator variant="dashed" />

          <ReceiptCard.Items>
            <ReceiptCard.Item label="Subtotal" value="$4,650" />
            <ReceiptCard.Item label="Tax" value="$0.00" />
          </ReceiptCard.Items>

          <ReceiptCard.Separator />

          <ReceiptCard.Total value="$4,650" />
          <ReceiptCard.Note>Thank you, see you again</ReceiptCard.Note>
          <ReceiptCard.Barcode code="INV-2026-0142" />

          <ReceiptCard.TornEdge side="bottom" />
        </ReceiptCard>
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
});
