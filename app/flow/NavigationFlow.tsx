import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import { Home } from "../screens/Home";
import { Details } from "../screens/Details";
import { enableScreens } from "react-native-screens";

// Enable native screens for better performance
enableScreens(true);

const Stack = createNativeStackNavigator();

export function NavigationFlow() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen
          name="Home"
          component={Home as any}
          options={{
            animation: "fade_from_bottom",
            gestureEnabled: true,
            presentation: "fullScreenModal",
          }}
        />
        <Stack.Screen
          name="Details"
          component={Details as any}
          options={{
            animation: "fade_from_bottom",
            gestureEnabled: true,
            presentation: "fullScreenModal",
          }}
        />
        {/* <Stack.Screen name="Settings" component={SettingsScreen} /> */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
