import React, { useState } from "react";
import { ScrollView, View, Text, Pressable } from "react-native";

export interface TimelineEvent {
  id: string;
  title: string;
  description?: string;
  date: string;
  completed?: boolean;
}

interface TimelineProps {
  events: TimelineEvent[];
  onEventToggle?: (id: string, completed: boolean) => void;
}

export const Timeline: React.FC<TimelineProps> = ({
  events,
  onEventToggle,
}) => {
  const [completedMap, setCompletedMap] = useState<Record<string, boolean>>(
    () =>
      events.reduce(
        (acc, event) => {
          acc[event.id] = !!event.completed;
          return acc;
        },
        {} as Record<string, boolean>
      )
  );

  const handleToggle = (id: string) => {
    setCompletedMap((prev) => {
      const updated = { ...prev, [id]: !prev[id] };
      onEventToggle?.(id, updated[id]);
      return updated;
    });
  };

  return (
    <View>
      {/* Background line */}
      {/* <View className="absolute left-6 top-0 bottom-0 w-[2px] bg-gray-200" /> */}

      {events.map((event, idx) => {
        const isCompleted = completedMap[event.id];
        return (
          <View className="m-5">
            <View
              style={{
                backgroundColor: "red",
                width: 20,
                height: 20,
              }}
            />
            <View
              style={{
                backgroundColor: "white",
                height: 2,
                flexDirection: "column",
              }}
            />
          </View>
        );
      })}
    </View>
  );
};
