import React from "react";
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from "react-native";
import { Timeline } from "@/components/molecules/index";
import {
  MaterialIcons,
  Feather,
  Ionicons,
  FontAwesome5,
  AntDesign,
} from "@expo/vector-icons";
import type { TimelineItem } from "@/components/molecules/Timeline/TimelineView.types";

const ShippingDetailsComponent = () => (
  <View style={styles.detailsCard}>
    <Text style={styles.detailsTitle}>📦 Shipping Information</Text>
    <View style={styles.detailsRow}>
      <Text style={styles.detailsLabel}>Carrier</Text>
      <Text style={styles.detailsValue}>FedEx Express</Text>
    </View>
    <View style={styles.detailsRow}>
      <Text style={styles.detailsLabel}>Tracking ID</Text>
      <Text style={styles.detailsValue}>1Z999AA1234567890</Text>
    </View>
    <View style={styles.detailsRow}>
      <Text style={styles.detailsLabel}>Est. Delivery</Text>
      <Text style={styles.detailsValue}>May 10, 6:00 PM</Text>
    </View>
  </View>
);

const ProjectMilestoneComponent = () => (
  <View style={styles.detailsCard}>
    <Text style={styles.detailsTitle}>🎯 Milestone Details</Text>
    <View style={styles.detailsRow}>
      <Text style={styles.detailsLabel}>Deliverables</Text>
      <Text style={styles.detailsValue}>Design System v2.0</Text>
    </View>
    <View style={styles.detailsRow}>
      <Text style={styles.detailsLabel}>Team Size</Text>
      <Text style={styles.detailsValue}>5 Designers</Text>
    </View>
    <View style={styles.detailsRow}>
      <Text style={styles.detailsLabel}>Budget</Text>
      <Text style={styles.detailsValue}>$24,500</Text>
    </View>
  </View>
);

const DevelopmentStatusComponent = () => (
  <View style={styles.detailsCard}>
    <Text style={styles.detailsTitle}>⚡ Development Progress</Text>
    <View style={styles.progressRow}>
      <Text style={styles.progressLabel}>Frontend</Text>
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: "85%" }]} />
      </View>
      <Text style={styles.progressValue}>85%</Text>
    </View>
    <View style={styles.progressRow}>
      <Text style={styles.progressLabel}>Backend</Text>
      <View style={styles.progressBar}>
        <View
          style={[
            styles.progressFill,
            { width: "92%", backgroundColor: "#10b981" },
          ]}
        />
      </View>
      <Text style={styles.progressValue}>92%</Text>
    </View>
  </View>
);

