import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";
import React from "react";
import {
  ActionCard as ActionCardView,
  ActionCardTitle,
  ActionCardSubtitle,
  ActionCardWrapper,
  VerticalDivider,
  Row,
} from "@/components/index";
import { SymbolView } from "expo-symbols";

const ActionCard = () => {
  const handlePress = (cardType: any) => {
    console.log(`${cardType} card pressed`);
  };
  const width = useWindowDimensions().width;
  return (
    <ScrollView
      style={{
        flex: 1,
        backgroundColor: "#141414",
      }}
      contentContainerStyle={{
        flexGrow: 1,
        padding: 16,
      }}
      showsVerticalScrollIndicator={false}
      scrollEnabled={true}
      contentInsetAdjustmentBehavior="always"
    >
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ marginBottom: 24, marginTop: 24 }}>
          <Text
            style={{
              fontSize: 28,
              fontWeight: "bold",
              color: "#e6e6e6",
              marginBottom: 8,
            }}
          >
            Action Cards
          </Text>
          <Text
            style={{
              fontSize: 16,
              color: "#9e9e9e",
              lineHeight: 24,
            }}
          >
            Beautiful, interactive cards for your React Native application
          </Text>
        </View>

        <TouchableOpacity
          onPress={() => handlePress("Primary")}
          activeOpacity={0.95}
        >
          <ActionCardView
            style={{
              marginBottom: 16,
              backgroundColor: "#212121",
              borderRadius: 16,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.1,
              shadowRadius: 12,
              elevation: 6,
            }}
          >
            <ActionCardWrapper
              style={{
                padding: 20,
                borderLeftWidth: 4,
                borderLeftColor: "#3b82f6",
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: 12,
                }}
              >
                <View
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: 6,
                    backgroundColor: "#10b981",
                    marginRight: 8,
                  }}
                />
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: "600",
                    color: "#10b981",
                    textTransform: "uppercase",
                    letterSpacing: 1,
                  }}
                >
                  Active
                </Text>
              </View>

              <ActionCardTitle
                style={{
                  fontSize: 25,
                  fontWeight: "bold",
                  color: "#ffffff",
                  marginBottom: 8,
                }}
              >
                Welcome to Action Cards
              </ActionCardTitle>

              <ActionCardSubtitle
                style={{
                  fontSize: 15,
                  color: "#bdbdbd",
                  lineHeight: 24,
                  marginBottom: 16,
                  textAlign: "left",
                }}
              >
                Create stunning, interactive cards with smooth animations and
                customizable styling. Perfect for dashboards, notifications, and
                feature highlights.
              </ActionCardSubtitle>

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 14,
                      color: "#8b5cf6",
                      fontWeight: "600",
                    }}
                  >
                    Learn More →
                  </Text>
                </View>
                <View
                  style={{
                    backgroundColor: "#f1f5f9",
                    paddingHorizontal: 12,
                    paddingVertical: 6,
                    borderRadius: 8,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 12,
                      color: "#475569",
                      fontWeight: "500",
                    }}
                  >
                    v2.1.0
                  </Text>
                </View>
              </View>
            </ActionCardWrapper>
          </ActionCardView>
        </TouchableOpacity>

        <View
          style={{
            flexDirection: "row",
            marginBottom: 16,
            gap: 12,
          }}
        >
          <TouchableOpacity
            style={{ flex: 1 }}
            // onPress={() => handlePress("Customizable")}
            activeOpacity={0.95}
          >
            <ActionCardView
              style={{
                backgroundColor: "#ffffff",
                borderRadius: 12,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.08,
                shadowRadius: 8,
                elevation: 4,
              }}
            >
              <ActionCardWrapper style={{ padding: 16 }}>
                <View
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    backgroundColor: "#ddd6fe",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 12,
                  }}
                >
                  <Text style={{ fontSize: 18 }}>🎨</Text>
                </View>

                <ActionCardTitle
                  style={{
                    fontSize: 16,
                    fontWeight: "bold",
                    color: "#1e293b",
                    marginBottom: 4,
                  }}
                >
                  Customizable
                </ActionCardTitle>

                <ActionCardSubtitle
                  style={{
                    fontSize: 14,
                    color: "#64748b",
                    lineHeight: 20,
                  }}
                >
                  Full control over styling and theming
                </ActionCardSubtitle>
              </ActionCardWrapper>
            </ActionCardView>
          </TouchableOpacity>

          <TouchableOpacity
            style={{ flex: 1 }}
            onPress={() => handlePress("Responsive")}
            activeOpacity={0.95}
          >
            <ActionCardView
              style={{
                backgroundColor: "#ffffff",
                borderRadius: 12,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.08,
                shadowRadius: 8,
                elevation: 4,
              }}
            >
              <ActionCardWrapper style={{ padding: 16 }}>
                <View
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    backgroundColor: "#fed7d7",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 12,
                  }}
                >
                  <Text style={{ fontSize: 18 }}>📱</Text>
                </View>

                <ActionCardTitle
                  style={{
                    fontSize: 16,
                    fontWeight: "bold",
                    color: "#1e293b",
                    marginBottom: 4,
                  }}
                >
                  Responsive
                </ActionCardTitle>

                <ActionCardSubtitle
                  style={{
                    fontSize: 14,
                    color: "#64748b",
                    lineHeight: 20,
                  }}
                >
                  Works perfectly on all screen sizes
                </ActionCardSubtitle>
              </ActionCardWrapper>
            </ActionCardView>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={() => handlePress("Notification")}
          activeOpacity={0.95}
        >
          <ActionCardView
            style={{
              marginBottom: 16,
              backgroundColor: "#fef3c7",
              borderRadius: 12,
              borderWidth: 1,
              borderColor: "#f59e0b",
            }}
          >
            <ActionCardWrapper style={{ padding: 15 }}>
              <View
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <View style={{ flex: 1 }}>
                  <Row>
                    <View className="items-center justify-center">
                      <SymbolView
                        name="warninglight"
                        tintColor={"orange"}
                        resizeMode="scaleAspectFit"
                        size={40}
                      />
                    </View>
                    <View>
                      <ActionCardTitle
                        style={{
                          fontSize: 16,
                          fontWeight: "bold",
                          color: "#92400e",
                          marginBottom: 4,
                        }}
                      >
                        Important Update Available
                      </ActionCardTitle>
                      <ActionCardSubtitle
                        style={{
                          fontSize: 14,
                          color: "#b45309",
                          lineHeight: 20,
                          maxWidth: width - 100,
                        }}
                      >
                        A new version with performance improvements and bug
                        fixes is ready to install.
                      </ActionCardSubtitle>
                    </View>
                  </Row>
                </View>
              </View>
            </ActionCardWrapper>
          </ActionCardView>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => handlePress("Stats")}
          activeOpacity={0.95}
        >
          <ActionCardView
            style={{
              marginBottom: 16,
              backgroundColor: "#1a1a1a",
              borderRadius: 16,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.1,
              shadowRadius: 12,
              elevation: 6,
            }}
          >
            <ActionCardWrapper style={{ padding: 20 }}>
              <ActionCardTitle
                style={{
                  fontSize: 18,
                  fontWeight: "bold",
                  color: "#ffffff",
                  marginBottom: 16,
                  textAlign: "center",
                }}
              >
                Package Statistics
              </ActionCardTitle>

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-around",
                  marginBottom: 16,
                }}
              >
                <VerticalDivider>
                  <View
                    style={{ alignItems: "center", justifyContent: "center" }}
                  >
                    <Text
                      style={{
                        fontSize: 20,
                        fontWeight: "bold",
                        color: "#3b82f6",
                        marginBottom: 4,
                      }}
                    >
                      15K+
                    </Text>
                    <Text
                      style={{
                        fontSize: 11,
                        color: "#64748b",
                        textAlign: "center",
                      }}
                    >
                      Downloads
                    </Text>
                  </View>

                  <View
                    style={{ alignItems: "center", justifyContent: "center" }}
                  >
                    <Text
                      style={{
                        fontSize: 20,
                        fontWeight: "bold",
                        color: "#10b981",
                        marginBottom: 4,
                      }}
                    >
                      4.8★
                    </Text>
                    <Text
                      style={{
                        fontSize: 11,
                        color: "#64748b",
                        textAlign: "center",
                      }}
                    >
                      Rating
                    </Text>
                  </View>

                  <View
                    style={{ alignItems: "center", justifyContent: "center" }}
                  >
                    <Text
                      style={{
                        fontSize: 20,
                        fontWeight: "bold",
                        color: "#8b5cf6",
                        marginBottom: 4,
                      }}
                    >
                      250+
                    </Text>
                    <Text
                      style={{
                        fontSize: 11,
                        color: "#64748b",
                        textAlign: "center",
                      }}
                    >
                      Projects
                    </Text>
                  </View>
                </VerticalDivider>
              </View>

              <ActionCardSubtitle
                style={{
                  fontSize: 14,
                  color: "#757575",
                  lineHeight: 20,
                  textAlign: "center",
                }}
              >
                Trusted by developers worldwide for creating beautiful card
                interfaces
              </ActionCardSubtitle>
            </ActionCardWrapper>
          </ActionCardView>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => handlePress("CTA")}
          activeOpacity={0.95}
        >
          <ActionCardView
            style={{
              backgroundColor:
                "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              borderRadius: 16,
              overflow: "hidden",
            }}
          >
            <ActionCardWrapper
              style={{
                padding: 24,
                backgroundColor: "#4c1d95",
              }}
            >
              <ActionCardTitle
                style={{
                  fontSize: 20,
                  fontWeight: "bold",
                  color: "#ffffff",
                  marginBottom: 8,
                  textAlign: "center",
                }}
              >
                Ready to Get Started?
              </ActionCardTitle>

              <ActionCardSubtitle
                style={{
                  fontSize: 16,
                  color: "#e0e7ff",
                  lineHeight: 24,
                  textAlign: "center",
                  marginBottom: 20,
                }}
              >
                Install the package and start building amazing card interfaces
                in minutes
              </ActionCardSubtitle>

              <View
                style={{
                  backgroundColor: "#1a1a1a",
                  borderRadius: 8,
                  paddingVertical: 12,
                  paddingHorizontal: 16,
                }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    fontFamily: "monospace",
                    color: "#cfcfcf",
                    textAlign: "center",
                    fontWeight: "600",
                  }}
                >
                  npx rn-glow add action-card
                </Text>
              </View>
            </ActionCardWrapper>
          </ActionCardView>
        </TouchableOpacity>

        <View
          style={{
            marginTop: 32,
            paddingTop: 24,
            borderTopWidth: 1,
            borderTopColor: "#1f1f1f",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              fontSize: 14,
              color: "#64748b",
              textAlign: "center",
              lineHeight: 20,
            }}
          >
            Action Cards Demo{"\n"}
            Built with ❤️ for React Native developers
          </Text>
        </View>
      </SafeAreaView>
    </ScrollView>
  );
};

export default ActionCard;
