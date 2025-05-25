import React, { useState } from "react";
import { View, SafeAreaView, StyleSheet, Text } from "react-native";
import { BACKGROUND_COLOR } from "../../app.config";
import {
  Stepper,
  StepperButton,
  StepperContent,
  StepperValue,
  Accordion,
  AccordionTrigger,
  AccordionItem,
  AccordionContent,
  Center,
  Row,
  ExpandableButton,
  AnimatedMaskedText,
} from "@/components";
import { SymbolView } from "expo-symbols";

export const Home: React.FC = () => {
  return (
    <SafeAreaView style={styles.container}>
      <AnimatedMaskedText
        style={{
          fontSize: 40,
        }}
      >
        hey
      </AnimatedMaskedText>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    flex: 1,
  },
});
