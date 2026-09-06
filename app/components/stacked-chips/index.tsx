import { View, Text, StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import { useFonts } from "expo-font";
import { SymbolView } from "expo-symbols";
import { StackedChips } from "@/components/micro-interactions/stacked-chips";
import { Showcase } from "~/showcase";

export default function App() {
  const [fontLoaded] = useFonts({
    SfProRounded: require("@/assets/fonts/sf-pro-rounded.ttf"),
    HelveticaNowDisplay: require("@/assets/fonts/HelveticaNowDisplayMedium.ttf"),
  });

  return (
    <Showcase>
      <GestureHandlerRootView style={styles.container}>
        <StatusBar style="light" />

        <StackedChips>
          <StackedChips.Trigger>
            <View style={[styles.chip, styles.chipPrimary]}>
              <SymbolView name="plus" size={16} tintColor="#000" />
              <Text
                style={[
                  styles.chipText,
                  fontLoaded && { fontFamily: "SfProRounded" },
                  {
                    color: "#000",
                  },
                ]}
              >
                Create
              </Text>
            </View>
          </StackedChips.Trigger>

          <StackedChips.Content>
            <StackedChips>
              <StackedChips.Trigger>
                <View
                  style={[
                    styles.chip,
                    styles.chipSecondary,
                    {
                      marginLeft: 20,
                    },
                  ]}
                >
                  <SymbolView name="doc.fill" size={16} tintColor="#fff" />
                  <Text
                    style={[
                      styles.chipText,
                      fontLoaded && { fontFamily: "SfProRounded" },
                    ]}
                  >
                    Document
                  </Text>
                </View>
              </StackedChips.Trigger>

              <StackedChips.Content>
                <StackedChips>
                  <StackedChips.Trigger>
                    <View style={[styles.chip, styles.chipTertiary]}>
                      <SymbolView
                        name="folder.fill"
                        size={16}
                        tintColor="#fff"
                      />
                      <Text
                        style={[
                          styles.chipText,
                          fontLoaded && { fontFamily: "SfProRounded" },
                        ]}
                      >
                        Folder
                      </Text>
                    </View>
                  </StackedChips.Trigger>

                  <StackedChips.Content>
                    <View style={[styles.chip, styles.chipQuaternary]}>
                      <SymbolView
                        name="photo.fill"
                        size={16}
                        tintColor="#fff"
                      />
                      <Text
                        style={[
                          styles.chipText,
                          fontLoaded && { fontFamily: "SfProRounded" },
                        ]}
                      >
                        Photo
                      </Text>
                    </View>
                  </StackedChips.Content>
                </StackedChips>
              </StackedChips.Content>
            </StackedChips>
          </StackedChips.Content>
        </StackedChips>
      </GestureHandlerRootView>
    </Showcase>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a0a0a",
    justifyContent: "center",
    // alignItems: "center",
    paddingHorizontal: 12,
  },
  content: {
    flex: 1,
    // justifyContent: "center",
    marginTop: 150,
    paddingHorizontal: 12,
    gap: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 8,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 50,
  },
  chipPrimary: {
    backgroundColor: "#fff",
  },
  chipSecondary: {
    backgroundColor: "#333",
    marginLeft: 20,
    paddingHorizontal: 50,
  },
  chipTertiary: {
    backgroundColor: "#222",
    marginLeft: 20,
    paddingHorizontal: 50,
  },
  chipQuaternary: {
    backgroundColor: "#1a1a1a",
    marginLeft: 20,
  },
  chipText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#fff",
  },
  hint: {
    fontSize: 13,
    color: "#444",
    marginTop: 8,
  },
});
