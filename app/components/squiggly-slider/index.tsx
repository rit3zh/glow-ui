import { SquigglySlider } from "@/components/molecules/squiggly-slider";
import React, { useEffect, useState } from "react";
import { useWindowDimensions, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Showcase } from "~/showcase";

export default () => {
  const [v, setV] = useState<number>(0);
  const { width } = useWindowDimensions();
  useEffect(() => {
    const interval = setInterval(() => {
      setV((prev) => (prev >= 1 ? 0 : prev + 0.001));
    }, 100);
    return () => clearInterval(interval);
  }, []);
  const insets = useSafeAreaInsets();
  return (
    <Showcase>
      <GestureHandlerRootView
        style={{
          flex: 1,

          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <SquigglySlider
          value={v}
          onValueChange={setV}
          width={width}
          thumbColor="#fff"
          activeColor="#fff"
          inactiveColor="rgba(255, 255, 255, 0.3)"
          amplitude={4}
          speed={1}
        />
      </GestureHandlerRootView>
    </Showcase>
  );
};
