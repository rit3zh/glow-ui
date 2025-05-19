import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { DarkTheme, NavigationContainer } from "@react-navigation/native";
import { useEffect } from "react";
import { Home } from "../screens/Home";

const Stack = createNativeStackNavigator();

export function NavigationFlow<
  T extends {
    [key: string]: any;
  },
>(options?: T) {
  return (
    <NavigationContainer key={options?.name || options?.id} theme={DarkTheme}>
      <Stack.Navigator
        screenOptions={{
          headerShown: true,
        }}
      >
        <Stack.Screen name="Home" component={Home as any} options={{}} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
