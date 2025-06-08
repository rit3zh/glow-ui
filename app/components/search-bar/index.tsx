import React from "react";
import {
  ScrollView,
  SafeAreaView,
  Text,
  View,
  StyleSheet,
  Dimensions,
} from "react-native";
import { Row, SearchBar } from "@/components";
import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { SymbolView } from "expo-symbols";

const SearchBarDemo = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        scrollEnabled
      >
        <View style={styles.header}>
          <Row style={{ alignItems: "center" }} spacing={10}>
            <Feather name="search" size={32} color="#fafafa" />
            <Text style={styles.title}>Search</Text>
          </Row>
          <Text style={styles.description}>
            A search component for filtering and finding content.
          </Text>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Feather name="zap" size={18} color="#ed811c" />
            <Text style={styles.sectionTitle}>Default</Text>
          </View>
          <View style={styles.example}>
            <SearchBar
              placeholder="Search files..."
              iconCenterOffset={2.9}
              textCenterOffset={2.65}
            />
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="options" size={18} color="#31d3f7" />
            <Text style={styles.sectionTitle}>With placeholder variations</Text>
          </View>
          <View style={styles.exampleGroup}>
            <View style={styles.example}>
              <SearchBar
                placeholder="Search files..."
                tint="white"
                iconCenterOffset={2.9}
                textCenterOffset={2.65}
                onSearchMount={() => console.log("Files search")}
                renderLeadingIcons={() => (
                  <SymbolView
                    name="book.pages.fill"
                    size={24}
                    tintColor={"gray"}
                    resizeMode="scaleAspectFit"
                  />
                )}
              />
            </View>
            <View style={styles.example}>
              <SearchBar
                placeholder="Search users..."
                tint="#ed811c"
                iconCenterOffset={2.9}
                textCenterOffset={2.65}
                renderTrailingIcons={() => (
                  <SymbolView
                    name="xmark.bin.fill"
                    size={20}
                    tintColor={"gray"}
                    resizeMode="scaleAspectFit"
                  />
                )}
                onSearchMount={() => console.log("Users search")}
                renderLeadingIcons={() => (
                  <SymbolView
                    name="person.fill"
                    size={24}
                    tintColor={"gray"}
                    resizeMode="scaleAspectFit"
                  />
                )}
              />
            </View>
            <View style={styles.example}>
              <SearchBar
                placeholder="Type to search..."
                tint="#31d3f7"
                iconCenterOffset={2.9}
                textCenterOffset={2.65}
                renderLeadingIcons={() => (
                  <SymbolView
                    name="mail.stack.fill"
                    size={24}
                    tintColor={"gray"}
                    resizeMode="scaleAspectFit"
                  />
                )}
                onSearchMount={() => console.log("Generic search")}
              />
            </View>
          </View>
        </View>

        <View style={styles.usage}>
          <View style={styles.sectionHeader}>
            <MaterialCommunityIcons
              name="book-outline"
              size={18}
              color="#a1a1aa"
            />
            <Text style={styles.usageTitle}>Usage</Text>
          </View>
          <Text style={styles.usageText}>
            Import and use the SearchBar component with customizable placeholder
            text and search handlers.
          </Text>
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
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 24,
    paddingVertical: 32,
    gap: 32,
  },
  header: {
    gap: 8,
    alignItems: "flex-start",
  },
  title: {
    fontSize: 32,
    fontWeight: "600",
    color: "#fafafa",
    letterSpacing: -0.5,
  },
  description: {
    fontSize: 16,
    color: "#a1a1aa",
    lineHeight: 24,
  },
  section: {
    gap: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "500",
    color: "#fafafa",
  },
  example: {
    padding: 20,
    backgroundColor: "#18181b",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#27272a",
  },
  exampleGroup: {
    gap: 16,
  },
  usage: {
    padding: 20,
    backgroundColor: "#18181b",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#27272a",
    gap: 8,
  },
  usageTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#fafafa",
  },
  usageText: {
    fontSize: 14,
    color: "#a1a1aa",
    lineHeight: 20,
    paddingLeft: 26,
  },
});

export default SearchBarDemo;
