import { View, Text, StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import { useFonts } from "expo-font";
import { SymbolView } from "expo-symbols";
import { DisclosureGroup } from "@/components/molecules/disclosure-group";
import { Showcase } from "~/showcase";

export default function App() {
  const [fontLoaded] = useFonts({
    SfProRounded: require("@/assets/fonts/sf-pro-rounded.ttf"),
    HelveticaNowDisplay: require("@/assets/fonts/HelveticaNowDisplayMedium.ttf"),
  });

  const OPTIONS = [
    { label: "Edit", icon: "pencil" },
    { label: "Duplicate", icon: "doc.on.doc" },
    { label: "Share", icon: "square.and.arrow.up" },
    { label: "Delete", icon: "trash", destructive: true },
  ];

  return (
    <Showcase>
      <GestureHandlerRootView style={styles.container}>
        <StatusBar style="light" />

        <View style={styles.card}>
          <DisclosureGroup>
            <DisclosureGroup.Trigger
              showChevron={false}
              contentContainerStyle={styles.triggerContent}
            >
              <View style={styles.triggerLeft}>
                <Text
                  style={[
                    styles.triggerText,
                    fontLoaded && { fontFamily: "SfProRounded" },
                  ]}
                >
                  More Options
                </Text>
              </View>
              <SymbolView name="chevron.down" size={14} tintColor="#555" />
            </DisclosureGroup.Trigger>

            <DisclosureGroup.Items maxHeight={300} scrollable={false} useBlur>
              {OPTIONS.map((option, index) => (
                <DisclosureGroup.Item
                  key={index}
                  onPress={() => console.log(option.label)}
                  style={styles.item}
                >
                  <SymbolView
                    name={option.icon as any}
                    size={18}
                    tintColor={option.destructive ? "#ff453a" : "#fff"}
                  />
                  <Text
                    style={[
                      styles.itemText,
                      option.destructive && styles.destructiveText,
                      fontLoaded && { fontFamily: "SfProRounded" },
                    ]}
                  >
                    {option.label}
                  </Text>
                </DisclosureGroup.Item>
              ))}
            </DisclosureGroup.Items>
          </DisclosureGroup>
        </View>
      </GestureHandlerRootView>
    </Showcase>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a0a0a",
    justifyContent: "center",
    padding: 12,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 100,
    gap: 0,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#fff",
  },
  subtitle: {
    fontSize: 15,
    color: "#555",
  },
  card: {
    backgroundColor: "#141414",
    borderRadius: 16,
    overflow: "hidden",
    marginTop: 20,
  },
  triggerContent: {
    padding: 16,
  },
  triggerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  triggerText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#fff",
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
    backgroundColor: "#1a1a1a",
    borderRadius: 12,
    marginBottom: 6,
  },
  itemText: {
    fontSize: 15,
    color: "#fff",
  },
  destructiveText: {
    color: "#ff453a",
  },
});
