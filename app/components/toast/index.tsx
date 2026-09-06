import { Fragment, useState } from "react";
import { Dimensions, StyleSheet, Button } from "react-native";
import { SymbolView } from "expo-symbols";

import { toast, Toaster } from "@/components";
import type { IToastSwipeAction, TToastPosition } from "@/components";
import { Showcase } from "~/showcase";
import { View } from "react-native";
const _width = Dimensions.get("window").width;
const SWIPE_ACTION: IToastSwipeAction = {
  label: "Delete",
  color: "#FF3B30",
  direction: "left" as const,
  icon: () => <SymbolView name="trash.fill" size={18} tintColor={"#fff"} />,
  commitOffset: _width * 0.8,
  onCommit: () => {},
};

export default function ToastScreen() {
  const [position, setPosition] = useState<TToastPosition>("top");

  const demos: { label: string; icon: string; onPress: () => void }[] = [
    {
      label: "Success",
      icon: "checkmark.circle.fill",
      onPress: () =>
        toast.success("Success", {
          description: "Your changes have been saved.",
        }),
    },
    {
      label: "Error",
      icon: "exclamationmark.triangle.fill",
      onPress: () =>
        toast.error("Connection lost", {
          description: "Something went wrong. Please try again.",
        }),
    },
    {
      label: "Info",
      icon: "info.circle.fill",
      onPress: () =>
        toast.info("New version available", {
          description: "Restart the app to update.",
        }),
    },
    {
      label: "Warning",
      icon: "exclamationmark.circle.fill",
      onPress: () =>
        toast.warning("Low storage", {
          description: "Less than 200 MB left on this device.",
        }),
    },
    {
      label: "Loading",
      icon: "circle.dotted",
      onPress: () => {
        const id = toast.loading("Syncing…", {
          description: "Fetching the latest changes.",
          duration: Infinity,
        });
        setTimeout(
          () =>
            toast.success("Synced", { id, description: "You're up to date." }),
          2200,
        );
      },
    },
    {
      label: "Plain",
      icon: "text.bubble.fill",
      onPress: () => toast("Copied to clipboard"),
    },
    {
      label: "With action",
      icon: "arrow.uturn.backward",
      onPress: () =>
        toast("Message archived", {
          description: "Swipe left to remove it for good.",
          duration: 8000,
          action: {
            label: "Undo",
            onPress: () => toast.success("Restored"),
          },
        }),
    },
    {
      label: "Promise",
      icon: "arrow.triangle.2.circlepath",
      onPress: () =>
        toast.promise(new Promise((resolve) => setTimeout(resolve, 2200)), {
          loading: "Uploading…",
          success: "Upload complete",
          error: "Upload failed",
          description: "3 files · 12.4 MB",
        }),
    },
    {
      label: "Stack of three",
      icon: "square.3.layers.3d",
      onPress: () => {
        toast.info("Deploy queued");
        setTimeout(() => toast.warning("Cache is stale"), 220);
        setTimeout(
          () =>
            toast.success("Deployed", { description: "Tap the stack to fan." }),
          440,
        );
      },
    },
    {
      label: "Not dismissible",
      icon: "hand.raised.fill",
      onPress: () =>
        toast.loading("Migrating database…", {
          duration: Infinity,
          dismissible: false,
        }),
    },
  ];

  const handleSuccess = () =>
    toast.success("Success", {
      description: "Your changes have been saved.",
    });
  const handleError = () =>
    toast.error("Connection lost", {
      description: "Something went wrong. Please try again.",
    });
  const handleInfo = () =>
    toast.info("New version available", {
      description: "Restart the app to update.",
    });
  const handleWarning = () =>
    toast.warning("Low storage", {
      description: "Less than 200 MB left on this device.",
    });
  return (
    <Fragment>
      <Showcase disableBackButton={true}>
        <View style={styles.stage}>
          <Button title="Success" onPress={handleSuccess} />
          <Button title="Error" onPress={handleError} />
          <Button title="Info" onPress={handleInfo} />
          <Button title="Warning" onPress={handleWarning} />
        </View>
        <Toaster
          position={position}
          swipeAction={SWIPE_ACTION}
          offset={30}
          theme="dark"
        />
      </Showcase>
    </Fragment>
  );
}

const styles = StyleSheet.create({
  stage: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
});
