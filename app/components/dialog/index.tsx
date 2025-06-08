import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Pressable,
  Animated,
} from "react-native";
import React, { useEffect, useState, useRef } from "react";
import {
  MaterialIcons,
  Feather,
  Ionicons,
  FontAwesome5,
  AntDesign,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
  AnimatedProgressBar,
} from "@/components";

const DialogDemo = () => {
  const [deleteConfirmed, setDeleteConfirmed] = useState(false);
  const [profileSaved, setProfileSaved] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [value, setValue] = useState<number>(0);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.3)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  const Button = ({
    children,
    variant = "primary",
    size = "medium",
    onPress,
    style,
  }: any) => {
    const buttonStyles = [
      styles.button,
      variant === "primary" && styles.primaryButton,
      variant === "secondary" && styles.secondaryButton,
      variant === "destructive" && styles.destructiveButton,
      variant === "outline" && styles.outlineButton,
      size === "small" && styles.smallButton,
      size === "large" && styles.largeButton,
      style,
    ];

    const textStyles = [
      styles.buttonText,
      variant === "primary" && styles.primaryButtonText,
      variant === "secondary" && styles.secondaryButtonText,
      variant === "destructive" && styles.destructiveButtonText,
      variant === "outline" && styles.outlineButtonText,
      size === "small" && styles.smallButtonText,
      size === "large" && styles.largeButtonText,
    ];

    return (
      <View style={buttonStyles}>
        <Text style={textStyles}>{children}</Text>
      </View>
    );
  };
  const [keepAccount, setKeepAccount] = useState(true);
  const onDeletePress = () => {
    setKeepAccount(false);
    setIsFinished(false);
  };
  const [isFinished, setIsFinished] = useState<boolean>(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (!keepAccount) {
      setValue(0);
      interval = setInterval(() => {
        setValue((prev) => {
          if (prev >= 1) {
            clearInterval(interval);
            setIsFinished(true);
            return 1;
          }
          return Math.min(prev + 0.1, 1);
        });
      }, 800);
    } else {
      setValue(0);
    }
    return () => clearInterval(interval);
  }, [keepAccount]);

  useEffect(() => {
    if (isFinished) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 3,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isFinished]);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      scrollEnabled
    >
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <MaterialCommunityIcons
            name="card-text-outline"
            size={32}
            color="#60a5fa"
          />
        </View>
        <Text style={styles.headerTitle}>Dialog Component Demo</Text>
        <Text style={styles.subtitle}>
          Beautiful modal dialogs with smooth animations and flexible layouts
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Basic Usage</Text>
        <Text style={styles.sectionDescription}>
          Simple dialogs for common interactions like confirmations and alerts
        </Text>

        <View style={styles.exampleGrid}>
          <View style={styles.exampleCard}>
            <View style={styles.exampleHeader}>
              <MaterialIcons name="info" size={20} color="#60a5fa" />
              <Text style={styles.exampleTitle}>Basic Confirmation</Text>
            </View>
            <Text style={styles.exampleDescription}>
              Standard confirmation dialog with title and description
            </Text>
            <Dialog>
              <DialogTrigger>
                <Button variant="outline">Show Dialog</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  {!keepAccount ? (
                    <>
                      {isFinished ? (
                        <Animated.View
                          style={[
                            {
                              opacity: fadeAnim,
                              transform: [
                                { scale: scaleAnim },
                                { translateY: slideAnim },
                              ],
                            },
                          ]}
                          className="items-center justify-center py-6"
                        >
                          <View className="w-20 h-20 bg-red-500/20 rounded-full items-center justify-center mb-4 border-2 border-red-500/30">
                            <MaterialIcons
                              name="check-circle"
                              color="#ef4444"
                              size={40}
                            />
                          </View>
                          <Text className="font-bold text-2xl text-red-400 mb-2 text-center">
                            Account Deleted
                          </Text>
                          <Text className="text-gray-400 text-center text-sm leading-relaxed">
                            Your account has been permanently deleted.{"\n"}
                            All data has been removed from our servers.
                          </Text>
                          <View className="mt-6 flex-row items-center bg-red-500/10 px-4 py-2 rounded-lg border border-red-500/20">
                            <Feather name="info" size={16} color="#ef4444" />
                            <Text className="text-red-400 text-xs ml-2">
                              This action cannot be undone
                            </Text>
                          </View>
                        </Animated.View>
                      ) : (
                        <View>
                          <View className="flex-row items-center justify-center mb-4">
                            <View className="w-12 h-12 bg-red-500/20 rounded-full items-center justify-center mr-3 border border-red-500/30">
                              <Ionicons
                                name="trash-sharp"
                                color="#ef4444"
                                size={24}
                              />
                            </View>
                            <Text className="font-bold text-xl text-white">
                              Deleting your account…
                            </Text>
                          </View>

                          <View className="bg-transparent rounded-lg p-4 border border-gray-900 ">
                            <AnimatedProgressBar
                              progress={value}
                              containerStyle={{ marginBottom: 0, marginTop: 5 }}
                              width={300}
                              height={6}
                              progressColor="#ef4444"
                            />
                            <View className="flex-row justify-between items-center">
                              <Text className="text-gray-400 text-sm">
                                {Math.round(value * 100)}% Complete
                              </Text>
                              <Text className="text-gray-400 text-sm">
                                {value < 1 ? "Processing..." : "Finalizing..."}
                              </Text>
                            </View>
                          </View>
                        </View>
                      )}
                    </>
                  ) : (
                    <>
                      <DialogTitle>Are you absolutely sure?</DialogTitle>
                      <DialogDescription>
                        This action cannot be undone. This will permanently
                        delete your account and remove your data from our
                        servers.
                      </DialogDescription>
                    </>
                  )}
                </DialogHeader>
                <DialogFooter>
                  <DialogClose>
                    <Button variant="outline">Cancel</Button>
                  </DialogClose>
                  <Pressable onPress={onDeletePress}>
                    <Button variant="destructive">Continue</Button>
                  </Pressable>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </View>

          {/* Simple Alert */}
          <View style={styles.exampleCard}>
            <View style={styles.exampleHeader}>
              <AntDesign name="exclamationcircle" size={20} color="#f59e0b" />
              <Text style={styles.exampleTitle}>Alert Dialog</Text>
            </View>
            <Text style={styles.exampleDescription}>
              Information dialog with single action
            </Text>
            <Dialog>
              <DialogTrigger>
                <Button variant="outline">Show Alert</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Update Available</DialogTitle>
                  <DialogDescription>
                    A new version of the app is available. Update now to get the
                    latest features and improvements.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <DialogClose>
                    <Button variant="primary">Update Now</Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Advanced Examples</Text>
        <Text style={styles.sectionDescription}>
          Real-world dialog implementations with complex layouts and
          interactions
        </Text>

        <View style={styles.exampleCard}>
          <View style={styles.exampleHeader}>
            <MaterialIcons name="delete-forever" size={20} color="#ef4444" />
            <Text style={styles.exampleTitle}>Delete Account</Text>
          </View>
          <Text style={styles.exampleDescription}>
            Destructive action with multiple confirmations and detailed
            consequences
          </Text>
          <Dialog>
            <DialogTrigger>
              <Button variant="destructive">Delete Account</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>⚠️ Delete Account</DialogTitle>
                <DialogDescription>
                  This action is permanent and cannot be undone. All of your
                  data, including:
                  {"\n\n"}• Profile information and settings
                  {"\n"}• Saved content and preferences
                  {"\n"}• Account history and analytics
                  {"\n"}• Associated subscriptions
                  {"\n\n"}Will be permanently removed from our servers.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <DialogClose>
                  <Button variant="outline">Keep Account</Button>
                </DialogClose>
                <Button
                  variant="destructive"
                  onPress={() => setDeleteConfirmed(true)}
                >
                  Yes, Delete Forever
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          {deleteConfirmed && (
            <Text style={styles.statusText}>✅ Account deletion confirmed</Text>
          )}
        </View>

        <View style={styles.exampleCard}>
          <View style={styles.exampleHeader}>
            <Feather name="user" size={20} color="#10b981" />
            <Text style={styles.exampleTitle}>Edit Profile</Text>
          </View>
          <Text style={styles.exampleDescription}>
            Form dialog with multiple fields and validation
          </Text>
          <Dialog>
            <DialogTrigger>
              <Button variant="primary">Edit Profile</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Profile</DialogTitle>
                <DialogDescription>
                  Make changes to your profile here. Click save when you're
                  done.
                </DialogDescription>
              </DialogHeader>
              <View style={styles.formContent}>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Display Name</Text>
                  <View style={styles.inputContainer}>
                    <Text style={styles.inputValue}>Sarah Johnson</Text>
                  </View>
                </View>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Email</Text>
                  <View style={styles.inputContainer}>
                    <Text style={styles.inputValue}>sarah@example.com</Text>
                  </View>
                </View>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Bio</Text>
                  <View
                    style={[styles.inputContainer, styles.textareaContainer]}
                  >
                    <Text style={styles.inputValue}>
                      Senior Product Designer passionate about creating
                      beautiful, functional interfaces.
                    </Text>
                  </View>
                </View>
              </View>
              <DialogFooter>
                <DialogClose>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button variant="primary" onPress={() => setProfileSaved(true)}>
                  Save Changes
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          {profileSaved && (
            <Text style={styles.statusText}>
              ✅ Profile updated successfully
            </Text>
          )}
        </View>

        <View style={styles.exampleCard}>
          <View style={styles.exampleHeader}>
            <MaterialIcons name="star" size={20} color="#8b5cf6" />
            <Text style={styles.exampleTitle}>Upgrade to Pro</Text>
          </View>
          <Text style={styles.exampleDescription}>
            Pricing dialog with features comparison and call-to-action
          </Text>
          <Dialog>
            <DialogTrigger>
              <Button variant="primary">Upgrade Now</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>🚀 Upgrade to Pro</DialogTitle>
                <DialogDescription>
                  Unlock powerful features and take your productivity to the
                  next level
                </DialogDescription>
              </DialogHeader>
              <View style={styles.pricingContent}>
                <View style={styles.priceHeader}>
                  <Text style={styles.priceAmount}>$9.99</Text>
                  <Text style={styles.pricePeriod}>/month</Text>
                </View>
                <View style={styles.featuresList}>
                  <View style={styles.featureItem}>
                    <Feather name="check" size={16} color="#10b981" />
                    <Text style={styles.featureText}>Unlimited projects</Text>
                  </View>
                  <View style={styles.featureItem}>
                    <Feather name="check" size={16} color="#10b981" />
                    <Text style={styles.featureText}>Advanced analytics</Text>
                  </View>
                  <View style={styles.featureItem}>
                    <Feather name="check" size={16} color="#10b981" />
                    <Text style={styles.featureText}>Priority support</Text>
                  </View>
                  <View style={styles.featureItem}>
                    <Feather name="check" size={16} color="#10b981" />
                    <Text style={styles.featureText}>Team collaboration</Text>
                  </View>
                </View>
              </View>
              <DialogFooter>
                <DialogClose>
                  <Button variant="outline">Maybe Later</Button>
                </DialogClose>
                <Button variant="primary" onPress={() => setSubscribed(true)}>
                  Subscribe Now
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          {subscribed && (
            <Text style={styles.statusText}>🎉 Welcome to Pro!</Text>
          )}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Dialog Variants</Text>
        <Text style={styles.sectionDescription}>
          Different dialog styles for various use cases and contexts
        </Text>

        <View style={styles.variantGrid}>
          <View style={styles.variantCard}>
            <View style={styles.variantHeader}>
              <View
                style={[styles.variantIcon, { backgroundColor: "#10b98120" }]}
              >
                <Feather name="check-circle" size={24} color="#10b981" />
              </View>
              <Text style={styles.variantTitle}>Success</Text>
            </View>
            <Dialog>
              <DialogTrigger>
                <Button variant="outline" size="small">
                  Show Success
                </Button>
              </DialogTrigger>
              <DialogContent>
                <View style={styles.centeredContent}>
                  <View
                    style={[styles.largeIcon, { backgroundColor: "#10b98120" }]}
                  >
                    <Feather name="check-circle" size={48} color="#10b981" />
                  </View>
                  <DialogHeader>
                    <DialogTitle style={{ textAlign: "center" }}>
                      Payment Successful!
                    </DialogTitle>
                    <DialogDescription style={{ textAlign: "center" }}>
                      Your payment has been processed successfully. You'll
                      receive a confirmation email shortly.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <DialogClose>
                      <Button variant="primary">Continue</Button>
                    </DialogClose>
                  </DialogFooter>
                </View>
              </DialogContent>
            </Dialog>
          </View>

          <View style={styles.variantCard}>
            <View style={styles.variantHeader}>
              <View
                style={[styles.variantIcon, { backgroundColor: "#f59e0b20" }]}
              >
                <Feather name="alert-triangle" size={24} color="#f59e0b" />
              </View>
              <Text style={styles.variantTitle}>Warning</Text>
            </View>
            <Dialog>
              <DialogTrigger>
                <Button variant="outline" size="small">
                  Show Warning
                </Button>
              </DialogTrigger>
              <DialogContent>
                <View style={styles.centeredContent}>
                  <View
                    style={[styles.largeIcon, { backgroundColor: "#f59e0b20" }]}
                  >
                    <Feather name="alert-triangle" size={48} color="#f59e0b" />
                  </View>
                  <DialogHeader>
                    <DialogTitle style={{ textAlign: "center" }}>
                      Unsaved Changes
                    </DialogTitle>
                    <DialogDescription style={{ textAlign: "center" }}>
                      You have unsaved changes that will be lost if you leave
                      this page.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <DialogClose>
                      <Button variant="outline">Stay Here</Button>
                    </DialogClose>
                    <Button variant="primary">Leave Anyway</Button>
                  </DialogFooter>
                </View>
              </DialogContent>
            </Dialog>
          </View>

          {/* Error Dialog */}
          <View style={styles.variantCard}>
            <View style={styles.variantHeader}>
              <View
                style={[styles.variantIcon, { backgroundColor: "#ef444420" }]}
              >
                <Feather name="x-circle" size={24} color="#ef4444" />
              </View>
              <Text style={styles.variantTitle}>Error</Text>
            </View>
            <Dialog>
              <DialogTrigger>
                <Button variant="outline" size="small">
                  Show Error
                </Button>
              </DialogTrigger>
              <DialogContent>
                <View style={styles.centeredContent}>
                  <View
                    style={[styles.largeIcon, { backgroundColor: "#ef444420" }]}
                  >
                    <Feather name="x-circle" size={48} color="#ef4444" />
                  </View>
                  <DialogHeader>
                    <DialogTitle style={{ textAlign: "center" }}>
                      Connection Failed
                    </DialogTitle>
                    <DialogDescription style={{ textAlign: "center" }}>
                      Unable to connect to the server. Please check your
                      internet connection and try again.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <DialogClose>
                      <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button variant="primary">Retry</Button>
                  </DialogFooter>
                </View>
              </DialogContent>
            </Dialog>
          </View>

          <View style={styles.variantCard}>
            <View style={styles.variantHeader}>
              <View
                style={[styles.variantIcon, { backgroundColor: "#60a5fa20" }]}
              >
                <Feather name="info" size={24} color="#60a5fa" />
              </View>
              <Text style={styles.variantTitle}>Information</Text>
            </View>
            <Dialog>
              <DialogTrigger>
                <Button variant="outline" size="small">
                  Show Info
                </Button>
              </DialogTrigger>
              <DialogContent>
                <View style={styles.centeredContent}>
                  <View
                    style={[styles.largeIcon, { backgroundColor: "#60a5fa20" }]}
                  >
                    <Feather name="info" size={48} color="#60a5fa" />
                  </View>
                  <DialogHeader>
                    <DialogTitle style={{ textAlign: "center" }}>
                      New Feature Available
                    </DialogTitle>
                    <DialogDescription style={{ textAlign: "center" }}>
                      We've added dark mode! You can now switch between light
                      and dark themes in settings.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <DialogClose>
                      <Button variant="primary">Got it</Button>
                    </DialogClose>
                  </DialogFooter>
                </View>
              </DialogContent>
            </Dialog>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Best Practices</Text>
        <Text style={styles.sectionDescription}>
          Guidelines for effective dialog usage and user experience
        </Text>

        <View style={styles.practicesList}>
          <View style={styles.practiceItem}>
            <View
              style={[styles.practiceIcon, { backgroundColor: "#10b98120" }]}
            >
              <Feather name="check" size={16} color="#10b981" />
            </View>
            <View style={styles.practiceContent}>
              <Text style={styles.practiceTitle}>Clear and Concise</Text>
              <Text style={styles.practiceDescription}>
                Keep dialog content brief and focused on the primary action
              </Text>
            </View>
          </View>

          <View style={styles.practiceItem}>
            <View
              style={[styles.practiceIcon, { backgroundColor: "#10b98120" }]}
            >
              <Feather name="check" size={16} color="#10b981" />
            </View>
            <View style={styles.practiceContent}>
              <Text style={styles.practiceTitle}>Meaningful Actions</Text>
              <Text style={styles.practiceDescription}>
                Use descriptive button labels instead of generic "OK" or "Yes"
              </Text>
            </View>
          </View>

          <View style={styles.practiceItem}>
            <View
              style={[styles.practiceIcon, { backgroundColor: "#10b98120" }]}
            >
              <Feather name="check" size={16} color="#10b981" />
            </View>
            <View style={styles.practiceContent}>
              <Text style={styles.practiceTitle}>Visual Hierarchy</Text>
              <Text style={styles.practiceDescription}>
                Make primary actions visually prominent and destructive actions
                clearly marked
              </Text>
            </View>
          </View>

          <View style={styles.practiceItem}>
            <View
              style={[styles.practiceIcon, { backgroundColor: "#10b98120" }]}
            >
              <Feather name="check" size={16} color="#10b981" />
            </View>
            <View style={styles.practiceContent}>
              <Text style={styles.practiceTitle}>Escape Routes</Text>
              <Text style={styles.practiceDescription}>
                Always provide a way to cancel or dismiss the dialog
              </Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Component API</Text>
        <Text style={styles.sectionDescription}>
          Available components and their properties
        </Text>

        <View style={styles.apiCard}>
          <Text style={styles.apiTitle}>Dialog Components</Text>
          <View style={styles.apiList}>
            <Text style={styles.apiItem}>
              <Text style={styles.apiName}>Dialog</Text> - Root container
              component
            </Text>
            <Text style={styles.apiItem}>
              <Text style={styles.apiName}>DialogTrigger</Text> - Element that
              opens the dialog
            </Text>
            <Text style={styles.apiItem}>
              <Text style={styles.apiName}>DialogContent</Text> - Modal content
              container
            </Text>
            <Text style={styles.apiItem}>
              <Text style={styles.apiName}>DialogHeader</Text> - Header section
              wrapper
            </Text>
            <Text style={styles.apiItem}>
              <Text style={styles.apiName}>DialogTitle</Text> - Dialog title
              text
            </Text>
            <Text style={styles.apiItem}>
              <Text style={styles.apiName}>DialogDescription</Text> -
              Description text
            </Text>
            <Text style={styles.apiItem}>
              <Text style={styles.apiName}>DialogFooter</Text> - Footer with
              actions
            </Text>
            <Text style={styles.apiItem}>
              <Text style={styles.apiName}>DialogClose</Text> - Element that
              closes the dialog
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        <View style={styles.footerIcon}>
          <MaterialCommunityIcons
            name="card-text-outline"
            size={16}
            color="#71717a"
          />
        </View>
        <Text style={styles.footerText}>
          The Dialog component provides accessible modal interactions with
          smooth animations and flexible layouts
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
    marginBottom: 8,
    marginLeft: 4,
  },
  sectionDescription: {
    fontSize: 14,
    color: "#a1a1aa",
    lineHeight: 20,
    marginBottom: 20,
    marginLeft: 4,
  },
  exampleGrid: {
    gap: 16,
  },
  exampleCard: {
    backgroundColor: "#18181b",
    borderWidth: 1,
    borderColor: "#27272a",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  exampleHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    gap: 8,
  },
  exampleTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fafafa",
  },
  exampleDescription: {
    fontSize: 14,
    color: "#a1a1aa",
    lineHeight: 20,
    marginBottom: 16,
  },
  statusText: {
    fontSize: 12,
    color: "#10b981",
    marginTop: 8,
    fontWeight: "500",
  },
  formContent: {
    gap: 16,
    marginVertical: 16,
  },
  inputGroup: {
    gap: 8,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#fafafa",
  },
  inputContainer: {
    backgroundColor: "#09090b",
    borderWidth: 1,
    borderColor: "#27272a",
    borderRadius: 8,
    padding: 12,
  },
  textareaContainer: {
    minHeight: 80,
  },
  inputValue: {
    fontSize: 14,
    color: "#a1a1aa",
    lineHeight: 20,
  },
  pricingContent: {
    alignItems: "center",
    marginVertical: 16,
  },
  priceHeader: {
    flexDirection: "row",
    alignItems: "baseline",
    marginBottom: 20,
  },
  priceAmount: {
    fontSize: 32,
    fontWeight: "700",
    color: "#fafafa",
  },
  pricePeriod: {
    fontSize: 16,
    color: "#a1a1aa",
    marginLeft: 4,
  },
  featuresList: {
    gap: 12,
    width: "100%",
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  featureText: {
    fontSize: 14,
    color: "#a1a1aa",
  },
  centeredContent: {
    alignItems: "center",
  },
  largeIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  variantGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  variantCard: {
    flex: 1,
    minWidth: "47%",
    backgroundColor: "#18181b",
    borderWidth: 1,
    borderColor: "#27272a",
    borderRadius: 12,
    padding: 16,
  },
  variantHeader: {
    alignItems: "center",
    marginBottom: 16,
    gap: 8,
  },
  variantIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  variantTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#fafafa",
  },
  practicesList: {
    gap: 16,
  },
  practiceItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    backgroundColor: "#18181b",
    borderWidth: 1,
    borderColor: "#27272a",
    borderRadius: 12,
    padding: 16,
  },
  practiceIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
  },
  practiceContent: {
    flex: 1,
  },
  practiceTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#fafafa",
    marginBottom: 4,
  },
  practiceDescription: {
    fontSize: 14,
    color: "#a1a1aa",
    lineHeight: 20,
  },
  apiCard: {
    backgroundColor: "#18181b",
    borderWidth: 1,
    borderColor: "#27272a",
    borderRadius: 12,
    padding: 16,
  },
  apiTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fafafa",
    marginBottom: 12,
  },
  apiList: {
    gap: 8,
  },
  apiItem: {
    fontSize: 14,
    color: "#a1a1aa",
    lineHeight: 20,
  },
  apiName: {
    fontWeight: "600",
    color: "#60a5fa",
    fontFamily: "monospace",
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
  button: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryButton: {
    backgroundColor: "#fafafa",
    borderColor: "#fafafa",
  },
  secondaryButton: {
    backgroundColor: "#27272a",
    borderColor: "#27272a",
  },
  destructiveButton: {
    backgroundColor: "#ef4444",
    borderColor: "#ef4444",
  },
  outlineButton: {
    backgroundColor: "transparent",
    borderColor: "#27272a",
  },
  smallButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  largeButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "500",
  },
  primaryButtonText: {
    color: "#09090b",
  },
  secondaryButtonText: {
    color: "#fafafa",
  },
  destructiveButtonText: {
    color: "#fafafa",
  },
  outlineButtonText: {
    color: "#fafafa",
  },
  smallButtonText: {
    fontSize: 12,
  },
  largeButtonText: {
    fontSize: 16,
  },
});

export default DialogDemo;
