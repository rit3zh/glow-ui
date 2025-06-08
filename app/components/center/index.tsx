import * as React from "react";
import { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  Pressable,
  StyleSheet,
} from "react-native";
import { Center } from "@/components/index";

const CenterDemo: React.FC = (): React.ReactNode => {
  const [activeDemo, setActiveDemo] = useState<string>("basic");

  const demos = {
    basic: {
      title: "Perfect Center",
      subtitle: "Effortless alignment",
      content: (
        <Center style={styles.centerContainer}>
          <View style={styles.basicContent}>
            <View style={styles.iconContainer}>
              <View style={styles.innerIcon} />
            </View>
            <Text style={styles.centeredTitle}>Centered</Text>
            <Text style={styles.centeredSubtitle}>Perfectly aligned</Text>
          </View>
        </Center>
      ),
    },
    card: {
      title: "Content Card",
      subtitle: "Information display",
      content: (
        <Center style={styles.cardContainer}>
          <View
            style={[
              styles.cardContent,
              {
                justifyContent: "center",
                alignItems: "center",
                flex: 1,
              },
            ]}
          >
            <Text
              style={[
                styles.cardTitle,
                { justifyContent: "center", alignItems: "center" },
              ]}
            >
              Dashboard
            </Text>
            <Text style={styles.cardDescription}>
              Welcome to your personalized workspace where everything is
              perfectly centered and organized.
            </Text>
            <View style={styles.dotsContainer}>
              <View style={[styles.dot, styles.activeDot]} />
              <View style={[styles.dot, styles.inactiveDot]} />
              <View style={[styles.dot, styles.inactiveDot]} />
            </View>
          </View>
        </Center>
      ),
    },
    minimal: {
      title: "Pure Minimal",
      subtitle: "Essential elements only",
      content: (
        <Center style={styles.minimalContainer}>
          <View style={styles.minimalContent}>
            <Text
              style={[
                styles.minimalIcon,
                {
                  fontSize: 48,
                  color: "#FFFFFF",
                },
              ]}
            >
              ✦
            </Text>
            <Text style={styles.minimalText}>Minimal</Text>
          </View>
        </Center>
      ),
    },
    interactive: {
      title: "Interactive",
      subtitle: "Touch to interact",
      content: (
        <Pressable>
          <Center style={styles.interactiveContainer}>
            <View style={styles.interactiveContent}>
              <View style={styles.touchIcon}>
                <Text style={styles.touchEmoji}>👆</Text>
              </View>
              <Text style={styles.touchTitle}>Touch Me</Text>
              <Text style={styles.touchSubtitle}>Interactive center</Text>
            </View>
          </Center>
        </Pressable>
      ),
    },
  };
  const activeContent = demos[activeDemo as keyof typeof demos];
  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Center</Text>
          <Text style={styles.headerSubtitle}>
            Perfect alignment made simple
          </Text>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.selectorContainer}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              scrollEnabled
            >
              <View style={styles.selectorRow}>
                {Object.entries(demos).map(([key, demo]) => (
                  <Pressable
                    key={key}
                    onPress={() => setActiveDemo(key)}
                    style={[
                      styles.selectorTab,
                      activeDemo === key
                        ? styles.selectorTabActive
                        : styles.selectorTabInactive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.selectorText,
                        activeDemo === key
                          ? styles.selectorTextActive
                          : styles.selectorTextInactive,
                      ]}
                    >
                      {demo.title}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </ScrollView>
          </View>

          <View style={styles.demoContainer}>
            <View style={styles.demoHeader}>
              <Text style={styles.demoTitle}>{activeContent?.title}</Text>
              <Text style={styles.demoSubtitle}>{activeContent?.subtitle}</Text>
            </View>

            {activeContent?.content}
          </View>
          <View style={styles.footerContainer}>
            <View style={styles.infoCard}>
              <Text style={styles.infoText}>
                The <Text style={styles.infoHighlight}>Center</Text> component
                provides perfect alignment with minimal effort. Switch between
                demos to see different use cases.
              </Text>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0A0A0A",
  },
  safeArea: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: "#27272A30",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#71717A",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 32,
  },
  selectorContainer: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 16,
  },
  selectorRow: {
    flexDirection: "row",
    gap: 12,
  },
  selectorTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  selectorTabActive: {
    backgroundColor: "#FFFFFF10",
    borderColor: "#FFFFFF20",
  },
  selectorTabInactive: {
    backgroundColor: "#18181B80",
    borderColor: "#27272A80",
  },
  selectorText: {
    fontSize: 14,
    fontWeight: "500",
  },
  selectorTextActive: {
    color: "#FFFFFF",
  },
  selectorTextInactive: {
    color: "#71717A",
  },
  demoContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  demoHeader: {
    alignItems: "center",
    marginBottom: 32,
  },
  demoTitle: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 18,
    marginBottom: 4,
  },
  demoSubtitle: {
    color: "#52525B",
    fontSize: 14,
  },
  centerContainer: {
    width: 220,
    height: 220,
    backgroundColor: "#18181B80",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#27272A80",
  },
  basicContent: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  iconContainer: {
    width: 48,
    height: 48,
    backgroundColor: "#FFFFFF10",
    borderRadius: 24,
    marginBottom: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  innerIcon: {
    width: 24,
    height: 24,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
  },
  centeredTitle: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 18,
  },
  centeredSubtitle: {
    color: "#71717A",
    fontSize: 14,
    marginTop: 4,
  },
  cardContainer: {
    width: 320,
    height: 192,
    backgroundColor: "#18181B",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#3F3F4680",
  },
  cardContent: {
    alignItems: "center",
    paddingHorizontal: 24,
  },
  cardTitle: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 20,
    marginBottom: 8,
  },
  cardDescription: {
    color: "#D4D4D8",
    textAlign: "center",
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  dotsContainer: {
    flexDirection: "row",
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  activeDot: {
    backgroundColor: "#22C55E",
  },
  inactiveDot: {
    backgroundColor: "#52525B",
  },
  minimalContainer: {
    width: 158,
    height: 158,
    borderWidth: 2,
    borderColor: "#3F3F46",
    borderRadius: 8,
    borderStyle: "dashed",
  },
  minimalContent: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  minimalIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  minimalText: {
    color: "#FFFFFF",
    fontWeight: "500",
  },
  interactiveContainer: {
    width: 256,
    height: 256,
    backgroundColor: "#FFFFFF05",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#FFFFFF10",
  },
  interactiveContent: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  touchIcon: {
    width: 64,
    height: 64,
    backgroundColor: "#3B82F620",
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  touchEmoji: {
    fontSize: 24,
  },
  touchTitle: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  touchSubtitle: {
    color: "#71717A",
    fontSize: 14,
    marginTop: 4,
  },
  footerContainer: {
    paddingHorizontal: 24,
    paddingTop: 32,
  },
  infoCard: {
    backgroundColor: "#18181B30",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#27272A30",
    padding: 16,
  },
  infoText: {
    color: "#71717A",
    fontSize: 12,
    textAlign: "center",
    lineHeight: 16,
  },
  infoHighlight: {
    color: "#FFFFFF",
    fontWeight: "500",
  },
});

export default CenterDemo;
