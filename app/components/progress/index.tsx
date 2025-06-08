import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Text,
  SafeAreaView,
  Dimensions,
} from "react-native";
import { AnimatedProgressBar } from "@/components/organisms/progress/AnimatedProgress";
import { Ionicons, MaterialIcons, Feather } from "@expo/vector-icons";

const { width: screenWidth } = Dimensions.get("window");

const ProgressDemo: React.FC = () => {
  const [progress, setProgress] = useState<number>(0);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);

  const handleReset = () => {
    setProgress(0);
    setIsAnimating(false);
  };

  const handleIncrement = () => {
    setProgress((prev) => Math.min(prev + 0.1, 1));
  };

  const handleDecrement = () => {
    setProgress((prev) => Math.max(prev - 0.1, 0));
  };

  const handleAnimate = () => {
    setIsAnimating(true);
    setProgress(0);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 1) {
          clearInterval(interval);
          setIsAnimating(false);
          return 1;
        }
        return prev + 0.02;
      });
    }, 50);
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      scrollEnabled
      showsVerticalScrollIndicator={false}
      contentInsetAdjustmentBehavior="always"
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Ionicons name="bar-chart" size={32} color="#8b5cf6" />
            <Text style={styles.title}>Progress Components</Text>
          </View>
          <Text style={styles.subtitle}>
            Beautifully designed progress indicators
          </Text>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.cardTitleContainer}>
              <Feather name="activity" size={20} color="#ffffff" />
              <Text style={styles.cardTitle}>Basic Progress</Text>
            </View>
            <Text style={styles.cardDescription}>
              A simple progress bar with smooth animations
            </Text>
          </View>
          <View style={styles.progressContainer}>
            <View style={styles.progressBarContainer}>
              <AnimatedProgressBar
                progress={progress}
                width="100%"
                height={8}
                progressColor="#ffffff"
                trackColor="#1e1e1e"
                borderRadius={12}
                animationDuration={600}
              />
            </View>
            <View style={styles.progressTextContainer}>
              <Text style={styles.progressText}>
                {Math.round(progress * 100)}%
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.cardTitleContainer}>
              <MaterialIcons name="gradient" size={20} color="#8b5cf6" />
              <Text style={styles.cardTitle}>Gradient Progress</Text>
            </View>
            <Text style={styles.cardDescription}>
              Enhanced with beautiful gradient colors
            </Text>
          </View>
          <View style={styles.progressContainer}>
            <View style={styles.progressBarContainer}>
              <AnimatedProgressBar
                progress={progress}
                width="100%"
                height={12}
                useGradient={true}
                gradientColors={["#8b5cf6", "#06b6d4"]}
                trackColor="#262626"
                borderRadius={16}
                animationDuration={800}
              />
            </View>
            <View style={styles.progressTextContainer}>
              <Text style={styles.progressText}>
                {Math.round(progress * 100)}%
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.cardTitleContainer}>
              <Ionicons name="pulse" size={20} color="#f59e0b" />
              <Text style={styles.cardTitle}>Pulsating Progress</Text>
            </View>
            <Text style={styles.cardDescription}>
              With subtle pulsing animation effect
            </Text>
          </View>
          <View style={styles.progressContainer}>
            <View style={styles.progressBarContainer}>
              <AnimatedProgressBar
                progress={progress}
                width="100%"
                height={10}
                pulsate={true}
                useGradient={true}
                gradientColors={["#f59e0b", "#ef4444"]}
                trackColor="#1f1f1f"
                borderRadius={14}
                animationDuration={1000}
              />
            </View>
            <View style={styles.progressTextContainer}>
              <Text style={styles.progressText}>
                {Math.round(progress * 100)}%
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.cardTitleContainer}>
              <MaterialIcons name="line-weight" size={20} color="#10b981" />
              <Text style={styles.cardTitle}>Thick Progress</Text>
            </View>
            <Text style={styles.cardDescription}>
              Larger size for better visibility
            </Text>
          </View>
          <View style={styles.progressContainer}>
            <View style={styles.progressBarContainer}>
              <AnimatedProgressBar
                progress={progress}
                width="100%"
                height={20}
                useGradient={true}
                gradientColors={["#10b981", "#059669"]}
                trackColor="#171717"
                borderRadius={20}
                animationDuration={1200}
              />
            </View>
            <View style={styles.progressTextContainer}>
              <Text style={styles.progressTextLarge}>
                {Math.round(progress * 100)}%
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.controlsCard}>
          <View style={styles.controlsTitleContainer}>
            <Ionicons name="settings" size={20} color="#ffffff" />
            <Text style={styles.controlsTitle}>Controls</Text>
          </View>

          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.button, styles.buttonSecondary]}
              onPress={handleDecrement}
              disabled={progress <= 0}
            >
              <Ionicons
                name="remove"
                size={16}
                color={progress <= 0 ? "#525252" : "#ffffff"}
              />
              <Text
                style={[
                  styles.buttonText,
                  progress <= 0 && styles.buttonTextDisabled,
                ]}
              >
                10%
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.buttonSecondary]}
              onPress={handleIncrement}
              disabled={progress >= 1}
            >
              <Ionicons
                name="add"
                size={16}
                color={progress >= 1 ? "#525252" : "#ffffff"}
              />
              <Text
                style={[
                  styles.buttonText,
                  progress >= 1 && styles.buttonTextDisabled,
                ]}
              >
                10%
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.button, styles.buttonPrimary]}
              onPress={handleAnimate}
              disabled={isAnimating}
            >
              <Ionicons
                name="play"
                size={16}
                color={isAnimating ? "#525252" : "#000000"}
              />
              <Text
                style={[
                  styles.buttonTextPrimary,
                  isAnimating && styles.buttonTextDisabled,
                ]}
              >
                {isAnimating ? "Animating..." : "Animate"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.buttonDestructive]}
              onPress={handleReset}
            >
              <Ionicons name="refresh" size={16} color="#ffffff" />
              <Text style={styles.buttonTextDestructive}>Reset</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#0a0a0a",
  },
  container: {
    flex: 1,
    backgroundColor: "#0a0a0a",
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 32,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#ffffff",
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    color: "#a1a1aa",
    lineHeight: 24,
  },
  card: {
    backgroundColor: "#111111",
    borderRadius: 16,
    padding: 24,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#1f1f1f",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  cardHeader: {
    marginBottom: 20,
  },
  cardTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#ffffff",
  },
  cardDescription: {
    fontSize: 14,
    color: "#71717a",
    lineHeight: 20,
  },
  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  progressBarContainer: {
    flex: 1,
  },
  progressTextContainer: {
    minWidth: 50,
    alignItems: "flex-end",
  },
  progressText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#d4d4d8",
    fontFamily: "monospace",
  },
  progressTextLarge: {
    fontSize: 16,
    fontWeight: "600",
    color: "#d4d4d8",
    fontFamily: "monospace",
  },
  controlsCard: {
    backgroundColor: "#111111",
    borderRadius: 16,
    padding: 24,
    marginTop: 12,
    borderWidth: 1,
    borderColor: "#1f1f1f",
  },
  controlsTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginBottom: 20,
  },
  controlsTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#ffffff",
  },
  buttonRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 44,
    flexDirection: "row",
    gap: 8,
  },
  buttonPrimary: {
    backgroundColor: "#ffffff",
  },
  buttonSecondary: {
    backgroundColor: "#262626",
    borderWidth: 1,
    borderColor: "#404040",
  },
  buttonDestructive: {
    backgroundColor: "#dc2626",
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#ffffff",
  },
  buttonTextPrimary: {
    fontSize: 14,
    fontWeight: "500",
    color: "#000000",
  },
  buttonTextDestructive: {
    fontSize: 14,
    fontWeight: "500",
    color: "#ffffff",
  },
  buttonTextDisabled: {
    opacity: 0.5,
  },
});

export default ProgressDemo;
