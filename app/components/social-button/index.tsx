import { StyleSheet, View } from "react-native";
import { StatusBar } from "expo-status-bar";

import {
  SocialButton,
  type TSocialProvider,
} from "@/components/pieces/social-button";
import { Showcase } from "~/showcase";

const PROVIDERS: TSocialProvider[] = ["google", "apple", "github", "x"];

export default function App() {
  return (
    <Showcase>
      <View style={styles.container}>
        <StatusBar style="light" />

        <View style={styles.stack}>
          {PROVIDERS.map((provider) => (
            <SocialButton
              key={provider}
              provider={provider}
              fullWidth
              labelWidth={168}
              radius={14}
              onPress={() => {}}
            >
              <SocialButton.Icon />
              <SocialButton.Label />
            </SocialButton>
          ))}
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
  stack: {
    width: 300,
    gap: 12,
  },
});
