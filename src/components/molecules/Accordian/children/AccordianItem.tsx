import React, { ReactNode } from "react";
import { View, StyleSheet } from "react-native";

export const AccordionItem = ({
  children,
  isActive,
  onToggle,
  className,
}: {
  children: ReactNode;
  isActive?: boolean;
  onToggle?: () => void;
  className?: string;
}) => {
  const [width, setWidth] = React.useState(0);
  return (
    <>
      <View
        className={"p-3" + className}
        onLayout={(e) => setWidth(e.nativeEvent.layout.width)}
      >
        {React.Children.map(children, (child) => {
          return React.cloneElement(child as React.ReactElement<any>, {
            isActive,
            onToggle,
          });
        })}
        <View
          style={[
            styles.accordionDivider,
            {
              width: width - 40,
            },
          ]}
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  accordionDivider: {
    height: 1,
    backgroundColor: "#404040",
    left: 10,
    width: 100,
    opacity: 0.54,
  },
});
