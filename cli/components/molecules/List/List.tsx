import { Fragment, type ReactNode } from "react";
import { ListItemType } from "./List.types";
import { Text, View } from "react-native";

export const ListItem: React.FC<ListItemType> &
  React.FunctionComponent<ListItemType> = ({
  _name,
  leadingIcon,
  onPress,
  subtitle,
  title,
  trailingIcon,
  destructive,
}): JSX.Element & ReactNode => {
  return (
    <Fragment>
      <View className="p-3">
        <View className="flex-row items-center">
          {leadingIcon && leadingIcon()}
          <View className="flex-1 justify-center ml-4">
            <Text
              className={
                destructive
                  ? "text-red-500 font-medium text-lg"
                  : "text-white font-medium text-lg"
              }
            >
              {title}
            </Text>
            <Text className="text-gray-300 text-sm">{subtitle}</Text>
          </View>
          <View className="items-center justfy-center">
            {trailingIcon && trailingIcon()}
          </View>
        </View>
      </View>
    </Fragment>
  );
};
