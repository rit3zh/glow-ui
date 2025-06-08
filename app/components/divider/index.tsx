import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import React from "react";
import {
  MaterialIcons,
  Feather,
  Ionicons,
  FontAwesome5,
} from "@expo/vector-icons";
import { VerticalDivider } from "@/components";

const DividerDemo = () => {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      contentInsetAdjustmentBehavior="always"
      showsVerticalScrollIndicator={false}
      scrollEnabled
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <MaterialIcons name="view-column" size={32} color="#10b981" />
          </View>
          <Text style={styles.headerTitle}>VerticalDivider Component Demo</Text>
          <Text style={styles.subtitle}>
            Beautiful separation components for your app
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>App Statistics</Text>

          <View style={styles.exampleCard}>
            <VerticalDivider color="#27272a" height={34} width={1}>
              <View style={styles.statColumn}>
                <Text style={styles.statLabel}>RATINGS</Text>
                <Text style={styles.statValue}>4.7</Text>
                <View style={styles.starsContainer}>
                  {[...Array(5)].map((_, i) => (
                    <Text key={i} style={styles.star}>
                      ★
                    </Text>
                  ))}
                </View>
                <Text style={styles.statSubtext}>912K</Text>
              </View>

              <View style={styles.statColumn}>
                <Text style={styles.statLabel}>AGE RATING</Text>
                <Text style={styles.statValue}>4+</Text>
                <Text style={styles.statSubtext}>Years Old</Text>
              </View>

              <View style={styles.statColumn}>
                <Text style={styles.statLabel}>CHART</Text>
                <Text style={styles.statValue}>#7</Text>
                <Text style={styles.statSubtext}>Racing</Text>
              </View>

              <View style={styles.statColumn}>
                <Text style={styles.statLabel}>DEVELOPER</Text>
                <View style={styles.developerIcon}>
                  <MaterialIcons name="games" size={20} color="#a1a1aa" />
                </View>
                <Text style={styles.statSubtext}>Nintendo</Text>
              </View>
            </VerticalDivider>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>User Metrics</Text>

          <View style={styles.exampleCard}>
            <View style={styles.cardHeader}>
              <View style={styles.cardIcon}>
                <FontAwesome5 name="user-friends" size={20} color="#10b981" />
              </View>
              <View style={styles.cardHeaderText}>
                <Text style={styles.cardTitle}>Social Statistics</Text>
                <Text style={styles.cardSubtitle}>
                  Your community engagement
                </Text>
              </View>
            </View>

            <VerticalDivider color="#10b981" height={60} width={2}>
              <View style={styles.metricColumn}>
                <Text style={styles.metricValue}>2.4K</Text>
                <Text style={styles.metricLabel}>Followers</Text>
              </View>

              <View style={styles.metricColumn}>
                <Text style={styles.metricValue}>186</Text>
                <Text style={styles.metricLabel}>Following</Text>
              </View>

              <View style={styles.metricColumn}>
                <Text style={styles.metricValue}>42</Text>
                <Text style={styles.metricLabel}>Posts</Text>
              </View>
            </VerticalDivider>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>

          <View style={styles.exampleCard}>
            <VerticalDivider color="#27272a" height={50} width={1}>
              <TouchableOpacity style={styles.navItem}>
                <Ionicons name="home" size={18} color="#10b981" />
                <Text style={[styles.navText, { color: "#10b981" }]}>Home</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.navItem}>
                <Feather name="search" size={18} color="#a1a1aa" />
                <Text style={styles.navText}>Search</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.navItem}>
                <FontAwesome5 name="user" size={16} color="#a1a1aa" />
                <Text style={styles.navText}>Profile</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.navItem}>
                <Feather name="settings" size={18} color="#a1a1aa" />
                <Text style={styles.navText}>Settings</Text>
              </TouchableOpacity>
            </VerticalDivider>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Performance Dashboard</Text>

          <View style={styles.exampleCard}>
            <View style={styles.cardHeader}>
              <View style={styles.cardIcon}>
                <MaterialIcons name="speed" size={20} color="#f59e0b" />
              </View>
              <View style={styles.cardHeaderText}>
                <Text style={styles.cardTitle}>System Performance</Text>
                <Text style={styles.cardSubtitle}>Real-time monitoring</Text>
              </View>
            </View>

            <VerticalDivider color="#f59e0b" height={70} width={3}>
              <View style={styles.performanceColumn}>
                <View
                  style={[
                    styles.performanceIcon,
                    { backgroundColor: "#10b981" },
                  ]}
                >
                  <MaterialIcons name="memory" size={16} color="#fafafa" />
                </View>
                <Text style={styles.performanceValue}>23%</Text>
                <Text style={styles.performanceLabel}>CPU Usage</Text>
              </View>

              <View style={styles.performanceColumn}>
                <View
                  style={[
                    styles.performanceIcon,
                    { backgroundColor: "#8b5cf6" },
                  ]}
                >
                  <MaterialIcons name="storage" size={16} color="#fafafa" />
                </View>
                <Text style={styles.performanceValue}>1.2GB</Text>
                <Text style={styles.performanceLabel}>Memory</Text>
              </View>

              <View style={styles.performanceColumn}>
                <View
                  style={[
                    styles.performanceIcon,
                    { backgroundColor: "#ef4444" },
                  ]}
                >
                  <MaterialIcons name="graphic-eq" size={16} color="#fafafa" />
                </View>
                <Text style={styles.performanceValue}>45%</Text>
                <Text style={styles.performanceLabel}>GPU Load</Text>
              </View>
            </VerticalDivider>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sales Summary</Text>

          <View style={styles.exampleCard}>
            <View style={styles.cardHeader}>
              <View style={styles.cardIcon}>
                <MaterialIcons name="trending-up" size={20} color="#10b981" />
              </View>
              <View style={styles.cardHeaderText}>
                <Text style={styles.cardTitle}>Revenue Overview</Text>
                <Text style={styles.cardSubtitle}>Financial performance</Text>
              </View>
            </View>

            <VerticalDivider color="#27272a" height={60} width={1}>
              <View style={styles.salesColumn}>
                <Text style={styles.salesPeriod}>Today</Text>
                <Text style={[styles.salesAmount, { color: "#10b981" }]}>
                  $1,240
                </Text>
                <Text style={styles.salesChange}>+12%</Text>
              </View>

              <View style={styles.salesColumn}>
                <Text style={styles.salesPeriod}>This Week</Text>
                <Text style={[styles.salesAmount, { color: "#8b5cf6" }]}>
                  $8,760
                </Text>
                <Text style={styles.salesChange}>+8%</Text>
              </View>

              <View style={styles.salesColumn}>
                <Text style={styles.salesPeriod}>This Month</Text>
                <Text style={[styles.salesAmount, { color: "#f59e0b" }]}>
                  $32,100
                </Text>
                <Text style={styles.salesChange}>+24%</Text>
              </View>
            </VerticalDivider>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Feature Showcase</Text>

          <View style={styles.exampleCard}>
            <View style={styles.featureHeader}>
              <View style={styles.featureIconContainer}>
                <Feather name="zap" size={20} color="#f59e0b" />
              </View>
              <Text style={styles.featureTitle}>
                Lightning Fast Performance
              </Text>
            </View>
            <Text style={styles.featureDescription}>
              Experience blazing-fast load times with our optimized architecture
            </Text>

            <VerticalDivider color="#f59e0b" height={50} width={2}>
              <View style={styles.featureMetric}>
                <Text style={[styles.featureValue, { color: "#10b981" }]}>
                  99.9%
                </Text>
                <Text style={styles.featureLabel}>Uptime</Text>
              </View>
              <View style={styles.featureMetric}>
                <Text style={[styles.featureValue, { color: "#8b5cf6" }]}>
                  {"<100ms"}
                </Text>
                <Text style={styles.featureLabel}>Response</Text>
              </View>
            </VerticalDivider>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Divider Variations</Text>

          <View style={styles.variationCard}>
            <Text style={styles.variationTitle}>
              Thick Red Divider (width: 4)
            </Text>
            <VerticalDivider color="#ef4444" height={50} width={4}>
              <View style={styles.variationItem}>
                <Feather name="alert-circle" size={16} color="#ef4444" />
                <Text style={styles.variationText}>Critical</Text>
              </View>
              <View style={styles.variationItem}>
                <Feather name="alert-triangle" size={16} color="#f59e0b" />
                <Text style={styles.variationText}>Warning</Text>
              </View>
              <View style={styles.variationItem}>
                <Feather name="check-circle" size={16} color="#10b981" />
                <Text style={styles.variationText}>Success</Text>
              </View>
            </VerticalDivider>
          </View>

          <View style={styles.variationCard}>
            <Text style={styles.variationTitle}>
              Subtle Gray Divider (width: 1)
            </Text>
            <VerticalDivider color="#71717a" height={45} width={1}>
              <View style={styles.variationItem}>
                <MaterialIcons
                  name="brightness-low"
                  size={16}
                  color="#a1a1aa"
                />
                <Text style={styles.variationText}>Light</Text>
              </View>
              <View style={styles.variationItem}>
                <MaterialIcons
                  name="brightness-medium"
                  size={16}
                  color="#a1a1aa"
                />
                <Text style={styles.variationText}>Medium</Text>
              </View>
              <View style={styles.variationItem}>
                <MaterialIcons
                  name="brightness-high"
                  size={16}
                  color="#a1a1aa"
                />
                <Text style={styles.variationText}>Dark</Text>
              </View>
            </VerticalDivider>
          </View>

          <View style={styles.variationCard}>
            <Text style={styles.variationTitle}>
              Accent Purple Divider (width: 2)
            </Text>
            <VerticalDivider color="#8b5cf6" height={55} width={2}>
              <View style={styles.pricingItem}>
                <MaterialIcons name="star" size={16} color="#f59e0b" />
                <Text style={[styles.pricingTitle, { color: "#f59e0b" }]}>
                  Premium
                </Text>
                <Text style={styles.pricingPrice}>$9.99/mo</Text>
              </View>
              <View style={styles.pricingItem}>
                <MaterialIcons name="verified" size={16} color="#fafafa" />
                <Text style={styles.pricingTitle}>Standard</Text>
                <Text style={styles.pricingPrice}>$4.99/mo</Text>
              </View>
              <View style={styles.pricingItem}>
                <MaterialIcons name="person" size={16} color="#a1a1aa" />
                <Text style={[styles.pricingTitle, { color: "#a1a1aa" }]}>
                  Basic
                </Text>
                <Text style={[styles.pricingPrice, { color: "#71717a" }]}>
                  Free
                </Text>
              </View>
            </VerticalDivider>
          </View>
        </View>

        <View style={styles.footer}>
          <View style={styles.footerIcon}>
            <MaterialIcons name="view-column" size={16} color="#71717a" />
          </View>
          <Text style={styles.footerText}>
            The VerticalDivider component provides consistent separation across
            your entire application
          </Text>
        </View>
      </SafeAreaView>
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
  safeArea: {
    flex: 1,
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
    fontSize: 28,
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
  exampleCard: {
    backgroundColor: "#18181b",
    borderWidth: 1,
    borderColor: "#27272a",
    borderRadius: 12,
    padding: 16,
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
    fontSize: 14,
    color: "#a1a1aa",
  },
  statColumn: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  statLabel: {
    fontSize: 10,
    color: "#a1a1aa",
    fontWeight: "500",
    marginBottom: 4,
    letterSpacing: 0,
  },
  statValue: {
    fontSize: 24,
    color: "#fafafa",
    fontWeight: "700",
    marginBottom: 4,
  },
  starsContainer: {
    flexDirection: "row",
    marginBottom: 4,
  },
  star: {
    color: "#f59e0b",
    fontSize: 12.5,
  },
  statSubtext: {
    fontSize: 12,
    color: "#71717a",
  },
  developerIcon: {
    width: 32,
    height: 32,
    backgroundColor: "#27272a",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  metricColumn: {
    flex: 1,
    alignItems: "center",
  },
  metricValue: {
    fontSize: 20,
    color: "#fafafa",
    fontWeight: "700",
    marginBottom: 4,
  },
  metricLabel: {
    fontSize: 14,
    color: "#a1a1aa",
  },
  navItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    gap: 4,
  },
  navText: {
    fontSize: 14,
    color: "#a1a1aa",
    fontWeight: "500",
  },
  performanceColumn: {
    flex: 1,
    alignItems: "center",
  },
  performanceIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  performanceValue: {
    fontSize: 18,
    color: "#fafafa",
    fontWeight: "700",
    marginBottom: 4,
  },
  performanceLabel: {
    fontSize: 12,
    color: "#a1a1aa",
  },
  salesColumn: {
    flex: 1,
    alignItems: "center",
  },
  salesPeriod: {
    fontSize: 14,
    color: "#fafafa",
    fontWeight: "500",
    marginBottom: 4,
  },
  salesAmount: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 2,
  },
  salesChange: {
    fontSize: 12,
    color: "#71717a",
  },
  featureHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  featureIconContainer: {
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
  featureDescription: {
    fontSize: 14,
    color: "#a1a1aa",
    lineHeight: 22,
    marginBottom: 16,
  },
  featureMetric: {
    flex: 1,
    alignItems: "center",
  },
  featureValue: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 4,
  },
  featureLabel: {
    fontSize: 12,
    color: "#a1a1aa",
  },
  variationCard: {
    backgroundColor: "#18181b",
    borderWidth: 1,
    borderColor: "#27272a",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  variationTitle: {
    fontSize: 14,
    color: "#a1a1aa",
    marginBottom: 12,
  },
  variationItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  variationText: {
    fontSize: 14,
    color: "#fafafa",
    fontWeight: "500",
  },
  pricingItem: {
    flex: 1,
    alignItems: "center",
    gap: 4,
  },
  pricingTitle: {
    fontSize: 16,
    color: "#fafafa",
    fontWeight: "600",
  },
  pricingPrice: {
    fontSize: 12,
    color: "#a1a1aa",
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

export default DividerDemo;
