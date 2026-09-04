import { StyleSheet, View } from "react-native";
import { StatusBar } from "expo-status-bar";

import { EventTicketCard } from "@/components/pieces/event-ticket-card";
import { Showcase } from "~/showcase";

const PAPER_PALETTE = {
  surface: "#FAFAF9",
  ink: "#18181B",
  muted: "#A1A1AA",
  perforation: "#D4D4D8",
  bars: "#18181B",
};

export default function App() {
  return (
    <Showcase>
      <View style={styles.container}>
        <StatusBar style="light" />

        <EventTicketCard width={330} palette={PAPER_PALETTE} radius={22}>
          <EventTicketCard.Main style={styles.main}>
            <EventTicketCard.Eyebrow>Admit one</EventTicketCard.Eyebrow>
            <EventTicketCard.Title numberOfLines={2}>
              Reacticx Conf 2026
            </EventTicketCard.Title>
            <EventTicketCard.Holder>Ada Marlowe</EventTicketCard.Holder>

            <EventTicketCard.Details>
              <EventTicketCard.Detail label="Date" value="Mar 14" />
              <EventTicketCard.Detail label="Seat" value="A12" />
              <EventTicketCard.Detail label="Gate" value="03" />
            </EventTicketCard.Details>
          </EventTicketCard.Main>

          <EventTicketCard.Stub style={styles.stub}>
            <EventTicketCard.Barcode code="RCTX-0426" />
            <EventTicketCard.Code>RCTX-0426</EventTicketCard.Code>
          </EventTicketCard.Stub>
        </EventTicketCard>
      </View>
    </Showcase>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a0a0a",
    alignItems: "center",
    justifyContent: "center",
  },
  main: {
    paddingVertical: 24,
  },
  stub: {
    marginVertical: 16,
  },
});
