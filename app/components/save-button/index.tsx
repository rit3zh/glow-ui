import React from "react";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { SaveButton } from "@/components/micro-interactions/save-button";
import { Showcase } from "~/showcase";
import { useFonts } from "expo-font";

const wait = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

export default function SaveButtonScreen() {
  const [fontLoaded] = useFonts({
    SfProRounded: require("@/assets/fonts/sf-pro-rounded.ttf"),
    SfProRoundedBold: require("~/assets/fonts/SF-Pro-Rounded-Bold.otf"),
    SfProRoundedMedium: require("~/assets/fonts/SF-Pro-Rounded-Medium.otf"),
  });

  return (
    <Showcase>
      <View style={styles.stage}>
        <SaveButton.Root
          onSave={() => wait(1200)}
          onSaved={() => console.log("saved")}
          resetAfter={2000}
        >
          <SaveButton.Label
            style={{
              fontFamily: fontLoaded ? "SfProRoundedBold" : undefined,
              fontSize: 18,
            }}
          >
            Save
          </SaveButton.Label>
          <SaveButton.Saved
            style={{
              fontFamily: fontLoaded ? "SfProRoundedBold" : undefined,
              fontSize: 18,
            }}
          >
            Saved
          </SaveButton.Saved>
        </SaveButton.Root>
      </View>
    </Showcase>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f6f5f2" },
  stage: { flex: 1, alignItems: "center", justifyContent: "center" },
});
