import { createContext, useContext } from "react";

import type { IEventTicketCardContext, TTicketComponents } from "./types";

const EventTicketCardContext = createContext<IEventTicketCardContext | null>(
  null,
);

const useEventTicketCard = (
  component: TTicketComponents = "EventTicketCard.Main",
): IEventTicketCardContext => {
  const ctx = useContext<IEventTicketCardContext | null>(
    EventTicketCardContext,
  );
  if (!ctx) {
    throw new Error(`${component} must be rendered inside <EventTicketCard>.`);
  }
  return ctx;
};

export { EventTicketCardContext, useEventTicketCard };