const TimelineDemo = () => {
  const orderTimelineItems: TimelineItem[] = [
    {
      id: 1,
      title: "Order Placed",
      description: "We've received your order and will begin processing it.",
      timestamp: "May 7, 10:23 AM",
      icon: "shopping-bag",
      status: "complete",
      meta: "Order #38492",
    },
    {
      id: 2,
      title: "Payment Confirmed",
      description: "Your payment has been successfully processed.",
      timestamp: "May 7, 10:25 AM",
      icon: "credit-card",
      status: "complete",
      meta: "Processing: 2 mins",
    },
    {
      id: 3,
      title: "Order Confirmed",
      description: "Your order is confirmed and ready to ship.",
      timestamp: "May 7, 11:05 AM",
      icon: "check-circle",
      status: "complete",
      meta: "Ready for shipment",
    },
    {
      id: 4,
      title: "Shipped",
      description: "The package has left our facility and is on its way.",
      timestamp: "May 8, 9:15 AM",
      icon: "package",
      status: "complete",
      children: <ShippingDetailsComponent />,
      childrenContainer: { marginTop: 0 },
      meta: "In Transit",
    },
    {
      id: 5,
      title: "Out for Delivery",
      description: "Your package is out for delivery and will arrive today.",
      timestamp: "May 10, 8:30 AM",
      icon: "truck",
      status: "current",
      meta: "Last mile delivery",
    },
    {
      id: 6,
      title: "Delivered",
      timestamp: "Est. May 10, by 6:00 PM",
      icon: "home",
      status: "upcoming",
      meta: "Pending delivery",
      description: "Your order will be delivered to your doorstep.",
    },
  ];

  const projectTimelineItems: TimelineItem[] = [
    {
      id: 1,
      title: "Project Kickoff",
      description: "Initial meeting with stakeholders and team formation.",
      timestamp: "Jan 15, 2024",
      icon: "play-circle",
      status: "complete",
      meta: "Team assembled",
    },
    {
      id: 2,
      title: "Research & Discovery",
      description: "User research, market analysis, and requirement gathering.",
      timestamp: "Jan 22, 2024",
      icon: "search",
      status: "complete",
      meta: "3 weeks duration",
    },
    {
      id: 3,
      title: "Design Phase",
      description: "UI/UX design, prototyping, and design system creation.",
      timestamp: "Feb 12, 2024",
      icon: "edit-3",
      status: "complete",
      children: <ProjectMilestoneComponent />,
      childrenContainer: { marginTop: 0 },
      meta: "Design system v2.0",
    },
    {
      id: 4,
      title: "Development Sprint",
      description: "Frontend and backend development in parallel tracks.",
      timestamp: "Mar 5, 2024",
      icon: "code",
      status: "current",
      children: <DevelopmentStatusComponent />,
      childrenContainer: { marginTop: 0 },
      meta: "In Progress",
    },
    {
      id: 5,
      title: "Testing & QA",
      description: "Comprehensive testing, bug fixes, and quality assurance.",
      timestamp: "Apr 1, 2024",
      icon: "check-square",
      status: "complete",
      meta: "Upcoming",
    },
    {
      id: 6,
      title: "Launch",
      description: "Production deployment and go-live celebration.",
      timestamp: "Apr 15, 2024",
      icon: "zap",
      status: "upcoming",
      meta: "Launch day",
    },
  ];

  const userJourneyItems: TimelineItem[] = [
    {
      id: 1,
      title: "Account Created",
      description: "User registered with email verification.",
      timestamp: "2 hours ago",
      icon: "user-plus",
      status: "complete",
      meta: "sarah.johnson@email.com",
    },
    {
      id: 2,
      title: "Profile Setup",
      description: "Added personal information and preferences.",
      timestamp: "1.5 hours ago",
      icon: "settings",
      status: "complete",
      meta: "Profile 100% complete",
    },
    {
      id: 3,
      title: "First Purchase",
      description: "Completed their first transaction successfully.",
      timestamp: "45 minutes ago",
      icon: "shopping-cart",
      status: "complete",
      meta: "$127.50",
    },
    {
      id: 4,
      title: "App Downloaded",
      description: "Downloaded and logged into mobile application.",
      timestamp: "12 minutes ago",
      icon: "smartphone",
      status: "current",
      meta: "iOS App",
    },
  ];

  const handleItemPress = (item: TimelineItem) => {
    console.log("Timeline item pressed:", item.title);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        contentInsetAdjustmentBehavior="always"
        scrollEnabled
      >
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <MaterialIcons name="timeline" size={32} color="#60a5fa" />
          </View>
          <Text style={styles.headerTitle}>Timeline Component Demo</Text>
          <Text style={styles.subtitle}>
            Beautiful timelines with various styles and interactive features
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Timeline Variations</Text>

          <View style={styles.variationCard}>
            <View style={styles.variationHeader}>
              <View style={styles.variationIcon}>
                <MaterialIcons
                  name="local-shipping"
                  size={20}
                  color="#60a5fa"
                />
              </View>
              <Text style={styles.variationTitle}>Order Tracking</Text>
              <Text style={styles.variationBadge}>Interactive</Text>
            </View>
            <Text style={styles.variationDescription}>
              Track package delivery with real-time updates and shipping details
            </Text>
          </View>

          <View style={styles.variationCard}>
            <View style={styles.variationHeader}>
              <View style={styles.variationIcon}>
                <Feather name="briefcase" size={20} color="#10b981" />
              </View>
              <Text style={styles.variationTitle}>Project Timeline</Text>
              <Text
                style={[styles.variationBadge, { backgroundColor: "#10b981" }]}
              >
                Active
              </Text>
            </View>
            <Text style={styles.variationDescription}>
              Project milestones with progress tracking and team collaboration
            </Text>
          </View>

          <View style={styles.variationCard}>
            <View style={styles.variationHeader}>
              <View style={styles.variationIcon}>
                <FontAwesome5 name="user-friends" size={18} color="#f59e0b" />
              </View>
              <Text style={styles.variationTitle}>User Journey</Text>
              <Text
                style={[styles.variationBadge, { backgroundColor: "#f59e0b" }]}
              >
                Live
              </Text>
            </View>
            <Text style={styles.variationDescription}>
              Real-time user activity and engagement tracking
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>🧾 Order Timeline</Text>
            <Text style={styles.sectionSubtitle}>
              Follow your delivery journey
            </Text>
          </View>

          <View style={styles.timelineWrapper}>
            <Timeline
              metaContainerStyle={styles.metaContainer}
              animationType="rotate"
              items={orderTimelineItems}
              onItemPress={handleItemPress}
              activeColor="#60a5fa"
              animated
              titleStyle={styles.timelineTitle}
              descriptionStyle={styles.timelineDescription}
              timestampStyle={styles.timelineTimestamp}
              metaTextStyle={styles.timelineMeta}
            />
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>🚀 Project Timeline</Text>
            <Text style={styles.sectionSubtitle}>
              Development milestones and progress
            </Text>
          </View>

          <View style={styles.timelineWrapper}>
            <Timeline
              metaContainerStyle={[
                styles.metaContainer,
                { backgroundColor: "#0f172a" },
              ]}
              animationType="fade"
              items={projectTimelineItems}
              onItemPress={handleItemPress}
              activeColor="#10b981"
              animated
              titleStyle={styles.timelineTitle}
              descriptionStyle={styles.timelineDescription}
              timestampStyle={styles.timelineTimestamp}
              metaTextStyle={styles.timelineMeta}
            />
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>👤 User Journey</Text>
            <Text style={styles.sectionSubtitle}>
              Real-time user activity tracking
            </Text>
          </View>

          <View style={styles.timelineWrapper}>
            <Timeline
              metaContainerStyle={[
                styles.metaContainer,
                { backgroundColor: "#451a03" },
              ]}
              animationType="scale"
              items={userJourneyItems}
              onItemPress={handleItemPress}
              activeColor="#f59e0b"
              animated
              titleStyle={styles.timelineTitle}
              descriptionStyle={styles.timelineDescription}
              timestampStyle={styles.timelineTimestamp}
              metaTextStyle={styles.timelineMeta}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Key Features</Text>

          <View style={styles.featuresGrid}>
            <View style={styles.featureCard}>
              <View style={styles.featureIcon}>
                <Feather name="zap" size={20} color="#f59e0b" />
              </View>
              <Text style={styles.featureTitle}>Animated</Text>
              <Text style={styles.featureDescription}>
                Smooth animations with customizable effects
              </Text>
            </View>

            <View style={styles.featureCard}>
              <View style={styles.featureIcon}>
                <MaterialIcons name="touch-app" size={20} color="#60a5fa" />
              </View>
              <Text style={styles.featureTitle}>Interactive</Text>
              <Text style={styles.featureDescription}>
                Tap items for detailed views and actions
              </Text>
            </View>

            <View style={styles.featureCard}>
              <View style={styles.featureIcon}>
                <Feather name="layers" size={20} color="#10b981" />
              </View>
              <Text style={styles.featureTitle}>Customizable</Text>
              <Text style={styles.featureDescription}>
                Flexible styling and custom content support
              </Text>
            </View>

            <View style={styles.featureCard}>
              <View style={styles.featureIcon}>
                <AntDesign name="mobile1" size={20} color="#8b5cf6" />
              </View>
              <Text style={styles.featureTitle}>Responsive</Text>
              <Text style={styles.featureDescription}>
                Adapts beautifully to different screen sizes
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Status Types</Text>

          <View style={styles.statusGrid}>
            <View style={styles.statusCard}>
              <View
                style={[styles.statusDot, { backgroundColor: "#10b981" }]}
              />
              <View style={styles.statusInfo}>
                <Text style={styles.statusTitle}>Complete</Text>
                <Text style={styles.statusDescription}>Finished tasks</Text>
              </View>
            </View>

            <View style={styles.statusCard}>
              <View
                style={[styles.statusDot, { backgroundColor: "#60a5fa" }]}
              />
              <View style={styles.statusInfo}>
                <Text style={styles.statusTitle}>Current</Text>
                <Text style={styles.statusDescription}>
                  Currently in progress
                </Text>
              </View>
            </View>
          </View>
          <View
            style={[
              styles.statusCard,
              {
                marginTop: 15,
              },
            ]}
          >
            <View style={[styles.statusDot, { backgroundColor: "#71717a" }]} />
            <View style={styles.statusInfo}>
              <Text style={styles.statusTitle}>Upcoming</Text>
              <Text style={styles.statusDescription}>Waiting to start</Text>
            </View>
          </View>
        </View>

        <View style={styles.footer}>
          <View style={styles.footerIcon}>
            <MaterialIcons name="timeline" size={16} color="#71717a" />
          </View>
          <Text style={styles.footerText}>
            The Timeline component provides a beautiful way to display
            chronological information with rich interactions and customization
            options
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
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
    fontSize: 28,
    fontWeight: "700",
    color: "#fafafa",
    textAlign: "center",
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
  sectionHeader: {
    marginBottom: 16,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: "#71717a",
    marginTop: 4,
    marginLeft: 4,
  },
  variationCard: {
    backgroundColor: "#18181b",
    borderWidth: 1,
    borderColor: "#27272a",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  variationHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  variationIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#09090b",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  variationTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fafafa",
    flex: 1,
  },
  variationBadge: {
    backgroundColor: "#60a5fa",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    fontSize: 10,
    color: "#fafafa",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  variationDescription: {
    fontSize: 14,
    color: "#a1a1aa",
    lineHeight: 20,
    marginLeft: 44,
  },
  timelineWrapper: {
    backgroundColor: "#18181b",
    borderWidth: 1,
    borderColor: "#27272a",
    borderRadius: 12,
    padding: 16,
  },
  metaContainer: {
    backgroundColor: "#1a1a1a",
    borderRadius: 8,
    padding: 8,
  },
  timelineTitle: {
    color: "#f1f5f9",
    fontWeight: "600",
  },
  timelineDescription: {
    color: "#94a3b8",
  },
  timelineTimestamp: {
    color: "#71717a",
  },
  timelineMeta: {
    color: "#cbd5e1",
  },
  detailsCard: {
    backgroundColor: "#141414",
    borderRadius: 12,
    padding: 12,
    marginTop: 8,
  },
  detailsTitle: {
    fontSize: 14,
    color: "#f8fafc",
    fontWeight: "500",
    marginBottom: 8,
  },
  detailsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  detailsLabel: {
    fontSize: 13,
    color: "#cbd5e1",
  },
  detailsValue: {
    fontSize: 13,
    color: "#e2e8f0",
    fontWeight: "500",
  },
  progressRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 12,
    color: "#cbd5e1",
    width: 60,
  },
  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: "#27272a",
    borderRadius: 3,
    marginHorizontal: 12,
  },
  progressFill: {
    height: 6,
    backgroundColor: "#60a5fa",
    borderRadius: 3,
  },
  progressValue: {
    fontSize: 12,
    color: "#e2e8f0",
    fontWeight: "500",
    width: 35,
    textAlign: "right",
  },
  featuresGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  featureCard: {
    flex: 1,
    minWidth: "47%",
    backgroundColor: "#18181b",
    borderWidth: 1,
    borderColor: "#27272a",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
  },
  featureIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#09090b",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fafafa",
    marginBottom: 8,
    textAlign: "center",
  },
  featureDescription: {
    fontSize: 14,
    color: "#a1a1aa",
    textAlign: "center",
    lineHeight: 20,
  },
  statusGrid: {
    gap: 12,
  },
  statusCard: {
    backgroundColor: "#18181b",
    borderWidth: 1,
    borderColor: "#27272a",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 16,
  },
  statusInfo: {
    flex: 1,
  },
  statusTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fafafa",
    marginBottom: 4,
  },
  statusDescription: {
    fontSize: 14,
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

export default TimelineDemo;
