import React, { forwardRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ViewStyle,
  TextStyle,
  StyleSheet,
  Pressable,
  ScrollView,
} from "react-native";
import { MaterialIcons, Feather, FontAwesome5 } from "@expo/vector-icons";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardTitle,
  CardDescription,
  theme,
} from "@/components";
const CardDemo: React.FC = () => {
  return (
    <ScrollView
      style={demoStyles.container}
      contentContainerStyle={demoStyles.content}
      scrollEnabled
      contentInsetAdjustmentBehavior="always"
      showsVerticalScrollIndicator={false}
    >
      <View style={demoStyles.header}>
        <View style={demoStyles.iconContainer}>
          <MaterialIcons name="dashboard" size={32} color="#60a5fa" />
        </View>
        <Text style={demoStyles.headerTitle}>Card Component</Text>
        <Text style={demoStyles.subtitle}>
          Beautiful cards with animations and various styles
        </Text>
      </View>

      <View style={demoStyles.section}>
        <Text style={demoStyles.sectionTitle}>Card Variants</Text>

        <Card variant="default" size="md" style={demoStyles.demoCard}>
          <CardHeader spacing="md">
            <View style={demoStyles.variantHeader}>
              <View style={demoStyles.variantIcon}>
                <Feather name="square" size={20} color="#60a5fa" />
              </View>
              <View>
                <CardTitle size="lg" weight="semibold">
                  Default Card
                </CardTitle>
                <Text style={demoStyles.variantLabel}>Standard styling</Text>
              </View>
            </View>
          </CardHeader>
          <CardContent>
            <Text style={demoStyles.cardDescription}>
              The default card variant with subtle shadow and clean background.
            </Text>
          </CardContent>
        </Card>

        <Card variant="elevated" size="md" style={demoStyles.demoCard}>
          <CardHeader spacing="md">
            <View style={demoStyles.variantHeader}>
              <View style={demoStyles.variantIcon}>
                <MaterialIcons name="layers" size={20} color="#10b981" />
              </View>
              <View>
                <CardTitle size="lg" weight="semibold">
                  Elevated Card
                </CardTitle>
                <Text style={demoStyles.variantLabel}>Enhanced depth</Text>
              </View>
            </View>
          </CardHeader>
          <CardContent>
            <Text style={demoStyles.cardDescription}>
              Elevated cards create more visual hierarchy with enhanced shadows.
            </Text>
          </CardContent>
        </Card>

        <Card variant="outlined" size="md" style={demoStyles.demoCard}>
          <CardHeader spacing="md">
            <View style={demoStyles.variantHeader}>
              <View style={demoStyles.variantIcon}>
                <Feather name="circle" size={20} color="#f59e0b" />
              </View>
              <View>
                <CardTitle size="lg" weight="semibold">
                  Outlined Card
                </CardTitle>
                <Text style={demoStyles.variantLabel}>Border focus</Text>
              </View>
            </View>
          </CardHeader>
          <CardContent>
            <Text style={demoStyles.cardDescription}>
              Clean bordered design perfect for minimal interfaces.
            </Text>
          </CardContent>
        </Card>

        <Card variant="ghost" size="md" style={demoStyles.demoCard}>
          <CardHeader spacing="md">
            <View style={demoStyles.variantHeader}>
              <View style={demoStyles.variantIcon}>
                <Feather name="eye-off" size={20} color="#8b5cf6" />
              </View>
              <View>
                <CardTitle size="lg" weight="semibold">
                  Ghost Card
                </CardTitle>
                <Text style={demoStyles.variantLabel}>Transparent</Text>
              </View>
            </View>
          </CardHeader>
          <CardContent>
            <Text style={demoStyles.cardDescription}>
              Subtle transparent background for overlaid content.
            </Text>
          </CardContent>
        </Card>
      </View>

      <View style={demoStyles.section}>
        <Text style={demoStyles.sectionTitle}>Animation Types</Text>

        <View style={demoStyles.animationGrid}>
          <Card
            variant="elevated"
            size="sm"
            pressable
            animationType="scale"
            onPress={() => console.log("Scale animation")}
            style={demoStyles.animationCard}
          >
            <CardHeader spacing="sm">
              <View className="items-center justify-center gap-3 mt-3">
                <View style={demoStyles.animationIcon}>
                  <Feather name="maximize-2" size={20} color="#60a5fa" />
                </View>
                <CardTitle size="md" weight="medium">
                  Scale
                </CardTitle>
              </View>
            </CardHeader>
          </Card>

          <Card
            variant="elevated"
            size="sm"
            pressable
            animationType="fade"
            onPress={() => console.log("Fade animation")}
            style={demoStyles.animationCard}
          >
            <CardHeader spacing="sm">
              <View className="items-center justify-center gap-3 mt-3">
                <View style={demoStyles.animationIcon}>
                  <Feather name="sun" size={16} color="#f59e0b" />
                </View>
                <CardTitle size="md" weight="medium">
                  Fade
                </CardTitle>
              </View>
            </CardHeader>
          </Card>

          <Card
            variant="elevated"
            size="sm"
            pressable
            animationType="bounce"
            onPress={() => console.log("Bounce animation")}
            style={demoStyles.animationCard}
          >
            <CardHeader spacing="sm">
              <View className="items-center justify-center gap-3 mt-3">
                <View style={demoStyles.animationIcon}>
                  <MaterialIcons
                    name="sports-basketball"
                    size={16}
                    color="#10b981"
                  />
                </View>
                <CardTitle size="md" weight="medium">
                  Bounce
                </CardTitle>
              </View>
            </CardHeader>
          </Card>

          <Card
            variant="elevated"
            size="sm"
            pressable
            animationType="slide"
            onPress={() => console.log("Slide animation")}
            style={demoStyles.animationCard}
          >
            <CardHeader spacing="sm">
              <View className="items-center justify-center gap-3 mt-3">
                <View style={demoStyles.animationIcon}>
                  <Feather name="move" size={16} color="#8b5cf6" />
                </View>
                <CardTitle size="md" weight="medium">
                  Slide
                </CardTitle>
              </View>
            </CardHeader>
          </Card>
        </View>
      </View>

      <View style={demoStyles.section}>
        <Text style={demoStyles.sectionTitle}>Real-world Examples</Text>

        <Card
          variant="elevated"
          size="lg"
          pressable
          animationType="scale"
          onPress={() => console.log("Profile pressed")}
          style={demoStyles.demoCard}
        >
          <CardHeader spacing="lg">
            <View style={demoStyles.profileHeader}>
              <View style={demoStyles.avatar}>
                <FontAwesome5 name="user-circle" size={48} color="#60a5fa" />
              </View>
              <View style={demoStyles.profileInfo}>
                <CardTitle size="xl" weight="bold">
                  Alex Chen
                </CardTitle>
                <CardDescription size="md">
                  Senior Frontend Developer
                </CardDescription>
                <Text style={demoStyles.companyText}>@ TechFlow Inc.</Text>
              </View>
              <View style={demoStyles.statusBadge}>
                <View style={demoStyles.statusDot} />
                <Text style={demoStyles.statusText}>Online</Text>
              </View>
            </View>
          </CardHeader>
          <CardContent spacing="md">
            <View style={demoStyles.statsContainer}>
              <View style={demoStyles.statItem}>
                <Feather name="code" size={16} color="#10b981" />
                <Text style={demoStyles.statNumber}>127</Text>
                <Text style={demoStyles.statLabel}>Projects</Text>
              </View>
              <View style={demoStyles.statItem}>
                <Feather name="users" size={16} color="#f59e0b" />
                <Text style={demoStyles.statNumber}>2.4k</Text>
                <Text style={demoStyles.statLabel}>Followers</Text>
              </View>
              <View style={demoStyles.statItem}>
                <Feather name="star" size={16} color="#8b5cf6" />
                <Text style={demoStyles.statNumber}>4.9</Text>
                <Text style={demoStyles.statLabel}>Rating</Text>
              </View>
            </View>
          </CardContent>
        </Card>

        <Card
          variant="outlined"
          size="md"
          pressable
          animationType="bounce"
          onPress={() => console.log("Article pressed")}
          style={demoStyles.demoCard}
        >
          <CardHeader spacing="md">
            <View style={demoStyles.articleMeta}>
              <View style={demoStyles.categoryTag}>
                <Text style={demoStyles.categoryText}>TECH</Text>
              </View>
              <Text style={demoStyles.readTime}>∙ 8 min read</Text>
            </View>
            <CardTitle size="lg" weight="semibold" numberOfLines={2}>
              The Future of React Native Development
            </CardTitle>
            <CardDescription size="md" numberOfLines={2}>
              Exploring the latest trends and innovations shaping mobile
              development
            </CardDescription>
          </CardHeader>
          <CardFooter justify="between" spacing="md">
            <Text style={demoStyles.articleDate}>March 20, 2024</Text>
            <View style={demoStyles.articleActions}>
              <View style={demoStyles.actionItem}>
                <Feather name="heart" size={16} color="#ef4444" />
                <Text style={demoStyles.actionCount}>142</Text>
              </View>
              <View style={demoStyles.actionItem}>
                <Feather name="message-circle" size={16} color="#60a5fa" />
                <Text style={demoStyles.actionCount}>23</Text>
              </View>
              <View style={demoStyles.actionItem}>
                <Feather name="share" size={16} color="#10b981" />
                <Text style={demoStyles.actionCount}>8</Text>
              </View>
            </View>
          </CardFooter>
        </Card>

        <Card
          variant="elevated"
          size="lg"
          interactive
          animationType="fade"
          style={demoStyles.demoCard}
        >
          <CardHeader spacing="md">
            <View style={demoStyles.dashboardHeader}>
              <View style={demoStyles.dashboardIcon}>
                <MaterialIcons name="trending-up" size={24} color="#10b981" />
              </View>
              <View>
                <CardTitle size="lg" weight="bold">
                  Revenue Analytics
                </CardTitle>
                <CardDescription>Monthly performance overview</CardDescription>
              </View>
            </View>
          </CardHeader>
          <CardContent spacing="lg">
            <View style={demoStyles.metricsGrid}>
              <View style={demoStyles.metricCard}>
                <Text style={demoStyles.metricValue}>$24.5k</Text>
                <Text style={demoStyles.metricLabel}>Total Revenue</Text>
                <View style={demoStyles.metricChange}>
                  <Feather name="trending-up" size={12} color="#10b981" />
                  <Text style={demoStyles.metricChangeText}>+12.5%</Text>
                </View>
              </View>
              <View style={demoStyles.metricCard}>
                <Text style={demoStyles.metricValue}>1,847</Text>
                <Text style={demoStyles.metricLabel}>New Users</Text>
                <View style={demoStyles.metricChange}>
                  <Feather name="trending-up" size={12} color="#10b981" />
                  <Text style={demoStyles.metricChangeText}>+8.2%</Text>
                </View>
              </View>
            </View>
          </CardContent>
        </Card>

        <Card
          variant="default"
          size="md"
          pressable
          animationType="slide"
          onPress={() => console.log("Feature pressed")}
          style={demoStyles.demoCard}
        >
          <CardHeader spacing="md">
            <View style={demoStyles.featureHeader}>
              <View style={demoStyles.featureIconLarge}>
                <Feather name="zap" size={28} color="#f59e0b" />
              </View>
              <View>
                <CardTitle size="xl" weight="bold">
                  Lightning Fast
                </CardTitle>
                <CardDescription size="md">
                  Optimized performance
                </CardDescription>
              </View>
            </View>
          </CardHeader>
          <CardContent spacing="md">
            <Text style={demoStyles.featureDescription}>
              Experience blazing-fast load times with our advanced optimization
              techniques and intelligent caching mechanisms.
            </Text>
            <View style={demoStyles.featureStats}>
              <View style={demoStyles.featureStat}>
                <Text style={demoStyles.featureStatNumber}>99.9%</Text>
                <Text style={demoStyles.featureStatLabel}>Uptime</Text>
              </View>
              <View style={demoStyles.featureStat}>
                <Text style={demoStyles.featureStatNumber}>&lt;50ms</Text>
                <Text style={demoStyles.featureStatLabel}>Response</Text>
              </View>
            </View>
          </CardContent>
        </Card>
      </View>

      <View style={demoStyles.section}>
        <Text style={demoStyles.sectionTitle}>Interactive States</Text>

        <Card
          variant="elevated"
          size="md"
          loading={true}
          style={demoStyles.demoCard}
        >
          <CardHeader spacing="md">
            <CardTitle size="lg" weight="semibold">
              Loading State
            </CardTitle>
            <CardDescription>Card with loading overlay</CardDescription>
          </CardHeader>
          <CardContent>
            <Text
              style={[demoStyles.cardDescription, { top: 10, marginTop: 10 }]}
            >
              This card demonstrates the loading state with animated spinner.
            </Text>
          </CardContent>
        </Card>

        <Card
          variant="outlined"
          size="md"
          disabled={true}
          style={demoStyles.demoCard}
        >
          <CardHeader spacing="md">
            <CardTitle size="lg" weight="semibold">
              Disabled State
            </CardTitle>
            <CardDescription>Card with disabled styling</CardDescription>
          </CardHeader>
          <CardContent>
            <Text style={demoStyles.cardDescription}>
              This card is disabled and shows reduced opacity.
            </Text>
          </CardContent>
        </Card>
      </View>

      <View style={demoStyles.footer}>
        <View style={demoStyles.footerIcon}>
          <MaterialIcons name="dashboard" size={16} color="#71717a" />
        </View>
        <Text style={demoStyles.footerText}>
          The Card component provides flexible layouts with beautiful animations
          and consistent theming
        </Text>
      </View>
    </ScrollView>
  );
};

