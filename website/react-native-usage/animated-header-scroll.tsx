import { View, Text, StyleSheet, Pressable } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import { useFonts } from "expo-font";
import { Feather } from "@expo/vector-icons";
import { AnimatedHeaderScrollView } from "@/components/organisms/animated-header-scrollview";
import { SafeAreaProvider } from "react-native-safe-area-context";

const RECENT = [
  { id: "1", title: "Morning Routine", time: "6:00 AM", icon: "sun" },
  { id: "2", title: "Workout", time: "7:30 AM", icon: "activity" },
  { id: "3", title: "Team Standup", time: "9:00 AM", icon: "users" },
];

const TASKS = [
  { id: "1", title: "Review designs", done: true },
  { id: "2", title: "Update documentation", done: false },
  { id: "3", title: "Send weekly report", done: false },
  { id: "4", title: "Schedule meeting", done: true },
];

export default function App() {
  const [fontLoaded] = useFonts({
    SfProRounded: require("@/assets/fonts/sf-pro-rounded.ttf"),
    HelveticaNowDisplay: require("@/assets/fonts/HelveticaNowDisplayMedium.ttf"),
  });

  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={styles.container}>
        <StatusBar style="light" />

        <AnimatedHeaderScrollView
          largeTitle="Today"
          subtitle="Wednesday, Jan 22"
          largeHeaderTitleStyle={{
            fontSize: 38,
            fontWeight: "bold",
          }}
          largeHeaderSubtitleStyle={{
            fontFamily: fontLoaded ? "SfProRounded" : undefined,
            fontSize: 16,
          }}
          smallHeaderTitleStyle={{
            fontFamily: fontLoaded ? "HelveticaNowDisplay" : undefined,
            fontSize: 18,
          }}
        >
          {/* Schedule Section */}
          <Text
            style={[
              styles.sectionTitle,
              fontLoaded && { fontFamily: "SfProRounded" },
            ]}
          >
            Schedule
          </Text>
          <View style={styles.card}>
            {RECENT.map((item, index) => (
              <View
                key={item.id}
                style={[
                  styles.scheduleItem,
                  index !== RECENT.length - 1 && styles.borderBottom,
                ]}
              >
                <View style={styles.iconBox}>
                  <Feather name={item.icon as any} size={18} color="#0a84ff" />
                </View>
                <View style={styles.scheduleInfo}>
                  <Text
                    style={[
                      styles.scheduleTitle,
                      fontLoaded && { fontFamily: "SfProRounded" },
                    ]}
                  >
                    {item.title}
                  </Text>
                  <Text
                    style={[
                      styles.scheduleTime,
                      fontLoaded && { fontFamily: "SfProRounded" },
                    ]}
                  >
                    {item.time}
                  </Text>
                </View>
                <Feather name="chevron-right" size={18} color="#444" />
              </View>
            ))}
          </View>

          {/* Tasks Section */}
          <Text
            style={[
              styles.sectionTitle,
              fontLoaded && { fontFamily: "SfProRounded" },
            ]}
          >
            Tasks
          </Text>
          <View style={styles.card}>
            {TASKS.map((task, index) => (
              <Pressable
                key={task.id}
                style={[
                  styles.taskItem,
                  index !== TASKS.length - 1 && styles.borderBottom,
                ]}
              >
                <View
                  style={[styles.checkbox, task.done && styles.checkboxDone]}
                >
                  {task.done && <Feather name="check" size={12} color="#fff" />}
                </View>
                <Text
                  style={[
                    styles.taskTitle,
                    task.done && styles.taskDone,
                    fontLoaded && { fontFamily: "SfProRounded" },
                  ]}
                >
                  {task.title}
                </Text>
              </Pressable>
            ))}
          </View>

          {/* Quick Actions */}
          <Text
            style={[
              styles.sectionTitle,
              fontLoaded && { fontFamily: "SfProRounded" },
            ]}
          >
            Quick Actions
          </Text>
          <View style={styles.actions}>
            <Pressable style={styles.actionBtn}>
              <Feather name="plus" size={22} color="#30d158" />
              <Text
                style={[
                  styles.actionText,
                  fontLoaded && { fontFamily: "SfProRounded" },
                ]}
              >
                New Task
              </Text>
            </Pressable>
            <Pressable style={styles.actionBtn}>
              <Feather name="calendar" size={22} color="#0a84ff" />
              <Text
                style={[
                  styles.actionText,
                  fontLoaded && { fontFamily: "SfProRounded" },
                ]}
              >
                Schedule
              </Text>
            </Pressable>
            <Pressable style={styles.actionBtn}>
              <Feather name="bookmark" size={22} color="#ff9f0a" />
              <Text
                style={[
                  styles.actionText,
                  fontLoaded && { fontFamily: "SfProRounded" },
                ]}
              >
                Saved
              </Text>
            </Pressable>
          </View>

          <View style={styles.spacer} />
        </AnimatedHeaderScrollView>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  sectionTitle: {
    fontSize: 13,
    color: "#666",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 10,
    marginTop: 24,
    marginLeft: 4,
  },
  card: {
    backgroundColor: "#1c1c1e",
    borderRadius: 16,
    overflow: "hidden",
  },
  borderBottom: {
    borderBottomWidth: 1,
    borderBottomColor: "#2c2c2e",
  },
  scheduleItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "rgba(10,132,255,0.15)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  scheduleInfo: {
    flex: 1,
  },
  scheduleTitle: {
    fontSize: 16,
    color: "#fff",
    marginBottom: 2,
  },
  scheduleTime: {
    fontSize: 13,
    color: "#666",
  },
  taskItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: "#444",
    marginRight: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxDone: {
    backgroundColor: "#30d158",
    borderColor: "#30d158",
  },
  taskTitle: {
    fontSize: 16,
    color: "#fff",
  },
  taskDone: {
    color: "#666",
    textDecorationLine: "line-through",
  },
  actions: {
    flexDirection: "row",
    gap: 12,
  },
  actionBtn: {
    flex: 1,
    backgroundColor: "#1c1c1e",
    borderRadius: 14,
    paddingVertical: 20,
    alignItems: "center",
    gap: 8,
  },
  actionText: {
    fontSize: 13,
    color: "#fff",
  },
  spacer: {
    height: 100,
  },
});
