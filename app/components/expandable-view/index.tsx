import { ExpandableView } from "@/components/micro-interactions/expandable-view";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import MapView from "react-native-maps";
import { SymbolView } from "expo-symbols";
import { Showcase } from "~/showcase";

const MAP_STYLE = [
  { elementType: "geometry", stylers: [{ color: "#f1f1f1" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#666666" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#ffffff" }] },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#d8d8d8" }],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#d0d0d0" }],
  },
  { featureType: "transit", stylers: [{ visibility: "off" }] },
];

export default function ExpandableViewScreen() {
  return (
    <Showcase>
      <View style={styles.container}>
        <ExpandableView.Root>
          <ExpandableView.Collapsed>
            <SymbolView name="mappin.and.ellipse" tintColor="#757575" />
            <Text style={styles.label}>View on Map</Text>
          </ExpandableView.Collapsed>
          <ExpandableView.Expanded>
            <MapView
              style={StyleSheet.absoluteFill}
              region={{
                latitude: 37.78825,
                longitude: -122.4324,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              }}
              customMapStyle={MAP_STYLE}
            />
            <ExpandableView.Close />
          </ExpandableView.Expanded>
        </ExpandableView.Root>
      </View>
    </Showcase>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
});
