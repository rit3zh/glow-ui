import { View, Text, StyleSheet, ScrollView, Alert } from "react-native";
import React, { useState } from "react";
import {
  MaterialIcons,
  Feather,
  Ionicons,
  AntDesign,
  FontAwesome5,
} from "@expo/vector-icons";
import { Touchable } from "@/components/index";

const TouchableDemo = () => {
  const [likeCount, setLikeCount] = useState(42);
  const [isLiked, setIsLiked] = useState(false);
  const [selectedCard, setSelectedCard] = useState<number | string>();

  const handlePress = (action: string) => {
    console.log(`${action} pressed`);
    Alert.alert("Action", `${action} was pressed!`);
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1));
  };

  const handleCardSelect = (cardId: number | string) => {
    const _isSelectedCard = selectedCard === cardId ? null : cardId!;
    setSelectedCard(_isSelectedCard!);
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      scrollEnabled={true}
      showsVerticalScrollIndicator={false}
      contentInsetAdjustmentBehavior="always"
    >
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <MaterialIcons name="gesture" size={32} color="#60a5fa" />
        </View>
        <Text style={styles.title}>Touchable Demo</Text>
        <Text style={styles.subtitle}>
          Beautiful scale animations with smooth interactions
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Scale Variations</Text>

        <View style={styles.scaleGrid}>
          <Touchable
            scaleTo={0.95}
            onPress={() => handlePress("Light Scale (0.95)")}
            style={styles.scaleButton}
          >
            <View style={styles.scaleButtonContent}>
              <Feather name="feather" size={20} color="#10b981" />
              <Text style={styles.scaleButtonText}>Light</Text>
              <Text style={styles.scaleButtonSubtext}>0.95</Text>
            </View>
          </Touchable>

          <Touchable
            scaleTo={0.9}
            onPress={() => handlePress("Medium Scale (0.9)")}
            style={styles.scaleButton}
          >
            <View style={styles.scaleButtonContent}>
              <Feather name="zap" size={20} color="#f59e0b" />
              <Text style={styles.scaleButtonText}>Medium</Text>
              <Text style={styles.scaleButtonSubtext}>0.9</Text>
            </View>
          </Touchable>

          <Touchable
            scaleTo={0.85}
            onPress={() => handlePress("Strong Scale (0.85)")}
            style={styles.scaleButton}
          >
            <View style={styles.scaleButtonContent}>
              <Feather name="zap-off" size={20} color="#ef4444" />
              <Text style={styles.scaleButtonText}>Strong</Text>
              <Text style={styles.scaleButtonSubtext}>0.85</Text>
            </View>
          </Touchable>

          <Touchable
            scaleTo={0.8}
            onPress={() => handlePress("Heavy Scale (0.8)")}
            style={styles.scaleButton}
          >
            <View style={styles.scaleButtonContent}>
              <MaterialIcons name="fitness-center" size={20} color="#8b5cf6" />
              <Text style={styles.scaleButtonText}>Heavy</Text>
              <Text style={styles.scaleButtonSubtext}>0.8</Text>
            </View>
          </Touchable>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Interactive Cards</Text>

        <Touchable
          scaleTo={0.98}
          onPress={() => handleCardSelect("profile")}
          style={[
            styles.interactiveCard,
            selectedCard === "profile" && styles.selectedCard,
          ]}
        >
          <View style={styles.cardContent}>
            <View style={styles.cardIconContainer}>
              <Feather name="user" size={24} color="#60a5fa" />
            </View>
            <View style={styles.cardTextContent}>
              <Text style={styles.cardTitle}>Profile Settings</Text>
              <Text style={styles.cardDescription}>
                Manage your personal information and preferences
              </Text>
              <View style={styles.cardTags}>
                <View style={styles.tag}>
                  <Text style={styles.tagText}>Personal</Text>
                </View>
                <View style={styles.tag}>
                  <Text style={styles.tagText}>Settings</Text>
                </View>
              </View>
            </View>
            <View style={styles.cardArrow}>
              <MaterialIcons
                name={
                  selectedCard === "profile"
                    ? "keyboard-arrow-down"
                    : "keyboard-arrow-right"
                }
                size={20}
                color="#71717a"
              />
            </View>
          </View>
        </Touchable>

        <Touchable
          scaleTo={0.98}
          onPress={() => handleCardSelect("security")}
          style={[
            styles.interactiveCard,
            selectedCard === "security" && styles.selectedCard,
          ]}
        >
          <View style={styles.cardContent}>
            <View style={styles.cardIconContainer}>
              <Feather name="shield" size={24} color="#10b981" />
            </View>
            <View style={styles.cardTextContent}>
              <Text style={styles.cardTitle}>Security & Privacy</Text>
              <Text style={styles.cardDescription}>
                Control your security settings and privacy options
              </Text>
              <View style={styles.cardTags}>
                <View style={styles.tag}>
                  <Text style={styles.tagText}>Security</Text>
                </View>
                <View style={styles.tag}>
                  <Text style={styles.tagText}>Privacy</Text>
                </View>
              </View>
            </View>
            <View style={styles.cardArrow}>
              <MaterialIcons
                name={
                  selectedCard === "security"
                    ? "keyboard-arrow-down"
                    : "keyboard-arrow-right"
                }
                size={20}
                color="#71717a"
              />
            </View>
          </View>
        </Touchable>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Action Buttons</Text>

        <View style={styles.actionButtonRow}>
          <Touchable
            scaleTo={0.92}
            onPress={() => handlePress("Save Changes")}
            style={styles.primaryActionButton}
          >
            <View style={styles.actionButtonContent}>
              <Feather name="check" size={18} color="#fafafa" />
              <Text style={styles.primaryActionText}>Save</Text>
            </View>
          </Touchable>

          <Touchable
            scaleTo={0.92}
            onPress={() => handlePress("Cancel")}
            style={styles.secondaryActionButton}
          >
            <View style={styles.actionButtonContent}>
              <Feather name="x" size={18} color="#a1a1aa" />
              <Text style={styles.secondaryActionText}>Cancel</Text>
            </View>
          </Touchable>
        </View>

        <Touchable
          scaleTo={0.95}
          onPress={() => handlePress("Reset to Defaults")}
          style={styles.dangerActionButton}
        >
          <View style={styles.actionButtonContent}>
            <MaterialIcons name="restore" size={18} color="#ef4444" />
            <Text style={styles.dangerActionText}>Reset to Defaults</Text>
          </View>
        </Touchable>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Social Interactions</Text>

        <View style={styles.socialCard}>
          <View style={styles.socialHeader}>
            <View style={styles.avatarContainer}>
              <FontAwesome5 name="user-circle" size={40} color="#60a5fa" />
            </View>
            <View style={styles.socialUserInfo}>
              <Text style={styles.socialUsername}>@designpro</Text>
              <Text style={styles.socialTime}>2 minutes ago</Text>
            </View>
          </View>

          <Text style={styles.socialContent}>
            Just shipped a new feature with amazing scale animations! The user
            feedback has been incredible 🚀
          </Text>

          <View style={styles.socialActions}>
            <Touchable
              scaleTo={0.9}
              onPress={handleLike}
              style={styles.socialAction}
            >
              <View style={styles.socialActionContent}>
                <AntDesign
                  name={isLiked ? "heart" : "hearto"}
                  size={16}
                  color={isLiked ? "#ef4444" : "#71717a"}
                />
                <Text
                  style={[
                    styles.socialActionText,
                    isLiked && styles.socialActionTextActive,
                  ]}
                >
                  {likeCount}
                </Text>
              </View>
            </Touchable>

            <Touchable
              scaleTo={0.9}
              onPress={() => handlePress("Comment")}
              style={styles.socialAction}
            >
              <View style={styles.socialActionContent}>
                <Feather name="message-circle" size={16} color="#71717a" />
                <Text style={styles.socialActionText}>12</Text>
              </View>
            </Touchable>

            <Touchable
              scaleTo={0.9}
              onPress={() => handlePress("Share")}
              style={styles.socialAction}
            >
              <View style={styles.socialActionContent}>
                <Feather name="share" size={16} color="#71717a" />
                <Text style={styles.socialActionText}>Share</Text>
              </View>
            </Touchable>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Disabled State</Text>

        <Touchable
          scaleTo={0.95}
          disabled={true}
          onPress={() => handlePress("This won't work")}
          style={styles.disabledButton}
        >
          <View style={styles.disabledButtonContent}>
            <Feather name="lock" size={18} color="#52525b" />
            <Text style={styles.disabledButtonText}>Disabled Button</Text>
          </View>
        </Touchable>
      </View>

      <View style={styles.footer}>
        <View style={styles.footerIcon}>
          <Feather name="info" size={16} color="#71717a" />
        </View>
        <Text style={styles.footerText}>
          Notice how each button scales smoothly when pressed, creating a
          natural feedback experience
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
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#e4e4e7",
    marginBottom: 16,
    marginLeft: 4,
  },
  scaleGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  scaleButton: {
    flex: 1,
    minWidth: "47%",
    backgroundColor: "#18181b",
    borderWidth: 1,
    borderColor: "#27272a",
    borderRadius: 12,
    padding: 16,
  },
  scaleButtonContent: {
    alignItems: "center",
    gap: 8,
  },
  scaleButtonText: {
    color: "#fafafa",
    fontSize: 16,
    fontWeight: "600",
  },
  scaleButtonSubtext: {
    color: "#a1a1aa",
    fontSize: 12,
  },
  interactiveCard: {
    backgroundColor: "#18181b",
    borderWidth: 1,
    borderColor: "#27272a",
    borderRadius: 12,
    marginBottom: 12,
  },
  selectedCard: {
    borderColor: "#60a5fa",
    backgroundColor: "#1e293b",
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: 16,
  },
  cardIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#09090b",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  cardTextContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fafafa",
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 14,
    color: "#a1a1aa",
    lineHeight: 20,
    marginBottom: 8,
  },
  cardTags: {
    flexDirection: "row",
    gap: 8,
  },
  tag: {
    backgroundColor: "#09090b",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#27272a",
  },
  tagText: {
    fontSize: 12,
    color: "#a1a1aa",
  },
  cardArrow: {
    marginLeft: 8,
    justifyContent: "center",
  },
  actionButtonRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 12,
  },
  primaryActionButton: {
    flex: 1,
    backgroundColor: "#2563eb",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  secondaryActionButton: {
    flex: 1,
    backgroundColor: "#18181b",
    borderWidth: 1,
    borderColor: "#27272a",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  dangerActionButton: {
    backgroundColor: "#18181b",
    borderWidth: 1,
    borderColor: "#ef4444",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  actionButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  primaryActionText: {
    color: "#fafafa",
    fontSize: 16,
    fontWeight: "600",
  },
  secondaryActionText: {
    color: "#a1a1aa",
    fontSize: 16,
    fontWeight: "600",
  },
  dangerActionText: {
    color: "#ef4444",
    fontSize: 16,
    fontWeight: "600",
  },
  socialCard: {
    backgroundColor: "#18181b",
    borderWidth: 1,
    borderColor: "#27272a",
    borderRadius: 12,
    padding: 16,
  },
  socialHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  avatarContainer: {
    marginRight: 12,
  },
  socialUserInfo: {
    flex: 1,
  },
  socialUsername: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fafafa",
  },
  socialTime: {
    fontSize: 14,
    color: "#a1a1aa",
  },
  socialContent: {
    fontSize: 16,
    color: "#e4e4e7",
    lineHeight: 24,
    marginBottom: 16,
  },
  socialActions: {
    flexDirection: "row",
    gap: 24,
  },
  socialAction: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  socialActionContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  socialActionText: {
    fontSize: 14,
    color: "#71717a",
    fontWeight: "500",
  },
  socialActionTextActive: {
    color: "#ef4444",
  },
  disabledButton: {
    backgroundColor: "#18181b",
    borderWidth: 1,
    borderColor: "#27272a",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    opacity: 0.5,
  },
  disabledButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  disabledButtonText: {
    color: "#52525b",
    fontSize: 16,
    fontWeight: "600",
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

export default TouchableDemo;
