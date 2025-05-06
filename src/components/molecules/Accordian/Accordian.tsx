import React, { useState, ReactNode } from "react";
import { View, StyleSheet } from "react-native";
import { AccordionItem } from "./children/AccordianItem";

export const Accordion = ({ children }: { children: ReactNode }) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const handleToggle = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index); // Toggle open/close
  };

  return (
    <View style={styles.accordion}>
      {React.Children.map(children, (child, index) => {
        return React.cloneElement(child as React.ReactElement<any>, {
          isActive: index === activeIndex,
          onToggle: () => handleToggle(index),
        });
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  accordion: {
    width: "100%",
  },
});
