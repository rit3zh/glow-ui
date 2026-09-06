import React from "react";
import { StyleSheet, View } from "react-native";

import { Alert } from "@/components";
import { Showcase } from "~/showcase";

export default function AlertScreen() {
  return (
    <Showcase>
      <View style={styles.stage}>
        <Alert.Root variant="default">
          <Alert.Icon />
          <Alert.Content>
            <Alert.Title>Heads up</Alert.Title>
            <Alert.Description>
              You can customize this alert to fit your needs.
            </Alert.Description>
          </Alert.Content>
        </Alert.Root>

        <Alert.Root variant="success">
          <Alert.Icon />
          <Alert.Content>
            <Alert.Title>Changes saved</Alert.Title>
            <Alert.Description>
              Your profile has been updated successfully.
            </Alert.Description>
          </Alert.Content>
        </Alert.Root>

        <Alert.Root variant="warning">
          <Alert.Icon />
          <Alert.Content>
            <Alert.Title>Storage almost full</Alert.Title>
            <Alert.Description>
              You are close to hitting your storage limit.
            </Alert.Description>
          </Alert.Content>
        </Alert.Root>

        <Alert.Root variant="destructive">
          <Alert.Icon />
          <Alert.Content>
            <Alert.Title>Something went wrong</Alert.Title>
            <Alert.Description>
              Your changes could not be saved. Please try again.
            </Alert.Description>
          </Alert.Content>
        </Alert.Root>
      </View>
    </Showcase>
  );
}

const styles = StyleSheet.create({
  stage: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    gap: 12,
  },
});
