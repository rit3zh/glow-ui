import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Row, SeekBar } from "@/components/index";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { FontAwesome, Ionicons } from "@expo/vector-icons";

const SeekBarDemo: React.FC = (_$_): React.ReactNode => {
  const [progress1, setProgress1] = useState<number>(0.3);
  const [progress2, setProgress2] = useState<number>(0.65);
  const [progress3, setProgress3] = useState<number>(0);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isAnimating) {
      interval = setInterval<[]>(() => {
        setProgress3((prev) => {
          const newProgress = prev + 0.02;
          return newProgress >= 1 ? 0 : newProgress;
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isAnimating]);

  const resetValues = () => {
    setProgress1(0.3);
    setProgress2(0.65);
    setProgress3(0);
    setIsAnimating(false);
  };

  return (
    <ScrollView
      className="flex-1"
      contentContainerStyle={{ flexGrow: 1 }}
      contentInsetAdjustmentBehavior="always"
      showsVerticalScrollIndicator={false}
      scrollEnabled
    >
      <SafeAreaView style={styles.container}>
        <GestureHandlerRootView style={styles.wrapper}>
          <View style={styles.header}>
            <Row style={{ alignItems: "center" }}>
              <FontAwesome name="sliders" size={30} color="white" />
              <Text
                style={[
                  styles.title,
                  {
                    top: 5,
                  },
                ]}
              >
                SeekBar Component
              </Text>
            </Row>
            <Text style={styles.subtitle}>Interactive progress controls</Text>
          </View>

          <View style={styles.examples}>
            <View style={styles.example}>
              <View style={styles.exampleHeader}>
                <View style={styles.iconContainer}>
                  <Ionicons name="play-circle" size={18} color="#f4f4f5" />
                </View>
                <View style={styles.textContainer}>
                  <Text style={styles.exampleTitle}>Media Progress</Text>
                  <Text style={styles.exampleDescription}>
                    Standard progress indicator
                  </Text>
                </View>
                <Text style={styles.valueText}>
                  {Math.round(progress1 * 100)}%
                </Text>
              </View>
              <SeekBar
                value={progress1}
                onValueChange={setProgress1}
                activeHeight={8}
                activeColor="#f4f4f5"
                disabled={false}
                width={320}
                height={4}
                inactiveColor="#27272a"
                tapToSeek={false}
              />
            </View>

            <View style={styles.example}>
              <View style={styles.exampleHeader}>
                <View style={styles.iconContainer}>
                  <Ionicons name="volume-high" size={18} color="#f4f4f5" />
                </View>
                <View style={styles.textContainer}>
                  <Text style={styles.exampleTitle}>Volume Control</Text>
                  <Text style={styles.exampleDescription}>
                    Audio level adjustment
                  </Text>
                </View>
                <Text style={styles.valueText}>
                  {Math.round(progress2 * 100)}%
                </Text>
              </View>
              <SeekBar
                value={progress2}
                onValueChange={setProgress2}
                activeHeight={6}
                activeColor="#a1a1aa"
                disabled={false}
                width={320}
                height={6}
                inactiveColor="#18181b"
                tapToSeek={false}
              />
            </View>

            <View style={styles.example}>
              <View style={styles.exampleHeader}>
                <View style={styles.iconContainer}>
                  <Ionicons name="timer" size={18} color="#f4f4f5" />
                </View>
                <View style={styles.textContainer}>
                  <Text style={styles.exampleTitle}>Loading Progress</Text>
                  <Text style={styles.exampleDescription}>
                    Animated progress tracking
                  </Text>
                </View>
                <Text style={styles.valueText}>
                  {Math.round(progress3 * 100)}%
                </Text>
              </View>
              <SeekBar
                value={progress3}
                onValueChange={setProgress3}
                activeHeight={10}
                activeColor="#d4d4d8"
                disabled={false}
                width={320}
                height={5}
                inactiveColor="#27272a"
                tapToSeek={false}
              />
            </View>

            <View style={styles.example}>
              <View style={styles.exampleHeader}>
                <View style={[styles.iconContainer, styles.disabledIcon]}>
                  <Ionicons name="lock-closed" size={18} color="#52525b" />
                </View>
                <View style={styles.textContainer}>
                  <Text style={[styles.exampleTitle, styles.disabledText]}>
                    Disabled State
                  </Text>
                  <Text style={styles.exampleDescription}>
                    Read-only progress
                  </Text>
                </View>
                <Text style={styles.valueText}>45%</Text>
              </View>
              <SeekBar
                value={0.45}
                onValueChange={() => {}}
                activeHeight={4}
                activeColor="#3f3f46"
                disabled={true}
                width={320}
                height={4}
                inactiveColor="#18181b"
                tapToSeek={false}
              />
            </View>
          </View>

          <View style={styles.controls}>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => setIsAnimating(!isAnimating)}
              activeOpacity={0.8}
            >
              <Ionicons
                name={isAnimating ? "pause" : "play"}
                size={16}
                color="#09090b"
              />
              <Text style={styles.primaryButtonText}>
                {isAnimating ? "Pause" : "Start"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={resetValues}
              activeOpacity={0.8}
            >
              <Ionicons name="refresh" size={16} color="#a1a1aa" />
              <Text style={styles.secondaryButtonText}>Reset</Text>
            </TouchableOpacity>
          </View>
        </GestureHandlerRootView>
      </SafeAreaView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#09090b",
  },
  wrapper: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  header: {
    marginBottom: 40,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#27272a",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#fafafa",
    marginBottom: 6,
    letterSpacing: -0.5,
    marginLeft: 5,
  },
  subtitle: {
    fontSize: 15,
    color: "#71717a",
    fontWeight: "400",
  },
  examples: {
    flex: 1,
    gap: 20,
  },
  example: {
    backgroundColor: "#18181b",
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: "#27272a",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  exampleHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    gap: 16,
  },
  iconContainer: {
    width: 40,
    height: 40,
    backgroundColor: "#27272a",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#3f3f46",
  },
  disabledIcon: {
    backgroundColor: "#18181b",
    borderColor: "#27272a",
  },
  textContainer: {
    flex: 1,
  },
  exampleTitle: {
    fontSize: 17,
    fontWeight: "600",
    color: "#f4f4f5",
    marginBottom: 4,
    letterSpacing: -0.2,
  },
  disabledText: {
    color: "#71717a",
  },
  exampleDescription: {
    fontSize: 13,
    color: "#71717a",
    lineHeight: 16,
  },
  valueText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#a1a1aa",
    fontFamily: "monospace",
    minWidth: 40,
    textAlign: "right",
  },
  controls: {
    flexDirection: "row",
    gap: 12,
    paddingVertical: 24,
    borderTopWidth: 1,
    borderTopColor: "#27272a",
  },
  primaryButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fafafa",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    gap: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  primaryButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#09090b",
  },
  secondaryButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#3f3f46",
    gap: 8,
  },
  secondaryButtonText: {
    fontSize: 15,
    fontWeight: "500",
    color: "#a1a1aa",
  },
});

export default SeekBarDemo;
