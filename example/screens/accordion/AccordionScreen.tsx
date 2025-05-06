import { Text, View } from "react-native";
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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/molecules/Accordian/index";
import { SymbolView } from "expo-symbols";

export function App<T>(
  props: T & {
    children?: React.ReactNode;
  }
) {
  const data = [
    {
      title: "Section 1",
      content:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla convallis lectus nec nisi cursus, a consectetur libero auctor.",
    },
    {
      title: "Section 2",
      content:
        "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Quisque sit amet est.",
    },
    {
      title: "Section 3",
      content:
        "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    },
  ];
  return (
    <View style={styles.container}>
      <Accordion>
        <AccordionItem>
          <AccordionTrigger>
            <Center>
              <Row spacing={0}>
                <Center>
                  <SymbolView
                    name="flame.fill"
                    size={20}
                    tintColor="#fff"
                    style={{ marginRight: 10 }}
                  />
                </Center>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "bold",
                    color: "#fff",
                  }}
                >
                  Why is React Native so popular?
                </Text>
              </Row>
            </Center>
          </AccordionTrigger>
          <AccordionContent>
            <Text className="text-white">
              Because it allows developers to build mobile apps using React,
              which is like a magic wand for web developers.
            </Text>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem>
          <AccordionTrigger>
            <Center>
              <Row spacing={0}>
                <Center>
                  <SymbolView
                    name="questionmark"
                    size={18}
                    tintColor="#fff"
                    style={{ marginRight: 10 }}
                  />
                </Center>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "bold",
                    color: "#fff",
                  }}
                >
                  Is Glow UI the best UI library for React Native?
                </Text>
              </Row>
            </Center>
          </AccordionTrigger>
          <AccordionContent>
            <Text className="text-white">
              Absolutely! It’s like the Swiss Army knife of UI libraries. You
              can do everything with it, from building buttons to creating
              complex animations. Plus, it’s open-source, so you can customize
              it to your heart’s content.
            </Text>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem>
          <AccordionTrigger>
            <Center>
              <Row spacing={0}>
                <Center>
                  <SymbolView
                    name="star.fill"
                    size={18}
                    tintColor="#fff"
                    style={{ marginRight: 10 }}
                  />
                </Center>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "bold",
                    color: "#fff",
                  }}
                >
                  Does Glow UI deserver a star on GitHub?
                </Text>
              </Row>
            </Center>
          </AccordionTrigger>
          <AccordionContent>
            <Text className="text-white">
              Of course! It’s like giving a high-five to the developers who
              worked hard on this project.
            </Text>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
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
