import React from "react";
import { Feather } from "@expo/vector-icons";
import { FanMenu, FanItemDirection, FanPosition } from "@/components";
import { Showcase } from "~/showcase";

const ITEMS = [
  { value: "learning", label: "Learning", icon: "book-open" },
  { value: "document", label: "Document", icon: "file-text" },
  { value: "music", label: "Music", icon: "music" },
  { value: "video", label: "Video", icon: "film" },
  { value: "image", label: "Image", icon: "image" },
] as const;

export default function FanMenuScreen() {
  return (
    <Showcase>
      <FanMenu
        position={FanPosition.BottomCenter}
        itemDirection={FanItemDirection.Left}
        spread={5}
        style={{
          bottom: 400,
        }}
        stagger={25}
      >
        {ITEMS.map((item) => (
          <FanMenu.Item
            key={item.value}
            value={item.value}
            style={{
              paddingHorizontal: 12,
            }}
            onPress={(v) => alert(v + " Pressed")}
          >
            <FanMenu.Icon>
              <Feather name={item.icon} size={15} color="#1d1d1f" />
            </FanMenu.Icon>
            <FanMenu.Label>{item.label}</FanMenu.Label>
          </FanMenu.Item>
        ))}
      </FanMenu>
    </Showcase>
  );
}
