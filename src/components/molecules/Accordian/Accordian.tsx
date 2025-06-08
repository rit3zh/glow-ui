import React, { useState, ReactNode } from "react";
import { View, StyleSheet } from "react-native";

export const Accordion = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const handleToggle = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
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
