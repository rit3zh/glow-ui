import React, { useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  Alert,
} from "react-native";
import { AnimatedSwitch } from "@/components/base/switch/AnimatedSwitch";
import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons"; // Assuming Expo is used

export function App() {
  // Basic switch state
  const [isEnabled, setIsEnabled] = useState(false);

  // Additional switch states for examples
  const [customColorEnabled, setCustomColorEnabled] = useState(true);
  const [largeEnabled, setLargeEnabled] = useState(false);
  const [smallEnabled, setSmallEnabled] = useState(true);
  const [customSpringEnabled, setCustomSpringEnabled] = useState(false);

  // Animation types
  const [fadeAnimEnabled, setFadeAnimEnabled] = useState(true);
  const [rotateAnimEnabled, setRotateAnimEnabled] = useState(false);
  const [scaleAnimEnabled, setScaleAnimEnabled] = useState(true);
  const [bounceAnimEnabled, setBounceAnimEnabled] = useState(false);

  // New icon switches
  const [iconSwitchEnabled, setIconSwitchEnabled] = useState(false);
  const [bgImageEnabled, setBgImageEnabled] = useState(true);
  const [animatedIconsEnabled, setAnimatedIconsEnabled] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Animated Switch Examples</Text>

        {/* Default Switch */}
        <View style={styles.exampleContainer}>
          <Text style={styles.exampleTitle}>Default Switch</Text>
          <View style={styles.switchRow}>
            <Text style={styles.label}>Toggle me</Text>
            <AnimatedSwitch
              value={isEnabled}
              onValueChange={setIsEnabled}
              testID="default-switch"
            />
          </View>
          <Text style={styles.stateText}>
            Switch is {isEnabled ? "ON" : "OFF"}
          </Text>
        </View>

        {/* Custom Colors */}
        <View style={styles.exampleContainer}>
          <Text style={styles.exampleTitle}>Custom Colors</Text>
          <View style={styles.switchRow}>
            <Text style={styles.label}>Purple theme</Text>
            <AnimatedSwitch
              value={customColorEnabled}
              onValueChange={setCustomColorEnabled}
              onColor="#8A2BE2"
              offColor="#D1C4E9"
              thumbColor="#F8F8F8"
            />
          </View>
        </View>

        {/* Size Variations */}
        <View style={styles.exampleContainer}>
          <Text style={styles.exampleTitle}>Size Variations</Text>

          <View style={styles.switchRow}>
            <Text style={styles.label}>Large switch</Text>
            <AnimatedSwitch
              value={largeEnabled}
              onValueChange={setLargeEnabled}
              width={80}
              height={44}
              thumbInset={4}
            />
          </View>

          <View style={styles.switchRow}>
            <Text style={styles.label}>Small switch</Text>
            <AnimatedSwitch
              value={smallEnabled}
              onValueChange={setSmallEnabled}
              width={40}
              height={24}
              thumbInset={2}
            />
          </View>
        </View>

        {/* Icon Switch */}
        <View style={styles.exampleContainer}>
          <Text style={styles.exampleTitle}>Icons in Switch</Text>
          <View style={styles.switchRow}>
            <Text style={styles.label}>Light/Dark toggle</Text>
            <AnimatedSwitch
              value={iconSwitchEnabled}
              onValueChange={(value) => {
                setIconSwitchEnabled(value);
                // You could also change your app's theme here
                // Alert.alert(
                //   value ? "Light Mode Activated" : "Dark Mode Activated"
                // );
              }}
              iconAnimationType="bounce"
              width={64}
              height={36}
              onColor="#4A69FF"
              offColor="#30344D"
              thumbColor={iconSwitchEnabled ? "#FFD700" : "#FFFFFF"}
              thumbOnIcon={<Feather name="sun" size={16} color="#adadad" />}
              thumbOffIcon={<Feather name="moon" size={16} color="#30344D" />}
              trackOnIcon={<Ionicons name="cloud" size={16} color="white" />}
              trackOffIcon={
                <Ionicons
                  name="star"
                  size={12}
                  color="#FFFFFF"
                  style={{ opacity: 0.7 }}
                />
              }
            />
          </View>
        </View>

        {/* Background Image */}
        <View style={styles.exampleContainer}>
          <Text style={styles.exampleTitle}>Background Image</Text>
          <View style={styles.switchRow}>
            <Text style={styles.label}>Gradient Background</Text>
            <AnimatedSwitch
              value={bgImageEnabled}
              onValueChange={setBgImageEnabled}
              width={70}
              height={38}
              thumbColor="#FFFFFF"
              onColor="transparent"
              offColor="transparent"
              backgroundImage={
                bgImageEnabled
                  ? {
                      uri: "https://t3.ftcdn.net/jpg/03/22/30/46/360_F_322304683_7ysRarFkmy2osfPKTOYQv7qTPofKelfb.jpg",
                    }
                  : {
                      uri: "https://plus.unsplash.com/premium_photo-1672201106204-58e9af7a2888?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Z3JhZGllbnQlMjBiYWNrZ3JvdW5kfGVufDB8fDB8fHww",
                    }
              } // Replace with your actual image path
            />
          </View>
        </View>

        {/* Animation Types */}
        <View style={styles.exampleContainer}>
          <Text style={styles.exampleTitle}>Icon Animation Types</Text>

          <View style={styles.switchRow}>
            <Text style={styles.label}>Fade Animation</Text>
            <AnimatedSwitch
              value={fadeAnimEnabled}
              onValueChange={setFadeAnimEnabled}
              width={64}
              height={36}
              onColor="#4CD964"
              thumbColor="#FFFFFF"
              iconAnimationType="fade"
              thumbOnIcon={
                <MaterialCommunityIcons
                  name="check"
                  size={20}
                  color="#4CD964"
                />
              }
              thumbOffIcon={
                <MaterialCommunityIcons
                  name="close"
                  size={20}
                  color="#FF3B30"
                />
              }
            />
          </View>

          <View style={styles.switchRow}>
            <Text style={styles.label}>Rotate Animation</Text>
            <AnimatedSwitch
              value={rotateAnimEnabled}
              onValueChange={setRotateAnimEnabled}
              width={64}
              height={36}
              onColor="#FF9500"
              thumbColor="#FFFFFF"
              iconAnimationType="rotate"
              thumbOnIcon={
                <MaterialCommunityIcons
                  name="reload"
                  size={20}
                  color="#FF9500"
                />
              }
              thumbOffIcon={
                <Ionicons name="arrow-back" size={20} color="#8E8E93" />
              }
            />
          </View>

          <View style={styles.switchRow}>
            <Text style={styles.label}>Scale Animation</Text>
            <AnimatedSwitch
              value={scaleAnimEnabled}
              onValueChange={setScaleAnimEnabled}
              width={64}
              height={36}
              onColor="#5856D6"
              thumbColor="#FFFFFF"
              iconAnimationType="scale"
              thumbOnIcon={
                <MaterialCommunityIcons
                  name="heart"
                  size={20}
                  color="#FF2D55"
                />
              }
              thumbOffIcon={
                <MaterialCommunityIcons
                  name="heart-outline"
                  size={20}
                  color="#8E8E93"
                />
              }
            />
          </View>

          <View style={styles.switchRow}>
            <Text style={styles.label}>Bounce Animation</Text>
            <AnimatedSwitch
              value={bounceAnimEnabled}
              onValueChange={setBounceAnimEnabled}
              width={64}
              height={36}
              onColor="#007AFF"
              thumbColor="#FFFFFF"
              iconAnimationType="bounce"
              thumbOnIcon={
                <Feather name="thumbs-up" size={20} color="#007AFF" />
              }
              thumbOffIcon={
                <Feather name="thumbs-down" size={20} color="#8E8E93" />
              }
            />
          </View>
        </View>

        {/* Custom Animation */}
        <View style={styles.exampleContainer}>
          <Text style={styles.exampleTitle}>Custom Animation</Text>
          <View style={styles.switchRow}>
            <Text style={styles.label}>Bouncy switch</Text>
            <AnimatedSwitch
              value={customSpringEnabled}
              onValueChange={setCustomSpringEnabled}
              springConfig={{
                damping: 8,
                stiffness: 100,
                mass: 1.2,
              }}
              onColor="#FF8C00"
            />
          </View>
        </View>

        {/* Disabled State */}
        <View style={styles.exampleContainer}>
          <Text style={styles.exampleTitle}>Disabled State</Text>
          <View style={styles.switchRow}>
            <Text style={styles.label}>Cannot toggle</Text>
            <AnimatedSwitch
              value={true}
              onValueChange={() => {}}
              disabled={true}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F7",
  },
  scrollContainer: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 24,
    textAlign: "center",
  },
  exampleContainer: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  exampleTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
    color: "#333",
  },
  switchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  label: {
    fontSize: 16,
    color: "#333",
  },
  stateText: {
    marginTop: 8,
    fontSize: 14,
    color: "#666",
    fontStyle: "italic",
  },
});
