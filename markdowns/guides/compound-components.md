# Compound Components

How to build components with sub-components like `Accordion.Trigger`, `Dialog.Content`, etc.

Two patterns are used in this project. Choose based on complexity.

---

## Pattern A: Single-File Compound

Used by: **Accordion**, **Dialog**, **Dropdown**, **FlipCard**, **ScrollableSearch**, **ContextMenu**

All sub-components live in one `index.tsx`. The root component is a function with sub-components attached as static properties.

### File Structure

```
src/components/<category>/<component>/
├── index.tsx       # Root + all sub-components + static property attachment
├── types.ts        # Props for root and every sub-component
├── presets.ts      # (optional) Theme presets
└── const.ts        # (optional) Default values
```

### index.tsx Structure

**1. Create sub-components as local functions:**

```tsx
function AccordionItem({ children, value }: AccordionItemProps) { ... }
function AccordionTrigger({ children }: AccordionTriggerProps) { ... }
function AccordionContent({ children }: AccordionContentProps) { ... }
```

**2. Share state via React Context:**

```tsx
const AccordionContext = createContext<AccordionContextType | null>(null);

function useAccordionContext() {
  const ctx = useContext(AccordionContext);
  if (!ctx) throw new Error("Accordion components must be used within <Accordion>");
  return ctx;
}
```

Always throw a descriptive error so misuse is caught immediately.

**3. Build the root component:**

```tsx
const AccordionRoot: React.FC<AccordionProps> = ({ children, ... }) => {
  const [openItems, setOpenItems] = useState<string[]>([]);
  return (
    <AccordionContext.Provider value={{ openItems, toggleItem, theme }}>
      <View>{children}</View>
    </AccordionContext.Provider>
  );
};
```

**4. Attach sub-components with the `createCompoundComponent` helper:**

Use the `createCompoundComponent` util (`@/utils/create-compound-component`) instead of a raw `Object.assign`. It sets the component's `displayName` and attaches sub-components in a single, type-safe call:

```tsx
import { createCompoundComponent } from "@/utils/create-compound-component";

// createCompoundComponent(name, component, compound?)
export const Accordion = createCompoundComponent("Accordion", AccordionRoot, {
  Item: AccordionItem,
  Trigger: AccordionTrigger,
  Content: AccordionContent,
});
```

The `name` sets `displayName` (useful for React DevTools and error messages), and the returned component is typed as `T & TCompound` so `Accordion.Item` is fully typed. The third `compound` argument is optional — omit it for a component that only needs a `displayName`:

```tsx
const Separator = createCompoundComponent("Separator", ContextMenuSeparator);
```

Nesting works too — attach a compound sub-component built with the same helper:

```tsx
const Item = createCompoundComponent("Item", ContextMenuItem, {
  Icon: ContextMenuItemIcon,
  Label: createCompoundComponent("Label", ContextMenuItemLabel, {
    Subtitle: ContextMenuItemSubtitle,
  }),
});
```

This preserves the root component's identity and memo wrapper while giving every part a stable display name in one call. See [`context-menu`](../../src/components/molecules/context-menu/index.tsx) for a full example.

**5. Export individual sub-components alongside the compound:**

```tsx
export { AccordionItem, AccordionTrigger, AccordionContent };
```

### Usage

```tsx
<Accordion>
  <Accordion.Item value="1">
    <Accordion.Trigger>Section 1</Accordion.Trigger>
    <Accordion.Content>...</Accordion.Content>
  </Accordion.Item>
</Accordion>
```

---

## Pattern B: Children Folder

Used by: **ActionCard**, **Breadcrumbs**, **List**, **WhatsNew**

Sub-components live as separate files in a `children/` subfolder. No `.` property attachment — just independent named exports.

### File Structure

```
src/components/<category>/<component>/
├── index.tsx              # Root component
├── children/
│   ├── Trigger.tsx
│   ├── Content.tsx
│   ├── Item.tsx
│   └── Title.tsx
├── types.ts
└── const.ts
```

### Barrel Export

```ts
// index.ts
export { Accordion } from "./index";
export { AccordionItem } from "./children/Item";
export { AccordionTrigger } from "./children/Trigger";
export { AccordionContent } from "./children/Content";
```

Use descriptive names: `ListItemTitle`, `ActionCardSubtitle`, `BreadcrumbsSeparator`.

### When to Use Which

| | Pattern A (Single-File) | Pattern B (Children Folder) |
|---|---|---|
| **Context coupling** | Shared state via context | Loose coupling |
| **File count** | Single `index.tsx` | One file per sub-component |
| **Best for** | Tightly coupled parts that share state (accordion open/close, dialog visibility) | Loosely coupled visual parts (card sections, list rows) |
| **API style** | `Component.Sub` | `ComponentSub` (named export) |
