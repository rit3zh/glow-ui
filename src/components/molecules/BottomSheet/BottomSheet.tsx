import React, { useEffect, useRef } from "react";
import { StyleSheet, Text } from "react-native";
import BottomSheetGorhom, { BottomSheetView } from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BottomSheetProps } from "./BottomSheet.types";

export const BottomSheet: React.FC<BottomSheetProps> = ({
  children,
  backgroundColor,
  indicatorColor,
}) => {
  const ref = useRef<BottomSheetGorhom>(null);
  useEffect(() => {
    ref.current?.expand();
  }, []);

  return (
    <>
      <GestureHandlerRootView
        style={{
          flex: 1,
        }}
      >
        <BottomSheetGorhom
          backgroundStyle={{
            backgroundColor,
          }}
          ref={ref}
          index={0}
          snapPoints={["10%", "50%"]}
          handleIndicatorStyle={{
            backgroundColor: indicatorColor,
            width: 60,
            height: 4.5,
          }}
          handleStyle={{
            backgroundColor,
          }}
        >
          <BottomSheetView
            style={[
              [
                styles.contentContainer,
                {
                  backgroundColor,
                },
              ],
            ]}
          >
            {children}
          </BottomSheetView>
        </BottomSheetGorhom>
      </GestureHandlerRootView>
    </>
  );
};

const styles = StyleSheet.create({
  contentContainer: { flex: 1 },
});
