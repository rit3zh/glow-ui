import { View, StyleSheet, Text, Pressable } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import { useRef } from "react";
import { useFonts } from "expo-font";
import { Feather } from "@expo/vector-icons";
import { BottomSheetMethods } from "@/components/templates/bottom-sheet/types";
import BottomSheet from "@/components/templates/bottom-sheet";

export default function App() {
  const sheetRef = useRef<BottomSheetMethods>(null);
  const [fontLoaded] = useFonts({
    SfProRounded: require("@/assets/fonts/sf-pro-rounded.ttf"),
    HelveticaNowDisplay: require("@/assets/fonts/HelveticaNowDisplayMedium.ttf"),
  });

  const ListItem = ({
    icon,
    label,
    isLast = false,
  }: {
    icon: string;
    label: string;
    isLast?: boolean;
  }) => (
    <Pressable style={[styles.listItem, isLast && styles.listItemLast]}>
      <Feather name={icon as any} size={18} color="#888" />
      <Text
        style={[styles.listText, fontLoaded && { fontFamily: "SfProRounded" }]}
      >
        {label}
      </Text>
      <Feather name="chevron-right" size={16} color="#444" />
    </Pressable>
  );

  return (
    <GestureHandlerRootView style={styles.container}>
      <StatusBar style="light" />

      <Pressable
        style={styles.trigger}
        onPress={() => sheetRef.current?.snapToIndex(0)}
      >
        <Text
          style={[
            styles.triggerText,
            fontLoaded && { fontFamily: "SfProRounded" },
          ]}
        >
          Edit Profile
        </Text>
      </Pressable>

      <BottomSheet
        ref={sheetRef}
        snapPoints={["50%", "90%"]}
        backgroundColor="#1c1c1e"
        backdropOpacity={0.6}
        borderRadius={28}
      >
        <View style={styles.sheet}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.avatar}>
              <Feather name="user" size={32} color="#fff" />
            </View>
            <Text
              style={[
                styles.name,
                fontLoaded && { fontFamily: "HelveticaNowDisplay" },
              ]}
            >
              John Doe
            </Text>
            <Text
              style={[
                styles.email,
                fontLoaded && { fontFamily: "SfProRounded" },
              ]}
            >
              john@example.com
            </Text>
          </View>

          {/* Action Row */}
          <View style={styles.row}>
            <Pressable style={styles.rowItem}>
              <Feather name="edit-2" size={18} color="#0a84ff" />
              <Text
                style={[
                  styles.rowText,
                  fontLoaded && { fontFamily: "SfProRounded" },
                ]}
              >
                Edit
              </Text>
            </Pressable>
            <View style={styles.rowDivider} />
            <Pressable style={styles.rowItem}>
              <Feather name="log-out" size={18} color="#ff453a" />
              <Text
                style={[
                  styles.rowText,
                  { color: "#ff453a" },
                  fontLoaded && { fontFamily: "SfProRounded" },
                ]}
              >
                Logout
              </Text>
            </Pressable>
          </View>

          {/* General Section */}
          <Text
            style={[
              styles.sectionTitle,
              fontLoaded && { fontFamily: "SfProRounded" },
            ]}
          >
            General
          </Text>
          <View style={styles.list}>
            <ListItem icon="bell" label="Notifications" />
            <ListItem icon="moon" label="Appearance" />
            <ListItem icon="globe" label="Language" isLast />
          </View>

          {/* Privacy Section */}
          <Text
            style={[
              styles.sectionTitle,
              fontLoaded && { fontFamily: "SfProRounded" },
            ]}
          >
            Privacy
          </Text>
          <View style={styles.list}>
            <ListItem icon="lock" label="Security" />
            <ListItem icon="shield" label="Data" isLast />
          </View>
        </View>
      </BottomSheet>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  trigger: {
    backgroundColor: "#fff",
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 14,
  },
  triggerText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
  sheet: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  header: {
    alignItems: "center",
    marginBottom: 20,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#2c2c2e",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  name: {
    fontSize: 20,
    color: "#fff",
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: "#666",
  },
  row: {
    flexDirection: "row",
    backgroundColor: "#2c2c2e",
    borderRadius: 14,
    marginBottom: 24,
  },
  rowItem: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
  },
  rowDivider: {
    width: 1,
    backgroundColor: "#3a3a3c",
  },
  rowText: {
    fontSize: 15,
    color: "#0a84ff",
    fontWeight: "500",
  },
  sectionTitle: {
    fontSize: 13,
    color: "#666",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 8,
    marginLeft: 4,
  },
  list: {
    backgroundColor: "#2c2c2e",
    borderRadius: 14,
    marginBottom: 20,
  },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 13,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#3a3a3c",
  },
  listItemLast: {
    borderBottomWidth: 0,
  },
  listText: {
    flex: 1,
    fontSize: 15,
    color: "#fff",
    marginLeft: 12,
  },
});
