import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { DustText } from "@/components";
import { Showcase } from "~/showcase";

export default function DustTextScreen() {
  const [visible, setVisible] = useState<boolean>(true);

  return (
    <Showcase>
      <View style={styles.content}>
        <DustText
          visible={visible}
          shape="square"
          fontSource={require("~/assets/fonts/elingston.otf")}
          colors={["#FFFFFF", "#FFD166", "#efeae8", "#efebec"]}
          style={styles.hero}
        >
          okkkk
        </DustText>

        <Pressable
          style={styles.button}
          onPress={() => setVisible((prev) => !prev)}
        >
          <Text style={styles.label}>{visible ? "Dissolve" : "Form"}</Text>
        </Pressable>
      </View>
    </Showcase>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    justifyContent: "center",
    gap: 32,
    paddingHorizontal: 16,
  },
  hero: {
    height: 500,
  },
  button: {
    alignSelf: "center",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 999,
    backgroundColor: "#1995FA",
  },
  label: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },
});