const demoStyles = StyleSheet.create({
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
  demoCard: {
    marginBottom: 16,
    backgroundColor: "rgba(24, 24, 27, 0.5)",
  },
  variantHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  variantIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#09090b",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  variantLabel: {
    fontSize: 14,
    color: "#a1a1aa",
    marginTop: 2,
  },
  cardDescription: {
    fontSize: 14,
    color: "#a1a1aa",
    lineHeight: 20,
  },
  animationGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  animationCard: {
    flex: 1,
    minWidth: "47%",
    alignItems: "center",
    backgroundColor: "#141414",
  },
  animationIcon: {
    width: 42,
    height: 42,
    borderRadius: 16,
    backgroundColor: "#09090b",
    alignItems: "center",
    justifyContent: "center",
  },
  profileHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  avatar: {
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  companyText: {
    fontSize: 14,
    color: "#71717a",
    marginTop: 4,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#18181b",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#27272a",
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#10b981",
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    color: "#10b981",
    fontWeight: "500",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  statNumber: {
    fontSize: 18,
    color: "#fafafa",
    fontWeight: "700",
    marginTop: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#71717a",
    marginTop: 2,
  },
  articleMeta: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  categoryTag: {
    backgroundColor: "#60a5fa",
    paddingHorizontal: 4,
    paddingVertical: 4,
    borderRadius: 8,
    width: 50,
    alignItems: "center",
  },
  categoryText: {
    fontSize: 8,
    color: "#fafafa",
    fontWeight: "700",
    letterSpacing: 1,
  },
  readTime: {
    fontSize: 12,
    color: "#71717a",
    marginLeft: 4,
  },
  articleDate: {
    fontSize: 12,
    color: "#71717a",
  },
  articleActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  actionItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  actionCount: {
    fontSize: 12,
    color: "#71717a",
  },
  dashboardHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  dashboardIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#09090b",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  metricsGrid: {
    flexDirection: "row",
    gap: 16,
  },
  metricCard: {
    flex: 1,
    backgroundColor: "#09090b",
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#27272a",
  },
  metricValue: {
    fontSize: 20,
    color: "#fafafa",
    fontWeight: "700",
  },
  metricLabel: {
    fontSize: 12,
    color: "#71717a",
    marginTop: 4,
  },
  metricChange: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    gap: 4,
  },
  metricChangeText: {
    fontSize: 12,
    color: "#10b981",
    fontWeight: "500",
  },
  featureHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  featureIconLarge: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#09090b",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  featureDescription: {
    fontSize: 14,
    color: "#a1a1aa",
    lineHeight: 22,
    marginBottom: 16,
  },
  featureStats: {
    flexDirection: "row",
    gap: 24,
  },
  featureStat: {
    alignItems: "center",
  },
  featureStatNumber: {
    fontSize: 16,
    color: "#10b981",
    fontWeight: "700",
  },
  featureStatLabel: {
    fontSize: 12,
    color: "#71717a",
    marginTop: 2,
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
    flex: 0,
    lineHeight: 20,
  },
});

export default CardDemo;
