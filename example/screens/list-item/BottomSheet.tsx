import "./global.css";
import { ActionCard, Touchable, TouchableRipple } from "@/components/base";
import { SymbolView } from "expo-symbols";
import { act, Fragment } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { BottomSheet } from "@/components/molecules/BottomSheet";
import { walletActions } from "@/components/molecules/BottomSheet/constants";
import * as List from "@/components/molecules/List";
import { Center, Row } from "@/components/atoms";
4;
export function App<T>(
  props: T & {
    children?: React.ReactNode;
  }
) {
  const BACKGROUND_COLOR: string = `#1a1a1a`;
  const INDICATOR_COLOR: string = `#9e9e9e`;
  return (
    <View style={styles.container}>
      <BottomSheet
        backgroundColor={BACKGROUND_COLOR}
        indicatorColor={INDICATOR_COLOR}
      >
        <Center>
          <Row spacing={10}>
            <TouchableRipple
              rippleColor="rgba(255, 255, 255, 0.5)"
              radius={90}
              value={0.1}
              duration={500}
            >
              <ActionCard
                title="Transaction history"
                icon={() => (
                  <SymbolView
                    name="note.text"
                    size={30}
                    tintColor={"#949494"}
                  />
                )}
              />
            </TouchableRipple>
            <TouchableRipple
              rippleColor="rgba(255, 255, 255, 0.5)"
              radius={90}
              value={0.2}
              duration={500}
            >
              <ActionCard
                title="Subscriptions"
                icon={() => (
                  <SymbolView
                    name="circle.grid.2x2"
                    size={30}
                    tintColor={"#949494"}
                  />
                )}
              />
            </TouchableRipple>
          </Row>
        </Center>
        {walletActions.map((action, idx) => (
          <Fragment key={idx}>
            <Touchable>
              <List.ListItemWrapper>
                <List.ListItemLeadingIcon>
                  <SymbolView
                    name={action.overlayIcon!}
                    size={30}
                    tintColor={action.tint}
                  />
                </List.ListItemLeadingIcon>
                <List.ListItemTitleView>
                  <List.ListItemTitle destructive={action.descrutive}>
                    {action.title}
                  </List.ListItemTitle>
                  <List.ListItemSubTitle>
                    {action.description}
                  </List.ListItemSubTitle>
                </List.ListItemTitleView>
                <List.ListItemTrailingIcon>
                  <SymbolView
                    name="chevron.right"
                    size={13}
                    tintColor={action.tint}
                  />
                </List.ListItemTrailingIcon>
              </List.ListItemWrapper>
            </Touchable>
          </Fragment>
        ))}
      </BottomSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
