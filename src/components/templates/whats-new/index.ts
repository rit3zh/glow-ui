import { WhatsNew as WhatsNewRoot } from "./WhatsNew";
import { WhatsNewContent } from "./children/WhatsNewContent";
import { WhatsNewTrigger } from "./children/WhatsNewTrigger";
import { WhatsNewTitle } from "./children/WhatsNewTitle";
import { WhatsNewWrapper } from "./children/WhatsNewWrapper";
import { WhatsNewItemContainer } from "./children/WhatsNewItemContainer";
import { WhatsNewButton } from "./children/WhatsNewButton";

export const WhatsNew = Object.assign(WhatsNewRoot, {
  Content: WhatsNewContent,
  Title: WhatsNewTitle,
  Trigger: WhatsNewTrigger,
  Wrapper: WhatsNewWrapper,
  ItemContainer: WhatsNewItemContainer,
  Button: WhatsNewButton,
});

export * from "./children/WhatsNewContent";
export * from "./children/WhatsNewTitle";
export * from "./children/WhatsNewItemContainer";
export * from "./children/WhatsNewButton";
export * from "./children/WhatsNewTrigger";
export * from "./children/WhatsNewWrapper";
