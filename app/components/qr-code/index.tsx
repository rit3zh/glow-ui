import { QRCode } from "@/components/base/qr-code";
import React from "react";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Showcase } from "~/showcase";

export default function QrCodeScreen() {
  const insets = useSafeAreaInsets();
  return (
    <Showcase>
      <View
        style={[
          styles.stage,
          {
            paddingTop: insets.top,
          },
        ]}
      >
        <View style={[styles.qr, {}]}>
          <QRCode>
            <QRCode.Label>Show QR Code</QRCode.Label>
            <QRCode.Value value="https://reacticx.dev" />
            <QRCode.Actions>
              <QRCode.ExpandableLabel
                onPress={(value) => console.log("copy", value)}
              >
                <QRCode.ExpandableLabel.Icon name="copy" />
                Copy
              </QRCode.ExpandableLabel>
              <QRCode.CloseButton />
            </QRCode.Actions>
          </QRCode>
        </View>
      </View>
    </Showcase>
  );
}

const styles = StyleSheet.create({
  stage: {
    flex: 1,
    paddingBottom: 120,
  },
  container: { flex: 1, backgroundColor: "#000" },
  content: { padding: 16, gap: 16 },
  title: { color: "#fff", fontSize: 22, fontWeight: "600" },
  demo: { gap: 12 },
  qr: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
});
