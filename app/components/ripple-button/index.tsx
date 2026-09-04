import { RippleButton } from "@/components";
import { Feather } from "@expo/vector-icons";
import React, { useCallback, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Showcase } from "~/showcase";

export default function RippleButtonScreen() {
  const [loading, setLoading] = useState<boolean>(false);

  const onPress = useCallback(() => {
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  }, []);

  return (
    <Showcase>
      <View style={styles.container}>
        <RippleButton.Root theme="dark" size="lg" onPress={onPress}>
          <RippleButton.Content>
            <RippleButton.Label>Continue</RippleButton.Label>
          </RippleButton.Content>
        </RippleButton.Root>

        <RippleButton.Root
          theme="dark"
          variant="secondary"
          size="lg"
          icon={<Feather name="download" size={16} color="#F6F3EC" />}
          loading={loading}
          onPress={onPress}
        >
          <RippleButton.Content>
            <RippleButton.Label>Download</RippleButton.Label>
          </RippleButton.Content>
        </RippleButton.Root>

        <RippleButton.Root theme="dark" variant="outline" size="lg">
          <RippleButton.Content>
            <RippleButton.Label>Learn more</RippleButton.Label>
          </RippleButton.Content>
        </RippleButton.Root>

        <RippleButton.Root theme="dark" variant="destructive" size="lg">
          <RippleButton.Content>
            <RippleButton.Label>Delete</RippleButton.Label>
          </RippleButton.Content>
        </RippleButton.Root>

        <RippleButton.Root theme="dark" variant="ghost" size="icon-lg">
          <RippleButton.Icon>
            <Feather name="more-horizontal" size={18} color="#F6F3EC" />
          </RippleButton.Icon>
        </RippleButton.Root>
      </View>
    </Showcase>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
    gap: 14,
  },
});
