import { View, Text, StyleSheet, ScrollView } from "react-native";
import React from "react";
import {
  MaterialIcons,
  Feather,
  Ionicons,
  FontAwesome5,
} from "@expo/vector-icons";
import { Subtitle } from "@/components/index";

const SubtitleDemo = () => {
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
          <MaterialIcons name="subtitles" size={32} color="#60a5fa" />
        </View>
        <Subtitle size={1} style={styles.headerTitle}>
          Subtitle Component Demo
        </Subtitle>
        <Text style={styles.subtitle}>
          Secondary typography with perfect hierarchy and spacing
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Typography Scale</Text>

        <View style={styles.typeCard}>
          <View style={styles.typeRow}>
            <Subtitle size={20} style={styles.displaySubtitle}>
              Large Subtitle
            </Subtitle>
            <Text style={styles.sizeLabel}>22px</Text>
          </View>
          <Text style={styles.typeDescription}>
            Perfect for section headers and important secondary content
          </Text>
        </View>

        <View style={styles.typeCard}>
          <View style={styles.typeRow}>
            <Subtitle size={18} style={styles.displaySubtitle}>
              Medium Subtitle
            </Subtitle>
            <Text style={styles.sizeLabel}>20px</Text>
          </View>
          <Text style={styles.typeDescription}>
            Great for subsection headers and card descriptions
          </Text>
        </View>

        <View style={styles.typeCard}>
          <View style={styles.typeRow}>
            <Subtitle size={14} style={styles.displaySubtitle}>
              Regular Subtitle
            </Subtitle>
            <Text style={styles.sizeLabel}>18px</Text>
          </View>
          <Text style={styles.typeDescription}>
            Ideal for content descriptions and supporting text
          </Text>
        </View>

        <View style={styles.typeCard}>
          <View style={styles.typeRow}>
            <Subtitle size={12} style={styles.displaySubtitle}>
              Small Subtitle
            </Subtitle>
            <Text style={styles.sizeLabel}>16px</Text>
          </View>
          <Text style={styles.typeDescription}>
            Perfect for labels and compact secondary information
          </Text>
        </View>

        <View style={styles.typeCard}>
          <View style={styles.typeRow}>
            <Subtitle size={8} style={styles.displaySubtitle}>
              Compact Subtitle
            </Subtitle>
            <Text style={styles.sizeLabel}>14px</Text>
          </View>
          <Text style={styles.typeDescription}>
            Good for metadata and fine print secondary text
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Color Variations</Text>

        <View style={styles.colorGrid}>
          <View style={styles.colorCard}>
            <View style={styles.colorHeader}>
              <View style={[styles.colorDot, { backgroundColor: "#d4d4d8" }]} />
              <Text style={styles.colorName}>Primary</Text>
            </View>
            <Subtitle size={2} style={{ color: "#d4d4d8" }}>
              Main Subtitle
            </Subtitle>
          </View>

          <View style={styles.colorCard}>
            <View style={styles.colorHeader}>
              <View style={[styles.colorDot, { backgroundColor: "#60a5fa" }]} />
              <Text style={styles.colorName}>Blue</Text>
            </View>
            <Subtitle size={2} style={{ color: "#60a5fa" }}>
              Accent Subtitle
            </Subtitle>
          </View>

          <View style={styles.colorCard}>
            <View style={styles.colorHeader}>
              <View style={[styles.colorDot, { backgroundColor: "#10b981" }]} />
              <Text style={styles.colorName}>Green</Text>
            </View>
            <Subtitle size={2} style={{ color: "#10b981" }}>
              Success Subtitle
            </Subtitle>
          </View>

          <View style={styles.colorCard}>
            <View style={styles.colorHeader}>
              <View style={[styles.colorDot, { backgroundColor: "#f59e0b" }]} />
              <Text style={styles.colorName}>Amber</Text>
            </View>
            <Subtitle size={2} style={{ color: "#f59e0b" }}>
              Warning Subtitle
            </Subtitle>
          </View>

          <View style={styles.colorCard}>
            <View style={styles.colorHeader}>
              <View style={[styles.colorDot, { backgroundColor: "#ef4444" }]} />
              <Text style={styles.colorName}>Red</Text>
            </View>
            <Subtitle size={2} style={{ color: "#ef4444" }}>
              Error Subtitle
            </Subtitle>
          </View>

          <View style={styles.colorCard}>
            <View style={styles.colorHeader}>
              <View style={[styles.colorDot, { backgroundColor: "#8b5cf6" }]} />
              <Text style={styles.colorName}>Purple</Text>
            </View>
            <Subtitle size={2} style={{ color: "#8b5cf6" }}>
              Brand Subtitle
            </Subtitle>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Real-world Examples</Text>

        <View style={styles.exampleCard}>
          <View style={styles.cardHeader}>
            <View style={styles.cardIcon}>
              <MaterialIcons name="analytics" size={24} color="#60a5fa" />
            </View>
            <View style={styles.cardHeaderText}>
              <Text style={styles.cardTitle}>Analytics Dashboard</Text>
              <Subtitle size={3} style={styles.cardSubtitle}>
                Track your performance metrics and insights
              </Subtitle>
            </View>
          </View>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>2,847</Text>
              <Subtitle size={4} style={{ color: "#71717a" }}>
                Active Users
              </Subtitle>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>94.2%</Text>
              <Subtitle size={4} style={{ color: "#71717a" }}>
                Satisfaction Rate
              </Subtitle>
            </View>
          </View>
        </View>

        <View style={styles.exampleCard}>
          <View style={styles.profileHeader}>
            <View style={styles.avatar}>
              <FontAwesome5 name="user-circle" size={48} color="#60a5fa" />
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>Alex Chen</Text>
              <Subtitle size={3} style={styles.profileRole}>
                Senior UX Designer
              </Subtitle>
              <Subtitle size={4} style={styles.profileCompany}>
                Building beautiful digital experiences
              </Subtitle>
            </View>
          </View>
        </View>

        <View style={styles.exampleCard}>
          <View style={styles.articleMeta}>
            <View style={styles.categoryTag}>
              <Text style={styles.categoryText}>DESIGN</Text>
            </View>
            <Text style={styles.readTime}>7 min read</Text>
          </View>
          <Text style={styles.articleTitle}>
            Modern Design System Architecture
          </Text>
          <Subtitle size={3} style={styles.articleSubtitle}>
            Building scalable design systems that grow with your product and
            team
          </Subtitle>
          <Text style={styles.articleExcerpt}>
            Learn how to structure design tokens, component libraries, and
            documentation to create a cohesive design language...
          </Text>
          <View style={styles.articleFooter}>
            <Text style={styles.articleDate}>March 18, 2024</Text>
            <View style={styles.articleActions}>
              <Feather name="heart" size={16} color="#71717a" />
              <Text style={styles.actionCount}>42</Text>
              <Feather name="message-circle" size={16} color="#71717a" />
              <Text style={styles.actionCount}>12</Text>
            </View>
          </View>
        </View>

        <View style={styles.exampleCard}>
          <View style={styles.featureHeader}>
            <View style={styles.featureIcon}>
              <Feather name="shield" size={20} color="#10b981" />
            </View>
            <Text style={styles.featureTitle}>Enterprise Security</Text>
          </View>
          <Subtitle size={3} style={styles.featureSubtitle}>
            Bank-grade security with end-to-end encryption
          </Subtitle>
          <Text style={styles.featureDescription}>
            Your data is protected with military-grade encryption, multi-factor
            authentication, and SOC 2 compliance.
          </Text>
          <View style={styles.featureMetrics}>
            <View style={styles.metric}>
              <Text style={styles.metricNumber}>256-bit</Text>
              <Subtitle size={5} style={styles.metricLabel}>
                Encryption
              </Subtitle>
            </View>
            <View style={styles.metric}>
              <Text style={styles.metricNumber}>99.99%</Text>
              <Subtitle size={5} style={styles.metricLabel}>
                Uptime SLA
              </Subtitle>
            </View>
          </View>
        </View>

        <View style={styles.exampleCard}>
          <View style={styles.notificationHeader}>
            <View style={styles.notificationIcon}>
              <Ionicons name="notifications" size={20} color="#f59e0b" />
            </View>
            <View style={styles.notificationContent}>
              <Text style={styles.notificationTitle}>New Message</Text>
              <Subtitle size={4} style={styles.notificationSubtitle}>
                You have 3 unread messages from your team
              </Subtitle>
              <Text style={styles.notificationTime}>2 minutes ago</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Usage Examples</Text>

        <View style={styles.usageCard}>
          <View style={styles.usageHeader}>
            <Feather name="layers" size={20} color="#8b5cf6" />
            <Text style={styles.usageTitle}>Content Hierarchy</Text>
          </View>
          <View style={styles.hierarchyExample}>
            <Text style={styles.mainTitle}>Main Article Title</Text>
            <Subtitle size={2} style={styles.hierarchySubtitle}>
              This is the article subtitle that provides context
            </Subtitle>
            <Text style={styles.bodyText}>
              Here's the main body content that follows the subtitle. Notice how
              the subtitle creates a clear hierarchy between the main title and
              the body text.
            </Text>
          </View>
        </View>

        <View style={styles.usageCard}>
          <View style={styles.usageHeader}>
            <Feather name="grid" size={20} color="#ef4444" />
            <Text style={styles.usageTitle}>Card Components</Text>
          </View>
          <View style={styles.cardExample}>
            <Text style={styles.cardExampleTitle}>Product Card</Text>
            <Subtitle size={3} style={styles.cardExampleSubtitle}>
              High-quality wireless headphones
            </Subtitle>
            <Text style={styles.cardExamplePrice}>$299.99</Text>
          </View>
        </View>

        <View style={styles.usageCard}>
          <View style={styles.usageHeader}>
            <Feather name="list" size={20} color="#10b981" />
            <Text style={styles.usageTitle}>List Items</Text>
          </View>
          <View style={styles.listExample}>
            <View style={styles.listItem}>
              <Text style={styles.listItemTitle}>Settings</Text>
              <Subtitle size={4} style={styles.listItemSubtitle}>
                Manage your account preferences
              </Subtitle>
            </View>
            <View style={styles.listItem}>
              <Text style={styles.listItemTitle}>Privacy</Text>
              <Subtitle size={4} style={styles.listItemSubtitle}>
                Control your data and privacy settings
              </Subtitle>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Custom Styling</Text>

        <View style={styles.customCard}>
          <Text style={styles.customMainTitle}>FEATURED CONTENT</Text>
          <Subtitle
            size={1}
            style={[
              styles.customSubtitle,
              {
                textAlign: "center",
                marginBottom: 8,
                fontWeight: "500",
                letterSpacing: 0.5,
                color: "#60a5fa",
              },
            ]}
          >
            Discover Premium Features
          </Subtitle>
          <Text style={styles.customDescription}>
            Enhanced styling with custom properties and spacing
          </Text>
        </View>

        <View style={styles.customCard}>
          <Subtitle
            size={2}
            style={{
              color: "#d4d4d8",
              textAlign: "center",
              fontWeight: "400",
              fontStyle: "italic",
              opacity: 0.9,
              lineHeight: 28,
            }}
          >
            "Good design is as little design as possible."
          </Subtitle>
          <Text style={styles.quoteAuthor}>— Dieter Rams</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <View style={styles.footerIcon}>
          <Feather name="type" size={16} color="#71717a" />
        </View>
        <Text style={styles.footerText}>
          The Subtitle component provides perfect secondary typography hierarchy
          throughout your application
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
  headerTitle: {
    color: "#fafafa",
    textAlign: "center",
    fontWeight: "700",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#a1a1aa",
    textAlign: "center",
    lineHeight: 24,
    maxWidth: 320,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#e4e4e7",
    marginBottom: 16,
    marginLeft: 4,
  },
  typeCard: {
    backgroundColor: "#18181b",
    borderWidth: 1,
    borderColor: "#27272a",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  typeRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  displaySubtitle: {
    color: "#d4d4d8",
    fontWeight: "500",
  },
  sizeLabel: {
    fontSize: 14,
    color: "#a1a1aa",
    backgroundColor: "#09090b",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#27272a",
  },
  typeDescription: {
    fontSize: 14,
    color: "#71717a",
    lineHeight: 20,
  },
  colorGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  colorCard: {
    flex: 1,
    minWidth: "47%",
    backgroundColor: "#18181b",
    borderWidth: 1,
    borderColor: "#27272a",
    borderRadius: 12,
    padding: 16,
  },
  colorHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 8,
  },
  colorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  colorName: {
    fontSize: 12,
    color: "#a1a1aa",
    fontWeight: "500",
  },
  exampleCard: {
    backgroundColor: "#18181b",
    borderWidth: 1,
    borderColor: "#27272a",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  cardIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#09090b",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  cardHeaderText: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    color: "#fafafa",
    fontWeight: "600",
    marginBottom: 4,
  },
  cardSubtitle: {
    color: "#a1a1aa",
    fontWeight: "400",
  },
  statsRow: {
    flexDirection: "row",
    gap: 24,
  },
  statItem: {
    flex: 1,
  },
  statNumber: {
    fontSize: 24,
    color: "#10b981",
    fontWeight: "700",
    marginBottom: 4,
  },
  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    color: "#fafafa",
    fontWeight: "600",
    marginBottom: 4,
  },
  profileRole: {
    color: "#a1a1aa",
    fontWeight: "500",
    marginBottom: 2,
  },
  profileCompany: {
    color: "#71717a",
    fontWeight: "400",
  },
  articleMeta: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  categoryTag: {
    backgroundColor: "#60a5fa",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  categoryText: {
    fontSize: 10,
    color: "#fafafa",
    fontWeight: "700",
    letterSpacing: 1,
  },
  readTime: {
    fontSize: 12,
    color: "#71717a",
  },
  articleTitle: {
    fontSize: 20,
    color: "#fafafa",
    fontWeight: "600",
    marginBottom: 8,
    lineHeight: 28,
  },
  articleSubtitle: {
    color: "#a1a1aa",
    fontWeight: "500",
    marginBottom: 12,
    lineHeight: 24,
  },
  articleExcerpt: {
    fontSize: 14,
    color: "#71717a",
    lineHeight: 22,
    marginBottom: 16,
  },
  articleFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  articleDate: {
    fontSize: 12,
    color: "#71717a",
  },
  articleActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  actionCount: {
    fontSize: 12,
    color: "#71717a",
  },
  featureHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  featureIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#09090b",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  featureTitle: {
    fontSize: 18,
    color: "#fafafa",
    fontWeight: "600",
  },
  featureSubtitle: {
    color: "#10b981",
    fontWeight: "500",
    marginBottom: 8,
  },
  featureDescription: {
    fontSize: 14,
    color: "#a1a1aa",
    lineHeight: 22,
    marginBottom: 16,
  },
  featureMetrics: {
    flexDirection: "row",
    gap: 24,
  },
  metric: {
    alignItems: "center",
  },
  metricNumber: {
    fontSize: 16,
    color: "#60a5fa",
    fontWeight: "700",
  },
  metricLabel: {
    color: "#71717a",
    marginTop: 4,
    textAlign: "center",
  },
  notificationHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  notificationIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#09090b",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
    marginTop: 2,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    color: "#fafafa",
    fontWeight: "600",
    marginBottom: 4,
  },
  notificationSubtitle: {
    color: "#a1a1aa",
    fontWeight: "400",
    marginBottom: 8,
  },
  notificationTime: {
    fontSize: 12,
    color: "#71717a",
  },
  usageCard: {
    backgroundColor: "#18181b",
    borderWidth: 1,
    borderColor: "#27272a",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  usageHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    gap: 12,
  },
  usageTitle: {
    fontSize: 16,
    color: "#fafafa",
    fontWeight: "600",
  },
  hierarchyExample: {
    padding: 16,
    backgroundColor: "#09090b",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#27272a",
  },
  mainTitle: {
    fontSize: 24,
    color: "#fafafa",
    fontWeight: "700",
    marginBottom: 8,
  },
  hierarchySubtitle: {
    color: "#a1a1aa",
    fontWeight: "500",
    marginBottom: 12,
  },
  bodyText: {
    fontSize: 14,
    color: "#71717a",
    lineHeight: 22,
  },
  cardExample: {
    padding: 16,
    backgroundColor: "#09090b",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#27272a",
  },
  cardExampleTitle: {
    fontSize: 18,
    color: "#fafafa",
    fontWeight: "600",
    marginBottom: 4,
  },
  cardExampleSubtitle: {
    color: "#a1a1aa",
    fontWeight: "400",
    marginBottom: 8,
  },
  cardExamplePrice: {
    fontSize: 20,
    color: "#10b981",
    fontWeight: "700",
  },
  listExample: {
    gap: 12,
  },
  listItem: {
    padding: 12,
    backgroundColor: "#09090b",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#27272a",
  },
  listItemTitle: {
    fontSize: 16,
    color: "#fafafa",
    fontWeight: "600",
    marginBottom: 4,
  },
  listItemSubtitle: {
    color: "#71717a",
    fontWeight: "400",
  },
  customCard: {
    backgroundColor: "#18181b",
    borderWidth: 1,
    borderColor: "#27272a",
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    alignItems: "center",
  },
  customMainTitle: {
    fontSize: 12,
    color: "#a1a1aa",
    fontWeight: "700",
    letterSpacing: 2,
    marginBottom: 8,
  },
  customSubtitle: {
    color: "#60a5fa",
  },
  customDescription: {
    fontSize: 14,
    color: "#a1a1aa",
    textAlign: "center",
  },
  quoteAuthor: {
    fontSize: 14,
    color: "#71717a",
    textAlign: "center",
    marginTop: 8,
    fontStyle: "italic",
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 16,
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

export default SubtitleDemo;
