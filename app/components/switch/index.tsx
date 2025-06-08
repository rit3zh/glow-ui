import React, { useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  ScrollView,
  StatusBar,
  TouchableOpacity,
} from "react-native";
import { AnimatedSwitch } from "@/components/base/switch/AnimatedSwitch";
import {
  Feather,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
  AntDesign,
} from "@expo/vector-icons";

export default function AnimatedSwitchShowcase<T extends React.FC>(
  _$_: T,
): React.ReactNode {
  const [basicSwitch, setBasicSwitch] = useState(false);
  const [customSizeSwitch, setCustomSizeSwitch] = useState(true);
  const [customColorSwitch, setCustomColorSwitch] = useState(false);
  const [disabledOnSwitch] = useState<boolean>(true);
  const [disabledOffSwitch] = useState<boolean>(false);

  const [iconSwitch, setIconSwitch] = useState<boolean>(true);
  const [dualIconSwitch, setDualIconSwitch] = useState<boolean>(false);
  const [trackIconSwitch, setTrackIconSwitch] = useState<boolean>(true);
  const [fullIconSwitch, setFullIconSwitch] = useState<boolean>(false);

  const [fadeSwitch, setFadeSwitch] = useState<boolean>(true);
  const [rotateSwitch, setRotateSwitch] = useState<boolean>(false);
  const [scaleSwitch, setScaleSwitch] = useState<boolean>(true);
  const [bounceSwitch, setBounceSwitch] = useState<boolean>(false);

  const [springSwitch, setSpringSwitch] = useState<boolean>(true);
  const [styledSwitch, setStyledSwitch] = useState<boolean>(false);

  const [allSwitches, setAllSwitches] = useState<boolean>(false);

  const handleToggleAll = () => {
    const newValue = !allSwitches;
    setAllSwitches(newValue);
    setBasicSwitch(newValue);
    setCustomSizeSwitch(newValue);
    setCustomColorSwitch(newValue);
    setIconSwitch(newValue);
    setDualIconSwitch(newValue);
    setTrackIconSwitch(newValue);
    setFullIconSwitch(newValue);
    setFadeSwitch(newValue);
    setRotateSwitch(newValue);
    setScaleSwitch(newValue);
    setBounceSwitch(newValue);
    setSpringSwitch(newValue);
    setStyledSwitch(newValue);
  };

  const handleRandomize = () => {
    setBasicSwitch(Math.random() > 0.5);
    setCustomSizeSwitch(Math.random() > 0.5);
    setCustomColorSwitch(Math.random() > 0.5);
    setIconSwitch(Math.random() > 0.5);
    setDualIconSwitch(Math.random() > 0.5);
    setTrackIconSwitch(Math.random() > 0.5);
    setFullIconSwitch(Math.random() > 0.5);
    setFadeSwitch(Math.random() > 0.5);
    setRotateSwitch(Math.random() > 0.5);
    setScaleSwitch(Math.random() > 0.5);
    setBounceSwitch(Math.random() > 0.5);
    setSpringSwitch(Math.random() > 0.5);
    setStyledSwitch(Math.random() > 0.5);
  };

  const renderSection = (
    title: string,
    icon: string,
    iconLib: string,
    iconColor: string,
    children: React.ReactNode,
  ) => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        {iconLib === "Feather" && (
          <Feather name={icon as any} size={20} color={iconColor} />
        )}
        {iconLib === "Ionicons" && (
          <Ionicons name={icon as any} size={20} color={iconColor} />
        )}
        {iconLib === "MaterialIcons" && (
          <MaterialIcons name={icon as any} size={20} color={iconColor} />
        )}
        {iconLib === "MaterialCommunityIcons" && (
          <MaterialCommunityIcons
            name={icon as any}
            size={20}
            color={iconColor}
          />
        )}
        {iconLib === "AntDesign" && (
          <AntDesign name={icon as any} size={20} color={iconColor} />
        )}
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
      <View style={styles.sectionContent}>{children}</View>
    </View>
  );

  const renderSwitchRow = (
    label: string,
    value: boolean,
    onValueChange: (value: boolean) => void,
    switchProps: any = {},
    description?: string,
    badgeText?: string,
    badgeColor?: string,
  ) => (
    <View style={styles.switchRow}>
      <View style={styles.switchInfo}>
        <View style={styles.switchLabelContainer}>
          <Text style={styles.switchLabel}>{label}</Text>
          {badgeText && (
            <View
              style={[
                styles.badge,
                { backgroundColor: badgeColor || "#374151" },
              ]}
            >
              <Text style={styles.badgeText}>{badgeText}</Text>
            </View>
          )}
        </View>
        {description && (
          <Text style={styles.switchDescription}>{description}</Text>
        )}
      </View>
      <View style={styles.switchContainer}>
        <AnimatedSwitch
          value={value}
          onValueChange={onValueChange}
          {...switchProps}
        />
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0a0a0a" />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        scrollEnabled
      >
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <MaterialIcons name="toggle-on" size={32} color="#8b5cf6" />
            <Text style={styles.title}>Switch Components</Text>
          </View>
          <Text style={styles.subtitle}>
            Beautifully designed animated switches with rich customization
          </Text>
        </View>

        <View style={styles.controlsCard}>
          <View style={styles.controlsHeader}>
            <Ionicons name="settings" size={20} color="#ffffff" />
            <Text style={styles.controlsTitle}>Demo Controls</Text>
          </View>

          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.button, styles.buttonPrimary]}
              onPress={handleToggleAll}
            >
              <MaterialCommunityIcons
                name={allSwitches ? "toggle-switch-off" : "toggle-switch"}
                size={16}
                color="#000000"
              />
              <Text style={styles.buttonTextPrimary}>
                {allSwitches ? "Turn All Off" : "Turn All On"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.buttonSecondary]}
              onPress={handleRandomize}
            >
              <Ionicons name="shuffle" size={16} color="#ffffff" />
              <Text style={styles.buttonText}>Randomize</Text>
            </TouchableOpacity>
          </View>
        </View>

        {renderSection(
          "Basic Usage",
          "toggle-left",
          "Feather",
          "#ffffff",
          <>
            {renderSwitchRow(
              "Default Switch",
              basicSwitch,
              setBasicSwitch,
              {},
              "Standard switch with default styling",
              "Default",
            )}

            {renderSwitchRow(
              "Custom Size",
              customSizeSwitch,
              setCustomSizeSwitch,
              {
                width: 70,
                height: 25,
                thumbSize: 21,
                backgroundImage: {
                  uri: "https://img.freepik.com/premium-vector/abstract-background-with-waves-vector-illustration_648489-99.jpg",
                },
              },
              "Custom width, height, and thumb size",
              "Large",
              "#059669",
            )}

            {renderSwitchRow(
              "Custom Colors",
              customColorSwitch,
              setCustomColorSwitch,
              {
                onColor: "#10B981",
                offColor: "#374151",
                thumbColor: "#F3F4F6",
              },
              "Custom on/off and thumb colors",
              "Styled",
              "#10B981",
            )}

            {renderSwitchRow(
              "Disabled (On)",
              disabledOnSwitch,
              () => {},
              {
                disabled: true,
                onColor: "#6B7280",
              },
              "Disabled switch in on state",
              "Disabled",
              "#6B7280",
            )}

            {renderSwitchRow(
              "Disabled (Off)",
              disabledOffSwitch,
              () => {},
              {
                disabled: true,
              },
              "Disabled switch in off state",
              "Disabled",
              "#6B7280",
            )}
          </>,
        )}

        {renderSection(
          "Icon Features",
          "star",
          "Feather",
          "#f59e0b",
          <>
            {renderSwitchRow(
              "Thumb Icons Only",
              iconSwitch,
              setIconSwitch,
              {
                thumbOnIcon: <Feather name="check" size={16} color="#10B981" />,
                thumbOffIcon: <Feather name="x" size={16} color="#6B7280" />,
                onColor: "#10B981",
              },
              "Different icons for on/off states",
              "Icons",
              "#10B981",
            )}

            {renderSwitchRow(
              "Dual Icon System",
              dualIconSwitch,
              setDualIconSwitch,
              {
                thumbOnIcon: (
                  <MaterialIcons name="wifi" size={16} color="#3B82F6" />
                ),
                thumbOffIcon: (
                  <MaterialIcons name="wifi-off" size={16} color="#6B7280" />
                ),
                trackOnIcon: (
                  <Feather name="cloud-lightning" size={12} color="#FFFFFF" />
                ),
                trackOffIcon: (
                  <Feather name="wifi-off" size={12} color="#6B7280" />
                ),
                onColor: "#3B82F6",
              },
              "Icons on both thumb and track",
              "Dual",
              "#3B82F6",
            )}

            {renderSwitchRow(
              "Track Icons",
              trackIconSwitch,
              setTrackIconSwitch,
              {
                trackOnIcon: (
                  <Ionicons name="volume-high" size={12} color="#FFFFFF" />
                ),
                trackOffIcon: (
                  <Ionicons name="volume-mute" size={12} color="#6B7280" />
                ),
                onColor: "#8B5CF6",
              },
              "Icons displayed on track only",
              "Track",
              "#8B5CF6",
            )}

            {renderSwitchRow(
              "Complete Icon Set",
              fullIconSwitch,
              setFullIconSwitch,
              {
                thumbOnIcon: (
                  <MaterialCommunityIcons
                    name="shield-check"
                    size={16}
                    color="#EF4444"
                  />
                ),
                thumbOffIcon: (
                  <MaterialCommunityIcons
                    name="shield-off"
                    size={16}
                    color="#6B7280"
                  />
                ),
                trackOnIcon: (
                  <MaterialIcons name="security" size={12} color="#FFFFFF" />
                ),
                trackOffIcon: (
                  <MaterialIcons
                    name="no-encryption"
                    size={12}
                    color="#6B7280"
                  />
                ),
                onColor: "#EF4444",
                width: 65,
              },
              "All four icon positions used",
              "Full",
              "#EF4444",
            )}
          </>,
        )}

        {renderSection(
          "Animation Types",
          "zap",
          "Feather",
          "#06b6d4",
          <>
            {renderSwitchRow(
              "Fade Animation",
              fadeSwitch,
              setFadeSwitch,
              {
                thumbOnIcon: (
                  <AntDesign name="star" size={16} color="#F59E0B" />
                ),
                thumbOffIcon: (
                  <AntDesign name="staro" size={16} color="#6B7280" />
                ),
                iconAnimationType: "fade",
                onColor: "#F59E0B",
              },
              "Icons fade in/out smoothly",
              "Fade",
              "#F59E0B",
            )}

            {renderSwitchRow(
              "Rotate Animation",
              rotateSwitch,
              setRotateSwitch,
              {
                thumbOnIcon: (
                  <MaterialCommunityIcons
                    name="sync"
                    size={16}
                    color="#06B6D4"
                  />
                ),
                thumbOffIcon: (
                  <MaterialCommunityIcons
                    name="sync-off"
                    size={16}
                    color="#6B7280"
                  />
                ),
                trackOnIcon: (
                  <Feather name="refresh-cw" size={10} color="#FFFFFF" />
                ),
                iconAnimationType: "rotate",
                onColor: "#06B6D4",
              },
              "Icons rotate during transition",
              "Rotate",
              "#06B6D4",
            )}

            {renderSwitchRow(
              "Scale Animation",
              scaleSwitch,
              setScaleSwitch,
              {
                thumbOnIcon: (
                  <Ionicons name="heart" size={16} color="#EC4899" />
                ),
                thumbOffIcon: (
                  <Ionicons name="heart-outline" size={16} color="#6B7280" />
                ),
                iconAnimationType: "scale",
                onColor: "#EC4899",
              },
              "Icons scale up/down",
              "Scale",
              "#EC4899",
            )}

            {renderSwitchRow(
              "Bounce Animation",
              bounceSwitch,
              setBounceSwitch,
              {
                thumbOnIcon: (
                  <MaterialIcons
                    name="notifications-active"
                    size={16}
                    color="#8B5CF6"
                  />
                ),
                thumbOffIcon: (
                  <MaterialIcons
                    name="notifications-off"
                    size={16}
                    color="#6B7280"
                  />
                ),
                iconAnimationType: "bounce",
                onColor: "#8B5CF6",
              },
              "Icons bounce during transition",
              "Bounce",
              "#8B5CF6",
            )}
          </>,
        )}

        {renderSection(
          "Advanced Features",
          "settings",
          "Feather",
          "#14b8a6",
          <>
            {renderSwitchRow(
              "Custom Spring Animation",
              springSwitch,
              setSpringSwitch,
              {
                springConfig: {
                  damping: 8,
                  stiffness: 200,
                  mass: 1.2,
                },
                thumbOnIcon: (
                  <MaterialCommunityIcons
                    name="speedometer"
                    size={16}
                    color="#14B8A6"
                  />
                ),
                thumbOffIcon: (
                  <MaterialCommunityIcons
                    name="speedometer"
                    size={16}
                    color="#6B7280"
                  />
                ),
                onColor: "#14B8A6",
              },
              "Custom spring physics configuration",
              "Spring",
              "#14B8A6",
            )}

            {renderSwitchRow(
              "Styled Switch",
              styledSwitch,
              setStyledSwitch,
              {
                style: {
                  borderWidth: 2,
                  borderColor: "#4F46E5",
                  borderRadius: 25,
                },
                thumbInset: 4,
                thumbColor: "#4F46E5",
                offColor: "#1E293B",
                onColor: "#4F46E5",
                thumbOnIcon: (
                  <AntDesign name="check" size={14} color="#FFFFFF" />
                ),
                thumbOffIcon: (
                  <AntDesign name="close" size={14} color="#FFFFFF" />
                ),
                testID: "styled-switch",
              },
              "Custom styling with border and testID",
              "Custom",
              "#4F46E5",
            )}
          </>,
        )}

        <View style={styles.footer}>
          <View style={styles.footerContent}>
            <Feather name="check-circle" size={16} color="#10b981" />
            <Text style={styles.footerText}>
              All AnimatedSwitch features demonstrated above
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a0a0a",
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 30,
  },
  header: {
    marginBottom: 32,
    paddingTop: 20,
    alignItems: "center",
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#ffffff",
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    color: "#a1a1aa",
    textAlign: "center",
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  controlsCard: {
    backgroundColor: "#111111",
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
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
  controlsHeader: {
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
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 16,
    paddingLeft: 4,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#ffffff",
  },
  sectionContent: {
    gap: 12,
  },
  switchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#111111",
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: "#1f1f1f",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  switchInfo: {
    flex: 1,
    marginRight: 16,
  },
  switchLabelContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 4,
  },
  switchLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: "#ffffff",
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    alignSelf: "flex-start",
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "600",
    color: "#ffffff",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  switchDescription: {
    fontSize: 13,
    color: "#71717a",
    lineHeight: 18,
  },
  switchContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  footer: {
    marginTop: 24,
    alignItems: "center",
    paddingVertical: 20,
    backgroundColor: "#111111",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#1f1f1f",
  },
  footerContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  footerText: {
    fontSize: 14,
    color: "#71717a",
    fontWeight: "500",
  },
});
