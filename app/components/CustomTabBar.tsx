import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  MediaList,
} from "@components/index";

interface IOptions {
  show?: boolean;
}

export function makeAccordion<T extends IOptions>(options: T) {
  return (
    <Accordion>
      <AccordionItem>
        <AccordionTrigger>Item 1</AccordionTrigger>
        <AccordionContent>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quod
          accusantium, ad perspiciatis, alias, quos mollitia cumque
          necessitatibus natus doloremque, dolorum iure voluptatibus.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
