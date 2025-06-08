import { Stack, useRouter } from "expo-router";
import "../global.css";
import React from "react";
import SwiftUI, {
  Label,
  List,
  RootView,
  Color,
  HStack,
  Spacer,
  Image,
  VStack,
  Button,
  useSwiftUiEvent,
} from "swiftui-native";
import { COMPONENTS } from "./constants/const";

export default function Home<T>() {
  const router = useRouter();
  return (
    <React.Fragment>
      <Stack.Screen
        options={{
          title: "Glow UI",
        }}
      />
      <RootView>
        <List listStyle={"automatic"}>
          {COMPONENTS.map((component, index) => {
            useSwiftUiEvent(`button-press_${index}`, () =>
              router.push("/" + component.path),
            );

            return (
              <Button key={`button-press_${index}`}>
                <HStack>
                  <VStack horizontalAlignment="leading">
                    <Label
                      text={`${component.title}`}
                      systemIconName={component.icon}
                      foregroundColor="#fff"
                    />
                    {component.experimental ? (
                      <Label
                        paddingTop={20}
                        font="caption"
                        fontWeight="heavy"
                        text={`Experimental`}
                        systemIconName={"exclamationmark.circle"}
                        foregroundColor={Color.Yellow}
                      />
                    ) : null}
                  </VStack>
                  <Spacer />
                  <Image systemIconName="chevron.right" height={10} />
                </HStack>
              </Button>
            );
          })}
        </List>
      </RootView>
    </React.Fragment>
  );
}
