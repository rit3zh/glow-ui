import { View } from "react-native";
import "./global.css";
import { StyleSheet } from "react-native";
import {
  Card,
  CardFooter,
  CardSubtitle,
  CardTitle,
  CardWrapper,
} from "@/components/molecules/Card";
import { Center, Row } from "@/components/atoms";
import { Avatar } from "@/components/base";

export function App<T>(
  props: T & {
    children?: React.ReactNode;
  }
) {
  return (
    <View style={styles.container}>
      <Card
        useImage
        image="https://images.unsplash.com/photo-1544077960-604201fe74bc?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1651&q=80"
      >
        <Row spacing={0} style={{ margin: 10, marginLeft: 20 }}>
          <Center>
            <Avatar
              image={{
                uri: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=2564&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                name: "John Fra",
              }}
              size={50}
            />
          </Center>
          <CardWrapper>
            <CardTitle
              style={{
                fontSize: 25,
              }}
            >
              John Fra
            </CardTitle>
            <CardSubtitle style={{ marginTop: 5 }}>2 mins ago</CardSubtitle>
          </CardWrapper>
        </Row>

        <CardFooter style={{ bottom: 4 }}>
          <CardTitle>Description</CardTitle>
          <CardSubtitle
            style={{
              marginTop: 5,
            }}
          >
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam,
            voluptatibus.
          </CardSubtitle>
        </CardFooter>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
  },
});
