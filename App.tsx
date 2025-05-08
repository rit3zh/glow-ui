import React, { useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  Switch,
  TouchableOpacity,
} from "react-native";
import {
  Stepper,
  StepperButton,
  StepperContent,
  StepperValue,
} from "@/components/molecules";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/organisms/";
import { Popover, PopoverOption } from "@/components/molecules/Popover/Popover";
import { SymbolView } from "expo-symbols";

export const App: React.FC = () => {
  const [showPopover, setShowPopover] = useState<boolean>(false);

  const popoverContent = (
    <View>
      <PopoverOption
        title="New Chat"
        description="Send a message to your contact"
        onPress={() => setShowPopover(false)}
      />
      <PopoverOption
        title="New Contact"
        description="Add a contact to be able to send message"
        onPress={() => setShowPopover(false)}
      />
      <PopoverOption
        title="New Community"
        description="Join the community around you"
        onPress={() => setShowPopover(false)}
      />
    </View>
  );

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Popover
        isVisible={showPopover}
        onClose={() => setShowPopover(false)}
        content={popoverContent}
        position="top"
        useBlur={true}
        blurIntensity={100}
      >
        <TouchableOpacity
          onPress={() => setShowPopover(true)}
          style={{
            padding: 15,
            backgroundColor: "#007AFF",
            width: 200,
            height: 100,
            borderRadius: 8,
          }}
        >
          <Text style={{ color: "white" }}>Show Popover</Text>
          <SymbolView
            name="plus"
            size={20}
            tintColor="#fff"
            style={{ position: "absolute", top: 10, right: 10 }}
          />
        </TouchableOpacity>
      </Popover>
    </View>
  );
};

// i love my girlfriend's video
