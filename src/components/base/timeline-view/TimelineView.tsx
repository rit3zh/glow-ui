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
    <ScrollView
      contentContainerStyle={{ paddingVertical: 16, paddingHorizontal: 24 }}
    >
      <View className="relative">
        {/* Background line */}
        <View className="absolute left-6 top-0 bottom-0 w-[2px] bg-gray-200" />

        {events.map((event, idx) => {
          const isCompleted = completedMap[event.id];
          return (
            <View
              key={event?.id ?? idx.toString()}
              className="mb-8 flex-row items-start"
            >
              <Pressable
                onPress={() => handleToggle(event.id)}
                style={{ zIndex: 10 }}
              >
                <View
                  className={`w-4 h-4 rounded-full border-2`}
                  style={{
                    backgroundColor: isCompleted ? "#4CAF50" : "#fff",
                    borderColor: isCompleted ? "#4CAF50" : "#ccc",
                  }}
                />
              </Pressable>

              <View className="ml-4 flex-1">
                <Text className="text-sm text-gray-500 mb-1">{event.date}</Text>
                <Text className="text-lg font-medium text-gray-800">
                  {event?.title}
                </Text>
                {event?.description && (
                  <Text className="text-gray-600 mt-1">
                    {event.description}
                  </Text>
                )}
              </View>
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
};
