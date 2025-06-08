import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import React, { useState } from "react";
import {
  Center,
  ListItemLeadingIcon,
  ListItemSubTitle,
  ListItemTitle,
  ListItemTitleView,
  ListItemTrailingIcon,
  ListItemWrapper,
  Row,
} from "@/components";
import {
  Feather,
  MaterialIcons,
  Ionicons,
  MaterialCommunityIcons,
  AntDesign,
} from "@expo/vector-icons";

interface ListItem {
  id: string;
  title: string;
  subtitle?: string;
  leadingIcon: React.ReactNode;
  trailingIcon?: React.ReactNode;
  onPress?: () => void;
  type?: "default" | "danger" | "success" | "warning";
  badge?: string | number;
  isActive?: boolean;
}

const ListDemo = () => {
  const [activeItem, setActiveItem] = useState<string | null>(null);

  const profileItems: ListItem[] = [
    {
      id: "profile",
      title: "Profile",
      subtitle: "Manage your personal information",
      leadingIcon: <Feather name="user" size={20} color="#E5E7EB" />,
      trailingIcon: <Feather name="chevron-right" size={20} color="#6B7280" />,
      onPress: () => setActiveItem("profile"),
    },
    {
      id: "notifications",
      title: "Notifications",
      subtitle: "Push notifications, email alerts",
      leadingIcon: (
        <Ionicons name="notifications-outline" size={20} color="#E5E7EB" />
      ),
      trailingIcon: <Feather name="chevron-right" size={20} color="#6B7280" />,
      badge: "3",
      onPress: () => setActiveItem("notifications"),
    },
    {
      id: "privacy",
      title: "Privacy & Security",
      subtitle: "Data protection and security settings",
      leadingIcon: <MaterialIcons name="security" size={20} color="#E5E7EB" />,
      trailingIcon: <Feather name="chevron-right" size={20} color="#6B7280" />,
      onPress: () => setActiveItem("privacy"),
    },
  ];

  const appItems: ListItem[] = [
    {
      id: "theme",
      title: "Appearance",
      subtitle: "Dark mode, themes, display settings",
      leadingIcon: <Feather name="moon" size={20} color="#8B5CF6" />,
      trailingIcon: <Text style={styles.trailingText}>Dark</Text>,
      onPress: () => setActiveItem("theme"),
    },
    {
      id: "language",
      title: "Language",
      subtitle: "App language and region",
      leadingIcon: (
        <Ionicons name="language-outline" size={20} color="#06B6D4" />
      ),
      trailingIcon: <Text style={styles.trailingText}>English</Text>,
      onPress: () => setActiveItem("language"),
    },
    {
      id: "storage",
      title: "Storage",
      subtitle: "Manage app data and cache",
      leadingIcon: <Feather name="hard-drive" size={20} color="#10B981" />,
      trailingIcon: <Text style={styles.trailingText}>2.4 GB</Text>,
      onPress: () => setActiveItem("storage"),
    },
  ];
  const activityItems: ListItem[] = [
    {
      id: "login",
      title: "Login Activity",
      subtitle: "Signed in from iPhone • 2 hours ago",
      leadingIcon: (
        <MaterialCommunityIcons name="login" size={20} color="#10B981" />
      ),
      type: "success",
      onPress: () => setActiveItem("login"),
    },
    {
      id: "backup",
      title: "Backup Completed",
      subtitle: "All data backed up successfully • 1 day ago",
      leadingIcon: <MaterialIcons name="backup" size={20} color="#3B82F6" />,
      onPress: () => setActiveItem("backup"),
    },
    {
      id: "warning",
      title: "Storage Almost Full",
      subtitle: "91% of storage used • 3 days ago",
      leadingIcon: <Feather name="alert-triangle" size={20} color="#F59E0B" />,
      type: "warning",
      onPress: () => setActiveItem("warning"),
    },
    {
      id: "error",
      title: "Sync Failed",
      subtitle: "Unable to sync data • 5 days ago",
      leadingIcon: (
        <MaterialIcons name="sync-problem" size={20} color="#EF4444" />
      ),
      type: "danger",
      onPress: () => setActiveItem("error"),
    },
  ];

  const supportItems: ListItem[] = [
    {
      id: "help",
      title: "Help Center",
      subtitle: "FAQs, guides, and tutorials",
      leadingIcon: <Feather name="help-circle" size={20} color="#E5E7EB" />,
      trailingIcon: <Feather name="external-link" size={18} color="#6B7280" />,
      onPress: () => setActiveItem("help"),
    },
    {
      id: "contact",
      title: "Contact Support",
      subtitle: "Get help from our support team",
      leadingIcon: <Feather name="message-circle" size={20} color="#E5E7EB" />,
      trailingIcon: <Feather name="chevron-right" size={20} color="#6B7280" />,
      onPress: () => setActiveItem("contact"),
    },
    {
      id: "feedback",
      title: "Send Feedback",
      subtitle: "Help us improve the app",
      leadingIcon: <MaterialIcons name="feedback" size={20} color="#E5E7EB" />,
      trailingIcon: <Feather name="chevron-right" size={20} color="#6B7280" />,
      onPress: () => setActiveItem("feedback"),
    },
  ];

  const dangerItems: ListItem[] = [
    {
      id: "logout",
      title: "Sign Out",
      subtitle: "Sign out of your account",
      leadingIcon: (
        <MaterialCommunityIcons name="logout" size={20} color="#EF4444" />
      ),
      type: "danger",
      onPress: () => setActiveItem("logout"),
    },
    {
      id: "delete",
      title: "Delete Account",
      subtitle: "Permanently delete your account",
      leadingIcon: <AntDesign name="deleteuser" size={20} color="#EF4444" />,
      type: "danger",
      onPress: () => setActiveItem("delete"),
    },
  ];

  const renderListItem = ({ item }: { item: ListItem }) => (
    <TouchableOpacity
      onPress={item.onPress}
      style={[activeItem === item.id && styles.activeListItem]}
      activeOpacity={0.7}
    >
      <ListItemWrapper>
        <ListItemLeadingIcon>
          <View className="ml-4">{item.leadingIcon}</View>
        </ListItemLeadingIcon>
        <ListItemTitleView>
          <ListItemTitle
            destructive={item.type === "danger"}
            style={{ marginLeft: 0 }}
          >
            {item.title}
          </ListItemTitle>
          <ListItemSubTitle>{item.subtitle}</ListItemSubTitle>
        </ListItemTitleView>
        <ListItemTrailingIcon>
          {item.trailingIcon && (
            <View style={styles.trailingIconContainer}>
              {item.trailingIcon}
            </View>
          )}
        </ListItemTrailingIcon>
      </ListItemWrapper>
    </TouchableOpacity>
  );

  const renderSection = (
    title: string,
    data: ListItem[],
    keyPrefix: string,
  ) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.listContainer}>
        <FlatList
          data={data}
          renderItem={renderListItem}
          keyExtractor={(item) => `${keyPrefix}-${item.id}`}
          scrollEnabled={false}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          contentContainerStyle={styles.flatListContent}
        />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContentContainer}
          showsVerticalScrollIndicator={false}
          scrollEnabled
          contentInsetAdjustmentBehavior="automatic"
        >
          <View style={styles.header}>
            <View className="flex-row gap-4 items-center">
              <Ionicons name="settings-sharp" color={"white"} size={30} />
              <Text style={styles.title}>Settings</Text>
            </View>
            <Text style={styles.subtitle}>
              Manage your account and app preferences
            </Text>
          </View>

          {renderSection("Account", profileItems, "profile")}
          {renderSection("Preferences", appItems, "app")}
          {renderSection("Recent Activity", activityItems, "activity")}
          {renderSection("Support", supportItems, "support")}
          {renderSection("Account Actions", dangerItems, "danger")}

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              App Version 1.2.3 • Last updated 2 days ago
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0D1117",
  },
  safeArea: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContentContainer: {
    flexGrow: 1,
    paddingHorizontal: 16,
  },
  header: {
    paddingTop: 20,
    paddingBottom: 32,
    paddingHorizontal: 4,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#FFFFFF",

    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    color: "#9CA3AF",
    lineHeight: 24,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#F3F4F6",
    marginBottom: 12,
    paddingLeft: 4,
  },

  listContainer: {
    backgroundColor: "#161B22",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#21262D",
    overflow: "hidden",
  },
  flatListContent: {
    flexGrow: 1,
  },
  listItemContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    minHeight: 64,
  },
  activeListItem: {
    backgroundColor: "#21262D",
  },
  listItemContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  leadingIconContainer: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  contentContainer: {
    flex: 1,
    justifyContent: "center",
    minHeight: 40,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 2,
    gap: 8,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#F9FAFB",
    flex: 1,
  },
  dangerTitle: {
    color: "#EF4444",
  },
  itemSubtitle: {
    fontSize: 14,
    color: "#9CA3AF",
    lineHeight: 18,
    marginTop: 2,
  },
  warningSubtitle: {
    color: "#D97706",
  },
  successSubtitle: {
    color: "#059669",
  },
  dangerSubtitle: {
    color: "#DC2626",
  },
  trailingIconContainer: {
    marginLeft: 12,
    justifyContent: "center",
    alignItems: "center",
    minWidth: 24,
  },
  trailingText: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "500",
  },
  badge: {
    backgroundColor: "#EF4444",
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    minWidth: 20,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#FFFFFF",
    textAlign: "center",
  },
  separator: {
    height: 1,
    backgroundColor: "#21262D",
    marginLeft: 60,
  },
  footer: {
    paddingVertical: 32,
    alignItems: "center",
  },
  footerText: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
  },
});

export default ListDemo;
