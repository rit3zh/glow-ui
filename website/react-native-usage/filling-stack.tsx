import { View, Text, StyleSheet, Dimensions } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import { useFonts } from "expo-font";
import { SymbolView } from "expo-symbols";
import { FlingStack } from "@/components/molecules/stacked-cards";
import { LinearGradient } from "expo-linear-gradient";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

interface Card {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  progress: number;
  gradient: string[];
  tasks: number;
  completed: number;
}

export default function App() {
  const [fontLoaded] = useFonts({
    SfProRounded: require("@/assets/fonts/sf-pro-rounded.ttf"),
    HelveticaNowDisplay: require("@/assets/fonts/HelveticaNowDisplayMedium.ttf"),
    Coolvetica: require("@/assets/fonts/Coolvetica-Rg.otf"),
  });

  const cards: Card[] = [
    {
      id: "1",
      title: "Mobile App",
      subtitle: "Design & Development",
      category: "In Progress",
      progress: 75,
      gradient: ["#FF6B6B", "#FF8E53"],
      tasks: 12,
      completed: 9,
    },
    {
      id: "2",
      title: "Website Redesign",
      subtitle: "UI/UX Updates",
      category: "Review",
      progress: 45,
      gradient: ["#4ECDC4", "#44A08D"],
      tasks: 8,
      completed: 4,
    },
    {
      id: "3",
      title: "Marketing Campaign",
      subtitle: "Social Media Strategy",
      category: "Planning",
      progress: 30,
      gradient: ["#667EEA", "#764BA2"],
      tasks: 15,
      completed: 5,
    },
    {
      id: "4",
      title: "API Integration",
      subtitle: "Backend Services",
      category: "Development",
      progress: 60,
      gradient: ["#F093FB", "#F5576C"],
      tasks: 10,
      completed: 6,
    },
    {
      id: "5",
      title: "User Testing",
      subtitle: "Feedback & Analytics",
      category: "Research",
      progress: 90,
      gradient: ["#4FACFE", "#00F2FE"],
      tasks: 6,
      completed: 5,
    },
  ];

  return (
    <GestureHandlerRootView style={styles.container}>
      <StatusBar style="light" />

      <View style={styles.header}>
        <View>
          <Text
            style={[
              styles.title,
              { fontFamily: fontLoaded ? "Coolvetica" : undefined },
            ]}
          >
            Projects
          </Text>
          <Text
            style={[
              styles.subtitle,
              { fontFamily: fontLoaded ? "SfProRounded" : undefined },
            ]}
          >
            {cards.length} active projects
          </Text>
        </View>
        <View style={styles.iconButton}>
          <SymbolView name="plus" size={20} tintColor="#fff" />
        </View>
      </View>

      <FlingStack
        data={cards}
        visibleCount={4}
        cardWidth={SCREEN_WIDTH - 48}
        cardHeight={480}
        useBlur={true}
        blurIntensity={25}
        tint="dark"
        renderItem={({ item }) => (
          <LinearGradient
            colors={item.gradient as any}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.card}
          >
            <View style={styles.cardHeader}>
              <View style={styles.categoryBadge}>
                <View style={styles.statusDot} />
                <Text
                  style={[
                    styles.categoryText,
                    { fontFamily: fontLoaded ? "SfProRounded" : undefined },
                  ]}
                >
                  {item.category}
                </Text>
              </View>
              <View style={styles.menuButton}>
                <SymbolView name="ellipsis" size={20} tintColor="#fff" />
              </View>
            </View>

            <View style={styles.cardContent}>
              <Text
                style={[
                  styles.cardTitle,
                  {
                    fontFamily: fontLoaded ? "HelveticaNowDisplay" : undefined,
                  },
                ]}
              >
                {item.title}
              </Text>
              <Text
                style={[
                  styles.cardSubtitle,
                  { fontFamily: fontLoaded ? "SfProRounded" : undefined },
                ]}
              >
                {item.subtitle}
              </Text>

              <View style={styles.progressSection}>
                <View style={styles.progressHeader}>
                  <Text
                    style={[
                      styles.progressLabel,
                      { fontFamily: fontLoaded ? "SfProRounded" : undefined },
                    ]}
                  >
                    Progress
                  </Text>
                  <Text
                    style={[
                      styles.progressPercent,
                      { fontFamily: fontLoaded ? "SfProRounded" : undefined },
                    ]}
                  >
                    {item.progress}%
                  </Text>
                </View>
                <View style={styles.progressBarContainer}>
                  <View
                    style={[
                      styles.progressBarFill,
                      { width: `${item.progress}%` },
                    ]}
                  />
                </View>
              </View>

              <View style={styles.statsRow}>
                <View style={styles.statItem}>
                  <SymbolView
                    name="checkmark.circle.fill"
                    size={18}
                    tintColor="rgba(255,255,255,0.9)"
                  />
                  <Text
                    style={[
                      styles.statText,
                      { fontFamily: fontLoaded ? "SfProRounded" : undefined },
                    ]}
                  >
                    {item.completed}/{item.tasks} tasks
                  </Text>
                </View>
                <View style={styles.statItem}>
                  <SymbolView
                    name="clock.fill"
                    size={18}
                    tintColor="rgba(255,255,255,0.9)"
                  />
                  <Text
                    style={[
                      styles.statText,
                      { fontFamily: fontLoaded ? "SfProRounded" : undefined },
                    ]}
                  >
                    2 days left
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.cardFooter}>
              <View style={styles.avatarGroup}>
                <View style={styles.avatar}>
                  <SymbolView name="person.fill" size={14} tintColor="#fff" />
                </View>
                <View style={[styles.avatar, styles.avatarOverlap]}>
                  <SymbolView name="person.fill" size={14} tintColor="#fff" />
                </View>
                <View style={[styles.avatar, styles.avatarOverlap]}>
                  <SymbolView name="person.fill" size={14} tintColor="#fff" />
                </View>
                <View style={[styles.avatarMore, styles.avatarOverlap]}>
                  <Text
                    style={[
                      styles.avatarMoreText,
                      { fontFamily: fontLoaded ? "SfProRounded" : undefined },
                    ]}
                  >
                    +3
                  </Text>
                </View>
              </View>
              <View style={styles.actionButton}>
                <Text
                  style={[
                    styles.actionButtonText,
                    { fontFamily: fontLoaded ? "SfProRounded" : undefined },
                  ]}
                >
                  View Details
                </Text>
                <SymbolView
                  name="arrow.right"
                  size={14}
                  tintColor="rgba(255,255,255,0.9)"
                />
              </View>
            </View>
          </LinearGradient>
        )}
      />

      {/* Instructions */}
      <View style={styles.instructions}>
        <SymbolView name="arrow.up.arrow.down" size={16} tintColor="#666" />
        <Text
          style={[
            styles.instructionText,
            { fontFamily: fontLoaded ? "SfProRounded" : undefined },
          ]}
        >
          Swipe to navigate projects
        </Text>
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a0a0a",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 75,
    paddingBottom: 350,
  },
  title: {
    fontSize: 39,
    fontWeight: "700",
    color: "#fff",
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    marginTop: 5,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.08)",
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    flex: 1,
    borderRadius: 24,
    padding: 24,
    justifyContent: "space-between",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  categoryBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(255,255,255,0.25)",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 14,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#fff",
  },
  categoryText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#fff",
  },
  menuButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  cardContent: {
    flex: 1,
    justifyContent: "center",
    gap: 24,
  },
  cardTitle: {
    fontSize: 38,
    fontWeight: "700",
    color: "#fff",
    lineHeight: 44,
  },
  cardSubtitle: {
    fontSize: 16,
    color: "rgba(255,255,255,0.8)",
    marginTop: -16,
  },
  progressSection: {
    gap: 12,
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  progressLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "rgba(255,255,255,0.9)",
  },
  progressPercent: {
    fontSize: 16,
    fontWeight: "700",
    color: "#fff",
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "#fff",
    borderRadius: 4,
  },
  statsRow: {
    flexDirection: "row",
    gap: 16,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "rgba(255,255,255,0.15)",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  statText: {
    fontSize: 13,
    fontWeight: "600",
    color: "rgba(255,255,255,0.95)",
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  avatarGroup: {
    flexDirection: "row",
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.3)",
    borderWidth: 2,
    borderColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarOverlap: {
    marginLeft: -12,
  },
  avatarMore: {
    backgroundColor: "rgba(255,255,255,0.25)",
  },
  avatarMoreText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#fff",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "rgba(255,255,255,0.25)",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 16,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#fff",
  },
  instructions: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    paddingBottom: 40,
  },
  instructionText: {
    fontSize: 13,
    color: "#666",
  },
});
