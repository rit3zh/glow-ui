// @glow-ui - React Native
// @button/demo-usage example

// @ts-check
import React, { useCallback, useState, memo } from "react";
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  useWindowDimensions,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ExpandableButton } from "@/components";

const ButtonDemo: React.FC = (_$_): React.ReactNode => {
  const [primaryLoading, setPrimaryLoading] = useState<boolean>(false);
  const [gradientLoading, setGradientLoading] = useState<boolean>(false);
  const [githubLoading, setGithubLoading] = useState<boolean>(false);
  const [dangerLoading, setDangerLoading] = useState<boolean>(false);
  const [outlineLoading, setOutlineLoading] = useState<boolean>(false);
  const [disabledExample, setDisabledExample] = useState<boolean>(false);

  const width = useWindowDimensions().width;
  const handlePrimaryPress = useCallback<() => any | Function>(() => {
    setPrimaryLoading(true);
    setTimeout(() => {
      setPrimaryLoading(false);
    }, 2000);
  }, []);

  const handleGradientPress = useCallback<() => any | Function>(() => {
    setGradientLoading(true);
    setTimeout(() => {
      setGradientLoading(false);
    }, 2500);
  }, []);

  const handleGithubPress = useCallback<() => any | Function>(() => {
    setGithubLoading(true);
    setTimeout(() => {
      setGithubLoading(false);
    }, 3000);
  }, []);

  const handleDangerPress = useCallback<() => any | Function>(() => {
    setDangerLoading(true);
    setTimeout(() => {
      setDangerLoading(false);
    }, 1500);
  }, []);

  const handleOutlinePress = useCallback<() => any | Function>(() => {
    setOutlineLoading(true);
    setTimeout(() => {
      setOutlineLoading(false);
    }, 2000);
  }, []);

  const toggleDisabled = useCallback<() => any | Function>(() => {
    setDisabledExample(!disabledExample);
  }, [disabledExample]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        scrollEnabled
        contentInsetAdjustmentBehavior="always"
      >
        <View style={styles.content}>
          <View style={styles.header}>
            <Ionicons name="radio-button-on" size={24} color="#6366f1" />
            <Text style={styles.title}>Button</Text>
          </View>

          <Text style={styles.subtitle}>
            Comprehensive examples demonstrating all button variants and
            configurations
          </Text>

          <View style={styles.exampleSection}>
            <Text style={styles.exampleTitle}>Primary Button</Text>
            <Text style={styles.exampleDescription}>
              Standard button with custom styling, icon, and loading state
            </Text>
            <ExpandableButton
              title="Launch Application"
              isLoading={primaryLoading}
              onPress={handlePrimaryPress}
              width={width - 80}
              height={52}
              backgroundColor="#6366f1"
              textColor="#ffffff"
              fontSize={16}
              icon="aperture"
              iconSize={18}
              iconColor="#ffffff"
              borderRadius={12}
              style={styles.primaryButtonStyle}
              textStyle={styles.primaryTextStyle}
              withPressAnimation={true}
              loadingIndicatorColor="#ffffff"
              animationConfig={{
                damping: 15,
                stiffness: 150,
                duration: 300,
              }}
              disabled={false}
            />
          </View>

          <View style={styles.exampleSection}>
            <Text style={styles.exampleTitle}>Gradient Button</Text>
            <Text style={styles.exampleDescription}>
              Beautiful gradient background with custom animation timing
            </Text>
            <ExpandableButton
              title="Start Journey"
              isLoading={gradientLoading}
              onPress={handleGradientPress}
              width={width - 80}
              height={56}
              gradientColors={["#667eea", "#764ba2"]}
              textColor="#ffffff"
              fontSize={17}
              icon="compass"
              iconSize={20}
              iconColor="#ffffff"
              borderRadius={28}
              style={styles.gradientButtonStyle}
              textStyle={styles.gradientTextStyle}
              withPressAnimation={true}
              loadingIndicatorColor="#ffffff"
              animationConfig={{
                damping: 20,
                stiffness: 200,
                duration: 250,
              }}
              disabled={false}
            />
          </View>

          <View style={styles.exampleSection}>
            <Text style={styles.exampleTitle}>GitHub Integration</Text>
            <Text style={styles.exampleDescription}>
              Dark themed button perfect for GitHub actions and integrations
            </Text>
            <ExpandableButton
              title="Clone Repository"
              isLoading={githubLoading}
              onPress={handleGithubPress}
              width={width - 80}
              height={48}
              backgroundColor="#24292e"
              textColor="#ffffff"
              fontSize={15}
              icon="github"
              iconSize={18}
              iconColor="#ffffff"
              borderRadius={8}
              style={styles.githubButtonStyle}
              textStyle={styles.githubTextStyle}
              withPressAnimation={true}
              loadingIndicatorColor="#ffffff"
              animationConfig={{
                damping: 12,
                stiffness: 120,
                duration: 350,
              }}
              disabled={false}
            />
          </View>
          <View style={styles.exampleSection}>
            <Text style={styles.exampleTitle}>Destructive Action</Text>
            <Text style={styles.exampleDescription}>
              Warning-style button for delete operations and critical actions
            </Text>
            <ExpandableButton
              title="Delete Forever"
              isLoading={dangerLoading}
              onPress={handleDangerPress}
              width={width - 80}
              height={50}
              backgroundColor="#ef4444"
              textColor="#ffffff"
              fontSize={16}
              icon="trash-2"
              iconSize={17}
              iconColor="#ffffff"
              borderRadius={10}
              style={styles.dangerButtonStyle}
              textStyle={styles.dangerTextStyle}
              withPressAnimation={true}
              loadingIndicatorColor="#ffffff"
              animationConfig={{
                damping: 25,
                stiffness: 300,
                duration: 200,
              }}
              disabled={false}
            />
          </View>

          <View style={styles.exampleSection}>
            <Text style={styles.exampleTitle}>Outline Variant</Text>
            <Text style={styles.exampleDescription}>
              Transparent background with border styling for secondary actions
            </Text>
            <ExpandableButton
              title="Learn More"
              isLoading={outlineLoading}
              onPress={handleOutlinePress}
              width={width - 80}
              height={48}
              backgroundColor="transparent"
              textColor="#6366f1"
              fontSize={16}
              icon="info"
              iconSize={18}
              iconColor="#6366f1"
              borderRadius={24}
              style={styles.outlineButtonStyle}
              textStyle={styles.outlineTextStyle}
              withPressAnimation={true}
              loadingIndicatorColor="#6366f1"
              animationConfig={{
                damping: 18,
                stiffness: 160,
                duration: 280,
              }}
              disabled={false}
            />
          </View>

          <View style={styles.exampleSection}>
            <Text style={styles.exampleTitle}>Disabled State</Text>
            <Text style={styles.exampleDescription}>
              Demonstration of disabled state with reduced opacity and no
              interactions
            </Text>
            <View style={styles.disabledContainer}>
              <ExpandableButton
                title="Disabled Action"
                isLoading={false}
                onPress={() => {}}
                width={width - 80}
                height={48}
                backgroundColor="#9ca3af"
                textColor="#ffffff"
                fontSize={16}
                icon="lock"
                iconSize={18}
                iconColor="#ffffff"
                borderRadius={12}
                style={styles.disabledButtonStyle}
                textStyle={styles.disabledTextStyle}
                withPressAnimation={false}
                loadingIndicatorColor="#ffffff"
                disabled={true}
              />

              <ExpandableButton
                title={disabledExample ? "Enable Button" : "Disable Button"}
                isLoading={false}
                onPress={toggleDisabled}
                width={140}
                height={36}
                backgroundColor="#10b981"
                textColor="#ffffff"
                fontSize={14}
                icon={disabledExample ? "unlock" : "lock"}
                iconSize={14}
                iconColor="#ffffff"
                borderRadius={18}
                style={styles.toggleButtonStyle}
                withPressAnimation={true}
                disabled={false}
              />
            </View>
          </View>

          <View style={styles.exampleSection}>
            <Text style={styles.exampleTitle}>Custom Animation</Text>
            <Text style={styles.exampleDescription}>
              Bouncy animation with custom spring physics and extended duration
            </Text>
            <ExpandableButton
              title="Bounce Effect"
              isLoading={false}
              onPress={() => {}}
              width={width - 80}
              height={54}
              gradientColors={["#f093fb", "#f5576c"]}
              textColor="#ffffff"
              fontSize={18}
              icon="zap"
              iconSize={20}
              iconColor="#ffffff"
              borderRadius={27}
              style={styles.bounceButtonStyle}
              textStyle={styles.bounceTextStyle}
              withPressAnimation={true}
              animationConfig={{
                damping: 8,
                stiffness: 100,
                duration: 500,
              }}
              disabled={false}
            />
          </View>

          <View style={styles.features}>
            <Text style={styles.featuresTitle}>Key Features</Text>

            <View style={styles.feature}>
              <Ionicons name="flash" size={16} color="#10b981" />
              <Text style={styles.featureText}>
                Smooth spring animations with customizable physics
              </Text>
            </View>

            <View style={styles.feature}>
              <Ionicons name="refresh" size={16} color="#f59e0b" />
              <Text style={styles.featureText}>
                Built-in loading states with spinner indicators
              </Text>
            </View>

            <View style={styles.feature}>
              <Ionicons name="heart" size={16} color="#ef4444" />
              <Text style={styles.featureText}>
                Haptic press feedback and visual responses
              </Text>
            </View>

            <View style={styles.feature}>
              <Ionicons name="color-palette" size={16} color="#8b5cf6" />
              <Text style={styles.featureText}>
                Gradient backgrounds and custom styling support
              </Text>
            </View>

            <View style={styles.feature}>
              <Ionicons name="construct" size={16} color="#06b6d4" />
              <Text style={styles.featureText}>
                Feather icon integration with size customization
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a0a0a",
  },
  scrollContent: {
    paddingBottom: 40,
  },
  content: {
    paddingHorizontal: 24,
    paddingVertical: 32,
    gap: 32,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#ffffff",
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    color: "#6b7280",
    lineHeight: 24,
    marginBottom: 16,
  },
  exampleSection: {
    gap: 12,
    paddingVertical: 8,
  },
  exampleTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#ffffff",
    marginBottom: 4,
  },
  exampleDescription: {
    fontSize: 14,
    color: "#9ca3af",
    lineHeight: 20,
    marginBottom: 16,
  },
  disabledContainer: {
    gap: 16,
    alignItems: "center",
  },
  features: {
    gap: 16,
    marginTop: 24,
  },
  featuresTitle: {
    fontSize: 22,
    fontWeight: "600",
    color: "#ffffff",
    marginBottom: 8,
  },
  feature: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 8,
  },
  featureText: {
    fontSize: 15,
    color: "#9ca3af",
    fontWeight: "500",
    flex: 1,
  },
  primaryButtonStyle: {
    shadowColor: "#6366f1",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
  },
  primaryTextStyle: {
    fontWeight: "600",
    letterSpacing: 0.3,
  },
  gradientButtonStyle: {
    shadowColor: "#667eea",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  gradientTextStyle: {
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  githubButtonStyle: {
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 4,
  },
  githubTextStyle: {
    fontWeight: "500",
    letterSpacing: 0.2,
  },
  dangerButtonStyle: {
    shadowColor: "#ef4444",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  dangerTextStyle: {
    fontWeight: "600",
    letterSpacing: 0.3,
  },
  outlineButtonStyle: {
    borderWidth: 2,
    borderColor: "#6366f1",
    shadowColor: "#6366f1",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  outlineTextStyle: {
    fontWeight: "600",
    letterSpacing: 0.4,
  },
  disabledButtonStyle: {
    opacity: 0.6,
  },
  disabledTextStyle: {
    fontWeight: "500",
  },
  toggleButtonStyle: {
    shadowColor: "#10b981",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  bounceButtonStyle: {
    shadowColor: "#f093fb",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 10,
  },
  bounceTextStyle: {
    fontWeight: "700",
    letterSpacing: 0.6,
  },
});

export default memo(ButtonDemo);
