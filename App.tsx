// @github crisanne
// data
import { CustomScrollView } from "@/components/templates/index";
import { SpinnerRefreshIndicator } from "@/components/templates/scroll-view/resource/spinner/SpinnerRefreshIndicator";
import { useRef, useState } from "react";
import {
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const generateItems = (count: number) => {
  return Array.from({ length: count }, (_, i) => ({
    id: `item-${i}`,
    title: `Item ${i + 1}`,
    description: `This is the description for item ${i + 1}`,
  }));
};

export function App() {
  const [items, setItems] = useState(generateItems(20));
  const [refresherType, setRefresherType] = useState("default");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [options, setOptions] = useState({
    refreshTriggerDistance: 80,
    maxPullDistance: 120,
    useSpringAnimation: true,
    showScrollIndicator: false,
    pullResistanceFactor: 1,
    enableHapticFeedback: true,
    scrollToTopAfterRefresh: true,
  });

  const handleRefresh = async () => {
    console.log("scroll");
    // Simulate fetch
    await new Promise((r) => setTimeout(r, 5000));
  };
  const scrollViewRef = useRef(null);
  const updateOption = (name: string, value: any) => {
    setOptions((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Programmatically trigger refresh
  const triggerRefreshProgrammatically = () => {
    scrollViewRef.current?.triggerRefresh!();
  };

  return (
    <View style={styles.container}>
      {/* Options Panel */}
      <View style={styles.optionsPanel}>
        <Text style={styles.panelTitle}>ScrollView Options</Text>

        <View style={styles.row}>
          <Text style={styles.optionLabel}>Refresh Indicator:</Text>
          <View style={styles.buttonGroup}>
            {[
              "default",
              "spinner",
              "material",
              "character",
              "dots",
              "arrow",
            ].map((type) => (
              <TouchableOpacity
                key={type}
                style={[
                  styles.optionButton,
                  refresherType === type && styles.activeButton,
                ]}
                onPress={() => setRefresherType(type)}
              >
                <Text
                  style={[
                    styles.buttonText,
                    refresherType === type && styles.activeButtonText,
                  ]}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.row}>
          <Text style={styles.optionLabel}>Animation:</Text>
          <View style={styles.buttonGroup}>
            <TouchableOpacity
              style={[
                styles.optionButton,
                options.useSpringAnimation && styles.activeButton,
              ]}
              onPress={() => updateOption("useSpringAnimation", true)}
            >
              <Text
                style={[
                  styles.buttonText,
                  options.useSpringAnimation && styles.activeButtonText,
                ]}
              >
                Spring
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.optionButton,
                !options.useSpringAnimation && styles.activeButton,
              ]}
              onPress={() => updateOption("useSpringAnimation", false)}
            >
              <Text
                style={[
                  styles.buttonText,
                  !options.useSpringAnimation && styles.activeButtonText,
                ]}
              >
                Timing
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.row}>
          <Text style={styles.optionLabel}>Scroll Indicator:</Text>
          <View style={styles.buttonGroup}>
            <TouchableOpacity
              style={[
                styles.optionButton,
                options.showScrollIndicator && styles.activeButton,
              ]}
              onPress={() => updateOption("showScrollIndicator", true)}
            >
              <Text
                style={[
                  styles.buttonText,
                  options.showScrollIndicator && styles.activeButtonText,
                ]}
              >
                Show
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.optionButton,
                !options.showScrollIndicator && styles.activeButton,
              ]}
              onPress={() => updateOption("showScrollIndicator", false)}
            >
              <Text
                style={[
                  styles.buttonText,
                  !options.showScrollIndicator && styles.activeButtonText,
                ]}
              >
                Hide
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.row}>
          <Text style={styles.optionLabel}>Pull Resistance:</Text>
          <View style={styles.buttonGroup}>
            {[0.5, 1, 1.5, 2].map((factor) => (
              <TouchableOpacity
                key={factor}
                style={[
                  styles.optionButton,
                  options.pullResistanceFactor === factor &&
                    styles.activeButton,
                ]}
                onPress={() => updateOption("pullResistanceFactor", factor)}
              >
                <Text
                  style={[
                    styles.buttonText,
                    options.pullResistanceFactor === factor &&
                      styles.activeButtonText,
                  ]}
                >
                  {factor}x
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <TouchableOpacity
          style={styles.triggerButton}
          onPress={triggerRefreshProgrammatically}
        >
          <Text style={styles.triggerButtonText}>
            Trigger Refresh Programmatically
          </Text>
        </TouchableOpacity>
      </View>

      {/* The CustomScrollView */}
      <CustomScrollView
        innerRef={scrollViewRef}
        style={styles.scrollView}
        onRefresh={handleRefresh}
        minIndicatorDisplayTime={5000}
        // RefreshComponent={SpinnerRefreshIndicator}
        refreshTriggerDistance={options.refreshTriggerDistance}
        maxPullDistance={options.maxPullDistance}
        useSpringAnimation={options.useSpringAnimation}
        showScrollIndicator={options.showScrollIndicator}
        scrollIndicatorColor="red"
        pullResistanceFactor={options.pullResistanceFactor}
        enableHapticFeedback={options.enableHapticFeedback}
        scrollToTopAfterRefresh={options.scrollToTopAfterRefresh}
        onRefreshStateChange={(refreshing) => setIsRefreshing(refreshing)}
        contentWrapperStyle={styles.contentWrapper}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Custom ScrollView Demo</Text>
          <Text style={styles.headerSubtitle}>
            {isRefreshing ? "Refreshing..." : "Pull down to refresh"}
          </Text>
        </View>

        {items.map((item) => (
          <View key={item.id} style={styles.item}>
            <Text style={styles.itemTitle}>{item.title}</Text>
            <Text style={styles.itemDescription}>{item.description}</Text>
          </View>
        ))}

        <View style={styles.footer}>
          <Text style={styles.footerText}>End of content</Text>
        </View>
      </CustomScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: "center",
    // alignItems: "center",
    backgroundColor: "#1a1a1a",
  },
  scrollView: {
    flex: 1,
  },
  contentWrapper: {
    padding: 16,
  },
  optionsPanel: {
    padding: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  panelTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  optionLabel: {
    fontSize: 14,
    color: "#666",
    width: "30%",
  },
  buttonGroup: {
    flexDirection: "row",
    flexWrap: "wrap",
    width: "70%",
  },
  optionButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: "#f0f0f0",
    borderRadius: 4,
    marginRight: 6,
    marginBottom: 6,
  },
  activeButton: {
    backgroundColor: "#3b82f6",
  },
  buttonText: {
    fontSize: 12,
    color: "#666",
  },
  activeButtonText: {
    color: "#fff",
  },
  triggerButton: {
    backgroundColor: "#3b82f6",
    padding: 10,
    borderRadius: 4,
    alignItems: "center",
    marginTop: 10,
  },
  triggerButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  header: {
    marginBottom: 20,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  item: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  itemDescription: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  footer: {
    padding: 16,
    alignItems: "center",
    marginTop: 10,
  },
  footerText: {
    fontSize: 14,
    color: "#999",
  },
});
