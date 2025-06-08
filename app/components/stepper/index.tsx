import { View, Text, ScrollView, SafeAreaView } from "react-native";
import React, { useState } from "react";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import {
  Stepper,
  StepperButton,
  StepperContent,
  StepperValue,
} from "@/components";

const StepperDemo: React.FC = () => {
  const [quantity, setQuantity] = useState(1);
  const [temperature, setTemperature] = useState(20);
  const [volume, setVolume] = useState(50);
  const [rating, setRating] = useState(5);

  return (
    <ScrollView
      className="flex-1 bg-background"
      scrollEnabled={true}
      contentContainerStyle={{ flexGrow: 1 }}
      style={{ backgroundColor: "#0a0a0a" }}
      contentInsetAdjustmentBehavior="always"
    >
      <SafeAreaView className="flex-1">
        <View className="flex-1 px-6 py-8">
          <View className="mb-12">
            <Text
              className="text-4xl font-bold text-foreground mb-2"
              style={{ color: "#fafafa", fontSize: 32, fontWeight: "700" }}
            >
              Stepper Components
            </Text>
            <Text
              className="text-muted-foreground text-lg"
              style={{ color: "#a1a1aa", fontSize: 16 }}
            >
              Beautiful, accessible stepper components built with shadcn/ui
              design principles.
            </Text>
          </View>

          <View className="space-y-12" style={{ gap: 48 }}>
            <View className="space-y-4" style={{ gap: 16 }}>
              <View>
                <Text
                  className="text-xl font-semibold text-foreground mb-2"
                  style={{ color: "#fafafa", fontSize: 20, fontWeight: "600" }}
                >
                  Quantity
                </Text>
                <Text
                  className="text-muted-foreground"
                  style={{ color: "#71717a", fontSize: 14 }}
                >
                  Select the number of items
                </Text>
              </View>

              <Stepper
                containerStyle={{
                  backgroundColor: "#09090b",
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: "#27272a",
                  padding: 4,
                }}
                defaultValue={1}
                disabled={false}
                max={99}
                min={1}
                onChange={setQuantity}
                step={1}
                value={quantity}
                variant="dark"
              >
                <StepperContent
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 0,
                  }}
                >
                  <StepperButton
                    type="decrement"
                    style={{
                      width: 44,
                      height: 44,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  />

                  <StepperValue
                    style={{
                      fontSize: 18,
                      fontWeight: "600",
                      color: "#fafafa",
                      minWidth: 60,
                      textAlign: "center",
                      lineHeight: 44,
                    }}
                  />

                  <StepperButton
                    type="increment"
                    style={{
                      width: 44,
                      height: 44,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  />
                </StepperContent>
              </Stepper>
            </View>

            <View className="space-y-4" style={{ gap: 16 }}>
              <View>
                <Text
                  className="text-xl font-semibold text-foreground mb-2"
                  style={{ color: "#fafafa", fontSize: 20, fontWeight: "600" }}
                >
                  Temperature
                </Text>
                <Text
                  className="text-muted-foreground"
                  style={{ color: "#71717a", fontSize: 14 }}
                >
                  Adjust the temperature in celsius
                </Text>
              </View>

              <Stepper
                containerStyle={{
                  backgroundColor: "#09090b",
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: "#27272a",
                  padding: 6,
                }}
                defaultValue={20}
                disabled={false}
                max={35}
                min={10}
                onChange={setTemperature}
                step={1}
                value={temperature}
                variant="dark"
              >
                <StepperContent
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 0,
                  }}
                >
                  <StepperButton
                    type="decrement"
                    style={{
                      width: 40,
                      height: 40,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  />
                  <View
                    style={{
                      alignItems: "center",
                      justifyContent: "center",
                      minWidth: 80,
                      height: 40,
                    }}
                  >
                    <StepperValue
                      style={{
                        fontSize: 24,
                        fontWeight: "700",
                        color: "#fafafa",
                        textAlign: "center",
                        lineHeight: 28,
                      }}
                    />
                    <Text
                      style={{
                        fontSize: 12,
                        color: "#71717a",
                        marginTop: -2,
                      }}
                    >
                      °C
                    </Text>
                  </View>

                  <StepperButton
                    type="increment"
                    style={{
                      width: 40,
                      height: 40,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  />
                </StepperContent>
              </Stepper>
            </View>

            <View className="space-y-4" style={{ gap: 16 }}>
              <View>
                <Text
                  className="text-xl font-semibold text-foreground mb-2"
                  style={{ color: "#fafafa", fontSize: 20, fontWeight: "600" }}
                >
                  Volume
                </Text>
                <Text
                  className="text-muted-foreground"
                  style={{ color: "#71717a", fontSize: 14 }}
                >
                  Control audio volume level
                </Text>
              </View>

              <Stepper
                containerStyle={{
                  backgroundColor: "#18181b",
                  borderRadius: 16,
                  borderWidth: 1,
                  borderColor: "#3f3f46",
                  padding: 8,
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.3,
                  shadowRadius: 8,
                  elevation: 8,
                }}
                defaultValue={50}
                disabled={false}
                max={100}
                min={0}
                onChange={setVolume}
                step={5}
                value={volume}
                variant="dark"
              >
                <StepperContent
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 0,
                  }}
                >
                  <StepperButton
                    type="decrement"
                    style={{
                      width: 48,
                      height: 48,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  />

                  <View
                    style={{
                      alignItems: "center",
                      justifyContent: "center",
                      minWidth: 90,
                      height: 48,
                    }}
                  >
                    <StepperValue
                      style={{
                        fontSize: 28,
                        fontWeight: "800",
                        color: "#fafafa",
                        textAlign: "center",
                        lineHeight: 32,
                      }}
                    />
                    <Text
                      style={{
                        fontSize: 12,
                        color: "#71717a",
                        fontWeight: "500",
                        marginTop: -4,
                      }}
                    >
                      Volume
                    </Text>
                  </View>

                  <StepperButton
                    type="increment"
                    style={{
                      width: 48,
                      height: 48,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  />
                </StepperContent>
              </Stepper>
            </View>

            <View className="space-y-4" style={{ gap: 16 }}>
              <View>
                <Text
                  className="text-xl font-semibold text-foreground mb-2"
                  style={{ color: "#fafafa", fontSize: 20, fontWeight: "600" }}
                >
                  Rating
                </Text>
                <Text
                  className="text-muted-foreground"
                  style={{ color: "#71717a", fontSize: 14 }}
                >
                  Rate from 1 to 10
                </Text>
              </View>

              <Stepper
                containerStyle={{
                  backgroundColor: "#0f0f0f",
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor: "#27272a",
                  padding: 10,
                }}
                defaultValue={5}
                disabled={false}
                max={10}
                min={1}
                onChange={setRating}
                step={1}
                value={rating}
                variant="dark"
              >
                <StepperContent
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 0,
                  }}
                >
                  <StepperButton
                    type="decrement"
                    style={{
                      width: 36,
                      height: 36,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  />
                  <StepperValue
                    style={{
                      fontSize: 16,
                      fontWeight: "600",
                      color: "#fafafa",
                      minWidth: 40,
                      textAlign: "center",
                      lineHeight: 36,
                    }}
                  />

                  <StepperButton
                    type="increment"
                    style={{
                      width: 36,
                      height: 36,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  />
                </StepperContent>
              </Stepper>
            </View>

            <View
              style={{
                backgroundColor: "#18181b",
                borderRadius: 12,
                borderWidth: 1,
                borderColor: "#27272a",
                padding: 20,
                marginTop: 32,
              }}
            >
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "600",
                  color: "#fafafa",
                  marginBottom: 16,
                }}
              >
                Current Values
              </Text>

              <View style={{ gap: 8 }}>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Text style={{ color: "#a1a1aa" }}>Quantity:</Text>
                  <Text style={{ color: "#fafafa", fontWeight: "500" }}>
                    {quantity}
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Text style={{ color: "#a1a1aa" }}>Temperature:</Text>
                  <Text style={{ color: "#fafafa", fontWeight: "500" }}>
                    {temperature}°C
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Text style={{ color: "#a1a1aa" }}>Volume:</Text>
                  <Text style={{ color: "#fafafa", fontWeight: "500" }}>
                    {volume}%
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Text style={{ color: "#a1a1aa" }}>Rating:</Text>
                  <Text style={{ color: "#fafafa", fontWeight: "500" }}>
                    {rating}/10
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </ScrollView>
  );
};

export default StepperDemo;
