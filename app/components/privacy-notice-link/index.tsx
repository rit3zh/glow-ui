import { View, Text, StyleSheet, ScrollView } from "react-native";
import React from "react";
import { MaterialIcons, Feather, Ionicons } from "@expo/vector-icons";
import { PrivacyNoticeLink } from "@/components/index";

const PrivacyNoticeLinkDemo = () => {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      scrollEnabled
      contentInsetAdjustmentBehavior="always"
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <MaterialIcons name="privacy-tip" size={32} color="#60a5fa" />
        </View>
        <Text style={styles.title}>Privacy Notice Demo</Text>
        <Text style={styles.subtitle}>
          Explore different variations of the PrivacyNoticeLink component
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Basic Usage</Text>
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Feather name="shield" size={16} color="#10b981" />
            <Text style={styles.cardTitle}>Default Style</Text>
          </View>
          <View style={styles.cardContent}>
            <PrivacyNoticeLink
              onPress={() => console.log("Privacy notice pressed")}
              size={14}
              style={styles.linkDefault}
            >
              Read our Privacy Policy
            </PrivacyNoticeLink>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Color Variations</Text>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="color-palette-outline" size={16} color="#f59e0b" />
            <Text style={styles.cardTitle}>Accent Colors</Text>
          </View>
          <View style={styles.cardContent}>
            <View style={styles.linkGroup}>
              <PrivacyNoticeLink
                onPress={() => {}}
                size={14}
                tint="#60a5fa"
                style={styles.linkSpacing}
              >
                Privacy Policy (Blue)
              </PrivacyNoticeLink>

              <PrivacyNoticeLink
                onPress={() => {}}
                size={14}
                tint="#10b981"
                style={styles.linkSpacing}
              >
                Privacy Policy (Green)
              </PrivacyNoticeLink>

              <PrivacyNoticeLink
                onPress={() => {}}
                size={14}
                tint="#f59e0b"
                style={styles.linkSpacing}
              >
                Privacy Policy (Amber)
              </PrivacyNoticeLink>

              <PrivacyNoticeLink
                onPress={() => {}}
                size={14}
                tint="#ef4444"
                style={styles.linkSpacing}
              >
                Privacy Policy (Red)
              </PrivacyNoticeLink>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Size Variations</Text>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <MaterialIcons name="format-size" size={16} color="#8b5cf6" />
            <Text style={styles.cardTitle}>Different Sizes</Text>
          </View>
          <View style={styles.cardContent}>
            <View style={styles.linkGroup}>
              <PrivacyNoticeLink
                onPress={() => {}}
                size={12}
                tint="#9ca3af"
                style={styles.linkSpacing}
              >
                Small Privacy Link (12px)
              </PrivacyNoticeLink>

              <PrivacyNoticeLink
                onPress={() => {}}
                size={16}
                tint="#60a5fa"
                style={styles.linkSpacing}
              >
                Medium Privacy Link (16px)
              </PrivacyNoticeLink>

              <PrivacyNoticeLink
                onPress={() => {}}
                size={20}
                tint="#10b981"
                style={styles.linkSpacing}
              >
                Large Privacy Link (20px)
              </PrivacyNoticeLink>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        <View style={styles.footerIcon}>
          <Feather name="info" size={16} color="#6b7280" />
        </View>
        <Text style={styles.footerText}>
          All links are fully interactive and follow your app's privacy policy
          flow
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#09090b",
  },
  content: {
    padding: 24,
    paddingBottom: 48,
  },
  header: {
    alignItems: "center",
    marginBottom: 32,
    paddingTop: 20,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#18181b",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#27272a",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#fafafa",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#a1a1aa",
    textAlign: "center",
    lineHeight: 24,
    maxWidth: 320,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#e4e4e7",
    marginBottom: 12,
    marginLeft: 4,
  },
  card: {
    backgroundColor: "#18181b",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#27272a",
    overflow: "hidden",
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#27272a",
    backgroundColor: "#09090b",
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#f4f4f5",
    marginLeft: 8,
  },
  cardContent: {
    padding: 20,
  },
  linkGroup: {
    gap: 16,
  },
  linkDefault: {},
  linkSpacing: {
    marginVertical: 2,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 32,
    padding: 16,
    backgroundColor: "#18181b",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#27272a",
  },
  footerIcon: {
    marginRight: 8,
  },
  footerText: {
    fontSize: 14,
    color: "#a1a1aa",
    textAlign: "center",
    flex: 1,
    lineHeight: 20,
  },
});

export default PrivacyNoticeLinkDemo;
